// ─────────────────────────────────────────────────────────
//  Auth Context — Global authentication state
// ─────────────────────────────────────────────────────────

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

/**
 * AuthProvider wraps the app and provides:
 *  - user: current user object (or null)
 *  - token: JWT string (or null)
 *  - login(token, user): save credentials
 *  - logout(): clear credentials
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Load token & user from localStorage on first render
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Save credentials to state + localStorage
  const login = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  // Clear credentials from state + localStorage
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook for consuming auth context
 */
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
