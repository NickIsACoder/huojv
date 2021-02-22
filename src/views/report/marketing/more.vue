<template>
	<div class="report-index pb-20">
		<van-nav-bar style="position: fixed; top: 0; width: 100%;" :title="title" left-arrow @click-left="onClickLeft"
		 v-eventlisten="{isChangePage:true,pageEvent:'点击返回按钮'}" />
		<van-pull-refresh v-model="isLoading" success-text="刷新成功" loading-text="正在刷新..." @refresh="reloadWindow">
			<div class="main-content mt-15 padding-nav">
				<div class="data-content-panel pt-15">
					<!-- <span style="font-size:12px">{{this.orgType}}__{{this.orgId}}</span> -->
					<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">

						<el-table stripe class="huo-list-table main-theme-table huojv-data-list" size="mini" highlight-current-row :data="tableList">
							<el-table-column prop="superviseMatter" label="督办事项" align="center"></el-table-column>
							<el-table-column prop="sponsor" label="发起人" align="center"></el-table-column>
							<el-table-column prop="sponsDate" label="发起时间" align="center"></el-table-column>
							<el-table-column prop="principal" label="责任人" align="center">
								<template slot-scope="scope">
									<el-popover placement="bottom" width="230" trigger="click">
										<div class="tooltips">
											<p>
												<span>姓名</span>
												<span>{{scope.row.principal}}</span>
											</p>
											<p>
												<span>电话</span>
												<span>{{scope.row.principalTel}}</span>
											</p>
											<p>
												<span>所属组织</span>
												<span>{{scope.row.principalOrganization}}</span>
											</p>
											<p>
												<span>岗位</span>
												<span>{{scope.row.principalPost}}</span>
											</p>
										</div>
										<div slot="reference">{{scope.row.principal}}</div>
									</el-popover>
								</template>
							</el-table-column>
							<el-table-column prop="principalBUName" label="责任人所属公司" align="center" width="120"></el-table-column>
							<el-table-column prop="deadline" label="要求完成时间" align="center" width="120">
								<template slot-scope="scope">
									{{scope.row.deadline}}
								</template>
							</el-table-column>
							<el-table-column prop label align="center">
								<template slot-scope="scope">
									<span class="cDetail" @click="goDetail(scope.row)">查看详情</span>
								</template>
							</el-table-column>
						</el-table>
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
		getUrlParam
	} from '@/utils/common';


	export default {
		mixins: [scrollFixed],

		data() {
			return {
				title: '',
				loading: false, //上拉加载
				isLoading: false, //下拉刷新,从第一页开始
				isLoad: false,
				finished: false, //下拉加载完,如果没有数据设置true
				tableList: [],
				size: 20,
				current: 1,
				orgType: '',
				oid: ''
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

				$('.el-table__header-wrapper').scroll(function() {
					let scrollLeft = $(this).scrollLeft();
					$(this).next().scrollLeft(scrollLeft);
				});
			})
		},

		methods: {
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
				this.type = this.$route.query.type;
				this.orgType = this.$route.query.orgType
				this.title = this.$route.query.title
				// this.oid = getUrlParam('orgId')
			},
			setTableData(isRefresh) {
					request({
						url: `/app-api/human/handleSupervise`,
						method: 'post',
						data:{
							orgId: this.orgId,
							orgType: this.orgType,
							size: this.size,
							current: this.current
						}
					}).then(({ data }) => {
						if (data.code == 0) {
							let list = [],total = 0
							if (this.type==-1) {
								list = data.data.groupHeadVo
								total = data.groupHeadTotal
							} else if(this.type == 0){
								list = data.data.groupHeadVo  // 奥园集团
								total = data.groupHeadTotal
							} else if(this.type == 1){
								list = data.data.landHeadVo  // 地产集团
								total = data.landHeadTotal
							} else if(this.type == 2){
								list = data.data.businessHeadVo // 商业集团
								total = data.businessHeadTotal
							}

							// this.tableList = isRefresh ? list : this.tableList.concat(list);
							this.tableList = this.tableList.concat(list);
							this.loading = false;
							this.isLoading = false;
							this.isLoad = false;

							if (null == list || list.length < this.size || this.tableList.length >= total) {
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
				this.setTableData(true);
			},
			goDetail (row) {
				this.$router.push({
					path: '/marketing/detail',
					query: {
						token: getUrlParam('token'),
						orgId: getUrlParam('orgId'),
						taskID: row.taskID
					}
				});
			},
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
.cDetail {
		color: #b3a36b;
		font-size: 12px;
		text-decoration: underline;
	}
.tooltips {
  p {
    margin: 2px auto;
    text-align: left;
    font-size: 10px;
    color: #666666;
    display: flex;
    // align-items: center;
    span:first-child {
      flex: 1;
      position: relative;
      &:before {
        content: '';
        display: inline-block;
        width: 3px;
        height: 3px;
        border-radius: 100px;
        background: #b4a36b;
        vertical-align: middle;
        margin-right: 5px;
      }
    }
    span:last-child {
      flex: 2;
    }
  }
}
</style>
