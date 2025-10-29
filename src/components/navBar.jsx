import React from "react";
import { useNavigate } from "react-router-dom";

const NavBar = ({ setUserRole }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Elimina el token y el rol guardados
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");

    // Limpia el estado global de rol
    if (setUserRole) setUserRole("");

    // Redirige al login
    navigate("/login", { replace: true });
  };

  return (
    <nav className="flex justify-between items-center bg-gray-800 text-white px-6 py-3 shadow-md">
      <h1 className="text-lg font-semibold">Panel Principal</h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition-colors"
      >
        Cerrar sesión
      </button>
    </nav>
  );
};

export default NavBar;
