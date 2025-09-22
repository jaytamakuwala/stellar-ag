import { useEffect, useMemo, useState, useCallback, useContext } from "react";
import { AgGridReact } from "ag-grid-react";
import toast from "react-hot-toast";
import {
  toLocalISOString,
  toDDMMYYYY,
  stripMoney,
  currencyColorStyle,
  parsePct,
  getRowStyle,
} from "../../../utils/common";
import { getOptionTradeDetails } from "../../../service/stellarApi";
import {
  formatNumberToCurrency,
  getFormatedDateStrForUSA,
  to12hUpper,
} from "../../../utils/common";
import {
  AG_GRID_HEIGHTS,
  cellBase,
  COLORS,
  headerBase,
} from "../../../utils/constants";
import { StyleMainDiv } from "../../../style/containers/AnimatedTable";
import "../../../style/AgGrid.css";
import { formatUS } from "../../../utils/agGridHelper";
import { UserContext } from "../../../context/UserContext";

export default function RawOption({
  selectedDate,
  searchTerm,
  animationState,
  formattedDateStr,
  setFormattedDateStr,
  Type,
  hader,
  Containcolor,
}) {
  const [rows, setRows] = useState([]);
const {loading, setLoading} = useContext(UserContext)
  const fetchdata = useCallback(async () => {
    try {
      setLoading(true)
      const primaryDate = selectedDate ? new Date(selectedDate) : new Date();
      setFormattedDateStr(formatUS(primaryDate));

      const startTime = new Date(
        primaryDate.getFullYear(),
        primaryDate.getMonth(),
        primaryDate.getDate(),
        9,
        0,
        0,
        0
      );
      const endTime = new Date(
        primaryDate.getFullYear(),
        primaryDate.getMonth(),
        primaryDate.getDate(),
        16,
        45,
        0,
        0
      );

      const query = {
        startTime: toLocalISOString(startTime),
        endTime: toLocalISOString(endTime),
        buyOrSell: "BS",
        optionType: Type,
        sortMode: "1",
      };

      const res = await getOptionTradeDetails(query);
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
        headerStyle: { ...headerBase },
        flex: 1,
        minWidth: 50,
        maxWidth: 80,
        cellStyle: { ...cellBase, color: COLORS.timeColor, fontWeight: "700" },
        valueFormatter: (p) => to12hUpper(p.value),
        tooltipValueGetter: (p) => to12hUpper(p.value),
        headerClass: ["cm-header"],
      },
      {
        headerName: "Expiry",
        field: "Expiry",
        headerStyle: headerBase,
        flex: 1,

        cellStyle: cellBase,
        valueFormatter: (pp) => toDDMMYYYY(pp.value),
        headerClass: ["cm-header"],
      },
      {
        headerName: "DTE",
        field: "DTE",
        headerStyle: headerBase,
        flex: 1,
        cellStyle: (params) => {
          const isCall = Number(params.value) <= 3;
          return {
            ...cellBase,
            color: isCall ? COLORS.orange : "",
          };
        },
        headerClass: ["cm-header"],
      },
      {
        headerName: "Tick",
        field: "Tick",
        headerStyle: headerBase,
        flex: 1,

        cellStyle: { ...cellBase, color: Containcolor },

        headerClass: ["cm-header"],
      },
      {
        headerName: "Trade",
        field: "Trade",
        headerStyle: headerBase,
        flex: 1,

        cellStyle: (params) => {
          const isCall = String(params.value).toUpperCase() === "CALL";
          return {
            ...cellBase,
            color: isCall ? COLORS.lime : COLORS.red,
          };
        },
        headerClass: ["cm-header"],
      },
      {
        headerName: "Type",
        field: "Type",
        headerStyle: headerBase,
        flex: 1,

        cellStyle: cellBase,

        headerClass: ["cm-header"],
      },
      {
        headerName: "Strike",
        field: "Strike",
        headerStyle: headerBase,
        cellStyle: cellBase,
        headerClass: ["cm-header"],
        flex: 1,
      },
      {
        headerName: "Spot",
        field: "Spot",
        headerStyle: headerBase,
        cellStyle: cellBase,
        headerClass: ["cm-header"],
        flex: 1,
      },
      {
        headerName: "SSD",
        field: "SSD",
        headerStyle: headerBase,
        cellStyle: (p) => {
          const v = parsePct(p.value);
          return v > 3 ? { ...cellBase, color: COLORS.cyan } : cellBase;
        },
        flex: 1,

        resizable: true,
        headerClass: ["cm-header"],
      },
      {
        headerName: "TotalCost",
        field: "TotalCost",
        headerStyle: headerBase,
        cellStyle: currencyCellStyle,
        valueFormatter: (pp) => formatNumberToCurrency(pp.value),
        headerClass: ["cm-header"],
        flex: 1,
      },

      {
        headerName: "Price",
        field: "Price",
        headerStyle: headerBase,
        cellStyle: cellBase,
        headerClass: ["cm-header", "no-resize"],
        flex: 1,
      },
    ],
    []
  );

  return (
    <div style={{ overflowX: "auto", width: "100%", marginBottom: "0px" }}>
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
          // rowHeight={AG_GRID_HEIGHTS.ROW_H_L1}
          // headerHeight={AG_GRID_HEIGHTS.HEADER_H_L1}
          getRowStyle={getRowStyle}
          rowHeight={28}
          headerHeight={30}
        />
      </div>
    </div>
  );
}
