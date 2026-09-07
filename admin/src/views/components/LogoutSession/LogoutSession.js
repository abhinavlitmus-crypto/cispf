import { useEffect, useRef, useCallback } from "react";

export function useMouseIdleLogout({ minutes = 20, onLogout }) {
  const timerRef = useRef(null);
  const idleMs = minutes * 60 * 1000;

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      onLogout?.(); // logout after 20 min idle
    }, idleMs);
  }, [idleMs, onLogout]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      // 👇 mouse coordinates
    //   console.log("Mouse X:", event.clientX, "Mouse Y:", event.clientY);

      // restart idle timer
      resetTimer();
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [resetTimer]);
}
