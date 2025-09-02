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
  };

  const centerWhite = {
    color: COLORS.white,
    textAlign: "center",
    fontFamily: "Barlow",
    fontSize: 12,
    fontWeight: 100,
    width: "100%",
  };

  const currencyCellStyle = (p) => {
    const v = stripMoney(p.value);
    const colorStyle = currencyColorStyle(v).color;
    return { ...centerWhite, color: colorStyle };
  };

  const tradeCols = useMemo(
    () => [
      {
        headerName: "Time",
        field: "Time",
        flex: 1,
        headerStyle,
        cellStyle: centerWhite,
        headerClass: ["cm-header"],
      },
      {
        headerName: "Expiry",
        field: "Expiry",
        flex: 1.8,
        headerStyle,
        cellStyle: centerWhite,
        valueFormatter: (pp) => toDDMMYYYY(pp.value),
        headerClass: ["cm-header"],
      },
      {
        headerName: "Trade",
        field: "Trade",
        flex: 1,
        headerStyle,
        cellStyle: centerWhite,
        cellStyle: (params) => {
          const isCall = String(params.value).toUpperCase() === "CALL";
          return {
            color: isCall ? "green" : "red",
            textAlign: "center",
            fontFamily: "Barlow",
            fontSize: 12,
          };
        },
        headerClass: ["cm-header"],
      },
      {
        headerName: "Side",
        field: "Type",
        flex: 1,
        headerStyle,
        cellStyle: centerWhite,

        headerClass: ["cm-header"],
      },
      {
        headerName: "Strike",
        field: "Strike",
        flex: 1.1,
        headerStyle,
        cellStyle: centerWhite,
        headerClass: ["cm-header"],
      },
      {
        headerName: "Spot",
        field: "Spot",
        flex: 1.4,
        headerStyle,
        cellStyle: centerWhite,
        headerClass: ["cm-header"],
      },
      {
        headerName: "TotalCost",
        field: "TotalCost",
        flex: 1.2,
        headerStyle,
        cellStyle: currencyCellStyle,
        headerClass: ["cm-header"],
      },
      {
        headerName: "SSD",
        field: "SSD",
        flex: 1.2,
        headerStyle,
        cellStyle: centerWhite,
        headerClass: ["cm-header"],
      },
      {
        headerName: "Price",
        field: "Price",
        flex: 1.0,
        headerStyle,
        cellStyle: centerWhite,
        headerClass: ["cm-header"],
      },
      {
        headerName: "DTE",
        field: "DTE",
        flex: 1.0,
        headerStyle,
        cellStyle: centerWhite,
        headerClass: ["cm-header", "no-resize"],
      },
    ],
    []
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
    <div className="ag-theme-quartz no-padding-grid" style={{ width: "100%" }}>
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
