import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AtIcon } from "taro-ui";
import classNames from "classnames";
import Taro from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import CustomNavBar from "@components/CustomNavBar";
import ImageCard, { TDataSource } from "@components/ImageCard";
import Card from "@components/Card";
import { getUserInfoAuth, weappLogin, weappLogout } from "@utils/weapp";
import { RootState } from "@store/index";

import Logo from "@assets/img/logo.png";
import Subscribe from "@assets/img/profile/subscribe_update.jpg";

import styles from "./index.module.less";

export type TCardData = {
  id: number;
  leftIcon?: string;
  content: string;
  rightIcon?: string;
};

const Profile: React.FC = () => {
  const userInfo = useSelector((state: RootState) => state.profile);
  console.log("userInfo: ", userInfo);
  const [cardDataSource, setCardDataSource] = useState<TCardData[]>([]);
  const [imgsListData, setImgsListData] = useState<TDataSource[]>([]);

  const removeWeappUserInfo = () => {
    Taro.showModal({
      // title: '提示',
      content: "确定退出登录吗？",
      success: function (res) {
        if (res.confirm) {
          weappLogout();
          // Taro.reLaunch({
          //   url: "/pages/profile/index", // tabBar 页面的路径
          // });
          // 用户点击了确定按钮
          // 执行退出操作
        } else if (res.cancel) {
          console.log("用户点击了取消按钮");
          // 用户点击了取消按钮
          // 可选择执行其他操作或不做任何处理
        }
      },
    });
  };

  const getWeappUserInfo = () => {
    if (userInfo.userId) return;
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
        content: "邀请好友",
      },
      {
        id: 2,
        leftIcon: "success_no_circle",
        content: "领取花花",
      },
      {
        id: 3,
        leftIcon: "success",
        content: "获取花花",
      },
      {
        id: 4,
        leftIcon: "success",
        content: "我的下载",
      },
      {
        id: 5,
        leftIcon: "success",
        content: "联系我们",
      },
      {
        id: 6,
        leftIcon: "success",
        content: "关于我们",
      },
    ]);
    const data = [
      {
        id: 1,
        imgName: "zihua",
        operationTitle: "订阅壁纸推送",
        operationDesc: "获取每周最新壁纸通知",
        operate: "立即查看",
        isHot: 0,
        isPhone: 0,
        isPrimary: 1,
        isRecommend: 1,
        path: Subscribe,
      },
    ];
    setImgsListData(data);
  }, []);

  return (
    <View className={classNames("app", styles["profile"])}>
      <CustomNavBar isShowLogo={false} />
      <View className="app-main">
        <View className={styles["profile-header"]}>
          <View className={styles["header-left"]} onClick={getWeappUserInfo}>
            <Image className={styles["image"]} src={userInfo.avatar}></Image>
            <Text className={styles["text"]}>
              {userInfo.nickName || "点击登录"}
            </Text>
          </View>
          {userInfo.userId && (
            <View className={styles["header-right"]} onClick={toProfileDetails}>
              <Text className={styles["desc"]}>我的收藏</Text>
              <AtIcon
                // className={styles["icon"]}
                value="chevron-right"
                size="18"
                color="#8a2be2"
              ></AtIcon>
            </View>
          )}
        </View>
        <View className={styles["profile-main"]}>
          <ImageCard
            dataSource={imgsListData}
            style={{
              gridTemplateColumns: "100%",
              columnGap: "4%",
            }}
            imgStyle={{
              height: "150px",
            }}
          />
          {cardDataSource.length && (
            <View className={styles["action"]}>
              {cardDataSource.map((item) => {
                return (
                  <Card key={item.id} className={styles["action-card"]}>
                    {/* <View
                    className={styles["card-content"]}
                    onClick={removeWeappUserInfo}
                  > */}
                    <Image className={styles["image"]} src={Logo}></Image>
                    <View className={styles["desc"]}>{item.content}</View>
                    {/* </View> */}
                  </Card>
                );
              })}
            </View>
          )}
          {userInfo.userId && (
            <View
              className={styles["profile-footer"]}
              onClick={removeWeappUserInfo}
            >
              退出登录
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default Profile;
