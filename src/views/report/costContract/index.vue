<template>
	<div class="report-index pb-20">

		<!-- 首页页面 -->
		<div v-show="pageType == 1">
			<!-- 成本线数据 -->
			<div class="main-content width100">
				<div class="data-content-panel pt-30" style="padding-bottom: 0;">
					<ul class="data-info-list" style="border-bottom: 0;">
                        <li v-show="orgType<6">
                            <div class="data-type">有军令状项目数
                                <el-popover placement="bottom" width="200" trigger="click" v-model='showPop'>
                                    <div class="tooltips">
                                        <p>统计我方操盘成本项目{{costDetail.ourSideCount || 0}}个；</p>
                                        <p>不统计成本项目{{costDetail.noStatisticsCount || 0}}个，其中：</p>
                                        <p>&nbsp;&nbsp;&nbsp;1）已清算项目{{costDetail.liquidatedCount || 0}}个； </p>
                                        <p>&nbsp;&nbsp;&nbsp;2）轻资产项目{{costDetail.lightAssetsCount || 0}}个；</p>
                                        <p>&nbsp;&nbsp;&nbsp;3）对方操盘成本项目{{costDetail.otherSideCount || 0}}个。</p>
                                    </div>
                                    <span class="tips-img" slot="reference" style="width:15px;height:15px"></span>
                                </el-popover>
                            </div>
                            <div class="data-box mt-10">
                                <label class="value" v-text="costDetail.targetItems || 0"></label>
                                <label class="unit">个</label>
                            </div>
                        </li>
                        <li v-show="orgType>=6" class="flexBox dirColumn">
                            <img class="icon" src="../../../assets/images/cost.png" alt="">
                            <div class="data-type" v-html="costDetail.itemAttribute"></div>
                        </li>

						<li>
							<div class="data-type">拿地版目标成本</div>
							<div class="data-box mt-10">
								<label class="value" v-text="costDetail.getLandTargetAmount || 0"></label>
								<label class="unit">亿元</label>
							</div>
						</li>
						<li>
							<div class="data-type">执行版目标成本</div>
							<div class="data-box mt-10">
								<label class="value" v-text="costDetail.toalTargetAmount || 0"></label>
								<label class="unit">亿元</label>
							</div>
						</li>
					</ul>

					<ul class="data-info-list mt-15" style="border-bottom: 0;">
						<li>
							<div class="data-type">动态成本</div>
							<div class="data-box mt-10">
								<label class="value" v-text="costDetail.dynamicAmount || 0"></label>
								<label class="unit">亿元</label>
							</div>
						</li>
						<li>
							<div class="data-type">成本变动额</div>
							<div class="data-box mt-10">
								<label class="value"
								       v-text="((costDetail.changeAmount || 0) >= 0 ? '+' : '') + (costDetail.changeAmount || 0)"></label>
								<label class="unit">亿元</label>
							</div>
						</li>
						<li>
							<div class="data-type">成本变动率</div>
							<div class="data-box mt-10">
								<label class="value"
								       v-text="((costDetail.changeRate || 0) >= 0 ? '+' : '') + (costDetail.changeRate || 0)"></label>
								<label class="unit">%</label>
							</div>
						</li>
					</ul>

					<!-- 标题 -->
					<div class="data-title-box mt-20" style="border-bottom: 1px solid #ccc;">
						<a class="more" href="javascript:;" @click="changePage(2)" style="padding-bottom: 6px;"
						   v-eventlisten="{isChangePage:false,pageEvent:'点击成本合约-查看更多'}">查看更多
							<van-icon name="arrow"/>
						</a>
					</div>

					<div class="huojv-costContract-chart-panel" ref="chart0"></div>
				</div>
			</div>

			<div class="tabBox white-bg mt-15">
				<!-- tab标签 -->
				<van-tabs v-model="actTab" class="vanTabs" color="#209B5C" line-width="30px" :ellipsis="false"
				          title-active-color="#209B5C" sticky @change="changeActTab">
					<van-tab v-for="(item,index) in tabList" icon="fail" :title="item.name" :disabled="item.disabled"
					         :key="index" title-style="margin:0 5px">
						<div slot="title">
							<span v-eventlisten="{isChangePage:false,pageEvent:'点击成本合约-'+item.name}">{{item.name}}</span>
						</div>
					</van-tab>
				</van-tabs>
                <!-- 目标成本管理 页面 -->
				<div class="tabContent" v-if="actTab==0">
					<target-cost ref="targetCost" />
				</div>
				<!-- 集采采购管理 页面 -->
				<div class="tabContent" v-if="actTab==2">
					<centralized-purchasing ref="centralizedPurchasing"></centralized-purchasing>
				</div>
				<!-- 招标采购页面 -->
				<div class="tabContent" v-if="actTab==3">
					<procurement/>
				</div>
				<!-- 合同管理页面 -->
				<div class="tabContent" v-if="actTab==4">
					<cont-management></cont-management>
				</div>
				<!-- 合同支付页面 -->
				<div class="tabContent" v-if="actTab==5">
					<contract-payment ref="contractPayment"></contract-payment>
				</div>

			</div>
		</div>

		<!-- 详情页面 -->
		<cost-detail @changePage="changePage" ref="costDetail" v-show="pageType == 2"></cost-detail>
		<!--		</van-pull-refresh>-->
	</div>
