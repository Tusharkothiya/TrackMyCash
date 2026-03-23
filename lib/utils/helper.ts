import Cookies from "js-cookie";

const THEME_KEY = "_next_refresh_token_tmc_";

export const getToken = () => {
  return Cookies.get(THEME_KEY) || null;
};

export const setToken = (token: string) => {
  Cookies.set(THEME_KEY, token, { expires: 30 }); // Expires in 30 days
};

export const logout = () => {
  Cookies.remove(THEME_KEY);
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};


