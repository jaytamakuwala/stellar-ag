/* eslint-disable react/prop-types */
import "./Highlight.css";
import bell from "@/assets/Images/bell.png";
import money from "@/assets/Images/moneyframe.png";
import dollar from "@/assets/Images/dollar.png";

const HighlightCard = ({ icon, title, description, order }) => (
  <div className={`highlight-frame frame-${14 + order}`}>
    <div className="icon-frame">
      <img src={icon} alt="Logo" />
    </div>
    <div className="content-frame">
      <div className="title">{title}</div>
      <div className="description">{description}</div>
    </div>
  </div>
);

const Highlight = () => {
  return (
    <section className="highlights">
      <div className="highlights-container">
        <HighlightCard
          icon={money}
          title="50 quadrillion"
          description="records evaluated from 5 days to give signals for that one trade that works !"
          order={0}
        />
        <HighlightCard
          icon={bell}
          title="50+"
          description="alerts every week and provide real-time notifications on key trading opportunities."
          order={1}
        />
        <HighlightCard
          icon={dollar}
          title="$5Trillion"
          description="Worth Track trades as they happen with real-time transaction updates stay in control and never miss a market move."
          order={2}
        />
      </div>
    </section>
  );
};

export default Highlight;
