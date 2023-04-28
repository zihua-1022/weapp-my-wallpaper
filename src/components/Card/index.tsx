import React, { PropsWithChildren } from "react";
import { View, Text, Image } from "@tarojs/components";
import { AtCard } from "taro-ui";

import "./index.less";

export interface IImgProps {
  id: number;
  src: string;
  desc?: string;
  alt?: string;
  style?: {};
}

export interface ICardProps extends PropsWithChildren {
  imgDataSource?: IImgProps[];
  action?: IImgProps[];
  style?: {};
}

const Card: React.FC<ICardProps> = ({ imgDataSource, children, style }) => {
  return (
    <View className="card" style={style}>
      {/* <View className="card-top"></View> */}
      <View className="card-header"></View>
      <View className="card-body">
        {children && <>{children}</>}
        {!children && (
          <>
            {imgDataSource?.length &&
              imgDataSource.map((ietm) => {
                return (
                  <View className="content" key={ietm.id}>
                    <Image
                      style={ietm.style}
                      mode="aspectFill"
                      src={ietm.src}
                    />
                    <Text className="content-desc">{ietm.desc}</Text>
                  </View>
                );
              })}
          </>
        )}
        <View className="footer"></View>
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
      </View>
    </View>
  );
};
export default Card;
