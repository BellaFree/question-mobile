<template>
  <div class="select_approve_wrap">
    <van-overlay :show="overlayShow">
      <div class="select_approve">
        <van-search
          v-model="searchName"
          shape="round"
          placeholder="搜索"
          @search="inputSearchChange"
        />
        <div class="search_bottom_title">工作角色</div>
        <van-cell-group :class="{'select_approve_user_group': true, 'select_approve_user_group_tier': currenType === 'organize', 'select_approve_user_group_user':  currenType === 'executor'} ">
          <van-checkbox-group v-model="checkboxTier" ref="checkboxGroup" @change="handleCheckbox">
            <template v-for="(tier, tierIndex) in organizeViewData">
              <van-cell :key="tier.userOrgNo">
                <!--    组织类型显示    -->
                <van-checkbox v-if="tier.userOrgNo" class="select_approve_organize_checkbox" :name="tier.userOrgNo + '_' + tier.userOrgName + '_' + '1'">{{tier.userOrgName}}</van-checkbox>
                <!--    担当类型显示    -->
                <van-checkbox v-if="tier.userNo" class="select_approve_user_checkbox" :name="tier.userNo + '_' + tier.userName+ '_' + '0'">
                  <div class="select_approve_user_head">
                    <template>
                      <div class="select_approve_user_head_text">{{nameFilter(tier.userName)}}</div>
                    </template>
                  </div>
                  <div class="select_approve_user_name">
                    <div class="saun_name">{{tier.userName}}</div>
                    <div class="saun_admin">管理员</div>
                  </div>
                </van-checkbox>
                <!-- 下级触发 -->
                <div v-if="tier.childUserOrg && tier.childUserOrg.length || tier.userList" class="select_approve_user_button_box">
                  <van-button @click="handleTierNext(tier, tierIndex)" class="select_approve_user_button" :icon="icon.iconSubordinate" plain type="primary">下级</van-button>
                </div>
              </van-cell>
            </template>
          </van-checkbox-group>
        </van-cell-group>
      </div>
    </van-overlay>
    <div class="handle_confirm_box">
      <div class="handle_confirm_flex">
        <div class="handle_number_people">已选择：{{footerView}}</div>
        <van-button class="handle_confirm" @click="handleConfirm">确定</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import iconSubordinate from '../../../../public/img/create_task/icon_subordinate.png';
import http from '../../../../api/createTaskApi';
import Utils from '../../../utils/utilsTask';

import mockData from "./mockData";
// 名称处理函数
import {nameFilter} from '@/utils'
// vuex
import {mapGetters} from 'vuex'
export default {
 data() {
    return {
      icon: { iconSubordinate },
      // 遮罩显隐控制
      overlayShow: true,
      // 检索关键字
      searchName: '',
      // 选中的组织
      checkboxTier: [],
      // 组织基础数据
      organizeData: [],
      // 组织展示数据
      organizeViewData: [],
      // 组织 下钻 层级
      organizeLevel: 0,
      // 当前视图 类型 组织/当担列表 默认组织：organize 当担：executor
      currenType: 'organize',
      // 底部显示
      footerView: ''
    };
  },
  computed: {
    ...mapGetters('User', ['userId'])
  },
  watch: {
    async componentData(data) {
      if (data.show) {
        this.show = true;
        data = Utils.cloneDeep(data);
        this.users = await http.getDicosUserList();
      }
    },
    approveTier() {
      if (this.tierIndex) {
        this.returnToPreviousTier();
      } else {
        this.show = false;
        this.$emit('closeSelectApprove', {});
      }
    }
  },
  async mounted() {
    this.organizeData = mockData.user;
    this.organizeViewData = this.organizeData
    this.$notice.$on('getOrganizeLevel', this.levelMaintain)
    this.users = await http.getDicosUserList({
      userNo: 'YC201007140770'
    });
  },
  destroyed() {
    this.$notice.$off('getOrganizeLevel', this.levelMaintain)
  },
  methods: {
    nameFilter,
    // 检索 关键字 对应的 担当
    inputSearchChange(e) {
      console.info(e)
      if(!this.searchName) {return}
      let result = this.filterDataByName(this.organizeData, this.searchName,[])
      this.organizeLevel = 0
      this.organizeViewData = result
    },
    //checkBox change
    handleCheckbox() {
      if(this.checkboxTier.length > 1){
        this.checkboxTier.splice(this.checkboxTier.length-2 ,1)
      }
      this.footerView = this.checkboxTier && this.checkboxTier.length > 0 && Utils.cloneDeep(this.checkboxTier[0]).split("_")[1]
    },
    // 层级维护
    levelMaintain() {
      this.organizeLevel --
      if( this.organizeLevel <=0 || !this.$parent.organizeShow ){
        this.organizeLevel = 0
        if(this.$parent.organizeShow){
          this.handleConfirm()
        }else{
          this.$notice.$off('getOrganizeLevel', this.levelMaintain)
          this.$router.push(this.$attrs.backUrl)
        }
      } else{
        this.navLeft()
      }
    },
    // 回退
    navLeft() {
      let parentID = this.organizeViewData && this.organizeViewData[0]['parentId']
      let findData = parentID && this.filterData(parentID, this.organizeData)
      let parentData = findData.parentId && this.filterData(findData.parentId, this.organizeData)
      // 如果其父节点存在 多个同级别节点 获取其 grandfather的子集
      if(parentData && parentData.childUserOrg && parentData.childUserOrg.length >1) {
        this.organizeViewData = parentData.childUserOrg
      } else{
        this.organizeViewData = [findData]
      }
      this.currenType = 'organize'
    },
    // 下钻
    handleTierNext(tier) {
      this.organizeLevel ++
      if(tier.childUserOrg && tier.childUserOrg.length > 0) {
        this.organizeViewData = tier.childUserOrg
      } else{
        this.organizeViewData = tier.userList && Array.isArray(tier.userList) && tier.userList
        this.currenType = 'executor'
      }
    },
    // 根据节点ID 返回数据
    filterData(id, organizeData) {
      for(let item of organizeData){
        if(item.userOrgNo === id) {
          return item
        }
        if(item.childUserOrg && item.childUserOrg.length > 0) {
          return this.filterData(id, item.childUserOrg)
        }
      }
    },
    // 根据节点名称 返回数据
    filterDataByName(data, key, result) {
      for(let item of data){
        let itemName =item.userOrgName ? item.userOrgName : item.userName
        let childrenData = item.childUserOrg && item.childUserOrg.length > 0 ? item.childUserOrg : item.userList
        if(itemName.includes(key)) {
          result.push(item)
        }
        if(childrenData && childrenData.length > 0) {
            this.filterDataByName(childrenData, key, result)
        }
      }
      return  result
    },
    // 确认
    handleConfirm() {
      let result = this.checkboxTier&& this.checkboxTier.length > 0 && this.checkboxTier[0].split('_')
      this.$emit('closeSelectApprove', {
        id: result[0],
        name: result[1],
        type: result[2]
      })
    }
  }
};
</script>

