import Vue from 'vue';
const base_api = Vue.prototype.$fetch;
const preUrl = '/api'
const MANAGEMENT_TASK_API= {
    getItinerary: (params) => base_api.post(`${preUrl}/dicos/task/trip`,params),//行程日程
    getStoreList:(params) => base_api.get(`${preUrl}/dicosStoreOrg/getStoreList`,params),//行程日程--获取店铺列表
    /**
     * 任务列表
     * @param data
     *  model 0: 全部 1: 我的 2: 下属任务
     *  userNo 用户id
     *  begin 任务开始时间
     *  end 任务结束时间
     *  sort 开始时间排序 asc/desc
     *  status 0/null:全部、1:催办、2:已逾期、3:进行中、4:未开始、5:已完成、6:已阅、7:已终止、8:审核中、9:审核失败、10:审核通过
     *  workName
     * @returns {Promise<unknown>}
     */
    getTaskList: (data) => base_api.post(`${preUrl}/dicos/task/search`, data),


}
export default MANAGEMENT_TASK_API

