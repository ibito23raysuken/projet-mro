import { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

export function AppProvider({ children }) {
  // State token initialisé depuis localStorage ou null
  const [token, setToken] = useState(() => {
    return localStorage.getItem('Token') || null;
  });

  // State user initialisé depuis localStorage ou null
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('User');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Sync token dans localStorage à chaque changement
  useEffect(() => {
    if (token) {
      localStorage.setItem('Token', token);
    } else {
      localStorage.removeItem('Token');
    }
  }, [token]);

  // Sync user dans localStorage à chaque changement
  useEffect(() => {
    if (user) {
      localStorage.setItem('User', JSON.stringify(user));
    } else {
      localStorage.removeItem('User');
    }
  }, [user]);

  return (
    <AppContext.Provider value={{ token, setToken, user, setUser }}>
      {children}
    </AppContext.Provider>
  );
}
