<template>
	<div class="report-index">
		<div class="main-content">
			<div class="data-content-panel no-top-left-radius clearfix" style="overflow: visible;">

				<div v-show="tab1 != 4">
					<ul class="data-info-list pb-20 two-cols mt-30" style="border-bottom: 0;">
						<li>
							<div class="data-type middle">总收入</div>
							<div class="data-box mt-20">
								<label class="value middle" v-text="boardData.foodIncome || '-'"></label>
								<label class="unit">万元</label>
								<i v-show="boardData.foodIncomeCompare" :class="boardData.foodIncomeCompare < 0 ? 'huojv-ico-down' : 'huojv-ico-up'" class="normal ml-5"></i>
							</div>
							<div class="data-type mt-10">同期：<label v-text="boardData.foodIncomeLast || '-'"></label>万元</div>
							<div class="data-type">预算：<label v-text="boardData.foodIncomePlan || '-'"></label>万元</div>
						</li>
						<li>
							<div class="data-type middle">成本</div>
							<div class="data-box mt-20">
								<label class="value middle">--</label>
								<label class="unit"></label>
							</div>
						</li>
					</ul>

					<!-- 标题 -->
					<div class="data-title-box data-title-line clearfix">
						<span class="title">餐饮收入组成</span>
					</div>

					<div class="huojv-costContract-chart-panel" ref="chart1"></div>

					<!-- 标题 -->
					<div class="data-title-box data-title-line clearfix">
						<span class="title">人均消费趋势</span>
					</div>

					<div class="huojv-costContract-chart-panel max" ref="chart2"></div>
				</div>

				<div v-show="tab1 == 4">
					<ul class="data-info-list pb-20 one-cols mt-30" style="border-bottom: 0;">
						<li>
							<div class="data-type middle">总收入</div>
							<div class="data-box mt-20">
								<label class="value middle" v-text="boardData.foodIncome || '-'"></label>
								<label class="unit">元</label>
								<i v-show="boardData.foodIncomeCompare" :class="boardData.foodIncomeCompare < 0 ? 'huojv-ico-down' : 'huojv-ico-up'" class="normal ml-5"></i>
							</div>
							<div class="data-type mt-10">同期：<label v-text="boardData.foodIncomeLast || '-'"></label>元</div>
						</li>
					</ul>
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
                chartOption: {
                    tooltip: {
                        trigger: 'axis',
                        backgroundColor: "rgba(255,255,255,0.8)", //设置背景图片 rgba格式
                        color: "#333333",
                        extraCssText: 'box-shadow: 0 0 10px #ccc; padding: 15px;',
                        borderColor: "gray", //设置边框颜色
                        textStyle: {
                            color: "#333333", //设置文字颜色
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
                            color: '#333333'
                        },
                        x: 'center',
                        y: 'center'
                    },
                    legend: {
                        show: true,
                        type: 'plain',
                        icon: 'circle', // rect
                        itemWidth: 10,
                        itemHeight: 10,
                        // orient: 'horizon',
                        x: 'center',
                        y: 'bottom',
                        textStyle: {
                            fontSize: 12,
                            color: '#333333'
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
                        'top': '12%',
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
                                color: '#E8E8E8'
                            }
                        },
                        axisLabel: {
                            show: true,
                            rotate: 45,
                            textStyle: {
                                color: '#333333',
                                fontSize: 11
                            }
                        }
                    },
                    yAxis: {
                        type: 'value',
                        name: '',
                        nameTextStyle:{
                            color:"#333333",
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#E8E8E8'
                            }
                        },
	                    splitLine:{
                            lineStyle: {
                                color: '#E8E8E8'
                            }
	                    },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#333333'
                            }
                        }
                    },
                    series: [],
                },

                queryPeriod:'年度',
                boardData:{},
            }
        },
        props:['tab1','orgId'],
        watch:{
            'tab1':function(newVal, oldVal){
                this.init();
            },
            'orgId':function(newVal, oldVal){
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
            init(tab1){
                // this.orgId = getUrlParam('chooseOrgId') || getUrlParam('orgId') || getLocalStorage('orgId').orgId;
                this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType;
                this.unit = this.orgType <=5 ? '亿':'万';

                // if(tab1){
                //     this.tab1 = tab1;
                // }
                // console.log(tab1, this.tab1)
                switch (this.tab1) {
                    case 1: this.queryPeriod = '年度'; break;
                    case 2: this.queryPeriod = '季度'; break;
                    case 3: this.queryPeriod = '月度'; break;
                    case 4: this.queryPeriod = '日'; break;
                }

                this.getOperationData();
                this.getTrendData();
                this.getCateringIncomeData();
            },

	        // 获取营运数据
	        getOperationData(){
                request({
                    url: '/app-api/culturalTourism/hotel/overallOperation',
                    method: 'post',
                    data:{orgId:this.orgId,queryPeriod:this.queryPeriod}
                }).then(({data}) => {
                    if (data.code === 0 && data.data && data.data.length) {
                        this.boardData = {
                            foodIncome : data.data[0].foodIncome && data.data[0].foodIncome.amount || '-',
                            foodIncomeLast :data.data[0].foodIncomeLast && data.data[0].foodIncomeLast.amount || '-',
                            foodIncomePlan :data.data[0].foodIncomePlan && data.data[0].foodIncomePlan.amount || '-',
                            foodIncomeCompare:(data.data[0].foodIncome && data.data[0].foodIncome.amount || 0) - (data.data[0].foodIncomeLast && data.data[0].foodIncomeLast.amount || 0)
                        };
                    }
                }).catch((e) => {
                    console.log('getBoardData-err', e);
                });
	        },

            // 获取趋势图表数据
            getTrendData(){
                request({
                    url: '/app-api/culturalTourism/hotel/incomeTrend',
                    method: 'post',
                    data:{orgId:this.orgId,queryPeriod:this.queryPeriod}
                }).then(({data}) => {
                    if (data.code === 0 && data.data && data.data.length) {
                        let list = [];
                        data.data.forEach(item => {
                            let chartData1 = {
                                foodConsumerNum:item.foodConsumerNum || '-',
                                foodPerCost:item.foodPerCost && item.foodPerCost.amount || '-',
                                foodPerCostPlan:item.foodPerCostPlan && item.foodPerCostPlan.amount || '-',
                                foodPerCostLast:item.foodPerCostLast && item.foodPerCostLast.amount || '-',
                                statMonth:item.statMonth,
                            };

                            list.push(chartData1);
                        })

                        this.drawChart2(list);

                    }else{
                        this.drawChart2([]);
                    }
                }).catch((e) => {
                    console.log('getBoardData-err', e);
                });
            },

            // 获取趋势图表数据
            getCateringIncomeData(){
                request({
                    url: '/app-api/culturalTourism/hotel/cateringIncome',
                    method: 'post',
                    data:{orgId:this.orgId,queryPeriod:this.queryPeriod}
                }).then(({data}) => {
                    if (data.code === 0 && data.data && data.data.length) {
                        let list = [];
                        data.data.forEach(item => {
                            let chartData1 = {
                                foodIncome:item.foodIncome && item.foodIncome.amount || '-',
                                foodIncomeLast:item.foodIncomeLast && item.foodIncomeLast.amount || '-',
                                foodIncomePlan:item.foodIncomePlan && item.foodIncomePlan.amount || '-',
                                foodType:item.foodType,
                            };

                            list.push(chartData1);
                        })

                        this.drawChart1(list);

                    }else{
                        this.drawChart1([]);
                    }
                }).catch((e) => {
                    console.log('getBoardData-err', e);
                });
            },

            drawChart1(data){
                let chartData1 = [],chartData2 = [],chartData3 = [];
                let xAxisData = [];

                data.forEach(item => {
                    chartData1.push(item.foodIncome);
                    chartData2.push(item.foodIncomePlan);
                    chartData3.push(item.foodIncomeLast);
                    xAxisData.push(item.foodType);
                })

                let series = [{
                    name: '实际收入',
                    type: 'bar',
                    barWidth: '22',
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
                    data: chartData1
                },{
                    name: '预算收入',
                    type: 'bar',
                    barWidth: '22',
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
                    data: chartData2
                },{
                    name: '去年同期',
                    type: 'bar',
                    barWidth: '22',
                    // formatter: '{value} 万㎡',
                    itemStyle: {
                        normal: {
                            color: '#FFC40F'
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
                    data: chartData3
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
                    option.grid.left = '10%'
                }
                option.legend.data = legendData;
                option.yAxis.name = '单位：万元'
                // option.title.text = '';
                // option.yAxis.name = this.tab3 == 1 ? '单位('+ this.costUnit +')' : '单位('+ this.areaUnit +')';
                option.tooltip.formatter = params => {
                    let index = 0;
                    let showHtm = "<div>" + params[0].axisValueLabel + "</div>";
                    for(let i = 0; i <= xAxisData.length; i++){
                        if(xAxisData[i] == params[0].axisValueLabel){
                            index = i;
                            break;
                        }
                    }

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

                if(option.xAxis.data.length > 3){
                    option.xAxis.axisLabel.rotate = 45;
                }else{
                    option.xAxis.axisLabel.rotate = 0;
                }

                option.xAxis.data = xAxisData;
                if (xAxisData.length > 2) {
                    option.dataZoom[0].endValue = xAxisData[1];
                } else {
                    option.dataZoom[0].endValue = xAxisData[xAxisData.length - 1];
                }
                option.dataZoom[0].startValue = xAxisData[0];
                option.tooltip.extraCssText='box-shadow: 0 0 10px #ccc; padding: 6px 15px;';

                let myChart = new echarts.init(this.$refs.chart1);
                myChart.setOption(option, true);
            },

            drawChart2(data){
                let chartData1 = [],
	                chartData2 = [],
	                chartData3 = [],
	                chartData4 = [];
                let xAxisData = [];

                data.forEach(item => {
                    chartData1.push(item.foodConsumerNum);
                    chartData2.push(item.foodPerCost);
                    chartData3.push(item.foodPerCostPlan);
                    chartData4.push(item.foodPerCostLast);
                    xAxisData.push(item.statMonth + '月');
                })

                let series = [{
                    name: '消费人数',
                    data: chartData1,
                    type: 'line',
                    smooth: false,
                    symbol:'none',
                    yAxisIndex:1,
                    itemStyle: {
                        normal: {
                            color: '#4995E3',
                        }
                    },
                    lineStyle: {
                        normal: {
                            width: 2,
                            // type:'dotted'
                        }
                    }
                },{
                    name: '人均消费金额',
                    data: chartData2,
                    type: 'line',
                    smooth: false,
                    symbol:'none',
                    itemStyle: {
                        normal: {
                            color: '#006E38',
                        }
                    },
                    lineStyle: {
                        normal: {
                            width: 2,
                            // type:'dotted'
                        }
                    }
                },{
                    name: '预算人均消费金额',
                    data: chartData3,
                    type: 'line',
                    smooth: false,
                    symbol:'none',
                    itemStyle: {
                        normal: {
                            color: '#B4A36B',
                        }
                    },
                    lineStyle: {
                        normal: {
                            width: 2,
                            // type:'dotted'
                        }
                    }
                },{
                    name: '同期人均消费金额',
                    data: chartData4,
                    type: 'line',
                    smooth: false,
                    symbol:'none',
                    itemStyle: {
                        normal: {
                            color: '#FFC40F',
                        }
                    },
                    lineStyle: {
                        normal: {
                            width: 2,
                            // type:'dotted'
                        }
                    }
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
                    option.grid.left = '10%'
                    option.grid.right = '10%'
                }
                option.yAxis = [{
                    name: '单位(元)',
	                nameTextStyle:{
                        color: '#333333'
	                },
                    type: 'value',
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#E8E8E8'
                        }
                    },
                    splitLine:{
                        lineStyle: {
                            color: '#E8E8E8'
                        }
                    },
                    axisLabel: {
                        formatter: '{value}',
                        show: true,
                        textStyle: {
                            color: '#333333'
                        }
                    }
                }, {
                    name: '单位(人)',
                    nameTextStyle:{
                        color: '#333333'
                    },
                    type: 'value',
                    axisLine: {
                        lineStyle: {
                            color: '#E8E8E8'
                        }
                    },
                    splitLine:{
                        lineStyle: {
                            color: '#E8E8E8'
                        }
                    },
                    axisLabel: {
                        formatter: '{value}',
                        show: true,
                        textStyle: {
                            color: '#333333'
                        }
                    },
                    axisTick: {
                        show: false
                    }
                }];
                option.legend.data = legendData;
                // option.title.text = '';
                // option.yAxis.name = this.tab3 == 1 ? '单位('+ this.costUnit +')' : '单位('+ this.areaUnit +')';
                option.tooltip.formatter = params => {
                    let index = 0;
                    let showHtm = "<div>" + params[0].axisValueLabel + "</div>";
                    for(let i = 0; i <= xAxisData.length; i++){
                        if(xAxisData[i] == params[0].axisValueLabel){
                            index = i;
                            break;
                        }
                    }

                    for (let i = 0; i < params.length; i++) {
                        //名称
                        let text = '<span class="chart-tooltip">' + params[i].seriesName + '：</span>';
                        //值
                        let value = params[i].value + (params[i].seriesName == '入住率' ? '%' : '');
                        let marker = params[i].marker;

                        showHtm += '<div style="line-height: 16px;">' +marker + text + value + '</div>';
                    }
                    return showHtm;
                }
                // option.tooltip.formatter = '{b} <br/>{a0} ： {c0} 个<br/>{a1} ： {c1} 个<br/>{a2} ： {c2} 个';

                
                option.xAxis.axisLabel.rotate = 45;
                option.xAxis.data = xAxisData;
                 if (data.length>5) {
                    option.dataZoom = [{
                        type: 'inside',
                        show: true,
                        xAxisIndex: [0],
                        left: '9%',
                        bottom: 0,
                        height: 10,
                        start: 0,
                        zoomLock: true,
                        end: 40 //初始化滚动条
                    }]
                }
                if (xAxisData.length > 8) {
                    option.dataZoom[0].endValue = xAxisData[7];
                } else {
                    option.dataZoom[0].endValue = xAxisData[xAxisData.length - 1];
                }
                option.dataZoom[0].startValue = xAxisData[0];
                option.tooltip.extraCssText='box-shadow: 0 0 10px #ccc; padding: 6px 15px;';

                let myChart = new echarts.init(this.$refs.chart2);
                myChart.setOption(option, true);
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
		color: #333333;
		float: right;
		margin-top: 12px;
		&.up{
			color: #209B5C;
		}
	}
</style>
