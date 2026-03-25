import Cookies from "js-cookie";

const THEME_KEY = "_next_refresh_token_tmc_";

export const getToken = () => {
  return Cookies.get(THEME_KEY) || null;
};

export const setToken = (token: string) => {
  Cookies.set(THEME_KEY, token, { expires: 30 }); // Expires in 30 days
};

export const getUserInitials = (fullName?: string | null): string => {
  const name = (fullName || "").trim();
  if (!name) return "U";

  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] || ""}${parts[parts.length - 1][0] || ""}`.toUpperCase();
};

export const logout = () => {
  Cookies.remove(THEME_KEY);
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};


