import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AtIcon } from "taro-ui";
import classNames from "classnames";
import Taro from "@tarojs/taro";
import {
  View,
  Image,
  Text,
  Button,
  Input,
  PageContainer,
} from "@tarojs/components";
import CustomNavBar from "@components/CustomNavBar";
import ImageCard, { TDataSource } from "@components/ImageCard";
import Card from "@components/Card";
import TabBar from "@components/TabBar";
import UploadImage from "@components/UploadImage";
import { weappLogin, weappLogout, updateUserNickName } from "@utils/weapp";
import store, { RootState } from "@store/index";
import { setShowTabBar } from "@store/tabBar";

import { getTabBarImg } from "@assets/img/tabBar";
import Logo from "@assets/img/logo.png";
import Subscribe from "@assets/img/profile/subscribe_update.jpg";

import styles from "./index.module.less";

export type TCardData = {
  id: number;
  leftIcon?: string;
  content: string;
  rightIcon?: string;
  onClick?: () => void;
};

const Profile: React.FC = () => {
  const userInfo = useSelector((state: RootState) => state.profile);
  console.log("userInfo: ", userInfo);
  const defaultNickName = "用户007";
  const [cardDataSource, setCardDataSource] = useState<TCardData[]>([]);
  const [imgsListData, setImgsListData] = useState<TDataSource[]>([]);
  const [nickName, setNickName] = useState<string>(userInfo.nickName);
  const [showPage, setShowPage] = useState(false);

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

  const getWeappUserInfo = (e: { detail: { avatarUrl: string } }) => {
    const { avatarUrl } = e.detail;
    weappLogin({ nickName: defaultNickName, avatarUrl, gender: 0 });
    setNickName(defaultNickName);
  };

  const updateWeappUserInfo = (e: {
    detail: { pass: boolean; timeout: boolean };
  }) => {
    const { pass, timeout } = e.detail;
    if (pass) {
      Taro.createSelectorQuery()
        .select("#input-nickname")
        .fields({ properties: ["value"] })
        .exec((res) => {
          const inputValue = res[0]?.value; // 获取 input 节点的值
          if (inputValue === defaultNickName) {
            return;
          }
          setNickName(inputValue);
          updateUserNickName(inputValue);
        });
    }
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
      // {
      //   id: 2,
      //   leftIcon: "success_no_circle",
      //   content: "领取花花",
      // },
      // {
      //   id: 3,
      //   leftIcon: "success",
      //   content: "获取花花",
      // },
      {
        id: 3,
        leftIcon: "success",
        content: "我的下载",
        onClick: () => {},
      },
      {
        id: 4,
        leftIcon: "success",
        content: "我的上传",
        onClick: () => {
          store.dispatch(setShowTabBar(false));
          setShowPage(true);
        },
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
        imgColor: "#3b504e",
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
          <View className={styles["header-left"]}>
            {!userInfo.userId && (
              <Button
                className={styles["avatar-wrapper"]}
                openType="chooseAvatar"
                onChooseAvatar={getWeappUserInfo}
              >
                <Image
                  className={styles["avatar"]}
                  src={userInfo.avatar || ""}
                ></Image>
                <Text className={styles["nickname"]}>点击登录</Text>
              </Button>
            )}
            {userInfo.userId && (
              <>
                <Image
                  className={styles["avatar"]}
                  src={userInfo.avatar || ""}
                ></Image>
                <Input
                  id="input-nickname"
                  type="nickname"
                  className={styles["input-nickname"]}
                  value={nickName}
                  disabled={userInfo.nickName === "用户007" ? false : true}
                  onNickNameReview={updateWeappUserInfo}
                />
              </>
            )}
          </View>
          {userInfo.userId && (
            <View className={styles["header-right"]} onClick={toProfileDetails}>
              <Text className={styles["desc"]}>我的收藏</Text>
              <AtIcon
                // className={styles["icon"]}
                value="chevron-right"
                size="18"
                // color="#8a2be2"
              ></AtIcon>
            </View>
          )}
        </View>
        <View className={styles["profile-main"]}>
          <ImageCard
            dataSource={imgsListData}
            imgStyle={{
              width: "100%",
              height: "150px",
            }}
            viewType={0}
          />
          {/* <Card className={styles["integral"]}>
            <Image className={styles["image"]} src={Logo}></Image>
            <View className={styles["desc"]}>当前可用花花</View>
          </Card> */}
          {/* {cardDataSource.length > 0 && ( */}
          <View className={styles["action"]}>
            {cardDataSource.map((item) => {
              return (
                <Card key={item.id} className={styles["action-card"]}>
                  <View
                    className={styles["card-content"]}
                    onClick={item.onClick}
                  >
                    <Image className={styles["image"]} src={Logo}></Image>
                    <View className={styles["desc"]}>{item.content}</View>
                  </View>
                </Card>
              );
            })}
          </View>
          {/* )} */}
        </View>
        {userInfo.userId && (
          <View
            className={styles["profile-footer"]}
            onClick={removeWeappUserInfo}
          >
            退出登录
          </View>
        )}
      </View>
      <PageContainer
        show={showPage}
        duration={500}
        position="right"
        onAfterLeave={() => {
          setShowPage(false);
          store.dispatch(setShowTabBar(true));
          // setDetailsData([])
        }}
        onBeforeLeave={(e) => {
          console.log(e);
        }}
      >
        <UploadImage />
        {/* <ImageDetails
              dataSource={detailsData}
              imgMode={detailImageMode}
              currentImg={currentImg}
              showDetails={showPage}
              scroll={isScroll}
              navigateBack={() => {
                setShowPage(false);
                store.dispatch(setShowTabBar(true));
                // Taro.pageScrollTo({ scrollTop: 0 });
              }}
              onChange={detailSwiperChange}
            /> */}
        {/* <TabBar
          dataSource={[
            {
              id: "goBack",
              ...getTabBarImg("goBack"),
            },
            {
              id: "download",
              ...getTabBarImg("download"),
            },
            {
              id: "share",
              ...getTabBarImg("share"),
            },
          ]}
        /> */}
      </PageContainer>
    </View>
  );
};

export default Profile;