</template>

<script>
    import {mapState} from 'vuex'
    import scrollFixed from '@/mixin/scroll-fixed';
    import {
        Tab,
        Tabs,
        Icon,
        Button
    } from 'vant';
    import {getLocalStorage} from '@/utils/local-storage';
    import request from '@/utils/request';
    import echarts from 'echarts'
    import $ from 'jquery'
    import {handleNum2String, handleDate, getUrlParam} from '@/utils/common'

    import centralizedPurchasing from "./components/centralizedPurchasing";
    import contManagement from './components/contManagement'
    import costDetail from "./components/costDetail"
    import contractPayment from "./components/contractPayment";
    import procurement from "./components/procurement"
    import targetCost from "./components/targetCost"


    export default {
        mixins: [scrollFixed],

        data() {
            return {
                costDetail: {},  // 采集采购管理详情

                // 图表option
                chartOption0: {
                    tooltip: {
                        trigger: 'axis',
                        formatter: '{b} <br/>{a0} ： {c0}万<br/>{a1} ： {c1}万<br/>{a2} ： {c2}万'
                    },
                    title: {
                        text: '',
                        show: true,
                        textStyle: {
                            fontWeight: 'bold',
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
                    grid: {
                        'left': '4%',
                        'right': '4%',
                        'bottom': '15%',
                        'top': '25%',
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
                            textStyle: {
                                color: '#666666'
                            }
                        }
                    },
                    yAxis: {
                        type: 'value',
                        name: '',
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

                showPopover: false,  // 是否显示弹窗
                actTab: 0, // 当前tab选择状态

                // tab列表
                tabList: [
                    {name: '目标成本管理', disabled: false},
                    {name: '供应商管理', disabled: true},
                    {name: '集采采购管理', disabled: false},
                    {name: '招标采购', disabled: false},
                    {name: '合同管理', disabled: false},
                    {name: '合同支付', disabled: false},
                ],

                // 页面类型  1表示首页  2 表示详情页
                pageType: 1,
                orgType: getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType,
                statusObj: {
                    '已清算': '已清算项目<br>不统计成本大运营',
                    '轻资产': '轻资产项目<br>不统计成本大运营',
                    '对方操盘': '对方操盘项目<br>不统计成本大运营',
                    '旧项目': '成本数据在金蝶<br>只显示目标成本总数',
                    '正常项目': '军令状项目<br>我方操盘成本'
                },
                showPop: false
            };
        },

        computed: {
            ...mapState({
                orgId: state => state.orgId || getLocalStorage(['orgId']).orgId,
                currentActTab: state => state.costContractTab
            })
        },

        watch: {
            // 监听浏览器组织机构id变化
            '$store.state.orgId': function (newVal, oldVal) {
                if (this.pageType == 1) {
                    this.init();
                } else if (this.pageType == 2) {
                    this.$refs.costDetail.getTableData(true)
                }
                if (this.actTab == 2) {
                    this.$refs.centralizedPurchasing.init();
                } else if (this.actTab == 5) {
                    this.$refs.contractPayment.init();
                }
            }
        },

        mounted() {
            this.init();
        },

        methods: {
            // 刷新页面
            reloadWindow() {
                setTimeout(() => {
                    window.location.reload();
                    this.isLoading = false;
                }, 500)
            },

            // 初始化
            init() {
                this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType
                // $('.el-popover.el-popper[aria-hidden="false"]').hide()
                this.showPop = false
                if (this.pageType == 1) {
                    // 记录tab选中状态
                    if (this.currentActTab != undefined || this.currentActTab != null) {
                        this.actTab = this.currentActTab;
                    }

                    this.getCostDetails();
                    this.drawChart0();
                }

                $(document).scrollTop(10)
            },

	        // 切换页面 详情页和首页切换
            changePage(pageType) {
                this.pageType = pageType;
                if (pageType == 2) {
                    this.$refs.costDetail.getTableData(true);
                }
            },

            // 切换Tab标签页
            changeActTab(event) {
                this.$store.commit('COSTCONTRACTTAB', event);
            },

            // 采集采购管理详情
            getCostDetails() {
                const curMonth = handleDate(new Date(), 'month');
                request({
                    url: `/app-api/costContract/cost/details?root=1&orgId=${this.orgId}`,
                    method: 'get',
                    data: {}
                }).then(({data}) => {
                    if (data.code === 0 && data.data && data.data.length) {
                        this.costDetail = data.data[0];
                        if (data.data[0].itemAttribute) {
                            // 替换逗号为换行符
                            this.costDetail.itemAttribute = data.data[0].itemAttribute.replace(/，/g, '<br>').replace(/,/g, '<br>')
                        }
                    } else {
                        this.costDetail = {};
                    }
                });
            },

            // 绘制首页图表
            drawChart0() {
                // 获取组织类型
                let orgType = parseInt(getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType);

                request({
                    url: `/app-api/costContract/cost/detail/trend?orgId=${this.orgId}`,
                    method: 'post',
                    data: {}
                }).then(({data}) => {
                    let xAxisData = [], chartData1 = [], chartData2 = [], chartData3 = [], chartData4 = [],
                        chartData5 = [], chartData6 = [];
                    if (data.code === 0 && data.list && data.list.length) {
                        data.list.forEach(item => {
                            xAxisData.push(item.years + '.' + item.months);
                            chartData1.push(item.toalAmount || '-');
                            chartData2.push(item.toalTargetAmount || '-');
                            chartData3.push(item.dynamicAmount || '-');
                            chartData4.push(item.aboveGetLandCount || '-');
                            chartData5.push(item.equalGetLandCount || '-');
                            chartData6.push(item.belowGetLandCount || '-');
                        });
                    }

                    // 如果是区域公司或者项目
                    if (orgType >= 5) {
                        let series = [
                            {
                                name: '拿地版目标成本',
                                data: chartData1,
                                type: 'line',
                                symbol: 'circle',     //设定为实心点
                                symbolSize: 4,   //设定实心点的大小
                                formatter: '{value} 个',
                                smooth: false,
                                itemStyle: {
                                    normal: {
                                        color: '#0092D8'
                                    }

                                },
                                lineStyle: {
                                    normal: {
                                        width: 1
                                    }
                                },
                            },
                            {
                                name: '执行版目标成本',
                                type: 'line',
                                symbol: 'circle',     //设定为实心点
                                symbolSize: 4,   //设定实心点的大小
                                smooth: false,
                                formatter: '{value} 个',
                                itemStyle: {
                                    normal: {
                                        color: '#006E38'
                                    }

                                },
                                lineStyle: {
                                    normal: {
                                        width: 1
                                    }
                                },
                                data: chartData2
                            },
                            {
                                name: '动态成本',
                                type: 'line',
                                symbol: 'circle',     //设定为实心点
                                symbolSize: 4,   //设定实心点的大小
                                smooth: false,
                                formatter: '{value} 个',
                                itemStyle: {
                                    normal: {
                                        color: '#B4A36B',
                                    }
                                },
                                lineStyle: {
                                    normal: {
                                        width: 1
                                    }
                                },
                                data: chartData3
                            }
                        ];

                        let legendData = series.map(item => {
                            return item.name;
                        });
                        
                        let option = JSON.parse(JSON.stringify(this.chartOption0));
                        if (data.list.length<=0) {
                            option.grid.left = '10%'                            
                        }
                        option.series = series;
                        option.legend.data = legendData;
                        option.legend.itemWidth = 15;
                        option.legend.itemHeight = 2;
                        option.title.text = '拿地版目标成本、执行版目标成本、动态成本差异图';
                        option.yAxis.name = '单位(万元)';
                        option.tooltip.formatter = '{b} <br/>{a0} ： {c0} 万<br/>{a1} ： {c1} 万<br/>{a2} ： {c2} 万';

                        option.xAxis.data = xAxisData;
                        let myChart = new echarts.init(this.$refs.chart0);
                        myChart.setOption(option, true);
                    } else {
                        let series = [
                            {
                                name: '高于拿地版',
                                type: 'bar',
                                barWidth: '24',
                                stack: 'cost',
                                formatter: '{value} 万',
                                itemStyle: {
                                    normal: {
                                        color: '#0092D8'
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
                                data: chartData4
                            },
                            {
                                name: '与拿地版持平',
                                type: 'bar',
                                barWidth: '24',
                                stack: 'cost',
                                formatter: '{value} 万',
                                itemStyle: {
                                    normal: {
                                        color: '#006E38'
                                    }
                                },
                                label: {
                                    show: true,
                                    position: 'inside',
                                    fontSize: 12,
                                    formatter: function (params) {
                                        if (params.value == 0) {
                                            return '';
                                        } else {
                                            return params.value;
                                        }
                                    }
                                },
                                data: chartData5
                            },
                            {
                                name: '低于拿地版',
                                type: 'bar',
                                barWidth: '24',
                                stack: 'cost',
                                formatter: '{value} 万',
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
                                            return params.value;
                                        }
                                    }
                                },
                                data: chartData6
                            }
                        ];

                        let legendData = series.map(item => {
                            return item.name;
                        });

                        let option = JSON.parse(JSON.stringify(this.chartOption0));
                        if (data.list.length<=0) {
                            option.grid.left = '10%'                            
                        }
                        option.series = series;
                        option.legend.data = legendData;
                        option.title.text = '拿地版与执行版目标成本差异项目数统计';
                        option.yAxis.name = '单位(个)';
                        option.tooltip.formatter = '{b} <br/>{a0} ： {c0} 个<br/>{a1} ： {c1} 个<br/>{a2} ： {c2} 个';

                        option.xAxis.data = xAxisData;
                        let myChart = new echarts.init(this.$refs.chart0);
                        myChart.setOption(option, true);
                    }
                });
            },
        },

        components: {
            [Tab.name]: Tab,
            [Tabs.name]: Tabs,
            [Button.name]: Button,
            [Icon.name]: Icon,
            centralizedPurchasing,
            contManagement,
            costDetail,
            contractPayment,
            procurement,
            targetCost
        }
    };
</script>


<style lang="scss" scoped>
	.cost-contract-chart {
		height: 250px;
		width: 340px;
		margin: auto;
	}

	.vanTabs {
		margin-bottom: 15px;
    }
    .dirColumn{
        flex-direction: column;
    }
    .main-content .data-content-panel .data-info-list li.flexBox{
        display: flex;
        justify-content: center;
        align-items: center;
        line-height: 20px;
        .icon{
            margin: 0 auto;
            width: 40px;
        }
    }
    .tooltips p{
        margin: 3px auto;
    }
    
</style>
