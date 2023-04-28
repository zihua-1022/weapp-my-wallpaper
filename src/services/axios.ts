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
  // // 存放取消请求控制器
  // abortControllerMap: Map<string, AbortController>;

  constructor() {
    // 创建 Axios 实例
    this.instance = axios.create(baseConfig);
    // 全局设置
    this.instance.defaults.headers.post["Content-Type"] =
      "application/json; charset=utf-8";
    // axios.defaults.headers.common['ref'] = getSourceApp()

    // // 存储取消请求的控制器
    // this.abortControllerMap = new Map();
    // 添加请求拦截器
    this.instance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        // do something before request is sent
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
        // // 获取响应的 url
        // const url = response.config.url || "";
        // // 从 Map 中删除对应的控制器
        // this.abortControllerMap.delete(url);
        const { status, msg } = response.data;
        if (response.status === 200 && status) {
          return response;
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

  // 发送请求的方法，返回 Promise 对象
  request<IResultData>(config: AxiosRequestConfig): Promise<IResultData> {
    return new Promise((resolve, reject) => {
      this.instance
        .request(config)
        .then((res) => {
          console.log("res: ", res);
          resolve(res as IResultData);
        })
        .catch((err: AxiosError) => {
          reject(err);
        });
    });
  }

  // 取消全部请求
  cancelAllRequest() {
    for (const controller of this.abortControllerMap.values()) {
      controller.abort();
    }
    // 清空 Map
    this.abortControllerMap.clear();
  }

  // 取消指定的请求
  cancelRequest(url: string | string[]) {
    // 将参数转换为数组
    const urlList = Array.isArray(url) ? url : [url];
    urlList.forEach((_url) => {
      // 根据 url 获取对应的控制器并取消请求
      this.abortControllerMap.get(_url)?.abort();
      // 从 Map 中删除对应的控制器
      this.abortControllerMap.delete(_url);
    });
  }

  // 发送 GET 请求的方法，返回 Promise 对象
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: "get", url });
  }

  // 发送 POST 请求的方法，返回 Promise 对象
  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>({ ...config, method: "post", url, data });
  }

  // 发送 PUT 请求的方法，返回 Promise 对象
  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>({ ...config, method: "put", url, data });
  }
  // 发送 DELETE 请求的方法，返回 Promise 对象
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: "delete", url });
  }
}

const service = new Service();

export default service;
