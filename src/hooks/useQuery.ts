import { useCallback, useState } from 'react';
import { errorMessage, handleResult } from '@/utils';

export type QueryFunction<T = any> = (...args: any) => APIPromise<T | undefined>;

export type UseQueryOptions<T = any> = {
  onSuccess?: (res: T) => void; // code = 200 | 201
  onError?: (err: APIResponse) => void; // 捕获自定义错误
  showError?: boolean | string;
  showSuccess?: boolean | string;
  initialData?: T;
};

const useQuery = <T = any, P = any>(fn: QueryFunction<T>, options?: UseQueryOptions<T>, deps?: any[]) => {
  const [data, setData] = useState<T | undefined>(options?.initialData ?? undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { showError = true, showSuccess = false } = options || {};

  const query = useCallback(
    async (p?: P) => {
      try {
        setIsLoading(true);
        const res = await fn.call(fn, p);
        const result = handleResult(res, {
          notifyError: !!showError,
          successMessage: showSuccess ? (typeof showSuccess === 'string' ? showSuccess : res.msg) : '',
          errorMessage: typeof showError === 'string' ? showError : res.msg,
        });
        if (result) {
          setData(res.data);
          options?.onSuccess && options.onSuccess(res.data!);
        } else {
          options?.onError && options.onError(res);
        }
        return res.data;
      } catch (error) {
        // 未知错误
        errorMessage(`服务错误：${error}`);
      } finally {
        setIsLoading(false);
      }
    },
    [...(deps ?? [])],
  );

  return { query, data, isLoading, setData } as const;
};

export default useQuery;
