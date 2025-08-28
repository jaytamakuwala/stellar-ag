// import { useState, useEffect, useMemo } from "react";
// import {
//   StyledTable,
//   StyleOption,
//   StyleModalFilter,
//   StyleMainDiv,
// } from "../style/containers/AnimatedTable";
// import { Reorder } from "framer-motion";
// import SearchIcon from "@mui/icons-material/Search";
// import TuneIcon from "@mui/icons-material/Tune";
// import {
//   getChartBarData,
//   getChartBubbleData,
//   getChartBubbleExpiryData,
//   getChartPieData,
//   getSummaryData,
//   getSummaryDataMain,
// } from "../service/stellarApi";
// import toast from "react-hot-toast";
// import Header from "./Header";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import useMediaQuery from "@mui/material/useMediaQuery";
// import {
//   USATimeFormatter,
//   formatNumberToCurrency,
//   getFormatedDateStrForUSA,
// } from "../utils/common";
// import RightNavigation from "../pages/RightNavigation";
// import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
// import { AgGridReact } from "ag-grid-react";
// import FilterModal from "./FilterModal";
// import TickChart from "./TickChart";

// ModuleRegistry.registerModules([AllCommunityModule]);

// export default function AnimatedTable() {
//   const [responseData, setResponseData] = useState([]);
//   const [summaryData, setSummaryData] = useState(responseData);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [animationState, setAnimationState] = useState(false);
//   const [filterState, setFilterState] = useState(false);
//   const [showDetails, setShowDetails] = useState(false);
//   const [detailsofRow, setDetailsofRow] = useState();
//   const [animationStateindex, setAnimationStateIndex] = useState(-1);
//   const [date, setDate] = useState(null);
//   const [formattedDateStr, setFormattedDateStr] = useState("");
//   const isSmallScreen = useMediaQuery("(max-width:550px)");
//   const isSmallScreen2 = useMediaQuery("(max-width:1000px)");
//   const [gridApi, setGridApi] = useState(null);

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

//   const [filterModalState, setFilterModalState] = useState({
//     score: 0,
//     totalCallBuyCost: 0,
//     totalPutBuyCost: 0,
//     totalCallSellCost: 0,
//     totalPutSellCost: 0,
//     totalPutCallCost: 0,
//     call2PutBuyRatio: 0,
//     callBuy2CallSellRatio: 0,
//     callBuy2PreviousCallBuy: 0,
//   });

//   const [expandedParent, setExpandedParent] = useState(null);

//   const fetchdata = async () => {
//     try {
//       const todayStr = getFormatedDateStrForUSA(date || new Date());
//       setFormattedDateStr(todayStr);
//       const queryObj = {
//         executionDate: `${todayStr}T00:00:00`,
//         intervalStart: `${todayStr}T09:00:00`,
//         intervalEnd: `${todayStr}T16:45:00`,
//         minsWindows: 5,
//       };
//       const summaryMainRes = await getSummaryDataMain(queryObj);
//       if (!summaryMainRes.ok) {
//         throw new Error(
//           summaryMainRes.error?.error || "Failed to fetch summary main data"
//         );
//       }
//       setResponseData(summaryMainRes.data);
//       const summaryRes = await getSummaryData(queryObj);
//       if (!summaryRes.ok) {
//         throw new Error(
//           summaryRes.error?.error || "Failed to fetch summary data"
//         );
//       }
//       setSummaryData(summaryRes.data);
//     } catch (error) {
//       console.error(error);
//       toast.error(error.message || "Something went wrong");
//     }
//   };

//   const handleModalEvent = (index, symbol) => {
//     toggleAccordion("", "");
//     setAnimationState(true);
//     setAnimationStateIndex(index);
//     handleCloseDetails();
//     getAllChartsData(symbol);
//   };

//   const getAllChartsData = async (symbol) => {
//     const basePayload = {
//       optionSymbol: symbol,
//       executionDate: formattedDateStr,
//     };

//     await Promise.all([
//       getBubbleChartData(basePayload),
//       getPieChartData(basePayload),
//       getBarChartData(basePayload),
//       getChartBubbleExpiry(basePayload),
//       getBarChartDataForBarPlot(symbol),
//     ]);
//   };

//   const getBubbleChartData = async (basePayload) => {
//     const response = await getChartBubbleData(basePayload);
//     if (response.ok) {
//       setChartData((prev) => ({ ...prev, bubble: response.data }));
//     }
//   };

//   const getPieChartData = async (basePayload) => {
//     const response = await getChartPieData(basePayload);
//     if (response.ok) {
//       setChartData((prev) => ({ ...prev, pie: response.data }));
//     }
//   };

