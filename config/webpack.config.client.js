import webpack from 'webpack'
import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { CLIENT_PATH, NODE_ENV, OUTPUT_PATH } from './env'

const clientConfig = {
  name: 'client',
  devtool: 'cheap-module-source-map',
  context: CLIENT_PATH,
  target: 'web',
  entry: ['./src/index.js'],
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    publicPath: '/',
    pathinfo: true,
    filename: 'assets/js/bundle.js?[hash]',
    chunkFilename: 'assets/js/[name].chunk.js',
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
    alias: {
      '@': path.resolve(CLIENT_PATH, './src'),
      '~': path.resolve(CLIENT_PATH, './'),
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
                  camelCase: true,
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
      favicon: 'public/favicon.ico',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ].concat(
    NODE_ENV === 'production'
      ? [
          new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false, comparisons: false },
            mangle: { safari10: true },
            output: { comments: false, ascii_only: true },
          }),
        ]
      : [],
  ),
  devServer: {
    contentBase: OUTPUT_PATH,
    hot: true,
    compress: true,
    historyApiFallback: {
      rewrites: [{ from: /^\/$/, to: 'index.html' }],
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        pathRewrite: { '^/api': '' },
      },
    },
    port: 3000,
  },
}

export default clientConfig
