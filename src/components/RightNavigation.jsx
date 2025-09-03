import { StyleNavightion } from "../style/containers/AnimatedTable";
import Favicon from "../assets/Images/favicon.png";
import Dashboard from "../assets/Images/space_dashboard.png";
import Account from "../assets/Images/account_circle.png";
import Logout from "../assets/Images/logout.png";
import { signout } from "../service/stellarApi";
import { useNavigate } from "react-router-dom";

export default function RightNavigation() {
  const navigate = useNavigate();

  return (
    <>
      <StyleNavightion>
        <div className="IconAction">
          <img src={Favicon} alt="Icon" className="SellerIcon" />
          <img src={Dashboard} alt="Icon" className="Dashboard" onClick={() => {
              navigate("/");
            }}  />
          <img
            src={Dashboard}
            alt="Icon"
            className="Dashboard"
            onClick={() => {
              navigate("/optionMain");
            }}
          />
          <img
            src={Dashboard}
            alt="Icon"
            className="Dashboard"
            onClick={() => {
              navigate("/magicOptionMain");
            }}
          />
        </div>
        <div className="IconAction">
          <img src={Account} alt="Icon" className="Account" />
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
    </>
  );
}
