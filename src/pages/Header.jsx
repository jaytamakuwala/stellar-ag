import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toggleTheme } from "../redux/actions/themeAction";

export default function Header() {
  const [theamColor, setTheamColor] = useState("");
  const dispatch = useDispatch()
  const handleColorSelection = (event) => {
    setTheamColor(`${event.target.value}`);
    dispatch(toggleTheme(event.target.value))
    document.body.className = event.target.value;
  };
  useEffect(() => {
    setTheamColor("Dark_Mode");
    dispatch(toggleTheme("Dark_Mode"))
    document.body.className = "Dark_Mode";
  }, []);

  return (
    <>
      <select
        id="options"
        value={theamColor}
        onChange={handleColorSelection}
        className="OptionSelection"
        style={{display:"none"}}
      >
        <option value="Light_Mode">Light Mode</option>
        <option value="Dark_Mode">Dark Mode</option>
      </select>
    </>
  );
}
