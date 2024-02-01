import { useEffect } from "react";

export function useDebounceEffect(fn, waitTime, deps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      fn.apply(undefined, deps);
    }, waitTime);
    return () => {
      clearTimeout(timer);
    };
  }, deps);
}
