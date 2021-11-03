import qs from 'qs';

export function createScript(url, parameter = {}) {
    var cache = createScript.cache || {};

    const script = document.createElement('script');
    const callback = typeof parameter === 'function'
        ? parameter
        : parameter['callback'];
    const params = typeof parameter !== 'function' && parameter['params'];

    if (cache[url]) {
        document.body.removeChild(cache[url]);
    }

    if (callback) {
        script.onload = callback;
    }

    if (params) {
        url += '?' + qs.stringify(params);
    }

    script.src = url;
    script.async = true;
    document.body.appendChild(script);

    cache[url] = script;

    createScript.cache = cache;
}

/**
 * json数组去重
 * @param array 数组
 * @param key 标识key 必须唯一
 * @returns {*[]}
 */
export function getNoRepeat(array, key) {
    if ((typeof array !== 'object' && array.length === 0) || !key) {
        return []
    }
    let hash = {};
    array = array.reduce(function(item, next) {
        hash[next[key]] ? '' : hash[next[key]] = true && item.push(next);
        return item
    }, [])
    return array
}
  export function browser () {
    // console.log('navigator:', navigator);
    // alert(JSON.stringify(navigator.userAgent));
    let e = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    let v =
    e.match (/OS ([\d_.]+) like Mac OS X/) ||
    e.match (/Android[\s]([\d.]+)/) ||
    '0_0';
    const bar = e.match (/fullScreen\/([\d.]+)/i);
    const statusBarHeight = bar !== null ? bar[1] : 0;
    return {
      mobile: !!e.match(/AppleWebKit.*Mobile.*/) || !!e.match (/AppleWebkit/),
      ios: !!e.match (/\(i[^;]+;( U;)? CPU.+Mac OS X/),
      android: e.indexOf ('Android') > -1 || e.indexOf ('Linux') > -1,
      version: v[1].split ('_').join ('.'),
      isChrome: !!e.match (/Chrome/) && !!e.match (/Google Inc/),
      isApp: !!e.match (/要设置的默认MyApp值/),
      statusBarHeight
    }
  }
