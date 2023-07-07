import React, { useEffect } from "react";
import { Provider } from "react-redux";
import Taro from "@tarojs/taro";
import "taro-ui/dist/style/index.scss"; // 引入组件样式 - 方式一
import store from "@store/index";
import { setUserInfo } from "@store/profile";
import { SetNavBar } from "@store/navBar";
import { isWeapp } from "./utils/tools";

import "./app.less";

//React18中props删除了children属性，当我们的在ts环境下使用props.children会报错
//定义一个Iprops的interface，指定children属性，因为children是可有可无的，所以设置为可选属性，类型为React.ReactNode
interface IProps {
  children?: React.ReactNode;
}

const App = (props: IProps) => {
  useEffect(() => {
    const info = Taro.getSystemInfoSync();
    if (!isWeapp(process.env.TARO_ENV)) {
      store.dispatch(
        SetNavBar({
          totalHeight: 56,
          statusBarHeight: 14,
          navBarHeight: 42,
          windowWidth: info.windowWidth,
          windowHeight: info.windowHeight,
        })
      );
      return;
    }
    // weappLogin();
    // h5 app mp-alipay
    // 获取胶囊的位置
    const menuButtonInfo = Taro.getMenuButtonBoundingClientRect();
    const statusBarHeight = info.statusBarHeight ?? 0;
    const userInfo = Taro.getStorageSync("userInfo");
    // const { avatar, nickname, token, user_id } = userInfo;
    store.dispatch(
      SetNavBar({
        totalHeight:
          statusBarHeight +
          (menuButtonInfo.bottom - statusBarHeight) +
          (menuButtonInfo.top - statusBarHeight) +
          4, // 总高度
        statusBarHeight: statusBarHeight, // 状态栏高度
        navBarHeight:
          menuButtonInfo.bottom -
          statusBarHeight +
          (menuButtonInfo.top - statusBarHeight) +
          4, // 导航栏高度
        windowWidth: info.windowWidth,
        windowHeight: info.windowHeight,
        // navStyle: "",
        navOpacity: 0,
        navInpWid: menuButtonInfo.left - (info.windowWidth / 375) * 70,
        navRemain: menuButtonInfo.left - (info.windowWidth / 375) * 70,
        widRemain: (info.windowWidth / 375) * 70,
        // scrollTop: 0,
        // imgOpacity: 1,
      })
    );
    store.dispatch(setUserInfo(userInfo));
    // (胶囊底部高度 - 状态栏的高度) + (胶囊顶部高度 - 状态栏的高度) = 导航栏的高度
    // this.state.windowWidth = menuButtonInfo.left
  }, []);
  // this.props.children 是将要会渲染的页面
  return <Provider store={store}>{props.children}</Provider>;
};

export default App;
