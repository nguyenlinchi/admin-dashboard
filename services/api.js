import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/testapi/', // Trỏ đúng PHP backend
  timeout: 10000, // Thời gian chờ 10 giây
});

export default api;
