import Vue from 'vue';
const base_api = Vue.prototype.$fetch;
const preUrl = '/dicosApi'
const statisticalReportApi = {
    /**
     * 获取 访店记录 路线数据
     * @param params
     * @returns {Promise<unknown>}
     */
    getVisitStoreLine: (params) => base_api.get(`${preUrl}/dicos-report/shop-visit/info`, params),

}
export default statisticalReportApi
