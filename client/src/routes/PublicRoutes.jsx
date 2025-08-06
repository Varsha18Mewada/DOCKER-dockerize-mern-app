import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../pages/login/Login';
import { Register } from '../pages/register/Register';
import { useSelector } from 'react-redux';

export const PublicRoutes = () => {
  const { token } = useSelector((state) => state.auth);
  return (
    <div>
      <Routes>
        <Route
          path="/login"
          element={token ? <Navigate to="/" /> : <Login />}
        />
        <Route path="/signup" element={<Register />} />
      </Routes>
    </div>
  );
};
