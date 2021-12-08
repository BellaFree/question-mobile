<template>
  <div class="select_shop_wrap">
    <van-overlay :show="show" :lock-scroll="false">
      <div class="select_shop">
        <!-- 头部 start -->
        <div class="select_shop_header">
          <van-search v-model="searchName" shape="round" placeholder="搜索" @search="searchEnter" />
          <div class="address_text" @click="handleSelectSite">
            {{ siteName }}
          </div>
        </div>
        <!-- 头部 end -->

        <div
          v-show="userStoreMappingVo && userStoreMappingVo.length && cascaderValue"
          class="select_shop_body">
          <div class="select_shop_body_info">
            请先选择执行人，再选择派遣门店
          </div>
          <ul class="select_shop_approve">
            <li
              v-for="(user, uIndex) in userStoreMappingVo"
              :key="user.userNo"
              :class="uIndex === userIndex ? 'select_shop_approve_active' : ''"
              @click="handleSelectUser(uIndex)">
              <div class="head">
                {{ nameFilter(user.userName) }}
              </div>
            </li>
          </ul>
          <van-tabs
            ref="shopTabs"
            v-model="shopListAcitve"
            class="select_shop_tabs"
            line-width="70px"
            @change="changeShopList">
            <van-tab title-class="select_shop_tab" title="未选门店">
              <van-checkbox-group v-model="unChecked[userIndex]" class="select_shop_items">
                <van-checkbox
                  v-for="item in searchShop || unCheckShop"
                  :key="item.storeNo"
                  class="select_shop_item"
                  shape="square"
                  :name="item.storeNo">
                  <div class="select_shop_item_cover" />
                  <div class="select_shop_item_info">
                    <div class="select_shop_item_info_title">
                      {{ item.storeName }}
                    </div>
                    <div class="select_shop_item_info_site">
                      <van-icon name="location-o" size="10px" />
                      {{ item.storeAddress }}
                    </div>
                  </div>
                </van-checkbox>
              </van-checkbox-group>
            </van-tab>
            <van-tab title-class="select_shop_tab" title="已选门店">
              <van-checkbox-group v-model="checkShop[userIndex]" class="select_shop_items">
                <van-checkbox
                  v-for="item in checked[userIndex]"
                  :key="item.storeNo"
                  class="select_shop_item"
                  shape="square"
                  :name="item.storeNo">
                  <div class="select_shop_item_cover" />
                  <div class="select_shop_item_info">
                    <div class="select_shop_item_info_title">
                      {{ item.storeName }}
                    </div>
                    <div class="select_shop_item_info_site">
                      <van-icon name="location-o" size="10px" />
                      {{ item.storeAddress }}
                    </div>
                  </div>
                </van-checkbox>
              </van-checkbox-group>
            </van-tab>
          </van-tabs>
        </div>
      </div>
    </van-overlay>
    <van-popup v-model="selectShopOrgShow" round position="bottom" @close="handleSelectSiteClose">
      <van-cascader
        v-model="cascaderValue"
        class="cascader_shop_org"
        title="请选择组织"
        :options="shopOrgList"
        :field-names="fieldNames"
        @change="handleSelectSiteChange"
        @close="handleSelectSiteClose" />
    </van-popup>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import http from '../../../../api/createTaskApi';
