var webpack = require('webpack');
var merge = require('@ersinfotech/merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpackConfig = require('./webpack.config');

//process.env.NODE_ENV = 'production';

module.exports = merge(webpackConfig, {
  mode:'production',
  devtool: 'source-map',
  cache: false,
  module: {
    rules: [{
      test: /\.css$/,
      loader: ExtractTextPlugin.extract({
        fallback:'style-loader',
        use:'css-loader',
      }),
      // exclude: /components/,
    },{
      test: /\.less$/,
      loader: ExtractTextPlugin.extract({
        fallback:'style-loader',
        use:['css-loader','less-loader'],
        // publicPath:'',
      }),
    }],
  },
  plugins: [
    new ExtractTextPlugin({
      filename:'[name]_[hash].css',
      allChunks: true,
      disable:false,
    }),
  ],
});
