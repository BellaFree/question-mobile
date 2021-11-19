<template>
  <div class="select_approve_wrap">
    <van-overlay :show="show">
      <div class="select_approve">
        <van-search
          v-model="searchName"
          shape="round"
          placeholder="搜索"
          @search="inputSearchChange"
        />
        <div class="search_bottom_title">工作角色</div>
        <van-cell-group class="select_approve_user_group select_approve_user_group_all">
          <van-cell>
            <van-checkbox @click="handleCheckboxAll" v-model="checkboxAll" name="all" :icon-size="checkboxIconSize">全选</van-checkbox>
          </van-cell>
        </van-cell-group>

        <van-cell-group class="select_approve_user_group select_approve_user_group_tier">
          <van-checkbox-group v-model="checkboxTier[tierIndex]" ref="checkboxGroup" @change="handleCheckbox">
            <template v-for="(tier, tierIndex) in users">
              <van-cell :key="tier.userOrgNo">
                <van-checkbox class="select_approve_user_checkbox" :name="tier.userOrgNo">{{tier.userOrgName}}</van-checkbox>
                <div v-if="tier.childUserOrg.length || tier.userList" class="select_approve_user_button_box">
                  <van-button @click="handleTierNext(tier, tierIndex)" class="select_approve_user_button" :icon="icon.iconSubordinate" plain type="primary">下级</van-button>
                </div>
              </van-cell>
            </template>
          </van-checkbox-group>
        </van-cell-group>

        <van-cell-group class="select_approve_user_group select_approve_user_group_user">
          <van-checkbox-group v-model="checkboxUser[tierIndex]" ref="checkboxUserGroup"
            @change="handleCheckboxUser">
            <template v-for="(user, userIndex) in userList">
              <van-cell :key="userIndex">
                <van-checkbox class="select_approve_user_checkbox" :name="user.userNo">
                  <div class="select_approve_user_head">
                    <template>
                      <div class="select_approve_user_head_text">{{nameFilter(user.userName)}}</div>
                    </template>
                  </div>
                  <div class="select_approve_user_name">
                    <div class="saun_name">{{user.userName}}</div>
                    <!-- <div class="saun_admin">管理员</div> -->
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
        <div class="handle_number_people">已选择：{{NumberPeople}}人</div>
        <van-button class="handle_confirm" @click="handleConfirm">确定</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import iconSubordinate from '../../../../public/img/create_task/icon_subordinate.png';
