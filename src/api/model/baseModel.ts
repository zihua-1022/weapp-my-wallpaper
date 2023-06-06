/* 服务器返回数据的的类型，根据接口文档确定 */
export interface IResultData<T> {
  code: number;
  status: boolean;
  msg: string;
  data: T;
}

export interface IWeappLoginParams {
  APPID: string;
  AppSecret: string;
  JSCODE: string;
}

export interface ILoginParams {
  username: string;
  password: string;
}

export interface ILoginResultModel {
  userId: string | number;
  token: string;
  data: {};
}

export interface IPageParams {
  page: number;
  pageSize: number;
}

export interface IPageResultModel<T> {
  items: T[];
  total: number;
}

export interface IBaseImgResult {
  id: number;
  imgDesc?: string;
  imgName: string;
  imgResolution?: string;
  imgSize?: number;
  imgTags?: string;
  imgType?: string;
  isHot: number;
  isPhone: number;
  isPrimary: number;
  isRecommend: number;
  path: string;
  createdAt?: string;
  updatedAt?: string;
}
