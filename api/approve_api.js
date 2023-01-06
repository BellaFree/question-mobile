import Vue from 'vue';
const base_api = Vue.prototype.$fetch;
const preUrl = '/api';
const approveApi = {
  /**
     * 获取审批状态字典数据
     * @param data
     * @returns {Promise<unknown>}
     */
  getApproveStatus: (data) => base_api.get(`${preUrl}/addDp/data/info`, data),
  /**
     * 获取城市数据
     * @param data
     * @returns {Promise<unknown>}
     */
  getApproveCity: (data) => base_api.get(`${preUrl}/addDp/region/data`, data),
  /**
   * 获取审批列表
   * @param data
   * @returns {Promise<unknown>}
   */
  getApproveList: (data) => base_api.post(`${preUrl}/addDp/approval/list`, data),
};
export default approveApi;
