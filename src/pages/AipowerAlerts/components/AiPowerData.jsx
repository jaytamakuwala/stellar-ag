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
import {
  getParentRowId,
  to12h,
  getRowStyle,
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
}) {
  const [rows, setRows] = useState([]);
  const { selectedDate, loading, setLoading } = useContext(UserContext);
  const isFirstLoadRef = useRef(true);

  const fetchdata = useCallback(
    async ({ showGIF = false } = {}) => {
      try {
        if (showGIF) setLoading(true);
        const primaryDate = selectedDate ? new Date(selectedDate) : new Date();

        const buildPayload = (selectedDate) => ({
          alertDate: formatUS(selectedDate),
          algo: "V1",
        });
        setFormattedDateStr(formatUS(primaryDate));

        const tryCall = async (buildPayload) => {
          const res = await getAipowerAlerts(buildPayload);
          if (!res?.ok) {
            throw new Error(
              res?.error?.error || "Failed to fetch AiPower Data"
            );
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
      } finally {
        if (showGIF) setLoading(false);
        isFirstLoadRef.current = false;
      }
    },
    [selectedDate, setFormattedDateStr]
  );

  useEffect(() => {
    let intervalId;

    const runInitial = () => fetchdata({ showGIF: true });
    const runSilent = () => fetchdata({ showGIF: false });
    if (selectedDate) {
      runInitial();
    } else {
      const wd = nyWeekday(new Date());
      const nowMin = nyMinutesNow();
      const OPEN = 9 * 60 + 30;

      if (wd < 1 || wd > 5 || nowMin < OPEN) {
        runInitial();
      } else {
        runInitial();
        intervalId = setInterval(runSilent, 5000);
      }
    }

    return () => intervalId && clearInterval(intervalId);
  }, [selectedDate]);

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
    return r.__id ?? `${r.Tick ?? "?"}-${r.Time ?? "?"}-${r.Target ?? "?"}`;
  }, []);

  return (
    <div style={{ width: "100%", marginBottom: "0px" }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          padding: 5,
          height: "70vh",
          overflow: "hidden",
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
          domLayout="normal"
        />
      </div>
    </div>
  );
}
