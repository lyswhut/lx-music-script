import sources from './sources'

switch (window.location.hostname) {
  case 'www.kuwo.cn':
  case 'kuwo.cn':
    sources.kw()
    break
  case 'y.qq.com':
    sources.tx()
    break

  default:
    break
}
