import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import toast from "react-hot-toast";

import { getAipowerAlerts } from "../../../service/stellarApi";
import { getParentRowId } from "../../../utils/common";
import { AG_GRID_HEIGHTS, COLORS } from "../../../utils/constants";
import { StyleMainDiv } from "../../../style/containers/AnimatedTable";
import "../../../style/AgGrid.css";
import { reconcileByIndex } from "../../../utils/agGridHelper";

const NY_TZ = "America/New_York";

function formatUS(d) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: NY_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);
  const y = parts.find((p) => p.type === "year").value;
  const m = parts.find((p) => p.type === "month").value;
  const d2 = parts.find((p) => p.type === "day").value;
  return `${y}/${m}/${d2}`;
}

function nyWeekday(d) {
  const name = new Intl.DateTimeFormat("en-US", {
    timeZone: NY_TZ,
    weekday: "short",
  }).format(d);
  const map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return map[name] ?? 0;
}

function nyMinutesNow() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: NY_TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const H = Number(parts.find((p) => p.type === "hour").value);
  const M = Number(parts.find((p) => p.type === "minute").value);
  return H * 60 + M;
}

function prevTradingDate(fromDate = new Date()) {
  const dt = new Date(fromDate);
  for (let i = 0; i < 7; i++) {
    dt.setUTCDate(dt.getUTCDate() - 1);
    const wd = nyWeekday(dt);
    if (wd >= 1 && wd <= 5) return dt;
  }
  return fromDate;
}

function sessionDateNow() {
  const now = new Date();
  const wd = nyWeekday(now);
  const OPEN = 9 * 60 + 30;

  if (wd === 0 || wd === 6) return prevTradingDate(now);
  if (nyMinutesNow() < OPEN) return prevTradingDate(now);
  return now;
}

