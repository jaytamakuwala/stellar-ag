// MiddleGrid.jsx
import { useEffect, useMemo, useState, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import toast from "react-hot-toast";

import { getAipowerAlerts } from "../../../service/stellarApi";
import {
  formatNumberToCurrency,
  getFormatedDateStrForUSA,
} from "../../../utils/common";
import { AG_GRID_HEIGHTS, COLORS } from "../../../utils/constants";
import { StyleMainDiv } from "../../../style/containers/AnimatedTable";
import "../../../style/AgGrid.css";

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
      const dayStr = getFormatedDateStrForUSA(selectedDate || new Date());
      setFormattedDateStr(dayStr);

      const queryObj = {
        alertDate: `${dayStr}`,
        algo: "V1",
      };
      const res = await getAipowerAlerts(queryObj);

      if (!res?.ok) {
        throw new Error(
          res?.error?.error || "Failed to fetch AiPower Data data"
        );
      }
      setRows(res.data);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchdata();
  }, [selectedDate]);

  useEffect(() => {
    console.log(rows, animationState, "111");
  }, [rows]);

  const filteredResponseData = useMemo(() => {
    const q = (searchTerm || "").toLowerCase();
    return rows.filter((row) => (row?.Tick ?? "").toLowerCase().includes(q));
  }, [searchTerm]);

  const headerStyle = {
    color: "rgb(95,95,95)",
    background: "#333",
    fontSize: 12,
    fontFamily: "Barlow",
    fontWeight: 700,
    border: "none",
    width: "100%",
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
        cellStyle: {
          color: "rgb(98,95,95)",
          fontWeight: 700,
          textAlign: "center",
        },
        valueFormatter: (p) => to12h(p.value),

        headerStyle,
      },
      {
        colId: "Tick",
        field: "Tick",
        headerName: "Tick",
        flex: 1,
        cellStyle: { textAlign: "center", color: "#00ff59" },
        headerStyle,
      },
      {
        colId: "Trade",
        field: "Trade",
        headerName: "Trade",
        flex: 1,
        cellStyle: (params) => {
          const isCall = String(params.value).toUpperCase() === "LONG";
          return {
            color: isCall ? "#00ff59" : "red",
            textAlign: "center",
            fontFamily: "Barlow",
            fontSize: 12,
          };
        },
        headerStyle,
      },
      {
        colId: "Spot",
        field: "Spot",
        headerName: "Spot",
        flex: 0.8,
        cellStyle: { textAlign: "center", color: "#fff" },
        cellClass: ["whiteTdContent"],
        headerStyle,
      },
      {
        colId: "Target",
        field: "Target",
        headerName: "Target",
        flex: 1,
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
          rowData={rows}
          columnDefs={parentCols}
          suppressRowHoverHighlight
          defaultColDef={{
            flex: 1,
            sortable: false,
            resizable: true,
            filter: false,
            wrapHeaderText: true,
            autoHeaderHeight: true,
            headerClass: "cm-header",
          }}
          rowClassRules={{
            "ag-row-even": (params) => params.node.rowIndex % 2 === 0,
            "ag-row-odd": (params) => params.node.rowIndex % 2 !== 0,
          }}
          suppressCellFocus
          rowHeight={AG_GRID_HEIGHTS.ROW_H_L1}
          headerHeight={AG_GRID_HEIGHTS.HEADER_H_L1}
          getRowStyle={getRowStyle}
        />
      </div>
    </div>
  );
}
