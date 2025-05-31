// redux/postSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { Post, Todo } from "../types";
import { createTodoForUser, fetchPostsWithComments, fetchTodosByUser } from "../api/UsersAPI";

/**
 * Estado inicial para el slice de posts y todos.
 * 
 * Define tres áreas independientes con sus estados de carga y errores:
 * 1. Posts con comentarios
 * 2. Lista de todos (tareas)
 * 3. Creación de nuevos todos
 */
interface PostsState {
  // Área de posts + comentarios
  posts: Post[];
  isLoadingPosts: boolean;
  errorPosts: string | null;

  // Área de todos (tareas)
  todos: Todo[];
  isLoadingTodos: boolean;
  errorTodos: string | null;

  // Área de creación de nuevos todos
  isLoadingCreateTodo: boolean;
  errorCreateTodo: string | null;
}

const initialState: PostsState = {
  posts: [],
  isLoadingPosts: false,
  errorPosts: null,

  todos: [],
  isLoadingTodos: false,
  errorTodos: null,

  isLoadingCreateTodo: false,
  errorCreateTodo: null,
};

/**
 * Slice de Redux para manejar:
 * - Posts con sus comentarios
 * - Lista de todos (tareas)
 * - Creación de nuevos todos
 * 
 * Incluye acciones para limpiar el estado de posts y todos.
 * Maneja los estados pendiente/éxito/fallo de las acciones asíncronas.
 */
const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    /** 
     * Limpia el estado de posts y reinicia sus flags de carga/error.
     * Útil al cambiar de usuario o cerrar modales.
     */
    clearPosts: (state) => {
      state.posts = [];
      state.isLoadingPosts = false;
      state.errorPosts = null;
    },
    
    /** 
     * Limpia el estado de todos y reinicia sus flags de carga/error.
     * Incluye también el estado de creación de nuevos todos.
     */
    clearTodos: (state) => {
      state.todos = [];
      state.isLoadingTodos = false;
      state.errorTodos = null;
      state.isLoadingCreateTodo = false;
      state.errorCreateTodo = null;
    },
  },
  extraReducers: (builder) => {
    // === Manejadores para fetchPostsWithComments ===
    builder
      .addCase(fetchPostsWithComments.pending, (state) => {
        state.isLoadingPosts = true;
        state.errorPosts = null;
      })
      .addCase(fetchPostsWithComments.fulfilled, (state, action) => {
        state.isLoadingPosts = false;
        state.posts = action.payload;  // Almacena posts con comentarios
      })
      .addCase(fetchPostsWithComments.rejected, (state, action) => {
        state.isLoadingPosts = false;
        state.errorPosts = action.payload || "Error al cargar publicaciones";
      });

    // === Manejadores para fetchTodosByUser ===
    builder
      .addCase(fetchTodosByUser.pending, (state) => {
        state.isLoadingTodos = true;
        state.errorTodos = null;
      })
      .addCase(fetchTodosByUser.fulfilled, (state, action) => {
        state.isLoadingTodos = false;
        state.todos = action.payload;  // Almacena todos ordenados
      })
      .addCase(fetchTodosByUser.rejected, (state, action) => {
        state.isLoadingTodos = false;
        state.errorTodos = action.payload || "Error al cargar tareas";
      });

    // === Manejadores para createTodoForUser ===
    builder
      .addCase(createTodoForUser.pending, (state) => {
        state.isLoadingCreateTodo = true;
        state.errorCreateTodo = null;
      })
      .addCase(createTodoForUser.fulfilled, (state, action) => {
        state.isLoadingCreateTodo = false;
        // Agrega el nuevo todo y reordena por ID descendente
        state.todos = [action.payload, ...state.todos].sort((a, b) => b.id - a.id);
      })
      .addCase(createTodoForUser.rejected, (state, action) => {
        state.isLoadingCreateTodo = false;
        state.errorCreateTodo = action.payload || "Error al crear tarea";
      });
  },
});

// Exportar acciones y reducer
export const { clearPosts, clearTodos } = postsSlice.actions;
export default postsSlice.reducer;