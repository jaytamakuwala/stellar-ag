import Footer from "../Home/Footer/Footer";
import "./RefundPolicy.css";

const RefundPolicy = () => {
  return (
    <div className="refund-container">
      {/* Hero Section */}
      <section className="refund-hero">
        <div className="refund-hero-text">
          <h1 className="refund-title">Refund Policy</h1>
          <p className="refund-subtitle">Last Updated: 4/5/25</p>
          <span className="refund-subtitle-yellow">{`* IF YOU DO NOT AGREE TO THESE "TERMS OF SERVICE", PLEASE DO NOT USE THE SITE.`}</span>
        </div>
      </section>

      {/* Content */}
      <div className="refund-content">
        <div className="refund-section">
          <p className="refund-paragraph">
            This Refund Policy outlines the terms under which refunds may be
            provided for products and services purchased through our platform.
            Capitalized terms not defined herein shall have the meaning given to
            them in the Stellar Trade Terms of Service.
          </p>
        </div>

        <div className="refund-section">
          <h3 className="refund-heading">No Refunds</h3>
          <p className="refund-paragraph gray">
            All purchases made through our platform are{" "}
            <span style={{ color: "white" }}>final and non-refundable</span>.
            Our services consist of non-tangible, irrevocable digital goods, and
            once a transaction is completed, no refunds will be issued under any
            circumstances.
          </p>
        </div>

        <div className="refund-section">
          <h3 className="refund-heading">Subscriptions and Renewals</h3>
          <p className="refund-paragraph gray">
            <ul>
              <li>
                Subscriptions automatically renew at the end of each billing
                cycle.
              </li>
              <li>
                You may cancel your subscription at any time through your
                account settings.
              </li>
              <li>
                Cancellations must be made{" "}
                <span style={{ color: "white" }}>
                  at least 24 hours before the renewal date{" "}
                </span>
                to avoid being charged.
              </li>
              <li>
                No refunds will be provided for{" "}
                <span style={{ color: "white" }}>partial billing periods</span>
                or <span style={{ color: "white" }}>unused time </span>within a
                subscription cycle.
              </li>
            </ul>
          </p>
        </div>

        <div className="refund-section">
          <h3 className="refund-heading">Free Trial</h3>
          <p className="refund-paragraph gray">
            <ul>
              <li>
                If a free trial is offered, you will be charged automatically at
                the end of the trial period unless you cancel beforehand.
              </li>
              <li>
                It is your responsibility to cancel before the trial ends if you
                do not wish to continue.
              </li>
              <li>
                No refunds will be issued once the trial transitions into a paid
                subscription.
              </li>
            </ul>
          </p>
        </div>

        <div className="refund-section">
          <h3 className="refund-heading">Trial Abuse</h3>
          <p className="refund-paragraph gray">
            <ul>
              <li>
                Each user is entitled to{" "}
                <span style={{ color: "white" }}>one (1) free trial</span>.
              </li>
              <li>
                Attempting to obtain multiple free trials by creating multiple
                accounts is strictly prohibited and may result in account
                termination without refund.
              </li>
            </ul>
          </p>
        </div>

        <div className="refund-section">
          <h3 className="refund-heading">Violations of Terms of Service</h3>
          <p className="refund-paragraph gray">
            <ul>
              <li>
                If your account is found to be in violation of our Terms of
                Service—including, but not limited to, scraping, reproducing,
                redistributing, or reselling content—you will be banned, and no
                refunds will be provided, regardless of subscription status.
              </li>
              <li>
                Legal action may be pursued if unauthorized redistribution or
                reselling of our content is discovered.
              </li>
            </ul>
          </p>
        </div>

        <div className="refund-section">
          <h3 className="refund-heading">Chargebacks and Disputes</h3>
          <p className="refund-paragraph gray">
            Initiating a chargeback or dispute without contacting us first will
            be considered a violation of our Terms. We reserve the right to
            suspend or terminate your account in response.
          </p>
        </div>

        <div className="refund-section refund-box">
          <h3 className="refund-heading">Questions?</h3>
          <p className="refund-paragraph gray">
            If you have any questions about our Refund Policy, please contact
            our support team before making a purchase.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RefundPolicy;
