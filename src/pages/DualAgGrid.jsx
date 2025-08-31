import { useCallback, useState } from "react";
import {
  StyleMainDiv,
  StyleModalFilter,
} from "../style/containers/AnimatedTable";
import RightNavigation from "../components/RightNavigation";
import FirstAnimatedTable from "./GridA";
import SecondAnimatedTable from "./GridB";
import FilterModal from "../components/FilterModal";
import DualGridHeader from "../components/DualGridHeader";

export default function AnimatedTable() {
  const [date, setDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState(false);
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

  const handleFilerOptionClose = useCallback(() => setFilterState(false), []);

  return (
    <StyleMainDiv
      style={{ display: "flex", flexDirection: "column", height: "100vh" }}
    >
      {/* Right Navigation */}
        <RightNavigation />

      {/* Dual Chart Header */}
      <DualGridHeader 
        date = {date}
        setDate = {(date) => setDate(date)}
        setSearchTerm = {(data) => setSearchTerm(data)}
        filterState={filterState}
        setFilterState={(data) => setFilterState(data) }
      />
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
          <div style={{ flex: 1, overflow: "auto", marginLeft: "-60px" }}>
              <FirstAnimatedTable selectedDate={date} searchTerm={searchTerm} />
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
          <div style={{ flex: 1, overflow: "auto", marginLeft: "-60px" }}>
              <SecondAnimatedTable selectedDate={date} searchTerm={searchTerm} />
          </div>
        </div>
      </div>

      {/* Filter Modal */}
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
    </StyleMainDiv>
  );
}
