// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import {
//   StyleModal,
//   StyleAniamtionModal, // (left as-is; not used but kept to avoid breaking imports)
//   StyledTable, // "
//   StyleDetailRow, // "
//   StyleOption,
//   StyleModalFilter,
//   StyleMainDiv,
//   StyleTopEvents,
// } from "../style/containers/AnimatedTable";
// import BubblePlot from "../charts/BubblePlot";
// import { useSelector } from "react-redux";
// import SearchIcon from "@mui/icons-material/Search";
// import TuneIcon from "@mui/icons-material/Tune";
// import CloseIcon from "@mui/icons-material/Close";
// import {
//   getChartBarData,
//   getChartBubbleData,
//   getChartBubbleExpiryData,
//   getChartPieData,
//   getSummaryData,
//   getSummaryDataMain,
//   getOptionTradeDetails,
// } from "../service/stellarApi";
// import toast from "react-hot-toast";
// import Header from "./Header";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import useMediaQuery from "@mui/material/useMediaQuery";
// import {
//   formatNumberToCurrency,
//   getFormatedDateStrForUSA,
// } from "../utils/common";
// import PiePlot from "../charts/PiePlot";
// import BarChart from "../charts/BarChart";
// import GroupedHorizontalChart from "../charts/GroupedHorizontalChart";
// import QuadrantBubbleChart from "../charts/QuadrantBubbleChart";
// import BubbleWithCategoryChart from "../charts/BubbleWithCategories";
// import resetSettings from "../assets/Images/reset_settings.png";
// import { useNavigate } from "react-router-dom";
// import RightNavigation from "../components/RightNavigation";

// import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
// import { AgGridReact } from "ag-grid-react";
// import "../style/AgGrid.css";
// import { AG_GRID_HEIGHTS, COLORS } from "../utils/constants";

// ModuleRegistry.registerModules([AllCommunityModule]);

// const headerStyleBase = {
//   color: "rgb(95,95,95)",
//   background: COLORS.dark3,
//   fontSize: 12,
//   fontFamily: "Barlow",
//   fontWeight: 700,
//   border: "none",
// };


// const safeGetDefsCount = (api) => {
//   const defs = api?.getColumnDefs?.();
//   return Array.isArray(defs) ? defs.length : 1;
// };

// const getParentRowId = (d, idx) =>
//   d?.Tick && d?.Time ? `${d.Tick}-${d.Time}` : d?.Tick ?? `row-${idx ?? 0}`;

// const stripMoney = (v) => Number(String(v ?? "").replace(/[$,]/g, ""));

// function currencyColorStyle(num) {
//   if (num > 1_000_000) return { color: COLORS.lime, fontWeight: 400 };
//   if (num > 500_000) return { color: COLORS.yellow };
//   return { color: COLORS.white };
// }

// function toDDMMYYYY(input) {
//   if (!input) return "";
//   const d = new Date(input);
//   if (isNaN(d)) return String(input);
//   const dd = String(d.getDate()).padStart(2, "0");
//   const mm = String(d.getMonth() + 1).padStart(2, "0");
//   const yyyy = d.getFullYear();
//   return `${dd}-${mm}-${yyyy}`;
// }

// /* ===========================
//    Tiny UI helpers
//    =========================== */

// function DetailCell({ children, targetHeight }) {
//   const [open, setOpen] = useState(false);
//   useEffect(() => {
//     const id = requestAnimationFrame(() => setOpen(true));
//     return () => cancelAnimationFrame(id);
//   }, []);
//   return (
//     <div
//       className="detail-wrapper"
//       style={{
//         maxHeight: open ? targetHeight : 0,
//         overflow: "hidden",
//         transition: "max-height 260ms ease",
//       }}
//     >
//       {children}
//     </div>
//   );
// }

// function isSameDay(a, b) {
//   if (!a) return true; // if no date selected, treat as today
//   return (
//     a.getFullYear() === b.getFullYear() &&
//     a.getMonth() === b.getMonth() &&
//     a.getDate() === b.getDate()
//   );
// }
// /* ===========================
//    Main Component
//    =========================== */

// export default function AnimatedTable() {
//   const [responseData, setResponseData] = useState([]);
//   const [summaryData, setSummaryData] = useState([]);

//   // Theme is read but not used; kept to avoid behavior changes.
//   const theamColor = useSelector((state) => state.theme.mode);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [animationState, setAnimationState] = useState(false);
//   const [filterState, setFilterState] = useState(false);
//   const [detailsofRow, setDetailsofRow] = useState();
//   const [animationStateindex, setAnimationStateIndex] = useState(-1);
//   const [date, setDate] = useState(null);
//   const [formattedDateStr, setFormattedDateStr] = useState("");
//   const isSmallScreen = useMediaQuery("(max-width:550px)");
//   const isSmallScreen2 = useMediaQuery("(max-width:1000px)");
//   const [gridApi, setGridApi] = useState(null);

//   const [optionTradeData, setOptionTradeData] = useState({});
//   const [subExpandedByParent, setSubExpandedByParent] = useState({});
//   const [detailHeights, setDetailHeights] = useState({});

//   const [loadingMain, setLoadingMain] = useState(false);

//   const [chartData, setChartData] = useState({
//     putBar: [],
//     callBar: [],
//     pie: [],
//     bubble: [],
//     callBubbleExpiry: [],
//     putBubbleExpiry: [],
//     currentDayPutBarPlotData: [],
//     currentDayCallBarPlotData: [],
//     selectedOrPreviousPutBarPlotData: [],
//     selectedOrPreviousCallBarPlotData: [],
//   });

//   const navigate = useNavigate();

//   /* ===========================
//      Data fetching: Summary rows
//      =========================== */

//   const fetchdata = useCallback(async () => {
//     setLoadingMain(true);
//     try {
//       const todayStr = getFormatedDateStrForUSA(date || new Date());
//       setFormattedDateStr(todayStr);

//       const queryObj = {
//         executionDate: `${todayStr}T00:00:00`,
//         intervalStart: `${todayStr}T09:00:00`,
//         intervalEnd: `${todayStr}T16:45:00`,
//         minsWindows: 5,
//       };

//       const [summaryMainRes, summaryRes] = await Promise.all([
//         getSummaryDataMain(queryObj),
//         getSummaryData(queryObj),
//       ]);

