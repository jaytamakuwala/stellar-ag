import AggregatedTableDemo from "./Demo"; // our expandable demo table
import { StyledTable } from "../../style/containers/AnimatedTable";

// Dummy second table (Put Buys)
function AggregatedPutBuysDemo() {
  const rows = [
    {
      time: "3:55PM",
      tick: "APP",
      probability: "50%",
      orders: 3,
      premium: "$82K",
      score: "8X",
    },
    {
      time: "3:50PM",
      tick: "CRWD",
      probability: "60%",
      orders: 5,
      premium: "$119K",
      score: "6X",
    },
    {
      time: "3:45PM",
      tick: "AMZN",
      probability: "80%",
      orders: 8,
      premium: "$1.2M",
      score: "15X",
    },
  ];
  return (
    <StyledTable>
      <table>
        <thead className="TheadTable">
          <tr>
            <th>Time</th>
            <th>Tick</th>
            <th>Probability</th>
            <th>Orders</th>
            <th>Premium</th>
            <th>Score</th>
            <th>Analysis</th>
          </tr>
        </thead>
        <tbody className="Tbodyscroll">
          {rows.map((r, idx) => (
            <tr key={idx}>
              <td>{r.time}</td>
              <td style={{ color: "red" }}>{r.tick}</td>
              <td
                style={{
                  color: r.probability === "80%" ? "#0ea5e9" : "#FF605D",
                }}
              >
                {r.probability}
              </td>
              <td>{r.orders}</td>
              <td style={{ color: "#FFD700" }}>{r.premium}</td>
              <td>{r.score}</td>
              <td>📊</td>
            </tr>
          ))}
        </tbody>
      </table>
    </StyledTable>
  );
}

export default function DashboardDemo() {
  return (
    <div
      style={{
        display: "flex",
        height: "inherit",
        overflow: "hidden",
        background: "#1a1a1a",
        fontFamily: "Barlow",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "65px",
          background: "#2d2d2d",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "10px 0",
        }}
      >
        <div style={{ marginBottom: "40px", cursor: "pointer" }}>📈</div>
        <div style={{ marginBottom: "20px", cursor: "pointer" }}>📊</div>
        <div style={{ marginBottom: "20px", cursor: "pointer" }}>⚙️</div>
        <div
          style={{ marginTop: "auto", marginBottom: "20px", cursor: "pointer" }}
        >
          👤
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Top Header */}
        <div
          style={{
            height: "60px",
            background: "#2a2a2a",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
            color: "#fff",
            fontWeight: "600",
          }}
        >
          <span>Aggregated Dashboard</span>
          <input
            type="text"
            placeholder="09/25/2024"
            style={{
              background: "#434343",
              border: "none",
              color: "#fff",
              padding: "5px 10px",
              borderRadius: "6px",
            }}
          />
        </div>

        {/* Two Panels Side by Side */}
        <div style={{ flex: 1, display: "flex", padding: "10px" }}>
          {/* Left Panel */}
          <div
            style={{
              flex: 1,
              marginRight: "10px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h3 style={{ color: "#fff", padding: "10px" }}>
              Aggregated Call Buys
            </h3>
            <div
              style={{
                flex: 1,
                background: "#1e1e1e",
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              <AggregatedTableDemo />
            </div>
          </div>

          {/* Right Panel */}
          <div
            style={{
              flex: 1,
              marginLeft: "10px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h3 style={{ color: "#fff", padding: "10px" }}>
              Aggregated Put Buys
            </h3>
            <div
              style={{
                flex: 1,
                background: "#1e1e1e",
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              <AggregatedPutBuysDemo />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
