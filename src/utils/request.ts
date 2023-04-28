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
// import { statusCode } from "./config";
// import { IResponseData } from "./typings";

// 全局设置
axios.defaults.headers.post["Content-Type"] = "application/json; charset=utf-8";
// axios.defaults.headers.common['ref'] = getSourceApp()

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
// const CancelToken = axios.CancelToken;
// const source = CancelToken.source();

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
// create an axios instance
const service: AxiosInstance = axios.create(baseConfig);

// request interceptor
service.interceptors.request.use(
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
      const proxy = serverMap[process.env.NODE_ENV || "default"][serverName];
      config.baseURL = proxy;
      //   const { target, pathRewrite } = proxy.dev["/weapp"];
      config.url = urlTools.formatter(config.url ?? "", serverName ?? "", "");
    }
    console.log("config: ", config);
    return config;
  },
  (error: AxiosError) => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor 拦截登录过期或者没有权限
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response: AxiosResponse) => {
    console.log("response: ", response);
    const { status, msg } = response.data;
    // debugger;
    // if (!response.data) {
    //   return Promise.resolve(response);
    // }
    // 对响应数据进行处理
    // const { data, headers } = response
    // if (headers.authorization) {
    //   // 判断是否授权
    //   localStorage.setItem('Bear_Token', headers.authorization)
    // } else {
    //   if (data?.token) {
    //     // 另一种情况token放在返回data中
    //     localStorage.setItem('Bear_Token', data.token)
    //   }
    // }
    if (response.status === 200 && status) {
      return response.data;
    } else {
      return Promise.reject(new Error(msg));
    }
    // // if the custom code is not 20000, it is judged as an error.
    // if (res.code !== 20000) {
    //   Message({
    //     message: res.message || 'Error',
    //     type: 'error',
    //     duration: 5 * 1000
    //   })

    //   // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //     // to re-login
    //     MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
    //       confirmButtonText: 'Re-Login',
    //       cancelButtonText: 'Cancel',
    //       type: 'warning'
    //     }).then(() => {
    //       store.dispatch('user/resetToken').then(() => {
    //         location.reload()
    //       })
    //     })
    //   }

    //   return Promise.reject(new Error(res.message || 'Error'))
    // } else {
    //   return res
    // }
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

export default service.request;

// class RequestHttp {
//   service: AxiosInstance;
//   public constructor(config: AxiosRequestConfig) {
//     // 实例化axios
//     this.service = axios.create(config);

//     /**
//      * @description 请求拦截器
//      * 客户端发送请求 -> [请求拦截器] -> 服务器
//      * token校验(JWT) : 接受服务器返回的token,存储到redux/本地储存当中
//      */
//     this.service.interceptors.request.use(
//       (config: AxiosRequestConfig) => {
//         NProgress.start();
//         // * 将当前请求添加到 pending 中
//         axiosCanceler.addPending(config);
//         // * 如果当前请求不需要显示 loading,在api服务中通过指定的第三个参数: { headers: { noLoading: true } }来控制不显示loading，参见loginApi
//         config.headers!.noLoading || showFullScreenLoading();
//         const token: string = store.getState().global.token;
//         return {
//           ...config,
//           headers: { ...config.headers, "x-access-token": token },
//         };
//       },
//       (error: AxiosError) => {
//         return Promise.reject(error);
//       }
//     );

//     /**
//      * @description 响应拦截器
//      *  服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
//      */
//     this.service.interceptors.response.use(
//       (response: AxiosResponse) => {
//         const { data, config } = response;
//         NProgress.done();
//         // * 在请求结束后，移除本次请求(关闭loading)
//         axiosCanceler.removePending(config);
//         tryHideFullScreenLoading();
//         // * 登录失效（code == 599）
//         if (data.code == ResultEnum.OVERDUE) {
//           store.dispatch(setToken(""));
//           message.error(data.msg);
//           window.location.hash = "/login";
//           return Promise.reject(data);
//         }
//         // * 全局错误信息拦截（防止下载文件得时候返回数据流，没有code，直接报错）
//         if (data.code && data.code !== ResultEnum.SUCCESS) {
//           message.error(data.msg);
//           return Promise.reject(data);
//         }
//         // * 成功请求（在页面上除非特殊情况，否则不用处理失败逻辑）
//         return data;
//       },
//       async (error: AxiosError) => {
//         const { response } = error;
//         NProgress.done();
//         tryHideFullScreenLoading();
//         // 请求超时单独判断，请求超时没有 response
//         if (error.message.indexOf("timeout") !== -1)
//           message.error("请求超时，请稍后再试");
//         // 根据响应的错误状态码，做不同的处理
//         if (response) checkStatus(response.status);
//         // 服务器结果都没有返回(可能服务器错误可能客户端断网) 断网处理:可以跳转到断网页面
//         if (!window.navigator.onLine) window.location.hash = "/500";
//         return Promise.reject(error);
//       }
//     );
//   }

//   // * 常用请求方法封装
//   get<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
//     return this.service.get(url, { params, ..._object });
//   }
//   post<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
//     return this.service.post(url, params, _object);
//   }
//   put<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
//     return this.service.put(url, params, _object);
//   }
//   delete<T>(url: string, params?: any, _object = {}): Promise<ResultData<T>> {
//     return this.service.delete(url, { params, ..._object });
//   }
// }
// export default new RequestHttp(config);
