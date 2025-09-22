import Footer from "../Home/Footer/Footer";
import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-container">
      {/* Hero Section */}
      <section className="privacy-policy">
        <div className="privacy-policy-text privacy-policy-title-container">
          <h1 className="privacy-policy-title">Privacy Policy</h1>
          <p className="privacy-policy-subtitle">Last Update: 4/5/25</p>
        </div>
      </section>

      {/* Sections */}
      <div className="privacy-policy-content">
        <div className="privacy-policy-section">
          <section className="privacy-policy-section">
            <h2 className="privacy-policy-heading-1">
              {` USA Trading Data Provider Platform ("we", "us", or "our") is committed
          to protecting your privacy. This Privacy Policy explains how we
          collect, use, disclose, and safeguard your information when you visit
          our website, use our services, or interact with our platform
          (collectively, the "Services"). By accessing or using our Services,
          you agree to the terms of this Privacy Policy.`}
            </h2>
          </section>

          <h2 className="privacy-policy-heading">1. Information We Collect</h2>
          <p className="privacy-policy-paragraph">
            We collect the following types of information:
            <br />
            <br />
            <strong className="privacy-policy-white">
              a. Personal Information
            </strong>
            <br />
            Information that can identify you personally, such as: <br />
            <ul>
              <li>Fullname</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Billing information (credit/debit card details)</li>
              <li>Company/organization name</li>
              <li>IP address</li>
            </ul>
            <br />
            <br />
            <strong>b. Non-Personal Information</strong> — Automatically
            collected data, including: Browser type and version, Operating
            system, Device identifiers, Usage data (pages visited, access times,
            referral URLs), Trading preferences and platform usage behavior.
          </p>
        </div>

        <div className="privacy-policy-section">
          <h2 className="privacy-policy-heading">
            2. How We Use Your Information
          </h2>
          <p className="privacy-policy-paragraph">
            We use the information we collect for various purposes, including:
            <br />• To provide and manage access to our Services
            <br />• To process transactions and send related information
            <br />• To communicate with you (e.g., updates, support, marketing)
            <br />• To personalize user experience
            <br />• To detect, prevent, and respond to security incidents and
            technical issues
            <br />• To comply with legal obligations
          </p>
        </div>

        <div className="privacy-policy-section">
          <h2 className="privacy-policy-heading">
            3. Sharing Your Information
          </h2>
          <p className="privacy-policy-paragraph">
            We do not sell your personal information. We may share your data
            with:
            <br />• Service providers and partners (e.g., hosting providers,
            payment processors) under confidentiality agreements
            <br />• Legal authorities, if required by law or to protect our
            rights
            <br />• Business transfers in the case of a merger, acquisition, or
            sale of assets
          </p>
        </div>

        <div className="privacy-policy-section">
          <h2 className="privacy-policy-heading">
            4. Cookies and Tracking Technologies
          </h2>
          <p className="privacy-policy-paragraph">
            We use cookies, web beacons, and other tracking technologies to
            enhance user experience, analyze traffic, and for advertising
            purposes. You can manage cookie preferences in your browser
            settings.
          </p>
        </div>

        <div className="privacy-policy-section">
          <h2 className="privacy-policy-heading">5. Data Retention</h2>
          <p className="privacy-policy-paragraph">
            We retain your personal information for as long as necessary to
            provide our services, comply with legal obligations, and resolve
            disputes.
          </p>
        </div>

        <div className="privacy-policy-section">
          <h2 className="privacy-policy-heading">6. Data Security</h2>
          <p className="privacy-policy-paragraph">
            We implement appropriate security measures (e.g., SSL encryption,
            access controls) to protect your data. However, no system can be
            guaranteed to be 100% secure.
          </p>
        </div>

        <div className="privacy-policy-section">
          <h2 className="privacy-policy-heading">7. Your Rights and Choices</h2>
          <p className="privacy-policy-paragraph">
            Depending on your location and applicable law, you may have the
            right to:
            <br />• Access, update, or delete your personal information
            <br />• Opt-out of marketing communications
            <br />• Restrict or object to certain data processing
            <br />• Request a copy of your data (data portability)
            <br />
            To exercise your rights, contact us at [insert email address].
          </p>
        </div>

        <div className="privacy-policy-section">
          <h2 className="privacy-policy-heading">
            8. California Residents (CCPA)
          </h2>
          <p className="privacy-policy-paragraph">
            If you are a California resident, you may have specific rights under
            the California Consumer Privacy Act (CCPA), including:
            <br />• The right to know what personal information we collect, use,
            and disclose
            <br />• The right to request deletion of your personal information
            <br />• The right to opt-out of the sale of personal information (we
            do not sell your data)
            <br />
            To submit a request, email [insert CCPA contact email] or use our
            online request form.
          </p>
        </div>

        <div className="privacy-policy-section">
          <h2 className="privacy-policy-heading">9. Children’s Privacy</h2>
          <p className="privacy-policy-paragraph">
            Our Services are not intended for children under 13. We do not
            knowingly collect personal data from children. If we become aware
            that we have done so, we will take steps to delete the information
            promptly.
          </p>
        </div>

        <div className="privacy-policy-section">
          <h2 className="privacy-policy-heading">10. Third-Party Links</h2>
          <p className="privacy-policy-paragraph">
            Our platform may contain links to third-party websites or services.
            We are not responsible for the privacy practices or content of those
            third parties.
          </p>
        </div>

        <div className="privacy-policy-section">
          <h2 className="privacy-policy-heading">
            11. Changes to This Privacy Policy
          </h2>
          <p className="privacy-policy-paragraph">
            We may update this Privacy Policy from time to time. The updated
            version will be indicated by an updated “Effective Date” and will be
            effective as soon as it is accessible. We encourage you to review
            this page periodically.
          </p>
        </div>

        <div className="privacy-policy-section">
          <h2 className="privacy-policy-heading">12. Contact Us</h2>
          <p className="privacy-policy-paragraph">
            If you have any questions or concerns about this Privacy Policy or
            our practices, please contact us at:
            <br />
            Email: contactus@stellartrade.com
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
