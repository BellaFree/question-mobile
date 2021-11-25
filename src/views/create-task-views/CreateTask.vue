<template>
  <div class="create_task">
    <van-cell-group
      class="create_task_cell_group"
      inset
    >
      <van-field
        v-model="taskType.name"
        class="create_task_type"
        label="任务类型："
        readonly
      />
    </van-cell-group>
    <van-cell-group
      class="create_task_cell_group"
      inset
    >
      <template v-if="taskType.type === '2'">
        <van-field
          v-model="task.workName"
          label="任务名称："
          placeholder="请输入任务名称"
          :disabled="!isUpdateStatus"
        />
        <van-field
          v-model="task.description"
          label="任务描述："
          placeholder="请输描述任务内容"
          :disabled="!isUpdateStatus"
        />
      </template>
      <!-- 执行人 S -->
      <van-cell
        class="ctcg_cell_width ctcg_cell_executor_wrapper"
        title="执行人："
        clickable
        @click="handleCellSelectApprove"
      >
        <template value>
          <div class="ctcg_cell_executor">
            <div class="ctcg_cell_executor_items">
              <template v-if="task.userStoreMappingVo.length">
                <div
                  v-for="executoer in task.userStoreMappingVo.slice(0, 4)"
                  :key="executoer.userNo"
                  class="ctcg_cell_executor_item"
                >
                  {{ nameFilter(executoer.userName) }}
                </div>
                <div
                  v-show="task.userStoreMappingVo.length > 3"
                  class="ctcg_cell_executor_item_omit"
                >
                  等{{ task.userStoreMappingVo.length }}人
                </div>
              </template>
              <template v-else>
                <p>选择任务执行人</p>
              </template>
            </div>
            <div
              v-show="isUpdateStatus"
              class="ctcg_cell_icon_add"
            >
              <img :src="img.imgIconCreateAdd">
            </div>
          </div>
        </template>
      </van-cell>
      <!-- 执行人 E -->
      <!-- 任务地点 S -->
      <van-cell
        class="ctcg_cell_width"
        title="任务地点："
        :is-link="isUpdateStatus"
        @click="handleSelectTaskSite"
      >
        <template v-if="taskType.type === '1' && storeList.length">
          <div class="ctcg_cell_storeList_items">
            <div
              v-for="store in storeList.slice(0, 4)"
              :key="store.storeNo"
              class="ctcg_cell_storeList_item"
            >
              {{ store.storeName }}
            </div>
            <div
              v-if="storeList.length > 4"
              class="ctcg_cell_storeList_item"
            >
              等{{ storeList.length }}个门店。
            </div>
          </div>
        </template>
        <template v-else-if="taskType.type === '2' && storeList.length">
          <div class="ctcg_cell_storeList_items">
            <div
              v-for="store in storeList.slice(0, 4)"
              :key="store.id"
              class="ctcg_cell_storeList_item"
            >
              {{ store.storeName || store.poiName }}
            </div>
            <div
              v-if="storeList.length > 4"
              class="ctcg_cell_storeList_item"
            >
              等{{ storeList.length }}个门店。
            </div>
          </div>
        </template>
        <template v-else>
          请选择任务地点
        </template>
      </van-cell>
      <!-- 任务地点 E -->
    </van-cell-group>

    <!-- 任务开始/结束时间 S -->
    <van-cell-group
      class="create_task_cell_group"
      inset
    >
      <van-cell
        title="任务开始时间："
        :value="task.startDate"
        :is-link="isUpdateStatus"
        @click="handleSelectDate('start')"
      />
      <van-cell
        title="任务截止时间："
        :value="task.endDate"
        :is-link="isUpdateStatus"
        @click="handleSelectDate('end')"
      />
    </van-cell-group>
    <!-- 任务开始/结束时间 E -->
    <van-cell-group
      class="create_task_cell_group"
      inset
    >
      <van-cell title="任务审批流程">
        <template #right-icon>
          <van-switch
            v-show="isUpdateStatus"
            v-model="task.isApprove"
            size="22px"
            active-color="#0A9B58"
          />
        </template>
      </van-cell>
      <div
        v-show="task.isApprove"
        class="ctcg_approve_items"
      >
        <div
          v-for="(approve, approveIndex) in task.dicosApproveVo"
          :key="approveIndex"
          class="ctcg_approve_item"
        >
          <div class="ctcg_approve_item_left">
            <div class="ctcg_approve_name">
              <div class="ctcg_approve_dot" />
              <h4>审批人{{ approveIndex + 1 }}</h4>
            </div>
            <!-- <div class="ctcg_approve_position">主管审批</div> -->
            <div
              v-show="isUpdateStatus"
              class="ctcg_approve_handle"
            >
              <div
                v-show="task.dicosApproveVo.length < 5"
                class="ctcg_approve_handle_button"
                @click="handleApproveListAdd(approveIndex)"
              >
                添加
              </div>
              <div
                v-show="task.dicosApproveVo.length > 1"
                class="ctcg_approve_handle_button"
                @click="handleApproveListRemove(approveIndex)"
              >
                删除
              </div>
            </div>
          </div>
          <div class="ctcg_approve_item_right">
            <div class="ctcg_approve_person_items">
              <template v-for="(user, uIndex) in approve.approveUserList">
                <div
                  :key="user.userNo"
                  class="ctcg_approve_person_item"
                >
                  {{ nameFilter(user.userName) }}
                  <div class="ctcg_approve_person_item_name">
                    {{ user.userName }}
                  </div>
                  <div
                    v-show="isUpdateStatus"
                    class="ctcg_approve_person_item_close"
                    @click="handleDeleteApprove(approveIndex, uIndex)"
                  />
                </div>
                <div
                  :key="uIndex"
                  class="ctcg_approve_person_item_divider"
                >
                  +
                </div>
              </template>
              <div
                v-if="approve.approveUserList.length < 3"
                class="ctcg_approve_person_item ctcg_approve_person_item_push"
                @click="approveLinkPush(approveIndex)"
              />
            </div>
          </div>
        </div>
      </div>
    </van-cell-group>

    <!-- 提交按钮 S -->
    <div
      v-show="isUpdateStatus"
      class="handle_confirm_box"
    >
      <van-button
        class="handle_confirm"
        @click="handleConfirm"
      >
        {{ confirmText }}
      </van-button>
    </div>
    <!-- 提交按钮 E -->
    <!-- 任务时间选择弹窗 S -->
    <van-popup
      v-model="popupDateShow"
      round
      position="bottom"
      :style="{ height: '30%' }"
    >
      <van-datetime-picker
        ref="detetimePicker"
        v-model="currentDate"
        :min-date="minDate"
        :max-date="maxDate"
        type="date"
        title="选择年月日"
        @confirm="popupDateConfirm"
        @cancel="popupDateCancel"
      />
    </van-popup>
    <!-- 任务时间选择弹窗 E -->
    <van-popup
      v-model="popupHandleTaskShow"
      class="popup_handle_task"
      position="bottom"
      closeable
      round
    >
      <div class="popup_title">
        更多操作
      </div>
      <div class="pht_more_items">
        <div
          v-for="(item, index) in taskMoreHandles"
          :key="item.name"
          class="pht_more_item"
          @click="handleMoreButton(index)"
        >
          <van-icon
            :name="item.icon"
            size="55px"
          />
          <div class="pht_more_item_name">
            {{ item.name }}
          </div>
        </div>
      </div>
    </van-popup>
    <SelectApprove
      v-if="componentApprove.show"
      :component-data="componentApprove"
      :approve-tier="approveTier"
      @closeSelectApprove="closeSelectApprove"
    />
    <SelectShop
      :component-select-shop="componentSelectShopData"
      @closeSelectShop="closeSelectShop"
    />
    <SuccessPage
      v-if="successPageShow"
      :icon="successPageConfig.icon"
      :icon-text="successPageConfig.iconText"
    />
    <div
      v-if="executorList"
      class="maplist"
    >
      <MapList
        :executor-list="executorList"
        @closeMapList="closeMapList"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import http from '../../../api/createTaskApi.js';
