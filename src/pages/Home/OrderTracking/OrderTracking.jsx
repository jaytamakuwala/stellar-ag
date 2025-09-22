import "./OrderTracking.css";
import flash from "@/assets/Images/flash.png";
import table from "@/assets/Images/table.png";

const OrderTracking = () => {
  return (
    <section className="order-tracking-section">
      <div className="order-tracking-card">
        <div className="order-tracking-content">
          <span className="order-tracking-name">
            Intelligent order tracking{" "}
          </span>

          <div className="order-tracking-profile">
            {/* <img src={order-trackingImg} alt="order-tracking" className="order-tracking-avatar" /> */}
            <span className="order-tracking-sub-message">
              By leveraging advanced market analysis, Stellars Trade provides
              valuable insights and alerts, allowing you to stay informed about
              crucial market developments giving you a competitive edge in your
              decision-making process.
            </span>
          </div>
          <div className="order-tracking-button-container">
            <button className="home-btn  order-tracking-button">
              Learn More
            </button>
          </div>
        </div>

        <div className="quote-icon">
          {/* <div className="quote-icon-inner"> */}
          {/* <span className="quote-shape" /> */}
          <img src={flash} className="quote-icon-inner" alt="flash" />
          {/* </div> */}
        </div>
      </div>
      <img
        style={{ borderRadius: "20pxs", width: "84%" }}
        src={table}
        className="quote-icon-table"
        alt="table"
      />
    </section>
  );
};

export default OrderTracking;
