import React, { PropsWithChildren } from "react";
import { View, Text, Image } from "@tarojs/components";
import { AtCard } from "taro-ui";
import img1 from "@assets/img/测试1.jpg";

import "./index.less";

export interface IimgProps {
  id: number;
  src: string;
  alt?: string;
  style?: {};
}

export interface IswiperProps {
  dataSource: IimgProps[];
}

const Card: React.FC = (props) => {
  return (
    <View className="card-wrap">
      {/* <View className="card-top"></View> */}
      <View className="card-cover">
        <Image style={{}} mode="aspectFill" src={img1} />
        {/* <View className="meta-item">
          <Text
            className="language-color"
            style={{ background: "#000000" }}
          ></Text>
          {"language" || "null"}
        </View> */}

        {/* <View className="meta-item">
           <FontIcon
          styleProps={{ fontSize: '16px' }}
          value="git-repo-forked"
        ></FontIcon> 
          forks
        </View> */}
        <View className="card-cover-meta"></View>
      </View>
      <View className="card-body">
        <View className="card-meta"></View>
      </View>
    </View>
  );
};
export default Card;
