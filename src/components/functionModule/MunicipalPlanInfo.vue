<template>
  <van-popup
    v-model="infoVisible"
    class="municipal-plan-popup-wrapper"
    closeable
    position="bottom"
    round
    :lazy-render="false"
    :duration="0.1"
    @close="handleClose"
    :style="{ height: drawSize }"
  >
    <div class="header-box">
      <!------------- 顶部伸缩按钮 ----------->
      <div class="changeBox">
        <van-icon
          v-if="!changesBtnShow"
          name="arrow-down"
          @click="changeStutas"
        ></van-icon>
        <van-icon
          v-if="changesBtnShow"
          name="arrow-up"
          @click="changeStutas"
        ></van-icon>
      </div>
      <!-- 标题名称 -->
      <div class="info-title">市政规划提醒</div>
    </div>
    <!-- 内容区域 -->
    <div class="content-box">
      <div class="info-content">
        <article class="isPart1">
          <div class="title_icon">
            <div class="lable">反馈类型</div>
            <div class="label_icon">
              <template v-for="item in labelInfo">
                <span
                  :key="item.id"
                  v-if="
                    drawerMunicipalInfos.planType &&
                      drawerMunicipalInfos.planType.indexOf(item.id) !== -1
                  "
                >
                  <img :src="item.icon" alt="" />
                  <p class="p_label">{{ item.name }}</p>
                </span>
              </template>
            </div>
          </div>
          <div class="part_conter">
            <van-image
              v-for="img in drawerMunicipalInfos.pictures"
              :key="img.index"
              width="105px"
              height="90px"
              fit="fill"
              :src="img"
            />
          </div>
        </article>
        <article class="isPart2">
          <div class="title">反馈名称</div>
          <div class="part_conter">
            <p>{{ drawerMunicipalInfos.planName }}</p>
            <template v-for="st in planStatus">
              <p
                class="statusShow"
                :style="st.color"
                :key="st.id"
                v-if="st.id === drawerMunicipalInfos.planStatus"
              >
                {{ st.name }}
              </p>
            </template>
          </div>
        </article>
        <article class="isPart3">
          <div class="title">定位地址</div>
          <div class="part_conter">
            {{ drawerMunicipalInfos.planAdress }}
          </div>
        </article>
        <article class="isPart4">
          <div class="title">描述</div>
          <div class="part_conter">
            {{ drawerMunicipalInfos.planDesc }}
          </div>
        </article>
        <article class="isPart5">
          <div class="title">预计竣工时间</div>
          <div class="part_conter">
            {{ drawerMunicipalInfos.planExpectTime }}
          </div>
        </article>
        <article class="isPart6">
          <div class="title">
            <p class="">反馈人</p>
            <p class="">反馈时间</p>
            <p class="">修改时间</p>
          </div>
          <div class="part_conter">
            <p class="">{{ drawerMunicipalInfos.userName }}</p>
            <p class="">{{ drawerMunicipalInfos.createTime }}</p>
            <p class="">{{ drawerMunicipalInfos.updateTime }}</p>
          </div>
        </article>
        <!--   -->
      </div>
      <article class="isPart7" v-if="drawerMunicipalInfos.isPower === 1">
        <div class="part_conter">
          <mt-button
            @click="getPosition()"
            type="primary"
            size="small"
            v-if="
              (municipalType === 2 && drawerMunicipalInfos.planStatus !== 1) ||
                drawerMunicipalInfos.planStatus === 2
            "
            >点位位置</mt-button
          >
          <mt-button
            @click="getEdit()"
            type="primary"
            size="small"
            v-if="drawerMunicipalInfos.planStatus === 0"
            >编辑</mt-button
          >
          <mt-button
            @click="getCancelFeedback()"
            type="primary"
            size="small"
            v-if="drawerMunicipalInfos.planStatus !== 1"
            >取消反馈</mt-button
          >
          <mt-button
            @click="getCompleted()"
            type="primary"
            size="small"
            v-if="drawerMunicipalInfos.planStatus === 0"
            >规划竣工</mt-button
          >
          <mt-button
            @click="getUploadAgain()"
            type="primary"
            size="small"
            v-if="drawerMunicipalInfos.planStatus === 1"
            >重新上传</mt-button
          >
        </div>
      </article>
    </div>
  </van-popup>
