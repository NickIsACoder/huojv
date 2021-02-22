<template>
	<div class="report-index">
		<div class="main-content" style="width: 100%;">
			<div class="data-content-panel no-top-left-radius clearfix" style="overflow: visible;">
				<!-- 标题 -->
				<div class="data-title-box data-title-line clearfix">
					<span class="title">融资周期</span>
					<ul class="float-r tab">
						<li @click="checkTab1(1)" :class="[tab1 == 1 ? 'active' : '']" v-eventlisten="{isChangePage:false,pageEvent:'点击-融资类型-数据图'}">数据图</li>
						<li @click="checkTab1(2)" :class="[tab1 == 2 ? 'active' : '']" v-eventlisten="{isChangePage:false,pageEvent:'点击-融资类型-数据表'}">数据表</li>
					</ul>
				</div>
				<div v-show="tab1 == 1">
					<div class="text-center">
						<ul class="huojv-tab-bars_1 two-cols" style="margin-bottom: 0;">
							<li @click="checkTab2(1)" v-eventlisten="{isChangePage:false,pageEvent:'点击-融资类型-融资余额'}" :class="[tab2 == 1 ? 'active' : '']">融资余额</li>
							<li @click="checkTab2(2)" v-eventlisten="{isChangePage:false,pageEvent:'点击-融资类型-本年新增'}" :class="[tab2 == 2 ? 'active' : '']">本年新增</li>
						</ul>
					</div>
					<div class="huojv-costContract-chart-panel" ref="chart1"></div>
				</div>
				<div v-show="tab1 == 2">
					<el-table stripe class="main-theme-table" ref="tableRef1" size="mini" highlight-current-row border :data="tableData1"
					>
						<el-table-column prop="itemName" fixed label="" align="center" width="90"></el-table-column>
						<el-table-column label="1年以内" align="center">
							<el-table-column prop="loanAmount1" label="融资余额" align="center" width="80">
								<template slot-scope="scope">
									<span>{{(scope.row.loanAmount1 || '-') + (scope.row.index == 2 || scope.row.index == 4 ? '%' : '')}}</span>
								</template>
							</el-table-column>
							<el-table-column prop="newLoanAmount1" label="本年新增" align="center" width="80">
								<template slot-scope="scope">
									<span>{{(scope.row.newLoanAmount1 || '-') + (scope.row.index == 2 || scope.row.index == 4 ? '%' : '')}}</span>
								</template>
							</el-table-column>
						</el-table-column>
						<el-table-column label="1-3年" align="center">
							<el-table-column prop="loanAmount2" label="融资余额" align="center" width="80">
								<template slot-scope="scope">
									<span>{{(scope.row.loanAmount2 || '-') + (scope.row.index == 2 || scope.row.index == 4 ? '%' : '')}}</span>
								</template>
							</el-table-column>
							<el-table-column prop="newLoanAmount2" label="本年新增" align="center" width="80">
								<template slot-scope="scope">
									<span>{{(scope.row.newLoanAmount2 || '-') + (scope.row.index == 2 || scope.row.index == 4 ? '%' : '')}}</span>
								</template>
							</el-table-column>
						</el-table-column>
						<el-table-column label="3-5年" align="center">
							<el-table-column prop="loanAmount3" label="融资余额" align="center" width="80">
								<template slot-scope="scope">
									<span>{{(scope.row.loanAmount3 || '-') + (scope.row.index == 2 || scope.row.index == 4 ? '%' : '')}}</span>
								</template>
							</el-table-column>
							<el-table-column prop="newLoanAmount3" label="本年新增" align="center" width="80">
								<template slot-scope="scope">
									<span>{{(scope.row.newLoanAmount3 || '-') + (scope.row.index == 2 || scope.row.index == 4 ? '%' : '')}}</span>
								</template>
							</el-table-column>
						</el-table-column>
						<el-table-column label="5-10年" align="center">
							<el-table-column prop="loanAmount4" label="融资余额" align="center" width="80">
								<template slot-scope="scope">
									<span>{{(scope.row.loanAmount4 || '-') + (scope.row.index == 2 || scope.row.index == 4 ? '%' : '')}}</span>
								</template>
							</el-table-column>
							<el-table-column prop="newLoanAmount4" label="本年新增" align="center" width="80">
								<template slot-scope="scope">
									<span>{{(scope.row.newLoanAmount4 || '-') + (scope.row.index == 2 || scope.row.index == 4 ? '%' : '')}}</span>
								</template>
							</el-table-column>
						</el-table-column>
						<el-table-column label="10年以上" align="center">
							<el-table-column prop="loanAmount5" label="融资余额" align="center" width="80">
								<template slot-scope="scope">
									<span>{{(scope.row.loanAmount5 || '-') + (scope.row.index == 2 || scope.row.index == 4 ? '%' : '')}}</span>
								</template>
							</el-table-column>
							<el-table-column prop="newLoanAmount5" label="本年新增" align="center" width="80">
								<template slot-scope="scope">
									<span>{{(scope.row.newLoanAmount5 || '-') + (scope.row.index == 2 || scope.row.index == 4 ? '%' : '')}}</span>
								</template>
							</el-table-column>
						</el-table-column>
					</el-table>
				</div>

				<!-- 标题 -->
				<div class="data-title-box data-title-line clearfix">
					<span class="title">融资类型</span>
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
						<el-table-column label="标准化产品融资" align="center">
							<el-table-column prop="loanAmount1" label="贷款余额" align="center" width="80">
								<template slot-scope="scope">
									<span>{{(scope.row.loanAmount1 || '-') + (scope.row.index == 2 || scope.row.index == 4 ? '%' : '')}}</span>
								</template>
							</el-table-column>
							<el-table-column prop="newLoanAmount1" label="本年新增" align="center" width="80">
								<template slot-scope="scope">
									<span>{{(scope.row.newLoanAmount1 || '-') + (scope.row.index == 2 || scope.row.index == 4 ? '%' : '')}}</span>
								</template>
							</el-table-column>
						</el-table-column>
						<el-table-column label="非标准化产品融资" align="center">
							<el-table-column prop="loanAmount2" label="贷款余额" align="center" width="80">
								<template slot-scope="scope">
									<span>{{(scope.row.loanAmount2 || '-') + (scope.row.index == 2 || scope.row.index == 4 ? '%' : '')}}</span>
								</template>
							</el-table-column>
							<el-table-column prop="newLoanAmount2" label="本年新增" align="center" width="80">
								<template slot-scope="scope">
									<span>{{(scope.row.newLoanAmount2 || '-') + (scope.row.index == 2 || scope.row.index == 4 ? '%' : '')}}</span>
								</template>
							</el-table-column>
						</el-table-column>
						<el-table-column label="境外融资" align="center">
							<el-table-column prop="loanAmount3" label="贷款余额" align="center" width="80">
								<template slot-scope="scope">
									<span>{{(scope.row.loanAmount3 || '-') + (scope.row.index == 2 || scope.row.index == 4 ? '%' : '')}}</span>
								</template>
							</el-table-column>
							<el-table-column prop="newLoanAmount3" label="本年新增" align="center" width="80">
								<template slot-scope="scope">
									<span>{{(scope.row.newLoanAmount3 || '-') + (scope.row.index == 2 || scope.row.index == 4 ? '%' : '')}}</span>
								</template>
							</el-table-column>
						</el-table-column>
					</el-table>
				</div>
				<div class="huojv-data-list-more" @click="getMore">查看更多
					<van-icon name="arrow"/>
				</div>
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
	            tab1:1,
	            tab2:1,
	            tab3:1,
	            tab4:1,
                unit:'',
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
                resultData1:[],
                resultData2:[],
                orgType: '2'
            }
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
            init(){
                this.orgId = getUrlParam('chooseOrgId') || getUrlParam('orgId') || getLocalStorage('orgId').orgId;
                this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType;
                this.unit = (getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType) <=5 ? '亿':'万';

                this.getChartData1();
                this.getTableData1();
                this.getChartData2();
                this.getTableData2();
            },

	        // 融资周期
	        getChartData1(){
                request({
                    url: `/app-api/fundStructure/termSummary`,
                    method: 'get',
                    params: {orgId : this.orgId}
                }).then(({data}) => {
                    if (data.code === 0 && data.data) {
                        this.resultData1 = data.data;
                        this.drawChart1();
                        // let list = [
                        //     {itemName:'贷款金额(亿元)'},
                        //     {itemName:'结构占比'},
                        //     {itemName:'利息成本'},
                        //     {itemName:'综合利率'},
                        // ];
                        // data.data.forEach(item => {
                        //     list[0]['item' + (parseInt(item.termType) * 2 - 1)] = item.loanAmount || '-';
                        //     list[1]['item' + (parseInt(item.termType) * 2 - 1)] = (item.structureRate || '-') + '%';
                        //     list[2]['item' + (parseInt(item.termType) * 2 - 1)] = item.interestCost || '-';
                        //     list[3]['item' + (parseInt(item.termType) * 2 - 1)] = (item.complexInterestRate || '-') + '%';
						//
                        //     list[0]['item' + (parseInt(item.termType) * 2)] = item.newLoanAmount || '-';
                        //     list[1]['item' + (parseInt(item.termType) * 2)] = (item.newStructureRate || '-') + '%';
                        //     list[2]['item' + (parseInt(item.termType) * 2)] = item.newInterestCost || '-';
                        //     list[3]['item' + (parseInt(item.termType) * 2)] = (item.newComplexInterestRate || '-') + '%';
                        // });
						//
                        // this.tableData1 = list;
                    }
                });
	        },

	        getTableData1(){
                request({
                    url: `/app-api/fundStructure/termSummaryTable`,
                    method: 'get',
                    params: {orgId : this.orgId}
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

	                    this.tableData1 = list;
                    }
                });
	        },

            // 融资周期
            getChartData2(){
                request({
                    url: `/app-api/fundStructure/financeTypeSummary`,
                    method: 'get',
                    params: {orgId : this.orgId}
                }).then(({data}) => {
                    if (data.code === 0 && data.data) {
                        this.resultData2 = data.data;
                        this.drawChart2();
                    }
                });
            },

            getTableData2(){
                request({
                    url: `/app-api/fundStructure/financeTypeSummaryTable`,
                    method: 'get',
                    params: {orgId : this.orgId}
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

                        this.tableData2 = list;
                    }
                });
            },

            checkTab1(tab1){
                this.tab1 = tab1;
            },

            checkTab2(tab2){
                this.tab2 = tab2;
                this.drawChart1();
            },

            checkTab3(tab3){
                this.tab3 = tab3;
            },

            checkTab4(tab4){
                this.tab4 = tab4;
                this.drawChart2();
            },

	        drawChart1(){
                let chartData1 = [],chartData2 = [];
                let xAxisData = [];
                this.resultData1.forEach(item => {
                    if(item.termType == 1){
                        xAxisData.push('1年以内');
                    }else if(item.termType == 2){
                        xAxisData.push('1-3年');
                    }else if(item.termType == 3){
                        xAxisData.push('3-5年');
                    }else if(item.termType == 4){
                        xAxisData.push('5-10年');
                    }else if(item.termType == 5){
                        xAxisData.push('10年以上');
                    }

                    if(this.tab2 == 1){
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
		        option.xAxis.axisLabel.rotate = 45;
                option.xAxis.data = xAxisData;
                if (xAxisData.length > 5) {
                    option.dataZoom[0].endValue = xAxisData[4];
                } else {
                    option.dataZoom[0].endValue = xAxisData[xAxisData.length - 1];
                }
                option.dataZoom[0].startValue = xAxisData[0];
                option.tooltip.extraCssText='box-shadow: 0 0 10px #ccc; padding: 6px 15px;';

                let myChart = new echarts.init(this.$refs.chart1);
                myChart.setOption(option, true);
	        },

            drawChart2(){
                let chartData1 = [],chartData2 = [];
                let xAxisData = [];
                this.resultData2.forEach(item => {
                    if(item.financingType == 1){
                        xAxisData.push('标准化产品融资');
                    }else if(item.financingType == 2){
                        xAxisData.push('非标准化产品融资');
                    }else if(item.financingType == 3){
                        xAxisData.push('境外融资');
                    }

                    if(this.tab4 == 1){
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

                let myChart = new echarts.init(this.$refs.chart2);
                myChart.setOption(option, true);
            },

            getMore(){
                this.$router.push({path:'/report/financing/moreStructure', query: {orgId: this.orgId, token: getUrlParam('token')}});
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
            [Icon.name]: Icon,
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
