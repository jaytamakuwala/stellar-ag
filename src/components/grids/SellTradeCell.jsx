import {
  currencyColorStyle,
  formatNumberToCurrency,
  getFormatedDateStrForUSA,
  stripMoney,
  toDDMMYYYY,
  toLocalISOString,
} from "../../utils/common";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { AG_GRID_HEIGHTS, COLORS } from "../../utils/constants";
import { AgGridReact } from "ag-grid-react";
import { getOptionTradeDetails } from "../../service/stellarApi";

export function SellTradesCell({
  parentRow,
  formattedDateStr,
  optionTradeData,
  setOptionTradeData,
}) {
  if (!parentRow) return <div style={{ width: "100%" }} />;

  const rowKey =
    parentRow.__id ?? `${parentRow.Tick ?? "tick"}-${parentRow.Time ?? "time"}`;
  const tick = parentRow.Tick ?? "";
  const data = optionTradeData[rowKey];
  const isLoading = !(rowKey in optionTradeData);
  const inFlightRef = useRef(new Set());

  useEffect(() => {
    let ignore = false;

    async function run() {
      const execDate = formattedDateStr || getFormatedDateStrForUSA(new Date());
      if (!execDate || !tick) return;
      if (optionTradeData[rowKey]) return;

      try {
        inFlightRef.current.add(rowKey);
        const [time, period] = parentRow.Time.trim()
          .toUpperCase()
          .match(/(\d{1,2}:\d{2})(AM|PM)/)
          .slice(1);
        const [hoursStr, minutesStr] = time.split(":");
        let hours = parseInt(hoursStr, 10);
        const minutes = parseInt(minutesStr, 10);
        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;

        const [year, month, day] = execDate.split("-").map(Number);
        const startTime = new Date(year, month - 1, day, hours, minutes);
        const endTime = new Date(startTime.getTime() + 5 * 60 * 1000);

        const startIso = toLocalISOString(startTime);
        const endIso = toLocalISOString(endTime);

        const query = {
          startTime: startIso,
          endTime: endIso,
          optionSymbol: tick,
          buyOrSell: "BUY",
        };
        const res = await getOptionTradeDetails(query);

        let rows = [];
        if (Array.isArray(res)) rows = res;
        else if (Array.isArray(res?.data)) rows = res.data;
        else if (Array.isArray(res?.rows)) rows = res.rows;
        else if (Array.isArray(res?.data?.rows)) rows = res.data.rows;

        rows = (rows || [])
          .filter((x) =>
            String(x?.BuyOrSell ?? x?.side ?? x?.orderSide ?? "")
              .toUpperCase()
              .includes("BUY")
          )
          .map((x, i) => ({
            id: x.id ?? `${tick}-${x.Time ?? i}`,
            ...x,
          }));

        if (!ignore)
          setOptionTradeData((prev) => ({ ...prev, [rowKey]: rows }));
      } catch {
        if (!ignore) setOptionTradeData((prev) => ({ ...prev, [rowKey]: [] }));
      } finally {
        inFlightRef.current.delete(rowKey);
      }
    }

    run();
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowKey, tick, formattedDateStr, setOptionTradeData]);

  const headerStyle = {
    backgroundColor: COLORS.dark3,
    color: COLORS.dimText,
    fontSize: 12,
    fontFamily: "Barlow",
    textAlign: "center",
  };

  const centerWhite = {
    color: COLORS.white,
    textAlign: "center",
    fontFamily: "Barlow",
    fontSize: 12,
    fontWeight: 100,
    width: "100%",
  };

  const currencyCellStyle = (p) => {
    const v = stripMoney(p.value);
    const colorStyle = currencyColorStyle(v).color;
    return { ...centerWhite, color: colorStyle };
  };

  const tradeCols = useMemo(
    () => [
      {
        headerName: "Time",
        field: "Time",
        flex: 1,
        headerStyle,
        cellStyle: centerWhite,
        headerClass: ["cm-header"],
      },
      {
        headerName: "Expiry",
        field: "Expiry",
        flex: 1.8,
        headerStyle,
        cellStyle: centerWhite,
        valueFormatter: (pp) => toDDMMYYYY(pp.value),
        headerClass: ["cm-header"],
      },
      // {
      //   headerName: "Tick",
      //   field: "Tick",
      //   flex: 1,
      //   headerStyle,
      //   cellStyle: { ...centerWhite, color: COLORS.lime, fontWeight: 400 },
      //   headerClass: ["cm-header"],
      // },
      {
        headerName: "Type",
        field: "Type",
        flex: 1,
        headerStyle,
        cellStyle: centerWhite,
        headerClass: ["cm-header"],
      },
      {
        headerName: "Side",
        field: "BuyOrSell",
        flex: 1,
        headerStyle,
        headerClass: ["cm-header"],
      },
      {
        headerName: "Strike",
        field: "Strike",
        flex: 1.1,
        headerStyle,
        cellStyle: centerWhite,
        headerClass: ["cm-header"],
      },
      {
        headerName: "Spot",
        field: "Spot",
        flex: 1.4,
        headerStyle,
        cellStyle: centerWhite,
        headerClass: ["cm-header"],
      },
      {
        headerName: "TotalCost",
        field: "TotalCost",
        flex: 1.2,
        headerStyle,
        cellStyle: currencyCellStyle,
        valueFormatter: (pp) => formatNumberToCurrency(pp.value),
        headerClass: ["cm-header"],
      },
      {
        headerName: "SpotStrikeDiff",
        field: "SpotStrikeDiff",
        flex: 1.2,
        headerStyle,
        cellStyle: centerWhite,
        headerClass: ["cm-header"],
      },
      {
        headerName: "Price",
        field: "Price",
        flex: 1.0,
        headerStyle,
        cellStyle: centerWhite,
        headerClass: ["cm-header"],
      },
      {
        headerName: "TimeDiff",
        field: "TimeDiff",
        flex: 1.0,
        headerStyle,
        cellStyle: centerWhite,
        headerClass: ["cm-header", "no-resize"],
      },
      // { headerName: "", field: "", flex: 1.0, headerStyle, cellStyle: centerWhite },
      // { headerName: "", field: "", flex: 1.0, headerStyle, cellStyle: centerWhite },
      // { headerName: "", field: "", flex: 1.0, headerStyle, cellStyle: centerWhite },
    ],
    []
  );

  const getLevelThirdRowStyle = useCallback((params) => {
    const isEvenRow = params.node.rowIndex % 2 === 0;
    return {
      background: isEvenRow ? COLORS.dark4 : COLORS.dark3,
      color: COLORS.white,
      fontWeight: 100,
      fontSize: 12,
      fontFamily: "Barlow",
      transition: "opacity 0.3s ease-in-out",
    };
  }, []);

  return (
    <div className="ag-theme-quartz no-padding-grid" style={{ width: "100%" }}>
      <AgGridReact
        className="third-grid no-padding-grid"
        rowData={Array.isArray(data) ? data : []}
        columnDefs={tradeCols}
        headerHeight={AG_GRID_HEIGHTS.HEADER_H_L3}
        suppressRowHoverHighlight={true}
        rowHeight={AG_GRID_HEIGHTS.ROW_H_L3}
        defaultColDef={{
          resizable: true,
          wrapHeaderText: true,
          autoHeaderHeight: true,
        }}
        suppressCellFocus
        getRowId={(pp) =>
          pp?.data?.id ||
          `${pp?.data?.Tick ?? ""}-${pp?.data?.Time ?? ""}-${pp?.rowIndex ?? 0}`
        }
        getRowStyle={getLevelThirdRowStyle}
        domLayout="autoHeight"
        suppressHorizontalScroll
        suppressVerticalScroll
        style={{ width: "100%" }}
      />
    </div>
  );
}
