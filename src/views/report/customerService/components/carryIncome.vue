<template>
	<div class="report-index">
		<div class="main-content" style="width: 100%;">
			<div class="data-content-panel no-top-left-radius clearfix" style="overflow: visible;">
				<p class="boxTitle text-center" style="margin-bottom: 0;">结转收入总体情况</p>
				<div class="scroll-gesture" @touchstart="closeGesture(1)">
					<div class="huojv-costContract-chart-panel" ref="chart1"></div>
					<div v-if="showGesture1 == 1 && orgType > 2 && orgType <= 5" class="gesture">
						<img src="../../../../assets/images/huadong.png">
						<!--                        <div class="gesture-text">向左滑动</div>-->
					</div>
				</div>

				<div v-show="orgType > 5" class="huojv-chart-box-mini" ref="chart2"></div>

				<p class="boxTitle text-center pt-15">结转收入未完成原因分析</p>
				<div class="mb-30 mt-20">
					<el-table
							stripe
							class="huo-list-table main-theme-table huojv-data-list2 rowspanTable"
							ref="tableRef1"
							size="mini" highlight-current-row
							row-key="orgId"
							height="300"
							:data="tableList1"
							:expand-row-keys="expandNodes1"
							:indent="10" lazy
							border
							:load="load"
							:tree-props="{children: 'children', hasChildren: 'hasChildren'}"
					>
						<el-table-column property="orgName" label="组织机构" width="100" fixed>
                            <template slot-scope="scope">
                                    <span v-if="scope.row.orgType == 6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,scope.row.orgType)">{{scope.row.orgName}}</span>
                                    <span v-else>{{ scope.row.orgName }}</span>
                                </template>
                        </el-table-column>
						<el-table-column property="unPaymentsRate" label="未收款100%" align="center" width="90">
							<template slot-scope="scope">
								{{(scope.row.unPaymentsRate || '-') + '%'}}
							</template>
						</el-table-column>
						<el-table-column property="unCompletionRate" label="未取得竣工备案许可证且未达到交付条件" align="center" width="130">
							<template slot-scope="scope">
								{{(scope.row.unCompletionRate || '-') + '%'}}
							</template>
						</el-table-column>
						<el-table-column property="unRepossessionRate" label="未签收楼确认书且未发二次收楼通知书" align="center" width="130">
							<template slot-scope="scope">
								{{(scope.row.unRepossessionRate || '-') + '%'}}
							</template>
						</el-table-column>
