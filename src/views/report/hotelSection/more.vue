<template>
	<div class="detail-panel height100 white-bg">
		<!--		<van-pull-refresh v-model="isLoading" success-text="刷新成功" loading-text="正在刷新..." @refresh="reloadWindow()">-->
		<van-nav-bar
				style="position: fixed; top: 0; width: 100%;"
				:title="title"
				left-arrow
				@click-left="onClickLeft"
				v-eventlisten="{isChangePage:true,pageEvent:'点击返回按钮'}"
		/>

		<div class="padding-nav">
			<div class="main-content" style="width: 100%;">
				<div class="data-content-panel no-top-left-radius clearfix" style="overflow: visible;">
					<div class="huojv-costContract-chart-panel max" ref="chart1"></div>
				</div>
			</div>
		</div>

		<!--		</van-pull-refresh>-->
	</div>
</template>

<script>
    import scrollFixed from '@/mixin/scroll-fixed';
    import {PullRefresh,NavBar} from 'vant';
    import $ from 'jquery';
    import echarts from 'echarts'
    import request from '@/utils/request';

    export default {
        mixins: [scrollFixed],

        data() {
            return {
                orgId:'',
	            orgType:'',
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
                        icon: 'circle', // rect
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
                        'top': '8%',
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
                        nameTextStyle:{
                            color:"#666666",
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
                                color: '#666666'
                            }
                        }
                    },
                    series: [],
                },
                title:'收入明细',
                queryPeriod:''
            };
        },
        mounted() {
            this.orgId = this.$route.query.orgId;
            this.queryPeriod = this.$route.query.queryPeriod;
            this.orgType = this.$route.query.orgType;

            this.init();
        },

        methods: {
            onClickLeft() {
                window.history.go(-1);
            },


	        init(){
                this.getOperationData();
	        },

            // 获取营运数据
            getOperationData(){
                let params = {}
                if(this.orgType==5){
                    params = {
                        parentOrgId:this.orgId,
                        queryPeriod:this.queryPeriod
                    }
                }else{
                    params = {
                        orgId:this.orgId,
                        queryPeriod:this.queryPeriod
                    }
                }
                request({
                    url: '/app-api/culturalTourism/hotel/overallOperation',
                    method: 'post',
                    data: params
                }).then(({data}) => {
                    if (data.code === 0 && data.data && data.data.length) {
                        let list = [];
                        data.data.forEach(item => {
                            let chartData1 = {
                                buName:item.buName,
                                totalIncome : item.totalIncome.amount || '-',
                                totalIncomeLast :item.totalIncomeLast.amount || '-',
                                totalIncomePlan :item.totalIncomePlan.amount || '-'
                            };

                            list.push(chartData1);
                        })

                        this.drawChart1(list);
                    }
                }).catch((e) => {
                    console.log('getBoardData-err', e);
                });
            },

            drawChart1(data){
                let chartData1 = [],chartData2 = [], chartData3 = [];
                let xAxisData = [];

                data.forEach(item => {
                    chartData1.push(item.totalIncome);
                    chartData2.push(item.totalIncomePlan);
                    chartData3.push(item.totalIncomeLast);
                    xAxisData.push(item.buName);
                })

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
                series.forEach(item => {
                    if(item.data.length > 0){
                        hasData = true;
                    }
                })
                if(!hasData){
                    option.title.show = true;
                }
                option.legend.data = legendData;
                option.yAxis.name = '单位：万元'
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

                option.xAxis.data = xAxisData;

                // X轴太长了 换行
                option.xAxis.axisLabel.formatter = function(params){
                    var newParamsName = "";// 最终拼接成的字符串
                    var paramsNameNumber = params.length;// 实际标签的个数
                    var provideNumber = 8;// 每行能显示的字的个数
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
        },

        components: {
            [NavBar.name]: NavBar,
            [PullRefresh.name]: PullRefresh,
        }
    };
</script>


<style lang="scss" scoped>

</style>