export default function MiddleGrid({
  selectedDate,
  searchTerm,
  animationState,
  formattedDateStr,
  setFormattedDateStr,
}) {
  const [rows, setRows] = useState([]);

  const fetchdata = useCallback(async () => {
    try {
      const primaryDate = selectedDate
        ? new Date(selectedDate)
        : sessionDateNow();
      const fallbackDate = prevTradingDate(primaryDate);

      const buildPayload = (d) => ({
        alertDate: formatUS(d),
        algo: "V1",
      });

      // Reflect date used in UI
      setFormattedDateStr(formatUS(primaryDate));

      // Call API (with one fallback)
      const tryCall = async (payload) => {
        const res = await getAipowerAlerts(payload);
        if (!res?.ok)
          throw new Error(res?.error?.error || "Failed to fetch AiPower Data");
        return res;
      };

      let usedDate = primaryDate;
      let res = await tryCall(buildPayload(primaryDate));

      // If API returned ok but no rows, try previous trading day once
      if (!Array.isArray(res.data) || res.data.length === 0) {
        res = await tryCall(buildPayload(fallbackDate));
        usedDate = fallbackDate;
        setFormattedDateStr(formatUS(usedDate));
      }
      setRows((prev) =>
        reconcileByIndex(
          prev,
          res.data || [],
          (row, idx) => getParentRowId(row, idx),
          ["Tick"]
        )
      );
      // setRows(res.data || []);
    } catch (error) {
      console.error("[fetchdata] error:", error);
      toast.error(error.message || "Something went wrong");
    }
  }, [selectedDate, setFormattedDateStr]);

  useEffect(() => {
    let intervalId;
    const run = () => fetchdata();

    if (selectedDate) {
      // manual date -> one call only
      run();
    } else {
      const wd = nyWeekday(new Date());
      const nowMin = nyMinutesNow();
      const OPEN = 9 * 60 + 30;

      if (wd < 1 || wd > 5 || nowMin < OPEN) {
        // weekend OR before open -> one call only
        run();
      } else {
        // market open -> poll
        run();
        intervalId = setInterval(run, 5000);
      }
    }

    return () => intervalId && clearInterval(intervalId);
  }, [selectedDate, fetchdata]);

  const headerStyle = {
    color: "rgb(95,95,95)",
    background: "#333",
    fontSize: 12,
    fontFamily: "Barlow",
    fontWeight: 700,
    width: "100%",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };
  function to12h(val) {
    if (!val) return "";
    if (typeof val !== "string" || val.includes("T")) {
      const d = new Date(val);

      return isNaN(d)
        ? String(val)
        : d.toLocaleTimeString("en-IN", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });
    }
    const parts = val.split(":").map(Number);
    if (Number.isNaN(parts[0])) return val;
    const [H, M = 0, S = 0] = parts;
    const d = new Date();
    d.setHours(H, M, S, 0);
    return d.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  const parentCols = useMemo(
    () => [
      {
        colId: "Time",
        field: "Time",
        headerName: "Time",
        flex: 1,
        minWidth: 60,
        cellStyle: {
          color: "rgb(98,95,95)",
          fontWeight: 700,
          textAlign: "center",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
        valueFormatter: (p) => to12h(p.value),
        headerStyle,
      },
      {
        colId: "Tick",
        field: "Tick",
        headerName: "Tick",
        flex: 1,
        width: 90,
        minWidth: 68,
        cellStyle: (params) => {
          const isCall = String(params.data?.Trade).toUpperCase() === "LONG";
          return {
            textAlign: "center",
            color: isCall ? "#00ff59" : "#ff605d",
            fontWeight: "500px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          };
        },
        headerStyle,
      },
      {
        colId: "Trade",
        field: "Trade",
        headerName: "Trade",
        flex: 1,
        minWidth: 60,
        cellStyle: (params) => {
          const isCall = String(params.value).toUpperCase() === "LONG";
          return {
            color: isCall ? "#00ff59" : "#ff605d",
            textAlign: "center",
            fontFamily: "Barlow",
            fontSize: 12,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          };
        },
        headerStyle,
      },
      {
        colId: "Spot",
        field: "Spot",
        headerName: "Spot",
        flex: 0.8,
        minWidth: 70,
        cellStyle: {
          textAlign: "center",
          color: "#fff",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
        cellClass: ["whiteTdContent"],
        headerStyle,
      },
      {
        colId: "Target",
        field: "Target",
        headerName: "Target",
        flex: 1,
        minWidth: 50,
        cellStyle: {
          textAlign: "center",
          color: "#fff",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
        valueFormatter: (params) => {
          if (!params.value) return "";
          return String(params.value).split("-")[0].trim();
        },
        cellClass: ["whiteTdContent"],
        headerStyle,
      },
    ],
    []
  );

  const getRowStyle = useCallback((params) => {
    const isEvenRow = params.node.rowIndex % 2 === 0;
    const rowOverlay = isEvenRow ? COLORS.dark4 : COLORS.dark3;

    return {
      background: `${rowOverlay}`,
      color: "rgb(245, 245, 245)",
      transition: "opacity 0.3s ease-in-out",
      fontFamily: "Barlow",
      fontSize: 12,
    };
  }, []);

  const filteredResponseData = useMemo(() => {
    const q = (searchTerm || "").toLowerCase();
    return rows.filter((row) => (row?.Tick ?? "").toLowerCase().includes(q));
  }, [rows, searchTerm]);

  const displayRows = useMemo(() => {
    const out = [];
    filteredResponseData.forEach((r, i) => {
      out.push({ ...r });
    });
    return out;
  }, [filteredResponseData]);

  const getRowId = useCallback((params) => {
    const r = params.data || {};
    // Use a stable unique key for your data.
    // If your API has an Id, return it here instead.
    return r.__id ?? `${r.Tick ?? "?"}-${r.Time ?? "?"}-${r.Target ?? "?"}`;
  }, []);

  return (
    <div style={{ overflowX: "auto", width: "100%", marginBottom: "20px" }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          padding: 5,
          height: "100vh",
        }}
      >
        <AgGridReact
          className="ag-theme-quartz header-center main-grid"
          rowData={filteredResponseData}
          columnDefs={parentCols}
          immutableData={true}
          getRowId={getRowId}
          suppressRowHoverHighlight
          suppressCellFocus
          rowHeight={AG_GRID_HEIGHTS.ROW_H_L1}
          headerHeight={AG_GRID_HEIGHTS.HEADER_H_L1}
          getRowStyle={getRowStyle}
          suppressAnimationFrame={true}
          defaultColDef={{
            flex: 1,
            wrapHeaderText: true,
            autoHeaderHeight: true,
            headerClass: "cm-header",
          }}
          rowClassRules={{
            "ag-row-even": (p) => p.node.rowIndex % 2 === 0,
            "ag-row-odd": (p) => p.node.rowIndex % 2 !== 0,
          }}
        />
      </div>
    </div>
  );
}
