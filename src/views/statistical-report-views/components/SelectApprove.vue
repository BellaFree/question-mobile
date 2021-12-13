<template>
  <div class="select_approve_wrap">
    <van-overlay :show="overlayShow" :lock-scroll="false">
      <div class="select_approve">
        <van-search
          v-model="searchName"
          shape="round"
          placeholder="搜索"
          @search="inputSearchChange"
          @clear="clearSearch"
        />
        <div class="search_bottom_title">工作角色</div>
        <!--    组织类型显示    -->
        <van-cell-group class="select_approve_user_group select_approve_user_group_tier">
          <van-checkbox-group v-model="checkboxTier" ref="checkboxGroup" @change="handleCheckbox">
            <template v-for="(tier, tierIndex) in organizeViewData.childUserOrg" >
              <van-cell :key="tier.userOrgNo">
                <van-checkbox :key="tier.userOrgNo" class="select_approve_organize_checkbox" :name="tier.userOrgNo + '_' + tier.userOrgName + '_' + '1'">{{tier.userOrgName}}</van-checkbox>
                <!-- 下级触发 -->
                <div v-if="tier.childUserOrg && tier.childUserOrg.length || tier.userList" class="select_approve_user_button_box">
                  <van-button @click="handleTierNext(tier, tierIndex)" class="select_approve_user_button" :icon="icon.iconSubordinate" plain type="primary">下级</van-button>
                </div>
              </van-cell>
            </template>
          </van-checkbox-group>
        </van-cell-group>
        <!--    人员类型    -->
        <van-cell-group class="select_approve_user_group select_approve_user_group_user">
          <van-checkbox-group v-model="checkboxTier" ref="checkboxGroup" @change="handleCheckbox()">
            <template v-for="userItem in organizeViewData.userList" >
              <van-cell :key="userItem.userNo">
                <van-checkbox :key="userItem.userNo" class="select_approve_user_checkbox" :name="userItem.userNo + '_' + userItem.userName+ '_' + '0'+'_'+ organizeViewData.userOrgNo">
                  <div class="select_approve_user_head">
                    <template>
                      <div class="select_approve_user_head_text">{{nameFilter(userItem.userName)}}</div>
                    </template>
                  </div>
                  <div class="select_approve_user_name">
                    <div class="saun_name">{{userItem.userName}}</div>
                    <div class="saun_admin">管理员</div>
                  </div>
                </van-checkbox>
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
      //选中的组织id
      userOrgNo:'',
      // 组织 下钻 层级
      organizeLevel: 0,
      // 当前视图 类型 组织/当担列表 默认组织：organize 当担：executor
      currenType: 'organize',
      // 底部显示
      footerView: '',
    };
  },
  computed: {
    ...mapGetters(['userId', 'userName', 'userInfo'])
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
    this.$notice.$on('getOrganizeLevel', this.levelMaintain)
    await this.getUserData()
  },
  destroyed() {
    this.$notice.$off('getOrganizeLevel', this.levelMaintain)
  },
  methods: {
    nameFilter,
    // 获取执行人组织数据
    async getUserData() {
      this.organizeData = await http.getDicosUserList({
        userNo: this.userId
      })
      this.checkboxTier = [`${this.userId}_${this.userName}_0_${this.userInfo.orgId}`]
      this.organizeViewData = this.organizeData[0]
    },
    // 检索 关键字 对应的 担当
    inputSearchChange(e) {
      if(!this.searchName) {return}
      let result = this.filterDataByName(this.organizeData, this.searchName,[])
      // console.info('检索 关键字 对应的 担当', result)
      // this.organizeLevel = 0
      this.organizeViewData = {
        userList: result ? result : []
      }
    },
    // 清除检索
    clearSearch() {
      this.organizeViewData = this.organizeData[0]
    },
    //checkBox change
    handleCheckbox() {
      this.userOrgNo=Utils.cloneDeep(this.checkboxTier[0]).split("_")[3];
      if(this.checkboxTier.length > 1){
        this.checkboxTier.splice(this.checkboxTier.length-2 ,1)
      }
      this.footerView = this.checkboxTier && this.checkboxTier.length > 0 && Utils.cloneDeep(this.checkboxTier[0]).split("_")[1]
    },
    // 层级维护 回退
    levelMaintain() {
      // console.info('层级维护 回退 start', this.organizeLevel)
      this.organizeLevel --
      // console.info('层级维护 回退 end', this.organizeLevel)
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
      let parentID = this.organizeViewData && this.organizeViewData.parentOrgId
      // console.info('回退时查找其父级ID:',parentID)
      let findData = parentID && this.filterData(parentID, this.organizeData, [])
      this.organizeViewData = findData ? findData[0] : {}
      // console.info(this.organizeViewData )
    },
    // 下钻
    handleTierNext(tier) {
      this.organizeLevel ++
      this.organizeViewData = tier
      this.userOrgNo=tier.userOrgNo

    },
    // 根据节点ID 返回数据
    filterData(id, organizeData, result) {
      for(let item of organizeData){
        if(item.userOrgNo === id) {
          result.push(item)
        }
        if(item.childUserOrg && item.childUserOrg.length > 0) {
           this.filterData(id, item.childUserOrg, result)
        }
      }
      return result
    },
    // 根据节点名称 返回数据
    filterDataByName(data, key, result) {
      for(let item of data){
        let itemName =item.userOrgName ? item.userOrgName : item.userName
        let childrenData = item.childUserOrg && item.childUserOrg.length > 0 ? item.childUserOrg : item.userList
        if(itemName.includes(key)) {
          result.push(item)
        }
        if(item.userList  &&  item.userList.length > 0) {
          for(let userItem of item.userList) {
            if(userItem.userName.includes(key)){
              result.push(userItem)
            }
          }
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
      console.info(result)
      this.$emit('closeSelectApprove', {
        id: result[0],
        name: result[1],
        type: result[2],
        orgId: result[2] === '0' ? result[3] : result[0]
      })
    }
  }
};
</script>

<style lang="scss" scoped>
$mainColor: #0A9B58;
.select_approve_wrap {
  position: relative;
  ::v-deep{
    .van-overlay{
      z-index: 20;
    }
  }
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
