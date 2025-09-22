import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useRef,
  useEffect,
} from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openAlerts, setOpenAlerts] = useState(false);
  const [loading, setLoading] = useState(false);
  return (
    <UserContext.Provider
      value={{
        userDetails,
        setUserDetails,
        selectedDate,
        setSelectedDate,
        searchTerm,
        setSearchTerm,
        openAlerts,
        setOpenAlerts,
        loading,
        setLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
