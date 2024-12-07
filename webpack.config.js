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
// @name         LX Music 辅助脚本
// @namespace    ${packageJson.name}
// @version      ${packageJson.version}
// @author       ${packageJson.author}
// @description  ${packageJson.description}
// @homepage     ${packageJson.homepage}
// @supportURL   ${packageJson.bugs.url}${generateMaths()}
// @run-at       document-start
// @noframes
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NDcuOTQyIiBoZWlnaHQ9IjQ0Ny45NDMiPjxwYXRoIGZpbGw9IiM1ZWQ2OTgiIGQ9Ik0yMDMuODA2LjQ4MmMtMTkuNjY4LTMuMzQ2LTM1Ljc2IDExLjEzOS0zNS43NiAzMS4wODZ2MjA2LjE2NmMtMTEuNjQyLTQuMjcxLTI0LjE2NS02LjcyNS0zNy4yODEtNi43MjUtNTkuOTA1IDAtMTA4LjQ2OSA0OC41NjYtMTA4LjQ2OSAxMDguNDczIDAgNTkuOTAzIDQ4LjU2NCAxMDguNDYxIDEwOC40NjkgMTA4LjQ2MSAzNC4xNDEgMCA2NC41NC0xNS44MiA4NC40MDYtNDAuNDgybC00OS42NTgtNDkuNjY0Yy0xNS4xMTYtMTUuMTEyLTExLjcwOC0yOC45MDEtOS41NDItMzQuMTQgMi4xNjYtNS4yMzMgOS41MTQtMTcuNCAzMC44ODMtMTcuNGgxOC4wODJ2LTU2Ljg4NWMwLTIxLjEzMiAxNC42MTctMzguODYyIDM0LjI2Ni00My43NDUuMDMyLTQ0LjM3My4wMzItODEuODA4LjAzMi04MS44MDggMTQwLjE0NyAwIDEzMS43MjQgODMuOTc0IDExNS4zMjUgMTMyLjE5Ni02LjQyIDE4Ljg4NC0yLjYwMSAyMi4wNSAxMC44OTMgNy4zNTRDNTM2LjQ3MyA3Ny4xMDYgMjk4LjM4IDE2LjU2NiAyMDMuODA2LjQ4MnoiLz48cGF0aCBmaWxsPSIjNGRhZjdjIiBkPSJNMzAxLjA2MSAyMjMuODc2aC01MC45OTRjLTMuOTExIDAtNy41NzQuOTUtMTAuODg5IDIuNTIzLTguNjE2IDQuMDktMTQuNjE1IDEyLjc5OC0xNC42MTUgMjIuOTczdjc2LjUxaC0zNy43MDhjLTE0LjA4MiAwLTE3LjQyOCA4LjA3MS03LjQ2NiAxOC4wMjlsNDYuODkzIDQ2Ljg5OCAzMS4yNSAzMS4yNDZhMjUuNDI0IDI1LjQyNCAwIDAwMTguMDMzIDcuNDc0YzYuNTIzIDAgMTMuMDUyLTIuNDg0IDE4LjAyOS03LjQ3NGw3OC4xNTItNzguMTQ1YzkuOTUxLTkuOTU4IDYuNjA4LTE4LjAyOS03LjQ3LTE4LjAyOWgtMzcuNzF2LTc2LjUxYy4wMDEtMTQuMDc4LTExLjQyLTI1LjQ5NS0yNS41MDUtMjUuNDk1eiIvPjwvc3ZnPg==
// @grant        none
// ==/UserScript==`,
      // @grant        GM_cookie
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
