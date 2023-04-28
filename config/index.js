import * as path from "path";
import proxy from "./proxy";

const pathResolve = (pathUrl) => path.resolve(__dirname, "..", pathUrl);
const outputRoot = {
  weapp: "dist",
  h5: "dist_h5",
};

const config = {
  projectName: "weapp-my-wallpaper",
  date: "2023-3-9",
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
  },
  sourceRoot: "src",
  outputRoot: outputRoot[process.env.TARO_ENV],
  alias: {
    "@": pathResolve("src/"),
    "~": pathResolve("src/styles"),
    "~styles": pathResolve("src/styles"),
    "@hooks": pathResolve("src/hooks"),
    "@store": pathResolve("src/store"),
    "@components": pathResolve("src/components"),
    "@utils": pathResolve("src/utils"),
    "@services": pathResolve("src/services"),
    "@assets": pathResolve("src/assets"),
  },
  plugins: [],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {},
  },
  devServer: {
    proxy: {
      "/weapp": {
        target: "http://10.40.60.188:3000", // 后端地址
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          "^/weapp": "/",
        },
      },
    },
  },
  framework: "react",
  compiler: "webpack5",
  cache: {
    enable: false, // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
  },
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {},
      },
      url: {
        enable: true,
        config: {
          limit: 1024, // 设定转换尺寸上限
        },
      },
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: "module", // 转换模式，取值为 global/module
          generateScopedName: "[local]__[hash:base64:5]",
        },
      },
    },
    devServer: {
      proxy: {
        "/weapp": {
          target: "http://10.40.60.188:3000", // 后端地址
          changeOrigin: true,
          secure: false,
          pathRewrite: {
            "^/weapp": "/",
          },
        },
      },
    },
  },
  h5: {
    publicPath: "/",
    staticDirectory: "static",
    postcss: {
      autoprefixer: {
        enable: true,
        config: {},
      },
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: "module", // 转换模式，取值为 global/module
          generateScopedName: "[name]__[local]___[hash:base64:5]",
        },
      },
    },
    devServer: {
      // port: 1022,
      https: true,
      proxy: process.env.NODE_ENV === "development" ? proxy.dev : proxy.prod,
    },
  },
};

module.exports = function (merge) {
  if (process.env.NODE_ENV === "development") {
    return merge({}, config, require("./dev"));
  }
  return merge({}, config, require("./prod"));
};
