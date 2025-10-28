import React, { useState } from "react";
import NavBar from "../components/navBar";
import Footer from "../components/footer";
import Card from "../components/card";
import mmlogo from "../assets/mmlogo.jpg";

const Home = ({ userRole, setUserRole }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([
    { id: 1, name: "Juan Pérez", pw: "111", img: mmlogo },
    { id: 2, name: "María Gómez", pw: "222", img: mmlogo },
    { id: 3, name: "Carlos López", pw: "333", img: mmlogo },
    { id: 4, name: "Ana Torres", pw: "444", img: mmlogo },
  ]);

  // Filtrado por nombre o contraseña
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.pw.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Eliminar usuario (solo admin)
  const handleDelete = (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este usuario?")) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  // Acciones de ejemplo
  const handleGo = (user) => {
    alert(`Ir al usuario: ${user.name}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-darkgray">
      <NavBar userRole={userRole} setUserRole={setUserRole} />

      <main className="flex-grow flex flex-col items-center justify-center text-black px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Bienvenido al gestor de contraseñas
        </h1>

        <div className="mb-8 w-full max-w-md">
          <input
            type="text"
            placeholder="Buscar por nombre o PW..."
            className="w-full px-4 py-2 rounded-lg border border-gray-400 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <section className="text-gray-600 body-font bg-gray-100 border border-gray-300 rounded-2xl shadow-md w-full max-w-6xl p-8">
          <div className="container mx-auto">
            <div className="flex flex-wrap -m-4 justify-center">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <Card
                    key={user.id}
                    user={user}
                    userRole={userRole}
                    handleDelete={handleDelete}
                    handleGo={handleGo}
                  />
                ))
              ) : (
                <p className="text-center text-gray-500 w-full">
                  No se encontraron usuarios.
                </p>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
