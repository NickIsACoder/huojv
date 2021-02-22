<template>
	<div class="detail-panel height100 white-bg">
<!--		<van-pull-refresh v-model="isLoading" success-text="刷新成功" loading-text="正在刷新..." @refresh="reloadWindow()">-->
			<van-nav-bar
					style="position: fixed; top: 0; width: 100%;"
					:title="pageType == 1 ? '首开30天签约去化' : '项目投资测算目标达成情况'"
					left-arrow
					@click-left="onClickLeft"
					v-eventlisten="{isChangePage:true,pageEvent:'点击返回按钮'}"
			/>

			<div class="padding-nav" v-show="pageType == 1">
				<div class="detail-table-panel list-data1">
					<!--			<van-pull-refresh v-model="isLoading" @refresh="onRefresh">-->
					<van-list
							v-model="loading"
							:finished="finished"
							finished-text=""
							@load="onLoad"
					>
						<el-table stripe
						          :height="tableHeight"
						          class="huo-list-table main-theme-table huojv-data-list not-hide-text" size="mini" highlight-current-row
						          :data="tableList">
							<el-table-column property="orgName" label="项目" align="center" class-name="bdr" fixed width="80"></el-table-column>
							<el-table-column property="fpDate" label="放盘时间" align="center" width="80"></el-table-column>
							<el-table-column property="fpCount" label="放盘套数(套)" align="center" width="100"></el-table-column>
							<el-table-column property="fpAmount" label="放盘货值(亿)" align="center" width="100"></el-table-column>
							<el-table-column property="weekOrderDecheRate" label="放盘7天内认购去化率" align="center" width="90">
								<template slot-scope="scope">
									<span>{{(scope.row.weekOrderDecheRate || '-') +'%'}}</span>
								</template>
							</el-table-column>
							<el-table-column property="monthContractDecheRate" label="放盘当月签约去化率" align="center" width="90">
								<template slot-scope="scope">
									<span>{{(scope.row.monthContractDecheRate || '-') +'%'}}</span>
								</template>
							</el-table-column>
							<el-table-column property="contractDecheRate" label="截至当下累计签约去化率" align="center" width="100">
								<template slot-scope="scope">
									<span>{{(scope.row.contractDecheRate || '-') +'%'}}</span>
								</template>
							</el-table-column>
							<el-table-column property="contractPrice" label="截至当下累计签约均价(元/方)" align="center" width="110"></el-table-column>
						</el-table>
					</van-list>
					<!--			</van-pull-refresh>-->
				</div>
			</div>
			<div class="padding-nav" v-show="pageType == 2">
