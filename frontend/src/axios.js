import axios from "axios";

export const axiosApi = axios.create({
    baseURL: 'https://mini-blog-app-api.onrender.com/api'
  });

