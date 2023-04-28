import Taro from "@tarojs/taro";
import { getToken, getWeappToken, getOpenId } from "@/api/index";
import store from "@store/index";
import { setUserInfo } from "@/store/profile";

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
          const weappUserInfo = await getToken({ code, data: params });
          if (!weappUserInfo.status) return;
          Object.assign(userInfo, weappUserInfo.data);
          Taro.setStorageSync("userInfo", weappUserInfo.data);
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
