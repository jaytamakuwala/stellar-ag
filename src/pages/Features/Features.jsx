import buySellImg from "@/assets/Images/buysell.png";
import "./Features.css";
import Highlight from "../Home/Highlight/Highlight";
import AutoTradingCard from "../Home/AutoTradingCard/AutoTradingCard";

import {
  FaBell,
  FaChartLine,
  FaLock,
  FaFilter,
  FaDatabase,
} from "react-icons/fa";
import { MdInsights } from "react-icons/md";
import { TbDeviceAnalytics } from "react-icons/tb";
import Footer from "../Home/Footer/Footer";

const features = [
  { icon: <FaBell size={72} color="#fff" />, title: "AI power alerts" },
  {
    icon: <FaChartLine size={72} color="#fff" />,
    title: "Real time option flow",
  },
  {
    icon: <MdInsights size={72} color="#fff" />,
    title: "Real time stock order flow",
  },
  { icon: <FaLock size={72} color="#fff" />, title: "High volume data" },
  { icon: <FaFilter size={72} color="#fff" />, title: "Advanced filtering" },
  {
    icon: <FaDatabase size={72} color="#fff" />,
    title: "On demand historical data",
  },
  {
    icon: <TbDeviceAnalytics size={72} color="#fff" />,
    title: "Smart analytics",
  },
];

const Features = () => {
  return (
    <div className="feature-container">
      <section className="feature">
        <img src={buySellImg} className="feature-img" alt="Logo" />

        <div className="feature-text feature-title-container">
          <h1 className="feature-title">The Edge Every Trader Needs</h1>
          <p className="feature-subtitle">
            Our MAGIC engine (M.A.G.I.C. = Machine-driven Analytics for Gains,
            Insights & Calls) powers real-time analysis of stock and option
            trades. For clients MAGIC is Machine-driven Analytics for Gains,
            Insights & Calls.
          </p>
        </div>
      </section>

      <section className="feature" style={{ marginTop: "100px" }}>
        <div className="feature-text">
          <h1 className="feature-title">Reasons our MAGIC Engine Is unique</h1>
        </div>
      </section>
      <Highlight />

      <section className="feature" style={{ marginTop: "100px" }}>
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
