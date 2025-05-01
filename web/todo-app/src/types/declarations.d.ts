// Type declarations for modules without type definitions
declare module 'axios' {
  export interface AxiosRequestConfig {
    baseURL?: string;
    headers?: any;
    params?: any;
  }
  
  export interface AxiosResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: any;
    config: AxiosRequestConfig;
  }
  
  export interface AxiosInstance {
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    create(config?: AxiosRequestConfig): AxiosInstance;
    interceptors: {
      request: {
        use: (onFulfilled: (config: any) => any, onRejected?: (error: any) => any) => void;
      };
      response: {
        use: (onFulfilled: (response: any) => any, onRejected?: (error: any) => any) => void;
      };
    };
  }
  
  const axios: AxiosInstance;
  export default axios;
} 