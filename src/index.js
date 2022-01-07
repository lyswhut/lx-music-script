import sources from './sources'

switch (window.location.hostname) {
  case 'y.qq.com':
    sources.tx()
    break

  default:
    break
}
