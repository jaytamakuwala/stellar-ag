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

const PlanHeader = ({
  titleClass,
  title,
  subtitle,
  discount,
  price,
  buttonText,
  buttonClass,
  highlight,
}) => (
  <div className="plan-header-wrapper">
    <h2 className={titleClass}>{title} Plan</h2>
    <p className="plan-subtitle">{subtitle}</p>
    {highlight && <span className="plan-suggested">{highlight}</span>}
    <div className="divider" />
    <div className="plan-details">
      <span className="plan-discount">{discount}</span>
      <span className="plan-price">{price}</span>
      <FormGroup>
        <FormControlLabel
          control={<IOSSwitch sx={{ m: 1 }} />}
          label="Monthly"
        />
      </FormGroup>
      <span className="plan-due">No Payment Due Now</span>
    </div>
    <button className={`pricing-btn ${buttonClass}`}>{buttonText}</button>
  </div>
);

const Pricing = () => {
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
        <div className="pricing-grid">
          {/* Row 1: Empty corner + Plan Headers */}
          <div className="features-cell empty"></div>
          <div className="plan-column">
            <PlanHeader
              titleClass="plan-title-standard"
              title="Standard"
              subtitle="For traders new to order flow or just looking for options data."
              discount="Save 15% For Annual."
              price="$199 /mo"
              buttonText="Buy Standard Plan"
              buttonClass="pricing-btn-green"
            />
          </div>
          <div className="plan-column">
            <PlanHeader
              titleClass="plan-title-pro"
              title="Pro"
              subtitle="For traders new to order flow or just looking for options data."
              discount="Save 20% For Annual."
              price="$299 /mo"
              buttonText="Start Free 7 Day Trial"
              buttonClass="pricing-btn-gradient"
              highlight="Most Popular"
            />
          </div>
          <div className="plan-column">
            <PlanHeader
              titleClass="plan-title-elite"
              title="Elite"
              subtitle="For full time traders experienced with order flow."
              discount="Save 25% For Annual."
              price="$499 /mo"
              buttonText="Buy Elite Plan"
              buttonClass="pricing-btn-yellow"
            />
          </div>

          {/* Rows 2+: Features + Icons */}
          {[
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
          ].map((feature, i) => (
            <>
              <div key={`f-${i}`} className="features-cell">
                {feature}
              </div>
              <div className="feature-icon">
                {i === 0 ||
                i === 3 ||
                i === 4 ||
                i === 5 ||
                i === 6 ||
                i === 7 ||
                i === 8 ||
                i === 13 ? (
                  <img src={check} alt="check" />
                ) : (
                  <img src={cross} alt="cross" />
                )}
              </div>
              <div className="feature-icon">
                {i !== 2 && i < 10 ? (
                  <img src={check} alt="check" />
                ) : (
                  <img src={cross} alt="cross" />
                )}
              </div>
              <div className="feature-icon">
                {i === 13 ? (
                  <img src={cross} alt="cross" />
                ) : (
                  <img src={check} alt="check" />
                )}
              </div>
            </>
          ))}
        </div>
      </section>

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
