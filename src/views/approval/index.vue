<template>
  <div class="approval-wrap">
    <div class="approval-tab">
      <div
        v-for="item of tabOptions"
        :key="item.code"
        :class="{'approval-tab-item': true, 'approval-tab-item-active': currentViewTabCode === item.code}"
        @click="chooseThisType(item.code)">
        <span>{{ item.name }}</span>
      </div>
    </div>
    <div class="approval-content">
      <div class="approval-filter">
        <div class="approval-filter-left">
          <div class="approval-filter-item" @click="showStatusPicker">
            审批状态
            <svg-icon icon-class="sanjiao" class-name="filter-icon" />
          </div>
          <div class="approval-filter-item" @click="showCityPicker">
            城市
            <svg-icon icon-class="sanjiao" class-name="filter-icon" />
          </div>
        </div>
        <div class="approval-filter-right">
          <van-search
            v-model="searchKey"
            show-action
            class="approval-filter-key"
            left-icon=""
            placeholder="请输入搜索关键词">
            <template #action>
              <div class="search-btn">搜索</div>
            </template>
          </van-search>
        </div>
      </div>
      <div class="approval-box">
        <div class="approval-box-item">
          <h5>小明提交的基盘开发审批申请 <span>(驳回)</span></h5>
          <p>基盘名称：</p>
          <p>申请时间：</p>
          <p>城市：</p>
        </div>
      </div>
    </div>
    <!--审批状态 -->
    <van-popup v-model="dialogStatusPickerVisible" round position="bottom">
      <van-picker
        title="审批状态"
        show-toolbar
        :columns="statusPickerColumn" />
    </van-popup>
    <!--城市 -->
    <van-popup v-model="dialogCityPickerVisible" round position="bottom">
      <van-picker
        title="城市"
        show-toolbar
        :columns="cityPickerColumn" />
    </van-popup>
  </div>
</template>s

<script>

export default {
  name: 'Index',
  subtitle() {
    return '审批';
  },
  leftIcon() {
    return 'arrow-left';
  },
  onLeft() {
    history.go(-1);
  },
  data() {
    return {
      // tab
      tabOptions: [
        {
          name: '待处理',
          code: 1
        },
        {
          name: '已处理',
          code: 2
        },
        {
          name: '已发起',
          code: 3
        }
      ],
      currentViewTabCode: 1,
      dialogStatusPickerVisible: false,
      statusPickerColumn: ['杭州', '宁波', '温州', '绍兴', '湖州', '嘉兴', '金华', '衢州'],
      dialogCityPickerVisible: false,
      cityPickerColumn: ['杭州', '宁波', '温州', '绍兴', '湖州', '嘉兴', '金华', '衢州'],
      searchKey: ''
    };
  },
  methods: {
    chooseThisType(code) {
      this.currentViewTabCode = code;
    },
    showStatusPicker() {
      this.dialogStatusPickerVisible = !this.dialogStatusPickerVisible;
    },
    showCityPicker() {
      this.dialogCityPickerVisible = !this.dialogCityPickerVisible;
    }
  }
};
</script>

<style scoped lang="scss">
  .approval-wrap{
    width: 100%;
    height: 100vh;
    background-color: #FDFDFD;
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  .approval-content{
    width: 335px;
    height: 100%;
    padding: 0 6px;
    background: #FFFFFF;
    box-shadow: 0 0 10px 0 rgba(0,0,0,0.09);
  }
  .approval-tab{
    display: flex;
    width: 347px;
    margin-top: 10px;
    &-item{
      display: flex;
      align-items: center;
      justify-content: center;
      width: 90px;
      height: 40px;
      background: #FFFFFF;
      box-shadow: 0 0 10px 0 rgba(0,0,0,0.09);
      border-radius: 4px 4px 0 0;
      font-size: 14px;
      font-weight: bold;
      color: #666666;
      margin-right: 10px;
    }
    &-item-active{
      position: relative;
      background-color: #fff;
      &:after{
        width: 64px;
        height: 3px;
        content: '';
        background: #10AC64;
        border-radius: 3px;
        position: absolute;
        bottom: 0;
        left: 13px;
        z-index: 10;
      }
    }
  }
  .approval-filter{
    display: flex;
    height: 40px;
    border-bottom: 1px solid #E6E6E6;
    align-items: center;
    justify-content: space-between;
    position: relative;
    &-item{
      display: flex;
      align-items: center;
      font-size: 12px;
      font-weight: 400;
      color: #999999;
      margin-right: 24px;
    }
    &-left{
      display: flex;
      align-items: center;
    }
    &-right{
      display: flex;
      background: #F3F3F3;
      border-radius: 18px;
      ::v-deep {
        .van-search{
          padding: 0;
          background-color: transparent;
        }
        .van-search__content{
          width: 100px;
          height: 24px;
          background: #F3F3F3;
          border-radius: 18px;
        }
        .van-field__control{
          background-color: #F3F3F3;
          border-radius: 18px;
        }
        .van-cell{
          padding: 0;
        }
        .van-search__action{
          margin-left: 10px;
          padding: 0;
        }
      }
      .search-btn{
        width: 34px;
        height: 20px;
        line-height: 20px;
        background: #19BE6B;
        border-radius: 10px;
        font-size: 11px;
        font-weight: 400;
        color: #FFFFFF;
      }
    }
    .filter-icon{
      display: inline-block;
      width: 20px;
      height: 20px;
    }
  }
  .approval-box{
    &-item{
      height: 103px;
      padding-left: 13px;
      text-align: left;
      border-bottom: 1px solid #E6E6E6;
      h5{
        font-size: 15px;
        font-weight: 400;
        color: #000000;
        margin-top: 13px;
        margin-bottom: 10px;

        span{
          color:#D0021B;
        }
      }
      p{
        font-size: 12px;
        font-weight: 400;
        color: #333333;
        line-height: 20px;
      }
    }
  }
</style>
