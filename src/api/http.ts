/* eslint-disable no-console */
/* eslint-disable no-redeclare */
import axios from 'axios';
import { errorMessage, getToken } from '@/utils';

export const apiBaseURL = import.meta.env.APTX_BASE_URL + '/api/v1';

export const mHttpConfig = {
  warn: 0,
};

export const http = axios.create({
  baseURL: apiBaseURL,
  timeout: 10000,
  withCredentials: true, // cookies
});

http.defaults.headers.post['Content-Type'] = 'application/json';

http.interceptors.request.use((config: any) => {
  const token = getToken();
  config.headers.token = token;
  return config;
});

http.interceptors.response.use(
  response => {
    if (!response.data) {
      return {
        success: false,
        code: 500,
        msg: 'Network Error',
      };
    }
    switch (response.data?.code) {
      // define your own Exception Code handler here
      case 1003:
        errorMessage('Not Authorized');
        return { ...response.data, hideMsg: true };
      default:
        return response.data;
    }
  },
  (error: Error) => {
    errorMessage(error.message);
    console.error('Request Error: ', error);
    return {
      success: false,
      code: 500,
      msg: 'Request Error',
      errMsg: error.message,
      data: error.stack,
      hideMsg: true,
    };
  },
);

async function request<T = any>(data: {
  method: 'get' | 'post' | 'put' | 'delete';
  url: string;
  params?: any;
  fallbackResponse?: T;
}): APIPromise<T> {
  const { method, url, params } = data;
  const fn = method === 'get' ? http.get : method === 'post' ? http.post : method === 'delete' ? http.delete : http.put;
  const res = (await fn(url, params)) as unknown as APIResponse<any>;
  if (!res.success && data.fallbackResponse) {
    res.data = data.fallbackResponse;
  }
  return res;
}

function $get<T = any>(
  url: string,
  options?: {
    queries?: Record<string, any>;
  },
): APIPromise<T | undefined>;
function $get<T = any>(
  url: string,
  options?: {
    queries?: Record<string, any>;
    fallbackResponse?: T;
  },
): APIPromise<T>;
/**
 * get request
 */
function $get<T = any>(
  url: string,
  options?: {
    queries?: Record<string, any>;
    fallbackResponse?: T;
  },
) {
  if (options?.queries) {
    let count = 1;
    for (const attr in options.queries) {
      url += count == 1 ? '?' : '&';
      url += attr + '=' + options.queries[attr];
      count++;
    }
  }
  if (options?.fallbackResponse) {
    return request<T>({ method: 'get', url, fallbackResponse: options.fallbackResponse });
  } else {
    return request<T | undefined>({ method: 'get', url });
  }
}

function $post<T = any>(
  url: string,
  options?: {
    params?: any;
  },
): APIPromise<T | undefined>;
function $post<T = any>(
  url: string,
  options?: {
    params?: any;
    fallbackResponse?: T;
  },
): APIPromise<T>;
/**
 * post request
 */
function $post<T = any>(
  url: string,
  options?: {
    params?: any;
    fallbackResponse?: T;
  },
) {
  if (options?.fallbackResponse) {
    return request<T>({ method: 'post', url, params: options?.params, fallbackResponse: options.fallbackResponse });
  } else {
    return request<T | undefined>({ method: 'post', url, params: options?.params });
  }
}

function $put<T = any>(
  url: string,
  options?: {
    params?: any;
  },
): APIPromise<T | undefined>;
function $put<T = any>(
  url: string,
  options?: {
    params?: any;
    fallbackResponse?: T;
  },
): APIPromise<T>;
/**
 * put request
 */
function $put<T = any>(
  url: string,
  options?: {
    params?: any;
    fallbackResponse?: T;
  },
) {
  if (options?.fallbackResponse) {
    return request<T>({ method: 'put', url, params: options.params, fallbackResponse: options.fallbackResponse });
  } else {
    return request<T | undefined>({ method: 'put', url, params: options?.params });
  }
}

function $delete<T = any>(
  url: string,
  options?: {
    params?: any;
  },
): APIPromise<T | undefined>;
function $delete<T = any>(
  url: string,
  options?: {
    params?: any;
    fallbackResponse?: T;
  },
): APIPromise<T>;

/**
 * delete request
 */
function $delete<T = any>(
  url: string,
  options?: {
    params?: any;
    fallbackResponse?: T;
  },
) {
  if (options?.fallbackResponse) {
    return request<T>({ method: 'delete', url, params: options.params, fallbackResponse: options.fallbackResponse });
  } else {
    return request<T>({ method: 'delete', url, params: options?.params });
  }
}

/**
 * file uploader
 */
// export const $upload = (url: string, files: File[]): Promise<APIResponse<any>> => {
//   const formData = new FormData()
//   for (const file of files) formData.append('file', file)
//   return http.post(url, formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data;charset=UTF-8',
//     },
//   })
// }

export { $get, $post, $put, $delete };