<!--				<van-sticky class="has-nav-sticky">-->
<!--					<div class="data-content-panel pt-15 p-l-r-15" style="padding-bottom: 0;">-->
<!--						<ul class="huojv-data-list list-title1 two-rows" style="overflow-x: auto;">-->
<!--							<li class="title" style="width: 766px; padding: 0;">-->
<!--								<label class="rowspan_2" style="width: 80px; text-align: center;">项目名称</label>-->
<!--								<label class="rowspan_1" style="width: 100px;">投资测算版本年去化目标</label>-->
<!--								<label class="rowspan_1" style="width: 80px; ">本年累计去化金额</label>-->
<!--								<label class="rowspan_1" style="width: 100px; ">投资测算版本年销售均价</label>-->
<!--								<label class="rowspan_1" style="width: 90px;">本年实际销售均价</label>-->
<!--								<label class="rowspan_1" style="width: 100px;" @click="sortData('InvestDecheRate')">-->
<!--									去化目标达成率-->
<!--									<i :class="[sortColumn === 'InvestDecheRate' ? 'green-font' : 'light-green-font']"-->
<!--									   class="el-icon-caret-bottom" style="margin-left: 2px;"></i>-->
<!--								</label>-->
<!--								<label class="rowspan_2" style="width: 135px;" @click="sortData('PremiumPrice')">-->
<!--									溢价/损失-->
<!--									<i :class="[sortColumn === 'PremiumPrice' ? 'green-font' : 'light-green-font']"-->
<!--									   class="el-icon-caret-bottom" style="margin-left: 2px;"></i>-->
<!--								</label>-->
<!--								<label class="rowspan_2" style="width: 80px;">负责人</label>-->
<!--							</li>-->
<!--						</ul>-->
<!--					</div>-->
<!--				</van-sticky>-->

				<div class="detail-table-panel list-data2">
					<!--			<van-pull-refresh v-model="isLoading" @refresh="onRefresh">-->
					<van-list
							v-model="loading"
							:finished="finished"
							finished-text=""
							@load="onLoad"
					>
						<el-table stripe
						          :height="tableHeight"
						          class="huo-list-table main-theme-table huojv-data-list not-hide-text" size="mini" highlight-current-row
						          :data="tableList">
							<el-table-column property="orgName" label="项目名称" width="80" fixed></el-table-column>
							<el-table-column property="decheTargetAmount" label="投资测算版本年去化目标" align="center" width="100">
								<template slot-scope="scope">
									<span>{{(scope.row.decheTargetAmount || '-') + '亿'}}</span>
								</template>
							</el-table-column>
							<el-table-column property="yearContractAmount" label="本年累计去化金额" align="center" width="80">
								<template slot-scope="scope">
									<span>{{(scope.row.yearContractAmount || '-') + '亿'}}</span>
								</template>
							</el-table-column>
							<el-table-column property="decheTargetPrice" label="投资测算版本年销售均价" align="center" width="100">
								<template slot-scope="scope">
									<span>{{(scope.row.decheTargetPrice || '-') + '元/方'}}</span>
								</template>
							</el-table-column>
							<el-table-column property="yearContractPrice" label="本年实际销售均价" align="center" width="90">
								<template slot-scope="scope">
									<span>{{(scope.row.yearContractPrice || '-') + '元/方'}}</span>
								</template>
							</el-table-column>
							<el-table-column property="investDecheRate" label="去化目标达成率" align="center" width="100">
								<template slot="header" slot-scope="scope">
									<div @click="sortData('InvestDecheRate')">
										<span>去化目标达成率</span>
										<i :class="[sortColumn === 'InvestDecheRate' ? 'green-font' : 'light-green-font']"
										   class="el-icon-caret-bottom" style="margin-left: 2px;"></i>
										<!--									<label class="table-sort-ico">-->
										<!--										<i :class="[sortColumn == 'InvestDecheRate' && sortType === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>-->
										<!--										<i :class="[sortColumn == 'InvestDecheRate' && sortType === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>-->
										<!--									</label>-->
									</div>
								</template>
								<template slot-scope="scope">
									<span>{{(scope.row.investDecheRate || '-') + '%'}}</span>
								</template>
							</el-table-column>
							<el-table-column property="premiumPrice" label="溢价/损失" align="center" width="135">
								<template slot="header" slot-scope="scope">
									<div @click="sortData('PremiumPrice')">
										<span>溢价/损失</span>
										<i :class="[sortColumn === 'PremiumPrice' ? 'green-font' : 'light-green-font']"
										   class="el-icon-caret-bottom" style="margin-left: 2px;"></i>
										<!--									<label class="table-sort-ico">-->
										<!--										<i :class="[sortColumn == 'PremiumPrice' && sortType === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>-->
										<!--										<i :class="[sortColumn == 'PremiumPrice' && sortType === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>-->
										<!--									</label>-->
									</div>
								</template>
								<template slot-scope="scope">
									<span>{{'溢价' + (scope.row.premiumPrice || '-') + '元/方'}}</span>
								</template>
							</el-table-column>
							<el-table-column property="adUserName" label="负责人" align="center" width="80"></el-table-column>
						</el-table>
					</van-list>
					<!--			</van-pull-refresh>-->
				</div>
			</div>

<!--		</van-pull-refresh>-->
	</div>
</template>

