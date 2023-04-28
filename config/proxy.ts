/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
const proxyConfig = {
  dev: {
    "/weapp": {
      target: "http://10.40.60.188:3000", // 后端地址
      changeOrigin: true,
      pathRewrite: {
        "^/weapp": "",
      },
    },
    "/static": {
      target: "http://ems.ddpping.cn/gateway",
      changeOrigin: true,
      pathRewrite: {
        "^/static": "/",
      },
    },
  },
  test: {
    "/api/": {
      target: "https://proapi.azurewebsites.net",
      changeOrigin: true,
      pathRewrite: { "^": "" },
    },
  },
  prod: {
    "/weapp": {
      target: "http://10.40.60.188:3000", // 后端地址
      changeOrigin: true,
      pathRewrite: {
        "^/weapp": "/",
      },
    },
    "/static": {
      target: "http://ems.ddpping.cn/gateway",
      changeOrigin: true,
      pathRewrite: {
        "^/static": "/",
      },
    },
    "/api": {
      target: "your prod url",
      changeOrigin: true,
      pathRewrite: { "^": "" },
    },
  },
};

export default proxyConfig;
