export const requestHook = (callback) => {
  let oldXHROpen = window.XMLHttpRequest.prototype.open
  window.XMLHttpRequest.prototype.open = function(method, url) {
    // do something with the method, url and etc.
    this.url = url
    // this.addEventListener('load', function () {
    //   // do something with the response text
    //   console.log('load: ' + url)
    //   console.log(JSON.parse(this.responseText))
    //   try {
    //     callback(url, JSON.parse(this.responseText))
    //   } catch (_) {}
    // })
    return oldXHROpen.apply(this, arguments)
  }
  let oldXHRSend = window.XMLHttpRequest.prototype.send
  window.XMLHttpRequest.prototype.send = function(data) {
    this.addEventListener('load', function() {
      // do something with the response text
      console.log('load: ' + data)
      console.log(JSON.parse(this.responseText))
      try {
        callback(this._url, data, JSON.parse(this.responseText))
      } catch (_) {}
    })

    oldXHRSend.call(this, data)
  }
}

export const encodeData = (data) => encodeURIComponent(JSON.stringify(data))

export const sizeFormate = (size) => {
  // https://gist.github.com/thomseddon/3511330
  if (!size) return '0 B'
  let units = ['B', 'KB', 'MB', 'GB', 'TB']
  let number = Math.floor(Math.log(size) / Math.log(1024))
  return `${(size / Math.pow(1024, Math.floor(number))).toFixed(2)} ${
    units[number]
  }`
}

export const formatPlayTime = (time) => {
  let m = parseInt(time / 60)
  let s = parseInt(time % 60)
  return m === 0 && s === 0
    ? '--/--'
    : (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s)
}

export const openApp = (type, action, data) => {
  const dom_a = document.createElement('a')
  dom_a.href = `lxmusic://${type}/${action}?data=${encodeData(data)}`
  dom_a.click()
}

export const wait = time => new Promise(resolve => setTimeout(resolve, time))
