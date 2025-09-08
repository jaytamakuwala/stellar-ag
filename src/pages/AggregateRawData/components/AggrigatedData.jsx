import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  StyleModalFilter,
  StyleMainDiv,
} from "../../../style/containers/AnimatedTable";
import CloseIcon from "@mui/icons-material/Close";
import {
  getSummaryData,
  getSummaryDataMain,
} from "../../../service/stellarApi";
import toast from "react-hot-toast";
import {
  formatNumberToCurrency,
  getFormatedDateStrForUSA,
  getParentRowId,
  stableParentId,
  isSameDay,
  USATimeFormatter,
  currencyColorStyle,
  safeGetDefsCount,
} from "../../../utils/common";
import resetSettings from "../../../assets/Images/reset_settings.png";
import { AgGridReact } from "ag-grid-react";
import "../../../style/AgGrid.css";
import {
  AG_GRID_HEIGHTS,
  cellBase,
  COLORS,
  headerBase,
} from "../../../utils/constants";
import { DetailCell } from "../../../components/DetailCell";
import { SellTradesCell } from "../../../components/grids/SellTradeCell";
import {
  reconcileByIndex,
  formatUS,
  nyWeekday,
  nyMinutesNow,
  prevTradingDate,
  getSessionDate,
  buildPayloadUS,
} from "../../../utils/agGridHelper";