//       if (!summaryMainRes?.ok) {
//         throw new Error(
//           summaryMainRes?.error?.error || "Failed to fetch summary main data"
//         );
//       }
//       if (!summaryRes?.ok) {
//         throw new Error(
//           summaryRes?.error?.error || "Failed to fetch summary data"
//         );
//       }

//       setResponseData(summaryMainRes.data || []);
//       setSummaryData(summaryRes.data || []);
//     } catch (error) {
//       console.error(error);
//       toast.error(error.message || "Something went wrong");
//     } finally {
//       setLoadingMain(false);
//     }
//   }, [date]);

//   // useEffect(() => {
//   //   fetchdata();

//   //   // Refresh within US market hours every 10s
//   //   const intervalId = setInterval(() => {
//   //     const now = new Date();
//   //     const timeInNewYork = USATimeFormatter.formatToParts(now);
//   //     const hour = parseInt(
//   //       timeInNewYork.find((p) => p.type === "hour")?.value || "0",
//   //       10
//   //     );
//   //     const minute = parseInt(
//   //       timeInNewYork.find((p) => p.type === "minute")?.value || "0",
//   //       10
//   //     );

//   //     const totalMinutes = hour * 60 + minute; // 9:00 = 540; 16:45 = 1005
//   //     if (totalMinutes >= 540 && totalMinutes <= 1005) {
//   //       fetchdata();
//   //     }
//   //   }, 10000);

//   //   return () => clearInterval(intervalId);
//   // }, [fetchdata]);
// useEffect(() => {
//   let intervalId;

//   const run = async () => {
//     await fetchdata();
//   };

//   if (isSameDay(date, new Date())) {
//     run(); 
//     intervalId = setInterval(run, 5000);
//   } else {
//     run();
//   }

//   return () => {
//     if (intervalId) clearInterval(intervalId);
//   };
// }, [date, fetchdata]);

//   /* ===========================
//      Row filtering and expansion
//      =========================== */

//   const filteredResponseData = useMemo(() => {
//     const q = searchTerm.toLowerCase();
//     return responseData.filter((row) =>
//       (row?.Tick ?? "").toLowerCase().includes(q)
//     );
//   }, [responseData, searchTerm]);

//   const [expandedRowId, setExpandedRowId] = useState(null);

//   const displayRows = useMemo(() => {
//     const out = [];
//     filteredResponseData.forEach((r, i) => {
//       const id = getParentRowId(r, i);
//       out.push({ ...r, __kind: "parent", __id: id });
//       if (expandedRowId === id) {
//         out.push({ __kind: "detail", __parent: r, __id: `detail-${id}` });
//       }
//     });
//     return out;
//   }, [filteredResponseData, expandedRowId]);

//   const onTopRowClicked = useCallback((e) => {
//     const row = e?.data;
//     if (row?.__kind !== "parent") return;

//     const id = row.__id;
//     const detailKey = `detail-${id}`;
//     setExpandedRowId((prev) => {
//       if (prev === id) {
//         setSubExpandedByParent((map) => {
//           const next = { ...map };
//           delete next[detailKey];
//           return next;
//         });
//         return null;
//       } else {
//         setSubExpandedByParent({});
//         return id;
//       }
//     });
//   }, []);

//   useEffect(() => {
//     function handleClickOutside(e) {
//       if (expandedRowId && !e.target.closest(".ag-row")) {
//         setExpandedRowId(null);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [expandedRowId]);

//   /* ===========================
//      Charts data
//      =========================== */

//   const getBubbleChartData = useCallback(async (basePayload) => {
//     const response = await getChartBubbleData(basePayload);
//     if (response?.ok)
//       setChartData((prev) => ({ ...prev, bubble: response.data || [] }));
//   }, []);

//   const getPieChartData = useCallback(async (basePayload) => {
//     const response = await getChartPieData(basePayload);
//     if (response?.ok)
//       setChartData((prev) => ({ ...prev, pie: response.data || [] }));
//   }, []);

//   const getBarChartData = useCallback(async (basePayload) => {
//     const [putBarResponseData, callBarResponseData] = await Promise.all([
//       getChartBarData({ ...basePayload, optionType: "P", intervalMin: "60" }),
//       getChartBarData({ ...basePayload, optionType: "C", intervalMin: "60" }),
//     ]);

//     if (putBarResponseData?.ok) {
//       setChartData((prev) => ({
//         ...prev,
//         putBar: putBarResponseData.data || [],
//       }));
//     }
//     if (callBarResponseData?.ok) {
//       setChartData((prev) => ({
//         ...prev,
//         callBar: callBarResponseData.data || [],
//       }));
//     }
//   }, []);

//   const getBarChartDataForBarPlot = useCallback(
//     async (optionSymbol) => {
//       const todayStr = getFormatedDateStrForUSA(new Date());
//       const yesterday = new Date();
//       yesterday.setDate(yesterday.getDate() - 1);
//       const yesterdayStr = getFormatedDateStrForUSA(yesterday);

//       const execDate =
//         formattedDateStr || getFormatedDateStrForUSA(date || new Date());
//       const selectedOrPreviousDateStr =
//         execDate === todayStr ? yesterdayStr : execDate;

//       const [putToday, callToday, putPrev, callPrev] = await Promise.all([
//         getChartBarData({
//           optionSymbol,
//           optionType: "P",
//           intervalMin: 60,
//           executionDate: todayStr,
//         }),
//         getChartBarData({
//           optionSymbol,
//           optionType: "C",
//           intervalMin: 60,
//           executionDate: todayStr,
//         }),
//         getChartBarData({
//           optionSymbol,
//           optionType: "P",
//           intervalMin: 60,
//           executionDate: selectedOrPreviousDateStr,
//         }),
//         getChartBarData({
//           optionSymbol,
//           optionType: "C",
//           intervalMin: 60,
//           executionDate: selectedOrPreviousDateStr,
//         }),
//       ]);

//       if (putToday?.ok) {
//         setChartData((prev) => ({
//           ...prev,
//           currentDayPutBarPlotData: (putToday.data || []).map((d) => ({
//             ...d,
//             date: todayStr,
//           })),
//         }));
//       }
//       if (callToday?.ok) {
//         setChartData((prev) => ({
//           ...prev,
//           currentDayCallBarPlotData: (callToday.data || []).map((d) => ({
//             ...d,
//             date: todayStr,
//           })),
//         }));
//       }
//       if (putPrev?.ok) {
//         setChartData((prev) => ({
//           ...prev,
//           selectedOrPreviousPutBarPlotData: (putPrev.data || []).map((d) => ({
//             ...d,
//             date: selectedOrPreviousDateStr,
//           })),
//         }));
//       }
//       if (callPrev?.ok) {
//         setChartData((prev) => ({
//           ...prev,
//           selectedOrPreviousCallBarPlotData: (callPrev.data || []).map((d) => ({
//             ...d,
//             date: selectedOrPreviousDateStr,
//           })),
//         }));
//       }
//     },
//     [formattedDateStr, date]
//   );

