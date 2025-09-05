import { useCallback, useEffect, useMemo, useState } from "react";
import {
  StyleMainDiv,
  StyleModalFilter,
} from "../../style/containers/AnimatedTable";
import RightNavigation from "../../components/RightNavigation";
import LeftUltraHighVolume from "./components/LeftUltraHighVolume.jsx";
import RightUltraHighVolume from "./components/RightUltraHighVolume.jsx";
import FilterModal from "../../components/FilterModal";
import DualGridHeader from "../../components/DualGridHeader";

import { useMediaQuery } from "@mui/material";
import { getFormatedDateStrForUSA } from "../../utils/common";
// import MiddleGrid from "./components/MiddleGrid";

export default function UltraHighVolumeMain() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
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
          date={selectedDate}
          setDate={(date) => setSelectedDate(date)}
          setSearchTerm={(data) => setSearchTerm(data)}
          filterState={filterState}
          setFilterState={(data) => setFilterState(data)}
          hader={"Ultra High Volume Option Data"}
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
              flex: 1,
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div style={{ overflow: "auto", marginLeft: "" }}>
              <LeftUltraHighVolume
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
              <RightUltraHighVolume
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
      )
    </StyleMainDiv>
  );
}
