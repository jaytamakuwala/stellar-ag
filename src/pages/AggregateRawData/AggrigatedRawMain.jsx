import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useContext,
  useRef,
} from "react";
import {
  StyleMainDiv,
  StyleModalFilter,
} from "../../style/containers/AnimatedTable";
import RightNavigation from "../../components/RightNavigation";
import Aggrigated from "./components/AggrigatedRaw.jsx";
import FilterModal from "../../components/FilterModal";
import DualGridHeader from "../../components/DualGridHeader";
import TickChart from "./components/TickChart";
import {
  getChartBarData,
  getChartBubbleData,
  getChartBubbleExpiryData,
  getChartPieData,
} from "../../service/stellarApi";
import { useMediaQuery } from "@mui/material";
import { getFormatedDateStrForUSA } from "../../utils/common";
import AiPowerData from "./components/AiPowerData";
import { UserContext } from "../../context/UserContext";
import { COLORS } from "../../utils/constants";
// import {
//   formatNumberToCurrency,
//   getFormatedDateStrForUSA,
//   getParentRowId,
//   stableParentId,
//   isSameDay,
//   USATimeFormatter,
//   currencyColorStyle,
//   safeGetDefsCount,
// } from "../../utils/common";
// import {
//   getSummaryData,
//   getSummaryDataMain,
//   getAipowerAlerts,
// } from "../../service/stellarApi";
// import {
//   reconcileByIndex,
//   formatUS,
//   nyWeekday,
//   nyMinutesNow,
//   prevTradingDate,
//   buildPayloadUS,
// } from "../../utils/agGridHelper";

