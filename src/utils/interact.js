import { transBase64, transReturnBase64 } from './index'

export function browser () {
    // console.log('navigator:', navigator);
    // alert(JSON.stringify(navigator.userAgent));
    let e = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    let v = e.match (/OS ([\d_.]+) like Mac OS X/) || e.match (/Android[\s]([\d.]+)/) || '0_0';
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

export function jumpXinx (params) {
  return new Promise ((resolve) => {
    let info = JSON.stringify(params);
    console.log(info);
    let str = transBase64 (info);
  
    console.log('url:', `kfapp://location/current?params=${str}`);
    console.log('Base64.decode(str):', transReturnBase64(str));
  
    location.href = `kfapp://location/current?params=${str}`
    resolve ();
  })
}

// class Terminal {
//   constructor() {}
//   /**
//   * @description: 获取终端信息
//   * @return: cb回调函数
//   */
function getTerminal (androidCb, iosCb, pcCb) {
  let u = navigator.userAgent;
  let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
  let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  if (isAndroid) {
      androidCb();
  } else if (isIOS) {
      iosCb();
  } else {
      pcCb();
  }
}
// }
// export default new Terminal();

export function sendMessageToXinx (colorVal) {
  return new Promise ((resolve) => {
      // let info = JSON.stringify(params);
      // console.log(info);
      // let str = transBase64 (info);
      // console.log('str:', str);
      getTerminal (
          () => {
            console.log('Android color');
            setStatusBarColor.postMessage(colorVal)
            // writeCache.postMessage("location", str)
          },
          () => {
            console.log('ios color');
            // window.webkit.messageHandlers.writeCache.postMessage({key:"location",value: str})
            window.webkit.messageHandlers.setStatusBarColor.postMessage({color: colorVal})
          },
          () => {
            console.log('pc color');
          }
      );
      resolve ();
  })
}