import Utils from '../../utils/utilsTask';
import { Dialog } from 'vant';
import { nameFilter } from '../../utils/index';
import SelectApprove from './components/SelectApprove.vue';
import SelectShop from './components/SelectShop.vue';
import SuccessPage from '../perform-task-views/success.vue';
import MapList from '../../components/chooseStore/mapList.vue';
import imgIconCreateAdd from '../../../public/img/create_task/icon_create_add.png';
import imgIconUpdate from '../../../public/img/create_task/icon_task_update.png';
import imgIconHandleTaskUpdate from '../../../public/img/create_task/icon_handle_task_update.png';
import imgIconHandleTaskStop from '../../../public/img/create_task/icon_handle_task_stop.png';
import imgIconHandleTaskDelete from '../../../public/img/create_task/icon_handle_task_delete.png';
export default {
  name: 'CreateTask',
  components: { SelectApprove, SelectShop, SuccessPage, MapList },
  subtitle() {
    return '创建任务';
  },
  leftIcon() {
    return 'arrow-left';
  },
  rightIcon() {
    // 路由为任务详情的时候生效
    let { name } = this.$route;
    if (name === 'TaskDetail') {
      return imgIconUpdate;
    }
  },
  onLeft() {
    // 关闭选择执行人组件
    if (this.componentSelectApproveStatus) {
      this.approveTier = {};
      return;
    }
    // 关闭选择任务地点组件
    if (this.componentSelectShopStatus) {
      this.componentSelectShopStatus = false;
      if (this.taskType.type === '2') {
        this.executorList = null;
      } else {
        this.componentSelectShopData = {};
      }

      return;
    }
    this.$router.push({ name: 'CreateIndex' });
  },
  onRight() {
    // 路由为任务详情的时候生效
    let { name } = this.$route;
    if (name === 'TaskDetail') {
      this.popupHandleTaskShow = true;
    }
  },
  data() {
    return {
      // 是否可修改
      isUpdateStatus: true,
      img: { imgIconCreateAdd },
      taskType: {},
      // 任务编号
      workNo: '',
      task: {
        workType: null,
        // 其他任务-任务名称
        workName: '',
        // 其他任务-任务描述
        description: '',
        // 任务审批流程状态开关
        isApprove: false,
        startDate: '请选择任务开始时间',
        endDate: '请选择任务截止时间',
        // 用户与门店绑定关系
        userStoreMappingVo: [],
        // 任务审批流程-审批人列表
        dicosApproveVo: [
          {
            level: 1,
            approveUserList: []
          }
        ]
      },
      // 任务地点总列表
      storeList: [],
      approveTier: {},
      componentApprove: {},
      componentApproveType: '',
      // 任务审批流程-添加审批人时选择的层级
      approveTiersIndex: 0,
      componentSelectApproveStatus: false,
      componentSelectShopData: null,
      componentSelectShopStatus: false,
      // 任务时间设置弹窗显隐
      popupDateShow: false,
      popupDateStatus: '',
      // 任务操作弹窗显隐
      popupHandleTaskShow: false,
      // 现在选择时间
      currentDate: new Date(),
      // 最大时间范围
      maxDate: new Date(),
      // 最小时间范围
      minDate: new Date(),
      // 保存门店组件传来的数据
      saveShopData: {},
      // 创建成功页面显示状态
      successPageShow: false,
      // 创建成功页参数
      successPageConfig: {
        icon: 'task_success',
        iconText: '任务创建成功！'
      },
      confirmText: '立即提交',
      // 更多操作按钮
      taskMoreHandles: [
        {
          icon: imgIconHandleTaskUpdate,
          name: '编辑修改',
        },
        {
          icon: imgIconHandleTaskStop,
          name: '终止任务',
        },
        {
          icon: imgIconHandleTaskDelete,
          name: '删除任务',
        },
      ],
      // 其他任务-选择门店数据
      executorList: null,
    };
  },
  async created() {
    let { name } = this.$route;
    let task = this.$route.params;
    console.log(name, task);
    console.log(this.userInfo);
    switch (name) {
      // 当前为详情页面
      case 'TaskDetail': {
        // 任务编号
        let { workNo } = task;

        let workDetail = await http.getWorkTaskDetails({ workNo, executeNo: '' });
        let { workType, userStoreMappingVo, storeList, startDate, endDate, isApprove, approveLevelList, workName, description } = workDetail;
        let dicosApproveVo = [];
        this.workNo = workNo;
        this.confirmText = '确认修改';
        // 设置任务类型
        this.task.workType = workType;
        switch (workType) {
          case '1': {
            this.taskType = { name: '标准访店任务', type: workType };
            break;
          }
          case '2': {
            this.taskType = { name: '其他任务', type: workType };
            this.task.workName = workName;
            this.task.description = description;
          }
        }
        // 设置执行人数据
        this.task.userStoreMappingVo = userStoreMappingVo;
        // 设置任务地点
        this.storeList = storeList;
        // 设置时间
        this.task.startDate = startDate;
        this.task.endDate = endDate;
        // 设置任务审批流程状态
        this.task.isApprove = isApprove === 'y' ? !0 : !1;
        // 设置审批人列表
        approveLevelList.forEach((item, index) => {
          item.approveUserList = Utils.cloneDeep(item.userList);
          delete item.userList;
          dicosApproveVo[index] = item;
        });
        this.task.dicosApproveVo = dicosApproveVo;

        return;
      }
      default: {
        this.taskType = task;
        // TODO: 测试数据
        // this.taskType = {
        //   name: '访店任务',
        //   type: '1',
        // };
        // this.taskType = {
        //   name: '其他任务',
        //   type: '2',
        // };

        if (this.taskType.type === '1') {
          this.taskType.name = '标准访店任务';
        }
      }
    }
  },
  computed: { ...mapGetters(['userInfo']) },
  methods: {
    nameFilter,
    /**
     * @description: 按钮-执行人
     */
    handleCellSelectApprove() {
      if (!this.isUpdateStatus) {
        return;
      }
      this.componentSelectApproveStatus = true;
      this.$notice.$emit('navigation', { title: '执行人' });
      this.componentApproveType = 1;
      this.componentApprove = { show: true,  };
    },
    /**
     * @description: 按钮-任务地点
     */
    handleSelectTaskSite() {
      console.log(this.isUpdateStatus);
      if (!this.isUpdateStatus) {
        return;
      }
      this.componentSelectShopStatus = true;
      if (this.taskType.type === '2') {
        let userStoreMappingVo = Utils.cloneDeep(this.task.userStoreMappingVo);
        userStoreMappingVo.map(item => {
          item.name = item.userName;
          item.id = item.userNo;
          console.log(item);
          return item;
        });
        console.log(userStoreMappingVo);
        this.executorList = userStoreMappingVo;
        return;
      }
      let userStoreMappingVo = Utils.cloneDeep(this.task.userStoreMappingVo);
      this.componentSelectShopData = { show: true, userStoreMappingVo };
    },
    /**
     * @description: 按钮-添加审批人
     */
    approveLinkPush(index) {
      this.approveTiersIndex = index;
      this.componentSelectApproveStatus = true;
      this.$notice.$emit('navigation', { title: '审批人' });
      this.componentApproveType = 2;
      this.componentApprove = { show: true };
    },
    handleDeleteApprove(yIndex, xIndex) {
      console.log(yIndex, xIndex);
      this.task.dicosApproveVo[yIndex].approveLevelList.splice(xIndex, 1);
    },
    /**
     * @description: 按钮-任务审批流程-添加
     * @param {number} index
     */
    handleApproveListAdd(index) {
      this.task.dicosApproveVo.splice(index + 1, 0, {
        level: null,
        userList: []
      });
    },
    /**
     * @description: 按钮-任务审批流程-删除
     * @param {index}
     */
    handleApproveListRemove(index) {
      this.task.dicosApproveVo.splice(index, 1);
    },

    /**
     * @description: 选择开始/结束时间
     * @param {*} type
     * @return {*}
     */
    handleSelectDate(type) {
      if (!this.isUpdateStatus) {
        return;
      }
      let isStart = this.task.startDate === '请选择任务开始时间';
      let isEnd = this.task.endDate === '请选择任务截止时间';
      this.popupDateStatus = type;
      this.popupDateShow = true;

      let taskDate;

      if (isStart && isEnd) {
        this.maxDate = this.returnSetDate(11, [0, 1]);
        this.minDate = this.returnSetDate(-10, [0, 1]);
        taskDate = new Date();
      } else if (isStart) {
        taskDate = new Date(this.task.endDate);
        this.maxDate = new Date(this.task.endDate);
      } else if (isEnd) {
        taskDate = new Date(this.task.startDate);
        this.minDate = new Date(this.task.startDate);
      } else {
        let maxDate, minDate;
        switch (type) {
          case 'start': {
            taskDate = new Date(this.task.startDate);
            maxDate = new Date(this.task.endDate);
            minDate = this.returnSetDate(-10, [0, 1]);
            break;
          }
          case 'end': {
            taskDate = new Date(this.task.endDate);
            maxDate = this.returnSetDate(11, [0, 1]);
            minDate = new Date(this.task.startDate);
            break;
          }
        }
        this.$nextTick(() => {
          this.maxDate = maxDate;
          this.minDate = minDate;
        });
      }
      this.currentDate = taskDate;
      console.log(taskDate);

    },
    returnSetDate(y, arr) {
      let date = new Date();
      let year = date.getFullYear() + y;
      return new Date(year, ...arr);
    },
    /**
     * @description: 按钮-弹出框-设置时间-确认
     * @param {*}
     * @return {*}
     */
    popupDateConfirm() {
      let status = this.popupDateStatus;
      switch (status) {
        case 'start': {
          this.task.startDate = Utils.dateFormat(this.currentDate);
          break;
        }
        case 'end': {
          this.task.endDate = Utils.dateFormat(this.currentDate);
          break;
        }
      }
      this.popupDateShow = false;

    },
    popupDateCancel() {

    },
    /**
     * @description: 按钮-立即提交
     */
    handleConfirm() {
      console.log(this.task);
      let { userInfo } = this;
      let params = {
        // 创建人编号
        createUser: userInfo.tuid,
        // 创建人名称
        createUserName: userInfo.tuidName,
        // 执行人、任务地点
        userStoreMappingVo: this.task.userStoreMappingVo,
        // 任务开始时间
        startDate: this.task.startDate,
        // 任务结束时间
        endDate: this.task.endDate,
        // 是否需要审批(y/n)
        isApprove: this.task.isApprove ? 'y' : 'n',
        // 任务类型
        workType: this.taskType.type
      };
      if (params.startDate === '请选择任务开始时间' || params.endDate === '请选择任务截止时间') {
        return Dialog.alert({ message: '请选择开始/截止时间' });
      }

      // 为其他任务就添加任务名称及描述
      if (params.workType === '2') {
        params.workName = this.task.workName;
        params.description = this.task.description;
      }

      // 有审批流程就审批人列表数据
      if (this.task.isApprove) {
        this.task.dicosApproveVo.map((item, index) => {
          item.level = index + 1;
        });
        params.dicosApproveVo = this.task.dicosApproveVo;
      }

      // 存在任务编号时为修改任务
      if (this.workNo) {
        params.workNo = this.workNo;

      }

      http.saveWorkTask(params)
        .then(result => {
          let { code, message } = result;
          if (code == 200) {
            if (this.task.isApprove) {
              this.successPageConfig.icon = 'task_verify';
            }
            this.successPageConfig.iconText = message;
            this.successPageShow = true;
            return;
          }
          Dialog.alert({ message });
        })
        .catch(error => {
          let { message } = error;
          Dialog.alert({ message });
        });
      console.log(params);
    },
    handleMoreButton(index) {
      switch (index) {
        case 0: {
          this.isUpdateStatus = true;
          break;
        }
        case 1: {
          Dialog.confirm({
            title: '提示',
            message: '工作内容尚未全部完成是否结束任务？',
            confirmButtonColor: '#0A9B58'
          })
            .then(() => {
              let { workNo } = this;
              http.terminateWorkTask({ workNo });
              this.popupHandleTaskShow = false;
            })
            .catch(() => {});
          break;
        }
        case 2: {
          Dialog.confirm({
            title: '确认删除',
            message: '确认要删除此任务吗?',
            confirmButtonColor: '#0A9B58'
          })
            .then(() => {
              let { workNo } = this;
              http.deleteWorkTask({ workNo });
              this.popupHandleTaskShow = false;
            })
            .catch(() => {

            });
          break;
        }
      }
      console.log(index);
    },
    /**
     * @description: 执行人/审批人页面关闭时
     * @param {object|null} data
     */
    closeSelectApprove(data) {
      if (data) {
        switch (this.componentApproveType) {
          case 1: {
            this.task.userStoreMappingVo = data;
            break;
          }
          case 2: {
            let { approveTiersIndex } = this;
            let { dicosApproveVo } = this.task;
            if (dicosApproveVo[approveTiersIndex]) {
              dicosApproveVo[approveTiersIndex] = {
                level: null,
                approveUserList: []
              };
            }
            let length = 3 - dicosApproveVo[approveTiersIndex].approveUserList.length;
            if (length < 0) {
              length = 0;
            }
            data = data.splice(0, length);
            this.task.dicosApproveVo[approveTiersIndex].approveUserList.push(...data);
            break;
          }
        }
      }
      // 关闭执行人组件
      this.componentApprove = {};
      // 关闭组件开启状态
      this.componentSelectApproveStatus = false;
    },
    /**
     * @description: 关闭访店
     * @param {*}
     * @return {*}
     */
    closeSelectShop(data) {
      console.log(data);
      if (data) {
        let storeList = [];
        data.forEach(item => {
          console.log(item);
          if (item.storeList) {
            storeList = storeList.concat(item.storeList);
            console.log(storeList);
          }
        });
        console.log(storeList);
        storeList.forEach((item, index) => {
          for (let i = storeList.length - 1; i > index; i--) {
            if (item.storeNo === storeList[i].storeNo) {
              storeList[i].splice(i, 1);
            }
          }
        });
        this.task.userStoreMappingVo = data;
        this.storeList = storeList;
      }
      this.componentSelectShopStatus = false;
    },
    /**
     * @description: 关闭其他任务-选择门店组件
     * @param {*} data
     * @return {*}
     */
    closeMapList(data) {
      let storeList = [];
      data.forEach(item => {
        storeList = storeList.concat(item.poiList);
      });
      data.forEach((item, index) => {
        for (let i = data.length - 1; i > index; i--) {
          if (item.poiName === data[i].poiName) {
            data.splice(i, 1);
          }
        }
      });
      this.task.userStoreMappingVo = data;
      this.storeList = storeList;
      this.executorList = null;
      console.log();
    }
  }
};
</script>

