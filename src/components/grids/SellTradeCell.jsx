import {
  currencyColorStyle,
  getFormatedDateStrForUSA,
  stripMoney,
  toDDMMYYYY,
  toLocalISOString,
} from "../../utils/common";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { AG_GRID_HEIGHTS, COLORS } from "../../utils/constants";
import { AgGridReact } from "ag-grid-react";
import { getOptionTradeDetails } from "../../service/stellarApi";
import { faIR } from "date-fns/locale";

function parseExecDateYMD(execDateStr) {
  if (!execDateStr) return null;
  const s = execDateStr.replaceAll("/", "-");
  const parts = s.split("-");
  if (parts.length !== 3) return null;

  const [a, b, c] = parts.map((x) => parseInt(x, 10));

  if (String(a).length === 4) {
    return { year: a, month: b, day: c };
  }
  return { year: c, month: a, day: b };
}

function parseClockToHM(timeRaw) {
  const s = String(timeRaw ?? "")
    .trim()
    .toUpperCase();
  const m = s.match(/(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?/);
  if (!m) return null;
  let hours = parseInt(m[1], 10);
  const minutes = parseInt(m[2], 10);
  const period = m[3] ?? "";
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return { hours, minutes };
}

export function SellTradesCell({
  parentRow,
  formattedDateStr,
  optionTradeData,
  setOptionTradeData,
}) {
  if (!parentRow) return <div style={{ width: "100%" }}></div>;

  const rowKey =
    parentRow.__id ?? `${parentRow.Tick ?? "tick"}-${parentRow.Time ?? "time"}`;
  const tick = parentRow.Tick ?? "";
  const data = optionTradeData[rowKey];
  const inFlightRef = useRef(new Set());

  useEffect(() => {
    let ignore = false;

    async function run() {
      if (!tick || !parentRow.Time) return;
      if (rowKey in optionTradeData) return;
      if (inFlightRef.current.has(rowKey)) return;

      const execDate = formattedDateStr || getFormatedDateStrForUSA(new Date());
      const ymd = parseExecDateYMD(execDate);
      const hm = parseClockToHM(parentRow.Time);

      if (!ymd || !hm) {
        if (!ignore) setOptionTradeData((prev) => ({ ...prev, [rowKey]: [] }));
        return;
      }

      try {
        inFlightRef.current.add(rowKey);

        const startTime = new Date(
          ymd.year,
          ymd.month - 1,
          ymd.day,
          hm.hours,
          hm.minutes
        );
        const endTime = new Date(startTime.getTime() + 10 * 60 * 1000);

        const query = {
          startTime: toLocalISOString(startTime),
          endTime: toLocalISOString(endTime),
          optionSymbol: tick,
          buyOrSell: "BUY",
        };

        const res = await getOptionTradeDetails(query);

        let rows =
          (Array.isArray(res) && res) ||
          (Array.isArray(res?.data) && res.data) ||
          (Array.isArray(res?.rows) && res.rows) ||
          (Array.isArray(res?.data?.rows) && res.data.rows) ||
          [];

        rows = rows
          .filter((x) => {
            const side = String(x?.BuyOrSell ?? x?.side ?? x?.orderSide ?? "")
              .trim()
              .toUpperCase();
            return side === "" || side === "BUY" || side === "B";
          })
          .map((x, i) => ({
            id: x.id ?? `${tick}-${x.Time ?? i}`,
            ...x,
          }));

        // if (!ignore) setOptionTradeData((prev) => ({ ...prev, [rowKey]: rows }));
        setOptionTradeData((prev) => {
          const prevArr = prev[rowKey];
          if (Array.isArray(prevArr) && prevArr.length === rows.length)
            return prev;
          return { ...prev, [rowKey]: rows };
        });
      } catch (e) {
        if (!ignore) setOptionTradeData((prev) => ({ ...prev, [rowKey]: [] }));
      } finally {
        inFlightRef.current.delete(rowKey);
      }
    }

    run();
    return () => {
      ignore = true;
    };
  }, [rowKey, tick, formattedDateStr, parentRow?.Time, setOptionTradeData]);


  const headerStyle = {
    backgroundColor: COLORS.dark3,
    color: COLORS.dimText,
    fontSize: 12,
    fontFamily: "Barlow",
    textAlign: "center",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const centerWhiteBase = {
    color: COLORS.white,
    textAlign: "center",
    fontFamily: "Barlow",
    fontSize: 12,
    fontWeight: 100,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };
  function to12hUpper(val) {
    if (val == null || val === "") return "";

    let d;

    if (val instanceof Date) {
      d = val;
    } else if (typeof val === "number") {
      // epoch seconds vs ms
      d = new Date(val < 1e12 ? val * 1000 : val);
    } else if (typeof val === "string") {
      const s = val.trim();

      // already has AM/PM → normalize
      const ap = /^(\d{1,2})(?::(\d{2}))?(?::(\d{2}))?\s*(am|pm)$/i.exec(s);
      if (ap) {
        const h = +ap[1] % 12 || 12;
        const m = String(ap[2] ?? "00").padStart(2, "0");
        const ampm = ap[4].toUpperCase();
        return `${h}:${m} ${ampm}`;
      }

      // 24h "HH:mm[:ss]"
      const hm = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(s);
      if (hm) {
        const H = +hm[1],
          M = +hm[2],
          S = +(hm[3] || 0);
        d = new Date();
        d.setHours(H, M, S, 0);
      } else {
        // ISO or other parsable date-time string
        const tryDate = new Date(s);
        if (!isNaN(tryDate)) d = tryDate;
        else return String(val);
      }
    }

    if (!d || isNaN(d)) return String(val);

    const H = d.getHours();
    const m = String(d.getMinutes()).padStart(2, "0");
    const ampm = H >= 12 ? "PM" : "AM";
    const h12 = H % 12 || 12;

    return `${h12}:${m} ${ampm}`;
  }
  const currencyCellStyle = (p) => {
    const v = stripMoney(p.value);
    const colorStyle = currencyColorStyle(v).color;
    return { ...centerWhiteBase, color: colorStyle };
  };
  const parsePct = (x) => {
    if (x == null) return NaN;
    if (typeof x === "number") return x;
    const m = String(x).match(/-?\d+(?:\.\d+)?/); // grabs 3 or 3.5 from "3.5%"
    return m ? parseFloat(m[0]) : NaN;
  };
  const tradeCols = useMemo(
    () => [
      {
        headerName: "Time",
        field: "Time",
        headerStyle,
        cellStyle: centerWhiteBase,
        width: 65,
        minWidth: 50,
        maxWidth: 70,
        resizable: false,
        valueFormatter: (pp) => to12hUpper(pp.value),
        headerClass: ["cm-header"],
      },
      {
        headerName: "Expiry",
        field: "Expiry",
        headerStyle,
        cellStyle: centerWhiteBase,
        valueFormatter: (pp) => toDDMMYYYY(pp.value),
        width: 95,
        minWidth: 80,
        maxWidth: 100,
        resizable: false,
        headerClass: ["cm-header"],
      },
      {
        headerName: "Trade",
        field: "Trade",
        headerStyle,
        cellStyle: (params) => {
          const isCall = String(params.value).toUpperCase() === "CALL";
          return {
            ...centerWhiteBase,
            color: isCall ? "#00ff59" : "#FF605D",
          };
        },
        width: 50,
        minWidth: 40,
        maxWidth: 60,
        resizable: false,
        headerClass: ["cm-header"],
      },
      {
        headerName: "Type",
        field: "Type",
        headerStyle,
        cellStyle: centerWhiteBase,
        width: 55,
        minWidth: 50,
        maxWidth: 60,
        resizable: false,
        headerClass: ["cm-header"],
      },
      {
        headerName: "Strike",
        field: "Strike",
        headerStyle,
        cellStyle: centerWhiteBase,
        width: 55,
        minWidth: 50,
        maxWidth: 60,
        resizable: false,
        headerClass: ["cm-header"],
      },
      {
        headerName: "Spot",
        field: "Spot",
        headerStyle,
        cellStyle: centerWhiteBase,
        width: 65,
        minWidth: 50,
        maxWidth: 80,
        resizable: false,
        headerClass: ["cm-header"],
      },
      {
        headerName: "TotalCost",
        field: "TotalCost",
        headerStyle,
        cellStyle: currencyCellStyle,
        width: 80,
        minWidth: 70,
        maxWidth: 100,
        resizable: false,
        headerClass: ["cm-header"],
      },
      {
        headerName: "SSD",
        field: "SSD",
        headerStyle,
        cellStyle: (p) => {
          const base = { ...centerWhiteBase };
          const v = parsePct(p.value); // handles "3%", " 3 %", 3, etc.
          return v > 3 ? { ...base, color: "rgb(14, 165, 233)" } : base;
        },
        width: 70,
        minWidth: 40,
        maxWidth: 80,
        resizable: false,
        headerClass: ["cm-header"],
      },
      {
        headerName: "Price",
        field: "Price",
        headerStyle,
        cellStyle: centerWhiteBase,
        width: 60,
        minWidth: 40,
        maxWidth: 80,
        resizable: false,
        headerClass: ["cm-header"],
      },
      {
        headerName: "DTE",
        field: "DTE",
        headerStyle,
        cellStyle: centerWhiteBase,
        width: 80,
        minWidth: 70,
        maxWidth: 100,
        resizable: false,
        headerClass: ["cm-header"],
      },
    ],
    [COLORS]
  );

  const getLevelThirdRowStyle = useCallback((params) => {
    const isEvenRow = params.node.rowIndex % 2 === 0;
    return {
      background: isEvenRow ? COLORS.dark4 : COLORS.dark3,
      color: COLORS.white,
      fontWeight: 100,
      fontSize: 12,
      fontFamily: "Barlow",
      transition: "opacity 0.3s ease-in-out",
    };
  }, []);

  return (
    <div className="ag-theme-quartz no-padding-grid" style={{ width: "%" }}>
      <AgGridReact
        className="third-grid no-padding-grid"
        rowData={Array.isArray(data) ? data : []}
        columnDefs={tradeCols}
        headerHeight={AG_GRID_HEIGHTS.HEADER_H_L3}
        suppressRowHoverHighlight
        rowHeight={AG_GRID_HEIGHTS.ROW_H_L3}
        defaultColDef={{
          resizable: true,
          wrapHeaderText: true,
          autoHeaderHeight: true,
        }}
        suppressCellFocus
        getRowId={(pp) =>
          pp?.data?.id ||
          `${pp?.data?.Tick ?? ""}-${pp?.data?.Time ?? ""}-${pp?.rowIndex ?? 0}`
        }
        getRowStyle={getLevelThirdRowStyle}
        domLayout="autoHeight"
        suppressHorizontalScroll
        // suppressVerticalScroll
        overlayNoRowsTemplate="<span style='padding:8px; color:#9aa3af;'>No trades in this window</span>"
        overlayLoadingTemplate="<span style='padding:8px; color:#9aa3af;'>Loading…</span>"
        style={{ width: "100%" }}
      />
    </div>
  );
}