<script>
    import scrollFixed from '@/mixin/scroll-fixed';
    import {List, PullRefresh,NavBar,Sticky} from 'vant';
    import $ from 'jquery';
    import request from '@/utils/request';

    export default {
        mixins: [scrollFixed],

        data() {
            return {
                loading: false,//上拉加载
                isLoading: false,//下拉刷新,从第一页开始
                finished: false,//下拉加载完,如果没有数据设置true
                size:999,
                current:1,
                tableList: [],
                tab1:1,
                name: '',
	            orgId:'',
	            pageType:1,
                tableHeight: 0,
                sortColumn:'InvestDecheRate',
                isLoad:false  // 是否处于加载状态  手动控制  以免一直执行onLoad方法
            };
        },

	    created(){
            let bodyHeight = document.body.clientHeight;
            if (this.pageType == 1) {
                this.tableHeight = bodyHeight - 85;
            } else if (this.pageType == 2) {
                this.tableHeight = bodyHeight - 180;
            }
	    },

        mounted() {
            this.name = this.$route.query.contractName;
            this.pageType = this.$route.query.pageType;
            this.orgId = this.$route.query.orgId;
            // this.getDetailList();
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
				//
                // $(".list-title1").scroll(function () {
                //     let scrollLeft = $(this).scrollLeft();
                //     $('.list-data2 .el-table__body-wrapper').scrollLeft(scrollLeft);
                // })
				//
                // $(".list-data2 .el-table__body-wrapper").scroll(function () {
                //     let scrollLeft = $(this).scrollLeft();
                //     $('.list-title1').scrollLeft(scrollLeft);
                // })

                $('.el-table__header-wrapper').scroll(function () {
                    let scrollLeft = $(this).scrollLeft();
                    $(this).next().scrollLeft(scrollLeft);
                });

                $(".el-table__fixed-body-wrapper").scroll(function () {
                    let scrollTop = $(this).scrollTop();
                    $(this).parent().prev().scrollTop(scrollTop);
                });
            })
        },

        methods: {
            reloadWindow(){
                setTimeout(() => {
                    window.location.reload();
                    this.isLoading = false;
                },500)
            },
            onClickLeft() {
                window.history.go(-1);
            },

            checkTab1(tab1){
                this.current = 1;
                this.tab1 = tab1;
                this.getDetailList(true);
            },

            // 获取材料清单明细
            getDetailList(isRefresh){
                let url = '/app-api/saleBack/decontamination/projectEliminated';
                let params = {
                    orgId:this.$route.query.orgId,
                    size: this.size,
                    current: this.current,
                };

                if(this.pageType == 2){
                    url = '/app-api/saleBack/decontamination/projectAchievement';
                    params = {orgId : this.$route.query.orgId,current: 1,size: this.size,productType:this.$route.query.productType,sortColumn:this.sortColumn,sortType: 'DESC'}
                }

                request({
                    url: url,
                    method: 'get',
                    params:params
                }).then(({data}) => {
                    if(data.code === 0 && data.data){
                        let list = data.data.records || [];
                        this.tableList = isRefresh ? list : this.tableList.concat(list);
                        this.loading = false;
                        this.isLoading = false;
                        this.isLoad = false;

                        if (null == list || list.length < this.size || this.tableList.length >= data.total) {
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

            onLoad(){
                if(this.isLoad) return;  // 如果正在加载  返回
                this.isLoad = true;
                // 加载状态结束
                this.loading = false;
                this.getDetailList();
            },

            onRefresh(){
                this.current = 1;
                // this.tableList = [];
                this.getDetailList(true);
            },

            sortData(sortColumn){
                if(this.sortColumn != sortColumn){
                    this.sortColumn = sortColumn;
                    // this.sortType = 'ASC';
                }else{
                    return;
                }

                this.onRefresh();
            },
        },

        components: {
            [NavBar.name]: NavBar,
            [List.name]: List,
            [PullRefresh.name]: PullRefresh,
            [Sticky.name]: Sticky,
        }
    };
</script>


<style lang="scss" scoped>

</style>
