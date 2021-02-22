<template>
    <div class="report-index has-tabs pb-20">
        <ul class="huojv-tabs fixed-tabs two-cols">
            <li @click="checkTab1(1)" v-eventlisten="{isChangePage:false,pageEvent:'切换到30天内合同交付'}" :class="[tab1 == 1 ? 'active' : '']"><label>30天内合同交付</label></li>
            <li @click="checkTab1(2)" v-eventlisten="{isChangePage:false,pageEvent:'切换到逾期合同交付'}" :class="[tab1 == 2 ? 'active' : '']"><label>逾期合同交付</label></li>
        </ul>
        <van-pull-refresh v-model="isLoading" success-text="刷新成功" loading-text="正在刷新..." @refresh="reloadWindow()">
            <div class="main-content mt-15">

                <div class="data-content-panel pt-15">
<!--                    <ul class="huojv-data-list three-cols list-title" style="overflow-x: auto;">-->
<!--                        <li class="title" style="padding: 0;">-->
<!--                            <label style="width: 60px; padding-left: 10px; box-sizing: border-box;">序号</label>-->
<!--                            <label style="width: 180px;">公司</label>-->
<!--                            <label style="width: calc(100% - 240px); text-align: center;">供销比</label>-->
<!--                        </li>-->
<!--                    </ul>-->
                    <div class="list-data1">
                        <van-list
                                v-model="loading"
                                :finished="finished"
                                finished-text="没有更多了"
                                @load="onLoad"
                        >
                            <el-table stripe
                                      class="huo-list-table main-theme-table huojv-data-list not-hide-text" size="mini" highlight-current-row
                                      :data="dataList1" v-show="tab1 == 1">
                                <el-table-column prop="rowNum" label="序号" width="50"></el-table-column>
                                <el-table-column prop="orgName" label="项目" width="80" align="center">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.orgType == 6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,scope.row.orgType)">{{scope.row.orgName}}</span>
                                        <span v-else>{{ scope.row.orgName }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="stayPayAmount" label="合同金额(亿)" width="100" align="center">
                                    <template slot="header" slot-scope="scope">
                                        <div @click="sortData('stayPayAmount')">
                                            <span>合同金额(亿)</span>
<!--                                            <i :class="[sortColumn === 'InvestDecheRate' ? 'green-font' : 'light-green-font']"-->
<!--                                               class="el-icon-caret-bottom" style="margin-left: 2px;"></i>-->
                                            <label class="table-sort-ico">
                                                <i :class="[sortColumn == 'stayPayAmount' && sortType === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
                                                <i :class="[sortColumn == 'stayPayAmount' && sortType === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
                                            </label>
                                        </div>
                                    </template>
                                    <template slot-scope="scope">
                                        <span>{{scope.row.stayPayAmount || '-'}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="aDUserName" label="项目负责人" align="center">
                                </el-table-column>
                            </el-table>

                            <el-table stripe
                                      class="huo-list-table main-theme-table huojv-data-list not-hide-text" size="mini" highlight-current-row
                                      :data="dataList2" v-show="tab1 == 2">
                                <el-table-column prop="rowNum" label="序号" width="50"></el-table-column>
                                <el-table-column prop="orgName" label="项目" width="80" align="center">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.orgType == 6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,scope.row.orgType)">{{scope.row.orgName}}</span>
                                        <span v-else>{{ scope.row.orgName }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="overPayAmount" label="逾期金额(亿)" width="90" align="center">
                                    <template slot="header" slot-scope="scope">
                                        <div @click="sortData('overPayAmount')">
                                            <span>逾期金额(亿)</span>
                                            <!--                                            <i :class="[sortColumn === 'InvestDecheRate' ? 'green-font' : 'light-green-font']"-->
                                            <!--                                               class="el-icon-caret-bottom" style="margin-left: 2px;"></i>-->
                                            <label class="table-sort-ico">
                                                <i :class="[sortColumn == 'overPayAmount' && sortType === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
                                                <i :class="[sortColumn == 'overPayAmount' && sortType === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
                                            </label>
                                        </div>
                                    </template>
                                    <template slot-scope="scope">
                                        <span>{{scope.row.overPayAmount || '-'}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="aDUserName" label="项目负责人" align="center">
                                </el-table-column>
                            </el-table>

                        </van-list>
                    </div>
                </div>

            </div>
        </van-pull-refresh>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import scrollFixed from '@/mixin/scroll-fixed';
    import { List, PullRefresh, Toast } from 'vant';
    import {getLocalStorage} from '@/utils/local-storage';
    import $ from 'jquery';
    import request from '@/utils/request';
    import {getUrlParam,jumpToPj} from '@/utils/common'

    export default {
        mixins: [scrollFixed],

        data() {
            return {
                // orgId:getLocalStorage(['orgId']).orgId,

                tab1:1,
                loading:false,
                isLoading:false,
                finished:false,
                isLoad:false,
                size:20,
                current:1,
                dataList1:[],
                dataList2:[],
                sortColumn:'stayPayAmount',
                sortType:'DESC',
                orgType: getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType
            };
        },

        computed: {
            ...mapState({
                orgId: state => state.orgId || getLocalStorage(['orgId']).orgId
            })
        },

        mounted() {
            // this.init();
            this.$nextTick(() => {
                // $(".list-title").scroll(function () {
                //     let scrollLeft = $(this).scrollLeft();
                //     $('.list-data1 .el-table__body-wrapper').scrollLeft(scrollLeft);
                // })
                //
                // $(".list-data1 .el-table__body-wrapper").scroll(function () {
                //     let scrollLeft = $(this).scrollLeft();
                //     $('.list-title').scrollLeft(scrollLeft);
                // })

                $('.el-table__header-wrapper').scroll(function () {
                    let scrollLeft = $(this).scrollLeft();
                    $(this).next().scrollLeft(scrollLeft);
                });
            })
        },

        watch:{
            '$store.state.orgId':function(newVal, oldVal){
                this.onRefresh();
            }
        },

        methods: {
            jumpToPj,
            reloadWindow(){
                setTimeout(() => {
                    window.location.reload();
                    this.isLoading = false;
                },500)
            },
            // 获取计划进度数据
            getList(isRefresh){
                let url = '/app-api/custonService/carriedWarning';
                let params = {
                    size: this.size,
                    current: this.current,
                    orgId:this.orgId,
                    sortColumn: this.sortColumn,
                    sortType:this.sortType
                };

                request({
                    url: url,
                    method: 'get',
                    params
                }).then(({data}) => {
                    if(data.code === 0 && data.data){
                        const list = data.data.records;

                        if(this.tab1 == 1){
                            this.dataList1 = isRefresh ? list : this.dataList1.concat(list);
                            this.dataList1.forEach((item,index) => {
                                item.rowNum = index + 1;
                            })
                        }else if(this.tab1 == 2){
                            this.dataList2 = isRefresh ? list : this.dataList2.concat(list);
                            this.dataList2.forEach((item,index) => {
                                item.rowNum = index + 1;
                            })
                        }

                        this.loading = false;
                        this.isLoading = false;
                        this.isLoad = false;

                        if (null == list || list.length < this.size) {
                            this.finished = true;
                        } else {
                            if(this.current > 1){
                                let scrollTop = $(document).scrollTop();
                                $(document).scrollTop(scrollTop - 300);
                            }
                            this.current += 1;
                            this.finished = false;
                        }
                    }else{
                        this.dataList1 = [];
                        this.dataList2 = [];
                        this.current = 1;
                        this.loading = false;
                        this.isLoading = false;
                        this.isLoad = false;
                        this.finished = true;
                    }
                }).catch((e) => {
                    this.dataList = [];
                    this.current = 1;
                    this.loading = false;
                    this.isLoading = false;
                    this.isLoad = false;
                    this.finished = true;
                });
            },

            sortData(sortColumn){
                if(this.sortColumn != sortColumn){
                    this.sortColumn = sortColumn;
                    this.sortType = 'DESC';
                }else{
                    this.sortType = this.sortType == 'DESC' ? 'ASC' : 'DESC';
                }

                this.onRefresh();
            },

            onLoad(){
                if(this.isLoad) return;  // 如果当前处于加载状态
                this.isLoad = true;

                this.getList();
            },

            onRefresh(){
                this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType;
                this.current = 1;
                // this.dataList = [];
                this.getList(true);
            },

            // 切换  签约  回款  交付
            checkTab1(tab1){
                this.tab1 = tab1;
                if(this.tab1 == 1){
                    this.sortColumn = 'stayPayAmount';
                    this.sortType = 'DESC';
                }else if(this.tab1 == 2){
                    this.sortColumn = 'overPayAmount';
                    this.sortType = 'DESC';
                }
                this.onRefresh();
            },
        },

        components: {
            [List.name]: List,
            [PullRefresh.name]:PullRefresh,
            Toast
        }
    };
</script>


<style lang="scss" scoped>

</style>
