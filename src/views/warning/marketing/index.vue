<template>
	<div class="report-index has-tabs pb-20">
		<ul class="huojv-tabs fixed-tabs four-cols">
			<li @click="checkTab1(1)" v-eventlisten="{isChangePage:false,pageEvent:'点击签约按钮'}"
			    :class="[tab1 == 1 ? 'active' : '']"><label>签约</label></li>
			<li @click="checkTab1(4)" v-eventlisten="{isChangePage:false,pageEvent:'点击低效资产按钮'}"
			    :class="[tab1 == 4 ? 'active' : '']"><label>低效资产</label></li>
			<li @click="checkTab1(2)" v-eventlisten="{isChangePage:false,pageEvent:'点击回款按钮'}"
			    :class="[tab1 == 2 ? 'active' : '']"><label>回款</label></li>
			<li @click="checkTab1(3)" v-eventlisten="{isChangePage:false,pageEvent:'点击交付按钮'}"
			    :class="[tab1 == 3 ? 'active' : '']"><label>交付</label></li>
		</ul>
<!--		<van-pull-refresh v-model="isLoading" success-text="刷新成功" loading-text="正在刷新..." @refresh="reloadWindow()">-->
			<div class="main-content mt-15">

				<div class="data-content-panel">
					<!-- 标题 -->
					<div class="data-title-box mt-5">
						<img class="title-ico" src="../../../assets/images/alarm.png">
						<span class="title" v-text="title"></span>
<!--						<span class="unit" v-show="tab1 !== 4">(单位：亿)</span>-->
					</div>

	<!--				<van-pull-refresh v-model="isLoading" @refresh="onRefresh">-->
						<ul class="huojv-data-list no-padding-label three-cols" v-if="tab1 == 1">
							<li class="title">
								<label style="width: 40%;">项目名称</label>
								<label style="width: 30%;">
									<div class="tow-rows-title">逾期15天金额(亿元)</div>
								</label>
								<label style="width: 30%;">管理记录</label>
							</li>
							<li class="total">
								<label style="width: 40%;">合计</label>
								<label style="width: 30%;" v-text="warningInfo.amount"></label>
								<label style="width: 30%;"></label>
							</li>
						</ul>
						<ul class="huojv-data-list no-padding-label three-cols" v-if="tab1 == 2">
							<li class="title">
								<label style="width: 40%;">项目名称</label>
								<label style="width: 30%;">
									<div class="tow-rows-title">逾期90天金额(亿元)</div>
								</label>
								<label style="width: 30%;">管理记录</label>
							</li>
							<li class="total">
								<label style="width: 40%;">合计</label>
								<label style="width: 30%;" v-text="warningInfo.amount"></label>
								<label style="width: 30%;"></label>
							</li>
						</ul>
						<ul class="huojv-data-list no-padding-label three-cols" v-if="tab1 == 3">
							<li class="title">
								<label style="width: 40%;">项目名称</label>
								<label style="width: 30%;">
									<div class="tow-rows-title">延期交付金额(亿元)</div>
								</label>
								<label style="width: 30%;">管理记录</label>
							</li>
							<li class="total">
								<label style="width: 40%;">合计</label>
								<label style="width: 30%;" v-text="warningInfo.amount"></label>
								<label style="width: 30%;"></label>
							</li>
						</ul>
						<van-list
								v-model="loading"
								:finished="finished"
								finished-text="没有更多了"
								@load="onLoad"
						>
							<ul class="huojv-data-list no-padding-label three-cols"
							    v-if="tab1 == 1">
								<li class="red-color" v-for="(item,index) in tableList1" :key="index+item.orgName">
									<label style="width: 40%;" :style="orgType != 6 ? 'text-decoration: underline;' : ''" @click="jumpToPj(orgType,item.orgId,6)" v-text="(item.propertyType ? ('('+ item.propertyType +')') : '') + item.orgName"></label>
									<label style="width: 30%;" v-text="item.over180ContractAmount"></label>
									<label style="width: 30%;">
										<img :src="fileImg" v-show="item.interview == 1" class="file-img" @click="goAdminDetail(item)">
									</label>
								</li>
							</ul>
							<ul class="huojv-data-list no-padding-label three-cols"
							    v-else-if="tab1 == 2">
								<li class="red-color" v-for="(item,index) in tableList2" :key="index+item.orgName">
									<label style="width: 40%;" :style="orgType != 6 ? 'text-decoration: underline;' : ''" @click="jumpToPj(orgType,item.orgId,6)" v-text="(item.propertyType ? ('('+ item.propertyType +')') : '') + item.orgName">
                                    </label>
									<label style="width: 30%;" v-text="item.over90GetAmount"></label>
									<label style="width: 30%;">
										<img :src="fileImg" v-show="item.interview == 1" class="file-img" @click="goAdminDetail(item)">
									</label>
								</li>
							</ul>
							<ul class="huojv-data-list no-padding-label three-cols" v-if="tab1 == 3">
								<li class="red-color" v-for="(item,index) in tableList3" :key="index+item.orgName">
									<label style="width: 40%;" :style="orgType != 6 ? 'text-decoration: underline;' : ''" @click="jumpToPj(orgType,item.orgId,6)" v-text="(item.propertyType ? ('('+ item.propertyType +')') : '') + item.orgName"></label>
									<label style="width: 30%;" v-text="item.overPayAmount"></label>
									<label style="width: 30%;">
										<img :src="fileImg" v-show="item.interview == 1" class="file-img" @click="goAdminDetail(item)">
									</label>
								</li>
							</ul>

							<div class="list-data1" v-show="tab1 == 4">
								<ul class="huojv-data-list list-title" style="overflow-x: auto;">
									<li class="title" style="width: 440px; padding: 0;">
										<label style="width: 120px; box-sizing: border-box; padding-left: 10px;">项目名称</label>
										<label style="width: 80px;">货值(亿)</label>
										<label style="width: 80px; ">套数</label>
										<label style="width: 80px; ">负责人</label>
										<label style="width: 80px; text-align: center;">管理记录</label>
									</li>
									<li class="total" style="width: 440px; padding: 0;">
										<label style="width: 120px; box-sizing: border-box; padding-left: 10px;">合计</label>
										<label style="width: 80px;" v-text="inefficientTotalVo?inefficientTotalVo.over2YearAmountTotal:''"></label>
										<label style="width: 80px;" v-text="inefficientTotalVo?inefficientTotalVo.over2YearCountTotal:''"></label>
										<label style="width: 80px; "></label>
										<label style="width: 80px; text-align: center;"></label>
									</li>
								</ul>
								<el-table stripe
								          class="huo-list-table main-theme-table huojv-data-list hide-header" size="mini" highlight-current-row
								          :data="tableList4">
									<el-table-column prop="projName" label="项目名称" width="120">
                                        <template slot-scope="scope">
                                            <span :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.projId,6)">{{scope.row.projName}}</span>
                                        </template>
									</el-table-column>
									<el-table-column prop="over2YearAmount" label="货值(亿)" width="80"
									                 align="center">
									</el-table-column>
									<el-table-column prop="over2YearCount" label="套数" width="80"
									                 align="center">
									</el-table-column>
									<el-table-column prop="adUserName" label="负责人" width="80"
									                 align="center">
									</el-table-column>
									<el-table-column prop="interview" label="管理记录" width="80"
									                 align="center">
										<template slot-scope="scope">
											<img :src="fileImg" v-show="scope.row.interview == 1" class="file-img" @click="goAdminDetail(scope.row)">
										</template>
									</el-table-column>
								</el-table>
							</div>

						</van-list>
	<!--				</van-pull-refresh>-->
				</div>

			</div>
