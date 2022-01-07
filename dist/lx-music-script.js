// ==UserScript==
// @name         lx-msuic 辅助脚本
// @namespace    lx-music-script
// @version      0.1.0
// @author       lyswhut
// @description  lx-msuic 辅助脚本
// @@homepage    https://github.com/lyswhut/lx-music-script#readme
// @supportURL   https://github.com/lyswhut/lx-music-script/issues
// @match        https://y.qq.com/*
// @run-at       document-start
// @noframes
// @icon         https://www.google.com/s2/favicons?domain=qq.com
// @grant        GM_cookie
// ==/UserScript==
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 318:
/***/ ((module) => {

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault, module.exports.__esModule = true, module.exports.default = module.exports;

/***/ }),

/***/ 579:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(601)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_sources) {
  "use strict";

  var _interopRequireDefault = __webpack_require__(318);

  _sources = _interopRequireDefault(_sources);

  switch (window.location.hostname) {
    case 'y.qq.com':
      _sources.default.tx();

      break;

    default:
      break;
  }
});

/***/ }),

/***/ 601:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(500)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _tx) {
  "use strict";

  var _interopRequireDefault = __webpack_require__(318);

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _tx = _interopRequireDefault(_tx);
  // import kw from './kw'
  // import kg from './kg'
  // import wy from './wy'
  // import mg from './mg'
  var _default = {
    // kw,
    // kg,
    tx: _tx.default // wy,
    // mg,

  };
  _exports.default = _default;
});

/***/ }),

/***/ 500:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(853)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _utils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  let data = {};

  const getSinger = singers => {
    let arr = [];
    singers.forEach(singer => {
      arr.push(singer.name);
    });
    return arr.join('、');
  };

  const filterListDetail = rawList => {
    // console.log(rawList)
    return rawList.map(item => {
      let types = [];
      let _types = {};

      if (item.file.size_128mp3 !== 0) {
        let size = (0, _utils.sizeFormate)(item.file.size_128mp3);
        types.push({
          type: '128k',
          size
        });
        _types['128k'] = {
          size
        };
      }

      if (item.file.size_320mp3 !== 0) {
        let size = (0, _utils.sizeFormate)(item.file.size_320mp3);
        types.push({
          type: '320k',
          size
        });
        _types['320k'] = {
          size
        };
      }

      if (item.file.size_ape !== 0) {
        let size = (0, _utils.sizeFormate)(item.file.size_ape);
        types.push({
          type: 'ape',
          size
        });
        _types.ape = {
          size
        };
      }

      if (item.file.size_flac !== 0) {
        let size = (0, _utils.sizeFormate)(item.file.size_flac);
        types.push({
          type: 'flac',
          size
        });
        _types.flac = {
          size
        };
      } // types.reverse()


      return {
        singer: getSinger(item.singer),
        name: item.title,
        albumName: item.album.title,
        albumId: item.album.id,
        source: 'tx',
        interval: (0, _utils.formatPlayTime)(item.interval),
        songId: item.id,
        albumMid: item.album.mid,
        strMediaMid: item.file.media_mid,
        songmid: item.mid,
        img: item.album.name === '' || item.album.name === '空' ? `https://y.gtimg.cn/music/photo_new/T001R500x500M000${item.singer[0].mid}.jpg` : `https://y.gtimg.cn/music/photo_new/T002R500x500M000${item.album.mid}.jpg`,
        lrc: null,
        otherSource: null,
        types,
        _types,
        typeUrl: {}
      };
    });
  };

  const injectStyle = () => {
    const style = document.createElement('style');
    style.innerHTML = '.data__actions {white-space: nowrap;} ';
    document.head.appendChild(style);
  };

  let dom_loading;

  const injectBtn = async callback => {
    const dom_btn = document.querySelector('.data__actions a');

    if (!dom_btn) {
      const current_dom_loading = document.querySelector('.mod_loading');
      if (!current_dom_loading) return;
      dom_loading = current_dom_loading;
      current_dom_loading.addEventListener('DOMNodeRemoved', () => {
        if (dom_loading !== current_dom_loading) return;
        dom_loading = null;
        setTimeout(() => {
          const dom_btn = document.querySelector('.data__actions a');
          if (!dom_btn) return;
          callback(dom_btn);
        });
      });
      return;
    }

    callback(dom_btn);
  };

  const createBtn = (label, onClick, className = 'mod_btn_green') => {
    const dom_a = document.createElement('a');
    dom_a.className = className;
    dom_a.innerHTML = `<span class="btn__txt">${label}</span>`;
    dom_a.addEventListener('click', onClick);
    return dom_a;
  };

  const inJectPlaylistPage = ({
    id
  }) => {
    injectBtn(dom_btn => {
      dom_btn.insertAdjacentElement('afterend', createBtn('在 LX Music 中打开', () => {
        (0, _utils.openApp)('songlist', 'open', {
          source: 'tx',
          id
        });
      }, 'mod_btn'));
      dom_btn.insertAdjacentElement('afterend', createBtn('在 LX Music 中播放', () => {
        (0, _utils.openApp)('songlist', 'play', {
          source: 'tx',
          id
        });
      }));
    });
  };

  const inJectSongDetailPage = musicInfo => {
    console.log(musicInfo);
    injectBtn(dom_btn => {
      dom_btn.insertAdjacentElement('afterend', createBtn('在 LX Music 中播放', () => {
        (0, _utils.openApp)('music', 'play', musicInfo);
      }));
    });
  };

  const hadnleInject = () => {
    if (!data) return;

    if (window.location.pathname.includes('/playlist/')) {
      inJectPlaylistPage(data);
    } else if (window.location.pathname.includes('/songDetail/')) {
      inJectSongDetailPage(data);
    }
  };

  var _default = () => {
    window.addEventListener('load', () => {
      injectStyle();

      if (window.location.pathname.includes('/playlist/')) {
        // eslint-disable-next-line no-undef
        const detail = __INITIAL_DATA__.detail;
        data = {
          play_count: detail.listennum,
          id: detail.id,
          author: detail.host_nick,
          name: detail.title,
          img: detail.picurl,
          desc: detail.desc,
          source: 'tx'
        };
      } else if (window.location.pathname.includes('/songDetail/')) {
        // eslint-disable-next-line no-undef
        data = filterListDetail(__INITIAL_DATA__.songList)[0];
      }

      hadnleInject();
    }); // window.history.pushState = ((f) =>
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

    (0, _utils.requestHook)((url, requestBody, response) => {
      if (!requestBody) return;

      if (requestBody.includes('"module":"music.srfDissInfo.aiDissInfo"') && requestBody.includes('"method":"uniform_get_Dissinfo"')) {
        if (response.code != 0) {
          data = null;
          return;
        }

        let detail;

        for (const value of Object.values(response)) {
          var _value$data;

          if (value !== null && value !== void 0 && (_value$data = value.data) !== null && _value$data !== void 0 && _value$data.dirinfo) {
            detail = value.data.dirinfo;
            break;
          }
        }

        data = {
          play_count: detail.listennum,
          id: detail.id,
          author: detail.host_nick,
          name: detail.title,
          img: detail.picurl,
          desc: detail.desc,
          source: 'tx'
        };
        setTimeout(() => {
          hadnleInject();
        });
      } else if (requestBody.includes('"module":"music.pf_song_detail_svr"') && requestBody.includes('"method":"get_song_detail_yqq"')) {
        if (response.code != 0) {
          data = null;
          return;
        }

        let detail;

        for (const value of Object.values(response)) {
          var _value$data2;

          if (value !== null && value !== void 0 && (_value$data2 = value.data) !== null && _value$data2 !== void 0 && _value$data2.track_info) {
            detail = value.data.track_info;
            break;
          }
        }

        data = filterListDetail([detail])[0];
        setTimeout(() => {
          hadnleInject();
        });
      }
    });
  };

  _exports.default = _default;
});

