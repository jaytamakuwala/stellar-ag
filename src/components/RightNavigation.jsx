import { StyleNavightion } from "../style/containers/AnimatedTable";
import Favicon from "../assets/Images/favicon.png";
import Dashboard from "../assets/Images/space_dashboard.png";
import Account from "../assets/Images/account_circle.png";
import Logout from "../assets/Images/logout.png";
import rawoption from "../assets/Images/rawoption.png";
import magic_call from "../assets/Images/magic_call.png";
import magic_put from "../assets/Images/magic_put.png";
import ultra from "../assets/Images/ultra.png";
import unusual from "../assets/Images/unusual.png";
import { signout } from "../service/stellarApi";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function RightNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
const { setOpenAlerts } = useContext(UserContext);
  // helper to check active route
  const isActive = (path) => location.pathname === path;

  return (
    <StyleNavightion>
      <div className="IconAction">
        <img src={Favicon} alt="Icon" onClick={() => navigate("/dashboard")} />
        <img
          src={Dashboard}
          alt="Icon"
          className={`Dashboard ${isActive("/dashboard") ? "active" : ""}`}
          onClick={() => {
             navigate("/dashboard");
          }}
        />
        <img
          src={rawoption}
          alt="Icon"
          className={`rawoption ${isActive("/optionMain") ? "active" : ""}`}
          onClick={() => navigate("/optionMain")}
        />
        <img
          src={magic_call}
          alt="Icon"
          className={`rawoption ${
            isActive("/MagicOptionMain") ? "active" : ""
          }`}
          onClick={() => navigate("/MagicOptionMain")}
        />
        <img
          src={magic_put}
          alt="Icon"
          className={`rawoption ${isActive("/MagicPutBuy") ? "active" : ""}`}
          onClick={() => navigate("/MagicPutBuy")}
        />
        <img
          src={unusual}
          alt="Icon"
          className={`rawoption ${
            isActive("/UnusualDataMain") ? "active" : ""
          }`}
          onClick={() => navigate("/UnusualDataMain")}
        />
        <img
          src={ultra}
          alt="Icon"
          className={`rawoption ${
            isActive("/UltraHighVolumeDataMain") ? "active" : ""
          }`}
          onClick={() => navigate("/UltraHighVolumeDataMain")}
        />
      </div>
      <div className="IconAction">
        <img
          src={Account}
          alt="Icon"
          className="Account"
          onClick={() => navigate("/myProfilemain")}
        />
        <img
          src={Logout}
          alt="Icon"
          className="Logout"
          onClick={() => {
            signout();
            sessionStorage.removeItem("token");
            navigate("/signin");
          }}
        />
      </div>
    </StyleNavightion>
  );
}
