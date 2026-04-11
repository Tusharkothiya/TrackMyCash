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
    "auth.otpSendFailed": "Unable to send OTP email right now. Please try again.",
    "auth.passwordForgot": "Password reset instructions have been sent to your email",
    "auth.invalidToken": "Invalid or expired token",
    "auth.passwordChanged": "Password changed successfully",
    "category.createSuccess": "Category created successfully",
    "category.fetchSuccess": "Category fetched successfully",
    "category.updateSuccess": "Category updated successfully",
    "category.deleteSuccess": "Category deleted successfully",
    "category.notFound": "Category not found",
    "category.alreadyExists": "Category already exists",
    "budget.createSuccess": "Budget created successfully",
    "budget.fetchSuccess": "Budget fetched successfully",
    "budget.updateSuccess": "Budget updated successfully",
    "budget.deleteSuccess": "Budget deleted successfully",
    "budget.notFound": "Budget not found",
    "budget.invalidId": "Invalid budget ID",
    "budget.invalidCategoryId": "Invalid category ID",
    "budget.categoryNotFound": "Category not found",
    "budget.alreadyExists": "Budget already exists for this category and frequency",
    "budget.fetchError": "Failed to fetch budget data",
    "budget.createError": "Failed to create budget",
    "budget.updateError": "Failed to update budget",
    "budget.deleteError": "Failed to delete budget",

    "dashboard.fetchSuccess": "Dashboard overview fetched successfully",
    "dashboard.fetchError": "Failed to fetch dashboard overview",

    "transaction.createSuccess": "Transaction created successfully",
    "transaction.fetchSuccess": "Transaction fetched successfully",
    "transaction.updateSuccess": "Transaction updated successfully",
    "transaction.deleteSuccess": "Transaction deleted successfully",
    "transaction.notFound": "Transaction not found",
    "transaction.invalidId": "Invalid transaction ID",
    "transaction.invalidAccountId": "Invalid account ID",
    "transaction.invalidDestinationAccountId": "Invalid destination account ID",
    "transaction.invalidCategoryId": "Invalid category ID",
    "transaction.invalidDateFilter": "Invalid date filter",
    "transaction.accountNotFound": "Account not found",
    "transaction.destinationAccountNotFound": "Destination account not found",
    "transaction.destinationAccountRequired": "Destination account is required for transfer",
    "transaction.categoryRequired": "Category is required for Expense and Income transactions",
    "transaction.categoryNotAllowedForTransfer": "Category is not allowed for transfer transactions",
    "transaction.categoryNotFound": "Category not found",
    "transaction.categoryTypeMismatch": "Category type does not match transaction type",
    "transaction.sameTransferAccount": "Source and destination account cannot be the same",
    "transaction.currencyMismatch": "Source and destination account currencies must match",
    "transaction.insufficientBalance": "Insufficient account balance for this transaction",
    "transaction.balanceOutOfRange": "Resulting account balance is out of allowed range",
    "transaction.fetchError": "Failed to fetch transaction data",
    "transaction.createError": "Failed to create transaction",
    "transaction.updateError": "Failed to update transaction",
    "transaction.deleteError": "Failed to delete transaction"

  };

  return translations[key] || key;
}