//   const getBarChartData = async (basePayload) => {
//     const payload = {
//       ...basePayload,
//       optionType: "P",
//       intervalMin: "60",
//     };
//     const putBarResponseData = await getChartBarData(payload);
//     if (putBarResponseData.ok) {
//       setChartData((prev) => ({ ...prev, putBar: putBarResponseData.data }));
//     }
//     const callBarPayload = { ...payload, optionType: "C" };
//     const callBarResponseData = await getChartBarData(callBarPayload);
//     if (callBarResponseData.ok) {
//       setChartData((prev) => ({ ...prev, callBar: callBarResponseData.data }));
//     }
//   };

//   const getBarChartDataForBarPlot = async (optionSymbol) => {
//     const todayStr = getFormatedDateStrForUSA(new Date());

//     let selectedOrPreviousDateStr;
//     if (date && formattedDateStr) {
//       selectedOrPreviousDateStr = formattedDateStr;
//     } else {
//       const yesterday = new Date();
//       yesterday.setDate(yesterday.getDate() - 1);
//       selectedOrPreviousDateStr = getFormatedDateStrForUSA(yesterday);
//     }

//     const payload = {
//       optionSymbol,
//       optionType: "P",
//       intervalMin: 60,
//       executionDate: todayStr,
//     };

//     const putBarResponseData = await getChartBarData(payload);
//     if (putBarResponseData.ok) {
//       putBarResponseData.data?.forEach((data) => (data.date = todayStr));
//       setChartData((prev) => ({
//         ...prev,
//         currentDayPutBarPlotData: putBarResponseData.data,
//       }));
//     }
//     const callBarPayload = { ...payload, optionType: "C" };
//     const callBarResponseData = await getChartBarData(callBarPayload);
//     if (callBarResponseData.ok) {
//       callBarResponseData.data?.forEach((data) => (data.date = todayStr));
//       setChartData((prev) => ({
//         ...prev,
//         currentDayCallBarPlotData: callBarResponseData.data,
//       }));
//     }

//     const prevPayload = {
//       optionSymbol,
//       optionType: "P",
//       intervalMin: 60,
//       executionDate: selectedOrPreviousDateStr,
//     };

//     const prevPutBarResponseData = await getChartBarData(prevPayload);
//     if (prevPutBarResponseData.ok) {
//       prevPutBarResponseData.data?.forEach(
//         (data) => (data.date = selectedOrPreviousDateStr)
//       );
//       setChartData((prev) => ({
//         ...prev,
//         selectedOrPreviousPutBarPlotData: prevPutBarResponseData.data,
//       }));
//     }
//     const prevCallBarPayload = { ...prevPayload, optionType: "C" };
//     const prevCallBarResponseData = await getChartBarData(prevCallBarPayload);
//     if (prevCallBarResponseData.ok) {
//       prevCallBarResponseData.data?.forEach(
//         (data) => (data.date = selectedOrPreviousDateStr)
//       );
//       setChartData((prev) => ({
//         ...prev,
//         selectedOrPreviousCallBarPlotData: prevCallBarResponseData.data,
//       }));
//     }
//   };

//   const getChartBubbleExpiry = async (basePayload) => {
//     const payload = {
//       ...basePayload,
//       optionType: "C",
//     };
//     const response = await getChartBubbleExpiryData(payload);
//     if (response.ok) {
//       setChartData((prev) => ({ ...prev, callBubbleExpiry: response.data }));
//     }
//     const putBubbleExpiryPayload = { ...payload, optionType: "P" };
//     const putBubbleExpiryResponseData = await getChartBubbleExpiryData(
//       putBubbleExpiryPayload
//     );
//     if (putBubbleExpiryResponseData.ok) {
//       setChartData((prev) => ({
//         ...prev,
//         putBubbleExpiry: putBubbleExpiryResponseData.data,
//       }));
//     }
//   };

//   const combinedBubbleExpiry = useMemo(() => {
//     return [...chartData.callBubbleExpiry, ...chartData.putBubbleExpiry];
//   }, [chartData.callBubbleExpiry, chartData.putBubbleExpiry]);

//   const groupedByDate = useMemo(() => {
//     if (!combinedBubbleExpiry.length) return {};

//     return combinedBubbleExpiry.reduce((acc, item) => {
//       const date = item.ExpirationDate;
//       if (!acc[date]) acc[date] = [];
//       acc[date].push(item);
//       return acc;
//     }, {});
//   }, [combinedBubbleExpiry]);

