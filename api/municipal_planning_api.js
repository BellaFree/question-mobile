import Vue from 'vue';
const base_api = Vue.prototype.$fetch;
const preUrl = '/api'

const MUNICIPAL_PLANNING_API = {
  /**
   * @date 2021-11-19 18:23:25
   * @describe: 获取上传文件地址
   */
  getUploadUrl: () => {
    return `${preUrl}/store/dev/map/upload`
  },
  /**
   * 市政规划列表 Methods:POST
   * @param { object } params
   */
  getCityList: (params) => base_api.get(`${preUrl}/urbanplanning/feedback`, params),
  /**
   * 市政规划反馈 Methods:POST
   * @param feedbackId
   * @param userId
   * @param { object } params
   * /city/plan/upset
   * 更新市政规划 --编辑
   */
  reUpload: (feedbackId,params,userId) => base_api.post(`${preUrl}/urbanplanning/feedback/${feedbackId}/reset?userId=${userId}`,params),
  /**
   * 市政规划反馈 Methods:POST
   * @param feedbackId
   * @param userId
   * @param { object } params
   * /city/plan/upset
   * 更新市政规划 --编辑
   */
  getUpset: (feedbackId,params,userId) => base_api.post(`${preUrl}/urbanplanning/feedback/${feedbackId}?userId=${userId}`,params),
  /**
   * 新增 市政规划反馈 Methods:POST
   * /urbanplanning/feedback
   * @param userId
   * @param params
   */
  getAdd: (userId,params) => base_api.post(`${preUrl}/urbanplanning/feedback?userId=${userId}`,params),
  /**
   * 查询反馈详情 Methods:GET  市政规划提醒弹窗
   * @param feedbackId
   */
  // getDetail: (params) => base_api.get(`${preUrl}/city/plan/detail`, params),
  getDetail: (feedbackId) => base_api.get(`${preUrl}/urbanplanning/feedback/${feedbackId}`),
  /**
   * 导出反馈列表 Methods:GET
   * @param { object } params
   */
  getExport: `${preUrl}/urbanplanning/feedback/download`,

  /**
   * 获取当前账号的组织数据 Methods:GET
   * @param userId
   */
  // getOrginfo: (params) => base_api.get(`${preUrl}/city/plan/orginfo`, params),
  getOrginfo: (userId) => base_api.get(`${preUrl}/urbanplanning/orgtree?userId=${userId}`),
  /**
   * 上传图片到服务器
   * @param { object } params
   */
  expandUpload: (params) => base_api.post(`${preUrl}/store/dev/map/upload`, params),
  /**
   * 变更状态 Methods:GET
   * @param feedbackId
   * @param code
   * @param userId
   */
  // updatStatus: (params) => base_api.get(`${preUrl}/city/plan/update-status`, params),
  updatStatus: (feedbackId,code,userId) => base_api.post(`${preUrl}/urbanplanning/feedback/${feedbackId}/status/${code}?userId=${userId}`),
  /**
   * 市政规划点位 Methods:GET
   *
   */
  getIconList: (cityCode) => base_api.get(`${preUrl}/urbanplanning/feedback/points?cityCode=${cityCode}`),
  /*
  *
  * -------------------------------------------以下为老接口----------------------------
  *
  * */
  /**
   * 获取当前账号的担当 Methods:GET
   * @param { object } params
   */
  // getUserinfo: (params) => base_api.get(`${preUrl}/city/plan/userinfo`, params),
  getUserinfo: (params) => base_api.get(`${preUrl}/city/plan/userinfo?${params}`),
  /**
   * 模糊搜索用户 Methods:GET
   * @param { object } params
   */
  // getKeyword: (params) => base_api.get(`${preUrl}/city/plan/keyword`, params),
  getKeyword: (params) => base_api.get(`${preUrl}/city/plan/keyword?${params}`),
  /**
   * 获取图层数据 Methods:GET
   * @param { object } params
   */
  // getLayers: (params) => base_api.get(`${preUrl}/city/plan/layers`, params),
  getLayers: (params) => base_api.get(`${preUrl}/city/plan/layers?${params}`),
  /**
   * 获取icon(获取点位列表) Methods:GET
   * @param { object } params
   */
  // getIcon: (params) => base_api.get(`${preUrl}/city/plan/geticon`, params),
  getIcon: (params) => base_api.get(`${preUrl}/city/plan/geticon?${params}`),
  /**
   * 获取提示信息 Methods:GET
   * @param { object } params
   */
  // getPrompt: (params) => base_api.get(`${preUrl}/city/plan/prompt`, params),
  getPrompt: (params) => base_api.get(`${preUrl}/city/plan/prompt?${params}`),
  //---------------- 门店信息 ----------------//
  /**
   * 获取门店/基盘/竞品详细信息
   * @param { object } params
   */
  getChnlDetailInfo: (params) => base_api.post(`${preUrl}/poi/channel/detail/getChnlDetailInfo`, params),
  /**
   * 查询pdf地址
   * @param { object } params
   */
  pdfPath: (params) => base_api.post(`/api/channel/result/get/pdf/path`, params),
  /**
   * 获取报告数据
   * @param { object } params
   */
  generator: (params) => base_api.post(`${preUrl}/tradearea/report/generator`, params),
  /**
   * exam
   * @param { object } params
   */
  exam: (params) => base_api.get(`${preUrl}`, params),
}

export default MUNICIPAL_PLANNING_API

