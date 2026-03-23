type ToastType = "success" | "error" | "info" | "warning" | "loading";
import { toast } from "react-toastify";

export const TOAST = (type: ToastType, content: string, duration: number = 3): void => {
  const autoClose = duration * 1000;

  if (type === "loading") {
    toast.loading(content);
    return;
  }

  if (type === "success") {
    toast.success(content, { autoClose });
    return;
  }

  if (type === "error") {
    toast.error(content, { autoClose });
    return;
  }

  if (type === "warning") {
    toast.warning(content, { autoClose });
    return;
  }

  toast.info(content, { autoClose });
};

