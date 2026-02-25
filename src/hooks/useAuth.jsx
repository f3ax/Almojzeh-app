import { useState, useCallback, createContext, useContext } from 'react';
import * as db from '../services/db';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => db.getCurrentUser());

  const login = useCallback((username, password) => {
    const u = db.authenticate(username, password);
    if (u) setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    db.logout();
    setUser(null);
  }, []);

  const updateProfile = useCallback((data) => {
    if (!user) return;
    const updated = db.updateUser(user.id, data);
    setUser(updated);
    localStorage.setItem('almojzeh_currentUser', JSON.stringify(updated));
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, isAdmin: user?.role === 'admin', isEmployee: user?.role === 'employee' || user?.role === 'admin', isCustomer: user?.role === 'customer' }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