</template>

<script>
import Vue from "vue";
import { Notify } from "vant";
Vue.use(Notify);
import MUNICIPAL_PLANNING_API from "../../../api/municipal_planning_api";

export default {
  name: "MunicipalPlanInfo",
  data() {
    return {
      infoVisible: false,
      drawerName: "市政规划提醒",
      drawSize: "50%",
      changesBtnShow: true,
      labelInfo: [
        {
          id: 1,
          name: "商业娱乐规划",
          icon: "/img/municipal-planning-views/shoppingPlan.png",
        },
        {
          id: 2,
          name: "交通道路规划",
          icon: "/img/municipal-planning-views/trafficPlan.png",
        },
        {
          id: 3,
          name: "教育设施规划",
          icon: "/img/municipal-planning-views/sciencePlan.png",
        },
        {
          id: 4,
          name: "住宅建设规划",
          icon: "/img/municipal-planning-views/homePlan.png",
        },
      ],
      planStatus: [
        {
          id: 0,
          name: "规划中",
          color: "border-color:#00ff00;color: #00ff00",
        },
        {
          id: 1,
          name: "取消",
          color: "border-color:#8f949a;color: #8f949a",
        },
        {
          id: 2,
          name: "竣工",
          color:
            "border-color: rgba(147, 13, 234, 1);color:  rgba(147, 13, 234, 1)",
        },
      ],
      drawerMunicipalInfos: {
        planType: [],
        pictures: "",
        planName: "",
        planStatus: "",
        planAdress: "",
        planDesc: "",
        planExpectTime: "",
        userName: "",
        createTime: "",
        updateTime: "",
        isPower: 0,
      },
    };
  },
  components: {},
  props: ["drawerMunicipalInfoShow", "municipalType", "drawerMunicipalInfo"],
  watch: {
    drawerMunicipalInfo(val) {
      this.drawerMunicipalInfos = val;
    },
    drawerMunicipalInfoShow(val) {
      this.infoVisible = val;
    },
  },

  methods: {
    handleClose(done) {
      console.log(done);
      this.$emit(
        "drawerMunicipalInfoClose",
        false,
        this.drawerMunicipalInfos.planStatus
      );
    },

    changeStutas() {
      if (this.changesBtnShow == false) {
        this.drawSize = "50%";
        this.changesBtnShow = true;
      } else if (this.changesBtnShow == true) {
        this.drawSize = "93%";
        this.changesBtnShow = false;
      }
    },
    getPosition() {
      console.log("点位位置");
      // 1.存储该市政规划的地址
      this.$store.commit(
        "set_planLngLat",
        `${this.drawerMunicipalInfo.lng},${this.drawerMunicipalInfo.lat}`
      );
      // 2.关闭详情弹框
      this.handleClose();
      // 3.跳转到地图页
      this.$router.push('/network-planning/index?userId=81011103&token=123445566')
    },
    getEdit() {
      this.$emit("hideDrawer", false);
      this.$emit("CityPlanyOpen", 1);
    },
    async getCancelFeedback() {
      const params = `id=${this.drawerMunicipalInfo.id}` + "&planStatus=1";
      let result = await MUNICIPAL_PLANNING_API.updatStatus(params);
      if (result.status !== 0) {
        Notify({ type: "warning", message: "接口请求异常!", duration: 1000 });
        return;
      }
      // this.$emit('hideDrawer',true, this.drawerMunicipalInfo.id);
      this.handleClose();
      if (this.municipalType == 2) {
        this.$emit("hideDrawerBtn");
      }
    },
    async getCompleted() {
      const params = `id=${this.drawerMunicipalInfo.id}` + "&planStatus=2";
      let result = await MUNICIPAL_PLANNING_API.updatStatus(params);
      if (result.status !== 0) {
        Notify({ type: "warning", message: "接口请求异常!", duration: 1000 });
        return;
      }
      // this.$emit('hideDrawer',true, this.drawerMunicipalInfo.id);
      this.handleClose();
      if (this.municipalType == 2) {
        this.$emit("hideDrawerBtn");
      }
    },
    getUploadAgain() {
      this.$emit("hideDrawer", false);
      this.$emit("CityPlanyOpen", 1);
    },
  },
};
</script>

