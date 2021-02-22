<template>
	<div class="detail-panel white-bg">
		<div class="main-content">

			<div class="data-content-panel" v-if="orgType<=5" key="1">
				<!-- 标题 -->
				<div class="data-title-box data-title-line" style="margin-top: 0;">
					<span class="title">运营节点按期完成率</span>
				</div>

				<div class="huojv-costContract-chart-panel max" ref="chart1"></div>

				<!-- 拿地-修详规批复 -->
				<div class="data-title-box data-title-line" style="margin-top: 0;">
					<span class="title">设计节点逾期情况</span>
				</div>

				<el-table stripe
				          class="huo-list-table main-theme-table huojv-data-list2" size="mini" highlight-current-row
				          :data="tableActiveData1">
					<el-table-column prop="projectName" label="项目" width="100" align="center">
                        <template slot-scope="scope">
                            <span :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.projectGUID,6)">{{scope.row.projectName}}</span>
                        </template>
                    </el-table-column>
					<el-table-column prop="taskName" label="逾期节点" align="center" width="120"></el-table-column>
					<el-table-column prop="yqDate" label="逾期天数" width="80" align="center"></el-table-column>
					<el-table-column prop="dutyUserName" label="工程负责人" width="100" align="center"></el-table-column>
				</el-table>

				<!-- <div class="huojv-data-list-none mt-20" v-show="tableList1.length <= 0">没有更多了</div> -->
				<div class="huojv-data-list-more" v-show="tableList1.length >= 4" @click="goMore()">查看更多
					<van-icon name="arrow"/>
				</div>
			</div>
            <div class="data-content-panel" v-else key="2">
                <div class="data-title-box data-title-line">
					<span class="title">设计节点逾期情况</span>
				</div>
                <el-table stripe
				          class="huo-list-table main-theme-table huojv-data-list2" size="mini" highlight-current-row
				          :data="tableActiveData1">
                    <el-table-column label="序号" type="index" align="center"></el-table-column>
					<el-table-column prop="period" label="分期" width="100" align="center"></el-table-column>
					<el-table-column prop="bldName" label="楼栋" align="center" width="120"></el-table-column>
					<el-table-column prop="taskName" label="逾期节点" width="80" align="center"></el-table-column>
                    <el-table-column prop="yqDate" label="逾期天数" width="80" align="center"></el-table-column>
					<el-table-column prop="dutyUserName" label="设计负责人" width="100" align="center"></el-table-column>
				</el-table>
				<div class="huojv-data-list-more" v-show="tableList1.length >= 4" @click="goMore()">查看更多
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
    import {getUrlParam, getNextMonths,jumpToPj} from '@/utils/common'

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
                this.init()
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
            jumpToPj,
            init() {
                this.orgId = getUrlParam('chooseOrgId') || getUrlParam('orgId');
                this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType');
                this.designType = (this.pageTab + 1).toString()

                this.tableActiveData1 = []
                this.tableList1 = []

                if (this.orgType<=5) {
                    this.getChartsData();
                    this.getTableData1();
                }else{
                    this.getTableData1();
                }
                
            },


            // 获取图表数据
            getChartsData() {
                request({
                    url: `/app-api/productDesign/getNodeCompletionRate`,
                    method: 'post',
                    data: {
                        orgId: this.orgId,
                        designType: this.designType,
                    }
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
                let xAxisData = [],
                    chartData1 = [];
                let avg = 0, sum = 0;

                data.forEach(item => {
                    xAxisData.push(item.taskTypeName);
                    chartData1.push(item.onTimeRate && item.onTimeRate.percentage || '-');
                    sum += parseFloat(item.onTimeRateAvg && item.onTimeRateAvg.percentage || 0)
                })

	            avg = (sum / data.length).toFixed(2)

                let series = [{
                    name: '完成率',
                    type: 'bar',
                    barWidth: '15',
                    itemStyle: {
                        normal: {
                            color: '#006E38'
                        }
                    },
                    markLine: {
                        symbol: "none",
                        data: [
                            {
                                type: 'average',
                                name: '平均完成率',
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
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    padding:[8,10],
                                    // shadowColor: '#006E38',
                                    shadowColor: '#3ab779',
                                    borderRadius: 3,
                                    shadowBlur: 1,
                                    shadowOffsetY: 0,
                                    rich:{
                                        r1: {
                                            color: 'red'
                                        },
                                    }
                                },
                                // yAxis: (middle/data.length).toFixed(2)
                                yAxis: avg
                            },
                        ]
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
                option.yAxis.name = `单位：%`;
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
                        let text = '<span class="chart-tooltip">' + params[i].seriesName + '：</span>';
                        //值
                        let value = params[i].value + '%';
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
                    let myChart = new echarts.init(this.$refs.chart1);
                    myChart.setOption(option, true);
                })
            },

            getTableData1(){
                request({
                    url: `/app-api/productDesign/getNodeOverview`,
                    method: 'post',
                    data:{
                        orgId:this.orgId,
                        designType: this.designType,
                        current: 1, 
                        size: 9
                    }
                }).then(({ data }) => {
                    if (data.code === 0 && data.data) {
                        let list = data.data;

                        this.tableList1 = list;
                        if(list.length > 8){
                            this.tableActiveData1 = list.slice(0,8);
                        }else{
                            this.tableActiveData1 = list;
                        }
                    }
                }).catch((e) => {
                    console.log('designChangePie-err', e);
                });
            },

            // 点击查看更多
            goMore() {
                this.$router.push({path: '/report/productDesign/moreChangeDesign',
                    query: {
                        orgId: this.orgId,
                        orgType: this.orgType,
                        pageType:2,
                        designType: this.designType,
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
