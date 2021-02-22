<template>
	<div class="report-index">
		<div class="" style="width: 100%;">
			<div v-if="orgType<=5" class="data-content-panel no-top-left-radius minHeight" key="1">
				<div class="tableBox" style="margin-top:0">
					<!-- <p class="tableTitle">一、货地比分析</p> -->
                    <div class="data-title-box data-title-line">
                        <span class="title">货地比分析</span>
                    </div>
					<el-table
							stripe
							class="huo-list-table main-theme-table huojv-data-list2 huojv-sortable"
							size="mini"
							empty-text="暂无数据"
							highlight-current-row
							@sort-change="sortChange1"
							:data="tableList1"
							:default-sort = "{prop: 'valuePriceRate', order: 'descending'}"
					>
						<el-table-column type="index" label="序号" align="center"></el-table-column>
						<el-table-column prop="projectName" label="项目名称" align="center" width="120">
                            <template slot-scope="scope">
                                <span :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.projectGUID,6)">{{scope.row.projectName}}</span>
                            </template>
                        </el-table-column>
						<el-table-column prop="valuePriceRate" label="货地比" align="center" sortable="custom"></el-table-column>
                        <el-table-column prop="valueLandRate" label="地货比" align="center" sortable="custom">
                            <template slot-scope="scope">
                                <span>{{scope.row.valueLandRate?scope.row.valueLandRate+'%':''}}</span>
                            </template>
                        </el-table-column>
						<el-table-column prop="totalValue" label="项目总货值(亿元)" align="center" width="90" sortable="custom"></el-table-column>
						<el-table-column prop="landFinalPrice" label="土地成交价款(亿元)"	align="center"	width="90" sortable="custom"></el-table-column>
						<el-table-column prop="designPrincipal" label="设计负责人" align="center"></el-table-column>
					</el-table>
					<div class="huojv-data-list-more" @click="getMore(1)" v-show="total1>4">
						查看更多
						<van-icon name="arrow" />
					</div>
				</div>
				<div class="tableBox">
                    <div class="data-title-box data-title-line">
                        <span class="title">容积率使用情况</span>
                    </div>
					<!-- <p class="tableTitle">二、容积率使用情况</p> -->
					<el-table
							stripe
							class="huo-list-table main-theme-table huojv-data-list2 huojv-sortable"
							size="mini"
							empty-text="暂无数据"
							highlight-current-row
							@sort-change="sortChange2"
							:data="tableList2"
							:default-sort = "{prop: 'volumeUsageRate', order: 'descending'}"
					>
						<el-table-column type="index" label="序号" align="center"></el-table-column>
						<el-table-column prop="projectName" label="项目名称" align="center" width="120">
                            <template slot-scope="scope">
                                <span :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.projectGUID,6)">{{scope.row.projectName}}</span>
                            </template>
                        </el-table-column>
						<el-table-column
								prop="actualVolumeRate"
								label="实际容积率"
								align="center"
								sortable="custom"
						></el-table-column>
						<el-table-column prop="planVolumeRate" label="规划容积率" align="center" sortable="custom"></el-table-column>
						<el-table-column prop="volumeUsageRate" label="使用比率" align="center" sortable="custom">
							<template slot-scope="scope">
								{{scope.row.volumeUsageRate!='-'?scope.row.volumeUsageRate+'%':scope.row.volumeUsageRate}}
							</template>
						</el-table-column>
						<el-table-column prop="designPrincipal" label="设计负责人" align="center"></el-table-column>
					</el-table>
					<div class="huojv-data-list-more" @click="getMore(2)" v-show="total2>0">
						查看更多
						<van-icon name="arrow" />
					</div>
				</div>
				<div class="tableBox">
                    <div class="data-title-box data-title-line">
                        <span class="title">可售比分析</span>
                    </div>
					<el-table
							stripe
							class="huo-list-table main-theme-table huojv-data-list2 huojv-sortable"
							size="mini"
							empty-text="暂无数据"
							highlight-current-row
							@sort-change="sortChange3"
							:data="tableList3"
							:default-sort = "{prop: 'sellableRate', order: 'descending'}"
					>
						<el-table-column type="index" label="序号" align="center"></el-table-column>
						<el-table-column prop="projectName" label="项目名称" align="center" width="120">
                            <template slot-scope="scope">
                                <span :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.projectGUID,6)">{{scope.row.projectName}}</span>
                            </template>
                        </el-table-column>
						<el-table-column prop="sellableRate" label="可售比" align="center" sortable="custom">\
							<template slot-scope="scope">
								{{scope.row.sellableRate!='-'?scope.row.sellableRate+'%':scope.row.sellableRate}}
							</template>
						</el-table-column>
						<el-table-column prop="bldArea" label="建筑面积(万m²)" align="center" sortable="custom"></el-table-column>
						<el-table-column prop="saleArea" label="可售面积(万m²)" align="center" sortable="custom"></el-table-column>
						<el-table-column prop="designPrincipal" label="设计负责人" align="center"></el-table-column>
					</el-table>
					<div class="huojv-data-list-more" @click="getMore(3)" v-show="total3>4">
						查看更多
						<van-icon name="arrow" />
					</div>
				</div>
			</div>
            <div v-else class="data-content-panel no-top-left-radius minHeight" key="2">
                <div class="tableBox" style="margin-top:0">
                    <div class="data-title-box data-title-line">
                        <span class="title">容积率使用情况</span>
                    </div>
                    <el-table
                            stripe
                            class="huo-list-table main-theme-table huojv-data-list2 huojv-sortable"
                            size="mini"
                            empty-text="暂无数据"
                            highlight-current-row
                            :data="tableList4"
                    >
                        <el-table-column prop="name" label="" align="center"></el-table-column>
                        <el-table-column prop="countRjlArea" label="计容建筑面积(㎡)" align="center"></el-table-column>
                        <el-table-column prop="buildOccupyArea" label="建设用地面积(㎡)" align="center"></el-table-column>
                        <el-table-column prop="volumeRate" label="容积率" align="center"></el-table-column>
                    </el-table>
                </div>
                <div class="tableBox">
                    <div class="data-title-box data-title-line">
                        <span class="title">可售比分析</span>
                    </div>
                    <el-table
                            stripe
                            class="huo-list-table main-theme-table huojv-data-list2 huojv-sortable"
                            size="mini"
                            empty-text="暂无数据"
                            highlight-current-row
                            @sort-change="sortChange3"
                            :data="tableList3"
                            :default-sort = "{prop: 'sellableRate', order: 'descending'}"
                    >
                        <el-table-column label="序号" type="index" align="center"></el-table-column>
                        <el-table-column prop="period" label="分期" align="center"></el-table-column>
                        <el-table-column prop="bldName" label="楼栋" align="center"></el-table-column>
                        <el-table-column prop="sellableRate" label="可售比(%)" align="center"></el-table-column>
                        <el-table-column prop="saleArea" label="可售面积(㎡)" align="center"></el-table-column>
                        <el-table-column prop="bldArea" label="总建筑面积(㎡)" align="center"></el-table-column>
                    </el-table>
                    <div class="huojv-data-list-more" @click="getMore(3)" v-show="total3>4">
						查看更多<van-icon name="arrow" />
					</div>
                </div>
            </div>
		</div>
        
	</div>
