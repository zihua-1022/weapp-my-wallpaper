import React from "react";
import "taro-ui/dist/style/index.scss"; // 引入组件样式 - 方式一
// import "~styles/theme/default.scss";
import "./app.less";

//React18中props删除了children属性，当我们的在ts环境下使用props.children会报错
//定义一个Iprops的interface，指定children属性，因为children是可有可无的，所以设置为可选属性，类型为React.ReactNode
interface IProps {
  children?: React.ReactNode;
}

const App = (props: IProps) => {
  // this.props.children 是将要会渲染的页面
  return props.children;
};

export default App;
