export interface IStatusCode {
  // BASE_NAME?: string;
  SUCCESS_CODE: number;
  LOGIN_EXPIRE: number;
  // TOKEN_KEY: string;
  // BASE_URL?: string; // url = base url + request url
  // TIMEOUT: number; // request timeout （10s）
  // API_URL: string;
  // withCredentials?: boolean; // send cookies when cross-domain requests
  // layout: "side" | "top";
  // theme: "dark" | "light";
  // fixedHeader: boolean;
  // contentWidth: "fluid" | "fixed";
  // colorWeak: boolean;
  // title: string;
  // logo?: string;
}

export const serverMap = {
  development: {
    weapp: "http://10.40.60.188:3000",
    static: "http://10.40.60.188:3000",
  },
  production: {
    weapp: "http://10.40.60.188:3000",
    static: "http://10.40.60.188:3000",
  },
  default: {
    weapp: "http://10.40.60.188:3000",
    static: "http://10.40.60.188:3000",
  },
};

export const urlTools = {
  prefix: "apis",
  formatter: function (url: string, preVal: string, targetVal: string) {
    let res = url;
    console.log("url: ", url);
    console.log('url.startsWith("weapp"): ', url.startsWith(preVal));
    if (res.startsWith(preVal)) {
      res = res.replace(preVal, targetVal);
    }
    return res;
  },
};

export const statusCode: IStatusCode = {
  // 请求成功状态码
  SUCCESS_CODE: 200,
  // 登录过期，或者未登录
  LOGIN_EXPIRE: 400,
  // // 本地存储token的key
  // TOKEN_KEY: "Authorization",
};

// export const serviceConfig: IConfig = {
//   // react-router basename
//   BASE_NAME: "zihua",
//   // 请求成功状态码
//   SUCCESS_CODE: 200,
//   // 登录过期，或者未登录
//   LOGIN_EXPIRE: 400,
//   // 本地存储token的key
//   TOKEN_KEY: "Authorization",
//   BASE_URL: process.env.VUE_APP_BASE_API,
//   TIMEOUT: 10000,
//   withCredentials: true,
//   // 统一请求地址
//   API_URL: "https://www.landluck.cn/react-ant-admin-api",
//   // 默认菜单栏位置
//   layout: "side",
//   // 默认主题颜色
//   theme: "dark",
//   // 是否固定头部
//   fixedHeader: false,
//   // 固定宽度或者流式宽度
//   contentWidth: "fixed",
//   // 是否开启色弱模式
//   colorWeak: false,
//   // 项目名称
//   title: "React Ant Admin",
//   // logo
// };

// export default AdminConfig;
