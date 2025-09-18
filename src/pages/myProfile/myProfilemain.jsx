import { useCallback, useEffect, useMemo, useState, useContext } from "react";
import {
  StyleMainDiv,
  StyleModalFilter,
} from "../../style/containers/AnimatedTable";
import RightNavigation from "../../components/RightNavigation";
import { UserContext } from "../../context/UserContext";
import DualGridHeader from "../../components/DualGridHeader";

export default function MagicOptionMain() {
  return (
    <StyleMainDiv
      style={{ display: "flex", flexDirection: "column", height: "100vh" }}
    >
      <DualGridHeader hader={"My Profile"} />
      <RightNavigation />
    </StyleMainDiv>
  );
}
