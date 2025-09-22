import FinancialFilterPanel from "../FinancialFilterPanel/FinancialFilterPanel";
import { useState, useEffect, useMemo } from "react";
import "./HeatMap.css";

const HeatMap = () => {
  // Fixed bubbles (no randomness)
  const bubblesData = useMemo(
    () => [
      { id: 1, x: "10%", y: "40%", size: "big", color: "green" },
      { id: 2, x: "25%", y: "50%", size: "medium", color: "green" },
      { id: 3, x: "40%", y: "60%", size: "small", color: "green" },
      { id: 4, x: "55%", y: "30%", size: "big", color: "green" },
      { id: 5, x: "70%", y: "40%", size: "medium", color: "green" },
      { id: 6, x: "85%", y: "20%", size: "small", color: "green" },
      { id: 7, x: "35%", y: "80%", size: "medium", color: "green" },
      { id: 8, x: "60%", y: "55%", size: "big", color: "green" },
    ],
    []
  );

  const [activeGroup, setActiveGroup] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveGroup((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const groups = [
    bubblesData.slice(0, 3).map((b) => b.id),
    bubblesData.slice(3, 6).map((b) => b.id),
    [],
    [],
  ];

  return (
    <section className="feature-wrapper">
      {/* Left Chart */}
      <div className="heatmap-card zone-card">
        <div className="heatmap-header">
          <h2>Institutional Zone Analysis</h2>
          <p>
            Identify critical price levels that can act as potential support or
            resistance zones.
          </p>

          <span className="heatmap-legend">Heat Map</span>
          <p
            style={{ display: "flex", justifyContent: "center", fontSize: 12 }}
          >
            Put Buys
          </p>
        </div>

        <div className="heatmap-chart">
          {/* Grid lines */}
          <div className="grid-lines">
            {[...Array(5)].map((_, i) => (
              <div
                key={`h-${i}`}
                className="grid-line horizontal"
                style={{ top: `${(i + 1) * 20}%` }}
              />
            ))}
            {[...Array(4)].map((_, i) => (
              <div
                key={`v-${i}`}
                className="grid-line vertical"
                style={{ left: `${(i + 1) * 20}%` }}
              />
            ))}
          </div>

          {/* Y labels */}

          <div className="amount-label">
            <p
              style={{
                display: "flex",
              }}
            >
              Amount
            </p>
          </div>

          <div className="y-labels">
            <span>$800K</span>
            <span>$600K</span>
            <span>$400K</span>
            <span>$200K</span>
            <span>0</span>
          </div>

          {/* Bubbles */}
          {bubblesData.map((bubble) => {
            const isActive = groups[activeGroup].includes(bubble.id);
            return (
              <div
                key={bubble.id}
                className={`bubble ${bubble.color} ${bubble.size} ${
                  isActive ? "animate" : ""
                }`}
                style={{ left: bubble.x, top: bubble.y }}
              ></div>
            );
          })}
        </div>
      </div>

      {/* Right Panel */}
      <div className="heatmap-card">
        <div className="heatmap-header">
          <h2>Options order flow analysis</h2>
          <p>
            Gain insight into the market’s most significant shifts in both
            bullish and bearish directions.
          </p>
        </div>
        <FinancialFilterPanel />
      </div>
    </section>
  );
};

export default HeatMap;
