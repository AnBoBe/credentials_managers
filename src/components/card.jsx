import React from "react";

export default function Card({ user, userRole, handleDelete, handleGo }) {
  // Confirmar y eliminar usuario
  const handleDeleteClick = async () => {
    if (!confirm(`¿Eliminar usuario ${user.nombre}?`)) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/user/${user.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (handleDelete) handleDelete(user.id);
    } catch (err) {
      console.error("Error eliminando usuario:", err);
      alert("Error al eliminar usuario");
    }
  };

  return (
    <div className="border rounded-xl shadow-md p-4 text-center relative bg-white hover:shadow-lg transition">
      {userRole === "admin" && (
        <button
          onClick={handleDeleteClick}
          className="absolute top-1 right-2 text-red-500 font-bold text-lg hover:text-red-700"
        >
          ×
        </button>
      )}

      {/* Imagen */}
      <img
        src={user.img || "/logo.png"}
        alt={user.nombre}
        className="w-full h-32 object-contain mb-3"
      />

      {/* Nombre */}
      <h3 className="text-lg font-semibold capitalize">{user.nombre}</h3>

      {/* Campo PW */}
      <p className="text-sm text-gray-700 mt-1">
        <span className="font-semibold">PW:</span>{" "}
        {user.pw && user.pw.trim() !== "" ? user.pw : "No asignado"}
      </p>

      {/* Botón Ir */}
      <button
        onClick={() => handleGo(user)}
        className="mt-3 bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700 transition"
      >
        Ir
      </button>
    </div>
  );
}
