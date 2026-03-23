import { useMutation } from "@tanstack/react-query";
import { postRequest } from "../lib/apiService";
import { apiList } from "../lib/apiList";
import { TOAST } from "../lib/utils/toastMessage";
import { setToken } from "../lib/utils/helper";

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: any) => postRequest(apiList.register, data),
    onSuccess: (response) => {
      if (response.success) {
        if (response.data?.token) {
          setToken(response.data.token);
        }
        TOAST("success", response.message || "Registration successful!");
      }
    },
    onError: (error: any) => {
      TOAST("error", error?.message || "Registration failed");
    },
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: any) => postRequest(apiList.login, data),
    onSuccess: (response) => {
      if (response.success) {
        if (response.data?.token) {
          setToken(response.data.token);
        }
        TOAST("success", response.message || "Login successful!");
      }
    },
    onError: (error: any) => {
      TOAST("error", error?.message || "Login failed");
    },
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: (data: { email: string; otp: string }) =>
      postRequest(apiList.verifyOtp, data),
    onSuccess: (response) => {
      if (response?.success) {
        TOAST("success", response.message || "OTP verified successfully!");
      }
    },
    onError: (error: any) => {
      TOAST("error", error?.message || "OTP verification failed");
    },
  });
};

export const useResendOtp = () => {
  return useMutation({
    mutationFn: (data: { email: string }) =>
      postRequest(apiList.resendOtp, data),
    onSuccess: (response) => {
      if (response?.success) {
        TOAST("success", response.message || "OTP resent successfully!");
      }
    },
    onError: (error: any) => {
      TOAST("error", error?.message || "Resend OTP failed");
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data: { email: string }) =>
      postRequest(apiList.forgotPassword, data),
    onSuccess: (response) => {
      if (response?.success) {
        TOAST("success", response.message || "Password reset request created");
      }
    },
    onError: (error: any) => {
      TOAST("error", error?.message || "Forgot password request failed");
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: { email: string; password: string; token: string }) =>
      postRequest(apiList.changePassword, data),
    onSuccess: (response) => {
      if (response?.success) {
        TOAST("success", response.message || "Password changed successfully!");
      }
    },
    onError: (error: any) => {
      TOAST("error", error?.message || "Change password failed");
    },
  });
};
