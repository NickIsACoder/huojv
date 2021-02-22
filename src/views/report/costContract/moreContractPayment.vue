<template>
	<div class="detail-panel height100 white-bg">
			<van-nav-bar
					style="position: fixed; top: 0; width: 100%;"
					:title="month + '月' + orgName + (orgType <= 3 ? '集团' : '') + (orgType == 5 ? '' : '各') +'区域产值支付情况'"
					left-arrow
					@click-left="onClickLeft"
					v-eventlisten="{isChangePage:true,pageEvent:'点击返回按钮'}"
			/>

			<div class="padding-nav">
				<div class="detail-table-panel">
<!--					<div class="text-center first-title" v-text="'当月'+ orgName +typeText+'产值支付情况'"></div>-->
					<div class="scroll-gesture" style="height: 100%;" @touchstart="hideGesture = 1">
						<div class="huojv-costContract-chart-panel max" ref="chart1"></div>
						<div v-if="!hideGesture" class="gesture">
							<img src="../../../assets/images/huadong.png">
							<!--                        <div class="gesture-text">向左滑动</div>-->
						</div>
					</div>

				</div>
			</div>
	</div>
</template>

<script>
    import scrollFixed from '@/mixin/scroll-fixed';
    import {List, PullRefresh,NavBar,Sticky} from 'vant';
    import $ from 'jquery';
    import echarts from 'echarts';
    import request from '@/utils/request';

    export default {
        mixins: [scrollFixed],

        data() {
            return {
	            orgId:'',
	            orgName:'',
                orgType:'',
                typeText:'',
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
                        text: '',
                        show: false,
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
                        itemHeight: 4,
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
                    yAxis: [
                        {
                            type: 'value',
                            name: ``,
                            nameTextStyle:{
                                color:'#999'
                            },
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
                                },
                            }
                        },
                        {
                            type: 'value',
                            name: '',
                            max:100,
                            nameTextStyle:{
                                color:'#999'
                            },
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
                                },
                                formatter: '{value}%'
                            }
                        }
                    ],
                    series: [],
                },
                hideGesture:0,  // 是否隐藏滑动手势
	            month:'',
            };
        },
        mounted() {
            this.orgName = this.$route.query.orgName;
            this.orgId = this.$route.query.orgId;
            this.orgType = this.$route.query.orgType;
            // if(this.orgType < 5){
            //     this.typeText = '各公司';
            // }else if(this.orgType == 5){
            //     this.typeText = '各项目';
            // }else if(this.orgType > 5){
            //     this.typeText = '';
            // }

            this.getChartsData();
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

	        // 获取图表数据
            getChartsData(){
                request({
                    url: `/app-api/costContract/productionValuePaymentMore`,
                    method: 'get',
                    params: {orgId : this.orgId}
                }).then(({data}) => {
                    if (data.code === 0 && data.data) {
                        let list = data.data || [];

                        if(list.length){
                            this.month = new Date(list[0].months).getMonth() + 1;
                        }else{
                            this.month = new Date().getMonth() + 1;
                        }

	                    this.drawChart(list,1);
                    }
                });
            },

	        // 绘制图表
            drawChart(data,index){
                let xAxisData = [],chartData1 = [],chartData2 = [],chartData3 = [],chartData4 = [],chartData5 = [];
                let average = data.length ? data[0].lastYearPaidRate || 0 : 0;
                data.forEach(item => {
                    xAxisData.push(item.orgName);
                    chartData1.push(item.outputAmount);
                    chartData2.push(item.handleAmount);
                    chartData3.push(item.paidAmount);
                    chartData4.push(item.monthPaidRate);
                    chartData5.push(item.lastYearPaidRate);
                });

                let series = [{
                    name: '累计产值',
                    type: 'bar',
                    barWidth: '10',
                    itemStyle: {
                        normal: {
                            color: '#006E38'
                        }
                    },
                    data: chartData1
                },{
                    name: '累计应付',
                    type: 'bar',
                    barWidth: '10',
                    itemStyle: {
                        normal: {
                            color: '#B4A46C'
                        }
                    },
                    data: chartData2
                },{
                    name: '累计已付',
                    type: 'bar',
                    barWidth: '10',
                    itemStyle: {
                        normal: {
                            color: '#FFC410'
                        }
                    },
                    data: chartData3
                },
	            //     {
                //     name: '上一年度平均支付比例',
                //     data: chartData5,
                //     type: 'line',
                //     yAxisIndex: 1,
                //     symbol: 'none',
                //     formatter: '{value} %',
                //     smooth: false,
                //     itemStyle: {
                //         normal: {
                //             color: '#FF0000',
                //             label : {
                //                 show: false,
                //                 color: '#333333'
                //             }
                //         }
				//
                //     },
                //     lineStyle: {
                //         normal: {
                //             width: 1,
                //             type:'dotted'
                //         }
                //     }
                // },
	                {
                    name: '当月支付比例',
                    data: chartData4,
                    type: 'line',
                    yAxisIndex: 1,
                    formatter: '{value} %',
                    smooth: false,
                    itemStyle: {
                        normal: {
                            color: '#4472C4',
                            label : {
                                show: false,
                                color: '#333333',
                                formatter:(obj,index) => {
                                    return obj.data + '%'
                                }
                            }
                        }

                    },
                    lineStyle: {
                        normal: {
                            width: 1,
                        }
                    },
                    markLine: {
                        // symbol: "none",
                        data: [
                            {
                                type: 'average',
                                name: '上一年度平均支付比例',
                                lineStyle: {
                                    width: 1,
                                    color: "#FF0000"
                                },
                                label: {
                                    fontSize: 11,
                                    lineHeight: 15,
                                    color: '#666666',
                                    position: 'insideEndTop',
                                    formatter: '{b}：{r1|{c}%}',
                                    backgroundColor: 'rgba(255,255,255,0)',
                                    padding: [0, 10],
                                    // shadowColor: '#006E38',
                                    shadowColor: '#3ab779',
                                    borderRadius: 3,
                                    shadowBlur: 1,
                                    shadowOffsetY: 0,
                                    rich: {
                                        r1: {
                                            color: 'red'
                                        },
                                    }
                                },
                                // yAxis: (middle/data.length).toFixed(2)
                                yAxis: average
                            },
                        ]
                    }
                }];

                let legendData = series.map(item => {
                    return item.name;
                });

                let option = JSON.parse(JSON.stringify(this.chartOption));
                option.series = series;
                option.legend.data = legendData;
                option.yAxis[0].name = `单位：万元`;

                option.tooltip.formatter = function (params) {
                    let showHtm = "<div>" + params[0].axisValueLabel + "</div>";
                    for (let i = 0; i < params.length; i++) {

                        //名称
                        let text = '<span class="chart-tooltip">' + params[i].seriesName + '：</span>';
                        //值
                        let value = (params[i].seriesName == '上一年度平均支付比例' || params[i].seriesName == '当月支付比例') ? params[i].value + '%' : params[i].value;
                        let marker = params[i].marker;

                        showHtm += '<div style="line-height: 16px;">' +marker + text + value + '</div>';
                    }

                    return showHtm;
                };

                option.xAxis.data = xAxisData;

                if (xAxisData.length > 4) {
                    option.dataZoom[0].endValue = xAxisData[3];
                } else {
                    option.dataZoom[0].endValue = xAxisData[xAxisData.length - 1];
                }
                option.dataZoom[0].startValue = xAxisData[0];
                let myChart = new echarts.init(this.$refs['chart'+index]);
                myChart.setOption(option, true);
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
