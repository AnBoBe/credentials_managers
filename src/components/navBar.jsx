import React from "react";
import { useNavigate } from "react-router-dom";

const NavBar = ({ setUserRole }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // verifica si el usuario está logueado

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");

    if (setUserRole) setUserRole("");

    navigate("/login", { replace: true });
  };

  return (
    <nav className="flex justify-between items-center bg-gray-800 text-white px-6 py-3 shadow-md">
      <h1
        onClick={() => navigate("/")}
        className="text-lg font-semibold cursor-pointer"
      >
        Panel Principal
      </h1>

      {token && (
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition-colors"
        >
          Cerrar sesión
        </button>
      )}
    </nav>
  );
};

export default NavBar;
