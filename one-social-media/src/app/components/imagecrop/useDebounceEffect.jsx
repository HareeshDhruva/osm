import { useEffect, DependencyList } from "react";

export function useDebounceEffect(fn, waitTime, deps) {
  useEffect(() => {
    const t = setTimeout(() => {
      fn.apply(deps);
    }, waitTime);

    return () => {
      clearTimeout(t);
    };
  }, deps);
}
