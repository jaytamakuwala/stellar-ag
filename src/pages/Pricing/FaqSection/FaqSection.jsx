import { useState } from "react";
import "./FaqSection.css";
import { FaChevronDown } from "react-icons/fa";

const faqData = [
  {
    question: "What types of payment do you accept?",
    answer: "We accept credit card and debit card payments only.",
  },
  {
    question: "How does the 7 day trial work?",
    answer: `You are entitled to one FREE 7 day trial. You can cancel anytime within your trial period with no obligations. If you go past 7 days without cancelling, your account will be automatically billed. All sales are final. Your trial is on a general calendar schedule. Please note: If you choose to upgrade to the Pro or Annual plan within your free trial period, you will forfeit that option and be charged for upgrading. We do not provide a free trial period for Pro and Annual plans.`,
  },
  {
    question: "Can I upgrade my subscription?",
    answer: `Yes. Customers can upgrade directly from your profile. You can upgrade from a Standard Plan to a Pro Plan subscription as well as downgrade from a Pro Plan to a Standard Plan subscription. The amount due for a new subscription will automatically be prorated based on the amount of days used. If you need help upgrading your subscription, you can contact our billing department at support@stellartrade.ai.`,
  },
  {
    question: "Can I switch subscriptions?",
    answer: "Yes, you can switch subscriptions at anytime.",
  },
  {
    question: "What is the cancellation policy?",
    answer: `Customers can cancel their subscription at anytime. To cancel, please log into your account and head over to Profile > Payment Info and click Cancel Subscription button. Email us at support@stellartrade.ai if you have any questions or issues cancelling. Cheddar Flow is not responsible for continued subscriptions should a client forget to cancel their account. It is the customer’s responsibility to confirm the cancellation.`,
  },
  {
    question: "What is the refund policy?",
    answer:
      "All payments made are non-refundable and we do not offer pro-rated refunds.",
  },
];

const FaqSection = () => {
  const [openIndexes, setOpenIndexes] = useState([]);
  const toggleFAQ = (index) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };
  return (
    <div className="faq-section">
      <div className="faq-header">Frequently Asked Questions</div>

      <div className="faq-list">
        {faqData.map((item, index) => (
          <div
            key={index}
            className={`faq-item ${
              openIndexes.includes(index) ? "active" : ""
            }`}
          >
            <div className="faq-question" onClick={() => toggleFAQ(index)}>
              <span>{item.question}</span>
              <div
                className={`faq-icon ${
                  openIndexes.includes(index) ? "open" : ""
                }`}
              >
                <FaChevronDown size={16} />
              </div>
            </div>
            <div
              className="faq-answer"
              style={{ display: openIndexes.includes(index) ? "flex" : "none" }}
            >
              {item.answer}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqSection;
