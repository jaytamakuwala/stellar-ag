import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";

// Gradient Button
export const GradientButton = styled(Button)(() => ({
  background: "linear-gradient(90deg, #B24AF2 8.09%, #FF605D 91.17%)",
  color: "#fff",
  borderRadius: "12px",
  padding: "8px 20px",
  textTransform: "none",
  fontWeight: 600,
}));

// Yellow Button
export const YellowButton = styled(Button)(() => ({
  backgroundColor: "#FFD600",
  color: "#000",
  borderRadius: "12px",
  padding: "8px 20px",
  textTransform: "none",
  fontWeight: 600,
}));
