import "./OrderTracking.css";
import flash from "@/assets/Images/flash.png";
import FeatureVideo from "../FeatureVideo/FeatureVideo";

const OrderTracking = () => {
  return (
    <section className="order-tracking-section">
      <div className="order-tracking-card">
        <div className="order-tracking-content">
          <span className="order-tracking-name">
            Intelligent order tracking
          </span>
          <div className="order-tracking-profile">
            <span className="order-tracking-sub-message">
              By leveraging advanced market analysis, Stellars Trade provides
              valuable insights and alerts, allowing you to stay informed about
              crucial market developments giving you a competitive edge in your
              decision-making process.
            </span>
          </div>
          <div className="order-tracking-button-container">
            <button className="home-btn order-tracking-button">
              Learn More
            </button>
          </div>
        </div>

        <div className="quote-icon">
          <img src={flash} className="quote-icon-inner" alt="flash" />
        </div>
      </div>
      <FeatureVideo />
    </section>
  );
};

export default OrderTracking;
