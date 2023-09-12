import React, { PropsWithChildren } from "react";
import {
  Swiper,
  SwiperItem,
  SwiperProps,
  Image,
  Block,
} from "@tarojs/components";
import { IBaseImgResult } from "@/api/model/baseModel";

export type TSwipersProps = SwiperProps & {
  dataSource: IBaseImgResult[];
  toImgsDetail?: (imgs: IBaseImgResult[], index: number) => void;
};

const Swipers: React.FC<TSwipersProps & PropsWithChildren> = (props) => {
  return (
    <Swiper
      style={{ height: "180px" }}
      className="test-h"
      indicatorColor="#999"
      indicatorActiveColor="#333"
      // easing-function="easeInOutCubic"
      circular
      // indicatorDots
      autoplay
      previous-margin="24px"
      next-margin="24px"
    >
      {props.dataSource.length > 0 &&
        props.dataSource.map((img, index) => {
          return (
            <Block key={img.id}>
              <SwiperItem
                onClick={() => {
                  if (props.toImgsDetail) {
                    props.toImgsDetail(props.dataSource, index);
                  }
                }}
              >
                <Image
                  style={{
                    width: "95%",
                    height: "180px",
                    margin: "0 10px",
                    backgroundColor: img.imgColor,
                    borderRadius: "10px",
                  }}
                  src={img.path}
                  mode="aspectFill"
                />
              </SwiperItem>
            </Block>
          );
        })}
    </Swiper>
  );
};
export default Swipers;
