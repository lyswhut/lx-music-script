import { request, sizeFormate, openApp, requestHook } from '@/utils'

let data = null

const getSinger = (singers) => {
  let arr = []
  singers.forEach(singer => {
    arr.push(singer.name)
  })
  return arr.join('、')
}

const filterListDetail = (rawList) => {
  // console.log(rawList)
  let ids = new Set()
  const list = []
  rawList.forEach((item) => {
    if (ids.has(item.copyrightId)) return
    ids.add(item.copyrightId)

    const types = []
    const _types = {}
    item.newRateFormats && item.newRateFormats.forEach(type => {
      let size
      switch (type.formatType) {
        case 'PQ':
          size = sizeFormate(type.size)
          types.push({ type: '128k', size })
          _types['128k'] = {
            size,
          }
          break
        case 'HQ':
          size = sizeFormate(type.size)
          types.push({ type: '320k', size })
          _types['320k'] = {
            size,
          }
          break
        case 'SQ':
          size = sizeFormate(type.size)
          types.push({ type: 'flac', size })
          _types.flac = {
            size,
          }
          break
        case 'ZQ':
          types.push({ type: 'flac24bit', size })
          _types.flac24bit = {
            size,
          }

          // 兼容2.0.0版本之前的 hires 音质使用 flac32bit 名字的问题
          size = sizeFormate(type.size)
          types.push({ type: 'flac32bit', size })
          _types.flac32bit = {
            size,
          }
          break
      }
    })

    const intervalTest = /(\d\d:\d\d)$/.test(item.length)

    list.push({
      singer: getSinger(item.artists),
      name: item.songName,
      albumName: item.album,
      albumId: item.albumId,
      songmid: item.copyrightId,
      songId: item.songId,
      copyrightId: item.copyrightId,
      source: 'mg',
      interval: intervalTest ? RegExp.$1 : null,
      img: item.albumImgs && item.albumImgs.length ? item.albumImgs[0].img : null,
      lrc: null,
      lrcUrl: item.lrcUrl,
      otherSource: null,
      types,
      _types,
      typeUrl: {},
    })
  })
  return list
}


// const injectStyle = () => {
//   const style = document.createElement('style')
//   style.innerHTML = `.content .actions> * {margin-bottom: .8em;}
//     .info_operate {white-space: nowrap;}
//     .info_operate .operate_btn.primary {border: 1px solid #e91e63 !important; background-color: #e91e63 !important; cursor: pointer;}
//     .info_operate .operate_btn.primary:hover {background-color: #d81558 !important;}
//     .info_operate .operate_btn.primary a {color: #fff !important;}`
//   document.head.appendChild(style)
// }


