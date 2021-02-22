<template>
	<div class="report-index">
		<div class="main-content">
			<div class="data-content-panel no-top-left-radius clearfix" style="overflow: visible;">
				<div v-show="tab1 != 4">
					<!-- 标题 -->
					<div class="data-title-box data-title-line clearfix">
						<span class="title">会议收入情况</span>
					</div>

					<el-table stripe class="main-theme-table" ref="tableRef1" size="mini" highlight-current-row border :data="tableData">
						<el-table-column prop="itemName" fixed label="" align="center" width="90"></el-table-column>
						<el-table-column label="累计" align="center">
							<el-table-column prop="meetingIncome" label="实际" align="center" width="80"></el-table-column>
							<el-table-column prop="meetingIncomePlan" label="预算" align="center" width="80"></el-table-column>
							<el-table-column prop="meetingIncomeAchieveRate" label="完成率" align="center" width="80">
								<template slot-scope="scope">
									<span>{{(scope.row.meetingIncomeAchieveRate || '-') + '%'}}</span>
								</template>
							</el-table-column>
						</el-table-column>
						<el-table-column label="同比上年" align="center">
							<el-table-column prop="meetingIncomeLast" label="同期" align="center" width="80"></el-table-column>
							<el-table-column prop="meetingIncomeGrowthRate" label="增长率" align="center" width="80">
								<template slot-scope="scope">
									<span>{{(scope.row.meetingIncomeGrowthRate || '-') + '%'}}</span>
								</template>
							</el-table-column>
						</el-table-column>
					</el-table>

					<!-- todo:暂时隐藏 目前没有表结构 -->
					<!-- 标题 -->
<!--					<div class="data-title-box data-title-line clearfix mt-20">-->
<!--						<span class="title">会议收入客源结构占比</span>-->
<!--					</div>-->

<!--					<div class="huojv-costContract-chart-panel" ref="chart1"></div>-->
				</div>
				<div v-show="tab1 == 4">
					<ul class="data-info-list pb-20 one-cols mt-30" style="border-bottom: 0;">
						<li>
							<div class="data-type middle">总收入</div>
							<div class="data-box mt-20">
								<label class="value middle" v-text="boardData.meetingIncome || '-'"></label>
								<label class="unit">元</label>
								<i v-show="boardData.meetingIncomeCompare" :class="boardData.meetingIncomeCompare < 0 ? 'huojv-ico-down' : 'huojv-ico-up'" class="normal ml-5"></i>
							</div>
							<div class="data-type mt-10">同期：<label v-text="boardData.meetingIncomeLast || '-'"></label>元</div>
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
                boardData:{},
                queryPeriod:''
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

                // todo ： 暂时隐藏
                // this.drawChart1();
            },

            // 获取营运数据
            getOperationData(){
                request({
                    url: '/app-api/culturalTourism/hotel/overallOperation',
                    method: 'post',
                    data:{orgId:this.orgId,queryPeriod:this.queryPeriod}
                }).then(({data}) => {
                    if (data.code === 0 && data.data && data.data.length) {
                        this.tableData = [{
                            itemName:'会议收入',
	                        meetingIncome:data.data[0].meetingIncome && data.data[0].meetingIncome.amount || '-',
                            meetingIncomePlan:data.data[0].meetingIncomePlan && data.data[0].meetingIncomePlan.amount || '-',
                            meetingIncomeAchieveRate:data.data[0].meetingIncomeAchieveRate && data.data[0].meetingIncomeAchieveRate.percentage || '-',
                            meetingIncomeLast:data.data[0].meetingIncomeLast && data.data[0].meetingIncomeLast.amount || '-',
                            meetingIncomeGrowthRate:data.data[0].meetingIncomeGrowthRate && data.data[0].meetingIncomeGrowthRate.percentage || '-',
                        }];

                        this.boardData = {
                            meetingIncome:data.data[0].meetingIncome && data.data[0].meetingIncome.amount || '-',
                            meetingIncomePlan:data.data[0].meetingIncomePlan && data.data[0].meetingIncomePlan.amount || '-',
                            meetingIncomeLast:data.data[0].meetingIncomeLast && data.data[0].meetingIncomeLast.amount || '-',
                            meetingIncomeCompare:(data.data[0].meetingIncome && data.data[0].meetingIncome.amount || 0) - (data.data[0].meetingIncomeLast && data.data[0].meetingIncomeLast.amount || 0)
                        };
                    }
                }).catch((e) => {
                    console.log('getBoardData-err', e);
                });
            },

            drawChart1(data){
                let chartData1 = [200,250],chartData2 = [150,240];
                let xAxisData = ['今年','上年'];

                let series = [{
                    name: '集团资源',
                    type: 'bar',
                    barWidth: '30',
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
                    name: '外部资源',
                    type: 'bar',
                    barWidth: '30',
	                stack:'chart1',
                    // formatter: '{value} 万㎡',
                    itemStyle: {
                        normal: {
                            color: '#B4A36B'
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

                let myChart = new echarts.init(this.$refs.chart1);
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
