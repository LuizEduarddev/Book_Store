import axios from 'axios';

const api = axios.create({
  baseURL: 'https://af53-217-61-170-202.ngrok-free.app/playground/',
});

export default api;