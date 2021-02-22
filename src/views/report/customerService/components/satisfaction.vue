<template>
	<div class="report-index">
		<div class="main-content" style="width: 100%;">
			<div class="data-content-panel no-top-left-radius clearfix" style="overflow: visible;">
				<!-- 标题 -->
				<div class="data-title-box data-title-line">
					<span class="title">客户满意度累计得分</span>
				</div>
				<div class="huojv-costContract-chart-panel max">
					<div style="width: 100%; height: 100%;" ref="chart1"></div>
					<div class="tag-text">
						<p>红色数值：<label class="red-color">行业标杆值</label></p>
						<p>黄色数值：<label class="yellow-color">行业均值</label></p>
					</div>
				</div>

				<!-- 标题 -->
				<div class="data-title-box data-title-line">
					<span class="title">再购意向和推荐意向得分</span>
				</div>
				<div class="huojv-costContract-chart-panel max">
					<div style="width: 100%; height: 100%;" ref="chart2"></div>
					<div class="tag-text" style="bottom: 10px;">
						<p>红色数值：<label class="red-color">行业标杆值</label></p>
						<p>黄色数值：<label class="yellow-color">行业均值</label></p>
					</div>
				</div>

				<!-- 标题 -->
				<div class="data-title-box data-title-line">
					<span class="title">产品及服务满意度得分</span>
				</div>
				<div class="huojv-costContract-chart-panel max">
					<div style="width: 100%; height: 100%;" ref="chart3"></div>
					<div class="tag-text" style="bottom: 10px;">
						<p>红色数值：<label class="red-color">行业标杆值</label></p>
						<p>黄色数值：<label class="yellow-color">行业均值</label></p>
					</div>
				</div>

				<!-- 标题 -->
				<div v-show="orgType <= 5">
					<div class="data-title-box data-title-line">
						<span class="title">总体满意度行业对标及区域得分情况</span>
					</div>
					<div class="huojv-costContract-chart-panel">
						<div style="width: 100%; height: 100%;" ref="chart4"></div>
						<div class="tag-text text-center width100" style="bottom: 10px; top: unset;">
							<p class="chart-legend-line red"><label>行业标杆值</label></p>
							<p class="chart-legend-line yellow"><label>行业均值</label></p>
						</div>
					</div>
				</div>


				<!-- 标题 -->
				<div class="data-title-box data-title-line">
					<span class="title">项目满意度得分排名</span>
				</div>
				<!-- 准业主 磨合期、稳定期、老业主切换 -->
				<div class="text-center">
					<ul class="huojv-tab-bars_1 four-cols" style="margin-bottom: 0;">
						<li @click="checkTab1(1)" v-eventlisten="{isChangePage:false,pageEvent:'点击准业主'}" :class="[tab1 == 1 ? 'active' : '']">准业主</li>
						<li @click="checkTab1(2)" v-eventlisten="{isChangePage:false,pageEvent:'点击磨合期'}" :class="[tab1 == 2 ? 'active' : '']">磨合期</li>
						<li @click="checkTab1(3)" v-eventlisten="{isChangePage:false,pageEvent:'点击稳定期'}" :class="[tab1 == 3 ? 'active' : '']">稳定期</li>
						<li @click="checkTab1(4)" v-eventlisten="{isChangePage:false,pageEvent:'点击老业主'}" :class="[tab1 == 4 ? 'active' : '']">老业主</li>
					</ul>
				</div>
				<div class="mt-15">
					<el-table stripe
					          class="huo-list-table main-theme-table " size="mini" highlight-current-row
					          :data="tableActiveData1">
						<el-table-column type="index" label="序号" width="50"></el-table-column>
						<el-table-column prop="orgName" label="项目名称" width="80" align="center">
                              <template slot-scope="scope">
                                <span :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.projectGUID,scope.row.orgType)">{{scope.row.orgName}}</span>
                            </template>
                        </el-table-column>
						<el-table-column prop="satisfactionScore" label="得分" width="70" align="center">
							<template slot="header" slot-scope="scope">
								<div @click="sortData('satisfactionScore','ASC')">
									<span>得分</span>
									<label class="table-sort-ico">
										<i :class="[sortColumn == 'satisfactionScore' && sortType === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
										<i :class="[sortColumn == 'satisfactionScore' && sortType === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
									</label>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="compareTargeScore" label="与军令状目标差值" width="80" align="center">
							<template slot="header" slot-scope="scope">
								<div @click="sortData('compareTargeScore','ASC')">
									<span>与军令状目标差值</span>
									<label class="table-sort-ico">
										<i :class="[sortColumn == 'compareTargeScore' && sortType === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
										<i :class="[sortColumn == 'compareTargeScore' && sortType === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
									</label>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="adUserName" label="负责人" align="center"></el-table-column>
					</el-table>
					<div class="toggleBox" v-if="tableData1.length > 8">
						<span class="more" @click="goMore()">查看更多 <i class="el-icon-arrow-right"></i></span>
					</div>
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
    } from 'vant';
    import {getLocalStorage} from '@/utils/local-storage';
    import request from '@/utils/request';
    import echarts from 'echarts'
    import $ from 'jquery'
    import {handleNum2String, getAbsoluteVal, getUrlParam, jumpToPj} from '@/utils/common'


    export default {
        mixins: [scrollFixed],
        data() {
            return {
                isLoading: false,
                orgId:this.chooseOrgId,
                orgType: '',
                unit: '',
                chartOption: {
                    tooltip: {
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
                        icon: 'circle',
                        itemWidth: 10,
                        itemHeight: 10,
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

                showGesture1:1,
	            tab1:1, // tab切换
                tableActiveData1:[],
                tableData1:[],  // 表格数据
                sortColumn:'satisfactionScore',
	            sortType: 'ASC'
            }
        },
        props: ["chooseOrgId"],
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
            jumpToPj,
            reloadWindow() {
                setTimeout(() => {
                    window.location.reload();
                    this.isLoading = false;
                }, 500)
            },

            init(){
                this.orgId = getUrlParam('chooseOrgId') || getUrlParam('orgId') || getLocalStorage('orgId').orgId;
                this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType;
                this.unit = this.orgType <=5 ? '亿':'万';

                this.getChartData1();
                this.getChartData2();
                this.getChartData3();
                this.getChartData4();
                this.getTableData1();
            },

            closeGesture(index){
                this['showGesture' + index] = 0;
            },

	        // 获取客户满意度累计得分
            getChartData1(){
                request({
                    url: `/app-api/custonService/satisfactionScoreForOrg`,
                    method: 'get',
                    params: {orgId: this.orgId}
                }).then(({data}) => {
                    if (data.code === 0 && data.data) {
                        this.drawChart1(data.data)
                    }else{
                        this.drawChart1([])
                    }
                });
            },

	        // 绘制客户满意度累计得分柱状图
            drawChart1(data){
                let xAxisData = ['总体','准业主','磨合期','稳定期','老业主','物业服务'];
                let xAxisDataValue = [];
                let chartData = [];
                let chartDataBak = [];
                let series = [];

                let colors = ['#96C390','#006E38','#E58989','#A63535','#8FAADB','#4472C4'];

                // 组织机构循环  包含物业服务
                data.forEach((item,index) => {
                    // 每一个组织机构有两年的数据  每一组数据包含总体~物业服务6个数据  默认值为0
                    chartData.push(new Array(6).fill(null));
                    chartData.push(new Array(6).fill(null));
                    chartDataBak.push(new Array(6).fill(null));
                    chartDataBak.push(new Array(6).fill(null));

                    // 年份循环
                    item.satisfactionScore.forEach((item1,index1) => {

                        // 类型循环
                        item1.satisfactionScore.forEach((item2,index2) => {
                            // 只统计总体~老业主的数据
                            if(item2.customerType <= 5){
                                let i = parseInt(item2.customerType);
                                // 如果数组不存在  创建一个长度为2的新数组
                                if(!xAxisDataValue[i]){
                                    xAxisDataValue[i] = new Array(2).fill(null);
                                }
                                if(item1.orgGroup == '地产' && i < 5){
                                    xAxisDataValue[i][0] = parseFloat(item2.postSatisfactionScore);
                                    xAxisDataValue[i][1] = parseFloat(item2.avgSatisfactionScore);
                                }else if(i == 5){
                                    xAxisDataValue[i][0] = parseFloat(item2.postSatisfactionScore);
                                    xAxisDataValue[i][1] = parseFloat(item2.avgSatisfactionScore);
                                }

                                // 表示最近一年 减去 去年的值  todo 这里这么做主要是因为柱状图通过stack来做的  所以这里需要计算差值
                                // if(index1 % 2 != 0){
                                //     chartData[index * 2 + index1][i] = (parseFloat(item2.satisfactionScore) - chartData[index * 2 + index1 - 1][i]) < 0 ? 0 : (parseFloat(item2.satisfactionScore) - chartData[index * 2 + index1 - 1][i]);
                                //     chartDataBak[index * 2 + index1][i] = parseFloat(item2.satisfactionScore) - chartDataBak[index * 2 + index1 - 1][i];
                                // }else{
                                //     chartData[index * 2 + index1][i] = parseFloat(item2.satisfactionScore);
                                //     chartDataBak[index * 2 + index1][i] = parseFloat(item2.satisfactionScore);
                                // }

                                chartData[index * 2 + index1][i] = parseFloat(item2.satisfactionScore);
                            }
                        })

                        // 非物业服务数据
                        if(index < data.length - 1){
                            let color = '';
                            if(item1.satisfactionScore.length){
                                if(item1.orgGroup){
                                    if(item1.orgGroup == '地产'){
                                        color = colors[index1 % 2];
                                    }else if(item1.orgGroup == '商业'){
                                        color = colors[2 + index1 % 2];
                                    }
                                }else {
                                    if(item1.satisfactionScore[0].orgName.indexOf('地产') >= 0){
                                        color = colors[index1 % 2];
                                    }else if(item1.satisfactionScore[0].orgName.indexOf('商业') >= 0){
                                        color = colors[2 + index1 % 2];
                                    }
                                }
                            }
                            series.push({
                                name: item.orgName + item1.year,
                                type: 'bar',
                                barWidth: '15',
                                barGap:0,
                                // stack:item.orgName,
                                itemStyle: {
                                    normal: {
                                        color: color
                                    }
                                },
                                label: {
                                    show: true,
                                    position: 'inside',
                                    formatter: function (params) {
                                        // if(index1 % 2 == 0){
                                            if (params.value == 0) {
                                                return '';
                                            } else {
                                                return params.value;
                                            }
                                        // }else{
                                        //     if(params.value == 0 && chartData[params.componentIndex - 1][params.dataIndex] === null){
                                        //         return ''
                                        //     }
                                        //     if(chartDataBak[params.componentIndex][params.dataIndex] < 0){
                                        //         return chartDataBak[params.componentIndex][params.dataIndex] + chartData[params.componentIndex - 1][params.dataIndex];
                                        //     }
                                        //     return params.value + chartData[params.componentIndex - 1][params.dataIndex];
                                        // }

                                    }
                                },
                                data: chartData[index * 2 + index1]
                            })
                        }else{
                            series.push({
                                name: '物业服务' + item1.year,
                                type: 'bar',
                                barWidth: '15',
                                // stack:'物业服务',
                                itemStyle: {
                                    normal: {
                                        color: colors[4 + index1 % 2]
                                    }
                                },
                                label: {
                                    show: true,
                                    position: 'inside',
                                    formatter: function (params) {
                                        // if(index1 % 2 == 0){
                                            if (params.value == 0) {
                                                return '';
                                            } else {
                                                return params.value;
                                            }
                                        // }else{
                                        //     if(params.value == 0 && chartData[params.componentIndex - 1][params.dataIndex] === null){
                                        //         return ''
                                        //     }
                                        //     if(chartDataBak[params.componentIndex][params.dataIndex] < 0){
                                        //         return chartDataBak[params.componentIndex][params.dataIndex] + chartData[params.componentIndex - 1][params.dataIndex];
                                        //     }
                                        //     return params.value + chartData[params.componentIndex - 1][params.dataIndex];
                                        // }

                                    }
                                },
                                data: chartData[index * 2 + index1]
                            })
                        }
                    })

                })

                let legendData = series.map(item => {
                    return item.name;
                });

                let option = JSON.parse(JSON.stringify(this.chartOption));
                option.series = series;
                // 是否显示 暂无数据
                let hasData = false;
                series.forEach(item => {
                    if(item.data.length > 0){
                        hasData = true;
                    }
                })
                if(!hasData){
                    option.title.show = true;
                }

                option.xAxis.axisLabel.formatter = (params) => {
                    let index = xAxisData.indexOf(params);
                    if(!xAxisDataValue.length || !xAxisDataValue[index] || xAxisDataValue[index][0] === null && xAxisDataValue[index][1] === null){
                        return '{a|}{b|}';
                    }
                    return params + '({a|'+ xAxisDataValue[index][0] +'},{b|'+ xAxisDataValue[index][1] +'})'
                };

                option.legend.data = legendData;
                // option.legend.formatter = (params) => {
                //     if(params.length > 8){
                //         return params.substr(0,8) + '\n' + params.substring(8);
                //     }
                //     return params;
                // }
                // option.grid.bottom = '25%';
                // option.title.text = '';
                // option.yAxis.name = this.tab3 == 1 ? '单位('+ this.costUnit +')' : '单位('+ this.areaUnit +')';
                option.tooltip.formatter = (params) => {
                    let showHtm = "<div>" + params[0].axisValueLabel + "</div><br/>";

                    let index = xAxisData.indexOf(params[0].axisValueLabel);
                    showHtm += '<div>行业标杆值:<label style="color: #FE0909; margin-left: 10px;">'+ xAxisDataValue[index][0] +'</label></div>';
                    showHtm += '<div>行业均值:<label style="color: #FFC200; margin-left: 10px;">'+ xAxisDataValue[index][1] +'</label></div>';
                    let valueHtml = '';
                    for (let i = 0; i < params.length; i++) {
                        //名称
                        let text = '<span class="chart-tooltip">' + params[i].seriesName + '：</span>';
                        //值
                        let value = params[i].value;
                        // 如果为奇数列
                        // if(i % 2 != 0){
                        //     if(chartDataBak[i][params[i].dataIndex] < 0){
                        //         value = chartDataBak[i][params[i].dataIndex] + params[i-1].value;
                        //     }else{
                        //         value = params[i].value + params[i-1].value;
                        //     }
						//
                        // }

                        if(value === undefined || value === null || isNaN(value)){
                            valueHtml += '';
                            continue;
                        }
                        let marker = params[i].marker;

                        valueHtml += '<div style="line-height: 16px;">' +marker + text + value + '</div>';
                    }

                    if(valueHtml){
                        return showHtm + valueHtml;
                    }else{
                        return '';
                    }

                }
                // option.tooltip.formatter = '{b} <br/>{a0} ： {c0} 个<br/>{a1} ： {c1} 个<br/>{a2} ： {c2} 个';
                if(xAxisData.length <= 3){
                    option.xAxis.axisLabel.rotate = 0;
                }
                option.xAxis.data = xAxisData;
                if (xAxisData.length > 3) {
                    option.dataZoom[0].endValue = xAxisData[2];
                } else {
                    option.dataZoom[0].endValue = xAxisData[xAxisData.length - 1];
                }
                option.dataZoom[0].startValue = xAxisData[0];

                let myChart = new echarts.init(this.$refs.chart1);
                myChart.setOption(option, true);
            },

	        // 获取再购意向及推荐意向得分--柱状图数据
            getChartData2(){
                request({
                    url: `/app-api/custonService/satisfactionScoreForByAgainAndShare`,
                    method: 'get',
                    params: {orgId: this.orgId}
                }).then(({data}) => {
                    if (data.code === 0 && data.data) {
                        this.drawChart2(data.data)
                    }else{
                        this.drawChart2([])
                    }
                });
            },

	        // 绘制再购意向及推荐意向得分--柱状图
            drawChart2(data){
                let xAxisData = ['再购意向','推荐意向'];
                let xAxisDataValue = [];
                let chartData = [];
                let chartDataBak = [];

                let colors = ['#96C390','#006E38','#E58989','#A63535','#8FAADB','#4472C4'];
                let series = [];

                // 组织机构循环  包含物业服务
                data.forEach((item,index) => {
                    // 每一个组织机构有两年的数据  每一组数据包含再购意向和推荐意向2个数据  默认值为null
                    chartData.push(new Array(2).fill(null));
                    chartData.push(new Array(2).fill(null));
                    chartDataBak.push(new Array(2).fill(null));
                    chartDataBak.push(new Array(2).fill(null));

                    // 年份循环
                    item.satisfactionScore.forEach((item1,index1) => {

                        // 类型循环
                        item1.satisfactionScore.forEach((item2,index2) => {
                            // 只统计再购意向和推荐意向的数据
                            if(item2.customerType == 6 || item2.customerType == 7){
                                let i = parseInt(item2.customerType) - 6;  // 数组的index从0开始  为什么不用index2 ，主要是以防返回的数据顺序错乱
                                // 如果数组不存在  创建一个长度为2的新数组
                                if(!xAxisDataValue[i]){
                                    xAxisDataValue[i] = new Array(2).fill(null);
                                }
                                if(item1.orgGroup == '地产'){
                                    xAxisDataValue[i][0] = parseFloat(item2.postSatisfactionScore);
                                    xAxisDataValue[i][1] = parseFloat(item2.avgSatisfactionScore);
                                }

                                // 表示最近一年 减去 去年的值  todo 这里这么做主要是因为柱状图通过stack来做的  所以这里需要计算差值
                                // if(index1 % 2 != 0){
                                //     chartData[index * 2 + index1][i] = (parseFloat(item2.satisfactionScore) - chartData[index * 2 + index1 - 1][i]) < 0 ? 0 : (parseFloat(item2.satisfactionScore) - chartData[index * 2 + index1 - 1][i]);
                                //     chartDataBak[index * 2 + index1][i] = parseFloat(item2.satisfactionScore) - chartDataBak[index * 2 + index1 - 1][i];
                                // }else{
                                //     chartData[index * 2 + index1][i] = parseFloat(item2.satisfactionScore);
                                //     chartDataBak[index * 2 + index1][i] = parseFloat(item2.satisfactionScore);
                                // }
                                chartData[index * 2 + index1][i] = parseFloat(item2.satisfactionScore);
                            }
                        })

	                    let color = '';
                        if(item1.satisfactionScore.length){
                            if(item1.orgGroup){
                                if(item1.orgGroup == '地产'){
                                    color = colors[index1 % 2];
                                }else if(item1.orgGroup == '商业'){
                                    color = colors[2 + index1 % 2];
                                }
                            }else {
                                if(item1.satisfactionScore[0].orgName.indexOf('地产') >= 0){
                                    color = colors[index1 % 2];
                                }else if(item1.satisfactionScore[0].orgName.indexOf('商业') >= 0){
                                    color = colors[2 + index1 % 2];
                                }
                            }
                        }

                        series.push({
                            name: item.orgName + item1.year,
                            type: 'bar',
                            barWidth: '20',
                            barGap:0,
                            // stack:item.orgName,
                            itemStyle: {
                                normal: {
                                    color: color
                                }
                            },
                            label: {
                                show: true,
                                position: 'inside',
                                formatter: function (params) {
                                    // if(index1 % 2 == 0){
                                        if (params.value == 0) {
                                            return '';
                                        } else {
                                            return params.value;
                                        }
                                    // }else{
                                    //     if(params.value === 0 && chartData[params.componentIndex - 1][params.dataIndex] === null){
                                    //         return ''
                                    //     }
                                    //     if(chartDataBak[params.componentIndex][params.dataIndex] < 0){
                                    //         return chartDataBak[params.componentIndex][params.dataIndex] + chartData[params.componentIndex - 1][params.dataIndex];
                                    //     }
                                    //     return params.value + chartData[params.componentIndex - 1][params.dataIndex];
                                    // }

                                }
                            },
                            data: chartData[index * 2 + index1]
                        })

                    })

                })

                let legendData = series.map(item => {
                    return item.name;
                });

                let option = JSON.parse(JSON.stringify(this.chartOption));
                option.series = series;
                // 是否显示 暂无数据
                let hasData = false;
                series.forEach(item => {
                    if(item.data.length > 0){
                        hasData = true;
                    }
                })
                if(!hasData){
                    option.title.show = true;
                }

                option.xAxis.axisLabel.formatter = (params) => {
                    let index = xAxisData.indexOf(params);
                    if(!xAxisDataValue.length || !xAxisDataValue[index] || xAxisDataValue[index][0] === null && xAxisDataValue[index][1] === null){
                        return '{a|}{b|}';
                    }
                    return params + '({a|'+ xAxisDataValue[index][0] +'},{b|'+ xAxisDataValue[index][1] +'})'
                };

                option.legend.data = legendData;
                option.legend.formatter = (params) => {
                    if(params.length > 8){
                        return params.substr(0,8) + '\n' + params.substring(8);
                    }
                    return params;
                }
                // option.grid.bottom = '20%';
                // option.title.text = '';
                // option.yAxis.name = this.tab3 == 1 ? '单位('+ this.costUnit +')' : '单位('+ this.areaUnit +')';
                option.tooltip.formatter = (params) => {
                    let showHtm = "<div>" + params[0].axisValueLabel + "</div><br/>";
                    let index = xAxisData.indexOf(params[0].axisValueLabel);
                    showHtm += '<div>行业标杆值:<label style="color: #FE0909; margin-left: 10px;">'+ xAxisDataValue[index][0] +'</label></div>';
                    showHtm += '<div>行业均值:<label style="color: #FFC200; margin-left: 10px;">'+ xAxisDataValue[index][1] +'</label></div>';
                    let valueHtml = '';
                    for (let i = 0; i < params.length; i++) {
                        //名称
                        let text = '<span class="chart-tooltip">' + params[i].seriesName + '：</span>';
                        //值
                        let value = params[i].value;
                        // 如果为奇数列
                        // if(i % 2 != 0){
                        //     if(chartDataBak[i][params[i].dataIndex] < 0){
                        //         value = chartDataBak[i][params[i].dataIndex] + params[i-1].value;
                        //     }else{
                        //         value = params[i].value + params[i-1].value;
                        //     }
                        // }

                        if(value === undefined || value === null || isNaN(value)){
                            valueHtml += '';
                            continue;
                        }
                        let marker = params[i].marker;

                        valueHtml += '<div style="line-height: 16px;">' +marker + text + value + '</div>';
                    }

                    if(valueHtml){
                        return showHtm + valueHtml;
                    }else{
                        return '';
                    }

                }
                // option.tooltip.formatter = '{b} <br/>{a0} ： {c0} 个<br/>{a1} ： {c1} 个<br/>{a2} ： {c2} 个';
                // if(xAxisData.length <= 3){
                //     option.xAxis.axisLabel.rotate = 0;
                // }
                option.xAxis.data = xAxisData;
                if (xAxisData.length > 4) {
                    option.dataZoom[0].endValue = xAxisData[3];
                } else {
                    option.dataZoom[0].endValue = xAxisData[xAxisData.length - 1];
                }
                option.dataZoom[0].startValue = xAxisData[0];

                let myChart = new echarts.init(this.$refs.chart2);
                myChart.setOption(option, true);
            },

            // 获取产品及服务满意度得分--柱状图数据
            getChartData3(){
                request({
                    url: `/app-api/custonService/productSatisfactionScore`,
                    method: 'get',
                    params: {orgId: this.orgId}
                }).then(({data}) => {
                    if (data.code === 0 && data.data) {
                        this.drawChart3(data.data)
                    }else{
                        this.drawChart3([])
                    }
                });
            },

	        // 绘制产品及服务满意度得分--柱状图
            drawChart3(data){
                // let xAxisData = ['房屋设计','园林绿化','区内规划和公共区域设施','房屋质量','','销售服务','签约后的沟通和服务','交付服务','维修服务','物业服务','投诉处理','','物有所值感'];
                // let xAxisDataValue = [[94,78],[90,20],[90,20],[90,20],['',''],[90,20],[90,20],[90,20],[90,20],[90,20],[90,20],['',''],[90,20]];
                // let chartData = [[85,80,85,80,0,85,80,85,80,85,80,0,85],[85,80,85,80,0,85,80,85,80,85,80,0,85]];
				let xAxisData = [];
	            let colors = ['#006E38','#A63535'];

	            // 初始化X轴
                if(data.length > 0){
                    data[0].productSatisfactionScoreList.forEach((item1,index) => {
                        xAxisData.push(item1.productType);
                        if(index == 3 || index == 9){
                            xAxisData.push('');
                        }
                    });
                }

                let xAxisDataValue = new Array(xAxisData.length), chartData = [], series = [];
                for(let i = 0; i < xAxisDataValue.length; i++){
                    xAxisDataValue[i] = [null,null]
                }

                data.forEach((item,index) => {
                    chartData.push(new Array(xAxisData.length).fill(0));
                    item.productSatisfactionScoreList.forEach((item1) => {
                        let i = xAxisData.indexOf(item1.productType);

                        if(i >= 0){
                            if(item.orgGroup === '地产'){
                                xAxisDataValue[i][0] = parseFloat(item1.postSatisfactionScore || 0);
                                xAxisDataValue[i][1] = parseFloat(item1.avgSatisfactionScore || 0);
                            }
                            chartData[index][i] = item1.satisfactionScore || 0;
                        }
                    })

	                let color = '';
                    if(item.productSatisfactionScoreList.length){
                        color = item.productSatisfactionScoreList[0].orgGroup == '地产' ? colors[0] : colors[1];
                    }
	                series.push({
                        name: item.orgName,
                        type: 'bar',
                        barWidth: '20',
                        itemStyle: {
                            normal: {
                                color: color
                            }
                        },
                        label: {
                            show: true,
                            position: 'inside',
                            formatter: function (params) {
                                if (params.value == 0) {
                                    return '';
                                } else {
                                    return params.value;
                                }
                            }
                        },
                        data: chartData[index]
                    })
                })

                let legendData = series.map(item => {
                    return item.name;
                });

                let option = JSON.parse(JSON.stringify(this.chartOption));
                option.series = series;
                // 是否显示 暂无数据
                let hasData = false;
                series.forEach(item => {
                    if(item.data.length > 0){
                        hasData = true;
                    }
                })
                if(!hasData){
                    option.title.show = true;
                }

                option.xAxis.axisLabel.formatter = (params) => {
                    let index = xAxisData.indexOf(params);
                    if(!xAxisDataValue.length || !xAxisDataValue[index] || xAxisDataValue[index][0] === null && xAxisDataValue[index][1] === null){
                        return '{a|}{b|}';
                    }
                    return params + '({a|'+ xAxisDataValue[index][0] +'},{b|'+ xAxisDataValue[index][1] +'})'
                };

                option.legend.data = legendData;
                // option.legend.width = 50;
                option.legend.formatter = (params) => {
                    if(params.length > 8){
                        return params.substr(0,8) + '\n' + params.substring(8);
                    }
                    return params;
                }
                // option.grid.bottom = '18%';
                // option.title.text = '';
                // option.yAxis.name = this.tab3 == 1 ? '单位('+ this.costUnit +')' : '单位('+ this.areaUnit +')';
                option.tooltip.formatter = (params) => {
                    let showHtm = "<div>" + params[0].axisValueLabel + "</div><br/>";
                    let index = xAxisData.indexOf(params[0].axisValueLabel);
                    showHtm += '<div>行业标杆值:<label style="color: #FE0909; margin-left: 10px;">'+ xAxisDataValue[index][0] +'</label></div>';
                    showHtm += '<div>行业均值:<label style="color: #FFC200; margin-left: 10px;">'+ xAxisDataValue[index][1] +'</label></div>';
                    let valueHtml = '';
                    for (let i = 0; i < params.length; i++) {
                        //名称
                        let text = '<span class="chart-tooltip">' + params[i].seriesName + '：</span>';
                        //值
                        let value = params[i].value;

                        let marker = params[i].marker;

                        if(value === undefined || value === null || isNaN(value) || !params[i].axisValue){
                            valueHtml += '';
                            continue;
                        }

                        valueHtml += '<div style="line-height: 16px;">' +marker + text + value + '</div>';
                    }

                    if(valueHtml){
                        return showHtm + valueHtml;
                    }else{
                        return '';
                    }

                }
                // option.tooltip.formatter = '{b} <br/>{a0} ： {c0} 个<br/>{a1} ： {c1} 个<br/>{a2} ： {c2} 个';
                // if(xAxisData.length <= 3){
                //     option.xAxis.axisLabel.rotate = 0;
                // }
                option.xAxis.data = xAxisData;
                if (xAxisData.length > 4) {
                    option.dataZoom[0].endValue = xAxisData[3];
                } else {
                    option.dataZoom[0].endValue = xAxisData[xAxisData.length - 1];
                }
                option.dataZoom[0].startValue = xAxisData[0];

                let myChart = new echarts.init(this.$refs.chart3);
                myChart.setOption(option, true);
            },

            // 获取产品及服务满意度得分--柱状图数据
            getChartData4(){
                request({
                    url: `/app-api/custonService/satisfactionScoreTotalList`,
                    method: 'get',
                    params: {orgId: this.orgId}
                }).then(({data}) => {
                    if (data.code === 0 && data.data) {
                        this.drawChart4(data.data)
                    }else{
                        this.drawChart4([])
                    }
                });
            },

            drawChart4(data){
                let xAxisData = [];
                let chartData = [];
                let avg1 = 0;
                let avg2 = 0;
                let max = 0;  // 最大值

                let colors = ['#006E38','#A63535','#B4A36B'];

                avg1 = data[0].postSatisfactionScore;
                avg2 = data[0].avgSatisfactionScore;
                data.forEach((item,index) => {
                    xAxisData.push(item.orgName);
                    chartData.push(item.satisfactionScore);
                    if(parseFloat(item.satisfactionScore) > max){
                        max = parseFloat(item.satisfactionScore);
                    }
                    // 如果是一级集团 则在第三个加空格  其它组织机构在第一个后面加空格
                    if(this.orgType <= 2 && index == 2 || this.orgType > 2 && index == 0){
                        xAxisData.push('');
                        chartData.push(0);
                    }
                })

                let series = [{
                    name: '得分',
                    type: 'bar',
                    barWidth: '20',
                    itemStyle: {
                        normal: {
                            color: (params) => {
                                if(params.name){
                                    let chart = data.filter(item => {
                                        return item.orgName == params.name;
                                    })[0];
                                    let index = chart.orgGroup == '集团' ? 2 : (chart.orgGroup == '地产' ? 0 : 1);
                                    return colors[index];
                                }
                            }
	                        // color:colors[0]
                        }
                    },
                    markLine: {
                        symbol: "none",
                        data: [
                            {
                                type: 'average',
                                name: '',
                                lineStyle: {
                                    width: 1,
                                    color: "#FE0909"
                                },
                                label: {
                                    fontSize: 11,
                                    lineHeight: 15,
                                    color: '#666666',
                                    position: 'insideEndTop',
                                    formatter: '{r1|{c}}',
                                    // backgroundColor: '#fff',
                                    padding:[-7,0],
                                    // shadowColor: '#006E38',
                                    shadowColor: '#3ab779',
                                    borderRadius: 3,
                                    shadowBlur: 1,
                                    shadowOffsetY: 0,
                                    rich:{
                                        r1: {
                                            color: '#FE0909'
                                        },
                                    }
                                },
                                // yAxis: (middle/data.length).toFixed(2)
                                yAxis: avg1
                            },
                            {
                                type: 'average',
                                name: '',
                                lineStyle: {
                                    width: 1,
                                    color: "#FFC40F"
                                },
                                label: {
                                    fontSize: 11,
                                    lineHeight: 15,
                                    color: '#666666',
                                    position: 'insideEndTop',
                                    formatter: '{r1|{c}}',
                                    // backgroundColor: '#fff',
                                    padding:[-7,0],
                                    // shadowColor: '#006E38',
                                    shadowColor: '#3ab779',
                                    borderRadius: 3,
                                    shadowBlur: 1,
                                    shadowOffsetY: 0,
                                    rich:{
                                        r1: {
                                            color: '#FFC40F'
                                        },
                                    }
                                },
                                // yAxis: (middle/data.length).toFixed(2)
                                yAxis: avg2
                            },
                        ]
                    },
                    label: {
                        show: true,
                        position: 'inside',
                        formatter: function (params) {
                            if (params.value == 0) {
                                return '';
                            } else {
                                return params.value;
                            }
                        }
                    },
                    data: chartData
                }];

                let legendData = series.map(item => {
                    return item.name;
                });

                let option = JSON.parse(JSON.stringify(this.chartOption));
                option.series = series;
                // 是否显示 暂无数据
                let hasData = false;
                series.forEach(item => {
                    if(item.data.length > 0){
                        hasData = true;
                    }
                })
                if(!hasData){
                    option.title.show = true;
                }

                delete option.xAxis.axisLabel.rich;
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

                option.yAxis.max = max > 95 ? 100 : (parseFloat(max) > avg1 ? parseFloat(max) : parseFloat(avg1)) + 5;
                option.legend.data = legendData;
                option.legend.show = false;
                option.grid.bottom = '10%';
                option.grid.top = '10%';
                // option.title.text = '';
                // option.yAxis.name = this.tab3 == 1 ? '单位('+ this.costUnit +')' : '单位('+ this.areaUnit +')';
                option.tooltip.formatter = (params) => {
                    let showHtm = "<div>" + params[0].axisValueLabel + "</div><br/>";

                    showHtm += '<div>行业标杆值:<label style="color: #FE0909; margin-left: 10px;">'+ avg1 +'</label></div>';
                    showHtm += '<div>行业均值:<label style="color: #FFC200; margin-left: 10px;">'+ avg2 +'</label></div>';
                    let valueHtml = '';
                    for (let i = 0; i < params.length; i++) {
                        //名称
                        let text = '<span class="chart-tooltip">' + params[i].seriesName + '：</span>';
                        //值
                        let value = params[i].value;

                        let marker = params[i].marker;

                        if(value === undefined || value === null || isNaN(value)){
                            valueHtml += '';
                            continue;
                        }

                        valueHtml += '<div style="line-height: 16px;">' +marker + text + value + '</div>';
                    }

                    if(valueHtml){
                        return showHtm + valueHtml;
                    }else{
                        return '';
                    }

                }
                // option.tooltip.formatter = '{b} <br/>{a0} ： {c0} 个<br/>{a1} ： {c1} 个<br/>{a2} ： {c2} 个';
                // if(xAxisData.length <= 3){
                //     option.xAxis.axisLabel.rotate = 0;
                // }
                option.xAxis.data = xAxisData;
                if (xAxisData.length > 6) {
                    option.dataZoom[0].endValue = xAxisData[5];
                } else {
                    option.dataZoom[0].endValue = xAxisData[xAxisData.length - 1];
                }
                option.dataZoom[0].startValue = xAxisData[0];

                let myChart = new echarts.init(this.$refs.chart4);
                myChart.setOption(option, true);
            },

	        // 切换tab
            checkTab1(tab1){
                this.tab1 = tab1;
                this.getTableData1();
            },

            getTableData1() {
                request({
                    url: `/app-api/custonService/satisfactionScoreRank`,
                    method: 'get',
                    params:{
                        orgId: this.orgId,
                        current:1,
                        size:10,
                        sortColumn:this.sortColumn,
                        sortType:this.sortType,
                        customerType:this.tab1
                    }
                }).then(({data}) => {
                    if (data.code === 0 && data.data && data.data.records) {
                        let list = data.data.records;

                        this.tableData1 = list;
                        if(list.length > 8){
                            this.tableActiveData1 = list.slice(0,8);
                        }else{
                            this.tableActiveData1 = list;
                        }
                    }
                }).catch((e) => {
                    console.log('getBoardData-err', e);
                });
            },

            // 点击表头排序
            sortData(sortColumn,type){
                if(this['sortColumn'] != sortColumn){
                    this['sortColumn'] = sortColumn;
                    this.sortType = type || 'DESC';
                }else{
                    this['sortType'] = (this['sortType'] == 'ASC' ? 'DESC' : 'ASC');
                }


                this.getTableData1();
            },

            goMore(){
                this.$router.push({
                    path: '/report/customerService/moreSatisfaction',
                    query: {token: getUrlParam('token'), orgId: this.orgId, orgType: this.orgType, tab: this.tab1}
                });
            },
        },
        components: {
            [List.name]: List,
            [PullRefresh.name]: PullRefresh,
        }
    };
</script>


<style lang="scss" scoped>
	.boxTitle{
		font-size: 16px;
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
