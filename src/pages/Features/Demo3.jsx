import logoImg from "@/assets/Images/logo-dark.png";
import rawOption from "@/assets/Images/rawoption.png";
import magicCall from "@/assets/Images/magic_call.png";
import accountCircle from "@/assets/Images/account_circle.png";

import React, { useState, useMemo, useCallback, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
// IMPORTANT: only use the new Theming API CSS, do NOT import ag-grid.css
import "ag-grid-community/styles/ag-theme-quartz.css";

/* ---------------- Demo Data ---------------- */
const parentData = [
  {
    id: "p1",
    tick: "BIDU",
    time: "3:55PM",
    probability: "95%",
    premium: "$126K",
    orders: 8,
    score: "2X",
    times: [
      {
        id: "p1",
        time: "3:55PM",
        probability: "95%",
        premium: "$126K",
        orders: 8,
        score: "2X",
      },

      {
        id: "c1",
        time: "3:55PM",
        probability: "90%",
        premium: "$126K",
        orders: 8,
        score: "2X",
        trades: [],
      },
      {
        id: "c2",
        time: "3:45PM",
        probability: "60%",
        premium: "$116K",
        orders: 7,
        score: "2X",
        trades: [],
      },
      {
        id: "c3",
        time: "3:05PM",
        probability: "60%",
        premium: "$378K",
        orders: 12,
        score: "5X",
        trades: [],
      },
      {
        id: "c4",
        time: "11:15AM",
        probability: "75%",
        premium: "$255K",
        orders: 6,
        score: "3X",
        trades: [
          {
            expiry: "21-11-2025",
            trade: "Call",
            type: "BUY",
            strike: 155,
            spot: 131.91,
            totalCost: "$118,755",
            dte: 10,
          },
          {
            expiry: "21-11-2025",
            trade: "Call",
            type: "BUY",
            strike: 155,
            spot: 131.83,
            totalCost: "$80,730",
            dte: 10,
          },
          {
            expiry: "21-11-2025",
            trade: "Call",
            type: "BUY",
            strike: 155,
            spot: 131.78,
            totalCost: "$13,455",
            dte: 10,
          },
        ],
      },
      {
        id: "c5",
        time: "11:10AM",
        probability: "85%",
        premium: "$823K",
        orders: 21,
        score: "11X",
        trades: [],
      },
      {
        id: "c6",
        time: "9:35AM",
        probability: "60%",
        premium: "$106K",
        orders: 3,
        score: "1X",
        trades: [],
      },
    ],
  },
  {
    id: "p2",
    tick: "TSLA",
    time: "3:50PM",
    probability: "90%",
    premium: "$3.3M",
    orders: 37,
    score: "12X",
    times: [
      {
        id: "p2",
        time: "3:50PM",
        probability: "90%",
        premium: "$3.3M",
        orders: 37,
        score: "12X",
      },
      {
        id: "t1",
        time: "3:30PM",
        probability: "75%",
        premium: "$540K",
        orders: 12,
        score: "5X",
        trades: [],
      },
      {
        id: "t2",
        time: "3:15PM",
        probability: "95%",
        premium: "$750K",
        orders: 5,
        score: "15X",
        trades: [],
      },
    ],
  },
  {
    id: "p3",
    tick: "ACN",
    time: "3:55PM",
    probability: "50%",
    premium: "$91K",
    orders: 4,
    score: "8X",
    times: [
      {
        id: "a1",
        time: "3:45PM",
        probability: "50%",
        premium: "$224K",
        orders: 7,
        score: "20X",
        trades: [],
      },
      {
        id: "a2",
        time: "3:20PM",
        probability: "50%",
        premium: "$96K",
        orders: 3,
        score: "9X",
        trades: [],
      },
    ],
  },

  // ===== additional 6 rows =====

  {
    id: "p4",
    tick: "NVDA",
    time: "3:40PM",
    probability: "95%",
    premium: "$4.2M",
    orders: 28,
    score: "18X",
    times: [
      {
        id: "n1",
        time: "3:35PM",
        probability: "90%",
        premium: "$1.1M",
        orders: 9,
        score: "7X",
        trades: [],
      },
      {
        id: "n2",
        time: "3:20PM",
        probability: "95%",
        premium: "$2.6M",
        orders: 11,
        score: "22X",
        trades: [
          {
            expiry: "12-12-2025",
            trade: "Call",
            type: "BUY",
            strike: 1200,
            spot: 1188.5,
            totalCost: "$350K",
            dte: 30,
          },
        ],
      },
    ],
  },
  {
    id: "p5",
    tick: "AMZN",
    time: "3:25PM",
    probability: "80%",
    premium: "$1.9M",
    orders: 16,
    score: "9X",
    times: [
      {
        id: "am1",
        time: "3:10PM",
        probability: "75%",
        premium: "$880K",
        orders: 6,
        score: "6X",
        trades: [],
      },
      {
        id: "am2",
        time: "2:55PM",
        probability: "85%",
        premium: "$1.0M",
        orders: 7,
        score: "10X",
        trades: [
          {
            expiry: "10-01-2026",
            trade: "Put",
            type: "SELL",
            strike: 160,
            spot: 162.1,
            totalCost: "$120K",
            dte: 45,
          },
        ],
      },
    ],
  },
  {
    id: "p6",
    tick: "AAPL",
    time: "3:10PM",
    probability: "60%",
    premium: "$255K",
    orders: 12,
    score: "4X",
    times: [
      {
        id: "aa1",
        time: "3:00PM",
        probability: "60%",
        premium: "$120K",
        orders: 5,
        score: "3X",
        trades: [],
      },
      {
        id: "aa2",
        time: "2:40PM",
        probability: "80%",
        premium: "$135K",
        orders: 7,
        score: "6X",
        trades: [],
      },
    ],
  },
  {
    id: "p7",
    tick: "META",
    time: "2:55PM",
    probability: "75%",
    premium: "$664K",
    orders: 28,
    score: "1X",
    times: [
      {
        id: "m1",
        time: "2:45PM",
        probability: "75%",
        premium: "$320K",
        orders: 13,
        score: "2X",
        trades: [],
      },
      {
        id: "m2",
        time: "2:30PM",
        probability: "85%",
        premium: "$244K",
        orders: 8,
        score: "5X",
        trades: [],
      },
    ],
  },
  {
    id: "p8",
    tick: "MSFT",
    time: "2:40PM",
    probability: "60%",
    premium: "$184K",
    orders: 9,
    score: "7X",
    times: [
      {
        id: "ms1",
        time: "2:35PM",
        probability: "60%",
        premium: "$84K",
        orders: 4,
        score: "3X",
        trades: [],
      },
      {
        id: "ms2",
        time: "2:20PM",
        probability: "80%",
        premium: "$100K",
        orders: 5,
        score: "4X",
        trades: [],
      },
    ],
  },
  {
    id: "p9",
    tick: "PLTR",
    time: "3:30PM",
    probability: "50%",
    premium: "$349K",
    orders: 14,
    score: "1X",
    times: [
      {
        id: "pl1",
        time: "3:15PM",
        probability: "50%",
        premium: "$160K",
        orders: 6,
        score: "2X",
        trades: [],
      },
      {
        id: "pl2",
        time: "2:55PM",
        probability: "85%",
        premium: "$189K",
        orders: 8,
        score: "8X",
        trades: [
          {
            expiry: "01-03-2026",
            trade: "Call",
            type: "BUY",
            strike: 40,
            spot: 39.8,
            totalCost: "$75K",
            dte: 60,
          },
        ],
      },
    ],
  },
];
/* ---------------- Helpers ---------------- */
const parseProb = (v) => {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  const m = String(v).match(/\d+/);
  return m ? Number(m[0]) : 0;
};

const timeToMin = (t) => {
  if (!t) return -1;
  const m = t.match(/^(\d{1,2}):(\d{2})(AM|PM)$/i);
  if (!m) return -1;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const part = m[3].toUpperCase();
  if (part === "PM" && h !== 12) h += 12;
  if (part === "AM" && h === 12) h = 0;
  return h * 60 + min;
};

const parsePremium = (p) => {
  if (!p) return 0;
  const s = String(p).replace(/[$,]/g, "").toUpperCase();
  if (s.endsWith("M")) return parseFloat(s) * 1_000_000;
  if (s.endsWith("K")) return parseFloat(s) * 1_000;
  return parseFloat(s) || 0;
};

const parseScore = (s) => parseInt(String(s || "").replace(/X/i, ""), 10) || 0;

const rankOfKind = (k) => (k === "parent" ? 0 : k === "child" ? 1 : 2);

// Comparator preserving hierarchy after sort
const makeComparator = (field) => (a, b, nodeA, nodeB) => {
  const da = nodeA.data || {};
  const db = nodeB.data || {};
  let va = da[field];
  let vb = db[field];

  if (field === "probability") {
    va = parseProb(va);
    vb = parseProb(vb);
  } else if (field === "time") {
    va = timeToMin(va);
    vb = timeToMin(vb);
  } else if (field === "orders") {
    va = Number(va || 0);
    vb = Number(vb || 0);
  } else if (field === "premium") {
    va = parsePremium(va);
    vb = parsePremium(vb);
  } else if (field === "score") {
    va = parseScore(va);
    vb = parseScore(vb);
  } else if (field === "tick") {
    va = (va || "").toString();
    vb = (vb || "").toString();
  }

  if (va < vb) return -1;
  if (va > vb) return 1;

  // Tie-breakers
  const ra = rankOfKind(da.__kind);
  const rb = rankOfKind(db.__kind);
  if (ra !== rb) return ra - rb;

  if (da.__kind === "child" && db.__kind === "child") {
    if (da.parentId !== db.parentId)
      return (da.parentId || "").localeCompare(db.parentId || "");
    return timeToMin(da.time) - timeToMin(db.time);
  }

  if (da.__kind === "trades" && db.__kind === "trades") {
    if (da.parentId !== db.parentId)
      return (da.parentId || "").localeCompare(db.parentId || "");
  }

  return (da.id || "").toString().localeCompare((db.id || "").toString());
};

/* ---------------- Aggregated Table (Community: 3-level via row injection) ---------------- */
function AggregatedTable({ title, data }) {
  const gridRef = useRef(null);
  const [expandedParent, setExpandedParent] = useState(null);
  const [expandedChild, setExpandedChild] = useState(null);

  // Inject child & trades rows into the grid
  const displayRows = useMemo(() => {
    const rows = [];
    (data || []).forEach((p) => {
      rows.push({ ...p, __kind: "parent", __groupId: p.id });
      if (expandedParent === p.id) {
        (p.times || []).forEach((t) => {
          rows.push({
            ...t,
            tick: p.tick,
            __kind: "child",
            parentId: p.id,
            __groupId: p.id,
          });
          if (expandedChild === t.id) {
            rows.push({
              ...t,
              __kind: "trades",
              parentId: t.id,
              __groupId: p.id,
            });
          }
        });
      }
    });
    return rows;
  }, [data, expandedParent, expandedChild]);

  // Click handling (expand/collapse + collapse on other-group click)
  const onRowClicked = useCallback(
    (e) => {
      const d = e.data || {};
      const group = d.__groupId || d.id;

      if (expandedParent && group !== expandedParent) {
        setExpandedParent(null);
        setExpandedChild(null);
        return;
      }

      if (d.__kind === "parent") {
        setExpandedParent(expandedParent === d.id ? null : d.id);
        setExpandedChild(null);
      } else if (d.__kind === "child") {
        setExpandedChild(expandedChild === d.id ? null : d.id);
      } else if (d.__kind === "trades") {
        setExpandedChild(null);
      }
    },
    [expandedParent, expandedChild]
  );

  // Click anywhere else inside the grid → collapse to level 1
  const onGridClickCapture = useCallback(
    (e) => {
      if (!expandedParent) return;
      const rowEl = e.target.closest?.(".ag-row");
      if (!rowEl) {
        setExpandedParent(null);
        setExpandedChild(null);
      }
    },
    [expandedParent]
  );

  // Full-width trades renderer (header + alternating rows)
  const fullWidthCellRenderer = useCallback((p) => {
    const d = p.data || {};
    const trades = d.trades || [];

    return (
      <div style={{ padding: 10, background: "#282828", borderRadius: 4 }}>
        <table
          style={{
            width: "100%",
            color: "#fff",
            fontSize: 12,
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                color: "#959595",
                background: "black",
                textTransform: "uppercase",
              }}
            >
              <th style={{ padding: "6px 8px", textAlign: "left" }}>Time</th>
              <th style={{ padding: "6px 8px", textAlign: "left" }}>Expiry</th>
              <th style={{ padding: "6px 8px", textAlign: "left" }}>Trade</th>
              <th style={{ padding: "6px 8px", textAlign: "left" }}>Type</th>
              <th style={{ padding: "6px 8px", textAlign: "left" }}>Strike</th>
              <th style={{ padding: "6px 8px", textAlign: "left" }}>Spot</th>
              <th style={{ padding: "6px 8px", textAlign: "left" }}>
                TotalCost
              </th>
              <th style={{ padding: "6px 8px", textAlign: "left" }}>DTE</th>
            </tr>
          </thead>
          <tbody>
            {trades.length ? (
              trades.map((t, i) => (
                <tr
                  key={i}
                  style={{ background: i % 2 === 0 ? "#303030" : "#2b2b2b" }}
                >
                  <td style={{ padding: "6px 8px" }}>{d.time}</td>
                  <td style={{ padding: "6px 8px" }}>{t.expiry}</td>
                  <td style={{ padding: "6px 8px", color: "#0ea5e9" }}>
                    {t.trade}
                  </td>
                  <td style={{ padding: "6px 8px" }}>{t.type}</td>
                  <td style={{ padding: "6px 8px" }}>{t.strike}</td>
                  <td style={{ padding: "6px 8px" }}>{t.spot}</td>
                  <td style={{ padding: "6px 8px", color: "#FFD700" }}>
                    {t.totalCost}
                  </td>
                  <td style={{ padding: "6px 8px" }}>{t.dte}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  style={{
                    padding: "18px 8px",
                    color: "#959595",
                    textAlign: "center",
                  }}
                >
                  No trades in this window
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }, []);

  // Columns
  const colDefs = useMemo(
    () => [
      {
        field: "time",
        headerName: "Time",
        flex: 1,
        comparator: makeComparator("time"),
      },
      {
        field: "tick",
        headerName: "Tick",
        flex: 1,
        comparator: makeComparator("tick"),
        valueGetter: (p) => (p.data.__kind === "trades" ? null : p.data.tick),
        cellRenderer: (p) => {
          if (p.data.__kind === "trades") return null;
          const isParent = p.data.__kind === "parent";
          return (
            <span
              style={{
                color: isParent ? "#00FF59" : "#fff",
                fontWeight: isParent ? 400 : 400,
              }}
            >
              {p.value}
            </span>
          );
        },
      },
      {
        field: "probability",
        headerName: "Probability",
        flex: 1,
        comparator: makeComparator("probability"),
        valueGetter: (p) =>
          p.data.__kind === "trades" ? null : p.data.probability,
        cellRenderer: (p) => {
          if (p.data.__kind === "trades") return null;
          const n = parseProb(p.value);
          const color = n >= 95 ? "#b24af2" : n >= 85 ? "#0ea5e9" : "#00FF59";
          return p.value ? <span style={{ color }}>{p.value}</span> : null;
        },
      },
      {
        field: "orders",
        headerName: "Orders",
        flex: 0.9,
        comparator: makeComparator("orders"),
        valueGetter: (p) => (p.data.__kind === "trades" ? null : p.data.orders),
      },
      {
        field: "premium",
        headerName: "Premium",
        flex: 1,
        comparator: makeComparator("premium"),
        valueGetter: (p) =>
          p.data.__kind === "trades" ? null : p.data.premium,
        cellRenderer: (p) => {
          if (p.data.__kind === "trades") return null;
          const v = p.value;
          if (!v) return null;
          const color = /\dM$/i.test(v) ? "#1affb0" : "#FFD700";
          return <span style={{ color, fontWeight: 400 }}>{v}</span>;
        },
      },
      {
        field: "score",
        headerName: "Score",
        flex: 1,
        comparator: makeComparator("score"),
        valueGetter: (p) => (p.data.__kind === "trades" ? null : p.data.score),
        cellRenderer: (p) => {
          if (p.data.__kind === "trades") return null;
          const n = parseInt(String(p.value || ""), 10);
          const color = n > 10 ? "#0ea5e9" : "#fff";
          return p.value ? (
            <span style={{ color, fontWeight: 400 }}>{p.value}</span>
          ) : null;
        },
      },
      {
        headerName: "Analysis",
        field: "analysis",
        flex: 0.8,
        comparator: () => 0,
        // valueGetter: (p) => (p.data.__kind === "trades" ? null : "📊"),
        cellRenderer: () => <img src="analysis.svg" />,
      },
    ],
    []
  );

  // Keep hierarchy after sort
  const postSortRows = useCallback((params) => {
    const nodes = params.nodes;
    const parents = [];
    const childrenByGroup = new Map();
    const tradesByChild = new Map();

    for (const n of nodes) {
      const d = n.data || {};
      if (d.__kind === "parent") parents.push(n);
      else if (d.__kind === "child") {
        const arr = childrenByGroup.get(d.__groupId) || [];
        arr.push(n);
        childrenByGroup.set(d.__groupId, arr);
      } else if (d.__kind === "trades") {
        tradesByChild.set(d.parentId, n);
      }
    }

    const out = [];
    for (const p of parents) {
      out.push(p);
      const kids = childrenByGroup.get(p.data.id) || [];
      for (const k of kids) {
        out.push(k);
        const tr = tradesByChild.get(k.data.id);
        if (tr) out.push(tr);
      }
    }

    nodes.length = 0;
    for (const n of out) nodes.push(n);
  }, []);

  // Row height (larger for trades)
  const getRowHeight = useCallback((p) => {
    if (p.data.__kind !== "trades") return 28;
    const rows = Math.max(1, (p.data.trades || []).length);
    return 44 + rows * 24;
  }, []);

  // Styled to match your StyledTable (dark alt rows + gradient bands + dimming)
  const getRowStyle = useCallback(
    (params) => {
      const d = params.data || {};
      if (d.__kind === "trades")
        return { background: "#222", color: "#fff", borderRadius: 4 };

      const prob = parseProb(d.probability);
      const even = params.node.rowIndex % 2 === 0;
      const base =
        d.__kind === "child"
          ? even
            ? "#1e1e1e"
            : "#232323"
          : even
          ? "#2a2a2a"
          : "#262626";

      const gradient =
        prob >= 95
          ? "linear-gradient(90deg, rgba(178,74,242,0.30), transparent)"
          : prob >= 85
          ? "linear-gradient(90deg, rgba(14,165,233,0.30), transparent)"
          : "none";

      const dim = expandedParent && d.__groupId !== expandedParent;

      return {
        background: gradient === "none" ? base : `${gradient}, ${base}`,
        color: "#fff",
        opacity: dim ? 0.12 : 1,
        pointerEvents: dim ? "none" : "auto",
        transition: "opacity 150ms ease",
      };
    },
    [expandedParent]
  );

  // Full-width trades row (Community)
  const isFullWidthRow = useCallback(
    (p) => p?.rowNode?.data?.__kind === "trades",
    []
  );

  // Stable IDs
  const getRowId = useCallback((p) => {
    const d = p.data || {};
    if (d.__kind === "parent") return d.id;
    if (d.__kind === "child") return `${d.parentId}::${d.id}`;
    if (d.__kind === "trades") return `${d.parentId}::trades`;
    return Math.random().toString(36).slice(2);
  }, []);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        fontFamily: "Barlow, sans-serif",
      }}
    >
      <h3 style={{ color: "#fff", padding: "12px 10px" }}>{title}</h3>

      <div
        ref={gridRef}
        className="ag-theme-quartz dark-grid"
        style={{ flex: 1 }}
        onClickCapture={onGridClickCapture}
      >
        <AgGridReact
          rowData={displayRows}
          columnDefs={colDefs}
          defaultColDef={{ flex: 1, resizable: true, sortable: true }}
          onRowClicked={onRowClicked}
          getRowHeight={getRowHeight}
          getRowStyle={getRowStyle}
          postSortRows={postSortRows}
          isFullWidthRow={isFullWidthRow}
          fullWidthCellRenderer={fullWidthCellRenderer}
          suppressRowHoverHighlight
          animateRows
          getRowId={getRowId}
        />
      </div>

      <style>{`
        .dark-grid .ag-root-wrapper,
        .dark-grid .ag-center-cols-container,
        .dark-grid .ag-body-viewport { background:#1a1a1a !important; }

        .dark-grid .ag-header { background:#000 !important; }
        .dark-grid .ag-header-cell-label {
          color:#959595 !important;
          font-weight:400;
          font-size:12px;
          font-family:Barlow,sans-serif;
        }
        /* header separators like StyledTable */
        .dark-grid .ag-header-cell::after {
          content:"";
          position:absolute;
          right:0; top:40%;
          height:25%; width:1px;
          background:#666; opacity:.5; pointer-events:none;
        }
        .dark-grid .ag-header-cell:last-child::after { display:none; }

        .dark-grid .ag-row, .dark-grid .ag-cell { border:none !important; }
        .dark-grid .ag-cell { display:flex; align-items:center;
    align-items: center;
    left: 0px;
    width: 85px;
    color: rgb(95, 95, 95);
    text-align: center;
    font-family: Barlow;
    font-size: 12px;
    font-weight: 400;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
         }
        .dark-grid .ag-header-cell-resize { background:#666 !important; }

        .ag-sort-indicator-icon {display: none; }
      `}</style>
    </div>
  );
}

/* ---------------- Dashboard (Sidebar + Header + Two Panels) ---------------- */
export default function Dashboard() {
  return (
    <div
      style={{
        display: "flex",
        height: "inherit",
        background: "#1a1a1a",
        fontFamily: "Barlow",
        borderTopLeftRadius: "28px",
        borderBottomLeftRadius: "28px",
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
          borderBottomLeftRadius: "28px",
          borderTopLeftRadius: "12px",
        }}
      >
        <div style={{ marginBottom: "40px" }}>
          <img
            src={logoImg}
            alt="Logo"
            className="logo"
            style={{ height: "58px", width: "156px", marginLeft: "34%" }}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <img
            src={rawOption}
            alt="Logo"
            className="logo"
            style={{ height: "20px", width: "20px" }}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <img
            src={magicCall}
            alt="Logo"
            className="logo"
            style={{ height: "20px", width: "20px" }}
          />
        </div>
        <div style={{ marginTop: "auto", marginBottom: "20px" }}>
          <img
            src={accountCircle}
            alt="Logo"
            className="logo"
            style={{ height: "20px", width: "20px" }}
          />
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div
          style={{
            height: "60px",
            background: "#2a2a2a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 20px",
            color: "#fff",
            fontWeight: 400,
          }}
        >
          {/* <span>Aggregated Call Buys</span> */}
          <input
            type="text"
            placeholder="09/18/2025"
            style={{
              background: "#434343",
              border: "none",
              color: "#fff",
              padding: "6px 10px",
              borderRadius: "6px",
              marginRight: "32px",
            }}
          />
        </div>

        {/* Two Panels */}
        <div style={{ flex: 1, display: "flex", padding: "10px" }}>
          <AggregatedTable title="Aggregated Call Buys" data={parentData} />
          <div style={{ width: "20px" }} />
          <AggregatedTable title="Aggregated Put Buys" data={parentData} />
        </div>
      </div>
    </div>
  );
}
