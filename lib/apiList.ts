const BASE_API_URL = "/api/client/v1/";

export const apiList = {
  // AUTH APIS
  login: `${BASE_API_URL}auth/login`,
  register: `${BASE_API_URL}auth/register`,
  verifyOtp: `${BASE_API_URL}auth/verify-otp`,
  resendOtp: `${BASE_API_URL}auth/resend-otp`,
  forgotPassword: `${BASE_API_URL}auth/forgot-password`,
  changePassword: `${BASE_API_URL}auth/change-password`,
  currentUser: `${BASE_API_URL}users/me`,
  // CATEGORIES APIS
  categories: `${BASE_API_URL}categories`,
  categoryById: (id: string) => `${BASE_API_URL}categories/${id}`,
  // ACCOUNTS APIS
  accounts: `${BASE_API_URL}accounts`,
  accountById: (id: string) => `${BASE_API_URL}accounts/${id}`,
  // BUDGETS APIS
  budgets: `${BASE_API_URL}budgets`,
  budgetById: (id: string) => `${BASE_API_URL}budgets/${id}`,
  // TRANSACTIONS APIS
  transactions: `${BASE_API_URL}transactions`,
  transactionById: (id: string) => `${BASE_API_URL}transactions/${id}`,
  // DASHBOARD APIS
  dashboard: `${BASE_API_URL}dashboard`,
  test: `${BASE_API_URL}test`,
};
