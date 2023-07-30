import CopyWebpackPlugin from 'copy-webpack-plugin'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as sass from 'sass'

const IS_PROD = process.env.NODE_ENV === 'production'

let plugins = [new CopyWebpackPlugin({ patterns: ['./index.html'] })]

export default {
  mode: IS_PROD ? 'production' : 'development',
  entry: {
    index: './index.mjs',
  },
  devtool: IS_PROD ? false : 'inline-cheap-module-source-map',
  experiments: {
    outputModule: true,
  },
  output: {
    filename: '[name].mjs',
    // https://stackoverflow.com/a/50052194/1924257
    path: path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist'),
    assetModuleFilename: 'fonts/[name][ext]',
    library: {
      type: 'module',
    },
  },
  plugins,
  module: {
    rules: [
      {
        test: /\.scss$/,
        generator: {
          filename: 'index.css',
        },
        type: 'asset/resource',
        use: [
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: sass,
              sassOptions: {
                outputStyle: 'compressed',
              },
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