//   const getChartBubbleExpiry = useCallback(async (basePayload) => {
//     const [callResponse, putResponse] = await Promise.all([
//       getChartBubbleExpiryData({ ...basePayload, optionType: "C" }),
//       getChartBubbleExpiryData({ ...basePayload, optionType: "P" }),
//     ]);

//     if (callResponse?.ok) {
//       setChartData((prev) => ({
//         ...prev,
//         callBubbleExpiry: callResponse.data || [],
//       }));
//     }
//     if (putResponse?.ok) {
//       setChartData((prev) => ({
//         ...prev,
//         putBubbleExpiry: putResponse.data || [],
//       }));
//     }
//   }, []);

//   const getAllChartsData = useCallback(
//     async (symbol) => {
//       const execDate =
//         formattedDateStr || getFormatedDateStrForUSA(date || new Date());
//       const basePayload = { optionSymbol: symbol, executionDate: execDate };

//       try {
//         await Promise.all([
//           getBubbleChartData(basePayload),
//           getPieChartData(basePayload),
//           getBarChartData(basePayload),
//           getChartBubbleExpiry(basePayload),
//           getBarChartDataForBarPlot(symbol),
//         ]);
//       } catch (error) {
//         console.error("Error fetching chart data:", error);
//         toast.error("Failed to load chart data");
//       }
//     },
//     [
//       formattedDateStr,
//       date,
//       getBubbleChartData,
//       getPieChartData,
//       getBarChartData,
//       getChartBubbleExpiry,
//       getBarChartDataForBarPlot,
//     ]
//   );

//   const handleModalEvent = useCallback(
//     (index, symbol) => {
//       setAnimationState(true);
//       setAnimationStateIndex(index);
//       getAllChartsData(symbol);
//     },
//     [getAllChartsData]
//   );

//   const handleModalEventClose = useCallback(() => {
//     setAnimationState(false);
//     setAnimationStateIndex(-1);
//   }, []);

//   const handleFilerOption = useCallback(() => setFilterState(true), []);
//   const handleFilerOptionClose = useCallback(() => setFilterState(false), []);

//   const combinedBubbleExpiry = useMemo(
//     () => [
//       ...(chartData.callBubbleExpiry || []),
//       ...(chartData.putBubbleExpiry || []),
//     ],
//     [chartData.callBubbleExpiry, chartData.putBubbleExpiry]
//   );

//   const groupedByDate = useMemo(() => {
//     if (!combinedBubbleExpiry.length) return {};
//     return combinedBubbleExpiry.reduce((acc, item) => {
//       const d = item?.ExpirationDate;
//       if (!d) return acc;
//       if (!acc[d]) acc[d] = [];
//       acc[d].push(item);
//       return acc;
//     }, {});
//   }, [combinedBubbleExpiry]);

//   /* ===========================
//      Column defs (Parent)
//      =========================== */

//   const parentHeaderStyle = headerStyleBase;

//   const analysisCellRenderer = useCallback(
//     (params) => {
//       const symbol = params?.data?.Tick ?? params?.data?.__parent?.Tick ?? "";
//       const onClick = (e) => {
//         e.stopPropagation();
//         if (!symbol) return;
//         handleModalEvent(params.rowIndex, symbol);
//         setDetailsofRow(params.data);
//       };
//       return (
//         <img
//           src="analysis.svg"
//           alt="action"
//           style={{ cursor: "pointer" }}
//           onClick={onClick}
//         />
//       );
//     },
//     [handleModalEvent]
//   );

//   const headerStyle = {
//     color: "rgb(95,95,95)",
//     background: "#333",
//     fontSize: 12,
//     fontFamily: "Barlow",
//     fontWeight: 700,
//     border: "none",
//     width: "100%",
//   };

//   const baseParentCols = useMemo(
//     () => [
//       {
//         colId: "Time",
//         field: "Time",
//         headerName: "Time",
//         flex: 1,
//         cellStyle: {
//           color: "rgb(98, 95, 95)",
//           fontWeight: "700",
//           textAlign: "center",
//         },
//         headerClass: ["cm-header"],
//       },
//       {
//         colId: "Tick",
//         field: "Tick",
//         headerName: "Tick",
//         flex: 1,
//         cellStyle: { color: "#00ff59", textAlign: "center" },
//         headerClass: ["cm-header"],
//       },
//       {
//         colId: "Probability",
//         field: "Probability",
//         headerName: "Probability",
//         flex: 1,
//         cellStyle: { color: "#00ff59", textAlign: "center" },
//         headerClass: ["cm-header"],
//       },
//       {
//         colId: "CallCount",
//         field: "CallCount",
//         headerName: "Count",
//         flex: 0.6,
//         cellStyle: { textAlign: "center", color: "#fff" },
//         cellClass: ["whiteTdContent"],
//         headerClass: ["cm-header"],
//       },
//       {
//         colId: "cbTotalCost",
//         field: "cbTotalCost",
//         headerName: "Call Buy",
//         flex: 1,
//         cellStyle: (p) => {
//           const v = Number(String(p.value ?? "").replace(/[$,]/g, ""));
//           if (v > 1000000)
//             return { color: "#00ff59", textAlign: "center", fontWeight: 400 };
//           if (v > 500000)
//             return { color: "#d6d454", textAlign: "center", fontWeight: 400 };
//           return { color: "white", textAlign: "center" };
//         },
//         headerClass: ["cm-header"],
//         valueFormatter: (p) => formatNumberToCurrency(p.value),
//       },
//       {
//         colId: "csTotalCost",
//         field: "csTotalCost",
//         headerName: "Call Sell",
//         flex: 1,
//         cellStyle: (p) => {
//           const v = Number(String(p.value ?? "").replace(/[$,]/g, ""));
//           if (v > 1000000) return { color: "#00ff59", textAlign: "center" };
//           if (v > 500000) return { color: "#d6d454", textAlign: "center" };
//           return { color: "white", textAlign: "center" };
//         },
//         valueFormatter: (p) => formatNumberToCurrency(p.value),
//         headerClass: ["cm-header"],
//       },

