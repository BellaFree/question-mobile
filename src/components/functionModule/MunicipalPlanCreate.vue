<template>
  <div
    class="municipal-plan-create-wrapper"
    :class="isEdit ? 'pos-edit' : 'pos-create'"
    v-show="municipalPlanCreateShow"
  >
    <div class="top-title">
      <van-icon name="arrow-left" @click="handleClose"></van-icon>
      <span>市政规划反馈</span>
    </div>
    <div class="content">
      <!-- 表单内容 -->
      <div class="content-inner">
        <article class="part part1">
          <div class="part_title">
            <i class="iconfont icon-wrench"></i>
            <p class="tig">反馈类型( 多选 )</p>
            <p class="xing">*</p>
          </div>
          <div class="part_conter">
            <van-checkbox-group v-model="checkedtypes">
              <van-checkbox
                v-for="item in typeOption"
                :key="item.id"
                :label="item.id"
                :name="item.id"
              >
                <img class="img-icon" :src="item.icon" />{{ item.name }}
              </van-checkbox>
            </van-checkbox-group>
          </div>
        </article>
        <article class="part part2">
          <div class="part_title">
            <i class="iconfont icon-shuqian"></i>
            <p class="tig">名称</p>
            <p class="xing">*</p>
          </div>
          <div class="part_conter">
            <van-field
              type="text"
              class="input-box municipal-input"
              rows="1"
              placeholder="请输入名称"
              v-model="nameArea"
              maxlength="30"
              show-word-limit
            >
            </van-field>
          </div>
        </article>
        <article class="part part3">
          <div class="part_title">
            <i class="iconfont icon-dingwei"></i>
            <p class="tig">位置</p>
            <p class="xing">*</p>
          </div>
          <div class="part_conter">
            <div class="map_box marginAuto" @click="openMap" id="mapbox"></div>
          </div>
        </article>
        <article class="part part4">
          <div class="part_title">
            <i class="iconfont icon-location"></i>
            <p class="tig">地址</p>
            <p class="xing">*</p>
          </div>
          <div class="part_conter">
            <van-cell-group>
              <van-field v-model="addressInfos" readonly />
            </van-cell-group>
          </div>
        </article>
        <article class="part part5">
          <div class="part_title">
            <i class="iconfont icon-time"></i>
            <p class="tig">预计竣工时间</p>
            <p class="xing">*</p>
          </div>
          <div class="part_conter">
            <div class="timePick">
              <p>{{ dateInfo }}</p>
              <i class="el-icon-arrow-right" @click="openPicker"></i>
            </div>
            <template>
              <mt-datetime-picker
                ref="picker"
                v-model="pickerVisible"
                type="date"
                year-format="{value} 年"
                month-format="{value} 月"
                date-format="{value} 日"
                @confirm="handleConfirm"
              >
              </mt-datetime-picker>
            </template>
          </div>
        </article>
        <article class="part part6">
          <div class="part_title">
            <i class="iconfont icon-xiangji"></i>
            <p class="tig">现场拍照</p>
            <p class="xing">*</p>
          </div>
          <div class="part_conter">
            <!-- -------------method 1--------------- -->
            <van-uploader
              v-model="Photos"
              :before-read="beforeRead"
              :after-read="afterRead"
              multiple
              :max-count="3"
              capture="camera"
              accept="image/*"
            />
            <!-- -------------method 2--------------- -->
            <!-- capture="camera" 照相机-->
            <!-- accept="image/*" -->
            <!-- <img src="" id="v_photoA" style="width: 100px;height: 100px;" /> -->
            <!-- <input type="file" capture="camera" id="filetest" name="filetest" /> -->
          </div>
        </article>
        <article class="part part7">
          <div class="part_title">
            <i class="iconfont icon-47"></i>
            <p class="tig">详情描述</p>
            <p class="xing">*</p>
          </div>
          <div class="part_conter">
            <van-field
              type="text"
              class="input-box municipal-input"
              rows="1"
              placeholder="请输入详细信息"
              v-model="describeMessage"
              maxlength="500"
              show-word-limit
            >
            </van-field>
          </div>
        </article>
      </div>
      <!-- 地图 -->
      <municipalMap
        ref="municipalMap"
        v-if="muMapShow"
        @closeMap="closeMap"
        @maoSubmit="maoSubmit"
        :localhostPosition="localhostPosition"
        :addressInfo="addressInfo"
      ></municipalMap>
    </div>
    <!-- 底部按钮 -->
    <div class="footer-box">
      <van-button color="#930dea" style="width: 320px;" round @click="submit"
        >提交</van-button
      >
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Vue from "vue";
import { DatetimePicker } from "mint-ui";
import { Notify } from "vant";
Vue.use(Notify);
Vue.component(DatetimePicker.name, DatetimePicker);
import Compressor from "compressorjs";

