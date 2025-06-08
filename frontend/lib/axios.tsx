import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8080/api',
  withCredentials: true, // if using cookies
});

export default instance;
