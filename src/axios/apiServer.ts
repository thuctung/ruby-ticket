import axios from "axios";

const apiServer = axios.create({
  baseURL: process.env.APP_URL,
  timeout: 10000,
});

export default apiServer;
