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
import { UserContext } from "../../context/UserContext";
import { COLORS } from "../../utils/constants";
import AlertsDialog from "../AipowerAlerts/AipowerAlerts.jsx";
import logo_GIF from "../../assets/images/logo-GIF-2.gif";


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
  const {
    selectedDate,
    setSelectedDate,
    searchTerm,
    setSearchTerm,
    openAlerts,
    setOpenAlerts,
    loading,
    setLoading,
  } = useContext(UserContext);

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

  return (
    <StyleMainDiv
      style={{ display: "flex", flexDirection: "column", height: "100vh" }}
    >
      {/* Right Navigation */}
      <RightNavigation />

      {!animationState ? (
        <>
          <DualGridHeader
            selectedDate={selectedDate}
            setSelectedDate={(selectedDate) => setSelectedDate(selectedDate)}
            searchTerm={searchTerm}
            setSearchTerm={(data) => setSearchTerm(data)}
            filterState={filterState}
            setFilterState={(data) => setFilterState(data)}
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
          {openAlerts ? (
            <AlertsDialog
              open={openAlerts}
              onClose={() => setOpenAlerts(false)}
            />
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
          {loading && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(28,28,28,0.4)",
                zIndex: 10,
              }}
            >
              <img src={logo_GIF} alt="Loading..." width={100} height={100} />
            </div>
          )}
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
