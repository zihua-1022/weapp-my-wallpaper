import React, { PropsWithChildren, useState } from "react";
import classNames from "classnames";
import Taro from "@tarojs/taro";
import {
  AtForm,
  AtInput,
  AtTextarea,
  AtTag,
  AtSwitch,
  AtButton,
  AtImagePicker,
  AtList,
  AtListItem,
} from "taro-ui";
import { View, Button, Image, Picker } from "@tarojs/components";
import CustomNavBar from "@components/CustomNavBar";
// import "taro-ui/dist/style/components/list.scss";
// import "taro-ui/dist/style/components/icon.scss";
import { uploadFile } from "@utils/weapp";
// import { uploadFile } from "@/api/profile";

import styles from "./index.module.less";

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

export type TUploadImageProps = {
  length?: number;
  containerStyle?: {};
};

const UploadImage: React.FC<TUploadImageProps & PropsWithChildren> = ({
  length = 3,
  containerStyle,
  children,
}) => {
  const [files, setFiles] = useState<TFile[]>([]);
  const [imgDesc, setImgDesc] = useState<string>("");
  const [imgTags, setImgTags] = useState<string>("");

  const onFail = (mes) => {
    console.log(mes);
  };
  const onImageClick = (index, file) => {
    console.log(index, file);
  };
  const getFormData = (file) => {
    // const formData = new FormData();
    // formData.append(
    //   "key",
    //   `${this.ossInfo.dir}${this.uploadFolder}${this.uploadFolder ? "/" : ""}${
    //     "saveName" in file.$file ? file.$file.saveName : file.$file.name
    //   }`
    // );
    // formData.append("policy", this.ossInfo.policy);
    // formData.append("OSSAccessKeyId", this.ossInfo.OSSAccessKeyId);
    // formData.append("success_action_status", "200");
    // formData.append("signature", this.ossInfo.signature);
    // formData.append("callback", this.ossInfo.callback);
    // formData.append("file", file.$file);
    // // 文件存在saveName属性则使用文件的saveName属性，否则使用文件name
    // formData.append(
    //   "name",
    //   "saveName" in file.$file ? file.$file.saveName : file.$file.name
    // );
    // return formData;
  };
  const onChooseImage = async (images: TFile[]) => {
    console.log("images: ", images);
    const imagesInfo = images.map(async (item, index) => {
      const { url, file } = item;
      const imageInfo = await Taro.getImageInfo({
        src: item.url,
      });
      const { type: imgType, width, height } = imageInfo;
      return {
        ...file,
        id: index + 1,
        url,
        width,
        height,
        imgType,
      };
    });
    const ImagesRes = await Promise.all(imagesInfo);
    setFiles(ImagesRes);
  };
  // const onChooseFile = (files:TFile[]) => {
  // Taro.chooseMedia({
  //   count: 10,
  //   mediaType: ["image", "video"],
  //   sourceType: ["album", "camera"],
  //   maxDuration: 30,
  //   camera: "back",
  //   success: async function (res) {
  //     console.log("res: ", res);
  //     const imagesInfo = res.tempFiles.map(async (item, index) => {
  //       const { tempFilePath: path, ...file } = item;

  //       const imageInfo = await Taro.getImageInfo({
  //         src: path,
  //       });
  //       console.log("imageInfo: ", imageInfo);
  //       const { type: imgType, width, height } = imageInfo;
  //       return {
  //         ...file,
  //         id: index + 1,
  //         path,
  //         width,
  //         height,
  //         imgType,
  //         fileType: res.type,
  //       };
  //     });
  //     const ImagesRes = await Promise.all(imagesInfo);
  //     setFiles(ImagesRes);
  //   },
  // });

  //   count: 10,
  // };

  const uploadImages = async () => {
    if (files.length > 0) {
      try {
        const imagesInfo = await uploadFile(files, {});
      } catch (error) {
        console.log("res: ", error);
      }
      // const ImagesRes =  Promise.all(imagesInfo);
      // const imagesData = files.map((file) => {
      // const { name, path, size, width, height, imgType } = file;
      // Taro.getFileSystemManager().readFile({
      //   filePath: path,
      //   encoding: "binary",
      //   success(res) {
      //     const fileBuffer = res.data;
      //     console.log(fileBuffer);
      //   },
      //   fail(res) {
      //     console.error(res);
      //   },
      // });

      // // 创建一个 FormData 对象
      // const formData = new FormData();
      // console.log("formData: ", formData);
      // formData.append("name", name || "");
      // formData.append("imgColor", "#3d3d2a");
      // formData.append("imgTags", "默认");
      // // formData.append("imgType", 'name');
      // formData.append("imgResolution", `${width}*${height}`);
      // // formData.append("imgSize", 'name');
      // formData.append("isPhone", "1");
      // formData.append("cid", "1");
      // formData.append("file", "1");

      // const formData = {
      //   name,
      //   imgColor: "#3d3d2a",
      //   imgTags: "默认",
      //   imgType,
      //   imgResolution: `${width}*${height}`,
      //   imgSize: size,
      //   path,
      //   isPhone: 1,
      //   cid: 1,
      // };
      // return formData;
      // });
    }
  };

  return (
    <View style={containerStyle} className={styles["upload-image"]}>
      <CustomNavBar isShowLogo={false} />
      <View className={styles["upload-image-main"]}>
        {/* <View className={styles["upload-image-container"]}>
          <View className={styles.flex}>
            {files.length > 0 &&
              files.map((item) => {
                return (
                  <View className={styles["flex-item"]} key={item.id}>
                    <View className={styles["close-btn"]}></View>
                    <Image src={item.path} mode="aspectFit"></Image>
                  </View>
                );
              })}
            <View
              className={`${styles["flex-item"]} ${styles["add-bar"]}`}
              onClick={onChooseFile}
            >
              <View className={styles.image}></View>
              <View className={styles.image}></View>
            </View>
          </View>
        </View> */}
        <AtImagePicker
          multiple
          length={3}
          files={files}
          onChange={onChooseImage}
          onFail={onFail}
          onImageClick={onImageClick}
        />
        <Button style={{ marginTop: "10px" }}>提交</Button>
      </View>

      {/* <AtList>
        <AtListItem title="图片类别" arrow="right" />
        <AtListItem
          title="今日推荐"
          // isSwitch
          // onSwitchChange={onMobileChange}
        />
        <AtListItem
          title="今日热门"
          // isSwitch
          // onSwitchChange={onMobileChange}
        />
        <AtListItem
          title="主要展示图"
          // isSwitch
          // onSwitchChange={onMobileChange}
        />
        <AtListItem title="手机壁纸" isSwitch onSwitchChange={onMobileChange} />
      </AtList> */}
    </View>
  );
};
export default UploadImage;
