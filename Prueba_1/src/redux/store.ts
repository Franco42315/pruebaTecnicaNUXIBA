import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './userSlice';
import postsSlice from './postSlice';

/**
 * Store principal de Redux con los reducers combinados.
 * Configura automáticamente Redux DevTools.
 */
export const store = configureStore({
  reducer: {
    users: usersReducer, // Maneja estado de usuarios
    posts: postsSlice,   // Maneja estado de posts
  },
});

// Tipos para TypeScript
export type RootState = ReturnType<typeof store.getState>; // Tipo del estado global
export type AppDispatch = typeof store.dispatch;           // Tipo del dispatch