<style lang="scss" scoped>
$mainColor: #0A9B58;
.create_task {
  position: relative;
  padding-bottom: 100px;
  .create_task_cell_group {
    margin-top: 20px;
    box-shadow: 0px 2px 5px 2px rgba(0,0,0,0.05);
    .create_task_type {
      ::v-deep .van-field__value {
        .van-field__control {
          color: #0A9B58;
          font-size: 16px;
          font-weight: bold;
        }
      }
    }
    .van-cell {
      &:after {
        left: 0;
      }
      &.ctcg_cell_width {
        .van-cell__title {
          flex-grow: 0;
          flex-shrink: 0;
          flex-basis: auto;
          display: block;
        }
      }
      &.ctcg_cell_executor_wrapper {
        .van-cell__title {
          display: flex;
          align-items: center;
        }
      }
      .ctcg_cell_storeList_items {
        color: #333;
        font-size: 14px;
        font-weight: bold;
        text-align: left;
      }
      .ctcg_cell_executor {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .ctcg_cell_executor_items {
          display: flex;
          width: 210px;
          overflow-x: auto;
          .ctcg_cell_executor_item {
            display: flex;
            flex: 0 0 auto;
            margin-right: 7px;
            justify-content: center;
            align-items: center;
            width: 35px;
            height: 35px;
            color: #fff;
            font-size: 11px;
            white-space: nowrap;
            background: #0A9B58;
            border-radius: 50%;
          }
          .ctcg_cell_executor_item_omit {
            display: flex;
            align-items: center;
            color: #333;
            font-size: 12px;
            font-weight: bold;
          }
        }
        .ctcg_cell_icon_add {
          width: 20px;
          height: 20px;
          img {
            width: 100%;
          }
        }
      }
    }
    .van-cell {
      &::v-deep .van-cell__title {
        margin-right: 0;
        width: 80px;
        color: #333;
        text-align: left;
        font-size: 14px;
        font-weight: bold;
      }
    }
    .ctcg_approve_items {
      .ctcg_approve_item {
        padding: 10px 16px;
        display: flex;
        height: 64px;
        justify-content: space-between;
        .ctcg_approve_item_left {
          display: flex;
          flex-direction: column;
          flex-grow: 0;
          .ctcg_approve_name {
            display: flex;
            align-items: center;
            font-size: 15px;
            .ctcg_approve_dot {
              position: relative;
              display: inline-block;
              margin-right: 10px;
              width: 13px;
              height: 13px;
              background: #d8d8d8;
              border-radius: 50%;
              &::after {
                position: absolute;
                left: 50%;
                bottom: 100%;
                display: block;
                height: 75px;
                content: '';
                border-right: 1px solid #d8d8d8;
                transform: translateX(-50%);
              }
            }
          }
          .ctcg_approve_position {
            display: block;
            padding: 4px 0;
            padding-left: 10px;
            color: #999;
            font-size: 13px;
          }
          .ctcg_approve_handle {
            display: flex;
            padding-left: 24px;
            .ctcg_approve_handle_button {
              color: $mainColor;
              font-size: 13px;
              margin-right: 10px;
            }
          }
        }
        .ctcg_approve_item_right {
          flex-grow: 1;
          .ctcg_approve_person_items {
            display: flex;
            justify-content: right;
            .ctcg_approve_person_item {
              position: relative;
              display: flex;
              justify-content: center;
              align-items: center;
              width: 40px;
              height: 40px;
              color: #fff;
              font-size: 13px;
              background: $mainColor;
              border-radius: 50%;
              .ctcg_approve_person_item_name {
                position: absolute;
                bottom: -24px;
                color: #999999;
                font-size: 12px;

              }
              .ctcg_approve_person_item_close {
                position: absolute;
                top: -2px;
                right: -2px;
                width: 15px;
                height: 15px;
                background: url('../../../public/img/create_task/delete_approver.png');
                background-size: cover;
              }
              &.ctcg_approve_person_item_push {
                background: url('../../../public/img/create_task/icon_create_add.png');
                background-size: cover;
                border-radius: initial;
              }
            }
            .ctcg_approve_person_item_divider {
              padding: 0 6px;
              height: 40px;
              line-height: 40px;
              color: #999;
              font-size: 15px;
            }
            .ctcg_approve_person_item_divider:last-of-type {
              display: none;
            }
          }
        }
      }
      .ctcg_approve_item:nth-child(1) {
        .ctcg_approve_item_left {
          .ctcg_approve_name {
            .ctcg_approve_dot {
             &::after {
                display: none;
              }
            }
          }
        }
      }
    }
  }
  .popup_handle_task {
    height: 180px;
    background: #EFF0F1;
    .popup_title {
      padding: 14px 0 15px;
      color: #6B6B6B;
      font-size: 17px;
      font-weight: bold;
    }
    .pht_more_items {
      display: flex;
      padding: 0 34px;
      justify-content: space-between;
      .pht_more_item {
        .pht_more_item_name {
          padding-top: 7px;
          color: #787D83;
          font-size: 14px;
        }
      }
    }
  }
  .handle_confirm_box {
    position: fixed;
    padding-top: 5px;
    padding-bottom: 35px;
    left: 0;
    bottom: 0;
    width: 100%;
    box-shadow: 0px -2px 5px 0px rgba(0,0,0,0.06);
    background: #fff;
    .handle_confirm {
      margin: 0 auto;
      width: 345px;
      height: 44px;
      color: #fff;
      font-size: 16px;
      font-weight: bold;
      background: linear-gradient(180deg, #7ACC2C 0%, #0A9B58 100%);
      border-radius: 22px;
    }
  }
  .maplist {
    z-index: 10;
    position:absolute;
    top: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
