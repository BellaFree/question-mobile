<template>
  <div class="select_shop_wrap">
    <van-overlay :show="show">
      <div class="select_shop">
        <div class="select_shop_header">
          <van-search
            v-model="searchName"
            shape="round"
            placeholder="搜索"
          />
          <div class="address_text">上海市-静安区</div>
        </div>
        <div class="select_shop_body">
          <div class="select_shop_body_info">请先选择执行人，再选择派遣门店</div>
          <ul class="select_shop_approve">
            <li class="select_shop_approve_active">
              <div class="head">亮亮</div>
            </li>
            <li>
              <div class="head">美丽</div>
            </li>
            <li>
              <div class="head">美丽</div>
            </li>
            <li>
              <div class="head">美丽</div>
            </li>
            <li>
              <div class="head">美丽</div>
            </li>
            <li>
              <div class="head">美丽</div>
            </li>
            <li>
              <div class="head">美丽</div>
            </li>
            <li>
              <div class="head">美丽</div>
            </li>
            <li>
              <div class="head">美丽</div>
            </li>
          </ul>
          <van-tabs class="select_shop_tabs" v-model="shopListAcitve" @change="changeShopList" line-width="70px" ref="shopTabs">
            <van-tab title-class="select_shop_tab" title="未选门店">
              <van-checkbox-group class="select_shop_items" v-model="checkboxed[approveIndex][0]">
                <van-checkbox class="select_shop_item" name="1" shape="square">
                  <div class="select_shop_item_cover"></div>
                  <div class="select_shop_item_info">
                    <div class="select_shop_item_info_title">德克士(火车站店) </div>
                    <div class="select_shop_item_info_site">
                      <van-icon name="location-o" size="10px" />
                      上海市静安区曹家渡万航渡路849号海森国际大厦(康定路)</div>
                  </div>
                </van-checkbox>
                <van-checkbox class="select_shop_item" name="2" shape="square">
                  <div class="select_shop_item_cover"></div>
                  <div class="select_shop_item_info">
                    <div class="select_shop_item_info_title">德克士(火车站店) </div>
                    <div class="select_shop_item_info_site">
                      <van-icon name="location-o" size="10px" />
                      上海市静安区曹家渡万航渡路849号海森国际大厦(康定路)</div>
                  </div>
                </van-checkbox>
              </van-checkbox-group>
            </van-tab>
            <van-tab title-class="select_shop_tab" title="已选门店">
              <van-checkbox-group class="select_shop_items" v-model="checkboxed[approveIndex][1]">
                <van-checkbox class="select_shop_item" name="1" shape="square">
                  <div class="select_shop_item_cover"></div>
                  <div class="select_shop_item_info">
                    <div class="select_shop_item_info_title">德克士(火车站店) </div>
                    <div class="select_shop_item_info_site">
                      <van-icon name="location-o" size="10px" />
                      上海市静安区曹家渡万航渡路849号海森国际大厦(康定路)</div>
                  </div>
                </van-checkbox>
              </van-checkbox-group>
            </van-tab>
          </van-tabs>
        </div>
      </div>

    </van-overlay>
  </div>
</template>

<script>
import iconShopSelect from '../../../../public/img/create_task/icon_shop_select.png';
export default {
  props: { componentSelectShop: { type: Object } },
  data() {
    return {
      img: { iconShopSelect, },
      show: true,
      searchName: '',
      shopListAcitve: 0,
      noChecked: [],
      checked: [],
      approveIndex: 0,
      checkboxed: [
        [],
        []
      ]
    };
  },
  created() {

    this.$notice.$emit('navigation', { title: '选择门店' });
  },
  methods: {
    changeShopList(e) {
      console.log(e);
    }
  },
  mounted() {
    this.$refs.shopTabs.resize();
  },
  watch: {
    componentSelectShop(data) {
      this.show = data.show;
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
    }
    .select_shop_items {
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
}
</style>
