import axios from "axios";

export const axiosApi = axios.create({
    baseURL: 'mingram-api.vercel.app'

  });