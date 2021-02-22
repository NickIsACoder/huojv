<template>
	<div class="report-index pb-20">
		<van-pull-refresh v-model="isLoading" success-text="刷新成功" loading-text="正在刷新..." @refresh="reloadWindow()">
            <regional  v-if="orgType==5" />
			<div class="main-content width100" v-else>
				<!-- 项目层级不显示 -->
                <van-tabs v-show="orgType < 6" v-model="tab1" class="vanTabs" color="#209B5C" line-width="30px" sticky :ellipsis="false" title-active-color="#209B5C" @change="tabChange1">
                    <van-tab title="本季度" title-style="margin:0 5px">
                        <div slot="title">
                            <span v-eventlisten="{isChangePage:false,pageEvent:'点击计划进度-本季度'}">本季度</span>
                        </div>
                    </van-tab>
                    <van-tab title="本年度" title-style="margin:0 5px">
                        <div slot="title">
                            <span v-eventlisten="{isChangePage:false,pageEvent:'点击计划进度-本年度'}">本年度</span>
                        </div>
                    </van-tab>
                </van-tabs>
				<!-- <ul class="huojv-tab-bars">
					<li @click="checkTab1(1)" v-eventlisten="{isChangePage:false,pageEvent:'切换到本季度'}"
					    :class="[tab1 == 1 ? 'active' : '']">本季度
					</li>
					<li @click="checkTab1(2)" v-eventlisten="{isChangePage:false,pageEvent:'切换到本年'}"
					    :class="[tab1 == 2 ? 'active' : '']">本年度
					</li>
				</ul> -->

				<!-- 项目层级不为6时显示 -->
				<div class="data-content-panel pd0" v-if="orgType < 6">
					<div class="data-title1"><label>节点达成率</label></div>

					<ul class="data-info-list3 mb-30">
						<li>
							<!--						<div class="chart-box" ref="chart1"></div>-->
							<div class="chart-data-title">里程碑节点</div>
							<div class="chart-data-content"
							     v-show="parseFloat(tab1 === 0 ? chartData.milepostAchievementQuarterRate : chartData.milepostAchievementRate)"
							     v-text="((tab1 === 0 ? chartData.milepostAchievementQuarterRate : chartData.milepostAchievementRate) || 0) + '%'"></div>
							<div class="chart-data none-data" v-show="!parseFloat(tab1 === 0 ? chartData.milepostAchievementQuarterRate : chartData.milepostAchievementRate)">当期无数据</div>

							<div v-show="parseFloat(tab1 === 0 ? chartData.milepostAchievementQuarterRate : chartData.milepostAchievementRate)">
								<label class="chart-title">同比</label>
								<label class="chart-data" v-text="milepostAchievementYoy =='-'?milepostAchievementYoy:milepostAchievementYoy + '%'"></label>
								<img class="chart-compare-ico" v-if="milepostAchievementYoy !='-'" :src="(milepostAchievementYoy < 0 ? icFall : icRise)">
							</div>

							<div v-show="tab1 !== 1 && parseFloat(tab1 === 0 ? chartData.milepostAchievementQuarterRate : chartData.milepostAchievementRate)">
								<label class="chart-title">环比</label>
								<label class="chart-data" v-text="milepostAchievementMom =='-'?milepostAchievementMom:milepostAchievementMom + '%'"></label>
								<img class="chart-compare-ico" v-if="milepostAchievementMom !='-'"
									 :src="(milepostAchievementMom < 0 ? icFall : icRise)">
							</div>

						</li>
						<li>
							<!--						<div class="chart-box" ref="chart2"></div>-->
							<div class="chart-data-title">一级节点</div>
							<div class="chart-data-content"
							     v-show="parseFloat(tab1 === 0 ? chartData.primaryNodeAchievementQuarterRate : chartData.primaryNodeAchievementRate)"
							     v-text="((tab1 === 0 ? chartData.primaryNodeAchievementQuarterRate : chartData.primaryNodeAchievementRate) || 0) + '%'"></div>
							<div class="chart-data none-data" v-show="!parseFloat(tab1 === 0 ? chartData.primaryNodeAchievementQuarterRate : chartData.primaryNodeAchievementRate)">当期无数据</div>

							<div v-show="parseFloat(tab1 === 0 ? chartData.primaryNodeAchievementQuarterRate : chartData.primaryNodeAchievementRate)">
								<label class="chart-title">同比</label>
								<label class="chart-data" v-text="primaryNodeAchievementYoy=='-'?primaryNodeAchievementYoy:primaryNodeAchievementYoy + '%'"></label>
								<img class="chart-compare-ico" v-if="primaryNodeAchievementYoy !='-'"
									 :src="(primaryNodeAchievementYoy < 0 ? icFall : icRise)">
							</div>

							<div v-show="tab1 !== 1 && parseFloat(tab1 === 0 ? chartData.primaryNodeAchievementQuarterRate : chartData.primaryNodeAchievementRate)">
								<label class="chart-title">环比</label>
								<label class="chart-data" v-text="primaryNodeAchievementMom=='-'?primaryNodeAchievementMom:primaryNodeAchievementMom + '%'"></label>
								<img class="chart-compare-ico" v-if="primaryNodeAchievementMom !='-'"
									 :src="(primaryNodeAchievementMom < 0 ? icFall : icRise)">
							</div>
						</li>
					</ul>

					<div class="data-title1" v-show="orgType <= 4"><label>平均工期</label></div>

					<ul class="data-info-list3 pb-20" v-show="orgType <= 4">
						<li>
							<!--						<div class="chart-box" ref="chart3"></div>-->
							<div class="chart-data-title">拿地至开放</div>
							<div class="chart-data-content"
							     v-show="parseFloat(tab1 === 0 ? chartData1.getLandToDemonstrationQuarterDurationAvg : chartData1.getLandToDemonstrationDurationAvg)"
							     v-text="((tab1 === 0 ? chartData1.getLandToDemonstrationQuarterDurationAvg : chartData1.getLandToDemonstrationDurationAvg) || 0) + '天'"></div>
							<div class="chart-data none-data" v-show="!parseFloat(tab1 === 0 ? chartData1.getLandToDemonstrationQuarterDurationAvg : chartData1.getLandToDemonstrationDurationAvg)">当期无数据</div>
						</li>
						<li>
							<!--						<div class="chart-box" ref="chart4"></div>-->
							<div class="chart-data-title">拿地至开盘</div>
							<div class="chart-data-content"
							     v-show="parseFloat(tab1 === 0 ? chartData1.getLandToBeginConstructionQuarterDurationAvg : chartData1.getLandToBeginConstructionQuarterDurationAvg)"
							     v-text="((tab1 === 0 ? chartData1.getLandToBeginConstructionQuarterDurationAvg : chartData1.getLandToBeginConstructionQuarterDurationAvg) || 0) + '天'"></div>
							<div class="chart-data none-data" v-show="!parseFloat(tab1 === 0? chartData1.getLandToBeginConstructionQuarterDurationAvg : chartData1.getLandToBeginConstructionQuarterDurationAvg)">当期无数据</div>
						</li>
                            <!-- todo 暂时隐藏 -->
    						<!-- <li>
    							<div v-show="tab1 !== 1 && parseFloat(chartData1.getLandToDemonstrationDurationAvg)">
    								<label class="chart-title">同比</label>
    								<label class="chart-data" v-text="getLandToDemonstrationYoy + '天'"></label>
    								<img class="chart-compare-ico"
    								     :src="(getLandToDemonstrationYoy < 0 ?  icFall : icRise)">
    							</div>
    						</li>
    						<li>
    							<div v-show="tab1 !== 1 && parseFloat(chartData1.getLandToBeginConstructionQuarterDurationAvg)">
    								<label class="chart-title">同比</label>
    								<label class="chart-data" v-text="getLandToBeginYoy + '天'"></label>
    								<img class="chart-compare-ico"
    								     :src="(getLandToBeginYoy < 0 ? icFall : icRise)">
    							</div>
    						</li> -->
					</ul>

					<ul class="data-info-list3 pb-20" style="margin-top: 20px;"
					    v-show="orgType <= 4">
						<li>
							<!--						<div class="chart-box" ref="chart3"></div>-->
							<div class="chart-data-title">拿地至现金流回正</div>
							<div class="chart-data-content"
							     v-show="parseFloat(tab1 === 0 ? chartData1.getLandToPositiveCashflowQuarterDurationAvg : chartData1.getLandToPositiveCashflowDurationAvg)"
							     v-text="((tab1 === 0 ? chartData1.getLandToPositiveCashflowQuarterDurationAvg : chartData1.getLandToPositiveCashflowDurationAvg) || 0) + '天'"></div>
							<div class="chart-data none-data" v-show="!parseFloat(tab1 === 0 ? chartData1.getLandToPositiveCashflowQuarterDurationAvg : chartData1.getLandToPositiveCashflowDurationAvg)">当期无数据</div>
						</li>
						<li>
							<!--						<div class="chart-box" ref="chart4"></div>-->
							<div class="chart-data-title">拿地至交付</div>
							<div class="chart-data-content"
							     v-show="parseFloat(tab1 === 0 ? chartData1.getLandToDeliveryQuarterDurationAvg : chartData1.getLandToDeliveryDurationAvg)"
							     v-text="((tab1 === 0 ? chartData1.getLandToDeliveryQuarterDurationAvg : chartData1.getLandToDeliveryDurationAvg) || 0) + '天'"></div>
							<div class="chart-data none-data" v-show="!parseFloat(tab1 === 0? chartData1.getLandToDeliveryQuarterDurationAvg : chartData1.getLandToDeliveryDurationAvg)">当期无数据</div>
						</li>
						<!-- todo 暂时隐藏 -->
    						<!-- <li >
    							<div v-show="tab1 !== 1 && parseFloat(chartData1.getLandToPositiveCashflowDurationAvg)">
    								<label class="chart-title">同比</label>
    								<label class="chart-data" v-text="getLandToPositiveCashflowYoy + '天'"></label>
    								<img class="chart-compare-ico"
    								     :src="(getLandToPositiveCashflowYoy < 0 ?  icFall : icRise)">
    							</div>
    						</li>
    						<li>
    							<div v-show="tab1 !== 1 && parseFloat(chartData1.getLa                                                                                                                                                    ndToDeliveryDurationAvg)">
    								<label class="chart-title">同比</label>
    								<label class="chart-data" v-text="getLandToDeliveryYoy + '天'"></label>
    								<img class="chart-compare-ico"
    								     :src="(getLandToDeliveryYoy < 0 ? icFall : icRise)">
    							</div>
    						</li> -->
					</ul>

    					<!-- <div class="data-title-box">
    						<img class="title-ico" src="../../../assets/images/list_ico.png">
    						<span class="title">逾期节点情况</span>
    					</div> -->
				</div>

				<!-- 项目层级显示 -->
				<div class="data-content-panel pt-30" v-if="orgType == 6">
					<div class="data-title1"><label>节点达成率</label></div>
					<ul class="data-info-list one-cols" style="border-bottom: 0;">
						<li>
							<div class="data-type" style="margin-top: 0;">里程碑节点</div>
							<div class="data-box mt-10">
								<label class="value max" v-text="chartData.milepostAchievementRate  || '-'"></label>
								<label class="unit">%</label>
							</div>
						</li>
					</ul>

					<ul class="data-info-list two-cols mt-20" style="border-bottom: 0;">
						<li>
							<div class="data-type" style="margin-top: 0;">一级节点</div>
							<div class="data-box mt-10">
								<label class="value max" v-text="chartData.primaryNodeAchievementRate || '-'"></label>
								<label class="unit">%</label>
							</div>
						</li>
						<li>
							<div class="data-type" style="margin-top: 0;">二级节点</div>
							<div class="data-box mt-10">
								<label class="value max" v-text="chartData.secondaryNodeAchievementYearRate  || '-'"></label>
								<label class="unit">%</label>
							</div>
						</li>
					</ul>
				</div>

                <div class="data-content-panel pd0 mt-10">
					<div class="text-center" v-show="orgType != 6">
                        <van-tabs v-model="tab3" class="vanTabs" color="#209B5C" line-width="30px" :ellipsis="false" title-active-color="#209B5C" @change="tabChange">
                            <van-tab v-for="(item,index) in tabList" :title="item.name" :disabled="item.disabled" :key="index" title-style="margin:0 5px">
                                <div slot="title">
                                    <span v-eventlisten="{isChangePage:false,pageEvent:'切换到-'+item.name}">{{item.name}}</span>
                                </div>
                            </van-tab>
                        </van-tabs>

						<div class="mt--10 mb-15 " v-if="tab3 == 0">
							<ul class="huojv-tabs" :class="orgType < 6 ? 'two-cols min-width' : 'middle-width'" style="display: inline-block;">
								<li v-show="tab3 == 0" @click="checkTab2(1)" v-eventlisten="{isChangePage:false,pageEvent:'切换到里程碑'}"
								    :class="[tab2 == 1 ? 'active' : '']"><label>里程碑</label></li>
								<li v-show="tab3 == 0" @click="checkTab2(2)" v-eventlisten="{isChangePage:false,pageEvent:'切换到一级节点'}"
								    :class="[tab2 == 2 ? 'active' : '']"><label>一级节点</label></li>
								<li v-show="tab3 == 0" @click="checkTab2(3)" v-eventlisten="{isChangePage:false,pageEvent:'切换到二级节点'}"
								    :class="[tab2 == 3 ? 'active' : '']"><label>二级节点</label></li>
