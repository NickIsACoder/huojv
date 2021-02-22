<template>
	<div class="report-index pb-20">
		<van-nav-bar style="position: fixed; top: 0; width: 100%;" :title="title" left-arrow @click-left="onClickLeft"
		 v-eventlisten="{isChangePage:true,pageEvent:'点击返回按钮'}" />

		 <div class="mt-50 bgwhite box1" v-show="orgType<3">
			 <el-table stripe	class="huo-list-table main-theme-table huojv-data-list2" size="mini" highlight-current-row empty-text="暂无数据" :data="tableList1">
					<el-table-column label="地产集团" align="center">
						<el-table-column prop="keyNodeName" label="节点名称" align="center"></el-table-column>
						<el-table-column prop="taskTypeName" label="级别" align="center"></el-table-column>
					</el-table-column>
			</el-table>
			<el-table stripe class="huo-list-table main-theme-table huojv-data-list2 mt-20" size="mini" highlight-current-row	empty-text="暂无数据" :data="tableList2">
					<el-table-column label="商业集团" align="center">
						<el-table-column prop="keyNodeName" label="节点名称" align="center"></el-table-column>
						<el-table-column prop="taskTypeName" label="级别" align="center"></el-table-column>
					</el-table-column>
			</el-table>
		 </div>
		 <div v-show="orgType>=3" class="mt-50 bgwhite">
			 <el-table stripe
					class="huo-list-table main-theme-table huojv-data-list2" size="mini" highlight-current-row
						empty-text="暂无数据" :data="tableList">
						<el-table-column prop="keyNodeName" label="节点名称" align="center"></el-table-column>
						<el-table-column prop="taskTypeName" label="级别" align="center"></el-table-column>
			</el-table>
		 </div>
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
				tableList: [],
				tableList1: [],
				tableList2: [],
				orgType: ''
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
			}
		},
		mounted() {
			this.init();
			$(document).scrollTop(0)
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
				this.orgType = this.$route.query.orgType
				this.tableList = []
				this.tableList1 = []
				this.tableList2 = []
				this.title = '节点详情'
				if (this.$route.query.orgType<3) {
					this.setTableData('地产')
					this.setTableData('商业')
				}else{
					this.setTableData('')
				}
			},
			setTableData(orgGroup) {
				request({
					url: `/app-api/plan/schedule/professionTemplate`,
					method: 'post',
					data: {
						// orgGroup: orgGroup,
						orgId: this.$route.query.orgId,
						orgType: this.$route.query.orgType,
						rowNum: this.$route.query.rowNum
					}
				}).then(({ data }) => {
					if (data.code == 0) {
						// if (orgGroup=='地产') {
						// 	this.tableList1 = data.data;
						// } else if(orgGroup=='商业') {
						// 	this.tableList2 = data.data;
						// } else if(orgGroup=='') {
						// 	this.tableList = data.data;
						// } 
						if (orgGroup=='') {
							this.tableList = data.data[0].templates
						}else{
							if (data.data[0].groupName.indexOf('地产')!=-1) {
								this.tableList1 = data.data[0].templates
								this.tableList2 = data.data[1].templates
							} else {
								this.tableList1 = data.data[1].templates
								this.tableList2 = data.data[0].templates
							}
							
						}
						
					}
				}).catch((e) => {
					console.log('getBoardData-err', e);
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
.bgwhite{
	background: white;
	padding: 10px 10px 10px;
}
// .box1{
// 	display: flex;
// 	.bgwhite{
// 		flex: 1;
// 	}
// }
</style>
