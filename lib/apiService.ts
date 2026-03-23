import axios from "axios";
import type { AxiosResponse } from "axios";
import { getToken, logout } from "./utils/helper";
import { TOAST } from "./utils/toastMessage";


type RequestMethod = "get" | "post" | "put" | "patch" | "delete";

interface RequestData {
  [key: string]: any;
}

const makeRequest = async (method: RequestMethod, url: string, data: RequestData = {}) => {
  try {
    const token = getToken();
    const response = await axios({
      method,
      url,
      data,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response?.data || response;
  } catch (error: any) {
    if (
      error?.response?.status === 401 ||
      error?.response?.data?.code === "UNAUTHENTICATED" ||
      error?.response?.data?.message === "UNAUTHENTICATED"
    ) {
      logout();
    }
    const errorMessage = error?.response?.data?.message || "Something Went Wrong..!";
    TOAST("error", errorMessage);
    return (
      error?.response?.data || {
        code: "ERROR",
        message: "Request failed",
      }
    );
  }
};

export const getRequest = (url: string, data?: RequestData): Promise<any> => {
  return makeRequest("get", url, data);
};

export const postRequest = (url: string, data?: RequestData): Promise<any> => {
  return makeRequest("post", url, data);
};

export const putRequest = (url: string, data?: RequestData): Promise<any> => {
  return makeRequest("put", url, data);
};

export const patchRequest = (url: string, data?: RequestData): Promise<any> => {
  return makeRequest("patch", url, data);
};

export const deleteRequest = (url: string, data?: RequestData): Promise<any> => {
  return makeRequest("delete", url, data);
};

export const multiPartRequest = async (url: string, data: FormData): Promise<any> => {
  try {
    const token = getToken();
    const response: any = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response?.data || response;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || "Something Went Wrong..!";
    TOAST("error", errorMessage);
    return error?.response?.data || { code: "ERROR", message: errorMessage };
  }
};
