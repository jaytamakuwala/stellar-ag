import buySellImg from "@/assets/Images/buysell.png";
import "./Features.css";
import Highlight from "../Home/Highlight/Highlight";
import AutoTradingCard from "../Home/AutoTradingCard/AutoTradingCard";

import historicData from "@/assets/Images/historicData.png";
import filter from "@/assets/Images/filter.png";
import volumeData from "@/assets/Images/volumeData.png";
import chart from "@/assets/Images/chart.png";
import candle from "@/assets/Images/candle.png";
import Vector from "@/assets/Images/Vector.png";

import Footer from "../Home/Footer/Footer";

const features = [
  {
    icon: <img src={Vector} alt="AI power alerts" />,
    title: "AI power alerts",
  },
  {
    icon: <img src={candle} alt="Real time option flow" />,
    title: "Real time option flow",
  },
  {
    icon: <img src={chart} alt="Real time stock order flow" />,
    title: "Real time stock order flow",
  },
  {
    icon: <img src={volumeData} alt="High volume data" />,
    title: "High volume data",
  },
  {
    icon: <img src={filter} alt="Advanced filtering" />,
    title: "Advanced filtering",
  },
  {
    icon: <img src={historicData} alt="Historic Data" />,
    title: "On demand historical data",
  },
];

const Features = () => {
  return (
    <div className="feature-container">
      <section className="feature">
        <img src={buySellImg} className="feature-img" alt="Logo" />

        <div className="feature-text feature-title-container">
          <h1 className="feature-title feature-header-title">
            The Edge Every Trader Needs
          </h1>
          <p className="feature-subtitle">
            Our MAGIC engine (M.A.G.I.C. = Machine-driven Analytics for Gains,
            Insights & Calls) powers real-time analysis of stock and option
            trades. For clients MAGIC is Machine-driven Analytics for Gains,
            Insights & Calls.
          </p>
        </div>
      </section>

      <section className="feature">
        <div className="feature-text">
          <h1 className="feature-title">Reasons our MAGIC Engine Is unique</h1>
        </div>
      </section>
      <Highlight />

      <section className="feature">
        <div className="feature-text">
          <h1 className="feature-title">Super Quick</h1>
        </div>
      </section>

      <AutoTradingCard />
      {/* <div className="frame125">
        <div className="background" />
        {features.map((f, i) => (
          <div className="feature-frame" key={i}>
            <div className="icon">{f.icon}</div>
            <div className="title-frame">{f.title}</div>
          </div>
        ))}
      </div> */}
      <section className="feature-frame-highlights">
        <div className="feature-frame-highlights__wrapper">
          {features.map((feature, index) => (
            <div
              className={`feature-frame-card ${
                index !== features.length - 1 ? "with-border" : ""
              }`}
              key={index}
            >
              <div className="icon">{feature.icon}</div>
              <h4 className="feature-frame-title">{feature.title}</h4>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Features;
