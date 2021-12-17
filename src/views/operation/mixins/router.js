import moment from "moment";
import JourNeyApi from '@api/journey_api'
import mapMethods from "./mapMethods";
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
            dateRange: {
                startDate: '',
                endDate: ''
            },
            weekOption: [
                {
                    name: '周一',
                    value: 1,
                    color: 'rgb(197, 4, 4)'
                },
                {
                    name: '周二',
                    value: 2,
                    color: 'rgb(39, 22, 196)'
                },
                {
                    name: '周三',
                    value: 3,
                    color: 'rgb(76, 140, 6)'
                },
                {
                    name: '周四',
                    value: 4,
                    color: 'rgb(74, 144, 226)'
                },
                {
                    name: '周五',
                    value: 5,
                    color: 'rgb(0, 125, 134)'
                },
                {
                    name: '周六',
                    value: 6,
                    color: 'rgb(131, 86, 46)'
                },
                {
                    name: '周日',
                    value: 0,
                    color: 'rgb(208, 160, 82)'
                }
            ],
            lineMap: new Map(),
            options: [], // 当担数组
            drawResult: new Map(),
            title: '',
            loading: false,
            minDate: new Date(2021, 10, 1),
            maxDate: new Date(2021, 12, 31)
        }
    },
    filters: {
        ellipsis(val, lengthNumber) {
            if (val) {
                if (val.length > lengthNumber) {
                    return val.substring(0, lengthNumber) + '...'
                } else {
                    return val
                }
            } else {
                return ''
            }
        }
    },
    mounted() {
        this.getCurrentWeek()
    },
    methods: {
        // 获取当前周
        getCurrentWeek() {
            let weekDay = moment().format('E')
            this.dateRange.startDate = moment().subtract(weekDay, 'days').format('YYYY-MM-DD')
            this.dateRange.endDate = moment().add(6 - weekDay, 'days').format('YYYY-MM-DD')
        },
        // 开启/关闭 足迹弹层
        openFootprint() {
            this.footprintStatus = !this.footprintStatus
        },
        // 确认选中的时间
        onConfirm(date) {
            this.calendarShow = !this.calendarShow;
            let weekDay = moment(date).format('d')
            let startTime = moment(date).subtract(weekDay, 'days').format('YYYY-MM-DD')
            let endTime = moment(date).add(6 - weekDay, 'days').format('YYYY-MM-DD')
            this.dateRange.startDate = startTime
            this.dateRange.endDate = endTime
            //  更新页面部分数据
            this.footprintStatus = false
            // 清除地图
            this.clearAll()
            // 根据选择担当 获取边界/点位/路线 数据
            this.getRouteData()
        },
        // 关闭弹出层
        closeOrganize() {
            this.footprintStatus = false
            // 清除地图
            this.clearAll()
            // 根据选择担当 获取边界/点位/路线 数据
            this.getRouteData()
        },
        // 获取路线信息
        getRouteData() {
            if (!this.chooseTakeResponsibilityID) {
                this.warningStatus = true
                this.waringText = '请选择担当后进行查看'
                setTimeout( () =>{
                    this.warningStatus = false
                },1000)
                return
            }
            JourNeyApi.getRouteInfo({
                "planEndDate": this.dateRange.endDate,
                "planStartDate": this.dateRange.startDate,
                "tuIds": Array.isArray(this.chooseTakeResponsibilityID)? this.chooseTakeResponsibilityID : [].concat({
                    tuId: this.chooseTakeResponsibilityID,
                    tuName: this.chooseTakeResponsibilityName
                })
            })
                .then(res => {
                    if (res.code === 200) {
                        this.options = []
                        this.lineMap = new Map()
                        this.handleData(res.data)
                    }
                    console.info('地图', this.map)
                })
                .catch(err => console.error('请求路线信息数据报错', err))
        },
        // 关闭计划点弹层
        closePoint() {
            this.pointStatus = false
        },
        // 获取计划点数据
        getChildData() {
            this.$nextTick(() => {
                this.$refs.pointChild.tap(0)
            })
        },
        // 数据处理
        handleData(data) {
            if (!data || data.length <= 0) {
                return
            }
            let {lineMap, options} = this
            for (let item of data) {
                if (lineMap.has(item.tuId)) {
                    let data = lineMap.get(item.tuId)
                    lineMap.set(item.tuId, {
                        ...data,
                        planLine: item.planType === '1' ? item.routeInfoRoutBos : data.planLine, // 1是计划类型 2是实际类型
                        actualLine: item.planType === '2' ? item.routeInfoRoutBos : data.actualLine,
                    })
                } else {
                    lineMap.set(item.tuId, {
                        planLine: item.planType === '1' ? item.routeInfoRoutBos : '', // 1是计划类型 2是实际类型
                        actualLine: item.planType === '2' ? item.routeInfoRoutBos : '',
                        tuColor: item.tuColor,
                        tuGdGeom: item.routeGeomBo,
                        tuName: item.tuName,
                        name: (function () {
                            for (let target of item.routeGeomBo) {
                                target['name'] = item.tuName
                            }
                            return item.routeGeomBo
                        })()
                    })
                }
            }
            for (let [key, value] of lineMap) {
                options.push({
                    tuId: key,
                    tuName: value.tuName,
                    switch: false // 暂时不用，若出现开关类进行控制
                })
            }
            // 绘制
            this.mapDraw()
        },
        // 地图绘制
        mapDraw() {
            for (let item of this.options) {
                this.drawBasic(item.tuId)
                this.drawRouteLine(item.tuId, 'all')
            }
        },
        // 绘制 边/底色/名称
        drawBasic(tuId) {
            const {tuGdGeom, tuColor, name} = this.lineMap.get(tuId)
            // 边界
            let resultBorder = this.drawBorders({
                data: tuGdGeom,
                key: 'tuGdGeom',
                strokeColor: tuColor,
                strokeWeight: 3
            })
            // 底色
            let resultBack = this.drawBackColor({
                data: tuGdGeom,
                fillColor: tuColor,
                key: 'tuGdGeom',
                fillOpacity: 0.2
            })
            // 名称
            let resultText = this.drawText({
                data: name,
                nameKey: 'name',
                markCode: tuId,
                needTextEllipsis: true,
                TextEllipsisLength: 18,
                style: {
                    'min-width': '30px',
                    'border-width': 0,
                    'text-align': 'left',
                    'font-size': '13px',
                    'font-weight': '400',
                    'color': '#fff',
                    'background-color': 'rgba(0,0,0,0.6)',
                    'padding': '0 10px',
                    'overflow:': 'hidden',
                    'text-overflow': 'ellipsis',
                    'white-space': 'normal'
                },
            })
            this.drawResult.set(tuId, {
                resultText: resultText,
                resultBack: resultBack.PolygonArr,
                resultBorder: resultBorder.PolygonArr
            })
            //放置到视图中
            this.map.setFitView(resultBorder.PolygonArr)
        },
        // 绘制路线
        drawRouteLine(tuId, type) {
            const {planLine, actualLine} = this.lineMap.get(tuId)
            // 路线开关 开启的
            let planLineData = this.lineMethod(planLine)
            let actualLineData = this.lineMethod(actualLine)
            // 地图序号处理
            let data = this.drawResult.get(tuId)
            // 绘制
            if ((type === 'plan' || type === 'all') && planLineData) {
                let planLineMap = this.drawLine({
                    data: planLineData,
                    alias: 'routeGeom',
                    strokeWeight: 3
                })
                let planPointMap = this.drawPoint(planLineData)
                data = {
                    ...data,
                    planLineMap: planLineMap,
                    planPointMap: planPointMap
                }
            }
            if ((type === 'actual' || type === 'all') && actualLineData) {
                let actualLineMap = this.drawLine({
                    data: actualLineData,
                    alias: 'routeGeom',
                    strokeWeight: 3,
                    strokeStyle: 'dashed'
                })
                let actualPointMap = this.drawPoint(actualLineData)
                data = {
                    ...data,
                    actualLineMap: actualLineMap,
                    actualPointMap: actualPointMap
                }
            }
            this.drawResult.set(tuId, data)
        },
        // 绘制点位
        drawPoint(data) {
            if (!data) {
                return
            }
            let pointStyle = {
                'border': '1px solid #fff',
                'text-align': 'center',
                'font-size': '8px',
                'font-weight': '400',
                'color': '#fff',
                'background-color': '',
                'overflow:': 'hidden',
                'border-radius': '50%',
                'text-overflow': 'ellipsis',
                'width': '15px',
                'height': '15px',
                'padding': '0',
                'line-height': '15px',
                'white-space': 'normal'
            }
            let resultMap = []
            for (let item of data) {
                if (item.pointList && item.pointList.length > 0) {
                    let pointResult = this.drawText({
                        data: item.pointList,
                        nameKey: 'name',
                        markCode: 'id',
                        needTextEllipsis: true,
                        TextEllipsisLength: 18,
                        style: {
                            ...pointStyle,
                            'background-color': this.weekOption[item.weekDay - 1 < 0 ? 0 : item.weekDay - 1]['color']
                        },
                    })
                    resultMap = resultMap.concat(pointResult)
                }
            }
            return resultMap
        },
        // 线路部分数据处理 便于绘制
        lineMethod(data) {
            if (!data || data.length === 0) {
                return
            }
            const {weekOption} = this
            let result = []
            for (let item of data) {
                if (item.pointList) {
                    for (let pointItem of item.pointList) {
                        pointItem.lng = pointItem.coordinates[0]
                        pointItem.lat = pointItem.coordinates[1]
                        pointItem.name = item.weekDay > 0 ? item.weekDay : 7
                    }
                }
                result.push({
                    ...item,
                    strokeColor: weekOption[item.weekDay - 1 < 0 ? 0 : item.weekDay - 1]['color']
                })
            }
            return result
        },
        // 清除线路
        clearLine(tuId) {
            let data = this.drawResult.get(tuId)
            if (data) {
                const {planLineMap, actualLineMap} = data
                this.clearBorder(planLineMap)
                this.clearBorder(actualLineMap)
            }
        },
        // 清除点位
        clearPoint(tuId) {
            let data = this.drawResult.get(tuId)
            if (data) {
                const {planPointMap, actualPointMap} = data
                this.clearText(planPointMap)
                this.clearText(actualPointMap)
            }
        },
        // 清除 边/底色/名称
        clearBasic(tuId) {
            let data = this.drawResult.get(tuId)
            if (data) {
                data.resultBack && this.clearBackGround(data.resultBack)
                data.resultBorder && this.clearBorder(data.resultBorder)
                data.resultText && this.clearText(data.resultText)
            }
        }
    }
}
export default router
