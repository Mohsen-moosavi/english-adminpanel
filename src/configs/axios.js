import axios from "axios";
import environment from "./../constant/environment";

export const appJsonPostApi = axios.create({
    baseURL: environment.BASE_API_URL,
    withCredentials : true,
    headers: {
      'Content-Type': 'application/json',
    },
  });