</template>

<script>
    import scrollFixed from '@/mixin/scroll-fixed';
    import {List, PullRefresh, NavBar,Icon} from 'vant';
    import $ from 'jquery';
    import request from '@/utils/request';
    import {getUrlParam, getNextMonths,jumpToPj} from '@/utils/common'


    export default {
        mixins: [scrollFixed],

        data() {
            return {
                isLoading: false,//下拉刷新,从第一页开始
                orgId: '',
                orgType: 2,
				size: 10,
				current:1,
                tableList1: [],
                tableList2: [],
                tableList3: [],
                tableList4: [
                    {name:'规划', countRjlArea: '', buildOccupyArea: '', volumeRate: ''},
                    {name:'实际', countRjlArea: '', buildOccupyArea: '', volumeRate: ''},
                ], // 项目层级 容积率使用情况
                tableList5: [], // 项目层级 可售比分析
                total1: 0,
                total2: 0,
                total3: 0,
                designType: 1
            };
        },
        props:[
            'pageTab'
        ],
        watch:{
            '$store.state.orgId': function (newVal, oldVal) {
                this.init();
            },
            pageTab(newVal, oldVal){
                console.log(newVal, oldVal)
                this.init()
            }
        },
        mounted() {
            this.init();
            this.$nextTick(() => {
                $('.el-table__header-wrapper').scroll(function () {
                    let scrollLeft = $(this).scrollLeft();
                    $(this).next().scrollLeft(scrollLeft);
                });
            })
        },

        methods: {
            jumpToPj,
            init() {
                this.orgId = getUrlParam('chooseOrgId') || getUrlParam('orgId');
                this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType');
                
                this.current = 1 
                this.tableList1 = []
                this.tableList2 = []
                this.tableList3 = []
                this.tableList4 = [
                    {name:'规划', countRjlArea: '', buildOccupyArea: '', volumeRate: ''},
                    {name:'实际', countRjlArea: '', buildOccupyArea: '', volumeRate: ''},
                ]// 项目层级 容积率使用情况
                this.tableList5 = []
                this.total1 = 0
                this.total2 =  0
                this.total3 =  0

                this.designType = (this.pageTab + 1).toString()
                if (this.orgType<=5) {
                    this.getTable();
                }else{
                    // 容积率
                    this.getPlotRatio('volumeUsageRate', 'desc')
                    // 可售比分析
                    this.getMarketableRatio('sellableRate', 'desc')
                }
                
            },
            getTable () {
                // 货地比分析
                this.getGoodsLandRatio('valuePriceRate', 'desc')
                // 容积率
                this.getPlotRatio('volumeUsageRate', 'desc')
                // 可售比分析
                this.getMarketableRatio('sellableRate', 'desc')
            },
            getGoodsLandRatio (_orderParam, _orderParamType) {
                // orderParam valuePriceRate:货地比;  totalValue:项目总货值;  landFinalPrice:土地成交价款
                // orderParamType 排序类型(desc:倒序;asc:正序
                request({
                    url: `/app-api/productDesign/goodsLandRatio`,
                    method: 'post',
                    data: {
                        current: this.current,
                        size: this.size,
                        orgId: this.orgId,
                        orderParam: _orderParam,
                        orderParamType: _orderParamType,
                        designType: this.designType
                    }
                }).then(({ data }) => {
                    if (data.code === 0) {
                        this.tableList1 = data.data;
                        this.total1 = data.total
                    }
                }).catch((e) => {
                    console.log('err', e);
                });
            },
            getPlotRatio (_orderParam, _orderParamType) {
                // orderParam (actualVolumeRate:实际容积率;planVolumeRate:规划容积率;volumeUsageRate:使用比率)
                // orderParamType (desc:倒序;asc:正序)
                request({
                    url: `/app-api/productDesign/plotRatio`,
                    method: 'post',
                    data: {
                        current: this.current,
                        size: this.size,
                        orgId: this.orgId,
                        orderParam: _orderParam,
                        orderParamType: _orderParamType,
                        designType: this.designType
                    }
                }).then(({ data }) => {
                    if (data.code === 0) {
                        if(this.orgType>=6){
                            // 项目层级-容积率使用情况
                            this.tableList4 = [
                                {name:'规划', countRjlArea: data.data[0].planCountRjlArea, buildOccupyArea: data.data[0].planBuildOccupyArea, volumeRate: data.data[0].planVolumeRate},
                                {name:'实际', countRjlArea: data.data[0].actualCountRjlArea, buildOccupyArea: data.data[0].actualBuildOccupyArea, volumeRate: data.data[0].actualVolumeRate},
                            ]
                        } else {
                            this.tableList2 = data.data;
                            this.total2 = data.total
                        }
                    }
                }).catch((e) => {
                    console.log('err', e);
                });
            },
            getMarketableRatio (_orderParam, _orderParamType) {
                // orderParam (sellableRate:可售比;saleArea:建筑面积;bldArea:可售面积)
                // orderParamType (desc:倒序;asc:正序)
                request({
                    url: `/app-api/productDesign/marketableRatio`,
                    method: 'post',
                    data: {
                        current: this.current,
                        size: this.size,
                        orgId: this.orgId,
                        orderParam: _orderParam,
                        orderParamType: _orderParamType,
                        designType: this.designType
                    }
                }).then(({ data }) => {
                    if (data.code === 0) {
                        this.tableList3 = data.data
                        this.total3 = data.total
                    }
                }).catch((e) => {
                    console.log('err', e);
                });
            },
            getMore (type) {
                sessionStorage.type = type;
                this.$router.push({
                    path: '/productDesign/more',
                    query: { token: getUrlParam('token'), orgId: this.orgId, type: type ,designType: this.designType, orgType: this.orgType}
                })
            },
            checkTab1 (tab1) {
                this.tab1 = tab1;
                this.init();
            },
            sortChange1 (col) {
                let _order = col.order == 'ascending' ? 'asc' : 'desc'
                // 货地比分析
                this.getGoodsLandRatio(col.prop, _order)
            },
            sortChange2 (col) {
                let _order = col.order == 'ascending' ? 'asc' : 'desc'
                // 容积率
                this.getPlotRatio(col.prop, _order)
            },
            sortChange3 (col) {
                let _order = col.order == 'ascending' ? 'asc' : 'desc'
                // 可售比分析
                this.getMarketableRatio(col.prop, _order)
            },
        },

        components: {
            [NavBar.name]: NavBar,
            [List.name]: List,
            [PullRefresh.name]: PullRefresh,
            [Icon.name]: Icon,
        }
    };
</script>


<style lang="scss" scoped>
	.minHeight {
		min-height: 90vh;
	}
	.tableTitle {
		font-size: 14px;
		color: #333;
		margin: 0 auto;
		margin-bottom: 10px;
	}
	.tableBox {
		margin: 20px 0 30px;
		overflow: hidden;
	}
	.huojv-tab-bars {
		li {
			min-width: 80px;
			width: auto;
			padding: 0 10px;
		}
	}
	.emptyBox {
		font-size: 13px;
		color: #868686;
		text-align: center;
		padding-top: 20vh;
		img {
			width: 130px;
			display: block;
			margin: 0 auto;
			margin-bottom: 20px;
		}
	}
	.tooltips{
		font-size: 12px;
	}
</style>

