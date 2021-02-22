<template>
	<div class="report-index pb-20">
			<div class="main-content width100">
                <van-tabs v-model="tab1" class="vanTabs" color="#209B5C" line-width="30px" sticky :ellipsis="false" title-active-color="#209B5C" @change="tabChange1">
                    <van-tab title="本季度" v-eventlisten="{isChangePage:false,pageEvent:'切换到本季度'}" title-style="margin:0 5px"></van-tab>
                    <van-tab title="本年度" v-eventlisten="{isChangePage:false,pageEvent:'切换到本年'}" title-style="margin:0 5px"></van-tab>
                </van-tabs>
                <div class="data-content-panel pd0">
					<div class="data-title1">节点达成率</div>

                    <div class="huojv-chart-box2" style="padding:0 20px 0">
                        <div ref="bar" class="huojv-chart-box-item2"></div>
                        <div class="bar-bottom" :style="{ visibility: tab1==0?'visible':'hidden'}">
                            <label class="chart-title">平均达成率  环比：{{barData.milepostRatio=='-'?barData.milepostRatio:barData.milepostRatio+'%'}}</label>
                            <img v-show="barData.milepostRatio!='-'" class="chart-compare-ico" :src="(barData.milepostRatio < 0 ? icFall : icRise)">
                        </div>
                        <div ref="bar2" class="huojv-chart-box-item2"></div>
                        <div class="bar-bottom" :style="{ visibility: tab1==0?'visible':'hidden'}">
                            <label class="chart-title">平均达成率  环比：{{barData.oneNodeRatio=='-'?barData.oneNodeRatio:barData.oneNodeRatio+'%'}}</label>
                            <img v-show="barData.oneNodeRatio!='-'" class="chart-compare-ico" :src="(barData.oneNodeRatio < 0 ? icFall : icRise)">
                        </div>
                    </div>
                </div>
                <div class="data-content-panel pd0 mt-10">
                    <div class="text-center">
                        <van-tabs v-model="tab3" class="vanTabs" color="#209B5C" line-width="30px" :ellipsis="false" title-active-color="#209B5C" @change="tabChange">
                            <van-tab title="逾期节点情况" v-eventlisten="{isChangePage:false,pageEvent:'切换到逾期节点情况'}" title-style="margin:0 5px"></van-tab>
                            <van-tab title="工期分析" v-eventlisten="{isChangePage:false,pageEvent:'切换到工期分析'}" title-style="margin:0 5px"></van-tab>
                            <van-tab title="里程碑分析" v-eventlisten="{isChangePage:false,pageEvent:'切换到里程碑分析'}" title-style="margin:0 5px"></van-tab>
                            <van-tab title="节点类型分析" v-eventlisten="{isChangePage:false,pageEvent:'切换到节点类型分析'}" title-style="margin:0 5px"></van-tab>
                        </van-tabs>

						<div class="mt--10 mb-15" v-if="tab3 == 0">
							<ul  class="huojv-tabs fs12" style="display: inline-block;width:90%;text-align:center">
								<li @click="checkTab2(1)" v-eventlisten="{isChangePage:false,pageEvent:'切换到里程碑'}"
								    :class="[tab2 == 1 ? 'active' : '']"><label>里程碑({{listTotal[0]?listTotal[0]:0}})</label></li>
								<li @click="checkTab2(2)" v-eventlisten="{isChangePage:false,pageEvent:'切换到一级节点'}"
								    :class="[tab2 == 2 ? 'active' : '']"><label>一级节点({{listTotal[1]?listTotal[1]:0}})</label></li>
								<li @click="checkTab2(3)" v-eventlisten="{isChangePage:false,pageEvent:'切换到二级节点'}"
								    :class="[tab2 == 3 ? 'active' : '']"><label>二级节点({{listTotal[2]?listTotal[2]:0}})</label></li>
							</ul>
						</div>

					</div>

                    <div v-show="tab3 == 0" style="padding:0 20px 20px">
                        <el-table stripe
                                class="huo-list-table main-theme-table huojv-data-list" size="mini" highlight-current-row
                                :data="tableList" v-loading="tableLoad" v-show="tab3 == 0">
                            <el-table-column prop="projectName" label="项目名称" width="120" align="center">
                                <template slot-scope="scope">
                                    <span :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.projectGUID,6)">{{scope.row.projectName}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="taskName" label="逾期节点" width="120" align="center"></el-table-column>
                            <el-table-column prop="overdueDays" label="逾期天数" width="80" align="center"></el-table-column>
                            <el-table-column :prop="orgType<5?'projectManager':'principal'" :label="orgType<5?'项目负责人':'节点负责人'" width="100" align="center"></el-table-column>
                        </el-table>

                        <div class="huojv-data-list-none" v-show="tableList.length <= 0">没有更多了</div>
                        <div class="huojv-data-list-more" v-show="tableList.length > 0" @click="getMore">查看更多
                            <van-icon name="arrow"/>
                        </div>
                    </div>
                    <div v-show="tab3==2||tab3==3" style="margin-bottom:30px;padding:0 20px 0">
                        <div class="huojv-chart-box2">
                            <div ref="barLcb" class="huojv-chart-box-item"></div>
                            <p class="chartTitle">{{tab3==2?'里程碑未按时完成节点分析':'节点类型未按时完成节点分析'}}</p>
                            <div ref="chart" class="huojv-chart-box-item2"></div>
                        </div>
                        <el-table stripe style="margin-top:30px"
					          class="huo-list-table main-theme-table huojv-data-list2 accountTable" size="mini" highlight-current-row
                              empty-text="暂无数据"
                              show-summary
                              :summary-method="getSummaries"
					          :data="tableList">
                            <el-table-column prop="name" :label="tab3==2?'节点名称':'节点类型'" align="center" width="100">
                                <template slot-scope="scope">
                                    <span class="goTxt" v-if="scope.row.undone>0||scope.row.complete>0" @click="getMore(scope.row.id)">{{scope.row.name}}</span>
                                    <span v-else>{{scope.row.name}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="undone" label="逾期未完成" align="center"></el-table-column>
                            <el-table-column prop="complete" label="逾期完成" align="center"></el-table-column>
                            <el-table-column prop="rate" label="未按时完成统计占比" align="center">
                                <template slot-scope="scope">
                                   {{scope.row.rate&&scope.row.rate!='/'?scope.row.rate+'%':scope.row.rate}}
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>

	                <!-- 工期分析 组织机构不为项目 -->
	                <project-limit-analysis1 v-if="tab3 == 1" ref="projectLimitAnalysis1"></project-limit-analysis1>
                </div>
			</div>
	</div>
</template>

<script>
    import {mapState} from 'vuex'
    import scrollFixed from '@/mixin/scroll-fixed';
    import echarts from 'echarts'
    import {getLocalStorage} from '@/utils/local-storage';
    import {getUrlParam, jumpToPj} from '@/utils/common';
    import {Icon, PullRefresh,Tab, Tabs} from 'vant';
    import $ from 'jquery';
    import request from '@/utils/request';
    import ic_fall from '@/assets/images/ic_fall@2x.png'
    import ic_rise from '@/assets/images/ic_rise@2x.png'
    import projectLimitAnalysis1 from "../components/projectLimitAnalysis1";

    export default {
        mixins: [scrollFixed],
        data() {
            return {
                tab1: 1,  // 本季度  本年度
                tab2: 1, // 1 里程碑， 2 一级节点, 3 二级节点
                tab3: 0, // 逾期节点、工期分析
                isLoading: false,
                icFall: ic_fall,
                icRise: ic_rise,
                orgType: getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType,
                barOption: {
                    tooltip: {
                        trigger: 'axis',
                        // formatter: function(param){
                        //     return param
                        //     debugger
                        // }
                        // formatter: "{b}<br/>{a0}：{c0}"+this.unit+"<br/>{a1}：{c1}"+this.unit+"<br/>{a2}：{c2}"+this.unit+"<br/>{a3}：{c3}"+this.unit+"<br/>合计："
                    },
                    title: {
                        text: '',
                        show: true,
                        textStyle: {
                            fontWeight: 500,
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
                            fontSize: 10,
                            color: '#999999'
                        },
                        data: []  //注：需接口获取
                    },
                    grid: {
                        'left': '9%',
                        'right': '4%',
                        'bottom': '5%',
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
                        triggerEvent: true,
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
                                fontSize: 10,
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
                        min: 0,
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#666666',
                            }
                        }
                    },
                    series: [],
                },
                tableLoad: false,
                size: 6,
                current: 1,
                tableList: [],
                barData: {},
                taskTypeName: '',
                listTotal: [],
                // orgId: getUrlParam('chooseOrgId') || getUrlParam('orgId') || getLocalStorage('orgId').orgId
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
            }
        },
        mounted() {
            this.init();

            this.$nextTick(() => {
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
                    window.location.reload();
                    this.isLoading = false;
                }, 500)
            },
            // 季度 年底tab切换
            tabChange1(idx){
                this.tab1 = idx
                this.init();
            },

            checkTab2(tab2) {
                this.tab2 = tab2;
                this.getTableDate();
            },
            // 跳转查看更多页面
            getMore(tkid) {
                let taskTypeId = ''
                let tabIndex = 1
                if (this.tab3 == 2||this.tab3 == 3) {
                    //tab3 == 2? 里程碑分析详情 :  '节点类型分析'
                    tabIndex = this.tab3 == 2?99:100

                    sessionStorage.planTab1 = this.tab1;
                    sessionStorage.planTab2 = this.tab2;
                    sessionStorage.planTab3 = this.tab3;

                    this.$router.push({
                        path: '/moreList',
                        query: {
                            orgType: getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType,
                            token: getUrlParam('token'),
                            taskID: tkid,  // 里程碑分析取taskID ，节点类型分析取 rowNum
                            tab2: tabIndex,
                            dateType: this.tab1==0?'quarter':'year',
                            orgId: getUrlParam('chooseOrgId') || getUrlParam('orgId') || getLocalStorage('orgId').orgId,
                        }
                    });
                    return false
                }


                if(this.tab2 == 1){
                    taskTypeId = '里程碑'
                    tabIndex = 1
                }else if(this.tab2 == 2){
                    taskTypeId = '一级'
                    tabIndex = 2
                }else if(this.tab2 == 3){
                    taskTypeId = '二级'
                    tabIndex = 3
                }
                // else if(this.tab2 == 4){
                //     // title = '拿地至开盘工程分析';
                //     tabIndex = 3
                // }else if(this.tab2 == 5){
                //     // title = '拿地至交付工程分析';
                //     tabIndex = 4
                // }

                sessionStorage.planTab1 = this.tab1;
                sessionStorage.planTab2 = this.tab2;
                sessionStorage.planTab3 = this.tab3;

                this.$router.push({
                    path: '/moreList',
                    query: {
                        taskTypeId: taskTypeId,
                        token: getUrlParam('token'),
                        orgId: getUrlParam('chooseOrgId') || getUrlParam('orgId') || getLocalStorage('orgId').orgId,
                        orgType:getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType,
                        tab2: tabIndex
                    }
                });
            },
            // 初始化页面
            init() {
                this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType;
                // this.orgId = getUrlParam('chooseOrgId') || getUrlParam('orgId') || getLocalStorage('orgId').orgId
                if(sessionStorage.planTab1){
            		this.tab1 = parseInt(sessionStorage.planTab1);
            		sessionStorage.removeItem('planTab1')
                }
                if(sessionStorage.planTab2){
            		this.tab2 = parseInt(sessionStorage.planTab2);
            		sessionStorage.removeItem('planTab2')
				}
            	if(sessionStorage.planTab3){
            		this.tab3 = parseInt(sessionStorage.planTab3)
					sessionStorage.removeItem('planTab3')
                }

                this.listTotal = []
                // this.tab2 = 1

                this.getBarData()
                if (this.tab3 ==2||this.tab3 == 3) {
                    this.getlcpData()
                } else {
                    this.getTableDate()
                }

                if (this.orgType>=6) {
                    this.tab3 = 0
                }
            },
            // 获取柱图数据
            getBarData() {
                console.log('bar')
                request({
                    url: `/app-api/plan/schedule/areaCompletionRate`,
                    method: 'post',
                    data: {
                        orgId : this.orgId
                        // orgId: 'AA90A163-F782-4B78-4584-08D7E5E57C34'
                    }
                }).then(res => {
                    console.log(res);
                    if (res&&res.data.code==0) {
                        this.barData = res.data.data

                        // avgMilepostAchievementRateQuarter //本季里程碑达成率平均值 ,
                        // avgPrimaryNodeAchievementRateQuarter //本季一级节点达成率平均值 ,
                        // avgPrimaryNodeAchievementRateYear //本年一级节点达成率平均值 ,
                        // avgMilepostAchievementRateYear //本年里程碑达成率平均值 ,

                        // milepostAchievementRateQuarterVo //本季里程碑达成率返回对象
                        // primaryNodeAchievementRateQuarterVo //本季一级节点达成率返回对象

                        // milepostAchievementRateYearVo //本年里程碑达成率返回对象
                        // primaryNodeAchievementRateYearVo //本年一级节点达成率返回对象

                        // milepostRatio // 里程碑节点达成率-环比 ,
                        // oneNodeRatio //一级节点达成率-环比 ,

                        if (this.tab1 == 0) { //季度
                            this.setBar(res.data.data.milepostAchievementRateQuarterVo ,'bar','里程碑','#B4A36B',res.data.data.avgMilepostAchievementRateQuarter,'公司平均')
                            this.setBar(res.data.data.primaryNodeAchievementRateQuarterVo,'bar2','一级节点','#B4A36B',res.data.data.avgPrimaryNodeAchievementRateQuarter,'公司平均')
                        } else{
                            this.setBar(res.data.data.milepostAchievementRateYearVo,'bar','里程碑','#B4A36B',res.data.data.avgMilepostAchievementRateYear,'公司平均')
                            this.setBar(res.data.data.primaryNodeAchievementRateYearVo,'bar2','一级节点','#B4A36B',res.data.data.avgPrimaryNodeAchievementRateYear,'公司平均')
                        }
                    }
                });
            },
            // 柱图展示
            setBar(data,el,title,_color,_middle,markLineTxt){
                // el 为 barLcb表示里程碑分析和任务分布分析
                let barData = [];
                let series = []
                let tool = []
                let legendData = []
                let middle = 0
                let max = 0
                let option = JSON.parse(JSON.stringify(this.barOption));
                if (data&&data.length>0) {
                    legendData = data.map(item=>{
                        if (el == 'barLcb') {
                            return item.name
                        } else {
                            return item.projectName
                        }
                    })
                    barData = data.map(item=>{
                        if (el == 'barLcb') {
                            return item.rate
                        }else {
                            if (title=='里程碑') {
                                return this.tab1 == 1 ? item.milepostAchievementRateYear : item.milepostAchievementRateQuarter
                            } else {
                                return this.tab1 == 1 ? item.primaryNodeAchievementRateYear : item.primaryNodeAchievementRateQuarter
                            }
                        }
                    })
                    console.log(this.tab1 == 1 ?'年':'季度')
                    series.push({
                        type: 'bar',
                        barMaxWidth: '24',
                        itemStyle: {
                            normal: {
                                color: _color
                            }
                        },
                        data: barData
                    })
                }

                for (let i = 0; i < barData.length; i++) {
                    middle = middle + parseFloat(barData[i])
                }
                console.log(middle)


                // 设置中位线
                series.push({
                    name: '合计',
                    type: 'line',  // 平均值
                    data: (function() {
                        let sum = []
                        for (let i in barData) {
                            if(!sum[i]){
                                sum[i] = 0
                            }
                            sum[i] += parseFloat(barData[i])
                            if (max<=sum[i]) {
                                max = sum[i]
                            }
                        }
                        // return sum
                    })(),
                    itemStyle: {
                        opacity: 0
                    },
                    lineStyle: {
                        opacity: 0
                    },
                    markLine: {
                        symbol: "none",
                        data: [
                            {
                                type: 'average',
                                name: markLineTxt,
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
                                    backgroundColor: '#fff',
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
                                yAxis: _middle
                            },
                        ]
                    }
                })

                // 进度条
                if (data.length>5) {
                    option.dataZoom = [{
                        type: 'inside',
                        show: true,
                        xAxisIndex: [0],
                        left: '9%',
                        bottom: 0,
                        height: 10,
                        start: 0,
                        zoomLock: true,
                        end: 4/legendData.length*100 //初始化滚动条
                    }]
                }


                // if (max>=500) {
                //     option.yAxis.max = parseInt(max + 50)
                // } else if (500>max&&max>=100) {
                //     option.yAxis.max = parseInt(max + 10)
                // } else if (100>max) {
                    // console.log('max',max)
                    option.yAxis.max = 100
                // }


                let that = this
                option.series = series;
                // option.legend.data = tool;
                option.tooltip.formatter = function(param){
                    let name = param[0].name.length>8? param[0].name.substr(0,8)+'<br>'+param[0].name.substr(8,param[0].name.length): param[0].name
                    return name+'<br>'+ param[0].marker+param[0].value+'%'
                }
                option.xAxis.data = legendData
                option.xAxis.axisLabel.rotate = 20
                option.title.text = title
                if(el=='barLcb'&&this.tab3==3){
                    option.xAxis.axisLabel.textStyle.color = '#4472C4'
                    option.xAxis.axisLabel.textStyle.backgroundColor = {
                        image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABLCAYAAAA1fMjoAAAA5UlEQVR4nO3VAQ2AMBAEwYI2FKERX4+BdhXMSLhkc9fMzAK2brPAmUAgCASCQCAIBIJAIAgEgkAgCASCQCAIBIJAIAgEgkAgCASCQCAIBIJAIAgEgkAgCASCQCAIBIJAIAgEgkAgCASCQCAIBIJAIAgEgkAgCASCQCAIBIJAIAgEgkAgCASCQCAIBIJAIAgEgkAgCASCQCAIBIJAIAgEgkAgCASCQCAIBIJAIAgEgkAgCASCQCAIBIJAIAgEgkAgCASCQCAIBIJAIAgEwvW83xgI9jwIBIFAEAgEgUAQCASBwMla6wfq+AcKdpjK7wAAAABJRU5ErkJggg==',
                        width:100,
                        height:50,
                    }
                }

                // debugger
                let myChart = new echarts.init(this.$refs[el]);
                myChart.setOption(option, true);


                //
                if (el=='barLcb'&&this.tab3==3) {
                    let that = this
                    myChart.off('click')
                    myChart.on('click', function (params) {
                        let componentType = params.componentType
                        if(componentType == "xAxis"){
                            console.log(params);
                            let _idx = data.findIndex( i => i.name == params.value)

                            sessionStorage.planTab1 = that.tab1;
                            sessionStorage.planTab2 = that.tab2;
                            sessionStorage.planTab3 = that.tab3;
                            that.$router.push({
                                path: '/planProgress/detail',
                                query: {
                                    token: getUrlParam('token'),
                                    orgId: that.orgId,
                                    orgType: getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType,
                                    rowNum: data[_idx].rowNum
                                }
                            });
                        }
                    });
                }
            },
            // 切换分析类型标签tab
            tabChange (idx) {
                this.tab3 = idx;
                if(idx == 0){
                    this.tab2 = 1;
                    this.getTableDate();
                }else if(idx == 1){
                    this.tab2 = 4;
                    this.getTableDate();
                }else if(idx == 2||idx == 3){
                    this.getlcpData()
                }
            },
            getTableDate() {
                if (this.tab3 == 0) {
                    // todo 这里只有里程碑和一级节点吗？ PC端还有二级节点和三级节点
                    let taskTypeName = ''
                    if (this.tab2 == 1) {
                        taskTypeName = '里程碑'
                    } else if (this.tab2 == 2) {
                        taskTypeName = '一级'
                    } else {
                        taskTypeName = '二级'
                    }
                    this.tableLoad = true
                    request({
                        url: `/app-api/plan/schedule/overdueList?orgId=${this.orgId}&size=${this.size}&current=${this.current}&taskTypeName=${taskTypeName}`,
                        method: 'get'
                    }).then(({data}) => {
                        if (data.code === 0) {
                            this.tableList = data.overdueList;
                            this.listTotal = [data.milepostTotal, data.oneNodeTotal, data.twoNodeTotal]
                        }
                        this.tableLoad = false
                    }).catch((e) => {
                        console.log('getEchartData-err', e);
                    });
                } else if (this.tab3 == 1) {
                    request({
                        url: `/app-api/plan/schedule/workDayList`,
                        method: 'post',
	                    data: {
                            current: 1,
                            orgId: this.orgId,
                            orgType: getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType,
                            size: this.size
                        }
                    }).then(({data}) => {
                        if (data.code === 0) {
                            if(this.tab2 == 4){
                                this.tableList = data.data.landOpens;
                            }else if(this.tab2 == 5){
                                this.tableList = data.data.landDelivers;
                            }
                        }
                    }).catch((e) => {
                        console.log('getEchartData-err', e);
                    });
                }


            },

            // 里程碑分析
            getlcpData() {
                // year:年度,quarter:季度
                let _url = ''
                if (this.tab3==2) {  // 里程碑分析
                    _url = '/app-api/plan/schedule/milepost'
                } else if (this.tab3==3) {   //节点类型分析
                    _url = '/app-api/plan/schedule/profession'
                }
                this.tableList = []
                request({
                    url: _url,
                    method: 'post',
                    data: {
                        dateType: this.tab1==0?'quarter':'year',
                        orgId : getUrlParam('chooseOrgId') || getUrlParam('orgId') || getLocalStorage('orgId').orgId
                    }
                }).then(res => {
                    console.log(res);
                    if (res&&res.data.code==0) {
                        if (this.tab3==2) { // 里程碑分析
                            //柱状图
                            let middle = this.tab1==0 ? res.data.data.milepostAchievementRateAveQuarter : res.data.data.milepostAchievementRateAveYear
                            let _barData = res.data.data.milepostHistogramVo.map(item => {
                                return {
                                    name: item.taskNames,
                                    rate: item.taskAchievementRate,
                                }
                            })
                            this.setBar(_barData,'barLcb','','#B4A36B',middle,'平均完成率')
                            // 表格
                            this.tableList = res.data.data.milepostIncompleteVo.map(item => {
                                return {
                                    complete: item.overdueComplete,
                                    undone: item.overdueUndone,
                                    id: item.taskID,
                                    name: item.taskNames,
                                    rate: item.undoneOnTimeRate,
                                }
                            });
                            // 散点
                            let points = res.data.data.milepostQuadrantVo.map( item => {
                                return {
                                    name: item.taskNames,
                                    value: [item.overdueDay, item.taskAchievementRate]
                                }
                            })
                            // 象限图平均数
                            let rateY = this.tab1 == 0 ? res.data.data.milepostAchievementRateQuarter : res.data.data.milepostAchievementRateYear, // 完成率平均数
                                rateX = res.data.data.overdueAmount  // 逾期天数平均数
                            this.getPointData('chart', points, rateX, rateY)

                        } else if (this.tab3==3) {  //节点类型分析
                            //柱状图
                            let middle = this.tab1==0 ? res.data.data.milepostAndPrimaryNodeRateAveQuarter : res.data.data.milepostAndPrimaryNodeRateAveYear
                            let _barData = res.data.data.professionHistogramVo.map(item => {
                                return {
                                    name: item.professionName,
                                    rate: item.taskAchievementRate,
                                    rowNum: item.rowNum
                                }
                            })
                            // this.setBar(_barData,'bar','','#B4A36B',middle)
                            this.setBar(_barData,'barLcb','','#B4A36B',middle,'平均完成率')

                            // 表格
                            this.tableList = res.data.data.professionIncompleteVo.map(item => {
                                return {
                                    complete: item.overdueComplete,
                                    undone: item.overdueUndone,
                                    id: item.rowNum,  // 跳转详情的id，取rowNum
                                    name: item.professionName,
                                    rate: item.undoneOnTimeRate,
                                }
                            });
                            // 散点
                            let points = res.data.data.professionQuadrantVo.map( item => {
                                return {
                                    name: item.professionName,
                                    value: [item.overdueDay, item.taskAchievementRate ]
                                }
                            })
                            // 象限图平均数
                            let rateY = this.tab1 == 0 ? res.data.data.milepostAndPrimaryNodeRateQuarter : res.data.data.milepostAndPrimaryNodeRateYear, // 完成率平均数
                                rateX = res.data.data.overdueAmount  // 逾期天数平均数
                            this.getPointData('chart', points, rateX, rateY)
                        }
                    }
                });
            },
            // 里程碑分析图表 点图
            getPointData(el,marksData,rateX,rateY){
                rateX = rateX ? rateX : 0
                rateY = rateY ? rateY : 0

                let colors = ['rgba(255,0,0,0.18)', 'rgba(255,0,0,0.02)', 'rgba(255,0,0,0.08)', 'rgba(255,0,0,0.25)']
                if (rateY>=100) {
                    colors = ['rgba(255,0,0,0)', 'rgba(255,0,0,0)', 'rgba(255,0,0,0)', 'rgba(255,0,0,0)']
                } else if (rateY<=0) {
                    colors = ['rgba(255,0,0,0.25)', 'rgba(255,0,0,0.25)', 'rgba(255,0,0,0.25)', 'rgba(255,0,0,0.25)']
                }

                let centerLine = [
                    {
                        name: 'x', xAxis: rateX
                    },
                    {
                        name: 'y', yAxis: rateY
                    }
                ],
                // 中心点
                centerMark = [
                    {
                        value: '中心点', coord: [rateX, rateY]
                    }
                ],

                option = {
                    tooltip: {
                        trigger: 'axis',
                        formatter(params) {
                            let str = ''
                            for (let i = 0; i < params.length; i++) {
                                const item = params[i]
                                if (item.data.name=='经营性现金流回正') {
                                    str += item.marker +'经营性现金<br><span style="padding-left:15px">流回正</span>：'+item.value[1]+'%<br>'
                                }else{
                                    str += item.marker + item.data.name+'：'+item.value[1]+'%<br>'
                                }
                            }
                            return str +'<p style="width:100%;height:1px;background:rgb(204, 204, 204);margin:5px auto"></p>逾期次数：'+params[0].value[0]
                        },
                        textStyle: {
                            fontSize: 12
                        },
                    },
                    grid: {
                        left: '2%',
                        right: '13%',
                        bottom: '5%',
                        top: '15%',
                        containLabel: true
                    },
                    xAxis: {
                        name: '逾期次数',
                        nameTextStyle: {
                            color: '#333',
                            fontSize: 12,
                            padding: [55, 0, 0, -40]
                        },
                        nameLocation: 'end',
                        // nameGap: 10,
                        // nameRotate:30,
                        scale: true,
                        axisLine: {
                            lineStyle: {
                                color: '#ddd',
                            }
                        },
                        min: 0,
                        max: function (value) {
                            if (value.max<rateX) {
                                return parseFloat(rateX) + parseFloat(rateX)/3;
                            }else{
                                return parseFloat(value.max) + parseFloat(value.max)/3;
                            }

                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            color: '#666'
                        },
                        splitLine: {show: false}
                    },
                    yAxis: {
                        name: '节点完成率',
                        nameTextStyle: {
                            color: '#333',
                            fontSize: 12,
                            // padding: [0, 0, 10, 0]
                        },
                        scale: true,
                        axisLine: {
                            lineStyle: {
                                color: '#ddd'
                            }
                        },
                        min: 0,
                        max: 100,
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            formatter(params) {
                                return params + '%'
                            },
                            color: '#666'
                        },
                        splitLine: {
                            lineStyle: {
                                color: '#ddd'
                            }
                        },
                    },
                    series: [{
                        type: 'scatter',
                        data: marksData,
                        symbolSize: 8,
                        label: {
                            show: true,
                            position: 'right',
                            formatter: '{b}',
                            fontSize: 10,
                            color: '#666666'
                        },
                        itemStyle: {
                            color: '#4bad7b'
                        },
                        // 各象限区域
                        markArea: {
                            silent: true,
                            data: [
                                // 第一象限
                                [{
                                    name: '',
                                    xAxis: rateX, // x 轴开始位置
                                    yAxis: 100, // y 轴结束位置(直接取最大值)
                                    itemStyle: {
                                        color: colors[0]
                                    },
                                }, {
                                    yAxis: rateY // y轴开始位置
                                }],
                                // 第二象限
                                [{
                                    name: '',
                                    yAxis: 100, // y 轴结束位置(直接取最大值)
                                    itemStyle: {
                                        color: colors[1]
                                    },
                                }, {
                                    xAxis: rateX, // x 轴结束位置
                                    yAxis: rateY // y轴开始位置
                                }],
                                // 第三象限
                                [{
                                    name: '',
                                    yAxis: rateY, // y 轴结束位置
                                    itemStyle: {
                                        color: colors[2]
                                    },
                                }, {
                                    xAxis: rateX, // x 轴结束位置
                                    yAxis: 0 // y轴开始位置
                                }],
                                // 第四象限
                                [{
                                    name: '',
                                    xAxis: rateX, // x 轴开始位置
                                    yAxis: rateY, // y 轴结束位置
                                    itemStyle: {
                                        color: colors[3]
                                    },
                                }, {
                                    yAxis: 0 // y轴开始位置
                                }]
                            ]
                        },
                        // 中心点交集象限轴
                        markLine: {
                            symbol: "none",
                            type: 'line',
                            silent: true, // 是否不响应鼠标事件
                            precision: 2, // 精度
                            lineStyle: {
                                type: 'dashed',
                                color: '#E74D4D'
                            },
                            label: {
                                distance: 0,
                                show: true,
                                formatter(params) {
                                    if (params.data.name == 'y') {
                                        return params.data.value + '%'
                                    } else {
                                        return params.data.value
                                    }
                                },
                                // position: 'insideEndTop'
                            },
                            data: centerLine
                        },
                        // 中心点
                        // markPoint: {
                        //     symbol: 'none',
                        //     symbolSize: 0,
                        //     itemStyle: {
                        //         color: 'rgba(234, 85, 6, .8)'
                        //     },
                        //     label: {
                        //         position: 'top'
                        //     },
                        //     data: centerMark
                        // }
                    }]
                }

                let myChart = new echarts.init(this.$refs[el]);
                myChart.clear()
                myChart.setOption(option, true);
            },
            getSummaries(param) {
                const { columns, data } = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '合计';
                        return;
                    }
                    const values = data.map(item => Number(item[column.property]));
                    sums[index] = values.reduce((prev, curr) => {
                        const value = Number(curr);
                        if (!isNaN(value)) {
                            return prev + curr;
                        } else {
                            return prev;
                        }
                    }, 0);
                    if (index === 3) {
                        sums[index] = sums[index].toFixed(2) +'%'
                    }else{
                        sums[index]
                    }

                });

                return sums;
            }
        },
        components: {
            [Icon.name]: Icon,
            [PullRefresh.name]: PullRefresh,
            [Tab.name]: Tab,
            [Tabs.name]: Tabs,
            projectLimitAnalysis1
        }
    };
</script>


<style lang="scss" scoped>
.bar-bottom{
    font-size: 12px;
    color: #333333;
    font-weight:500;
    text-align: center;
    margin-bottom: 45px;
}
.chart-compare-ico{
      width: 11px;
      height: 11px;
      margin-left: 5px;
}
.fs12 li{
    font-size: 12px ;
}
.chartTitle{
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    margin: 15px auto;
    color: #333;
}
.goTxt{
    color: #4472C4;
    text-decoration: underline;
}
.vanTabs{
    margin-bottom: 15px;
    border-bottom: 1px solid #E8E8E8;
}
</style>
