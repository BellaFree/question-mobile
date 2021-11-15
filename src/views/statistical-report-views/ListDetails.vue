<template>
  <div class="wrap">
    <!--级联选择器    -->
    <div class="Cascader">
      <van-field
          v-model="fieldValue"
          is-link
          arrow-direction="down"
          readonly
          placeholder="请选择所在地区"
          @click="show = true"
      />
      <van-field
          v-model="fieldValue"
          is-link
          arrow-direction="down"
          readonly
          placeholder="请选择时间"
          @click="showOne = true"
      />
    </div>
    <div class="lists" v-for="(value, key,index) in dataList" :key="index" >
      <div class="lists-time">{{key}}</div>
      <div class="lists-main" v-for="(item,index) in value" :key="index" >
        <div class="header">{{ item.signUser }}</div>
        <div class="lists-main-shops">
          <div class="lists-main-shops-title">{{ item.storeName }}</div>
          <div class="lists-main-local">
            <van-icon name="location-o"/>
            {{ item.storeAddress }}
          </div>
          <div class="lists-main-point">
            <span class="point"></span> <span class="lists-main-point-word">到店打卡{{ item.startTime }} </span>
            <span class="point"></span> <span class="lists-main-point-word">离店打卡 {{ item.endTime }}</span><br>
          <div class="pointThr"><span class="point"></span> <span class="lists-main-point-word">在店时长 {{ item.times }}</span></div>
          </div>
          <div class="line"></div>
        </div>
      </div>
    </div>
    <!--   选择人-->
    <van-popup v-model="show" round position="bottom">
      <van-cascader
          v-model="cascaderValue"
          title="请选择所在地区"
          :options="options"
          @close="show = false"
          @finish="onFinish"
      />
    </van-popup>
    <!--   选择时间-->
    <van-popup v-model="showOne" round position="bottom">
      <van-cascader
          v-model="cascaderValueOne"
          title="请选择所在地区"
          :options="optionsOne"
          @close="showOne = false"
          @finish="onFinishOne"
      />
    </van-popup>
  </div>
</template>
<script>
export default {
  name: 'ListDetails',
  subtitle() {
    return '列表详情';
  },
  leftIcon() {
    return 'arrow-left';
  },
  onLeft() {
    window.history.go(-1);
  },
  data() {
    return {
      show: false,
      showOne: false,
      fieldValue: '',
      fieldValueOne: '',
      cascaderValue: '',
      cascaderValueOne: '',
      options: [
        {
          text: '浙江省',
          value: '330000',
          children: [{text: '杭州市', value: '330100'}],
        },
        {
          text: '江苏省',
          value: '320000',
          children: [{text: '南京市', value: '320100'}],
        },
      ],
      optionsOne: [{
        text: '河南省',
        value: '330000',
        children: [{text: '杭州市', value: '330100'}],
      },
        {
          text: '江苏省',
          value: '320000',
          children: [{text: '南京市', value: '320100'}],
        },],
      dataList:{
        "2021-11-04": [
          {
            "signInNo": "1457542250497183744",
            "signUser": "依稀",
            "storeNo": "S001",
            "storeName": "ybtfl_test_门店",
            "storeAddress": "北京市西城区阜成门外大街1号四川大厦1层西侧德克士餐厅",
            "gdLng": "116.201176",
            "gdLat": "39.908647",
            "visitDate": "2021-11-04",
            "startTime": "2021-11-04 00:00:00",
            "endTime": "2021-11-04 00:30:02",
            "times": "30min"
          },
          {
            "signInNo": "1457542250497183744",
            "signUser": "依稀",
            "storeNo": "S001",
            "storeName": "ybtfl_test_门店",
            "storeAddress": "北京市西城区阜成门外大街1号四川大厦1层西侧德克士餐厅",
            "gdLng": "116.201176",
            "gdLat": "39.908647",
            "visitDate": "2021-11-04",
            "startTime": "2021-11-04 00:00:00",
            "endTime": "2021-11-04 00:30:02",
            "times": "30min"
          }
        ],
        "2021-11-05": [
          {
            "signInNo": "1457542366385803264",
            "signUser": "依稀",
            "storeNo": "S001",
            "storeName": "ybtfl_test_门店",
            "storeAddress": "北京市西城区阜成门外大街1号四川大厦1层西侧德克士餐厅",
            "gdLng": "116.201176",
            "gdLat": "39.908647",
            "visitDate": "2021-11-05",
            "startTime": "2021-11-05 00:21:02",
            "endTime": "2021-11-05 00:51:00",
            "times": "30min"
          }
        ],
      },
    }

  },
  methods: {
    onFinish({selectedOptions}) {
      this.show = false;
      this.fieldValue = selectedOptions.map((option) => option.text).join('-');
    },
    onFinishOne({selectedOptions}) {
      this.showOne = false;
      this.fieldValueOne = selectedOptions.map((option) => option.text).join('-');
    },
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  width: 100%;
  background: #FAFAFA;
  overflow: hidden;

  .Cascader {
    width: 100%;
    overflow: hidden;
    background: #FFFFFF;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.09);
    border-radius: 0px 0px 5px 5px;

    ::v-deep.van-field {
      width: 50%;
      float: left;

    }
  }
}

.lists {
  width: 100%;
  overflow: hidden;

  .lists-time {
    margin: 10px 0;
    font-size: 17px;
    text-align: left;
    text-indent: 1em;
    font-weight: 600;
    color: #4C4C4C;
  }

  .lists-main {
    width: 100%;
    overflow: hidden;
    position: relative;
    background: #FFFFFF;
    //头像
    .header {
      width: 40px;
      height: 40px;
      left: 17px;
      position: absolute;
      color: #FFFFFF;
      border-radius: 50%;
      background: #0A9B58;
      text-align: center;
      line-height: 40px;
    }

  }
}

//访店列表
.lists-main-shops {
  width: 294px;
  margin-left: 65px;
  //访第一家店
  .lists-main-shops-title {
    font-size: 14px;
    text-align: left;
    font-weight: 600;
    color: #424242;
  }

  //地点
  .lists-main-local {
    font-size: 13px;
    text-align: left;
    line-height: 20px;
    margin: 3px 0px 11px 0px;
    font-weight: 400;
    color: #999999;

    .van-icon {
      float: left;
    }
  }

  .lists-main-point {
    text-align: left;
    .point {
      width: 8px;
      height: 8px;
      display: inline-block;
      border-radius: 50%;
      background: #6DD400;
    }
    .lists-main-point-word{
      margin-right:30px;
    }
    .point:nth-child(2) {
      background: #FA6400;
    }
    .pointThr{
      margin-top:9px;
      .point{
        background: #F7B500;
      }
    }
  }
  .line{
    width: 100%;
    height: 1px;
    margin: 14px 0;
    border-top: 1px solid #E0E6ED;
  }
}
</style>