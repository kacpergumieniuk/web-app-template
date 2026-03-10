"use client";

import { useState, useEffect } from "react";

/**
 * Delays rendering children until after client mount.
 * Avoids hydration mismatch with Radix UI (auto-generated IDs differ on server vs client).
 */
export function ClientOnly({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? <>{children}</> : <>{fallback}</>;
}