import Utils from '../../../utils/utilsTask';
import { nameFilter } from '../../../utils/index';
import iconShopSelect from '../../../../public/img/create_task/icon_shop_select.png';
export default {
  props: { componentSelectShop: { type: Object } },
  data() {
    return {
      // 图片集合
      img: { iconShopSelect, },
      // van-overlay 显隐
      show: false,
      // 选择组织窗口显隐
      selectShopOrgShow: false,
      // 搜索内容
      searchName: '',
      // 显示组织名字(搜索框下)
      siteName: '请选择组织',
      // 未选门店/已选门店 tabIndex标识
      shopListAcitve: 0,
      // 执行人
      users: [],
      userStoreMappingVo: [],
      // 显示未选门店列表
      searchShop: null,
      unCheckShop: [],
      // 选择门店的详细数据
      checkShop: [[]],
      // 未选门店id选择集合
      unChecked: [[]],
      // 选择的门店id集合
      checked: [],
      // 当前选择的执行人下标
      userIndex: 0,
      // 登录人userNo
      userNo: '',
      // 当前选择的门店的storeNo
      cascaderValue: '',
      fieldNames: {
        text: 'orgName',
        value: 'orgId',
        children: 'childOrg'
      },
      // 门店数据列表
      shopOrgList: [],
      // 当前选择的门店数据
      shopOrgChecked: null,
    };
  },
  async created() {
    this.userNo = this.userInfo.tuid;
    this.$notice.$emit('navigation', { title: '选择门店' });
    this.shopOrgList = await this.getDicosStoreOrgList();
  },
  computed: { ...mapGetters(['userInfo']) },
  methods: {
    nameFilter,
    /**
     * @description: 未选\已选标签切换
     */
    changeShopList(tabIndex) {
      switch (tabIndex) {
        // 未选时
        case 0: {
          this.removeSelectedShop();
          break;
        }
        // 已选时
        case 1: {
          let { userIndex } = this;
          if (!this.checked[userIndex]) {
            this.checked[userIndex] = [];
          }
          if (!this.checkShop[userIndex]) {
            this.checkShop[userIndex] = [];
          }
          if (!this.unChecked[userIndex]) {
            this.unChecked[userIndex] = [];
          }
          // 保存未选门店中选择的门店
          this.unChecked[userIndex].forEach(item => {
            this.unCheckShop.forEach(item1 => {
              if (item === item1.storeNo) {
                this.checkShop[userIndex].push(item);
                this.checked[userIndex].push(item1);
              }
            });
          });
          break;
        }
      }
      this.filterSelectedShop();
    },
    /**
     * @description:根据用户获取组织架构
     * @return {*}
     */
    async getDicosStoreOrgList() {
      let result = await http.getDicosStoreOrgList({ userNo: this.userNo });
      result = this.removeChildOrgLengthToNull(result);
      return result;
    },
    /**
     * @description: 获取店铺列表
     * @return {*}
     */
    async getDicosStoreList() {
      let { orgId } = this.shopOrgChecked;
      let searchStr = this.searchName;
      return await http.getDicosStoreList({ orgId, searchStr });
    },
    handleSelectUser(index) {
      this.userIndex = index;
      console.log(this.userIndex);
    },
    /**
     * @description: 选择组织
     * @param {*}
     * @return {*}
     */
    handleSelectSite() {
      // this.cascaderValue = '';
      this.selectShopOrgShow = true;
    },
    /**
     * @description: 选择组织关闭窗口触发
     * @param {*}
     * @return {*}
     */
    async handleSelectSiteClose() {
      this.selectShopOrgShow = false;
      if (this.shopOrgChecked) {
        this.siteName = this.shopOrgChecked.orgName;
        this.unCheckShop = await this.getDicosStoreList();
        this.$refs.shopTabs.resize();
      }
    },
    /**
     * @description: 组织选择改变时
     */
    handleSelectSiteChange(e) {
      let { selectedOptions } = e;
      this.shopOrgChecked = selectedOptions = selectedOptions.pop();
    },
    /**
     * @description: 去除已选门店重复数据
     */
    filterSelectedShop() {
      let { userIndex } = this;
      let checkedData = Utils.cloneDeep(this.checked[userIndex]);
      let checkShop = Utils.cloneDeep(this.checkShop[userIndex]);
      checkedData.forEach((item, index) => {
        for (let i = checkedData.length - 1; i > index; i--) {
          if (item.storeNo === checkedData[i].storeNo) {
            checkedData.splice(i, 1);
          }
        }
      });
      checkShop.forEach((item, index) => {
        for (let i = checkShop.length - 1; i > index; i--) {
          if (item === checkShop[i]) {
            checkShop.splice(i, 1);
          }
        }
      });
      this.checked[userIndex] = checkedData;
      this.checkShop[userIndex] = checkShop;
    },
    /**
     * @description: 删除已取消的门店
     */
    removeSelectedShop() {
      let { userIndex } = this;
      let checkedData = Utils.cloneDeep(this.checked[userIndex]);
      let unCheckedData = Utils.cloneDeep(this.unChecked[userIndex]);
      let checkShop = Utils.cloneDeep(this.checkShop[userIndex]);
      checkedData = checkedData.filter(item => {
        let is = false;
        for (let i = 0; i < checkShop.length; i++) {
          if (item.storeNo === checkShop[i]) {
            is = true;
            break;
          }
        }
        return is;
      });
      unCheckedData = unCheckedData.filter(item => {
        let is = false;
        for (let i = 0; i < checkShop.length; i++) {
          console.log(item, checkShop[i]);
          if (item === checkShop[i]) {
            is = true;
            break;
          }
        }
        return is;
      });
      this.checked[userIndex] = checkedData;
      this.unChecked[userIndex] = unCheckedData;
    },
    /**
     * @Description:把组织列表childOrg下级没有的设为null
     * @param {array} data 组织列表数据
     * @return {*}
     */
    removeChildOrgLengthToNull(data) {
      data.map(item => {
        if (item.childOrg.length) {
          item.childOrg = this.removeChildOrgLengthToNull(item.childOrg);
        } else {
          delete item.childOrg;
        }
      });
      return data;
    },
    searchBlurShop(str) {
      let shop = Utils.cloneDeep(this.unCheckShop);
      shop = shop.filter(item => {
        let is = false;
        if (item.storeName.indexOf(str) !== -1 || item.storeAddress.indexOf(str) !== -1) {
          is = true;
        }
        return is;
      });
      return shop;
    },
    searchEnter() {
      if (this.searchName === '') {
        this.searchShop = null;
      } else {
        this.searchShop = this.searchBlurShop(this.searchName);
      }
    }
  },

  watch: {
    componentSelectShop(data) {
      data = Utils.cloneDeep(data);
      this.show = data.show;

      if (data.show) {
        data.userStoreMappingVo.map(item => {
          if (!item.storeList) {
            item.storeList = [];
          }
        });
        this.userStoreMappingVo = data.userStoreMappingVo;
        return;
      }

      if (!this.cascaderValue) {
        return this.$emit('closeSelectShop', null);
      }

      let userStoreMappingVo = Utils.cloneDeep(this.userStoreMappingVo);
      // 把门店放到执行人下
      userStoreMappingVo.map((item, itemIndex) => {
        if (this.checked[itemIndex]) {
          item.storeList = [...this.checked[itemIndex]];
        }
      });
      // 去除重复门店
      userStoreMappingVo.map((item) => {
        let { storeList } = item;
        storeList && storeList.forEach((item1, itemIndex1) => {
          for (let i = storeList.length - 1; i > itemIndex1; i--) {
            if (item1.storeNo === storeList[i].storeNo) {
              storeList.splice(i, 1);
            }
          }
        });
        item.storeList = storeList;
      });
      this.$emit('closeSelectShop', userStoreMappingVo);
    }
  }
};
</script>

