import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/login";
import Home from "../pages/home.jsx";

const AppRouter = ({ userRole, setUserRole }) => {
  const isAuthenticated = !!userRole;

  return (
    <Routes>
      <Route path="/login" element={<Login setUserRole={setUserRole} />} />
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
      <Route path="/*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRouter;