import municipalMap from "../functionModule/municipalMap";
import MUNICIPAL_PLANNING_API from "../../../api/municipal_planning_api";

export default {
  name: "municipalPlanCreate",
  components: {
    municipalMap,
  },
  props: ["municipalPlanCreateShow", "isEdit", "municipalPlanInfo"],
  data() {
    return {
      localhostPosition: [], //地图定位
      muMapShow: false, //内置地图显示隐藏
      pickerVisible: "",
      addressInfos: "",
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      typeOption: [
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

      checkedtypes: [], //反馈类型
      nameArea: "", //名称
      addressInfo: "", //地址
      dateInfo: "", // 预计竣工时间
      Photos: [], //照片
      describeMessage: "", //描述
      checkPosition: [], //选择之后的坐标
    };
  },
  computed: {
    MunicipalPlanInfo() {
      return JSON.parse(window.sessionStorage.getItem("pickerInfo"));
    },
    sessionUserInfo() {
      return JSON.parse(window.sessionStorage.getItem("userInfo"));
    },
  },
  watch: {
    municipalPlanCreateShow(val) {
      if (val) {
        this.getInitDate();
      }
    },
  },
  mounted() {
    // this.getDate();
    // <!-- -------------method 2--------------- -->
    // document.querySelector("#filetest").onchange = function() {
    //   alert(111);
    //   var fileTag = document.getElementById("filetest");
    //   console.log(111);
    //   var file = fileTag.files[0];
    //   var fileReader = new FileReader();
    //   fileReader.onloadend = function() {
    //     if (fileReader.readyState == fileReader.DONE) {
    //       document
    //         .getElementById("v_photoA")
    //         .setAttribute("src", fileReader.result);
    //     }
    //   };
    //   fileReader.readAsDataURL(file);
    // };
  },
  methods: {
    handleClose() {
      this.$emit("handleMunicipalPlanCreateClose", false);
    },
    openMap() {
      //打开地图
      this.muMapShow = true;
    },
    closeMap() {
      //关闭地图
      this.muMapShow = false;
    },
    openPicker() {
      //打开时间选择器
      this.$refs.picker.open();
    },
    handleConfirm() {
      //触发确定键
      if (this.pickerVisible != "") {
        let date = new Date(this.pickerVisible);
        let year = date.getFullYear();
        let mouth =
          date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1;
        let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        this.dateInfo = year + "-" + mouth + "-" + day;
      } else {
        this.dateInfo = "2011-01-01";
      }
    },
    //初始化页面数据
    getInitDate() {
      this.Photos = [];
      // 编辑状态
      if (this.isEdit) {
        (this.checkPosition = [
          this.municipalPlanInfo.lng,
          this.municipalPlanInfo.lat,
        ]), //经度
          (this.localhostPosition = this.checkPosition);
        (this.checkedtypes = this.municipalPlanInfo.planType), //反馈类型
          (this.nameArea = this.municipalPlanInfo.planName), //名称
          (this.addressInfos = this.municipalPlanInfo.planAdress), //地址
          (this.addressInfo = this.municipalPlanInfo.planAdress);
        (this.dateInfo = this.municipalPlanInfo.planExpectTime), //预计竣工时间
          (this.describeMessage = this.municipalPlanInfo.planDesc); //描述
        if (this.municipalPlanInfo.pictures) {
          this.municipalPlanInfo.pictures.forEach((res, i) => {
            let p = {
              url: res,
              id: i,
            };
            this.Photos.push(p);
          });
        }
      } else {
        // 新建状态
        let lng = this.municipalPlanInfo.position.lng;
        let lat = this.municipalPlanInfo.position.lat;
        if (this.checkPosition.length > 0) {
          this.localhostPosition = this.checkPosition;
        } else {
          this.localhostPosition = [lng, lat];
        }
        if (this.addressInfos === "") {
          this.addressInfo = this.municipalPlanInfo.formattedAddress;
        }
        this.checkPosition = this.localhostPosition;
      }
      this.initmuMap();
    },
    initmuMap() {
      //实例化地图
      if (this.checkPosition.length > 0) {
        this.localhostPosition = this.checkPosition;
      }
      if (this.addressInfo !== "") {
        this.addressInfos = this.addressInfo;
      }
      this.checkPosition = this.localhostPosition;
      let municipalMap = new AMap.Map("mapbox", {
        resizeEnable: true,
        center: this.localhostPosition, //中心点坐标
        zoom: 15, //缩放级别
        zoomEnable: false,
        dragEnable: false,
      });
      let iconItme = new AMap.Icon({
        size: new AMap.Size(15, 18),
        image: "/img/network-planning-views/location.png", // 图标的取图地址
        imageSize: new AMap.Size(15, 18),
        imageOffset: new AMap.Pixel(0, 0), // 图标取图偏移量
      });
      let marker = new AMap.Marker({
        position: this.localhostPosition,
        icon: iconItme,
        zIndex: 300,
        offset: new AMap.Pixel(-10, -10),
      });
      municipalMap.add(marker);
    },
    maoSubmit(b) {
      this.muMapShow = false;
      this.addressInfo = b.address;
      this.checkPosition = b.position;
      this.initmuMap();
    },
    async beforeRead(file) {
      console.log("beforeRead", file);
      return new Promise((resolve) => {
        // compressorjs 默认开启 checkOrientation 选项
        // 会将图片修正为正确方向
        new Compressor(file, {
          quality: 0.6,
          // mimeType: 'image/png,image/webp',
          // convertSize: 100000, // 100kb
          success: resolve,
          error(err) {
            console.log(err.message);
          },
        });
      });
    },
    async afterRead(file) {
      console.log("afterRead", file);
      console.log("afterRead", file.file.size);
      // alert(file.file.size)
      // 点击提交时再上传 防止提交前删除图片
      // 此时可以自行将文件上传至服务器
      // const formData = new FormData();
      // formData.append('file', file, file.name);
      // axios.post("/api/expand/upload", formData).then(() => {
      //   console.log("Upload success");
      // });
    },
    async submit() {
      //提交反馈
      if (this.checkedtypes.length === 0) {
        this.$toast({
          message: "请选择反馈类型",
          className: "toastStyle",
        });
        return;
      }
      if (this.nameArea === "") {
        this.$toast({
          message: "请填写名称",
          className: "toastStyle",
        });
        return;
      }
      if (this.addressInfo === "") {
        this.$toast({
          message: "请填写地址",
          className: "toastStyle",
        });
        return;
      }
      if (this.dateInfo === "") {
        this.$toast({
          message: "请填写预计竣工时间",
          className: "toastStyle",
        });
        return;
      }
      if (this.Photos.length === 0) {
        this.$toast({
          message: "请选择照片",
          className: "toastStyle",
        });
        return;
      }
      if (this.describeMessage === "") {
        this.$toast({
          message: "请填写描述",
          className: "toastStyle",
        });
        return;
      }

      let pictures = [];
      let image;
      let imageStatus = false;
      this.Photos.forEach(async (e, idx) => {
        if (e.url) {
          image = e.url;
        } else {
          // let url = _apiUrl.expandUpload;
          let imageInfo = new FormData();
          imageInfo.append("file", e.file);
          // let result = await _http.Ajax(url, imageInfo, "post");
          // post方式传参对象是文件 需要用axios：Content-Type: multipart/form-data
          await axios.post("/api/expand/upload", imageInfo).then((res) => {
            if (res.data && res.data.status === 0) image = res.data.message;
          });
        }
        if (idx === this.Photos.length - 1) {
          imageStatus = true;
        }
        pictures.push(image);

        if (imageStatus) {
          let id = "";
          if (this.municipalPlanInfo.id) {
            id = this.MunicipalPlanInfo.id;
          }
          // let url = _apiUrl.getUpset;
          let upsetJson = {
            id: id,
            lat: this.checkPosition[1], //纬度
            lng: this.checkPosition[0], //经度
            planType: this.checkedtypes, //反馈类型
            planName: this.nameArea, //名称
            planAdress: this.addressInfo, //地址
            planExpectTime: this.dateInfo, //预计竣工时间
            pictures: pictures, //照片
            planDesc: this.describeMessage, //描述
            userId: this.sessionUserInfo.tuId, //用户ID
            userName: this.sessionUserInfo.tuName, //用户名称
            // city: this.$store.getters.cityCode,
            city: this.MunicipalPlanInfo.adcode,
          };
          let result = await MUNICIPAL_PLANNING_API.getUpset(upsetJson);
          if (result.status === 0) {
            Notify({ type: "success", message: "success", duration: 1000 });
            this.$emit("handleMunicipalPlanCreateClose", false);
          }
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.municipal-plan-create-wrapper {
  width: 100%;
  background: #fff;
  z-index: 2001;
  height: 100vh;
  position: absolute;
  left: 0;
  &.pos-create {
    top: 0;
  }
  &.pos-edit {
    top: -50px;
  }
  .top-title {
    font-size: 14px;
      text-align: center;
    text-align: center;
    height: 50px;
    line-height: 50px;
    position: relative;
    border-bottom: 1px solid #d9d9d9;
    i {
      position: absolute;
      top: 20px;
      left: 10px;
    }
    span {
      display: inline-block;
      flex: 1;
    }
  }
  .content {
    height: calc(100vh - 100px);
    overflow-y: auto;
    .content-inner {
      display: flex;
      flex-direction: column;
      .part {
        background: #fff;
        margin: 0 auto;
        .part_title {
          height: 25px;
          width: 100%;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          i {
            width: 14px;
            height: 14px;
            padding-top: 7px;
            margin: 0 12px 0 2px;
          }
          p {
            height: 25px;
            margin: 5px 0 0 5px;
            padding: 0;
            font-size: 14px;
          }
          p.xing {
            color: #ff0000;
            padding-top: 4px;
          }
        }
        .part_conter {
          width: 360px;
          margin: 10px 0 20px;
          .input-box {
            .van-cell__value {
              .van-field__body {
                border-bottom: 1px solid #dcdfe6 !important;
              }
            }
          }
        }
      }
      .part1 {
        height: 125px;
        .part_conter {
          height: 81px;
          background: #f8f8fa;
          border-radius: 15px;
          .van-checkbox-group {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            padding: 10px 15px;
            .van-checkbox {
              height: 32px;
              .van-checkbox__icon {
              }
              .van-checkbox__label {
                padding-top: 10px;
                font-size: 14px;
                img {
                  width: 20px;
                  height: 20px;
                  margin-right: 7px;
                  margin-bottom: 0;
                }
              }
            }
            .van-checkbox:nth-child(2n) {
              margin-left: 20px;
            }
          }
        }
      }
      .part2 {
        height: 95px;
      }
      .part3 {
        height: 160px;
        .part_conter {
          .map_box {
            width: 330px;
            height: 105px;
            border-radius: 5px;
            margin: 0 auto;
          }
        }
      }
      .part4 {
        height: 100px;
        .part_conter {
        }
      }
      .part5 {
        height: 90px;
        .part_conter {
          .timePick {
            height: 25px;
            border-bottom: 1px solid #dcdfe6;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            padding-left: 10px;
            font-size: 14px;
          }
        }
      }
      .part6 {
        min-height: 150px;
      }
    }
  }
  .footer-box {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 45px;
    line-height: 45px;
    background-color: #fff;
    border-top: 1px solid #d9d9d9;
    box-shadow: 2px 2px 4px 4px #d9d9d9;
  }
}
</style>

<style lang="scss">
.municipal-plan-create-wrapper {
  .municipal-input {
    .van-cell__value {
      .van-field__body {
        border-bottom: 1px solid #dcdfe6 !important;
      }
    }
  }
  .part6 {
    .part_conter {
      .van-uploader {
        width: 100%;
        .van-uploader__wrapper {
          width: 100%;
          height: 95px;
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          justify-content: flex-start;
          .van-uploader__upload {
            display: flex;
            justify-content: center;
            box-sizing: border-box;
            width: 110px;
            height: 95px;
            line-height: 95px;
            i {
              color: #dcdee0;
              font-size: 24px;
            }
            i::befor {
              content: "\F09E";
            }
          }
          .van-uploader__preview {
            .van-image {
              width: 110px;
              height: 95px;
              .van-image__img {
                width: 110px;
                height: 95px;
              }
            }
            .van-uploader__preview-delete {
              position: absolute;
              top: 0;
              right: 0;
              background-color: rgba(0, 0, 0, 0.7);
              border-radius: 0 0 0 12px;
              .van-icon {
                font-size: 16px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
