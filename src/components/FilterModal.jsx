import resetSettings from "../assets/Images/reset_settings.png";
import CloseIcon from "@mui/icons-material/Close";
import { formatNumberToCurrencyWithComma } from "../utils/common";

export default function FilterModal({
  filterState,
  filterModalState,
  setFilterModalState,
  handleFilerOptionClose,
}) {
  return (
    <div
      className="modal RightsideModal"
      style={{
        width: filterState ? "520px" : "0",
        display: "flex",
      }}
    >
      <div style={{ width: "100%" }}>
        <div className="DivCollection" style={{ display: "flex" }}>
          <div>
            <h4>Filter</h4>
          </div>
          <div className="RightIcon">
            <img
              src={resetSettings}
              alt="Reset Settings"
              className="resetSettings"
            />
            <span
              style={{
                margin: "0 15px",
                position: "relative",
                top: "-2px",
                color: "#959595",
              }}
            >
              {" "}
              |{" "}
            </span>
            <button
              type="button"
              className="btn btn-link p-0"
              style={{ color: "#fff", lineHeight: "0" }}
              onClick={() => handleFilerOptionClose()}
            >
              <CloseIcon />
            </button>
          </div>
        </div>
        <div className="mt-5 form-group">
          <div className="BothSide">
            <label htmlFor="score">Score</label>
            <span className="badge badge-primary">
              {formatNumberToCurrencyWithComma(filterModalState.score)}
            </span>
          </div>
          <input
            type="range"
            className="form-control-range"
            id="score"
            name="score"
            min="0"
            max="100"
            defaultValue={filterModalState.score}
            onChange={setFilterModalState}
          />
        </div>
        <div className="mt-5 form-group">
          <div className="BothSide">
            <label htmlFor="totalCallBuyCost">Total Call Buy Cost</label>
            <span className="badge badge-primary">
              {formatNumberToCurrencyWithComma(
                filterModalState.totalCallBuyCost
              )}
            </span>
          </div>
          <input
            type="range"
            className="form-control-range"
            id="totalCallBuyCost"
            name="totalCallBuyCost"
            min="0"
            max="1000000"
            defaultValue={filterModalState.totalCallBuyCost}
            onChange={setFilterModalState}
          />
        </div>
        <div className="mt-5 form-group">
          <div className="BothSide">
            <label htmlFor="totalPutBuyCost">Total Put Buy Cost</label>
            <span className="badge badge-primary">
              {formatNumberToCurrencyWithComma(
                filterModalState.totalPutBuyCost
              )}
            </span>
          </div>
          <input
            type="range"
            className="form-control-range"
            id="totalPutBuyCost"
            name="totalPutBuyCost"
            min="0"
            max="1000000"
            defaultValue={filterModalState.totalPutBuyCost}
            onChange={setFilterModalState}
          />
        </div>
        <div className="mt-5 form-group">
          <div className="BothSide">
            <label htmlFor="totalCallSellCost">Total Call Sell Cost</label>
            <span className="badge badge-primary">
              {formatNumberToCurrencyWithComma(
                filterModalState.totalCallSellCost
              )}
            </span>
          </div>
          <input
            type="range"
            className="form-control-range"
            id="totalCallSellCost"
            name="totalCallSellCost"
            min="0"
            max="1000000"
            defaultValue={filterModalState.totalCallSellCost}
            onChange={setFilterModalState}
          />
        </div>
        <div className="mt-5 form-group">
          <div className="BothSide">
            <label htmlFor="totalPutSellCost">Total Put Sell Cost</label>
            <span className="badge badge-primary">
              {formatNumberToCurrencyWithComma(
                filterModalState.totalPutSellCost
              )}
            </span>
          </div>
          <input
            type="range"
            className="form-control-range"
            id="totalPutSellCost"
            name="totalPutSellCost"
            min="0"
            max="1000000"
            defaultValue={filterModalState.totalPutSellCost}
            onChange={setFilterModalState}
          />
        </div>
        <div className="mt-5 form-group">
          <div className="BothSide">
            <label htmlFor="totalPutCallCost">Total Put Call Cost</label>
            <span className="badge badge-primary">
              {formatNumberToCurrencyWithComma(
                filterModalState.totalPutCallCost
              )}
            </span>
          </div>
          <input
            type="range"
            className="form-control-range"
            id="totalPutCallCost"
            name="totalPutCallCost"
            min="0"
            max="1000000"
            defaultValue={filterModalState.totalPutCallCost}
            onChange={setFilterModalState}
          />
        </div>
        <div className="mt-5 form-group">
          <div className="BothSide">
            <label htmlFor="call2PutBuyRatio">Call 2 Put Buy Ratio</label>
            <span className="badge badge-primary">
              {filterModalState.call2PutBuyRatio}X
            </span>
          </div>
          <input
            type="range"
            className="form-control-range"
            id="call2PutBuyRatio"
            name="call2PutBuyRatio"
            min="0"
            max="5"
            defaultValue={filterModalState.call2PutBuyRatio}
            onChange={setFilterModalState}
          />
        </div>
        <div className="mt-5 form-group">
          <div className="BothSide">
            <label htmlFor="callBuy2CallSellRatio">
              Call Buy 2 Call Sell Ratio
            </label>
            <span className="badge badge-primary">
              {filterModalState.callBuy2CallSellRatio}X
            </span>
          </div>
          <input
            type="range"
            className="form-control-range"
            id="callBuy2CallSellRatio"
            name="callBuy2CallSellRatio"
            min="0"
            max="5"
            defaultValue={filterModalState.callBuy2CallSellRatio}
            onChange={setFilterModalState}
          />
        </div>
        <div className="mt-5 form-group">
          <div className="BothSide">
            <label htmlFor="callBuy2PreviousCallBuy">
              Call Buy 2 Previous Call Buy
            </label>
            <span className="badge badge-primary">
              {filterModalState.callBuy2PreviousCallBuy}X
            </span>
          </div>
          <input
            type="range"
            className="form-control-range"
            id="callBuy2PreviousCallBuy"
            name="callBuy2PreviousCallBuy"
            min="0"
            max="5"
            defaultValue={filterModalState.callBuy2PreviousCallBuy}
            onChange={setFilterModalState}
          />
        </div>
        <div className="mt-5 form-group mb-5 ButtonSame">
          <button type="button" className="btn btn-primary">
            Filter
          </button>
          <button type="button" className="btn btn-secondary ClearBtn">
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