<style lang="scss" scoped>
$mainColor: #0A9B58;
.select_approve_wrap {
  position: relative;
  .select_approve {
    padding-top:50px;
    padding-bottom: 84px;
    width: 100%;
    height: calc(100vh - 50px - 84px);
    background: #fff;
    overflow-y: auto;
    .search_bottom_title {
      padding: 6px 0 10px;
      padding-left: 14px;
      color: #424242;
      font-size: 15px;
      font-weight: bold;
      text-align: left;
    }
    .select_approve_user_group {
      border-top: 10px solid #fafafa;
      .van-cell {
        height: 50px;
        box-sizing: border-box;
        .van-cell__value {
          padding: 5px 0;
          box-sizing: border-box;
        }
      }
      &.select_approve_user_group_all {
        .van-cell {
          .van-cell__value {
            .van-checkbox {
              ::v-deep .van-checkbox__label {
                font-size: 15px;
                font-weight: bold;
              }
            }
          }
        }
      }
      &.select_approve_user_group_tier {
        .van-cell {
          padding: 0 16px 0;
          .van-cell__value {
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 50px;
          }
        }
      }
      &.select_approve_user_group_user {
        .van-checkbox-group {
          .van-cell {
            padding: 0 16px;
            height: auto;
            .van-cell__value {
              padding: 0;
            }
          }
        }
      }
      .select_approve_organize_checkbox {
        flex-grow: 1;
      }
      .select_approve_user_checkbox {
        height: 60px;
        ::v-deep .van-checkbox__icon {

        }
        ::v-deep .van-checkbox__label {
          display: flex;
          align-items: center;
          height: 100%;
        }
        .select_approve_user_head {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-left: 4px;
          margin-right: 10px;
          width: 46px;
          height: 46px;
          color: #fff;
          font-size: 15px;
          background: $mainColor;
          border-radius: 50%;
          .select_approve_user_head_text {
            width: 100%;
            flex-shrink: 1;
            white-space: nowrap;
            text-align: center;
          }
        }
        .select_approve_user_name {
          .saun_name {
            color: #3A3A3A;
            font-size: 15px;
          }
          .saun_admin {
            color: #A9A9A9;
            font-size: 12px;
          }
        }
      }
      .select_approve_user_button_box {
        display: flex;
        align-items: center;
        border-left: 1px solid #DDDEE1;
        height: 27px;
        .select_approve_user_button {
          padding: 0 5px;
          height: 27px;
          line-height: 27px;
          color: $mainColor;
          font-size: 14px;
          border: 0;
          box-sizing: border-box;
          .van-button__content {
            .van-button__icon {
              margin-right: 10px;
              position: relative;
              width: 18px;
              height: 100%;
              img {
                position: absolute;
                top:5px;
                width: 18px;
                height: 17px;
              }
            }
          }
        }
      }
    }
  }
  .handle_confirm_box {
    z-index: 10;
    position: fixed;
    padding-top: 5px;
    padding-bottom: 35px;
    left: 0;
    bottom: 0;
    width: 100%;
    box-shadow: 0px -2px 5px 0px rgba(0,0,0,0.06);
    background: #fff;
    .handle_confirm_flex {
      padding: 0 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .handle_number_people {
        color: $mainColor;
        font-size: 14px;
        font-weight: bold;
      }
      .handle_confirm {
        width: 130px;
        height: 41px;
        color: #fff;
        font-size: 16px;
        font-weight: bold;
        background: linear-gradient(180deg, #7ACC2C 0%, #0A9B58 100%);
        border-radius: 9px;
      }
    }
  }
}
</style>