//   const handleModalEventClose = () => {
//     setAnimationState(false);
//     setAnimationStateIndex(-1);
//   };

//   useEffect(() => {
//     fetchdata();

//     const intervalId = setInterval(() => {
//       const now = new Date();
//       const timeInNewYork = USATimeFormatter.formatToParts(now);
//       const hour = parseInt(
//         timeInNewYork.find((p) => p.type === "hour")?.value || "0",
//         10
//       );
//       const minute = parseInt(
//         timeInNewYork.find((p) => p.type === "minute")?.value || "0",
//         10
//       );

//       const totalMinutes = hour * 60 + minute;
//       if (totalMinutes >= 540 && totalMinutes <= 1005) {
//         fetchdata();
//       }
//     }, 10000);

//     return () => clearInterval(intervalId);
//   }, [date]);

//   const handleCloseDetails = () => {
//     setShowDetails(false);
//   };
//   const handleFilerOption = () => {
//     setFilterState(true);
//   };
//   const handleFilerOptionClose = () => {
//     setFilterState(false);
//   };
//   const [expandedRowIndex, setExpandedRowIndex] = useState(null);
//   const [highlightedChildIndex, setHighlightedChildIndex] = useState(null);
//   const [highlightAllChildren, setHighlightAllChildren] = useState(false);

//   const toggleAccordion = (symbol, index) => {
//     const isExpanding = expandedRowIndex !== index;

//     setExpandedRowIndex((prev) => (prev === index ? null : index));
//     const filteredDataRes = summaryData.filter((data) => data.Tick === symbol);
//     handleModalEventClose();

//     setHighlightAllChildren(isExpanding);
//     setHighlightedChildIndex(null);
//     setShowDetails(false);
//   };

//   const filteredResponseData = useMemo(() => {
//     return responseData.filter((row) =>
//       row.Tick?.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [responseData, searchTerm]);
//   const [rowData, setRowData] = useState(filteredResponseData);

//   useEffect(() => {
//     if (!filteredResponseData) return;

//     let next = [...filteredResponseData];

//     if (expandedParent) {
//       const idx = next.findIndex((r) => r.Tick === expandedParent);
//       if (idx >= 0) {
//         const children = summaryData
//           .filter((d) => d.Tick === expandedParent)
//           .map((d) => ({ ...d, _parentId: expandedParent }));
//         next.splice(idx + 1, 0, ...children);
//       }
//     }

//     setRowData(next);
//   }, [filteredResponseData, summaryData, expandedParent]);

//   useEffect(() => {
//     function handleClickOutside(e) {
//       const tr = e.target.closest("tr[data-parent-row]");
//       const clickedIdx = tr ? Number(tr.dataset.parentRow) : null;
//       if (expandedRowIndex !== null && clickedIdx !== expandedRowIndex) {
//         setExpandedRowIndex(null);
//         setShowDetails(false);
//         setHighlightAllChildren(false);
//         setHighlightedChildIndex(null);
//       }
//     }

//     document.addEventListener("click", handleClickOutside, true);
//     return () =>
//       document.removeEventListener("click", handleClickOutside, true);
//   }, [expandedRowIndex]);

//   const getRowStyle = (params) => {
//     const row = params.data;
//     const prob = Number(row.Probability?.replace("%", "") || 0);

//     const isExpandedParent = expandedParent === row.Tick;
//     const isChildOfExpanded = row._parentId === expandedParent;
//     const isDimmed =
//       expandedParent !== null && !isExpandedParent && !isChildOfExpanded;

//     const gradient =
//       prob >= 90
//         ? "linear-gradient(180deg, rgba(178, 74, 242, 0.3) 0%, rgba(178, 74, 242, 0.8) 100%)"
//         : prob >= 80
//         ? "linear-gradient(180deg, rgba(60, 175, 200, 0.3) 0%, rgba(60, 175, 200, 0.8) 100%)"
//         : "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)";

//     return {
//       background: `${gradient}, #000`,
//       color: "#fff",
//       opacity: isDimmed ? 0.3 : 1,
//       pointerEvents: isDimmed ? "none" : "auto",
//       transition: "opacity 0.3s ease-in-out",
//     };
//   };

//   useEffect(() => {
//     let chartIntervalId;

//     const fetchChartData = () => {
//       const now = new Date();
//       const timeInNewYork = USATimeFormatter.formatToParts(now);
//       const hour = parseInt(
//         timeInNewYork.find((p) => p.type === "hour")?.value || "0",
//         10
//       );
//       const minute = parseInt(
//         timeInNewYork.find((p) => p.type === "minute")?.value || "0",
//         10
//       );

