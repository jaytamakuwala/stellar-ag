import {
  currencyColorStyle,
  getFormatedDateStrForUSA,
  stripMoney,
  toDDMMYYYY,
  toLocalISOString,
  getParentRowId,
  to12hUpper,
  parsePct,
  DteColorStyle,
  formatNumberToCurrency,
} from "../../utils/common";
import { useCallback, useEffect, useMemo, useRef, useState, useLayoutEffect } from "react";
import {
  AG_GRID_HEIGHTS,
  cellBase,
  COLORS,
  headerBase,
} from "../../utils/constants";
import { AgGridReact } from "ag-grid-react";
import { getOptionTradeDetails } from "../../service/stellarApi";
import { reconcileByIndex } from "../../utils/agGridHelper";
import "../../style/AgGrid.css";
import { Height } from "@mui/icons-material";

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
  time,
  optionTradeData,
  setOptionTradeData,
  Containcolor,
  buyOrSell,
  optionType,
}) {
  const [summaryData, setSummaryData] = useState({});
  const summaryDataRef = useRef({}); // always fresh for renderers

  if (!parentRow) return <div style={{ width: "100%" }} />;

  const rowKey =
    parentRow.__id ??
    `${parentRow.Tick ?? "tick"}-${parentRow.Time ?? "time"}-${
      parentRow.TotalCost ?? "totalCost"
    }`;
  const tick = String(parentRow.Tick ?? "");
  const inFlightRef = useRef(new Set());

  const fetchdata = useCallback(async () => {
    if (!tick || !parentRow.Time) return;
    if (inFlightRef.current.has(rowKey)) return;

    const execDate = formattedDateStr || getFormatedDateStrForUSA(new Date());
    const ymd = parseExecDateYMD(execDate);
    const hm = parseClockToHM(parentRow.Time);
    if (!ymd || !hm) return;

    try {
      inFlightRef.current.add(rowKey);

      const startTime = new Date(
        ymd.year,
        ymd.month - 1,
        ymd.day,
        hm.hours,
        hm.minutes
      );
      const endTime = new Date(startTime.getTime() + 5 * 60 * 1000);

      const query = {
        startTime: toLocalISOString(startTime),
        endTime: toLocalISOString(endTime),
        optionSymbol: tick,
        optionType: optionType,
        buyOrSell: buyOrSell,
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
          id: x.id ?? `${tick}-${x.Time ?? i}-${x.TotalCost ?? i}`,
          ...x,
        }));

      const prevForKey = summaryDataRef.current[rowKey] ?? [];
      const updatedRows = reconcileByIndex(
        prevForKey,
        rows,
        (row, idx) => getParentRowId(row, idx),
        ["id"]
      );

      setSummaryData((prev) => {
        const prevArr = prev[rowKey];
        if (Array.isArray(prevArr) && prevArr.length === updatedRows.length) {
          return prev; // no change
        }
        return { ...prev, [rowKey]: updatedRows };
      });
    } catch (e) {
      setSummaryData((prev) => ({ ...prev, [rowKey]: [] }));
    } finally {
      inFlightRef.current.delete(rowKey);
    }
  }, [rowKey, tick, parentRow?.Time, formattedDateStr, time]);

  useEffect(() => {
    summaryDataRef.current = summaryData;
  }, [summaryData]);

  useLayoutEffect(() => {
    fetchdata();
  }, [fetchdata]);

  const currencyCellStyle = (p) => {
    const v = stripMoney(p.value);
    const colorStyle = currencyColorStyle(v).color;
    return { ...cellBase, color: colorStyle };
  };

  const tradeCols = useMemo(
    () => [
      {
        headerName: "Time",
        field: "Time",
        headerStyle: headerBase,
        cellStyle: { ...cellBase, color: COLORS.timeColor, fontWeight: "700" },
        flex: 0.8,
        minWidth: 60,
        resizable: false,
        valueFormatter: (pp) => to12hUpper(pp.value),
        headerClass: ["cm-header"],
      },
      {
        headerName: "Expiry",
        field: "Expiry",
        headerStyle: headerBase,
        cellStyle: cellBase,
        valueFormatter: (pp) => toDDMMYYYY(pp.value),
        flex: 1.5,
        minWidth: 90,
        resizable: false,
        headerClass: ["cm-header"],
      },
      {
        headerName: "Trade",
        field: "Trade",
        headerStyle: headerBase,
        cellStyle: (params) => {
          const isCall = String(params.value).toUpperCase() === "CALL";
          return { ...cellBase, color: isCall ? COLORS.lime : COLORS.red };
        },
        flex: 0.7,
        minWidth: 50,
        resizable: false,
        headerClass: ["cm-header"],
      },
      {
        headerName: "Type",
        field: "Type",
        headerStyle: headerBase,
        cellStyle: cellBase,
        flex: 1,
        minWidth: 60,
        resizable: false,
        headerClass: ["cm-header"],
      },
      {
        headerName: "Strike",
        field: "Strike",
        headerStyle: headerBase,
        cellStyle: cellBase,
        flex: 1,
        minWidth: 60,
        resizable: false,
        headerClass: ["cm-header"],
      },
      {
        headerName: "Spot",
        field: "Spot",
        headerStyle: headerBase,
        cellStyle: cellBase,
        flex: 1,
        minWidth: 65,
        resizable: false,
        headerClass: ["cm-header"],
      },
      {
        headerName: "TotalCost",
        field: "TotalCost",
        headerStyle: headerBase,
        cellStyle: currencyCellStyle,
        valueFormatter: (pp) => `$${pp.value}`,
        flex: 1,
        minWidth: 80,
        resizable: false,
        headerClass: ["cm-header"],
      },
      {
        headerName: "SSD",
        field: "SSD",
        headerStyle: headerBase,
        cellStyle: (p) => {
          const base = { ...cellBase };
          const v = parsePct(p.value);
          return v > 3 ? { ...base, color: COLORS.cyan } : base;
        },
        flex: 1,
        minWidth: 70,
        resizable: false,
        headerClass: ["cm-header"],
      },
      {
        headerName: "Price",
        field: "Price",
        headerStyle: headerBase,
        cellStyle: cellBase,
        flex: 1,
        minWidth: 60,
        resizable: false,
        headerClass: ["cm-header"],
      },
      {
        headerName: "DTE",
        field: "DTE",
        headerStyle: headerBase,
        cellStyle: (p) => DteColorStyle(p.value),
        flex: 0.6,
        minWidth: 45,
        resizable: false,
        headerClass: ["cm-header"],
      },
    ],
    []
  );

  const getLevelThirdRowStyle = useCallback((params) => {
    const isEvenRow = params.node.rowIndex % 2 === 0;
    return {
      background: isEvenRow ? COLORS.dark4 : COLORS.dark3,
      fontFamily: "Barlow",
      transition: "opacity 0.3s ease-in-out",
    };
  }, []);

  return (
    <div
      className="third-grid-wrap third-grid ag-theme-quartz"
      style={{ width: "100%", height: 200 , background: COLORS.dark4 }}
    >
      <AgGridReact
        className="ag-theme-quartz third-grid "
        rowData={summaryData[rowKey] ?? []}
        columnDefs={tradeCols}
        headerHeight={AG_GRID_HEIGHTS.HEADER_H_L3}
        rowHeight={AG_GRID_HEIGHTS.ROW_H_L3}
        defaultColDef={{
          resizable: true,
          wrapHeaderText: true,
          autoHeaderHeight: true,
        }}
        suppressRowHoverHighlight = {true}
        suppressColumnHoverHighlight={true}
        suppressCellFocus
        getRowId={(pp) =>
          pp?.data?.id ||
          `${pp?.data?.Tick ?? ""}-${pp?.data?.Time ?? ""}-${
            pp?.rowIndex ?? 0
          }-${pp?.data?.TotalCost ?? 0}`
        }
        getRowStyle={getLevelThirdRowStyle}
        domLayout="normal"
        overlayNoRowsTemplate="<span style='padding:8px; color:#9aa3af;'>No trades in this window</span>"
        overlayLoadingTemplate="<span style='padding:8px; color:#9aa3af;'>Loading…</span>"
      />
    </div>
  );
}
