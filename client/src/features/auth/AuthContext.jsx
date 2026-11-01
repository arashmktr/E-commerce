import { createContext, useEffect, useMemo, useState } from 'react';
import { loginUser, logoutUser, refreshSession, registerUser } from '../../api/auth.js';
import { setAccessToken } from '../../api/client.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // با باز شدن سایت، اگر کوکی refresh معتبر باشد کاربر دوباره وارد می‌شود.
  useEffect(() => {
    refreshSession()
      .then((session) => startSession(session))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const startSession = ({ user: loggedInUser, accessToken }) => {
    setAccessToken(accessToken);
    setUser(loggedInUser);
  };

  const login = async (credentials) => startSession(await loginUser(credentials));

  const register = async (details) => startSession(await registerUser(details));

  const logout = async () => {
    await logoutUser().catch(() => {});
    setAccessToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
