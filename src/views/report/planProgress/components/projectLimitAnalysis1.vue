<template>
	<div class="detail-panel white-bg">
		<div class="main-content">

			<div class="data-content-panel">
				<!-- 标题 -->
				<div class="data-title-box data-title-line" style="margin-top: 0;">
					<span class="title">标准工期达成率</span>
				</div>

				<div class="huojv-costContract-chart-panel max" ref="chart1"></div>

				<!-- 拿地-修详规批复 -->
				<div class="data-title-box data-title-line" style="margin-top: 0;">
					<span class="title">拿地-修详规批复</span>
				</div>

				<el-table stripe
				          class="huo-list-table main-theme-table huojv-data-list" size="mini" highlight-current-row
				          :data="tableActiveData1">
					<el-table-column prop="projOrgName" label="项目名称" width="120" align="center">
                        <template slot-scope="scope">
                            <span :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.projectGUID,6)">{{scope.row.projOrgName}}</span>
                        </template>
                    </el-table-column>
					<el-table-column prop="duration" label="拿地-修详规(天)" align="center"></el-table-column>
					<el-table-column prop="adUserName" label="负责人" width="100" align="center"></el-table-column>
				</el-table>

				<div class="huojv-data-list-none mt-20" v-show="tableList1.length <= 0">没有更多了</div>
				<div class="huojv-data-list-more" v-show="tableList1.length >= 4" @click="goMore(1)">查看更多
					<van-icon name="arrow"/>
				</div>

				<!-- 拿地-施工证 -->
				<div class="data-title-box data-title-line">
					<span class="title">拿地-施工证</span>
				</div>

				<el-table stripe
				          class="huo-list-table main-theme-table huojv-data-list" size="mini" highlight-current-row
				          :data="tableActiveData2">
					<el-table-column prop="projOrgName" label="项目名称" width="120" align="center">
                        <template slot-scope="scope">
                            <span :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.projectGUID,6)">{{scope.row.projOrgName}}</span>
                        </template>
                    </el-table-column>
					<el-table-column prop="duration" label="拿地-施工证(天)" align="center"></el-table-column>
					<el-table-column prop="adUserName" label="负责人" width="100" align="center"></el-table-column>
				</el-table>

				<div class="huojv-data-list-none mt-20" v-show="tableList2.length <= 0">没有更多了</div>
				<div class="huojv-data-list-more" v-show="tableList2.length >= 4" @click="goMore(2)">查看更多
					<van-icon name="arrow"/>
				</div>

				<!-- 拿地-开放 -->
				<div class="data-title-box data-title-line">
					<span class="title">拿地-开放</span>
				</div>

				<el-table stripe
				          class="huo-list-table main-theme-table huojv-data-list" size="mini" highlight-current-row
				          :data="tableActiveData3">
					<el-table-column prop="projOrgName" label="项目名称" width="120" align="center">
                        <template slot-scope="scope">
                            <span :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.projectGUID,6)">{{scope.row.projOrgName}}</span>
                        </template>
                    </el-table-column>
					<el-table-column prop="duration" label="拿地-开放(天)" align="center"></el-table-column>
					<el-table-column prop="adUserName" label="负责人" width="100" align="center"></el-table-column>
				</el-table>

				<div class="huojv-data-list-none mt-20" v-show="tableList3.length <= 0">没有更多了</div>
				<div class="huojv-data-list-more" v-show="tableList3.length >= 4" @click="goMore(3)">查看更多
					<van-icon name="arrow"/>
				</div>

				<!-- 拿地-开盘 -->
				<div class="data-title-box data-title-line">
					<span class="title">拿地-开盘</span>
				</div>

				<el-table stripe
				          class="huo-list-table main-theme-table huojv-data-list" size="mini" highlight-current-row
				          :data="tableActiveData4">
					<el-table-column prop="projOrgName" label="项目名称" width="120" align="center">
                        <template slot-scope="scope">
                            <span :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.projectGUID,6)">{{scope.row.projOrgName}}</span>
                        </template>
                    </el-table-column>
					<el-table-column prop="duration" label="拿地-开盘(天)" align="center"></el-table-column>
					<el-table-column prop="adUserName" label="负责人" width="100" align="center"></el-table-column>
				</el-table>

				<div class="huojv-data-list-none mt-20" v-show="tableList4.length <= 0">没有更多了</div>
				<div class="huojv-data-list-more" v-show="tableList4.length >= 4" @click="goMore(4)">查看更多
					<van-icon name="arrow"/>
				</div>

				<!-- 拿地-现金流 -->
				<div class="data-title-box data-title-line">
					<span class="title">拿地-现金流</span>
				</div>

				<el-table stripe
				          class="huo-list-table main-theme-table huojv-data-list" size="mini" highlight-current-row
				          :data="tableActiveData5">
					<el-table-column prop="projOrgName" label="项目名称" width="120" align="center">
                        <template slot-scope="scope">
                            <span :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.projectGUID,6)">{{scope.row.projOrgName}}</span>
                        </template>
                    </el-table-column>
					<el-table-column prop="duration" label="拿地-现金流(天)" align="center"></el-table-column>
					<el-table-column prop="adUserName" label="负责人" width="100" align="center"></el-table-column>
				</el-table>

				<div class="huojv-data-list-none mt-20" v-show="tableList5.length <= 0">没有更多了</div>
				<div class="huojv-data-list-more" v-show="tableList5.length >= 4" @click="goMore(5)">查看更多
					<van-icon name="arrow"/>
				</div>

				<!-- 拿地-交付 -->
				<div class="data-title-box data-title-line">
					<span class="title">拿地-交付</span>
				</div>

				<el-table stripe
				          class="huo-list-table main-theme-table huojv-data-list" size="mini" highlight-current-row
				          :data="tableActiveData6">
					<el-table-column prop="projOrgName" label="项目名称" width="120" align="center">
                        <template slot-scope="scope">
                            <span :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.projectGUID,6)">{{scope.row.projOrgName}}</span>
                        </template>
                    </el-table-column>
					<el-table-column prop="duration" label="拿地-交付(天)" align="center"></el-table-column>
					<el-table-column prop="adUserName" label="负责人" width="100" align="center"></el-table-column>
				</el-table>

				<div class="huojv-data-list-none mt-20" v-show="tableList6.length <= 0">没有更多了</div>
				<div class="huojv-data-list-more" v-show="tableList6.length >= 4" @click="goMore(6)">查看更多
					<van-icon name="arrow"/>
				</div>
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
    import {getUrlParam, getNextMonths, jumpToPj} from '@/utils/common'

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
                        'left': '4%',
                        'right': '4%',
                        'bottom': '8%',
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

	            // 是否隐藏滑动手势
                hideGesture: {},
                tableActiveData1:[],
                tableList1:[], // 表格1
                tableActiveData2:[],
                tableList2:[], // 表格1
                tableActiveData3:[],
                tableList3:[], // 表格1
                tableActiveData4:[],
                tableList4:[], // 表格1
                tableActiveData5:[],
                tableList5:[], // 表格1
                tableActiveData6:[],
                tableList6:[], // 表格1
            };
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
            jumpToPj,
            init() {
                this.orgId = getUrlParam('chooseOrgId') || getUrlParam('orgId');
                this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType');

                this.getChartsData();
                this.getTableData1(1);
                this.getTableData1(2);
                this.getTableData1(3);
                this.getTableData1(4);
                this.getTableData1(5);
                this.getTableData1(6);
            },


	        // 获取图表数据
            getChartsData() {
                request({
                    url: `/app-api/plan/schedule/durationAnalysisHistogram`,
                    method: 'post',
                    data: {orgId: this.orgId}
                }).then(({data}) => {
                    if (data.code === 0 && data.data) {
                        this.drawChart(data.data);
                    }else{
                        this.drawChart([]);
                    }
                });
            },

	        // 绘制柱状图表
            drawChart(data) {
                let xAxisData = ['拿地-修详规批复','拿地-取得施工证','拿地-开放','拿地-开盘','拿地-现金流','拿地-交付'],
	                chartData1 = [
                        data.getLandToDetailPlanDurationArrate && data.getLandToDetailPlanDurationArrate.percentage,
                        data.getLandToConstructionDurationArrate && data.getLandToConstructionDurationArrate.percentage,
                        data.getLandToDemonstrationDurationArrate && data.getLandToDemonstrationDurationArrate.percentage,
                        data.getLandToBeginConstructionDurationArrate && data.getLandToBeginConstructionDurationArrate.percentage,
                        data.getLandToPositiveCashflowDurationArrate && data.getLandToPositiveCashflowDurationArrate.percentage,
                        data.getLandToDeliveryDurationArrate && data.getLandToDeliveryDurationArrate.percentage,
	                ],
	                chartData2 = [
                        data.getLandToDetailPlanDurationAvg,
                        data.getLandToConstructionDurationAvg,
                        data.getLandToDemonstrationDurationAvg,
                        data.getLandToBeginConstructionDurationAvg,
                        data.getLandToPositiveCashflowDurationAvg,
                        data.getLandToDeliveryDurationAvg,
	                ],
	                chartData3 = [
	                    data.getLandToDetailPlanDurationStd,
	                    data.getLandToConstructionDurationStd,
	                    data.getLandToDemonstrationDurationStd,
	                    data.getLandToBeginConstructionDurationStd,
	                    data.getLandToPositiveCashflowDurationStd,
	                    data.getLandToDeliveryDurationStd,
	                ];

                let series = [{
                    name: '周期',
                    type: 'bar',
                    barWidth: '15',
                    itemStyle: {
                        normal: {
                            color: '#006E38'
                        }
                    },
                    data: chartData1
                }];

                let legendData = series.map(item => {
                    return item.name;
                });

                let option = JSON.parse(JSON.stringify(this.chartOption));
                option.series = series;
                option.legend.data = legendData;
                option.legend.show = false;
                option.yAxis.min = 0;
                option.yAxis.max = 1.6;
                option.yAxis.scale = true;
                option.yAxis.splitNumber = 8;
                // option.yAxis.name = `单位：%`;
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
                    let showHtm = "<div>" + params[0].axisValueLabel + "</div><br>";
                    let index = xAxisData.indexOf(params[0].axisValueLabel);
                    for (let i = 0; i < params.length; i++) {

                        if(data.durationAnalysisHistogramVoMap){
                            for(var map in data.durationAnalysisHistogramVoMap){
                                let mapData1 = [
                                        data.durationAnalysisHistogramVoMap[map].getLandToDetailPlanDurationAvg,
                                        data.durationAnalysisHistogramVoMap[map].getLandToConstructionDurationAvg,
                                        data.durationAnalysisHistogramVoMap[map].getLandToDemonstrationDurationAvg,
                                        data.durationAnalysisHistogramVoMap[map].getLandToBeginConstructionDurationAvg,
                                        data.durationAnalysisHistogramVoMap[map].getLandToPositiveCashflowDurationAvg,
                                        data.durationAnalysisHistogramVoMap[map].getLandToDeliveryDurationAvg,
                                ],
	                                mapData2 = [
                                        data.durationAnalysisHistogramVoMap[map].getLandToDetailPlanDurationStd,
                                        data.durationAnalysisHistogramVoMap[map].getLandToConstructionDurationStd,
                                        data.durationAnalysisHistogramVoMap[map].getLandToDemonstrationDurationStd,
                                        data.durationAnalysisHistogramVoMap[map].getLandToBeginConstructionDurationStd,
                                        data.durationAnalysisHistogramVoMap[map].getLandToPositiveCashflowDurationStd,
                                        data.durationAnalysisHistogramVoMap[map].getLandToDeliveryDurationStd,
                                    ];

                                let value1 = '<div>标准工期：' + mapData2[index] + '天</div>';
                                let value2 = '<div>实际工期：' + mapData1[index] + '天</div>';
                                showHtm += '<div>'+ map +'：</div><div style="line-height: 16px;">' + value1 + '</div>' + '<div style="line-height: 16px;">' + value2 + '</div><br>';
                            }
                        }else{
                            let marker = params[i].marker;
                            let value1 = '<div>'+ marker +'标准工期：' + chartData3[index] + '天</div>';
                            let value2 = '<div>'+ marker +'实际工期：' + chartData2[index] + '天</div>';


                            showHtm += '<div style="line-height: 16px;">' + value1 + '</div>' + '<div style="line-height: 16px;">' + value2 + '</div>';
                        }
                        //名称
                        // let text = '<span class="chart-tooltip">' + params[i].seriesName + '：</span>';
                        //值
                        // let value = params[i].value + '%';

                    }

                    return showHtm;
                };

                option.xAxis.data = xAxisData;

                // x轴初始化只显示4个柱状图  超过4个滑动显示
                if (xAxisData.length > 6) {
                    option.dataZoom[0].endValue = xAxisData[5];
                } else {
                    option.dataZoom[0].endValue = xAxisData[xAxisData.length - 1];
                }
                option.dataZoom[0].startValue = xAxisData[0];
                this.$nextTick(() => {
                    let myChart = new echarts.init(this.$refs.chart1);
                    myChart.setOption(option, true);
                })
            },

            getTableData1(type){
                let durationTypeName = '拿地至修详规';
                switch (type) {
	                case 1:durationTypeName = '拿地至修详规批复';break;
	                case 2:durationTypeName = '拿地至施工证';break;
	                case 3:durationTypeName = '拿地至开放';break;
	                case 4:durationTypeName = '拿地至开盘';break;
	                case 5:durationTypeName = '拿地至现金流';break;
	                case 6:durationTypeName = '拿地至交付';break;
                }
                request({
                    url: `/app-api/plan/schedule/durationAnalysisDetail`,
                    method: 'post',
                    data:{orgId:this.orgId,current: 1, size: 4, durationTypeName}
                }).then(({ data }) => {
                    if (data.code === 0 && data.data) {
                        let list = data.data;

                        this['tableList'+type] = list;
                        if(list.length > 3){
                            this['tableActiveData'+type] = list.slice(0,3);
                        }else{
                            this['tableActiveData'+type] = list;
                        }
                    }
                }).catch((e) => {
                    console.log('designChangePie-err', e);
                });
            },

	        // 点击查看更多
            goMore(pageType) {
                sessionStorage.planTab3 = 1;
                this.$router.push({path: '/report/planProgress/moreProjectLimitAnalysis',
                    query: {
                        orgId: this.orgId,
                        orgType: this.orgType,
                        pageType,
                        token: getUrlParam('token')
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
