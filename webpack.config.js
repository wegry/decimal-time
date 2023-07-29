const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

const IS_PROD = process.env.NODE_ENV === 'production'

let plugins = [new CopyWebpackPlugin({ patterns: ['./index.html'] })]

module.exports = {
  mode: IS_PROD ? 'production' : 'development',
  entry: {
    index: './index.js',
  },
  devtool: IS_PROD ? false : 'inline-cheap-module-source-map',
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'fonts/[name][ext]',
  },
  plugins,
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
              implementation: require('sass'),
            },
          },
        ],
      },
      {
        test: /\.(woff2)|(otf)|(ttf)$/,
        type: 'asset',
      },
    ],
  },
}
