import Taro from "@tarojs/taro";
import { IImgResultModel } from "@/api/model/baseModel";

// interface IIsMobile{
//   ()=>void
// }

export const isDev = (system: string) => {
  return ["development"].includes(system);
};

export const isMobile = (system: string) => {
  return ["AndroidOS", "iOS"].includes(system);
};

export const isWeapp = (system: string) => {
  return ["weapp"].includes(system);
};

// 需要深拷贝
export const imgsListToTree = (lists: IImgResultModel[]): IImgResultModel[] => {
  const array: IImgResultModel[] = [];
  lists.forEach((item) => {
    // 遍历对象数组
    item.children = lists.filter(
      (list) => list.category_id === item.category_id && list.is_primary === 0
    ); // 找到每个对象的子节点
    if (item.is_primary === 1) {
      array.push(item); // 将一层节点放入新数组中
    }
  });
  return array; //循环结束，返回结果
};

/**
 * 分析 url 地址，将解析的结果作为对象返回，返回属性有：
 * 1. href - 完整 URL 地址
 * 2. protocol - 协议
 * 3. username - 用户名
 * 4. password - 密码
 * 5. host - 域名地址
 * 6. hostname - 域名名称
 * 7. port - 端口号
 * 8. path - 路径
 * 9. pathname - 路径名
 * 10. search - 查询参数
 * 11. hash - 哈希值
 * 12. origin
 * ====================================================
 * @param {String} url - URL地址
 * @param {String} [base] - 基准 URL 地址
 * @returns {Object}
 */
export const parseURL = (url: string, base: string): object => {
  const getURLSearchParams = (url1) => {
    return (url1.match(/([^?=&]+)(=([^&]*))/g) || []).reduce((a, v) => {
      return (a[v.slice(0, v.indexOf("="))] = v.slice(v.indexOf("=") + 1)), a;
    }, {});
  };

  const parseURLWithRegExp = (URL) => {
    const pattern =
        /^(([^:/?#]+):)?\/\/(([^/?#]+):(.+)@)?([^/?#:]*)(:(\d+))?([^?#]*)(\\?([^#]*))?(#(.*))?/,
      matches = URL.match(pattern),
      hostname = matches[6],
      port = matches[8] || "",
      pathname = matches[11] || "/",
      search = matches[10] || "",
      searchParams = (() => {
        const params = getURLSearchParams(URL);

        return {
          get(name) {
            return params[name] || "";
          },
        };
      })();

    return {
      href: URL,
      origin: (matches[1] ? matches[1] + "//" : "") + hostname,
      protocol: matches[2] || "",
      username: matches[4] || "",
      password: matches[5] || "",
      hostname,
      port,
      host: hostname + port,
      pathname,
      search,
      path: pathname + search,
      hash: matches[13] || "",
      searchParams,
    };
  };

  const parseURLWithURLConstructor = (newUrl) => {
    const results = new URL(newUrl);
    const protocol = results.protocol.replace(":", "");

    return {
      href: newUrl,
      origin: results.origin,
      protocol,
      username: results.username,
      password: results.password,
      hostname: results.hostname,
      port: results.port,
      host: results.host,
      pathname: results.pathname,
      search: results.search,
      path: results.pathname + results.search,
      hash: results.hash,
      searchParams: results.searchParams,
    };
  };

  // url 是为度路径时，忽略 base
  if (/^(([^:/?#]+):)/.test(url)) {
    base = "";
  }

  // 设置了基准 URL
  if (base) {
    // 移除 base 最后的斜杠 ‘/’
    if (/[/]$/.test(base)) {
      base = base.replace(/[/]$/, "");
    }

    // 确保 url 开始有斜杠
    if (!/^[/]/.test(url)) {
      url = "/" + url;
    }

    // 保证 URL 地址拼接后是一个正确的格式
    url = base + url;
  }

  if (window.ActiveXObject) {
    return parseURLWithRegExp(url);
  } else {
    return parseURLWithURLConstructor(url);
  }
};

function stringify(value: any): string {
  return JSON.stringify(value);
}

function parse<T>(value: string): T | null {
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    return null;
  }
}

interface ILocalStore {
  setValue(key: string, data: any): ILocalStore;
  getValue<T>(key: string, defaultValue?: T): T | null;
  removeValue(key: string): ILocalStore;
}

const LocalStore: ILocalStore = {
  setValue(key: string, data: any): ILocalStore {
    localStorage.setItem(key, stringify(data));
    return this;
  },
  getValue<T>(key: string, defaultValue?: T): T | null {
    const value = localStorage.getItem(key);

    if (!value) return defaultValue || null;
    const data = parse<T>(value);
    return data;
  },
  removeValue(key: string): ILocalStore {
    localStorage.removeItem(key);
    return this;
  },
};

export default LocalStore;
