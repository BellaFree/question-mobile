import Vue from 'vue';
const base_api = Vue.prototype.$fetch;
const preUrl = 'http://192.168.1.36:4396'
const Approve_task_API= {
    getApproveList: (params) => base_api.get(`${preUrl}/approve/list?`,params),
    getApproveDetail: (params) => base_api.get(`${preUrl}/approve/info?`,params),
    getLocalDetail:(params)=>base_api.get(`${preUrl}/approve/detail?`,params),
}
export default Approve_task_API
//http://192.168.1.36:4396
