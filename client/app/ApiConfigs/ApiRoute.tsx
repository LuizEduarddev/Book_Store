import axios from 'axios';

const api = axios.create({
  baseURL: 'https://712c-193-204-167-170.ngrok-free.app/playground/',
});

export default api;