//       const totalMinutes = hour * 60 + minute;
//       const selectedSymbol = detailsofRow?.Tick;

//       if (selectedSymbol) {
//         if (totalMinutes >= 540 && totalMinutes <= 1005) {
//           chartIntervalId = setInterval(() => {
//             getAllChartsData(selectedSymbol);
//           }, 5000);
//         } else {
//           getAllChartsData(selectedSymbol);
//         }
//       }
//     };

//     if (animationState) {
//       fetchChartData();
//     }

//     return () => {
//       if (chartIntervalId) clearInterval(chartIntervalId);
//     };
//   }, [animationState, animationStateindex, detailsofRow, formattedDateStr]);

//   useEffect(() => {
//     if (gridApi) {
//       gridApi.refreshCells({ columns: ["expand"], force: true });
//     }
//   }, [summaryData, gridApi]);

//   const toggleRow = (row) => {
//     if (expandedParent === row.Tick) {
//       setExpandedParent(null);
//       setRowData((prev) => prev.filter((r) => r._parentId !== row.Tick));
//     } else {
//       setExpandedParent(row.Tick);
//       const children = summaryData
//         .filter((d) => d.Tick === row.Tick)
//         .map((d) => ({ ...d, _parentId: row.Tick }));

//       setRowData((prev) => {
//         const idx = prev.findIndex((r) => r.Tick === row.Tick);
//         const next = [...prev];
//         next.splice(idx + 1, 0, ...children);
//         return next;
//       });
//     }
//   };

