<template>
	<div class="report-index">
		<div class="main-content" style="width: 100%;">
			<div class="data-content-panel no-top-left-radius clearfix" style="overflow: visible;">
				<div class="text-center">
					<div class="mb-15">
						<ul class="huojv-tabs two-cols">
							<li @click="checkTab2(1)" v-eventlisten="{isChangePage:false,pageEvent:'切换到大确权逾期未办明细'}"
							    :class="[tab2 == 1 ? 'active' : '']"><label>大确权逾期未办明细</label></li>
							<li @click="checkTab2(2)" v-eventlisten="{isChangePage:false,pageEvent:'切换到分户产权未办明细'}"
							    :class="[tab2 == 2 ? 'active' : '']"><label>分户产权未办明细</label></li>
						</ul>
					</div>
				</div>
			</div>
			<div class="data-content-panel mt--10">
				<van-sticky class="fixed-padding-title">
					<div style="padding-bottom: 0;">
						<ul class="huojv-data-list list-title1" style="overflow-x: auto;" v-show="tab2 == 1">
							<li class="title" style="width: 501px; padding: 0;">
								<label style="width: 50px; text-align: center;">序号</label>
								<label style="width: 80px; ">项目名称</label>
								<label style="width: 100px; ">逾期未办</label>
								<label style="width: 100px; " @click="sortData('overdueDays')">
									逾期天数
									<i :class="[sortColumn === 'overdueDays' ? 'green-font' : 'light-green-font']"
									   class="el-icon-caret-bottom" style="margin-left: 2px;"></i>
								</label>
								<label style="width: 90px; " @click="sortData('overdueAmounts')">
									货值({{this.unit}})
									<i :class="[sortColumn === 'overdueAmounts' ? 'green-font' : 'light-green-font']"
									   class="el-icon-caret-bottom" style="margin-left: 2px;"></i>
								</label>
								<label style="width: 80px; text-align: center;">负责人</label>
							</li>
						</ul>

						<ul class="huojv-data-list list-title2" style="overflow-x: auto;" v-show="tab2 == 2">
							<li class="title" style="width: 481px; padding: 0;">
								<label style="width: 50px; text-align: center;">序号</label>
								<label style="width: 80px; ">项目名称</label>
								<label style="width: 95px; " @click="sortData('householdsCount')">
									应办户数
									<i :class="[sortColumn === 'householdsCount' ? 'green-font' : 'light-green-font']"
									   class="el-icon-caret-bottom" style="margin-left: 2px;"></i>
								</label>
								<label style="width: 95px; " @click="sortData('unHouseholdsCount')">
									未办户数
									<i :class="[sortColumn === 'unHouseholdsCount' ? 'green-font' : 'light-green-font']"
									   class="el-icon-caret-bottom" style="margin-left: 2px;"></i>
								</label>
								<label style="width: 80px; " @click="sortData('householdsRate')">
									占比
									<i :class="[sortColumn === 'householdsRate' ? 'green-font' : 'light-green-font']"
									   class="el-icon-caret-bottom" style="margin-left: 2px;"></i>
								</label>
								<label style="width: 80px; text-align: center;">负责人</label>
							</li>
						</ul>
					</div>
				</van-sticky>

				<van-list
						v-model="loading"
						:finished="finished"
						finished-text="没有更多了"
						@load="onLoad"
				>
					<div class="list-data1">
						<el-table stripe
						          class="huo-list-table main-theme-table huojv-data-list hide-header" size="mini" highlight-current-row
						          :data="tableList1" v-show="tab2 == 1">
							<el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
							<el-table-column prop="orgName" label="项目名称" width="80" align="center">
                                <template slot-scope="scope">
                                    <span :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,scope.row.orgType)">{{scope.row.orgName}}</span>
                                </template>
                            </el-table-column>
							<el-table-column prop="overdueNode" label="逾期未办" width="100" align="center"></el-table-column>
							<el-table-column prop="overdueDays" label="逾期天数" width="100" align="center">
								<template slot="header" slot-scope="scope">
									<div @click="sortData('overdueDays')">
										<span>逾期天数</span>
										<i :class="[sortColumn === 'overdueDays' ? 'green-font' : 'light-green-font']"
										   class="el-icon-caret-bottom" style="margin-left: 2px;"></i>
									</div>
								</template>
							</el-table-column>
							<el-table-column prop="overdueAmounts" label="货值(亿)" width="90" align="center">
								<template slot="header" slot-scope="scope">
									<div @click="sortData('overdueAmounts')">
										<span>货值(亿)</span>
										<i :class="[sortColumn === 'overdueAmounts' ? 'green-font' : 'light-green-font']"
										   class="el-icon-caret-bottom" style="margin-left: 2px;"></i>
									</div>
								</template>
							</el-table-column>
							<el-table-column prop="adUserName" label="负责人" width="80" align="center"></el-table-column>
						</el-table>
					</div>
					<div class="list-data2">
						<el-table stripe
						          class="huo-list-table main-theme-table huojv-data-list hide-header" size="mini" highlight-current-row
						          :data="tableList2" v-show="tab2 == 2">
							<el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
							<el-table-column prop="orgName" label="项目名称" width="80" align="center">
                                <template slot-scope="scope">
                                    <span :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,scope.row.orgType)">{{scope.row.orgName}}</span>
                                </template>
                            </el-table-column>
							<el-table-column prop="householdsCount" label="应办户数" width="95" align="center"></el-table-column>
							<el-table-column prop="unHouseholdsCount" label="未办户数" width="95" align="center"></el-table-column>
							<el-table-column prop="householdsRate" label="占比" width="80" align="center">
								<template slot-scope="scope">
									{{(scope.row.householdsRate || '-') + '%'}}
								</template>
							</el-table-column>
							<el-table-column prop="adUserName" label="负责人" width="80" align="center"></el-table-column>
						</el-table>
					</div>
				</van-list>

				<!--					<div class="huojv-data-list-none" v-show="tableList.length <= 0">没有更多了</div>-->
				<!--					<div class="huojv-data-list-more" v-show="tableList.length >= 6" @click="getMore">查看更多-->
				<!--						<van-icon name="arrow"/>-->
				<!--					</div>-->
			</div>
		</div>
	</div>
