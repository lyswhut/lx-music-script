import { decodeName, formatPlayTime, requestHook, openApp } from '@/utils'

let data = null


export const formatSinger = rawData => rawData.replace(/&/g, '、')

const filterListDetail = (rawList) => {
  // console.log(rawList)
  // console.log(rawList.length, rawList2.length)
  return rawList.map((item, inedx) => {
    let formats = item.formats.split('|')
    let types = []
    let _types = {}
    if (formats.includes('MP3128')) {
      types.push({ type: '128k', size: null })
      _types['128k'] = {
        size: null,
      }
    }
    // if (formats.includes('MP3192')) {
    //   types.push({ type: '192k', size: null })
    //   _types['192k'] = {
    //     size: null,
    //   }
    // }
    if (formats.includes('MP3H')) {
      types.push({ type: '320k', size: null })
      _types['320k'] = {
        size: null,
      }
    }
    // if (formats.includes('AL')) {
    //   types.push({ type: 'ape', size: null })
    //   _types.ape = {
    //     size: null,
    //   }
    // }
    if (formats.includes('ALFLAC')) {
      types.push({ type: 'flac', size: null })
      _types.flac = {
        size: null,
      }
    }
    // types.reverse()
    return {
      singer: formatSinger(decodeName(item.artist)),
      name: decodeName(item.songName),
      albumName: decodeName(item.album),
      albumId: item.albumId,
      songmid: item.id,
      source: 'kw',
      interval: formatPlayTime(parseInt(item.duration)),
      img: item.pic,
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
  style.innerHTML = '.btns {white-space: nowrap;} .btns .play { width: auto !important;} '
  document.head.appendChild(style)
}

let dom_main
const injectBtn = async(callback) => {
  const dom_btn = document.querySelector('.btns button')
  if (!dom_btn) {
    const current_dom_main = document.querySelector('#__layout > .page > .container > div')
    if (!current_dom_main) return
    dom_main = current_dom_main
    current_dom_main.addEventListener('DOMNodeRemoved', () => {
      if (dom_main !== current_dom_main) return
      dom_main = null
      setTimeout(() => {
        const dom_btn = document.querySelector('.btns button')
        if (!dom_btn) return
        callback(dom_btn)
      })
    })
    return
  }
  callback(dom_btn)
}

const createBtn = (label, onClick, dataKeys, className = 'play bg_primary') => {
  const dom_a = document.createElement('button')
  dom_a.className = className
  for (const key of dataKeys) dom_a.dataset[key] = ''
  dom_a.innerHTML = `<span ${dataKeys.map(k => `data-${k}`).join(' ')}>${label}</span>`
  dom_a.addEventListener('click', onClick)
  return dom_a
}

const inJectPlaylistPage = ({ id }) => {
  injectBtn(dom_btn => {
    const dataKeys = Object.keys(dom_btn.dataset)
    dom_btn.insertAdjacentElement('afterend', createBtn('在 LX Music 中打开', () => {
      openApp('songlist', 'open', {
        source: 'kw',
        id,
      })
    }, dataKeys, 'mod_btn'))
    dom_btn.insertAdjacentElement('afterend', createBtn('在 LX Music 中播放', () => {
      openApp('songlist', 'play', {
        source: 'kw',
        id,
      })
    }, dataKeys))
  })
}

const inJectSongDetailPage = (musicInfo) => {
  console.log(musicInfo)
  injectBtn((dom_btn) => {
    const dataKeys = Object.keys(dom_btn.dataset)
    dom_btn.insertAdjacentElement('afterend', createBtn('在 LX Music 中播放', () => {
      openApp('music', 'play', musicInfo)
    }, dataKeys))
  })
}

const hadnleInject = () => {
  if (!data) return
  if (window.location.pathname.includes('/playlist_detail/')) {
    inJectPlaylistPage(data)
  } else if (window.location.pathname.includes('/play_detail/')) {
    inJectSongDetailPage(data)
  }
}

export default () => {
  window.addEventListener('load', () => {
    injectStyle()

    if (window.location.pathname.includes('/playlist_detail/')) {
      // eslint-disable-next-line no-undef
      const detail = __NUXT__.data[0].playListInfo
      data = {
        play_count: detail.listencnt,
        id: detail.id,
        author: detail.userName,
        name: detail.name,
        img: detail.img,
        desc: detail.info,
        source: 'kw',
      }
      console.log(data)
      hadnleInject()
    }
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
    // if (!requestBody) return
    // console.log(url)
    if (url.includes('playlist/playListInfo?')) {
      if (response.code != 200) {
        data = null
        return
      }
      let detail = response.data
      data = {
        play_count: detail.listencnt,
        id: detail.id,
        author: detail.userName,
        name: detail.name,
        img: detail.img,
        desc: detail.info,
        source: 'kw',
      }
      console.log(data)
      setTimeout(() => {
        hadnleInject()
      })
    } else if (url.includes('singles/songinfoandlrc')) {
      if (response.status != 200) {
        data = null
        return
      }
      let detail = response.data.songinfo
      data = filterListDetail([detail])[0]
      console.log(data)
      setTimeout(() => {
        hadnleInject()
      })
    }
  })
}
