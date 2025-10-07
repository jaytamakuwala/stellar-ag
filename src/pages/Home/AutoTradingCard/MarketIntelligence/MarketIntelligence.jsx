import "./MarketIntelligence.css";

export default function MarketIntelligence() {
  const points = [
    [0, 380],
    [50, 390],
    [120, 280],
    [180, 200],
    [250, 240],
    [300, 220],
    [350, 180],
    [420, 150],
    [480, 190],
    [540, 140],
    [600, 180],
    [650, 160],
    [690, 170],
  ];

  const pathData = points
    .map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`))
    .join(" ");

  return (
    <div className="mi-card">
      {/* Background */}
      <div className="mi-bg" />

      {/* Header */}
      <div className="mi-header">
        <h2 className="mi-title">Deep Market Intelligence</h2>
        <p
          className="card-desc"
          style={{ width: "-webkit-fill-available !important" }}
        >
          Rigorously analyzed, real-time data that uncovers hidden patterns and
          high-probability opportunities.
        </p>
      </div>

      {/* Chart */}
      <div className="mi-chart">
        {/* Grid Lines */}
        <div className="mi-grid">
          {/* Horizontal lines */}
          {[5.34, 19.9, 34.47, 49.03, 63.59, 78.16, 92.72].map((t, i) => (
            <div className="hline" key={i} style={{ top: `${t}%` }} />
          ))}

          {/* Vertical lines */}
          {[95.22, 80, 64.64, 49.42, 33.91, 18.84, 3.33].map((l, i) => (
            <div className="vline" key={i} style={{ left: `${l}%` }} />
          ))}

          {/* Highlighted level lines */}
          <div className="hline green" style={{ top: "25%" }} />
          <div className="hline white" style={{ top: "36%" }} />
          <div className="hline violet" style={{ top: "49%" }} />
        </div>

        {/* Wave chart */}
        <svg
          className="mi-wave"
          viewBox="0 50 690 412"
          preserveAspectRatio="none"
        >
          <path d={pathData} />
        </svg>

        {/* Labels */}
        <span className="mi-label" style={{ top: "20%" }}>
          Level 1
        </span>
        <span className="mi-label" style={{ top: "31%" }}>
          Level 2
        </span>
        <span className="mi-label" style={{ top: "44%" }}>
          Level 3
        </span>
      </div>
    </div>
  );
}
