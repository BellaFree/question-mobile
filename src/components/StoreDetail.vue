<template>
  <van-popup
    v-model="baseInfoVisible"
    class="base-info-popup-wrapper"
    closeable
    position="bottom"
    round
    :lazy-render="false"
    :duration="0.1"
    @close="handleClose"
    :style="{ height: drawSize }"
  >
    <div class="header-box" :class="{ 'no-border': title !== '门店' }">
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
      <div class="title">{{ title }}信息</div>
    </div>
    <div class="content-box">
      <!-- 新接口字段 -->
      <div class="content-info">
        <!-- public -->
        <section v-if="title === '门店'" class="public-section">
          <p class="title-name">{{ showData && showData.storeName ? showData.storeName : '--' }}</p>
          <div class="address-name">
            <p class="address-item">
              <van-icon name="location-o" size="14"></van-icon>
              {{ showData && showData.storeAddress ? showData.storeAddress : "--" }}
            </p>
            <p class="address-item">
              <van-icon name="phone-o" size="14"></van-icon>
              {{ showData && showData.bizPhone ? showData.bizPhone : "--" }}
            </p>
          </div>
        </section>
        <section v-if="title === '基盘'" class="public-section-center">
          <p class="title-name">{{ showData && showData.bpName ? showData.bpName : '--' }}</p>
          <div class="address-name">
            <p class="address-item">
              <van-icon name="location-o" size="14"></van-icon>
              {{ showData && showData.bpAddress ? showData.bpAddress : "--" }}
            </p>
          </div>
        </section>
        <section v-if="title === '竞品'" class="public-section-center">
          <p class="title-name">{{ showData && showData.compName ? showData.compName : '--' }}</p>
          <div class="address-name">
            <p class="address-item">
              <van-icon name="location-o" size="14"></van-icon>
              {{ showData && showData.address ? showData.address : "--" }}
            </p>
          </div>
        </section>
        <!-- 门店信息 -->
        <section v-if="title === '门店'" class="store-section">
          <div class="form-wrap">
            <p class="form-item">
              <label class="label">督导</label>
              <span class="name">{{
                showData && showData.userName ? showData.userName : "--"
              }}</span>
            </p>
            <p class="form-item">
              <label class="label">店长</label>
              <span class="name">{{
                showData && showData.shopOwner ? showData.shopOwner : "--"
              }}</span>
            </p>
            <p class="form-item">
              <label class="label">店铺ID</label>
              <span class="name">{{
                showData && showData.storeCode ? showData.storeCode : "--"
              }}</span>
            </p>
            <p class="form-item">
              <label class="label">开店日期</label>
              <span class="name">{{
                showData && showData.storeStartDate ? showData.storeStartDate : "--"
              }}</span>
            </p>
            <p class="form-item" v-if="showData.storeBizType === '闭店'&&showData.storeEndDate">
              <label class="label">闭店日期</label>
              <span class="name">{{
                showData && showData.storeEndDate ? showData.storeEndDate : "--"
              }}</span>
            </p>
            <p class="form-item">
              <label class="label">店铺形态</label>
              <span class="name">{{
                showData &&  showData.storeMarketClass
                  ? showData.storeMarketClass
                  : "--"
              }}</span>
            </p>
            <p class="form-item">
              <label class="label">店铺类型</label>
              <span class="name">{{
                showData && showData.storeBizType
                  ? showData.storeBizType
                  : "--"
              }}</span>
            </p>
          </div>
          <!-- 标签 暂时隐藏 -->
          <div class="labels-wrap" v-show="false">
            <van-row type="flex" justify="space-between" class="row-title">
              <van-col span="12" class="title-left">
                <span class="color-icon"></span>
                <span class="text">标签</span>
              </van-col>
            </van-row>
            <div class="labels">
              <span class="label-item" v-for="item in labelData" :key="item">{{
                item
              }}</span>
            </div>
          </div>
          <!-- 日商趋势图 -->
          <div v-if="showData && showData.months&&showData.months.length" class="chart-wrap">
            <van-row type="flex" justify="space-between" class="row-title">
              <van-col span="12" class="title-left">
                <span class="color-icon"></span>
                <span class="text">日商趋势图</span>
              </van-col>
              <van-col span="12" class="title-right">
                <span style="color:#f4a92b">—</span>
                <span>门店</span>
                <span style="color:#af4af0">--</span>
                <span>商圈平均</span>
              </van-col>
            </van-row>
            <div id="myChart" class="my-chart"></div>
          </div>
        </section>
        <section v-if="title === '基盘'" class="circle-section">
          <div class="form-wrap">
            <p class="form-item">
              <label class="label long-label">基盘ID</label>
              <span class="name">
                {{
                  showData && showData.bpCode
                    ? showData.bpCode
                    : "--"
                }}
              </span>
            </p>
            <p class="form-item">
              <label class="label long-label">商圈级别</label>
              <span class="name">
                {{
                  showData && showData.confirmStatus
                    ? showData.confirmStatus
                    : "--"
                }}
              </span>
            </p>
          </div>
        </section>
        <section v-if="title === '竞品'" class="product-wrap">
          <div class="form-wrap">
            <!-- <p class="form-item">
              <label class="label long-label">预估日商：</label>
              <span class="name">
                {{
                  showData && showData.predictDailySales ? showData.predictDailySales : "--"
                }}
                <span v-if="showData && showData.predictDailySales">元</span>
              </span>
            </p> -->
            <p class="form-item" v-if="showData && showData.predictRent">
              <label class="label long-label">预估租金：</label>
              <span class="name">
                {{ showData | formatAmount }}<span v-if="showData && showData.predictRent"> 元/平/日</span>
              </span>
            </p>
          </div>
        </section>
      </div>
      <div class="download" v-if="title === '基盘'">
        <button class="downloadBtn" @click="linkPage()">下载报告</button>
        <!-- <a href="http://dev.api.parramountain.com:28000/singleton-oss/getObject/2021-03-01/3594b0c0cabf45d1affa37d8ad6e5568.pdf" download>下载</a> -->
      </div>
    </div>
  </van-popup>
