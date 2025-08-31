import React from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import { StyleOption } from "../style/containers/AnimatedTable";

export default function DualGridHeader({
  date,
  setDate,
  setSearchTerm,
  filterState,
  setFilterState,
}) {
  return (
    <StyleOption>
      <h4 className="TitleAction m-0" style={{ color: "#fff" }}>
        Aggregated Options Data
      </h4>

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
          <button
            type="button"
            className="btn btn-primary Filtericon"
            onClick={() => setFilterState(!filterState)}
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
  );
}
