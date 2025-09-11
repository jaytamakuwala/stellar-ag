import {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
  useContext,
} from "react";
import { AgGridReact } from "ag-grid-react";
import toast from "react-hot-toast";

import { getAipowerAlerts } from "../../../service/stellarApi";
import { getParentRowId, to12h, getRowStyle, to12hUpper } from "../../../utils/common";
import {
  AG_GRID_HEIGHTS,
  cellBase,
  COLORS,
  headerBase,
} from "../../../utils/constants";
import { StyleMainDiv } from "../../../style/containers/AnimatedTable";
import "../../../style/AgGrid.css";
import {
  reconcileByIndex,
  formatUS,
  nyWeekday,
  nyMinutesNow,
  prevTradingDate,
} from "../../../utils/agGridHelper";
import { UserContext } from "../../../context/UserContext";

export default function AiPowerData({
  searchTerm,
  animationState,
  formattedDateStr,
  setFormattedDateStr,
  hader,
  // rows,
  // setRows,
}) {
  const [rows, setRows] = useState([]);
  const { selectedDate,} = useContext(UserContext);

  // const fetchdata = useCallback(async () => {
  //   try {
  //     const primaryDate = selectedDate
  //       ? new Date(selectedDate)
  //       : new Date();
  //     const fallbackDate = prevTradingDate(primaryDate);

  //     const buildPayload = (d) => ({
  //       alertDate: formatUS(d),
  //       algo: "V1",
  //     });

  //     // Reflect date used in UI
  //     setFormattedDateStr(formatUS(primaryDate));

  //     const tryCall = async (payload) => {
  //       const res = await getAipowerAlerts(payload);
  //       if (!res?.ok)
  //         throw new Error(res?.error?.error || "Failed to fetch AiPower Data");
  //       return res;
  //     };

  //     let usedDate = primaryDate;
  //     let res = await tryCall(buildPayload(primaryDate));

  //     // If API returned ok but no rows, try previous trading day once
  //     if (!Array.isArray(res.data) || res.data.length === 0) {
  //       res = await tryCall(buildPayload(fallbackDate));
  //       usedDate = fallbackDate;
  //       setFormattedDateStr(formatUS(usedDate));
  //     }
  //     setRows((prev) =>
  //       reconcileByIndex(
  //         prev,
  //         res.data || [],
  //         (row, idx) => getParentRowId(row, idx),
  //         ["Tick"]
  //       )
  //     );
  //     // setRows(res.data || []);
  //   } catch (error) {
  //     console.error("[fetchdata] error:", error);
  //     toast.error(error.message || "Something went wrong");
  //   }
  // }, [selectedDate, setFormattedDateStr]);
  const fetchdata = useCallback(async () => {
    try {
      const primaryDate = selectedDate ? new Date(selectedDate) : new Date();

      const buildPayload = (selectedDate) => ({
        alertDate: formatUS(selectedDate),
        algo: "V1",
      });
      setFormattedDateStr(formatUS(primaryDate));

      const tryCall = async (buildPayload) => {
        const res = await getAipowerAlerts(buildPayload);
        if (!res?.ok) {
          throw new Error(res?.error?.error || "Failed to fetch AiPower Data");
        }
        return res;
      };

      let usedDate = primaryDate;
      let res = await tryCall(buildPayload(primaryDate));

      if (!Array.isArray(res.data) || res.data.length === 0) {
        // const fallbackDate = prevTradingDate(primaryDate);
        // res = await tryCall(buildPayload(fallbackDate));
        // usedDate = fallbackDate;
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
    } catch (error) {
      console.error("[fetchdata] error:", error);
      toast.error(error.message || "Something went wrong");
    }
  }, [selectedDate, setFormattedDateStr]);

  useEffect(() => {
    let intervalId;
    const run = () => fetchdata();

    if (selectedDate) {
      run();
    } else {
      const wd = nyWeekday(new Date());
      const nowMin = nyMinutesNow();
      const OPEN = 9 * 60 + 30;

      if (wd < 1 || wd > 5 || nowMin < OPEN) {
        run();
      } else {
        run();
        intervalId = setInterval(run, 5000);
      }
    }

    return () => intervalId && clearInterval(intervalId);
  }, [selectedDate, fetchdata]);

  const parentCols = useMemo(
    () => [
      {
        colId: "Time",
        field: "Time",
        headerName: "Time",
        flex: 1,
        minWidth: 60,
        cellStyle: {
          ...cellBase,
          color: COLORS.timeColor,
          fontWeight: "700",
        },
        valueFormatter: (p) => to12h(p.value),
        headerStyle: headerBase,
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
          return { ...cellBase, color: isCall ? COLORS.lime : COLORS.red };
        },
        headerStyle: headerBase,
      },
      {
        colId: "Trade",
        field: "Trade",
        headerName: "Trade",
        flex: 1,
        minWidth: 60,
        cellStyle: (params) => {
          const isCall = String(params.value).toUpperCase() === "LONG";
          return { ...cellBase, color: isCall ? COLORS.lime : COLORS.red };
        },
        headerStyle: headerBase,
      },
      {
        colId: "Spot",
        field: "Spot",
        headerName: "Spot",
        flex: 0.8,
        minWidth: 70,
        cellStyle: { ...cellBase },
        headerStyle: headerBase,
      },
      {
        colId: "Target",
        field: "Target",
        headerName: "Target",
        flex: 1,
        minWidth: 100,
        cellStyle: { ...cellBase },
        resizable: false,
        // valueFormatter: (params) => {
        //   if (!params.value) return "";
        //   return String(params.value).split("-")[0].trim();
        // },
        headerStyle: headerBase,
      },
    ],
    []
  );

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
    <div style={{ overflowX: "auto", width: "100%", marginBottom: "0px" }}>
      <div
        className="grid-title"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 10px",
          margin: "0 0 6px",
          color: "#fff",
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
          className="ag-theme-quartz header-center main-grid main-grid "
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
