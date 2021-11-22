import Vue from 'vue';
const base_api = Vue.prototype.$fetch;
const preUrl = '/api'
const performTaskViewApi= {
    /**
     * 获取执行任务详情
     * @param params
     * @returns {Promise<unknown>}
     */
    getImplementTask: (params) => base_api.get(`${preUrl}/other/content/info`, params),
    /**
     * @date 2021-11-19 18:23:25
     * @describe: 获取上传文件地址
     */
    getUploadUrl: () => {
        return `${preUrl}/other/content/upload`
    },
    /**
     * 提交任务数据
     * @param data
     * @returns {Promise<unknown>}
     */
    submitWorkData: (data) => base_api.post(`${preUrl}/other/content/update/work`, data)
}

export default performTaskViewApi

