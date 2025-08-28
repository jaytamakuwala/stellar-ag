import React, { useMemo } from "react";
import { AgCharts } from "ag-charts-react";

export default function SimpleBubbleChartWithQuadrant({ bubbleData = [], height }) {
  const data = useMemo(() => {
    return bubbleData.map((d) => {
      let x = parseFloat(d.StrikePrice.toString().replace(/,/g, ""));
      let y = parseFloat(d.TotalCost.toString().replace(/,/g, ""));

      if (d.OptionType === "C" && d.BuyOrSell === "BUY") {
        x = Math.abs(x);
        y = Math.abs(y);
      } else if (d.OptionType === "P" && d.BuyOrSell === "BUY") {
        x = -Math.abs(x);
        y = Math.abs(y);
      } else if (d.OptionType === "P" && d.BuyOrSell === "SELL") {
        x = -Math.abs(x);
        y = -Math.abs(y);
      } else if (d.OptionType === "C" && d.BuyOrSell === "SELL") {
        x = Math.abs(x);
        y = -Math.abs(y);
      }

      return { ...d, StrikePrice: x, TotalCost: y };
    });
  }, [bubbleData]);

  const { xMin, xMax, yMin, yMax } = useMemo(() => {
    if (data.length === 0)
      return { xMin: -100, xMax: 100, yMin: -1000, yMax: 1000 };

    const xVals = data.map((d) => d.StrikePrice);
    const yVals = data.map((d) => d.TotalCost);

    const rawMinX = Math.min(...xVals);
    const rawMaxX = Math.max(...xVals);
    const rawMinY = Math.min(...yVals);
    const rawMaxY = Math.max(...yVals);

    const bufferX = (rawMaxX - rawMinX) * 0.1 || 10;
    const bufferY = (rawMaxY - rawMinY) * 0.1 || 100;

    return {
      xMin: rawMinX - bufferX,
      xMax: rawMaxX + bufferX,
      yMin: rawMinY - bufferY,
      yMax: rawMaxY + bufferY,
    };
  }, [data]);

  const xTickInterval = Math.ceil((xMax - xMin) / 10);
  const yTickInterval = Math.ceil((yMax - yMin) / 10);

  const commonSeriesConfig = {
    type: "bubble",
    xKey: "StrikePrice",
    yKey: "TotalCost",
    sizeKey: "TotalCost",
    size: 6,
    minSize: 0,
    maxSize: 50,
    animation: { enabled: true, duration: 800, easing: "easeOut" },
    marker: { shape: "circle" },
  };

  const options = useMemo(
    () => ({
      background: { fill: "#282828" },
      title: {
        text: "Heat Map",
        color: "#ffffff",
        spacing: 20,
        textAlign: "left",
      },
      series: [
        {
          ...commonSeriesConfig,
          title: "Call Buy",
          fill: "#00FF59",
          stroke: "green",
          marker: { fill: "#00FF59", stroke: "#149340" },
          fillOpacity: 0.5,   
          strokeOpacity: 1,   
          strokeWidth: 2,
          data: data.filter(
            (d) => d.OptionType === "C" && d.BuyOrSell === "BUY"
          ),
        },
        {
          ...commonSeriesConfig,
          title: "Call Sell",
          fill: "#FF605D",
          stroke: "red",
          marker: { fill: "#FF605D", stroke: "#934442" },
          fillOpacity: 0.5,   
          strokeOpacity: 1,   
          strokeWidth: 2,
          data: data.filter(
            (d) => d.OptionType === "C" && d.BuyOrSell === "SELL"
          ),
        },
        {
          ...commonSeriesConfig,
          title: "Put Buy",
          fill: "#00FF59",
          stroke: "green",
          marker: { fill: "#00FF59", stroke: "#00FF59" },
          fillOpacity: 0.5,   
          strokeOpacity: 1,   
          strokeWidth: 2,
          data: data.filter(
            (d) => d.OptionType === "P" && d.BuyOrSell === "BUY"
          ),
        },
        {
          ...commonSeriesConfig,
          title: "Put Sell",
          fill: "#FF605D",
          stroke: "red",
          marker: { fill: "#FF605D", stroke: "#FF605D" },
          fillOpacity: 0.5,   
          strokeOpacity: 1,
          strokeWidth: 2,
          data: data.filter(
            (d) => d.OptionType === "P" && d.BuyOrSell === "SELL"
          ),
        },
      ],
      axes: [
        {
          type: "number",
          position: "bottom",
          title: { text: "Strike Price", color: "#fff" },
          label: {
            color: "#fff",
            formatter: ({ value }) => {
              const absVal = Math.abs(value);
              if (absVal === 0) return 0;
              if (absVal >= 1_000_000)
                return `$${(absVal / 1_000_000).toFixed(1)}M`;
              if (absVal >= 1000) return `$${(absVal / 1000).toFixed(0)}k`;
              return `$${absVal.toString()}`;
            },
          },
          min: xMin,
          max: xMax,
          tick: { interval: xTickInterval },
          gridStyle: [{ stroke: "#fff", opacity: 0.15 }],
          crossLines: [
            { type: "line", value: 0, stroke: "#fff", strokeWidth: 2 },
          ],
        },
        {
          type: "number",
          position: "left",
          title: { text: "Total Cost", color: "#fff" },
          label: {
            color: "#fff",
            formatter: ({ value }) => {
              const absVal = Math.abs(value);
              if (absVal === 0) return 0;
              if (absVal >= 1_000_000)
                return `$${(absVal / 1_000_000).toFixed(1)}M`;
              if (absVal >= 1000) return `$${(absVal / 1000).toFixed(0)}k`;
              return `$${absVal.toString()}`;
            },
          },
          min: yMin,
          max: yMax,
          tick: { interval: yTickInterval },
          gridStyle: [{ stroke: "#fff", opacity: 0.15 }],
          crossLines: [
            { type: "line", value: 0, stroke: "#fff", strokeWidth: 2 },
          ],
        },
      ],
      legend: { enabled: false },
      annotations: [
        {
          type: "text",
          text: "Call Buy",
          xValue: xMax - (xMax - xMin) * 0.1,
          yValue: yMax - (yMax - yMin) * 0.1,
          color: "#00FF59",
          fontSize: 18,
          fontWeight: "bold",
        },
        {
          type: "text",
          text: "Put Buy",
          xValue: xMin + (xMax - xMin) * 0.1,
          yValue: yMax - (yMax - yMin) * 0.1,
          color: "#00FF59",
          fontSize: 18,
          fontWeight: "bold",
        },
        {
          type: "text",
          text: "Put Sell",
          xValue: xMin + (xMax - xMin) * 0.1,
          yValue: yMin + (yMax - yMin) * 0.1,
          color: "#FF605D",
          fontSize: 18,
          fontWeight: "bold",
        },
        {
          type: "text",
          text: "Call Sell",
          xValue: xMax - (xMax - xMin) * 0.1,
          yValue: yMin + (yMax - yMin) * 0.1,
          color: "#FF605D",
          fontSize: 18,
          fontWeight: "bold",
        },
      ],
      tooltip: {
        renderer: ({ datum }) => ({
          title: "",
          content: `Strike Price: ${Math.abs(
            datum.StrikePrice
          )}\nTotal Cost: $${Math.abs(datum.TotalCost).toLocaleString()}`,
        }),
      },
    }),
    [data, xMin, xMax, yMin, yMax, xTickInterval, yTickInterval]
  );

  return (
    <div style={{ width: "100%", height: `${height}px` }}>
      <AgCharts options={options} style={{ height: "100%", width: "100%" }} />
    </div>
  );
}
