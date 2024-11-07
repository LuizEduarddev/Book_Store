import axios from 'axios';

const api = axios.create({
  baseURL: 'https://46ad-193-204-167-170.ngrok-free.app/playground/',
});

export default api;