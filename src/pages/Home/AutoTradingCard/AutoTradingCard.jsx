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

function makeSequence(len, startIndex = 0) {
  const seq = [];
  for (let i = 0; i < len; i++) {
    const idx = startIndex + i;
    const wave = Math.sin(idx / 4) * 30;
    const trend = Math.cos(idx / 10) * 10;
    const base = 100 + wave + trend;

    const o = base + (Math.random() - 0.5) * 12;
    const c = o + (Math.random() - 0.5) * 18;
    const h = Math.max(o, c) + (Math.random() * 12 + 6);
    const l = Math.min(o, c) - (Math.random() * 12 + 6);
    const bullish = c >= o;

    let label = null;
    if (Math.random() > 0.9) {
      label = bullish
        ? { type: "BUY", pos: "top" }
        : { type: "SELL", pos: "bottom" };
    }

    seq.push({ o, c, h, l, bullish, label });
  }
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
      <div className="auto-card" style={{ width: CARD_W, height: CARD_H }}>
        <div className="autoTradingCard-header">
          <div className="header-inner" style={{ width: CARD_W - 60 }}>
            <h2 className="title">Smart Auto Trading</h2>
            <p className="subtitle">
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
