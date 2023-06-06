import { useState, ChangeEventHandler } from "react";
import Taro from "@tarojs/taro";
import {
  axios,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "taro-axios";
import service, { request } from "@services/index";
import {
  IWeappLoginParams,
  ILoginResultModel,
  IResultData,
} from "./model/baseModel";

export const weappLoginApi = async (avatarUrl: string) => {
  const { code } = await Taro.login();
  // console.log("0a1peXFa12pHbF0EKQGa1HHZ9P0peXFD: ", code);
  return request<ILoginResultModel>({
    url: "weapp/v1/account/weapp-login",
    method: "post",
    data: { code, avatarUrl },
  });
};

// 同一获取token
export const loginApi = async (params) => {
  // const { code } = await Taro.login();
  // console.log("code: ", code);
  return request<ILoginResultModel>({
    url: "weapp/v1/account/login",
    method: "post",
    data: params,
  });
};

export const getToken = async (params: {}) => {
  return request<{
    avatar: string;
    nickName: string;
    token: string;
    userId: string;
  }>({
    url: "weapp/v1/account/auth/token",
    method: "post",
    data: params,
  });
};

export const getWeappToken = () => {
  return request<{
    access_token: string;
    expires_in: number;
  }>({
    url: "weapp/v1/account/auth/weapp-token",
    method: "get",
  });
};

export const getOpenId = async (param: {}) => {
  return request({
    url: "weapp/v1/auth/openid",
    method: "post",
    // showLoading: true,
    data: param,
  });
};
