import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <UserContext.Provider value={{ userDetails, setUserDetails ,selectedDate, setSelectedDate}}>
      {children}
    </UserContext.Provider>
  );
};