//       {
//         colId: "CallBx",
//         field: "CallBx",
//         headerName: "Call By Avg",
//         flex: 1,
//         cellStyle: (p) => {
//           const v = Number(String(p.value ?? "").replace(/[$,]/g, ""));
//           const base = {
//             textAlign: "center",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           };
//           if (v > 10) return { ...base, color: "rgb(14, 165, 233)" };
//           return { ...base, color: "white" };
//         },
//         headerClass: ["cm-header"],
//       },
//       {
//         colId: "CallPutBX",
//         field: "CallPutBX",
//         headerName: "Call vs Put Avg",
//         flex: 1,
//         cellStyle: { textAlign: "center", color: "#fff" },
//         headerClass: ["cm-header"],
//       },

//       {
//         colId: "Actions",
//         headerName: "Analysis",
//         flex: 1,
//         headerClass: ["cm-header", "no-resize"],
//         cellRenderer: (params) => {
//           const symbol =
//             params?.data?.Tick ?? params?.data?.__parent?.Tick ?? "";
//           const onClick = (e) => {
//             e.stopPropagation();
//             if (!symbol) {
//               toast.error("No symbol found for this row");
//               return;
//             }
//             handleModalEvent(params.rowIndex, symbol);
//             setDetailsofRow(params.data);
//           };
//           return (
//             <img
//               src="analysis.svg"
//               alt="action"
//               style={{ cursor: "pointer" }}
//               onClick={onClick}
//             />
//           );
//         },
//       },
//     ],
//     []
//   );

//   const parentColsOnly = useMemo(() => {
//     return baseParentCols.map((col, idx) => {
//       const c = { ...col };
//       const originalField = c.field;
//       const originalVG = c.valueGetter;

//       if (idx === 0) {
//         c.valueGetter = (p) => {
//           if (p?.data?.__kind === "detail") return null;
//           if (originalVG) return originalVG(p);
//           if (originalField) return p?.data?.[originalField];
//           return null;
//         };
//         c.colSpan = (p) =>
//           p?.data?.__kind !== "detail" ? 1 : safeGetDefsCount(p?.api);
//         c.cellRenderer = (p) => {
//           if (p?.data?.__kind !== "detail") return p?.value;

//           const colState = p?.columnApi?.getColumnState?.() || [];
//           const widthMap = {};
//           colState.forEach((s) => {
//             if (s.colId) widthMap[s.colId] = s.width;
//           });

//           const parent = p.data.__parent;
//           const parentDetailId = p.data.__id;
//           const symbol = parent?.Tick;

//           const baseRows = (summaryData || [])
//             .filter((d) => d?.Tick === symbol)
//             .map((d) => ({
//               ...d,
//               __kind: "subParent",
//               __id: `${d.Tick}-${d.Time}`,
//             }));

//           const expandedId = subExpandedByParent[parentDetailId] || null;
//           const setExpandedId = (nextId) =>
//             setSubExpandedByParent((prev) => ({
//               ...prev,
//               [parentDetailId]: nextId,
//             }));

//           const targetHeight =
//             detailHeights[parentDetailId] ?? DETAIL_DEFAULT_H;

//           return (
//             <div onClick={(e) => e.stopPropagation()}>
//               <div className="ag-theme-quartz">
//                 <DetailCell targetHeight={targetHeight}>
//                   <NestedGrid
//                     rows={baseRows}
//                     formattedDateStr={formattedDateStr}
//                     optionTradeData={optionTradeData}
//                     setOptionTradeData={setOptionTradeData}
//                     expandedId={expandedId}
//                     setExpandedId={setExpandedId}
//                     parentWidthMap={widthMap}
//                     onHeightChange={(h) => {
//                       setDetailHeights((prev) =>
//                         prev[parentDetailId] === h
//                           ? prev
//                           : { ...prev, [parentDetailId]: h }
//                       );
//                       p.api?.resetRowHeights?.();
//                     }}
//                   />
//                 </DetailCell>
//               </div>
//             </div>
//           );
//         };
//         return c;
//       }

//       c.valueGetter = (p) => {
//         if (p?.data?.__kind === "detail") return null;
//         if (originalVG) return originalVG(p);
//         if (originalField) return p?.data?.[originalField];
//         return null;
//       };
//       return c;
//     });
//   }, [
//     baseParentCols,
//     summaryData,
//     formattedDateStr,
//     optionTradeData,
//     subExpandedByParent,
//     detailHeights,
//   ]);

//   /* ===========================
//      Row styles (Parent)
//      =========================== */

//   const getRowStyle = useCallback(
//     (params) => {
//       const row = params?.data || {};
//       if (row.__kind === "detail")
//         return { background: COLORS.dark4, color: COLORS.dark0 };

//       const prob = Number(String(row?.Probability ?? "").replace("%", "") || 0);
//       const isDimmed =
//         expandedRowId !== null &&
//         row.__kind === "parent" &&
//         expandedRowId !== row.__id;

//       const isEvenRow = params.node.rowIndex % 2 === 0;
//       const rowOverlay = isEvenRow ? COLORS.dark4 : COLORS.dark3;

//       const gradient =
//         prob >= 90
//           ? "linear-gradient(rgba(178, 74, 242, 0) 0%, rgba(178, 74, 242, 0.5) 198.75%)"
//           : prob >= 80
//           ? "linear-gradient(rgba(60, 175, 200, 0) 0%, rgba(60, 175, 200, 0.5) 198.75%)"
//           : "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%)";

//       return {
//         background: `${gradient},${rowOverlay}`,
//         color: "rgb(245, 245, 245)",
//         opacity: isDimmed ? 0.1 : 1,
//         pointerEvents: isDimmed ? "none" : "auto",
//         transition: "opacity 0.3s ease-in-out",
//         fontFamily: "Barlow",
//         fontSize: 12,
//       };
//     },
//     [expandedRowId]
//   );

//   /* ===========================
//      Render
//      =========================== */

//   return (
//     <StyleMainDiv>
//       <RightNavigation />

//       {!animationState ? (
//         <>
//           <StyleOption>
//             <h4 className="TitleAction m-0">Hot Stocks in Action</h4>

