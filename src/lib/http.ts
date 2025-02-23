import axios from "axios";

const http = axios.create({
  baseURL: "https://carbo.kaizerpwn.dev/api",
  withCredentials: true,
});

export default http;
