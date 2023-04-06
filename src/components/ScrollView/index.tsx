import React, { PropsWithChildren } from "react";
import { View, ScrollView } from "@tarojs/components";

export interface ScrollViewProps {
  scrollStyle: {};
  scrollConfig: {};
}

const ScrollViews: React.FC = () => {
  const scrollStyle = {
    height: "150px",
  };
  const scrollTop = 100;
  const Threshold = 20;
  const vStyleA = {
    height: "150px",
    backgroundColor: "rgb(26, 173, 25)",
  };
  const vStyleB = {
    height: "150px",
    backgroundColor: "rgb(39,130,215)",
  };
  const vStyleC = {
    height: "150px",
    backgroundColor: "rgb(241,241,241)",
    color: "#333",
  };
  return (
    <ScrollView
      className="scrollview"
      scrollX
      scrollWithAnimation
      scrollLeft={scrollTop}
      style={scrollStyle}
      lowerThreshold={Threshold}
      upperThreshold={Threshold}
      // onScrollToUpper={this.onScrollToUpper.bind(this)} // 使用箭头函数的时候 可以这样写 `onScrollToUpper={this.onScrollToUpper}`
      // onScroll={this.onScroll}
    >
      <View style={vStyleA}>A</View>
      <View style={vStyleB}>B</View>
      <View style={vStyleC}>C</View>
    </ScrollView>
  );
};

export default ScrollViews;
