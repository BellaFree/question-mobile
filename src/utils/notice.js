import Vue from 'vue'
const v = new Vue
export default {
  install: Vue => {
    Vue.prototype.$notice = v
  }
}
