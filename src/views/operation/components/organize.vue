<template>
  <div class="organize-wrap">
    <!--历史记录-->
    <div class="history-record">
      <h5>历史记录</h5>
      <ul>
        <li v-for="item of historyList"
            :class="{'active': item.userId === currentOrganizeID}"
            :key="item.userId"
            @click="chooseHistory(item)"
        >{{ item.userName }}
        </li>
      </ul>
    </div>
    <!--组织-->
    <div class="content">
      <h5>选择组织边界</h5>
      <div class="title">
        <van-tabs :ellipsis="false" v-model="activeOrganize" @change="handleChange">
          <van-tab v-for="item in organizeOption"
                   :title="item.orgName"
                   :key="item.orgId"
                   :disabled="!item.available"
                   :name="item.orgId + '/' + item.orgLevel"
          />
        </van-tabs>
      </div>
      <ul class="content-organize">
        <li v-for="item of contentList"
            :key="item.orgId"
            :class="{
              'active':( typeof currentOrganizeID === 'string' && (item.orgId === currentOrganizeID || item.userId === currentOrganizeID)) ||  typeof currentOrganizeID === 'object' && currentOrganizeID.length > 0 && item.userName == '全部',
              'disabled': !item.available
              }"
            @click="getChild(item)">
          {{ item.orgName ? item.orgName : item.userName }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import JourNeyApi from '@api/journey_api'
import {getNoRepeat} from '@/utils/index'

export default {
  props: {
    sessionKeyName: { // 用户区分不同地方的用户浏览记录
      required: false,
      type: String,
      default: 'operation'
    },
    whetherAll: {  // 科级别是否填充 全部
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      organizeOption: [],
      activeOrganize: '',
      currentOrganizeID: '',
      currentOrganizeLevel: '',
      userId: '',
      contentList: [],
      historyList: []
    }
  },
  mounted() {
    let historyList = window.sessionStorage.getItem(this.sessionKeyName) ? window.sessionStorage.getItem(this.sessionKeyName) : null
    if (historyList) {
      this.historyList = JSON.parse(historyList)
    }
    let userInfo = window.sessionStorage.getItem('userInfo') ? window.sessionStorage.getItem('userInfo') : null
    if(userInfo) userInfo = JSON.parse(userInfo)
    this.userId = userInfo.tuId
    this.getHeader()
  },
  methods: {
    // 获取头部
    getHeader() {
      JourNeyApi.getOrganizeHeader({userId: this.userId})
          .then(res => {
            console.info(res)
            if (res.code === 200) {
              this.organizeOption = res.data.headInfoList
              // 默认值
              const {orgId, orgLevel} = this.organizeOption[this.organizeOption.length - 1]
              this.currentOrganizeID = orgId
              this.currentOrganizeLevel = orgLevel
              this.$nextTick(() =>{
                this.activeOrganize = `${orgId}/${orgLevel}`
              })
              this.getAssociateData()
            }
          })
          .catch(err => console.error(err))
    },
    // 获取组织对应的关联数据
    getAssociateData() {
      JourNeyApi.getInfoList({
        orgId: this.currentOrganizeID,
        orgLevel: this.currentOrganizeLevel,
        userId: this.userId
      })
          .then(res => {
            if (res.code === 200) {
              this.contentList = res.data
              if (this.currentOrganizeLevel === '3') { // 开发课级别
                // 是否填充 全部
                if (this.whetherAll) {
                  this.contentList.unshift({
                    available: this.contentList.filter(item => !item.available).length > 0 ? false : true,
                    orgId: null,
                    orgLevel: null,
                    parentId: '',
                    parentName: this.contentList[0]['parentName'],
                    userId: null,
                    userName: '全部'
                  })
                }
              }
            }
          })
          .catch(err => console.error(err))
    },
    handleChange() {
      this.currentOrganizeID = this.activeOrganize.split('/')[0]
      this.currentOrganizeLevel = this.activeOrganize.split('/')[1]
      this.getAssociateData()
    },
    getChild(item) {
      if(!item.available){return}
      // 组织级别 获取下级
      if (item.orgLevel) {
        this.currentOrganizeID = item.orgId
        this.currentOrganizeLevel = item.orgLevel
        // 判断同层级的是否存在 不存在添加 存在替换
        let filterData = true, Index // 下标
        for (let i = 0; i < this.organizeOption.length; i++) {
          let childItem = this.organizeOption[i]
          if (childItem.orgLevel === item.orgLevel) {
            Index = i
            filterData = false
            break
          }
        }
        if (filterData) {
          this.organizeOption.push(item)  // 组织头部无该部分数据添加
        } else {
          let parentLength = this.organizeOption.length
          // 删除该级别后所有子集
          let needDeleteLength = parentLength - Index
          this.organizeOption.splice(Index, Index === parentLength - 1 ? 1 : needDeleteLength, item)
        }
        setTimeout(() => {
          this.activeOrganize = `${item.orgId}/${item.orgLevel}` // 渲染延迟
        }, 100)
        this.getAssociateData()
      } else { // 担当
        this.currentOrganizeID = item.userId
        this.currentOrganizeLevel = item.orgLevel
        if (!item.userId && item.userName === '全部') { //全部当担
          this.currentOrganizeID = []
          for (let item of this.contentList) {
            if (item.userId) {
              this.currentOrganizeID.push({
                tuId: item.userId,
                tuName: item.userName
              })
            }
          }
        } else {
          // 存储到 sessionStorage 中供历史记录部分使用
          let oldSessionData = window.sessionStorage.getItem(this.sessionKeyName) ? window.sessionStorage.getItem(this.sessionKeyName) : null
          if (oldSessionData) {
            oldSessionData = JSON.parse(oldSessionData)
            oldSessionData.unshift(item)
            // 去重
            oldSessionData = getNoRepeat(oldSessionData, 'userId')
            oldSessionData.splice(5)
          } else {
            oldSessionData = [item]
          }
          this.historyList = oldSessionData
          window.sessionStorage.setItem(this.sessionKeyName, JSON.stringify(oldSessionData))
        }
        this.$store.dispatch('Itinerary/set_take_responsibility', {
          id: this.currentOrganizeID,
          name: item.userName == '全部' ? item.parentName : item.userName ,
          parentId: item.parentId
        })
      }
    },
    // 选择历史记录
    chooseHistory(item) {
      this.currentOrganizeID = item.userId
      this.currentOrganizeLevel = item.orgLevel
      this.$store.dispatch('Itinerary/set_take_responsibility', {
        id: item.userId,
        name: item.userName,
        parentId: item.parentId
      })
    },
    closeDialog() {
      this.$parent.footprintStatus = false
    }
  }
}
</script>

<style scoped lang="scss">
.organize-wrap {
  padding-left: 12px;
}

.close {
  display: flex;
  justify-content: right;
  height: 50px;

  .close-btn {
    margin-right: 16px;
    margin-top: 15px;
  }

  svg {
    width: 18px;
    height: 18px;
  }
}

.history-record {
  margin-top: 30px;

  h5 {
    font-size: 12px;
    font-weight: 400;
    color: #80848F;
    text-align: left;
  }

  ul {
    display: flex;
    margin-top: 18px;

    li {
      padding: 0 5px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      background: #F8F8F9;
      border-radius: 13px;
      font-size: 14px;
      font-weight: 400;
      color: #495060;
      margin-right: 8px;
    }

    .active {
      color: #19BE6B;
      background: #E1FAED;
    }
  }
}

.content {
  margin-top: 25px;

  h5 {
    font-size: 12px;
    font-weight: 400;
    color: #80848F;
    text-align: left;
  }

  .title {
    border-bottom: 1px solid #E9EAEC;

    ::v-deep .van-tabs__wrap--scrollable .van-tab {
      flex-shrink: 0;
      flex-basis: auto;
    }
  }

  &-organize {
    margin-top: 10px;

    li {
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      font-weight: 400;
      color: #495060;
      text-align: left;
    }

    .active {
      color: #19BE6B;
    }
    .disabled{
      color: #c8c9cc;
    }
  }

  ::v-deep {
    .van-tab--active {
      color: #19BE6B;
    }

    .van-tabs__line {
      background-color: #19BE6B;
      width: 50px;
    }
  }
}
</style>
