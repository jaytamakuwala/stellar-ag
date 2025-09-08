import React, { createContext, useState } from "react";
import { getCurrentUSADate } from "../utils/common";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState({});
  const [selectedDate, setSelectedDate] = useState(() => getCurrentUSADate());

  return (
    <UserContext.Provider value={{ userDetails, setUserDetails ,selectedDate, setSelectedDate}}>
      {children}
    </UserContext.Provider>
  );
};
