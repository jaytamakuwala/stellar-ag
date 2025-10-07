import "./Elite.css";
import flash from "@/assets/Images/flash.png";
import FeatureVideo from "../FeatureVideo/FeatureVideo";

const Elite = () => {
  return (
    <section className="elite-section">
      <div className="elite-card">
        <div className="elite-content">
          <span className="elite-name">Elite market flow</span>

          <div className="elite-profile">
            <span className="elite-sub-message">
              Discover high-volume trading activity with institutional clarity.
            </span>
          </div>
          <div className="elite-button-container">
            <button className="home-btn  elite-button">Learn More</button>
          </div>
        </div>

        <div className="quote-icon">
          <img src={flash} className="quote-icon-inner" alt="flash" />
          {/* </div> */}
        </div>
      </div>
      <FeatureVideo />
    </section>
  );
};

export default Elite;
