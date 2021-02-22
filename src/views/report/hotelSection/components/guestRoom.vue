<template>
	<div class="report-index">
		<div class="main-content">
			<div class="data-content-panel no-top-left-radius clearfix" v-show="tab1 != 4" style="overflow: visible;">

				<ul class="data-info-list pb-20 three-cols mt-30" style="border-bottom: 0;">
					<li>
						<div class="data-type middle">客房收入</div>
						<div class="data-box mt-20">
							<label class="value middle" v-text="boardData.houseIncome || '-'"></label>
							<label class="unit">万元</label>
							<i v-show="boardData.houseIncomeCompare" :class="boardData.houseIncomeCompare < 0 ? 'huojv-ico-down' : 'huojv-ico-up'" class="normal ml-5"></i>
						</div>
						<div class="data-type mt-10">同期：<label v-text="boardData.houseIncomeLast || '-'"></label>万元</div>
						<div class="data-type">预算：<label v-text="boardData.houseIncomePlan || '-'"></label>万元</div>
					</li>
					<li>
						<div class="data-type middle">成本</div>
						<div class="data-box mt-20">
							<label class="value middle">--</label>
							<label class="unit"></label>
						</div>
					</li>
					<li>
						<div class="data-type middle">GOP率</div>
						<div class="data-box mt-20">
							<label class="value middle">--</label>
							<label class="unit"></label>
						</div>
					</li>
				</ul>
				<ul class="data-info-list pb-20 three-cols">
					<li>
						<div class="data-type middle style1">入住率</div>
						<div class="data-box">
							<label class="value middle" v-text="boardData.occRate || '-'"></label>
							<label class="unit">%</label>
							<i v-show="boardData.occRateCompare" :class="boardData.occRateCompare < 0 ? 'huojv-ico-down' : 'huojv-ico-up'" class="normal ml-5"></i>
						</div>
						<div class="data-type mt-10">同期：<label v-text="boardData.occRateLast || '-'"></label>%</div>
						<div class="data-type">预算：<label v-text="boardData.occRatePlan || '-'"></label>%</div>
					</li>
					<li>
						<div class="data-type middle style1">平均房价</div>
						<div class="data-box">
							<label class="value middle" v-text="boardData.adrPrice || '-'"></label>
							<label class="unit">万元</label>
							<i v-show="boardData.adrPriceCompare" :class="boardData.adrPriceCompare < 0 ? 'huojv-ico-down' : 'huojv-ico-up'" class="normal ml-5"></i>
						</div>
						<div class="data-type mt-10">同期：<label v-text="boardData.adrPriceLast || '-'"></label>元</div>
						<div class="data-type">预算：<label v-text="boardData.adrPricePlan || '-'"></label>元</div>
					</li>
					<li>
						<div class="data-type middle style1">平均客房收益(RevPAR)</div>
						<div class="data-box">
							<label class="value middle" v-text="boardData.revPar || '-'"></label>
							<label class="unit">元</label>
							<i v-show="boardData.revParCompare" :class="boardData.revParCompare < 0 ? 'huojv-ico-down' : 'huojv-ico-up'" class="normal ml-5"></i>
						</div>
						<div class="data-type mt-10">同期：<label v-text="boardData.revParLast || '-'"></label>元</div>
						<div class="data-type">预算：<label v-text="boardData.revParPlan || '-'"></label>元</div>
					</li>
				</ul>

				<!-- 标题 -->
				<div class="data-title-box data-title-line clearfix">
					<span class="title">关键指标趋势</span>
				</div>

				<div class="huojv-costContract-chart-panel" ref="chart1"></div>

				<!-- 组织机构为某个酒店时显示 -->
				<div v-show="orgType > 5">
					<!-- 标题 -->
					<div class="data-title-box data-title-line clearfix">
						<span class="title">开房率对比</span>
					</div>

					<div class="huojv-costContract-chart-panel" ref="chart5"></div>

					<!-- 标题 -->
					<div class="data-title-box data-title-line clearfix">
						<span class="title">平均房价对比</span>
					</div>

					<div class="huojv-costContract-chart-panel" ref="chart6"></div>

					<!-- 标题 -->
					<div class="data-title-box data-title-line clearfix">
						<span class="title">可售房收入对比</span>
					</div>

					<div class="huojv-costContract-chart-panel" ref="chart7"></div>
				</div>

				<!-- 标题 -->
				<div class="data-title-box data-title-line clearfix">
					<span class="title">累计客源收入对比</span>
				</div>

				<div class="huojv-costContract-chart-panel" ref="chart2"></div>

				<!-- 标题 -->
				<div class="data-title-box data-title-line clearfix">
					<span class="title">累计客源结构占比</span>
				</div>

				<div class="huojv-costContract-chart-panel" ref="chart3"></div>

				<!-- 标题 -->
				<!-- <div class="data-title-box data-title-line clearfix">
					<span class="title">线上渠道收入占比</span>
				</div>

				<div class="huojv-costContract-chart-panel" ref="chart4"></div> -->
			</div>

			<div class="data-content-panel no-top-left-radius clearfix" v-show="tab1 == 4" style="overflow: visible;">
				<ul class="data-info-list pb-20 two-cols mt-30" style="border-bottom: 0;">
					<li>
						<div class="data-type middle">客房收入</div>
						<div class="data-box mt-20">
							<label class="value middle" v-text="boardData.houseIncome || '-'"></label>
							<label class="unit">元</label>
							<i v-show="boardData.houseIncomeCompare" :class="boardData.houseIncomeCompare < 0 ? 'huojv-ico-down' : 'huojv-ico-up'" class="normal ml-5"></i>
						</div>
						<div class="data-type mt-10">同期：<label v-text="boardData.houseIncomeLast || '-'"></label>元</div>
					</li>
					<li>
						<div class="data-type middle style1">入住率</div>
						<div class="data-box">
							<label class="value middle" v-text="boardData.occRate || '-'"></label>
							<label class="unit">%</label>
							<i v-show="boardData.occRateCompare" :class="boardData.occRateCompare < 0 ? 'huojv-ico-down' : 'huojv-ico-up'" class="normal ml-5"></i>
						</div>
						<div class="data-type mt-10">同期：<label v-text="boardData.occRateLast || '-'"></label>%</div>
					</li>
				</ul>
				<ul class="data-info-list pb-20 two-cols">
					<li>
						<div class="data-type middle style1">平均房价</div>
						<div class="data-box">
							<label class="value middle" v-text="boardData.adrPrice || '-'"></label>
							<label class="unit">元</label>
							<i v-show="boardData.adrPriceCompare" :class="boardData.adrPriceCompare < 0 ? 'huojv-ico-down' : 'huojv-ico-up'" class="normal ml-5"></i>
						</div>
						<div class="data-type mt-10">同期：<label v-text="boardData.adrPriceLast || '-'"></label>元</div>
					</li>
					<li>
						<div class="data-type middle style1">平均客房收益(RevPAR)</div>
						<div class="data-box">
							<label class="value middle" v-text="boardData.revPar || '-'"></label>
							<label class="unit">元</label>
							<i v-show="boardData.revParCompare" :class="boardData.revParCompare < 0 ? 'huojv-ico-down' : 'huojv-ico-up'" class="normal ml-5"></i>
						</div>
						<div class="data-type mt-10">同期：<label v-text="boardData.revParLast || '-'"></label>元</div>
					</li>
				</ul>
        <!-- 标题 -->
				<div class="data-title-box data-title-line clearfix">
					<span class="title">房务分析表</span>
				</div>
        <el-table stripe class="huo-list-table main-theme-table" size="mini" highlight-current-row border :data="tableData"
          :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}">
          <el-table-column prop="grouptype" label="市场分类" width="90" fixed></el-table-column>
          <el-table-column label="当日">
            <el-table-column :label="'客房总数：'+daySumqty">
              <el-table-column prop="dayInrooms" label="入住房数" width="75"></el-table-column>
              <el-table-column prop="dayOCCRate" label="出租率" width="65"></el-table-column>
              <el-table-column prop="dayRoomcharge" label="房租" width="75"></el-table-column>
              <el-table-column prop="dayADRPrice" label="平均价" width="70"></el-table-column>
            </el-table-column>
          </el-table-column>
          <el-table-column label="本月累计">
            <el-table-column :label="monthDays">
              <el-table-column prop="monthInrooms" label="入住房数" width="75"></el-table-column>
              <el-table-column prop="monthOCCRate" label="出租率" width="65"></el-table-column>
              <el-table-column prop="monthRoomcharge" label="房租" width="75"></el-table-column>
              <el-table-column prop="monthADRPrice" label="平均价" width="70"></el-table-column>
            </el-table-column>
          </el-table-column>
          <el-table-column label="本年累计">
            <el-table-column :label="yearDays">
              <el-table-column prop="yearInrooms" label="入住房数" width="75"></el-table-column>
              <el-table-column prop="yearOCCRate" label="出租率" width="65"></el-table-column>
              <el-table-column prop="yearRoomcharge" label="房租" width="75"></el-table-column>
              <el-table-column prop="yearADRPrice" label="平均价" width="70"></el-table-column>
            </el-table-column>
          </el-table-column>
          <el-table-column label="去年本月">
            <el-table-column :label="lastYearMonthDays">
              <el-table-column prop="lastYearMonthInrooms" label="入住房数" width="75"></el-table-column>
              <el-table-column prop="lastYearMonthOCCRate" label="出租率" width="65"></el-table-column>
              <el-table-column prop="lastYearMonthRoomcharge" label="房租" width="75"></el-table-column>
              <el-table-column prop="lastYearMonthADRPrice" label="平均价" width="70"></el-table-column>
            </el-table-column>
          </el-table-column>
				</el-table>
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
                pieOption: {
                    title: {
                        text: '',
                        show: true,
                        textStyle: {
                            fontWeight: 500,
                            fontSize: 16,
                            color: '#333333'
                        },
                        x: 'center',
                        y: 'top'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a}{b}：{c}万元",
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
                        itemHeight: 10,
                        itemGap: 5,
                        textStyle: {
                            color: '#333333',
                            fontSize: 12,
                            fontWeight: 0
                        },
                        data: []
                    },
                    series: []
                },
	            orgType:2,
	            unit:'',
              queryPeriod:'',
              boardData:{},
              tableData: [],
              daySumqty:'-',
              monthDays:'-',
              yearDays:'-',
              lastYearMonthDays:'-'
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
                if(this.tab1 != 4){
                    this.getTrendData();
                    this.getCumulativeSourceData();
                    // this.getChannelIncomeData();
                }else{
                  this.getTableData();
                }
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
                            houseIncome : data.data[0].houseIncome && data.data[0].houseIncome.amount || '-',
                            houseIncomeLast  :data.data[0].houseIncomeLast && data.data[0].houseIncomeLast.amount || '-',
                            houseIncomePlan :data.data[0].houseIncomePlan && data.data[0].houseIncomePlan.amount || '-',
                            houseIncomeCompare:(data.data[0].houseIncome && data.data[0].houseIncome.amount || 0) - (data.data[0].houseIncomeLast && data.data[0].houseIncomeLast.amount || 0),

                            occRate : data.data[0].occRate && data.data[0].occRate.percentage || '-',
                            occRateLast :data.data[0].occRateLast && data.data[0].occRateLast.percentage || '-',
                            occRatePlan :data.data[0].occRatePlan && data.data[0].occRatePlan.percentage || '-',
                            occRateCompare:(data.data[0].occRate && data.data[0].occRate.percentage || 0) - (data.data[0].occRateLast && data.data[0].occRateLast.percentage || 0),

                            adrPrice : data.data[0].adrPrice && data.data[0].adrPrice.amount || '-',
                            adrPriceLast :data.data[0].adrPriceLast && data.data[0].adrPriceLast.amount || '-',
                            adrPricePlan:data.data[0].adrPricePlan && data.data[0].adrPricePlan.amount || '-',
                            adrPriceCompare:(data.data[0].adrPrice && data.data[0].adrPrice.amount || 0) - (data.data[0].adrPriceLast && data.data[0].adrPriceLast.amount || 0),

                            revPar: data.data[0].revPar && data.data[0].revPar.amount || '-',
                            revParLast:data.data[0].revParLast && data.data[0].revParLast.amount || '-',
                            revParPlan:data.data[0].revParPlan && data.data[0].revParPlan.amount || '-',
                            revParCompare:(data.data[0].revPar && data.data[0].revPar.amount || 0) - (data.data[0].revParLast && data.data[0].revParLast.amount || 0)
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
                        let list1 = [],list2 = [], list3 = [], list4 = [];
                        data.data.forEach(item => {
                            let chartData1 = {
                                revPar:item.revPar && item.revPar.amount || '-',
                                adrPrice:item.adrPrice && item.adrPrice.amount || '-',
                                occRate:item.occRate && item.occRate.percentage || '-',
                                statMonth:item.statMonth,
                            };

                            let chartData2 = {
                                occRate:item.occRate && item.occRate.percentage || '-',
                                occRateLast:item.occRateLast && item.occRateLast.percentage || '-',
                                occRatePlan:item.occRatePlan && item.occRatePlan.percentage || '-',
                                statMonth:item.statMonth,
                            };

                            let chartData3 = {
                                adrPrice:item.adrPrice && item.adrPrice.amount || '-',
                                adrPriceLast:item.adrPriceLast && item.adrPriceLast.amount || '-',
                                adrPricePlan:item.adrPricePlan && item.adrPricePlan.amount || '-',
                                statMonth:item.statMonth,
                            };

                            let chartData4 = {
                                revPar:item.revPar && item.revPar.amount || '-',
                                revParLast:item.revParLast && item.revParLast.amount || '-',
                                statMonth:item.statMonth,
                            };

                            list1.push(chartData1);
                            list2.push(chartData2);
                            list3.push(chartData3);
                            list4.push(chartData4);
                        })

                        this.drawChart1(list1);
                        if(this.orgType > 4){
                            this.$nextTick(() => {
                                this.drawChart5(list2);
                                this.drawChart6(list3);
                                this.drawChart7(list4);
                            })
                        }
                    }else{
                        this.drawChart1([]);

                        if(this.orgType > 4){
                            this.$nextTick(() => {
                                this.drawChart5([]);
                                this.drawChart6([]);
                                this.drawChart7([]);
                            })
                        }
                    }
                }).catch((e) => {
                    console.log('getBoardData-err', e);
                });
            },

            // 获取客源收入图表数据
            getCumulativeSourceData(){
                request({
                    url: '/app-api/culturalTourism/hotel/cumulativeSourceIncome',
                    method: 'post',
                    data:{orgId:this.orgId,queryPeriod:this.queryPeriod}
                }).then(({data}) => {
                    if (data.code === 0 && data.data && data.data.length) {
                        let list1 = [],list2 = [];
                        data.data.forEach(item => {
                            let chartData1 = {
                                income:item.income && item.income.amount || '-',
                                incomeLast:item.incomeLast && item.incomeLast.amount || '-',
                                customerType :item.customerType,
                            };

                            let chartData2 = {
                                incomeRate:item.incomeRate && item.incomeRate.percentage || '-',
                                incomeRateLast:item.incomeRateLast && item.incomeRateLast.percentage || '-',
                                customerType :item.customerType,
                            };

                            list1.push(chartData1);
                            list2.push(chartData2);
                        })

                        this.drawChart2(list1);
                        this.drawChart3(list2);

                    }else{
                        this.drawChart2([]);
                        this.drawChart3([]);
                    }
                }).catch((e) => {
                    console.log('getBoardData-err', e);
                });
            },

            // 获取线上渠道收入图表数据
            getChannelIncomeData(){
                request({
                    url: '/app-api/culturalTourism/hotel/onlineChannelIncome',
                    method: 'post',
                    data:{orgId:this.orgId,queryPeriod:this.queryPeriod}
                }).then(({data}) => {
                    if (data.code === 0 && data.data && data.data.length) {
                        let list1 = [];
                        data.data.forEach(item => {
                            let chartData1 = {
                                name:item.customerTypeSecondary || '-',
                                value:item.income && item.income.amount || '-',
                            };

                            list1.push(chartData1);
                        })

                        this.drawChart4(list1);

                    }else{
                        this.drawChart4([{name:'暂无数据',value:0}]);
                    }
                }).catch((e) => {
                    console.log('getBoardData-err', e);
                });
            },

            drawChart1(data){
                let chartData1 = [],chartData2 = [], chartData3 = [];
                let xAxisData = [];

                data.forEach(item => {
                    chartData1.push(item.revPar);
                    chartData2.push(item.adrPrice);
                    chartData3.push(item.occRate);
                    xAxisData.push(item.statMonth + '月');
                })

                let series = [{
                    name: 'RevPar',
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
                    name: '平均房价',
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
                    name: '入住率',
                    data: chartData3,
                    type: 'line',
                    smooth: false,
                    symbol:'none',
	                yAxisIndex:1,
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
                    name: '',
                    type: 'value',
                    axisTick: {
                        show: false
                    },
                    nameTextStyle:{
                        color:"#333333",
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
                    type: 'value',
                    nameTextStyle:{
                        color:"#333333",
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
                        formatter: '{value}%',
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
                option.yAxis[0].name = '单位：元'
                option.yAxis[1].name = '单位：%'
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
                if (xAxisData.length > 8) {
                    option.dataZoom[0].endValue = xAxisData[7];
                } else {
                    option.dataZoom[0].endValue = xAxisData[xAxisData.length - 1];
                }
                option.dataZoom[0].startValue = xAxisData[0];
                option.tooltip.extraCssText='box-shadow: 0 0 10px #ccc; padding: 6px 15px;';

                let myChart = new echarts.init(this.$refs.chart1);
                myChart.setOption(option, true);
            },

	        drawChart2(data){
                let chartData1 = [],chartData2 = [];
                let xAxisData = [];

                data.forEach(item => {
                    chartData1.push(item.income);
                    chartData2.push(item.incomeLast);
                    xAxisData.push(item.customerType);
                })

                let series = [{
                    name: '实际收入',
                    type: 'bar',
                    barWidth: '24',
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
                    name: '去年同期',
                    type: 'bar',
                    barWidth: '24',
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
                if (xAxisData.length > 4) {
                    option.dataZoom[0].endValue = xAxisData[3];
                } else {
                    option.dataZoom[0].endValue = xAxisData[xAxisData.length - 1];
                }
                option.dataZoom[0].startValue = xAxisData[0];
                option.tooltip.extraCssText='box-shadow: 0 0 10px #ccc; padding: 6px 15px;';

                let myChart = new echarts.init(this.$refs.chart2);
                myChart.setOption(option, true);
	        },

            drawChart3(data){
                let pieData = data.map( i => {
                    return {
                       value: i.incomeRate,
                       name: i.customerType
                    }
                }),
                legendData = data.map( i => {
                    return  i.customerType
                });

                let series = [
                    {
                        name: '',
                        type: 'pie',
                        radius: '45%',
                        center: ['50%', '50%'],
                        color: [ '#209B5C','#4995E3', '#F97546', '#FFC40F', '#31ADB9', '#0B8348', '#B4A36B','#D19535'],
                        avoidLabelOverlap: true,
                        label: {
                            normal: {
                                formatter: '{b}：{d}%',
                                textStyle: {
                                    fontSize: '12',
                                    color: '#333333'
                                }
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '12',
                                    color: '#333333'
                                }
                            }
                        },
                        itemStyle:{
                            borderWidth:1, //设置border的宽度有多大
                            borderColor:'#fff',
                        },
                        labelLine: {
                            normal: {
                                smooth: 0.2,
                                length: 3,
                            }
                        },
                        data: pieData
                    }
                ];

                let option = JSON.parse(JSON.stringify(this.pieOption));
                option.series = series;
                option.legend.data = legendData;
                let pie = new echarts.init(this.$refs.chart3);
                if (pieData.length>12) {
                    series[0].radius = '40%'
                    series[0].center = ['50%','45%']
                    pie.resize({height:380});
                }

                pie.setOption(option, true);
                // let chartData1 = [],chartData2 = [];
                // let xAxisData = [];

                // data.forEach(item => {
                //     chartData1.push(item.incomeRate);
                //     chartData2.push(item.incomeRateLast);
                //     xAxisData.push(item.customerType);
                // })

                // let series = [{
                //     name: '实际收入占比',
                //     type: 'bar',
                //     barWidth: '24',
                //     // formatter: '{value} 万㎡',
                //     itemStyle: {
                //         normal: {
                //             color: '#006E38'
                //         }
                //     },
                //     label: {
                //         show: true,
                //         position: 'inside',
                //         formatter: function (params) {
                //             if (params.value == 0) {
                //                 return '';
                //             } else {
                //                 return params.value + '%';
                //             }
                //         }
                //     },
                //     data: chartData1
                // },
                // // {
                // //     name: '去年同期占比',
                // //     type: 'bar',
                // //     barWidth: '24',
                // //     // formatter: '{value} 万㎡',
                // //     itemStyle: {
                // //         normal: {
                // //             color: '#FFC40F'
                // //         }
                // //     },
                // //     label: {
                // //         show: true,
                // //         position: 'inside',
                // //         formatter: function (params) {
                // //             if (params.value == 0) {
                // //                 return '';
                // //             } else {
                // //                 return params.value + '%';
                // //             }
                // //         }
                // //     },
                // //     data: chartData2
                // // }
                // ];

                // let legendData = series.map(item => {
                //     return item.name;
                // });

                // let option = JSON.parse(JSON.stringify(this.chartOption));
                // option.series = series;
                // let hasData = false;
                // series.forEach(item => {
                //     if(item.data.length > 0){
                //         hasData = true;
                //     }
                // })
                // if(!hasData){
                //     option.title.show = true;
                //     option.grid.left = '10%'
                // }
                // option.legend.data = legendData;
                
                // // option.title.text = '';
                // // option.yAxis.name = this.tab3 == 1 ? '单位('+ this.costUnit +')' : '单位('+ this.areaUnit +')';
                // option.tooltip.formatter = params => {
                //     let index = 0;
                //     let showHtm = "<div>" + params[0].axisValueLabel + "</div>";
                //     for(let i = 0; i <= xAxisData.length; i++){
                //         if(xAxisData[i] == params[0].axisValueLabel){
                //             index = i;
                //             break;
                //         }
                //     }

                //     for (let i = 0; i < params.length; i++) {
                //         //名称
                //         let text = '<span class="chart-tooltip">' + params[i].seriesName + '：</span>';
                //         //值
                //         let value = params[i].value;
                //         let marker = params[i].marker;

                //         showHtm += '<div style="line-height: 16px;">' +marker + text + value + '</div>';
                //     }
                //     return showHtm;
                // }
                // // option.tooltip.formatter = '{b} <br/>{a0} ： {c0} 个<br/>{a1} ： {c1} 个<br/>{a2} ： {c2} 个';

	            // option.yAxis.axisLabel.formatter = '{value}';
                // // option.yAxis.show = false;

                // if(option.xAxis.data.length > 3){
                //     option.xAxis.axisLabel.rotate = 45;
                // }else{
                //     option.xAxis.axisLabel.rotate = 0;
                // }

                // option.yAxis.name = '单位：%'

                // option.xAxis.data = xAxisData;
                // if (xAxisData.length > 4) {
                //     option.dataZoom[0].endValue = xAxisData[3];
                // } else {
                //     option.dataZoom[0].endValue = xAxisData[xAxisData.length - 1];
                // }
                // option.dataZoom[0].startValue = xAxisData[0];
                // option.tooltip.extraCssText='box-shadow: 0 0 10px #ccc; padding: 6px 15px;';

                // let myChart = new echarts.init(this.$refs.chart3);
                // myChart.setOption(option, true);
            },

            drawChart4(data){
                let pieData = data;
                let legendData = [];
                data.forEach(item => {
                    legendData.push(item.name);
                })

                let series = [
                    {
                        name: '',
                        type: 'pie',
                        radius: '45%',
                        center: ['50%', '50%'],
                        color: [ '#209B5C','#4995E3', '#F97546', '#FFC40F', '#31ADB9', '#0B8348', '#B4A36B','#D19535'],
                        avoidLabelOverlap: true,
                        label: {
                            normal: {
                                formatter: '{b}：{d}%',
                                textStyle: {
                                    fontSize: '12',
                                    color: '#333333'
                                }
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '12',
                                    color: '#333333'
                                }
                            }
                        },
                        itemStyle:{
                            borderWidth:1, //设置border的宽度有多大
                            borderColor:'#fff',
                        },
                        labelLine: {
                            normal: {
                                smooth: 0.2,
                                length: 3,
                            }
                        },
                        data: pieData
                    }
                ];

                let option = JSON.parse(JSON.stringify(this.pieOption));
                option.series = series;
                option.legend.data = legendData;
                let pie = new echarts.init(this.$refs.chart4);
                if (pieData.length>12) {
                    series[0].radius = '40%'
                    series[0].center = ['50%','45%']
                    pie.resize({height:380});
                }

                pie.setOption(option, true);
            },

            drawChart5(data){
                let chartData1 = [],chartData2 = [], chartData3 = [];
                let xAxisData = [];

                data.forEach(item => {
                    chartData1.push(item.occRate);
                    chartData2.push(item.occRatePlan);
                    chartData3.push(item.occRateLast);
                    xAxisData.push(item.statMonth + '月');
                })

                let series = [{
                    name: 'OCC实际',
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
                    name: 'OCC预算',
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
                    name: 'OCC去年同期',
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
                series.forEach(item => {
                    if(item.data.length > 0){
                        hasData = true;
                    }
                })
                if(!hasData){
                    option.title.show = true;
                    option.grid.left = '10%'
                }
                option.yAxis = [{
                    name: '单位：%',
                    type: 'value',
                    axisTick: {
                        show: false
                    },
                    nameTextStyle:{
                        color:"#333333",
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
                        formatter: '{value}%',
                        show: true,
                        textStyle: {
                            color: '#333333'
                        }
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

                option.xAxis.axisLabel.rotate =45;
                option.xAxis.data = xAxisData;
                if (xAxisData.length > 8) {
                    option.dataZoom[0].endValue = xAxisData[7];
                } else {
                    option.dataZoom[0].endValue = xAxisData[xAxisData.length - 1];
                }
                option.dataZoom[0].startValue = xAxisData[0];
                option.tooltip.extraCssText='box-shadow: 0 0 10px #ccc; padding: 6px 15px;';

                let myChart = new echarts.init(this.$refs.chart5);
                myChart.setOption(option, true);
            },

            drawChart6(data){
                let chartData1 = [],chartData2 = [], chartData3 = [];
                let xAxisData = [];

                data.forEach(item => {
                    chartData1.push(item.adrPrice);
                    chartData2.push(item.adrPricePlan);
                    chartData3.push(item.adrPriceLast);
                    xAxisData.push(item.statMonth + '月');
                })

                let series = [{
                    name: 'ADR实际',
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
                    name: 'ADR预算',
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
                    name: 'ADR去年同期',
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
                series.forEach(item => {
                    if(item.data.length > 0){
                        hasData = true;
                    }
                })
                if(!hasData){
                    option.title.show = true;
                    option.grid.left = '10%'
                }
                option.yAxis = [{
                    name: '单位：元',
                    type: 'value',
                    axisTick: {
                        show: false
                    },
                    nameTextStyle:{
                        color:"#333333",
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
                if (xAxisData.length > 8) {
                    option.dataZoom[0].endValue = xAxisData[7];
                } else {
                    option.dataZoom[0].endValue = xAxisData[xAxisData.length - 1];
                }
                option.dataZoom[0].startValue = xAxisData[0];
                option.tooltip.extraCssText='box-shadow: 0 0 10px #ccc; padding: 6px 15px;';

                let myChart = new echarts.init(this.$refs.chart6);
                myChart.setOption(option, true);
            },

            drawChart7(data){
                let chartData1 = [],chartData2 = [];
                let xAxisData = [];
                console.log('可售房',data)

                data.forEach(item => {
                    chartData1.push(item.revPar);
                    chartData2.push(item.revParLast);
                    xAxisData.push(item.statMonth + '月');
                })

                let series = [{
                    name: 'RevPAR实际',
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
                    name: 'RevPAR去年同期',
                    data: chartData2,
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
                }
                option.yAxis = [{
                    name: '单位：元',
                    type: 'value',
                    axisTick: {
                        show: false
                    },
                    nameTextStyle:{
                        color:"#333333",
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
                if (xAxisData.length > 8) {
                    option.dataZoom[0].endValue = xAxisData[7];
                } else {
                    option.dataZoom[0].endValue = xAxisData[xAxisData.length - 1];
                }
                option.dataZoom[0].startValue = xAxisData[0];
                option.tooltip.extraCssText='box-shadow: 0 0 10px #ccc; padding: 6px 15px;';

                let myChart = new echarts.init(this.$refs.chart7);
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

            // 日报数据
            getTableData(){
              request({
                  url: '/app-api/culturalTourism/hotel/houseAnalysisSummary?orgId='+this.orgId,
                  method: 'get',
              }).then(({data}) => {
                if (data.data && data.code === 0) {
                  let _data = data.data
                  this.tableData = _data.houseAnalysisSummaries;
                  this.daySumqty = _data.daySumqty?_data.daySumqty:'-';
                  this.monthDays = _data.monthDays?_data.monthDays:'-';
                  this.yearDays = _data.yearDays?_data.yearDays:'-';
                  this.lastYearMonthDays = _data.lastYearMonthDays?_data.lastYearMonthDays:'-'
                }else{
                  this.clearTableData()
                }
              }).catch((e) => {
                console.log('err', e); 
                this.clearTableData()
              })
            },
            clearTableData(){
              this.tableData=[];
              this.daySumqty='-';
              this.monthDays='-';
              this.yearDays='-';
              this.lastYearMonthDays='-'
            }
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
