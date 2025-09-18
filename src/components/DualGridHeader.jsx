import { useEffect, useState, useContext } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { StyleOption } from "../style/containers/AnimatedTable";
import { UserContext } from "../context/UserContext";
import { getCurrentUSADate } from "../utils/common";
import { useNavigate, useLocation } from "react-router-dom";

export default function DualGridHeader({ filterState, setFilterState, hader }) {
  const {
    selectedDate,
    setSelectedDate,
    searchTerm,
    setSearchTerm,
    openAlerts,
    setOpenAlerts,
  } = useContext(UserContext);
  const [draftDate, setDraftDate] = useState(selectedDate ?? null);

  useEffect(() => {
    setDraftDate(selectedDate ?? new Date());
  }, [selectedDate]);
const openAlertsButton = () => {
  if (openAlerts) {
    setOpenAlerts(false);
  } else {
    setOpenAlerts(true);
  }
}
  return (
    <StyleOption>
      <h4 className="TitleAction m-0" style={{ color: "#fff" }}>
        {hader}
      </h4>

      {location.pathname !== "/myProfilemain"? (<div className="rightNavigation">
        {/* Date picker */}
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

        {/* Search */}
        <div className="SearchInputs">
          <input
            type="text"
            placeholder="Search Tick"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          <SearchIcon className="SearchIcon" />
        </div>

        {/* Filter button */}
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

        {/* Alerts button */}

        <button
          style={{
            marginLeft: "10px",
            backgroundColor: "#282828",
            border: "none",
            padding: "6px 6px",
            borderRadius: 5,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            color: "#fff",
          }}
          onClick={openAlertsButton}
          onClose={() => setOpenAlerts(false)}
        >
          {openAlerts ? <NotificationsActiveIcon /> : <NotificationsNoneIcon />}
        </button>
      </div>) : null}
    </StyleOption>
  );
}