export default function AnimatedTable() {
  const [filterState, setFilterState] = useState(false);
  const [animationState, setAnimationState] = useState(false);
  const [filterModalState, setFilterModalState] = useState({
    score: 0,
    totalCallBuyCost: 0,
    totalPutBuyCost: 0,
    totalCallSellCost: 0,
    totalPutSellCost: 0,
    totalPutCallCost: 0,
    call2PutBuyRatio: 0,
    callBuy2CallSellRatio: 0,
    callBuy2PreviousCallBuy: 0,
  });
  const [chartData, setChartData] = useState({
    putBar: [],
    callBar: [],
    pie: [],
    bubble: [],
    callBubbleExpiry: [],
    putBubbleExpiry: [],
    currentDayPutBarPlotData: [],
    currentDayCallBarPlotData: [],
    selectedOrPreviousPutBarPlotData: [],
    selectedOrPreviousCallBarPlotData: [],
  });
  const isSmallScreen = useMediaQuery("(max-width:550px)");
  const isSmallScreen2 = useMediaQuery("(max-width:1000px)");
  const [detailsofRow, setDetailsofRow] = useState();
  const [formattedDateStr, setFormattedDateStr] = useState("");
  const { selectedDate, setSelectedDate, searchTerm, setSearchTerm } =
    useContext(UserContext);

  let selectedSummaryData = [];
  useEffect(() => {
    console.log({ selectedDate });

    if (selectedDate) {
      setFormattedDateStr(getFormatedDateStrForUSA(selectedDate));
    } else {
      setFormattedDateStr("");
    }
  }, [selectedDate]);

  const getBubbleChartData = async (basePayload) => {
    const response = await getChartBubbleData(basePayload);
    if (response?.ok)
      setChartData((prev) => ({ ...prev, bubble: response.data || [] }));
  };

  const getPieChartData = async (basePayload) => {
    const response = await getChartPieData(basePayload);
    if (response?.ok)
      setChartData((prev) => ({ ...prev, pie: response.data || [] }));
  };

  const getBarChartData = async (basePayload) => {
    const [putBarResponseData, callBarResponseData] = await Promise.all([
      getChartBarData({ ...basePayload, optionType: "P", intervalMin: "60" }),
      getChartBarData({ ...basePayload, optionType: "C", intervalMin: "60" }),
    ]);

    if (putBarResponseData?.ok) {
      setChartData((prev) => ({
        ...prev,
        putBar: putBarResponseData.data || [],
      }));
    }
    if (callBarResponseData?.ok) {
      setChartData((prev) => ({
        ...prev,
        callBar: callBarResponseData.data || [],
      }));
    }
  };

  const getBarChartDataForBarPlot = async (optionSymbol) => {
    const todayStr = getFormatedDateStrForUSA(new Date());
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = getFormatedDateStrForUSA(yesterday);

    const execDate =
      formattedDateStr || getFormatedDateStrForUSA(selectedDate || new Date());
    const selectedOrPreviousDateStr =
      execDate === todayStr ? yesterdayStr : execDate;

    const [putToday, callToday, putPrev, callPrev] = await Promise.all([
      getChartBarData({
        optionSymbol,
        optionType: "P",
        intervalMin: 60,
        executionDate: todayStr,
      }),
      getChartBarData({
        optionSymbol,
        optionType: "C",
        intervalMin: 60,
        executionDate: todayStr,
      }),
      getChartBarData({
        optionSymbol,
        optionType: "P",
        intervalMin: 60,
        executionDate: selectedOrPreviousDateStr,
      }),
      getChartBarData({
        optionSymbol,
        optionType: "C",
        intervalMin: 60,
        executionDate: selectedOrPreviousDateStr,
      }),
    ]);

    if (putToday?.ok) {
      setChartData((prev) => ({
        ...prev,
        currentDayPutBarPlotData: (putToday.data || []).map((d) => ({
          ...d,
          date: todayStr,
        })),
      }));
    }
    if (callToday?.ok) {
      setChartData((prev) => ({
        ...prev,
        currentDayCallBarPlotData: (callToday.data || []).map((d) => ({
          ...d,
          date: todayStr,
        })),
      }));
    }
    if (putPrev?.ok) {
      setChartData((prev) => ({
        ...prev,
        selectedOrPreviousPutBarPlotData: (putPrev.data || []).map((d) => ({
          ...d,
          date: selectedOrPreviousDateStr,
        })),
      }));
    }
    if (callPrev?.ok) {
      setChartData((prev) => ({
        ...prev,
        selectedOrPreviousCallBarPlotData: (callPrev.data || []).map((d) => ({
          ...d,
          date: selectedOrPreviousDateStr,
        })),
      }));
    }
  };

  const getChartBubbleExpiry = async (basePayload) => {
    const [callResponse, putResponse] = await Promise.all([
      getChartBubbleExpiryData({ ...basePayload, optionType: "C" }),
      getChartBubbleExpiryData({ ...basePayload, optionType: "P" }),
    ]);

    if (callResponse?.ok) {
      setChartData((prev) => ({
        ...prev,
        callBubbleExpiry: callResponse.data || [],
      }));
    }
    if (putResponse?.ok) {
      setChartData((prev) => ({
        ...prev,
        putBubbleExpiry: putResponse.data || [],
      }));
    }
  };

  const getAllChartsData = useCallback(
    async (symbol, executionDateOverride) => {
      const execDate =
        executionDateOverride ||
        formattedDateStr ||
        getFormatedDateStrForUSA(selectedDate || new Date());

      const basePayload = { optionSymbol: symbol, executionDate: execDate };
      try {
        await Promise.all([
          getBubbleChartData(basePayload),
          getPieChartData(basePayload),
          getBarChartData(basePayload),
          getChartBubbleExpiry(basePayload),
          getBarChartDataForBarPlot(symbol),
        ]);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load chart data");
      }
    },
    [selectedDate, formattedDateStr]
  );

  const combinedBubbleExpiry = useMemo(
    () => [
      ...(chartData.callBubbleExpiry || []),
      ...(chartData.putBubbleExpiry || []),
    ],
    [chartData.callBubbleExpiry, chartData.putBubbleExpiry]
  );

  const groupedByDate = useMemo(() => {
    if (!combinedBubbleExpiry.length) return {};
    return combinedBubbleExpiry.reduce((acc, item) => {
      const d = item?.ExpirationDate;
      if (!d) return acc;
      if (!acc[d]) acc[d] = [];
      acc[d].push(item);
      return acc;
    }, {});
  }, [combinedBubbleExpiry]);

  const handleModalEvent = useCallback(
    (index, symbol) => {
      setAnimationState(true);
      setDetailsofRow({ Tick: symbol });
      // Reset data so you don't see stale series while loading
      setChartData({
        putBar: [],
        callBar: [],
        pie: [],
        bubble: [],
        callBubbleExpiry: [],
        putBubbleExpiry: [],
        currentDayPutBarPlotData: [],
        currentDayCallBarPlotData: [],
        selectedOrPreviousPutBarPlotData: [],
        selectedOrPreviousCallBarPlotData: [],
      });

      getAllChartsData(symbol, formattedDateStr);
    },
    [getAllChartsData, formattedDateStr]
  );

  const handleModalEventClose = useCallback(() => {
    setAnimationState(false);
  }, []);

  const handleFilerOptionClose = useCallback(() => setFilterState(false), []);

  // const [responseData, setResponseData] = useState([]);
  // const [summaryData, setSummaryData] = useState([]);
  // const summaryDataRef = useRef([]); // always fresh for renderers
  // useEffect(() => {
  //   summaryDataRef.current = summaryData;
  // }, [summaryData]);
  // const [rows, setRows] = useState([]);

  // const fetchdata = useCallback(async () => {
  //   try {
  //     // If user picked a date, respect it; else use session logic
  //     const primaryDate = selectedDate ? new Date(selectedDate) : new Date();
  //     const fallbackDate = new Date(primaryDate);

  //     const primaryPayload = buildPayloadUS(primaryDate, "Bull");
  //     const fallbackPayload = buildPayloadUS(fallbackDate, "Bull");

  //     // reflect date used in UI (US string)
  //     setFormattedDateStr(formatUS(primaryDate));

  //     const callBoth = async (payload) => {
  //       const [main, sub] = await Promise.all([
  //         getSummaryDataMain(payload),
  //         getSummaryData(payload),
  //       ]);
  //       if (!main?.ok)
  //         throw new Error(main?.error?.error || "Main fetch failed");
  //       if (!sub?.ok)
  //         throw new Error(sub?.error?.error || "Summary fetch failed");
  //       return { main: main.data || [], sub: sub.data || [] };
  //     };

  //     let usedDate = primaryDate;
  //     let data;
  //     try {
  //       data = await callBoth(primaryPayload);
  //       if (!data.main.length && !data.sub.length) {
  //         throw new Error("No data for primary date");
  //       }
  //     } catch {
  //       data = await callBoth(fallbackPayload);
  //       usedDate = fallbackDate;
  //       setFormattedDateStr(formatUS(usedDate));
  //     }

  //     const incoming = data.main || [];
  //     const inComingSummary = data.sub || [];
  //     setResponseData((prev) =>
  //       reconcileByIndex(
  //         prev,
  //         incoming,
  //         (row, idx) => getParentRowId(row, idx),
  //         ["Tick"]
  //       )
  //     );
  //     setSummaryData(inComingSummary);
  //     console.log("setSummaryData");
  //   } catch (error) {
  //     console.error(error);
  //     toast.error(error.message || "Something went wrong");
  //   }
  // }, [selectedDate, setFormattedDateStr]);

  // const Aipowerfetchdata = useCallback(async () => {
  //   try {
  //     const primaryDate = selectedDate ? new Date(selectedDate) : new Date();

  //     const buildPayload = (selectedDate) => ({
  //       alertDate: formatUS(selectedDate),
  //       algo: "V1",
  //     });
  //     setFormattedDateStr(formatUS(primaryDate));

  //     const tryCall = async (buildPayload) => {
  //       const res = await getAipowerAlerts(buildPayload);
  //       if (!res?.ok) {
  //         throw new Error(res?.error?.error || "Failed to fetch AiPower Data");
  //       }
  //       return res;
  //     };

  //     let usedDate = primaryDate;
  //     let res = await tryCall(buildPayload(primaryDate));

  //     if (!Array.isArray(res.data) || res.data.length === 0) {
  //       // const fallbackDate = prevTradingDate(primaryDate);
  //       // res = await tryCall(buildPayload(fallbackDate));
  //       // usedDate = fallbackDate;
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
  //   } catch (error) {
  //     console.error("[fetchdata] error:", error);
  //     toast.error(error.message || "Something went wrong");
  //   }
  // }, [selectedDate, setFormattedDateStr]);

  // useEffect(() => {
  //   let intervalId;
  //   const run = () => {
  //     fetchdata();
  //     Aipowerfetchdata();
  //   };
  //   if (selectedDate) {
  //     // explicit date: single fetch
  //     run();
  //   } else {
  //     const wd = nyWeekday(new Date());
  //     const nowMin = nyMinutesNow();
  //     const OPEN = 9 * 60 + 30; // 09:30
  //     const CLOSE = 16 * 60 + 45; // 16:45 window end aligned with your payload

  //     if (wd < 1 || wd > 5) {
  //       // weekend: once (uses prev trading day)
  //       run();
  //     } else if (nowMin < OPEN || nowMin > CLOSE) {
  //       // off-hours: once (prev trading day before open, same day after close)
  //       run();
  //     } else {
  //       run();
  //       intervalId = setInterval(run,  5000);
  //     }
  //   }
  //   return () => intervalId && clearInterval(intervalId);
  // }, [selectedDate, fetchdata]);

  return (
    <StyleMainDiv
      style={{ display: "flex", flexDirection: "column", height: "100vh" }}
    >
      {/* Right Navigation */}
      <RightNavigation />

      {/* Dual Chart Header */}

      {!animationState ? (
        <>
          <DualGridHeader
            selectedDate={selectedDate}
            setSelectedDate={(selectedDate) => setSelectedDate(selectedDate)}
            searchTerm={searchTerm}
            setSearchTerm={(data) => setSearchTerm(data)}
            filterState={filterState}
            setFilterState={(data) => setFilterState(data)}
            // hader={"Aggregated Option Data"}
          />
          {filterState ? (
            <StyleModalFilter>
              <FilterModal
                filterState={filterState}
                filterModalState={filterModalState}
                handleFilerOptionClose={handleFilerOptionClose}
                setFilterModalState={(event) => {
                  const { name, value } = event.target;
                  setFilterModalState({ ...filterModalState, [name]: value });
                }}
              />
            </StyleModalFilter>
          ) : null}
          <div
            style={{
              display: "flex",
              flex: 1,
            }}
          >
            {/* First Grid */}
            <div
              style={{
                flex: 1.2,
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <div style={{ flex: 1, overflow: "auto", marginLeft: "-60px" }}>
                <Aggrigated
                  Type={"Bull"}
                  buyOrSell="BUY"
                  optionType={"C"}
                  Containcolor={COLORS.lime}
                  selectedDate={selectedDate}
                  searchTerm={searchTerm}
                  handleModalEvent={(idx, symbol) => {
                    handleModalEvent(idx, symbol);
                  }}
                  setDetailsofRow={(data) => setDetailsofRow(data)}
                  animationState={animationState}
                  formattedDateStr={formattedDateStr}
                  setFormattedDateStr={(data) => setFormattedDateStr(data)}
                  selectedSummaryData={selectedSummaryData}
                  hader={"Aggregated Call Buys"}
                />
              </div>
            </div>
            <div
              style={{
                flex: 0.8,
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                height: "100vh",
              }}
            >
              <div>
                <AiPowerData
                  selectedDate={selectedDate}
                  searchTerm={searchTerm}
                  animationState={animationState}
                  formattedDateStr={formattedDateStr}
                  setFormattedDateStr={(data) => setFormattedDateStr(data)}
                  hader={"Alerts"}
                />
              </div>
            </div>
            {/* Second Grid */}
            <div
              style={{
                flex: 1.2,
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <div style={{ flex: 1, overflow: "auto", marginLeft: "-60px" }}>
                <Aggrigated
                  Type={"Bear"}
                  buyOrSell={"SELL"}
                  optionType={"P"}
                  Containcolor={COLORS.red}
                  selectedDate={selectedDate}
                  searchTerm={searchTerm}
                  handleModalEvent={(idx, symbol) => {
                    handleModalEvent(idx, symbol);
                  }}
                  setDetailsofRow={(data) => setDetailsofRow(data)}
                  animationState={animationState}
                  formattedDateStr={formattedDateStr}
                  setFormattedDateStr={(data) => setFormattedDateStr(data)}
                  hader={"Aggregated Put Buys"}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <TickChart
          animationState={animationState}
          isSmallScreen={isSmallScreen}
          isSmallScreen2={isSmallScreen2}
          detailsofRow={detailsofRow}
          handleModalEventClose={handleModalEventClose}
          chartData={chartData}
          groupedByDate={groupedByDate}
        />
      )}
    </StyleMainDiv>
  );
}
