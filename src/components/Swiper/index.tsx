import React, { PropsWithChildren } from "react";
import { Swiper, SwiperItem, SwiperProps, Image } from "@tarojs/components";
import { IBaseImgResult } from "@/api/model/baseModel";

export type TSwipersProps = SwiperProps & {
  dataSource: IBaseImgResult[];
};

const Swipers: React.FC<TSwipersProps & PropsWithChildren> = (props) => {
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
