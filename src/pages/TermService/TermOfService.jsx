import Footer from "../Home/Footer/Footer";
import "./TermOfService.css";

const TermsOfService = () => {
  return (
    <div className="terms-container">
      {/* Hero Section */}
      <section className="terms-hero">
        <div className="terms-hero-text">
          <h1 className="terms-title">Terms of Service</h1>
          <p className="terms-subtitle">Last Updated: 4/5/25</p>
        </div>
      </section>

      {/* Content */}
      <div className="terms-content">
        {/* Registration */}
        <div className="terms-section">
          <h2 className="terms-heading">Registration</h2>
          <h3 className="terms-subheading">1. Agreement to Terms</h3>
          <p className="terms-paragraph">
            By registering for an account or otherwise using the website located
            at{" "}
            <a
              href="https://stellartrade.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="terms-link"
            >
              https://stellartrade.ai
            </a>{" "}
            (the “Site”), you (“You” or “User”) agree to be bound by these Terms
            of Service (the “Terms” or “Agreement”), which form a legally
            binding agreement between you and Stellar Trade, Inc., including its
            affiliates, partners, agents, and licensors (“Stellar Trade,” “We,”
            “Us,” or “Our”).
          </p>
          <p className="terms-paragraph">
            If you do not agree to these Terms, do not register for or use the
            Site.
          </p>
          <h3 className="terms-subheading">2. Scope of the Agreement</h3>
          <p className="terms-paragraph">
            These Terms govern your registration with and use of the Site and
            all associated content, features, functionality, products, services,
            software, and tools made available through the Site (collectively,
            the “Services”). Additional terms or policies may apply to specific
            features or services and will be presented to you at the time of
            use. All such additional terms are incorporated into these Terms by
            reference, and your use of those features constitutes your
            acceptance of them.
          </p>
          <h3 className="terms-subheading">3. Registration Requirements</h3>
          <p className="terms-paragraph">
            To register and use our Services, you must:
          </p>
          <ul className="terms-list">
            <li>
              Be at least 18 years of age or the age of majority in your
              jurisdiction.
            </li>
            <li>
              Provide accurate, current, and complete registration information.
            </li>
            <li>Maintain the security of your account credentials.</li>
            <li>
              Promptly update any information to keep it accurate and complete.
            </li>
          </ul>
          <p className="terms-paragraph">
            {" "}
            You are responsible for all activity that occurs under your account.
            You agree not to share your login credentials with others or allow
            unauthorized use of your account.{" "}
          </p>
          <h3 className="terms-subheading">4. Acceptance of Changes</h3>
          <p className="terms-paragraph">
            We may revise or update these Terms at any time. Changes will be
            posted on the Site, and the revised Terms will be effective upon
            posting. We will provide notice of material changes by updating the
            effective date at the top of the page or posting a notice on the
            Site.
          </p>
          <p className="terms-paragraph">
            Your continued use of the Site or Services after any changes are
            made constitutes your acceptance of the updated Terms. If you do not
            agree to the updated Terms, you must discontinue use of the Site and
            cancel your account.
          </p>
          <h3 className="terms-subheading">5. Termination of Registration</h3>
          <p className="terms-paragraph">
            If you choose to no longer accept these Terms or any future
            modifications:
          </p>
          <ul className="terms-list">
            <li>
              You must notify us in writing or via your account settings to
              terminate your registration.
            </li>
            <li>
              You must discontinue all use of the Site and Services immediately.
            </li>
          </ul>
          <p className="terms-paragraph">
            We also reserve the right to suspend or terminate your registration
            at our discretion if you violate these Terms or engage in any
            prohibited or unauthorized activity.
          </p>
          <h3 className="terms-subheading">6. Access to Terms</h3>
          <p className="terms-paragraph">
            The current version of these Terms of Service will always be
            available at:{" "}
            <a
              href="https://stellartrade.ai/terms-of-service/"
              target="_blank"
              rel="noopener noreferrer"
              className="terms-link"
            >
              https://stellartrade.ai/terms-of-service/
            </a>
          </p>
        </div>

        <div className="divider" />

        {/* Payment and Account */}
        <div className="terms-section">
          <h2 className="terms-heading">Payment and Account</h2>

          <h3 className="terms-subheading">1. Payment Obligations</h3>
          <p className="terms-paragraph">
            By registering for an account or accessing any paid features on the
            Stellar Trade platform (“we,” “us,” or “our”), you agree to pay all
            fees associated with your subscription or usage of the Site and
            related products (“Products”).
          </p>
          <ul className="terms-list">
            <li>Initial Payment is charged at the time of registration.</li>
            <li>
              Recurring Payments will be billed automatically based on your
              selected subscription plan (e.g., monthly or annually).
            </li>
            <li>
              All billing is processed via the payment method you provide at
              checkout.
            </li>
          </ul>
          <p className="terms-paragraph">
            You confirm that all billing information provided is accurate and
            complete.
          </p>

          <h3 className="terms-subheading">2. Subscription and Renewal</h3>
          <ul className="terms-list">
            <li>
              All subscriptions renew automatically unless canceled before the
              end of the current billing cycle.
            </li>
            <li>
              You may manage or cancel your subscription anytime through your
              Account Settings.
            </li>
            <li>
              Cancellations apply to future billing cycles; no refunds will be
              issued for the current or past billing periods.
            </li>
          </ul>
          <p className="terms-paragraph">
            We reserve the right to adjust pricing or fees at our sole
            discretion. You will be notified at least 30 days in advance of any
            pricing changes.
          </p>

          <h3 className="terms-subheading">3. Free Trial Policy</h3>
          <p className="terms-paragraph">
            <ul className="terms-list">
              <li>
                If offered, a free trial provides temporary access to premium
                features without charge.
              </li>
              <li>
                At the end of the trial, your selected subscription plan will be
                billed automatically unless you cancel before the trial ends.
              </li>
              <li>
                Only one (1) free trial is allowed per user. Attempts to obtain
                additional free trials through multiple accounts will result in
                account restriction or termination.
              </li>
            </ul>
          </p>

          <h3 className="terms-subheading">4. No Refunds</h3>
          <p className="terms-paragraph">
            <ul className="terms-list">
              <li>
                Due to the nature of our Products—non-tangible, irrevocable
                digital goods—all sales are final and no refunds will be issued
                under any circumstances.
              </li>
              <li>
                By completing a purchase or using the Site, you acknowledge and
                agree to this strict no-refund policy.
              </li>
            </ul>
          </p>

          <h3 className="terms-subheading">5. Account Usage</h3>
          <p className="terms-paragraph">
            You agree to use the Site and Products solely for:
          </p>
          <ul className="terms-list">
            <li>Your own personal use, or</li>
            <li>Internal use within your company or organization.</li>
          </ul>
          <p className="terms-paragraph">You agree not to:</p>
          <ul className="terms-list">
            <li>Share account access or credentials with others.</li>
            <li>
              Allow simultaneous logins from multiple locations. If detected,
              your account may be auto-locked for a minimum of 24 hours.
            </li>
            <li>
              Copy, modify, distribute, or reproduce any content or data from
              the Site for commercial purposes.
            </li>
          </ul>

          <h3 className="terms-subheading">6. Data Use and Restrictions</h3>
          <p className="terms-paragraph">You may not:</p>

          <ul className="terms-list">
            <li>
              use automated tools (e.g., bots, scrapers, or extraction software)
              to access or extract data from the Site.
            </li>
            <li>
              Redistribute or resell any information, content, or data from the
              Site via third-party platforms such as Discord, Slack, or Twitter.
            </li>
            <li>
              Use the Site in violation of any applicable laws or regulations.
            </li>
          </ul>
          <p className="terms-paragraph">
            Violations of this section may result in immediate account
            termination without notice or refund. Legal action will be pursued
            when deemed appropriate.
          </p>

          <h3 className="terms-subheading">
            7. Warranties and Indemnification
          </h3>
          <p className="terms-paragraph">
            You represent and warrant that your use of the Site and Products:
          </p>

          <ul className="terms-list">
            <li>Is solely for lawful, intended, and permitted purposes;</li>
            <li>Will comply with these Terms and all applicable laws.</li>
          </ul>
          <p className="terms-paragraph">
            You agree to indemnify and hold harmless Stellar Trade from any
            claims, losses, damages, liabilities, or expenses arising out of:
          </p>

          <ul className="terms-list">
            <li>Your use of the Site or Products;</li>
            <li>Your violation of these Terms;</li>
            <li>
              Any unauthorized or prohibited activity conducted through your
              account.
            </li>
          </ul>

          <div className="terms-note">
            If you have questions about billing or account issues, please
            contact our support team at:{" "}
            <a href="mailto:support@stellartrade.ai" className="terms-link">
              support@stellartrade.ai
            </a>
          </div>
        </div>

        <div className="divider" />

        {/* Proprietary Rights */}
        <div className="terms-section">
          <h2 className="terms-heading">Proprietary Rights</h2>
          <h3 className="terms-subheading">
            1. Ownership of Intellectual Property
          </h3>
          <p className="terms-paragraph">
            All content, features, tools, data, information, and technology
            available on or through the Stellar Trade platform, including the
            website
            <a
              href="https://stellartrade.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="terms-link"
            >
              https://StellarTradeflow.ai
            </a>{" "}
            (the “Site”),are the exclusive property of Stellar Trade, Inc. (also
            referred to as “Stellar Trade,” “We,” “Us,” or “Our”) and its
            content providers or licensors. This includes, but is not limited
            to:
          </p>
          <ul className="terms-list">
            <li>Text, graphics, logos, icons, and images</li>
            <li>Charts, signals, options flow data, and analytics</li>
            <li>
              Software code, user interfaces, design elements, and compilation
              thereof
            </li>
            <li>
              All trademarks, copyrights, trade secrets, and other proprietary
              rights
            </li>
          </ul>
          <p className="terms-paragraph">
            These assets are protected by United States and international
            copyright, trademark, and other intellectual property laws.
          </p>

          <h3 className="terms-subheading">2. Limited License</h3>
          <p className="terms-paragraph">
            When you hold an active subscription, you are granted a limited,
            non-exclusive, non-transferable, non-sublicensable license to access
            and use the Site and Products solely for your personal or internal
            company use.
            <br />
            <br />
            This license does not grant any ownership or intellectual property
            rights in the Site, Products, or any related content. All rights not
            expressly granted to you are reserved by Stellar Trade and its
            licensors.
          </p>

          <h3 className="terms-subheading">3. Prohibited Uses</h3>
          <p className="terms-paragraph">You may not:</p>
          <ul className="terms-list">
            <li>
              Copy, reproduce, modify, republish, upload, distribute, display,
              or transmit any portion of the Site or Products, except as
              expressly allowed under these Terms.
            </li>
            <li>
              Reverse engineer, decompile, disassemble, translate, or create
              derivative works based on the Site or Products.
            </li>
            <li>
              Sell, lease, sublicense, or otherwise distribute the Products to
              any third party.
            </li>
            <li>
              Use the Site or Products for commercial gain, including resale or
              redistribution of any data or content from the platform.
            </li>
          </ul>

          <h3 className="terms-subheading">
            4. No Investment Advice or Warranty
          </h3>
          <p className="terms-paragraph">
            All content and data provided on the Site are for informational
            purposes only and do not constitute investment advice, financial
            recommendations, or trading instructions of any kind. Neither
            Stellar Trade nor any third-party content provider guarantees the
            accuracy, completeness, or timeliness of the information provided.{" "}
            <br />
            <br />
            Accessing, viewing, or using the Site does not create a fiduciary,
            advisory, or broker-client relationship between you and Stellar
            Trade.
          </p>

          <h3 className="terms-subheading">5. Violation of Rights</h3>
          <p className="terms-paragraph">
            Any unauthorized use, reproduction, or distribution of our content,
            data, or platform features will be considered a violation of these
            Terms and our intellectual property rights. We reserve the right to
            take legal action, including suspension or termination of your
            account, and pursue damages or other remedies under applicable law.
          </p>

          <div className="terms-note">
            If you believe your intellectual property rights have been violated,
            please contact:{" "}
            <a href="mailto:support@stellartrade.ai" className="terms-link">
              support@stellartrade.ai
            </a>
          </div>
        </div>
        <div className="divider" />

        {/* Privacy */}
        <div className="terms-section">
          <h2 className="terms-heading">Privacy</h2>
          <p className="terms-paragraph">
            We respect your privacy. We do not sell or share your personal
            information, including your email, without your explicit consent.
            <br />
            Your information may be accessed only by Stellar Trade, our trusted
            partners, and legal advisors as needed to provide services or comply
            with the law.
          </p>
          <p className="terms-paragraph">
            For more details, please see our full Privacy Policy:{" "}
            <a
              href="https://stellartrade.ai/privacy-policy/"
              target="_blank"
              rel="noopener noreferrer"
              className="terms-link"
            >
              https://stellartrade.ai/privacy-policy/
            </a>
          </p>

          <div className="terms-note">
            Contact:{" "}
            <a href="mailto:support@stellartrade.ai" className="terms-link">
              support@stellartrade.ai
            </a>
          </div>
        </div>

        <div className="divider" />

        {/* No Representations or Warranties */}
        <div className="terms-section">
          <h2 className="terms-heading">
            No Representations or Warranties; Limitation of Liability
          </h2>
          <p className="terms-paragraph">
            Stellar Trade makes reasonable efforts to maintain the Site and
            Products and minimize errors or interruptions. However, the Site may
            occasionally be unavailable due to maintenance or factors beyond our
            control. We do not guarantee uninterrupted or error-free operation.
            <br />
            <br />
            All content and services on the Site are provided “as is” and
            without warranties of any kind, whether express or implied. This
            includes, but is not limited to, warranties of:
          </p>
          <ul className="terms-list">
            <li>Accuracy or completeness</li>
            <li>Merchantability or fitness for a particular purpose</li>
            <li>Non-infringement of third-party rights</li>
          </ul>
          <p className="terms-paragraph">
            You use the Site and Products at your own risk, and Stellar Trade is
            not responsible for any actions you take based on the information
            provided.
          </p>
          <p className="terms-paragraph">
            To the fullest extent allowed by law, Stellar Trade and its
            affiliates, officers, employees, or agents will not be liable for:
          </p>
          <ul className="terms-list">
            <li>
              Any indirect, incidental, special, punitive, or consequential
              damages
            </li>
            <li>Lost profits or lost data</li>
            <li>
              Any damage arising from your use of or inability to use the Site
              or Products
            </li>
          </ul>
          <p className="terms-paragraph">
            Total liability, if any, will be limited to the amount you paid to
            Stellar Trade in the past 12 months, and in no case will exceed
            $1,000. If you have not paid any fees, your only remedy is
            injunctive relief.
            <br />
            <br />
            Some jurisdictions may not allow certain limitations, so these
            exclusions may not fully apply to you.
          </p>
        </div>

        <div className="divider" />

        {/* Disclaimer */}
        <div className="terms-section">
          <h2 className="terms-heading">Disclaimer</h2>
          <p className="terms-paragraph">
            Trading stocks and options involves significant risk and is not
            suitable for all investors. Past performance is not a guarantee of
            future results.
            <br />
            <br />
            Stellar Trade is not a registered investment advisor and does not
            provide investment advice or manage assets. All content, tools, and
            materials provided on the Site are for educational and informational
            purposes only. Any ideas, opinions, research, or tutorials reflect
            the personal views of Stellar Trade and should not be interpreted as
            financial advice.{" "}
          </p>
          <p className="terms-paragraph">You are solely responsible for:</p>
          <ul className="terms-list">
            <li>
              Evaluating the accuracy and usefulness of the information provided
            </li>
            <li>Conducting your own research</li>
            <li>
              Consulting with a licensed financial advisor before making any
              investment decisions
            </li>
          </ul>
          <p className="terms-paragraph">
            Stellar Trade is not liable for any financial losses or gains that
            may result from your use of the Site, Products, or any associated
            content. Use of our services is entirely at your own risk.
          </p>
        </div>

        <div className="divider" />

        {/* Miscellaneous */}
        <div className="terms-section">
          <h2 className="terms-heading">Miscellaneous</h2>

          <h3 className="terms-subheading">1. Severability</h3>
          <p className="terms-paragraph">
            If any part of these Terms is found to be invalid or unenforceable,
            that part will be limited or removed as necessary so that the rest
            of the Terms remain valid and enforceable.
          </p>

          <h3 className="terms-subheading">2. Assignment</h3>
          <p className="terms-paragraph">
            You may not assign, transfer, or sublicense your rights under these
            Terms without prior written consent from Stellar Trade. We may
            assign or transfer our rights and obligations without notice or
            consent.
          </p>

          <h3 className="terms-subheading">3. Entire Agreement</h3>
          <p className="terms-paragraph">
            These Terms represent the complete agreement between you and Stellar
            Trade and override all prior agreements, communications, or
            understandings—whether written or oral—regarding your use of the
            Site and Services.
          </p>

          <h3 className="terms-subheading">4. No Agency Relationship</h3>
          <p className="terms-paragraph">
            Nothing in these Terms creates any partnership, joint venture,
            agency, or employment relationship. You may not bind Stellar Trade
            in any way.
          </p>

          <h3 className="terms-subheading">5. Legal Fees</h3>
          <p className="terms-paragraph">
            In any legal action arising out of these Terms, the prevailing party
            is entitled to recover legal costs and attorneys’ fees.
          </p>

          <h3 className="terms-subheading">6. Notices</h3>
          <p className="terms-paragraph">
            All notices must be in writing and will be considered delivered
            when:
          </p>
          <ul className="terms-list">
            <li>Personally delivered</li>
            <li>Sent by email (with confirmed receipt)</li>
            <li>Sent by overnight courier</li>
            <li>Sent via certified or registered mail with return receipt</li>
          </ul>

          <h3 className="terms-subheading">7. Governing Law</h3>
          <p className="terms-paragraph">
            These Terms are governed by the laws of the State of California,
            without regard to its conflict of law rules.
          </p>

          <h3 className="terms-subheading">
            8. Right to Refuse or Terminate Service
          </h3>
          <p className="terms-paragraph">
            We reserve the right to refuse service or terminate your access at
            any time, for any reason, with or without notice. If terminated, any
            provisions that should survive—such as those related to intellectual
            property, disclaimers, and limitations of liability—will remain in
            effect.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfService;
