<template>
  <!-- 点位列表 -->
  <div class="wrap " id="point-box">
    <div class="nav">
      <span class="close" @click="closePopup"><svg-icon icon-class="close"></svg-icon></span>
      <div class="nav-right" is-link @click="showPopup1">
        {{ checkName }}
        <van-icon name="arrow-down"/>
      </div>
      <van-popup
          v-model="show1"
          position="bottom"
          :style="{ height: '70%' }"
          round
          closeable
          overlay-class="test"
          close-icon-position="top-right"
      >
        <organize :sessionKeyName="'journey'" :whetherAll="false"/>
      </van-popup>
    </div>
    <div class="center">
      <div v-if="path && path.length > 0">
        <div v-for="(item, index) in path" :key="index" class="main">
          <div class="main-time">
            <div class="mainTime">{{ item.planDate }}</div>
          </div>
          <div v-if="(item.pointTableDetailBos.length!==0)">
            <div class="main-local" v-for="(itemx,index) in item.pointTableDetailBos" :key="index">
              <div class="line" v-show="line === 1"></div>
              <svg-icon icon-class="local"></svg-icon>
              <div class="local">
                <div class="local-lo">{{ itemx.visitAddress }}</div>
                <div class="local-time">{{ itemx.visitTime }}</div>
              </div>
            </div>
          </div>
          <div v-else class="noData">暂无数据</div>
        </div>
      </div>
      <div v-else class="missing">
        <van-empty
            class="custom-image"
            image="https://img01.yzcdn.cn/vant/custom-empty-image.png"
            description="暂无数据"
        />
      </div>
    </div>
    <div v-if="false" class="button">
      <div class="foot">
        <button is-link @click="showPopup" class="foot-button">异常预警</button>
        <van-popup v-model="show" position="bottom" :style="{ height: '50%' }" get-container="body">
          <div class="foot-yujing">
            <div class="footYujing">异常预警</div>
            <div>{{ timeRange.startDate }} 至 {{ timeRange.endDate }}</div>

            <div class="content">
              <el-table
                  :row-style="{ height: '52px' }"
                  :cell-style="{ padding: '0px' }"
                  :data="tableData"
                  border
                  :show-header="false"
                  style="width: 360px"
              >
                <el-table-column prop="warningName" label="warningName" width="120">
                  <template slot-scope="scope">
                    <span class="unit">{{ scope.row.warningName }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="standardPercentage" label="standardPercentage" width="190">
                  <template slot-scope="scope">
                    <div class="percent">
                    <span
                        :class="{
                        orange: scope.row.planNum !== scope.row.visitNum,
                      }"
                    >{{ scope.row.visitNum }}</span
                    >/<span>{{ scope.row.planNum }}</span>
                    </div>
                    <el-progress
                        :percentage="Number(scope.row.percentage)"
                        :text-inside="true"
                        :show-text='false'
                        :stroke-width="16"
                        color="#19BE6B"
                    ></el-progress>
                  </template>
                </el-table-column>
                <el-table-column prop="percentage" label="percentage" width="65">
                  <template slot-scope="scope">
                    <span :class="Number(scope.row.percentage)==100?'uni':'unitt'">{{ scope.row.percentage }}%</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </van-popup>
      </div>
    </div>
    <van-notify v-model="warningStatus" type="warning">
      <van-icon name="bell" style="margin-right: 4px;" />
      <span>请选择一位担当，浏览他的行程足迹</span>
    </van-notify>
  </div>
</template>

<script>

/* import PLAN_ACT_API from 'api/plan_act_api'  */
import PLAN_ACT_API from '@api/stand'
import organize from "./organize";
import {mapGetters} from "vuex";

export default {
  name: "pointList",
  components: {
    organize
  },
  props: ['timeRange'],
  data() {
    return {
      navTitle: [{name: "计划点"}, {name: "实际点"}],
      activeIndex: "0",
      //弹出层数据
      show: false,
      show1: false,
      line: 0,
      tableData: [], // 异常预警数据
      path: [],
      checkName: '',
      warningStatus: false
    };
  },
  computed: {
    ...mapGetters('Itinerary', ['chooseTakeResponsibilityID', 'chooseTakeResponsibilityName', 'chooseTakeResponsibilityParenID'])
  },
  watch: {
    chooseTakeResponsibilityID: {
      immediate: true,
      handler: function () {
        if (this.chooseTakeResponsibilityID) {
          if(Array.isArray(this.chooseTakeResponsibilityID)) {
            //  全部的场景
            this.checkName = ''
          }else{
            // 具体到担当
            this.checkName = this.chooseTakeResponsibilityName
          }
        }
        this.tap(0)
      }
    }
  },
  methods: {
    // 参数检查
    paramsCheck() {
      if(!this.chooseTakeResponsibilityID || Array.isArray(this.chooseTakeResponsibilityID)) {
        this.warningStatus = true
        setTimeout(() => {
          this.warningStatus = false;
        }, 2000)
      }
    },
    // tab切换
    async tap(index) {
      this.paramsCheck()
      let params = {tuId: Array.isArray(this.chooseTakeResponsibilityID) ? ' ' : this.chooseTakeResponsibilityID, planStartDate: this.timeRange.startDate, planEndDate: this.timeRange.endDate}
      let result
      // 实际
      if (index == '1') {
        result = await PLAN_ACT_API.getAct(params);
      } else {
        result = await PLAN_ACT_API.getPlan(params);
      }
      this.path = result.data;
      this.activeIndex = index;
      this.line = index;
    },
    // 异常预警
    async showPopup() {
      this.show = true;
      let params = {
        tuId: this.chooseTakeResponsibilityID,
        startDate: this.timeRange.startDate,
        endDate: this.timeRange.endDate,
        orgId: this.chooseTakeResponsibilityParenID
      }
      let result = await PLAN_ACT_API.getWarnList(params);
      this.tableData = result.data
    },
    // 组织
    showPopup1() {
      this.show1 = true;
    },
    // 关闭弹层
    closePopup() {
      this.$emit('closePoint')
    }
  }
};
</script>

