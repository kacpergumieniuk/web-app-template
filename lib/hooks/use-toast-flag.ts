"use client";

import { useEffect } from "react";
import { toast } from "sonner";

/**
 * Shows a toast if a sessionStorage flag is set, then clears it.
 * Use for cross-reload toasts (e.g. after redirect).
 *
 * Setting side:
 *   sessionStorage.setItem("my_flag", "true");
 *   router.push("/destination");
 *   router.refresh();
 *
 * Reading side (in destination page component):
 *   useToastFlag("my_flag", "Action completed!");
 */
export function useToastFlag(
  key: string,
  message: string,
  type: "success" | "error" | "info" = "success"
) {
  useEffect(() => {
    if (sessionStorage.getItem(key) === "true") {
      sessionStorage.removeItem(key);
      requestAnimationFrame(() => {
        toast[type](message);
      });
    }
  }, [key, message, type]);
}
