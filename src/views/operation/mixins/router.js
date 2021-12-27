
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
                '1.0': 'rgb(197, 4, 4)',
                '1': 'rgb(197, 4, 4)',
                '2.0': 'rgb(39, 22, 196)',
                '2': 'rgb(39, 22, 196)',
                '3.0': 'rgb(76, 140, 6)',
                '3': 'rgb(76, 140, 6)',
                '4.0': 'rgb(74, 144, 226)',
                '4': 'rgb(74, 144, 226)',
                '5.0': 'rgb(0, 125, 134)',
                '5': 'rgb(0, 125, 134)',
                '6.0': 'rgb(131, 86, 46)',
                '6': 'rgb(131, 86, 46)',
                '7.0': 'rgb(208, 160, 82)',
                '7': 'rgb(208, 160, 82)'
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
    // mounted() {
    //     this.getCurrentCity()
    // },
    methods: {
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
                    console.info(item.routeVos)
                    let color = item.routeVos && item.routeVos.length > 0 ? item.routeVos[0]['week'] : getRandomColor()
                    color = this.weekOption[color]
                    lineData.push({
                        path: item.LineGeom,
                        strokeColor: color
                    })
                    // 点位数据处理
                    storeData = storeData.concat(item.routeVos)
                    // this.test()
                }
            }
            //点位数据处理
            if(Array.isArray(storeData) && storeData.length > 0) {
                for(let item of storeData) {
                    // console.info(item)
                    item.lat = item.signLat
                    item.lng = item.signLng
                    item.week = item.week && Number(item.week)
                    item.content = `<div class="store-icon" style='background: ${this.weekOption[item.week]}'>${item.week}</div>`
                }
            }
            // console.info('绘制 线路', lineData)
            // console.info('绘制 点位数据处理', storeData)
            // 绘制 线路
            let lineResult = this.drawLine({
                data: lineData,
                alias: 'path',
                strokeWeight: 3
            })
            this.lineMapResult = lineResult
            // 绘制 点位
            this.storeMarkResult = this.drawMark({
                data: storeData,
                offset: new AMap.Pixel(-10, -5),
            })
            //放置到视图中
            this.map.setFitView(this.storeMarkResult)
        },
        // 获取计划点数据
        getChildData() {
            this.$nextTick(() => {
                this.$refs.pointChild.tap(0)
            })
        },
        // 重新定位
        reloadPosition() {
            // this.loading = true
            this.getCurrentPosition()
                .then(res => {
                    if (res.info === "SUCCESS" && res.addressComponent) {
                        this.loading = false
                        // 重置中❤️点
                        this.map.setCenter(res.position)
                        console.info(res)
                        // this.positionPicker()
                    }
                })
                .catch(err => console.error(err))
        },
        test() {
            this.citySearch.getLocalCity(function (status, result) {
                console.info(status, result)
            })
        }
    }
}
export default router
