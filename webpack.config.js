const path = require('path')
const webpack = require('webpack')
const packageJson = require('./package.json')
const config = require('./src/config')

const generateMaths = () => {
  const matchUrlComment = config.matchs.map(url => `// @match        ${url}`).join('\n')
  const includeUrlComment = config.includes.map(url => `// @include      ${url}`).join('\n')
  let comment = ''
  if (matchUrlComment) comment += ('\n' + matchUrlComment)
  if (includeUrlComment) comment += ('\n' + includeUrlComment)
  return comment
}

module.exports = {
  mode: 'production',
  target: 'web',
  entry: path.join(__dirname, './src/index.js'),
  output: {
    filename: 'lx-music-script.js',
    path: path.join(__dirname, './dist'),
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, './src'),
    },
    extensions: ['*', '.js', '.json', '.node'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: `// ==UserScript==
// @name         lx-msuic 辅助脚本
// @namespace    ${packageJson.name}
// @version      ${packageJson.version}
// @author       ${packageJson.author}
// @description  ${packageJson.description}
// @homepage     ${packageJson.homepage}
// @supportURL   ${packageJson.bugs.url}${generateMaths()}
// @run-at       document-start
// @noframes
// @icon         https://www.google.com/s2/favicons?domain=qq.com
// @grant        GM_cookie
// ==/UserScript==`,
      raw: true,
    }),
    new webpack.DefinePlugin({
      mode: JSON.stringify(process.env.NODE_ENV),
    }),
  ],
  optimization: {
    minimize: false,
  },
}
