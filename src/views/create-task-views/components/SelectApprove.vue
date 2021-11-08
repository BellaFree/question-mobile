<template>
  <div class="select_approve_wrap">
    <van-overlay :show="show">
      <div class="select_approve">
        <van-search
          v-model="searchName"
          shape="round"
          placeholder="搜索"
        />
        <div class="search_bottom_title">工作角色</div>
        <van-cell-group class="select_approve_user_group select_approve_user_group_all">
          <van-cell>
            <van-checkbox v-model="checkboxAll" name="all" :icon-size="checkboxIconSize">全选</van-checkbox>
          </van-cell>
        </van-cell-group>

        <van-cell-group class="select_approve_user_group select_approve_user_group_tier">
          <van-checkbox-group v-model="checkboxTier">
            <template v-for="(tier, tierIndex) in users">
              <van-cell v-if="tier.childUserOrg.length" :key="tier.userOrgNo">
                <van-checkbox class="select_approve_user_checkbox" :name="tier.userOrgNo">{{tier.userOrgName}}</van-checkbox>
                <div class="select_approve_user_button_box">
                  <van-button @click="handleTierNext(tier, tierIndex)" class="select_approve_user_button" :icon="icon.iconSubordinate" plain type="primary">下级</van-button>
                </div>
              </van-cell>
            </template>
          </van-checkbox-group>
        </van-cell-group>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import iconSubordinate from '../../../../public/img/create_task/icon_subordinate.png';
import http from '../../../../api/createTaskApi';
import Utils from '../../../utils/utilsTask';

export default {
  props: { componentData: { type: Object } },
  onLeft() {
    console.log(1);
  },
  data() {
    return {
      icon: { iconSubordinate },
      show: true,
      searchName: '',
      checkboxIconSize: '18px',
      users: [],
      usersBackups: [],
      checkboxAll: false,
      checkboxTier: [],
      tierIndex: [],
    };
  },
  async created() {
    // this.users = await http.getDicosUserList();
    this.users = [
      {
        userOrgNo: 'AAzongbu',
        userOrgName: '总部',
        userList: null,
        childUserOrg: [
          {
            userOrgNo: 'AABU003',
            userOrgName: '德克士三部',
            userList: null,
            childUserOrg: [
              {
                userOrgNo: 'AAS031',
                userOrgName: '德克士三部一所',
                userList: null,
                childUserOrg: [
                  {
                    userOrgNo: 'AAC031',
                    userOrgName: '德克士三部一所一处',
                    userList: null,
                    childUserOrg: []
                  }
                ]
              },
              {
                userOrgNo: 'AAS032',
                userOrgName: '德克士三部二所',
                userList: null,
                childUserOrg: [
                  {
                    userOrgNo: 'AAC032',
                    userOrgName: '德克士三部二所二处',
                    userList: null,
                    childUserOrg: []
                  }
                ]
              },
              {
                userOrgNo: 'AAS033',
                userOrgName: '德克士三部三所',
                userList: null,
                childUserOrg: [
                  {
                    userOrgNo: 'AAC033',
                    userOrgName: '德克士三部三所三处',
                    userList: null,
                    childUserOrg: []
                  }
                ]
              }
            ]
          },
          {
            userOrgNo: 'AABU002',
            userOrgName: '德克士二部',
            userList: null,
            childUserOrg: [
              {
                userOrgNo: 'AAS021',
                userOrgName: '德克士二部一所',
                userList: null,
                childUserOrg: []
              },
              {
                userOrgNo: 'AAS022',
                userOrgName: '德克士二部二所',
                userList: null,
                childUserOrg: []
              },
              {
                userOrgNo: 'AAS023',
                userOrgName: '德克士二部三所',
                userList: null,
                childUserOrg: []
              }
            ]
          },
          {
            userOrgNo: 'AABU001',
            userOrgName: '德克士一部',
            userList: null,
            childUserOrg: [
              {
                userOrgNo: 'AAS001',
                userOrgName: '德克士一部一所',
                userList: null,
                childUserOrg: []
              },
              {
                userOrgNo: 'AAS002',
                userOrgName: '德克士一部二所',
                userList: null,
                childUserOrg: []
              },
              {
                userOrgNo: 'AAS003',
                userOrgName: '德克士一部三所',
                userList: null,
                childUserOrg: []
              }
            ]
          }
        ]
      }
    ];
  },
  methods: {
    handleTierNext(tier, index) {
      let { childUserOrg } = tier;
      if (childUserOrg.length) {
        if (this.tierIndex.length === 0) {
          this.usersBackups = Utils.cloneDeep(this.users);
        }
        console.log(Utils.cloneDeep(this.usersBackups));
        this.users = [];
        this.$nextTick(() => {
          this.users = Utils.cloneDeep(childUserOrg);
        });
        this.tierIndex.push(index);
      }
      console.log(tier);
    }
  },
  watch: {
    async componentData(data) {
      if (data.show) {
        data = Utils.cloneDeep(data);
        this.users = await http.getDicosUserList();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
$mainColor: #0A9B58;
.select_approve_wrap {
  .select_approve {
    padding-top:50px;
    width: 100%;
    height: 100%;
    background: #fff;
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
    }
  }
}
</style>
