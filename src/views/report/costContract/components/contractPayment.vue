<template>
	<div class="detail-panel height100 white-bg">
		<div class="main-content">

			<div class="data-content-panel pt-15">
				<div class="text-center font-18">月度累计产值支付情况</div>
				<div class="huojv-costContract-chart-panel max" v-for="(data,index) in chartDataList" :key="data.orgId">

					<!-- 图表标题 -->
					<div class="huojv-chart-title">
						<label v-show="orgType <= 2" class="title" v-text="data.orgName + '集团'"></label>
						<a class="more-link" href="javascript:;" @click="goMore(data.orgId,data.orgName)"
						   v-show="orgType < 6"
						   v-eventlisten="{isChangePage:false,pageEvent:'点击月度累计产值支付情况-查看更多'}">查看更多
							<van-icon name="arrow"/>
						</a>
					</div>

					<!-- 给图表滑动手势 -->
					<div class="scroll-gesture" style="height: 100%;" @touchstart="closeGesture(index)">
						<div :ref="'chart'+index" style="height: 100%;"></div>
						<div v-if="!hideGesture['chart'+index]" class="gesture">
							<img src="../../../../assets/images/huadong.png">
						</div>
					</div>

				</div>

				<div class="text-center font-18 mt-15 mb-15">月度支付结构分析</div>
				<el-table stripe
				          class="main-theme-table huo-list-table"
				          ref="tableRef"
				          size="mini" highlight-current-row
				          row-key="orgId"
				          height="300"
				          :data="tableList"
				          :expand-row-keys="expandNodes"
				          :indent="10" lazy
				          border
				          :load="load"
				          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
				>
					<el-table-column prop="orgName" label="组织架构" align="left" fixed width="90">
                        <template slot-scope="scope">
                            <span v-if="scope.row.orgType == 6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,scope.row.orgType)">{{scope.row.orgName}}</span>
                            <span v-else>{{ scope.row.orgName }}</span>
                        </template>
                    </el-table-column>
					<el-table-column prop="handleAmount" label="累计应付(万元)" width="80" align="center"></el-table-column>
					<el-table-column prop="paidAmount" label="累计已付(万元)" width="80" align="center"></el-table-column>
					<el-table-column prop="unPaidAmount" label="应付未付(万元)" width="80" align="center"></el-table-column>
					<el-table-column prop="billsPaidAmount" label="票据化支付(万元)" width="80"
					                 align="center"></el-table-column>
					<el-table-column prop="workPaidAmount" label="工抵楼支付(万元)" width="80"
					                 align="center"></el-table-column>
					<el-table-column prop="cashPaidAmount" label="现金支付(万元)" width="80" align="center"></el-table-column>
					<el-table-column prop="unplannedAmount" label="计划外支付(万元)" width="80"
					                 align="center"></el-table-column>

					<el-table-column prop="unplannedRate" label="计划外支付比例" width="80" align="center">
						<template slot-scope="scope">
							<span v-text="(scope.row.unplannedRate || '-') + '%'"></span>
						</template>
					</el-table-column>
					<el-table-column prop="billsPaidRate" label="票据化支付比例" width="80" align="center">
						<template slot-scope="scope">
							<span v-text="(scope.row.billsPaidRate || '-') + '%'"></span>
						</template>
					</el-table-column>
				</el-table>
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

                leval: 0,
                tableList: [],  // 表格数据源
                expandNodes: [],

	            // 图表option
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
                            nameTextStyle: {
                                color: '#999'
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
                            max: 100,
                            nameTextStyle: {
                                color: '#999'
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
                chartDataList: [],
	            // 是否隐藏滑动手势
                hideGesture: {}
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
                this.getTableData();
            },

	        // 关闭滑动手势
            closeGesture(index) {
                this.$set(this.hideGesture, 'chart' + index, 1)
            },

	        // 获取图表数据
            getChartsData() {
                request({
                    url: `/app-api/costContract/productionValuePaymentSummary`,
                    method: 'get',
                    params: {orgId: this.orgId}
                }).then(({data}) => {
                    if (data.code === 0 && data.data) {
                        let list = data.data || [];
                        this.chartDataList = list;

                        list.forEach((item, index) => {
                            this.drawChart(item.productionValuePaymentList, index);
                        })
                    }
                });
            },

	        // 绘制柱状图表
            drawChart(data, index) {
                let xAxisData = [], chartData1 = [], chartData2 = [], chartData3 = [], chartData4 = [], chartData5 = [];
                let average = data.length ? data[0].lastYearPaidRate || 0 : 0;
                data.forEach(item => {
                    xAxisData.push(item.months);
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
                }, {
                    name: '累计应付',
                    type: 'bar',
                    barWidth: '10',
                    itemStyle: {
                        normal: {
                            color: '#B4A46C'
                        }
                    },
                    data: chartData2
                }, {
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
	                // todo: 2020-08-21 11：00 最开始说的是不同年份平均数不一样  所以平均数可能是折现，后面确认平均数改为直线
                    //     {
                    //     name: '上一年度平均支付比例',
                    //     data: chartData5,
                    //     type: 'line',
                    //     yAxisIndex: 1,
                    //     formatter: '{value} %',
                    //     smooth: false,
                    //     symbol:'none',
                    //     itemStyle: {
                    //         normal: {
                    //             color: '#FF0000',
                    //         }
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
                                label: {
                                    show: false,
                                    color: '#333333',
                                    formatter: (obj, index) => {
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

                // 自定义tooltip
                option.tooltip.formatter = function (params) {
                    let showHtm = "<div>" + params[0].axisValueLabel + "</div>";
                    for (let i = 0; i < params.length; i++) {

                        //名称
                        let text = '<span class="chart-tooltip">' + params[i].seriesName + '：</span>';
                        //值
                        let value = (params[i].seriesName == '上一年度平均支付比例' || params[i].seriesName == '当月支付比例') ? params[i].value + '%' : params[i].value;
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
                    let myChart = new echarts.init(this.$refs['chart' + index][0]);
                    myChart.setOption(option, true);
                })
            },

	        // 点击查看更多
            goMore(orgId, orgName) {
                this.$router.push({path: '/report/costContract/moreContractPayment',
                    query: {
                        orgId: orgId || this.orgId,
                        orgType: this.orgType,
                        orgName: orgName,
                        token: getUrlParam('token')
                    }
                });
            },

            // 获取资源结构明细表格数据
            getTableData() {
                this.orgId = getUrlParam('chooseOrgId') || getUrlParam('orgId');
                if (!this.orgId) return;
                this.leval = 0;
                let _url = `/app-api/costContract/productionValuePaymentTree?orgId=${this.orgId}&root=1`;

                request({
                    url: _url,
                    method: 'get'
                }).then(({data}) => {
                    if (data.code === 0) {
                        let _list = data.data;
                        let _parentOrgId = '',
                            _expandNodes = [];

                        let rootNode = {};
                        for (let i = 0, len = _list.length; i < len; i++) {
                            if (_list[i]['root'] == true) {
                                rootNode = _list[i];
                                _parentOrgId = _list[i]['parentOrgId'];
                                _expandNodes.push(_list[i]['orgId'])

                                // 把根节点排在第一个
                                _list.splice(i, 1);
                                _list.unshift(rootNode);
                                break;
                            }
                        }

                        let tree = this.fnGetTree(_list, _parentOrgId);
                        this.expandNodes = _expandNodes;

                        this.tableList = tree;

                        // this.tableList = _list;

                        // 重新渲染表格 防止表格错位
                        this.$nextTick(() => {
                            if (this.$refs['tableRef']) {
                                this.$refs['tableRef'].doLayout()
                            }
                        })
                    }
                }).catch((e) => {
                    console.log('getBoardData-err', e);
                });
            },

	        // 处理数据为树状结构
            fnGetTree(data, parentOrgId) {
                this.leval++;
                let self = this;
                var result = [], temp;
                for (let i in data) {
                    if (data[i].parentOrgId == parentOrgId) {
                        result.push(data[i]);

                        // 初始数据只返回了两级   给第三级添加模拟子节点
                        if (this.leval >= 2 && !data[i].leaf) {
                            data[i].hasChildren = true;
                            data[i].expan = false;
                        } else {
                            temp = self.fnGetTree(data, data[i].orgId);
                            if (temp.length > 0) {
                                data[i].children = temp;
                            }
                        }
                    }
                }
                return result;
            },

	        // 表格数据懒加载
            load(tree, treeNode, resolve) {
                let _url = `/app-api/costContract/productionValuePaymentTree?orgId=${tree.orgId}&root=0`;

                request({
                    url: _url,
                    method: 'get'
                }).then(({data}) => {
                    if (data && data.code === 0) {
                        let _list = data.data;
                        _list.forEach(item => {
                            if (!item.leaf) {
                                item.hasChildren = true;
                                item.expan = false;
                            }
                        });
                        resolve(_list);
                    } else {
                        resolve([]);
                    }
                });
            },

	        // 点击返回按钮
            onClickLeft() {
                // window.history.go(-1);
                this.$emit('changePage', 1);
            }

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
.huojv-chart-title > .title {
    color: #006E38;
    font-size: 0.42667rem;
    position: relative;
    font-weight: bold;
}
.huojv-chart-title > .title:before {
    content: '';
    display: block;
    width: 0.26667rem;
    height: 0.05333rem;
    background: #006E38;
    position: absolute;
    top: 50%;
    margin-top: -0.02667rem;
    left: -0.4rem;
}
.huojv-chart-title > .title:after {
    content: '';
    display: block;
    width: 0.26667rem;
    height: 0.05333rem;
    background: #006E38;
    position: absolute;
    top: 50%;
    margin-top: -0.02667rem;
    right: -0.4rem;
}
.huojv-chart-title > .more-link {
    position: absolute;
    right: 0;
    top: 50%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    margin-top: 0;
    z-index: 100;
}
</style>
