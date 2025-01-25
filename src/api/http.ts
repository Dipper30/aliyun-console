/* eslint-disable no-dupe-class-members */
/* eslint-disable no-console */

import axios, { AxiosInstance } from 'axios';
import { errorMessage, getToken } from '@/utils';

class HttpClient {
  axiosInstance: AxiosInstance;
  constructor(options: { prefix: string }) {
    const apiBaseURL = import.meta.env.APTX_BASE_URL + options.prefix;

    const http = axios.create({
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
    this.axiosInstance = http;
  }

  private async request<T = any>(data: {
    method: 'get' | 'post' | 'put' | 'delete';
    url: string;
    params?: any;
    fallback?: T;
  }): APIPromise<T> {
    const { method, url, params } = data;
    const http = this.axiosInstance;
    let res: APIResponse<T>;
    if (method === 'delete') {
      res = await http.delete(url, {
        data: params,
      });
    } else {
      const fn = method === 'get' ? http.get : method === 'post' ? http.post : http.put;
      res = (await fn(url, params)) as unknown as APIResponse<T>;
    }
    if (!res.success && data.fallback) {
      res.data = data.fallback;
    }
    return res;
  }

  $get<T = any>(
    url: string,
    options?: {
      queries?: Record<string, any>;
    },
  ): APIPromise<T | undefined>;
  $get<T = any>(
    url: string,
    options?: {
      queries?: Record<string, any>;
      fallback?: T;
    },
  ): APIPromise<T>;
  /**
   * get request
   */
  $get<T = any>(
    url: string,
    options?: {
      queries?: Record<string, any>;
      fallback?: T;
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
    if (options?.fallback) {
      return this.request<T>({ method: 'get', url, fallback: options.fallback });
    } else {
      return this.request<T | undefined>({ method: 'get', url });
    }
  }

  $post<T = any>(
    url: string,
    options?: {
      params?: any;
    },
  ): APIPromise<T | undefined>;
  $post<T = any>(
    url: string,
    options?: {
      params?: any;
      fallback?: T;
    },
  ): APIPromise<T>;
  /**
   * post request
   */
  $post<T = any>(
    url: string,
    options?: {
      params?: any;
      fallback?: T;
    },
  ) {
    if (options?.fallback) {
      return this.request<T>({
        method: 'post',
        url,
        params: options?.params,
        fallback: options.fallback,
      });
    } else {
      return this.request<T | undefined>({ method: 'post', url, params: options?.params });
    }
  }

  $put<T = any>(
    url: string,
    options?: {
      params?: any;
    },
  ): APIPromise<T | undefined>;
  $put<T = any>(
    url: string,
    options?: {
      params?: any;
      fallback?: T;
    },
  ): APIPromise<T>;
  /**
   * put request
   */
  $put<T = any>(
    url: string,
    options?: {
      params?: any;
      fallback?: T;
    },
  ) {
    if (options?.fallback) {
      return this.request<T>({
        method: 'put',
        url,
        params: options.params,
        fallback: options.fallback,
      });
    } else {
      return this.request<T | undefined>({ method: 'put', url, params: options?.params });
    }
  }

  $delete<T = any>(
    url: string,
    options?: {
      params?: any;
    },
  ): APIPromise<T | undefined>;
  $delete<T = any>(
    url: string,
    options?: {
      params?: any;
      fallback?: T;
    },
  ): APIPromise<T>;

  /**
   * delete request
   */
  $delete<T = any>(
    url: string,
    options?: {
      params?: any;
      fallback?: T;
    },
  ) {
    if (options?.fallback) {
      return this.request<T>({
        method: 'delete',
        url,
        params: options.params,
        fallback: options.fallback,
      });
    } else {
      console.log('params ', options);
      return this.request<T>({ method: 'delete', url, params: options?.params });
    }
  }
}

const http = new HttpClient({ prefix: '/api/v1' });
const aliyunHttp = new HttpClient({ prefix: '/api/aliyun' });
const cdnHttp = new HttpClient({ prefix: '/api/aliyun/cdn' });

export { http, aliyunHttp, cdnHttp };
