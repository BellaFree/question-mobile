<template>
  <van-popup
    v-model="gridInfoDetailVisible"
    class="grid-info-detail-wrapper"
    closeable
    position="bottom"
    round
    :lazy-render="false"
    :duration="0.1"
    @close="handleClose"
    :style="{ height: drawSize }"
  >
    <div class="header-box">
      <!-- 顶部伸缩按钮 -->
      <div class="change-box">
        <van-icon
          v-show="!changesBtnShow"
          name="arrow-down"
          @click="changeStutas"
        ></van-icon>
        <van-icon
          v-show="changesBtnShow"
          name="arrow-up"
          @click="changeStutas"
        ></van-icon>
      </div>
      <div class="title">网格信息</div>
    </div>
    <div class="content-box">
      <div class="content-info">
        <!-- 推荐率 -->
        <div class="recommend">
          <div class="ident">{{itemGridInfo.tileCode || "" }}</div>
          <div class="recom-rate">
            <span style="color: rgb(128,132,142)">
               <img :src="imgSrc" alt="pic" />推荐率:
            </span>
            {{ gridData.recommendedRate	 || 0 }}%
          </div>
        </div>
        <table class="record">
          <thead>
            <tr>
              <th>{{ gridData.shopCount || 0 }}</th>
              <th>{{ gridData.dpShopCount || 0 }}</th>
              <th>{{ gridData.competeShopCount || 0 }}</th>
              <th>{{ gridData.closeShopCount	 || 0 }}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>门店数</td>
              <td>基盘数</td>
              <td>竞争点位数</td>
              <td>闭店数</td>
            </tr>
          </tbody>
        </table>
        <!-- 周边信息 -->
        <div class="around-info">
          <div class="sub-title">
            <span></span>
            周边信息
          </div>
          <van-tabs
            v-model="tabActive"
            color="#8e01e7"
            :line-height="2"
            style="width: 120px;"
          >
            <van-tab
              title="交通"
              :title-style="tabActive === 0 ? 'color: #8e01e7' : 'color: #000'"
            ></van-tab>
            <van-tab
              title="住宅"
              :title-style="tabActive === 1 ? 'color: #8e01e7' : 'color: #000'"
            ></van-tab>
          </van-tabs>
          <div class="title-level" v-if="tabActive === 0">
            <!-- <span>火车站</span> -->
            <span
              v-for="(item, i) in trafficTable"
              :key="`traffic${i}`"
              :class="i === trafficTabActive ? 'active' : 'normal'"
              @click="handleTrafficTabClick(i)"
              >{{ item.tagName }}</span
            >
          </div>
          <div class="title-level" v-else>
            <!-- <span>其他</span> -->
            <span
              v-for="(item, i) in townTable"
              :key="`traffic${i}`"
              :class="i === townTabActive ? 'active' : 'normal'"
              @click="handleTownTabClick(i)"
              >{{ item.tagName }}</span
            >
          </div>
          <div class="result-table">
            <table v-if="tabActive === 0" width="100%">
              <thead>
                <tr>
                  <th>名称</th>
                  <th>面积</th>
                </tr>
              </thead>
              <tbody
                v-if="
                  trafficTable &&
                    trafficTable.length &&
                    trafficTable[trafficTabActive].detailVO &&
                    trafficTable[trafficTabActive].detailVO.length
                "
              >
                <tr
                  v-for="(item, i) in trafficTable[trafficTabActive].detailVO"
                  :key="`table1${i}`"
                >
                  <td :title="item.name">{{ item.trafficName || "-" }}</td>
                  <td :title="item.area">{{ item.acreage || "-" }}</td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr class="none-data">
                  <p>暂无数据</p>
                </tr>
              </tbody>
            </table>
            <table v-else width="100%">
              <thead>
                <tr>
                  <th>名称</th>
                  <th>户数</th>
                  <th>房价</th>
                  <th>建造年代</th>
                  <th>停车位</th>
                </tr>
              </thead>
              <tbody
                v-if="
                  townTable &&
                    townTable.length &&
                    townTable[townTabActive].uptownDetail &&
                    townTable[townTabActive].uptownDetail.length
                "
              >
                <tr
                  v-for="(item, i) in townTable[townTabActive].uptownDetail"
                  :key="`table2${i}`"
                >
                  <td>{{ item.uptownName || "-" }}</td>
                  <td>{{ item.houseNum || "-" }}</td>
                  <td>{{ item.housePrice || "-" }}</td>
                  <td>{{ item.buildYears || "-" }}</td>
                  <td>{{ item.parkingSpot || "-" }}</td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr class="none-data">
                  <p>暂无数据</p>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- 网格指数 -->
        <div class="grid-indicater">
          <div class="sub-title title-fix">
            <span></span>
            网格指数
          </div>
          <div class="chart-container" id="gridChart"></div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script>
