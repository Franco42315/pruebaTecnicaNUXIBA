// App.tsx
import { useEffect } from "react";
import Header from "./components/Header";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./redux/store";
import type { User, Todo } from "./types";
import UserCard from "./components/UserCard";
import {
  clearPosts,
  clearTodos,
} from "./redux/postSlice";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { createTodoForUser, fetchPostsWithComments, fetchTodosByUser, getAllUsers } from "./api/UsersAPI";

/**
 * Componente principal de la aplicación.
 * 
 * Responsabilidades:
 * 1. Cargar y mostrar lista de usuarios
 * 2. Manejar visualización de posts con comentarios
 * 3. Manejar visualización y creación de todos
 * 4. Gestionar estados de carga y error
 * 
 * Utiliza:
 * - Redux para gestión de estado
 * - SweetAlert2 para modales interactivos
 * - Thunks para operaciones asíncronas
 */
function App() {
  // Acceso al store de Redux
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error } = useSelector((state: RootState) => state.users);

  /**
   * Efecto para cargar usuarios al montar el componente
   * Despacha la acción async getAllUsers para obtener los usuarios
   */
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // ---------------------------------------------------
  //  MANEJO DE POSTS
  // ---------------------------------------------------
  
  /**
   * Maneja la visualización de posts con comentarios para un usuario
   * 
   * Flujo:
   * 1. Obtiene posts con comentarios usando fetchPostsWithComments
   * 2. Construye contenido HTML para SweetAlert2
   * 3. Muestra modal con posts y comentarios
   * 4. Limpia estado de posts al cerrar
   * 
   * @param user - Usuario seleccionado
   */
  const handleViewPosts = async (user: User) => {
    try {
      // Obtener posts con comentarios desde API
      const postsData = await dispatch(fetchPostsWithComments(user.id)).unwrap();

      // Construir contenido HTML para el modal
      let htmlContent = `<div style="max-height: 60vh; overflow-y: auto; text-align: left;">`;
      postsData.forEach((post) => {
        htmlContent += `
          <div style="margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid #e5e7eb;">
            <h3 style="font-weight: 600; font-size: 1.125rem; margin-bottom: 0.5rem; color: #111827;">
              ${post.title}
            </h3>
            <p style="margin-bottom: 0.75rem; color: #4b5563;">${post.body}</p>
            <h4 style="font-weight: 500; margin-bottom: 0.25rem; color: #1f2937;">Comentarios:</h4>
            <ul style="margin-left: 1rem; color: #374151; font-size: 0.875rem;">
        `;
        post.comments?.forEach((comment) => {
          htmlContent += `
              <li style="margin-bottom: 0.5rem;">
                <strong style="color: #111827;">${comment.name}:</strong> ${comment.body}
              </li>
          `;
        });
        htmlContent += `
            </ul>
          </div>
        `;
      });
      htmlContent += `</div>`;

      // Mostrar modal con SweetAlert2
      await Swal.fire({
        title: `Publicaciones de ${user.name}`,
        html: htmlContent,
        width: "800px",
        showCloseButton: true,
        focusConfirm: false,
        confirmButtonText: "Cerrar",
      });

      // Limpiar estado de posts
      dispatch(clearPosts());
    } catch (err: unknown) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No se pudieron cargar las publicaciones.",
      });
    }
  };

  // ---------------------------------------------------
  //  MANEJO DE TODOS
  // ---------------------------------------------------
  
  /**
   * Maneja visualización y creación de todos para un usuario
   * 
   * Flujo:
   * 1. Obtiene todos del usuario
   * 2. Muestra lista en modal con opción para agregar
   * 3. Maneja creación de nuevos todos con fusión manual
   * 
   * @param user - Usuario seleccionado
   */
  const handleViewTodos = async (user: User) => {
    // Paso 1: Obtener todos del usuario
    let todosData: Todo[] = [];
    try {
      todosData = await dispatch(fetchTodosByUser(user.id)).unwrap();
    } catch (err: unknown) {
      console.error(err);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar las tareas.",
      });
      return;
    }

    /**
     * Muestra lista de todos en modal
     * @param listToShow - Lista de todos a mostrar
     */
    const showTodosList = async (listToShow: Todo[]) => {
      // Construir HTML para la lista
      let htmlTodos = `<div style="max-height: 60vh; overflow-y: auto; text-align: left;">`;
      listToShow.forEach((todo) => {
        htmlTodos += `
          <div style="border-bottom: 1px solid #e5e7eb; padding: 0.5rem 0;">
            <strong>ID:</strong> ${todo.id} <br/>
            <strong>Título:</strong> ${todo.title} <br/>
            <strong>Completado:</strong> ${todo.completed ? "✅" : "❌"}
          </div>
        `;
      });
      htmlTodos += `</div>`;

      // Mostrar modal con opciones
      const result = await Swal.fire({
        title: `Tareas de ${user.name}`,
        html: htmlTodos,
        width: "600px",
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: "Agregar Tarea",
        cancelButtonText: "Cerrar",
      });

      // Si el usuario quiere agregar tarea
      if (result.isConfirmed) {
        await showCreateTodoForm();
      }
    };

    /**
     * Muestra formulario para crear nuevo todo
     */
    const showCreateTodoForm = async () => {
      const { value: formValues } = await Swal.fire<{
        title: string;
        completed: boolean;
      }>({
        title: "Nueva Tarea",
        html: `
          <input id="swal-input1" class="swal2-input" placeholder="Título de la tarea" />
          <div style="display: flex; align-items: center; justify-content: center; margin-top: 0.5rem;">
            <input id="swal-input2" type="checkbox" style="width: 1rem; height: 1rem; margin-right: 0.5rem;" />
            <label for="swal-input2" style="font-size: 0.9rem;">Completada</label>
          </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Guardar",
        cancelButtonText: "Cancelar",
        preConfirm: () => {
          // Validación de campos
          const titleEl = (document.getElementById("swal-input1") as HTMLInputElement);
          const completedEl = (document.getElementById("swal-input2") as HTMLInputElement);
          const titleValue = titleEl?.value.trim();
          const completedValue = completedEl?.checked;

          if (!titleValue) {
            Swal.showValidationMessage("El título no puede estar vacío");
            return;
          }
          return {
            title: titleValue,
            completed: completedValue,
          };
        },
      });

      if (formValues) {
        // Crear nuevo todo en el servidor
        let newTodo: Todo;
        try {
          newTodo = await dispatch(
            createTodoForUser({
              userId: user.id,
              title: formValues.title,
              completed: formValues.completed,
            })
          ).unwrap();
        } catch (err: unknown) {
          console.error(err);
          await Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo crear la tarea.",
          });
          // Mostrar lista original si falla
          return showTodosList(todosData);
        }

        // Fusión manual: combinar nuevo todo con lista existente
        const combined = [newTodo, ...todosData].sort((a, b) => b.id - a.id);

        // Mostrar lista actualizada
        await showTodosList(combined);
      } else {
        // Si se cancela, mostrar lista original
        await showTodosList(todosData);
      }
    };

    // Mostrar lista inicial
    await showTodosList(todosData);

    // Limpiar estado al finalizar
    dispatch(clearTodos());
  };

  // ---------------------------------------------------
  //  RENDERIZADO PRINCIPAL
  // ---------------------------------------------------
  
  return (
    <>
      <header>
        <Header />
      </header>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Usuarios</h1>

        {/* Estados de carga y error */}
        {loading && <p className="text-center text-gray-500">Cargando usuarios...</p>}
        {error && <p className="text-center text-red-500">Error: {error}</p>}

        {/* Grid responsivo de usuarios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user: User) => (
            <UserCard
              key={user.id}
              user={user}
              onViewPosts={() => handleViewPosts(user)}
              onViewTodos={() => handleViewTodos(user)}
            />
          ))}
        </div>
      </main>
    </>
  );
}

export default App;