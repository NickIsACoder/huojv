<template>
	<div class="report-index">
		<div class="" style="width: 100%;">
			<div class="data-content-panel no-top-left-radius">
				<p class="boxTitle text-center" style="margin-bottom: 0;" v-text="orgType < 6 ? '设计变更成本变动对比' : '设计变更成本变动明细'"></p>
				<div v-show="orgType <= 5">
					<div class="huojv-costContract-chart-panel" ref="chart1"></div>
					<div class="huojv-data-list-more" style="margin-top: 0;" @click="getMore">查看更多
						<van-icon name="arrow"/>
					</div>
				</div>

				<div class="mb-30 mt-20" v-show="orgType > 5">
					<el-table
							stripe
							class="huo-list-table main-theme-table huojv-data-list2 rowspanTable"
							ref="singleTable1" size="mini"
							:data="tableActiveData1"
					>
<!--						<el-table-column property="orgName" label="项目名称" width="80" fixed></el-table-column>-->
						<el-table-column property="designChangeReason" label="变更原因" width="80"></el-table-column>
						<el-table-column property="designChangeDescription" label="变更描述" width="120"></el-table-column>
						<el-table-column property="designChangeAmount" label="变更金额(元)" width="100">
							<template slot="header" slot-scope="scope">
								<div @click="sortData('designChangeAmount')">
									<span>变更金额(元)</span>
<!--									<i :class="[sortColumn === 'designChangeAmount' ? 'green-font' : 'light-green-font']"-->
<!--									   class="el-icon-caret-bottom" style="margin-left: 2px;"></i>-->
									<label class="table-sort-ico">
										<i :class="[sortColumn == 'designChangeAmount' && sortType === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
										<i :class="[sortColumn == 'designChangeAmount' && sortType === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
									</label>
								</div>
							</template>
						</el-table-column>
						<el-table-column property="designChangeRate" label="成本变动率" align="center" width="100">
							<template slot="header" slot-scope="scope">
								<div @click="sortData('designChangeRate')">
									<span>成本变动率</span>
<!--									<i :class="[sortColumn === 'designChangeRate' ? 'green-font' : 'light-green-font']"-->
<!--									   class="el-icon-caret-bottom" style="margin-left: 2px;"></i>-->
									<label class="table-sort-ico">
										<i :class="[sortColumn == 'designChangeRate' && sortType === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
										<i :class="[sortColumn == 'designChangeRate' && sortType === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
									</label>
								</div>
							</template>
							<template slot-scope="scope">
								<span>{{(scope.row.designChangeRate || '-') + '‱'}}</span>
							</template>
						</el-table-column>
						<el-table-column property="designUser" label="设计负责人" align="center" width="100"></el-table-column>
					</el-table>
					<div class="huojv-data-list-more" @click="getMore"  v-if="tableData1.length>5">查看更多
						<van-icon name="arrow"/>
					</div>
				</div>


				<!-- 标题 -->
				<div class="data-title-box data-title-line">
					<span class="title">设计变更成本变动类型</span>
				</div>
				<!-- board数据 -->
				<ul class="data-info-list pb-20" style="border-bottom: 0;">
					<li>
						<div class="data-type middle"><div>设计变更成本</div>变动总金额</div>
						<div class="data-box mt-20">
							<label class="value middle" v-text="summary.total || '-'">0</label>
							<label class="unit">{{orgType>=5?'万':'亿'}}元</label>
						</div>
					</li>
					<li>
						<div class="data-type middle"><div>设计变更成本</div>增项金额</div>
						<div class="data-box mt-20">
							<label class="value middle" v-text="summary.positiveTotal || '-'">0</label>
							<label class="unit">{{orgType>=5?'万':'亿'}}元</label>
						</div>
					</li>
					<li>
						<div class="data-type middle"><div>设计变更成本</div>减项金额</div>
						<div class="data-box mt-20">
							<label class="value middle" v-text="summary.negativeTotal || '-'">0</label>
							<label class="unit">{{orgType>=5?'万':'亿'}}元</label>
						</div>
					</li>
				</ul>
				<p class="boxTitle text-center mt-30" style="margin-bottom: 0;">设计变更成本增项类型</p>
				<div class="huojv-costContract-chart-panel" ref="chart2"></div>
				<p class="boxTitle text-center mt-30" style="margin-bottom: 0;">设计变更成本减项类型</p>
				<div class="huojv-costContract-chart-panel" ref="chart3"></div>
			</div>
		</div>
	</div>
