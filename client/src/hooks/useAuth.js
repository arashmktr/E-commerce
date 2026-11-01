import { useContext } from 'react';
import { AuthContext } from '../features/auth/AuthContext.jsx';

export const useAuth = () => useContext(AuthContext);
