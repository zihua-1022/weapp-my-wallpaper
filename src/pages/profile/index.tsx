import { useState } from "react";
import {
  View,
  Text,
  Button,
  NavigationBar,
  PageMeta,
} from "@tarojs/components";
import { AtButton, AtTabBar } from "taro-ui";
import Taro from "@tarojs/taro";

// import "taro-ui/dist/style/components/button.scss"; // 按需引入
import "./index.less";

function Home() {
  const [current, setCurrent] = useState<number>(0);
  const [userName, setUserName] = useState("zihua");
  const toBlogPage = () => {
    Taro.navigateTo({ url: "/pages/blog/index?blogTitle=" });
  };

  const handleClick = (value: number) => {
    console.log("value: ", value);
    setCurrent(value);
  };
  return (
    <View className="index">
      <Text>Hello world!</Text>
      <AtButton type="primary">I need Taro UI</AtButton>
      <Text>Taro UI 支持 Vue 了吗？</Text>
      {/* <AtTabBar
        fixed
        tabList={[
          { title: "0", iconType: "home" },
          { title: "1", text: 8 },
          { title: "2", iconType: "heart" },
          { title: "3", text: "new" },
          { title: "4", dot: true },
        ]}
        onClick={handleClick}
        current={current}
      /> */}
    </View>
  );
}

export default Home;
