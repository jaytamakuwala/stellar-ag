import "./PricingTestimonial.css";
import comma from "@/assets/Images/commaContainer.png";

const PricingTestimonial = () => {
  return (
    <div className="pricing-testimonial">
      {/* Floating Circle */}
      <div className="pricing-testimonial-circle">
        <div className="pricing-testimonial-circle-icon">
          <img src={comma} className="feature-comma" alt="comma" />
        </div>
      </div>

      {/* Content */}
      <div className="pricing-testimonial-content">
        <p className="pricing-testimonial-text">
          Stay ahead of the market with instant data, live analytics, and
          actionable alerts. Make smarter decisions, react faster, and unlock
          your full trading potential right when it matters most.
        </p>

        <button className="pricing-testimonial-button">Start Trial</button>
      </div>
    </div>
  );
};

export default PricingTestimonial;
