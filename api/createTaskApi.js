import Vue from 'vue';
import { Dialog } from 'vant';
const fetch = new Vue().$fetch;

function promiseDefaultThen(result) {
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
   */
  async getDicosUserList() {
    return await fetch.get('/api/dicosUserOrg/getUserList')
      .then(result => promiseDefaultThen(result))
      .catch(error => promiseDefaultError(error));
  },

  /**
   * @description: 根据用户获取组织架构
   * @param {object} params.userNo 用户编号
   */
  async getDicosStoreOrgList(params) {
    return await fetch.get('/api/dicosStoreOrg/getOrgList', params)
      .then(result => promiseDefaultThen(result))
      .catch(error => promiseDefaultError(error));
  },

  /**
   * @description: 获取店铺列表
   * @param {string} params.orgId *组织id
   * @param {string} params.searchStr 门店搜索字段
   */
  async getDicosStoreList(params) {
    return await fetch.get('/api/dicosStoreOrg/getStoreList', params)
      .then(result => promiseDefaultThen(result))
      .catch(error => promiseDefaultError(error));
  },
};

export default http;
