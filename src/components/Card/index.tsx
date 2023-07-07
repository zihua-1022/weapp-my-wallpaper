import React, { PropsWithChildren } from "react";
import { View, Text, Image } from "@tarojs/components";
import classNames from "classnames";

import "./index.less";

export interface IImgProps {
  id: number;
  src: string;
  desc?: string;
  alt?: string;
  style?: {};
}

export interface ICardProps extends PropsWithChildren {
  title?: string;
  imgDataSource?: IImgProps[];
  action?: IImgProps[];
  style?: {};
  className?: string;
}

const Card: React.FC<ICardProps> = ({
  title,
  imgDataSource,
  children,
  className,
  style,
}) => {
  return (
    <View className={classNames("card", className)} style={style}>
      {/* <View className="card-top"></View> */}
      {title && <View className="card-header"></View>}
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
