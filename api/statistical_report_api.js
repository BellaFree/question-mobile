import Vue from 'vue';
const base_api = Vue.prototype.$fetch;
const preUrl = '/api'
const STATISTICAL_REPORT_API= {
    getDivision: (params) => base_api.get(`${preUrl}/dicos-report/report/schedule?`,params),//本月任务进度*事业部
    getListDetails: (params) => base_api.post(`${preUrl}/dicos-report/shop-visit/info-list?`,params),//访店列表数据
    getStatisticalReport:(params)=>base_api.get(`${preUrl}/dicos-report/report?`,params),//统计报表 - 组织架构/门店餐厅
    getStoreList:(params) => base_api.get(`${preUrl}/dicosStoreOrg/getStoreList`,params),//统计报表--获取店铺列表
    getDivisionDetail:(params)=>base_api.get(`${preUrl}/dicos-report/org/report/info?`,params),//统计报表 - 组织架构详情(按日统计任务进度)
    /**
     * 获取 访店记录 路线数据
     * @param params
     * @returns {Promise<unknown>}
     */
    getVisitStoreLine: (params) => base_api.post(`${preUrl}/dicos-report/shop-visit/route`, params),
    /**
     * 获取门店拜访信息
     * @param params
     * @returns {Promise<unknown>}
     */
    getStoreVisitInfo:(params) => base_api.get(`${preUrl}/dicos-report/shop-visit/info`, params),

}
export default STATISTICAL_REPORT_API
