import React, { useMemo } from "react";
import { AgCharts } from "ag-charts-react";

export default function BubbleWithCategoriesChart({ rawData = [], type = "CALL", height = 400 }) {
  const { chartData, xCategories, yCategories, colorMap } = useMemo(() => {
    if (!rawData.length) return { chartData: [], xCategories: [], yCategories: [], colorMap: {} };

    // Filter and parse data
    const parsed = rawData
      .filter((d) => (type === "CALL" ? d.OptionType === "C" : d.OptionType === "P"))
      .map((d) => ({
        StrikePrice: parseFloat(d.StrikePrice),
        TotalCost: parseFloat(d.TotalCost.replace(/,/g, "")),
        ExpirationDate: new Date(d.ExpirationDate),
      }));

    if (!parsed.length) return { chartData: [], xCategories: [], yCategories: [], colorMap: {} };

    // ✅ Group by ExpirationDate and StrikePrice
    const grouped = [];
    const strikeSet = new Set();
    const dateMap = new Map(); // { label -> Date }

    parsed.forEach((item) => {
      const expLabel = `${item.ExpirationDate.getDate().toString().padStart(2, "0")}/${(item.ExpirationDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;

      strikeSet.add(item.StrikePrice);
      dateMap.set(expLabel, item.ExpirationDate);

      let existing = grouped.find(
        (g) => g.StrikePrice === item.StrikePrice && g.ExpiryLabel === expLabel
      );
      if (!existing) {
        existing = { StrikePrice: item.StrikePrice, ExpiryLabel: expLabel, TotalCost: 0 };
        grouped.push(existing);
      }
      existing.TotalCost += item.TotalCost;
    });

    // ✅ Sort X by StrikePrice
    const xCategories = Array.from(strikeSet).sort((a, b) => a - b);

    // ✅ Sort Y by actual Date (earliest on top)
    const yCategories = Array.from(dateMap.entries())
      .sort((a, b) => a[1] - b[1])
      .map(([label]) => label);

    // ✅ Generate color map
    const palette = [
      "#FF605D", "#00FF59", "#FFC107", "#42A5F5", "#AB47BC", "#FF9800", "#26A69A"
    ];
    const colorMap = {};
    yCategories.forEach((label, index) => {
      colorMap[label] = palette[index % palette.length];
    });

    return { chartData: grouped, xCategories, yCategories, colorMap };
  }, [rawData, type]);

  const options = {
    title: {
      text: `${type === "CALL" ? "Call" : "Put"} Strike Price vs Expiry`,
      color: "#fff",
      textAlign: "left",
    },
    background: { fill: "#282828" },
    axes: [
      {
        position: "bottom",
        type: "category",
        categories: xCategories,
        label: { color: "#fff" },
        title: { text: "Strike Price", color: "#fff" },
        gridLine: {
          enabled: true,
          style: [{ stroke: "#555" }],
        },
      },
      {
        position: "left",
        type: "category",
        categories: yCategories,
        label: { color: "#fff" },
        title: { text: "Expiry Date", color: "#fff" },
        gridLine: { enabled: false },
      },
    ],
    series: [
      {
        type: "bubble",
        title: type,
        data: chartData,
        xKey: "StrikePrice",
        yKey: "ExpiryLabel",
        sizeKey: "TotalCost",
        strokeWidth: 0,
        maxSize: 40,
        itemStyler: ({ datum }) => ({
          fill: colorMap[datum.ExpiryLabel] || "#42A5F5", // ✅ Dynamic color here
        }),
      },
    ],
    tooltip: {
      renderer: ({ datum }) =>
        `<div style="color:white;">
          Strike: ${datum.StrikePrice}<br/>
          Expiry: ${datum.ExpiryLabel}<br/>
          Total: ${datum.TotalCost.toLocaleString()}
        </div>`,
    },
    legend: { enabled: false },
  };

  return (
    <div style={{ width: "100%", height: `${height}px` }}>
      <AgCharts options={options} style={{ height: "100%" }} />
    </div>
  );
}
