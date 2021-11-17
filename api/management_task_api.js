import Vue from 'vue';
const base_api = Vue.prototype.$fetch;
const preUrl = '/api'
const MANAGEMENT_TASK_API= {
    getItinerary: (params) => base_api.get(`${preUrl}/dicos/task/trip`,params),//行程日程



}
export default MANAGEMENT_TASK_API

