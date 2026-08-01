import axios from "axios";
import { SUN_GROUP } from "@/commons/constant";
import { LOCAL_SUN_TOKEN } from "@/commons/constant"; // key localStorage, đảm bảo trùng với "sun_access_token"
import { getValidSunworldToken } from "@/helpers/getTokenSun";

const sunApi = axios.create({
  baseURL: SUN_GROUP.serviceURL,
  timeout: 500000,
  headers: {
    "swg-subscription-key": SUN_GROUP.swgSubscriptionKey,
    "Content-Type": "application/json",
  },
});

// sunApi.interceptors.request.use(async (config) => {
//   const token = await getValidSunworldToken();
//   // const cover
//   //   ?.replace(/\r?\n|\r/g, "")
//   //   .trim();
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// ==== Cơ chế chống gọi login nhiều lần song song ====
let isRefreshing = false;
let refreshSubscribers: Array<(token: string | null) => void> = [];

const subscribeTokenRefresh = (cb: (token: string | null) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string | null) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

// sunApi.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // Chỉ xử lý khi lỗi 401 và request này chưa từng được retry
//     if (
//       (error.response?.status === 401 || error.response?.status === 401) &&
//       !originalRequest?._retry
//     ) {
//       originalRequest._retry = true;

//       if (!isRefreshing) {
//         isRefreshing = true;
//         try {
//           await loginSunSystem(); // gọi lại API login, hàm này tự lưu token mới vào localStorage
//           const newToken = localStorage
//             .getItem(LOCAL_SUN_TOKEN)
//             ?.replace(/\r?\n|\r/g, "")
//             .trim();

//           isRefreshing = false;
//           onRefreshed(newToken ?? null);
//         } catch (loginError) {
//           isRefreshing = false;
//           onRefreshed(null);
//           return Promise.reject(loginError);
//         }
//       }

//       // Đợi login xong rồi retry lại request gốc với token mới
//       return new Promise((resolve, reject) => {
//         subscribeTokenRefresh((token) => {
//           if (token) {
//             originalRequest.headers.Authorization = `Bearer ${token}`;
//             resolve(sunApi(originalRequest));
//           } else {
//             reject(error);
//           }
//         });
//       });
//     }

//     return Promise.reject(error);
//   }
// );

export default sunApi;