//             <div className="rightNavigation">
//               <div
//                 className="SmallScreen"
//                 style={{
//                   background: "#959595",
//                   width: " max-content",
//                   marginLeft: 15,
//                   borderRadius: 5,
//                   margin: 5,
//                   height: 35,
//                   display: "flex",
//                   alignItems: "center",
//                 }}
//               >
//                 <LocalizationProvider dateAdapter={AdapterDateFns}>
//                   <DatePicker
//                     value={date}
//                     onChange={(newDate) => setDate(newDate)}
//                     disableFuture
//                     slotProps={{
//                       textField: { size: "small", variant: "outlined" },
//                     }}
//                   />
//                 </LocalizationProvider>
//               </div>

//               <div className="SearchInputs">
//                 <input
//                   type="text"
//                   placeholder="Search  Tick "
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//                 <SearchIcon className="SearchIcon" />
//               </div>

//               <div className="ShowInLine">
//                 <Header />
//                 <button
//                   type="button"
//                   className="btn btn-primary Filtericon"
//                   onClick={handleFilerOption}
//                 >
//                   <TuneIcon /> Filter{" "}
//                   <span
//                     className="badge bg-warning text-dark"
//                     style={{ position: "relative", top: 0 }}
//                   >
//                     0
//                   </span>
//                 </button>
//               </div>
//             </div>
//           </StyleOption>

//           <div style={{ overflowX: "auto", width: "100%" }}>
//             <div
//               style={{
//                 position: "relative",
//                 height: "100vh",
//                 width: "100%",
//                 padding: 5,
//               }}
//             >
//               <AgGridReact
//                 className="ag-theme-quartz header-center main-grid"
//                 rowData={displayRows}
//                 columnDefs={parentColsOnly}
//                 suppressRowHoverHighlight={true}
//                 defaultColDef={{
//                   flex: 1,
//                   sortable: false,
//                   resizable: true,
//                   filter: false,
//                   wrapHeaderText: true,
//                   autoHeaderHeight: true,
//                   headerClass: "cm-header",
//                 }}
//                 rowClassRules={{
//                   "ag-row-even": (params) => params.node.rowIndex % 2 === 0,
//                   "ag-row-odd": (params) => params.node.rowIndex % 2 !== 0,
//                 }}
//                 suppressCellFocus
//                 getRowId={(p) =>
//                   p?.data?.__id ??
//                   getParentRowId(p?.data ?? {}, p?.rowIndex ?? 0)
//                 }
//                 onRowClicked={onTopRowClicked}
//                 rowHeight={ROW_H_L1}
//                 headerHeight={HEADER_H_L1}
//                 getRowStyle={getRowStyle}
//                 getRowHeight={(p) => {
//                   if (p?.data?.__kind === "detail") {
//                     const id = p?.data?.__id;
//                     return detailHeights[id] ?? DETAIL_DEFAULT_H;
//                   }
//                   return ROW_H_L1;
//                 }}
//                 onGridReady={(params) => setGridApi(params.api)}
//               />
//             </div>
//           </div>
//         </>
//       ) : null}

//       {/* Modal with charts */}
//       <StyleModal
//         className={animationState ? "open" : ""}
//         style={{
//           width: animationState ? "100%" : "0",
//           left: animationState ? "0" : "100%",
//           position: animationState ? "relative" : "",
//         }}
//       >
//         <div
//           style={{
//             width: isSmallScreen
//               ? "90%"
//               : isSmallScreen2
//               ? "auto"
//               : animationState
//               ? "100%"
//               : "0",
//             display: "flex",
//           }}
//           className="SetupBack"
//         >
//           <div
//             style={{
//               marginTop: 10,
//               width: "100vw",
//               padding: "5px 12px 10px",
//               boxSizing: "border-box",
//             }}
//           >
//             <StyleTopEvents>
//               <div>
//                 <h5 className="m-0">{detailsofRow?.Tick || "—"}</h5>
//               </div>
//               <CloseIcon
//                 style={{ cursor: "pointer", color: COLORS.white, fontSize: 15 }}
//                 className="closeInnerModal"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleModalEventClose();
//                 }}
//               />
//             </StyleTopEvents>

//             <div className="row m-0">
//               <div
//                 className="col-lg-12 SmallPaddRight"
//                 style={{ paddingRight: 10, paddingLeft: 0 }}
//               >
//                 <QuadrantBubbleChart
//                   bubbleData={chartData.bubble}
//                   height={640}
//                   style={{
//                     background: COLORS.dark2,
//                     height: "-webkit-fill-available",
//                   }}
//                 />
//               </div>
//             </div>
//             <div className="BorderBottom"></div>

//             <div className="row m-0 BuySellTime">
//               <h5 className="Heading">Buy and Sell on Time</h5>

//               <div className="col-lg-6 BorderRight" style={{ paddingRight: 0 }}>
//                 <GroupedHorizontalChart
//                   height={500}
//                   rawData={chartData.callBar}
//                   buyLabel="Call Buy"
//                   sellLabel="Call Sell"
//                   buyColor="#00FF59"
//                   sellColor="#FF605D"
//                   filterOptionType="C"
//                 />
//               </div>

//               <div className="col-lg-6" style={{ paddingRight: 0 }}>
//                 <GroupedHorizontalChart
//                   height={500}
//                   rawData={chartData.putBar}
//                   buyLabel="Put Buy"
//                   sellLabel="Put Sell"
//                   buyColor="#00FF59"
//                   sellColor="#FF605D"
//                   filterOptionType="P"
//                 />
//               </div>
//             </div>
//             <div className="BorderBottom"></div>

//             <div
//               className="row"
//               style={{ marginLeft: 0, marginRight: 0, marginTop: 10 }}
//             >
//               <div
//                 className="col-lg-8 Firstchart BorderRight Ca1Top"
//                 style={{ paddingRight: 10, paddingLeft: 0 }}
//               >
//                 <BubbleWithCategoryChart
//                   rawData={chartData.callBubbleExpiry}
//                   type="CALL"
//                   height={520}
//                 />
//                 <div className="BorderBottom1"></div>
//                 <BubbleWithCategoryChart
//                   rawData={chartData.putBubbleExpiry}
//                   type="PUT"
//                   height={520}
//                 />
//               </div>

//               <div className="col-lg-4 Piechartsec" style={{ paddingRight: 0 }}>
//                 <BarChart
//                   height={400}
//                   data={[
//                     ...chartData.currentDayCallBarPlotData,
//                     ...chartData.currentDayPutBarPlotData,
//                     ...chartData.selectedOrPreviousCallBarPlotData,
//                     ...chartData.selectedOrPreviousPutBarPlotData,
//                   ]}
//                 />
//                 <div className="BorderBottom1"></div>

