class Utils {
  cloneDeep(value) {
    return JSON.parse(JSON.stringify(value));
  }
}
export default new Utils;
