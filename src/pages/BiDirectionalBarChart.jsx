import React from 'react';
import Chart, {
  CommonSeriesSettings,
  ValueAxis,
  Label,
  Series,
  Tooltip,
} from 'devextreme-react/chart';


export const dataSource = [{
    age: '0-4',
    male: -3.1,
    female: 2.9,
  }, {
    age: '5-9',
    male: -3.1,
    female: 3.0,
  }, {
    age: '10-14',
    male: -3.0,
    female: 2.9,
  }, {
    age: '15-19',
    male: -3.2,
    female: 3.0,
  }];
  
function customizeTooltip(e) {
  return { text: Math.abs(e.valueText) };
}

function customizeLabel(e) {
    return `${Math.abs(e.value)}%`;
}

export const BiDirectionalBarChart = ({ width, height, data, theamColor }) =>  {
  return (
    <div className="BiDirectionalBarChart" style={{fontFamily:"Barlow"}}>
      <div className="Header d-flex justify-content-between align-center">
          <p className="m-0">Call and Put Compression</p>
      </div>
        <Chart
        dataSource={dataSource}
        rotated={true}
        barGroupWidth={18}
        className="ChartBi"
        >
        <CommonSeriesSettings
            type="stackedbar"
            argumentField="age"
        />
        <Series
            valueField="male"
            name="Male"
            color="#00FF59"
        />
        <Series
            valueField="female"
            name="Female"
            color="#FF605D"
        />
        <Tooltip
            enabled={true}
            customizeTooltip={customizeTooltip}
        />
        <ValueAxis>
            <Label customizeText={customizeLabel} />
        </ValueAxis>
        </Chart>
    </div>
  );
}
