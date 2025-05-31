import React from "react";
import type { User } from "../types";

interface Props {
  user: User;          // Objeto con datos del usuario
  onViewPosts: () => void;  // Handler para ver posts
  onViewTodos: () => void;  // Handler para ver todos
}

/**
 * Componente de tarjeta para mostrar información de usuario con acciones.
 * 
 * Muestra detalles básicos del usuario y botones para ver sus posts y tareas.
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {User} props.user - Datos del usuario a mostrar
 * @param {Function} props.onViewPosts - Callback al hacer clic en "Ver Posts"
 * @param {Function} props.onViewTodos - Callback al hacer clic en "Ver Todos"
 */
const UserCard: React.FC<Props> = ({ user, onViewPosts, onViewTodos }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 mb-4 border border-gray-200">
      {/* Encabezado con nombre del usuario */}
      <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
      
      {/* Detalles del usuario */}
      <p className="text-sm text-gray-600">
        <span className="font-medium">Username:</span> {user.username}
      </p>
      <p className="text-sm text-gray-600">
        <span className="font-medium">Email:</span> {user.email}
      </p>
      <p className="text-sm text-gray-600">
        <span className="font-medium">Phone:</span> {user.phone}
      </p>
      <p className="text-sm text-gray-600">
        <span className="font-medium">Website:</span> {user.website}
      </p>

      {/* Botones de acción */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={onViewPosts}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          aria-label={`Ver posts de ${user.name}`}
        >
          Ver Posts
        </button>
        <button
          onClick={onViewTodos}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          aria-label={`Ver tareas de ${user.name}`}
        >
          Ver Todos
        </button>
      </div>
    </div>
  );
};

export default UserCard;