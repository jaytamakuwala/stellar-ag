import { BorderBottom, Height, Margin, Padding } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import zIndex from "@mui/material/styles/zIndex";
import { he } from "date-fns/locale";

export const StyleMainDiv = styled("div")({
  position: "relative",
  height: "100%",
  overflow: "hidden",
  paddingBottom: "0px",
  marginLeft: "65px",
});

export const StyleTopEvents = styled("div")({
  position: "relative",
});

export const StyledTable = styled("div")({
  position: "relative",
  fontFamily: "Barlow",
  border: "none",
  overflow: "hidden",
  "& tr:nth-of-type(odd)": {
    backgroundColor: "rgba(95, 95, 95, 0.15) !important",
  },
  "& .Light_Mode tr:nth-of-type(odd)": {
    backgroundColor: "rgba(95, 95, 95, 0.15) !important",
  },
  "& .TheadTable": {
    position: "sticky",
    top: 0,
    zIndex: "5",
  },
  "& ul": {
    padding: "0 20px",
  },
  "& .Tbodyscroll": {
    maxHeight: "90vh",
    overflowY: "auto",
    overflowX: "auto",
    minWidth: "950px",
  },
  "& table": {
    width: "100%",
    borderCollapse: "collapse",
    border: "none",
  },
  "& th": {
    fontSize: "12px",
    background: "rgba(45,45,45, 0.1)",
    fontWeight: "600",
    color: "#959595",
    position: "relative",
    fontFamily: "Barlow",
  },
  "& th:first-child": {
    borderTopLeftRadius: "6px",
  },
  "& th:last-child": {
    borderTopRightRadius: "6px",
  },
  "& th:not(:last-child)::after": {
    content: '""',
    position: "absolute",
    right: 0,
    top: "40%",
    height: "25%",
    width: "1px",
    backgroundColor: "#666",
    opacity: 0.5,
    pointerEvents: "none",
  },
  "& td": {
    fontSize: "12px",
    fontFamily: "Barlow",
  },
  "& th, & td": {
    padding: "5px 10px",
    textAlign: "left",
    border: "none ",
  },
  "& tbody tr": {
    display: "table-row",
    cursor: "pointer",
  },
  "& .GreenColor td:nth-child(n+2):nth-child(-n+9) ": {
    color: "#00FF59",
  },
  "& .RedColor td:nth-child(n+2):nth-child(-n+9)": {
    color: "#FF605D",
  },
  "& .OptionSelection": {
    height: "35px",
    width: "150px",
    border: "1px solid #f1f1f1",
    padding: "5px 15px",
    cursor: "pounter",
    margin: "15px 10px 0 10px",
    borderRadius: "5px",
  },
  "& .yellow-font": {
    color: "#d6d454 !important",
  },
  "& .green-font": {
    color: "#00FF59 !important",
  },
  "& .LastChild td:last-child": {
    textAlign: "center",
  },
  "& .accordion-content-row": {
    backgroundColor: "rgba(149, 149, 149, .15)",
  },
  "& .NotshowAfter::after": {
    display: "none",
  },
  "& .sky-blue-font": {
    color: "#0ea5e9 !important",
  },

  "@media (max-width:1000px)": {
    "& .RightsideModal .Chart": {
      flex: "1 1 100%",
      height: "100% !important",
    },
    "& .RightsideModal": {
      overflowX: "auto",
    },
    "& .BiDirectionalBarChart": {
      flex: "1 1 100%",
      width: "100%",
      height: "auto !important",
      marginTop: "2px",
    },
    "& tr th:nth-child(5), tr td:nth-child(5)": {
      display: "none",
    },
  },
});
export const StyleModal = styled("div")({
  background: "#282828",
  marginBottom: "30px",
  width: "0",
  transition: "all 0.2s ease-in-out",
  position: "absolute",
  "& .RightsideModal": {
    position: "fixed",
    zIndex: "999999",
    top: "0",
    bottom: "0",
    right: "auto",
    left: "0",
    overflowY: "auto",
    overflowX: "hidden",
    transition: "all 0.2s ease-in-out",
    fontFamily: "Barlow",
    width: "0",
  },
  "& .DivCollection": {
    display: "flex",
    flexWrap: "wrap",
    height: "100%",
  },
  "& .BuySellTime": {
    position: "relative",
  },
  "& .BuySellTime .BorderRight::after": {
    height: "106%",
  },
  "& .BuySellTime .Heading": {
    position: "absolute",
    zIndex: "99999",
    marginTop: "10px",
  },
  "& .RightsideModal .Chart svg": {
    width: "99%",
    height: "44.5vh !important",
  },
  "& .RightsideModal .BiDirectionalBarChart": {
    flex: "1 1 45%",
    width: "50%",
    height: "50vh !important",
    marginTop: "98px",
  },
  "& .RightsideModal .ChartBi": {
    flex: "1 1 45%",
    width: "99%",
    height: "48.5vh !important",
  },
  "& .closeInnerModal": {
    display: "flex",
    position: "absolute",
    zIndex: "999999999",
    right: "12px",
    top: "0px",
    width: "22px",
    height: "22px",
  },
  "& .col-lg-8": {
    width: "70%",
  },
  "& .col-lg-4": {
    width: "30%",
    paddingLeft: "0",
  },
  "& .ag-charts-canvas-container": {
    marginTop: "10px",
    paddingRight: "0",
    height: "100px",
  },
  "& .ag-charts-canvas-center": {
    background: "#282828 !important",
    display: "inline-table",
  },
  "& .ag-charts-styles ": {
    background: "#282828 !important",
    display: "inline-table",
  },
  "& .BorderBottom": {
    background: "#333 !important",
    width: "100%",
    height: "5px",
    marginTop: "30px",
  },
  "& .BorderBottom1": {
    background: "#333 !important",
    width: "101%",
    height: "5px",
    marginTop: "30px",
    position: "relative",
    left: "0",
    zIndex: "99",
  },
  "& .BorderRight": {
    position: "relative",
  },
  "& .BorderRight::after": {
    content: '""',
    position: "absolute",
    top: 0,
    right: "-4px",
    height: "110%",
    borderRight: "5px solid #333",
    display: "block",
    zIndex: "999",
  },
  "& .Ca1Top::after ": {
    top: "-11px",
  },
  "& .BorderTopSet ": {
    top: "-11px",
  },
  "& .BottomGraphs .BorderRight:nth-child(3)::after, .BottomGraphs .BorderRight:nth-child(6)::after":
    {
      borderRight: "none",
    },
  "& .BottomGraphs .BorderRight:nth-child(1), .BottomGraphs .BorderRight:nth-child(2), .BottomGraphs .BorderRight:nth-child(3)":
    {
      top: "-25px",
    },
  "& .BottomGraphs .BorderRight:nth-child(1)::after": {
    top: "10px",
  },
  "& .BottomGraphs .BorderRight:nth-child(4), .BottomGraphs .BorderRight:nth-child(5), .BottomGraphs .BorderRight:nth-child(6)":
    {
      borderTop: "5px solid #333",
    },
  "& .BottomGraphs .BorderRight:nth-child(7), .BottomGraphs .BorderRight:nth-child(8), .BottomGraphs .BorderRight:nth-child(9)":
    {
      marginTop: "30px",
      borderTop: "5px solid #333",
    },
  // '& .BottomGraphs .BorderRight:nth-child(6)': {
  //   borderBottom: '5px solid #333',
  // },

  "@media (max-width: 768px)": {
    "&.chart-container": {
      height: "300px",
    },
  },
  "@media (max-width:1000px)": {
    "& .Chart": {
      width: "505px !important",
    },
    "& .Header": {
      marginRight: "0",
    },
    "& .RightsideModal .BiDirectionalBarChart": {
      width: "inherit",
      height: "auto !important",
    },
    "& .FirstBiDirectionalBarChart": {
      marginTop: "0px !important",
    },
    "& .SecondBiDirectionalBarChart": {
      marginTop: "7px !important",
    },
    "& .DivCollection": {
      display: "block !important",
      width: "500px",
      overflowX: "auto",
    },
    "& .Chart svg ": {
      width: "100%",
      height: "90vh !important",
    },
    "& .RightsideModal .ChartBi ": {
      width: "100%",
    },
    "& .RightsideModal .Chart": {
      flex: "1 1 100%",
      height: "auto !important",
    },
    "& .RightsideModal .Chart svg": {
      width: "100%",
      height: "auto !important",
    },
    "& .BorderBottom, .BorderRight::after, .BorderBottom1": {
      display: "none",
    },
    "& .BottomGraphs .BorderRight:nth-child(4), .BottomGraphs .BorderRight:nth-child(5), .BottomGraphs .BorderRight:nth-child(6)":
      {
        borderTop: "none",
      },
    "& .BottomGraphs .BorderRight:nth-child(7), .BottomGraphs .BorderRight:nth-child(8), .BottomGraphs .BorderRight:nth-child(9)":
      {
        marginTop: "0px",
        borderTop: "none",
      },
  },
  "@media (max-width:900px)": {
    "& .col-lg-8": {
      width: "100%",
    },
    "& .col-lg-4": {
      width: "100%",
      paddingLeft: "0",
    },
    "& .Firstchart": {
      paddingRight: "0px !important",
    },
    "& .SmallPaddRight": {
      paddingRight: "0px !important",
    },
    "& .BottomPiechart": {
      height: "600px !important",
    },
  },
});
export const StyleAniamtionModal = styled("div")({
  fontFamily: "Barlow",
  position: "absolute",
  zIndex: "999999",
  top: "0",
  left: "0",
  width: "100%",
  height: "100%;",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-end",
  "& .Modal-Content": {
    backgroundColor: "#282828",
    width: "100%",
    maxWidth: "100%",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
    transform: "translateY(100%)",
    animation: "slideUp 0.3s ease-in-out forwards",
    overflowY: "auto",
    height: "100%",
  },
  "& .Modal-Content.Light_Mode": {
    backgroundColor: "rgba(225,225,225,100%)",
    borderRadius: "0px",
  },
  "@keyframes slideUp": {
    from: {
      transform: "translateY(100%)",
    },
    to: {
      transform: "translateY(0)",
    },
  },
  "& .CloseBtnDetails": {
    position: "absolute",
    right: "18px",
    top: "19px",
  },
  "& table": {
    width: "100%",
    borderCollapse: "collapse",
    border: "none",
    marginTop: "20px",
  },
  "& th": {
    fontSize: "12px",
    background: "rgba(110,107,107,10%)",
    fontWeight: "500",
    color: "rgba(149, 149, 149, 1)",
  },
  "& td": {
    fontSize: "12px",
    fontFamily: "Barlow",
  },
  "& th, & td": {
    padding: "5px 10px",
    textAlign: "left",
    border: "none ",
  },
  "& tbody tr": {
    display: "table-row",
  },
  "& .GreenColor td:nth-child(n+2):nth-child(-n+9):nth-child(-n+9):nth-child(-n+9) ":
    {
      color: "#00FF59",
    },
  "& .RedColor td:nth-child(n+2):nth-child(-n+9)": {
    color: "#FF605D",
  },
  "& .accordion-content-row": {
    background: "#333",
  },
});
export const StyleOption = styled("div")({
  position: "relative",
  padding: "0 20px 20px",
  zIndex: "9999",
  marginTop: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  "& .rightNavigation": {
    display: "flex",
    justifyContent: "right",
    alignItems: "center",
  },
  "& .SearchInputs": {
    marginRight: "15px",
    fontSize: "14px",
    position: "relative",
    display: "flex",
    justifyContent: "right",
    alignItems: "center",
  },
  "& .SearchInputs input": {
    height: "35px",
    marginLeft: "15px",
    borderRadius: "5px",
    border: "none",
    padding: "10px 35px",
    background: "#959595",
    fontSize: "14px",
    fontWeight: "500",
  },
  "& .ShowInLine": {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  "& .SearchInputs input::placeholder": {
    color: "#000",
    fontSize: "14px",
  },
  "& .SearchInputs svg": {
    position: "absolute",
    left: "22px",
    zIndex: "99999",
    color: "#000",
    width: "20px",
  },
  "& .Filtericon": {
    height: "35px",
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
    background: "#2838CF",
    fontWeight: "500",
  },
  "& .Filtericon svg": {
    fontSize: "20px",
    marginRight: "10px",
  },
  "& .badge": {
    marginLeft: "10px",
  },
  "& .MuiPickersInputBase-root, .MuiPickersOutlinedInput-notchedOutline ": {
    outline: "0",
    border: "none !important",
  },
  "& .MuiIconButton-root": {
    margin: "0px",
    padding: "0px",
    position: "relative",
    left: "0px",
  },
  "@media (max-width:800px)": {
    width: "100%",
    marginTop: "10px",
    display: "block",
    "& .SearchInputs": {
      display: "flex",
      flexDirection: "column",
      marginRight: "8px",
    },
    "& .MuiDialog-root.MuiModal-root": {
      zIndex: "99999",
    },
    "& .SearchInputs input": {
      marginTop: "15px",
      marginLeft: "6px",
      marginBottom: "10px",
      width: "80%",
    },
    "& .SmallScreen ": {
      width: "30% !important",
    },
    "& .SmallScreen .MuiFormControl-root": {
      width: "95% !important",
    },
    "& .ShowInLine": {
      display: "flex",
      flexDirection: "column",
    },
    "& .OptionSelection": {
      width: "80% !important",
    },
    "& .Filtericon": {
      marginLeft: "2px",
      marginBottom: "15px",
      marginTop: "20px",
    },
    "& .SearchIcon": {
      top: "21px !important",
      left: "40px !important",
    },
    "& .SmallScreen svg": {
      top: "-12px",
      left: "25px !important",
    },
  },
  "@media (max-height: 600px)": {
    "& .RightsideModal .Chart svg": {
      height: "59vh !important",
    },
  },
});
export const StyleModalFilter = styled("div")({
  position: "fixed",
  zIndex: "999999",
  top: "0",
  bottom: "0",
  left: "auto",
  right: "0",
  width: "100%",
  overflowY: "auto",
  overflowX: "hidden",
  transition: "all 0.5s ease-in-out",
  padding: "15px",
  background: "rgba(0,0,0,0.5)",
  backdropFilter: "blur(1px)",
  "& .resetSettings": {
    width: "20.5px",
    height: "20.5px",
  },
  "& .badge": {
    fontSize: "16px",
    fontWeight: "normal",
  },
  "& .RightsideModal": {
    position: "fixed",
    zIndex: "9999999",
    top: "0",
    bottom: "0",
    left: "auto",
    right: "0",
    width: "100%",
    overflowY: "auto",
    overflowX: "hidden",
    transition: "all 0.5s ease-in-out",
    padding: "15px",
    backgroundColor: " #434343 !important",
  },
  "& .DivCollection": {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    height: "30px",
    width: "100%",
  },
  "& .RightIcon": {
    display: "flex",
    alignItems: "center",
  },
  "& .BothSide": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: "14px",
  },
  "& .BothSide label": {
    fontSize: "22px",
  },
  "& .ButtonSame": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    width: "100%",
    paddingBottom: "50px !important",
  },
  "& .ButtonSame button": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    width: "210px",
    textAlign: "center",
    height: "40px",
    marginBottom: "30px",
    margin: "0 10px",
  },
  "@media (max-width:767px)": {
    "& .RightsideModal": {
      width: "90% !important",
    },
  },
});
export const StyleNavightion = styled("div")({
  position: "fixed",
  zIndex: "999999",
  top: "0",
  bottom: "0",
  left: "0",
  right: "0",
  width: "66px",
  overflowY: "hidden",
  overflowX: "hidden",
  padding: "15px",
  background: "#3e3e3e",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
  "& img": {
    cursor: "pointer",
  },
  "& .SellerIcon": {
    width: "39px",
    height: "39px",
  },
  "& .Dashboard": {
    marginTop: "50px",
    height: "20px",
    width: "20px",
  },
  "& .rawoption": {
    marginTop: "30px",
    width: "20px",
    height: "20px",
  },

  "& img.active": {
    backgroundColor: "#282828", 
    padding: "20px", 
    width: "30px", 
    height: "30px", 
    boxSizing: "content-box",
  },
  "& .Account": {
    marginBottom: "25px",
  },
  "& .IconAction": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  "@media (max-width:767px)": {
    "& .RightsideModal": {
      width: "90% !important",
    },
  },
});
export const StyleDetailRow = styled("div")({
  "& .ag-details-row": {
    background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%) !important",
    border: "1px solid rgba(178, 74, 242, 0.3)",
    borderRadius: "8px",
    margin: "4px 8px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
    animation: "slideDown 0.3s ease-out",
  },

  "@keyframes slideDown": {
    from: {
      opacity: 0,
      transform: "translateY(-10px)",
    },
    to: {
      opacity: 1,
      transform: "translateY(0)",
    },
  },

  "& .ag-details-grid": {
    background: "transparent !important",
    border: "none !important",
  },

  "& .detail-content": {
    padding: "20px",
    color: "#ffffff",
    fontFamily: '"Barlow", sans-serif',
  },

  "& .detail-header": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    paddingBottom: "12px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  },

  "& .detail-title": {
    fontSize: "18px",
    fontWeight: 600,
    color: "#ffffff",
    margin: 0,
  },

  "& .detail-close-btn": {
    background: "rgba(178, 74, 242, 0.2)",
    border: "1px solid rgba(178, 74, 242, 0.5)",
    color: "#ffffff",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
    transition: "all 0.2s ease",
  },

  "& .detail-close-btn:hover": {
    background: "rgba(178, 74, 242, 0.4)",
    borderColor: "rgba(178, 74, 242, 0.8)",
  },

  "& .detail-grid": {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginTop: "16px",
  },

  "& .detail-item": {
    background: "rgba(255, 255, 255, 0.05)",
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },

  "& .detail-item-label": {
    fontSize: "12px",
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: "4px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  "& .detail-item-value": {
    fontSize: "16px",
    fontWeight: 500,
    color: "#ffffff",
  },

  "& .detail-item-value.positive": {
    color: "#4ade80",
  },

  "& .detail-item-value.negative": {
    color: "#f87171",
  },

  "& .detail-chart-container": {
    marginTop: "20px",
    padding: "16px",
    background: "rgba(255, 255, 255, 0.03)",
    borderRadius: "8px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },

  "& .detail-chart-title": {
    fontSize: "14px",
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: "12px",
  },

  "& .ag-row:hover": {
    background: "rgba(178, 74, 242, 0.1) !important",
    cursor: "pointer",
    transition: "background 0.2s ease",
  },

  "& .ag-row.ag-row-selected": {
    background: "rgba(178, 74, 242, 0.2) !important",
    border: "1px solid rgba(178, 74, 242, 0.5)",
  },

  "& .ag-row-group-expanded": {
    animation: "expandRow 0.3s ease-out",
  },

  "@keyframes expandRow": {
    from: {
      maxHeight: 0,
      opacity: 0,
    },
    to: {
      maxHeight: "400px",
      opacity: 1,
    },
  },
});
