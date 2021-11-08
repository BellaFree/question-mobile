import Vue from 'vue';
import { Dialog } from 'vant';
const fetch = new Vue().$fetch;
const http = {
  async getDicosUserList() {
    return await fetch.get('/api/dicosUserOrg/getUserList')
      .then(result => {
        let { data, message } = result;
        if (message === 'SUCCESS') {
          return data;
        }
        Dialog.alert({ message });
        return null;
      })
      .catch(error => {
        Dialog.alert({ message: error.message, });
        return null;
      });
  }
};

export default http;
