import axios from "axios";

export const axiosApi = axios.create({
    baseURL: 'https://mingram-api.vercel.app/api'
  });

