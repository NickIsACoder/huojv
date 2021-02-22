<template>
	<div class="detail-panel height100">
		<van-pull-refresh v-model="isLoading" success-text="刷新成功" loading-text="正在刷新..." @refresh="reloadWindow()">
			<van-nav-bar
					style="position: fixed; top: 0; width: 100%;"
					title="融资类型"
					left-arrow
					@click-left="onClickLeft"
					v-eventlisten="{isChangePage:true,pageEvent:'点击返回按钮'}"
			/>

			<div class="padding-nav">
				<div class="main-content" style="width: 100%;">
					<div class="data-content-panel no-top-left-radius clearfix" style="overflow: visible;">
						<!-- 标题 -->
						<div class="data-title-box data-title-line clearfix">
							<span class="title">标准化产品融资</span>
							<ul class="float-r tab">
								<li @click="checkTab1(1)" :class="[tab1 == 1 ? 'active' : '']" v-eventlisten="{isChangePage:false,pageEvent:'点击-融资类型-数据图'}">数据图</li>
								<li @click="checkTab1(2)" :class="[tab1 == 2 ? 'active' : '']" v-eventlisten="{isChangePage:false,pageEvent:'点击-融资类型-数据表'}">数据表</li>
							</ul>
						</div>
						<div v-show="tab1 == 1">
							<div class="text-center">
								<ul class="huojv-tab-bars_1 two-cols" style="margin-bottom: 0;">
									<li @click="checkTab2(1)" v-eventlisten="{isChangePage:false,pageEvent:'点击-融资类型-贷款余额'}" :class="[tab2 == 1 ? 'active' : '']">贷款余额</li>
									<li @click="checkTab2(2)" v-eventlisten="{isChangePage:false,pageEvent:'点击-融资类型-本年新增'}" :class="[tab2 == 2 ? 'active' : '']">本年新增</li>
								</ul>
							</div>
							<div class="huojv-costContract-chart-panel" ref="chart1"></div>
						</div>
						<div v-show="tab1 == 2">
							<el-table stripe class="main-theme-table" ref="tableRef1" size="mini" highlight-current-row border :data="tableData1"
							>
								<el-table-column prop="itemName" fixed label="" align="center" width="90"></el-table-column>
								<el-table-column :label="head" align="center" v-for="(head,index) in tableHead1" :key="'tablehead1'+index">
									<el-table-column prop="loanAmount1" label="贷款余额" align="center" width="80">
										<template slot-scope="scope">
											<span>{{(scope.row['item' + index*2])}}</span>
										</template>
									</el-table-column>
									<el-table-column prop="newLoanAmount1" label="本年新增" align="center" width="80">
										<template slot-scope="scope">
											<span>{{(scope.row['item' + (index*2 + 1)])}}</span>
										</template>
									</el-table-column>
								</el-table-column>
							</el-table>
						</div>

						<!-- 标题 -->
						<div class="data-title-box data-title-line clearfix">
							<span class="title">非标准化产品融资</span>
							<ul class="float-r tab">
								<li @click="checkTab3(1)" :class="[tab3 == 1 ? 'active' : '']" v-eventlisten="{isChangePage:false,pageEvent:'点击-融资类型-数据图'}">数据图</li>
								<li @click="checkTab3(2)" :class="[tab3 == 2 ? 'active' : '']" v-eventlisten="{isChangePage:false,pageEvent:'点击-融资类型-数据表'}">数据表</li>
							</ul>
						</div>
						<div v-show="tab3 == 1">
							<div class="text-center">
								<ul class="huojv-tab-bars_1 two-cols" style="margin-bottom: 0;">
									<li @click="checkTab4(1)" v-eventlisten="{isChangePage:false,pageEvent:'点击-融资类型-贷款余额'}" :class="[tab4 == 1 ? 'active' : '']">贷款余额</li>
									<li @click="checkTab4(2)" v-eventlisten="{isChangePage:false,pageEvent:'点击-融资类型-本年新增'}" :class="[tab4 == 2 ? 'active' : '']">本年新增</li>
								</ul>
							</div>
							<div class="huojv-costContract-chart-panel" ref="chart2"></div>
						</div>
						<div v-show="tab3 == 2">
							<el-table stripe class="main-theme-table" ref="tableRef1" size="mini" highlight-current-row border :data="tableData2"
							>
								<el-table-column prop="itemName" fixed label="" align="center" width="90"></el-table-column>
								<el-table-column :label="head" align="center" v-for="(head,index) in tableHead2" :key="'tablehead2'+index">
									<el-table-column prop="loanAmount1" label="贷款余额" align="center" width="80">
										<template slot-scope="scope">
											<span>{{(scope.row['item' + index*2])}}</span>
										</template>
									</el-table-column>
									<el-table-column prop="newLoanAmount1" label="本年新增" align="center" width="80">
										<template slot-scope="scope">
											<span>{{(scope.row['item' + (index*2 + 1)])}}</span>
										</template>
									</el-table-column>
								</el-table-column>
							</el-table>
						</div>

						<!-- 标题 -->
						<div class="data-title-box data-title-line clearfix">
							<span class="title">境外融资</span>
							<ul class="float-r tab">
								<li @click="checkTab5(1)" :class="[tab5 == 1 ? 'active' : '']" v-eventlisten="{isChangePage:false,pageEvent:'点击-融资类型-数据图'}">数据图</li>
								<li @click="checkTab5(2)" :class="[tab5 == 2 ? 'active' : '']" v-eventlisten="{isChangePage:false,pageEvent:'点击-融资类型-数据表'}">数据表</li>
							</ul>
						</div>
						<div v-show="tab5 == 1">
							<div class="text-center">
								<ul class="huojv-tab-bars_1 two-cols" style="margin-bottom: 0;">
									<li @click="checkTab6(1)" v-eventlisten="{isChangePage:false,pageEvent:'点击-融资类型-贷款余额'}" :class="[tab6 == 1 ? 'active' : '']">贷款余额</li>
									<li @click="checkTab6(2)" v-eventlisten="{isChangePage:false,pageEvent:'点击-融资类型-本年新增'}" :class="[tab6 == 2 ? 'active' : '']">本年新增</li>
								</ul>
							</div>
							<div class="huojv-costContract-chart-panel" ref="chart3"></div>
						</div>
						<div v-show="tab5 == 2">
							<el-table stripe class="main-theme-table" ref="tableRef1" size="mini" highlight-current-row border :data="tableData3"
							>
								<el-table-column prop="itemName" fixed label="" align="center" width="90"></el-table-column>
								<el-table-column :label="head" align="center" v-for="(head,index) in tableHead3" :key="'tablehead3'+index">
									<el-table-column prop="loanAmount1" label="贷款余额" align="center" width="80">
										<template slot-scope="scope">
											<span>{{(scope.row['item' + index*2])}}</span>
										</template>
									</el-table-column>
									<el-table-column prop="newLoanAmount1" label="本年新增" align="center" width="80">
										<template slot-scope="scope">
											<span>{{(scope.row['item' + (index*2 + 1)])}}</span>
										</template>
									</el-table-column>
								</el-table-column>
							</el-table>
						</div>
					</div>
				</div>
			</div>
		</van-pull-refresh>
	</div>