<!--						<el-table-column property="unTwiceRepossessionRate" label="未发二次收楼通知书" align="center" width="80">-->
<!--							<template slot-scope="scope">-->
<!--								{{(scope.row.unTwiceRepossessionRate || '-') + '%'}}-->
<!--							</template>-->
<!--						</el-table-column>-->
						<el-table-column property="adUserName" label="负责人" align="center" width="80"></el-table-column>
					</el-table>
				</div>

				<div v-show="orgType <= 5">
					<p class="boxTitle text-center">结转收入明细表</p>
					<div class="mb-30 mt-20">
						<el-table
								stripe
								class="huo-list-table main-theme-table huojv-data-list2 rowspanTable"
								ref="tableRef2"
								size="mini" highlight-current-row
								row-key="orgId"
								height="300"
								:data="tableList2"
								:expand-row-keys="expandNodes2"
								:indent="10" lazy
								border
								:load="load"
								:tree-props="{children: 'children', hasChildren: 'hasChildren'}"
						>
							<el-table-column property="orgName" label="组织机构" width="100" fixed>
                                <template slot-scope="scope">
                                    <span v-if="scope.row.orgType == 6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,scope.row.orgType)">{{scope.row.orgName}}</span>
                                    <span v-else>{{ scope.row.orgName }}</span>
                                </template>
                            </el-table-column>
							<el-table-column property="targetCrossAmount" :label="'目标交楼金额('+ this.unit +')'" align="center" width="80">
                                <template slot-scope="scope">
									{{scope.row.targetCrossAmount|changeVal}}
								</template>
                            </el-table-column>
							<el-table-column property="carriedOverAmount" :label="'已结转收入金额('+ this.unit +')'" align="center" width="80"></el-table-column>
							<el-table-column property="carriedOverRate" label="结转收入完成率" align="center" width="100">
								<template slot-scope="scope">
									{{scope.row.targetCrossAmount|changeVal(scope.row.carriedOverRate)}}
								</template>
							</el-table-column>
							<el-table-column property="adUserName" label="负责人" align="center" width="80"></el-table-column>
						</el-table>
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
    import {handleNum2String, handleDate, getUrlParam, jumpToPj} from '@/utils/common'


    export default {
        mixins: [scrollFixed],
        data() {
            return {
                isLoading: false,
                orgId:this.chooseOrgId,
                orgType: getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType,
                unit: (getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType) <=5 ? '亿':'万',
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
                        'left': '4%',
                        'right': '4%',
                        'bottom': '18%',
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
                        // formatter: (params) => {
                        //   console.log(params)
                        //   return 'aaa'
                        // },
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

                tableList1: [],
                expandNodes1: [],
                leval: 0,
                tableList2: [],
                expandNodes2: [],

                showGesture1:1
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
        filters:{
            // 如果“目标交楼金额”为0或者空， 将“目标交楼金额”和“结转收入完成率”改为“-”
            changeVal(val1, val2){
                if(val1&&parseFloat(val1)>0){
                    if (typeof(val2)==="undefined") { // 没传
                        return val1
                    }else if(typeof(val2)==="object"){
                        return '-'
                    }else{
                        return val2+'%'
                    }
                }
                return '-'
            }
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
                this.unit = (getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType) <=5 ? '亿':'万';

                if(this.orgType <= 5){
                    if(this.orgType > 2){
                        this.showGesture1 = 1;
                    }
                }else {
                    this.getChartData2();
                }

                this.getTableData1();
                this.getChartData1();
                this.getTableData2();
            },

            closeGesture(index){
                this['showGesture' + index] = 0;
            },

            getChartData1(){
                request({
                    url: `/app-api/custonService/carriedIncomeDetailsBarChart`,
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

            drawChart1(data){
                let xAxisData = [];
                let chartData1 = [];
                let chartData2 = [];

                data.forEach(item => {
                    xAxisData.push(item.orgName);
                    chartData1.push(item.targetCrossAmount);
                    chartData2.push(item.carriedOverAmount);
                })

                let series = [{
                    name: '目标交楼金额('+ this.unit +')',
                    type: 'bar',
                    barWidth: this.orgType <= 2 ? '24' : '10',
                    itemStyle: {
                        normal: {
                            color: '#B4A36B'
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
                    name: '已结转收入金额('+ this.unit +')',
                    type: 'bar',
                    barWidth: this.orgType <= 2 ? '24' : '10',
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
                }

                option.legend.data = legendData;
                option.grid.bottom = '10%';
                // option.title.text = '';
                // option.yAxis.name = this.tab3 == 1 ? '单位('+ this.costUnit +')' : '单位('+ this.areaUnit +')';
                option.tooltip.formatter = (params) => {
                    let showHtm = "<div>" + params[0].axisValueLabel + "</div>";
                    let total = 0;
                    for (let i = 0; i < params.length; i++) {
                        //名称
                        let text = params[i].seriesName + '：';
                        //值
                        let value = params[i].value;
                        let marker = params[i].marker;
                        total += parseFloat(value);

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

            getChartData2(){
                request({
                    url: `/app-api/custonService/carriedIncomeDetails`,
                    method: 'get',
                    params: {orgId: this.orgId,root: 1}
                }).then(({data}) => {
                    if (data.code === 0 && data.data) {
                        this.drawChart2(data.data[0])
                    }else{
                        this.drawChart2({})
                    }
                });
            },

	        drawChart2(chartData){
                let legendData = ['未结转收入金额('+ this.unit +')', '已结转收入金额('+ this.unit +')'];
                let pieData = [
                    {
	                    name: '未结转收入金额('+ this.unit +')',
	                    value: chartData.unCarriedOverAmount
                    },
                    {
                        name: '已结转收入金额('+ this.unit +')',
                        value: chartData.carriedOverAmount
                    },
                ];
                let series = [{
                    name: '',
                    type: 'pie',
                    radius: '60%',
                    center: ['50%', '50%'],
                    color: ['#FFC40F', '#0B8348'],
                    avoidLabelOverlap: true,
                    label: {
                        normal: {
                            formatter: (params) => {
                                return params.value + this.unit +'\n占比'+ params.percent + '%'
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
                    console.log(params.data.name)
                    return params.data.name + '：' + params.data.value
                }
                let pie = new echarts.init(this.$refs.chart2);
                pie.setOption(option);
	        },

            getTableData1() {
                request({
                    url: `/app-api/custonService/carriedIncomeDetails`,
                    method: 'get',
                    params:{orgId: this.orgId,root:1}
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
                                _list.splice(i,1);
                                _list.unshift(rootNode);
                                break;
                            }
                        }

                        this.leval = 0;
                        let tree = this.fnGetTree(_list, _parentOrgId);
                        this.expandNodes1 = _expandNodes;

                        this.tableList1 = tree;

                        // this.tableList = _list;

                        // 重新渲染表格 防止表格错位
                        this.$nextTick(() => {
                            if (this.$refs['tableRef1']) {
                                this.$refs['tableRef1'].doLayout()
                            }
                        })
                    }
                }).catch((e) => {
                    console.log('getBoardData-err', e);
                });
            },

            // 获取资源类型明细表格数据
            getTableData2() {
                request({
                    url: `/app-api/custonService/carriedIncomeDetails`,
                    method: 'get',
	                params:{orgId: this.orgId,root:1}
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
                                _list.splice(i,1);
                                _list.unshift(rootNode);
                                break;
                            }
                        }

                        this.leval = 0;
                        let tree = this.fnGetTree(_list, _parentOrgId);
                        this.expandNodes2 = _expandNodes;

                        this.tableList2 = tree;

                        // this.tableList = _list;

                        // 重新渲染表格 防止表格错位
                        this.$nextTick(() => {
                            if (this.$refs['tableRef2']) {
                                this.$refs['tableRef2'].doLayout()
                            }
                        })
                    }
                }).catch((e) => {
                    console.log('getBoardData-err', e);
                });
            },

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

            load(tree, treeNode, resolve) {
                request({
                    url: `/app-api/custonService/carriedIncomeDetails`,
                    method: 'get',
                    params:{orgId: tree.orgId,root:0}
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

            back(){
                sessionStorage.removeItem('saleReceiptPage'); // 返回首页之后清空页面状态
                // this.goPage('/report/saleReceipts');
                // window.history.go(-1);
                this.$emit('changePage',0);
            },

            goMore(pageType){
                this.$router.push({path:'/report/customerService/more', query: {orgId: this.orgId,pageType, token: getUrlParam('token')}});
            },

            goPage(path){
                var search = decodeURIComponent(window.location.search);
                if(!search){
                    search = '?' + decodeURIComponent(window.location.href.split('?')[1]);
                }

                window.location = `#${path + search}`
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
