import { useEffect, useMemo, useState, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import toast from "react-hot-toast";
import {
  toLocalISOString,
  toDDMMYYYY,
  stripMoney,
  currencyColorStyle,
} from "../../../utils/common";
import { getMagicOptionData } from "../../../service/stellarApi";
import { getFormatedDateStrForUSA } from "../../../utils/common";
import { AG_GRID_HEIGHTS, COLORS } from "../../../utils/constants";
import "../../../style/AgGrid.css";

export default function RightMagicOption({
  selectedDate,
  searchTerm,
  animationState,
  formattedDateStr,
  setFormattedDateStr,
}) {
  const [rows, setRows] = useState([]);

  const fetchdata = useCallback(async () => {
    try {
      const base = selectedDate ? new Date(selectedDate) : new Date();

      const dayStr = getFormatedDateStrForUSA(base);
      setFormattedDateStr(dayStr);

      const startTime = new Date(
        base.getFullYear(),
        base.getMonth(),
        base.getDate()
      );

      const query = {
        tradeDate: toLocalISOString(startTime),
        side: "Bear",
      };

      const res = await getMagicOptionData(query);
      if (!res?.ok)
        throw new Error(res?.error?.error || "Failed to fetch product data");

      setRows(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    }
  }, [selectedDate, setFormattedDateStr]);

  useEffect(() => {
    fetchdata();
  }, [selectedDate]);

  const filteredResponseData = useMemo(() => {
    const q = (searchTerm || "").trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) => (row?.Tick ?? "").toLowerCase().includes(q));
  }, [rows, searchTerm]);

  const cellBase = {
    color: COLORS.white,
    textAlign: "center",
    fontFamily: "Barlow",
    fontSize: 12,
    fontWeight: 100,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };
  const headerBase = {
    backgroundColor: COLORS.dark3,
    color: COLORS.dimText,
    fontSize: 12,
    fontFamily: "Barlow",
    textAlign: "center",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const tradeCols = useMemo(
    () => [
      {
        headerName: "TimeBucket",
        field: "TimeBucket",
        headerStyle: headerBase,
        cellStyle: cellBase,
        minWidth: 100,
        flex: 1,
        headerClass: ["cm-header"],
      },
      {
        headerName: "Tick",
        field: "Tick",
        headerStyle: headerBase,
        minWidth: 70,
        flex: 1,
        cellStyle: { ...cellBase, color: "#ff605d", fontWeight: "500px" },
        headerClass: ["cm-header"],
      },
      {
        headerName: "Type",
        field: "Type",
        headerStyle: headerBase,
        minWidth: 50,
        flex: 0.7,
        cellStyle: cellBase,
        headerClass: ["cm-header"],
      },
      {
        headerName: "Probability",
        field: "Probability",
        headerStyle: headerBase,
        minWidth: 75,
        flex: 1,
        cellStyle: { ...cellBase, color: "#ff605d", fontWeight: "500px" },
        headerClass: ["cm-header"],
      },
      {
        headerName: "Anomaly(1-10)",
        field: "Anomaly(1-10)",
        headerStyle: headerBase,
        cellStyle: cellBase,
        minWidth: 100,
        flex: 1,
        headerClass: ["cm-header"],
      },
      {
        headerName: "Score",
        field: "Score",
        headerStyle: headerBase,
        cellStyle: cellBase,
        minWidth: 50,
        flex: 1,
        headerClass: ["cm-header"],
      },
      {
        headerName: "Orders",
        field: "Orders",
        headerStyle: headerBase,
        cellStyle: cellBase,
        minWidth: 60,
        flex: 1,
        headerClass: ["cm-header"],
      },
      {
        headerName: "SSDScore",
        field: "SSDScore",
        headerStyle: headerBase,
        cellStyle: cellBase,
        minWidth: 70,
        flex: 1,
        headerClass: ["cm-header"],
      },
      {
        headerName: "SSDSurge",
        field: "SSDSurge",
        headerStyle: headerBase,
        cellStyle: cellBase,
        minWidth: 80,
        flex: 1,
        valueFormatter: (params) => {
          if (params.value == null) return "-";
          return params.value ;
        },
        headerClass: ["cm-header"],
      },
      {
        headerName: "AmtScore",
        field: "AmtScore",
        headerStyle: headerBase,
        cellStyle: cellBase,
        minWidth: 80,
        flex: 1,
        headerClass: ["cm-header"],
      },

      {
        headerName: "AmtSurge",
        field: "AmtSurge",
        headerStyle: headerBase,
        cellStyle: cellBase,
        minWidth: 70,
        flex: 1,
        valueFormatter: (params) => {
          if (params.value == null) return "-";
          return params.value ;
        },
        headerClass: ["cm-header"],
      },
      {
        headerName: "Clusters",
        field: "Clusters",
        headerStyle: headerBase,
        cellStyle: cellBase,
        minWidth: 70,
        flex: 1,
        headerClass: ["cm-header"],
      },
      {
        headerName: "ClusterScore",
        field: "ClusterScore",
        headerStyle: headerBase,
        cellStyle: cellBase,
        minWidth: 90,
        flex: 1,
        headerClass: ["cm-header", "no-resize"],
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
          rowData={filteredResponseData}
          columnDefs={tradeCols}
          suppressRowHoverHighlight
          enableBrowserTooltips={true}
          tooltipShowDelay={0}
          defaultColDef={{
            flex: 1,
            sortable: true,
            resizable: true,
            filter: false,
            wrapHeaderText: false,
            autoHeaderHeight: false,
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
