import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getOptionTradeDetails } from "../service/stellarApi";
import toast from "react-hot-toast";
import { CircularProgress } from "@mui/material";
import { Reorder } from "framer-motion";
import { formatNumberToCurrency } from "../utils/common";

export default function DetailsData({
  detailsofRow,
  startDateStr,
  showDetails,
  childIndex,
}) {
  const [tickDetails, setTickDetails] = useState([]);
  const theamColor = useSelector((state) => state.theme.mode);
  const [isLoading, setLoading] = useState(false);
  const getTickDetails = async () => {
    setLoading(true);
    const [time, period] = detailsofRow.Time.trim()
      .toUpperCase()
      .match(/(\d{1,2}:\d{2})(AM|PM)/)
      .slice(1);
    const [hoursStr, minutesStr] = time.split(":");
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    if (period === "PM" && hours !== 12) {
      hours += 12;
    }
    if (period === "AM" && hours === 12) {
      hours = 0;
    }
    const [year, month, day] = startDateStr.split("-").map(Number);
    const startTime = new Date(year, month - 1, day, hours, minutes);
    const endTime = new Date(startTime.getTime() + 5 * 60 * 1000);
    endTime.setMinutes(endTime.getMinutes());

    const startIso = toLocalISOString(startTime);
    const endIso = toLocalISOString(endTime);

    const queryObj = {
      startTime: startIso,
      endTime: endIso,
      optionSymbol: detailsofRow.Tick,
      buyOrSell: "BUY",
    };
    await getOptionTradeDetails(queryObj)
      .then((res) => {
        if (res.ok) {
          setTickDetails(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(error?.message || "Something went wrong");
      });
    setLoading(false);
  };

  function toLocalISOString(date) {
    const pad = (num) => String(num).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
      date.getSeconds()
    )}`;
  }
  const formattedDate = (date) => {
    const inputDate = new Date(date);

    const mm = String(inputDate.getMonth() + 1).padStart(2, "0");
    const dd = String(inputDate.getDate()).padStart(2, "0");
    const yyyy = inputDate.getFullYear();

    return `${mm}-${dd}-${yyyy}`;
  };

  useEffect(() => {
    getTickDetails();
  }, []);

  return (
    <>
      <div>
        <div className={`Modal-Content ${theamColor}`}>
          <Reorder.Group
            values={tickDetails}
            onReorder={setTickDetails}
            style={{ margin: "0", padding: "0" }}
          >
            <table width={"100%"}
            style={{
              minWidth: "950px",
            }}>
              <thead className="TheadTable">
                <tr>
                  <th width="5%" style={{ borderTopLeftRadius: "0" }}>Time</th>
                  <th width="7%">Expiry Date</th>
                  <th width="7%" style={{ borderTopRightRadius: "0" }}>Expiry Diff</th>
                  <th width="5%">Tick</th>
                  <th width="9%">Type</th>
                  <th width="9%">Buy/Sell</th>
                  <th width="9%">Total Cost</th>
                  <th width="8%">Strike Price</th>
                  <th width="7%">Spot Price</th>
                  <th width="7%">Price</th>
                  <th width="7%">Strike Diff</th>
                  <th width="6%"></th>
                  <th width="8%"></th>
                  <th width="6%"></th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <Reorder.Item as="tr" className="accordion-content-row">
                    <td
                      colSpan={999}
                      style={{ textAlign: "center", padding: "10px" }}
                    >
                      <CircularProgress />
                    </td>
                  </Reorder.Item>
                ) : tickDetails.length ? (
                  tickDetails.map((row, index) => {
                    return (
                      <tr
                        key={index}
                        style={{
                          opacity: showDetails === childIndex ? 1 : 0.5,
                          transition: "opacity 0.3s ease-in-out",
                          pointerEvents:
                            showDetails === childIndex ? "auto" : "none",
                        }}
                      >
                        <td width="5%" style={{ color: "rgb(98, 95, 95)" }}>
                          {row.Time}
                        </td>
                        <td width="7%">{formattedDate(row.Expiry)}</td>
                        <td width="7%">{row.TimeDiff}</td>
                        <td width="5%">{row.Tick}</td>
                        <td
                          width="5%"
                          style={{
                            color: row.Type === "Call" ? "#00FF59" : "#FF605D",
                          }}
                        >
                          {row.Type}
                        </td>
                        <td width="9%">{row.BuyOrSell}</td>
                        <td width="9%">{row.TotalCost}</td>
                        <td width="6%">{row.Strike}</td>
                        <td width="6%">{row.Spot}</td>
                        <td width="7%">{row.Price}</td>
                        <td width="7%">{row.SpotStrikeDiff}</td>
                        {" "}
                        {/* Consider renaming `TimeDiff` to `ExpiryDiff` in data */}
                        <td width="7%"></td>
                        <td width="9%"></td>
                        <td width="7%"></td>
                      </tr>
                    );
                  })
                ) : null}
              </tbody>
            </table>
          </Reorder.Group>
        </div>
      </div>
    </>
  );
}
