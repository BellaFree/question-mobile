class Utils {
  cloneDeep(value) {
    return JSON.parse(JSON.stringify(value));
  }

  dateFormatZP(n) {
    n = n * 1;
    if (n < 10) {
      n = '0' + n;
    }
    return n;
  }

  dateFormat(_Date) {
    _Date = new Date(_Date);
    let year = _Date.getFullYear();
    let month = this.dateFormatZP(_Date.getMonth() + 1);
    let date = this.dateFormatZP(_Date.getDate());
    return `${ year }-${ month }-${ date }`;
  }
}
export default new Utils;
