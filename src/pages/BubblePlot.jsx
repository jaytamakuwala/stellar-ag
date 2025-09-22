import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";

const MARGIN = { top: 30, right: 30, bottom: 80, left: 100 };
const BUBBLE_MIN_SIZE = 4;
const BUBBLE_MAX_SIZE = 40;

export const BubblePlot = ({ width, height, data, theamColor }) => {
  const [activeButton, setActiveButton] = useState('0-7');
  const axesRef = useRef(null);
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const xScale = useMemo(() => {
    const [min, max] = d3.extent(data.map((d) => d.gdpPercap)) || [0, 1];
    return d3.scaleLinear().domain([0, max || 1]).range([0, boundsWidth]).nice();
  }, [data, width]);
  
  const yScale = useMemo(() => {
    const [min, max] = d3.extent(data.map((d) => d.lifeExp)) || [0, 1];
    return d3.scaleLinear().domain([min || 0, max || 1]).range([boundsHeight, 0]).nice();
  }, [data, height]);
  
  useEffect(() => {
    if (!xScale || !yScale) {
      console.error("Scales are not initialized");
      return;
    }
  
    const svgElement = d3.select(axesRef.current);
    svgElement.selectAll("*").remove();
  
    const xAxisGenerator = d3.axisBottom(xScale);
    svgElement
      .append("g")
      .attr("transform", `translate(0, ${boundsHeight})`)
      .call(xAxisGenerator);
  
    const yAxisGenerator = d3.axisLeft(yScale);
    svgElement.append("g").call(yAxisGenerator);
  }, [xScale, yScale, boundsHeight]);
  
  const groups = data
    .map((d) => d.continent)
    .filter((x, i, a) => a.indexOf(x) === i);

  const colorScale = d3
    .scaleOrdinal()
    .domain(groups)
    .range(["#00FF59", "#FF605D"]);

  const sizeScale = useMemo(() => {
    const [min, max] = d3.extent(data.map((d) => d.pop));
    return d3
      .scaleSqrt()
      .domain([min, max])
      .range([BUBBLE_MIN_SIZE, BUBBLE_MAX_SIZE]);
  }, [data, width]);

  // Render the X and Y axis using d3.js, not React
  useEffect(() => {
    const svgElement = d3.select(axesRef.current);
    svgElement.selectAll("*").remove();

    const xAxisGenerator = d3.axisBottom(xScale);
    svgElement
      .append("g")
      .attr("transform", `translate(0,${boundsHeight + 20})`)
      .call(xAxisGenerator);
    svgElement
      .append("text")
      .attr("font-size", 11)
      .attr("color", "white")
      .attr("text-anchor", "end")
      .attr("x", boundsWidth)
      .attr("y", boundsHeight + 60)

    const yAxisGenerator = d3.axisLeft(yScale);
    svgElement
      .append("g")
      .attr("transform", "translate(-20,0)")
      .call(yAxisGenerator);
    svgElement
      .append("text")
      .attr("font-size", 12)
      .attr("text-anchor", "end")
      .attr("x", 0)
      .attr("y", -60)
      .attr("transform", "rotate(-90)");
  }, [xScale, yScale, boundsHeight, boundsWidth]);

  const allShapes = data
    .sort((a, b) => b.pop - a.pop)
    .map((d, i) => (
      <circle
        key={i}
        r={sizeScale(d.pop)}
        cx={xScale(d.gdpPercap)}
        cy={yScale(d.lifeExp)}
        opacity={1}
        stroke={colorScale(d.continent)}
        fill={colorScale(d.continent)}
        fillOpacity={1}
        strokeWidth={1}
      />
    ));
    const handleClick = (range) => {
      setActiveButton(range);
  };
  return (
    <div className="Chart" style={{ width: "50%", height: "100%" }}>
      <div className="Header d-flex justify-content-between align-center">
          <p className="m-0">Heat Map</p>
          <div className="Daysselection">            
            {['0-7', '7-15', '15-30', '30'].map((range) => (
                <button
                    key={range}
                    className={`btn ${activeButton === range ? 'btn-primary' : 'btn-link'}`}
                    onClick={() => handleClick(range)}
                >
                    {range}
                </button>
            ))}
          </div>
      </div>
      <svg width={width} height={height} className="${theamColor}">
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${MARGIN.left},${MARGIN.top})`}
        >
          {allShapes}
        </g>
        <g
          width={boundsWidth}
          height={boundsHeight}
          ref={axesRef}
          transform={`translate(${MARGIN.left},${MARGIN.top})`}
        />
      </svg>
    </div>
  );
};
