import axios from 'axios';

const api = axios.create({
  baseURL: 'https://a7b7-217-61-170-202.ngrok-free.app/playground/',
});

export default api;