import React, { PropsWithChildren } from "react";
import { Swiper, SwiperItem, SwiperProps, Image } from "@tarojs/components";

export interface IImgProps {
  id: number;
  name: string;
  desc?: string;
  size?: number;
  resolution: string;
  type: number;
  tags?: string;
  daily_recommend: number;
  is_hot?: number;
  path: string;
  alt?: string;
  style?: {};
}

export interface IswiperProps {
  dataSource: IImgProps[];
}

const Swipers: React.FC<SwiperProps & IswiperProps> = (props) => {
  return (
    <Swiper
      style={{ height: "180px" }}
      className="test-h"
      indicatorColor="#999"
      indicatorActiveColor="#333"
      easing-function="easeInOutCubic"
      circular
      // indicatorDots
      autoplay
      previous-margin="24px"
      next-margin="24px"
    >
      {props.dataSource.length &&
        props.dataSource.map((img) => {
          return (
            <SwiperItem key={img.id}>
              <Image
                style={{
                  width: "95%",
                  height: "180px",
                  margin: "0 10px",
                  background: "#fff",
                  borderRadius: "10px",
                }}
                src={img.path}
              />
            </SwiperItem>
          );
        })}
    </Swiper>
  );
};
export default Swipers;
