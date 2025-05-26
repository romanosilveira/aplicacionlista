// src/components/PrivateRoute.jsx
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';  // Ajusta ruta si es necesario
import { Navigate } from 'react-router-dom';

export function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
}
