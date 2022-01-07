import { request, sizeFormate, openApp } from '@/utils'

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


const injectStyle = () => {
  const style = document.createElement('style')
  style.innerHTML = `.info_operate {white-space: nowrap;}
    .info_operate .operate_btn.primary {border: 1px solid #e91e63 !important; background-color: #e91e63 !important; cursor: pointer;}
    .info_operate .operate_btn.primary:hover {background-color: #d81558 !important;}
    .info_operate .operate_btn.primary a {color: #fff !important;}`
  document.head.appendChild(style)
}


const createPlaylistBtn = (label, onClick, className = 'play-all') => {
  const dom_a = document.createElement('a')
  dom_a.className = 'action ' + className
  dom_a.innerHTML = label
  dom_a.addEventListener('click', onClick)
  return dom_a
}
const inJectPlaylistPage = ({ id }) => {
  const dom_btn = document.querySelector('.actions .action')
  if (!dom_btn) return
  dom_btn.insertAdjacentElement('afterend', createPlaylistBtn('在 LX Music 中打开', () => {
    openApp('songlist', 'open', {
      source: 'mg',
      id,
    })
  }, ''))
  dom_btn.insertAdjacentElement('afterend', createPlaylistBtn('在 LX Music 中播放', () => {
    openApp('songlist', 'play', {
      source: 'mg',
      id,
    })
  }))
}

const createSongDetailBtn = (label, onClick, className = 'primary') => {
  const dom_a = document.createElement('div')
  dom_a.className = 'operate_btn ' + className
  dom_a.innerHTML = `<a>${label}</a>`
  dom_a.addEventListener('click', onClick)
  return dom_a
}
const inJectSongDetailPage = (musicInfo) => {
  console.log(musicInfo)
  const dom_btn = document.querySelector('.info_operate .operate_btn')
  if (!dom_btn) return
  dom_btn.insertAdjacentElement('afterend', createSongDetailBtn('在 LX Music 中播放', () => {
    openApp('music', 'play', musicInfo)
  }))
}

const hadnleInject = () => {
  if (!data) return
  if (window.location.pathname.includes('/music/playlist/')) {
    inJectPlaylistPage(data)
  } else if (window.location.pathname.includes('/music/song/')) {
    inJectSongDetailPage(data)
  }
}


export default () => {
  window.addEventListener('DOMContentLoaded', () => {
    injectStyle()

    if (window.location.pathname.includes('/music/playlist/')) {
      const dom_songcid = document.getElementById('J_ResId')
      if (!dom_songcid || !dom_songcid.value) return
      // eslint-disable-next-line no-undef
      // const detail = __INITIAL_DATA__.detail
      data = {
        id: dom_songcid.value,
        source: 'mg',
      }
      hadnleInject()
    } else if (window.location.pathname.includes('/music/song/')) {
      // eslint-disable-next-line no-undef
      const dom_songcid = document.getElementById('songcid')
      if (!dom_songcid || !dom_songcid.value) return
      request('get', `https://c.musicapp.migu.cn/MIGUM2.0/v1.0/content/resourceinfo.do?copyrightId=${dom_songcid.value}&resourceType=2`).then(response => {
        if (response.code !== '000000') return
        console.log(response)
        const detail = response.resource[0]

        data = filterListDetail([detail])[0]

        console.log(data)
        hadnleInject()
      })
    }
  })
}
