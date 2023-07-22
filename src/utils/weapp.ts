import Taro from "@tarojs/taro";
import { getToken, getWeappToken, getOpenId } from "@/api/index";
import store from "@store/index";
import { initialState, setUserInfo } from "@store/profile";
import { serverMap } from "../services/config";

const proxy = serverMap[process.env.NODE_ENV || "default"]["static"];

export interface IUserProfile {
  encryptedData: string;
  errMsg: string;
  iv: string;
  signature: string;
  userInfo: {
    avatarUrl: string;
    nickName: string;
  };
}

export type TFile = {
  id: number;
  name?: string;
  path?: string;
  size?: number;
  width?: number;
  height?: number;
  imgType?: string;
  url: string;
  file?: {
    path: string;
    size: number;
  };
};

export const uploadFile = (
  files: TFile[],
  formData: {},
  callback?: (data: string[]) => void
) => {
  const uploadRes: string[] = [];
  return new Promise((resolve, reject) => {
    files.forEach((file, index) => {
      Taro.uploadFile({
        url: `${proxy}/v1/account/uplaod-file`, // 上传图片的服务器接口地址
        filePath: file.url,
        name: "image", // 服务器接收图片的字段名
        formData,
        success: (res) => {
          console.log("res: ", res);
          if (res.statusCode === 200) {
            // 上传成功
            console.log("上传成功", res.data);
            if (files.length === uploadRes.length) {
              resolve(res.data);
              if (callback) {
                callback(uploadRes);
              }
            }
            uploadRes.push(res.data);
          } else {
            // 上传失败
            console.log("上传失败", res);
            // reject(res);
            uploadRes.push("上传失败");
            if (files.length === uploadRes.length) {
              reject(uploadRes);
              if (callback) {
                callback(uploadRes);
              }
            }
          }
        },
        fail: (err) => {
          // 上传出错
          console.log("上传出错", err);
          reject(err);
          uploadRes.push("上传出错");
        },
      });
    });
  });
};

export const downloadFile = (path: string) => {
  return new Promise((resolve, reject) => {
    Taro.downloadFile({
      url: path, // 图片的 URL
      success: (res) => {
        if (res.statusCode === 200) {
          // 下载成功，res.tempFilePath 为下载后的临时文件路径
          Taro.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              resolve("保存成功");
            },
            fail: ({ errMsg }) => {
              reject(errMsg);
            },
          });
        } else {
          reject("下载失败");
          // 下载失败
          console.log("下载失败", res);
        }
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};

export const updateUserNickName = (nickName: string) => {
  const weappUserInfo = Taro.getStorageSync("userInfo");
  Taro.setStorageSync("userInfo", {
    ...weappUserInfo,
    nickName,
  });
  store.dispatch(setUserInfo({ nickName }));
};

// 检查登录是否失效
export const checkUserLogin = async () => {
  Taro.checkSession()
    .then((res) => {
      console.log("res: ", res);
      if (res.errMsg === "checkSession:ok") {
      }
    })
    .catch(() => {
      weappLogin({});
    });
};

export const weappLogin = (params: {}) => {
  Taro.login()
    .then(async ({ code }) => {
      if (code) {
        try {
          const userInfo = {};
          const weappUserInfo = await getToken({ code, userInfo: params });
          if (!weappUserInfo.status) return;
          Object.assign(userInfo, weappUserInfo.data);
          const weappToken = await getWeappToken();
          console.log("weappToken: ", weappToken);
          if (weappToken.status) {
            Object.assign(userInfo, {
              weappAuth: weappToken.data,
            });
          }
          Taro.setStorageSync("userInfo", userInfo);
          store.dispatch(setUserInfo(weappUserInfo.data));
        } catch (err) {
          console.log("err: ", err);
        }

        // Taro.setStorageSync("passwordKey", data.iv);
        // await getOpenId({ code }).then((res) => {
        //   Taro.setStorageSync("user_id", res.data.token.openid);
        // });
        // await queryUserInfo().then(({ data }) => {
        //   if (data) {
        //     store.dispatch(SAVE_USER_INFO(data));
        //   }
        // });
      }
    })
    .catch(() => {
      Taro.showToast({ title: "网络异常 ，拉取数据失败", icon: "none" });
    });
};

// 点击按钮或其他操作的事件处理函数
export const getUserInfoAuth = (): Promise<IUserProfile> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { authSetting } = await Taro.getSetting();
      if (authSetting["scope.userInfo"]) {
        const userProfile = await Taro.getUserProfile({
          desc: "获取用户信息",
          lang: "zh_CN",
        });
        console.log("userProfile: ", userProfile);
        resolve(userProfile);
      }
    } catch ({ errMsg }) {
      reject(new Error(errMsg));
    }
  });

  // 如果用户未授权获取用户信息，则弹窗提示用户授权
};

export const weappLogout = (): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      Taro.removeStorageSync("userInfo");
      store.dispatch(setUserInfo(initialState));
      resolve("");
    } catch ({ errMsg }) {
      reject(new Error(errMsg));
    }
  });
};
