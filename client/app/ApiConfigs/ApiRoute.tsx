import axios from 'axios';

const api = axios.create({
  baseURL: 'https://c1d9-217-61-170-202.ngrok-free.app/',
});

export default api;