<style lang="scss" scoped>
.municipal-plan-popup-wrapper {
  display: flex;
  flex-direction: column;
  .header-box {
    height: 48px;
    line-height: 48px;
    text-align: center;
    position: relative;
    // border-bottom: 1px solid #e6e6e6;
    .changeBox {
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
    .info-title {
      height: 40px;
      font-size: 16px;
      margin-top: 5px;
    }
  }
  .content-box {
    flex: 1;
    overflow-y: hidden;
    position: relative;
    .info-content {
      height: 100%;
      overflow-y: auto;
      padding: 0 24px;
      font-size: 12px;
      .isPart1 {
        margin-bottom: 5px;
        .title_icon {
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          .lable {
            width: 55px;
            margin-right: 8px;
            height: 26px;
            line-height: 26px;
          }
          .label_icon {
            flex: 1;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            span {
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
              height: 26px;
              line-height: 26px;
              margin-right: 10px;
              margin-bottom: 8px;
              img {
                width: 20px;
                height: 20px;
                margin-right: 5px;
              }
              .p_label {
                height: 26px;
                line-height: 26px;
                margin: 0;
              }
            }
          }
        }
        .part_conter {
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          justify-content: flex-start;
          .van-image {
            margin: 0 0.12625rem;
          }
        }
      }
      .isPart2 {
        display: flex;
        flex-direction: column;
        .title {
          color: rgba(147, 13, 234, 1);
          font-weight: 600;
          text-align: left;
        }
        .part_conter {
          margin: 12px 0;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          .statusShow {
            margin-left: 1.4rem;
            width: 70px;
            height: 18px;
            line-height: 18px;
            text-align: center;
            display: inline-block;
            border: 1px solid;
            border-radius: 4px;
          }
        }
      }
      .isPart3 {
        display: flex;
        flex-direction: column;
        border-bottom: 1px solid #f5f4f9;
        .title {
          font-weight: 600;
          text-align: left;
        }
        .part_conter {
          color: #797979;
          margin: 12px 0;
          text-align: left;
        }
      }
      .isPart4 {
        display: flex;
        flex-direction: column;
        .title {
          font-weight: 600;
          text-align: left;
        }
        .part_conter {
          color: #797979;
          margin: 12px 0;
          text-align: left;
        }
      }
      .isPart5 {
        display: flex;
        flex-direction: row;
        box-sizing: border-box;
        border-bottom: 1px solid #f5f4f9;
        .title {
          font-weight: 600;
          margin-bottom: 12px;
          text-align: left;
        }
        .part_conter {
          color: #797979;
          margin-left: 12px;
          height: 16px;
          line-height: 16px;
          margin-bottom: 12px;
        }
      }
      .isPart6 {
        display: flex;
        flex-direction: row;
        border-bottom: 1px solid #f5f4f9;
        margin-bottom: 60px;
        .title {
          width: 60px;
          display: flex;
          flex-direction: column;
          p {
            margin: 0.12rem 0;
            display: inline-block;
            height: 24px;
            line-height: 24px;
            text-align: left;
          }
        }
        .part_conter {
          flex: 1;
          color: #797979;
          text-align: left;
          display: flex;
          flex-direction: column;
          p {
            margin: 0.12rem 0;
            display: inline-block;
            height: 24px;
            line-height: 24px;
          }
        }
      }
    }
    .isPart7 {
      position: fixed;
      width: 100%;
      box-sizing: border-box;
      padding: 0 10px;
      bottom: 0;
      left: 0;
      background: #fff;
      border-top: 1px solid #d9d9d9;
      .part_conter {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        box-sizing: border-box;
        justify-content: space-between;
        padding: 10px 0;
        .mint-button {
          width: 80px;
          background-color: rgba(147, 13, 234, 1);
          font-size: 12px;
        }
      }
    }
  }
}
</style>
