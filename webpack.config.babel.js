import path from 'path'
import manifest from './package.json'

export default [
  {
    name: 'server',
    entry: './index.mjs',
    target: 'node',
    output: {
      path: path.resolve(process.cwd(), 'dist'),
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
    },
  },
]
