import {
  StyledTable,
  StyleMainDiv,
} from "../../style/containers/AnimatedTable";

import React, { useEffect, useRef, useState } from "react";

const demoRows = [
  {
    tick: "ACN",
    probability: "95%",
    premium: "$91K",
    orders: 4,
    score: "8X",
    times: [
      {
        time: "3:55PM",
        probability: "50%",
        premium: "$91K",
        orders: 4,
        score: "8X",
      },
      {
        time: "3:45PM",
        probability: "50%",
        premium: "$224K",
        orders: 7,
        score: "20X",
      },
      {
        time: "3:20PM",
        probability: "50%",
        premium: "$96K",
        orders: 3,
        score: "9X",
      },
      {
        time: "1:40PM",
        probability: "50%",
        premium: "$51K",
        orders: 3,
        score: "5X",
      },
    ],
  },
  {
    tick: "AFRM",
    probability: "50%",
    premium: "$82K",
    orders: 3,
    score: "8X",
    times: [
      {
        time: "3:55PM",
        probability: "50%",
        premium: "$91K",
        orders: 4,
        score: "8X",
      },
      {
        time: "3:45PM",
        probability: "50%",
        premium: "$224K",
        orders: 7,
        score: "20X",
      },
      {
        time: "3:20PM",
        probability: "50%",
        premium: "$96K",
        orders: 3,
        score: "9X",
      },
      {
        time: "1:40PM",
        probability: "50%",
        premium: "$51K",
        orders: 3,
        score: "5X",
      },
    ],
  },
  {
    tick: "CRWV",
    probability: "50%",
    premium: "$568K",
    orders: 26,
    score: "2X",
    times: [
      {
        time: "3:55PM",
        probability: "50%",
        premium: "$91K",
        orders: 4,
        score: "8X",
      },
      {
        time: "3:45PM",
        probability: "50%",
        premium: "$224K",
        orders: 7,
        score: "20X",
      },
      {
        time: "3:20PM",
        probability: "50%",
        premium: "$96K",
        orders: 3,
        score: "9X",
      },
      {
        time: "1:40PM",
        probability: "50%",
        premium: "$51K",
        orders: 3,
        score: "5X",
      },
    ],
  },
  {
    tick: "ACN",
    probability: "50%",
    premium: "$91K",
    orders: 4,
    score: "8X",
    times: [
      {
        time: "3:55PM",
        probability: "50%",
        premium: "$91K",
        orders: 4,
        score: "8X",
      },
      {
        time: "3:45PM",
        probability: "50%",
        premium: "$224K",
        orders: 7,
        score: "20X",
      },
      {
        time: "3:20PM",
        probability: "50%",
        premium: "$96K",
        orders: 3,
        score: "9X",
      },
      {
        time: "1:40PM",
        probability: "50%",
        premium: "$51K",
        orders: 3,
        score: "5X",
      },
    ],
  },
];

export default function AggregatedTableDemo() {
  const [expandedParent, setExpandedParent] = useState(null);
  const [expandedChild, setExpandedChild] = useState(null);
  const expandedZoneRef = useRef(null);

  // Collapse on outside click (safe zone = expandedZoneRef)
  useEffect(() => {
    function handleClick(event) {
      if (
        (expandedParent !== null || expandedChild !== null) &&
        expandedZoneRef.current
      ) {
        if (!expandedZoneRef.current.contains(event.target)) {
          // reset to stock list view
          setExpandedParent(null);
          setExpandedChild(null);
        }
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [expandedParent, expandedChild]);

  return (
    <StyleMainDiv style={{ marginLeft: 0 }}>
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
          <tbody className="Tbodyscroll" ref={expandedZoneRef}>
            {demoRows.map((row, idx) => {
              const isExpandedParent = expandedParent === idx;
              const isSomeParentExpanded = expandedParent !== null;
              const isDimmed = isSomeParentExpanded && !isExpandedParent;

              return (
                <React.Fragment key={row.tick}>
                  {/* --- Parent row --- */}
                  <tr
                    className={`${isDimmed ? "dimmed" : ""}`}
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      if (isExpandedParent) {
                        setExpandedParent(null);
                        setExpandedChild(null);
                      } else {
                        setExpandedParent(idx);
                        setExpandedChild(null);
                      }
                    }}
                  >
                    <td>{row.times ? row.times[0].time : "--"}</td>
                    <td style={{ color: "#00FF59" }}>{row.tick}</td>
                    <td style={{ color: "#00FF59" }}>{row.probability}</td>
                    <td>{row.orders}</td>
                    <td style={{ color: "#FFD700" }}>{row.premium}</td>
                    <td>{row.score}</td>
                    <td>📊</td>
                  </tr>

                  {/* --- Expanded parent → show time rows --- */}
                  {isExpandedParent &&
                    row.times &&
                    row.times.map((t, tIdx) => {
                      const isExpandedChild = expandedChild === tIdx;
                      return (
                        <React.Fragment key={tIdx}>
                          <tr
                            className="accordion-content-row"
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              setExpandedChild(isExpandedChild ? null : tIdx)
                            }
                          >
                            <td>{t.time}</td>
                            <td>{row.tick}</td>
                            <td style={{ color: "#00FF59" }}>
                              {t.probability}
                            </td>
                            <td>{t.orders}</td>
                            <td style={{ color: "#FFD700" }}>{t.premium}</td>
                            <td
                              style={{
                                color: t.score.includes("20")
                                  ? "#0ea5e9"
                                  : "inherit",
                              }}
                            >
                              {t.score}
                            </td>
                            <td>📊</td>
                          </tr>

                          {/* --- Expanded child row detail --- */}
                          {isExpandedChild && (
                            <tr className="accordion-content-row">
                              <td colSpan={7}>
                                <table style={{ width: "100%" }}>
                                  <thead>
                                    <tr>
                                      <th>Time</th>
                                      <th>Expiry</th>
                                      <th>Trade</th>
                                      <th>Type</th>
                                      <th>Strike</th>
                                      <th>Spot</th>
                                      <th>TotalCost</th>
                                      <th>DTE</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>{t.time}</td>
                                      <td>09/25</td>
                                      <td>BUY</td>
                                      <td>CALL</td>
                                      <td>250</td>
                                      <td>249.5</td>
                                      <td>$120K</td>
                                      <td>10</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </StyledTable>

      <style>{`
        .dimmed {
          opacity: 0.3;
          pointer-events: none;
        }
      `}</style>
    </StyleMainDiv>
  );
}
