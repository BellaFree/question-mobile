import Vue from 'vue';
const base_api = Vue.prototype.$fetch;
const preUrl = '/dicosApi'
const STATISTICAL_REPORT_API= {
    getDivision: (params) => base_api.get(`${preUrl}/dicos-report/report/schedule?`,params),//本月任务进度*事业部
    getApproveDetail: (params) => base_api.get(`${preUrl}/approve/info?`,params),//审批详情
    getLocalDetail:(params)=>base_api.get(`${preUrl}/approve/detail?`,params),//任务地点详情
    ApproveTask:(params)=>base_api.post(`${preUrl}/approve/approve?`,params),//审批通过or拒绝
    UndoTask:(params)=>base_api.get(`${preUrl}/approve/cancel?`,params),//撤销中止任务
    /**
     * 获取 访店记录 路线数据
     * @param params
     * @returns {Promise<unknown>}
     */
    getVisitStoreLine: (params) => base_api.get(`${preUrl}/dicos-report/shop-visit/info`, params),

}
export default STATISTICAL_REPORT_API
