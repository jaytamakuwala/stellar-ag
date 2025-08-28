import React, { useState, useEffect } from "react";
import { AgCharts } from "ag-charts-react";
import { formatNumberToCurrency } from "../utils/common";

// ✅ Format date for chart labels (DD/MM)
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}`;
};

// ✅ Group by date instead of weeks
const groupByDate = (data) => {
  const grouped = {};

  data.forEach(({ date, OptionType, BuyOrSell, TotalCost }) => {
    if (!date) return; // Skip if date is missing

    const formattedDate = formatDate(date);
    const cost = parseFloat(TotalCost.replace(/,/g, "")) || 0;

    if (!grouped[formattedDate]) {
      grouped[formattedDate] = {
        date: formattedDate,
        CALL_BUY: 0,
        CALL_SELL: 0,
        PUT_BUY: 0,
        PUT_SELL: 0,
      };
    }

    const key = `${OptionType === "C" ? "CALL" : "PUT"}_${BuyOrSell}`;
    grouped[formattedDate][key] += cost;
  });

  return Object.values(grouped);
};

export default function BarChart({ data = [], height = 400 }) {
  const [options, setOptions] = useState({});

  useEffect(() => {
    const chartData = groupByDate(data);

    setOptions({
      background: { fill: "#282828" },
      title: {
        text: "Total Amount of Call and Put by Date",
        color: "#ffffff",
        fontSize: 18,
        textAlign: "left",
        spacing: 20,
      },
      data: chartData,
      series: [
        {
          type: "bar",
          xKey: "date",
          yKey: "CALL_BUY",
          yName: "Call Buy",
          fill: "#2838CF",
          tooltip: { renderer: ({ datum, yKey }) => ({ content: `${formatNumberToCurrency(datum[yKey])}` }) },
        },
        {
          type: "bar",
          xKey: "date",
          yKey: "CALL_SELL",
          yName: "Call Sell",
          fill: "#ff605d",
          tooltip: { renderer: ({ datum, yKey }) => ({ content: `${formatNumberToCurrency(datum[yKey])}` }) },
        },
        {
          type: "bar",
          xKey: "date",
          yKey: "PUT_BUY",
          yName: "Put Buy",
          fill: "#b24af2",
          tooltip: { renderer: ({ datum, yKey }) => ({ content: `${formatNumberToCurrency(datum[yKey])}` }) },
        },
        {
          type: "bar",
          xKey: "date",
          yKey: "PUT_SELL",
          yName: "Put Sell",
          fill: "#3cafc8",
          tooltip: { renderer: ({ datum, yKey }) => ({ content: `${formatNumberToCurrency(datum[yKey])}` }) },
        },
      ],
      axes: [
        { type: "category", position: "bottom", label: { color: "#cccccc", rotation: -20 } },
        {
          type: "number",
          position: "left",
          label: {
            color: "#cccccc",
            formatter: (params) => formatNumberToCurrency(params.value), // ✅ Y-axis formatter
          },
        },
      ],
      legend: {
        position: "bottom",
        item: { marker: { shape: "square", size: 12 }, label: { color: "#ffffff" } },
      },
      seriesDefaults: {
        bar: { paddingInner: 0.05, paddingOuter: 0.02 },
      },
    });
  }, [data]);

  return (
    <div style={{ width: "100%", height: `${height}px` }}>
      <AgCharts options={options} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
