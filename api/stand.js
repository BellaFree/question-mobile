import Vue from 'vue';
const base_api = Vue.prototype.$fetch;
const preUrl = '/napi'
const PLAN_ACT_API= {
    getPlan: (params) => base_api.get(`${preUrl}/dev/plan/getPlanPointTable?`,params),
    getAct: (params) => base_api.get(`${preUrl}/dev/plan/getActualPointTable?`,params),
    getWarnList:(params)=>base_api.get(`${preUrl}/fm/warn/getWarnList?`,params),
}
export default PLAN_ACT_API
