import Vue from 'vue';
const base_api = Vue.prototype.$fetch;
const preUrl = '/api'
const performTaskViewApi= {
    /**
     * 获取执行任务详情
     * @param params
     * @returns {Promise<unknown>}
     */
    getImplementTask: (params) => base_api.get(`${preUrl}/other/content/info`,params),
}
export default performTaskViewApi

