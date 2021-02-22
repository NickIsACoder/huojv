<template>
	<div class="detail-panel height100 white-bg">
		<van-nav-bar style="position: fixed; top: 0; width: 100%;" :title="title" left-arrow @click-left="onClickLeft"
		             v-eventlisten="{isChangePage:true,pageEvent:'点击返回按钮'}"/>
		<!--		<van-pull-refresh v-model="isLoading" success-text="刷新成功" loading-text="正在刷新..." @refresh="reloadWindow">-->

		<div class="padding-nav">
			<van-sticky class="has-nav-sticky">
				<div class="data-content-panel p-l-r-15" style="padding-bottom: 0;">
					<ul class="huojv-data-list pt-15 list-title two-rows" v-show="pageType != 3" style="overflow-x: auto;">
						<li class="title" style="padding: 0; width: 501px;">
							<label style="width: 50px; padding-left: 10px;">序号</label>
							<label style="width: 90px; text-align: center;"
							       v-text="orgType <= 2 ? '二级集团' : (orgType > 2 && orgType < 5 ? '公司' : '项目')"></label>
							<label style="width: 100px; text-align: center;"
							       v-text="pageType == 1 ? '供货面积(万㎡)' : '开工面积(万㎡)'">供销比</label>
							<label style="width: 100px; text-align: center;">销售面积(万㎡)</label>
							<label style="width: 80px; text-align: center;"
							       v-text="pageType == 1 ? '供销比' : '开销比'">供销比</label>
							<label style="width: 80px; text-align: center;">负责人</label>
						</li>
					</ul>

					<el-table stripe
					          class="huo-list-table main-theme-table huojv-data-list list-title1 pt-15" size="mini"
					          highlight-current-row
					          :data="[]" v-show="pageType == 3">
						<el-table-column prop="projOrgName" label="项目" width="100" align="center"></el-table-column>
						<el-table-column prop="duration" label="逾期节点" width="120" align="center"></el-table-column>
						<el-table-column prop="duration" label="逾期天数" width="80" align="center"></el-table-column>
						<el-table-column prop="adUserName" label="工程负责人" width="100" align="center"></el-table-column>
					</el-table>
				</div>
			</van-sticky>
			<div class="detail-table-panel">
				<!--				<van-pull-refresh v-model="isLoading" @refresh="onRefresh">-->
				<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
					<el-table stripe class="huo-list-table main-theme-table huojv-data-list hide-header" size="mini"
					          highlight-current-row :data="tableList"
					          v-show="pageType == 1">
						<el-table-column prop="rowNumber" label="序号" width="50"></el-table-column>
						<el-table-column prop="orgName"
						                 :label="orgType <= 2 ? '二级集团' : (orgType > 2 && orgType < 5 ? '公司' : '项目')" width="90" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.orgType==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,scope.row.orgType)">{{scope.row.orgName}}</span>
                                <span v-else>{{scope.row.orgName}}</span>
                            </template>
                        </el-table-column>
						<el-table-column prop="supplyArea" label="供货面积(万㎡)" width="100"
						                 align="center"></el-table-column>
						<el-table-column prop="saleArea" label="销售面积(万㎡)" width="100" align="center"></el-table-column>
						<el-table-column prop="supplyRate" label="供销比" width="80" align="center"></el-table-column>
						<el-table-column prop="adUserName" label="负责人" align="center" width="80"></el-table-column>
					</el-table>

					<el-table stripe class="huo-list-table main-theme-table huojv-data-list hide-header" size="mini"
					          highlight-current-row :data="tableList"
					          v-show="pageType == 2">
						<el-table-column prop="rowNumber" label="序号" width="50"></el-table-column>
						<el-table-column prop="orgName"
						                 :label="orgType <= 2 ? '二级集团' : (orgType > 2 && orgType < 5 ? '公司' : '项目')" width="90" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.orgType==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,scope.row.orgType)">{{scope.row.orgName}}</span>
                                <span v-else>{{scope.row.orgName}}</span>
                            </template>
                        </el-table-column>
						<el-table-column prop="expensesArea" label="开工面积(万㎡)" width="100"
						                 align="center"></el-table-column>
						<el-table-column prop="saleArea" label="销售面积(万㎡)" width="100" align="center"></el-table-column>
						<el-table-column prop="expensesRate" label="开销比" width="80" align="center">
						</el-table-column>
						<el-table-column prop="adUserName" label="负责人" align="center" width="80"></el-table-column>
					</el-table>

					<el-table stripe
					          class="huo-list-table main-theme-table huojv-data-list hide-header list-data1" size="mini"
					          highlight-current-row
					          :data="tableList" v-show="pageType == 3">
						<el-table-column prop="projectName" label="项目" width="100" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.orgType==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.projectGUID,scope.row.orgType)">{{scope.row.projectName}}</span>
                                <span v-else>{{scope.row.projectName}}</span>
                            </template>
                        </el-table-column>
						<el-table-column prop="taskName" label="逾期节点" width="120" align="center"></el-table-column>
						<el-table-column prop="yqDate" label="逾期天数" width="80" align="center"></el-table-column>
						<el-table-column prop="dutyUserName" label="工程负责人" width="100" align="center"></el-table-column>
					</el-table>
				</van-list>
				<!--				</van-pull-refresh>-->
			</div>

		</div>
		<!--		</van-pull-refresh>-->
	</div>
</template>

