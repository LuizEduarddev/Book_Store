import axios from 'axios';

const api = axios.create({
  baseURL: 'https://7595-217-61-170-202.ngrok-free.app/playground/',
});

export default api;