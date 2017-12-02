import path from 'path'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import manifest from './package.json'

const CLIENT_PATH = path.resolve(process.cwd(), 'client')
const SERVER_PATH = path.resolve(process.cwd(), 'server')
const OUTPUT_PATH = path.resolve(process.cwd(), 'dist')

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
        use: { loader: 'babel-loader' },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.json', '.mjs'],
    '~': path.resolve(SERVER_PATH),
  },
  watchOptions: {
    ignore: /node_modules/,
    aggregateTimeout: 500,
    poll: 1000,
  },
}

const clientConfig = {
  devtool: 'cheap-module-source-map',
  context: CLIENT_PATH,
  target: 'web',
  entry: ['webpack-hot-middleware/client', './src/index.js'],
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    publicPath: '/',
    pathinfo: true,
    filename: 'assets/js/bundle.js',
    chunkFilename: 'assets/js/[name].chunk.js',
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
    alias: {
      '@': path.resolve(CLIENT_PATH, './src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        include: CLIENT_PATH,
        options: {
          ignore: false,
          useEslintrc: true,
        },
      },
      {
        oneOf: [
          {
            test: /\.(png|jpe?g|gif|bmp|svg)$/,
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'assets/media/[name].[hash:8].[ext]',
            },
          },
          {
            test: /\.(js|jsx)$/,
            loader: 'babel-loader',
            include: CLIENT_PATH,
            options: {
              babelrc: false,
              presets: ['babel-preset-react-app'],
              plugins: [['import', { libraryName: 'antd', style: true }]],
              cacheDirectory: true,
            },
          },
          {
            test: /\.css$/,
            use: [
              'style-loader',
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1,
                  modules: true,
                  sourceMap: true,
                },
              },
            ],
          },
          {
            test: /\.less$/,
            loader: ['style-loader', 'css-loader', 'less-loader'],
          },
          {
            exclude: [/\.js$/, /\.html$/, /\.json$/],
            loader: 'file-loader',
            options: {
              name: 'assets/media/[name].[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.EnvironmentPlugin({
      NODE_ENV: process.env.NODE_ENV,
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(CLIENT_PATH, 'public/index.html'),
    }),
  ],
}

export { serverConfig, clientConfig }
export default [serverConfig, clientConfig]
