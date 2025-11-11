import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const tokenFromMicrosoft = params.get("token");

  if (tokenFromMicrosoft) {
    localStorage.setItem("microsoftToken", tokenFromMicrosoft);
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/verify-pw");
    return;
  }

  const savedToken = localStorage.getItem("token");
  if (savedToken) {
    try {
      const [, payloadBase64] = savedToken.split(".");
      const payload = JSON.parse(atob(payloadBase64));

      if (payload.exp * 1000 > Date.now()) {
        // token válido → reenviamos al home
        navigate("/home");
      } else {
        // token expirado → limpiamos
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
      }
    } catch {
      // token corrupto → limpiamos
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
    }
  }
}, [navigate]);

  const handleMicrosoftLogin = () => {
    const backend = import.meta.env.VITE_API_URL || "http://192.168.1.239:4000";
    window.location.href = `${backend}/api/auth/microsoft/login`;
  };

  return (
    <>
      <section className="text-gray-600 body-font bg-bgb min-h-screen flex items-center justify-center">
        <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
          <div className="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
            <h1 className="title-font font-medium text-3xl text-black">
              Bienvenido al gestor de contraseñas MediaMakers
            </h1>
            <p className="leading-relaxed mt-4 text-gray-900">
              Inicia sesión con tu cuenta Microsoft para continuar.
            </p>
          </div>

          <div className="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 shadow-lg">
            <h2 className="text-gray-900 text-lg font-medium title-font mb-5">
              Iniciar sesión
            </h2>

            <button
              onClick={handleMicrosoftLogin}
              className="text-white bg-blue-700 border-0 py-2 px-8 focus:outline-none hover:bg-blue-800 rounded text-lg"
            >
              Iniciar con Microsoft
            </button>

            <p className="text-xs text-gray-500 mt-3">
              El único método de autenticación admitido es Microsoft.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Login;
