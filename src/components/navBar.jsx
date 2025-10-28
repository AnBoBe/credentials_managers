import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const NavBar = ({ userRole, setUserRole }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage = location.pathname === "/login";

  const handleLogout = () => {
    setUserRole(null);
    navigate("/login");
  };

  return (
    <header className="text-gray-600 body-font bg-red-700">
      <div className="container mx-auto flex flex-wrap p-8 flex-col md:flex-row items-center">
        <a
          href={userRole ? "/home" : "/login"}
          className="flex title-font font-medium items-center text-gray-900 mb-3 md:mb-0"
        >
          <span className="text-2xl text-white font-serif italic">
            MediaMakers
          </span>
        </a>

        {!isLoginPage && userRole && (
          <div className="ml-auto flex items-center space-x-4">
            <span className="text-white italic">
              Rol:{" "}
              <span
                className={
                  userRole === "admin" ? "text-gold font-bold" : "text-gray-300"
                }
              >
                {userRole}
              </span>
            </span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center text-white bg-red-500 border-0 py-2 px-5 focus:outline-none hover:bg-red-600 rounded transition-all"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;
