import webpack from 'webpack'
import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import { CLIENT_PATH, NODE_ENV, OUTPUT_PATH } from './env'

const css_module =
  NODE_ENV === 'production'
    ? {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: { loader: 'style-loader', options: { hmr: false } },
          use: [
            {
              loader: 'css-loader',
              options: { importLoaders: 1, minimize: true, modules: true, sourceMap: true, camelCase: true },
            },
          ],
        }),
      }
    : {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1, modules: true, sourceMap: true, camelCase: true } },
        ],
      }

const less_module =
  NODE_ENV === 'production'
    ? {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: ['css-loader', 'less-loader'] }),
      }
    : {
        test: /\.less$/,
        loader: ['style-loader', 'css-loader', 'less-loader'],
      }

const clientConfig = {
  name: 'client',
  bail: NODE_ENV === 'production',
  devtool: NODE_ENV === 'production' ? 'source-map' : 'cheap-module-source-map',
  context: CLIENT_PATH,
  target: 'web',
  entry: ['./src/index.js'],
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    publicPath: '/',
    pathinfo: true,
    filename: 'assets/js/bundle.[chunkhash:8].js',
    chunkFilename: 'assets/js/bundle.[chunkhash:8].chunk.js',
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
        options: { ignore: false, useEslintrc: true },
      },
      {
        oneOf: [
          {
            test: /\.(png|jpe?g|gif|bmp|svg)$/,
            loader: 'url-loader',
            options: { limit: 8192, name: 'assets/media/[name].[hash:8].[ext]' },
          },
          {
            test: /\.(js|jsx)$/,
            loader: 'babel-loader',
            include: CLIENT_PATH,
            options: { cacheDirectory: true },
          },
          css_module,
          less_module,
          {
            exclude: [/\.js$/, /\.html$/, /\.json$/],
            loader: 'file-loader',
            options: { name: 'assets/media/[name].[hash:8].[ext]' },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.EnvironmentPlugin({ NODE_ENV }),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(CLIENT_PATH, 'public/index.html'),
      favicon: 'public/favicon.ico',
      minify: NODE_ENV === 'production' && {
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
  ]
    .concat(
      NODE_ENV === 'production'
        ? [
            new webpack.optimize.UglifyJsPlugin({
              compress: { warnings: false, comparisons: false },
              mangle: { safari10: true },
              output: { comments: false, ascii_only: true },
              sourceMap: true,
            }),
          ]
        : [],
    )
    .concat(
      NODE_ENV === 'production' ? [new ExtractTextPlugin({ filename: 'assets/css/style.[contenthash:8].css' })] : [],
    )
    .concat(NODE_ENV === 'production' ? [] : [new webpack.HotModuleReplacementPlugin()]),
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
