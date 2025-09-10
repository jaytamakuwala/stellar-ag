import { useEffect, useMemo, useState, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import toast from "react-hot-toast";
import { toLocalISOString } from "../../../utils/common";
import { getUltraHighVolumeOptionData } from "../../../service/stellarApi";
import {
  getFormatedDateStrForUSA,
  to12hUpper,
  formatNumberToCurrency,
  toDDMMYYYY,
  getRowStyle,
  currencyColorStyle,
} from "../../../utils/common";
import {
  AG_GRID_HEIGHTS,
  COLORS,
  headerBase,
  cellBase,
} from "../../../utils/constants";
import "../../../style/AgGrid.css";

export default function UltraHighVolume({
  selectedDate,
  searchTerm,
  setFormattedDateStr,
  Type,
  Containcolor,
  field,
  hader,
}) {
  const [rows, setRows] = useState([]);

  const fetchdata = useCallback(async () => {
    try {
      const primaryDate = selectedDate ? new Date(selectedDate) : new Date();
      const dayStr = getFormatedDateStrForUSA(primaryDate);
      setFormattedDateStr(dayStr);
      const query = {
        tradeDate: dayStr,
        side: Type,
      };

      const res = await getUltraHighVolumeOptionData(query);
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

  const tradeCols = useMemo(
    () => [
      {
        headerName: "Time",
        field: "Time",
        headerStyle: headerBase,
        cellStyle: { ...cellBase, color: COLORS.timeColor, fontWeight: "700" },
        minWidth: 70,
        flex: 1,
        valueFormatter: (pp) => to12hUpper(pp.value),
        headerClass: ["cm-header"],
      },

      {
        headerName: "Tick",
        field: field,
        headerStyle: headerBase,
        minWidth: 100,
        flex: 0.7,
        cellStyle: { ...cellBase, color: Containcolor },
        headerClass: ["cm-header"],
      },
      {
        headerName: "Type",
        field: "Type",
        headerStyle: headerBase,
        minWidth: 60,
        flex: 1,
        cellStyle: { ...cellBase, color: Containcolor },
        headerClass: ["cm-header"],
      },
         {
        headerName: "Spot",
        field: "Spot",
        headerStyle: headerBase,
        cellStyle: cellBase,
        minWidth: 70,
        flex: 1,
      },
      {
        headerName: "O Premium",
        field: "OptionPremium",
        headerStyle: headerBase,
        minWidth: 100,
        flex: 1,
        valueFormatter: (pp) => formatNumberToCurrency(pp.value),
        cellStyle: (p) => currencyColorStyle(p.value),

        headerClass: ["cm-header"],
      },
      {
        headerName: "AvgPremium",
        field: "AvgPremium",
        headerStyle: headerBase,
        cellStyle: cellBase,
        minWidth: 100,
        flex: 1,
        valueFormatter: (pp) => formatNumberToCurrency(pp.value),
        headerClass: ["cm-header"],
      },
      {
        headerName: "OptionX",
        field: "OptionX",
        headerStyle: headerBase,
        cellStyle: (p) => {
          const raw = String(p.value ?? "").replace(/[$,x]/gi, "");
          const v = Number(raw);
          if (v > 25 ) return { ...cellBase, color: COLORS.cyan } 
          if (v == 20 ) return { ...cellBase, color: COLORS.yellow } 
          return { ...cellBase, };
        },
        minWidth: 70,
        flex: 1,
        headerClass: ["cm-header"],
      },
      {
        headerName: "Orders",
        field: "Orders",
        headerStyle: headerBase,
        cellStyle: cellBase,
        minWidth: 70,
        flex: 1,
        headerClass: ["cm-header"],
      },
      {
        headerName: "AvgOrders",
        field: "AvgOrders",
        headerStyle: headerBase,
        cellStyle: cellBase,
        minWidth: 80,
        flex: 1,
        headerClass: ["cm-header"],
      },
      {
        headerName: "S Premium",
        field: "SharePremium",
        headerStyle: headerBase,
        cellStyle: (p) => currencyColorStyle(p.value),
        valueFormatter: (p) => formatNumberToCurrency(p.value),
        minWidth: 100,
        flex: 1,
        headerClass: ["cm-header"],
      },

      {
        headerName: "AvgSharePremium",
        field: "AvgSharePremium",
        headerStyle: headerBase,
        cellStyle: cellBase,
        minWidth: 130,
        flex: 1,
        valueFormatter: (pp) => formatNumberToCurrency(pp.value),

        headerClass: ["cm-header"],
      },

      {
        headerName: "ShareX",
        field: "ShareX",
        headerStyle: headerBase,
        cellStyle: cellBase,
        minWidth: 70,
        flex: 1,
        headerClass: ["cm-header"],
      },
   
    ],
    []
  );

  return (
    <div style={{ overflowX: "auto", width: "100%", marginBottom: "20px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 10px",
          margin: "0 0 6px",
          color: "#fff",
          borderRadius: 6,
          fontSize: 20,
          fontWeight: 500,
          marginBottom: "0px",
          marginTop: "0px",
        }}
      >
        <span>{hader}</span>
      </div>
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
