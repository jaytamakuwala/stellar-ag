import { useEffect, useMemo, useState, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import toast from "react-hot-toast";
import {
  toLocalISOString,
} from "../../../utils/common";
import { getUnusualOptionData } from "../../../service/stellarApi";
import {
  getFormatedDateStrForUSA,
  to12hUpper,formatNumberToCurrency,toDDMMYYYY
} from "../../../utils/common";
import { AG_GRID_HEIGHTS, COLORS } from "../../../utils/constants";
import "../../../style/AgGrid.css";

export default function RightUnusualData({
  selectedDate,
  searchTerm,
  setFormattedDateStr,
}) {
  const [rows, setRows] = useState([]);

  const fetchdata = useCallback(async () => {
    try {
      const base = selectedDate ? new Date(selectedDate) : new Date();

      const dayStr = getFormatedDateStrForUSA(base);
      setFormattedDateStr(dayStr);

      const query = {
        tradeDate: dayStr,
        side: "Bull",
        SortBy: "Time"
      };

      const res = await getUnusualOptionData(query);
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
        headerName: "Time",
        field: "Time",
        headerStyle: headerBase,
        cellStyle: cellBase,
        minWidth: 70,
        flex: 1,
        valueFormatter: (pp)=> to12hUpper(pp.value),
        headerClass: ["cm-header"],
      },
      {
        headerName: "Expiry",
        field: "Expiry",
        headerStyle: headerBase,
        minWidth: 100,
        flex: 1,
        valueFormatter: (pp)=> toDDMMYYYY(pp.value),
        cellStyle: { ...cellBase, },
        headerClass: ["cm-header"],
      },
      {
        headerName: "Tick",
        field: "Tick",
        headerStyle: headerBase,
        minWidth: 70,
        flex: 0.7,
        cellStyle: {...cellBase, color: "#00ff59"},
        headerClass: ["cm-header"],
      },
      {
        headerName: "Type",
        field: "Type",
        headerStyle: headerBase,
        minWidth: 60,
        flex: 1,
        cellStyle: { ...cellBase, color: "#00ff59" },
        headerClass: ["cm-header"],
      },
      {
        headerName: "Strike",
        field: "Strike",
        headerStyle: headerBase,
        cellStyle: cellBase,
        minWidth: 70,
        flex: 1,
        headerClass: ["cm-header"],
      },
      {
        headerName: "Spot",
        field: "Spot",
        headerStyle: headerBase,
        cellStyle: cellBase,
        minWidth: 70,
        flex: 1,
        headerClass: ["cm-header"],
      },
      {
        headerName: "SSD",
        field: "SSD",
        headerStyle: headerBase,
        cellStyle: cellBase,
        minWidth: 70,
        flex: 1,
        headerClass: ["cm-header"],
      },
      {
        headerName: "Premium",
        field: "Premium",
        headerStyle: headerBase,
        cellStyle: cellBase,
        minWidth: 70,
        flex: 1,
        valueFormatter: (pp)=> formatNumberToCurrency(pp.value),
        headerClass: ["cm-header"],
      },
      {
        headerName: "Price",
        field: "Price",
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
        headerName: "Size",
        field: "Size",
        headerStyle: headerBase,
        cellStyle: cellBase,
        minWidth: 70,
        flex: 1,
        headerClass: ["cm-header"],
      },

      {
        headerName: "DTE",
        field: "DTE",
        headerStyle: headerBase,
        cellStyle: cellBase,
        minWidth: 70,
        flex: 1,
        valueFormatter: (params) => {
          if (params.value == null) return "-";
          return params.value ;
        },
        resizable: false,

        headerClass: ["cm-header"],
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
            // wrapHeaderText: true,
            // autoHeaderHeight: true,
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
