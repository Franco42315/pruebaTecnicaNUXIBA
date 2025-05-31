import api from "../lib/axios";
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Post, Comment, Todo } from "../types";

// Acciones para usuarios -----------------------------------------------------

/**
 * Obtiene todos los usuarios desde la API.
 * @returns {Promise<User[]>} Lista de usuarios
 * 
 * @example dispatch(getAllUsers());
 */
export const getAllUsers = createAsyncThunk(
  'users/getAll',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);

// Acciones para posts y comentarios ------------------------------------------

/**
 * Obtiene los posts de un usuario con sus comentarios asociados.
 * 
 * @param {number} userId - ID del usuario
 * @returns {Promise<Post[]>} Posts con comentarios incluidos
 * 
 * @example dispatch(fetchPostsWithComments(1));
 */
export const fetchPostsWithComments = createAsyncThunk<
  Post[],
  number,
  { rejectValue: string }
>(
  "posts/fetchPostsWithComments",
  async (userId, thunkAPI) => {
    try {
      // 1. Obtener posts del usuario
      const { data: posts } = await api.get<Post[]>(`/users/${userId}/posts`);

      // 2. Obtener comentarios para cada post en paralelo
      const postsWithComments = await Promise.all(
        posts.map(async (post) => {
          try {
            const { data: comments } = await api.get<Comment[]>(
              `/posts/${post.id}/comments`
            );
            return { ...post, comments };
          } catch {
            // Fallback: Post sin comentarios
            return { ...post, comments: [] };
          }
        })
      );

      return postsWithComments;
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(getErrorMessage(err));
    }
  }
);

// Acciones para tareas (todos) ----------------------------------------------

/**
 * Obtiene las tareas de un usuario ordenadas por ID descendente.
 * 
 * @param {number} userId - ID del usuario
 * @returns {Promise<Todo[]>} Lista de tareas ordenadas
 */
export const fetchTodosByUser = createAsyncThunk<
  Todo[],
  number,
  { rejectValue: string }
>(
  "todos/fetchByUser",  // Corregido el tipo de acción
  async (userId, thunkAPI) => {
    try {
      const { data: todos } = await api.get<Todo[]>(`/users/${userId}/todos`);
      // Ordenar por ID descendente
      return todos.slice().sort((a, b) => b.id - a.id);
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(getErrorMessage(err));
    }
  }
);

/**
 * Crea una nueva tarea para un usuario.
 * 
 * @param {Object} payload - Datos para crear la tarea
 * @param {number} payload.userId - ID del usuario
 * @param {string} payload.title - Título de la tarea
 * @param {boolean} payload.completed - Estado de completado
 * @returns {Promise<Todo>} Tarea creada
 */
export const createTodoForUser = createAsyncThunk<
  Todo,
  { userId: number; title: string; completed: boolean },
  { rejectValue: string }
>(
  "todos/createForUser",  // Corregido el tipo de acción
  async (payload, thunkAPI) => {
    const { userId, title, completed } = payload;
    try {
      const { data: newTodo } = await api.post<Todo>(`/todos`, {
        userId,
        title,
        completed,
      });
      return newTodo;
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(getErrorMessage(err));
    }
  }
);

// Utilidad para manejo de errores --------------------------------------------

/**
 * Extrae el mensaje de error de una excepción
 * @param {unknown} err - Error capturado
 * @returns {string} Mensaje de error
 */
function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Unknown error";
}