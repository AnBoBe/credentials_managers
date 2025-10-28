import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/navBar";
import Footer from "../components/footer";

const Login = ({ setUserRole }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Simulación de login
    if (email === "7418" && password === "1001652077") {
      setUserRole("admin");
      navigate("/home");
    } else if (email === "7418" && password === "123") {
      setUserRole("user");
      navigate("/home");
    } else {
      alert("Credenciales incorrectas. Intenta de nuevo.");
    }
  };

  return (
    <>
      <NavBar />
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
              <label
                htmlFor="email"
                className="leading-7 text-sm text-gray-600"
              >
                PW
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>

            <div className="relative mb-4">
              <label
                htmlFor="password"
                className="leading-7 text-sm text-gray-600"
              >
                Cedula
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

            <button
              onClick={handleLogin}
              className="text-white bg-red-700 border-0 py-2 px-8 focus:outline-none hover:bg-red-800 rounded text-lg"
            >
              Entrar
            </button>

            <p className="text-xs text-gray-500 mt-3">
              Prueba con:  
              <span className="block">
                admin@mediamakers.com / admin123
              </span>
              <span className="block">
                user@mediamakers.com / user123
              </span>
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Login;
