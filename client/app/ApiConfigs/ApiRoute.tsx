import axios from 'axios';

const api = axios.create({
  baseURL: 'https://d74d-193-204-167-185.ngrok-free.app/playground/',
});

export default api;