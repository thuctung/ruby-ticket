import axios from "axios";
import { SUN_GROUP } from "@/commons/constant";
import { getValidSunworldToken } from "@/helpers/getTokenSun";

const sunWorldApi = axios.create({
  baseURL: SUN_GROUP.serviceURL,
  timeout: 500000,
  headers: {
    "swg-subscription-key": SUN_GROUP.swgSubscriptionKey,
    "Content-Type": "application/json",
  },
});

sunWorldApi.interceptors.request.use(async (config) => {
  const token = await getValidSunworldToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default sunWorldApi;