</template>
<script>
import Vue from "vue";
import echarts from "echarts";
import { Toast, Dialog } from "vant";
import VueClipboard from "vue-clipboard2";
Vue.use(Toast);
Vue.use(Dialog);
Vue.use(VueClipboard);

import MUNICIPAL_PLANNING_API from "../../api/municipal_planning_api";
import MAP_API from "../../api/map_api";

export default {
  props: ["id", "baseInfoType", "baseInfoShow", "chnlCategoryCode"],
  data() {
    return {
      baseInfoVisible: false,
      changesBtnShow: true,
      drawSize: "50%",
      title: "",
      showData: {},
      isMCNCT: false, // 竞品和基盘不显示电话
      labelData: ["人流量大", "位置好", "潜力大"],
      copyUrl: "", // 复制url地址
      chartYear: "", // 日商趋势图年份
      // 门店mock数据
      mockStoreData: {
        code: 0,
        data: {
          bizPhone: "13213213200",
          businessInfoVo: [
            {
              date: "2021-01-01",
              number: 1010,
            },
            {
              date: "2021-02-01",
              number: 6611,
            },
            {
              date: "2021-03-01",
              number: 3010,
            },
            {
              date: "2021-04-04",
              number: 1010,
            },
            {
              date: "2021-05-05",
              number: 6611,
            },
            {
              date: "2021-06-06",
              number: 3010,
            },
            {
              date: "2021-07-07",
              number: 3010,
            },
          ],
          id: "",
          shopOwner: "店长",
          storeAddress: "地址",
          storeCode: "店铺id",
          storeBizType: "店铺类型",
          storeMarketClass: "店铺形态",
          storeInfoVo: [
            {
              date: "2021-01-01",
              number: 5010,
            },
            {
              date: "2021-02-01",
              number: 2233,
            },
            {
              date: "2021-03-01",
              number: 7010,
            },
            {
              date: "2021-04-04",
              number: 4010,
            },
            {
              date: "2021-05-05",
              number: 3611,
            },
            {
              date: "2021-06-06",
              number: 1010,
            },
            {
              date: "2021-07-07",
              number: 6010,
            },
          ],
          storeName: "全家",
          storeStartDate: "2021-06-30",
          storeEndDate: "2021-07-30",
          userName: "担当",
        },
        extData: {},
        message: "",
      },
      // 基盘mock数据
      mockBaseData: {
        code: 0,
        data: {
          bpAddress: "", // 基盘地址
          bpCode: "", // 基盘编码
          bpName: "", // 基盘名称
          confirmStatus: "", // 商圈级别
          id: "", //主键id
        },
        extData: {},
        message: "",
      },
      // 竞品mock数据
      mockProductData: {
        code: 0,
        data: {
          address: "", // 竞品地址
          compCode: "", // 竞品编码
          compName: "", // 竞品名称
          id: "", // 主键idc
          predictDailySales: "", // 预估日商
          predictRent: "", // 预估租金
        },
        extData: {},
        message: "",
      },
    };
  },
  filters: {
    formatAmount(val){
      if(val && val.predictRent){
        let a = parseFloat(val.predictRent).toFixed(0).toString()
        
        console.log("🚀 ~ file: StoreDetail.vue ~ line 333 ~ formatAmount ~ a", a, a.length)
        return a
      } else {
        return '--'
      }
      
    }
  },
  watch: {
    baseInfoShow(val) {
      // this.baseInfoVisible = val
      if (val) {
        this.drawSize = "50%";
        this.changesBtnShow = true;
        this.title = this.baseInfoType == '1'
          ? "基盘"
          : this.baseInfoType == '2'
          ? "竞品"
          : "门店";
        // this.title = this.baseInfoName.includes("全家")
        //   ? "门店"
        //   : this.baseInfoName.includes("基盘")
        //   ? "基盘"
        //   : "竞品";
        setTimeout(() => {
          this.getDetailData(); // 新接口数据
        }, 300);
      } else {
        this.baseInfoVisible = val;
      }
    },
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
    handleClose() {
      this.$emit("handleBaseInfoDetailClose", false);
    },
    async getDetailData() {
      let res;
      if (this.title === "门店") {
        res = await MAP_API.getStoreDetail(`?fmMapStoreId=${this.id}`);
        // 测试参数值
        // res = await MAP_API.getStoreDetail(`?fmMapStoreId=3`);
        if (res && res.code == 200 && res.data) {
          this.showData = res.data;
          setTimeout(() => {
            this.setChartNew();
          }, 1000);
        }
        // this.showData = this.mockStoreData.data;
      }
      if (this.title === "基盘") {
        res = await MAP_API.getBaseDetail(`?fmMapBpStoreId=${this.id}`);
        // 测试参数值
        // res = await MAP_API.getBaseDetail(`?fmMapBpStoreId=2`);
        if (res && res.code == 200) {
          this.showData = res.data;
        }
        // this.showData = this.mockBaseData.data;
      }
      if (this.title === "竞品") {
        res = await MAP_API.getProductDetail(
          `?fmMapCompetitorStoreId=${this.id}`
        );
        // 测试参数值
        // res = await MAP_API.getProductDetail(
        //   `?fmMapCompetitorStoreId=1`
        // );
        if (res && res.code == 200) {
          this.showData = res.data;
        }
        // this.showData = this.mockProductData.data;
      }
      this.baseInfoVisible = true;
    },
    // echarts图配置
    setChartNew() {
      if (!this.showData||!this.showData.months||!this.showData.months.length) return;
      // if (this.showData.undertake !== this.showData.oldundertake) return

      //倒序
      this.showData.months.reverse();
      let xArr = [];//横坐标
      let salesArr = [];//门店
      let avgSalesArr = [];//商圈平均
      this.showData?.months?.map((ite)=>{
        let date = ite.split("-");
        xArr.push(date[1] + "/" + date[0]);
        salesArr.push(0);
        avgSalesArr.push(0);
      })

      this.showData.storeInfoVo.forEach((item, i) => {
        let date = item.date.split("-");
        let dat = date[1] + "/" + date[0];
        
        let a = xArr.findIndex((val,index,arr)=>{ return val == dat });
        if(a > -1){
          salesArr[a] = item.number;
          avgSalesArr[a] = this.showData.businessInfoVo[i]?.number ? this.showData.businessInfoVo[i].number : 0;
        }

      });

      let options = {
        tooltip: {
          trigger: "axis",
        },
        color: ["#f7b64c", "#a638ef"],
        grid: {
          left: "3%",
          right: "5%",
          bottom: "3%",
          top: "10%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisTick: {
            show: false,
          },
          data: xArr || [],
        },
        yAxis: {
          type: "value",
          splitLine: {
            lineStyle: {
              type: "dashed",
              opacity: 0.7,
            },
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        series: [
          {
            name: "门店",
            type: "line",
            data: salesArr || [],
            symbolSize: 8,
            lineStyle: {
              normal: {
                width: 2,
              },
            },
            itemStyle: {
              normal: {
                borderWidth: 3,
                // label: {show: true} //显示折点信息
              },
            },
          },
          {
            name: "商圈平均",
            type: "line",
            data: avgSalesArr || [],
            symbolSize: 8,
            lineStyle: {
              normal: {
                width: 2,
                type: "dashed",
              },
            },
            itemStyle: {
              normal: {
                borderWidth: 3,
                // label: {show: true}//显示折点信息
              },
            },
          },
        ],
      };

      let el = document.getElementById("myChart");
      let chartObj = echarts.init(el);
      chartObj.setOption(options);
    },
    // 复制按钮回调
    beforeClose(action, done) {
      console.log("🚀 ~ file: StoreDetail.vue ~ line 600 ~ beforeClose ~ action", action,done)
      if (action === "confirm") {
        // 确定按钮
        this.$copyText(this.copyUrl).then(
          function(res) {
            console.log("Copied", res);
            Toast.success("内容已复制到剪贴板");
            done(); // 关闭dialog
          },
          function() {
            Toast.fail("复制失败");
            done();
          }
        );
      } else {
        // 取消按钮
        done(); // 关闭dialog
      }
    },
    toLoadPdf(url){
      let u = navigator.userAgent;
      let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if(isiOS){
        //兼容ios跳转：
        let dom = document.createElement('a')
        dom.setAttribute('target',"_blank")
        dom.setAttribute('href',url)
        document.body.appendChild(dom)
        dom.click()
        //window.location.href = url
      }else{
        window.open(url)
      }
    },
    toCopyUrl(pdfUrl){
      this.copyUrl = pdfUrl
        Dialog.confirm({
          title: '下载地址：',
          confirmButtonText: '复制',
          confirmButtonColor: '#000',
          message: pdfUrl,
          //beforeClose: this.beforeClose,
        })
        .then(()=>{
          this.$copyText(this.copyUrl).then(
          function(res) {
            console.log("Copied", res);
            Toast.success("内容已复制到剪贴板");
          },
          function() {
            Toast.fail("复制失败");
          }
        );
        })
        .catch(()=>{})
    },
    //根据pdf链接跳转到浏览器下载
    async linkPage() {

      if (this.showData&&this.showData.pdfUrl) {
        // 下载地址弹框复制
        // this.copyUrl = pdfUrl
        // Dialog.confirm({
        //   title: '下载地址：',
        //   confirmButtonText: '复制',
        //   confirmButtonColor: '#000',
        //   message: pdfUrl,
        //   //beforeClose: this.beforeClose,
        // })
        // .then(()=>{
        //   this.$copyText(this.copyUrl).then(
        //   function(res) {
        //     console.log("Copied", res);
        //     Toast.success("内容已复制到剪贴板");
        //   },
        //   function() {
        //     Toast.fail("复制失败");
        //   }
        // );
        // })
        // .catch(()=>{})

        // 去复制
        // -------------------
        this.toCopyUrl(this.showData.pdfUrl)
        // -------------------

      } else {
        //当前无pdf时请求接口生成
        if(!this.showData) {
          Toast.fail("暂无基盘数据");
        } else if(this.showData.bpCode) {
          let res = await MAP_API.getPdfReport(`?bpCode=${this.showData.bpCode}`);
          if (res && res.data && res.code == 200) {
            if(res.data.pdfPath) {
              this.toCopyUrl(res.data.pdfPath)
            } else {
              Toast.success(res.data.message);
            }
          }else{
            Toast.fail(res.message)
          }

        }
        
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.base-info-popup-wrapper {
  display: flex;
  flex-direction: column;
  text-align: left;
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
      font-weight: 600;
    }
  }
  .content-box {
    flex: 1;
    overflow: hidden;
    position: relative;
    .content-info {
      height: 100%;
      overflow-y: auto;
      margin-left: 10px;
      // 标题公共样式(门店信息)
      .public-section {
        .title-name {
          height: 50px;
          line-height: 50px;
          font-size: 16px;
          text-align: left;
          font-weight: 600;
          // border-top: 1px solid #E6E6E6;
        }
        .address-name {
          font-size: 14px;
          text-align: left;
          border-top: 1px solid #e6e6e6;
          padding: 10px 0;
          .address-item {
            //height: 28px;
            //line-height: 28px;
          }
        }
      }
      // 标题公共样式(基盘和竞品信息)
      .public-section-center {
        .title-name {
          margin-top: 20px;
          height: 30px;
          line-height: 30px;
          font-size: 16px;
          text-align: center;
          font-weight: bold;
        }
        .address-name {
          font-size: 14px;
          text-align: center;
          .address-item {
            //height: 48px;
            //line-height: 28px;
          }
        }
      }
      // 开店/闭店、基盘 信息 公共样式
      .store-section,
      .circle-section,
      .product-wrap {
        .form-wrap {
          border-top: 1px solid #e6e6e6;
          .form-item {
            text-align: left;
            height: 25px;
            line-height: 25px;
            margin: 7px 0;
            .label {
              font-size: 14px;
              display: inline-block;
              width: 80px;
              color: #495060;
              &.long-label {
                width: 150px;
              }
            }
            .name {
              font-size: 14px;
              color: #1c2438;
            }
          }
        }
      }
      // 开店/闭店 信息
      .store-section {
        // 模块标题（标签、日商趋势图）
        .labels-wrap,
        .chart-wrap {
          .row-title {
            height: 40px;
            line-height: 40px;
            border-bottom: 1px solid #e6e6e6;
            .title-left {
              .color-icon {
                display: inline-block;
                height: 24px;
                border-left: 6px solid #af4af0;
                vertical-align: middle;
                // margin-top: 10px;
              }
              .text {
                font-size: 14px;
                font-weight: 500;
                padding-left: 10px;
              }
            }
            .title-right {
              text-align: right;
              padding-right: 15px;
              span {
                font-size: 12px;
                color: #495060;
                padding-left: 5px;
              }
            }
          }
        }
        .labels-wrap {
          border-top: 1px solid #e6e6e6;
          .labels {
            padding-top: 10px;
            .label-item {
              display: inline-block;
              height: 26px;
              line-height: 26px;
              font-size: 14px;
              padding: 0 12px;
              margin: 0 10px 10px 0;
              color: #495060;
              background-color: #fff1db;
            }
          }
        }
        .chart-wrap {
          border-top: 1px solid #e6e6e6;
          .my-chart {
            height: 200px;
            min-width: 300px;
            width: calc(100% - 5px);
          }
        }
      }
      // 基盘 信息
      // .circle-section {
      // }
    }
    .download {
      width: 100%;
      height: 35px;
      position: absolute;
      bottom: 5px;
      left: 0;
      border-top: 1px solid #e4e4e4;
      padding-top: 5px;
      .downloadBtn {
        width: 120px;
        height: 30px;
        position: absolute;
        left: calc(50% - 60px);
        background: #930dea;
        color: #fff;
        border: none;
        border-radius: 4px;
        font-size: 14px;
      }
      .downloadBtn:focus {
        outline-color: rgba(0, 0, 0, 0);
      }
    }
  }
}
</style>