import echarts from "echarts";
import MAP_API from "../../api/map_api";
import {Notify} from "vant";
import Vue from "vue";
Vue.use(Notify);
export default {
  name: "gridInfoDetail",
  data() {
    return {
      imgSrc:require('@/assets/img/Fabulous.png'),
      gridInfoDetailVisible: false,
      changesBtnShow: true,
      drawSize: "50%",
      gridData: "",
      tabActive: 0,
      trafficTabActive: 0, // 二级标题-交通类选中项
      townTabActive: 0, // 二级标题-住宅类选中项
      trafficTable: [],
      townTable: [],
      tableData: [
        // {
        //   name: "123",
        //   area: "辅导按时来得快缴费",
        //   houseHolds: '辅导按时来得快缴费',
        //   avgPrice: 55553,
        //   constructionAge: "2015",
        //   parkingSpaces: "13",
        // },
      ],
      // 模拟新接口返回数据
      mockResData: {
        code: 0,
        data: {
          targetNameCodeMap: {
            competitor: "异业竞争指数",
            consumptive: "消费力指数",
            population: "人口指数",
            sameTrade: "同业饱和度",
            transportation: "交通便利",
          },
          businessTarget: {
            competitor: 0.1,
            consumptive: 0.3,
            population: 0,
            sameTrade: 0.4,
            transportation: 0.5,
          },
          closeShopCount: 3,
          competeShopCount: 5,
          dpShopCount: 6,
          girdId: "ididid",
          gridTarget: {
            competitor: 0.6,
            consumptive: 0,
            population: 0.2,
            sameTrade: 0.3,
            transportation: 0.1,
          },
          recommendedRate: "63", // 开店建议推荐率
          shopCount: 0,
          surround: {
            traffic: [
              {
                detailVO: [
                  {
                    acreage: 1021,
                    trafficName: "交通名称",
                  },
                ],
                tagName: "火车站",
              },
            ],
            uptown: [
              {
                tagName: "其他1",
                uptownDetail: [
                  {
                    buildYears: "2001",
                    houseNum: 1200,
                    housePrice: 100002,
                    parkingSpot: 0,
                    uptownName: "住宅名称",
                  },
                ],
              },
              {
                tagName: "其他2222222",
                uptownDetail: [
                  {
                    uptownName: "住宅名称2", // 名称
                    parkingSpot: "1002", // 停车位
                    housePrice: "1000012", // 房价
                    houseNum: "120002", // 户数
                    buildYears: "1992", // 建造年代
                  },
                ],
              },
              {
                tagName: "其他33333333",
                uptownDetail: [],
              },
            ],
          },
        },
        extData: {},
        message: "",
      },
    };
  },
  props: ["gridInfoDetailShow", "itemGridInfo"],
  //监听是否有数据，有数据则能打开弹窗
  watch: {
    gridInfoDetailShow(val) {
      console.log("watch", val);
      if (val) {
        this.drawSize = "50%";
        this.changesBtnShow = true;
        setTimeout(() => {
          this.getNewGridDetaiData();
        }, 300);
      } else {
        this.gridInfoDetailVisible = val;
        console.log('alert',val)
      }
    },
  },
  mounted() {
    console.log(this.itemGridInfo.tileCode,'------')
    console.log(this.itemGridInfo,'this.itemGridInfo')
  },
  methods: {
    changeStutas() {
      if (this.changesBtnShow) {
        this.drawSize = "93%";
        this.changesBtnShow = false;
      } else {
        this.drawSize = "50%";
        this.changesBtnShow = true;
      }
    },
    handleTrafficTabClick(i) {
      this.trafficTabActive = i;
    },
    handleTownTabClick(i) {
      this.townTabActive = i;
    },
    handleClose() {
      this.$emit("handleGridInfoDetailClose", false);
    },
    //接口有数据弹窗才会打开
    async getNewGridDetaiData() {
      // const params = '?geoHash=' + 'webzxyv' // 后端给的测试值 后期改为真实值
      const params = '?geoHash=' + this.itemGridInfo.tileCode // 真实参数值
      let res = await MAP_API.getNewPotentialAreaDetail(params)
      console.log(res,'----')
      if (res && res.code == 200) {
        this.gridData = res.data;
        // this.gridData = this.mockResData.data;
        this.dealTabData(this.gridData.surround);
        this.setNewCharts();
        this.gridInfoDetailVisible = true;
      }else {
        Notify({type: 'warning', message: res.message, duration: 1000});
        this.gridInfoDetailVisible = true;
      }
    },
    setNewCharts() {
      this.$nextTick(() => {
        // if (!this.gridData.targetNameCodeMap) {
        //   return;
        // }

        let griArrInfoLables = []; // indicator
        let griArr = []; //网格指数
        let treaArr = []; //商圈
        const keys = Object.keys(this.gridData.targetNameCodeMap);

        keys.forEach((key) => {
          griArrInfoLables.push({
            name: this.gridData.targetNameCodeMap[key],
            max: 1,
          });
          griArr.push(this.gridData.gridTarget[key] || "");
          treaArr.push(this.gridData.businessTarget[key] || "");
        });

        let option = {
          grid: {
            x: 0,
            x2: 0,
            y: 0,
            y2: 0,
          },
          tooltip: {},
          legend: {
            show: true,
            data: ["网格", "商圈"],
            itemHeight: 2,
            itemWidth: 15,
            right: 0,
          },
          radar: {
            radius: "50%",
            name: {
              textStyle: {
                color: "#999",
                backgroundColor: "rgba( 0, 0, 0, 0)",
                padding: [3, 5],
                fontSize: 12,
              },
            },
            indicator: griArrInfoLables,
          },
          series: [
            {
              name: "网格指数",
              type: "radar",
              data: [
                {
                  value: griArr,
                  name: "网格",
                  tooltip: {
                    trigger: "item",
                  },
                  itemStyle: {
                    //图形折线样式
                    normal: {
                      color: "rgba( 157, 32, 168)",
                    },
                    emphasis: {
                      borderColor: "rgba( 157, 32, 168)",
                    },
                  },
                  lineStyle: {
                    emphasis: {
                      color: "rgba( 157, 32, 168)",
                    },
                  },
                },
                {
                  value: treaArr,
                  name: "商圈",
                  tooltip: {
                    trigger: "item",
                  },
                  areaStyle: {
                    color: 'rgba(78, 158, 243)'
                  },
                  itemStyle: {
                    normal: {
                      color: "rgba( 78, 158, 243)",
                    },
                    emphasis: {
                      borderColor: "rgba( 78, 158, 243)",
                    },
                  },
                  lineStyle: {
                    emphasis: {
                      color: "rgba( 78, 158, 243)",
                    },
                  },
                },
              ],
            },
          ],
        };
        setTimeout(() => {
          let el = document.getElementById("gridChart");
          let myCharts = echarts.init(el);
          myCharts.setOption(option);
        }, 300);
      });
    },
    // 处理周边信息表格对应tab数据
    dealTabData(data) {
      this.trafficTabActive = 0;
      this.trafficTable = [];
      this.townTabActive = 0;
      this.townTable = [];
      // 交通
      if (data.traffic && data.traffic.length) {
        this.trafficTable = data.traffic;
      }
      // 住宅
      if (data.uptown && data.uptown.length) {
        this.townTable = data.uptown;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.grid-info-detail-wrapper {
  display: flex;
  flex-direction: column;
  text-align: left;
  $fontColor: #19be6b;
  .header-box {
    height: 48px;
    line-height: 48px;
    font-size: 16px;
    text-align: center;
    position: relative;
    border-bottom: 1px solid #e6e6e6;
    &.no-border {
      border-bottom: none;
    }
    .change-box {
      position: absolute;
      top: 0;
      left: 49%;
      i {
        position: absolute;
        top: 0;
        left: 0;
        font-size: 16px;
        font-weight: 500;
      }
    }
    .title {
      font-size: 16px;
      height: 40px;
      padding-top: 5px;
    }
  }
  .content-box {
    flex: 1;
    overflow: hidden;
    position: relative;
    .content-info {
      height: 100%;
      overflow-y: auto;
      padding: 10px 24px;
      .recommend {
        width: 100%;
        height: 40px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .ident {
          font-size: 16px;
          color: $fontColor;
          font-weight: 900;
        }
        .recom-rate {
          color: rgb(10, 186, 96);
          font-size: 16px;
          span {
            width: 20px;
            height: 20px;
            img {
              width: 20px;
              height: 20px;
              margin-bottom: 3px !important;
            }
          }
        }
      }
      .record {
        width: 100%;
        height: 60px;
        border-radius: 8px;
        background: rgb(248, 248, 250);
        padding-top: 10px;
        margin-bottom: 10px;
        tr {
          display: flex;
          flex-direction: row;
          font-size: 14px;
        }
        th,
        td {
          display: flex;
          flex: 1;
          justify-content: center;
          font-size: 14px;
        }
        td {
          color: rgb(138, 142, 152);
        }
      }
      .around-info,
      .grid-indicater {
        .sub-title {
          height: 40px;
          line-height: 40px;
          border-top: 1px solid #e9e9e9;
          border-bottom: 1px solid #e9e9e9;
          font-size: 14px;
          span {
            border-left: 5px solid $fontColor;
            padding-left: 10px;
          }
        }
      }
      .around-info {
        .title-level {
          min-height: 40px;
          padding-top: 10px;
          // margin-top: 1px;
          margin-bottom: 10px;
          border-top: 1px solid #e9e9e9;
          border-bottom: 1px solid #e9e9e9;
          span {
            font-size: 12px;
            display: inline-block;
            padding: 5px 10px;
            // color: #fff;
            // background-color: #a634ef;
            // border-right-color: #a634ef;
            // border-left-color: #a634ef;
            border: 1px solid #a634ef;
            border-radius: 40px;
            margin: 0 5px 5px 0;
            &.normal {
              background-color: #fff;
              color: #a634ef;
            }
            &.active {
              background-color: #a634ef;
              color: #fff;
            }
          }
        }
        .result-table {
          table {
            width: 100%;
            border: 1px solid #ebeef5;
            text-align: center;
            border-spacing: 0;
            tr {
              display: flex;
              flex-direction: row;
              font-size: 14px;
              &.none-data {
                text-align: center;
                margin: 5px auto 15px;
                color: #909399;
                p {
                  width: 100%;
                }
              }
              &:not(:last-child) {
                border-bottom: 1px solid #ebeef5;
              }
            }
            th {
              flex: 1;
              background: rgb(132, 146, 172);
              height: 40px;
              line-height: 40px;
              color: #fff;
              font-weight: bold;
              font-size: 14px;
              border-right: 1px solid #ebeef5;
            }
            td {
              flex: 1;
              height: 30px;
              line-height: 30px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              &:not(:last-child) {
                border-right: 1px solid #ebeef5;
              }
            }
          }
        }
      }
      .grid-indicater {
        position: relative;
        .title-fix {
          width: 100%;
          position: absolute;
          top: 0;
          left: 0;
        }
        .chart-container {
          width: 100%;
          height: 300px;
          z-index: 1;
          margin-top: 15px;
          padding-top: 10px;
        }
      }
    }
  }
}
</style>
