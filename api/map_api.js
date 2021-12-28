import Vue from 'vue';
const base_api = Vue.prototype.$fetch;
const preUrl = '/api'
const newUrl = '/api'

const MAP_API = {
  /**
   * 高德行政区域查询
   * @param { object }
   */
   amapDistrict:'https://restapi.amap.com/v3/config/district',
   /**
   * 热力图
   * @param { object } params
   */
    pedestrianByTA_Phone: (params) => base_api.post(`${preUrl}/poi/temp/pedestrianByTA_Phone`, {params}),
   /**
   * 单个网格详情数据
   * @param { object } params
   */
    getPotentialAreaDetail: (params) => base_api.post(`${preUrl}/tradeArea/getPotentialAreaDetail`, params), // 老接口
    getNewPotentialAreaDetail: (params) => base_api.get(`${newUrl}/dev/grid/getGridExtInfo${params}`, ), // 新接口
   /**
   * 高德调用搜索信息 后期改为接口搜索
   * @param { object } params
   */
    getSearchReasult: (params) => base_api.get(`${newUrl}/dev/biz/query/store/list${params}`, ),
   /**
   * 获取门店详情接口
   * @param { object } params fmMapStoreId
   */
    getStoreDetail: (params) => base_api.get(`${newUrl}/store/dev/map/store${params}`),
   /**
   * 获取基盘详情接口
   * @param { object } params fmMapBpStoreId
   */
    getBaseDetail: (params) => base_api.get(`${newUrl}/store/dev/map/bp${params}`),
   /**
   * 获取基盘pdf接口
   * @param { object } params bpCode
   */
    getPdfReport: (params) => base_api.get(`${newUrl}/dev/pdf/getPdfReport${params}`),
   /**
   * 获取竞品详情接口
   * @param { object } params fmMapCompetitorStoreId
   */
    getProductDetail: (params) => base_api.get(`${newUrl}/store/dev/map/competitor${params}`),
   /**
   * exam
   * @param { object } params
   */
    exam: (params) => base_api.get(`${preUrl}`, params),
}

export default MAP_API
