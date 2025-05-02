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

// Formik declarations
declare module 'formik' {
  import { ComponentType, ReactNode, FormEvent } from 'react';

  export interface FormikHelpers<Values> {
    setSubmitting: (isSubmitting: boolean) => void;
    setErrors: (errors: { [field: string]: string }) => void;
    setFieldError: (field: string, message: string) => void;
    setStatus: (status: any) => void;
    setValues: (values: Values) => void;
    setFieldValue: (field: string, value: any) => void;
    setFieldTouched: (field: string, isTouched: boolean) => void;
    setTouched: (touched: { [field: string]: boolean }) => void;
    resetForm: (nextState?: any) => void;
  }

  export interface FormikProps<Values> {
    initialValues: Values;
    initialErrors: { [field: string]: string };
    initialTouched: { [field: string]: boolean };
    initialStatus: any;
    handleBlur: (e: any) => void;
    handleChange: (e: any) => void;
    handleReset: (e: any) => void;
    handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
    isSubmitting: boolean;
    isValidating: boolean;
    status?: any;
    submitCount: number;
    resetForm: (nextState?: any) => void;
    setErrors: (errors: { [field: string]: string }) => void;
    setFieldError: (field: string, message: string) => void;
    setFieldTouched: (field: string, isTouched: boolean) => void;
    setFieldValue: (field: string, value: any) => void;
    setStatus: (status: any) => void;
    setSubmitting: (isSubmitting: boolean) => void;
    setTouched: (touched: { [field: string]: boolean }) => void;
    setValues: (values: Values) => void;
    submitForm: () => Promise<any>;
    validateForm: () => Promise<{ [field: string]: string }>;
    validateField: (field: string) => Promise<void>;
    values: Values;
    errors: { [field: string]: string };
    touched: { [field: string]: boolean };
  }

  export interface FormikConfig<Values> {
    initialValues: Values;
    onSubmit: (values: Values, formikHelpers: FormikHelpers<Values>) => void | Promise<any>;
    validationSchema?: any;
    validate?: (values: Values) => void | object | Promise<any>;
    component?: ComponentType<FormikProps<Values>>;
    render?: (props: FormikProps<Values>) => ReactNode;
    children?: (props: FormikProps<Values>) => ReactNode;
    enableReinitialize?: boolean;
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
    validateOnMount?: boolean;
  }

  export function Formik<Values>(props: FormikConfig<Values>): JSX.Element;
  export function Form(props: any): JSX.Element;
  export function Field(props: any): JSX.Element;
  export function ErrorMessage(props: any): JSX.Element;
}

// Yup declarations
declare module 'yup' {
  export interface Schema {
    required(message?: string): Schema;
    min(limit: number, message?: string): Schema;
    max(limit: number, message?: string): Schema;
    email(message?: string): Schema;
    matches(regex: RegExp, message?: string): Schema;
    oneOf(values: any[], message?: string): Schema;
    nullable(): Schema;
    test(name: string, message: string, test: Function): Schema;
  }

  export function string(): Schema;
  export function number(): Schema;
  export function boolean(): Schema;
  export function array(): Schema;
  export function object(shape?: { [key: string]: Schema }): { [key: string]: Schema };
  export function ref(path: string): any;
} 