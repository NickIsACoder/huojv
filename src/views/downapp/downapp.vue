<template>
    <div class="site-page--down-app">
        <div class="content">
            <div class="show-tips" id="showTips" v-show="showTips">
                <p style="margin-bottom:20px;">链接跳转被限制了</p>
                <p>点击右上角</p>
                <p>选择在浏览器（或Safari）打开</p>
                <p>即可下载</p>
                <p class="jiantou">
                    <img src="../../assets/images/jiantou.png"/>
                </p>
            </div>

            <div class="download clear">奥园火炬系统APP下载</div>
            <div class="two-code clear">
                <img v-if="env=='pro'" src="../../assets/images/qr.png" alt=""/>
                <img v-else-if="env=='sim'" src="../../assets/images/qr-sim.png" alt=""/>
                <img v-else-if="env=='uat'" src="../../assets/images/qr-test.png" alt=""/>
                <img v-else src="../../assets/images/qr-dev.png" alt=""/>
            </div>
            <div style="text-align: center;">
                <a id="AndroidDowns" class="android-down down" :href="androidLink" @click="labelAHandle">
                    <img style="vertical-align: middle;" src="../../assets/images/down_android.png"/> Android版下载
                </a>
                <a id="iPhoneDowns" class="iPhone-down down" :href="iOSLink" @click="iosClickHandle">
                    <img src="../../assets/images/down_ios.png" style="vertical-align: middle;"/> iPhone版下载
                </a>
            </div>
        </div>
    </div>
</template>


<script>
    import request from '@/utils/request';

    export default {
        data() {
            return {
                isWeixin: false,
                androidLink: '',
                iOSLink: '',
                showTips: false,
                env: 'dev',
            }
        },
        created() {
            this.env = process.env.VUE_APP_TITLE || 'dev'
            console.log(this.env)
        },
        mounted() {
            let isWeixin = this.is_weixin()
            this.isWeixin = isWeixin
            if (isWeixin) {
                this.showTips = true;
            }

            this.getAppDownLoadLink();
        },
        methods: {
            is_weixin() {
                var ua = navigator.userAgent.toLowerCase();
                if (
                    ua.match(/MicroMessenger/i) == "micromessenger" ||
                    ua.match(/QQ/i) == "qq"
                ) {
                    return true;
                } else {
                    return false;
                }
            },
            iosClickHandle() {
                if (!this.is_weixin()) {
                    if (navigator.userAgent.match(/(iPhone|iPod|ios|iPad)/i)) {
                        return true;
                    } else {
                        alert("请用苹果手机扫描二维码进行下载");
                        return false;
                    }
                } else {
                    return false;
                }
            },
            getAppDownLoadLink() {
                let params = {};
                request({
                    url: `/sys/appversion/link`,
                    method: 'get',
                    params
                }).then(({data}) => {
                    if (data && data.code === 0) {
                        let list = data.list;

                        list.forEach(element => {
                            if (element.appType === "IOS") {
                                this.iOSLink = element.url
                            } else if (element.appType === "Android") {
                                this.androidLink = element.url
                            }
                        });
                    } else {
                    }
                    // this.dataListLoading = false
                })
            },
            labelAHandle() {
                if (this.isWeixin) {
                    return false;
                } else {
                    return true;
                }
            }
        }
    };
</script>

<style lang="scss">
    body {
        /*background: #eee;*/
    }

    .clear {
        clear: both;
    }

    .site-page--down-app {
        height: 100%;

        .content {
            /*height: 90%;*/
            position: relative;
        }

        .content img {
            max-width: 100%;
        }

        .download {
            font-size: 24Px;
            text-align: center;
            margin: 20Px 0;
            font-weight: bold;
            color: #000000;
            opacity: 0.7
        }

        .two-code {
            text-align: center;
        }

        .two-code img {
            max-width: 50%
        }

        .footer {
            padding-top: 2em;
            margin: 0 auto;
            width: 99%;
            height: 10%;
        }

        .footer div {
            font-size: 12Px;
            text-align: center;
        }


        a.android-down {
            background: #00bd3a;
        }

        a.iPhone-down {
            background: #4293ec;
        }

        a.android-down em {
            width: 32Px;
            background-position: 0;
        }

        a.iPhone-down em {
            width: 30Px;
            font-size: 12Px;
            background-position: 0 -42Px;
        }


        a.down {
            width: 274Px;
            height: 70Px;
            display: block;
            margin: 25Px auto;
            font-size: 20Px;
            color: #fff;
            vertical-align: middle;
            text-decoration: none;
            padding: 20Px 0 0;
            text-align: center;
            vertical-align: middle;
            border-radius: 5Px;
        }

        .show-tips {
            width: 100%;
            background: #fff;
            padding: 20Px 30Px;
        }

        .show-tips p {
            font-size: 18Px;
            font-family: \5FAE\8F6F\96C5\9ED1;
            color: #000;
            font-weight: bold;
            line-height: 30Px;
            margin: 0;
        }

        .jiantou {
            position: absolute;
            right: 12Px;
            top: 12Px;
        }

        .directions p {
            line-height: 24Px;
        }

        a.desktop-down {
            background: #ff5800;
        }

        a.desktop-down em {
            width: 32Px;
            background-position: 0Px -80Px;
        }
    }
</style>
