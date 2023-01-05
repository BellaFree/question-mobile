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
        <div class='approval-filter-top'>
          <div class="approval-filter-left">
            <div class="approval-filter-item" @click="showStatusPicker">
              {{ approveStatus ? approveStatus['name']: '审批状态' }}
              <svg-icon icon-class="sanjiao" class-name="filter-icon" />
            </div>
            <div class="approval-filter-item" @click="showCityPicker">
              {{ cityName ? cityName : '城市' }}
              <svg-icon icon-class="sanjiao" class-name="filter-icon" />
            </div>
          </div>
          <div class="approval-filter-right" @click="showSearchKey = true">
            <van-icon name="search" size="20" />
          </div>
        </div>
        <div v-if="showSearchKey" class="approval-filter-bottom">
          <van-search
            v-model="searchKey"
            show-action
            class="approval-filter-key"
            left-icon=""
            placeholder="请输入搜索关键词"
            clearable>
            <template #action>
              <div class="search-btn">搜索</div>
            </template>
          </van-search>
          <span class="clearable" @click="showSearchKey = false">取消</span>
        </div>
      </div>
      <div class="approval-box">
        <div
          v-for="item of list"
          :key="item.id"
          class="approval-box-item"
          @click="redirectDetail(item)">
          <h5>{{ item.approveName }} <span :style="approveStatusFun(item.approveStatus)">({{ item.approveStatus | approveStatusTxt }})</span></h5>
          <p>基盘名称：{{ item.bpName }}</p>
          <p>申请时间：{{ item.createTime }}</p>
          <p>城市：{{ item.provinceName }}{{ item.cityName }}{{ item.districtName }}</p>
        </div>
      </div>
    </div>
    <!--审批状态 -->
    <van-popup v-model="dialogStatusPickerVisible" round position="bottom">
      <van-picker
        title="审批状态"
        show-toolbar
        :columns="statusPickerColumn"
        @confirm="onConfirm"
        @cancel="showStatusPicker">
        <template #option="option">
          {{ option.name }}
        </template>
      </van-picker>
    </van-popup>
    <!--城市 -->
    <van-popup v-model="dialogCityPickerVisible" round position="bottom">
      <van-cascader
        v-model="city"
        title="城市"
        :options="cityPickerColumn"
        :field-names="{ text: 'name', value: 'regionCode', children: 'children' }"
        class="dicos-van-tab"
        @close="dialogCityPickerVisible = false"
        @finish="cityChange" />
    </van-popup>
  </div>
</template>s

<script>
import approveApi from '@api/approve_api';
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
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')) || '',
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
      statusPickerColumn: [],
      approveStatus: '-1',
      dialogCityPickerVisible: false,
      cityPickerColumn: [],
      city: '',
      cityName: '',
      searchKey: '',
      showSearchKey: false,
      list: []
    };
  },
  filters: {
    approveStatusTxt(val) {
      const map = { 0: '已撤销', 1: '待审批', 2: '审批通过', 3: '驳回' };
      return map[val];
    }
  },
  mounted() {
    this.getBaseData();
    this.getList();
  },
  methods: {
    approveStatusFun(val) {
      let styleMap = {
        0: '#19BE6B',
        1: '#F5A623',
        2: '#19BE6B',
        3: '#D0021B'

      };
      return {
        ...styleMap,
        fontSize: '15px',
        fontWeight: '400',
      };
    },
    chooseThisType(code) {
      this.currentViewTabCode = code;
    },
    showStatusPicker() {
      this.dialogStatusPickerVisible = !this.dialogStatusPickerVisible;
    },
    showCityPicker() {
      this.dialogCityPickerVisible = !this.dialogCityPickerVisible;
    },
    /**
     * 获取基础数据
     */
    getBaseData() {
      approveApi.getApproveStatus()
        .then(res => {
          if (res.code === 200) {
            this.statusPickerColumn = res.data;
          }
        });

      approveApi.getApproveCity()
        .then(res => {
          if (res.code === 200) {
            this.cityPickerColumn = this.handlerCityData(res.data);
          }
        });
    },
    // 城市数据处理
    handlerCityData(data) {
      for (let item of data) {
        if (item.children && item.children.length > 0) {
          this.handlerCityData(item.children);
        } else {
          delete item.children;
        }
      }
      return data;
    },
    // 获取审批数据
    getList() {
      approveApi.getApproveList({
        approveStatus: this.approveStatus,
        cityCodes: [],
        name: this.searchKey,
        type: this.currentViewTabCode,
        userId: this.userInfo && this.userInfo.tuId
      })
        .then(res => {
          console.info(res);
          if (res.code === 200) {
            this.list = res.data;
          }
        });
    },
    // 选取城市
    cityChange(val) {
      console.info(val);
      this.cityName = val['selectedOptions'][val['tabIndex']]['name'];
      this.showCityPicker();
      this.getList();
    },
    onConfirm(value) {
      this.showStatusPicker();
      this.getList();
      this.approveStatus = value;
    },
    // 跳转至审批基盘详情
    redirectDetail(item) {
      console.info(item);
      // todo 待
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
    border-bottom: 1px solid #E6E6E6;
    position: relative;
    flex-direction: column;
    .approval-filter-top{
      display: flex;
      height: 40px;
      justify-content: space-between;
    }
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
      align-items: center;
      padding-right: 10px;
    }
    .filter-icon{
      display: inline-block;
      width: 20px;
      height: 20px;
    }
    .approval-filter-bottom{
      display: flex;
      align-items: center;
      padding-bottom: 9px;
      .approval-filter-key{
        background: #F3F3F3 !important;
        border-radius: 18px;
      }
      ::v-deep {
        .van-search{
          padding: 0;
          background-color: transparent;
        }
        .van-search__content{
          width: 230px;
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
        line-height: 21px;
        background: #19BE6B;
        border-radius: 10px;
        font-size: 11px;
        font-weight: 400;
        color: #FFFFFF;
        margin-right: 3px;
      }
      .clearable{
        font-size: 12px;
        font-weight: 400;
        color: #666666;
        margin-left: 15px;
      }
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
  .dicos-van-tab{
    line-height: normal;
    ::v-deep{
      .van-tab{
        line-height: normal;
        flex: 0 0 33%;
      }
    }
  }
</style>