import http from '../../../../api/createTaskApi';
import Utils from '../../../utils/utilsTask';
import { nameFilter } from '../../../utils/index';
export default {
  props: {
    componentData: { type: Object },
    approveTier: { type: Object, }
  },
  data() {
    return {
      // icon集合
      icon: { iconSubordinate },
      // van-overlay显隐
      show: true,
      // 搜索值
      searchName: '',
      // icon大小
      checkboxIconSize: '18px',
      // 显示列表(包括层级、执行人)
      users: [],
      // 显示列表备份使用
      usersBackups: [],
      // 层级当前用户显示列表
      userList: [],
      // 全选状态
      checkboxAll: false,
      // 层级选择集合
      checkboxTier: [],
      // 层级用户选择集合
      checkboxUser: [],
      // 选择的用户数据集合
      checkboxUserData: [],
      // 全部用户数据集合
      checkboxUserAllData: [],
      // 选择的用户id集合
      checkboxedUsers: [],
      // 层级下标
      tierIndex: 0,
      // 层级每层选择当下标
      tierIndexs: [],
      // 层级 全选状态
      tierAll: [],
      // 当前选择人数总数
      numberPeople: 0,
    };
  },
  async created() {
    this.users = await http.getDicosUserList({ userNo:'T0018' });
    this.usersBackups = Utils.cloneDeep(this.users);
  },
  methods: {
    nameFilter,
    /**
     * @description: 进入下级
     * @param {object[]} tier 点击对当前列表
     * @param {number} index 当前列表index
     */
    handleTierNext(tier, index) {
      let { childUserOrg, userList } = tier;
      if (childUserOrg.length || userList) {
        this.users = [];
        this.$nextTick(() => {
          this.users = Utils.cloneDeep(childUserOrg);
          this.userList = Utils.cloneDeep(userList);
        });
        this.tierIndexs.push(index);
        this.tierIndex++;
        this.autoUpdateAllStatus(tier, index);
      }
    },
    /**
     * @description: 返回上级
     */
    returnToPreviousTier() {
      if (this.tierIndex > 0) {
        --this.tierIndex;
        this.tierIndexs.pop();
        let users = Utils.cloneDeep(this.usersBackups);
        let tier = users;
        let userList = null;
        let tierIndexLength = this.tierIndexs.length;
        this.checkboxAll = this.tierAll[this.tierIndex];
        if (tierIndexLength) {
          this.tierIndexs.forEach((item) => {
            tier = tier[item].childUserOrg;
          });

        } else {
          tier = users;
        }
        this.userList = userList;
        this.users = tier;
      }
    },
    /**
     * @description: 点选全选下方复选框
     * @param {*} e
     * @return {*}
     */
    handleCheckbox(e) {
      console.log(e);
      let tier = Utils.cloneDeep(this.users);
      let tierChecked = [];
      tier = tier.filter(item => {
        let is = true;
        e.forEach(item1 => {
          if (item.userOrgNo === item1) {
            tierChecked.push(item);
            is = false;
          }
        });
        return is;
      });

      tier.forEach(item => {
        this.handleCheckboxInsideAll(Utils.cloneDeep(item), this.tierIndex, true);
      });
      tierChecked.forEach(item => {
        this.handleCheckboxInsideAll(Utils.cloneDeep(item), this.tierIndex);
      });
      this.removeRepetitionChecked(this.checkboxTier);
      this.removeRepetitionChecked(this.checkboxUser);
      this.removeRepetitionUserData();
      this.checkedUpdateNowStatus();
    },
    /**
     * @description: 点选全选下方用户复选框
     * @param {*}
     * @return {*}
     */
    handleCheckboxUser(values) {
      let arr = [];
      values.forEach(item => {
        let n  = this.userList.length;
        for (let i = 0; i < n; i++) {
          if (item === this.userList[i].userNo) {
            arr.push(this.userList[i]);
          }
        }
      });
      this.checkboxUserData.push(...arr);
    },
    /**
     * @description: 全选
     * @param {*}
     * @return {*}
     */
    handleCheckboxAll() {
      let is = this.checkboxAll;
      this.$refs.checkboxGroup.toggleAll(is);
      this.$refs.checkboxUserGroup.toggleAll(is);
      this.tierAll[this.tierIndex] = is;
      this.findCheckedAllSubset(Utils.cloneDeep(this.users), this.tierIndex, is);
      this.removeRepetitionChecked(this.checkboxTier);
      this.removeRepetitionChecked(this.checkboxUser);
      this.removeRepetitionUserData();
    },
    /**
     * @description: 改变层级状态时，也改变层级下级的状态
     * @param {*} data
     * @param {*} index
     * @return {*}
     */
    handleCheckboxInsideAll(data, index, status) {
      data = Utils.cloneDeep(data);
      let { childUserOrg, userList } = data;
      let i = index + 1;
      childUserOrg.forEach(item => {
        if (!this.checkboxTier[i]) {
          this.checkboxTier[i] = [];
        }
        if (status) {
          this.removeInclude([item.userOrgNo], this.checkboxTier[i]);
        } else {
          this.checkboxTier[i].push(item.userOrgNo);
        }
        this.handleCheckboxInsideAll(item, i, status);
      });
      if (userList) {
        let userListArr = [];
        let userListDataArr = [];
        userList.forEach(item => {
          userListArr.push(item.userNo);
          userListDataArr.push(item);
        });
        if (!this.checkboxUser[i]) {
          this.checkboxUser[i] = [];
          this.checkboxUser.splice(i, 1, []);
        }
        if (status) {
          let dataCheckboxUser = this.removeInclude(userListArr, this.checkboxUser[i]);
          this.checkboxUser.splice(i, 1, dataCheckboxUser);
        } else {
          this.checkboxUser[i].push(...userListArr);
          this.checkboxUserData.push(...userListDataArr);
        }
      }
    },
    /**
     * @description: 自动更新全选状态
     * @param {*} tier
     * @return {*}
     */
    autoUpdateAllStatus(tier) {
      console.log(tier);
      let { childUserOrg, userList } = tier;
      let isUserChecked = false;
      if (userList && this.checkboxUser[this.tierIndex]) {
        let isItemLength = 0;
        userList.forEach(item => {
          this.checkboxUser[this.tierIndex].forEach(item1 => {
            if (item.userNo === item1) {
              isItemLength++;
            }
          });
        });
        isUserChecked = isItemLength === userList.length;
      }

      if (childUserOrg.length && this.checkboxTier[this.tierIndex]) {
        let isOrgNoLength = 0;
        childUserOrg.forEach(item => {
          this.checkboxTier[this.tierIndex].forEach(item1 => {
            if (item.userOrgNo === item1) {
              isOrgNoLength++;
            }
          });
        });
        isUserChecked = isOrgNoLength === childUserOrg.length;
      }
      this.$nextTick(() => {
        this.tierAll[this.tierIndex] = isUserChecked;
        this.checkboxAll = isUserChecked;
      });
    },
    /**
     * @description: 当前层级 层状态改变时修改全选状态
     * @param {*}
     * @return {*}
     */
    checkedUpdateNowStatus() {
      let nowTier = Utils.cloneDeep(this.users);
      let isCheckedAll = false;
      let tierLength = 0;
      nowTier.forEach(item => {
        if (!this.checkboxTier[this.tierIndex]) {
          this.checkboxTier[this.tierIndex] = [];
        }
        this.checkboxTier[this.tierIndex].forEach(item1 => {
          if (item.userOrgNo === item1) {
            tierLength++;
          }
        });
      });
      isCheckedAll = tierLength === nowTier.length;
      this.tierAll.splice(this.tierIndex, 1, isCheckedAll);
      this.checkboxAll = isCheckedAll;
    },
    /**
     * @description: 查找层级下所有的用户
     * @param {array} data
     * @return {*}
     */
    findTierUsers(data) {
      let users = [];
      console.log(data);
      data.forEach(item => {
        if (item.userList) {
          users.push(...item.userList);
        }
        if (item.childUserOrg.length) {
          let childrenUser = this.findTierUsers(item.childUserOrg);
          if (childrenUser.length) {
            users.push(...childrenUser);
          }
        }
      });
      return Utils.cloneDeep(users);
    },
    /**
     * @description: 全选后下层级
     * @param {*} tierData
     * @param {*} index
     * @param {*} status
     * @return {*}
     */
    findCheckedAllSubset(tierData, index = 0, status) {
      let _tier = [];
      let i = index;
      index++;
      tierData.forEach(item => {
        if (item.userList) {
          let userNo = this.findUserNo(item.userList);
          if (!this.checkboxUser[index]) {
            this.checkboxUser[index] = [];
          }
          if (status) {
            this.checkboxUser[index].push(...userNo);
          } else {
            this.checkboxUser[index] = [];
          }
        }
        if (item.userOrgNo) {
          _tier.push(item.userOrgNo);
        }
        if (item.childUserOrg.length) {
          this.findCheckedAllSubset(item.childUserOrg, index, status);
        }
      });
      if (!this.checkboxTier[i]) {
        this.checkboxTier[i] = [];
      }
      if (status) {
        this.checkboxTier[i].push(..._tier);
      } else {
        this.checkboxTier[i] = [];
      }

    },
    /**
     * @description: 获取用户No
     * @param {array} data
     * @return {array}
     */
    findUserNo(data) {
      let userNo = [];
      data.forEach(item => {
        if (item.userNo) {
          userNo.push(item.userNo);
        }
      });
      return userNo;
    },
    /**
     * @description: 过滤位选中的userData数据
     */
    filterUserData() {
      let checkboxUser = Utils.cloneDeep(this.checkboxUser);
      let checkboxUserData = Utils.cloneDeep(this.checkboxUserData);
      let selectedUserData = [];
      let userNoArr = [];
      checkboxUser.forEach(item => {
        if (item) {
          userNoArr = userNoArr.concat(item);
        }
      });
      userNoArr.forEach(item => {
        for (let i = 0; i < checkboxUserData.length; i++) {
          if (item === checkboxUserData[i].userNo) {
            selectedUserData.push(checkboxUserData[i]);
          }
        }
      });
      return selectedUserData;
    },
    /**
     * @description: 去除重复用户
     * @param {array} data
     * @return {array}
     */
    removeRepetitionUser(data) {
      data = Utils.cloneDeep(data);
      for (let i = 0; i < data.length; i++) {
        for (let n = data.length - 1; n > i; n--) {
          if (data[i].userNo === data[n].userNo) {
            data.splice(n, 1);
          }
        }
      }
      return data;
    },
    /**
     * @description: 删除勾选重复的编号
     * @param {*} data
     * @return {*}
     */
    removeRepetitionChecked(data) {
      console.log(data);
      data.map(item => {
        if (item.length <= 1) {
          return;
        }
        for (let i = 0; i < item.length; i++) {
          for (let s = item.length - 1; s > i; s--) {
            if (item[i] === item[s]) {
              item.splice(s, 1);
            }
          }
        }
        return item;
      });
      return Utils.cloneDeep(data);
    },
    /**
     * @description: 删除userData相同的
     * @param {*}
     * @return {*}
     */
    removeRepetitionUserData() {
      let data = Utils.cloneDeep(this.checkboxUserData);
      data.forEach((item, index) => {
        for (let i = data.length - 1; i > index; i--) {
          if (item.userNo === data[i].userNo) {
            data.splice(i, 1);
          }
        }
      });
      this.checkboxUserData = data;
    },
    /**
     * @description: 删除数据中数组中重复的字段
     * @param {*} includeArray
     * @param {*} data
     * @return {*}
     */
    removeInclude(includeArray, data) {
      includeArray.forEach(item => {
        for (let i = data.length; i >= 0; i--) {
          if (item === data[i]) {
            data.splice(i, 1);
          }
        }
      });
      return data;
    },
    /**
     * @description: 按钮-立即提交
     */
    handleConfirm() {
      let data = this.filterUserData();
      console.info(data);
      this.$emit('closeSelectApprove', Utils.cloneDeep(data));
    },
    // 模糊搜索
    inputDimSearch(searchName, data) {
      if (!data) {
        data = Utils.cloneDeep(this.usersBackups);
      }
      console.log(data);
      let tierData = [];
      let userData = [];
      data.forEach(item => {
        let { childUserOrg, userList } = item;
        if (item.userOrgName.indexOf(searchName) !== -1) {
          tierData.push(item);
        }
        if (userList) {
          userList.forEach(userItem => {
            console.log(userItem.userName, userItem.userName.indexOf(searchName) !== -1);
            if (userItem.userName.indexOf(searchName) !== -1) {
              userData.push(userItem);
            }
          });
        }
        let _data = this.inputDimSearch(searchName, childUserOrg);
        tierData = tierData.concat(_data.tierData);
        userData = userData.concat(_data.userData);
      });
      return {
        tierData,
        userData
      };
    },
    /**
     * @description: 搜索框内容改变时调用
     * @param {*}
     * @return {*}
     */
    async inputSearchChange(e) {
      if (e === '') {
        this.userList.splice(0);
        this.users = await http.getDicosUserList();
        // this.users = Utils.cloneDeep(this.usersBackups);
      }
      let { tierData, userData } = this.inputDimSearch(e);
      this.tierIndex = 0;
      this.tierAll.splice(0);
      this.tierIndexs.splice(0);
      this.checkboxAll = false;
      this.users = tierData;
      this.usersBackups = Utils.cloneDeep(tierData);
      this.userList = userData;

    }
  },
  computed: {
    NumberPeople() {
      let count = 0;
      this.checkboxUser.forEach(item => {
        if (item) {
          count += item.length;
        }
      });
      return count;
    }
  },
  watch: {
    async componentData(data) {
      if (data.show) {
        this.show = true;
        data = Utils.cloneDeep(data);
        this.users = await http.getDicosUserList();
      }
    },
    /**
     * @description: 检查当前层级下标，大于0刷新当前显示列表，否则关闭组件
     */
    approveTier() {
      if (this.tierIndex) {
        this.returnToPreviousTier();
      } else {
        this.show = false;
        this.$emit('closeSelectApprove', null);
      }
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
            .select_approve_user_checkbox {
              flex-grow: 1;
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
        .select_approve_user_checkbox {
          height: 60px;
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
