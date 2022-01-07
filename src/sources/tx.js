import { sizeFormate, formatPlayTime, requestHook, openApp } from '@/utils'

let data = null

const getSinger = (singers) => {
  let arr = []
  singers.forEach((singer) => {
    arr.push(singer.name)
  })
  return arr.join('、')
}

const filterListDetail = (rawList) => {
  // console.log(rawList)
  return rawList.map((item) => {
    let types = []
    let _types = {}
    if (item.file.size_128mp3 !== 0) {
      let size = sizeFormate(item.file.size_128mp3)
      types.push({ type: '128k', size })
      _types['128k'] = {
        size,
      }
    }
    if (item.file.size_320mp3 !== 0) {
      let size = sizeFormate(item.file.size_320mp3)
      types.push({ type: '320k', size })
      _types['320k'] = {
        size,
      }
    }
    if (item.file.size_ape !== 0) {
      let size = sizeFormate(item.file.size_ape)
      types.push({ type: 'ape', size })
      _types.ape = {
        size,
      }
    }
    if (item.file.size_flac !== 0) {
      let size = sizeFormate(item.file.size_flac)
      types.push({ type: 'flac', size })
      _types.flac = {
        size,
      }
    }
    // types.reverse()
    return {
      singer: getSinger(item.singer),
      name: item.title,
      albumName: item.album.title,
      albumId: item.album.id,
      source: 'tx',
      interval: formatPlayTime(item.interval),
      songId: item.id,
      albumMid: item.album.mid,
      strMediaMid: item.file.media_mid,
      songmid: item.mid,
      img:
        item.album.name === '' || item.album.name === '空'
          ? `https://y.gtimg.cn/music/photo_new/T001R500x500M000${item.singer[0].mid}.jpg`
          : `https://y.gtimg.cn/music/photo_new/T002R500x500M000${item.album.mid}.jpg`,
      lrc: null,
      otherSource: null,
      types,
      _types,
      typeUrl: {},
    }
  })
}

const injectStyle = () => {
  const style = document.createElement('style')
  style.innerHTML = '.data__actions {white-space: nowrap;} '
  document.head.appendChild(style)
}

let dom_loading
const injectBtn = async(callback) => {
  const dom_btn = document.querySelector('.data__actions a')
  if (!dom_btn) {
    const current_dom_loading = document.querySelector('.mod_loading')
    if (!current_dom_loading) return
    dom_loading = current_dom_loading
    current_dom_loading.addEventListener('DOMNodeRemoved', () => {
      if (dom_loading !== current_dom_loading) return
      dom_loading = null
      setTimeout(() => {
        const dom_btn = document.querySelector('.data__actions a')
        if (!dom_btn) return
        callback(dom_btn)
      })
    })
    return
  }
  callback(dom_btn)
}

const createBtn = (label, onClick, className = 'mod_btn_green') => {
  const dom_a = document.createElement('a')
  dom_a.className = className
  dom_a.innerHTML = `<span class="btn__txt">${label}</span>`
  dom_a.addEventListener('click', onClick)
  return dom_a
}

const inJectPlaylistPage = ({ id }) => {
  injectBtn(dom_btn => {
    dom_btn.insertAdjacentElement('afterend', createBtn('在 LX Music 中打开', () => {
      openApp('songlist', 'open', {
        source: 'tx',
        id,
      })
    }, 'mod_btn'))
    dom_btn.insertAdjacentElement('afterend', createBtn('在 LX Music 中播放', () => {
      openApp('songlist', 'play', {
        source: 'tx',
        id,
      })
    }))
  })
}

const inJectSongDetailPage = (musicInfo) => {
  console.log(musicInfo)
  injectBtn((dom_btn) => {
    dom_btn.insertAdjacentElement('afterend', createBtn('在 LX Music 中播放', () => {
      openApp('music', 'play', musicInfo)
    }))
  })
}

const hadnleInject = () => {
  if (!data) return
  if (window.location.pathname.includes('/playlist/')) {
    inJectPlaylistPage(data)
  } else if (window.location.pathname.includes('/songDetail/')) {
    inJectSongDetailPage(data)
  }
}

export default () => {
  window.addEventListener('load', () => {
    injectStyle()

    if (window.location.pathname.includes('/playlist/')) {
      // eslint-disable-next-line no-undef
      const detail = __INITIAL_DATA__.detail
      data = {
        play_count: detail.listennum,
        id: detail.id,
        author: detail.host_nick,
        name: detail.title,
        img: detail.picurl,
        desc: detail.desc,
        source: 'tx',
      }
    } else if (window.location.pathname.includes('/songDetail/')) {
      // eslint-disable-next-line no-undef
      data = filterListDetail(__INITIAL_DATA__.songList)[0]
    }
    hadnleInject()
  })
  // window.history.pushState = ((f) =>
  //   function pushState() {
  //     const ret = f.apply(this, arguments)
  //     window.dispatchEvent(new window.Event('pushstate'))
  //     window.dispatchEvent(new window.Event('locationchange'))
  //     return ret
  //   })(window.history.pushState)

  // window.history.replaceState = ((f) =>
  //   function replaceState() {
  //     const ret = f.apply(this, arguments)
  //     window.dispatchEvent(new window.Event('replacestate'))
  //     window.dispatchEvent(new window.Event('locationchange'))
  //     return ret
  //   })(window.history.replaceState)

  // window.addEventListener('popstate', () => {
  //   window.dispatchEvent(new window.Event('locationchange'))
  // })
  // window.addEventListener('locationchange', function() {

  // })
  requestHook((url, requestBody, response) => {
    if (!requestBody) return
    if (
      requestBody.includes('"module":"music.srfDissInfo.aiDissInfo"') &&
      requestBody.includes('"method":"uniform_get_Dissinfo"')
    ) {
      if (response.code != 0) {
        data = null
        return
      }
      let detail
      for (const value of Object.values(response)) {
        if (value?.data?.dirinfo) {
          detail = value.data.dirinfo
          break
        }
      }
      data = {
        play_count: detail.listennum,
        id: detail.id,
        author: detail.host_nick,
        name: detail.title,
        img: detail.picurl,
        desc: detail.desc,
        source: 'tx',
      }
      setTimeout(() => {
        hadnleInject()
      })
    } else if (
      requestBody.includes('"module":"music.pf_song_detail_svr"') &&
      requestBody.includes('"method":"get_song_detail_yqq"')
    ) {
      if (response.code != 0) {
        data = null
        return
      }
      let detail
      for (const value of Object.values(response)) {
        if (value?.data?.track_info) {
          detail = value.data.track_info
          break
        }
      }
      data = filterListDetail([detail])[0]
      setTimeout(() => {
        hadnleInject()
      })
    }
  })
}
