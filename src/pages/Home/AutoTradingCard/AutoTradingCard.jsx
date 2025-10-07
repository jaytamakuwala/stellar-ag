import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./AutoTradingCard.css";
import MarketIntelligence from "./MarketIntelligence/MarketIntelligence";

const CARD_W = 690;
const CARD_H = 604;
const CHART_TOP = 215;
const CHART_H_PIX = 389;
const PADDING_LEFT = 30;
const PADDING_RIGHT = 30;
const VISIBLE_WIDTH = CARD_W - PADDING_LEFT - PADDING_RIGHT;
const STEP = 20; // candle spacing
const VISIBLE_COUNT = Math.ceil(VISIBLE_WIDTH / STEP);
const SEQ_COUNT = VISIBLE_COUNT + 10;

// Small seeded random generator (always same sequence)
function seededRandom(seed) {
  let x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function makeSequence(len, startIndex = 0) {
  const seq = [];
  let seed = 42; // fixed seed → same "randomness" each reload

  for (let i = 0; i < len; i++) {
    const idx = startIndex + i;
    const wave = Math.sin(idx / 4) * 30;
    const trend = Math.cos(idx / 10) * 10;
    const base = 100 + wave + trend;

    // use seededRandom instead of Math.random
    const o = base + (seededRandom(seed++) - 0.5) * 12;
    const c = o + (seededRandom(seed++) - 0.5) * 18;
    const h = Math.max(o, c) + (seededRandom(seed++) * 12 + 6);
    const l = Math.min(o, c) - (seededRandom(seed++) * 12 + 6);
    const bullish = c >= o;

    seq.push({ o, c, h, l, bullish, label: null });
  }

  // ---- Add 5 fixed markers at spread-out points ----
  const markers = [
    { i: Math.floor(len * 0.15), type: "BUY", pos: "bottom" },
    { i: Math.floor(len * 0.3), type: "SELL", pos: "top" },
    { i: Math.floor(len * 0.5), type: "BUY", pos: "bottom" },
    { i: Math.floor(len * 0.7), type: "SELL", pos: "top" },
    { i: Math.floor(len * 0.85), type: "BUY", pos: "bottom" },
  ];

  markers.forEach((m) => {
    if (seq[m.i]) {
      seq[m.i].label = { type: m.type, pos: m.pos };
    }
  });

  return seq;
}

export default function AutoTradingChart() {
  const [index, setIndex] = useState(0);

  const baseSeq = useMemo(() => makeSequence(200), []);
  const slice = baseSeq.slice(index, index + SEQ_COUNT);

  const minPrice = Math.min(...slice.map((c) => c.l));
  const maxPrice = Math.max(...slice.map((c) => c.h));

  const priceToY = (price) => {
    const range = maxPrice - minPrice || 1;
    const rel = (maxPrice - price) / range;
    return Math.round(rel * (CHART_H_PIX - 16)) + 8;
  };

  useEffect(() => {
    const current = slice[slice.length - 1];
    const delay = current.label ? 2200 : 900;
    const timer = setTimeout(() => {
      setIndex((i) => (i + 1) % (baseSeq.length - SEQ_COUNT));
    }, delay);
    return () => clearTimeout(timer);
  }, [index, slice, baseSeq.length]);

  return (
    <section className="feature-wrapper">
      <div className="auto-card" style={{ height: CARD_H }}>
        <div className="autoTradingCard-header">
          <div className="header-inner">
            <h2 className="mi-title">Smart Auto Trading</h2>
            <p
              className="card-desc"
              style={{ width: "-webkit-fill-available" }}
            >
              Automated buy and sell execution with precision timing — removing
              delays, emotions, and missed opportunities.
            </p>
          </div>
        </div>

        {/* Chart */}
        <div
          className="chart-area"
          style={{
            top: CHART_TOP,
            height: CHART_H_PIX,
          }}
        >
          <motion.div
            className="candles-track"
            animate={{ x: -index * STEP }}
            transition={{ type: "spring", stiffness: 60, damping: 18 }}
          >
            {baseSeq.map((c, i) => {
              const left = i * STEP;
              const yHigh = priceToY(c.h);
              const yLow = priceToY(c.l);
              const yOpen = priceToY(c.o);
              const yClose = priceToY(c.c);

              const bodyTop = Math.min(yOpen, yClose);
              const bodyHeight = Math.max(3, Math.abs(yClose - yOpen));
              const wickHeight = yLow - yHigh;

              return (
                <div
                  key={i}
                  className="candle-wrap"
                  style={{ left: `${left}px` }}
                >
                  <div
                    className={`wick ${c.bullish ? "green" : "red"}`}
                    style={{
                      top: `${yHigh}px`,
                      height: `${wickHeight}px`,
                    }}
                  />

                  <div
                    className={`body ${c.bullish ? "green" : "red"}`}
                    style={{
                      top: `${bodyTop}px`,
                      height: `${bodyHeight}px`,
                    }}
                  />

                  {c.label && i >= index && i < index + VISIBLE_COUNT && (
                    <div
                      className={`marker ${c.label.type.toLowerCase()}`}
                      style={{
                        top:
                          c.label.pos === "top" ? `${yHigh - 25}px` : undefined,
                        bottom:
                          c.label.pos === "bottom"
                            ? `${CHART_H_PIX - yLow + 25}px`
                            : undefined,
                      }}
                    >
                      {c.label.type}
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
      <MarketIntelligence />
    </section>
  );
}
