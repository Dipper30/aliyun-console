import { useState } from 'react';

const useCountdown = (max: number) => {
  const [remaining, setRemaining] = useState<number>(max);

  const startCounting = () => {
    const t = setInterval(() => {
      setRemaining(c => {
        if (c <= 0) {
          clearInterval(t);
          return max;
        } else return c - 1;
      });
    }, 1000);
  };

  return [remaining, startCounting] as const;
};

export default useCountdown;
