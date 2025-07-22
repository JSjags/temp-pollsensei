// utils/error.ts
import type { AxiosError } from "axios";

export function extractApiError(
  err: unknown,
  fallback = "Something went wrong."
): string {
  // Try to see if this looks like an Axios error
  const axiosErr = err as AxiosError & { response?: any };

  // Response data can be anything — string, object, array...
  const data: unknown = axiosErr?.response?.data;

  // --- String payloads ------------------------------------------------------
  if (typeof data === "string") {
    const s = data.trim();
    if (s) return s;
  }

  // --- Object payloads ------------------------------------------------------
  if (data && typeof data === "object") {
    const obj = data as Record<string, any>;

    const msg =
      obj.message ??
      obj.detail ??
      (typeof obj.error === "string"
        ? obj.error
        : obj.error?.message) ??
      undefined;

    if (msg) return String(msg);

    // Field errors: { field: ["msg1", "msg2"], other: "msg" }
    if (obj.errors && typeof obj.errors === "object") {
      const parts: string[] = [];
      for (const [field, val] of Object.entries(obj.errors as Record<string, any>)) {
        if (Array.isArray(val)) parts.push(`${field}: ${val.join(", ")}`);
        else if (typeof val === "string") parts.push(`${field}: ${val}`);
      }
      if (parts.length) return parts.join(" • ");
    }
  }

  // --- Fallbacks ------------------------------------------------------------
  if (
    err &&
    typeof err === "object" &&
    "message" in (err as any) &&
    typeof (err as any).message === "string"
  ) {
    return (err as any).message;
  }

  return fallback;
}
