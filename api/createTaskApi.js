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
   */
  async getDicosUserList() {
    return await fetch.get(baseUrl + '/dicosUserOrg/getUserList')
      .then(result => promiseDefaultThen(result))
      .catch(error => promiseDefaultError(error));
  },

  /**
   * @description: 根据用户获取组织架构
   * @param {object} params.userNo 用户编号
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
   */
  async getDicosStoreList(params) {
    return await fetch.get(baseUrl + '/dicosStoreOrg/getStoreList', params)
      .then(result => promiseDefaultThen(result))
      .catch(error => promiseDefaultError(error));
  },

  async insertWorkTask(params) {
    return await fetch.post(baseUrl + '/dicosWork/saveWork', params);
  }
};

export default http;
