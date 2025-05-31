// features/users/usersSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { User } from '../types';
import { getAllUsers } from '../api/UsersAPI';

/**
 * Slice de Redux para manejar el estado de usuarios.
 * Maneja loading/error y sincroniza con peticiones API.
 */
interface UsersState {
  users: User[];        // Listado de usuarios
  loading: boolean;     // Estado de carga
  error: string | null; // Mensaje de error
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default usersSlice.reducer;