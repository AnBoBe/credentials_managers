import React from "react";

const Card = ({ user, userRole, handleDelete, handleGo }) => (
  <div className="p-4 lg:w-1/4 md:w-1/2">
    <div className="h-full flex flex-col items-center text-center bg-white rounded-xl border border-gray-200 shadow hover:shadow-lg transition-all relative">
      {userRole === "admin" && (
        <button
          onClick={() => handleDelete(user.id)}
          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold"
          title="Eliminar usuario"
        >
          X
        </button>
      )}

      <img
        alt={user.nombre}
        className="flex-shrink-0 rounded-lg w-full h-56 object-cover object-center mb-4 border border-gray-300"
        src={user.img}
      />

      <div className="w-full px-2 pb-4">
        <h2 className="title-font font-medium text-lg text-gray-900">{user.nombre}</h2>
        <h3 className="text-gray-500 mb-3">PW: {user.pw}</h3>

        <div className="flex justify-center gap-3 mt-3">
          <button
            onClick={() => handleGo(user)}
            className="text-white bg-indigo-500 hover:bg-indigo-600 border-0 py-1 px-4 rounded text-sm transition-all"
          >
            Ir
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default Card;
