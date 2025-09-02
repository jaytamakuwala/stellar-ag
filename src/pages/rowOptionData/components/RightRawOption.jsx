import { useEffect, useMemo, useState, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import toast from "react-hot-toast";
import {
  toLocalISOString,
  toDDMMYYYY,
  stripMoney,
  currencyColorStyle,
} from "../../../utils/common";
import { getOptionTradeDetails } from "../../../service/stellarApi";
import {
  formatNumberToCurrency,
  getFormatedDateStrForUSA,
} from "../../../utils/common";
import { AG_GRID_HEIGHTS, COLORS } from "../../../utils/constants";
import { StyleMainDiv } from "../../../style/containers/AnimatedTable";
import "../../../style/AgGrid.css";

export default function RightRawOption({
  selectedDate,
  searchTerm,
  animationState,
  formattedDateStr,
  setFormattedDateStr,
}) {
  const [rows, setRows] = useState([]);

  const fetchdata = useCallback(async () => {
    try {
      const base = selectedDate ? new Date(selectedDate) : new Date();

      const dayStr = getFormatedDateStrForUSA(base);
      setFormattedDateStr(dayStr);

      const startTime = new Date(
        base.getFullYear(),
        base.getMonth(),
        base.getDate(),
        9,
        0,
        0,
        0
      );
      const endTime = new Date(
        base.getFullYear(),
        base.getMonth(),
        base.getDate(),
        16,
        45,
        0,
        0
      );

      const query = {
        startTime: toLocalISOString(startTime),
        endTime: toLocalISOString(endTime),
        buyOrSell: "BS",
        optionType: "P",
        sortMode: "1",
      };

      const res = await getOptionTradeDetails(query);
      if (!res?.ok)
        throw new Error(res?.error?.error || "Failed to fetch product data");

      setRows(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    }
  }, [selectedDate, setFormattedDateStr]);

  useEffect(() => {
    fetchdata();
  }, [selectedDate]);

  const filteredResponseData = useMemo(() => {
    const q = (searchTerm || "").trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) => (row?.Tick ?? "").toLowerCase().includes(q));
  }, [rows, searchTerm]);

  const centerWhite = {
    color: COLORS.white,
    textAlign: "center",
    fontFamily: "Barlow",
    fontSize: 12,
    fontWeight: 100,
    width: "100%",
  };
  const headerStyle = {
    backgroundColor: COLORS.dark3,
    color: COLORS.dimText,
    fontSize: 12,
    fontFamily: "Barlow",
    textAlign: "center",
  };
  const currencyCellStyle = (p) => {
    const v = stripMoney(p.value);
    const colorStyle = currencyColorStyle(v).color;
    return { ...centerWhite, color: colorStyle };
  };

  function to12hUpper(val) {
    if (val == null || val === "") return "";

    let d;

    if (val instanceof Date) {
      d = val;
    } else if (typeof val === "number") {
      // epoch seconds vs ms
      d = new Date(val < 1e12 ? val * 1000 : val);
    } else if (typeof val === "string") {
      const s = val.trim();

      // already has AM/PM → normalize
      const ap = /^(\d{1,2})(?::(\d{2}))?(?::(\d{2}))?\s*(am|pm)$/i.exec(s);
      if (ap) {
        const h = +ap[1] % 12 || 12;
        const m = String(ap[2] ?? "00").padStart(2, "0");
        const ampm = ap[4].toUpperCase();
        return `${h}:${m} ${ampm}`;
      }

      // 24h "HH:mm[:ss]"
      const hm = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(s);
      if (hm) {
        const H = +hm[1],
          M = +hm[2],
          S = +(hm[3] || 0);
        d = new Date();
        d.setHours(H, M, S, 0);
      } else {
        // ISO or other parsable date-time string
        const tryDate = new Date(s);
        if (!isNaN(tryDate)) d = tryDate;
        else return String(val);
      }
    }

    if (!d || isNaN(d)) return String(val);

    const H = d.getHours();
    const m = String(d.getMinutes()).padStart(2, "0");
    const ampm = H >= 12 ? "PM" : "AM";
    const h12 = H % 12 || 12;

    return `${h12}:${m} ${ampm}`;
  }

  const tradeCols = useMemo(
    () => [
      {
        headerName: "Time",
        field: "Time",
        flex: 1,
        headerStyle,
        cellStyle: centerWhite,
        headerClass: ["cm-header"],
        valueFormatter: (p) => to12hUpper(p.value),
        tooltipValueGetter: (p) => to12hUpper(p.value),
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
      {
        headerName: "DTE",
        field: "DTE",
        flex: 1.0,
        headerStyle,
        cellStyle: centerWhite,
        cellStyle: (params) => {
          const isCall = Number(params.value) <= 3;
          return {
            color: isCall ? "orange" : "",
            textAlign: "center",
            fontFamily: "Barlow",
            fontSize: 12,
          };
        },
        headerClass: ["cm-header", "no-resize"],
      },
      {
        headerName: "Tick",
        field: "Tick",
        flex: 1,
        headerStyle,
        cellStyle: centerWhite,
        headerClass: ["cm-header"],
      },
      {
        headerName: "Trade",
        field: "Trade",
        flex: 1,
        headerStyle,
        cellStyle: centerWhite,
        cellStyle: (params) => {
          const isCall = String(params.value).toUpperCase() === "CALL";
          return {
            color: isCall ? "green" : "red",
            textAlign: "center",
            fontFamily: "Barlow",
            fontSize: 12,
          };
        },
        headerClass: ["cm-header"],
      },
      {
        headerName: "Type",
        field: "Type",
        flex: 1,
        headerStyle,
        cellStyle: centerWhite,

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
        headerName: "SSD",
        field: "SSD",
        flex: 1.2,
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
        headerName: "Price",
        field: "Price",
        flex: 1.0,
        headerStyle,
        cellStyle: centerWhite,
        headerClass: ["cm-header"],
      },
    ],
    []
  );

  const getRowStyle = useCallback((params) => {
    const isEvenRow = params.node.rowIndex % 2 === 0;
    const rowOverlay = isEvenRow ? COLORS.dark4 : COLORS.dark3;

    return {
      background: `${rowOverlay}`,
      color: "rgb(245, 245, 245)",
      transition: "opacity 0.3s ease-in-out",
      fontFamily: "Barlow",
      fontSize: 12,
    };
  }, []);

  return (
    <div style={{ overflowX: "auto",  marginBottom: "20px" }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          padding: 5,
          height: "100vh",
          width: "100%",
        }}
      >
        <AgGridReact
          className="ag-theme-quartz header-center main-grid"
          rowData={filteredResponseData}
          columnDefs={tradeCols}
          suppressRowHoverHighlight
          defaultColDef={{
            flex: 1,
            sortable: false,
            resizable: true,
            filter: false,
            wrapHeaderText: true,
            autoHeaderHeight: true,
            headerClass: "cm-header",
          }}
          rowClassRules={{
            "ag-row-even": (params) => params.node.rowIndex % 2 === 0,
            "ag-row-odd": (params) => params.node.rowIndex % 2 !== 0,
          }}
          suppressCellFocus
          // rowHeight={AG_GRID_HEIGHTS.ROW_H_L1}
          // headerHeight={AG_GRID_HEIGHTS.HEADER_H_L1}
          getRowStyle={getRowStyle}
          rowHeight={28}
          headerHeight={30}
        />
      </div>
    </div>
  );
}