<!--								<li v-show="tab3 == 1" @click="checkTab2(3)" v-eventlisten="{isChangePage:false,pageEvent:'切换到拿地至开盘'}"-->
<!--								    :class="[tab2 == 3 ? 'active' : '']"><label>拿地至开盘</label></li>-->
<!--								<li v-show="tab3 == 1" @click="checkTab2(4)" v-eventlisten="{isChangePage:false,pageEvent:'切换到拿地至交付'}"-->
<!--								    :class="[tab2 == 4 ? 'active' : '']"><label>拿地至交付</label></li>-->
							</ul>
						</div>

					</div>

                    <div v-show="tab3 == 0" class="data-content-panel">
                        <el-table stripe
                                class="huo-list-table main-theme-table huojv-data-list" size="mini" highlight-current-row
                                :data="tableList" v-show="orgType < 6">
                            <el-table-column prop="projectName" label="项目名称" width="120" align="center">
                                <template slot-scope="scope">
                                    <span :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.projectGUID,6)">{{scope.row.projectName}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="taskName" label="逾期节点" width="120" align="center"></el-table-column>
                            <el-table-column prop="overdueDays" label="逾期天数" width="80" align="center"></el-table-column>
                            <el-table-column :prop="orgType<5?'projectManager':'principal'" :label="orgType<5?'项目负责人':'节点负责人'" width="100" align="center"></el-table-column>
                        </el-table>

	                    <el-table stripe
	                              class="huo-list-table main-theme-table huojv-data-list" size="mini" highlight-current-row
	                              :data="tableList" v-show="orgType == 6">
		                    <el-table-column prop="projectName" label="项目名称" width="120" align="center">
                                <template slot-scope="scope">
                                    <span :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.projectGUID,6)">{{scope.row.projectName}}</span>
                                </template>
		                    </el-table-column>
		                    <el-table-column prop="taskName" label="逾期节点" width="120"
		                                     align="center">
		                    </el-table-column>
		                    <el-table-column prop="planDate" label="计划时间" width="100"
		                                     align="center">
		                    </el-table-column>
		                    <el-table-column prop="principal" label="节点责任人" width="100"
		                                     align="center">
		                    </el-table-column>
		                    <el-table-column prop="overdueDays" label="逾期天数" width="80"
		                                     align="center"></el-table-column>
	                    </el-table>

