import { useCallback, useEffect, useRef } from 'react';

const useDebounce = (fn: any, delay: number, dep: any[] = []) => {
  const { current } = useRef<{ fn: any; timer: any }>({ fn, timer: null });

  useEffect(() => {
    current.fn = fn;
  }, [fn]);

  return useCallback(function f(...args: any) {
    if (current.timer !== null) {
      clearTimeout(current.timer);
    }
    current.timer = setTimeout(() => {
      current.fn(...args);
      clearTimeout(current.timer);
    }, delay);
  }, dep);
};

export default useDebounce;
