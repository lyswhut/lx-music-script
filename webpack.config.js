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
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAABWVBMVEUAAABj1KVyzKduz6ds0KZcvqJgvaJuz6ds0KZevaFdvaFr0KZr0KZfvaFevaFdvaFs0KZevaFs0KZdvaBcvaFr0KZbvaBbvaBr0KZbvZ9q0KVbvZ9q0KVq0aVbvZ9q0KVp0aVp0aVp0aVp0aVp0aVp0aVp0aVp0aVo0aRo0aRo0aRo0qRo0aRo0aRo0aRo0qRn0qNn0qNn0qNn0qNm0qNm0qNm0qNm0qNm0qNm0qJm0qJWupdl06Jl06Jl06Jl06Jl06Jl06FVuZVl06Fk06Fk06Fk06Fk06Fk06FUuZNUuZNk06Bj1KBj1KBj1KBj1KBTuJFTuJFSt49St49i1J9i1J9St41Rtoxi1Z5RtotRtYth1Z5RtYpQtYph1Z1QtYlg1Z1QtIhg1ZxPtIdg1ZxPs4Vg1Ztg1ZxPs4Rf1ZtOsoJOsoNf1ppf1plf1ppNr3xe1phe1plf1pma98AtAAAAb3RSTlMAAgUHCQsODhIWGhocHyEjIycnKy0tNDo/QEBESEpLTlJWWFlfYmRneXp9gIKEhoibn6Cio6SlqbCxt7i/wMHDxMXIys3P09TW19ja29zd3t/h5ebn6uzu7vHy8vT19fb3+Pj5+vv7+/z8/f39/v5h65S/AAABRUlEQVQ4y4XTZ1fCMBgF4Bc3oiC49164cICAIqi4EfeqG0FELbzx/3+wK0mVlN5PzbnPadoMAFMcx1i83fbXg1VmUIt8FXSJQQhpSGqwMlCSarcB+O23AYiLdoBM2gB8EQG5SLgYF4B9qOoKXBogLARqhjIaiFsC8BXUwao1gCV1MFwBuJTnrOgvYnQkI4bKAZmHRo+nWQeZGt75Ahvx5XXEZOtrSUluAFqQTPD6iK7M1FpJywEsYJT1/e9s6ca2dHAGeyesb8qiAMxWM7CDIsDT8MP3Vx4VgDnWB5W3CkCE9vdwLkkfOviUpGu3AWIU5B0XJVMeaw2wwqZI1N3w/s1Lp+jj/xBx3rG+jX/EExdh54Pe5zpMXzltPunuZ63v/LOLmxykwa3s1lfvv32O0oOcdAB4D0+7y+5Uz26eYCE9Un4dfwFD48/Gwgd5VgAAAABJRU5ErkJggg==
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