//   const [colDefs, setColDefs] = useState([
//     {
//       field: "Time",
//       headerName: "Time",
//       width: 120,
//       cellClass: "whiteTdContent",
//     },
//     {
//       field: "Tick",
//       headerName: "Tick",
//       width: 120,
//       cellClass: "whiteTdContent",
//     },
//     {
//       field: "Probability",
//       headerName: "Probability",
//       width: 120,
//       cellClass: "whiteTdContent",
//     },
//     {
//       field: "CallCount",
//       headerName: "Call Count",
//       width: 120,
//       cellClass: "whiteTdContent",
//     },
//     {
//       field: "cbTotalCost",
//       headerName: "CB Total",
//       width: 150,
//       cellClass: (params) =>
//         `whiteTdContent ${
//           Number(params.value?.replace(/,/g, "")) > 1000000
//             ? "green-font"
//             : Number(params.value?.replace(/,/g, "")) > 500000
//             ? "yellow-font"
//             : ""
//         }`,
//       valueFormatter: (params) => formatNumberToCurrency(params.value),
//     },
//     {
//       field: "csTotalCost",
//       headerName: "CS Total",
//       width: 150,
//       cellClass: (params) =>
//         `whiteTdContent ${
//           Number(params.value?.replace(/,/g, "")) > 1000000
//             ? "green-font"
//             : Number(params.value?.replace(/,/g, "")) > 500000
//             ? "yellow-font"
//             : ""
//         }`,
//       valueFormatter: (params) => formatNumberToCurrency(params.value),
//     },
//     {
//       field: "pbTotalCost",
//       headerName: "PB Total",
//       width: 150,
//       cellClass: (params) => {
//         return `whiteTdContent ${
//           Number(params.value?.replace(/,/g, "")) > 1000000
//             ? "green-font"
//             : Number(params.value?.replace(/,/g, "")) > 500000
//             ? "yellow-font"
//             : ""
//         }`;
//       },
//       valueFormatter: (params) => formatNumberToCurrency(params.value),
//     },
//     {
//       field: "psTotalCost",
//       headerName: "PS Total",
//       width: 150,
//       cellClass: (params) =>
//         `whiteTdContent ${
//           Number(params.value?.replace(/,/g, "")) > 1000000
//             ? "green-font"
//             : Number(params.value?.replace(/,/g, "")) > 500000
//             ? "yellow-font"
//             : ""
//         }`,
//       valueFormatter: (params) => formatNumberToCurrency(params.value),
//     },
//     {
//       field: "CallBx",
//       headerName: "CallBx",
//       width: 120,
//       cellClass: (params) => {
//         return `whiteTdContent ${
//           Number(params.value) >= 10 ? "sky-blue-font" : ""
//         }`;
//       },
//     },
//     {
//       field: "CallPutBX",
//       headerName: "CallPutBX",
//       width: 120,
//       cellClass: "whiteTdContent",
//     },
//     {
//       field: "CallBSX",
//       headerName: "CallBSX",
//       width: 120,
//       cellClass: "whiteTdContent",
//     },
//     {
//       field: "Last5Min",
//       headerName: "Last 5 Min",
//       width: 150,
//       cellClass: (params) =>
//         `whiteTdContent ${
//           Number(params.value?.replace(/,/g, "")) > 1000000
//             ? "green-font"
//             : Number(params.value?.replace(/,/g, "")) > 500000
//             ? "yellow-font"
//             : ""
//         }`,
//       valueFormatter: (params) =>
//         params.value
//           ? formatNumberToCurrency(params.value).replace("$", "")
//           : "",
//     },
//     {
//       field: "Last5DayAvg",
//       headerName: "Last 5 Day Avg",
//       width: 150,
//       cellClass: (params) =>
//         `whiteTdContent ${
//           Number(params.value?.replace(/,/g, "")) > 1000000
//             ? "green-font"
//             : Number(params.value?.replace(/,/g, "")) > 500000
//             ? "yellow-font"
//             : ""
//         }`,
//       valueFormatter: (params) =>
//         params.value
//           ? formatNumberToCurrency(params.value).replace("$", "")
//           : "",
//     },
//     {
//       headerName: "Actions",
//       width: 100,
//       cellRenderer: (params) => {
//         return (
//           <img
//             src="analysis.svg"
//             alt="action"
//             style={{ cursor: "pointer" }}
//             onClick={(e) => {
//               e.stopPropagation();
//               handleModalEvent(params.rowIndex, params.data.Tick);
//               setDetailsofRow(params.data);
//             }}
//           />
//         );
//       },
//     },
//   ]);
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
//                   marginLeft: "15px",
//                   borderRadius: "5px",
//                   margin: "5px",
//                   height: "35px",
//                   display: "flex",
//                   alignItems: "center",
//                 }}
//               >
//                 <LocalizationProvider dateAdapter={AdapterDateFns}>
//                   <DatePicker
//                     value={date}
//                     onChange={(newDate) => setDate(newDate)}
//                     disableFuture
//                     renderInput={(params) => <TextField {...params} />}
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
//                   onClick={() => handleFilerOption()}
//                 >
//                   <TuneIcon />
//                   Filter{" "}
//                   <span
//                     className="badge bg-warning text-dark"
//                     style={{ position: "relative", top: "0px" }}
//                   >
//                     0
//                   </span>
//                 </button>
//               </div>
//             </div>
//           </StyleOption>
//           <StyledTable className="ModeShow">
//             <Reorder.Group values={responseData} onReorder={setResponseData}>
//               <div style={{ overflowX: "auto", width: "100%" }}>
//                 <div className="Tbodyscroll1">
//                   <table
//                     style={{
//                       width: "100%",
//                       borderCollapse: "collapse",
//                     }}
//                   >
//                     <tbody>
//                       <div
//                         className="ag-theme-quartz"
//                         style={{ height: "600px", width: "100%" }}
//                       >
//                         <AgGridReact
//                           rowData={rowData}
//                           columnDefs={colDefs}
//                           defaultColDef={{
//                             flex: 1,
//                             sortable: false,
//                             resizable: false,
//                             filter: false,
//                           }}
//                           animateRows={true}
//                           deltaRowDataMode={true}
//                           getRowId={(params) => {
//                             return params.data._parentId
//                               ? `${params.data._parentId}-${params.data.Tick}-${params.data.Time}`
//                               : params.data.Tick;
//                           }}
//                           getRowStyle={(params) => getRowStyle(params)}
//                           onGridReady={(params) => setGridApi(params.api)}
//                           onRowClicked={(event) => {
//                             if (event.data._parentId) return;
//                             toggleRow(event.data);
//                           }}
//                         />
//                       </div>
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </Reorder.Group>
//           </StyledTable>
//         </>
//       ) : (
//         ""
//       )}
//       <TickChart
//         animationState={animationState}
//         isSmallScreen={isSmallScreen}
//         detailsofRow={detailsofRow}
//         chartData={chartData}
//         groupedByDate={groupedByDate}
//         isSmallScreen2={isSmallScreen2}
//         handleModalEventClose={handleModalEventClose}
//       />
//       {filterState ? (
//         <StyleModalFilter>
//           <FilterModal
//             filterState={filterState}
//             filterModalState={filterModalState}
//             handleFilerOptionClose={handleFilerOptionClose}
//             setFilterModalState={(event) => {
//               const { name, value } = event.target;
//               setFilterModalState({ ...filterModalState, [name]: value });
//             }}
//           />
//         </StyleModalFilter>
//       ) : (
//         ""
//       )}
//     </StyleMainDiv>
//   );
// }
