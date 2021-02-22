<template>
	<div class="detail-panel white-bg">
		<div class="main-content">

			<div class="data-content-panel">
				<div class="huojv-costContract-chart-panel max" ref="chart1"></div>
<!--				<div class="huojv-costContract-chart-panel max" ref="chart2"></div>-->
<!--				<div class="huojv-costContract-chart-panel max" ref="chart3"></div>-->
			</div>
		</div>
	</div>
</template>

<script>
    import scrollFixed from '@/mixin/scroll-fixed';
    import {List, PullRefresh, NavBar, Icon} from 'vant';
    import $ from 'jquery';
    import echarts from 'echarts'
    import request from '@/utils/request';
    import {getUrlParam, getNextMonths} from '@/utils/common'

    export default {
        mixins: [scrollFixed],

        data() {
            return {
                isLoading: false,//下拉刷新,从第一页开始
                orgId: '',  // 组织机构id
                orgType: 2,  // 组织机构类型

                // 图表option
                chartOption: {
                    tooltip: {
                        confine: true,
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        },
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
                        text: '',
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
                        itemWidth: 12,
                        itemHeight: 12,
                        selectedMode:false,
                        // orient: 'horizon',
                        x: 'center',
                        y: 'bottom',
                        // width: 200,
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
                        'left': '10%',
                        'right': '4%',
                        'bottom': '15%',
                        'top': '18%',
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
                            },
                            rich:{
                                a: {
                                    color: '#FE0909',
                                },
                                b: {
                                    color:'#FFC200'
                                },
                            }
                        }
                    },
                    yAxis: {
                        type: 'value',
                        name: ``,
                        nameTextStyle:{
                            color:'#999'
                        },
                        axisTick: {
                            show: false
                        },
                        splitLine:{
                            lineStyle:{
                                color: '#E8E8E8'
                            }
                        },
                        axisLine: {
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

                // 是否隐藏滑动手势
                hideGesture: {},
                tableActiveData1:[],
                tableList1:[], // 表格1
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
                this.init();
            }
        },
        mounted() {
            this.init();
            // 给表格头加上滑动事件 以便于拖动表头时表格跟着滚动
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
            init() {
                this.orgId = getUrlParam('chooseOrgId') || getUrlParam('orgId');
                this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType');

                this.designType = (this.pageTab + 1).toString()
                this.getChartsData1();
                // this.getChartsData2();
                // this.getChartsData3();
            },


            // 获取图表数据
            getChartsData1() {
                request({
                    url: `/app-api/productDesign/getUnilateralCostLimit`,
                    method: 'post',
                    data: {
                        orgId: this.orgId,
                        orgType: this.orgType,
                        designType: this.designType
                    }
                }).then(({data}) => {
                    if (data.code === 0 && data.data) {
                        this.drawChart1(data.data);
                    }else{
                        this.drawChart1([]);
                    }
                }).catch((e) => {
                    this.drawChart1([]);
                });
            },

            getChartsData2() {
                request({
                    url: `/app-api/productDesign/getSteelContentLimit`,
                    method: 'post',
                    data: {
                        orgId: this.orgId,
                        orgType: this.orgType,
                        designType: this.designType
                    }
                }).then(({data}) => {
                    if (data.code === 0 && data.data) {
                        this.drawChart2(data.data);
                    }else{
                        this.drawChart2([]);
                    }
                }).catch((e) => {
                    this.drawChart2([]);
                });
            },

            getChartsData3() {
                request({
                    url: `/app-api/productDesign/getConcreteContentLimit`,
                    method: 'post',
                    data: {
                        orgId: this.orgId,
                        orgType: this.orgType,
                        designType: this.designType
                    }
                }).then(({data}) => {
                    if (data.code === 0 && data.data) {
                        this.drawChart3(data.data);
                    }else{
                        this.drawChart3([]);
                    }
                }).catch((e) => {
                    this.drawChart3([]);
                });
            },

            // 绘制柱状图表
            drawChart1(data) {
                let xAxisData = [],
                    chartData1 = [],
                    chartData2 = [],
                    chartData3 = [],
                    chartData4 = [];

                data.forEach(item => {
                    xAxisData.push(item.projectName);
                    chartData1.push(item.constructionAreaUnitCostLimitIncluding  && item.constructionAreaUnitCostLimitIncluding.amountYuan || '-');
                    chartData2.push(item.saleAreaUnitCostLimitIncluding && item.saleAreaUnitCostLimitIncluding.amountYuan || '-');
                    chartData3.push(item.constructionAreaUnitCostLimit  && item.constructionAreaUnitCostLimit.amountYuan || '-');
                    chartData4.push(item.saleAreaUnitCostLimit && item.saleAreaUnitCostLimit.amountYuan || '-');
                })

                let series = [{
                    name: '建面单方',
                    type: 'bar',
                    barWidth: '13',
                    itemStyle: {
                        normal: {
                            color: '#FFC40F'
                        }
                    },
                    data: chartData1
                },{
                    name: '建面单方（无土地成本）',
                    type: 'bar',
                    barWidth: '13',
                    itemStyle: {
                        normal: {
                            color: '#B4A36B'
                        }
                    },
                    data: chartData3
                },{
                    name: '可售单方',
                    type: 'bar',
                    barWidth: '13',
                    itemStyle: {
                        normal: {
                            color: '#006E38'
                        }
                    },
                    data: chartData2
                },{
                    name: '可售单方（无土地成本）',
                    type: 'bar',
                    barWidth: '13',
                    itemStyle: {
                        normal: {
                            color: '#4995E3'
                        }
                    },
                    data: chartData4
                }];

                let legendData = series.map(item => {
                    return item.name;
                });

                let option = JSON.parse(JSON.stringify(this.chartOption));
                option.series = series;
                option.legend.data = legendData;
                option.yAxis.name = `单位：元`;
                option.title.text = '建面/可售单方造价限额';
                // X轴太长了 换行
                option.xAxis.axisLabel.formatter = function(params){
                    var newParamsName = "";// 最终拼接成的字符串
                    var paramsNameNumber = params.length;// 实际标签的个数
                    var provideNumber = 6;// 每行能显示的字的个数
                    var rowNumber = Math.ceil(paramsNameNumber / provideNumber);// 换行的话，需要显示几行，向上取整
                    /**
                     * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
                     */
                    // 条件等同于rowNumber>1
                    if (paramsNameNumber > provideNumber) {
                        /** 循环每一行,p表示行 */
                        for (var p = 0; p < rowNumber; p++) {
                            var tempStr = "";// 表示每一次截取的字符串
                            var start = p * provideNumber;// 开始截取的位置
                            var end = start + provideNumber;// 结束截取的位置
                            // 此处特殊处理最后一行的索引值
                            if (p == rowNumber - 1) {
                                // 最后一次不换行
                                tempStr = params.substring(start, paramsNameNumber);
                            } else {
                                // 每一次拼接字符串并换行
                                tempStr = params.substring(start, end) + "\n";
                            }
                            newParamsName += tempStr;// 最终拼成的字符串
                        }

                    } else {
                        // 将旧标签的值赋给新标签
                        newParamsName = params;
                    }
                    //将最终的字符串返回
                    return newParamsName
                }

                // 自定义tooltip
                option.tooltip.formatter = function (params) {
                    let showHtm = "<div>" + params[0].axisValueLabel + "</div>";
                    let index = xAxisData.indexOf(params[0].axisValueLabel);
                    for (let i = 0; i < params.length; i++) {

                        //名称
                        let text = '<span class="">' + params[i].seriesName + '：</span>';
                        //值
                        let value = params[i].value + '元';
                        let marker = params[i].marker;

                        showHtm += '<div style="line-height: 16px;">' + marker + text + value + '</div>';
                    }

                    return showHtm;
                };

                option.xAxis.data = xAxisData;

                if (data.length>0) {
                    option.grid = {
                        'left': '4%',
                        'right': '4%',
                        'bottom': '10%',
                        'top': '18%',
                        'containLabel': true
                    }
                }

                // x轴初始化只显示4个柱状图  超过4个滑动显示
                if (xAxisData.length > 3) {
                    option.dataZoom[0].endValue = xAxisData[2];
                } else {
                    option.dataZoom[0].endValue = xAxisData[xAxisData.length - 1];
                }
                option.dataZoom[0].startValue = xAxisData[0];
                this.$nextTick(() => {
                    let myChart = new echarts.init(this.$refs.chart1);
                    myChart.setOption(option, true);
                })
            },

            // 绘制柱状图表
            drawChart2(data) {
                let xAxisData = [],
                    chartData1 = [],
	                chartData2 = [];

                data.forEach(item => {
                    xAxisData.push(item.projectName);
                    chartData1.push(item.steelContentLimitUnder && item.steelContentLimitUnder.amount || '-');
                    chartData2.push(item.steelContentLimitAbove && item.steelContentLimitAbove.amount || '-');
                })

                let series = [{
                    name: '地下含钢量限额',
                    type: 'bar',
                    barWidth: '15',
                    itemStyle: {
                        normal: {
                            color: '#B4A36B'
                        }
                    },
                    data: chartData1,
                    // markLine: {
                    //     symbol: "none",
                    //     data: [
                    //         {
                    //             type: 'average',
                    //             name: '标准地下限额',
                    //             lineStyle: {
                    //                 width: 1,
                    //                 color: "#FF0000"
                    //             },
                    //             label: {
                    //                 fontSize: 11,
                    //                 lineHeight: 15,
                    //                 color: '#ffffff',
                    //                 position: 'insideEndTop',
                    //                 formatter: '{b}',
                    //                 backgroundColor: 'rgba(255,0,0,0.51)',
                    //                 padding:[8,10],
                    //                 // shadowColor: '#006E38',
                    //                 shadowColor: '#FF0000',
                    //                 borderRadius: 3,
                    //                 shadowBlur: 1,
                    //                 shadowOffsetY: 0,
                    //                 rich:{
                    //                     r1: {
                    //                         color: 'red'
                    //                     },
                    //                 }
                    //             },
                    //             // yAxis: (middle/data.length).toFixed(2)
                    //             yAxis: 50
                    //         },
                    //     ]
                    // },
                },{
                    name: '地上含钢量限额',
                    type: 'bar',
                    barWidth: '15',
                    itemStyle: {
                        normal: {
                            color: '#006E38'
                        }
                    },
                    data: chartData2,
                    // markLine: {
                    //     symbol: "none",
                    //     data: [
                    //         {
                    //             type: 'average',
                    //             name: '标准地上限额',
                    //             lineStyle: {
                    //                 width: 1,
                    //                 color: "#FFC40F"
                    //             },
                    //             label: {
                    //                 fontSize: 11,
                    //                 lineHeight: 15,
                    //                 color: '#ffffff',
                    //                 position: 'insideEndTop',
                    //                 formatter: '{b}',
                    //                 backgroundColor: 'rgba(255,196,15,0.5)',
                    //                 padding:[8,10],
                    //                 // shadowColor: '#006E38',
                    //                 shadowColor: '#FFC40F',
                    //                 borderRadius: 3,
                    //                 shadowBlur: 1,
                    //                 shadowOffsetY: 0,
                    //                 rich:{
                    //                     r1: {
                    //                         color: 'red'
                    //                     },
                    //                 }
                    //             },
                    //             // yAxis: (middle/data.length).toFixed(2)
                    //             yAxis: 90
                    //         },
                    //     ]
                    // },
                }];

                let legendData = series.map(item => {
                    return item.name;
                });

                let option = JSON.parse(JSON.stringify(this.chartOption));
                option.series = series;
                option.legend.data = legendData;
                option.yAxis.name = `单位：kg/㎡`;
                option.title.text = '地上/地下含钢量限额';
                // X轴太长了 换行
                option.xAxis.axisLabel.formatter = function(params){
                    var newParamsName = "";// 最终拼接成的字符串
                    var paramsNameNumber = params.length;// 实际标签的个数
                    var provideNumber = 6;// 每行能显示的字的个数
                    var rowNumber = Math.ceil(paramsNameNumber / provideNumber);// 换行的话，需要显示几行，向上取整
                    /**
                     * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
                     */
                    // 条件等同于rowNumber>1
                    if (paramsNameNumber > provideNumber) {
                        /** 循环每一行,p表示行 */
                        for (var p = 0; p < rowNumber; p++) {
                            var tempStr = "";// 表示每一次截取的字符串
                            var start = p * provideNumber;// 开始截取的位置
                            var end = start + provideNumber;// 结束截取的位置
                            // 此处特殊处理最后一行的索引值
                            if (p == rowNumber - 1) {
                                // 最后一次不换行
                                tempStr = params.substring(start, paramsNameNumber);
                            } else {
                                // 每一次拼接字符串并换行
                                tempStr = params.substring(start, end) + "\n";
                            }
                            newParamsName += tempStr;// 最终拼成的字符串
                        }

                    } else {
                        // 将旧标签的值赋给新标签
                        newParamsName = params;
                    }
                    //将最终的字符串返回
                    return newParamsName
                }

                // 自定义tooltip
                option.tooltip.formatter = function (params) {
                    let showHtm = "<div>" + params[0].axisValueLabel + "</div>";
                    let index = xAxisData.indexOf(params[0].axisValueLabel);
                    for (let i = 0; i < params.length; i++) {

                        //名称
                        let text = '<span class="">' + params[i].seriesName + '：</span>';
                        //值
                        let value = params[i].value + 'kg/㎡';
                        let marker = params[i].marker;

                        showHtm += '<div style="line-height: 16px;">' + marker + text + value + '</div>';
                    }

                    return showHtm;
                };

                option.xAxis.data = xAxisData;

                // x轴初始化只显示4个柱状图  超过4个滑动显示
                if (xAxisData.length > 4) {
                    option.dataZoom[0].endValue = xAxisData[3];
                } else {
                    option.dataZoom[0].endValue = xAxisData[xAxisData.length - 1];
                }
                option.dataZoom[0].startValue = xAxisData[0];
                this.$nextTick(() => {
                    let myChart = new echarts.init(this.$refs.chart2);
                    myChart.setOption(option, true);
                })
            },

            // 绘制柱状图表
            drawChart3(data) {
                let xAxisData = [],
                    chartData1 = [],
                    chartData2 = [];

                data.forEach(item => {
                    xAxisData.push(item.projectName);
                    chartData1.push(item.concretContentLimitUnder && item.concretContentLimitUnder.amount || '-');
                    chartData2.push(item.concreteContentLimitAbove && item.concreteContentLimitAbove.amount || '-');
                })

                let series = [{
                    name: '地下含砼量限额',
                    type: 'bar',
                    barWidth: '15',
                    itemStyle: {
                        normal: {
                            color: '#B4A36B'
                        }
                    },
                    data: chartData1,
                    // markLine: {
                    //     symbol: "none",
                    //     data: [
                    //         {
                    //             type: 'average',
                    //             name: '标准地下限额',
                    //             lineStyle: {
                    //                 width: 1,
                    //                 color: "#FF0000"
                    //             },
                    //             label: {
                    //                 fontSize: 11,
                    //                 lineHeight: 15,
                    //                 color: '#ffffff',
                    //                 position: 'insideEndTop',
                    //                 formatter: '{b}',
                    //                 backgroundColor: 'rgba(255,0,0,0.51)',
                    //                 padding:[8,10],
                    //                 // shadowColor: '#006E38',
                    //                 shadowColor: '#FF0000',
                    //                 borderRadius: 3,
                    //                 shadowBlur: 1,
                    //                 shadowOffsetY: 0,
                    //                 rich:{
                    //                     r1: {
                    //                         color: 'red'
                    //                     },
                    //                 }
                    //             },
                    //             // yAxis: (middle/data.length).toFixed(2)
                    //             yAxis: 50
                    //         },
                    //     ]
                    // },
                },{
                    name: '地上含砼量限额',
                    type: 'bar',
                    barWidth: '15',
                    itemStyle: {
                        normal: {
                            color: '#006E38'
                        }
                    },
                    data: chartData2,
                    // markLine: {
                    //     symbol: "none",
                    //     data: [
                    //         {
                    //             type: 'average',
                    //             name: '标准地上限额',
                    //             lineStyle: {
                    //                 width: 1,
                    //                 color: "#FFC40F"
                    //             },
                    //             label: {
                    //                 fontSize: 11,
                    //                 lineHeight: 15,
                    //                 color: '#ffffff',
                    //                 position: 'insideEndTop',
                    //                 formatter: '{b}',
                    //                 backgroundColor: 'rgba(255,196,15,0.5)',
                    //                 padding:[8,10],
                    //                 // shadowColor: '#006E38',
                    //                 shadowColor: '#FFC40F',
                    //                 borderRadius: 3,
                    //                 shadowBlur: 1,
                    //                 shadowOffsetY: 0,
                    //                 rich:{
                    //                     r1: {
                    //                         color: 'red'
                    //                     },
                    //                 }
                    //             },
                    //             // yAxis: (middle/data.length).toFixed(2)
                    //             yAxis: 90
                    //         },
                    //     ]
                    // },
                }];

                let legendData = series.map(item => {
                    return item.name;
                });

                let option = JSON.parse(JSON.stringify(this.chartOption));
                option.series = series;
                option.legend.data = legendData;
                option.yAxis.name = `单位：m³/㎡`;
                option.title.text = '地上/地下含砼量限额';
                // X轴太长了 换行
                option.xAxis.axisLabel.formatter = function(params){
                    var newParamsName = "";// 最终拼接成的字符串
                    var paramsNameNumber = params.length;// 实际标签的个数
                    var provideNumber = 6;// 每行能显示的字的个数
                    var rowNumber = Math.ceil(paramsNameNumber / provideNumber);// 换行的话，需要显示几行，向上取整
                    /**
                     * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
                     */
                    // 条件等同于rowNumber>1
                    if (paramsNameNumber > provideNumber) {
                        /** 循环每一行,p表示行 */
                        for (var p = 0; p < rowNumber; p++) {
                            var tempStr = "";// 表示每一次截取的字符串
                            var start = p * provideNumber;// 开始截取的位置
                            var end = start + provideNumber;// 结束截取的位置
                            // 此处特殊处理最后一行的索引值
                            if (p == rowNumber - 1) {
                                // 最后一次不换行
                                tempStr = params.substring(start, paramsNameNumber);
                            } else {
                                // 每一次拼接字符串并换行
                                tempStr = params.substring(start, end) + "\n";
                            }
                            newParamsName += tempStr;// 最终拼成的字符串
                        }

                    } else {
                        // 将旧标签的值赋给新标签
                        newParamsName = params;
                    }
                    //将最终的字符串返回
                    return newParamsName
                }

                // 自定义tooltip
                option.tooltip.formatter = function (params) {
                    let showHtm = "<div>" + params[0].axisValueLabel + "</div>";
                    let index = xAxisData.indexOf(params[0].axisValueLabel);
                    for (let i = 0; i < params.length; i++) {

                        //名称
                        let text = '<span class="">' + params[i].seriesName + '：</span>';
                        //值
                        let value = params[i].value + 'm³/㎡';
                        let marker = params[i].marker;

                        showHtm += '<div style="line-height: 16px;">' + marker + text + value + '</div>';
                    }

                    return showHtm;
                };

                option.xAxis.data = xAxisData;

                // x轴初始化只显示4个柱状图  超过4个滑动显示
                if (xAxisData.length > 4) {
                    option.dataZoom[0].endValue = xAxisData[3];
                } else {
                    option.dataZoom[0].endValue = xAxisData[xAxisData.length - 1];
                }
                option.dataZoom[0].startValue = xAxisData[0];
                this.$nextTick(() => {
                    let myChart = new echarts.init(this.$refs.chart3);
                    myChart.setOption(option, true);
                })
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

</style>