export default function FirstAnimatedTable({
  selectedDate,
  searchTerm = "",
  handleModalEvent,
  setDetailsofRow,
  animationState,
  formattedDateStr,
  setFormattedDateStr,
  selectedSummaryData,
  Type,
  Containcolor,
}) {
  // console.log("FirstAnimatedTable");
  const [responseData, setResponseData] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const summaryDataRef = useRef([]); // always fresh for renderers
  useEffect(() => {
    summaryDataRef.current = summaryData;
  }, [summaryData]);

  const [filterState, setFilterState] = useState(false);
  // const [optionTradeData, setOptionTradeData] = useState({});
  const [subExpandedByParent, setSubExpandedByParent] = useState({});
  const [detailHeights, setDetailHeights] = useState({});
  const [expandedRowId, setExpandedRowId] = useState(null);

  const formattedDateStrRef = useRef(formattedDateStr);
  //const optionTradeDataRef = useRef(optionTradeData);
  const subExpandedByParentRef = useRef(subExpandedByParent);
  const detailHeightsRef = useRef(detailHeights);
  const selectedSummaryDataRef = useRef(selectedSummaryData || []);

  // keep refs in sync
  useEffect(() => {
    formattedDateStrRef.current = formattedDateStr;
  }, [formattedDateStr]);
  // useEffect(() => {
  //   optionTradeDataRef.current = optionTradeData;
  // }, [optionTradeData]);
  useEffect(() => {
    subExpandedByParentRef.current = subExpandedByParent;
  }, [subExpandedByParent]);
  useEffect(() => {
    detailHeightsRef.current = detailHeights;
  }, [detailHeights]);
  useEffect(() => {
    selectedSummaryDataRef.current = selectedSummaryData || [];
  }, [selectedSummaryData]);
  const fetchdata = useCallback(async () => {
    try {
      // If user picked a date, respect it; else use session logic
      const primaryDate = selectedDate
        ? new Date(selectedDate)
        : getSessionDate();
      const fallbackDate = prevTradingDate(primaryDate);

      const primaryPayload = buildPayloadUS(primaryDate, Type);
      const fallbackPayload = buildPayloadUS(fallbackDate, Type);

      // reflect date used in UI (US string)
      setFormattedDateStr(formatUS(primaryDate));

      const callBoth = async (payload) => {
        const [main, sub] = await Promise.all([
          getSummaryDataMain(payload),
          getSummaryData(payload),
        ]);
        if (!main?.ok)
          throw new Error(main?.error?.error || "Main fetch failed");
        if (!sub?.ok)
          throw new Error(sub?.error?.error || "Summary fetch failed");
        return { main: main.data || [], sub: sub.data || [] };
      };

      let usedDate = primaryDate;
      let data;
      try {
        data = await callBoth(primaryPayload);
        if (!data.main.length && !data.sub.length) {
          throw new Error("No data for primary date");
        }
      } catch {
        data = await callBoth(fallbackPayload);
        usedDate = fallbackDate;
        setFormattedDateStr(formatUS(usedDate));
      }

      const incoming = data.main || [];
      const inComingSummary = data.sub || [];
      setResponseData((prev) =>
        reconcileByIndex(
          prev,
          incoming,
          (row, idx) => getParentRowId(row, idx),
          ["Tick"]
        )
      );
      setSummaryData(inComingSummary);
      console.log("setSummaryData");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    }
  }, [selectedDate, setFormattedDateStr]);

  // Poll only when the market is open (NY time); otherwise, fetch once
  useEffect(() => {
    let intervalId;
    const run = () => fetchdata();

    if (selectedDate) {
      // explicit date: single fetch
      run();
    } else {
      const wd = nyWeekday(new Date());
      const nowMin = nyMinutesNow();
      const OPEN = 9 * 60 + 30; // 09:30
      const CLOSE = 16 * 60 + 45; // 16:45 window end aligned with your payload

      if (wd < 1 || wd > 5) {
        // weekend: once (uses prev trading day)
        run();
      } else if (nowMin < OPEN || nowMin > CLOSE) {
        // off-hours: once (prev trading day before open, same day after close)
        run();
      } else {
        run();
        intervalId = setInterval(run, 5000);
        //     // market open: poll
      }
    }
    return () => intervalId && clearInterval(intervalId);
  }, [selectedDate, fetchdata]);

  /* ===========================
     Row filtering and expansion
     =========================== */
  const filteredResponseData = useMemo(() => {
    const q = (searchTerm || "").toLowerCase();
    return responseData.filter((row) =>
      (row?.Tick ?? "").toLowerCase().includes(q)
    );
  }, [responseData, searchTerm]);

  const displayRows = useMemo(() => {
    const out = [];
    filteredResponseData.forEach((r, i) => {
      const id = stableParentId(r);
      out.push({ ...r, __kind: "parent", __id: id });
      if (expandedRowId === id) {
        out.push({ __kind: "detail", __parent: r, __id: `detail-${id}` });
      }
    });
    return out;
  }, [filteredResponseData, expandedRowId]);

  const onTopRowClicked = useCallback((e) => {
    const row = e?.data;
    if (row?.__kind !== "parent") return;

    const id = row.__id;
    const detailKey = `detail-${id}`;
    setExpandedRowId((prev) => {
      if (prev === id) {
        setSubExpandedByParent((map) => {
          const next = { ...map };
          delete next[detailKey];
          return next;
        });
        return null;
      } else {
        setSubExpandedByParent({});
        return id;
      }
    });
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (expandedRowId && !e.target.closest(".ag-row")) {
        setExpandedRowId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [expandedRowId]);

  const handleFilerOptionClose = useCallback(() => setFilterState(false), []);

  /* ===========================
     Column defs (Parent) – stable
     =========================== */

  const analysisCellRenderer = useCallback(
    (params) => {
      const symbol = params?.data?.Tick ?? params?.data?.__parent?.Tick ?? "";
      const onClick = (e) => {
        e.stopPropagation();
        if (!symbol) {
          toast.error("No symbol found for this row");
          return;
        }
        setDetailsofRow(params.data);
        handleModalEvent(params.rowIndex, symbol);
      };
      return (
        <img
          src="analysis.svg"
          alt="action"
          style={{ cursor: "pointer" }}
          onClick={onClick}
        />
      );
    },
    [handleModalEvent, setDetailsofRow]
  );

  const baseParentCols = useMemo(
    () => [
      {
        colId: "Time",
        field: "Time",
        headerName: "Time",
        flex: 1,
        cellStyle: { ...cellBase, color: COLORS.timeColor, fontWeight: "700" },
      },
      {
        colId: "Tick",
        field: "Tick",
        headerName: "Tick",
        flex: 1,
        cellStyle: { ...cellBase, color: Containcolor },
        haderStyle: headerBase,
      },
      {
        colId: "Probability",
        field: "Probability",
        headerName: "Probability",
        flex: 1,
        cellStyle: { ...cellBase, color: Containcolor },
        haderStyle: headerBase,
      },
      {
        colId: "Orders",
        field: "Orders",
        headerName: "Orders",
        flex: 0.9,
        cellStyle: { ...cellBase },

        haderStyle: headerBase,
      },
      {
        colId: "Premium",
        field: "Premium",
        headerName: "Premium",
        flex: 1,
        haderStyle: headerBase,
        cellStyle: (p) => currencyColorStyle(p.value),
        valueFormatter: (p) => formatNumberToCurrency(p.value),
      },
      {
        colId: "Score",
        field: "Score",
        headerName: "Score",
        flex: 1,
        cellStyle: (p) => {
          const raw = String(p.value ?? "").replace(/[$,x]/gi, "");
          const v = Number(raw);

          return v > 10 ? { ...cellBase, color: COLORS.cyan } : { ...cellBase };
        },
        haderStyle: headerBase,
      },
      {
        colId: "Actions",
        headerName: "Analysis",
        flex: 1,
        haderStyle: headerBase,

        cellRenderer: analysisCellRenderer,
      },
    ],
    [analysisCellRenderer]
  );

  const parentColsOnly = useMemo(() => {
    const cols = baseParentCols.map((col, idx) => {
      const c = { ...col };
      if (idx === 0) {
        c.valueGetter = (p) =>
          p?.data?.__kind === "detail" ? null : p?.data?.[c.field];
        c.colSpan = (p) =>
          p?.data?.__kind !== "detail" ? 1 : safeGetDefsCount(p?.api);
        c.cellRenderer = (p) => {
          if (p?.data?.__kind !== "detail") return p?.value;

          const parent = p.data.__parent;
          const parentDetailId = p.data.__id;
          const symbol = parent?.Tick;

          // 2) read from refs (fresh every render)
          const curSummary = summaryDataRef.current || [];
          const tickSummaryData = curSummary.filter((d) => d?.Tick === symbol);

          const newSummaryData = reconcileByIndex(
            selectedSummaryDataRef.current || [],
            tickSummaryData,
            (row, idx) => getParentRowId(row, idx),
            ["Tick", "Time"]
          );

          const baseRows = (newSummaryData || [])
            .filter((d) => d?.Tick === symbol)
            .map((d) => ({
              ...d,
              __kind: "subParent",
              __id: `${d.Tick}-${d.Time}`,
            }));

          const expandedId =
            subExpandedByParentRef.current[parentDetailId] || null;
          const setExpandedId = (nextId) =>
            setSubExpandedByParent((prev) => ({
              ...prev,
              [parentDetailId]: nextId,
            }));

          const targetHeight =
            detailHeightsRef.current[parentDetailId] ??
            AG_GRID_HEIGHTS.DETAIL_DEFAULT_H;

          return (
            <DetailCell targetHeight={targetHeight}>
              <NestedGrid
                rows={baseRows}
                formattedDateStr={formattedDateStrRef.current}
                //optionTradeData={optionTradeDataRef.current}
                //setOptionTradeData={setOptionTradeData}
                expandedId={expandedId}
                setExpandedId={setExpandedId}
                parentWidthMap={{}} // keep if needed
                onHeightChange={(h) => {
                  const prevH = detailHeightsRef.current[parentDetailId];
                  if (prevH === h) return;
                  setDetailHeights((prev) => ({
                    ...prev,
                    [parentDetailId]: h,
                  }));
                  if (p?.node) {
                    p.node.setRowHeight(h);
                    p.api?.onRowHeightChanged();
                  }
                }}
              />
            </DetailCell>
          );
        };
      } else {
        c.valueGetter = (p) =>
          p?.data?.__kind === "detail" ? null : p?.data?.[c.field];
      }
      return c;
    });
    return cols;
  }, [baseParentCols]);
  /* ===========================
     Row styles (Parent)
     =========================== */
  const getRowStyle = useCallback(
    (params) => {
      const row = params?.data || {};
      if (row.__kind === "detail")
        return { background: COLORS.dark4, color: COLORS.dark0 };

      const prob = Number(String(row?.Probability ?? "").replace("%", "") || 0);
      const isDimmed =
        expandedRowId !== null &&
        row.__kind === "parent" &&
        expandedRowId !== row.__id;

      const isEvenRow = params.node.rowIndex % 2 === 0;
      const rowOverlay = isEvenRow ? COLORS.dark4 : COLORS.dark3;

      const gradient =
        prob >= 90
          ? "linear-gradient(rgba(178, 74, 242, 0) 0%, rgba(178, 74, 242, 0.5) 198.75%)"
          : prob >= 80
          ? "linear-gradient(rgba(60, 175, 200, 0) 0%, rgba(60, 175, 200, 0.5) 198.75%)"
          : "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%)";

      return {
        background: `${gradient},${rowOverlay}`,
        opacity: isDimmed ? 0.1 : 1,
        pointerEvents: isDimmed ? "none" : "auto",
        transition: "opacity 0.3s ease-in-out",
      };
    },
    [expandedRowId]
  );

  /* ===========================
     Resize nudge when modal opens
     =========================== */
  useEffect(() => {
    if (!animationState) return;
    const r1 = requestAnimationFrame(() =>
      window.dispatchEvent(new Event("resize"))
    );
    const t1 = setTimeout(() => window.dispatchEvent(new Event("resize")), 60);
    return () => {
      cancelAnimationFrame(r1);
      clearTimeout(t1);
    };
  }, [animationState]);

  /* ===========================
     Render
     =========================== */
  return (
    <StyleMainDiv>
      {!animationState ? (
        <div style={{ overflowX: "auto", width: "100%" }}>
          <div
            style={{
              position: "relative",
              height: "100vh",
              width: "100%",
              padding: 5,
            }}
          >
            <AgGridReact
              className="ag-theme-quartz header-center main-grid"
              rowData={displayRows}
              columnDefs={parentColsOnly}
              suppressRowHoverHighlight={true}
              defaultColDef={{
                flex: 1,
                sortable: true,
                resizable: true,
                wrapHeaderText: true,
                autoHeaderHeight: true,
                headerClass: "cm-header",
              }}
              rowClassRules={{
                "ag-row-even": (params) => params.node.rowIndex % 2 === 0,
                "ag-row-odd": (params) => params.node.rowIndex % 2 !== 0,
              }}
              suppressCellFocus
              getRowId={(p) => p?.data?.__id ?? stableParentId(p?.data ?? {})}
              onRowClicked={onTopRowClicked}
              rowHeight={AG_GRID_HEIGHTS.ROW_H_L1}
              headerHeight={AG_GRID_HEIGHTS.HEADER_H_L1}
              getRowStyle={getRowStyle}
              getRowHeight={(p) => {
                if (p?.data?.__kind === "detail") {
                  const id = p?.data?.__id;
                  return detailHeights[id] ?? AG_GRID_HEIGHTS.DETAIL_DEFAULT_H;
                }
                return AG_GRID_HEIGHTS.ROW_H_L1;
              }}
            />
          </div>
        </div>
      ) : null}

      {filterState ? (
        <StyleModalFilter>
          <div
            className="modal RightsideModal"
            style={{ width: filterState ? 520 : 0, display: "flex" }}
          >
            <div style={{ width: "100%" }}>
              <div className="DivCollection" style={{ display: "flex" }}>
                <div>
                  <h4>Filter</h4>
                </div>
                <div className="RightIcon">
                  <img
                    src={resetSettings}
                    alt="Reset Settings"
                    className="resetSettings"
                  />
                  <span
                    style={{
                      margin: "0 15px",
                      position: "relative",
                      top: -2,
                      color: "#959595",
                    }}
                  >
                    |
                  </span>
                  <button
                    type="button"
                    className="btn btn-link p-0"
                    style={{ color: COLORS.white, lineHeight: 0 }}
                    onClick={() => setFilterState(false)}
                  >
                    <CloseIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </StyleModalFilter>
      ) : null}
    </StyleMainDiv>
  );
}

/* ===========================
   Nested Grid (level 2)
   =========================== */
function NestedGrid({
  rows,
  formattedDateStr,
  optionTradeData,
  setOptionTradeData,
  expandedId,
  setExpandedId,
  parentWidthMap, // kept for parity
  onHeightChange,
}) {
  console.log("NestedGrid");
  const flatRows = useMemo(() => {
    const out = [];
    (rows || []).forEach((r) => {
      out.push(r);
      if (expandedId === r.__id) {
        out.push({
          __kind: "subDetail",
          __parent: r,
          __id: `subDetail-${r.__id}`,
        });
      }
    });
    return out;
  }, [rows, expandedId]);

  const onRowClick = useCallback(
    (e) => {
      const kind = e?.data?.__kind;
      if (kind !== "subParent") return;
      const id = e?.data?.__id;
      if (!id) return;
      const next = expandedId === id ? null : id;
      setExpandedId(next);
    },
    [expandedId, setExpandedId]
  );

  const getRowKeyFor = useCallback(
    (pr) => pr?.__id ?? `${pr?.Tick ?? "tick"}-${pr?.Time ?? "time"}`,
    []
  );

  const getThirdLevelHeightFor = useCallback(
    (parentRow) => {
      const key = getRowKeyFor(parentRow);
      const arr = optionTradeData?.[key];
      const len = Array.isArray(arr) ? arr.length + 1 : 5;
      return AG_GRID_HEIGHTS.HEADER_H_L3 + AG_GRID_HEIGHTS.ROW_H_L3 * len;
    },
    [optionTradeData, getRowKeyFor]
  );

  const nestedHeight = useMemo(() => {
    return (flatRows || []).reduce((sum, r) => {
      if (r?.__kind === "subDetail")
        return sum + getThirdLevelHeightFor(r.__parent);
      return sum + AG_GRID_HEIGHTS.ROW_H_L2;
    }, AG_GRID_HEIGHTS.HEADER_H_L2);
  }, [flatRows, getThirdLevelHeightFor]);

  useEffect(() => {
    onHeightChange?.(nestedHeight);
  }, [nestedHeight, onHeightChange]);

  const childCols = useMemo(() => {
    return [
      {
        colId: "Time",
        headerName: "Time",
        field: "Time",
        flex: 1,
        valueGetter: (p) =>
          p?.data?.__kind === "subParent" ? p?.data?.Time : null,
        colSpan: (p) => {
          if (p?.data?.__kind !== "subDetail") return 1;
          return safeGetDefsCount(p?.api);
        },
        cellRenderer: (p) => {
          if (p?.data?.__kind !== "subDetail") return p?.value;
          const r = p?.data?.__parent;
          if (!r) return null;
          return (
            <div onClick={(e) => e.stopPropagation()} style={{ width: "101%" }}>
              <SellTradesCell
                parentRow={r}
                formattedDateStr={formattedDateStr}
                time={new Date().getTime()}
                //optionTradeData={optionTradeData}
                //setOptionTradeData={setOptionTradeData}
              />
            </div>
          );
        },
        cellStyle: {
          ...cellBase,
          color: COLORS.timeColor,
        },
      },
      {
        colId: "Tick",
        field: "Tick",
        headerName: "Tick",
        flex: 1,
        cellStyle: { ...cellBase },
      },
      {
        colId: "Probability",
        field: "Probability",
        headerName: "Probability",
        flex: 1,
        cellStyle: cellBase,
      },
      {
        colId: "Orders",
        field: "Orders",
        headerName: "Orders",
        flex: 0.7,
        cellStyle: cellBase,
      },
      {
        colId: "Premium",
        field: "Premium",
        headerName: "Premium",
        flex: 1,

        cellStyle: (p) => currencyColorStyle(p.value),
        valueFormatter: (p) => formatNumberToCurrency(p.value),
      },
      {
        colId: "Score",
        field: "Score",
        headerName: "Score",
        flex: 1,
        cellStyle: { ...cellBase },
      },
      {
        colId: "__actionsSpacer",
        headerName: "Analysis",
        field: "__actionsSpacer",
        flex: 1,
        resizable: false,
        sortable: false,
        filter: false,
        valueGetter: () => "",
        haderStyle: headerBase,
      },
    ];
  }, [formattedDateStr]);

  const getChildRowHeight = useCallback(
    (p) =>
      p?.data?.__kind === "subDetail"
        ? getThirdLevelHeightFor(p?.data?.__parent)
        : AG_GRID_HEIGHTS.ROW_H_L2,
    [getThirdLevelHeightFor]
  );

  const getLevelTwoRowStyle = useCallback(
    (params) => {
      const row = params?.data || {};
      const baseEven =
        params.node.rowIndex % 2 === 0 ? COLORS.dark4 : COLORS.dark3;
      if (row.__kind === "subDetail")
        return { background: COLORS.dark4, color: COLORS.white };

      const isDim =
        typeof expandedId === "string" &&
        row.__kind === "subParent" &&
        row.__id !== expandedId;
      return {
        background: isDim ? COLORS.dark3 : baseEven,
        transition: "opacity 200ms ease, filter 200ms ease",
        opacity: isDim ? 0.35 : 1,
      };
    },
    [expandedId]
  );

  return (
    <AgGridReact
      className="nested-grid ag-theme-quartz no-padding-grid"
      rowData={flatRows}
      columnDefs={childCols}
      suppressRowHoverHighlight={true}
      headerHeight={AG_GRID_HEIGHTS.HEADER_H_L2}
      rowHeight={AG_GRID_HEIGHTS.ROW_H_L2}
      defaultColDef={{ resizable: true, sortable: false, filter: false }}
      suppressCellFocus
      onRowClicked={onRowClick}
      getRowId={(p) => p?.data?.__id ?? `row-${p?.rowIndex ?? 0}`}
      getRowHeight={getChildRowHeight}
      getRowStyle={getLevelTwoRowStyle}
      domLayout="autoHeight"
      suppressHorizontalScroll
      suppressVerticalScroll
      style={{ width: "100%", background: "#282828" }}
    />
  );
}
