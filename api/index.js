import axios from 'axios';
// import VueCookie from 'vue-cookies';
import { Indicator, MessageBox } from 'mint-ui';
const qs = require ('qs');

function clear () {
    var keys = document.cookie.match (/[^ =;]+(?==)/g);
    if (keys) {
      for (var i = keys.length; i--; )
        document.cookie = keys[i] + '=0;expires=' + new Date (0).toUTCString ();
    }
    sessionStorage.clear ();
}

async function commonParams (params) {
    let query = {
        isLoading: params.isLoading === undefined
    };
    return { params, query };
}

axios.defaults.timeout = 60000;
axios.interceptors.request.use (
    function (config) {
        // console.log('config.headers:', config.headers);
        // Object.assign(config.headers, {token: VueCookie.get ('token')});
        if (
            (config.data && config.data.isLoading == true) ||
            (config.params && config.params.isLoading)
        ) {
            Indicator.close();
            Indicator.open ('loading...');
        }
        return config;
    }, function (error) {
        Indicator.close();
        return Promise.reject (error);
    }
);
axios.interceptors.response.use (
    function (response) {
        if (
            (response.config.data &&
              (typeof response.config.data === 'function' ||
                typeof response.config.data === 'string') &&
              response.config.data.match (/"isLoading":true/) !== null) ||
            (response.config.params && response.config.params.isLoading)
        ) {
            Indicator.close();
        }
        if (response.data) {
            let r = response.data;
            if (r.code && r.code != 200) {
                alert(r.msg || r.message);
                // Vue.prototype.$message.error (r.msg || r.message);
            }
        }
        return response;
    }, function (error) {
        Indicator.close();
        let res = error.response;
        switch (res.status) {
          case 401:
            clear ();
            MessageBox({
                title: '',
                message: res.data.message,
            })
            .then(action => {
                if (action == 'confirm') {
                    window.location.href = '/error/2'
                }
            });
            break;
          default:
                MessageBox({
                    title: '',
                    message: res.data
                });
        }
        return Promise.reject (res.data);
    }
);

const api = {
    async get (url, params = {}, options = {}) {
        const parameter = await commonParams (params);
        params = Object.assign (parameter.query, parameter.params);
        // console.log('parameter:', parameter);
        // console.log(url, params, options);
        try {
            let res = await axios.get (url, {params: params}, options);
            res = res.data;
            return new Promise (resolve => {
                if (res.code == 0) {
                    resolve (res);
                } else {
                    resolve (res);
                }
                resolve (res);
            })
        } catch (err) {
            if (err) {
                // console.log(err)
                return new Promise (resolve => {
                    resolve (err);
                })
            }
        }
    },
    async post (url, params = {}, isForm = false, isFormData = false, options = {}) {
        if (!isFormData) {
            const parameter = await commonParams (params);
            params = Object.assign (parameter.query, parameter.params);
        }
        if (isForm) {
            params = qs.stringify (params);
        }
        try {
            let res = await axios.post (url, params, options);
            res = res.data;
            return new Promise (resolve => {
                resolve (res)
            })
        } catch (err) {
            if (err) {
                console.log (err);
            }
        }
    },
};

export const fetch = {
    install: Vue => {
        Vue.prototype.$fetch = api;
    }
};
