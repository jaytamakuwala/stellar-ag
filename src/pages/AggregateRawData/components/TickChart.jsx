import {
  StyleModal,
  StyleTopEvents,
} from "../../../style/containers/AnimatedTable";
import CloseIcon from "@mui/icons-material/Close";
import PiePlot from "../../../charts/PiePlot";
import BarChart from "../../../charts/BarChart";
import GroupedHorizontalChart from "../../../charts/GroupedHorizontalChart";
import QuadrantBubbleChart from "../../../charts/QuadrantBubbleChart";
import BubbleWithCategoryChart from "../../../charts/BubbleWithCategories";
import BubblePlot from "../../../charts/BubblePlot";

export default function TickChart({
  animationState,
  isSmallScreen,
  detailsofRow,
  chartData,
  groupedByDate,
  isSmallScreen2,
  handleModalEventClose,
}) {
  console.log({ chartData });
  return (
    <StyleModal
      className={animationState ? "open" : ""}
      style={{
        width: animationState ? "100%" : "0",
        left: animationState ? "0" : "100%",
        position: animationState ? "relative" : "",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          width: isSmallScreen
            ? "90%"
            : isSmallScreen2
            ? "auto"
            : animationState
            ? "100%"
            : "0",
          display: "flex",
        }}
        className="SetupBack"
      >
        <div
          style={{
            marginTop: "10px",
            width: "100vw",
            padding: "5px 12px 10px",
            boxSizing: "border-box",
          }}
        >
          <StyleTopEvents>
            <div>
              <h5 className="m-0" style={{color:"#fff"}}>{detailsofRow?.Tick}</h5>
            </div>
            <CloseIcon
              style={{
                cursor: "pointer",
                color: "#fff",
                fontSize: "15px",
              }}
              className="closeInnerModal"
              onClick={(e) => {
                e.stopPropagation();
                handleModalEventClose();
              }}
            />
          </StyleTopEvents>
          <div className="row m-0">
            <div
              className="col-lg-12 SmallPaddRight"
              style={{ paddingRight: "10px", paddingLeft: "0" }}
            >
              <QuadrantBubbleChart
                bubbleData={chartData.bubble}
                height={640}
                style={{
                  background: "#282828",
                  height: "-webkit-fill-available",
                }}
              />
            </div>
          </div>
          <div className="BorderBottom"></div>

          <div className="row m-0 BuySellTime">
            <h5 className="Heading">Buy and Sell on Time</h5>
            <div className="col-lg-6 BorderRight" style={{ paddingRight: "0" }}>
              <GroupedHorizontalChart
                height={500}
                rawData={chartData.callBar}
                buyLabel="Call Buy"
                sellLabel="Call Sell"
                buyColor="#00FF59"
                sellColor="#FF605D"
                filterOptionType="C"
              />
            </div>
            <div className="col-lg-6" style={{ paddingRight: "0" }}>
              <GroupedHorizontalChart
                height={500}
                rawData={chartData.putBar}
                buyLabel="Put Buy"
                sellLabel="Put Sell"
                buyColor="#00FF59"
                sellColor="#FF605D"
                filterOptionType="P"
              />
            </div>
          </div>
          <div className="BorderBottom"></div>
          <div
            className="row"
            style={{
              marginLeft: "0",
              marginRight: "0",
              marginTop: "10px ",
            }}
          >
            <div
              className="col-lg-8 Firstchart BorderRight Ca1Top"
              style={{ paddingRight: "10px", paddingLeft: "0" }}
            >
              <BubbleWithCategoryChart
                rawData={chartData.callBubbleExpiry}
                type="CALL"
                height={520}
              />
              <div className="BorderBottom1"></div>
              <BubbleWithCategoryChart
                rawData={chartData.putBubbleExpiry}
                type="PUT"
                height={520}
              />
            </div>
            <div className="col-lg-4 Piechartsec" style={{ paddingRight: "0" }}>
              <BarChart
                height={400}
                data={[
                  ...chartData.currentDayCallBarPlotData,
                  ...chartData.currentDayPutBarPlotData,
                  ...chartData.selectedOrPreviousCallBarPlotData,
                  ...chartData.selectedOrPreviousPutBarPlotData,
                ]}
              />
              <div className="BorderBottom1"></div>
              <PiePlot
                rawData={chartData.pie}
                fields={["TotalCallBuyCost", "TotalCallSellCost"]}
                labels={["Call Buy", "Call Sell"]}
                title="Total Call Buy and Sell"
                height={320}
              />
              <div className="BorderBottom1"></div>
              <PiePlot
                rawData={chartData.pie}
                fields={["TotalPutBuyCost", "TotalPutSellCost"]}
                labels={["Put Buy", "Put Sell"]}
                title="Total Put Buy and Sell"
                height={250}
                style={{ marginTop: "0" }}
                className="BottomPiechart"
              />{" "}
            </div>
          </div>
          <div className="BorderBottom1" style={{ marginTop: "60px" }}></div>
          <div
            className="row BottomGraphs"
            style={{ marginLeft: 0, marginRight: 0, marginTop: 10 }}
          >
            {groupedByDate &&
              Object.entries(groupedByDate).map(([date, data], index) => (
                <div
                  key={date}
                  className={`col-lg-4 ${
                    index === 0 ? "BorderTopSet" : ""
                  } BorderRight BorderLastBottom `}
                >
                  <BubblePlot rawData={data} width={510} />
                </div>
              ))}
          </div>
        </div>
      </div>
    </StyleModal>
  );
}
