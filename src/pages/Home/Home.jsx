/* eslint-disable react/prop-types */
import stocklist from "@/assets/Images/stocklist.png";
import buySellImg from "@/assets/Images/buysell.png";

import "./Home.css";
import FounderMessage from "./FounderMessage/FounderMessage";
import Testimonials from "./Testimonials/Testimonials";
import Footer from "./Footer/Footer";
import Highlight from "./Highlight/Highlight";
import OrderTracking from "./OrderTracking/OrderTracking";
import HeatMap from "./HeatMap/HeatMap";
import Ticker from "./Ticker/Ticker";
import Elite from "./Elite/Elite";

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero">
        <div className="hero-text">
          <h1 className="hero-title">Your AI Co-Pilot for Markets</h1>
          <p className="hero-subtitle">
            The fastest AI powered engine with real time options flow & zero
            loss exit strategy to the fastest AI powered engine with real time
            options and stocks order flow.
          </p>

          <div className="hero-buttons">
            <button className="home-btn home-btn-gradient">
              Start free 7 day trial
            </button>
            <button className="home-btn home-btn-yellow">
              Schedule a demo
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="ellipse ellipse-1"></div>
          <div className="ellipse ellipse-2"></div>

          <div
            className="stock-image stock-image-1"
            style={{
              background: `linear-gradient(180deg, rgba(40,40,40,0) -52.1%, #282828 20.82%), url(${stocklist})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>

          <div
            className="stock-image stock-image-2"
            style={{
              background: `linear-gradient(180deg, rgba(40,40,40,0) -52.1%, #282828 20.82%), url(${stocklist})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>

          <div
            className="stock-image stock-image-3"
            style={{
              background: `linear-gradient(180deg, rgba(40,40,40,0) 0%, #282828 100%), url(${stocklist})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
        </div>
      </section>

      <Highlight />

      <section className="feature">
        <img src={buySellImg} className="feature-img" alt="Logo" />

        <div className="feature-text feature-title-container">
          <h1 className="feature-title">From noise to signals - instantly.</h1>
        </div>
      </section>

      <OrderTracking />
      <Ticker />

      <section className="feature">
        <div className="feature-text">
          <h1 className="feature-title">Explore market and exclusive deal </h1>
        </div>
      </section>
      <Elite />
      <HeatMap />
      <FounderMessage />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Home;
