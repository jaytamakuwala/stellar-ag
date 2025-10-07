import { useTheme, useMediaQuery } from "@mui/material";

export const useResponsive = ({ mobileMaxPx = 767 } = {}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(`(max-width:${mobileMaxPx}px)`);
  const isTablet = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  return { isMobile, isTablet, isDesktop };
};