</template>

<script>
    import scrollFixed from '@/mixin/scroll-fixed';
    import {List, PullRefresh,NavBar,Sticky} from 'vant';
    import $ from 'jquery';
    import echarts from 'echarts'
    import request from '@/utils/request';

    export default {
        mixins: [scrollFixed],

        data() {
            return {
                isLoading: false,//下拉刷新,从第一页开始
                tab1:1,
                tab2:1,
                tab3:1,
                tab4:1,
                tab5:1,
                tab6:1,
                chartOption: {
                    tooltip: {
                        trigger: 'axis',
                        backgroundColor: "rgba(255,255,255,0.8)", //设置背景图片 rgba格式
                        color: "#666666",
                        extraCssText: 'box-shadow: 0 0 10px #ccc; padding: 15px;',
                        borderColor: "gray", //设置边框颜色
                        textStyle: {
                            color: "#666666", //设置文字颜色
                            fontSize: 10,
                        },
                        // formatter: '{b} <br />计划<br>{a0} ： {c0}<br/>{a1} ： {c1}<br/>{a2} ： {c2}<br/>{a3} ： {c3}'
                    },
                    title: {
                        text: '暂无数据',
                        show: false,
                        textStyle: {
                            fontWeight: 'normal',
                            fontSize: 14,
                            color: '#999999'
                        },
                        x: 'center',
                        y: 'center'
                    },
                    legend: {
                        show: true,
                        type: 'plain',
                        icon: 'rect',
                        itemWidth: 10,
                        itemHeight: 10,
                        // orient: 'horizon',
                        x: 'center',
                        y: 'bottom',
                        textStyle: {
                            fontSize: 12,
                            color: '#999999'
                        },
                        data: []  //注：需接口获取
                    },
                    dataZoom: [
                        {
                            id: 'dataZoomX',
                            type: 'inside',
                            xAxisIndex: [0],
                            filterMode: 'filter',
                            zoomLock: true
                        }
                    ],
                    grid: {
                        'left': '4%',
                        'right': '4%',
                        'bottom': '14%',
                        'top': '14%',
                        'containLabel': true
                    },
                    animation: true,
                    toolbox: {
                        show: true,
                        feature: {}
                    },
                    calculable: true,
                    xAxis: {
                        type: 'category',
                        boundaryGap: true,
                        data: [],
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#999999'
                            }
                        },
                        axisLabel: {
                            show: true,
                            rotate: 45,
                            textStyle: {
                                color: '#666666'
                            }
                        }
                    },
                    yAxis: {
                        type: 'value',
                        name: '',
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#999999'
                            }
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#666666'
                            }
                        }
                    },
                    series: [],
                },

                tableData1:[],
                tableData2:[],
                tableData3:[],
                resultData1:[],
                resultData2:[],
                resultData3:[],
	            tableHead1:[],
	            tableHead2:[],
	            tableHead3:[],
            };
        },

        mounted() {
            this.orgId = this.$route.query.orgId;

            this.init();
            // this.getDetailList();
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

	        init(){
                $(document).scrollTop(0);   // 切换之后页面自动置顶
                this.getChartData(1);
                this.getChartData(2);
                this.getChartData(3);
	        },

            checkTab1(tab1){
                this.tab1 = tab1;
            },

            checkTab2(tab2){
                this.tab2 = tab2;
                this.drawChart(1);
            },

            checkTab3(tab3){
                this.tab3 = tab3;
            },

            checkTab4(tab4){
                this.tab4 = tab4;
                this.drawChart(2);
            },

            checkTab5(tab5){
                this.tab5 = tab5;
            },

            checkTab6(tab6){
                this.tab6 = tab6;
                this.drawChart(3);
            },

            // 标准化
            getChartData(productType){
                request({
                    url: `/app-api/fundStructure/productTypeSummary`,
                    method: 'get',
                    params: {orgId : this.orgId,productType}
                }).then(({data}) => {
                    if (data.code === 0 && data.data) {
                        this['resultData' + productType] = data.data;

                        let list = [
                            {itemName:'贷款金额(亿元)'},
                            {itemName:'结构占比'},
                            {itemName:'利息成本(亿元)'},
                            {itemName:'综合利率'},
                        ];
                        this['tableHead'+productType] = [];
                        data.data.forEach((item,index) => {
                            list[0]['item' + (index * 2)] = item.loanAmount || '-';
                            list[1]['item' + (index * 2)] = (item.structureRate || '-') + '%';
                            list[2]['item' + (index * 2)] = item.interestCost || '-';
                            list[3]['item' + (index * 2)] = (item.complexInterestRate || '-') + '%';

                            list[0]['item' + (index * 2 + 1)] = item.newLoanAmount || '-';
                            list[1]['item' + (index * 2 + 1)] = (item.newStructureRate || '-') + '%';
                            list[2]['item' + (index * 2 + 1)] = item.newInterestCost || '-';
                            list[3]['item' + (index * 2 + 1)] = (item.newComplexInterestRate || '-') + '%';

                            this['tableHead'+productType].push(item.productName);
                        });

                        this['tableData'+productType] = list;

                        this.drawChart(productType);
                    }
                });
            },

            getTableData(productType){
                request({
                    url: `/app-api/fundStructure/productTypeSummaryTable`,
                    method: 'get',
                    params: {orgId : this.orgId,productType}
                }).then(({data}) => {
                    if (data.code === 0 && data.data) {
                        let list = data.data;
                        list.forEach((item,index) => {
                            item.index = index + 1;
                            if(index == 0){
                                item.itemName = '贷款金额(亿元)';
                            }else if(index == 1){
                                item.itemName = '结构占比';
                            }else if(index == 2){
                                item.itemName = '利息成本(亿元)';
                            }else if(index == 3){
                                item.itemName = '综合利率';
                            }
                        })

                        this['tableData'+productType] = list;
                    }
                });
            },

            drawChart(type){
                let chartData1 = [],chartData2 = [];
                let xAxisData = this['tableHead'+type];;
                this['resultData' + type].forEach(item => {
                    if(this['tab' + (parseInt(type) * 2)] == 1){
                        chartData1.push(item.interestCost);
                        chartData2.push(item.loanAmount);
                    }else{
                        chartData1.push(item.newInterestCost);
                        chartData2.push(item.newLoanAmount);
                    }

                })

                let series = [{
                    name: '利息成本',
                    type: 'bar',
                    barWidth: '18',
                    stack: 'chart1',
                    // formatter: '{value} 万㎡',
                    itemStyle: {
                        normal: {
                            color: '#B4A36B'
                        }
                    },
                    label: {
                        show: false,
                        position: 'inside',
                        formatter: function (params) {
                            if (params.value == 0) {
                                return '';
                            } else {
                                return params.value;
                            }
                        }
                    },
                    data: chartData1
                },{
                    name: '贷款金额',
                    type: 'bar',
                    barWidth: '18',
                    stack: 'chart1',
                    // formatter: '{value} 万㎡',
                    itemStyle: {
                        normal: {
                            color: '#006E38'
                        }
                    },
                    label: {
                        show: false,
                        position: 'inside',
                        formatter: function (params) {
                            if (params.value == 0) {
                                return '';
                            } else {
                                return params.value;
                            }
                        }
                    },
                    data: chartData2
                }];

                let legendData = series.map(item => {
                    return item.name;
                });

                let option = JSON.parse(JSON.stringify(this.chartOption));
                option.series = series;
                let hasData = false;
                series.forEach(item => {
                    if(item.data.length > 0){
                        hasData = true;
                    }
                })
                if(!hasData){
                    option.title.show = true;
                }
                option.legend.data = legendData;
                // option.title.text = '';
                // option.yAxis.name = this.tab3 == 1 ? '单位('+ this.costUnit +')' : '单位('+ this.areaUnit +')';
                option.tooltip.formatter = params => {
                    let index = 0;
                    for(let i = 0; i <= xAxisData.length; i++){
                        if(xAxisData[i] == params[0].axisValueLabel){
                            index = i;
                            break;
                        }
                    }
                    let showHtm = '';

                    for (let i = 0; i < params.length; i++) {
                        //名称
                        let text = '<span class="chart-tooltip">' + params[i].seriesName + '：</span>';
                        //值
                        let value = params[i].value;
                        let marker = params[i].marker;

                        showHtm += '<div style="line-height: 16px;">' +marker + text + value + '</div>';
                    }
                    return showHtm;
                }
                // option.tooltip.formatter = '{b} <br/>{a0} ： {c0} 个<br/>{a1} ： {c1} 个<br/>{a2} ： {c2} 个';


                option.yAxis.name = '单位：亿元';
                option.xAxis.axisLabel.rotate = 30;
                option.xAxis.data = xAxisData;
                if (xAxisData.length > 5) {
                    option.dataZoom[0].endValue = xAxisData[4];
                } else {
                    option.dataZoom[0].endValue = xAxisData[xAxisData.length - 1];
                }
                option.dataZoom[0].startValue = xAxisData[0];
                option.tooltip.extraCssText='box-shadow: 0 0 10px #ccc; padding: 6px 15px;';

                let myChart = new echarts.init(this.$refs['chart'+type]);
                myChart.setOption(option, true);
            },

        },

        components: {
            [NavBar.name]: NavBar,
            [List.name]: List,
            [PullRefresh.name]: PullRefresh
        }
    };
</script>


<style lang="scss" scoped>

</style>