/***/ }),

/***/ 853:
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.wait = _exports.sizeFormate = _exports.requestHook = _exports.openApp = _exports.formatPlayTime = _exports.encodeData = void 0;

  const requestHook = callback => {
    let oldXHROpen = window.XMLHttpRequest.prototype.open;

    window.XMLHttpRequest.prototype.open = function (method, url) {
      // do something with the method, url and etc.
      this.url = url; // this.addEventListener('load', function () {
      //   // do something with the response text
      //   console.log('load: ' + url)
      //   console.log(JSON.parse(this.responseText))
      //   try {
      //     callback(url, JSON.parse(this.responseText))
      //   } catch (_) {}
      // })

      return oldXHROpen.apply(this, arguments);
    };

    let oldXHRSend = window.XMLHttpRequest.prototype.send;

    window.XMLHttpRequest.prototype.send = function (data) {
      this.addEventListener('load', function () {
        // do something with the response text
        console.log('load: ' + data);
        console.log(JSON.parse(this.responseText));

        try {
          callback(this._url, data, JSON.parse(this.responseText));
        } catch (_) {}
      });
      oldXHRSend.call(this, data);
    };
  };

  _exports.requestHook = requestHook;

  const encodeData = data => encodeURIComponent(JSON.stringify(data));

  _exports.encodeData = encodeData;

  const sizeFormate = size => {
    // https://gist.github.com/thomseddon/3511330
    if (!size) return '0 B';
    let units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let number = Math.floor(Math.log(size) / Math.log(1024));
    return `${(size / Math.pow(1024, Math.floor(number))).toFixed(2)} ${units[number]}`;
  };

  _exports.sizeFormate = sizeFormate;

  const formatPlayTime = time => {
    let m = parseInt(time / 60);
    let s = parseInt(time % 60);
    return m === 0 && s === 0 ? '--/--' : (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
  };

  _exports.formatPlayTime = formatPlayTime;

  const openApp = (type, action, data) => {
    const dom_a = document.createElement('a');
    dom_a.href = `lxmusic://${type}/${action}?data=${encodeData(data)}`;
    dom_a.click();
  };

  _exports.openApp = openApp;

  const wait = time => new Promise(resolve => setTimeout(resolve, time));

  _exports.wait = wait;
});

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(579);
/******/ 	
/******/ })()
;