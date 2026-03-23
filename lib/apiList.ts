const BASE_API_URL = "/api/client/v1/";

export const apiList = {
  // AUTH APIS
  login: `${BASE_API_URL}auth/login`,
  register: `${BASE_API_URL}auth/register`,
  verifyOtp: `${BASE_API_URL}auth/verify-otp`,
  resendOtp: `${BASE_API_URL}auth/resend-otp`,
  forgotPassword: `${BASE_API_URL}auth/forgot-password`,
  changePassword: `${BASE_API_URL}auth/change-password`,
  test: `${BASE_API_URL}test`,
};
