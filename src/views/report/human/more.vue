<template>
	<div class="report-index pb-20">
		<van-nav-bar style="position: fixed; top: 0; width: 100%;" :title="title" left-arrow @click-left="onClickLeft"
		 v-eventlisten="{isChangePage:true,pageEvent:'点击返回按钮'}" />
		<van-pull-refresh v-model="isLoading" success-text="刷新成功" loading-text="正在刷新..." @refresh="reloadWindow">
			<div class="main-content mt-15 padding-nav">
				<div class="data-content-panel pt-15 content">
					<van-sticky class="cost-contract-title" offset-top="45">
						<div class="" style="padding-bottom: 0; background: #fff">
								<el-table
									stripe
									class="huo-list-table main-theme-table huojv-data-list huojv-sortable list-title"
									size="mini"
									highlight-current-row
									:data="[]"
								>
									<el-table-column prop="orgName" label="所属集团" align="center" fixed></el-table-column>
									<el-table-column prop="total" label="在职人数" align="center"></el-table-column>
									<el-table-column label="学历" align="center">
										<el-table-column prop="eduUnderCollege" label="大专以下" align="center"></el-table-column>
										<el-table-column prop="eduCollege" label="大专" align="center"></el-table-column>
										<el-table-column prop="eduGraduate" label="本科" align="center"></el-table-column>
										<el-table-column prop="eduMasterOrAbove" label="硕士及以上" align="center"></el-table-column>
									</el-table-column>
									<el-table-column label="司龄" align="center">
										<el-table-column prop="senWithin1Year" label="1年以内" align="center"></el-table-column>
										<el-table-column prop="sen1T3Year" label="1-3年" align="center"></el-table-column>
										<el-table-column prop="sen3T5Year" label="3-5年" align="center"></el-table-column>
										<el-table-column prop="sen5T10Year" label="5-10年" align="center"></el-table-column>
										<el-table-column prop="senOver10Year" label="10年以上" align="center"></el-table-column>
									</el-table-column>
								</el-table>
						</div>
					</van-sticky>
					<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">

						<el-table
                stripe
                class="main-theme-table table-row-color"
                size="mini"
                highlight-current-row
								:show-header="false"
                :data="tableList"
              >
                <el-table-column prop="orgName" label="所属集团" align="center" fixed></el-table-column>
                <el-table-column prop="total" label="在职人数" align="center"></el-table-column>
                <el-table-column label="学历" align="center">
                  <el-table-column prop="eduUnderCollege" label="大专以下" align="center"></el-table-column>
                  <el-table-column prop="eduCollege" label="大专" align="center"></el-table-column>
                  <el-table-column prop="eduGraduate" label="本科" align="center"></el-table-column>
                  <el-table-column prop="eduMasterOrAbove" label="硕士及以上" align="center"></el-table-column>
                </el-table-column>
                <el-table-column label="司龄" align="center">
                  <el-table-column prop="senWithin1Year" label="1年以内" align="center"></el-table-column>
                  <el-table-column prop="sen1T3Year" label="1-3年" align="center"></el-table-column>
                  <el-table-column prop="sen3T5Year" label="3-5年" align="center"></el-table-column>
                  <el-table-column prop="sen5T10Year" label="5-10年" align="center"></el-table-column>
                  <el-table-column prop="senOver10Year" label="10年以上" align="center"></el-table-column>
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
		Sticky,
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
				size: 10,
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
				$('.el-table__header-wrapper').scroll(function () {
						let scrollLeft = $(this).scrollLeft();
						$('.el-table__body-wrapper').scrollLeft(scrollLeft);
				});

				$(".el-table__body-wrapper").scroll(function () {
						let scrollLeft = $(this).scrollLeft();
						$('.el-table__header-wrapper').scrollLeft(scrollLeft);
				})
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
				this.title = '在职人员以及结构'
				// this.oid = getUrlParam('orgId')
			},
			setTableData(isRefresh) {
					request({
						url: `/app-api/human/getHRDetail`,
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
							list = data.data.map(item => {
								return {
									eduCollege: item.eduCollege + '%',
									eduGraduate: item.eduGraduate + '%',
									eduMasterOrAbove: item.eduMasterOrAbove + '%',
									eduUnderCollege: item.eduUnderCollege + '%',
									orgName: item.orgName,
									sen1T3Year: item.sen1T3Year + '%',
									sen3T5Year: item.sen3T5Year + '%',
									sen5T10Year: item.sen5T10Year + '%',
									senOver10Year: item.senOver10Year + '%',
									senWithin1Year: item.senWithin1Year + '%',
									total: item.total
								}
							})
							total = data.total

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
		},

		components: {
			[List.name]: List,
			[PullRefresh.name]: PullRefresh,
			[NavBar.name]: NavBar,
			[Sticky.name]: Sticky,
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
.content .van-sticky--fixed>div{
  /* padding-top: 10px; */
}
.content .van-sticky--fixed{
  left: 14px;
  right: 14px;
  margin: 0 auto;
  background: white;
}
.four-cols li{
  font-size: 10px;
}

</style>
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
