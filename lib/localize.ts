/**
 * Localization Placeholder
 * In a real app, this would use a library like next-intl or i18next.
 */
export function _localize(key: string, req?: any): string {
  // Simple mock implementation
  const translations: Record<string, string> = {
    "auth.loginSuccess": "Login successful",
    "auth.registerSuccess": "Registration successful",
    "auth.accountNotFound": "Account not found",
    "auth.deactivate": "Account is deactivated",
    "auth.useGoogleToLogin": "Please use Google to login",
    "auth.passwordWrong": "Incorrect password",
    "auth.userNotAllowed": "User not allowed",
    "auth.userAlreadyExists": "User already exists",
    "auth.accountNotVerify": "Account not verified",
    "auth.accountAlreadyVerified": "Account is already verified",
    "auth.otpWrong": "Incorrect OTP",
    "auth.otpVerified": "OTP verified successfully",
    "auth.otpResent": "OTP has been resent to your email",
    "auth.passwordForgot": "Password reset instructions have been sent to your email",
    "auth.invalidToken": "Invalid or expired token",
    "auth.passwordChanged": "Password changed successfully",
    "category.createSuccess": "Category created successfully",
    "category.fetchSuccess": "Category fetched successfully",
    "category.updateSuccess": "Category updated successfully",
    "category.deleteSuccess": "Category deleted successfully",
    "category.notFound": "Category not found",
    "category.alreadyExists": "Category already exists"

  };

  return translations[key] || key;
}
