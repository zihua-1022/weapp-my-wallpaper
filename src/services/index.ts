import {
  axios,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "taro-axios";
import Taro from "@tarojs/taro";
import { IResultData } from "@/api/model/baseModel";
import { serverMap, urlTools } from "./config";
import { isWeapp, isDev, parseURL } from "../utils/tools";

const headers = {
  "X-Requested-With": "XMLHttpRequest",
  Domain: window.location.hostname,
  // 如果content-Type 是 "application/x-www-form-urlencoded" 需要对 data 进行字符转义
  // transformRequest: [
  //   (data, headers) => {
  //     return qs.stringify(data)
  //   }
  // ]
};

const baseConfig = {
  // baseURL: process.env.BASEURL_API, // url = base url + request url
  prefix: "weapp",
  baseURL: "/",
  // isWeapp(process.env.TARO_ENV) && isDev(process.env.NODE_ENV || "")
  //   ? "http://localhost:3000/"
  //   : "/",
  timeout: 10000, // request timeout （10s）
  // withCredentials: true, // send cookies when cross-domain requests
  // cancelToken: new CancelToken(function (cancel) {
  // }),
  headers: headers,
};

class Service {
  // Axios 实例
  instance: AxiosInstance;

  constructor() {
    // 创建 Axios 实例
    this.instance = axios.create(baseConfig);
    // 全局设置
    this.instance.defaults.headers.post["Content-Type"] =
      "application/json; charset=utf-8";
    // axios.defaults.headers.common['ref'] = getSourceApp()

    // 添加请求拦截器
    this.instance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        // const token = getToken();
        const token = null;
        if (token && config.headers) {
          // let each request carry token
          // ['X-Token'] is a custom headers key
          // please modify it according to the actual situation
          config.headers["Authorization"] = token;
        }
        if (isWeapp(process.env.TARO_ENV)) {
          const serverName = config.url?.split("/")[0];
          const proxy =
            serverMap[process.env.NODE_ENV || "default"][serverName];
          config.baseURL = proxy;
          //   const { target, pathRewrite } = proxy.dev["/weapp"];
          config.url = urlTools.formatter(
            config.url ?? "",
            serverName ?? "",
            ""
          );
        }
        return config;
      },
      (error: AxiosError) => {
        // do something with request error
        console.log(error); // for debug
        return Promise.reject(error);
      }
    );

    // 添加响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        const { status, msg } = response.data;
        if (response.status === 200 && status) {
          return response;
          // return response.data;
        } else {
          return Promise.reject(new Error(msg));
        }
      },
      (error: AxiosError) => {
        // // 对响应错误做些什么
        // if (error.status) {
        //   switch (error.status) {
        //     case 401:
        //       // 401: 未登录
        //       break;
        //     case 403:
        //       // 403: token 过期
        //       break;
        //     case 406:
        //       // 406: 参数错误
        //       break;
        //     // 其他状态码
        //     default:
        //       break;
        //   }
        // }
        // return Promise.reject(error.response.data);
        console.log("err" + error); // for debug
        Taro.showToast({
          title: error.message,
        });
        return Promise.reject(error);
      }
    );
  }

  request = <T>(config: AxiosRequestConfig): Promise<T> => {
    return new Promise((resolve, reject) => {
      this.instance
        .request<T>(config)
        .then((res) => {
          resolve(res as T);
        })
        .catch((err: AxiosError) => {
          reject(err);
        });
    });
  };
}

const service = new Service();

// 封装发送请求的方法，返回 Promise 对象
export const request = <T>(
  config: AxiosRequestConfig
): Promise<IResultData<T>> => {
  return new Promise((resolve, reject) => {
    service.instance
      .request<IResultData<T>>(config)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err: AxiosError) => {
        reject(err);
      });
  });
};

export default service;
