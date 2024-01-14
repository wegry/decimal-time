import CopyWebpackPlugin from 'copy-webpack-plugin'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const IS_PROD = process.env.NODE_ENV === 'production'

const plugins = [
  new CopyWebpackPlugin({
    patterns: [
      './index.html',
      {
        from: './*.ttf',
        to: 'fonts',
      },
    ],
  }),
]

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
        test: /\.css$/,
        generator: {
          filename: 'index.css',
        },
        type: 'asset/resource',
      },
      {
        test: /\.(woff2)|(otf)|(ttf)$/,
        type: 'asset',
      },
    ],
  },
}
