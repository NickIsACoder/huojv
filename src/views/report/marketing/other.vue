<template>
	<div class="report-index has-tabs pb-20">
		<!--其它集团  中国奥园 -->
		<ul class="huojv-tabs fixed-tabs">
			<li style="width: 100%;"
			    v-eventlisten="{isChangePage:false,pageEvent:'点击其它集团月报'}" class="active"><label>月报</label></li>
		</ul>
		<van-pull-refresh v-model="isLoading" success-text="刷新成功" loading-text="正在刷新..." @refresh="reloadWindow()">
			<div class="main-content mt-15">
				<div class="data-content-panel">
					<!-- 标题 -->
					<div class="data-title-box">
						<img class="title-ico" src="../../../assets/images/add_ico.png">
						<span class="title">本月新增</span>
						<span class="tips">(已含退签约退认购)</span>
					</div>

					<div v-if="orgId == aoyuanOrgId">
						<ul class="data-info-list">
							<li style="width: 50%">
								<div class="data-box">
									<label class="value" v-text="boardData.monthContractAmount || 0"></label>
									<label class="unit">亿</label>
								</div>
								<div class="data-type">本月签约金额</div>
							</li>
							<li style="width: 50%">
								<div class="data-box">
									<label class="value" v-text="boardData.monthContractArea || 0">0</label>
									<label class="unit">万平方</label>
								</div>
								<div class="data-type">本月签约面积</div>
							</li>
						</ul>

						<ul class="data-info-list1">
							<li style="width: 50%">
								<label class="title">本年</label>
								<label class="value small" v-text="boardData.yearContractAmount || 0">0</label>
								<label class="unit">亿</label>
							</li>
							<li style="width: 50%">
								<label class="title">本年</label>
								<label class="value small" v-text="boardData.yearContractArea || 0">0</label>
								<label class="unit">万平方</label>
							</li>
						</ul>
					</div>
					<div v-if="orgId == otherOrgId">
						<ul class="data-info-list" style="border-bottom: 0;">
							<li style="width: 50%">
								<div class="data-type">本月签约金额</div>
								<div class="data-box mt-10">
									<label class="value" v-text="boardData.monthContractAmount || 0"></label>
									<label class="unit">亿</label>
								</div>
								<div class="data-type mt-10">占比 <label class="green-font font-18 ml-5 font-bold"
								                                       v-text="((boardData.monthContractProp || 0) > 0 ? '+' : '')+ (boardData.monthContractProp || 0) + '%'"></label>
								</div>
							</li>
							<li style="width: 50%">
								<div class="data-type">本月签约面积</div>
								<div class="data-box mt-10">
									<label class="value" v-text="boardData.monthContractArea || 0">0</label>
									<label class="unit">万平方</label>
								</div>
								<div class="data-type mt-10">占比 <label class="green-font font-18 ml-5 font-bold"
								                                       v-text="((boardData.monthContractAreaProp || 0) > 0 ? '+' : '')+ (boardData.monthContractAreaProp || 0) + '%'"></label>
								</div>
							</li>
						</ul>

						<ul class="data-info-list mt-15">
							<li style="width: 50%">
								<div class="data-type">本年签约金额</div>
								<div class="data-box mt-10">
									<label class="value" v-text="boardData.yearContractAmount || 0"></label>
									<label class="unit">亿</label>
								</div>
								<div class="data-type mt-10">占比 <label class="green-font font-18 ml-5 font-bold"
								                                       v-text="((boardData.yearContractAmountProp || 0) > 0 ? '+' : '')+ (boardData.yearContractAmountProp || 0) + '%'"></label>
								</div>
							</li>
							<li style="width: 50%">
								<div class="data-type">本年签约面积</div>
								<div class="data-box mt-10">
									<label class="value" v-text="boardData.yearContractArea || 0">0</label>
									<label class="unit">万平方</label>
								</div>
								<div class="data-type mt-10">占比 <label class="green-font font-18 ml-5 font-bold"
								                                       v-text="((boardData.yearContractAreaProp || 0) > 0 ? '+' : '')+ (boardData.yearContractAreaProp || 0) + '%'"></label>
								</div>
							</li>
						</ul>
					</div>

					<div class="text-center">
						<ul class="huojv-tab-bars_1 two-cols" style="margin-bottom: 0;">
							<li @click="checkTab4(1)" v-eventlisten="{isChangePage:false,pageEvent:'点击其它集团-月报签约'}"
							    :class="[tab4 == 1 ? 'active' : '']">签约金额
							</li>
							<li @click="checkTab4(2)" v-eventlisten="{isChangePage:false,pageEvent:'点击其它集团-月报回款'}"
							    :class="[tab4 == 2 ? 'active' : '']">签约面积
							</li>
						</ul>
					</div>

					<div class="echart-panel other-org-chart">
						<div class="trend-echarts-panel mt-15 max" ref="echartsBox"></div>
					</div>
				</div>
			</div>
		</van-pull-refresh>
	</div>
