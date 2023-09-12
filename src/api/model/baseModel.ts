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

export interface IPageResult<T> {
  value: T[];
  total: number;
}

export interface IImgInfoParams {
  imgName?: string;
  imgResolution?: string;
  imgSize?: number;
  dSize?: number;
  path: string;
  dPath?: string;
  imgProperty?: string | number;
  isRecommend?: string | number;
  isPrimary?: string | number;
  isHot?: string | number;
  userId?: string;
  imgColor?: string;
  imgDesc?: string;
  imgTags?: string;
  imgType?: string;
  cid?: number;
}

export interface IBaseImgResult extends IImgInfoParams {
  id: number;
  key?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IFileParams {
  name: string;
  imgColor: string;
  imgTags?: string;
  imgType: string;
  imgResolution: string;
  imgSize: number;
  path: string;
  isHot?: number;
  imgProperty?: number;
  isPrimary?: number;
  isRecommend?: number;
  cid: number;
}