</template>

<script>
    import scrollFixed from '@/mixin/scroll-fixed';
    import {List, PullRefresh, NavBar,Icon} from 'vant';
    import $ from 'jquery';
    import echarts from 'echarts';
    import request from '@/utils/request';
    import {getUrlParam, getNextMonths} from '@/utils/common'

    export default {
        mixins: [scrollFixed],

        data() {
            return {
                isLoading: false,//下拉刷新,从第一页开始
                orgId: '',
                orgType: 2,

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
                        'left': '8%',
                        'right': '4%',
                        'bottom': '18%',
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
                        name: '单位：%',
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
                pieOption: {
                    title: {
                        text: '',
                        show: true,
                        textStyle: {
                            fontWeight: 500,
                            fontSize: (window.innerWidth / 375) * 14,
                            lineHeight: (window.innerWidth / 375) * 14 + 4,
                            color: '#333333'
                        },
                        x: 'center',
                        y: 'top'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b} : {c} ({d}%)",
                        textStyle: {
                            fontSize: 12,
                            fontWeight: 0
                        },
                    },
                    grid: {
                        top: '0%',
                        left: '0%',
                        right: '0%',
                        bottom: '0%',
                        containLabel: false
                    },
                    legend: {
                        type: 'plain',
                        icon: 'circle',
                        x: "center",
                        y: "bottom",
                        itemWidth: 10,
                        itemHeight: 8,
                        itemGap: 5,
                        textStyle: {
                            color: '#999999',
                            fontSize: 11,
                            fontWeight: 0
                        },
                        data: []
                    },
                    orgName: '',
                    series: []
                },

                tableActiveData1:[],
                tableData1:[],
                sortColumn:'designChangeRate',
                sortType:'DESC',

                summary:{},
                negative:[],
                positive:[],
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

                // 组织机构为项目层级时显示表格  除外显示柱状图
                if(this.orgType < 6){
                    this.getChartData1();
                }else{
                    this.getDesignChangeDetail();
                }

                this.getChartData2();
            },

	        // 获取柱状图数据
	        getChartData1(){
                request({
                    url: `/app-api/productDesign/designChangeDetailSummary`,
                    method: 'get',
                    params:{
                        orgId:this.orgId,
                        designType: this.designType
                    }
                }).then(({ data }) => {
                    if (data.code === 0 && data.data) {
                        this.drawChart1(data.data)
                    }else{
                        this.drawChart1([])
                    }
                }).catch((e) => {
                    console.log('getDesignChange-err', e);
                });
	        },

	        // 绘制柱状图
            drawChart1(data){
                let xAxisData = [];
                let chartData1 = [];

                data.forEach(item => {
                    xAxisData.push(item.orgName);
                    chartData1.push(item.designChangeRate);
                })

                let series = [{
                    name: '设计变更成本变动率',
                    type: 'bar',
                    barWidth: this.orgType <= 2 ? '24' : '10',
                    itemStyle: {
                        normal: {
                            color: '#209B5C'
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
                option.grid.bottom = '10%';
                // option.title.text = '';
                // option.yAxis.name = this.tab3 == 1 ? '单位('+ this.costUnit +')' : '单位('+ this.areaUnit +')';
                option.tooltip.formatter = (params) => {
                    let showHtm = "<div>" + params[0].axisValueLabel + "</div>";
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
                if(this.orgType <= 2 || this.orgType == 6){
                    option.xAxis.axisLabel.rotate = 0;
                }
                option.xAxis.data = xAxisData;
                if (xAxisData.length > 6) {
                    option.dataZoom[0].endValue = xAxisData[5];
                } else {
                    option.dataZoom[0].endValue = xAxisData[xAxisData.length - 1];
                }
                option.dataZoom[0].startValue = xAxisData[0];

                let myChart = new echarts.init(this.$refs.chart1);
                myChart.setOption(option, true);
            },

	        // 获取饼状图数据
	        getChartData2(){
                request({
                    url: `/app-api/productDesign/designChangePie`,
                    method: 'get',
                    params:{
                        orgId:this.orgId,
                        designType: this.designType
                    }
                }).then(({ data }) => {
                    if (data.code === 0 && data.data) {
                        this.summary = data.data.summary || {};
                        this.positive = data.data.positive;
                        this.negative = data.data.negative;

                        if(data.data.negative){
                            this.drawChart2(data.data.positive,2)
                            this.drawChart2(data.data.negative,3)
                        }else{
                            this.drawChart2([{designChangeType:'暂无',designChangeRate:0.00}],2)
                            this.drawChart2([{designChangeType:'暂无',designChangeRate:0.00}],3)
                        }

                    }
                }).catch((e) => {
                    console.log('designChangePie-err', e);
                });
	        },

	        // 绘制饼状图  chartIndex表示图表序列
            drawChart2(chartData,chartIndex){
                let legendData = [], pieData = [];

                chartData.forEach(item => {
                    let name = item.designChangeType.length > 7 ? (item.designChangeType.substr(0,7)+'...') : item.designChangeType;
                    legendData.push(name);
                    pieData.push({name,value:item.designChangeRate});
                });

                let series = [{
                    name: '',
                    type: 'pie',
                    radius: '40%',
                    center: ['50%', '40%'],
                    color: ['#209B5C', '#FFC40F','#4995E3','#F97546','#9949E3','#C42438','#133F98','#B4A36B','#ACB34B'],
                    avoidLabelOverlap: true,
                    label: {
                        normal: {
                            formatter: (params) => {
                                return params.name +':'+ params.percent + '%'
                            },
                            textStyle: {
                                fontSize: '11',
                                color: '#666666'
                            }
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '11',
                                color: '#666666'
                            }
                        }
                    },
                    itemStyle: {
                        borderWidth: 1, //设置border的宽度有多大
                        borderColor: '#fff',
                    },
                    labelLine: {
                        normal: {
                            smooth: 0.2,
                            length: 10,
                        }
                    },
                    data: pieData
                }];

                let option = JSON.parse(JSON.stringify(this.pieOption));
                option.series = series;
                option.legend.data = legendData;
                // let option = this.getOption(series, legendData, '不同类型利润率的项目分布');
                option.tooltip.formatter = (params) => {
                    // return params.data.name + '：' + params.data.value + '%'
                    return chartData[params.dataIndex].designChangeType + '：' + params.data.value + '%'
                }
                let pie = new echarts.init(this.$refs['chart'+chartIndex]);
                pie.setOption(option);
            },

	        getDesignChangeDetail(){
                request({
                    url: `/app-api/productDesign/designChangeDetail`,
                    method: 'get',
                    params:{
                        orgId:this.orgId,
                        designType: this.designType,
                        current: 1, 
                        size: 6,
                        sortColumn:this.sortColumn,
                        sortType:this.sortType
                    }
                }).then(({ data }) => {
                    if (data.code === 0 && data.data) {
                        let list = data.data.records;

                        this.tableData1 = list;
                        if(list.length > 5){
                            this.tableActiveData1 = list.slice(0,5);
                        }else{
                            this.tableActiveData1 = list;
                        }
                    }
                }).catch((e) => {
                    console.log('designChangePie-err', e);
                });
	        },

            sortData(sortColumn){
                if(this.sortColumn != sortColumn){
                    this.sortColumn = sortColumn;
                    this.sortType = 'DESC';
                } else{
                    this.sortType = (this.sortType == 'ASC' ? 'DESC' : 'ASC');
                }

                this.getDesignChangeDetail();
            },

            getMore(){
                this.$router.push({
                    path:'/report/productDesign/moreChangeDesign', 
                    query: {
                        orgId: this.orgId, 
                        pageType:1, 
                        token: getUrlParam('token'),
                        designType: this.designType
                    }
                });
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

