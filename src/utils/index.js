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
  if (typeof array !== 'object' && array.length === 0 || !key) {
    return [];
  }
  let hash = {};
  array = array.reduce(function(item, next) {
    hash[next[key]] ? '' : hash[next[key]] = true && item.push(next);
    return item;
  }, []);
  return array;
}
export function browser() {
  // console.log('navigator:', navigator);
  // alert(JSON.stringify(navigator.userAgent));
  let e = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  let v =
    e.match(/OS ([\d_.]+) like Mac OS X/) ||
    e.match(/Android[\s]([\d.]+)/) ||
    '0_0';
  const bar = e.match(/fullScreen\/([\d.]+)/i);
  const statusBarHeight = bar !== null ? bar[1] : 0;
  return {
    mobile: !!e.match(/AppleWebKit.*Mobile.*/) || !!e.match(/AppleWebkit/),
    ios: !!e.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
    android: e.indexOf('Android') > -1 || e.indexOf('Linux') > -1,
    version: v[1].split('_').join('.'),
    isChrome: !!e.match(/Chrome/) && !!e.match(/Google Inc/),
    isApp: !!e.match(/要设置的默认MyApp值/),
    statusBarHeight
  };
}

/**
 * 姓名切分处理
 * @param val 姓名
 */
export function nameFilter(val) {
  const doubleSurname = [ '纳兰', '欧阳', '太史', '端木', '上官', '司马', '东方', '独孤', '南宫', '万俟', '闻人', '夏侯', '诸葛', '尉迟', '公羊', '赫连', '澹台', '皇甫', '宗政', '濮阳', '公冶', '太叔', '申屠', '公孙', '慕容', '仲孙', '钟离', '长孙', '宇文', '司徒', '鲜于', '司空', '闾丘', '子车', '亓官', '司寇', '巫马', '公西', '颛孙', '壤驷', '公良', '漆雕', '乐正', '宰父', '谷梁', '拓跋', '夹谷', '轩辕', '令狐', '段干', '百里', '呼延', '东郭', '南门', '羊舌', '微生', '公户', '公玉', '公仪', '梁丘', '公仲', '公上', '公门', '公山', '公坚', '左丘', '公伯', '西门', '公祖', '第五', '公乘', '贯丘', '公皙', '南荣', '东里', '东宫', '仲长', '子书', '子桑', '即墨', '达奚', '褚师' ];
  if (!val) {
    return null;
  }
  // 名称长度2
  if (val.length <= 2) {
    return  val;
  }
  /**
     * 先切分前两位 匹配复姓
     */
  let secondTxt = val.substring(0, 2);
  // 当前姓名为复姓
  if (doubleSurname.includes(secondTxt)) {
    return val.substring(2);
  } else {
    return val.substring(1);
  }
}
