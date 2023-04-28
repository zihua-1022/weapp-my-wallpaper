import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AtIcon } from "taro-ui";
import Taro, { getUserInfo } from "@tarojs/taro";
import { View, Button, Image, Text, Icon } from "@tarojs/components";
import CustomNavBar from "@components/CustomNavBar";
import ImageCard from "@components/ImageCard";
import Card from "@components/Card";
// import { getUserInfo } from "@/api/profile";
import { getUserInfoAuth, weappLogin } from "@utils/weapp";
import { RootState } from "@store/index";

// import img1 from "@assets/img/kobe.png";
import logo from "@assets/img/logo.png";

// import "taro-ui/dist/style/components/button.scss"; // 按需引入
import styles from "./index.module.less";

export type TCardData = {
  id: number;
  leftIcon?: string;
  content: string;
  rightIcon?: string;
};

export interface IProfileProps {
  cardDataSource: TCardData[];
}

const Profile: React.FC = () => {
  const userInfo = useSelector((state: RootState) => state.profile);
  const [cardDataSource, setCardDataSource] = useState<TCardData[]>([]);

  const getWeappUserInfo = () => {
    if (userInfo.user_id) return;
    getUserInfoAuth()
      .then((res) => {
        weappLogin(res);
      })
      .catch((err) => {
        console.log("err: ", err);
      });
  };

  const toProfileDetails = () => {
    Taro.showToast({
      title: "敬请期待！",
      icon: "none",
    });
  };

  useEffect(() => {
    setCardDataSource([
      {
        id: 1,
        leftIcon: "success",
        content: "login",
      },
      {
        id: 2,
        leftIcon: "success_no_circle",
        content: "联系我们",
      },
    ]);
    console.log(111122);
  }, []);

  return (
    <View className="app">
      <CustomNavBar />
      <View className={styles["profile"]}>
        <View className={styles["profile-header"]}>
          <View className={styles["header-left"]} onClick={getWeappUserInfo}>
            <Image className={styles["image"]} src={userInfo.avatar}></Image>
            <Text className={styles["text"]}>
              {userInfo.nickname || "点击登录"}
            </Text>
          </View>
          {userInfo.user_id && (
            <View className={styles["header-right"]} onClick={toProfileDetails}>
              <Text className={styles["desc"]}>个人主页</Text>
              <AtIcon
                // className={styles["icon"]}
                value="chevron-right"
                size="21"
                color="#000"
              ></AtIcon>
            </View>
          )}

          {/* <ImageCard
            dataSource={[{ id: 1, path: logo }]}
            style={{
              gridTemplateColumns: "100%",
            }}
            imgStyle={{
              height: "120px",
              borderRadius: "12px",
            }}
          /> */}
          {/* <Card
            style={{ background: "transparent" }}
            imgDataSource={[
              {
                id: 1,
                src: avatar,
                desc: nickname,
                // style?: {},
              },
            ]}
          ></Card> */}
        </View>
        <View className={styles["profile-main"]}>
          {cardDataSource.length &&
            cardDataSource.map((item) => {
              return (
                <Card key={item.id} style={{ marginTop: "10px" }}>
                  <View className={styles["card-content"]}>
                    <Icon
                      className={styles["icon"]}
                      size="25"
                      type={item.leftIcon}
                    />
                    <View className={styles["desc"]}>{item.content}</View>
                  </View>
                </Card>
              );
            })}
        </View>
      </View>
    </View>
  );
};

export default Profile;
