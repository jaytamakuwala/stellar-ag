import React, { useMemo } from "react";
import { AgCharts } from "ag-charts-react";

export default function GroupedHorizontalChart({
  height,
  rawData = [],
  buyLabel = "Buy",
  sellLabel = "Sell",
  buyColor = "#00FF59",
  sellColor = "#FF605D",
  filterOptionType = null,
}) {
  const processedData = useMemo(() => {
    const grouped = {};
    rawData.forEach((item) => {
      if (filterOptionType && item.OptionType !== filterOptionType) return;

      const time = item.Time;
      const cost = parseFloat(item.TotalCost.replace(/,/g, ""));
      if (!grouped[time]) {
        grouped[time] = { time, buy: 0, sell: 0 };
      }
      if (item.BuyOrSell === "BUY") {
        grouped[time].buy += cost;
      } else if (item.BuyOrSell === "SELL") {
        grouped[time].sell += cost;
      }
    });

    return Object.values(grouped);
  }, [rawData, filterOptionType]);

  const chartData = processedData.length > 0 ? processedData : [{ time: "", buy: 0, sell: 0 }];

  const [minVal, maxVal] = useMemo(() => {
    if (!processedData.length) return [0, 0];
 let allValues = processedData.flatMap(d => [d.buy, d.sell]);
    return [Math.min(...allValues), Math.max(...allValues)];
  }, [processedData]);

  const options = useMemo(() => ({
      data: chartData,
      background: { fill: "#282828" },
      title: {
        text: `${buyLabel} and ${sellLabel} by Time`,
        color: "#ffffff",
        textAlign: "center",
        fontSize:12,
        spacing: 20,
      },
      series: [
        {
          type: "bar",
          direction: "horizontal",
          xKey: "time",
          yKey: "buy",
          yName: buyLabel,
          fill: buyColor,
          cornerRadius: 20,
          label: {
            enabled: processedData.length > 0,
            color: "#000",
            fontSize: 10,
          },
        },
        {
          type: "bar",
          direction: "horizontal",
          xKey: "time",
          yKey: "sell",
          yName: sellLabel,
          fill: sellColor,
          cornerRadius: 20,
          label: {
            enabled: processedData.length > 0,
            color: "#000",
            fontSize: 10,
          },
        },
      ],

      axes: [
        {
          type: "category",
          position: "left",
          line: { enabled: false },
          label: {
            color: "#fff",
            formatter: ({ value }) => {
              if (typeof value === "string" && value.includes(":")) {
                let [hour, minute] = value.split(":").map(Number);
                const ampm = hour >= 12 ? "PM" : "AM";
                hour = hour % 12 || 12;
                return `${hour} ${ampm}`;
              }
              return value;
            },
          },
        },
        {
          type: "number",
          position: "bottom",
          nice: false,
          line: { enabled: true },
          min: processedData.length > 0 ? (minVal < 0 ? minVal : 0) : 0,
          max: processedData.length > 0 ? maxVal : 10,
          label: {
            color: "#fff",
            formatter: ({ value }) => {
              const absVal = Math.abs(value);
              if (absVal === 0) return 0;
              if (absVal >= 1_000_000)
                return `${(absVal / 1_000_000).toFixed(0)}M`;
              if (absVal >= 1000) return `$${(absVal / 1000).toFixed(0)}k`;
              return `${absVal.toString()}`;
            },
          },
          gridLine: {
            enabled: true,
            style: [{ stroke: "#555" }],
          },
        },
      ],

      legend: {
        position: "bottom",
        item: {
          label: { color: "#fff" },
        },
      },
    }),
    [
      chartData,
      processedData.length,
      buyLabel,
      sellLabel,
      buyColor,
      sellColor,
      minVal,
      maxVal,
    ]
  );

  return (
    <div style={{ width: "100%", height: `${height}px` }}>
      <AgCharts options={options} style={{ height: "100%" }} />
    </div>
  );
}
