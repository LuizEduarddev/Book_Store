import axios from 'axios';

const api = axios.create({
  baseURL: 'https://9fd5-193-204-167-169.ngrok-free.app/playground/',
});

export default api;