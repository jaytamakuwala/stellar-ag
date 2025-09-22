import React from 'react';
import Chart, {
  ArgumentAxis,
  CommonSeriesSettings,
  Legend,
  Series,
  Tooltip,
  ValueAxis,
  ConstantLine,
  Label,
} from 'devextreme-react/chart';

export const feedbackData = [
    { feedback: 'Excellent taste', count: 945 },
    { feedback: 'Fast delivery', count: 1120 },
    { feedback: 'Friendly staff', count: 680 },
    { feedback: 'Great packaging', count: 430 }
];

const data = feedbackData.sort((a, b) => b.count - a.count);
const totalCount = data.reduce((prevValue, item) => prevValue + item.count, 0);
let cumulativeCount = 0;
const dataArray = data.map((item) => {
  cumulativeCount += item.count;
  return {
    feedback: item.feedback,
    count: item.count,
    cumulativePercentage: Math.round((cumulativeCount * 100) / totalCount),
  };
});
const customizeTooltip = (pointInfo) => ({
  html: `<div><div className="tooltip-header">${pointInfo.argumentText}</div><div className="tooltip-body"><div className="series-name"><span className='top-series-name'>${pointInfo.points[0].seriesName}</span>: </div><div className="value-text"><span className='top-series-value'>${pointInfo.points[0].valueText}</span></div><div className="series-name"><span className='bottom-series-name'>${pointInfo.points[1].seriesName}</span>: </div><div className="value-text"><span className='bottom-series-value'>${pointInfo.points[1].valueText}</span>% </div></div></div>`,
});
function customizePercentageText({ valueText }) {
  return `${valueText}%`;
}
export const PeriodicData = ({ width, height, data, theamColor }) =>  {
  return (
    <div className="BiDirectionalBarChart">
      <div className="Header d-flex justify-content-between align-center">
          <p className="m-0">Total Call Sell Cost</p>
      </div>
        <Chart
            dataSource={dataArray}
            palette="Harmony Light"
            className="ChartBi"
        >
        <CommonSeriesSettings argumentField="feedback" />
        <Series
            name="feedback frequency"
            valueField="count"
            axis="frequency"
            type="bar"
            color="#00FF59"
        />
        <Series
            name="Cumulative percentage"
            valueField="cumulativePercentage"
            axis="percentage"
            type="spline"
            color="#FF605D"
        />

        <ArgumentAxis>
            <Label overlappingBehavior="stagger" />
        </ArgumentAxis>

        <ValueAxis
            name="frequency"
            position="left"
            tickInterval={300}
        />
        <ValueAxis
            name="percentage"
            position="right"
            tickInterval={20}
            showZero={true}
            valueMarginsEnabled={false}
        >
            <Label customizeText={customizePercentageText} />
            <ConstantLine
            value={80}
            width={2}
            color="#fc3535"
            dashStyle="dash"
            >
            <Label visible={false} />
            </ConstantLine>
        </ValueAxis>

        <Tooltip
            enabled={true}
            shared={true}
            customizeTooltip={customizeTooltip}
        />

        <Legend
            verticalAlignment="top"
            horizontalAlignment="center"
        />
        </Chart>
    </div>
  );
}
