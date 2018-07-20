var webpack = require('webpack');
var merge = require('@ersinfotech/merge');

var webpackConfig = require('./webpack.config');

//process.env.NODE_ENV = 'development';

module.exports = merge(webpackConfig, {
  mode:'development',
  devtool: 'eval',
  cache: true,
  bail: false,
  target: 'web',
  entry: {
    app: [`webpack-hot-middleware/client?path=http://127.0.0.1:8600/__webpack_hmr`]
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    },{
      test: /\.less$/,
      use: ['style-loader', 'css-loader', 'less-loader']
    }],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(/*{multiStep: true}*/),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
});
