import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

http.interceptors.request.use(
  (config) => {
    return {
      ...config,
      url: `${http.defaults.baseURL}${config.url}`,
    };
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default http;
