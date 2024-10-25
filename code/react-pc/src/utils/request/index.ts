/**
 * 请求库axios封装 https://axios-http.com/zh/docs/req_config
 * 1、普通表单提交 application/x-www-form-urlencoded https://axios-http.com/zh/docs/urlencoded
 * 2、文件上传 formData https://axios-http.com/zh/docs/multipart
 * 3、json提交 application/json
 * 4、下载文件 stream
 * =================================================================
 * 1、重复请求取消
 * 2、请求失败重试
 */

import type {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';
import axios from 'axios';
import axiosRetry from 'axios-retry';

import { Response } from '@/types/Common';
import {
  addPendingRequest,
  removePendingRequest,
} from '@/utils/request/helper';
import { download } from '@/utils/request/tools';

const token_name = 'token';

const host = import.meta.env.VITE_APP_DOMAIN;

// 默认实例
const axiosInstance = axios.create({
  baseURL: host,
  timeout: 10000,
  // 跨域请求是否携带cookie
  withCredentials: true,
  responseType: 'json',
  // responseType: 'blob'; 下载
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    // 登录完成之后，将用户的token通过localStorage或者cookie存在本地
    Authorization: localStorage.getItem(token_name),
  },
});

// 增加retry配置
axiosRetry(axiosInstance, {
  retries: 4,
  retryCondition: err => {
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(err) ||
      //  如果是cancelError，err没有response对象
      err?.response?.status === 404
    );
  },
  shouldResetTimeout: true,
  retryDelay: axiosRetry.linearDelay(),
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (reqConfig: InternalAxiosRequestConfig) => {
    // FormData的时候需要特殊处理，或者两个都自己设置
    if (reqConfig.data instanceof FormData) {
      reqConfig.headers['Content-Type'] = 'multipart/form-data;charset=utf-8';
    }
    const token = localStorage.getItem(token_name);
    if (token) reqConfig.headers.Authorization = token;

    const controller = new AbortController();

    // controller只在当前作用域生效
    addPendingRequest(reqConfig, controller);

    return {
      ...reqConfig,
      signal: controller.signal,
    };
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

/**
 * 响应拦截器
 */
axiosInstance.interceptors.response.use(
  async res => {
    // console.log('@@@@@response.interceptors res', res);
    const status = res.data.code || res.status;
    // 如果请求为非200否者默认统一处理
    if (status !== 200 && status !== 201) {
      // 处理特殊的响应返回
      if (res.config.responseType === 'blob' || res.data instanceof Blob) {
        // res.data.type?.includes('application/json')

        // const reader = new FileReader()
        // reader.readAsText(res.data)
        // reader.onload = e => {
        //   const { msg } = JSON.parse(reader.result)
        //   this.$message.error(msg)
        // }
        // return res
        const dataText = await res.data?.text();
        const dataJson = JSON.parse(dataText);
        return {
          ...res,
          data: dataJson,
        };
      }
      return Promise.reject(res);
    }
    removePendingRequest(res.config); // 从pendingRequest对象中移除请求

    return Promise.resolve(res);
  },
  error => {
    // console.log('@@@@@response.interceptors error', error);
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    removePendingRequest(error?.config || {});
    const errStatus = error?.response?.status;
    if (errStatus) {
      switch (errStatus) {
        // 401: 未登录
        // 未登录则跳转登录页面，并携带当前页面的路径
        // 在登录成功后返回当前页面，这一步需要在登录页操作。
        case 401:
          // router.replace({
          //   path: '/login',
          //   query: {
          //     redirect: router.currentRoute.fullPath,
          //   },
          // });
          console.error('未登录');
          // controller.abort('取消请求');
          break;

        // 403 token过期
        // 登录过期对用户进行提示
        // 清除本地token和清空store中token对象
        // 跳转登录页面
        case 403:
          console.error('登录过期，请重新登录');
          // 清除token
          localStorage.removeItem('token');
          // controller.abort('取消请求');

          // store.commit('loginSuccess', null);
          // // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
          // setTimeout(() => {
          //   router.replace({
          //     path: '/login',
          //     query: {
          //       redirect: router.currentRoute.fullPath,
          //     },
          //   });
          // }, 1000);
          break;

        // 404请求不存在
        case 404:
          console.error('网络请求不存在');
          break;
        // 其他错误，直接抛出错误提示
        default:
          console.error('请求错误');
      }
      return Promise.reject(error);
    }
  },
);

async function axiosRequest<T>(req: Partial<AxiosRequestConfig>) {
  return new Promise<T>((resolve, reject) => {
    axiosInstance
      .request<Response<T>>(req)
      .then(resp => {
        // 只接收了status=200的请求
        const result = resp.data;
        // 下载
        if (result instanceof Blob) {
          download(resp);
          resolve(null);
        }
        // 普通返回
        if (!result.success) {
          if (result.errorCode.indexOf('401') > -1) {
            // controller.abort('取消请求');
            // 登录失效后的处理
            // window.location.href = configParams.loginErrUrl;
          }
          // @NOTICE 业务失败
          reject(result);
        } else {
          resolve(result.data);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
}

const request = {
  get: <T>(url: string, config?: Partial<AxiosRequestConfig>) =>
    axiosRequest<T>({ ...config, url, method: 'GET' }),
  delete: <T>(url: string, config?: Partial<AxiosRequestConfig>) =>
    axiosRequest<T>({ ...config, url, method: 'DELETE' }),
  post: <T>(url: string, data: any, config?: Partial<AxiosRequestConfig>) =>
    axiosRequest<T>({ ...config, url, data, method: 'POST' }),
  put: <T>(url: string, data: any, config?: Partial<AxiosRequestConfig>) =>
    axiosRequest<T>({ ...config, url, data, method: 'PUT' }),
};

export { axiosInstance as axios, axiosRequest, request };
