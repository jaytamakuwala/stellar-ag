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
import { COLORS } from "../../utils/constants";
import { UserContext } from "../../context/UserContext";
import AlertsDialog from "../AipowerAlerts/AipowerAlerts.jsx";
import logo_GIF from "../../assets/Images/logo-GIF-2.gif";

export default function MagicPutBuy() {
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
  const {
    selectedDate,
    setSelectedDate,
    searchTerm,
    setSearchTerm,
    openAlerts,
    setOpenAlerts,
    loading,
  } = useContext(UserContext);

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
          hader={"Magic Put Buys"}
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

        <div style={{ overflow: "hidden", marginLeft: "" }}>
          <MagicOption
            Type={"Bear"}
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
          />
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
        </div>
      </>
    </StyleMainDiv>
  );
}
