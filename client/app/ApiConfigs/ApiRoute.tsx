import axios from 'axios';

const api = axios.create({
  baseURL: 'https://bbd5-217-61-170-202.ngrok-free.app/playground/',
});

export default api;