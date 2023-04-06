import { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  NavigationBar,
  PageMeta,
} from "@tarojs/components";
import Taro from "@tarojs/taro";
import ImageCard from "@components/ImageCard";
import Swiper, { IimgProps } from "@components/Swiper";
import img1 from "@assets/img/kobe.png";
import img2 from "@assets/img/测试2.jpg";
import img3 from "@assets/img/测试3.jpg";
import img4 from "@assets/img/测试4.jpg";
import img5 from "@assets/img/测试5.jpg";

// import "taro-ui/dist/style/components/button.scss"; // 按需引入
import "./index.less";

function Home() {
  const [current, setCurrent] = useState<number>(0);
  const [imgsData, setImgsData] = useState<IimgProps[]>([]);
  const toBlogPage = () => {
    Taro.navigateTo({ url: "/pages/blog/index?blogTitle=" });
  };

  const handleClick = (value: number) => {
    console.log("value: ", value);
    setCurrent(value);
  };

  useEffect(() => {
    const imgs = [
      { id: 1, path: img1 },
      { id: 2, path: img2 },
      { id: 3, path: img3 },
      { id: 4, path: img4 },
      { id: 5, path: img5 },
    ];
    setImgsData(imgs);
  }, []);

  return (
    <View className="home">
      <View className="home-header">
        <Swiper dataSource={imgsData}></Swiper>
      </View>
      <View className="home-main">
        <Text>今日推荐</Text>
        <ImageCard
          dataSource={[
            { id: 1, path: img1 },
            { id: 2, path: img2 },
            { id: 3, path: img3 },
            { id: 4, path: img4 },
            { id: 5, path: img5 },
          ]}
          style={{
            gridTemplateColumns: "48% 48%",
            columnGap: "4%",
          }}
        />
      </View>

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
