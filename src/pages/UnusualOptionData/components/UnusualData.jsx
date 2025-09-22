import { useEffect, useMemo, useState, useCallback, useContext } from "react";
import { AgGridReact } from "ag-grid-react";
import toast from "react-hot-toast";
import { getUnusualOptionData } from "../../../service/stellarApi";
import {
  getFormatedDateStrForUSA,
  to12hUpper,
  formatNumberToCurrency,
  toDDMMYYYY,
  getRowStyle,
  currencyColorStyle,
  DteColorStyle,
} from "../../../utils/common";
import {
  AG_GRID_HEIGHTS,
  COLORS,
  headerBase,
  cellBase,
} from "../../../utils/constants";
import "../../../style/AgGrid.css";
import { UserContext } from "../../../context/UserContext"; 
export default function UnusualData({
  selectedDate,
  searchTerm,
  setFormattedDateStr,
  Type,
  Containcolor,
  hader,
}) {
  const [rows, setRows] = useState([]);
const {loading, setLoading} = useContext(UserContext)
  const fetchdata = useCallback(async () => {
    try {
      setLoading(true)
      const primaryDate = selectedDate ? new Date(selectedDate) : new Date();
      const dayStr = getFormatedDateStrForUSA(primaryDate);
      setFormattedDateStr(dayStr);

      const query = {
        tradeDate: dayStr,
        side: Type,
        SortBy: "Time",
      };

      const res = await getUnusualOptionData(query);
      if (!res?.ok)
        throw new Error(res?.error?.error || "Failed to fetch product data");

      setRows(res.data || []);
      setLoading(false)
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
      setLoading(false)
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
        headerName: "Expiry",
        field: "Expiry",
        headerStyle: headerBase,
        minWidth: 100,
        flex: 1,
        valueFormatter: (pp) => toDDMMYYYY(pp.value),
        cellStyle: { ...cellBase },
        headerClass: ["cm-header"],
      },
      {
        headerName: "Tick",
        field: "Tick",
        headerStyle: headerBase,
        minWidth: 70,
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
        cellStyle: (P) => {
          const isCall = Number(P.value) > 5;
          return {
            ...cellBase,
            color: isCall ? COLORS.cyan : COLORS.white,
          };
        },
        minWidth: 70,
        flex: 1,
        headerClass: ["cm-header"],
      },
      {
        headerName: "Premium",
        field: "Premium",
        headerStyle: headerBase,
        cellStyle: (P) => currencyColorStyle(P.value),
        minWidth: 70,
        flex: 1,

        valueFormatter: (pp) => formatNumberToCurrency(pp.value),
        headerClass: ["cm-header"],
      },
      {
        headerName: "Price",
        field: "Price",
        headerStyle: headerBase,
        cellStyle: cellBase,
        minWidth: 70,
        flex: 1,

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
        cellStyle: (P) => DteColorStyle(P.value),
        minWidth: 70,
        flex: 1,

        resizable: false,

        headerClass: ["cm-header"],
      },
    ],
    []
  );

  return (
    <div style={{ overflowX: "hidden", width: "100%", marginBottom: "0px" }}>
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