const createPlaylistBtn = (v, label, onClick, playAll) => {
  const dom_div = document.createElement('div')
  dom_div.className = 'options-btn '
  dom_div.dataset[v] = ''
  if (playAll) {
    const img = document.createElement('img')
    img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQVSURBVHgB7ZlNaBNbFIDvvTNp2iRNJiF971nzoHmNvF8f8tLne7WbdqkbcdFuVFAo3RQU3IkgVRD/QaEr60IRXLRrEUWhoKioXVi11KgYa2IDxfzUNvOTzL2eaVPwpya5aSapmA9uZjI5Mzn3nnPuOfcOQjVq1KjxzcEYw3D4uJHcseKIiBND+Z6eHkNhi3G/2+0WRFHUrVarHggEMqOjo7ohhlYpOBgMWiTA3fzPCc/af+941m584/FtfCqt2bAXfndDqx8YGKiYRYr+Exh51NXVJcIIO0DpKwjjTctIRXR5bpfAYg/i8Xga7tExxqZag3DI4nA4LLqbgweWV35BxCc0NN5ADf4hqWndX6B8Q2dnp5iLGVPgeTDxeDwOZA/cRQz/UVicRaiunUJy+GIymUzDhSwzelJmi/BYAIFbCMUpb4B9RLCeIY51t13e1vVwwdbW1mZMGmW1RtEd6O7uXpoyef/iT6He+1BaEzwUCoWccMEKzxJQmTrC5UJOp1MSnb+/QyUDbkUzJ4ny+gJYU4bZSodG0QqocAdyMDqiq4lj9rr0ZEdHhzo8PExLjY3qdGABsEZWP8fkF4OpVMoI8kwpQV50DICpUXlnEAhyUTwsNP76yOX9Zb3X67VDnhF4p9wqWuAzqHaeZucHHXXpUHt7u1asW3F1wAUIjb/FkWksBjmG3JFIJBZyBypQV3HlATMz6iLgVqTuLLYFhiTJ3wxZvKBLccVAxcCkm9ibLo+Pj9vAjfJ2YPXEwDJQKm9Nvh2/CqeZr8lwuZDZleUXMMvf8CnkE+GqRlGFIQThlpaWvDI8KzJmfhB/CtXVW+FoOJtPpoqJrACMDidjTx7CWd5aiSuIoUke33/mBzFjd+j87PZkcjKKCuQCriCGPGayBYz6SN0dj97f0tpqjxrVKiqQyHgsIMA06jKvlMgO6fNzR1OpZzFYL2gjIyN6MbetgjzA7sF8f9ySid2YmZlR4ALXtkz18gBms5RlD9K50GavTb7a399fVO3zxWM4ZMtWzDFEr6lqYr/HqkwalSe4C0UlboZVuAPGTkV6D1Hf3vT7/fLY2Bj3iH8OTyJbURKjNHtaSb8b/ElCsfB0XIM18YrWwkvwxEBpI8XYXV1JtVkyUwP/b2iJwOaYhgokJx64gpgQQkGhSFHCGC0EKUs/3+z7UXgMtb0M25KGy5RNeQOBRxjWrVhjtiaMyaa8gpSen5+b3umyzF7PKa5PTEyUVfEluFwoEolkWPrlETh98hUZWBKq24j2ap+aejPV19en5BKSaRmcywIAUxSFyrPRS1bHD9NgiZ9BNQ3cZYpRelF//2xHk2SZ6O3tVYxRh7Yq3xNgY2sQ6vR6cKlG+O7KHa1ocUCq8qamFPAyr5pq1KhR4zvjA87Zy1ltUhN/AAAAAElFTkSuQmCC'
    img.dataset[v] = ''
    dom_div.appendChild(img)
  }
  const span = document.createElement('span')
  span.className = 'active'
  span.textContent = label
  span.dataset[v] = ''
  dom_div.appendChild(span)
  dom_div.addEventListener('click', onClick, { capture: true })
  return dom_div
}
function observeRemoval(targetElement, callback) {
  const parent = targetElement.parentNode

  if (!parent) {
    console.warn('元素已经不在 DOM 中')
    return
  }

  const observer = new window.MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      for (const removedNode of mutation.removedNodes) {
        if (removedNode === targetElement) {
          callback && callback(targetElement)
          observer.disconnect() // 停止监听
          return
        }
      }
    }
  })

  observer.observe(parent, { childList: true })
}
const injectPlaylistPage = ({ id }) => {
  const dom_btn = document.querySelector('.song-handle .options')?.childNodes?.[0]
  if (!dom_btn) return
  const handleRemove = () => {
    document.querySelector('.song-handle .options')?.removeEventListener('DOMNodeRemoved', handleRemove)
    setTimeout(() => {
      injectPlaylistPage({ id })
    }, 100)
  }
  document.querySelector('.song-handle .options').addEventListener('DOMNodeRemoved', handleRemove)

  const v = Object.keys(dom_btn.dataset).find(key => key.startsWith('v-'))
  dom_btn.insertAdjacentElement('afterend', createPlaylistBtn(v, '在 LX Music 中打开', (evt) => {
    evt.stopImmediatePropagation()
    evt.stopPropagation()
    openApp('songlist', 'open', {
      source: 'mg',
      id,
    })
  }))
  dom_btn.insertAdjacentElement('afterend', createPlaylistBtn(v, '在 LX Music 中播放', (evt) => {
    evt.stopImmediatePropagation()
    evt.stopPropagation()
    openApp('songlist', 'play', {
      source: 'mg',
      id,
    })
  }, true))
}

const createSongDetailBtn = (label, onClick, className = 'primary') => {
  const dom_a = document.createElement('div')
  dom_a.className = 'operate_btn ' + className
  dom_a.innerHTML = `<a>${label}</a>`
  dom_a.addEventListener('click', onClick)
  return dom_a
}
const injectSongDetailPage = (musicInfo) => {
  console.log(musicInfo)
  const dom_btn = document.querySelector('.info_operate .operate_btn')
  if (!dom_btn) return
  dom_btn.insertAdjacentElement('afterend', createSongDetailBtn('在 LX Music 中播放', () => {
    openApp('music', 'play', musicInfo)
  }))
}

const hadnleInject = () => {
  if (!data) return
  if (window.location.hash.includes('/playlist')) {
    injectPlaylistPage(data)
  } else if (window.location.hash.includes('/music/song/')) {
    // injectSongDetailPage(data)
  }
}


export default () => {
  // window.addEventListener('DOMContentLoaded', () => {
  //   injectStyle()

  //   if (window.location.hash.includes('/playlist')) {
  //     const dom_songcid = document.getElementById('J_ResId')
  //     if (!dom_songcid || !dom_songcid.value) return
  //     // eslint-disable-next-line no-undef
  //     // const detail = __INITIAL_DATA__.detail
  //     data = {
  //       id: dom_songcid.value,
  //       source: 'mg',
  //     }
  //     hadnleInject()
  //   } else if (window.location.pathname.includes('/music/song/')) {
  //     // eslint-disable-next-line no-undef
  //     const dom_songcid = document.getElementById('songcid')
  //     if (!dom_songcid || !dom_songcid.value) return
  //     request('get', `https://c.musicapp.migu.cn/MIGUM2.0/v1.0/content/resourceinfo.do?copyrightId=${dom_songcid.value}&resourceType=2`).then(response => {
  //       if (response.code !== '000000') return
  //       console.log(response)
  //       const detail = response.resource[0]

  //       data = filterListDetail([detail])[0]

  //       console.log(data)
  //       hadnleInject()
  //     })
  //   }
  // })
  let preData = null
  requestHook((url, requestBody, response) => {
    if (url.includes('/resource/playlist/v2.0')) {
      if (response.code !== '000000') return
      data = {
        id: response.data.musicListId,
        source: 'mg',
      }
      if (preData == data.id) return
      preData = data.id
      hadnleInject()
    }
  })
}
