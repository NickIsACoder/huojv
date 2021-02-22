<template>
	<div class="report-index">
		<div class="main-content width100">
			<div class="data-content-panel clearfix" style="overflow: visible;">
				<div class="huojv-costContract-chart-panel max" ref="chart1"></div>

				<!-- 标题 -->
				<div class="data-title-box data-title-line clearfix">
					<span class="title">收入变动<label class="title-unit">(单位：万元)</label></span>
				</div>
				<div class="huojv-costContract-chart-panel max" ref="chart2"></div>

				<!-- 标题 -->
				<div class="data-title-box data-title-line clearfix">
					<span class="title">土地成本<label class="title-unit">(单位：万元)</label></span>
				</div>
				<div class="huojv-costContract-chart-panel max" ref="chart3"></div>

				<!-- 标题 -->
				<div class="data-title-box data-title-line clearfix">
					<span class="title">建安成本<label class="title-unit">(单位：万元)</label></span>
				</div>
				<div class="huojv-costContract-chart-panel max" ref="chart4"></div>

				<!-- 标题 -->
				<div class="data-title-box data-title-line clearfix">
					<span class="title">费用<label class="title-unit">(单位：万元)</label></span>
				</div>
				<div class="huojv-costContract-chart-panel max" ref="chart5"></div>

				<!-- 标题 -->
				<div class="data-title-box data-title-line clearfix">
					<span class="title">税金<label class="title-unit">(单位：万元)</label></span>
				</div>
				<div class="huojv-costContract-chart-panel max" ref="chart6"></div>
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
                        show: true,
                        textStyle: {
                            fontWeight: 'normal',
                            fontSize: 14,
                            color: '#333333'
                        },
                        x: 'center',
                        y: 'top'
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
                                color: '#E8E8E8'
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
                                color: '#666666'
                            }
                        }
                    },
                    series: [],
                },
                orgType: '2'
            }
        },
        mounted() {
            this.init();
        },
        watch: {
			'$store.state.orgId': function(newVal, oldVal) {
				this.init();
			}
		},
        methods: {
            init(){
                this.orgId = getUrlParam('chooseOrgId') || getUrlParam('orgId') || getLocalStorage('orgId').orgId;
                this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType;
                this.unit = this.orgType <=5 ? '亿':'万';

                this.getChartData1();
                this.getChartData2();
                this.getChartData3();
                this.getChartData4();
                this.getChartData5();
            },

	        // 收入及开发成本变动
	        getChartData1(){
                request({
                    url: `/app-api/allPeriod/revenueDecelopCostChange`,
                    method: 'get',
                    params: {orgId : this.orgId}
                }).then(({data}) => {
                    if (data.code === 0 && data.data) {
                        this.drawChart1(data.data);
                    }else{
                        this.drawChart1([]);
                    }
                });
	        },

	        drawChart1(data){
                let chartData1 = [data.calRevenue,data.calLandCost,data.calConstCost,data.calExpense,data.calTaxe,data.calProfit],
	                chartData2 = [data.pleRevenue,data.pleLandCost,data.pleConstCost,data.pleExpense,data.pleTaxe,data.pleProfit],
                    diffData = [data.diffRevenue,data.diffLandCost,data.diffConstCost,data.diffExpense,data.diffTaxe,data.diffProfit];
                let xAxisData = ['收入','土地','建安','费用','税金','占用后利润'];

                let series = [{
                    name: '拿地测算',
                    type: 'bar',
                    barWidth: '15',
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
                    name: '当前军令状',
                    type: 'bar',
                    barWidth: '15',
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
                }];

                let legendData = series.map(item => {
                    return item.name;
                });

                let option = JSON.parse(JSON.stringify(this.chartOption));
                option.series = series;
                option.title.text = '收入及开发成本变动';
                let hasData = false;
                series.forEach(item => {
                    if(item.data.length > 0){
                        hasData = true;
                    }
                })
                if(!hasData){
                    option.title.text = '暂无数据';
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
                        let value = params[i].value + '万元';
                        let marker = params[i].marker;

                        showHtm += '<div style="line-height: 16px;">' +marker + text + value + '</div>';
                    }
                    showHtm += `<div>差异：${diffData[index]} 万元</div>`;

                    return showHtm;
                }
                // option.tooltip.formatter = '{b} <br/>{a0} ： {c0} 个<br/>{a1} ： {c1} 个<br/>{a2} ： {c2} 个';


		        option.xAxis.axisLabel.rotate = 45;
                option.xAxis.data = xAxisData;
                if (xAxisData.length > 6) {
                    option.dataZoom[0].endValue = xAxisData[5];
                } else {
                    option.dataZoom[0].endValue = xAxisData[xAxisData.length - 1];
                }
                option.dataZoom[0].startValue = xAxisData[0];
                option.tooltip.extraCssText='box-shadow: 0 0 10px #ccc; padding: 6px 15px;';

                let myChart = new echarts.init(this.$refs.chart1);
                myChart.setOption(option, true);
	        },

            // 收入变动
            getChartData2(){
                request({
                    url: `/app-api/allPeriod/fullCycleIncomeChange`,
                    method: 'get',
                    params: {orgId : this.orgId}
                }).then(({data}) => {
                    if (data.code === 0 && data.data) {
                        this.drawChart2(data.data);
                    }
                });
            },

            drawChart2(data){
                let xAxisData = ['住宅','商铺','别墅','车位','公寓','写字楼','其它'];
                let chartData1 = new Array(xAxisData.length).fill(null),
	                chartData2 = new Array(xAxisData.length).fill(null),
	                diffData = new Array(xAxisData.length).fill(null);

                data.fullCycleIncomeChangeDetialList.forEach(item => {
                    let index = parseInt(item.productType)
                    if(index > 0){
                        chartData1[index - 1] = item.calRevenue;
                        chartData2[index - 1] = item.pleRevenue;
                        diffData[index - 1] = item.diffRevenue;
                    }
                })

                let series = [{
                    name: '拿地测算',
                    type: 'bar',
                    barWidth: '15',
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
                    name: '当前军令状',
                    type: 'bar',
                    barWidth: '15',
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
                }];

                let legendData = series.map(item => {
                    return item.name;
                });

                let option = JSON.parse(JSON.stringify(this.chartOption));
                option.series = series;
                option.title.text = `收入变动金额: ${data.diffRevenue > 0 ? ('+' + data.diffRevenue) : (data.diffRevenue === undefined ? '-' : data.diffRevenue)}万元`;
                let hasData = false;
                series.forEach(item => {
                    if(item.data.length > 0){
                        hasData = true;
                    }
                })
                if(!hasData){
                    option.title.text = '暂无数据';
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
                        let value = params[i].value + '万元';
                        let marker = params[i].marker;

                        showHtm += '<div style="line-height: 16px;">' +marker + text + value + '</div>';
                    }
                    showHtm += `<div>差异：${diffData[index]}万元</div>`;

                    return showHtm;
                }
                // option.tooltip.formatter = '{b} <br/>{a0} ： {c0} 个<br/>{a1} ： {c1} 个<br/>{a2} ： {c2} 个';


                option.xAxis.axisLabel.rotate = 45;
                option.xAxis.data = xAxisData;
                if (xAxisData.length > 6) {
                    option.dataZoom[0].endValue = xAxisData[5];
                } else {
                    option.dataZoom[0].endValue = xAxisData[xAxisData.length - 1];
                }
                option.dataZoom[0].startValue = xAxisData[0];
                option.tooltip.extraCssText='box-shadow: 0 0 10px #ccc; padding: 6px 15px;';

                let myChart = new echarts.init(this.$refs.chart2);
                myChart.setOption(option, true);
            },

            // 土地成本
            getChartData3(){
                request({
                    url: `/app-api/allPeriod/fullCycleLandCostChange`,
                    method: 'get',
                    params: {orgId : this.orgId}
                }).then(({data}) => {
                    if (data.code === 0 && data.data) {
                        this.drawChart3(data.data);
                    }
                });
            },

            drawChart3(data){
                let chartData1 = [data.calLandCost],chartData2 = [data.pleLandCost],diffData = [data.diffLandCost];
                let xAxisData = ['土地成本'];

                let series = [{
                    name: '拿地测算',
                    type: 'bar',
                    barWidth: '15',
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
                    name: '当前军令状',
                    type: 'bar',
                    barWidth: '15',
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
                }];

                let legendData = series.map(item => {
                    return item.name;
                });

                let option = JSON.parse(JSON.stringify(this.chartOption));
                option.series = series;
                option.title.text = `土地成本变动金额: ${data.diffLandCost > 0 ? ('+' + data.diffLandCost) : (data.diffLandCost === undefined ? '-' : data.diffLandCost)}万元`;
                let hasData = false;
                series.forEach(item => {
                    if(item.data.length > 0){
                        hasData = true;
                    }
                })
                if(!hasData){
                    option.title.text = '暂无数据';
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
                        let value = params[i].value + '万元';
                        let marker = params[i].marker;

                        showHtm += '<div style="line-height: 16px;">' +marker + text + value + '</div>';
                    }
                    showHtm += `<div>差异：${diffData[index]}万元</div>`;
                    return showHtm;
                }
                // option.tooltip.formatter = '{b} <br/>{a0} ： {c0} 个<br/>{a1} ： {c1} 个<br/>{a2} ： {c2} 个';


                option.xAxis.axisLabel.rotate = 45;
                option.xAxis.data = xAxisData;
                if (xAxisData.length > 6) {
                    option.dataZoom[0].endValue = xAxisData[5];
                } else {
                    option.dataZoom[0].endValue = xAxisData[xAxisData.length - 1];
                }
                option.dataZoom[0].startValue = xAxisData[0];
                option.tooltip.extraCssText='box-shadow: 0 0 10px #ccc; padding: 6px 15px;';

                let myChart = new echarts.init(this.$refs.chart3);
                myChart.setOption(option, true);
            },

            // 建安成本
            getChartData4(){
                request({
                    url: `/app-api/allPeriod/fullCycleConstructionInstallationCost`,
                    method: 'get',
                    params: {orgId : this.orgId}
                }).then(({data}) => {
                    if (data.code === 0 && data.data) {
                        this.drawChart4(data.data);
                    }
                });
            },

            drawChart4(data){
                let xAxisData = ['住宅','商铺','别墅','车位','公寓','写字楼','其它'];
                let chartData1 = new Array(xAxisData.length).fill(null),
                    chartData2 = new Array(xAxisData.length).fill(null),
	                diffData = new Array(xAxisData.length).fill(null);

                data.forEach(item => {
                    let index = parseInt(item.productType)
                    if(index > 0){
                        chartData1[index - 1] = item.calConstCost;
                        chartData2[index - 1] = item.pleConstCost;
                        diffData[index - 1] = item.diffConstCost;
                    }
                })

                let series = [{
                    name: '拿地测算',
                    type: 'bar',
                    barWidth: '15',
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
                    name: '当前军令状',
                    type: 'bar',
                    barWidth: '15',
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
                }];

                let legendData = series.map(item => {
                    return item.name;
                });

                let option = JSON.parse(JSON.stringify(this.chartOption));
                option.series = series;
                let allDataObj = data.filter(item => {
                    return item.productType == 0;
                })[0];
                option.title.text = `建安成本变动金额：${allDataObj.diffConstCost > 0 ? ('+' + allDataObj.diffConstCost) : (allDataObj.diffConstCost === undefined ? '-' : allDataObj.diffConstCost)}万元`;
                let hasData = false;
                series.forEach(item => {
                    if(item.data.length > 0){
                        hasData = true;
                    }
                })
                if(!hasData){
                    option.title.text = '暂无数据';
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
                        let value = params[i].value + '万元';
                        let marker = params[i].marker;

                        showHtm += '<div style="line-height: 16px;">' +marker + text + value + '</div>';
                    }
                    showHtm += `<div>差异：${diffData[index]}万元</div>`;
                    return showHtm;
                }
                // option.tooltip.formatter = '{b} <br/>{a0} ： {c0} 个<br/>{a1} ： {c1} 个<br/>{a2} ： {c2} 个';


                option.xAxis.axisLabel.rotate = 45;
                option.xAxis.data = xAxisData;
                if (xAxisData.length > 6) {
                    option.dataZoom[0].endValue = xAxisData[5];
                } else {
                    option.dataZoom[0].endValue = xAxisData[xAxisData.length - 1];
                }
                option.dataZoom[0].startValue = xAxisData[0];
                option.tooltip.extraCssText='box-shadow: 0 0 10px #ccc; padding: 6px 15px;';

                let myChart = new echarts.init(this.$refs.chart4);
                myChart.setOption(option, true);
            },

            // 费用税金
            getChartData5(){
                request({
                    url: `/app-api/allPeriod/fullCycleFeeTax`,
                    method: 'get',
                    params: {orgId : this.orgId}
                }).then(({data}) => {
                    if (data.code === 0 && data.data) {
                        this.drawChart5(data.data);
                        this.drawChart6(data.data);
                    }
                });
            },

            drawChart5(data){
                let chartData1 = [data.calFINExpense || '-',data.calADMExpense,data.calSellingxpense],
	                chartData2 = [data.pleFINExpense,data.pleADMExpense,data.pleSellingxpense],
	                diffData = [data.diffFINExpense,data.diffADMExpense,data.diffSellingxpense];
                let xAxisData = ['财务费用','管理费用','销售费用'];

                let series = [{
                    name: '拿地测算',
                    type: 'bar',
                    barWidth: '15',
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
                    name: '当前军令状',
                    type: 'bar',
                    barWidth: '15',
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
                }];

                let legendData = series.map(item => {
                    return item.name;
                });

                let option = JSON.parse(JSON.stringify(this.chartOption));
                option.series = series;
                option.title.text = `费用变动总金额: ${data.diffExpense > 0 ? ('+' + data.diffExpense) : (data.diffExpense === undefined ? '-' : data.diffExpense)}万元`;
                let hasData = false;
                series.forEach(item => {
                    if(item.data.length > 0){
                        hasData = true;
                    }
                })
                if(!hasData){
                    option.title.text = '暂无数据';
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
                        let value = params[i].value + '万元';
                        let marker = params[i].marker;

                        showHtm += '<div style="line-height: 16px;">' +marker + text + value + '</div>';
                    }
                    showHtm += `<div>差异：${diffData[index]}万元</div>`;
                    return showHtm;
                }
                // option.tooltip.formatter = '{b} <br/>{a0} ： {c0} 个<br/>{a1} ： {c1} 个<br/>{a2} ： {c2} 个';


                option.xAxis.axisLabel.rotate = 45;
                option.xAxis.data = xAxisData;
                if (xAxisData.length > 6) {
                    option.dataZoom[0].endValue = xAxisData[5];
                } else {
                    option.dataZoom[0].endValue = xAxisData[xAxisData.length - 1];
                }
                option.dataZoom[0].startValue = xAxisData[0];
                option.tooltip.extraCssText='box-shadow: 0 0 10px #ccc; padding: 6px 15px;';

                let myChart = new echarts.init(this.$refs.chart5);
                myChart.setOption(option, true);
            },

            drawChart6(data){
                let chartData1 = [data.calVAT,data.calVATAdditonal,data.calLandIncreaseTax,data.calBusinessIncomeTax],
	                chartData2 = [data.pleVAT,data.pleVATAdditonal,data.pleLandIncreaseTax,data.pleBusinessIncomeTax],
	                diffData = [data.diffVAT,data.diffVATAdditonal,data.diffLandIncreaseTax,data.diffBusinessIncomeTax];
                let xAxisData = ['增值税','增值税附加','土增税','企业所得税'];

                let series = [{
                    name: '拿地测算',
                    type: 'bar',
                    barWidth: '15',
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
                    name: '当前军令状',
                    type: 'bar',
                    barWidth: '15',
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
                }];

                let legendData = series.map(item => {
                    return item.name;
                });

                let option = JSON.parse(JSON.stringify(this.chartOption));
                option.series = series;
                option.title.text = `税金变动总金额: ${data.diffTaxe > 0 ? ('+' + data.diffTaxe) : (data.diffTaxe === undefined ? '-' : data.diffTaxe)}万元`;
                let hasData = false;
                series.forEach(item => {
                    if(item.data.length > 0){
                        hasData = true;
                    }
                })
                if(!hasData){
                    option.title.text = '暂无数据';
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
                        let value = params[i].value + '万元';
                        let marker = params[i].marker;

                        showHtm += '<div style="line-height: 16px;">' +marker + text + value + '</div>';
                    }
                    showHtm += `<div>差异：${diffData[index]}万元</div>`;
                    return showHtm;
                }
                // option.tooltip.formatter = '{b} <br/>{a0} ： {c0} 个<br/>{a1} ： {c1} 个<br/>{a2} ： {c2} 个';


                option.xAxis.axisLabel.rotate = 45;
                option.xAxis.data = xAxisData;
                if (xAxisData.length > 6) {
                    option.dataZoom[0].endValue = xAxisData[5];
                } else {
                    option.dataZoom[0].endValue = xAxisData[xAxisData.length - 1];
                }
                option.dataZoom[0].startValue = xAxisData[0];
                option.tooltip.extraCssText='box-shadow: 0 0 10px #ccc; padding: 6px 15px;';

                let myChart = new echarts.init(this.$refs.chart6);
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
