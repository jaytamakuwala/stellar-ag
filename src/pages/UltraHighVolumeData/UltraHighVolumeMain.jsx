import { useCallback, useEffect, useMemo, useState, useContext } from "react";
import {
  StyleMainDiv,
  StyleModalFilter,
} from "../../style/containers/AnimatedTable";
import RightNavigation from "../../components/RightNavigation";
import UltraHighVolume from "./components/UltraHighVolume";
import FilterModal from "../../components/FilterModal";
import DualGridHeader from "../../components/DualGridHeader";
import { COLORS } from "../../utils/constants";
import { useMediaQuery } from "@mui/material";
import { getFormatedDateStrForUSA } from "../../utils/common";
import { UserContext } from "../../context/UserContext";
import AlertsDialog from "../AipowerAlerts/AipowerAlerts.jsx";


export default function UltraHighVolumeMain() {
  const { selectedDate, setSelectedDate, searchTerm, setSearchTerm, openAlerts, setOpenAlerts } =
    useContext(UserContext);
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

  const isSmallScreen = useMediaQuery("(max-width:550px)");
  const isSmallScreen2 = useMediaQuery("(max-width:1000px)");
  const [detailsofRow, setDetailsofRow] = useState();
  const [formattedDateStr, setFormattedDateStr] = useState("");

  useEffect(() => {
    console.log({ selectedDate });

    if (selectedDate) {
      setFormattedDateStr(getFormatedDateStrForUSA(selectedDate));
    } else {
      setFormattedDateStr("");
    }
  }, [selectedDate]);

  return (
    <StyleMainDiv
      style={{ display: "flex", flexDirection: "column", height: "100vh" }}
    >
      <RightNavigation />
      <>
        <DualGridHeader
          selectedDate={selectedDate}
          setSelectedDate={(selectedDate) => setSelectedDate(selectedDate)}
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
                <AlertsDialog open={openAlerts} onClose={() => setOpenAlerts(false)} />
        
        <div
          style={{
            display: "flex",
            flex: 1,
          }}
        >
          {/* First Grid */}
          <div
            style={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div style={{ overflow: "auto", marginLeft: "" }}>
              <UltraHighVolume
                Type={"C"}
                Containcolor={COLORS.lime}
                field={"OptionSymbol"}
                hader={"Ultra High Volume Call Buy"}
                selectedDate={selectedDate}
                searchTerm={searchTerm}
                handleModalEvent={(idx, symbol) => {
                  handleModalEvent(idx, symbol);
                }}
                setDetailsofRow={(data) => setDetailsofRow(data)}
                animationState={animationState}
                formattedDateStr={formattedDateStr}
                setFormattedDateStr={(data) => setFormattedDateStr(data)}
              />
            </div>
          </div>

          {/* Second Grid */}
          <div
            style={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div style={{ flex: 1, overflow: "auto", marginLeft: "" }}>
              <UltraHighVolume
                Type={"P"}
                Containcolor={COLORS.red}
                field={"Tick"}
                hader={"Ultra High Volume Put Buy"}
                selectedDate={selectedDate}
                searchTerm={searchTerm}
                handleModalEvent={(idx, symbol) => {
                  handleModalEvent(idx, symbol);
                }}
                setDetailsofRow={(data) => setDetailsofRow(data)}
                animationState={animationState}
                formattedDateStr={formattedDateStr}
                setFormattedDateStr={(data) => setFormattedDateStr(data)}
              />
            </div>
          </div>
        </div>
      </>
    </StyleMainDiv>
  );
}
