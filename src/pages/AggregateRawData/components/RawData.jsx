import { useState, useEffect, useMemo, useCallback } from "react";
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
  isSameDay,
  safeGetDefsCount,
} from "../../../utils/common";
import resetSettings from "../../../assets/Images/reset_settings.png";
import { AgGridReact } from "ag-grid-react";
import "../../../style/AgGrid.css";
import { AG_GRID_HEIGHTS, COLORS } from "../../../utils/constants";
import { DetailCell } from "../../../components/DetailCell";
import { SellTradesCell } from "../../../components/grids/SellTradeCell";
import { reconcileByIndex } from "../../../utils/agGridHelper";

const NY_TZ = "America/New_York";

function formatUS(d) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: NY_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);
  const y = parts.find((p) => p.type === "year").value;
  const m = parts.find((p) => p.type === "month").value;
  const dd = parts.find((p) => p.type === "day").value;
  return `${y}/${m}/${dd}`;
}

function nyWeekday(d) {
  const name = new Intl.DateTimeFormat("en-US", {
    timeZone: NY_TZ,
    weekday: "short",
  }).format(d);
  const map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return map[name] ?? 0;
}

function nyMinutesNow() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: NY_TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const H = Number(parts.find((p) => p.type === "hour").value);
  const M = Number(parts.find((p) => p.type === "minute").value);
  return H * 60 + M;
}

function prevTradingDate(fromDate = new Date()) {
  const dt = new Date(fromDate);
  for (let i = 0; i < 7; i++) {
    dt.setUTCDate(dt.getUTCDate() - 1);
    const wd = nyWeekday(dt);
    if (wd >= 1 && wd <= 5) return dt;
  }
  return fromDate;
}

