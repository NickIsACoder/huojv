<template>
	<div class="report-index pb-20">
		<van-nav-bar style="position: fixed; top: 0; width: 100%;" :title="title" left-arrow @click-left="onClickLeft"
		 v-eventlisten="{isChangePage:true,pageEvent:'点击返回按钮'}" />
		<van-pull-refresh v-model="isLoading" success-text="刷新成功" loading-text="正在刷新..." @refresh="reloadWindow">


			<div class="main-content mt-15 padding-nav">
				<div class="data-content-panel pt-15">
					<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">

						<div v-show="tab2 == 1 || tab2 == 2 ||tab2 == 3">
							<el-table stripe class="huo-list-table main-theme-table huojv-data-list" size="mini" highlight-current-row :data="tableList"
							          v-show="orgType <= 5">
								<el-table-column prop="projectName" label="项目名称" width="120" align="center">
									<template slot-scope="scope">
										<span :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.projectGUID,6)">{{scope.row.projectName}}</span>
									</template>
								</el-table-column>
								<el-table-column prop="taskName" label="逾期节点" width="120" align="center">
								</el-table-column>
								<el-table-column prop="overdueDays" label="逾期天数" width="80" align="center"></el-table-column>
								<el-table-column :prop="orgType<5?'projectManager':'principal'" :label="orgType<5?'项目负责人':'节点负责人'" width="100" align="center"></el-table-column>
							</el-table>
							<el-table stripe class="huo-list-table main-theme-table huojv-data-list" size="mini" highlight-current-row :data="tableList"
							          v-show="orgType == 6">
								<el-table-column prop="projectName" label="项目名称" width="120" align="center">
									<template slot-scope="scope">
										<span :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.projectGUID,6)">{{scope.row.projectName}}</span>
									</template>
								</el-table-column>
								<el-table-column prop="taskName" label="逾期节点" width="120" align="center"></el-table-column>
								<el-table-column prop="planDate" label="计划时间" width="100" align="center"></el-table-column>
								<el-table-column prop="principal" label="节点责任人" width="100" align="center"></el-table-column>
								<el-table-column prop="overdueDays" label="逾期天数" width="80" align="center"></el-table-column>
							</el-table>
						</div>

						<el-table stripe class="huo-list-table main-theme-table huojv-data-list" size="mini" highlight-current-row :data="tableList"
						 v-show="tab2 == 4">
							<el-table-column prop="projOrgName" label="项目名称" width="120" align="center">
								<template slot-scope="scope">
									<span :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.projectGUID,6)">{{scope.row.projOrgName}}</span>
								</template>
							</el-table-column>
							<el-table-column prop="duration" label="拿地至交付" align="center">
							</el-table-column>
							<el-table-column prop="adUserName" label="负责人" width="80" align="center">
							</el-table-column>
						</el-table>

						<!-- 里程碑分析详情 -->
						<el-table stripe class="huo-list-table main-theme-table huojv-data-list" size="mini" highlight-current-row :data="tableList"
						 v-show="tab2 == 99">
							<el-table-column prop="taskNames" label="节点名称" width="120" align="center">
							</el-table-column>
							<el-table-column prop="projectName" label="项目（期区）" align="center" width="100">
								<template slot-scope="scope">
									<span :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,6)">{{scope.row.projectName}}</span>
								</template>
							</el-table-column>
							<el-table-column prop="finishDetail" label="完成情况" width="80" align="center">
							</el-table-column>
							<el-table-column prop="planDate" label="计划时间" width="90" align="center">
							</el-table-column>
							<el-table-column prop="overdueDay" label="逾期天数" width="80" align="center">
							</el-table-column>
						</el-table>
						<!-- 里程碑分析详情 -->
						<el-table stripe class="huo-list-table main-theme-table huojv-data-list" size="mini" highlight-current-row :data="tableList"
						 v-show="tab2 == 100">
							<el-table-column prop="taskName" label="节点名称" width="120" align="center">
							</el-table-column>
							<el-table-column prop="projectName" label="项目（期区）" align="center" width="100">
								<template slot-scope="scope">
									<span :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,6)">{{scope.row.projectName}}</span>
								</template>
							</el-table-column>
							<el-table-column prop="finishDetail" label="完成情况" width="80" align="center">
							</el-table-column>
							<el-table-column prop="planDate" label="计划时间" width="90" align="center">
							</el-table-column>
							<el-table-column prop="overdueDay" label="逾期天数" width="80" align="center">
							</el-table-column>
						</el-table>
					</van-list>
					<!--				</van-pull-refresh>-->
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


	export default {
		mixins: [scrollFixed],

		data() {
			return {
				// orgId: getLocalStorage(['orgId']).orgId,

				tab2: 1,
				title: '',
				taskTypeId: '4BD92065-4081-488A-ACB4-2C89DEDC2DD7,60611D76-6868-4B46-949F-B8A1410A6D1E', //  1  签约 ， 2  回款， 3  交付
				loading: false, //上拉加载
				isLoading: false, //下拉刷新,从第一页开始
				isLoad: false,
				finished: false, //下拉加载完,如果没有数据设置true
				tableList: [],
				size: 20,
				current: 1,
				orgType: 2
			};
		},

		computed: {
			...mapState({
				orgId: state => state.orgId || getLocalStorage(['orgId']).orgId
			})
		},

		watch: {
			'$store.state.orgId': function(newVal, oldVal) {
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

				$('.el-table__header-wrapper').scroll(function() {
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
				this.current = 1;
				this.tableList = [];
				this.taskTypeId = this.$route.query.taskTypeId ||
					'4BD92065-4081-488A-ACB4-2C89DEDC2DD7,60611D76-6868-4B46-949F-B8A1410A6D1E';
				this.tab2 = this.$route.query.tab2;
				this.orgType = this.$route.query.orgType;

				// this.orgId = getUrlParam('chooseOrgId') || getUrlParam('orgId') || getLocalStorage('orgId').orgId

                // if (this.tab2 == 1) {
                //     this.title = '里程碑逾期节点情况'
                // } else if (this.tab2 == 2) {
                //     this.title = '一级节点逾期节点情况'
                // } else if (this.tab2 == 3) {
                //     this.title = '二级节点逾期节点情况';
                // }else if (this.tab2 == 100) {
                //     this.title = '任务专业未按时完成节点分析详情';
								// }
				console.log(this.tab2)

				if (this.tab2 == 1) {
					this.title = '里程碑逾期节点情况'
				} else if (this.tab2 == 2) {
					this.title = '一级节点逾期节点情况'
				} else if (this.tab2 == 3) {
					this.title = '二级节点逾期节点情况';
					// this.title = '拿地至开盘工程分析';
				} else if (this.tab2 == 4) {
					this.title = '拿地至交付工程分析';
				} else if (this.tab2 == 5) {
					this.title = '二级节点逾期节点情况';
				} else if (this.tab2 == 99) {
					this.title = '里程碑未按时完成节点分析详情';
				} else if (this.tab2 == 100) {
					this.title = '任务专业未按时完成节点分析详情';
				}

				// this.setTableData();

			},
			setTableData(isRefresh) {
				// this.tab2 = this.$route.query.tab2;
				if (this.tab2 == 1 || this.tab2 == 2 || this.tab2 == 3) {
					request({
						url: `/app-api/plan/schedule/overdueList?orgId=${this.orgId}&size=${this.size}&current=${this.current}&taskTypeName=${this.taskTypeId}`,
						method: 'get'
					}).then(({
						data
					}) => {
						if (data.code == 0) {
							this.tableList = isRefresh ? data.overdueList : this.tableList.concat(data.overdueList);
							this.loading = false;
							this.isLoading = false;
							this.isLoad = false;

							if (null == data.overdueList || data.overdueList.length < this.size || this.tableList.length >= data.total) {
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
						console.log('getBoardData-err', e);
					});
				} else if (!this.tab2) {  // todo 2020-10-20 去除tab2 == 3 || tab2 == 4  这部分代码已经注释
					request({
						url: `/app-api/plan/schedule/workDayList`,
						method: 'post',
						data: {
							current: this.current,
							orgId: this.orgId,
							orgType: getUrlParam('chooseOrgType') || getUrlParam('orgType'),
							size: this.size
						}
					}).then(({
						data
					}) => {
						if (data.code == 0) {
							let list = [];
							if (this.tab2 == 3) {
								list = data.data.landOpens;
							} else if (this.tab2 == 4) {
								list = data.data.landDelivers;
							}
							this.tableList = isRefresh ? list : this.tableList.concat(list);
							this.loading = false;
							this.isLoading = false;
							this.isLoad = false;

							if (null == list || list.length < this.size || this.tableList.length >= data.total) {
								this.finished = true;
							} else {
								if (this.current > 1) {
									let scrollTop = $('#app').scrollTop();
									$('#app').scrollTop(scrollTop - 300);
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
						console.log('getBoardData-err', e);
					});
				}

			},
			// 里程碑分析和任务专业分析
			setlcbAndTaskTableData(isRefresh){
				let _url = '',
					params = {
							current: this.current,
							size: this.size,
							orgType: this.$route.query.orgType,
							dateType: this.$route.query.dateType,
							orgId: this.$route.query.orgId
						}
				if (this.tab2 ==99) {
					_url = `/app-api/plan/schedule/milepostIncompleteDetail`
					params.taskID = this.$route.query.taskID
				} else if (this.tab2 ==100){
					_url = `/app-api/plan/schedule/professionIncompleteDetail`
					params.rowNum = this.$route.query.taskID
				}
				request({
						url: _url,
						method: 'post',
						data: params
					}).then(({ data	}) => {
						if (data.code == 0) {
							let _data = data.data
							this.tableList = isRefresh ? _data : this.tableList.concat(_data)
							this.loading = false;
							this.isLoading = false;
							this.isLoad = false;

							if (null == _data || _data.length < this.size || this.tableList.length >= data.total) {
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
						console.log('list-err', e);
					});
			},
			onLoad() {
				if (this.isLoad) return;
				this.isLoad = true;

				// 里程碑分析和任务专业分析
				if (this.tab2 ==99 ||this.tab2 ==100 ) {
					this.setlcbAndTaskTableData()
				} else {
					this.setTableData();
				}
			},

			onRefresh() {
				this.current = 1;
				this.loading = false;
				this.isLoading = false;
				this.finished = false;
				this.isLoad = false;
				// this.tableList = [];
				// 里程碑分析
				if (this.tab2 ==99||this.tab2 ==100) {
					this.setlcbAndTaskTableData(true)
				} else {
					this.setTableData(true);
				}
			}
		},

		components: {
			[List.name]: List,
			[PullRefresh.name]: PullRefresh,
			[NavBar.name]: NavBar,
			Toast
		}
	};
</script>


<style lang="scss" scoped>

</style>
