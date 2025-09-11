import { useEffect, useState, useContext } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import { StyleOption } from "../style/containers/AnimatedTable";
import { UserContext } from "../context/UserContext";
import { getCurrentUSADate } from "../utils/common";

export default function DualGridHeader({ filterState, setFilterState, hader }) {
  const { selectedDate, setSelectedDate, searchTerm, setSearchTerm } =
    useContext(UserContext);
  const [draftDate, setDraftDate] = useState(selectedDate);
  useEffect(() => {
    setDraftDate(selectedDate ?? new Date());
  }, [selectedDate]);
  return (
    <StyleOption>
      <h4 className="TitleAction m-0" style={{ color: "#fff" }}>
        {hader}
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
              value={draftDate}
              onChange={(val) => setDraftDate(val)}
              onAccept={(val) => {
                setSelectedDate(getCurrentUSADate(val ?? null));
              }}
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
            // {(e) => setDraftSearchTerm(e.target.value)}
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
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
