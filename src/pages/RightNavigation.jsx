import React, { useEffect, useState } from "react";
import {
  StyleNavightion,
} from "../style/containers/AnimatedTable";
import Favicon from "../assets/Images/favicon.png";
import Dashboard from "../assets/Images/space_dashboard.png";
import Account from "../assets/Images/account_circle.png";
import Logout from "../assets/Images/logout.png";
import {
  signout,
} from "../service/stellarApi";

export default function RightNavigation() {
  return (
    <>
      <StyleNavightion>
        <div className="IconAction">
          <img src={Favicon} alt="Icon" className="SellerIcon"/>
          <img src={Dashboard} alt="Icon" className="Dashboard"/>
        </div>
        <div className="IconAction">
          <img src={Account} alt="Icon" className="Account"/>
          <img src={Logout} alt="Icon" className="Logout" 
            onClick={() => {
              signout()
              sessionStorage.removeItem("token")
              navigate('/signin')
            }}/>
        </div>
      </StyleNavightion>
    </>
  );
}
