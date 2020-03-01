const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

const IS_PROD = process.env.NODE_ENV === 'production'

let plugins = [new CopyWebpackPlugin(['./index.html'])]

module.exports = {
  mode: IS_PROD ? 'production' : 'development',
  entry: {
    index: './index.js'
  },
  devtool: IS_PROD ? false : 'inline-cheap-module-source-map',
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass')
            }
          }
        ]
      },
      {
        test: /\.(woff2)|(otf)|(ttf)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'fonts'
        }
      }
    ]
  },
  devServer: {
    compress: true,
    port: 8999,
    // Break the server if in prod and trying to use webpack dev server
    disableHostCheck: !IS_PROD,
    stats: {
      assets: true,
      children: false,
      chunks: false,
      hash: false,
      modules: false,
      publicPath: false,
      timings: true,
      version: false,
      warnings: true
    }
  }
}
