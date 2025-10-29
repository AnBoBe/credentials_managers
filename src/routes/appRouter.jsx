import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/login";
import Home from "../pages/home";
import Credentials from "../pages/credentials";

const AppRouter = ({ userRole, setUserRole }) => {
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  return (
    <Routes>
      {/* Login */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/home" replace />
          ) : (
            <Login setUserRole={setUserRole} />
          )
        }
      />

      {/* Home protegida */}
      <Route
        path="/home"
        element={
          isAuthenticated ? (
            <Home userRole={userRole} setUserRole={setUserRole} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Credenciales protegidas */}
      <Route
        path="/credentials/:id"
        element={
          isAuthenticated ? (
            <Credentials userRole={userRole} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Cualquier otra ruta redirige al login */}
      <Route path="/*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRouter;
