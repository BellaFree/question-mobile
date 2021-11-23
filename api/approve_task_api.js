import Vue from 'vue';
const base_api = Vue.prototype.$fetch;
const preUrl = '/api'
const Approve_task_API= {
    getApproveList: (params) => base_api.get(`${preUrl}/approve/list?`,params),//审批列表
    getApproveDetail: (params) => base_api.get(`${preUrl}/approve/info?`,params),//审批详情
    getLocalDetail:(params)=>base_api.get(`${preUrl}/approve/detail?`,params),//任务地点详情
    ApproveTask:(params)=>base_api.post(`${preUrl}/approve/approve?`,params),//审批通过or拒绝
    UndoTask:(params)=>base_api.post(`${preUrl}/approve/cancel?`,params),//撤销中止任务

}
export default Approve_task_API

