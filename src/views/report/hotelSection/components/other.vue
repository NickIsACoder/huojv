<template>
    <div class="report-index">
        <div class="main-content">
            <div class="data-content-panel no-top-left-radius clearfix" style="overflow: visible;">
                <ul class="data-info-list pb-20 two-cols"
                    style="border-bottom: 0;" :class="costList && costList.length >= 2 ? '' : 'boxCenter'">
                    <li v-for="item of costList" :key="item.id" class="mt-20">
                        <div class="data-type middle">{{item.name}}</div>
                        <div v-if="item.haveData">
                            <div class="data-box mt-5">
                                <label class="value middle" v-text="item.income"></label>
                                <label class="unit">{{item.unit}}</label>
                                <i v-if="parseFloat(item.income)>parseFloat(item.incomeLast)"
                                   class="huojv-ico-up normal ml-5"></i>
                                <i v-if="parseFloat(item.income)<parseFloat(item.incomeLast)"
                                   class="huojv-ico-down normal ml-5"></i>
                            </div>
                            <div class="data-type mt-10">同期：<label v-text="item.incomeLast"></label>{{item.unit}}
                            </div>
                            <div class="data-type">预算：<label v-text="item.incomePlan || '-'"></label>{{item.unit}}</div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import scrollFixed from '@/mixin/scroll-fixed';
    import {
        List,
        PullRefresh,
        Icon
    } from 'vant';
    import {getLocalStorage} from '@/utils/local-storage';
    import request from '@/utils/request';
    import $ from 'jquery'
    import echarts from 'echarts'
    import {getUrlParam} from '@/utils/common'

    export default {
        mixins: [scrollFixed],
        data() {
            return {
                orgType: 2,
                queryPeriod: '',
                costList: [],
            }
        },
        props: ['tab1', 'orgId'],
        watch: {
            'tab1': function (newVal, oldVal) {
                this.init();
            },
            'orgId': function (newVal, oldVal) {
                this.init();
            },
        },
        mounted() {
            this.$nextTick(() => {
                $('.el-table__header-wrapper').scroll(function () {
                    let scrollLeft = $(this).scrollLeft();
                    $(this).next().scrollLeft(scrollLeft);
                });

                $(".el-table__fixed-body-wrapper").scroll(function () {
                    let scrollTop = $(this).scrollTop();
                    $(this).parent().prev().scrollTop(scrollTop);
                })
            })

            this.init();
        },
        methods: {
            init(tab1) {
                this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType;
                switch (this.tab1) {
                    case 1:
                        this.queryPeriod = '年度';
                        break;
                    case 2:
                        this.queryPeriod = '季度';
                        break;
                    case 3:
                        this.queryPeriod = '月度';
                        break;
                    case 4:
                        this.queryPeriod = '日';
                        break;
                }
                this.getOperationData();
            },

            // 获取营运数据
            getOperationData() {
                request({
                    url: '/app-api/culturalTourism/hotel/overallOperation',
                    method: 'post',
                    data: {orgId: this.orgId, queryPeriod: this.queryPeriod}
                }).then(({data}) => {
                    if (data.data.length && data.code === 0) {
                      let unit = this.tab1 == 4?'元':'万元';
                        this.costList = []
                        let _data = data.data[0]
                        //泉林泉世界收入
                        let qlqincome = this.changEmpty(_data.qlqincome, 'amount')
                        let qlqincomelast = this.changEmpty(_data.qlqincomelast, 'amount')
                        let qlqincomeplan = this.changEmpty(_data.qlqincomeplan, 'amount')
                        if (qlqincome || qlqincomelast || qlqincomeplan) {
                            this.costList.push(
                                {
                                    id: 1,
                                    name: '泉林泉世界收入',
                                    income: qlqincome || '-',
                                    incomeLast: qlqincomelast || '-',
                                    incomePlan: qlqincomeplan || '-',
                                    haveData: true,
                                    unit: unit
                                }
                            );
                        }
                        //水上乐园收入
                        let waterparkincome = this.changEmpty(_data.waterparkincome, 'amount')
                        let waterparkincomelast = this.changEmpty(_data.waterparkincomelast, 'amount')
                        let waterparkincomeplan = this.changEmpty(_data.waterparkincomeplan, 'amount')
                        if (waterparkincome || waterparkincomelast || waterparkincomeplan) {
                            this.costList.push(
                                {
                                    id: 2,
                                    name: '水上乐园收入',
                                    income: waterparkincome || '-',
                                    incomeLast: waterparkincomelast || '-',
                                    incomePlan: waterparkincomeplan || '-',
                                    haveData: true,
                                    unit: unit
                                }
                            );
                        }
                        //卡丁车收入
                        let kartincome = this.changEmpty(_data.kartincome, 'amount')
                        let kartincomelast = this.changEmpty(_data.kartincomelast, 'amount')
                        let kartincomeplan = this.changEmpty(_data.kartincomeplan, 'amount')
                        if (kartincome || kartincomelast || kartincomeplan) {
                            this.costList.push(
                                {
                                    id: 3,
                                    name: '卡丁车收入',
                                    income: kartincome || '-',
                                    incomeLast: kartincomelast || '-',
                                    incomePlan: kartincomeplan || '-',
                                    haveData: true,
                                    unit: unit
                                }
                            );
                        }
                        //那金谷收入
                        let njgincome = this.changEmpty(_data.njgincome, 'amount')
                        let njgincomelast = this.changEmpty(_data.njgincomelast, 'amount')
                        let njgincomeplan = this.changEmpty(_data.njgincomeplan, 'amount')
                        if (njgincome || njgincomelast || njgincomeplan) {
                            this.costList.push(
                                {
                                    id: 4,
                                    name: '那金谷收入',
                                    income: njgincome || '-',
                                    incomeLast: njgincomelast || '-',
                                    incomePlan: njgincomeplan || '-',
                                    haveData: true,
                                    unit: unit
                                }
                            );
                        }
                        //康体中心收入
                        let ktzxincome = this.changEmpty(_data.ktzxincome, 'amount')
                        let ktzxincomelast = this.changEmpty(_data.ktzxincomelast, 'amount')
                        let ktzxplan = this.changEmpty(_data.ktzxplan, 'amount')
                        if (ktzxincome || ktzxincomelast || ktzxplan) {
                            this.costList.push(
                                {
                                    id: 5,
                                    name: '康体中心收入',
                                    income: ktzxincome || '-',
                                    incomeLast: ktzxincomelast || '-',
                                    incomePlan: ktzxplan || '-',
                                    haveData: true,
                                    unit: unit
                                }
                            );
                        }
                        //其他收入
                        let elseIncome = this.changEmpty(_data.elseIncome, 'amount')
                        let elseIncomeLast = this.changEmpty(_data.elseIncomeLast, 'amount')
                        let elseIncomePlan = this.changEmpty(_data.elseIncomePlan, 'amount')
                        if (elseIncome || elseIncomeLast || elseIncomePlan) {
                            this.costList.push(
                                {
                                    id: 6,
                                    name: '其他收入',
                                    income: elseIncome || '-',
                                    incomeLast: elseIncomeLast || '-',
                                    incomePlan: elseIncomePlan || '-',
                                    haveData: true,
                                    unit: unit
                                }
                            );
                        }
                    } else {
                        this.initCostList();
                    }
                }).catch((e) => {
                    this.initCostList();
                    console.log('getBoardData-err', e);
                });
            },
            changEmpty(obj, key, str = null) {
                if (!obj) {
                    return str
                } else {
                    return obj[key]
                }
            },
            initCostList() {
                this.costList = [
                    {id: 1, name: '暂无数据', income: '', incomeLast: '', incomePlan: '', haveData: false, unit: ''},
                ]
            },
        },
        components: {
            [List.name]: List,
            [PullRefresh.name]: PullRefresh,
            [Icon.name]: Icon,
        }
    };
</script>


<style lang="scss" scoped>
    .boxTitle {
        font-size: 14px;
        color: #333333;
        margin: 18px 0;
    }

    .boxTitle2 {
        font-size: 14px;
        color: #333333;
        margin: 0;
    }

    .boxCenter {
        display: flex;
        justify-content: center;
    }

    .fR {
        color: #B2B2B2;
        font-size: 11px;
        float: right;
    }

    // .tableToggle{
    //     text-align: right;
    //     margin: 0;

    // }
    .tableBox {
        margin-bottom: 80px;
    }

    .more {
        font-size: 12px;
        color: #333333;
        float: right;
        margin-top: 12px;

        &.up {
            color: #209B5C;
        }
    }
</style>