function getSessionDate() {
  const now = new Date();
  const wd = nyWeekday(now);
  const OPEN = 9 * 60 + 30;

  if (wd === 0 || wd === 6) return prevTradingDate(now);
  if (nyMinutesNow() < OPEN) return prevTradingDate(now);
  return now;
}
function buildPayloadUS(d, type = "Bear") {
  const us = formatUS(d);
  return {
    executionDate: `${us}T00:00:00`,
    intervalStart: `${us}T09:00:00`,
    intervalEnd: `${us}T16:45:00`,
    minsWindows: 5,
    type,
  };
}
export default function SecondAnimatedTable({
  selectedDate,
  searchTerm = "",
  handleModalEvent,
  setDetailsofRow,
  animationState,
  formattedDateStr,
  setFormattedDateStr,
}) {
  const [responseData, setResponseData] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [filterState, setFilterState] = useState(false);
  const [optionTradeData, setOptionTradeData] = useState({});
  const [subExpandedByParent, setSubExpandedByParent] = useState({});
  const [detailHeights, setDetailHeights] = useState({});

  // const fetchdata = useCallback(async () => {
  //   try {
  //     const dayStr = getFormatedDateStrForUSA(selectedDate || new Date());
  //     setFormattedDateStr(dayStr);

  //     const queryObj = {
  //       executionDate: `${dayStr}T00:00:00`,
  //       intervalStart: `${dayStr}T09:00:00`,
  //       intervalEnd: `${dayStr}T16:45:00`,
  //       minsWindows: 5,
  //       type: "Bear",
  //     };

  //     const [summaryMainRes, summaryRes] = await Promise.all([
  //       getSummaryDataMain(queryObj),
  //       getSummaryData(queryObj),
  //     ]);

  //     if (!summaryMainRes?.ok) {
  //       throw new Error(
  //         summaryMainRes?.error?.error || "Failed to fetch summary main data"
  //       );
  //     }
  //     if (!summaryRes?.ok) {
  //       throw new Error(
  //         summaryRes?.error?.error || "Failed to fetch summary data"
  //       );
  //     }

  //     setResponseData(summaryMainRes.data || []);
  //     setSummaryData(summaryRes.data || []);
  //   } catch (error) {
  //     console.error(error);
  //     toast.error(error.message || "Something went wrong");
  //   }
  // }, [selectedDate]);
  const fetchdata = useCallback(async () => {
    try {
      // If user picked a date, respect it; else use session logic
      const primaryDate = selectedDate
        ? new Date(selectedDate)
        : getSessionDate();
      const fallbackDate = prevTradingDate(primaryDate);

      // choose payload format here:
      const primaryPayload = buildPayloadUS(primaryDate, "Bear");
      const fallbackPayload = buildPayloadUS(fallbackDate, "Bear");

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

      // try primary
      let usedDate = primaryDate;
      let data;
      try {
        data = await callBoth(primaryPayload);
        if (!data.main.length && !data.sub.length)
          throw new Error("No data for primary date");
      } catch (e) {
        // fallback to previous trading day
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
      setSummaryData((prev) =>
        reconcileByIndex(
          prev,
          inComingSummary,
          (row, idx) => getParentRowId(row, idx),
          ["Tick", 'Time']
        )
      );
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    }
  }, [selectedDate, setFormattedDateStr]);
  // useEffect(() => {
  //   let intervalId;
  //   const run = async () => {
  //     await fetchdata();
  //   };

  //   if (isSameDay(selectedDate, new Date())) {
  //     run();
  //     intervalId = setInterval(run, 5000);
  //   } else {
  //     run();
  //   }
  //   return () => {
  //     if (intervalId) clearInterval(intervalId);
  //   };
  // }, [selectedDate, fetchdata]);
  useEffect(() => {
    let intervalId;
    const run = () => fetchdata();

    const wd = nyWeekday(new Date()); // weekday in NY
    const nowMin = nyMinutesNow(); // minutes in NY
    const OPEN = 9 * 60 + 30; // 09:30

    if (selectedDate) {
      // If user picked a date manually -> just fetch once
      run();
    } else {
      if (wd < 1 || wd > 5) {
        // Weekend: fetch once (prev Friday), no interval
        run();
      } else if (nowMin < OPEN) {
        // Weekday but market not open yet: fetch once (prev day), no interval
        run();
      } else {
        // Market is open: fetch and poll every 5s
        run();
        intervalId = setInterval(run, 5000);
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

  const [expandedRowId, setExpandedRowId] = useState(null);

  const displayRows = useMemo(() => {
    const out = [];
    filteredResponseData.forEach((r, i) => {
      const id = getParentRowId(r, i);
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
     Column defs (Parent)
     =========================== */

  const headerStyle = {
    color: "rgb(95,95,95)",
    background: "#333",
    fontSize: 12,
    fontFamily: "Barlow",
    fontWeight: 700,
    border: "none",
    width: "100%",
  };
  const analysisCellRenderer = useCallback(
    (params) => {
      const symbol = params?.data?.Tick ?? params?.data?.__parent?.Tick ?? "";
      const onClick = (e) => {
        e.stopPropagation();
        if (!symbol) {
          toast.error("No symbol found for this row");
          return;
        }
        // This will now be fresh every time:
        console.log({ formattedDateStr });
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
    [formattedDateStr, handleModalEvent, setDetailsofRow]
  );
  const baseParentCols = useMemo(
    () => [
      {
        colId: "Time",
        field: "Time",
        headerName: "Time",
        flex: 1,
        minWidth: 60,
        cellStyle: {
          color: "rgb(98, 95, 95)",
          fontWeight: "700",
          textAlign: "center",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
        headerStyle,
      },
      {
        colId: "Tick",
        field: "Tick",
        headerName: "Tick",
        flex: 1,
        minWidth: 60,
        cellStyle: {
          color: "#ff605d",
          textAlign: "center",
          fontWeight: "500Px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
        headerStyle,
      },
      {
        colId: "Probability",
        field: "Probability",
        headerName: "Probability",
        flex: 1,
        minWidth: 40,
        cellStyle: {
          color: "#ff605d",
          textAlign: "center",
          fontWeight: "500px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
        headerStyle,
      },
      {
        colId: "Orders",
        field: "Orders",
        headerName: "Orders",
        flex: 0.8,
        minWidth: 70,
        cellStyle: {
          textAlign: "center",
          color: "#fff",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
        cellClass: ["whiteTdContent"],
        headerStyle,
      },
      {
        colId: "Premium",
        field: "Premium",
        headerName: "Premium",
        flex: 1,
        minWidth: 60,
        cellStyle: (p) => {
          const v = Number(String(p.value ?? "").replace(/[$,]/g, ""));
          if (v > 1000000)
            return {
              color: "#ff605d",
              textAlign: "center",
              fontWeight: "500px",
            };
          if (v > 500000)
            return {
              color: "#d6d454",
              textAlign: "center",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            };
          return {
            color: "white",
            textAlign: "center",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          };
        },
        valueFormatter: (p) => formatNumberToCurrency(p.value),
        headerStyle,
      },
      {
        colId: "Score",
        field: "Score",
        headerName: "Score",
        flex: 1,
        minWidth: 60,
        cellStyle: (p) => {
          const raw = String(p.value ?? "").replace(/[$,x]/gi, "");
          const v = Number(raw);

          const base = {
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          };

          if (v > 10) {
            return { ...base, color: "#0000ff" };
          }
          return { ...base, color: "white" };
        },
        headerStyle,
      },

      {
        colId: "Actions",
        headerName: "Analysis",
        flex: 1,
        minWidth: 60,
        headerStyle,
        cellRenderer: (params) => {
          const symbol =
            params?.data?.Tick ?? params?.data?.__parent?.Tick ?? "";
          const onClick = (e) => {
            e.stopPropagation();
            if (!symbol) {
              toast.error("No symbol found for this row");
              return;
            }
            handleModalEvent(params.rowIndex, symbol);
            setDetailsofRow(params.data);
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
      },
    ],
    []
  );

  const parentColsOnly = useMemo(() => {
    return baseParentCols.map((col, idx) => {
      const c = { ...col };
      const originalField = c.field;
      const originalVG = c.valueGetter;

      if (idx === 0) {
        c.valueGetter = (p) => {
          if (p?.data?.__kind === "detail") return null;
          if (originalVG) return originalVG(p);
          if (originalField) return p?.data?.[originalField];
          return null;
        };
        c.colSpan = (p) =>
          p?.data?.__kind !== "detail" ? 1 : safeGetDefsCount(p?.api);
        c.cellRenderer = (p) => {
          if (p?.data?.__kind !== "detail") return p?.value;

          const colState = p?.columnApi?.getColumnState?.() || [];
          const widthMap = {};
          colState.forEach((s) => {
            if (s.colId) widthMap[s.colId] = s.width;
          });

          const parent = p.data.__parent;
          const parentDetailId = p.data.__id;
          const symbol = parent?.Tick;

          const baseRows = (summaryData || [])
            .filter((d) => d?.Tick === symbol)
            .map((d) => ({
              ...d,
              __kind: "subParent",
              __id: `${d.Tick}-${d.Time}`,
            }));

          const expandedId = subExpandedByParent[parentDetailId] || null;
          const setExpandedId = (nextId) =>
            setSubExpandedByParent((prev) => ({
              ...prev,
              [parentDetailId]: nextId,
            }));

          const targetHeight =
            detailHeights[parentDetailId] ?? AG_GRID_HEIGHTS.DETAIL_DEFAULT_H;

          return (
            <div onClick={(e) => e.stopPropagation()}>
              <div className="ag-theme-quartz">
                <DetailCell targetHeight={targetHeight}>
                  <NestedGrid
                    rows={baseRows}
                    formattedDateStr={formattedDateStr}
                    optionTradeData={optionTradeData}
                    setOptionTradeData={setOptionTradeData}
                    expandedId={expandedId}
                    setExpandedId={setExpandedId}
                    parentWidthMap={widthMap}
                    onHeightChange={(h) => {
                      setDetailHeights((prev) =>
                        prev[parentDetailId] === h
                          ? prev
                          : { ...prev, [parentDetailId]: h }
                      );
                      p.api?.resetRowHeights?.();
                    }}
                  />
                </DetailCell>
              </div>
            </div>
          );
        };
        return c;
      }

      c.valueGetter = (p) => {
        if (p?.data?.__kind === "detail") return null;
        if (originalVG) return originalVG(p);
        if (originalField) return p?.data?.[originalField];
        return null;
      };
      return c;
    });
  }, [
    baseParentCols,
    summaryData,
    formattedDateStr,
    optionTradeData,
    subExpandedByParent,
    detailHeights,
  ]);
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
        color: "rgb(245, 245, 245)",
        opacity: isDimmed ? 0.1 : 1,
        pointerEvents: isDimmed ? "none" : "auto",
        transition: "opacity 0.3s ease-in-out",
        fontFamily: "Barlow",
        fontSize: 12,
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
        <div style={{ overflowX: "auto", width: "100%", marginBottom: "20px" }}>
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
                // sortable: false,
                resizable: true,
                // filter: false,
                // wrapHeaderText: true,
                // autoHeaderHeight: true,
                headerClass: "cm-header",
              }}
              rowClassRules={{
                "ag-row-even": (params) => params.node.rowIndex % 2 === 0,
                "ag-row-odd": (params) => params.node.rowIndex % 2 !== 0,
              }}
              suppressCellFocus
              getRowId={(p) =>
                p?.data?.__id ?? getParentRowId(p?.data ?? {}, p?.rowIndex ?? 0)
              }
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
                    onClick={handleFilerOptionClose}
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

      const current = typeof expandedId === "string" ? expandedId : null;
      const next = current === id ? null : id;
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
    const cols = [
      {
        colId: "Time",
        headerName: "Time",
        field: "Time",
        flex: 1.2,
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
            <div onClick={(e) => e.stopPropagation()}>
              <SellTradesCell
                parentRow={r}
                formattedDateStr={formattedDateStr}
                optionTradeData={optionTradeData}
                setOptionTradeData={setOptionTradeData}
              />
            </div>
          );
        },
      },
      {
        colId: "Tick",
        field: "Tick",
        headerName: "Tick",
        flex: 1,
        cellClass: ["BlackTdContent"],
      },
      {
        colId: "Probability",
        field: "Probability",
        headerName: "Probability",
        flex: 1.2,
        cellClass: ["BlackTdContent"],
      },
      {
        colId: "Orders",
        field: "Orders",
        headerName: "Orders",
        flex: 1.1,
        cellClass: ["BlackTdContent"],
      },
      {
        colId: "Premium",
        field: "Premium",
        headerName: "Premium",
        flex: 1,
        cellStyle: (p) => {
          const v = Number(String(p.value ?? "").replace(/[$,]/g, ""));
          if (v > 1000000) return { color: "#ff0000" };
          if (v > 500000) return { color: "#d6d454" };
          return { color: "white" };
        },
        valueFormatter: (p) => formatNumberToCurrency(p.value),
      },
      {
        colId: "Score",
        field: "Score",
        headerName: "Score",
        flex: 1.2,
        cellStyle: (p) => {
          const v = Number(String(p.value ?? "").replace(/[$,]/g, ""));
          if (v > 10) return { color: "rgb(14, 165, 233)" };
          return { color: "white" };
        },
      },

      {
        colId: "__actionsSpacer",
        headerName: "",
        field: "__actionsSpacer",
        flex: 1,
        resizable: false,
        sortable: false,
        filter: false,
        cellClass: ["BlackTdContent"],
        valueGetter: () => "",
      },
    ];
    return cols;
  }, [formattedDateStr, optionTradeData, setOptionTradeData]);

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
        color: COLORS.white,
        fontWeight: 100,
        fontSize: 12,
        fontFamily: "Barlow",
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
