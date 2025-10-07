"use client";

import { toast } from "sonner";

const useCustomToast = () => {
  return {
    showSuccessToast: toast.success,
    showErrorToast: toast.error,
  };
};

export default useCustomToast;