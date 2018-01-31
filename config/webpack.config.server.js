import { SERVER_PATH, OUTPUT_PATH } from './env'
import manifest from '../package.json'

const serverConfig = {
  name: 'server',
  entry: './index.js',
  context: SERVER_PATH,
  target: 'node',
  output: {
    path: OUTPUT_PATH,
    filename: 'index.js',
  },
  externals: (() => {
    return Object.keys(manifest.dependencies).reduce((acc, cur) => {
      acc[cur] = 'commonjs ' + cur
      return acc
    }, {})
  })(),
  module: {
    rules: [
      {
        test: /\.(mjs|js)$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          ignore: false,
          useEslintrc: true,
        },
      },
      {
        test: /(\.mjs|\.js)$/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.json', '.mjs'],
  },
  watchOptions: {
    ignore: /node_modules/,
    aggregateTimeout: 500,
    poll: 1000,
  },
}

export default serverConfig
