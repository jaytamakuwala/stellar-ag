/* eslint-disable react/prop-types */
import "./Pricing.css";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import check from "@/assets/Images/check.png";
import cross from "@/assets/Images/cross.png";
import PricingTestimonial from "./PricingTestimonial/PricingTestimonial";
import FaqSection from "./FaqSection/FaqSection";
import Footer from "../Home/Footer/Footer";
import React from "react";

/* Custom Switch */
const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 60,
  height: 30,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(32px)",
      "& .MuiSwitch-thumb": { backgroundColor: "#f1c40f" },
      "& + .MuiSwitch-track": {
        backgroundColor: "#39393D",
        opacity: 1,
        border: 0,
      },
    },
  },
  "& .MuiSwitch-thumb": { width: 26, height: 26, backgroundColor: "#33cf4d" },
  "& .MuiSwitch-track": {
    borderRadius: 30,
    backgroundColor: "#E9E9EA",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

// No changes to PlanHeader component
const PlanHeader = ({
  titleClass,
  title,
  subtitle,
  discount,
  monthlyPrice,
  yearlyPrice,
  buttonText,
  buttonClass,
  highlight,
  isYearly,
  onToggle,
}) => (
  <div className="plan-header-wrapper">
    <h2 className={titleClass}>{title} Plan</h2>
    <p className="plan-subtitle">{subtitle}</p>
    {highlight && <span className="plan-suggested">{highlight}</span>}
    <div className="divider" />
    <div className="plan-details">
      <span className="plan-discount">{discount}</span>
      <span className="plan-price">
        {isYearly ? yearlyPrice : monthlyPrice}
      </span>
      <FormGroup>
        <FormControlLabel
          control={
            <IOSSwitch sx={{ m: 1 }} checked={isYearly} onChange={onToggle} />
          }
          label={isYearly ? "Yearly" : "Monthly"}
        />
      </FormGroup>
      <span className="plan-due">No Payment Due Now</span>
    </div>
    <button className={`pricing-btn ${buttonClass}`}>{buttonText}</button>
  </div>
);

const FEATURES = [
  "Real Time Options Flow",
  "Real Time Buy and Sell Alerts",
  "Live Auto Trade",
  "Real Time Order Flow",
  "Advanced Filters",
  "Unusual Volume Data",
  "Flow Overview Insights",
  "On-Demand Historical Data",
  "Stellar Trade AI",
  "Custom Watchlist Builder",
  "Dark Pool Orders",
  "Dark Pool Levels",
  "AI Power Alerts",
  "Free Trial Period",
];

const availability = {
  standard: (i) => [0, 3, 4, 5, 6, 7, 8, 13].includes(i),
  pro: (i) => i < 10 && i !== 2,
  elite: (i) => i !== 13,
};

// Reverted discount text to original format as requested
const PLAN_META = {
  standard: {
    titleClass: "plan-title-standard",
    title: "Standard",
    subtitle: "For traders new to order flow or just looking for options data.",
    discount: "Save 15% For Annual.",
    monthlyPrice: "$199 /mo",
    yearlyPrice: "$2030 /yr",
    buttonText: "Buy Standard Plan",
    buttonClass: "pricing-btn-green",
  },
  pro: {
    titleClass: "plan-title-pro",
    title: "Pro",
    subtitle: "For traders new to order flow or just looking for options data.",
    discount: "Save 20% For Annual.",
    monthlyPrice: "$299 /mo",
    yearlyPrice: "$2870 /yr",
    buttonText: "Start Free 7 Day Trial",
    buttonClass: "pricing-btn-gradient",
    highlight: "Most Popular",
  },
  elite: {
    titleClass: "plan-title-elite",
    title: "Elite",
    subtitle: "For full time traders experienced with order flow.",
    discount: "Save 25% For Annual.",
    monthlyPrice: "$499 /mo",
    yearlyPrice: "$4491 /yr",
    buttonText: "Buy Elite Plan",
    buttonClass: "pricing-btn-yellow",
  },
};

const PlanFeatureList = ({ planKey }) => (
  <ul className="plan-feature-list">
    {FEATURES.map((feature, i) => {
      const hasIt = availability[planKey](i);
      return (
        <li key={feature} className="plan-feature-row">
          <span className="plan-feature-text">{feature}</span>
          <img
            className={`plan-feature-icon ${
              hasIt ? "available" : "unavailable"
            }`}
            src={hasIt ? check : cross}
            alt={hasIt ? "Included" : "Not included"}
          />
        </li>
      );
    })}
  </ul>
);

const Pricing = () => {
  const [activePlan, setActivePlan] = React.useState("standard");

  // --- CHANGE 1: Use an object to track each plan's state individually ---
  const [yearlyPlans, setYearlyPlans] = React.useState({
    standard: false,
    pro: false,
    elite: false,
  });

  // --- CHANGE 2: The handler now accepts a 'planKey' to update the correct plan ---
  const handlePlanSwitch = (planKey) => {
    setYearlyPlans((prev) => ({
      ...prev, // Copy the existing states
      [planKey]: !prev[planKey], // Toggle the state for the specific plan
    }));
  };

  return (
    <div className="pricing-container">
      {/* Hero Section */}
      <section className="pricing">
        <div className="pricing-text pricing-title-container">
          <h1 className="pricing-title">Pricing Plans</h1>
          <p className="pricing-subtitle">
            Our pricing is designed to be flexible and transparent, and you can
            cancel at any time.
          </p>
        </div>
      </section>

      {/* Grid Table Section */}
      <section className="pricing-grid-section">
        <div className="desktop-only">
          <div className="pricing-grid">
            <div className="features-cell empty"></div>

            {/* --- CHANGE 3: Pass the correct state and handler to each PlanHeader --- */}
            <div className="plan-column">
              <PlanHeader
                {...PLAN_META.standard}
                isYearly={yearlyPlans.standard}
                onToggle={() => handlePlanSwitch("standard")}
              />
            </div>

            <div className="plan-column">
              <PlanHeader
                {...PLAN_META.pro}
                isYearly={yearlyPlans.pro}
                onToggle={() => handlePlanSwitch("pro")}
              />
            </div>

            <div className="plan-column">
              <PlanHeader
                {...PLAN_META.elite}
                isYearly={yearlyPlans.elite}
                onToggle={() => handlePlanSwitch("elite")}
              />
            </div>

            {FEATURES.map((feature, i) => (
              <React.Fragment key={`row-${i}`}>
                <div className="features-cell">{feature}</div>
                <div className="feature-icon">
                  <img src={availability.standard(i) ? check : cross} alt="" />
                </div>
                <div className="feature-icon">
                  <img src={availability.pro(i) ? check : cross} alt="" />
                </div>
                <div className="feature-icon">
                  <img src={availability.elite(i) ? check : cross} alt="" />
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Mobile/Tablet tabbed view */}
        <div
          className="tabbed-plans mobile-only"
          role="region"
          aria-label="Pricing plans"
        >
          <div className="plan-tabs" role="tablist" aria-label="Select plan">
            {["standard", "pro", "elite"].map((key) => (
              <button
                key={key}
                role="tab"
                type="button"
                className={`plan-tab ${activePlan === key ? "active" : ""}`}
                aria-selected={activePlan === key}
                onClick={() => setActivePlan(key)}
              >
                {key === "standard" && "Standard Plan"}
                {key === "pro" && "Pro Plan"}
                {key === "elite" && "Elite Plan"}
              </button>
            ))}
          </div>

          <div
            className="plan-panel"
            role="tabpanel"
            aria-labelledby={`${activePlan}-tab`}
          >
            <div className="plan-column">
              {/* --- CHANGE 4: The mobile view now also uses the correct state and handler --- */}
              <PlanHeader
                {...PLAN_META[activePlan]}
                isYearly={yearlyPlans[activePlan]}
                onToggle={() => handlePlanSwitch(activePlan)}
              />
            </div>
            <PlanFeatureList planKey={activePlan} />
          </div>
        </div>
      </section>

      {/* Keep the rest as-is */}
      <section className="pricing-grid-section">
        <PricingTestimonial />
      </section>
      <section className="pricing-grid-section">
        <FaqSection />
      </section>
      <Footer />
    </div>
  );
};

export default Pricing;