<style scoped lang="scss">
.noData {
  line-height: 40px;
  height: 40px;
  background: #ffffff;
}

.wrap {
  width: 100%;
  padding-top: 70px;
  background: #f4f5f6;
}

.nav {
  width: 100%;
  height: 28px;
  z-index: 555;
  position: fixed;
  padding: 6px 0;
  top: 0;
  background: #f4f5f6;
  align-items: center;

  .close {
    display: inline-block;
    width: 20px;
    height: 28px;
    position: absolute;
    top: 6px;
    left: 10px;

    svg {
      display: inline-block;
      width: 100%;
      height: 100%;
    }
  }

  .nav-title {
    width: 120px;
    height: 28px;
    margin: 0 auto;
    display: inline-block;
    color: #495060;
    font-size: 11px;
    border-radius: 2px;
    border: 1px solid #19be6b;
    background: #ffffff;

    button {
      width: 60px;
      height: 28px;
    }

    button:nth-child(2) {
      border-left: 1px solid #19be6b;
    }

    .active {
      color: rgba(255, 255, 255, 0.85);
      font-size: 11px;
      background: #19be6b;
    }
  }

  .nav-right {
    width: 80px;
    height: 18px;
    font-weight: 600;
    font-size: 14px;
    color: #495060;
    position: absolute;
    top: 11px;
    right: 10px;

    .van-icon {
      position: absolute;
      top: 3px;
      right: 0;
    }
  }
}

.center {
  background: #f4f5f6;
  margin-top: 10px;
}

.main {
  width: 100%;
}

.main-time {
  width: 100%;
  height: 32px;
  overflow: hidden;

  .mainTime {
    width: 108px;
    height: 17px;
    margin: 0 auto;
    margin-top: 7px;
    font-size: 12px;
    font-weight: 400;
    color: #1c2438;
    line-height: 17px;
  }
}

.main-local {
  width: 100%;
  padding: 10px 0;
  margin-top: 1px;
  position: relative;
  overflow: hidden;
  background: #ffffff;

  .svg-icon {
    width: 20px;
    height: 20px;
    margin-left: 13px;
    margin-top: 10px;
    float: left;
  }
}


.local {
  width: 299px;
  height: 42px;
  float: left;
  margin-left: 10px;
}

.local-lo {
  width: 299px;
  height: 20px;
  text-align: left;
  font-size: 14px;
  font-weight: 500;
  color: #1c2438;
  line-height: 20px;
}

.local-time {
  text-align: left;
  width: 38px;
  height: 20px;
  font-size: 14px;
  font-weight: 500;
  color: #80848f;
  line-height: 20px;
}

.button {
  width: 100%;
  overflow: hidden;
  height: 75px;
}

.foot {
  width: 100%;
  height: 75px;
  position: fixed;
  bottom: 0px;
  background: #ffffff;
  border: 1px solid #e9eaec;
}

.foot-button {
  width: 129px;
  height: 45px;
  margin: 0 auto;
  margin-top: 18px;
  color: #ed3f14;
  font-size: 14px;
  font-weight: 500;
  color: #ed3f14;
}

.foot-yujing {
  width: 100%;
  margin-top: 13px;
}

.footYujing {
  width: 60px;
  height: 20px;
  margin: 0 auto;
  font-size: 14px;
  font-weight: 600;
  color: #1c2438;
  line-height: 20px;
}

.foot-yujing div:nth-child(2) {
  width: 155px;
  height: 17px;
  margin: 0 auto;
  margin-top: 3px;
  font-size: 12px;
  font-weight: 400;
  color: #80848f;
  line-height: 17px;
}

.el-table {
  width: 100%;
  height: auto !important;
}

.content {
  width: 347px;
  margin: 20px auto;

  .percent {
    text-align: center;

    span {
      color: #19be6b;
    }

    .orange {
      color: #ed3f14;
    }
  }

  .uni {
    font-size: 12px;
    font-weight: 500;
    color: #19BE6B;
  }

  .unitt {
    font-size: 12px;
    font-weight: 500;
    color: #ED3F14;
  }

  .unit {
    font-size: 12px;
    font-weight: 500;
    color: #1c2438;
  }

  .fraction {
    color: #19be6b;
  }

  .orange {
    color: #ed3f14;
  }
}

.line {
  width: 0.2px;
  height: 59px;
  top: 0;
  left: 23px;
  float: left;
  position: absolute;
  border-left: 1px dashed #979797;
}

.history {
  width: 100%;
  margin-top: 46px;
  margin-left: 12px;

  .history-title {
    width: 48px;
    height: 17px;
    font-size: 12px;
    font-weight: 400;
    color: #80848f;
    line-height: 17px;
  }

  .history-name {
    width: 72px;
    height: 28px;
    line-height: 28px;
    margin-top: 18px;
    background: #e1faed;
    border-radius: 13px;
    font-size: 14px;
    font-weight: 400;
    color: #19be6b;
  }
}

.check {
  width: 72px;
  height: 17px;
  margin-top: 25px;
  margin-left: 12px;
  font-size: 12px;
  font-weight: 400;
  color: #80848f;
  line-height: 17px;
}
</style>
<style>
.custom-image .van-empty__image {
  width: 90px;
  height: 90px;
  margin-top: 190px;
}
</style>
