import axios from "axios";
import { SUN_GROUP } from "@/commons/constant";
import { SUN_PROXY_GET_DATA } from "@/commons/outApiURL";

const sunApi = axios.create({
  baseURL: SUN_PROXY_GET_DATA,
  timeout: 10000,
  headers: {
    "swg-subscription-key": SUN_GROUP.swgSubscriptionKey,
    "Content-Type": "application/json",
  },
});

sunApi.interceptors.request.use((config) => {
  const token = localStorage
    .getItem("sun_access_token")
    ?.replace(/\r?\n|\r/g, "")
    .trim();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers.Cookie = `JSESSIONID=4498CB558AFD7BBD752A12EB6616DB01`;
  }
  return config;
});

sunApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log("Token hết hạn");
    }

    return Promise.reject(error);
  }
);

export default sunApi;