//                 <PiePlot
//                   rawData={chartData.pie}
//                   fields={["TotalCallBuyCost", "TotalCallSellCost"]}
//                   labels={["Call Buy", "Call Sell"]}
//                   title="Total Call Buy and Sell"
//                   height={320}
//                 />
//                 <div className="BorderBottom1"></div>

//                 <PiePlot
//                   rawData={chartData.pie}
//                   fields={["TotalPutBuyCost", "TotalPutSellCost"]}
//                   labels={["Put Buy", "Put Sell"]}
//                   title="Total Put Buy and Sell"
//                   height={250}
//                   style={{ marginTop: 0 }}
//                 />
//               </div>
//             </div>

//             <div className="BorderBottom1" style={{ marginTop: 60 }}></div>

//             <div
//               className="row BottomGraphs"
//               style={{ marginLeft: 0, marginRight: 0, marginTop: 10 }}
//             >
//               {Object.entries(groupedByDate).map(([d, data], index) => (
//                 <div
//                   key={d}
//                   className={`col-lg-4 ${
//                     index === 0 ? "BorderTopSet" : ""
//                   } BorderRight BorderLastBottom `}
//                 >
//                   <BubblePlot rawData={data} width={510} />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </StyleModal>

//       {filterState ? (
//         <StyleModalFilter>
//           <div
//             className="modal RightsideModal"
//             style={{ width: filterState ? 520 : 0, display: "flex" }}
//           >
//             <div style={{ width: "100%" }}>
//               <div className="DivCollection" style={{ display: "flex" }}>
//                 <div>
//                   <h4>Filter</h4>
//                 </div>
//                 <div className="RightIcon">
//                   <img
//                     src={resetSettings}
//                     alt="Reset Settings"
//                     className="resetSettings"
//                   />
//                   <span
//                     style={{
//                       margin: "0 15px",
//                       position: "relative",
//                       top: -2,
//                       color: "#959595",
//                     }}
//                   >
//                     |
//                   </span>
//                   <button
//                     type="button"
//                     className="btn btn-link p-0"
//                     style={{ color: COLORS.white, lineHeight: 0 }}
//                     onClick={handleFilerOptionClose}
//                   >
//                     <CloseIcon />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </StyleModalFilter>
//       ) : null}
//     </StyleMainDiv>
//   );
// }

// /* ===========================
//    Nested Grid (level 2)
//    =========================== */

// function NestedGrid({
//   rows,
//   formattedDateStr,
//   optionTradeData,
//   setOptionTradeData,
//   expandedId,
//   setExpandedId,
//   parentWidthMap, // kept for parity
//   onHeightChange,
// }) {
//   const flatRows = useMemo(() => {
//     const out = [];
//     (rows || []).forEach((r) => {
//       out.push(r);
//       if (expandedId === r.__id) {
//         out.push({
//           __kind: "subDetail",
//           __parent: r,
//           __id: `subDetail-${r.__id}`,
//         });
//       }
//     });
//     return out;
//   }, [rows, expandedId]);

//   const onRowClick = useCallback(
//     (e) => {
//       const kind = e?.data?.__kind;
//       if (kind !== "subParent") return;
//       const id = e?.data?.__id;
//       if (!id) return;

//       const current = typeof expandedId === "string" ? expandedId : null;
//       const next = current === id ? null : id;
//       setExpandedId(next);
//     },
//     [expandedId, setExpandedId]
//   );

//   const getRowKeyFor = useCallback(
//     (pr) => pr?.__id ?? `${pr?.Tick ?? "tick"}-${pr?.Time ?? "time"}`,
//     []
//   );

//   const getThirdLevelHeightFor = useCallback(
//     (parentRow) => {
//       const key = getRowKeyFor(parentRow);
//       const arr = optionTradeData?.[key];
//       const len = Array.isArray(arr) ? arr.length + 1 : 5;
//       return HEADER_H_L3 + ROW_H_L3 * len;
//     },
//     [optionTradeData, getRowKeyFor]
//   );

//   const nestedHeight = useMemo(() => {
//     return (flatRows || []).reduce((sum, r) => {
//       if (r?.__kind === "subDetail")
//         return sum + getThirdLevelHeightFor(r.__parent);
//       return sum + AG_GRID_HEIGHTS.ROW_H_L2;
//     }, AG_GRID_HEIGHTS.HEADER_H_L2);
//   }, [flatRows, getThirdLevelHeightFor]);

//   useEffect(() => {
//     onHeightChange?.(nestedHeight);
//   }, [nestedHeight, onHeightChange]);

//   const childCols = useMemo(() => {
//     const cols = [
//       {
//         colId: "Time",
//         headerName: "Time",
//         field: "Time",
//         flex: 1,
//         valueGetter: (p) =>
//           p?.data?.__kind === "subParent" ? p?.data?.Time : null,
//         colSpan: (p) => {
//           if (p?.data?.__kind !== "subDetail") return 1;
//           return safeGetDefsCount(p?.api);
//         },
//         cellRenderer: (p) => {
//           if (p?.data?.__kind !== "subDetail") return p?.value;
//           const r = p?.data?.__parent;
//           if (!r) return null;
//           return (
//             <div onClick={(e) => e.stopPropagation()} style={{ width: "101%" }}>
//               <SellTradesCell
//                 parentRow={r}
//                 formattedDateStr={formattedDateStr}
//                 optionTradeData={optionTradeData}
//                 setOptionTradeData={setOptionTradeData}
//               />
//             </div>
//           );
//         },
//         cellStyle: {
//           color: "rgb(98, 95, 95)",
//           fontWeight: "700",
//           textAlign: "center",
//         },
//         headerClass: ["cm-header"],
//       },
//       {
//         colId: "Tick",
//         field: "Tick",
//         headerName: "Tick",
//         flex: 1,
//         cellClass: ["BlackTdContent"],
//         headerClass: ["cm-header"],
//       },
//       {
//         colId: "Probability",
//         field: "Probability",
//         headerName: "Probability",
//         flex: 1,
//         cellClass: ["BlackTdContent"],
//         headerClass: ["cm-header"],
//       },
//       {
//         colId: "CallCount",
//         field: "CallCount",
//         headerName: "Count",
//         flex: 0.7,
//         cellClass: ["BlackTdContent"],
//         headerClass: ["cm-header"],
//       },
//       {
//         colId: "cbTotalCost",
//         field: "cbTotalCost",
//         headerName: "Call Buy",
//         flex: 1,
//         cellStyle: (p) => {
//           const v = Number(String(p.value ?? "").replace(/[$,]/g, ""));
//           if (v > 1000000) return { color: "#00ff59", fontWeight: 400 };
//           if (v > 500000) return { color: "#d6d454", fontWeight: 400 };
//           return { color: "white" };
//         },
//         valueFormatter: (p) => formatNumberToCurrency(p.value),
//         headerClass: ["cm-header"],
//       },
//       {
//         colId: "csTotalCost",
//         field: "csTotalCost",
//         headerName: "Call Sell",
//         flex: 1,
//         cellStyle: (p) => {
//           const v = Number(String(p.value ?? "").replace(/[$,]/g, ""));
//           if (v > 1000000) return { color: "#00ff59" };
//           if (v > 500000) return { color: "#d6d454" };
//           return { color: "white" };
//         },
//         valueFormatter: (p) => formatNumberToCurrency(p.value),
//         headerClass: ["cm-header"],
//       },