<style lang="scss">
$mainColor: #0A9B58;
.select_shop_wrap {
  position: relative;
  .select_shop {
    padding-top:50px;
    padding-bottom: 84px;
    width: 100%;
    height: calc(100vh - 50px - 84px);
    background: #fafafa;
    overflow-y: auto;
    .select_shop_header  {
      box-shadow: 0px 2px 3px 0px rgba(0,0,0,0.06);
      background: #fff;
      .address_text {
        display: flex;
        padding-bottom: 10px;
        justify-content: center;
        align-items: center;
        color: #6B6B6B;
        font-size: 15px;
        font-weight: bold;
        &::after {
          position: relative;
          top: 50%;
          margin-left: 5px;
          display: block;
          content: '';
          width: 0;
          height: 0;
          border-width: 6px;
          border-style: solid;
          border-color: #6B6B6B transparent transparent transparent;
          transform: translateY(4px);
        }
      }
    }
  }
  .select_shop_body {
    .select_shop_body_info {
      padding: 12px;
      color: #495060;
      font-size: 14px;
      font-weight: bold;
    }
    .select_shop_approve {
      position: relative;
      display: flex;
      margin: 0 10px;
      padding: 14px 17px 30px;
      background: #fff;
      box-shadow: 0px 2px 5px 2px rgba(0,0,0,0.03);
      border-radius: 5px;
      overflow-x: auto;
      > li {
        flex-shrink: 0;
        position: relative;
        display: flex;
        margin-right: 10px;
        justify-content: center;
        align-items: center;
        width: 40px;
        height: 40px;
        color: #fff;
        background: $mainColor;
        border-radius: 50%;
        &::after {
          position: absolute;
          top: -5px;
          left: 50%;
          display: none;
          content: '';
          width: 51px;
          height: 63px;
          background: url('../../../../public/img/create_task/icon_shop_select_approve.png');
          background-size: cover;
          transform: translate(-50%);
        }
        &.select_shop_approve_active {
          &::after {
            display: block;
          }
        }
      }
    }
    .select_shop_tabs {
      background: transparent;
      .van-tabs__wrap {
        overflow: auto;
      }
      .select_shop_tab {
        z-index:10;
        color: #3A3A3A;
        font-size: 15px;
        font-weight: bold;
      }
      .van-tabs__nav {
        background: transparent;
      }
      .van-tabs__line {
        bottom: 26px;
        height: 10px;
        background: linear-gradient(270deg, rgba(200, 223, 64, 0.6) 0%, #0A9B58 100%);
        border-radius: 5px;
      }
      .van-tabs__content {
        .van-tab__pane {
          // height: 300px;
          // overflow: scroll;
        }
      }
    }
    .select_shop_items {
      position: relative;
      height: calc(100vh - 50px - 84px - 80px - 84px - 20px);
      overflow: auto;
      .select_shop_item {
        position: relative;
        margin: 10px;
        padding: 10px;
        min-height: 30px;
        border-radius: 5px;
        box-shadow: 0px 2px 5px 2px rgba(0,0,0,0.03);
        .van-checkbox__icon--square {
          .van-icon {
            border: 0;
          }
          &.van-checkbox__icon--checked {
            .van-icon-success {
              background: url('../../../../public/img/create_task/icon_shop_select.png');
              background-size: cover;
            }
          }
          .van-icon-success {
            position: absolute;
            top: 0;
            right: 0;
            display: block;
            width: 26px;
            height: 26px;
            &::before {
              content: '';
            }
          }
        }
        .van-checkbox__label {
          position: relative;
          display: flex;
          justify-content: space-between;

        }
        .select_shop_item_cover {
          margin-right: 10px;
          flex-shrink: 0;
          width: 100px;
          height: 68px;
          border-radius: 5px;
          background: #999;
        }
        .select_shop_item_info {
          text-align: left;
          .select_shop_item_info_title {
            margin-bottom: 10px;
            color: #424242;
            font-size: 15px;
            font-weight: bold;
          }
          .select_shop_item_info_site {
            color: #999999;
            font-size: 13px;
          }
        }
      }
    }
  }
  .cascader_shop_org {
    .van-cascader__tabs {
      .van-tabs__wrap {
        .van-tabs__nav {
          .van-cascader__tab {
            flex: 0 0 auto;
          }
        }
      }
    }
  }
}
</style>
