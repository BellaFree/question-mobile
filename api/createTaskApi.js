import Vue from 'vue';
import { Dialog } from 'vant';
const fetch = new Vue().$fetch;
const baseUrl = '/api';

function promiseDefaultThen(result) {
  if (typeof result === 'string') {
    return;
  }
  let { code, data, message } = result;
  if (code === 200) {
    return data;
  }
  Dialog.alert({ message });
  return null;
}

function  promiseDefaultError(error) {
  let { message } = error;
  Dialog.alert({ message });
  return null;
}

const http = {
  /**
   * @description: 获取人员架构树
   * @param {object} params.userNo 用户编号
   * @return {Promise<array>}
   */
  async getDicosUserList(params) {
    return await fetch.get(baseUrl + '/dicosUserOrg/getUserList', params)
      .then(result => promiseDefaultThen(result))
      .catch(error => promiseDefaultError(error));
  },
  /**
   * @description: 审批人获取人员架构树
   * @param {object} params.userNo 用户编号
   * @return {Promise<array>}
   */
  async getApproveUserList(params) {
    return await fetch.get(baseUrl + '/dicosUserOrg/getApproveUserList', params)
      .then(result => promiseDefaultThen(result))
      .catch(error => promiseDefaultError(error));
  },

  /**
   * @description: 根据用户获取组织架构
   * @param {object} params.userNo 用户编号
   * @return {Promise<array>}
   */
  async getDicosStoreOrgList(params) {
    return await fetch.get(baseUrl + '/dicosStoreOrg/getOrgList', params)
      .then(result => promiseDefaultThen(result))
      .catch(error => promiseDefaultError(error));
  },

  /**
   * @description: 获取店铺列表
   * @param {string} params.orgId *组织id
   * @param {string} params.searchStr 门店搜索字段
   * @return {Promise<array>}
   */
  async getDicosStoreList(params) {
    return await fetch.get(baseUrl + '/dicosStoreOrg/getStoreList', params)
      .then(result => promiseDefaultThen(result))
      .catch(error => promiseDefaultError(error));
  },

  /**
   * @description: 创建或更新任务
   * @return {Promise}
   */
  async saveWorkTask(params) {
    return await fetch.post(baseUrl + '/dicosWork/saveWork', params);
  },

  /**
   * @description:
   * @param {*} params
   * @return {Promise<array>}
   */
  async getWorkTaskDetails(params) {
    return await fetch.get(baseUrl + '/dicosWork/getWorkDetail', params)
      .then(result => promiseDefaultThen(result))
      .catch(error => promiseDefaultError(error));
  },

  /**
   * @description: 获取不同状态的店铺
   * @param {string} params.orgId 组织编号
   * @param {string} params.userNo 用户编号
   * @param {string} params.workNo 任务编号
   * @return {*}
   */
  async getUserDiffStore(params) {
    return await fetch.get(baseUrl + '/dicosStoreOrg/getDiffStatusStore', params);
    // .then(result => {
    //   console.log(result);
    // })
    // .catch(error => {
    //   console.log(error);
    // });
  },

  /**
   * @description: 终止任务
   * @param {string} params.workNo 任务编号
   */
  async terminateWorkTask(params) {
    return await fetch.get(baseUrl + '/dicosWork/terminateWork', params)
      .then(result => Dialog.alert({ message: result.message }))
      .catch(error => Dialog.alert({ message: error.message }));
  },

  /**
   * @description: 删除任务
   * @param {string} params.workNo 任务编号
   */
  async deleteWorkTask(params) {
    return await fetch.get(baseUrl + '/dicosWork/deleteWork', params)
      .then(result => Dialog.alert({ message: result.message }))
      .catch(error => Dialog.alert({ message: error.message }));
  }
};

export default http;
