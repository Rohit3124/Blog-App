import { useState, useContext, createContext } from "react";
export const userDataContext = createContext();

const UserContext = ({ children }) => {
  const [user, setUser] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  return (
    <userDataContext.Provider
      value={{ user, setUser, isLoading, setIsLoading }}
    >
      {children}
    </userDataContext.Provider>
  );
};

export default UserContext;