//       {
//         colId: "CallBx",
//         field: "CallBx",
//         headerName: "Call By Avg",
//         flex: 1,
//         cellStyle: (p) => {
//           return { color: "white" };
//         },
//         headerClass: ["cm-header"],
//       },
//       {
//         colId: "CallPutBX",
//         field: "CallPutBX",
//         headerName: "Call vs Put Avg",
//         flex: 1,
//         cellClass: ["BlackTdContent"],
//         headerClass: ["cm-header"],
//       },

//       {
//         colId: "__actionsSpacer",
//         headerName: "Analysis",
//         field: "__actionsSpacer",
//         flex: 1,
//         resizable: false,
//         sortable: false,
//         filter: false,
//         cellClass: ["BlackTdContent"],
//         valueGetter: () => "",
//         headerClass: ["cm-header"],
//       },
//     ];
//     return cols;
//   }, [formattedDateStr, optionTradeData, setOptionTradeData]);

//   const getChildRowHeight = useCallback(
//     (p) =>
//       p?.data?.__kind === "subDetail"
//         ? getThirdLevelHeightFor(p?.data?.__parent)
//         : AG_GRID_HEIGHTS.ROW_H_L2,
//     [getThirdLevelHeightFor]
//   );

//   const getLevelTwoRowStyle = useCallback(
//     (params) => {
//       const row = params?.data || {};
//       const baseEven =
//         params.node.rowIndex % 2 === 0 ? COLORS.dark4 : COLORS.dark3;
//       if (row.__kind === "subDetail")
//         return { background: COLORS.dark4, color: COLORS.white };

//       const isDim =
//         typeof expandedId === "string" &&
//         row.__kind === "subParent" &&
//         row.__id !== expandedId;
//       return {
//         background: isDim ? COLORS.dark3 : baseEven,
//         color: COLORS.white,
//         fontWeight: 100,
//         fontSize: 12,
//         fontFamily: "Barlow",
//         transition: "opacity 200ms ease, filter 200ms ease",
//         opacity: isDim ? 0.35 : 1,
//       };
//     },
//     [expandedId]
//   );

//   return (
//     <AgGridReact
//       className="nested-grid ag-theme-quartz no-padding-grid"
//       rowData={flatRows}
//       columnDefs={childCols}
//       suppressRowHoverHighlight={true}
//       headerHeight={AG_GRID_HEIGHTS.HEADER_H_L2}
//       rowHeight={AG_GRID_HEIGHTS.ROW_H_L2}
//       defaultColDef={{ resizable: true, sortable: false, filter: false }}
//       suppressCellFocus
//       onRowClicked={onRowClick}
//       getRowId={(p) => p?.data?.__id ?? `row-${p?.rowIndex ?? 0}`}
//       getRowHeight={getChildRowHeight}
//       getRowStyle={getLevelTwoRowStyle}
//       domLayout="autoHeight"
//       suppressHorizontalScroll
//       suppressVerticalScroll
//       style={{ width: "100%", background: "#282828" }}
//     />
//   );
// }

// /* ===========================
//    Third Grid (SellTradesCell)
//    =========================== */

// function SellTradesCell({
//   parentRow,
//   formattedDateStr,
//   optionTradeData,
//   setOptionTradeData,
// }) {
//   if (!parentRow) return <div style={{ width: "100%" }} />;

//   const rowKey =
//     parentRow.__id ?? `${parentRow.Tick ?? "tick"}-${parentRow.Time ?? "time"}`;
//   const tick = parentRow.Tick ?? "";
//   const data = optionTradeData[rowKey];
//   const isLoading = !(rowKey in optionTradeData);
//   const inFlightRef = React.useRef(new Set());
//   useEffect(() => {
//     let ignore = false;

//     async function run() {
//       const execDate = formattedDateStr || getFormatedDateStrForUSA(new Date());
//       if (!execDate || !tick) return;
//       if (optionTradeData[rowKey]) return;

//       try {
//         // const startTime = `${execDate}T15:30:00`;
//         // const endTime = `${execDate}T15:35:00`;
//         inFlightRef.current.add(rowKey);
//         const [time, period] = parentRow.Time.trim()
//           .toUpperCase()
//           .match(/(\d{1,2}:\d{2})(AM|PM)/)
//           .slice(1);
//         const [hoursStr, minutesStr] = time.split(":");
//         let hours = parseInt(hoursStr, 10);
//         const minutes = parseInt(minutesStr, 10);
//         if (period === "PM" && hours !== 12) {
//           hours += 12;
//         }
//         if (period === "AM" && hours === 12) {
//           hours = 0;
//         }
//         const [year, month, day] = formattedDateStr.split("-").map(Number);
//         const startTime = new Date(year, month - 1, day, hours, minutes);
//         const endTime = new Date(startTime.getTime() + 5 * 60 * 1000);
//         endTime.setMinutes(endTime.getMinutes());

//         const startIso = toLocalISOString(startTime);
//         const endIso = toLocalISOString(endTime);

//         const query = {
//           startTime: startIso,
//           endTime: endIso,
//           optionSymbol: tick,
//           buyOrSell: "BUY",
//         };
//         const res = await getOptionTradeDetails(query);

//         let rows = [];
//         if (Array.isArray(res)) rows = res;
//         else if (Array.isArray(res?.data)) rows = res.data;
//         else if (Array.isArray(res?.rows)) rows = res.rows;
//         else if (Array.isArray(res?.data?.rows)) rows = res.data.rows;

