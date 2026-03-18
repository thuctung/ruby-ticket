import api from "@/axios";
import { GET_HOME_HIGHLIGHTS } from "@/commons/apiURL";
import { get } from "lodash";


export const getHomeHighlights = async (limit = 9) => {
  try {
    const res = await api.get(`${GET_HOME_HIGHLIGHTS}?limit=${limit}`);
    return get(res, ["data", "data"], []) || [];
  } catch {
    return [];
  }
};

