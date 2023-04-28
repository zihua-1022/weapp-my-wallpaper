import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@store/index";
import classNames from "classnames";
import { View, Text } from "@tarojs/components";
import SearchBox from "@components/SearchBox";
import CustomNavBar from "@components/CustomNavBar";
import ImageCard from "@components/ImageCard";
import Swiper, { IImgProps } from "@components/Swiper";
import { getDailyRecommend, getDailyPopular } from "@/api/home";
import { serverMap } from "@/services/config";

// import img1 from "@assets/img/kobe.png";
// import img2 from "@assets/img/测试2.jpg";
// import img3 from "@assets/img/测试3.jpg";
// import img4 from "@assets/img/测试4.jpg";
// import img5 from "@assets/img/测试5.jpg";

// import "taro-ui/dist/style/components/button.scss"; // 按需引入
import styles from "./index.module.less";

function Home() {
  const navBarStyle = useSelector((state: RootState) => state.navBar);
  const [recommendImgs, setRecommendImgs] = useState<IImgProps[]>([]);
  const [popularImgs, setPopularImgs] = useState<IImgProps[]>([]);
  const handleSearch = (keyword: string) => {
    console.log(`搜索关键词：${keyword}`);
  };
  useEffect(() => {
    getDailyRecommend().then((res) => {
      console.log("res: ", res);
      const { status, data } = res;
      if (status) {
        const result = data.map((item) => {
          const proxy = serverMap[process.env.NODE_ENV || "default"]["static"];
          item.path = proxy + "/" + item.path;
          return {
            ...item,
          };
        });
        console.log("item: ", result);
        setRecommendImgs(result);
      }
    });
    getDailyPopular().then((res) => {
      const { status, data } = res;
      if (status) {
        const result = data.map((item) => {
          const proxy = serverMap[process.env.NODE_ENV || "default"]["static"];
          item.path = proxy + "/" + item.path;
          return {
            ...item,
          };
        });
        console.log("item: ", result);
        setPopularImgs(result);
      }
    });
    // const imgs = [
    //   // { id: 1, path: img1 },
    //   // { id: 2, path: img2 },
    //   // { id: 3, path: img3 },
    //   // { id: 4, path: img4 },
    //   // { id: 5, path: img5 },
    // ];
    // setImgsData(imgs);
  }, []);

  return (
    <View className={classNames("app", styles["home"])}>
      <CustomNavBar>
        <SearchBox onSearch={handleSearch} />
      </CustomNavBar>
      <View
        className={classNames("app-main", styles["home-main"])}
        // style={{
        //   // paddingTop: `${navBarStyle.totalHeight}px`,
        //   height: `calc(100vh - ${navBarStyle.totalHeight}px)`,
        //   position: "relative",
        //   // marginTop: `${navBarStyle.totalHeight}px`,
        //   overflowY: "auto",
        // }}
      >
        <View className={styles["home-header"]}>
          <Swiper dataSource={recommendImgs}></Swiper>
        </View>
        <View
          className={styles["home-content"]}
          style={{ padding: "0 14px 14px" }}
        >
          <View
            style={{ margin: "12px 0", textAlign: "center", color: "#fff" }}
          >
            -今日推荐-
          </View>
          <ImageCard
            dataSource={popularImgs}
            style={{
              gridTemplateColumns: "48% 48%",
              columnGap: "4%",
            }}
          />
        </View>
      </View>
    </View>
  );
}

export default Home;
