import Vue from 'vue';
const base_api = Vue.prototype.$fetch;
const preUrl = '/api'
const JourNeyApi = {
    /**
     * 当前用户权限的组织构成Head
     * @param params
     * @returns {Promise<unknown>}
     */
    getOrganizeHeader: (params) => base_api.get(`${preUrl}/dev/plan/org/head`, params),
    /**
     * 根据组织id 查询下辖数据
     * @param params
     * @returns {Promise<unknown>}
     */
    getInfoList: (params) => base_api.get(`${preUrl}/dev/plan/org/infolist`, params),
    /**
     * 获取路线信息
     * @param params
     * @returns {Promise<unknown>}
     */
    getRouteInfo: (data) => base_api.post(`${preUrl}/dev/plan/getRouteInfo`, data)
}
export default JourNeyApi