//         rows = (rows || [])
//           .filter((x) =>
//             String(x?.BuyOrSell ?? x?.side ?? x?.orderSide ?? "")
//               .toUpperCase()
//               .includes("BUY")
//           )
//           .map((x, i) => ({
//             id: x.id ?? `${tick}-${x.Time ?? i}`,
//             ...x,
//           }));

//         if (!ignore)
//           setOptionTradeData((prev) => ({ ...prev, [rowKey]: rows }));
//       } catch {
//         if (!ignore) setOptionTradeData((prev) => ({ ...prev, [rowKey]: [] }));
//       } finally {
//         inFlightRef.current.delete(rowKey);
//       }
//     }

//     run();
//     return () => {
//       ignore = true;
//     };
//   }, [rowKey, tick, formattedDateStr, setOptionTradeData]);

//   const headerStyle = {
//     backgroundColor: COLORS.dark3,
//     color: COLORS.dimText,
//     fontSize: 12,
//     fontFamily: "Barlow",
//     textAlign: "center",
//   };

//   const centerWhite = {
//     color: COLORS.white,
//     textAlign: "center",
//     fontFamily: "Barlow",
//     fontSize: 12,
//     fontWeight: 100,
//     width: "100%",
//   };

//   const currencyCellStyle = (p) => {
//     const v = stripMoney(p.value);
//     const colorStyle = currencyColorStyle(v).color;
//     return { ...centerWhite, color: colorStyle };
//   };

//   const tradeCols = useMemo(
//     () => [
//       {
//         headerName: "Time",
//         field: "Time",
//         flex: 1,
//         headerStyle,
//         cellStyle: centerWhite,
//         headerClass: ["cm-header"],
//       },
//       {
//         headerName: "Expiry",
//         field: "Expiry",
//         flex: 1.1,
//         headerStyle,
//         cellStyle: centerWhite,
//         valueFormatter: (pp) => toDDMMYYYY(pp.value),
//         headerClass: ["cm-header"],
//       },
//       {
//         headerName: "Tick",
//         field: "Tick",
//         flex: 0.9,
//         headerStyle,
//         cellStyle: { ...centerWhite, color: COLORS.lime, fontWeight: 400 },
//         headerClass: ["cm-header"],
//       },
//       {
//         headerName: "Type",
//         field: "Type",
//         flex: 1,
//         headerStyle,
//         cellStyle: centerWhite,
//         headerClass: ["cm-header"],
//       },
//       {
//         headerName: "Side",
//         field: "BuyOrSell",
//         flex: 0.7,
//         headerStyle,

//         headerClass: ["cm-header"],
//       },
//       {
//         headerName: "Strike",
//         field: "Strike",
//         flex: 0.7,
//         headerStyle,
//         cellStyle: centerWhite,
//         headerClass: ["cm-header"],
//       },
//       {
//         headerName: "Spot",
//         field: "Spot",
//         flex: 1,
//         headerStyle,
//         cellStyle: centerWhite,
//         headerClass: ["cm-header"],
//       },
//       {
//         headerName: "TotalCost",
//         field: "TotalCost",
//         flex: 1,
//         headerStyle,
//         cellStyle: currencyCellStyle,
//         valueFormatter: (pp) => formatNumberToCurrency(pp.value),
//         headerClass: ["cm-header"],
//       },
//       {
//         headerName: "SpotStrikeDiff",
//         field: "SpotStrikeDiff",
//         flex: 1.0,
//         headerStyle,
//         cellStyle: centerWhite,
//         headerClass: ["cm-header"],
//       },
//       {
//         headerName: "Price",
//         field: "Price",
//         flex: 1.0,
//         headerStyle,
//         cellStyle: centerWhite,
//         headerClass: ["cm-header"],
//       },
//       {
//         headerName: "TimeDiff",
//         field: "TimeDiff",
//         flex: 1.0,
//         headerStyle,
//         cellStyle: centerWhite,
//         headerClass: ["cm-header", "no-resize"],
//       },
//       {
//         headerName: "",
//         field: "",
//         flex: 1.0,
//         headerStyle,
//         cellStyle: centerWhite,
//       },
//       {
//         headerName: "",
//         field: "",
//         flex: 1.0,
//         headerStyle,
//         cellStyle: centerWhite,
//       },
//       {
//         headerName: "",
//         field: "",
//         flex: 1.0,
//         headerStyle,
//         cellStyle: centerWhite,
//       },
//     ],
//     []
//   );

//   const getLevelThirdRowStyle = useCallback((params) => {
//     const isEvenRow = params.node.rowIndex % 2 === 0;
//     return {
//       background: isEvenRow ? COLORS.dark4 : COLORS.dark3,
//       color: COLORS.white,
//       fontWeight: 100,
//       fontSize: 12,
//       fontFamily: "Barlow",
//       transition: "opacity 0.3s ease-in-out",
//     };
//   }, []);

//   return (
//     <div className="ag-theme-quartz no-padding-grid" style={{ width: "100%" }}>
//       <AgGridReact
//         className="third-grid no-padding-grid"
//         rowData={Array.isArray(data) ? data : []}
//         columnDefs={tradeCols}
//         headerHeight={HEADER_H_L3}
//         suppressRowHoverHighlight={true}
//         rowHeight={ROW_H_L3}
//         defaultColDef={{
//           resizable: true,
//           wrapHeaderText: true,
//           autoHeaderHeight: true,
//         }}
//         suppressCellFocus
//         overlayNoRowsTemplate={
//           isLoading
//             ? '<div class="overlay-center"><div class="spinner"></div><div class="loader-msg">Fetching trades…</div></div>'
//             : "No trades"
//         }
//         getRowId={(pp) =>
//           pp?.data?.id ||
//           `${pp?.data?.Tick ?? ""}-${pp?.data?.Time ?? ""}-${pp?.rowIndex ?? 0}`
//         }
//         getRowStyle={getLevelThirdRowStyle}
//         domLayout="autoHeight"
//         suppressHorizontalScroll
//         suppressVerticalScroll
//         style={{ width: "100%" }}
//       />
//     </div>
//   );
// }

// function toLocalISOString(date) {
//   const pad = (num) => String(num).padStart(2, "0");
//   return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
//     date.getDate()
//   )}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
//     date.getSeconds()
//   )}`;
// }



 

 