</template>

<script>
    import {mapState} from 'vuex'
    import scrollFixed from '@/mixin/scroll-fixed';
    import echarts from 'echarts'
    import {getLocalStorage} from '@/utils/local-storage';
    import request from '@/utils/request';
    import {getNextMonths, handleNum2String,getUrlParam} from '@/utils/common';
    import {PullRefresh} from 'vant';
    import $ from 'jquery';


    export default {
        mixins: [scrollFixed],

        data() {
            return {
                // orgId: getLocalStorage(['orgId']).orgId,
                showGesture: localStorage.showGesture || 1,
                myEchart: null,
                option: {
                    tooltip: {
                        trigger: 'axis',
                        // formatter: '{b} <br/>{a0} ： {c0}<br/>{a1} ： {c1}<br/>{a2} ： {c2}'
                    },
                    title: {},
                    legend: {
                        show: true,
                        type: 'plain',
                        icon: 'circle',
                        itemWidth: 10,
                        itemHeight: 10,
                        // orient: 'horizon',
                        x: 'right',
                        y: 'top',
                        textStyle: {
                            fontSize: 12,
                            color: '#999999'
                        },
                        data: ['认购金额', '签约金额', '回款金额', '退签约金额']  //注：需接口获取
                    },
                    dataZoom: [
                        {
                            id: 'dataZoomX',
                            type: 'inside',
                            xAxisIndex: [0],
                            filterMode: 'none',
                            start: 0,
                            end: 100
                        }
                    ],
                    grid: {
                        'left': '4%',
                        'right': '4%',
                        'bottom': '5%',
                        'top': '30%',
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
                        boundaryGap: false,
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
                        name: '单位(万)',
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
                option1: {
                    title: {
                        text: '回款最近12个月趋势图',
                        // subtext: '纯属虚构',
                        x: 'center',
                        textStyle: {
                            fontSize: 12
                        }
                    },
                    color: ['#FE0909', '#90E1BA'],
                    legend: {
                        show: true,
                        type: 'plain',
                        icon: 'circle',
                        // orient: 'horizon',
                        x: 'center',
                        y: 'bottom',
                        itemWidth: 10,
                        itemHeight: 10,
                        textStyle: {
                            fontSize: 12,
                            color: '#999999'
                        },
                        data: []
                    },
                    grid: {
                        'left': '1%',
                        'right': '2%',
                        'bottom': '15%',
                        'top': '15%',
                        'containLabel': true
                    },
                    animation: true,
                    tooltip: {
                        axisPointer: {
                            type: 'cross',
                            crossStyle: {
                                color: '#FE0909'
                            }
                        },
                        trigger: 'axis',
                        formatter: '{b} <br/>{a0} ： {c0}'
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            // mark: { show: true },
                            // dataView: { show: true, readOnly: false },
                            // magicType: { show: true, type: ['line', 'bar'] },
                            // restore: { show: true },
                            // saveAsImage: { show: true }
                        }
                    },
                    calculable: true,
					// dataZoom : [{
					// 	type: 'inside',
					// 	show: true,
					// 	xAxisIndex: [0],
					// 	left: '9%',
					// 	bottom: 0,
					// 	height: 10,
					// 	start: 0,
					// 	zoomLock:true,
					// 	end: 50 //初始化滚动条
					// }],
                    xAxis: {
                        type: 'category',
                        boundaryGap: true,
                        data: [],
                        axisTick: {
                            show: false
                        },
						axisLabel: {
							show: true,
							rotate: 50,
						}
                    },
                    yAxis: [{
                        name:'单位(万)',
                        type: 'value',
                        splitNumber: 3,
                        axisLabel: {
                            formatter: '{value}'
                        },
                        axisTick: {
                            show: false
                        }
                    }, {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}%'
                        },
                        splitNumber: 3,
                        axisTick: {
                            show: false
                        }
                    }],
                    series: []
                },
                expandNodes: [],
                tableListBoard: [],
                boardData: {
                    orderAmount: 0,
                    contractAmount: 0,
                    getAmount: 0,
                    orderAmountOfReason: 0,
                    contractAmountOfReason: 0,
                    getAmountOfReason: 0,
                    orderAmountOfYear: 0,
                    contractAmountOfYear: 0,
                    getAmountOfYear: 0,
                    monthContractAmount: 0,
                    monthContractArea: 0,
                    monthContractAreaProp: 0,
                    yearContractAmount: 0,
                    yearContractAreaProp: 0,
                    yearContractArea: 0,
                    yearContractAmountProp: 0,
                    monthContractProp: 0
                },

                near12Month: [],

                tab1: 'day',  //  day week month
                tab2: 1, // 1 含并购， 2 自营
                tab3: 1, // 1  认购 ， 2  签约， 3  回款
                tab4: 1, // 1  认购 ， 2  签约， 3  回款

                leval: 0,
                isLoading: false,

				orgType: 2,
                aoyuanOrgId: '664F5D3C-FB71-4168-863E-7209F5889D01',   // 中国奥园orgId
                otherOrgId: '43908029-8A9C-4607-8BA5-D3970B4ACD17',   // 其它集团orgId
            };
        },

        computed: {
            ...mapState({
                orgId: state => state.orgId || getLocalStorage(['orgId']).orgId
            })
        },

        watch: {
            '$store.state.orgId': function (newVal, oldVal) {
                if(this.orgId != this.aoyuanOrgId && this.orgId != this.otherOrgId){
                    let search = decodeURIComponent(window.location.search);
                    if(!search){
                        search = '?' + decodeURIComponent(window.location.href.split('?')[1]);
                    }
                    window.location = '#/index'+search;
                }else{
                    this.init();
                }
            }
        },

        mounted() {
            if(this.orgId != this.aoyuanOrgId && this.orgId != this.otherOrgId){
                let search = decodeURIComponent(window.location.search);
                if(!search){
                    search = '?' + decodeURIComponent(window.location.href.split('?')[1]);
                }
                window.location = '#/index'+search;
            }else{
                this.init();
            }
        },

        methods: {
            reloadWindow() {
                setTimeout(() => {
                    window.location.reload();
                    this.isLoading = false;
                }, 500)
            },
            // 获取折线图数据并绘制折线图
            getEchartData() {
                let _url = '';
                if (this.tab4 == 1) {
                    _url = `/app-api/report/otherMonthlyTrendWithMA/${this.orgId}/${this.orgType}`;
                } else if (this.tab4) {
                    _url = `/app-api/report/otherMonthlyTrendWithOutMA/${this.orgId}/${this.orgType}`;
                }

                request({
                    url: _url,
                    method: 'get'
                }).then(({data}) => {
                    if (data.code === 0) {
                        this.drawMonthChart1(data.list, this.tab4);
                    }
                }).catch((e) => {
                    console.log('getEchartData-err', e);
                });
            },

            // 其它集团图表
            drawMonthChart1(list, type) {
                let _list = list,
                    _text = '',
                    _unit = '',
	                _name = '',
                    _months = [],
                    _arr1 = [],
                    _option = this.option1;

                let orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType');

                _months = list.map(item => {
                    return item.trendDate
                })
                if (type === 1) {
                    _text = '签约金额'
                    _unit = orgType <= 5 ? '亿' : '万'
	                _name = orgType <= 5 ? '单位(亿)' : '单位(万)'
                    _arr1 = list.map(item => {
                        return item.contractAmount
                    })
                } else if (type === 2) {
                    _text = '签约面积'
                    _unit = '万m²'
                    _name = '单位(万m²)'
                    _arr1 = list.map(item => {
                        return item.contractArea
                    })
                } else if (type === 3) {
                    _text = '回款金额'
                    _unit = orgType <= 5 ? '亿' : '万'
					_name = orgType <= 5 ? '单位(亿)' : '单位(万)'
                    _arr1 = list.map(item => {
                        return item.getAmount
                    })
                }

                _option.title.text = `本月${_text}趋势图`;
                _option.yAxis[0].name = _name;
                _option.yAxis[0].axisLabel.formatter = '{value}';
                _option.tooltip = {
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#F97546'
                        }
                    },
                    trigger: 'axis',
                    formatter: '{b} <br/>{a0} ： {c0}' + _unit
                };
                _option.legend.data = [`本月${_text}`];
                _option.series = [
                    {
                        name: `${_text}`,
                        data: [],
                        type: 'bar',
                        barWidth: '8',
                        yAxisIndex: 0,
                        itemStyle: {
                            normal: {
                                color: '#209B5C'
                            }
                        },
                        markLine: {
                            lineStyle: {
                                normal: {
                                    color: '#FFC40F'
                                }
                            },
                            data: [
                                {
                                    // type: 'average',
                                    name: '平均值'
                                }
                            ]
                        },
                    }
                ];

                _option.xAxis.data = _months;
                _option.series[0].data = _arr1;

                let sum = 0,average = 0,max = 0;
                for(let i = 0; i < _arr1.length; i++){
					if(parseFloat(_arr1[i]) > max){
						max = parseFloat(_arr1[i]);
					}
                	sum += parseFloat(_arr1[i]);
				}
                average = (sum / _arr1.length).toFixed(2);
				_option.series[0].markLine.data[0].yAxis = average;
				if (max>=500) {
					_option.yAxis[0].max = parseInt(max + 50)
				} else if (500>max&&max>=100) {
					_option.yAxis[0].max = parseInt(max + 10)
				} else if (100>max) {
					_option.yAxis[0].max = parseInt(max + 3)
				}

                this.myEchart = echarts.init(this.$refs.echartsBox);
                this.myEchart.setOption(_option, true);
            },


            init() {
                const now = new Date();
                this.near12Month = getNextMonths(-11);
                this.near12Month.push(now.getFullYear() + '年' + handleNum2String(now.getMonth() + 1) + '月');
                this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType;
                // this.getEchartData();
                this.getBoardData();
	            this.getEchartData();

            },

            // 获取上面的 数据【1:含并购, 2:自营】
            getBoardData() {
                if (!this.orgId) return;

                let _url =  `/app-api/report/otherMonthlyWithMA/${this.orgId}`;

                request({
                    url: _url,
                    method: 'get'
                }).then(({data}) => {
                    if (data.code === 0) {
                        let _data = data.data || {};
                        this.boardData.monthContractAmount = _data.monthContractAmount || 0;
                        this.boardData.monthContractProp = _data.monthContractProp || 0;
                        this.boardData.monthContractArea = _data.monthContractArea || 0;
                        this.boardData.monthContractAreaProp = _data.monthContractAreaProp || 0;
                        this.boardData.yearContractAmount = _data.yearContractAmount || 0;
                        this.boardData.yearContractAmountProp = _data.yearContractAmountProp || 0;
                        this.boardData.yearContractAreaProp = _data.yearContractAreaProp || 0;
                        this.boardData.yearContractArea = _data.yearContractArea || 0;
                    }

                }).catch((e) => {
                    console.log('getBoardData-err', e);
                });
            },

            // 切换  含并购  自营
            checkTab2(tab2) {
                this.tab2 = tab2;
                this.init();
            },

            checkTab4(tab4) {
                this.tab4 = tab4;
                this.getEchartData();
            }
        },

        components: {
            [PullRefresh.name]: PullRefresh
        }
    };
</script>


<style lang="scss" scoped>

</style>
