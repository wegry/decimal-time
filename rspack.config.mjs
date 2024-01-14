import path from 'node:path'
import { fileURLToPath } from 'node:url'
import rspack from '@rspack/core'

export default function (env, argv) {
  const isProduction = process.env.NODE_ENV === 'production'

  return {
    mode: isProduction ? 'production' : 'development',
    entry: {
      index: './index.mjs',
    },
    devtool: isProduction ? false : 'inline-cheap-module-source-map',
    output: {
      filename: '[name].mjs',
      // https://stackoverflow.com/a/50052194/1924257
      path: path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist'),
      assetModuleFilename: 'fonts/[name][ext]',
      library: {
        type: 'module',
      },
    },
    plugins: [
      new rspack.CopyRspackPlugin({
        patterns: ['./index.html'],
      }),
      new rspack.SwcCssMinimizerRspackPlugin(),
    ],
  }
}
