<template>
	<div class="detail-panel height100 white-bg">
		<div class="main-content">
			<div class="data-content-panel pt-15" style="padding-left: 0; padding-right: 0;">
				<div style="padding-bottom: 10px;">
					<div class="text-center">
						<ul class="huojv-tab-bars_1 two-cols" style="margin-bottom: 0;">
							<li @click="checkTab1(1)" v-eventlisten="{isChangePage:false,pageEvent:'点击集采类'}"
							    :class="[tab1 == 1 ? 'active' : '']"><label>集采类</label></li>
							<li @click="checkTab1(2)" v-eventlisten="{isChangePage:false,pageEvent:'点击工程类'}"
							    :class="[tab1 == 2 ? 'active' : '']"><label>工程类</label></li>
						</ul>
					</div>
				</div>
				<!-- 采集类 content -->
				<div class="main-content width100" v-show="tab1 == 1">
					<!-- 下拉选择 -->
					<div class="clearfix">
						<van-dropdown-menu class="huojv-dropdown-menu float-r" active-color="#266545" style="width: 100%;">
							<van-dropdown-item v-model="selectValue1" @change="changeDateType" :options="options1"/>
							<van-dropdown-item v-model="selectValue2" @change="changeCompany" :options="options2"/>
							<van-dropdown-item v-model="selectValue3" @change="onRefresh" :options="options3"/>
						</van-dropdown-menu>
					</div>


					<van-sticky class="cost-contract-title">
						<div class="data-content-panel pt-15" style="padding-bottom: 0;">
							<div class="huojv-list-title">
								{{listTitle}}
								<div class="tips" :class="[selectValue1==0 ? 'overdue' : 'doing']"
								     v-text="selectValue1 == 0 ? '已过期' : '执行中'"></div>
							</div>
							<ul class="huojv-data-list list-title1" style="overflow-x: auto;">
								<li class="title" style="width: 521px; padding: 0;">
									<label style="width: 120px; text-align: center;">签约甲方</label>
									<label style="width: 120px; ">协议名称</label>
									<label style="width: 120px; ">供应商</label>
									<label style="width: 80px; ">材料品类</label>
									<label style="width: 80px; text-align: center;">品牌</label>
								</li>
							</ul>
						</div>
					</van-sticky>
					<div class="data-content-panel" style="padding-bottom: 20px;">
						<van-list
								v-model="loading"
								:finished="finished"
								finished-text="没有更多了"
								@load="onLoad"
						>

							<el-table stripe
							          class="huo-list-table main-theme-table huojv-data-list hide-header list-data1"
							          size="mini" highlight-current-row
							          :data="tableList1">
								<el-table-column prop="struName" label="签约甲方" width="120"
								                 align="center">
									<template slot-scope="scope">
										<label class="check-ico" v-eventlisten="{isChangePage:true,pageEvent:'跳转到材料公司详情页面'}"
										       @click="goPage('/materialCompany',scope.row.struName)"
										       v-text="scope.row.struName  || ''"></label>
									</template>
								</el-table-column>
								<el-table-column prop="contractName" label="协议名称" width="120"
								                 align="center">
									<template slot-scope="scope">
										<label class="check-ico" v-eventlisten="{isChangePage:true,pageEvent:'跳转到材料清单详情页面'}"
										       @click="goPage1('/material',{contractId:scope.row.contractId,contractName:scope.row.contractName})"
										       v-text="scope.row.contractName  || ''"></label>
									</template>
								</el-table-column>
								<el-table-column prop="cosName" label="供应商" width="120"
								                 align="center">
									<template slot-scope="scope">
										<label class="check-ico" v-eventlisten="{isChangePage:true,pageEvent:'跳转到供应商详情页面'}"
										       @click="goPage('/company',scope.row.cosId)"
										       v-text="scope.row.cosName  || ''"></label>
									</template>
								</el-table-column>
								<el-table-column prop="baseName" label="材料品类" width="80"
								                 align="center"></el-table-column>
								<el-table-column prop="size" label="品牌" width="80"
								                 align="center"></el-table-column>
							</el-table>
						</van-list>
					</div>
				</div>

				<!-- 工程建造类  content -->
				<div class="main-content width100" v-show="tab1 == 2">
					<div class="data-content-panel">
						<!-- 时间选择器 -->
						<div class="text-center">
							<ul class="data-type-check">
								<li @click="checkToday()" v-eventlisten="{isChangePage:false,pageEvent:'选择今天'}"
								    style="width: 75px;">今
								</li>
								<li @click="checkDateType('date',curDate4Engineer)"
								    v-eventlisten="{isChangePage:false,pageEvent:'打开时间选择控件'}" style="width: 150px;"><span
										v-text="curDate4Engineer"></span><img
										src="../../../../assets/images/ic_triangle_down@2x.png"></li>
							</ul>
						</div>

						<div class="mt-15 cost-contract-chart" style="margin-top: 30px; height: 280px;" ref="chart1"></div>
						<div class="cost-contract-chart" style="margin-top: 30px; height: 280px;" ref="chart2"></div>
					</div>

					<div class="data-content-panel">
						<div class="data-list-title">当日工程类签约明细</div>
						<van-list
								v-model="loading1"
								:finished="finished1"
								finished-text="没有更多了"
								@load="onLoad1">
							<el-table stripe
							          class="huo-list-table main-theme-table huojv-data-list work-list" size="mini"
							          highlight-current-row
							          :data="workList">
                                <el-table-column label="项目名称" width="120" align="center">
                                    <template slot-scope="scope">
                                        <span :title="scope.row.projName" @click="jumpToPj(orgType,scope.row.projectGUID, scope.row.orgType)"
                                            :class="orgType==6?'':'jumpTxt'">{{scope.row.projName}}</span>
                                    </template>
                                </el-table-column>
								<el-table-column prop="contractName" label="签约名称" width="120"
								                 align="center">
								</el-table-column>
								<el-table-column prop="cosName" label="供应商" width="120"
								                 align="center">
								</el-table-column>
								<el-table-column prop="contractAmount" label="签约总价(元)" width="90"
								                 align="center"></el-table-column>
								<el-table-column prop="lsqyCount" label="历史签约次数" width="90"
								                 align="center"></el-table-column>
								<el-table-column prop="recomMendeder" label="推荐人" width="80"
								                 align="center"></el-table-column>
							</el-table>
						</van-list>
						<!--					</van-pull-refresh>-->
					</div>
				</div>

				<!-- 时间选择器 -->
				<van-popup v-model="showPop" position="bottom">
					<van-datetime-picker
							:class="[dateType==='year' ? 'prop-year-picker' : '']"
							v-model="currentDate"
							:type="dateType"
							:formatter="formatter"
							@confirm="checkDate"
							@cancel="showPop = false"
					/>
				</van-popup>

				<van-action-sheet v-model="showSheet" :actions="actions" @select="onSelect"/>
			</div>
		</div>
	</div>
