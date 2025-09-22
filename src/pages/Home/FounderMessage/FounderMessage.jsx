import "./FounderMessage.css";
import founderImg from "@/assets/Images/founderImg.png";
import commaContainer from "@/assets/Images/commaContainer.png";

const FounderMessage = () => {
  return (
    <section className="founder-section">
      <div className="founder-card">
        <div className="founder-content">
          <p className="founder-message">
            Stellar Trade turns complex market data into clear, actionable
            insights — so you can trade with speed, precision, and confidence.
          </p>

          <div className="founder-profile">
            <img src={founderImg} alt="Founder" className="founder-avatar" />
            <h4 className="founder-name">Stellar Team</h4>
          </div>
        </div>

        <img src={commaContainer} alt="Icon" className="quote-icon" />
      </div>
    </section>
  );
};

export default FounderMessage;
