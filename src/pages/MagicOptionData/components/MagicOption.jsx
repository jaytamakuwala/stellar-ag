import { useEffect, useMemo, useState, useCallback, useContext } from "react";
import { AgGridReact } from "ag-grid-react";
import toast from "react-hot-toast";
import {
  toLocalISOString,
  getRowStyle,
  to12hUpper,
} from "../../../utils/common";
import { getMagicOptionData } from "../../../service/stellarApi";
import {
  AG_GRID_HEIGHTS,
  COLORS,
  cellBase,
  headerBase,
} from "../../../utils/constants";
import "../../../style/AgGrid.css";
import { formatUS } from "../../../utils/agGridHelper";
import { UserContext } from "../../../context/UserContext";

export default function MagicOption({
  selectedDate,
  searchTerm,
  setFormattedDateStr,
  Type,
  Containcolor,
}) {
  const [rows, setRows] = useState([]);
  const { loading, setLoading } = useContext(UserContext);
  const fetchdata = useCallback(async () => {
    setLoading(true);
    try {
      const primaryDate = selectedDate ? new Date(selectedDate) : new Date();
      setFormattedDateStr(formatUS(primaryDate));

      const startTime = new Date(
        primaryDate.getFullYear(),
        primaryDate.getMonth(),
        primaryDate.getDate()
      );

      const query = {
        tradeDate: toLocalISOString(startTime),
        side: Type,
      };

      const res = await getMagicOptionData(query);
      if (!res?.ok)
        throw new Error(res?.error?.error || "Failed to fetch product data");

      setRows(res.data || []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
      setLoading(false);
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
        minWidth: 100,
        valueFormatter: (p) => to12hUpper(p.value),
        flex: 1,
      },
      {
        headerName: "TimeBucket",
        field: "TimeBucket",
        headerStyle: headerBase,
        cellStyle: { ...cellBase, color: COLORS.timeColor, fontWeight: "700" },
        minWidth: 100,
        flex: 1,
      },
      {
        headerName: "Tick",
        field: "Tick",
        headerStyle: headerBase,
        minWidth: 70,
        flex: 1,
        cellStyle: { ...cellBase, color: Containcolor },
      },
      {
        headerName: "Type",
        field: "Type",
        headerStyle: headerBase,
        minWidth: 50,
        flex: 0.7,
        cellStyle: { ...cellBase, color: Containcolor },
      },
      {
        headerName: "Probability",
        field: "Probability",
        headerStyle: headerBase,
        minWidth: 75,
        flex: 1,
        cellStyle: { ...cellBase, color: Containcolor },
      },
      {
        headerName: "Anomaly(1-10)",
        field: "Anomaly(1-10)",
        headerStyle: headerBase,
        cellStyle: cellBase,
        minWidth: 100,
        flex: 1,
      },
      {
        headerName: "Score",
        field: "Score",
        headerStyle: headerBase,
        cellStyle: cellBase,
        minWidth: 50,
        flex: 1,
      },
      {
        headerName: "Orders",
        field: "Orders",
        headerStyle: headerBase,
        cellStyle: cellBase,
        minWidth: 60,
        flex: 1,
      },
      {
        headerName: "SSDScore",
        field: "SSDScore",
        headerStyle: headerBase,
        cellStyle: (P) => {
          const isCall = Number(P.value) >= 5;
          return {
            ...cellBase,
            color: isCall ? COLORS.cyan : COLORS.white,
          };
        },
        minWidth: 70,
        flex: 1,
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
          return params.value;
        },
      },
      {
        headerName: "AmtScore",
        field: "AmtScore",
        headerStyle: headerBase,
        cellStyle: (P) => {
          const isCall = Number(P.value) >= 20;
          return {
            ...cellBase,
            color: isCall ? COLORS.cyan : COLORS.white,
          };
        },
        minWidth: 80,
        flex: 1,
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
          return params.value;
        },
      },
      {
        headerName: "Clusters",
        field: "Clusters",
        headerStyle: headerBase,
        cellStyle: cellBase,
        minWidth: 70,
        flex: 1,
      },
      {
        headerName: "ClusterScore",
        field: "ClusterScore",
        headerStyle: headerBase,
        cellStyle: cellBase,
        minWidth: 90,
        flex: 1,
        resizable: false,
      },
    ],
    []
  );

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