</template>

<script>
    import scrollFixed from '@/mixin/scroll-fixed';
    import {
        List,
        PullRefresh,
        Toast,
        DropdownMenu,
        DropdownItem,
        DatetimePicker,
        Popup,
        ActionSheet,
        Sticky,
        Tab,
        Tabs,
        Icon,
        Button
    } from 'vant';
    import $ from 'jquery';
    import echarts from 'echarts'
    import request from '@/utils/request';
    import {getUrlParam, handleDate,handleNum2String, jumpToPj} from '@/utils/common'

    export default {
        mixins: [scrollFixed],

        data() {
            return {
                // 图表 option
                chartOption: {
                    title: {
                        text: '',
                        show: true,
                        textStyle: {
                            fontWeight: 'bold',
                            fontSize: 16,
                            color: '#333333'
                        },
                        x: 'center',
                        y: 'top'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a}{b}{c}%"
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
                        itemWidth: 16,
                        itemHeight: 8,
                        itemGap: 16,
                        textStyle: {
                            color: '#999999',
                            fontSize: 12,
                            fontWeight: 0
                        },
                        data: []
                    },
                    series: []
                },

                tab1: 1,  //  1  签约 ， 2  回款， 3  交付
                loading: false,
                loading1: false,
                isLoading: false,
                isLoading1: false,
                finished: false,
                finished1: false,
                isLoad: false,  //  手动控制表格上拉加载状体  防止多次触发请求接口

                currentDate: new Date(),  // 当前日期
                showPop: false,  // 是否显示 底部弹出窗

                dateType: 'date',  // 时间类型
                selectValue1: 1,  // 采集类 日期值
                listTitle: '执行中框架协议明细',
                selectValue2: '',  // 物料公司值
                selectValue3: '',  // 物料品类值
	            // 采集类 日期列表
                options1: [
                    {text: '执行中', value: 1},
                    {text: '已过期', value: 0},
                ],
	            // 材料公司列表
                options2: [
                    {text: '全部材料公司', value: ''},
                ],
	            // 材料品类列表
                options3: [
                    {text: '全部材料品类', value: ''},
                ],

                curDateType4Engineer: 'year-month',  // 工程类时间类型
                curDate4Engineer: '',
                curDate4EngineerReal: new Date(),

                showSheet: false,
                actions: [
                    {name: '日历(月)', value: 'year-month'},
                    {name: '日历(年)', value: 'year'}
                ],
                size: 20,
                current: 1,
                size1: 20,
                current1: 1,
                tableList1: [],
                workList: [],   //  工程建造类合同清单列表
            };
        },
        mounted() {
            this.init();
            this.$nextTick(() => {
                $(".list-title1").scroll(function () {
                    let scrollLeft = $(this).scrollLeft();
                    $('.list-data1 .el-table__body-wrapper').scrollLeft(scrollLeft);
                })

                $(".el-table__body-wrapper").scroll(function () {
                    let scrollLeft = $(this).scrollLeft();
                    $('.list-title1').scrollLeft(scrollLeft);
                })

                $('.work-list .el-table__header-wrapper').scroll(function () {
                    let scrollLeft = $(this).scrollLeft();
                    $(this).next().scrollLeft(scrollLeft);
                });
            })
        },

        methods: {
            jumpToPj,
            // 初始化
            init() {
                this.orgId = getUrlParam('chooseOrgId') || getUrlParam('orgId');
                this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType');

                this.selectValue1 = 1;  // 日期类型
                this.selectValue2 = '';  // 物料公司值
                this.selectValue3 = '';  // 物料品类值

                this.onRefresh();
                this.onRefresh1();

                this.getMaterialCompanyList();
                this.getMaterialTypeList();
                this.getEngineerDate();
            },


            // 获取工程类合同清单列表
            getWorkList(isRefresh) {
                request({
                    url: `/app-api/costContract/workList?formalDate=${this.curDate4EngineerReal}&size=${this.size1}&current=${this.current1}&orgGuId=${this.orgId}`,
                    method: 'post',
                    data: {}
                }).then(({data}) => {
                    if (data.code === 0) {
                        this.workList = isRefresh ? data.list : this.workList.concat(data.list);
                        this.loading1 = false;
                        this.isLoading1 = false;

                        if (null == data.list || data.list.length < this.size1 || this.workList.length >= data.total) {
                            this.finished1 = true;
                        } else {
                            this.current1 += 1;
                            this.finished1 = false;
                        }
                    }
                });
            },

            onLoad() {
                // 如果当前处于加载状态
                if (this.isLoad) return;
                this.isLoad = true;
                this.getFrameAgreeList();
            },

            onLoad1() {
                this.getWorkList();
            },

	        // 刷新采集类合同签约框架列表
            onRefresh() {
                this.current = 1;
                // this.tableList1 = [];
                this.getFrameAgreeList(true);
            },

	        // 刷新工程类合同清单列表
            onRefresh1() {
                this.current1 = 1;
                // this.workList = [];
                this.getWorkList(true);
            },

            // 变更日期类型
            changeDateType(val) {
                this.listTitle = this.selectValue1 == 0 ? '已过期框架协议明细' : '执行中框架协议明细';
                this.selectValue2 = '';
                this.selectValue3 = '';
                this.getMaterialCompanyList();
                this.getMaterialTypeList();
                this.onRefresh();
            },

            // 全部材料公司
            changeCompany(val) {
                this.selectValue3 = '';
                this.getMaterialTypeList();
                this.onRefresh();
            },

            // 全部材料品类
            changeMaterialType(val) {
                this.onRefresh();
            },

            //  获取工程类初始时间
            getEngineerDate(isChooseToday) {
                request({
                    url: `/app-api/costContract/lastWorkList?orgGuId=${this.orgId}`,
                    method: 'post',
                    data: {}
                }).then(({data}) => {
                    if (data.code === 0 && data.date) {
                        let now = new Date(data.date);
                        this.curDate4EngineerReal = data.date;
                        this.curDate4Engineer = now.getFullYear() + '年' + handleNum2String(now.getMonth() + 1) + '月' + handleNum2String(now.getDate()) + '日';
                    } else {
                        //昨天的时间
                        let now = new Date();
                        now.setTime(now.getTime() - 24 * 60 * 60 * 1000);
                        let date = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
                        this.curDate4EngineerReal = date;
                        this.curDate4Engineer = now.getFullYear() + '年' + handleNum2String(now.getMonth() + 1) + '月' + handleNum2String(now.getDate()) + '日';
                    }

                    // 是否选择今日
                    if (isChooseToday) {
                        this.drawChart();
                        this.onRefresh1();
                    }
                });
            },

            // 选择今天
            checkToday() {
                this.getEngineerDate(true);
            },

            // 集采类  选择日期类型
            checkDateType(dateType, date) {
                this.dateType = dateType;
                this.showPop = true;

                let year = new Date().getFullYear();
                let month = new Date().getMonth() + 1;
                let day = new Date().getDate();
                if (date) {
                    year = date.split('年')[0].trim().toString();
                    month = date.split('年')[1] && date.split('年')[1].split('月')[0].trim().toString() || '';
                    day = date.split('年')[1] && date.split('年')[1].split('月')[1] && date.split('年')[1].split('月')[1].split('日')[0].trim() || '';
                    this.currentDate = new Date(year + (month && ('-' + month)) + (day && ('-' + day)));
                }

            },

            //  日期控件  点击确定
            checkDate(val) {
                let curDate = new Date(val);
                this.currentDate = curDate;
                if (this.dateType === 'year') {
                    const date = curDate.getFullYear() + '年';
                    if (this.tab1 == 1) {
                        this.selectValue1 = date;
                        this.selectValue1Real = curDate.getFullYear();
                        this.listTitle = this.selectValue1Real < new Date().getFullYear() ? '已过期框架协议明细' : '执行中框架协议明细';
                    } else if (this.tab1 == 2) {
                        this.curDate4Engineer = date;
                        this.curDate4EngineerReal = handleDate(curDate, 'date');
                    }

                } else if (this.dateType === 'year-month') {
                    const date = curDate.getFullYear() + '年' + handleNum2String(curDate.getMonth() + 1) + '月';
                    if (this.tab1 == 1) {
                        this.selectValue1 = date;
                        this.selectValue1Real = curDate.getFullYear();
                    } else if (this.tab1 == 2) {
                        this.curDate4Engineer = date;
                        this.curDate4EngineerReal = handleDate(curDate, 'date');
                    }
                } else if (this.dateType === 'date') {
                    const date = curDate.getFullYear() + '年' + handleNum2String(curDate.getMonth() + 1) + '月' + handleNum2String(curDate.getDate()) + '日';
                    if (this.tab1 == 1) {
                        this.selectValue1 = date;
                        this.selectValue1Real = curDate.getFullYear();
                    } else if (this.tab1 == 2) {
                        this.curDate4Engineer = date;
                        this.curDate4EngineerReal = handleDate(curDate, 'date');
                    }
                }

                // 日期切换的时候更新数据
                if (this.tab1 == 1) {
                    this.onRefresh();
                    if (this.selectValue1Real < new Date().getFullYear()) {
                        this.listTitle = '已过期框架协议明细';
                    }
                } else if (this.tab1 == 2) {
                    this.drawChart();
                    this.onRefresh1();
                }
                this.showPop = false;
            },

            // 日期控件  显示 格式化
            formatter(type, val) {
                if (this.dateType === 'year') {
                    if (type === 'year') {
                        return `${val}年`;
                    } else {
                        return '';
                    }
                } else {
                    if (type === 'year') {
                        return `${val}年`;
                    } else if (type === 'month') {
                        return `${val}月`;
                    }
                    return val;
                }
            },

            // ActionSheet 控件点击事件
            onSelect(data) {
                this.dateType = this.curDateType4Engineer = data.value;
                let curDate = this.currentDate || new Date;
                if (this.dateType === 'year-month') {
                    this.curDate4Engineer = curDate.getFullYear() + '年' + handleNum2String(curDate.getMonth() + 1) + '月';
                } else if (this.dateType === 'year') {
                    this.curDate4Engineer = curDate.getFullYear() + '年';
                }
                this.showSheet = false;
            },

            // 获取材料公司列表
            getMaterialCompanyList() {
                request({
                    url: `/app-api/costContract/tcorpStructure?orgGuId=${this.orgId}&state=${this.selectValue1}`,
                    method: 'post',
                    data: {}
                }).then(({data}) => {
                    if (data.code === 0) {
                        this.options2 = [{text: '全部材料公司', value: ''}]

                        for (let i = 0; i < data.tcorpStructure.length; i++) {
                            this.options2.push({
                                text: data.tcorpStructure[i].StruName,
                                value: data.tcorpStructure[i].StruName
                            });
                        }
                    }
                });
            },

            // 获取材料品类列表
            getMaterialTypeList() {
                request({
                    url: `/app-api/costContract/materialServiceBaseType?orgGuId=${this.orgId}&state=${this.selectValue1}&struName=${this.selectValue2}`,
                    method: 'post',
                    data: {}
                }).then(({data}) => {
                    if (data.code === 0) {
                        this.options3 = [{text: '全部材料品类', value: ''}]
                        for (let i = 0; i < data.materialServiceBaseType.length; i++) {
                            this.options3.push({
                                text: data.materialServiceBaseType[i].BaseName,
                                value: data.materialServiceBaseType[i].BaseName
                            });
                        }
                    }
                });
            },

            // 获取采集类合同签约框架列表
            getFrameAgreeList(isFresh) {
                request({
                    url: `/app-api/costContract/frameAgreeList`,
                    method: 'post',
                    data: {
                        struName: this.selectValue2 || '',
                        baseName: this.selectValue3 || '',
                        state: this.selectValue1,
                        size: this.size,
                        orgGuId: this.orgId,
                        current: this.current
                    }
                }).then(({data}) => {
                    if (data.code === 0) {
                        this.tableList1 = isFresh ? data.list : this.tableList1.concat(data.list);
                        this.loading = false;
                        this.isLoading = false;
                        this.isLoad = false;

                        if (null == data.list || data.list.length < this.size || this.tableList1.length >= data.total) {
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
                        this.tableList1 = [];
                        this.current = 1;
                        this.loading = false;
                        this.isLoading = false;
                        this.isLoad = false;
                        this.finished = true;
                    }
                });
            },

	        // 获取图表option
            getOption(series, legendData, title) {
                let option = JSON.parse(JSON.stringify(this.chartOption));
                option.series = series;
                option.legend.data = legendData;
                option.title.text = title;

                return option;
            },

	        // 绘制图表
            drawChart() {
                request({
                    url: `/app-api/costContract/contractPie?formalDate=${this.curDate4EngineerReal}&orgGuId=${this.orgId}`,
                    method: 'post',
                    data: {}
                }).then(({data}) => {
                    if (data.code === 0) {
                        let chartData1 = [];

                        for (let i = 0; i < data.contractPie.length; i++) {
                            chartData1.push({
                                name: data.contractPie[i].orgName + ' ',
                                value: parseFloat(data.contractPie[i].contractPercent)
                            });
                        }

                        if (!chartData1.length) {
                            chartData1 = [{name: '暂无数据', value: 0}];
                        }

                        let legendData1 = chartData1.map(item => {
                            return item.name;
                        });
                        let series1 = [
                            {
                                name: '',
                                type: 'pie',
                                radius: '45%',
                                center: ['50%', '50%'],
                                color: ['#4995E3', '#FFC40F', '#209B5C'],
                                avoidLabelOverlap: true,
                                label: {
                                    normal: {
                                        formatter: '{b}{d}%',
                                        textStyle: {
                                            fontSize: '12',
                                            color: '#666666'
                                        }
                                    },
                                    emphasis: {
                                        show: true,
                                        textStyle: {
                                            fontSize: '12',
                                            color: '#666666'
                                        }
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        smooth: 0.2,
                                        length: 10,
                                        length2: 20,

                                    }
                                },
                                data: chartData1
                            }
                        ];
                        let option1 = this.getOption(series1, legendData1, '各集团工程类合同签约总额占比');
                        let myChart1 = new echarts.init(this.$refs.chart1);
                        myChart1.setOption(option1, true);
                    }

                });


                request({
                    url: `/app-api/costContract/suppliersPie?formalDate=${this.curDate4EngineerReal}&orgGuId=${this.orgId}`,
                    method: 'post',
                    data: {}
                }).then(({data}) => {
                    if (data.code === 0) {
                        let chartData2 = [];

                        for (let i = 0; i < data.suppliersPie.length; i++) {
                            chartData2.push({
                                name: data.suppliersPie[i].baseType + ' ',
                                value: parseFloat(data.suppliersPie[i].supplierPercent)
                            });
                        }

                        if (!chartData2.length) {
                            chartData2 = [{name: '暂无数据', value: 0}];
                        }

                        let legendData2 = chartData2.map(item => {
                            return item.name;
                        });
                        let series2 = [
                            {
                                name: '',
                                type: 'pie',
                                radius: '40%',
                                center: ['50%', '50%'],
                                color: ['#F97546', '#4995E3', '#FFC40F', '#209B5C', '#9949E3'],
                                avoidLabelOverlap: true,
                                label: {
                                    normal: {
                                        formatter: '{b}{d}%',
                                        textStyle: {
                                            fontSize: '12',
                                            color: '#666666'
                                        }
                                    },
                                    emphasis: {
                                        show: true,
                                        textStyle: {
                                            fontSize: '12',
                                            color: '#666666'
                                        }
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        smooth: 0.2,
                                        length: 10,
                                        length2: 20,

                                    }
                                },
                                data: chartData2
                            }
                        ];
                        let option2 = this.getOption(series2, legendData2, '新进供应商签约占比');


                        let myChart2 = new echarts.init(this.$refs.chart2);
                        myChart2.setOption(option2, true);
                    }
                });

            },

            // 切换
            checkTab1(tab1) {
                this.tab1 = tab1;

                if (tab1 == 2) {
                    this.drawChart();
                    this.onRefresh1();
                }
            },

            goPage(path, param) {
                this.$router.push({path, query: {param, token: getUrlParam('token')}});
            },

            goPage1(path, param) {
                this.$router.push({
                    path,
                    query: {contractId: param.contractId, contractName: param.contractName, token: getUrlParam('token')}
                });
            },
        },

        components: {
            [List.name]: List,
            [PullRefresh.name]: PullRefresh,
            [DropdownMenu.name]: DropdownMenu,
            [DropdownItem.name]: DropdownItem,
            [DatetimePicker.name]: DatetimePicker,
            [Popup.name]: Popup,
            [ActionSheet.name]: ActionSheet,
            [Sticky.name]: Sticky,
            [Tab.name]: Tab,
            [Tabs.name]: Tabs,
            [Button.name]: Button,
            [Icon.name]: Icon,
            Toast,
        }
    };
</script>


<style lang="scss" scoped>

</style>
