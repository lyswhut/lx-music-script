import forge from 'node-forge'
import { sizeFormate, formatPlayTime, request, openApp } from '@/utils'

let data = null

const idRxp = /(?:id=|(?:song|playlist)\/)(\d+)/

let dom_iframe

const getSinger = (singers) => {
  let arr = []
  singers.forEach(singer => {
    arr.push(singer.name)
  })
  return arr.join('、')
}

const filterList = ({ songs, privileges }) => {
  // console.log(songs, privileges)
  const list = []
  songs.forEach((item, index) => {
    const types = []
    const _types = {}
    let size
    let privilege = privileges[index]
    if (privilege.id !== item.id) privilege = privileges.find(p => p.id === item.id)
    if (!privilege) return

    switch (privilege.maxbr) {
      case 999000:
        size = null
        types.push({ type: 'flac', size })
        _types.flac = {
          size,
        }
      case 320000:
        if (item.h) {
          size = sizeFormate(item.h.size)
          types.push({ type: '320k', size })
          _types['320k'] = {
            size,
          }
        }
      case 192000:
      case 128000:
        if (item.l) {
          size = sizeFormate(item.l.size)
          types.push({ type: '128k', size })
          _types['128k'] = {
            size,
          }
        }
    }

    types.reverse()

    list.push({
      singer: getSinger(item.ar),
      name: item.name,
      albumName: item.al.name,
      albumId: item.al.id,
      source: 'wy',
      interval: formatPlayTime(item.dt / 1000),
      songmid: item.id,
      img: item.al.picUrl,
      lrc: null,
      otherSource: null,
      types,
      _types,
      typeUrl: {},
    })
  })
  return list
}

const injectStyle = () => {
  const style = dom_iframe.contentWindow.document.createElement('style')
  style.innerHTML = '.btns{display: flex; flex-flow: row wrap;} .btns > a {margin-bottom: 6px;} .margin-right { margin-right: 5px; }'
  dom_iframe.contentWindow.document.head.appendChild(style)
}

const injectBtn = () => {
  let dom_btn = dom_iframe.contentWindow.document.querySelector('.btns .u-btni-add')
  if (!dom_btn) dom_btn = dom_iframe.contentWindow.document.querySelector('.btns .u-vip-btn-group')
  if (!dom_btn) dom_btn = dom_iframe.contentWindow.document.querySelector('.btns .u-btni-openvipply')
  if (!dom_btn) dom_btn = dom_iframe.contentWindow.document.querySelector('.btns .u-btni-play')
  return dom_btn
}

const createBtn = (label, onClick, className = 'u-btn2 u-btn2-2 u-btni-addply f-fl margin-right') => {
  const dom_a = dom_iframe.contentWindow.document.createElement('a')
  dom_a.className = className
  dom_a.innerHTML = `<i>${className.includes('u-btn2-2') ? '<em class="ply"></em>' : ''}${label}</i>`
  dom_a.addEventListener('click', onClick)
  return dom_a
}

const injectPlaylistPage = ({ id }) => {
  const dom_btn = injectBtn()
  if (!dom_btn) return

  dom_btn.insertAdjacentElement('afterend', createBtn('在 LX Music 中打开', () => {
    openApp('songlist', 'open', {
      source: 'wy',
      id,
    })
  }, 'u-btni u-btni-share'))
  dom_btn.insertAdjacentElement('afterend', createBtn('在 LX Music 中播放', () => {
    openApp('songlist', 'play', {
      source: 'wy',
      id,
    })
  }))
}

const injectSongDetailPage = (musicInfo) => {
  console.log(musicInfo)
  const dom_btn = injectBtn()
  if (!dom_btn) return
  dom_btn.insertAdjacentElement('afterend', createBtn('在 LX Music 中播放', () => {
    openApp('music', 'play', musicInfo)
  }))
}

const hadnleInject = () => {
  if (!data) return
  if (dom_iframe.contentWindow.location.href.includes('/playlist?')) {
    injectPlaylistPage(data)
  } else if (/\/song(\?|\/)/.test(dom_iframe.contentWindow.location.href)) {
    injectSongDetailPage(data)
  }
}

// https://github.com/listen1/listen1_chrome_extension/blob/master/js/provider/netease.js
const create_secret_key = (size) => {
  const result = []
  const choice = '012345679abcdef'.split('')
  for (let i = 0; i < size; i += 1) {
    const index = Math.floor(Math.random() * choice.length)
    result.push(choice[index])
  }
  return result.join('')
}
const aes_encrypt = (text, sec_key, algo) => {
  const cipher = forge.cipher.createCipher(algo, sec_key)
  cipher.start({ iv: '0102030405060708' })
  cipher.update(forge.util.createBuffer(text))
  cipher.finish()
  return cipher.output
}
const rsa_encrypt = (text, pubKey, modulus) => {
  text = text.split('').reverse().join('') // eslint-disable-line no-param-reassign
  const n = new forge.jsbn.BigInteger(modulus, 16)
  const e = new forge.jsbn.BigInteger(pubKey, 16)
  const b = new forge.jsbn.BigInteger(forge.util.bytesToHex(text), 16)
  const enc = b.modPow(e, n).toString(16).padStart(256, '0')
  return enc
}
const weapi = (text) => {
  const modulus =
    '00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b72' +
    '5152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbd' +
    'a92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe48' +
    '75d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7'
  const nonce = '0CoJUm6Qyw8W8jud'
  const pubKey = '010001'
  text = JSON.stringify(text) // eslint-disable-line no-param-reassign
  const sec_key = create_secret_key(16)
  const enc_text = btoa(
    aes_encrypt(
      btoa(aes_encrypt(text, nonce, 'AES-CBC').data),
      sec_key,
      'AES-CBC',
    ).data,
  )
  const enc_sec_key = rsa_encrypt(sec_key, pubKey, modulus)
  const data = {
    params: enc_text,
    encSecKey: enc_sec_key,
  }

  return data
}


const wyWeapiRequest = (method, url, data) => {
  const json = weapi(data)
  return request(method, url, `params=${encodeURIComponent(json.params)}&encSecKey=${encodeURIComponent(json.encSecKey)}`, {
    'Content-Type': 'application/x-www-form-urlencoded',
  })
}

export default () => {
  window.addEventListener('DOMContentLoaded', () => {
    dom_iframe = document.getElementById('g_iframe')
    if (!dom_iframe) return
    dom_iframe.addEventListener('load', () => {
      injectStyle()

      if (dom_iframe.contentWindow.location.href.includes('/playlist?')) {
        if (!idRxp.test(dom_iframe.contentWindow.location.href)) return
        const id = RegExp.$1
        data = {
          id,
          source: 'wy',
        }
        hadnleInject()
      } else if (/\/song(\?|\/)/.test(dom_iframe.contentWindow.location.href)) {
        if (!idRxp.test(dom_iframe.contentWindow.location.href)) return
        const id = RegExp.$1
        wyWeapiRequest('POST', 'https://music.163.com/weapi/v3/song/detail', {
          c: '[{"id":' + id + '}]',
        }).then((res) => {
          if (res.code != 200) return
          data = filterList(res)[0]
          hadnleInject()
        })
      }
    })
  })
}
