import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

/**
 * Componente que muestra una sección de publicaciones con sus comentarios.
 * 
 * Obtiene las publicaciones del estado global de Redux y las renderiza.
 * Si no hay publicaciones, muestra un mensaje indicando que no hay contenido.
 * 
 * @component
 * @returns {JSX.Element} - Sección de publicaciones con comentarios
 */
export default function PostsSection() {
  // Obtener las publicaciones del estado de Redux
  const { posts } = useSelector((state: RootState) => state.posts);

  // Mostrar mensaje si no hay publicaciones
  if (!posts.length) return <p className="text-center">No hay publicaciones</p>;

  return (
    <div className="space-y-4 mt-4">
      {posts.map((post) => (
        <div key={post.id} className="border p-4 rounded-xl shadow">
          {/* Encabezado de la publicación */}
          <h3 className="text-lg font-semibold">{post.title}</h3>
          <p className="mb-2">{post.body}</p>

          {/* Sección de comentarios */}
          <h4 className="font-bold mt-2">Comentarios:</h4>
          <ul className="list-disc ml-6 text-sm">
            {post.comments?.map((comment) => (
              <li key={comment.id}>
                <strong>{comment.name}:</strong> {comment.body}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}