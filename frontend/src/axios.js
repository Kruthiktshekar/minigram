import axios from "axios";

export const axiosApi = axios.create({
    baseURL: 'https://minigram-api.onrender.com/api'
  });

