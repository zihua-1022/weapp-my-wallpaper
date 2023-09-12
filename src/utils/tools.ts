import { ICategoryResult } from "@/api/model/categoryModel";
import { IPcImgResult } from "@/api/model/computerModel";

export type TImgsTreeData = ICategoryResult & {
  mid: number | string;
  page: number;
  total?: number;
  children: IPcImgResult[];
};

export const isDev = (system: string) => {
  return ["development", "dev"].includes(system);
};

export const isMobile = (system: string) => {
  return ["AndroidOS", "iOS"].includes(system);
};

export const isWeapp = (system: string) => {
  return ["weapp"].includes(system);
};

export const arrCompositeTree = (
  source: IPcImgResult[],
  target: IPcImgResult[],
  dataTotal: number
): TImgsTreeData[] => {
  console.log("source: ", source);
  const tree = source.map((item) => {
    // 遍历对象数组
    const children: IPcImgResult[] = [];
    let total = 0;
    if (item.cid === target[0].cid) {
      // 找到每个对象的子节点x
      children.push(...target);
      total = dataTotal;
    }
    return {
      cid: item.cid,
      categoryName: item.categoryName,
      total,
      page: 0,
      children,
    };
  });
  return tree; //循环结束，返回结果
};

// 需要深拷贝
export const imgsListToTree = (lists: IPcImgResult[]): TImgsTreeData[] => {
  const array: TImgsTreeData[] = [];
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

export const imgsListToTree2 = (lists: IPcImgResult[]): TImgsTreeData[] => {
  const preList: TImgsTreeData[] = [];
  const treeData = lists.reduce((pre, cur) => {
    const existedNode = pre.find((node) => node.mid === cur.mid);
    if (existedNode) {
      existedNode.children.push(cur);
    } else {
      const { mid, cTitle, cDesc } = cur;
      pre.push({
        mid,
        cTitle,
        cDesc,
        children: [cur],
      });
    }
    return pre;
  }, preList);
  return treeData; //循环结束，返回结果
};
// // 定义一个辅助函数，用于根据 mid 对数据进行分组
// function groupDataByMid(data) {
//   const groupedData = {};
//   for (const item of data) {
//     const { mid, img_desc } = item;
//     if (groupedData[mid]) {
//       groupedData[mid].children.push(item);
//     } else {
//       groupedData[mid] = {
//         desc: img_desc,
//         children: [item]
//       };
//     }
//   }
//   return Object.values(groupedData);
// }

export const getCurrentTime = (format: string) => {
  // 将一个字符串用另一个字符串填充到指定的长度
  const fillString = (
    data: string | number,
    length?: number,
    target?: string
  ) => {
    return data.toString().padStart(length || 2, target || "0");
  };

  // 获取当前本地时间
  const now = new Date();
  // 获取年、月、日、星期
  const year = now.getFullYear(); // 年份，例如：2023
  const month = now.getMonth() + 1; // 月份，注意月份从0开始计算，所以需要加1，例如：7
  const day = now.getDate(); // 日期，例如：5
  const weekday = now.getDay(); // 星期几，注意星期日是0，星期一是1，以此类推

  // 星期几的中文表示
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  const chineseWeekday = weekdays[weekday]; // 星期几的中文表示，例如：二

  // 获取时、分、秒
  const hour = now.getHours(); // 小时，例如：10
  const minute = now.getMinutes(); // 分钟，例如：03
  const second = now.getSeconds(); // 秒数，例如：00

  const result = {
    ymd: `${year}年${month}月${day}日`,
    mdw: `${month}月${fillString(day)}日周${chineseWeekday}`,
    hms: `${hour}:${minute}:${second}`,
    hm: `${fillString(hour)}:${fillString(minute)}`,
  };
  return result[format];
};

export const uuid = () => {
  const arr = [];
  const hexDigits = "0123456789abcdef";
  for (let i = 0; i < 36; i++) {
    arr[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  arr[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  arr[19] = hexDigits.substr((arr[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  arr[8] = arr[13] = arr[18] = arr[23] = "-";

  const uuid = arr.join("");
  return uuid;
};

/**
 * 对象数组去重（根据id/key属性）
 * @param {String} objArr - 对象数组
 * @returns {Array}
 */
export const objArrayDuplicate = (objArr: []) => {
  const tempObj = {};
  const res = objArr.reduce((item, next) => {
    if (tempObj[next.key || next.id]) {
    } else {
      tempObj[next.key || next.id] = true;
      item.push(next);
    }
    // tempObj[next.id] ? "" : (tempObj[next.id] = true && item.push(next));
    return item;
  }, []);
  return res;
};

/**
 * 获取对象数组差集（根据id/key属性）
 * @param {Array} sourceArr - 待处理对象数组
 * @param {Array} targetArr - 条件对象数组
 * @returns {Array}
 */
export const getArrayDifference = <T>(sourceArr: T[], targetArr: T[]): T[] => {
  let targetIds = {};
  targetArr.forEach((item) => {
    targetIds[item.key || item.id] = true;
  });

  return sourceArr.filter((obj) => !targetIds[obj.key || obj.id]);
};

/**
 * 获取对象数组交集（根据id/key属性）
 * @param {Array} sourceArr - 待处理对象数组
 * @param {Array} targetArr - 条件对象数组
 * @returns {Array}
 */
export const getArrayIntersection = <T>(
  sourceArr: T[],
  targetArr: T[]
): T[] => {
  const targetIds = new Set(targetArr.map((item) => item.key || item.id));
  return sourceArr.filter((obj) => targetIds.has(obj.key || obj.id));
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
