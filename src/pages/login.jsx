import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/navBar";
import Footer from "../components/footer";

const Login = ({ setUserRole }) => {
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    // Si viene un token desde Microsoft en la URLguardarlo
    const params = new URLSearchParams(window.location.search);
    const tokenFromMicrosoft = params.get("token");

    if (tokenFromMicrosoft) {
      localStorage.setItem("token", tokenFromMicrosoft);
      try {
        const tokenParts = tokenFromMicrosoft.split(".");
        const payload = JSON.parse(atob(tokenParts[1]));
        setUserRole(payload.rol || "user");
        localStorage.setItem("userRole", payload.rol || "user");
        navigate("/home");
      } catch (err) {
        console.error("Error procesando token de Microsoft:", err);
        localStorage.removeItem("token");
      }
    } else if (token) {
      // Si ya hay un token local, navegar directamente
      try {
        const tokenParts = token.split(".");
        const payload = JSON.parse(atob(tokenParts[1]));
        setUserRole(payload.rol);
        localStorage.setItem("userRole", payload.rol);
        if (window.location.pathname === "/login") {
          navigate("/home");
        }
      } catch (err) {
        console.error("Token inválido:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
      }
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!pw || !password) {
      setError("PW y contraseña son obligatorios");
      return;
    }

    try {
      const res = await fetch("http://192.168.1.239:4000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pw, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error en el login");

      if (data.mustChangePassword) {
        setError(data.message);
        return;
      }

      localStorage.setItem("token", data.token);
      const tokenParts = data.token.split(".");
      const payload = JSON.parse(atob(tokenParts[1]));
      const role = payload.rol;
      localStorage.setItem("userRole", role);
      setUserRole(role);

      navigate("/home");
    } catch (err) {
      console.error("Error en login:", err);
      setError(err.message || "Error al iniciar sesión");
    }
  };

  const handleMicrosoftLogin = () => {
   window.location.href = `${import.meta.env.VITE_API_URL || "http://192.168.1.239:4000"}/api/auth/microsoft/login`;

  };

  return (
    <>
      {token && <NavBar />}

      <section className="text-gray-600 body-font bg-bgb min-h-screen flex items-center justify-center">
        <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
          <div className="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
            <h1 className="title-font font-medium text-3xl text-black">
              Bienvenido al gestor de contraseñas MediaMakers
            </h1>
            <p className="leading-relaxed mt-4 text-gray-900">
              Inicia sesión para acceder a tu panel.
            </p>
          </div>

          <div className="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 shadow-lg">
            <h2 className="text-gray-900 text-lg font-medium title-font mb-5">
              Iniciar sesión
            </h2>

            <div className="relative mb-4">
              <label htmlFor="pw" className="leading-7 text-sm text-gray-600">
                PW
              </label>
              <input
                type="text"
                id="pw"
                name="pw"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>

            <div className="relative mb-4">
              <label htmlFor="password" className="leading-7 text-sm text-gray-600">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>

            {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

            <button
              onClick={handleLogin}
              className="text-white bg-red-700 border-0 py-2 px-8 focus:outline-none hover:bg-red-800 rounded text-lg mb-3"
            >
              Entrar
            </button>

            <button
              onClick={handleMicrosoftLogin}
              className="text-white bg-blue-700 border-0 py-2 px-8 focus:outline-none hover:bg-blue-800 rounded text-lg"
            >
              Iniciar con Microsoft
            </button>

            <p className="text-xs text-gray-500 mt-3">
              Prueba con:
              <span className="block">PW / y tu cédula</span>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Login;
