import axios from "axios";

export const axiosApi = axios.create({
    baseURL: 'https://minigram-un5y.onrender.com/api'
  });

