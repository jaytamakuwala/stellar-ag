import { useCallback, useEffect, useMemo, useState, useContext } from "react";
import {
  StyleMainDiv,
  StyleModalFilter,
} from "../../style/containers/AnimatedTable";
import RightNavigation from "../../components/RightNavigation";
import MagicOption from "./components/MagicOption.jsx";
import FilterModal from "../../components/FilterModal";
import DualGridHeader from "../../components/DualGridHeader";

import { useMediaQuery } from "@mui/material";
import { getFormatedDateStrForUSA } from "../../utils/common";
// import MiddleGrid from "./components/MiddleGrid";
import { COLORS } from "../../utils/constants";
import { UserContext } from "../../context/UserContext";

export default function magicOptionMain() {
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
  const { selectedDate, setSelectedDate } = useContext(UserContext);

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
          hader={"Magic Call Buys"}
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

        <div style={{ overflow: "hidden", }}>
          <MagicOption
            Type={"Bull"}
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
          />
        </div>
      </>
      )
    </StyleMainDiv>
  );
}
