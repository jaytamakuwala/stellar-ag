import "./Ticker.css";

export default function Ticker() {
  return (
    <section className="feature-wrapper">
      {/* Card 1 */}
      <div className="heatmap-card">
        <div className="card-inner">
          <div className="card-text-group">
            <h3 className="card-title">Fast moving sweep orders</h3>
            <p className="card-desc">
              Stellars Trade follows the path of intermarket sweep orders across
              multiple exchanges and compiles the data for you.
            </p>
          </div>
          <div className="card-rows swap-ticker">
            <div className="swap-ticker-inner">
              <div className="row row-gradient-a">
                <span className="row-left">95</span>
                <span className="row-name">AAPL</span>
                <span className="row-value">$150k</span>
                <span className="row-value2">$170k</span>
                <span className="row-value3">
                  <img src="analysis.svg" />
                </span>
                <div className="row-chart" />
              </div>
              <div className="row row-gradient-b">
                <span className="row-left">96</span>
                <span className="row-name">ADBE</span>
                <span className="row-value">$1.2M</span>
                <span className="row-value2">$1.4M</span>
                <span className="row-value3">
                  <img src="analysis.svg" />
                </span>
                <div className="row-chart" />
              </div>
              <div className="row row-gradient-a">
                <span className="row-left">97</span>
                <span className="row-name">TSLA</span>
                <span className="row-value">$180k</span>
                <span className="row-value2">$201k</span>
                <span className="row-value3">
                  <img src="analysis.svg" />
                </span>
                <div className="row-chart" />
              </div>
              <div className="row row-gradient-b">
                <span className="row-left">98</span>
                <span className="row-name">MSFT</span>
                <span className="row-value">$2.2M</span>
                <span className="row-value2">$2.4M</span>
                <span className="row-value3">
                  <img src="analysis.svg" />
                </span>
                <div className="row-chart" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 */}
      </div>
      <div className="heatmap-card">
        <div className="feature-section">
          <div className="card-text-group">
            <h3 className="card-title">Options order flow analysis</h3>
            <p className="card-desc">
              Gain insight into the market’s most significant shifts in both
              bullish and bearish directions.
            </p>
          </div>

          <div className="feature-content">
            <div className="feature-img2">
              {/* Row 1 */}
              <div className="feature-row">
                <div className="feature-rect green"></div>
                <span className="feature-label">TSLA</span>
              </div>

              {/* Row 2 */}
              <div className="feature-row">
                <div className="feature-rect red"></div>
                <span className="feature-label">AMD</span>
              </div>

              {/* Row 3 */}
              <div className="feature-row">
                <div className="feature-rect green"></div>
                <span className="feature-label">AAPL</span>
              </div>

              {/* Row 4 */}
              <div className="feature-row">
                <div className="feature-rect green"></div>
                <span className="feature-label">ADBE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
