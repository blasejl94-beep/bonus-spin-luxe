import { useEffect, useState } from "react";

/** Returns false when the tab/page is hidden (minimized, switched away). */
export function usePageVisible(): boolean {
  const [visible, setVisible] = useState(() =>
    typeof document !== "undefined" ? !document.hidden : true
  );

  useEffect(() => {
    const handler = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  return visible;
}