<!--		</van-pull-refresh>-->
	</div>
</template>

<script>
    import scrollFixed from '@/mixin/scroll-fixed';
    import {List, PullRefresh, Toast} from 'vant';
    import {getLocalStorage} from '@/utils/local-storage';
    import request from '@/utils/request';
    import {mapState} from 'vuex';
    import $ from 'jquery';
    import fileImg from '@/assets/images/file.png';
    import {getUrlParam,jumpToPj} from "../../../utils/common";


    export default {
        mixins: [scrollFixed],

        data() {
            return {
                // orgId: getLocalStorage(['orgId']).orgId,

                tab1: 1,  //  1  签约 ， 2  回款， 3  交付
                loading: false,//上拉加载
                isLoading: false,//下拉刷新,从第一页开始
                finished: false,//下拉加载完,如果没有数据设置true
                tableList1: [],
                tableList2: [],
                tableList3: [],
                tableList4: [],
                size: 20,
                current: 1,
                list: [],
                warningInfo: {},
                inefficientTotalVo:{},
                fileImg,
                title:'逾期签约预警',
                orgType: ''
            };
        },

	    created(){
            if(sessionStorage.marketingTab){
                this.tab1 = sessionStorage.marketingTab;
                sessionStorage.removeItem('marketingTab');
            }
	    },

        mounted() {
            this.$nextTick(() => {
                // $('.el-table__header-wrapper').scroll(function () {
                //     let scrollLeft = $(this).scrollLeft();
                //     $(this).next().scrollLeft(scrollLeft);
                // });

                $(".list-title").scroll(function () {
                    let scrollLeft = $(this).scrollLeft();
                    $('.list-data1 .el-table__body-wrapper').scrollLeft(scrollLeft);
                })

                $(".list-data1 .el-table__body-wrapper").scroll(function () {
                    let scrollLeft = $(this).scrollLeft();
                    $('.list-title').scrollLeft(scrollLeft);
                })
            })
            this.init();
        },

        watch:{
            '$store.state.orgId':function(newVal, oldVal){
                this.onRefresh();
            }
        },

        computed: {
            ...mapState({
                orgId: state => state.orgId || getLocalStorage(['orgId']).orgId
            })
        },

        methods: {
            jumpToPj,
            reloadWindow(){
                setTimeout(() => {
                    window.location.reload();
                    this.isLoading = false;
                },500)
            },
            init() {
                this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType;
                this.tableList1 = [];
                this.tableList2 = [];
                this.tableList3 = [];
                this.tableList4 = [];
                this.setTableData();
            },
            setTableData(isRefresh) {
                if (!this.orgId) return;
                let _url = '';
                if (this.tab1 == 1) {
                    _url = `/app-api/report/overdueContract`;
                } else if (this.tab1 == 2) {
                    _url = `/app-api/report/overdueRebate`;
                } else if (this.tab1 == 3) {
                    _url = `/app-api/report/delayDeliver`;
                }else if(this.tab1 == 4){
                    _url = `/app-api/saleBack/inefficientAssets`;
                }

                if(this.tab1 != 4){
                    request({
                        url: _url,
                        method: 'post',
                        params: {
                            orgId: this.orgId,
                            size: this.size,
                            current: this.current
                        }
                    }).then(({data}) => {
                        let tableList = this['tableList'+this.tab1];

                        if(data.code === 0){
                            this.warningInfo = data;
	                        tableList = isRefresh || this.current == 1 ? data.list : tableList.concat(data.list);

                            this.loading = false;
                            this.isLoading = false;

                            if (null == data.list || data.list.length < this.size || tableList.length >= data.total) {
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
                            tableList = [];
                            this.loading = false;
                            this.isLoading = false;
                            this.finished = true;
                            this.current = 1;
                        }

                        this['tableList'+this.tab1] = tableList;

                    })
                }else{
                    request({
                        url: _url,
                        method: 'post',
                        data: {
                            orgId: this.orgId,
                            orgType: parseInt(getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType),
                            size: this.size,
                            current: this.current
                        }
                    }).then(({data}) => {
                        if(data.code === 0){
                            this.warningInfo = data;
                            this.tableList4 = isRefresh || this.current == 1 ? data.data.inefficientAssets : this.tableList4.concat(data.data.inefficientAssets);
                            this.inefficientTotalVo = data.data.totalVo;
                            this.loading = false;
                            this.isLoading = false;

                            if (null == data.data || null == data.data.inefficientAssets  || data.data.inefficientAssets.length < this.size || this.tableList4.length >= data.total) {
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
                            this.tableList4 = [];
                            this.loading = false;
                            this.isLoading = false;
                            this.finished = true;
                            this.current = 1;
                        }

                    }).catch((e) => {
                        console.log('getBoardData-err', e);
                        this.tableList4 = [];
                        this.loading = false;
                        this.isLoading = false;
                        this.finished = true;
                        this.current = 1;
                    });
                }

            },
            onLoad() {
                this.setTableData();
            },

            onRefresh() {
                this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType;
                this.current = 1;
                // this.tableList = [];
                this.setTableData(true);
            },

            // 切换  签约  回款  交付
            checkTab1(tab1) {
                this.tab1 = tab1;
                this.tableList = [];
                this.current = 1;

                if(tab1 == 1){
                    this.title = '逾期签约预警';
                }else if(tab1 == 2){
                    this.title = '回款逾期情况';
                }else if(tab1 == 3){
                    this.title = '交付逾期情况';
                }else if(tab1 == 4){
                    this.title = '库龄超过2年库存情况';
                }
                this.setTableData();
            },

            goAdminDetail(item){
                let type = 0;
                if(this.tab1 == 1){
                    type = 11;
                }else if(this.tab1 == 2){
                    type = 12;
                }else if(this.tab1 == 3){
                    type = 6;
                }else if(this.tab1 == 4){   // todo 目前还没有这个type
                    type = 14;
                }

                let name = ''
                if (item.projName) {
                    name = item.orgGroup ? ('('+ item.orgGroup +')') : '' + item.projName
                } else {
                    name = item.propertyType ? ('('+ item.propertyType +')') : '' + item.orgName
                }
                this.$router.push({
                    path:'/warning/adminDetail',
                    query: {
                        id: item.projId|| item.orgId,
                        tab1: this.tab1, 
                        orgName: name,
                        token:getUrlParam('token') || getLocalStorage('token').token,type
                    }
                });
            }
        },

        components: {
            [List.name]: List,
            [PullRefresh.name]: PullRefresh,
            Toast
        }
    };
</script>


<style lang="scss" scoped>

</style>
