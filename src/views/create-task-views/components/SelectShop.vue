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
          <van-tabs v-model="active">
            <van-tab title="未选门店">内容 1</van-tab>
            <van-tab title="已选门店">内容 2</van-tab>
          </van-tabs>
        </div>
      </div>

    </van-overlay>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: true,
      searchName: ''
    };
  },
  created() {
    this.$notice.$emit('navigation', { title: '选择门店' });
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
  }
}
</style>
