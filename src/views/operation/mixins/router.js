
import JourNeyApi from '@api/journey_api'
import mapMethods from "./mapMethods";
// 随机色
import { getRandomColor} from '@/utils'
import {indexOf} from "core-js/internals/array-includes";
const router = {
    mixins: [mapMethods],
    data() {
        return {
            warningStatus:false,
            waringText: '',
            footprintStatus: false,
            weekStatus: true,
            pointStatus: false,
            calendarShow: false,
            weekOption: {
                '1': 'rgb(197, 4, 4)',
                '2': 'rgb(39, 22, 196)',
                '3': 'rgb(76, 140, 6)',
                '4': 'rgb(74, 144, 226)',
                '5': 'rgb(0, 125, 134)',
                '6': 'rgb(131, 86, 46)',
                '7': 'rgb(208, 160, 82)',
            },
            lineMap: new Map(),
            options: [], // 当担数组
            drawResult: new Map(),
            title: '',
            loading: false,
            minDate: new Date(2021, 10, 1),
            maxDate: new Date(2021, 12, 31),
            // 门店拜访详细数据
            tableData: [],
            // 线路数据 执行者
            routeDataExecutor: '',
            // 线路数据 组织
            routeDataOrganize: '',
            // 当前查看的门店 mark
            viewMarker: '',
            // 当前查看门店 info
            viewStoreInfo: '',
            // 门店地图绘制结果
            storeMarkResult: '',
            // 线路地图绘制结果
            lineMapResult: '',
            // name
            titleName: '访店记录',
            // 回退地址
            backUrl: '',

        }
    },
    methods: {
        // 获取路线信息
        getRouteData() {
            console.info('获取路线信息')
            if (!this.chooseTakeResponsibilityID) {
                this.$notify({
                    message: '请选择当担后进行查看',
                    type: "warning"
                })
                return
            }
            JourNeyApi.getRouteInfo({
                // "endDate": this.dateRange.planEndDate,
                // "startDate": this.dateRange.planStartDate,
                // "reqType": '1',
                // "orgId": this.chooseTakeResponsibilityParenID,
                // "workUserNo": this.chooseTakeResponsibilityID
                "endDate": "2021-12-17",
                "orgId": "AA114010800000000",
                "reqType": "1",
                "startDate": "2021-12-17",
                "workUserNo":  Array.isArray(this.chooseTakeResponsibilityID)? this.chooseTakeResponsibilityID : [].concat(this.chooseTakeResponsibilityID)
            })
                .then(res => {
                    if (res.code === 200) {
                        this.routeDataOrganize = res.data
                        this.startDrawMap()
                    } else {
                        this.$notify({
                            type: 'warning',
                            message: res.message,
                        })
                    }
                })
                .catch(err => console.error('请求路线信息数据报错', err))
        },
        // 关闭计划点弹层
        closePoint() {
            this.pointStatus = false
        },
        // 绘制路线 点位
        startDrawMap() {
            const { routeDataOrganize} = this;
            let lineData = []
            let storeData = []
            if(Array.isArray(routeDataOrganize) && routeDataOrganize.length > 0 ){
                for(let item of routeDataOrganize) {
                    // 路线数据处理
                    lineData.push({
                        path: item.lineGeom,
                        strokeColor: getRandomColor(),
                    })
                    // 点位数据处理
                    storeData = storeData.concat(item.routeVos)
                }
            }
            //点位数据处理
            if(Array.isArray(storeData) && storeData.length > 0) {
                for(let item of storeData) {
                    console.info(item)
                    item.lat = item.signLat
                    item.lng = item.signLng
                    item.content = `<div class="store-icon" style='background: ${this.weekOption[item.week]}'>${item.week}</div>`
                }
            }
            console.info('绘制 线路', lineData)
            console.info('绘制 点位数据处理', storeData)
            // 绘制 线路
            let lineResult = this.drawLine({
                data: lineData,
                alias: 'path',
                strokeWeight: 3
            })
            this.lineMapResult = lineResult
            // 绘制 点位
            this.storeMarkResult = this.drawMark({
                data: storeData
            })
            //放置到视图中
            this.map.setFitView(this.storeMarkResult)
        },
        // 获取计划点数据
        getChildData() {
            this.$nextTick(() => {
                this.$refs.pointChild.tap(0)
            })
        }
    }
}
export default router
