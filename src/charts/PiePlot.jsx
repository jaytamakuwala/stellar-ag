import React, { useMemo } from "react";
import { AgCharts } from "ag-charts-react";

export default function PiePlot({
  rawData = [],
  fields = [],
  labels = [],
  title = "Portfolio Composition",
  height = 400,
  className = "",
}) {
  const chartData = useMemo(() => {
    if (!rawData.length || !fields.length) return [];

    const item = rawData[0];
    return fields.map((field, index) => ({
      asset: labels[index] || field,
      amount: parseFloat(item[field]?.replace(/,/g, "")) || 0,
    }));
  }, [rawData, fields, labels]);

  const options = useMemo(
    () => ({
      background: { fill: "#282828" },
      title: { text: title, color: "#ffffff" },
      data: chartData,
      series: [
        {
          type: "pie",
          angleKey: "amount",
          legendItemKey: "asset",
          label: {  
            enabled: true,
            color: "#ffffff",
          },
          fills: ["#00FF59", "#FF605D", "#B24AF2", "#3CAFC8"],
          strokes: ["#00FF59", "#FF605D", "#B24AF2", "#3CAFC8"],
        },
      ],
      legend: {
        item: {
          label: { color: "#ffffff" },
        },
      },
      tooltip: {
        renderer: (params) => ({
          title: params.datum.asset,
          content: `Amount: $${params.datum.amount.toLocaleString()}`,
        }),
      },
    }),
    [chartData, title]
  );

  return (
    <div style={{ height }} className={className}>
      <AgCharts options={options} />
    </div>
  );
}
