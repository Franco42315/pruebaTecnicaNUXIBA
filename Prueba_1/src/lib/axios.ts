import axios from 'axios';

/**
 * Instancia preconfigurada de Axios para la API de JSONPlaceholder.
 * 
 * Define la URL base para todas las solicitudes, evitando repetirla en cada llamada.
 * 
 * @constant
 * @type {AxiosInstance}
 * 
 * @example
 * // Uso en servicios:
 * import api from './lib/axios';
 * 
 * // Obtener usuarios
 * const fetchUsers = async () => {
 *   const response = await api.get('/users');
 *   return response.data;
 * }
 */
const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com" // URL base de la API
});

export default api;