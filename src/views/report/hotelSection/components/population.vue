<template>
	<div class="report-index">
		<div class="main-content">
			<div class="data-content-panel no-top-left-radius clearfix" style="overflow: visible;">
				<div v-show="tab1 != 4">
					<!-- 标题 -->
					<div class="data-title-box data-title-line clearfix">
						<span class="title">总体经营情况</span>
					</div>

					<div class="huojv-costContract-chart-panel" ref="chart1"></div>
					<div class="huojv-data-list-more" @click="getMore" v-eventlisten="{isChangePage:false,pageEvent:'点击酒店版块-总体经营明细-查看明细'}">查看明细
						<van-icon name="arrow"/>
					</div>

					<!-- 标题 -->
					<div class="data-title-box data-title-line clearfix">
						<span class="title">收入趋势</span>
					</div>

					<div class="huojv-costContract-chart-panel" ref="chart2"></div>

					<!-- 标题 -->
					<div class="data-title-box data-title-line clearfix">
						<span class="title">收入结构情况</span>
					</div>

					<div class="huojv-costContract-chart-panel" ref="chart3"></div>

					<!-- 标题 -->
					<div class="data-title-box data-title-line clearfix">
						<span class="title">收入结构占比</span>
					</div>

					<div class="huojv-costContract-chart-panel" ref="chart4"></div>
				</div>

				<div v-show="tab1 == 4" class="reportBox">
					<!-- 标题 -->
					<div class="data-title-box data-title-line clearfix">
						<span class="title">营业收入日报</span>
					</div>

					<el-table stripe class="huo-list-table main-theme-table"
                        :span-method="objectSpanMethod"
                         ref="tableRef1" size="mini" highlight-current-row border :data="tableData">
                        <template v-for="(item,index) in tableTitle">
                            <el-table-column :fixed="index<2" :label="index>0?item.title:''"
											 :width="index>0?'70':'60'" align="center" :prop="item.title" :key="index+(item.title||'-')">
                                <template slot-scope="scope">
                                    <span :class="index<2?'green':''">{{scope.row[item.title]||'-'}}</span>
                                </template>
                            </el-table-column>
                        </template>
					</el-table>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
    import scrollFixed from '@/mixin/scroll-fixed';
    import {List, PullRefresh, Icon} from 'vant';
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
                                color: '#333333'
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
                tableData:[],
                tableTitle: [
                    {name: '组织' },
                    {name: '日期' },
                    {name: '本月累计' },
                    {name: '预算' },
                    {name: '预算完成率'},
                    {name: '上年同期', }
                ],
                // tableDataColumn: [
                //     { rowName: '入住房', prop: 'inroomqty'},
                //     { rowName: '入住率（OCC）', prop: 'occrate'},
                //     { rowName: '平均房价（ADR）', prop: 'adrprice'},
                //     { rowName: '平均客房收益（RevPar）', prop: 'revpar'},
                //     { rowName: '预订率（OTB）', prop: 'resrate'},
                //     { rowName: '客房收入', prop: 'houseincome'},
                //     { rowName: '餐饮收入', prop: 'foodincome'},
                //     { rowName: '会议收入', prop: 'meetingincome'},
                //     { rowName: '其它收入', prop: 'elseincome'},
                //     { rowName: '总收入', prop: 'totalincome'}
                // ],
                queryPeriod:'',
				tableArr:[],//合并单元格
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
                switch (this.tab1) {
                    case 1: this.queryPeriod = '年度'; break;
                    case 2: this.queryPeriod = '季度'; break;
                    case 3: this.queryPeriod = '月度'; break;
                    case 4: this.queryPeriod = '日'; break;
                }

                if (this.tab1==4) {
                    this.getDailyreport()
                } else {
                    this.getOperationData();
                    this.getTrendData();
                }
            },

            // 获取营运数据
            getOperationData(){
                request({
                    url: '/app-api/culturalTourism/hotel/overallOperation',
                    method: 'post',
                    data:{orgId:this.orgId,queryPeriod:this.queryPeriod}
                }).then(({data}) => {
                    if (data.code === 0 && data.data && data.data.length>0) {
                        let chartData1 = {
                            totalIncome : data.data[0].totalIncome && data.data[0].totalIncome.amount || '-',
                            totalIncomeLast :data.data[0].totalIncomeLast && data.data[0].totalIncomeLast.amount || '-',
                            totalIncomePlan :data.data[0].totalIncomePlan && data.data[0].totalIncomePlan.amount || '-'
                        };
                        this.drawChart1(chartData1);

                        let chartData3 = {
                            houseIncome : data.data[0].houseIncome && data.data[0].houseIncome.amount || '-',
                            houseIncomeLast :data.data[0].houseIncomeLast && data.data[0].houseIncomeLast.amount || '-',
                            houseIncomePlan :data.data[0].houseIncomePlan && data.data[0].houseIncomePlan.amount || '-',

                            foodIncome : data.data[0].foodIncome && data.data[0].foodIncome.amount || '-',
                            foodIncomeLast :data.data[0].foodIncomeLast && data.data[0].foodIncomeLast.amount || '-',
                            foodIncomePlan :data.data[0].foodIncomePlan && data.data[0].foodIncomePlan.amount || '-',

                            meetingIncome : data.data[0].meetingIncome && data.data[0].meetingIncome.amount || '-',
                            meetingIncomeLast :data.data[0].meetingIncomeLast && data.data[0].meetingIncomeLast.amount || '-',
                            meetingIncomePlan :data.data[0].meetingIncomePlan && data.data[0].meetingIncomePlan.amount || '-',

                            elseIncome : data.data[0].elseIncome && data.data[0].elseIncome.amount || '-',
                            elseIncomeLast :data.data[0].elseIncomeLast && data.data[0].elseIncomeLast.amount || '-',
                            elseIncomePlan :data.data[0].elseIncomePlan && data.data[0].elseIncomePlan.amount || '-',
                        };
                        this.drawChart3(chartData3);

                        let chartData4 = {
                            houseIncomeRatio : data.data[0].houseIncomeRatio && data.data[0].houseIncomeRatio.percentage || '-',
                            houseIncomeRatioLast :data.data[0].houseIncomeRatioLast && data.data[0].houseIncomeRatioLast.percentage || '-',
                            houseIncomeRatioPlan :data.data[0].houseIncomeRatioPlan && data.data[0].houseIncomeRatioPlan.percentage || '-',

                            foodIncomeRatio : data.data[0].foodIncomeRatio && data.data[0].foodIncomeRatio.percentage || '-',
                            foodIncomeRatioLast :data.data[0].foodIncomeRatioLast && data.data[0].foodIncomeRatioLast.percentage || '-',
                            foodIncomeRatioPlan :data.data[0].foodIncomeRatioPlan && data.data[0].foodIncomeRatioPlan.percentage || '-',

                            meetingIncomeRatio : data.data[0].meetingIncomeRatio && data.data[0].meetingIncomeRatio.percentage || '-',
                            meetingIncomeRatioLast :data.data[0].meetingIncomeRatioLast && data.data[0].meetingIncomeRatioLast.percentage || '-',
                            meetingIncomeRatioPlan :data.data[0].meetingIncomeRatioPlan && data.data[0].meetingIncomeRatioPlan.percentage || '-',

                            elseIncomeRatio : data.data[0].elseIncomeRatio && data.data[0].elseIncomeRatio.percentage || '-',
                            elseIncomeRatioLast :data.data[0].elseIncomeRatioLast && data.data[0].elseIncomeRatioLast.percentage || '-',
                            elseIncomeRatioPlan :data.data[0].elseIncomeRatioPlan && data.data[0].elseIncomeRatioPlan.percentage || '-'
                        };
                        this.drawChart4(chartData4);
                    }else{
                        this.drawChart1([]);
                        this.drawChart3([]);
                        this.drawChart4([]);
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
                                totalIncome:item.totalIncome && item.totalIncome.amount || '-',
                                totalIncomeLast:item.totalIncomeLast && item.totalIncomeLast.amount || '-',
                                totalIncomePlan:item.totalIncomePlan && item.totalIncomePlan.amount || '-',
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

	        drawChart1(data){
                let chartData1 = [data.totalIncome],chartData2 = [data.totalIncomePlan], chartData3 = [data.totalIncomeLast];
                let xAxisData = ['总收入'];

                let series = [{
                    name: '实际收入',
                    type: 'bar',
                    barWidth: '18',
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
                    barWidth: '18',
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
                    barWidth: '18',
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
                // if (data.length>0) {
                //     hasData = true;
                // }
                series.forEach(item => {
                    if(item.data.length > 0){
                        hasData = true;
                    }
                })
                if(!hasData){
                    console.log('总体经营情况数据为空')
                    option.title.show = true;
                    option.grid.left = '10%'
                }
                option.legend.data = legendData;
                // option.title.text = '';
                option.yAxis.name = '单位：万元';
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

                option.xAxis.data = xAxisData;
                if (xAxisData.length > 3) {
                    option.dataZoom[0].endValue = xAxisData[2];
                    option.xAxis.axisLabel.rotate = 45;
                } else {
                    option.dataZoom[0].endValue = xAxisData[xAxisData.length - 1];
                    option.xAxis.axisLabel.rotate = 0;
                }
                option.dataZoom[0].startValue = xAxisData[0];
                option.tooltip.extraCssText='box-shadow: 0 0 10px #ccc; padding: 6px 15px;';

                let myChart = new echarts.init(this.$refs.chart1);
                myChart.setOption(option, true);
	        },

            drawChart2(data){
                let chartData1 = [],chartData2 = [], chartData3 = [];
                let xAxisData = [];

                data.forEach(item => {
                    chartData1.push(item.totalIncome);
                    chartData2.push(item.totalIncomePlan);
                    chartData3.push(item.totalIncomeLast);
                    xAxisData.push(item.statMonth + '月');
                })

                let series = [{
                    name: '实际收入',
                    data: chartData1,
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
                    name: '预算收入',
                    data: chartData2,
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
                    name: '去年同期',
                    data: chartData3,
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
                // if (data.length>0) {
                //     hasData = true;
                // }
                series.forEach(item => {
                    if(item.data.length > 0){
                        hasData = true;
                    }
                })
                if(!hasData){
                    console.log('收入趋势数据为空')
                    option.title.show = true;
                    option.grid.left = '10%'
                }
                option.legend.data = legendData;
                    option.yAxis.name = '单位：万元';
                
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


                option.xAxis.axisLabel.rotate = 45;
                option.xAxis.data = xAxisData;
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

            drawChart3(data){
                let chartData1 = [data.houseIncome,data.foodIncome,data.meetingIncome,data.elseIncome],
	                chartData2 = [data.houseIncomePlan,data.foodIncomePlan,data.meetingIncomePlan,data.elseIncomePlan],
	                chartData3 = [data.houseIncomeLast,data.foodIncomeLast,data.meetingIncomeLast,data.elseIncomeLast];
                let xAxisData = ['客房收入','餐饮收入','会议收入','其它收入'];

                let series = [{
                    name: '实际收入',
                    type: 'bar',
                    barWidth: '18',
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
                    barWidth: '18',
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
                    barWidth: '18',
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
                // if (data.length>0) {
                //     hasData = true;
                // }
                series.forEach(item => {
                    if(item.data.length > 0){
                        hasData = true;
                    }
                })
                if(!hasData){
                    console.log('收入结构数据为空')
                    option.title.show = true;
                    option.grid.left = '10%'
                }
                option.legend.data = legendData;
                    option.yAxis.name = '单位：万元';
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
                if (xAxisData.length > 3) {
                    option.dataZoom[0].endValue = xAxisData[2];
                } else {
                    option.dataZoom[0].endValue = xAxisData[xAxisData.length - 1];
                }
                option.dataZoom[0].startValue = xAxisData[0];
                option.tooltip.extraCssText='box-shadow: 0 0 10px #ccc; padding: 6px 15px;';

                let myChart = new echarts.init(this.$refs.chart3);
                myChart.setOption(option, true);
            },

            drawChart4(data){
                let chartData1 = [data.houseIncomeRatio,data.houseIncomeRatioPlan,data.houseIncomeRatioLast],
	                chartData2 = [data.foodIncomeRatio,data.foodIncomeRatioPlan,data.foodIncomeRatioLast],
	                chartData3 = [data.meetingIncomeRatio,data.meetingIncomeRatioPlan,data.meetingIncomeRatioLast],
	                chartData4 = [data.elseIncomeRatio,data.elseIncomeRatioPlan,data.elseIncomeRatioLast];
                let xAxisData = ['实际累计','预算累计','去年同期'];

                let series = [{
                    name: '客房收入',
                    type: 'bar',
                    barWidth: '40',
	                stack:'chart1',
                    // formatter: '{value} 万㎡',
                    itemStyle: {
                        normal: {
                            color: '#006E38'
                        }
                    },
                    label: {
                        show: true,
                        position: 'inside',
                        formatter: function (params) {
                            if (params.value == 0) {
                                return '';
                            } else {
                                return params.value + '%';
                            }
                        }
                    },
                    data: chartData1
                },{
                    name: '餐饮收入',
                    type: 'bar',
                    barWidth: '40',
                    stack:'chart1',
                    // formatter: '{value} 万㎡',
                    itemStyle: {
                        normal: {
                            color: '#4995E3'
                        }
                    },
                    label: {
                        show: true,
                        position: 'inside',
                        formatter: function (params) {
                            if (params.value == 0) {
                                return '';
                            } else {
                                return params.value + '%';
                            }
                        }
                    },
                    data: chartData2
                },{
                    name: '会议收入',
                    type: 'bar',
                    stack:'chart1',
                    barWidth: '40',
                    // formatter: '{value} 万㎡',
                    itemStyle: {
                        normal: {
                            color: '#F97546'
                        }
                    },
                    label: {
                        show: true,
                        position: 'inside',
                        formatter: function (params) {
                            if (params.value == 0) {
                                return '';
                            } else {
                                return params.value + '%';
                            }
                        }
                    },
                    data: chartData3
                },{
                    name: '其它收入',
                    type: 'bar',
                    stack:'chart1',
                    barWidth: '40',
                    // formatter: '{value} 万㎡',
                    itemStyle: {
                        normal: {
                            color: '#FFC40F'
                        }
                    },
                    label: {
                        show: true,
                        position: 'inside',
                        formatter: function (params) {
                            if (params.value == 0) {
                                return '';
                            } else {
                                return params.value+ '%';
                            }
                        }
                    },
                    data: chartData4
                }];

                let legendData = series.map(item => {
                    return item.name;
                });

                let option = JSON.parse(JSON.stringify(this.chartOption));
                option.series = series;
                let hasData = false;
                // if (data.length>0) {
                //     hasData = true;
                // }
                series.forEach(item => {
                    if(item.data.length > 0){
                        hasData = true;
                    }
                })
                if(!hasData){
                    console.log('收入结构占比数据为空')
                    option.title.show = true;
                    option.grid.left = '10%'
                }
                option.legend.data = legendData;
                    option.yAxis.name = '单位：%';
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

	            option.yAxis.axisLabel.formatter = '{value}%';

                if(option.xAxis.data.length > 3){
                    option.xAxis.axisLabel.rotate = 45;
                }else{
                    option.xAxis.axisLabel.rotate = 0;
                }

                option.xAxis.data = xAxisData;
                if (xAxisData.length > 3) {
                    option.dataZoom[0].endValue = xAxisData[2];
                } else {
                    option.dataZoom[0].endValue = xAxisData[xAxisData.length - 1];
                }
                option.dataZoom[0].startValue = xAxisData[0];
                option.tooltip.extraCssText='box-shadow: 0 0 10px #ccc; padding: 6px 15px;';

                let myChart = new echarts.init(this.$refs.chart4);
                myChart.setOption(option, true);
            },
            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                if (columnIndex === 0) {
					const _row = this.tableArr[rowIndex];
					const _col = _row > 0 ? 1 : 0;
					return {
						rowspan: _row,
						colspan: _col,
					};
                }
            },
            // 总体日报
            getDailyreport(){
                this.tableData = []
                this.tableTitle = [
                    {name: '组织' },
                    {name: '日期' },
                    {name: '本月累计' },
                    {name: '预算' },
                    {name: '预算完成率'},
                    {name: '上年同期', }
                ]

                // this.$http({
                //     url: 'http://10.99.25.78:8082/app-api/culturalTourism/hotel/findHoteldailyreportList?orgId='+this.orgId+'&token='+getUrlParam('token'),
                //     method: 'get',
                request({
                    url: '/app-api/culturalTourism/hotel/findHoteldailyreportList?orgId='+this.orgId,
                    method: 'get',
                }).then(({data}) => {
                    if (data.code == 0 && data.data) {
                        if (data.data.title.length>0) {
                            let title = data.data.title.map(i =>{
                                return {
                                    name: i.title,
                                    ...i
                                }
                            })
                            this.tableTitle = title
                        }

						//处理数据格式
						let contactDot = 0;
						for (let i = 0; i < data.data.dataList.length; i++) {
							const item = data.data.dataList[i]
							if (item.hotelDailyReportExpand.length > 0) {
								let _json = {}
								for (let a = 0; a < this.tableTitle.length; a++) {
									if (item.hotelDailyReportExpand.length > a) {
										let column = this.tableTitle[a]
										_json[column.title] = item.hotelDailyReportExpand[a].currentdata
									}
								}
								this.tableData.push(JSON.parse(JSON.stringify(_json)))
							}
							if (i === 0) {
								this.tableArr.push(1);
							} else {
								console.log(item.buname)
								console.log(data.data.dataList[i - 1].buname)
								if (item.buname === data.data.dataList[i - 1].buname) {
									this.tableArr[contactDot] += 1;
									this.tableArr.push(0);
								} else {
									this.tableArr.push(1);
									contactDot = i;
								}
							}
						}

                    }
                }).catch((e) => {
                    console.log('findHoteldailyreportList-err', e);
                });
            },

            getMore(){
                this.$router.push({
                    path:'/report/hotelSection/more', 
                    query: {orgId: this.orgId,orgType: this.orgType,queryPeriod:this.queryPeriod, token: getUrlParam('token')}
                });
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
		color: #333333;
		float: right;
		margin-top: 12px;
		&.up{
			color: #209B5C;
		}
	}
    .green{
        color: #006E38;
    }
    .reportBox /deep/ .el-table__row td[rowspan="10"]{
        border-bottom: 1px solid #C8C8C8;
    }
    .reportBox /deep/ .el-table__row:nth-child(10n) td{
        border-bottom: 1px solid #C8C8C8;
    }
</style>
