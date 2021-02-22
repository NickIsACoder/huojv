<template>
	<div class="detail-panel white-bg">
		<div class="main-content">
			<div class="data-content-panel">
				<!-- 标题 -->
				<div class="data-title-box data-title-line" >
					<span class="title">项目进度图</span>
				</div>

				<van-tabs v-model="tab1" class="vanTabs" color="#209B5C" line-width="30px" :ellipsis="false" title-active-color="#209B5C" @change="tabChange">
					<van-tab v-for="(item,index) in tabList" :title="item.name" :disabled="item.disabled" :key="index" title-style="margin:0 5px">
						<div slot="title">
							<span v-eventlisten="{isChangePage:false,pageEvent:'切换到-'+item.name}">{{item.name}}</span>
						</div>
					</van-tab>
				</van-tabs>

				<el-table stripe
				          class="huo-list-table main-theme-table mt-20 huojv-popover-table" size="mini" highlight-current-row
				          :data="tableData">
					<el-table-column prop="name" label="" width="110" align="left" fixed>
						<template slot-scope="scope">
							<el-popover
									popper-class="white"
									placement="right"
									width="280"
									trigger="hover">
								<ul class="huojv-table-popover-list1">
									<li class="title">计划时间</li>
									<li class="title">投资版时间</li>
									<li class="title">偏差时间</li>
								</ul>
								<ul class="huojv-table-popover-list1">
									<li class="content">{{scope.row.taskPlanDate || '-'}}</li>
									<li class="content">{{scope.row.investmentTask || '-'}}</li>
									<li class="content">{{scope.row.taskDif || '-'}}天
										<i v-show="scope.row.taskDif" :class="[scope.row.taskDif < 0 ? 'huojv-ico-down green-color' : (scope.row.taskDif > 0 ? 'huojv-ico-up red-color' : '')]"></i>
<!--										<img v-show="scope.row.taskDif" class="ico-i" :src="scope.row.taskDif < 0 ? icFall : (scope.row.taskDif > 0 ? icRise : '')">-->
									</li>
								</ul>

								<div v-show="scope.row.detailVos && scope.row.detailVos.length">
									<ul class="huojv-table-popover-list1 mt-20">
										<li class="title"></li>
										<li class="title">计划时间</li>
										<li class="title">执行时间</li>
									</ul>
									<ul class="huojv-table-popover-list1" v-for="(detail,index) in scope.row.detailVos" :key="'detail'+index">
										<li class="content"><i class="legend" :class="styleObj[detail.taskStatus]"></i>{{detail.infoDetail || '-'}}</li>
										<li class="content">{{detail.taskPlanDate || '-'}}</li>
										<li class="content">{{detail.taskImplementDate || '-'}}</li>
									</ul>
								</div>

								<label  slot="reference">
									<i class="legend" :class="scope.row.style"></i>
									<label v-text="scope.row.name"></label>
									<i v-show="scope.row.hasWindow" class="ml-5 el-icon-caret-bottom"></i>
								</label>
							</el-popover>

						</template>
					</el-table-column>
					<el-table-column prop="taskImplementDate" label="执行时间" width="100" align="center"></el-table-column>
					<el-table-column prop="taskPlanDate" label="计划时间" width="100" align="center"></el-table-column>
					<el-table-column prop="startupTask" label="运营会版" width="100" align="center"></el-table-column>
					<el-table-column prop="investmentTask" label="投资版" width="100" align="center"></el-table-column>
				</el-table>

				<ul class="huojv-legend-list mt-20">
					<li>
						<i class="legend conduct"></i><label>本年进行中</label>
					</li>
					<li>
						<i class="legend on-time-finished"></i><label>按时完成</label>
					</li>
					<li>
						<i class="legend overdue-finished"></i><label>逾期完成</label>
					</li>
					<li>
						<i class="legend overdue-unfinished"></i><label>逾期未完成</label>
					</li>
					<li>
						<i class="legend not-cur-year"></i><label>非本年</label>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
    import scrollFixed from '@/mixin/scroll-fixed';
    import {List, PullRefresh, NavBar, Icon,Tab, Tabs } from 'vant';
    import $ from 'jquery';
    import echarts from 'echarts'
    import request from '@/utils/request';
    import {getUrlParam, getNextMonths} from '@/utils/common'
    import ic_fall from '@/assets/images/ic_fall@2x.png'
    import ic_rise from '@/assets/images/ic_rise@2x.png'

    export default {
        mixins: [scrollFixed],

        data() {
            return {
                isLoading: false,//下拉刷新,从第一页开始
                orgId: '',  // 组织机构id
                orgType: 2,  // 组织机构类型

	            // 是否隐藏滑动手势
                hideGesture: {},
	            tab1:0,
                tabList: [],
                tableData:[],
                icFall: ic_fall,
                icRise: ic_rise,

                styleObj:{1:'conduct',2:'on-time-finished',3:'overdue-finished',4:'overdue-unfinished',5:'not-cur-year'}
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
            init() {
                this.orgId = getUrlParam('chooseOrgId') || getUrlParam('orgId');
                this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType');

	            this.getTabList();
            },

	        // 获取tab列表
            getTabList(){
                request({
                    url: `/app-api/plan/schedule/getStage`,
                    method: 'post',
                    data: {orgId: this.orgId}
                }).then(({data}) => {
                    if (data.code === 0 && data.data) {
                        this.tabList = [];
                        data.data.forEach(item => {
                            this.tabList.push({name:item,disabled: false});
                        })

                        this.tableData = [];
	                    if(this.tabList.length){
                            this.getSubwayMap();
	                    }
                    }
                });
	        },

            // 获取地铁图数据
            getSubwayMap(){
                const baseObj = {
                    detailVos:[],
                    infoDetail:'-',
                    infoType:0,
                    investmentTask:'-',
                    stage:'-',
                    startupTask:'-',
                    taskDif:'-',
                    taskImplementDate:'-',
                    taskPlanDate:'-',
                    taskStatus:5,
                    taskType:5
                };
                let names = ['拿地','修规批复','施工证','开工','开放','预售证','现金流回正','竣备','交付'];
                let stage = this.tabList.length && this.tabList[this.tab1].name;
                request({
                    url: `/app-api/plan/schedule/mapProjectSubwayMapVo`,
                    method: 'post',
                    data: {orgId: this.orgId,stage}
                }).then(({data}) => {
                    if (data.code === 0 && data.data) {
                        let list = [];
                        names.forEach((name,index) => {
                            if(data.data[index+1]){
                                let item = data.data[index + 1];
                                for(let attr in item){
                                    if(!item[attr]){
                                        item[attr] = '-'
                                    }
                                }

                                item.name = name;
                                item.style = this.styleObj[item.taskStatus];

                                list.push(item);
                            }else{
                                let item = JSON.parse(JSON.stringify(baseObj));
                                item.name = name;
                                item.style = this.styleObj[item.taskStatus];

                                list.push(item);
                            }
                        })

                        this.tableData = list;
                    }
                });
            },

            tabChange(tab1){
                this.tab1 = tab1;
                this.getSubwayMap();
            },

        },

        components: {
            [NavBar.name]: NavBar,
            [List.name]: List,
            [PullRefresh.name]: PullRefresh,
            [Icon.name]: Icon,
            [Tab.name]: Tab,
            [Tabs.name]: Tabs,
        }
    };
</script>


<style lang="scss" scoped>

</style>
