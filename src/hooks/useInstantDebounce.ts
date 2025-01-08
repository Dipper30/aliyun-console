import { useCallback, useEffect, useRef } from 'react';

const useDebounce = (fn: any, delay: number, dep: any[] = []) => {
  const { current } = useRef<{ fn: any; timer: any }>({ fn, timer: null });

  useEffect(() => {
    current.fn = fn;
  }, [fn]);

  return useCallback(function f(...args: any) {
    if (current.timer === null) {
      current.fn(...args);
      current.timer = setTimeout(() => {
        clearTimeout(current.timer);
      }, delay);
    } else {
      clearTimeout(current.timer);
      current.timer = setTimeout(() => {
        current.fn(...args);
        clearTimeout(current.timer);
        current.timer = null;
      }, delay);
    }
  }, dep);
};

export default useDebounce;
