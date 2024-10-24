import axios from "axios";

export const axiosApi = axios.create({
    baseURL: 'minigram-api.vercel.app/api'
  });