<!--                        <el-table stripe-->
<!--                                class="huo-list-table main-theme-table huojv-data-list" size="mini" highlight-current-row-->
<!--                                :data="tableList" v-show="tab3 == 1 && tab2 == 3">-->
<!--                            <el-table-column prop="projOrgName" label="项目名称" width="120"-->
<!--                                            align="center">-->
<!--                            </el-table-column>-->
<!--                            <el-table-column prop="duration" label="拿地至开盘(天)"-->
<!--                                            align="center">-->
<!--                            </el-table-column>-->
<!--                            <el-table-column prop="adUserName" label="负责人" width="80"-->
<!--                                            align="center">-->
<!--                            </el-table-column>-->
<!--                        </el-table>-->

<!--                        <el-table stripe-->
<!--                                class="huo-list-table main-theme-table huojv-data-list" size="mini" highlight-current-row-->
<!--                                :data="tableList" v-show="tab3 == 1 && tab2 == 4">-->
<!--                            <el-table-column prop="projOrgName" label="项目名称" width="120"-->
<!--                                            align="center">-->
<!--                            </el-table-column>-->
<!--                            <el-table-column prop="duration" label="拿地至交付(天)"-->
<!--                                            align="center">-->
<!--                            </el-table-column>-->
<!--                            <el-table-column prop="adUserName" label="负责人" width="80"-->
<!--                                            align="center">-->
<!--                            </el-table-column>-->
<!--                        </el-table>-->

                        <div class="huojv-data-list-none" v-show="tableList.length <= 0">没有更多了</div>
                        <div class="huojv-data-list-more" v-show="tableList.length >= 6" @click="getMore">查看更多
                            <van-icon name="arrow"/>
                        </div>
                    </div>

                    <div v-show="tab3==2||tab3==3" style="margin-bottom:30px;padding:0 20px 0">
                        <div class="huojv-chart-box2">
                            <div ref="bar" class="huojv-chart-box-item"></div>
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
                                    <span class="jumpTxta" v-if="scope.row.undone>0||scope.row.complete>0" @click="getMore(scope.row.id)">{{scope.row.name}}</span>
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
	                <project-limit-analysis1 v-if="tab3 == 1 && orgType <= 5" ref="projectLimitAnalysis1"></project-limit-analysis1>
	                <!-- 工期分析 组织机构为项目 -->
	                <project-limit-analysis2 v-if="tab3 == 1 && orgType == 6" ref="projectLimitAnalysis2"></project-limit-analysis2>
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
    import {getUrlParam, jumpToPj} from '@/utils/common';
    import {Icon, PullRefresh, Tab, Tabs } from 'vant';
    import $ from 'jquery';
    import request from '@/utils/request';
    import ic_fall from '@/assets/images/ic_fall@2x.png'
    import ic_rise from '@/assets/images/ic_rise@2x.png'

    import regional from './components/regional'
    import projectLimitAnalysis1 from "./components/projectLimitAnalysis1";
    import projectLimitAnalysis2 from "./components/projectLimitAnalysis2";

    export default {
        mixins: [scrollFixed],

        data() {
            return {
                // orgId: getLocalStorage(['orgId']).orgId,
                tabList: [
                    {name:'逾期节点情况',disabled: false},
                    {name:'工期分析',disabled: false},
                    {name:'里程碑分析',disabled: false},
                    {name:'节点类型分析',disabled: false},
                ],
                option: {
                    backgroundColor: "transparent",
                    grid: {
                        top: '3%',
                        bottom: '3%',
                        containLabel: true
                    },
                    title: {
                        text: '75%',
                        textStyle: {
                            color: '#209B5C',
                            fontSize: 20
                        },
                        subtext: '里程碑',
                        subtextStyle: {
                            color: '#666666',
                            fontSize: 12
                        },
                        itemGap: -5, // 主副标题距离
                        left: 'center',
                        top: 'center'
                    },
                    angleAxis: {
                        max: 100, // 满分
                        clockwise: false, // 逆时针
                        // 隐藏刻度线
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            show: false
                        },
                        splitLine: {
                            show: false
                        }
                    },
                    radiusAxis: {
                        type: 'category',
                        // 隐藏刻度线
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            show: false
                        },
                        splitLine: {
                            show: false
                        }
                    },
                    polar: {
                        center: ['50%', '50%'],
                        radius: '150%' //图形大小
                    },
                    series: [{
                        type: 'bar',
                        data: [{
                            name: '里程碑',
                            value: 75,
                            itemStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                                        offset: 0,
                                        color: '#209B5C'
                                    }, {
                                        offset: 1,
                                        color: 'rgba(32,155,92,0.8)'
                                    }])
                                }
                            },
                        }],
                        coordinateSystem: 'polar',
                        roundCap: true,
                        barWidth: 10,
                        barGap: '-100%', // 两环重叠
                        z: 2,
                    }, { // 灰色环
                        type: 'bar',
                        data: [{
                            value: 100,
                            itemStyle: {
                                color: '#E8F0EC',
                                shadowColor: 'rgba(0, 0, 0, 0.1)',
                                shadowBlur: 5,
                                shadowOffsetY: 2
                            }
                        }],
                        coordinateSystem: 'polar',
                        roundCap: true,
                        barWidth: 10,
                        barGap: '-100%', // 两环重叠
                        z: 1
                    }]
                },
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
                        'left': '8%',
                        'right': '6%',
                        'bottom': '10%',
                        'top': '9%',
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
                            },
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

                icFall: ic_fall,
                icRise: ic_rise,

                tab1: 1,  // 本季度  本年度
                tab2: 1, // 1 里程碑， 2 一级节点
	            tab3: 0, // 1  逾期节点情况   2 工期分析

                size: 6,
                current: 1,
                tableList: [],  // 表格数据

                chartData: {},   // 图表数据
                chartData1: {},   // 图表数据

                getLandToDeliveryYoy: 0,  // 拿地至交付同比
                getLandToBeginYoy: 0,  // 拿地至开盘同比
                getLandToDemonstrationYoy: 0,  // 拿地至开放同比
                getLandToPositiveCashflowYoy: 0,  // 拿地至资金流回正
                primaryNodeAchievementYoy: 0,  //  一级同比
                primaryNodeAchievementMom: 0,  //  一级环比
                milepostAchievementYoy: 0,  //  里程碑同比
                milepostAchievementMom: 0,  //  里程碑环比

                orgType: getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType,  // 组织机构类型  如果没有

                // todo 2020-05-20 22:58 屏蔽此代码 原来是传id  后面改成传中文字符
                // taskType:{
                //     milepostTypeId:'4BD92065-4081-488A-ACB4-2C89DEDC2DD7,60611D76-6868-4B46-949F-B8A1410A6D1E',
                //     primaryNodeTypeId:'5963DC9F-33E2-4637-8FD9-5CE1961036A7',
                //     secondNodeTypeId:'17DBB9E4-941B-481D-B111-2597878A4EE6',
                //     thirdNodeTypeId:'58BEA6E1-68BE-49AD-938A-E6B389656D1A'
                // }

                taskType: {
                    milepostTypeId: '里程碑',
                    primaryNodeTypeId: '一级',
                },
                isLoading: false,

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

            // 设置表格联合滚动
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

                $(".el-table__fixed-body-wrapper").scroll(function () {
                    let scrollTop = $(this).scrollTop();
                    $(this).parent().prev().scrollTop(scrollTop);
                })

                $('.el-table__header-wrapper').scroll(function () {
                    let scrollLeft = $(this).scrollLeft();
                    $(this).next().scrollLeft(scrollLeft);
                });
            })

            //
            $(document).scrollTop(20)
            $(document).scrollTop(0)
        },

        methods: {
            jumpToPj,
            reloadWindow() {
                setTimeout(() => {
                    window.location.reload();
                    this.isLoading = false;
                }, 500)
            },
            // 页面初始化
            init() {
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
                    console.log('session',this.tab3)
                }
                this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType;

                if (this.orgType!=5) {
                    if (this.tab3 == 2||this.tab3 == 3) {
                        this.getBarData()
                    } else {
                        this.getEchartData();
                        this.getTableDate();
                    }
                }

                // 项目层级默认选中工期分析
                if (this.orgType>=6) {
                    this.tab3 = 1
                }

                if (!this.orgType || this.orgType == 'undefined' || this.orgType == 'null') {
                    this.getOrgType();
                }

                if(this.tab3 == 1){
                    if(this.orgType <= 5){
                        this.$nextTick(() => {
                            this.$refs.projectLimitAnalysis1.init();
                        })

                    }else{
                        this.$nextTick(() => {
                            this.$refs.projectLimitAnalysis2.init();
                        })
                    }
                }

                // $(document).scrollTop(5);
            },
            // 获取图表数据
            getEchartData() {
                this.chartData = {};
                request({
                    url: `/app-api/plan/schedule/node?orgId=${this.orgId}`,
                    method: 'get'
                }).then(({data}) => {
                    if (data.code === 0) {
                        if (data.node) {
                            this.chartData = data.node;
                            // this.getLandToDeliveryYoy = ((this.tab1 === 1 ? this.chartData.getLandToDeliveryQuarterDurationYoY : this.chartData.getLandToDeliveryDurationYoY) || 0);  // 拿地至交付同比
                            // this.getLandToBeginYoy = ((this.tab1 === 1 ? this.chartData.getLandToBeginConstructionQuarterDurationYoY : this.chartData.getLandToBeginConstructionDurationYoY) || 0);  // 拿地至开盘同比
                            this.primaryNodeAchievementYoy = ((this.tab1 === 0 ? this.chartData.primaryNodeAchievementQuarterYoY : this.chartData.primaryNodeAchievementYoY) || 0);  //  一级同比
                            this.primaryNodeAchievementMom = ((this.tab1 === 0 ? this.chartData.primaryNodeAchievementQuarterMoM : this.chartData.primaryNodeAchievementMoM) || 0);  //  一级环比
                            this.milepostAchievementYoy = ((this.tab1 === 0 ? this.chartData.milepostAchievementQuarterYoY : this.chartData.milepostAchievementYoY) || 0);  //  里程碑同比
                            this.milepostAchievementMom = ((this.tab1 === 0 ? this.chartData.milepostAchievementQuarterMoM : this.chartData.milepostAchievementMoM) || 0);   //  里程碑环比
                        }
                        // this.drawChart()
                    }
                }).catch((e) => {
                    console.log('getEchartData-err', e);
                });

                // 获取拿地 数据
                request({
                    url: `/app-api/plan/schedule/duration?orgId=${this.orgId}`,
                    method: 'get'
                }).then(({data}) => {
                    if (data.code === 0) {
                        data.duration = data.duration || {};
                        if (data.duration) {
                            this.chartData1 = data.duration;
                            this.getLandToDeliveryYoy = ((this.tab1 === 0 ? this.chartData1.getLandToDeliveryQuarterDurationYoY : this.chartData1.getLandToDeliveryDurationYoY) || 0);  // 拿地至交付同比
                            this.getLandToBeginYoy = ((this.tab1 === 0 ? this.chartData1.getLandToBeginConstructionQuarterDurationYoY : this.chartData1.getLandToBeginConstructionDurationYoY) || 0);  // 拿地至开盘同比
                            this.getLandToDemonstrationYoy = ((this.tab1 === 0 ? this.chartData1.getLandToDemonstrationQuarterDurationYoY : this.chartData1.getLandToDemonstrationDurationYoY) || 0);  // 拿地至开放同比
                            this.getLandToPositiveCashflowYoy = ((this.tab1 === 0 ? this.chartData1.getLandToPositiveCashflowQuarterDurationYoY : this.chartData1.getLandToPositiveCashflowDurationYoY) || 0);  // 拿地至资金流收回正同比
                        }
                        // this.drawChart1()
                    }
                }).catch((e) => {
                    console.log('getEchartData-err', e);
                });

            },

            // 渲染图表
            drawChart() {
                let option1 = JSON.parse(JSON.stringify(this.option));
                let option2 = JSON.parse(JSON.stringify(this.option));

                option1.series[0].data[0].name = option1.title.subtext = '里程碑';
                option2.series[0].data[0].name = option2.title.subtext = '一级节点';

                if (this.tab1 === 0) {
                    option1.title.text = (this.chartData.milepostAchievementQuarterRate || 0) + '%';
                    option2.title.text = (this.chartData.primaryNodeAchievementQuarterRate || 0) + '%';

                    option1.series[0].data[0].value = this.chartData.milepostAchievementQuarterRate || 0;
                    option2.series[0].data[0].value = this.chartData.primaryNodeAchievementQuarterRate || 0;
                } else if (this.tab1 === 0) {
                    option1.title.text = (this.chartData.milepostAchievementRate || 0) + '%';
                    option2.title.text = (this.chartData.primaryNodeAchievementRate || 0) + '%';

                    option1.series[0].data[0].value = this.chartData.milepostAchievementRate || 0;
                    option2.series[0].data[0].value = this.chartData.primaryNodeAchievementRate || 0;
                }
                let myEchart1 = echarts.init(this.$refs.chart1);
                let myEchart2 = echarts.init(this.$refs.chart2);

                myEchart1.setOption(option1, true);
                myEchart2.setOption(option2, true);
            },

            // 渲染图表
            drawChart1() {
                let option3 = JSON.parse(JSON.stringify(this.option));
                let option4 = JSON.parse(JSON.stringify(this.option));

                option3.series[0].data[0].name = option3.title.subtext = '拿地至开盘';
                option4.series[0].data[0].name = option4.title.subtext = '拿地至交付';

                if (this.tab1 === 0) {
                    option3.title.text = (this.chartData1.getLandToBeginConstructionQuarterDurationAvg || 0) + '天';
                    option4.title.text = (this.chartData1.getLandToDeliveryQuarterDurationAvg || 0) + '天';

                    option3.series[0].data[0].value = this.chartData1.getLandToBeginConstructionQuarterDurationAvg || 0;
                    option4.series[0].data[0].value = this.chartData1.getLandToDeliveryQuarterDurationAvg || 0;
                } else if (this.tab1 === 1) {
                    option3.title.text = (this.chartData1.getLandToBeginConstructionDurationAvg || 0) + '天';
                    option4.title.text = (this.chartData1.getLandToDeliveryDurationAvg || 0) + '天';

                    option3.series[0].data[0].value = this.chartData1.getLandToBeginConstructionDurationAvg || 0;
                    option4.series[0].data[0].value = this.chartData1.getLandToDeliveryDurationAvg || 0;
                }

                let myEchart3 = echarts.init(this.$refs.chart3);
                let myEchart4 = echarts.init(this.$refs.chart4);

                myEchart3.setOption(option3, true);
                myEchart4.setOption(option4, true);
            },

            getOrgType() {
                request({
                    url: `/app-api/orgType/orgId/${this.orgId}`,
                    method: 'get'
                }).then(({data}) => {
                    if (data.code === 0) {
                        this.orgType = parseInt(data.data || 0);
                    }
                }).catch((e) => {
                    console.log('getEchartData-err', e);
                });
            },

            // 获取逾期节点数据
            getTableDate() {
                if(this.tab3 == 0){
                    // todo 这里只有里程碑和一级节点吗？ PC端还有二级节点和三级节点
                    // const taskTypeId = this.tab2 == 1 ? this.taskType.milepostTypeId : this.taskType.primaryNodeTypeId;
	                let taskTypeId = '里程碑';
	                switch (this.tab2) {
		                case 1: taskTypeId = '里程碑';break;
		                case 2: taskTypeId = '一级';break;
		                case 3: taskTypeId = '二级';break;
                    }
                    request({
                        url: `/app-api/plan/schedule/overdueList?orgId=${this.orgId}&size=${this.size}&current=${this.current}&taskTypeName=${taskTypeId}`,
                        method: 'get'
                    }).then(({data}) => {
                        if (data.code === 0) {
                            this.tableList = data.overdueList;
                        }
                    }).catch((e) => {
                        console.log('getEchartData-err', e);
                    });
                }else if(this.tab3 == 1){
                    request({
                        url: `/app-api/plan/schedule/workDayList`,
                        method: 'post',
	                    data: {
                            current: 1,
                            orgId: this.orgId,
                            orgType: this.orgType,
                            size: this.size
                        }
                    }).then(({data}) => {
                        if (data.code === 0) {
                            if(this.tab2 == 3){
                                this.tableList = data.data.landOpens;
                            }else if(this.tab2 == 4){
                                this.tableList = data.data.landDelivers;
                            }
                        }
                    }).catch((e) => {
                        console.log('getEchartData-err', e);
                    });
                }

            },
            // 跳转查看更多页面
            getMore(tkid) {
                let taskTypeId = '', title = '里程碑逾期节点情况',tabIndex = 1
                // console.log('设置的tab',this.tab2, this.tab3)
                if (this.tab3 == 2||this.tab3 == 3) {
                    taskTypeId = this.taskType.milepostTypeId
                    //tab3 == 2? 里程碑分析详情 :  '节点类型分析'
                    tabIndex = this.tab3 == 2?99:100

                    sessionStorage.planTab1 = this.tab1;
                    sessionStorage.planTab2 = this.tab2;
                    sessionStorage.planTab3 = this.tab3;

                    this.$router.push({
                        path: '/moreList',
                        query: {
                            orgType: this.orgType,
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
                    title = '里程碑逾期节点情况'
                    tabIndex = 1
                }else if(this.tab2 == 2){
                    taskTypeId = '一级';
                    title = '一级节点逾期节点情况'
                    tabIndex = 2
                }else if(this.tab2 == 3){
                    taskTypeId = '二级';
                    title = '二级节点逾期节点情况';
                    tabIndex = 3
                }

                sessionStorage.planTab1 = this.tab1;
                sessionStorage.planTab2 = this.tab2;
                sessionStorage.planTab3 = this.tab3;

                this.$router.push({
                    path: '/moreList',
                    query: {taskTypeId: taskTypeId, token: getUrlParam('token'), orgId: this.orgId, tab2: tabIndex,orgType:this.orgType}
                });

            },

            // checkTab1(tab1) {
            //     this.tab1 = tab1;
            //     this.init();
            // },
            // 季度 年底tab切换
            tabChange1(idx){
                this.tab1 = idx
                this.init();
            },

            // 切换  里程碑  一级节点
            checkTab2(tab2) {
                this.tab2 = tab2;
                console.log('tab2',this.tab2)
                this.getTableDate();
            },

	        // 切换分析类型标签tab
            tabChange (idx) {
                this.tab3 = idx;
                sessionStorage.planTab3 = idx;
                if(idx == 0){
                    this.tab2 = 1;
                    this.getTableDate();
                }else if(idx == 1){
                    this.tab2 = 3;
                    this.getTableDate();
                }else if(idx == 2||idx == 3){
                    this.getBarData()
                }
            },

            // 里程碑分析图表 柱状图
            getBarData() {
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
                            this.setBar(_barData,'bar','','#B4A36B',middle)

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

                        } else if (this.tab3==3) { //节点类型分析
                            //柱状图
                            let middle = this.tab1==0 ? res.data.data.milepostAndPrimaryNodeRateAveQuarter : res.data.data.milepostAndPrimaryNodeRateAveYear
                            let _barData = res.data.data.professionHistogramVo.map(item => {
                                return {
                                    name: item.professionName,
                                    rate: item.taskAchievementRate,
                                    rowNum: item.rowNum
                                }
                            })
                            this.setBar(_barData,'bar','','#B4A36B',middle)

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
            // 渲染图形
            setBar(data,el,title,_color,_middle){
                let barData = [];
                let series = []
                let tool = []
                let legendData = []
                let middle = 0
                let max = 0
                let option = JSON.parse(JSON.stringify(this.barOption));
                if (data&&data.length>0) {
                    legendData = data.map(item=>{
                        return item.name
                    })
                    barData = data.map(item=>{
                        return item.rate
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
                if(this.tab3==3){
                    option.xAxis.axisLabel.textStyle.color = '#4472C4'
                    option.xAxis.axisLabel.textStyle.backgroundColor = {
                        image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABLCAYAAAA1fMjoAAAA5UlEQVR4nO3VAQ2AMBAEwYI2FKERX4+BdhXMSLhkc9fMzAK2brPAmUAgCASCQCAIBIJAIAgEgkAgCASCQCAIBIJAIAgEgkAgCASCQCAIBIJAIAgEgkAgCASCQCAIBIJAIAgEgkAgCASCQCAIBIJAIAgEgkAgCASCQCAIBIJAIAgEgkAgCASCQCAIBIJAIAgEgkAgCASCQCAIBIJAIAgEgkAgCASCQCAIBIJAIAgEgkAgCASCQCAIBIJAIAgEgkAgCASCQCAIBIJAIAgEwvW83xgI9jwIBIFAEAgEgUAQCASBwMla6wfq+AcKdpjK7wAAAABJRU5ErkJggg==',
                        width:100,
                        height:50,
                    }
                }
                let myChart = new echarts.init(this.$refs[el]);
                myChart.setOption(option, true);


                // 柱子和X轴文字添加点击事件
                console.log(data)
                if (this.tab3==3) {
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
                                    orgType: that.orgType,
                                    rowNum: data[_idx].rowNum
                                }
                            });
                        }
                    });
                }
            },
            // 里程碑分析图表 点图
            getPointData(el,marksData,rateX,rateY){
                rateX = rateX ? rateX : 0
                rateY = rateY ? rateY : 0
                // rateY = '0.00'
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
                            fontSize: 11,
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
                            fontSize: 11,
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
                            // color: function (e) {
                            //     let randomColor = 'rgba(' + Math.floor(Math.random() * 240) + ',' + Math.floor(Math.random() * 240) + ',' + Math.floor(Math.random() * 240) + ',' + '.8' + ')'
                            //     return randomColor.substring()
                            // }
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
            // 设置表格合计行
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
            regional,
            projectLimitAnalysis1,
            projectLimitAnalysis2
        }
    };
</script>

<style>
.accountTable .el-table__footer-wrapper{
    font-weight: bold;
}
</style>
<style lang="scss" scoped>
.chartTitle{
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    margin: 15px auto;
    color: #333;
}
.jumpTxta{
    color: #4472C4;
    text-decoration: underline;
}
.vanTabs{
    margin-bottom: 10px;
    // border-bottom: 1px solid #E8E8E8;
}
</style>
