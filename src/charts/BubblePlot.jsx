import React, { useMemo } from "react";
import { AgCharts } from "ag-charts-react";

export default function BubbleChart({
  rawData = [],
  width=400
}) {
  // Convert AM/PM time to numeric hour
  function convertTimeToNumber(timeStr) {
    if (!timeStr) return 0;
    const [hour, meridian] = timeStr.split(" ");
    let hr = parseInt(hour);
    if (meridian === "PM" && hr !== 12) hr += 12;
    if (meridian === "AM" && hr === 12) hr = 0;
    return hr;
  }

  // ✅ Parse and group by ExpirationDate
  const groupedByDate = useMemo(() => {
    if (!rawData.length) return {};

    const parsed = rawData.map((d) => ({
      ...d,
      expDate: new Date(d.ExpirationDate),
      strike: parseFloat(d.StrikePrice),
      cost: parseFloat(d.TotalCost.replace(/,/g, "")),
      timeVal: convertTimeToNumber(d.Time),
    }));

    // Group by Expiration Date (string)
    return parsed.reduce((acc, item) => {
      const dateKey = item.expDate.toLocaleDateString(); // "MM/DD/YYYY"
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(item);
      return acc;
    }, {});
  }, [rawData]);

  // ✅ Sort dates ascending
  const sortedDates = useMemo(() => {
    return Object.keys(groupedByDate).sort(
      (a, b) => new Date(a) - new Date(b)
    );
  }, [groupedByDate]);

  if (!sortedDates.length) {
    return <div style={{ color: "#fff", textAlign: "center" }}>No Data</div>;
  }

  return (
    <div className="row" style={{ marginLeft: 0, marginRight: 0 }}>
      {sortedDates.map((dateKey, index) => {
        const currentData = groupedByDate[dateKey];

        const options = {
          background: { fill: "#282828" },
          title: {
            text: `${dateKey}`,
            fontSize: 14,
            color: "#fff",
          },
          series: [
            {
              type: "bubble",
              data: currentData,
              xKey: "strike",
              yKey: "timeVal",
              sizeKey: "cost",
              fillOpacity: 0.4,   
              strokeOpacity: 1,   
              strokeWidth: 2,
              itemStyler: (params) => {
                const isCall = params.datum.OptionType === "C";
                return {
                  fill: isCall ? "#00FF59" : "#FF0000",
                  stroke: isCall ? "green" : "red",
                };
              },
              tooltip: {
                enabled: true,
                renderer: (params) => {
                  const d = params.datum;
                  return {
                    title: d.OptionSymbol,
                    content: `
                      Date: ${d.expDate.toLocaleDateString()}
                      Strike: ${d.strike}
                      Time: ${d.Time}
                      Cost: ${d.TotalCost}
                      Type: ${d.OptionType}
                    `,
                    color: d.OptionType === "C" ? "#00FF59" : "#FF0000",
                  };
                },
              },
            },
          ],
          axes: [
            {
              type: "number",
              position: "bottom",
              title: { text: "Strike Price", color: "#fff" },
              label: { color: "#ccc" },
            },
            {
              type: "number",
              position: "left",
              title: { text: "Time", color: "#fff" },
              min: 0,
              max: 23,
              interval: { step: 6 },
              label: {
                color: "#ccc",
                formatter: (params) => {
                  const hr = params.value;
                  if (hr === 0) return "12 AM";
                  if (hr < 12) return `${hr} AM`;
                  if (hr === 12) return "12 PM";
                  return `${hr - 12} PM`;
                },
              },
            },
          ],
          legend: { enabled: false },
        };

        return (
          <div
            key={dateKey}
            style={{width}}
          >
            <div>
              <AgCharts options={options} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