<script>
    import {
        mapState
    } from 'vuex'
    import scrollFixed from '@/mixin/scroll-fixed';
    import {
        List,
        PullRefresh,
        Toast,
        Sticky,
        NavBar
    } from 'vant';
    import $ from 'jquery';
    import {
        getLocalStorage
    } from '@/utils/local-storage';
    import request from '@/utils/request';
    import {
        getUrlParam,jumpToPj
    } from '@/utils/common';


    export default {
        mixins: [scrollFixed],

        data() {
            return {
                // orgId: getLocalStorage(['orgId']).orgId,

                tab: 1,
                pageType: 1,
                title: '',
                loading: false, //上拉加载
                isLoading: false, //下拉刷新,从第一页开始
                isLoad: false,
                finished: false, //下拉加载完,如果没有数据设置true
                tableList: [],
                size: 20,
                current: 1,
                orgType: 2
            };
        },

        computed: {
            ...mapState({
                orgId: state => state.orgId || getLocalStorage(['orgId']).orgId
            })
        },

        watch: {
            '$store.state.orgId': function (newVal, oldVal) {
                this.init();
                // this.onRefresh();
            }
        },
        mounted() {
            this.init();

            this.$nextTick(() => {
                $('.list-title').scroll(function () {
                    let scrollLeft = $(this).scrollLeft();
                    $('.el-table__body-wrapper').scrollLeft(scrollLeft);
                });
                $(".el-table__body-wrapper").scroll(function () {
                    let scrollLeft = $(this).scrollLeft();
                    $('.list-title').scrollLeft(scrollLeft);
                })

                $('.list-title1 .el-table__header-wrapper').scroll(function () {
                    let scrollLeft = $(this).scrollLeft();
                    $(".list-data1 .el-table__body-wrapper").scrollLeft(scrollLeft);
                });

                $(".list-data1 .el-table__body-wrapper").scroll(function () {
                    let scrollLeft = $(this).scrollLeft();
                    $('.list-title1 .el-table__header-wrapper').scrollLeft(scrollLeft);
                })

                // $('.el-table__header-wrapper').scroll(function() {
                // 	let scrollLeft = $(this).scrollLeft();
                // 	$(this).next().scrollLeft(scrollLeft);
                // });
            })
        },

        methods: {
            jumpToPj,
            reloadWindow() {
                setTimeout(() => {
                    window.location.reload()
                    this.isLoading = false;
                }, 500)
            },
            onClickLeft() {
                // window.history.go(-1);
                this.$router.go(-1)
            },
            init() {
                this.current = 1;
                this.tableList = [];
                this.tab = this.$route.query.tab;
                this.pageType = this.$route.query.pageType;
                // this.orgId = this.$route.query.orgId;
                this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType;

                // this.orgId = getUrlParam('chooseOrgId') || getUrlParam('orgId') || getLocalStorage('orgId').orgId

                if (this.pageType == 1) {
                    // if(this.tab == 1){
                    //     this.title = '公司供销比健康偏差-供应过大'
                    // }else if(this.tab == 2){
                    //     this.title = '公司供销比健康偏差-供应不足'
                    // }

                    this.title = '供销比情况'
                } else if (this.pageType == 2) {
                    // if(this.tab == 1){
                    //     this.title = '公司开销比健康偏差-开销过大'
                    // }else if(this.tab == 2){
                    //     this.title = '公司开销比健康偏差-开销不足'
                    // }

                    this.title = '开销比情况'
                }else if(this.pageType == 3){
                    this.title = '工程节点逾期情况'
                }

            },
            setTableData(isRefresh) {
                let params = {
                    current: this.current,
                    size: this.size,
                    isOverSupply: '',
                    isOverExpenses: '',
                    orgId: this.$route.query.orgId
                };
                if(this.pageType == 1){
                    delete params.isOverExpenses
                }else if(this.pageType == 2){
                    delete params.isOverSupply
                }else if(this.pageType == 3){
                    delete params.isOverExpenses;
                    delete params.isOverSupply;
                }

                request({
                    url: this.pageType == 3 ? '/app-api/engineer/getNodeOverview' : `/app-api/engineer/engineerSupplyMarketingBalance`,
                    method: this.pageType == 3 ? 'post' : 'get',
	                data:params,
                    params
                }).then(({data}) => {
                    if (data.code === 0 && data.data) {
                        let list = this.pageType == 3 ? data.data : (data.data.records || []);
                        this.tableList = isRefresh ? list : this.tableList.concat(list);
                        this.loading = false;
                        this.isLoading = false;
                        this.isLoad = false;

                        if (null == list || list.length < this.size || this.tableList.length >= data.total) {
                            this.finished = true;
                        } else {
                            if (this.current > 1) {
                                let scrollTop = $(document).scrollTop();
                                $(document).scrollTop(scrollTop - 300);
                            }
                            this.current += 1;
                            this.finished = false;
                        }
                    } else {
                        this.tableList = [];
                        this.current = 1;
                        this.loading = false;
                        this.isLoading = false;
                        this.finished = true;
                        this.isLoad = false;
                    }
                }).catch((e) => {
                    this.tableList = [];
                    this.current = 1;
                    this.loading = false;
                    this.isLoading = false;
                    this.finished = true;
                    this.isLoad = false;
                    console.log('getBoardData-err', e);
                });
                // this.tab2 = this.$route.query.tab2;
            },
            onLoad() {
                if (this.isLoad) return;
                this.isLoad = true;
                this.setTableData();
            },

            onRefresh() {
                this.current = 1;
                this.loading = false;
                this.isLoading = false;
                this.finished = false;
                this.isLoad = false;
                // this.tableList = [];
                this.setTableData(true);
            }
        },

        components: {
            [List.name]: List,
            [PullRefresh.name]: PullRefresh,
            [NavBar.name]: NavBar,
            [Sticky.name]: Sticky,
            Toast
        }
    };
</script>


<style lang="scss" scoped>

</style>
