<template>
    <div class="error">
        <div class="error-title">这是开发环境的错误页面</div>
        <div class="error-info">错误接口：{{url}}</div>
        <div class="error-info">参数：{{params}}</div>
        <div class="error-info">错误信息：{{errorText}}</div>

        <div style="text-align: center;">
            <button class="error-btn" @click="onClickLeft">返回上上一页</button>
            <button class="error-btn" @click="routerRedirect" style="margin-left: 10px;">返回首页</button>
        </div>
    </div>
</template>

<script>
    import {getUrlParam} from "@/utils/common";

    export default {
        name: 'error',
        components: {

        },
        data() {
            return {
                url:getUrlParam('url') || '',
                errorText:getUrlParam('errorText') || '未知错误',
                params:getUrlParam('params') || '无传参'
            };
        },

        methods: {
            onClickLeft(){
                window.history.go(-2);
            },
            routerRedirect() {
                // window.location = '#/index';
                window.location = `#/index?account=${getUrlParam('account')}&personName=${getUrlParam('personName')}&orgId=${getUrlParam('orgId')}&token=${getUrlParam('token')}&orgType=${getUrlParam('orgType')}&id=${getUrlParam('id')}`
	            // this.$router.push({path:'/index',query:{}});
            },
        }
    };
</script>


<style lang="scss" scoped>
    @import '../../assets/scss/mixin';

    .login {
        position: relative;
        background: url("../../assets/images/bg@2x.png") no-repeat;
        background-size: 100% auto;
        background-position: center bottom;
        height: 100%;

        .login-logo {
            padding-top: 51px;
            text-align: center;

            & > img {
                width: 63px;
                height: 83px;
            }
        }

        .field_group {
            margin-top: 60px;
            padding-left: 40px;
            padding-right: 40px;
        }

        .login-input-panel {
            border: 0;
            border-bottom: 1px solid #E8E8E8;
            border-radius: 0;
            padding-left: 25px;
        }


        .van-button {
            &.van-button--primary {
                height: 45px;
                background: #229F5F;
                color: #ffffff;
                margin-top: 24px;
                border-radius: 5px;
            }
        }
    }

</style>
