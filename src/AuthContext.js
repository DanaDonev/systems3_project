import { createContext, useContext, useState } from "react";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState(null);

  const login = (newToken, userRole, username) => {
    setToken(newToken);
    setRole(userRole);
    setUsername(username);
  };
  const logout = () => {
    setToken(null);
    setRole(null);
    setUsername(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, role, username, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  return useContext(AuthContext);
}
