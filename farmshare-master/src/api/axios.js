import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true // 🔥 REQUIRED for cookies
});


export default api;
