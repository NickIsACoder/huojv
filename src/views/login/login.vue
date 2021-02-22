<template>
    <div class="login">
        <div class="login-logo">
            <img src="../../assets/images/logo.png" alt="奥园火炬">
        </div>

        <md-field-group>
            <md-field
                    v-model="account"
                    placeholder="请输入用户名"
                    right-icon="clear-full"
                    icon="user"
                    name="user"
                    data-vv-as="帐号"
                    @right-click="clearText"
                    class="login-input-panel"
            />

            <md-field
                    v-model="password"
                    placeholder="请输入密码"
                    :type="visiblePass ? 'text' : 'password'"
                    icon="password"
                    :right-icon="visiblePass ? 'eye-open' : 'eye-close'"
                    data-vv-as="密码"
                    name="password"
                    @right-click="visiblePass = !visiblePass"
                    class="login-input-panel"
            />

            <van-button size="large" type="primary" :loading="isLogining" v-eventlisten="{isChangePage:true,pageEvent:'点击登录按钮'}" @click="loginSubmit">登录</van-button>
        </md-field-group>
    </div>
</template>

<script>
    import field from '@/components/field/';
    import fieldGroup from '@/components/field-group/';
    import {authLogin} from '@/api/api';
    import {setLocalStorage} from '@/utils/local-storage';
    import {Toast,Button} from 'vant';
    import iconSign from '@/assets/images/icon-sigh@2x.png';
    import {setToken} from "@/utils/auth";


    export default {
        name: 'login-request',
        components: {
            [field.name]: field,
            [fieldGroup.name]: fieldGroup,
            [Button.name]: Button,
            Toast
        },
        data() {
            return {
                account: '',
                password: '',
                visiblePass: false,
                isLogining: false
            };
        },

        methods: {
            clearText() {
                this.account = '';
            },

            validate() {
                if (!this.account) {
                    Toast({
                        message: '账号不能为空',
                        icon: iconSign,
                    });
                    return false;
                } else if (!this.password) {
                    Toast({
                        message: '密码不能为空',
                        icon: iconSign,
                    });
                    return false;
                }

                return true;
            },

            login() {
                let loginData = {
                    account: this.account,
                    password: this.password,
                };
                authLogin(loginData).then(({data}) => {
                    let _data = data.data;
                    // setLocalStorage({
                    //     account: _data.account,
                    //     personName: _data.personName,
                    //     id: _data.id,
                    //     orgId: _data.orgId,
                    //     orgType:_data.orgType
                    // });
                    setToken(_data.token);
                    window.location = `#/index?account=${_data.account}&personName=${_data.personName}&orgId=${_data.orgId}&token=${_data.token}&orgType=${_data.orgType}`;
                    // this.routerRedirect();
                }).catch(error => {
                    Toast.fail(error.message);
                });
            },

            loginSubmit() {
                this.isLogining = true;
                try {
                    let vali = this.validate();
                    if (!vali) return;
                    this.login();
                    this.isLogining = false;
                } catch (err) {
                    console.log(err.message);
                    this.isLogining = false;
                }
            },

            routerRedirect() {
                // const { query } = this.$route;
                // this.$router.replace({
                //   name: query.redirect || 'home',
                //   query: query
                // });
                window.location = '#/index';
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
