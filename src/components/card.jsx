import React from "react";
import { deleteUser } from "../services/api";

export default function Card({ user, userRole, handleDelete, handleGo }) {
  console.log("Card props:", { user, userRole, handleDeleteType: typeof handleDelete });

  const handleDeleteClick = async (e) => {
    e.stopPropagation();
    console.log("handleDeleteClick invoked for user:", user);

    const userId = user?.id;
    console.log("Computed userId:", userId);

    if (!userId) {
      console.error("No user id disponible, no se puede eliminar");
      alert("ID de usuario inválido");
      return;
    }

    const confirmed = window.confirm(`¿Eliminar usuario ${user.nombre}?`);
    if (!confirmed) {
      console.log("Eliminación cancelada por usuario");
      return;
    }

    try {
      console.log("[Card] llamando a deleteUser:", userId);
      const result = await deleteUser(userId);
      console.log("[Card] deleteUser result:", result);
      if (typeof handleDelete === "function") {
        handleDelete(userId);
      } else {
        console.warn("handleDelete no es función:", typeof handleDelete);
      }
    } catch (err) {
      console.error("Error eliminando usuario:", err);
      alert(err.message || "Error al eliminar usuario");
    }
  };

  return (
    <div className="border rounded-xl shadow-md p-4 text-center relative bg-white hover:shadow-lg transition">
      {userRole === "admin" && (
        <button
          type="button"
          onClick={handleDeleteClick}
          data-user-id={user?.id}
          className="absolute top-1 right-2 text-red-500 font-bold text-lg hover:text-red-700"
        >
          ×
        </button>
      )}

      <img
        src={user.img || "/logo.png"}
        alt={user.nombre}
        className="w-full h-32 object-contain mb-3"
      />

      <h3 className="text-lg font-semibold capitalize">{user.nombre}</h3>

      <p className="text-sm text-gray-700 mt-1">
        <span className="font-semibold">PW:</span>{" "}
        {user.pw && user.pw.trim() !== "" ? user.pw : "No asignado"}
      </p>

      <button
        type="button"
        onClick={() => handleGo(user)}
        className="mt-3 bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700 transition"
      >
        Ir
      </button>
    </div>
  );
}
