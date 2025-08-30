import React, { useState } from "react";
import Header from "./Header";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import RightNavigation from "./RightNavigation";
import FirstAnimatedTable from "./GridA";
import SecondAnimatedTable from "./GridB";
import { StyleOption, StyleMainDiv } from "../style/containers/AnimatedTable";

export default function AnimatedTable() {
  const [date, setDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <StyleMainDiv style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <RightNavigation />

      {/* Top controls */}
      <StyleOption>
        <h4 className="TitleAction m-0">Aggregated Options Data</h4>

        <div className="rightNavigation">
          <div
            className="SmallScreen"
            style={{
              background: "#959595",
              width: "max-content",
              marginLeft: 15,
              borderRadius: 5,
              margin: 5,
              height: 35,
              display: "flex",
              alignItems: "center",
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={date}
                onChange={(newDate) => setDate(newDate)}
                disableFuture
                slotProps={{
                  textField: { size: "small", variant: "outlined" },
                }}
              />
            </LocalizationProvider>
          </div>

          <div className="SearchInputs">
            <input
              type="text"
              placeholder="Search Tick"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon className="SearchIcon" />
          </div>

          <div className="ShowInLine">
            <Header />
            <button
              type="button"
              className="btn btn-primary Filtericon"
              onClick={() => setFilterOpen(true)}
            >
              <TuneIcon /> Filter{" "}
              <span
                className="badge bg-warning text-dark"
                style={{ position: "relative", top: 0 }}
              >
                0
              </span>
            </button>
          </div>
        </div>
      </StyleOption>

      {/* Two side-by-side tables */}
      <div
        style={{
          display: "flex",
          flex: 1, // take all remaining height
        }}
      >
        {/* LEFT TABLE */}
        <div
          style={{
            flex: 1,
            minWidth: 0, // important so flex children shrink properly
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div style={{ flex: 1, overflow: "auto", marginLeft: "-60px"}}>
            <FirstAnimatedTable selectedDate={date} searchTerm={searchTerm} />
          </div>
        </div>

        {/* RIGHT TABLE */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div style={{ flex: 1, overflow: "auto", marginLeft:"-60px" }}>
            <SecondAnimatedTable selectedDate={date} searchTerm={searchTerm} />
          </div>
        </div>
      </div>
    </StyleMainDiv>
  );
}
