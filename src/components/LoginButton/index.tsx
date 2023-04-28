import React, { useState, PropsWithChildren } from "react";
import { Button } from "@tarojs/components";
import { getUserInfoAuth } from "@utils/weapp";

interface ILoginButtonProps {
  onSearch: (keyword: string) => void;
}

const LoginButton: React.FC<ILoginButtonProps & PropsWithChildren> = () => {
  return (
    <Button openType="getUserInfo" onClick={getUserInfoAuth}>
      获取用户信息
    </Button>
  );
};

export default LoginButton;
