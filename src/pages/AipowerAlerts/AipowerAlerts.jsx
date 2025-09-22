import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useContext, useMemo } from "react";
import { UserContext } from "../../context/UserContext";
import AiPowerData from "./components/AiPowerData";
import { getFormatedDateStrForUSA } from "../../utils/common";
import logo_GIF from "../../assets/images/logo-GIF-2.gif";

const TOP_BAR_HEIGHT = 64;

export default function AlertsDialog({ open, onClose }) {
  const { selectedDate, searchTerm, loading } = useContext(UserContext);

  const formattedDateStr = useMemo(
    () => (selectedDate ? getFormatedDateStrForUSA(selectedDate) : ""),
    [selectedDate]
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{
        "& .MuiDialog-container": { alignItems: "flex-start" },
      }}
      PaperProps={{
        sx: {
          mt: `${TOP_BAR_HEIGHT + 12}px`,
          mx: { xs: 1, sm: 2 },
          width: { xs: "calc(100% - 16px)", sm: "calc(100% - 32px)" },
          maxHeight: `calc(100% - ${TOP_BAR_HEIGHT + 50}px)`,
          borderRadius: 3,
          overflow: "hidden",
          bgcolor: "#0f1115",
          color: "#e6e8eb",
          boxShadow: "0 10px 30px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.35)",
        },
      }}
      keepMounted
    >
      <DialogTitle
        sx={{
          m: 0,
          px: 2,
          py: 1.25,
          bgcolor: "#282828",
          color: "#fff",
          fontSize: 20,
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        Alerts
        <IconButton
          onClick={onClose}
          size="small"
          aria-label="close"
          sx={{ color: "inherit" }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{ p: 0, m: 0, bgcolor: "#282828", overflow: "hidden" }}
      >
        <AiPowerData
          style={{ margin: 0, padding: 0 }}
          selectedDate={selectedDate}
          searchTerm={searchTerm}
          animationState={false}
          formattedDateStr={formattedDateStr}
          setFormattedDateStr={() => {}}
        />
      </DialogContent>
      {loading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(28,28,28,0.4)",
            zIndex: 10,
          }}
        >
          <img src={logo_GIF} alt="Loading..." width={100} height={100} />
        </div>
      )}
    </Dialog>
  );
}
