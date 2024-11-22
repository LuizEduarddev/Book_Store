import axios from 'axios';

const api = axios.create({
  baseURL: 'https://c69e-193-204-167-169.ngrok-free.app/playground/',
});

export default api;