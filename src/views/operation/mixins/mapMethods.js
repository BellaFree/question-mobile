/**
 * 高德地图Map的绘制方法封装 mixin
 */
import {AMap, AMapUI} from "../../../plugins/AMap";
const Gmap = {
    data() {
        return {
            AMap: AMap,
            AMapUI: AMapUI,
            citySearch: ''
        }
    },
    created() {
        console.info('map注入成功')
    },
    methods: {
        drawBorders(options) {
            const {AMap, map} = this
            // 校验绘制数据是否存在
            if (!options.data) {
                this.$message.error('缺失绘制边界数据');
                return
            }
            const source_data = {
                // GeoJson数据和区域id构成的数据
                borderPolygonArr: [],
                // 边界区域数组
                PolygonArr: [],
            }
            // 默认配置
            const defaultOption = {
                // 覆盖物层级，后面的覆盖前面的，默认10
                zIndex: 10,
                // 边界的透明度，范围(0,1)
                strokeOpacity: 1,
                // 边界颜色
                strokeColor: '#fff',
                // 边界宽度，单位像素
                strokeWeight: 1,
                // 边界样式：虚线,实线,dashed || solid
                strokeStyle: 'solid',
                // 区域透明度，范围(0,1)
                fillOpacity: '',
                // 区域填充颜色
                fillColor: '',
                // 鼠标悬停样式
                cursor: 'pointer',
                // 是否将操作冒泡到地图上
                bubble: true,
                // 区域是否可拖拽
                draggable: false,
                markCode: '',
                key: 'gdBoundarJson'
            };
            let length = options.data.length;
            for (let i = 0; i < length; i++) {
                (function (t) {
                    let polygon = '', gdGeom = '';
                    // 获取某一个数据
                    const info = options.data[t];
                    // 合并配置项(对象字面量会自动将下面的同字段覆盖)
                    const option = {
                        ...defaultOption,
                        ...options,
                    };
                    // 获取GeoJSON数据并转化为对象
                    gdGeom = typeof info[option.key] === 'string' ? JSON.parse(info[option.key]) : info[option.key];
                    // console.log('拿到的gdGeom数据', gdGeom)
                    // 实例化一个高德GeoJSON对象
                    const geojson = new AMap.GeoJSON({
                        geoJSON: gdGeom,
                        getPolygon(geojson_data, lnglats) {
                            // console.log('拿到的geo-json数据', geojson_data)
                            // 实例化一个区域覆盖物对象
                            polygon = new AMap.Polygon({
                                // 经纬度数组
                                path: lnglats,
                                // 边界透明度
                                strokeOpacity: option.strokeOpacity,
                                // 边界颜色
                                strokeColor: option.strokeColor,
                                // 边界宽度
                                strokeWeight: option.strokeWeight,
                                // 边界样式：虚线,实线,dashed || solid
                                strokeStyle: option.strokeStyle,
                                // 区域透明度，范围(0,1)
                                fillOpacity: option.fillOpacity,
                                // 区域填充颜色
                                fillColor: option.fillColor,
                                // 层级
                                zIndex: option.zIndex,
                                // 是否将操作冒泡到地图上
                                bubble: option.bubble,
                                // 鼠标悬停样式
                                cursor: option.cursor,
                            });
                            // 如果有回调函数，注入当下的区域覆盖物对象
                            if (options.callBack) {
                                options.callBack(polygon, info);
                            }
                            //
                            source_data.PolygonArr.push(polygon);
                            return polygon;
                        },
                    });
                    const eventMap = {
                        geojson,
                        id: info[option.markCode], // 标示code
                    };
                    source_data.borderPolygonArr.push(eventMap);
                    // 将Geo-json对象画到地图上
                    // geojson.setMap (map_obj);
                    // console.info(map_obj)
                    map.add(geojson)
                })(i);
            }
            return source_data;
        },
        /**
         * @date 2021-10-09 15:30:02
         * @describe: 绘制底色
         */
        drawBackColor(options) {
            const {AMap, map} = this
            // 校验绘制数据是否存在
            if (!options.data) {
                this.$message.error('缺失绘制底色数据');
                return
            }
            const source_data = {
                backColorPolygonArr: [],
                PolygonArr: [],
            };
            const defaultOption = {
                zIndex: 10,
                strokeOpacity: 1,
                strokeColor: '',
                strokeWeight: 1,
                fillOpacity: '0.5',
                fillColor: 'red',
                cursor: 'pointer',
                bubble: true,
                draggable: false,
                markCode: '', // 标示code
                key: 'gdBoundarJson'
            };
            let length = options.data.length;
            for (let i = 0; i < length; i++) {
                (function (t) {
                    let polygon = '', gdGeom = '';
                    const info = options.data[t];
                    info.DrawType = 'color';
                    const getOptions = {
                        ...defaultOption,
                        fillOpacity: info.fillOpacity,
                        fillColor: info.fillColor ? info.fillColor : info.color,
                        ...options,
                    };
                    gdGeom = typeof info[getOptions.key] === 'string' ? JSON.parse(info[getOptions.key]) : info[getOptions.key];
                    const geojson = new AMap.GeoJSON({
                        geoJSON: gdGeom,
                        // 还可以自定义getMarker和getPolyline
                        getPolygon(geojson, lnglats) {
                            polygon = new AMap.Polygon({
                                path: lnglats,
                                strokeOpacity: getOptions.strokeOpacity,
                                strokeColor: getOptions.strokeColor,
                                strokeWeight: getOptions.strokeWeight,
                                fillOpacity: getOptions.fillOpacity,
                                fillColor: getOptions.fillColor,
                                zIndex: getOptions.zIndex,
                                bubble: getOptions.bubble,
                                cursor: getOptions.cursor,
                            });
                            if (options.callBack) {
                                options.callBack(polygon, info);
                            }
                            source_data.PolygonArr.push(polygon);
                            return polygon;
                        },
                    });
                    const eventMap = {
                        geojson,
                        id: info[getOptions.markCode], // 标示code
                    };
                    source_data.backColorPolygonArr.push(eventMap);
                    map.add(geojson)
                })(i);
            }
            return source_data;

        },
        /**
         * 绘制名称
         * @param options
         */
        drawText(options) {
            const {AMap, map} = this
            // 校验绘制数据是否存在
            if (!options.data) {
                this.$message.error('缺失绘制名称数据');
                return
            }
            const defaultOption = {
                textAlign: 'center',
                verticalAlign: 'bottom',
                draggable: false,
                cursor: 'pointer',
                angle: 0,
                zIndex: 100,
                title: '',
                clickable: true,
                offsetInfo: new AMap.Pixel(0, 0),
                nameKey: 'name',
                prefisso: ''
            }
            const setUpOption = {
                ...defaultOption,
                ...options
            }
            let nameArr = []
            for (let i = 0; i < options.data.length; i++) {
                if (options.data[i].lng) {
                    (function (t) {
                        const info = options.data[t]
                        let name = `${setUpOption.prefisso}${info[setUpOption.nameKey]}`

                        if (!name) {
                            name = info.tradeareaName
                        }
                        const textCenter = [info.lng, info.lat]
                        const eventMap = {}
                        eventMap.id = info.id
                        const text = new AMap.Text({
                            text: name,
                            title: name,
                            position: textCenter,
                            style: setUpOption.style,
                            offset: setUpOption.offsetInfo,
                            textAlign: setUpOption.textAlign,
                            verticalAlign: setUpOption.verticalAlign,
                            draggable: setUpOption.draggable,
                            cursor: setUpOption.cursor,
                            angle: setUpOption.angle,
                            zIndex: setUpOption.zIndex
                        })
                        if (setUpOption.callBack) {
                            setUpOption.callBack(text, info)
                        }
                        info.DrawType = 'name'
                        eventMap.text = text
                        nameArr.push(eventMap)
                        map.add(text)
                    })(i)
                }
            }
            return nameArr

        },
        /**
         * 绘制线路
         * @param options
         */
        drawLine(options) {
            const {AMap, map} = this
            // 校验绘制数据是否存在
            if (!options.data) {
                this.$message.error('缺失绘制名称数据');
                return
            }
            const defaultOption = {
                borderWeight: 1,
                path: [],
                strokeColor: 'red',
                strokeOpacity: 1,
                strokeWeight: 1,
                strokeStyle: 'solid',
            };
            const option = {
                ...defaultOption,
                ...options,
            };
            let lineArr = []
            let length = options.data.length;
            for (let i = 0; i < length; i++) {
                (function (t) {
                    const info = options.data[t];
                    let path = info[`${option.alias}`] ? info[`${option.alias}`] : ''
                    path = path ? JSON.parse(path) : ''
                    let map_line
                    const getOptions = {
                        ...option,
                        info,
                        strokeColor: info.strokeColor
                    };
                    const geojson = new AMap.GeoJSON({
                        geoJSON: path,
                        // 还可以自定义getMarker和getPolyline
                        getPolyline(geojson, lnglats) {
                            map_line = new AMap.Polyline({
                                path: lnglats,
                                strokeColor: getOptions.strokeColor,
                                strokeOpacity: getOptions.strokeOpacity,
                                strokeWeight: getOptions.strokeWeight,
                                strokeStyle: getOptions.strokeStyle
                            });
                            lineArr.push(map_line)
                            return map_line;
                        },
                    });
                    map.add(geojson)
                })(i);
            }
            return lineArr
        },
        /**
         * 绘制图标
         * @param options
         */
        drawMark(options) {
            const {AMap, map} = this
            // 校验绘制数据是否存在
            if (!options.data) {
                this.$message.error('缺失绘制图标数据');
                return
            }
            let result = []
            for (let item of options.data) {
                let viaMarker = new AMap.Marker({
                    position: new AMap.LngLat(item.lng, item.lat),
                    content: item.content,
                    // 将一张图片的地址设置为 icon
                    icon: item.icon,
                    // 设置了 icon 以后，设置 icon 的偏移量，以 icon 的 [center bottom] 为原点
                    offset: new AMap.Pixel(-13, -30),
                    extData: item
                })
                result.push(viaMarker)
                if (options.callBack) {
                    options.callBack(viaMarker, item)
                }
                map.add(viaMarker)
            }
            return result
        },
        /**
         * 初始化定位插件
         */
        geoLocation() {
            const geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,//是否使用高精度定位，默认:true
                timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                zoomToAccuracy: true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            })
            this.map.addControl(geolocation)
            this.geolocation = geolocation
        },
        getCurrentPosition() {
            const {geolocation} = this
            return new Promise((resolve, reject) => {
                geolocation.getCurrentPosition((status, result) => {
                    console.info(status, result)
                    if (status === 'complete') {
                        resolve(result)
                    } else {
                        reject('err')
                    }
                })
            })
        },
        //拖拽选址
        PositionPicker(iconStyle) {
            const {map, AMapUI} = this
            return new Promise((resolve, reject) => {
                AMapUI.loadUI(['misc/PositionPicker'], function (PositionPicker) {
                    let positionPicker = new PositionPicker({
                        mode: 'dragMap',//设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
                        map: map,//依赖地图对象
                        iconStyle: iconStyle
                    });
                    if (positionPicker) {
                        positionPicker.start()
                        resolve(positionPicker)
                    } else {
                        reject(null)
                    }
                });
            })
        },
        // 获取当前城市 城市查询，IP定位获取当前城市信息
        getCurrentCity() {
            const citySearch = new AMap.CitySearch()
            // this.map.addControl(citySearch)
            this.citySearch = citySearch
        },
        //  清除边界
        clearBorder(data) {
            if (!data || data.length === 0) {
                return
            }
            for (let item of data) {
                this.map.remove(item)
            }
        },
        //  清除底色
        clearBackGround(data) {
            if (!data || data.length === 0) {
                return
            }
            for (let item of data) {
                this.map.remove(item)
            }
        },
        // 清除名称
        clearText(data) {
            if (!data || data.length === 0) {
                return
            }
            for (let item of data) {
                this.map.remove(item.text)
            }
        },
        clearAll() {
            if (this.map) {
                let result = this.map.getAllOverlays()
                let i = result.length
                while (i--) {
                    this.map.remove(result[i])
                }
            }
        }

    }
}
export default Gmap
