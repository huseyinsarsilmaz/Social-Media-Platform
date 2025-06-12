import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_GATEWAY_URL,
  withCredentials: true,
});

export default instance;
