// utils/features.ts
import { toast } from "react-hot-toast";
import { NextRouter } from "next/router";

export const responseToast = (res: any, router: NextRouter, path: string) => {
  if ('data' in res && res.data.success) {
    toast.success(res.data.message);
    router.push(path);
  } else {
    toast.error(res.error?.data?.message || "Something went wrong");
  }
};
