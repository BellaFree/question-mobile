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
          <van-checkbox-group v-model="checkboxUser[tierIndex]" ref="checkboxUserGroup">
            <template v-for="(user, userIndex) in userList">
              <van-cell :key="userIndex">
                <van-checkbox class="select_approve_user_checkbox" :name="user.userNo">
                  <div class="select_approve_user_head">
                    <template>
                      <div class="select_approve_user_head_text">{{user.userName}}</div>
                    </template>
                  </div>
                  <div class="select_approve_user_name">
                    <div class="saun_name">{{user.userName}}</div>
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

export default {
  props: {
    componentData: { type: Object },
    approveTier: { type: Object, }
  },
  data() {
    return {
      icon: { iconSubordinate },
      show: true,
      searchName: '',
      checkboxIconSize: '18px',
      users: [],
      userList: [],
      usersBackups: [],
      checkboxAll: false,
      checkboxTier: [],
      checkboxUser: [],
      checkboxUserData: [],
      checkboxedUsers: [],
      tierIndexs: [],
      tierIndex: 0,
      tierAll: [],
      numberPeople: 0,
    };
  },
  async created() {

    this.users = [
      {
        userOrgNo: 'ABLCYQ',
        userOrgName: '便利、餐饮事业群',
        userList: null,
        childUserOrg: [
          {
            userOrgNo: 'AA300000000000000',
            userOrgName: '集享贝瑞',
            userList: null,
            childUserOrg: [
              {
                userOrgNo: 'AA310000000000000',
                userOrgName: '集享贝瑞区域',
                userList: null,
                childUserOrg: [
                  {
                    userOrgNo: 'AA311000000000000',
                    userOrgName: '集享贝瑞子公司',
                    userList: null,
                    childUserOrg: [
                      {
                        userOrgNo: 'AA311080000000000',
                        userOrgName: '广州贝瑞子公司',
                        userList: null,
                        childUserOrg: [
                          {
                            userOrgNo: 'AA311080100000000',
                            userOrgName: '广州贝瑞总经办',
                            userList: null,
                            childUserOrg: []
                          },
                          {
                            userOrgNo: 'AA311080400000000',
                            userOrgName: '广州贝瑞专案',
                            userList: null,
                            childUserOrg: [
                              {
                                userOrgNo: 'AA311080411000000',
                                userOrgName: '广州贝瑞专案一区',
                                userList: null,
                                childUserOrg: [
                                  {
                                    userOrgNo: 'A880106700',
                                    userOrgName: '新富力盈通店',
                                    userList: [
                                      {
                                        userNo: '202109140001',
                                        userName: '何冠龙',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202011130006',
                                        userName: '伍颖仪',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202104150002',
                                        userName: '廖烨兰',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202104200006',
                                        userName: '吴家辉',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202110250256',
                                        userName: '张炜',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      }
                                    ],
                                    childUserOrg: []
                                  },
                                  {
                                    userOrgNo: 'A880101500',
                                    userOrgName: '新科韵路',
                                    userList: [
                                      {
                                        userNo: '202109170001',
                                        userName: '李健斌',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202007060012',
                                        userName: '梁智宁',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202011010033',
                                        userName: '张朝俊',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202011010034',
                                        userName: '李灿平',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202104070001',
                                        userName: '林思华',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      }
                                    ],
                                    childUserOrg: []
                                  },
                                  {
                                    userOrgNo: 'A880109100',
                                    userOrgName: '新保利中悦店',
                                    userList: [
                                      {
                                        userNo: '202008100008',
                                        userName: '曾玉婷',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202011100106',
                                        userName: '李春花',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202011180001',
                                        userName: '邹福然',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202012110006',
                                        userName: '毛文彬',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      }
                                    ],
                                    childUserOrg: []
                                  },
                                  {
                                    userOrgNo: 'A880101400',
                                    userOrgName: '保利克洛维',
                                    userList: [
                                      {
                                        userNo: '202109170002',
                                        userName: '方安泽',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202009010059',
                                        userName: '刘惠庆',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202009010061',
                                        userName: '李斌妮',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202011200008',
                                        userName: '叶张水',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202011200009',
                                        userName: '岑伟贤',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202104210001',
                                        userName: '洪沅',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202110130003',
                                        userName: '杨铭柱',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      }
                                    ],
                                    childUserOrg: []
                                  },
                                  {
                                    userOrgNo: 'A880106800',
                                    userOrgName: '新城建大厦店',
                                    userList: [
                                      {
                                        userNo: '202106040003',
                                        userName: '梁嘉杰',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202009010058',
                                        userName: '郑芬芬',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202011100105',
                                        userName: '陈文健',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202104140007',
                                        userName: '巩帅英',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202105060018',
                                        userName: '郑洁迎',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202109230003',
                                        userName: '林春宏',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      }
                                    ],
                                    childUserOrg: []
                                  },
                                  {
                                    userOrgNo: 'A880114100',
                                    userOrgName: '新环汇商业广场店',
                                    userList: [
                                      {
                                        userNo: '202108030002',
                                        userName: '黄舒琼',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202109220007',
                                        userName: '陈佳伶',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202009010057',
                                        userName: '黄健彬',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202012180003',
                                        userName: '曾国祥',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202104130005',
                                        userName: '郑政义',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202110140004',
                                        userName: '陈炳任',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      }
                                    ],
                                    childUserOrg: []
                                  },
                                  {
                                    userOrgNo: 'A880114200',
                                    userOrgName: '新富力盈隆店',
                                    userList: null,
                                    childUserOrg: []
                                  },
                                  {
                                    userOrgNo: 'A880109200',
                                    userOrgName: '新富力盈泰店',
                                    userList: [
                                      {
                                        userNo: '202009010060',
                                        userName: '钟旻均',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202011010032',
                                        userName: '邓稀维',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202011010050',
                                        userName: '张琪',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202011160032',
                                        userName: '张浩泓',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202104260005',
                                        userName: '何泽华',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202105060023',
                                        userName: '陈圳锐',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202110200006',
                                        userName: '姚俊辉',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      }
                                    ],
                                    childUserOrg: []
                                  },
                                  {
                                    userOrgNo: 'A880114300',
                                    userOrgName: '新中泰国际店',
                                    userList: [
                                      {
                                        userNo: '202105130006',
                                        userName: '冯依舒',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202108100001',
                                        userName: '雷永富',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202006010047',
                                        userName: '王小棋',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202010140005',
                                        userName: '张俊皓',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202105110005',
                                        userName: '高家怡',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202109230005',
                                        userName: '杨云静',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      }
                                    ],
                                    childUserOrg: []
                                  },
                                  {
                                    userOrgNo: 'A880114000',
                                    userOrgName: '新天河人才港店',
                                    userList: [
                                      {
                                        userNo: '202106010014',
                                        userName: '何忠厚',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202107080006',
                                        userName: '梁智杰',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202107210003',
                                        userName: '余建海',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202011080001',
                                        userName: '蔡青',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202011160034',
                                        userName: '梁嘉琪',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202110080010',
                                        userName: '关靖雯',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      }
                                    ],
                                    childUserOrg: []
                                  },
                                  {
                                    userOrgNo: 'A880110700',
                                    userOrgName: '新白云绿地中心店',
                                    userList: [
                                      {
                                        userNo: '202106090001',
                                        userName: '向茹星',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202108040003',
                                        userName: '邓心如',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202011120004',
                                        userName: '戴家莹',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202012010014',
                                        userName: '郭穗威',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      },
                                      {
                                        userNo: '202012080003',
                                        userName: '赖秋菊',
                                        orgNo: null,
                                        orgName: null,
                                        roleNo: null,
                                        roleName: null,
                                        deptName: null,
                                        avatarUrl: null,
                                        isSelect: null
                                      }
                                    ],
                                    childUserOrg: []
                                  }
                                ]
                              },
                              {
                                userOrgNo: 'AA311080405000000',
                                userOrgName: '广州贝瑞专案食安',
                                userList: null,
                                childUserOrg: []
                              },
                              {
                                userOrgNo: 'AA311080401000000',
                                userOrgName: '广州贝瑞专案主管室',
                                userList: null,
                                childUserOrg: []
                              },
                              {
                                userOrgNo: 'AA311080407000000',
                                userOrgName: '广州贝瑞专案行销',
                                userList: null,
                                childUserOrg: []
                              },
                              {
                                userOrgNo: 'AA311080408000000',
                                userOrgName: '广州贝瑞专案外送',
                                userList: null,
                                childUserOrg: []
                              },
                              {
                                userOrgNo: 'AA311080406000000',
                                userOrgName: '广州贝瑞专案开发',
                                userList: null,
                                childUserOrg: []
                              },
                              {
                                userOrgNo: 'AA311080404000000',
                                userOrgName: '广州贝瑞专案人本',
                                userList: null,
                                childUserOrg: []
                              },
                              {
                                userOrgNo: 'AA311080402000000',
                                userOrgName: '广州贝瑞专案资讯',
                                userList: null,
                                childUserOrg: []
                              },
                              {
                                userOrgNo: 'AA311080403000000',
                                userOrgName: '广州贝瑞专案财务',
                                userList: null,
                                childUserOrg: []
                              },
                              {
                                userOrgNo: 'AA311080409000000',
                                userOrgName: '广州贝瑞专案营运推进',
                                userList: null,
                                childUserOrg: []
                              },
                              {
                                userOrgNo: 'AA311080410000000',
                                userOrgName: '广州贝瑞专案营运训练',
                                userList: null,
                                childUserOrg: []
                              }
                            ]
                          },
                          {
                            userOrgNo: 'AA311080300000000',
                            userOrgName: '广州贝瑞财务部',
                            userList: null,
                            childUserOrg: []
                          },
                          {
                            userOrgNo: 'AA311080200000000',
                            userOrgName: '广州贝瑞人本部',
                            userList: null,
                            childUserOrg: []
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ];
    // this.users = await http.getDicosUserList();
    this.usersBackups = Utils.cloneDeep(this.users);
  },
  methods: {
    /**
     * @description: 进入下级
     * @param {*} tier
     * @param {*} index
     * @return {*}
     */
    handleTierNext(tier, index) {
      console.log(tier, index);
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
     * @param {*}
     * @return {*}
     */
    returnToPreviousTier() {
      console.log(this.tierIndex);
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
     * @param {*}
     * @return {*}
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
     * @description: 确定按钮
     */
    handleConfirm() {
      let data = this.filterUserData();
      this.$emit('closeSelectApprove', data);
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
    approveTier() {
      console.log(this.tierIndex);
      if (this.tierIndex) {
        this.returnToPreviousTier();
      } else {
        this.show = false;
        this.$emit('closeSelectApprove', {});
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
