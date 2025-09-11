import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useRef,
  useEffect
} from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  return (
    <UserContext.Provider
      value={{
        userDetails,
        setUserDetails,
        selectedDate,
        setSelectedDate,
        searchTerm,
        setSearchTerm,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
