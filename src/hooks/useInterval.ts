import { handleResult } from '@/utils';
import { useCallback, useEffect, useRef, useState } from 'react';

const useInterval = <T>(fn: (...args: any) => any, interval: number, dep: any[] = []) => {
  const { current } = useRef<{ fn: (...args: any) => any; timer: any; interval: number }>({
    fn,
    timer: null,
    interval: 5000,
  });
  const [data, setData] = useState<T>();
  useEffect(() => {
    current.fn = fn;
    clearInterval(current.timer);
    current.interval = interval;

    // current.timer = setInterval(async () => {

    // }, current.interval)
  }, [fn, interval, ...dep]);

  useEffect(() => {
    return () => {
      clearInterval(current.timer);
    };
  }, []);

  useCallback(function f(...args: any) {
    if (current.timer !== null) {
      clearInterval(current.timer);
    }
    current.timer = setInterval(async () => {
      const res = await current.fn(...args);
      if (!handleResult(res)) {
        // error
      } else setData(res.data);
      clearTimeout(current.timer);
    }, interval);
  }, dep);

  return data;
};

export default useInterval;
