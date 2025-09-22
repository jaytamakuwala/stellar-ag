import { useState, useEffect, useRef } from "react";
import "./FinancialFilterPanel.css";

const FinancialFilterPanel = () => {
  const [filters, setFilters] = useState({
    score: 20,
    totalCallBuy: 30,
  });

  const [isVisible, setIsVisible] = useState(true);
  const [cursorPosition, setCursorPosition] = useState({ x: 250, y: 320 });
  const [, setCurrentStep] = useState(0);

  const scoreSliderRef = useRef(null);
  const callBuySliderRef = useRef(null);
  const closeButtonRef = useRef(null);

  const animationSteps = [
    { action: "moveToScore", duration: 1000 },
    { action: "jumpScore", duration: 800 },
    { action: "moveToCallBuy", duration: 1000 },
    { action: "jumpCallBuy", duration: 800 },
    { action: "moveToClose", duration: 1000 },
    { action: "clickClose", duration: 800 },
    { action: "wait", duration: 1500 },
    { action: "showPanel", duration: 1000 },
    { action: "reset", duration: 800 },
  ];

  const getSliderPosition = (value, sliderElement) => {
    if (!sliderElement) return { x: 250, y: 320 };

    const track = sliderElement.querySelector(".slider-track");
    const trackRect = track.getBoundingClientRect();
    const parentRect = sliderElement
      .closest(".panel-content")
      .getBoundingClientRect();

    const percentage = value / 100;
    const x = trackRect.left - parentRect.left + trackRect.width * percentage;
    const y = trackRect.top - parentRect.top + trackRect.height / 2;

    return { x, y };
  };

  useEffect(() => {
    const runAnimation = () => {
      let stepIndex = 0;

      const executeStep = () => {
        if (stepIndex >= animationSteps.length) {
          setTimeout(runAnimation, 2000);
          return;
        }

        const step = animationSteps[stepIndex];
        setCurrentStep(stepIndex);

        switch (step.action) {
          case "moveToScore": {
            const pos = getSliderPosition(
              filters.score,
              scoreSliderRef.current
            );
            setCursorPosition(pos);
            break;
          }
          case "jumpScore": {
            const newValue = 80;
            setFilters((prev) => ({ ...prev, score: newValue }));
            const pos = getSliderPosition(newValue, scoreSliderRef.current);
            setCursorPosition(pos);
            break;
          }
          case "moveToCallBuy": {
            const pos = getSliderPosition(
              filters.totalCallBuy,
              callBuySliderRef.current
            );
            setCursorPosition(pos);
            break;
          }
          case "jumpCallBuy": {
            const newValue = 70;
            setFilters((prev) => ({ ...prev, totalCallBuy: newValue }));
            const pos = getSliderPosition(newValue, callBuySliderRef.current);
            setCursorPosition(pos);
            break;
          }
          case "moveToClose": {
            if (closeButtonRef.current) {
              const rect = closeButtonRef.current.getBoundingClientRect();
              const parentRect = closeButtonRef.current
                .closest(".panel-content")
                .getBoundingClientRect();
              setCursorPosition({
                x: rect.left - parentRect.left + rect.width / 2,
                y: rect.top - parentRect.top + rect.height / 2,
              });
            }
            break;
          }
          case "clickClose":
            setIsVisible(false);
            break;
          case "showPanel":
            setIsVisible(true);
            break;
          case "reset":
            setFilters({ score: 20, totalCallBuy: 30 });
            setCursorPosition({ x: 250, y: 320 });
            break;
          default:
            break;
        }

        stepIndex++;
        setTimeout(executeStep, step.duration);
      };

      executeStep();
    };

    runAnimation();
  }, []);

  return (
    <div className={`financial-panel ${isVisible ? "visible" : "hidden"}`}>
      <div className="panel-content">
        {/* Cursor */}
        <div
          className="cursor"
          style={{
            left: `${cursorPosition.x}px`,
            top: `${cursorPosition.y}px`,
            opacity: 1,
          }}
        >
          <svg width="24" height="32" viewBox="0 0 24 32" fill="none">
            <path
              d="M2 2L2 26L8 20L12 28L16 26L12 18L22 18L2 2Z"
              fill="#282828"
              stroke="white"
              strokeWidth="1"
            />
          </svg>
        </div>

        {/* Header */}
        <div className="panel-header">
          <h1 className="panel-title">Filter</h1>
          <div className="header-buttons">
            <div className="reset-btn">⟳</div>
            <div ref={closeButtonRef} className="close-btn">
              ✕
            </div>
          </div>
        </div>

        {/* Sliders */}
        <div ref={scoreSliderRef} className="slider-group">
          <div className="slider-header">
            <span>Score</span>
            <span className="slider-value">{Math.round(filters.score)}</span>
          </div>
          <div className="slider-container">
            <div className="slider-track" />
            <div
              className="slider-fill"
              style={{ width: `${filters.score}%` }}
            />
            <div
              className="slider-handle"
              style={{ left: `${filters.score}%` }}
            />
          </div>
        </div>

        <div ref={callBuySliderRef} className="slider-group">
          <div className="slider-header">
            <span>Total Call Buy Cost</span>
            <span className="slider-value wide">
              ${(Math.round(filters.totalCallBuy) * 156250).toLocaleString()}
            </span>
          </div>
          <div className="slider-container">
            <div className="slider-track" />
            <div
              className="slider-fill"
              style={{ width: `${filters.totalCallBuy}%` }}
            />
            <div
              className="slider-handle"
              style={{ left: `${filters.totalCallBuy}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialFilterPanel;
