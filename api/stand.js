import Vue from 'vue';
const base_api = Vue.prototype.$fetch;
const preUrl = '/api'
const PLAN_ACT_API= {
    // 查询计划点列表
    getPlan: (params) => base_api.get(`${preUrl}/dev/plan/getPlanPointTable`,params),
    // 查询实际点列表
    getAct: (params) => base_api.get(`${preUrl}/dev/plan/getActualPointTable`,params),
    // 获取异常预警列表
    getWarnList:(params)=>base_api.get(`${preUrl}/fm/warn/getWarnList`,params),
}
export default PLAN_ACT_API
