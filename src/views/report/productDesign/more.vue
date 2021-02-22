<template>
	<div class="report-index pb-20">
		<van-nav-bar style="position: fixed; top: 0; width: 100%;" :title="title" left-arrow @click-left="onClickLeft"
		             v-eventlisten="{isChangePage:true,pageEvent:'点击返回按钮'}"/>
		<van-pull-refresh v-model="isLoading" success-text="刷新成功" loading-text="正在刷新..." @refresh="reloadWindow">

			<div class="main-content mt-15 padding-nav">
				<!-- <span style="font-size:12px">{{this.test}}</span> -->
				<div class="data-content-panel pt-15">
					<div v-show="type==2">
						<div class="data-title-box data-title-line" style="margin-top: 0;">
							<span class="title">容积率范围分布</span>
						</div>
						<div class="huojv-costContract-chart-panel" ref="chart1"></div>

						<div class="data-title-box data-title-line" style="margin-top: 0;">
							<span class="title">容积率范围使用情况</span>
						</div>
					</div>

					<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
                        <div v-if="orgType<=5" key="1">
                            <el-table v-show="type==1"
                                    stripe
                                    class="huo-list-table main-theme-table huojv-data-list2 huojv-sortable"
                                    size="mini"
                                    highlight-current-row
                                    @sort-change="sortChange"
                                    :data="tableList"
                                    :default-sort="{prop: 'valuePriceRate', order: 'descending'}"
                            >
                                <el-table-column type="index" label="序号" align="center"></el-table-column>
                                <el-table-column prop="projectName" label="项目名称" align="center" width="120">
                                    <template slot-scope="scope">
                                        <span :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.projectGUID,6)">{{scope.row.projectName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="valuePriceRate" label="货地比" align="center" sortable="custom"></el-table-column>
                                <el-table-column prop="valueLandRate" label="地货比" align="center" sortable="custom">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.valueLandRate?scope.row.valueLandRate+'%':''}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="totalValue" label="项目总货值(亿元)" align="center" width="90" sortable="custom"></el-table-column>
                                <el-table-column prop="landFinalPrice" label="土地成交价款(亿元)" align="center" width="90" sortable="custom"></el-table-column>
                                <el-table-column prop="designPrincipal" label="设计负责人" align="center"></el-table-column>
                            </el-table>

                            <el-table  v-show="type==2"
                                    stripe
                                    class="huo-list-table main-theme-table huojv-data-list2 huojv-sortable"
                                    size="mini"
                                    highlight-current-row
                                    @sort-change="sortChange"
                                    :data="tableList"
                                    :default-sort="{prop: 'volumeUsageRate', order: 'descending'}"
                            >
                                <el-table-column type="index" label="序号" align="center"></el-table-column>
                                <el-table-column prop="projectName" label="项目名称" align="center" width="120">
                                    <template slot-scope="scope">
                                        <span :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.projectGUID,6)">{{scope.row.projectName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="actualVolumeRate" label="实际容积率" align="center" width="90"
                                                sortable="custom"></el-table-column>
                                <el-table-column prop="planVolumeRate" label="规划容积率" align="center" width="90"
                                                sortable="custom"></el-table-column>
                                <el-table-column prop="volumeUsageRate" label="使用比率" align="center" width="90"
                                                sortable="custom">
                                    <template slot-scope="scope">
                                        {{scope.row.volumeUsageRate!='-'?scope.row.volumeUsageRate+'%':scope.row.volumeUsageRate}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="designPrincipal" label="设计负责人" align="center"></el-table-column>
                            </el-table>

                            <el-table v-show="type==3"
                                    stripe
                                    class="huo-list-table main-theme-table huojv-data-list2 huojv-sortable"
                                    size="mini"
                                    highlight-current-row
                                    @sort-change="sortChange"
                                    :data="tableList"
                                    :default-sort="{prop: 'sellableRate', order: 'descending'}"
                            >
                                <el-table-column type="index" label="序号" align="center"></el-table-column>
                                <el-table-column prop="projectName" label="项目名称" align="center" width="120">
                                    <template slot-scope="scope">
                                        <span :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.projectGUID,6)">{{scope.row.projectName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="sellableRate" label="可售比" align="center" sortable="custom">
                                    <template slot-scope="scope">
                                        {{scope.row.sellableRate!='-'?scope.row.sellableRate+'%':scope.row.sellableRate}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="bldArea" label="建筑面积(万m²)" align="center" width="90"
                                                sortable="custom"></el-table-column>
                                <el-table-column prop="saleArea" label="可售面积(万m²)" align="center" width="90"
                                                sortable="custom"></el-table-column>
                                <el-table-column prop="designPrincipal" label="设计负责人" align="center"></el-table-column>
                            </el-table>
                        </div>
                        <div v-else key="2">
                             <el-table v-show="type==3"
                                    stripe
                                    class="huo-list-table main-theme-table huojv-data-list2 huojv-sortable"
                                    size="mini"
                                    highlight-current-row
                                    @sort-change="sortChange"
                                    :data="tableList"
                                    :default-sort="{prop: 'sellableRate', order: 'descending'}"
                            >
                                <el-table-column label="序号" type="index" align="center"></el-table-column>
                                <el-table-column prop="period" label="分期" align="center"></el-table-column>
                                <el-table-column prop="bldName" label="楼栋" align="center"></el-table-column>
                                <el-table-column prop="sellableRate" label="可售比(%)" align="center"></el-table-column>
                                <el-table-column prop="saleArea" label="可售面积(㎡)" align="center"></el-table-column>
                                <el-table-column prop="bldArea" label="总建筑面积(㎡)" align="center"></el-table-column>
                            </el-table>
                        </div>
					</van-list>
				</div>

			</div>
		</van-pull-refresh>
	</div>
</template>

<script>
    import {
        mapState
    } from 'vuex'
    import scrollFixed from '@/mixin/scroll-fixed';
    import {
        List,
        PullRefresh,
        Toast,
        NavBar
    } from 'vant';
    import $ from 'jquery';
    import {
        getLocalStorage
    } from '@/utils/local-storage';
    import request from '@/utils/request';
    import {
        getUrlParam, jumpToPj
    } from '@/utils/common';
    import echarts from 'echarts'


    export default {
        mixins: [scrollFixed],

        data() {
            return {
                // orgId: getLocalStorage(['orgId']).orgId,

                type: 1,
                title: '',
                loading: false, //上拉加载
                isLoading: false, //下拉刷新,从第一页开始
                isLoad: false,
                finished: false, //下拉加载完,如果没有数据设置true
                tableList: [],
                size: 15,
                current: 1,
                orderParam: '',
                order: 'desc',
                test: '',
                orgType: '',
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
                        'bottom': '4%',
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
                designType: 1
            };
        },

        computed: {
            ...mapState({
                orgId: state => state.orgId || getLocalStorage(['orgId']).orgId
            })
        },

        watch: {
            '$store.state.orgId': function (newVal, oldVal) {
                this.init();
                // this.onRefresh();
            }
        },
        mounted() {
            this.init();

            this.$nextTick(() => {
                // $('.data-list-title').scroll(function () {
                //     let scrollLeft = $(this).scrollLeft();
                //     $('.data-list-data').scrollLeft(scrollLeft);
                // });
                //
                // $(".data-list-data").scroll(function () {
                //     let scrollLeft = $(this).scrollLeft();
                //     $('.data-list-title').scrollLeft(scrollLeft);
                // })

                $('.el-table__header-wrapper').scroll(function () {
                    let scrollLeft = $(this).scrollLeft();
                    $(this).next().scrollLeft(scrollLeft);
                });
            })
        },

        methods: {
            jumpToPj,
            reloadWindow() {
                setTimeout(() => {
                    window.location.reload()
                    this.isLoading = false;
                }, 500)
            },
            onClickLeft() {
                // window.history.go(-1);
                this.$router.go(-1)
            },
            init() {
                this.orgType = this.$route.query.orgType;
                this.current = 1;
                this.tableList = [];
                this.type = this.$route.query.type;
                this.designType = this.$route.query.designType;

                if (this.type == 1) {
                    this.title = '货地比分析'
                    // valuePriceRate:货地比;  totalValue:项目总货值;  landFinalPrice:土地成交价款
                    this.orderParam = 'valuePriceRate'
                } else if (this.type == 2) {
                    this.title = '容积率使用情况'
                    // actualVolumeRate:实际容积率;planVolumeRate:规划容积率;volumeUsageRate:使用比率
                    this.orderParam = 'volumeUsageRate'
                    this.getChartsData1();
                } else if (this.type == 3) {
                    this.title = '可售比分析'
                    // sellableRate:可售比;saleArea:建筑面积;bldArea:可售面积
                    this.orderParam = 'sellableRate'
                }
            },

            getChartsData1() {
                request({
                    url: `/app-api/productDesign/getFARUsage`,
                    method: 'post',
                    data: {
                        orgId: this.orgId,
                        designType: this.designType
                    }
                }).then(({data}) => {
                    if (data.code === 0 && data.data) {
                        this.drawChart1(data.data);
                    }else{
                        this.drawChart1([]);
                    }
                }).catch((e) => {
                    this.drawChart1([]);
                });
            },

            // 绘制柱状图表
            drawChart1(data) {
                let xAxisData = ['≤2.0','2.0~3.5','3.5~5.0','≥5.0'],
                    chartData1 = ['-','-','-','-'];

                data.forEach(item => {
                    chartData1[parseInt(item.range) - 1] = item.projectCount;
                })

                // data.forEach(item => {
                //     xAxisData.push(item.projectName);
                //     chartData1.push(item.constructionAreaUnitCostLimit  && item.constructionAreaUnitCostLimit.amountYuan || '-');
                //     chartData2.push(item.saleAreaUnitCostLimit && item.saleAreaUnitCostLimit.amountYuan || '-');
                // })

                let series = [{
                    name: '个数',
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
                option.yAxis.name = `单位：个`;
                // X轴太长了 换行
                option.xAxis.axisLabel.formatter = function(params){
                    var newParamsName = "";// 最终拼接成的字符串
                    var paramsNameNumber = params.length;// 实际标签的个数
                    var provideNumber = 10;// 每行能显示的字的个数
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
                        let value = params[i].value + '个';
                        let marker = params[i].marker;

                        showHtm += '<div style="line-height: 16px;">' + marker + text + value + '</div>';
                    }

                    return showHtm;
                };

                option.xAxis.data = xAxisData;

                // x轴初始化只显示4个柱状图  超过4个滑动显示
                if (xAxisData.length > 5) {
                    option.dataZoom[0].endValue = xAxisData[4];
                } else {
                    option.dataZoom[0].endValue = xAxisData[xAxisData.length - 1];
                }
                option.dataZoom[0].startValue = xAxisData[0];
                this.$nextTick(() => {
                    let myChart = new echarts.init(this.$refs.chart1);
                    myChart.setOption(option, true);
                })
            },

            setTableData(isRefresh) {
                let _url = ''
                if (this.type == 1) {
                    _url = '/app-api/productDesign/goodsLandRatio'
                } else if (this.type == 2) {
                    _url = '/app-api/productDesign/plotRatio'
                } else if (this.type == 3) {
                    _url = '/app-api/productDesign/marketableRatio'
                }
                this.test = this.$route.query.orgId + '，' + this.orderParam + '，' + this.order
                request({
                    url: _url,
                    method: 'post',
                    data: {
                        current: this.current,
                        size: this.size,
                        orgId: this.$route.query.orgId,
                        orderParam: this.orderParam,
                        orderParamType: this.order,
                        designType: this.designType
                    }
                }).then(({
                             data
                         }) => {
                    if (data.code == 0) {
                        this.tableList = isRefresh ? data.data : this.tableList.concat(data.data);
                        this.loading = false;
                        this.isLoading = false;
                        this.isLoad = false;

                        if (null == data.data || data.data.length < this.size || this.tableList.length >= data.total) {
                            this.finished = true;
                        } else {
                            if (this.current > 1) {
                                let scrollTop = $(document).scrollTop();
                                $(document).scrollTop(scrollTop - 300);
                            }
                            this.current += 1;
                            this.finished = false;
                        }
                    } else {
                        this.tableList = [];
                        this.current = 1;
                        this.loading = false;
                        this.isLoading = false;
                        this.finished = true;
                        this.isLoad = false;
                    }
                }).catch((e) => {
                    this.tableList = [];
                    this.current = 1;
                    this.loading = false;
                    this.isLoading = false;
                    this.finished = true;
                    this.isLoad = false;
                });
            },
            onLoad() {
                if (this.isLoad) return;
                this.isLoad = true;
                this.setTableData();
            },
            onRefresh() {
                this.current = 1;
                this.loading = false;
                this.isLoading = false;
                this.finished = false;
                this.isLoad = false;
                // this.tableList = [];
                this.setTableData(true);
            },
            sortChange(col) {
                this.tableList = []
                console.log(col)
                this.test = ''
                this.order = col.order == 'ascending' ? 'asc' : 'desc'
                this.orderParam = col.prop
                this.current = 1
                this.loading = false
                this.isLoading = false
                this.finished = false
                this.isLoad = false
                this.setTableData(true)
            },
            // clickHeader(col){
            //   const property = col.property
            // 	console.log(property)
            //   this.orderParam = property
            // 	this.current = 1;
            // 	this.tableList = [];
            // 	this.loading = false;
            // 	this.isLoading = false;
            // 	this.finished = false;
            // 	this.isLoad = false;
            //   this.setTableData()
            // },
        },
        components: {
            [List.name]: List,
            [PullRefresh.name]: PullRefresh,
            [NavBar.name]: NavBar,
            Toast
        }
    };
</script>


<style>
	.huojv-sortable .ascending .sort-caret.ascending {
		border-bottom-color: #266545;
	}

	.huojv-sortable .descending .sort-caret.descending {
		border-top-color: #266545;
	}
</style>