</template>

<script>
    import scrollFixed from '@/mixin/scroll-fixed';
    import {
        List,
        Sticky,
        PullRefresh,
    } from 'vant';
    import {getLocalStorage} from '@/utils/local-storage';
    import request from '@/utils/request';
    import $ from 'jquery'
    import {handleNum2String, handleDate, getUrlParam, jumpToPj} from '@/utils/common'


    export default {
        mixins: [scrollFixed],
        data() {
            return {
                loading: false,//上拉加载
                isLoading: false,//下拉刷新,从第一页开始
                finished: false,//下拉加载完,如果没有数据设置true
                size:20,
                current:1,
                orgId:'',
                orgType: '',
                unit: '',
                tab2: 1,
                tableList1: [],  // 表格数据
                tableList2: [],  // 表格数据
                sortColumn:'overdueDays',
            }
        },
        props: ["chooseOrgId"],
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

                $(".list-title1").scroll(function() {
                    let scrollLeft = $(this).scrollLeft();
                    $('.list-data1 .el-table__body-wrapper').scrollLeft(scrollLeft);
                })
                $(".list-data1 .el-table__body-wrapper").scroll(function() {
                    let scrollLeft = $(this).scrollLeft();
                    $('.list-title1').scrollLeft(scrollLeft);
                })

                $(".list-title2").scroll(function() {
                    let scrollLeft = $(this).scrollLeft();
                    $('.list-data2 .el-table__body-wrapper').scrollLeft(scrollLeft);
                })
                $(".list-data2 .el-table__body-wrapper").scroll(function() {
                    let scrollLeft = $(this).scrollLeft();
                    $('.list-title2').scrollLeft(scrollLeft);
                })
            })

            this.init();
        },
        methods: {
            jumpToPj,
            reloadWindow() {
                setTimeout(() => {
                    window.location.reload();
                    this.isLoading = false;
                }, 500)
            },

            init(isRefresh){
                this.orgId = getUrlParam('chooseOrgId') || getUrlParam('orgId') || getLocalStorage('orgId').orgId;
                this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType;
                this.unit = (getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType) <=5 ? '亿':'万';

                if(isRefresh){
                    this.onRefresh();
                }
            },

            getTableList(isRefresh){
                let url = '/app-api/custonService/confirmOverdueDetail';
                let params = {
                    orgId:getUrlParam('chooseOrgId') || getUrlParam('orgId'),
                    size: this.size,
                    current: this.current,
                    sortColumn:this.sortColumn,
	                sortType:'DESC'
                };

                if(this.tab2 == 2){
                    url = '/app-api/custonService/carriedIncomeDetailsPage';
                }

                request({
                    url: url,
                    method: 'get',
                    params:params
                }).then(({data}) => {
                    if(data.code === 0 && data.data){
                        let list = data.data.records || [];

                        if(this.tab2 == 1){
                            this.tableList1 = isRefresh ? list : this.tableList1.concat(list);
                        }else{
                            this.tableList2 = isRefresh ? list : this.tableList2.concat(list);
                        }

                        let tableList = this.tab2 == 1 ? this.tableList1 : this.tableList2;

                        this.loading = false;
                        this.isLoading = false;
                        this.isLoad = false;

                        if (null == list || list.length < this.size || tableList.length >= data.data.total) {
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
                        this.current = 1;
                        this.tableList = [];
                        this.loading = false;
                        this.isLoading = false;
                        this.finished = true;
                        this.isLoad = false;
                    }
                }).catch((e) => {
                    this.current = 1;
                    this.tableList = [];
                    this.loading = false;
                    this.isLoading = false;
                    this.finished = true;
                    this.isLoad = false;
                    console.log('getEchartData-err', e);
                });
            },

	        sortData(sortColumn){
                this.sortColumn = sortColumn;
                this.onRefresh();
	        },

            onLoad(){
                if(this.isLoad) return;  // 如果正在加载  返回
                this.isLoad = true;
                // 加载状态结束
                this.loading = false;
                this.getTableList();
            },

            onRefresh(){
                this.current = 1;
                // this.tableList = [];
                this.getTableList(true);
            },

            checkTab2(tab2){
                this.tab2 = tab2;
                if(this.tab2 == 1){
                    this.sortColumn = 'overdueDays'
                }else if(this.tab2 == 2){
                    this.sortColumn = 'householdsRate'
                }
                this.onRefresh();
            },

            back(){
                sessionStorage.removeItem('saleReceiptPage'); // 返回首页之后清空页面状态
                // this.goPage('/report/saleReceipts');
                // window.history.go(-1);
                this.$emit('changePage',0);
            },

            goPage(path){
                let search = decodeURIComponent(window.location.search);
                if(!search){
                    search = '?' + decodeURIComponent(window.location.href.split('?')[1]);
                }

                window.location = `#${path + search}`
            },
        },
        components: {
            [List.name]: List,
            [PullRefresh.name]: PullRefresh,
            [Sticky.name]: Sticky,
        }
    };
</script>


<style lang="scss" scoped>
	.boxTitle{
		font-size: 14px;
		color: #333333;
		margin: 18px 0;
	}
	.boxTitle2{
		font-size: 14px;
		color: #333333;
		margin: 0;
	}
	.fR{
		color: #B2B2B2;
		font-size: 11px;
		float: right;
	}
	// .tableToggle{
	//     text-align: right;
	//     margin: 0;

	// }
	.tableBox{
		margin-bottom: 80px;
	}
	.more{
		font-size: 12px;
		color: #666666;
		float: right;
		margin-top: 12px;
		&.up{
			color: #209B5C;
		}
	}
</style>
