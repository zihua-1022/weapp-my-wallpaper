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
  // const { code } = await Taro.login();
  // console.log("code: ", code);
  return request<ILoginResultModel>({
    url: "weapp/account/weapp-login",
    method: "post",
    data: { code: "0a1peXFa12pHbF0EKQGa1HHZ9P0peXFD", avatarUrl },
  });
};

// 同一获取token
export const loginApi = async (params) => {
  // const { code } = await Taro.login();
  // console.log("code: ", code);
  return request<ILoginResultModel>({
    url: "weapp/account/login",
    method: "post",
    data: params,
  });
};

export const getToken = async (params: {}) => {
  return request<{
    avatar: string;
    nickname: string;
    token: string;
    user_id: string;
  }>({
    url: "weapp/account/auth/token",
    method: "post",
    data: params,
  });
};

export const getWeappToken = () => {
  return request<{
    access_token: string;
    expires_in: number;
  }>({
    url: "weapp/account/auth/weapp-token",
    method: "get",
  });
};

export const getOpenId = async (param: {}) => {
  return request({
    url: "weapp/auth/openid",
    method: "post",
    // showLoading: true,
    data: param,
  });
};
