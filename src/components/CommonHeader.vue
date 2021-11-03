<template>
<div class="common-header">
    <div class="logo"><i></i></div>
    <a href="javascript:void(0)" class="left-icon" @click="toBack">back</a>
</div>

</template>
<script>
// import Vue from 'vue';
// import { Header, Button } from 'mint-ui';
// Vue.component('mt-header', Header);
// Vue.component('mt-button', Button);
export default {
    name: 'CommonHeader',
    title () {
        return ''
    },
    created () {},
    methods: {
        toBack () {
            console.log('回到全家或返回');
        },
    }
}
</script>
<style lang="scss" scoped>
.common-header {
    display: flex;
    width: 100%;
    height: 50px;
    background: #fff;
    .logo {
        flex: 1;
        i {
            width: 120px;
            height: 50px;
            font-size: 0;
            display: inline-block;
            background-image: url(http://103.13.247.70:8091/gisApp/img/common/logo.svg);
            background-repeat: no-repeat;
            background-position: 50%;
            background-size: 100% auto;
            -webkit-transform: none;
            transform: none;
        }
    }
    .left-icon {
        position: absolute;
        top: 0;
        left: 10px;
        display: block;
        width: 20px;
        height: 20px;
        margin: 15px 0 0 0;
        background: url(http://103.13.247.70:8091/gisApp/img/common/sprite_new.svg);
        background-position: 0 -44px;
        text-indent: -9999px;
    }
    // .mint-header {
    //     height: 50px;
    //     line-height: 50px;
    //     background: #fff;
    //     border-bottom: 1px solid #333;
    //     color: #6EC56B;
    //     font-size: 16px;
    // }
}
</style>