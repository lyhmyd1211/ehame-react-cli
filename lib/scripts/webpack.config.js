var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const appName = require('../package').name;
const src = path.resolve(process.cwd(), '.');
const app = path.resolve(src, 'src');
const nodeModules = path.resolve(process.cwd(), 'node_modules');
var config = require('../configs');

//设置文件夹时间标签
var now = new Date(),
	month = 1 + now.getMonth(),
	day = now.getDate(),
	hour = now.getHours(),
	minute = now.getMinutes(),
	second = now.getSeconds(),
	timeStr = '';

month = month < 10 ? '0' + month : '' + month;
day = day < 10 ? '0' + day : '' + day;
hour = hour < 10 ? '0' + hour : '' + hour;
minute = minute < 10 ? '0' + minute : '' + minute;
second = second < 10 ? '0' + second : '' + second;
timeStr = month + day + '-' + hour + minute;

module.exports = {
  context: src,
  entry: {
    app: ["babel-polyfill", path.resolve(app, "index.js")]
  },
  output: {
    path: path.resolve(src, "build-" + timeStr),
    publicPath: "/exweb/",
    filename: "[name]_[hash:8].js",
    libraryTarget: "umd"
  },
  resolve: {
    modules: [app, nodeModules],
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json", ".css", ".less"]
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: [nodeModules]
      },
      {
        test: /\.tsx?$/,
        use: ["babel-loader", "ts-loader"],
        exclude: [nodeModules]
      },
      {
        test: /\.(jpe?g|png|gif|svg|ico)/i,
        loader: "file-loader?name=img/img_[hash:8].[ext]"
      },
      {
        test: /\.(ttf|eot|svg|woff|woff2)/,
        loader: "file-loader"
      },
      {
        test: /\.(pdf)/,
        loader: "file-loader"
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: config.APP_NAME,
      template: path.resolve(src, "src/index.html"),
      favicon: path.resolve(src, "src/favicon.ico"),
      inject: false,
      minify: {
        html5: true,
        collapseWhitespace: true,
        removeComments: true,
        removeTagWhitespace: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new webpack.ProvidePlugin({
      $q: path.resolve(app, "unit/global.js")
    })
  ],
  performance: {
    hints: false
  },
};
