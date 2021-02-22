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
									ref="table"
									class="huo-list-table main-theme-table huojv-data-list huojv-sortable list-title"
									size="mini"
									highlight-current-row
									@sort-change="sortChange"
									:data="[]"
									:default-sort = sort_json
									v-show="mapTab==0"
								>
									<el-table-column prop="city" label="城市名称" align="center" fixed="left"></el-table-column>
									<el-table-column prop="cityLevel" label="城市能级" align="center" width="90"></el-table-column>
									<el-table-column prop="projectAmounts" label="项目数(个)" align="center" sortable="custom" width="90" :sort-orders="['descending','ascending','descending']"></el-table-column>
									<el-table-column prop="availableAmount" label="总货值(亿元)" align="center" sortable="custom" width="90" :sort-orders="['descending','ascending','descending']"></el-table-column>
									<el-table-column prop="remainingResourcesAmount" label="剩余货值(亿元)" align="center" sortable="custom" width="90" :sort-orders="['descending','ascending','descending']"></el-table-column>
									<el-table-column prop="averagePrice" label="销售均价(元)" align="center" sortable="custom" width="90" :sort-orders="['descending','ascending','descending']"></el-table-column>
									<el-table-column prop="landStoreResourcesAmount" label="土储货值(亿元)" align="center" sortable="custom" width="90" :sort-orders="['descending','ascending','descending']"></el-table-column>
									<el-table-column prop="instockResourcesAmount" label="库存货值(亿元)" align="center" sortable="custom" width="90" :sort-orders="['descending','ascending','descending']"></el-table-column>
									<el-table-column prop="curPlanSupplyAmount" label="今年计划供应(亿元)" align="center" width="90" sortable="custom" :sort-orders="['descending','ascending','descending']"></el-table-column>
									<el-table-column prop="curYearsSoldAmount" label="今年实际已售(亿元)" align="center" width="90" sortable="custom" :sort-orders="['descending','ascending','descending']"></el-table-column>
								</el-table>
								<el-table
									stripe
									ref="table"
									class="huo-list-table main-theme-table huojv-data-list huojv-sortable list-title"
									size="mini"
									highlight-current-row
									@sort-change="sortChange"
									:data="[]"
									:default-sort = sort_json
									v-show="mapTab==1||mapTab==2"
								>
									<el-table-column :prop="mapTab==1?'city':'area'" :label="mapTab==1?'城市群名称':'区域名称'" align="center" fixed="left"></el-table-column>
									<el-table-column prop="projectAmounts" label="项目数(个)" align="center" sortable="custom" width="90" :sort-orders="['descending','ascending','descending']"></el-table-column>
									<el-table-column prop="availableAmount" label="总货值(亿元)" align="center" sortable="custom" width="90" :sort-orders="['descending','ascending','descending']"></el-table-column>
									<el-table-column prop="remainingResourcesAmount" label="剩余货值(亿元)" align="center" sortable="custom" width="90" :sort-orders="['descending','ascending','descending']"></el-table-column>
									<el-table-column prop="averagePrice" label="销售均价(元)" align="center" sortable="custom" width="90" :sort-orders="['descending','ascending','descending']"></el-table-column>
									<el-table-column prop="landStoreResourcesAmount" label="土储货值(亿元)" align="center" sortable="custom" width="90" :sort-orders="['descending','ascending','descending']"></el-table-column>
									<el-table-column prop="instockResourcesAmount" label="库存货值(亿元)" align="center" sortable="custom" width="90" :sort-orders="['descending','ascending','descending']"></el-table-column>
									<el-table-column prop="curPlanSupplyAmount" label="今年计划供应(亿元)" align="center" width="90" sortable="custom" :sort-orders="['descending','ascending','descending']"></el-table-column>
									<el-table-column prop="curYearsSoldAmount" label="今年实际已售(亿元)" align="center" width="90" sortable="custom" :sort-orders="['descending','ascending','descending']"></el-table-column>
								</el-table>
								<el-table
									stripe
									ref="table"
									class="huo-list-table main-theme-table huojv-data-list huojv-sortable list-title"
									size="mini"
									highlight-current-row
									@sort-change="sortChange"
									:data="[]"
									:default-sort = sort_json
									v-show="mapTab==999"
								>
									<el-table-column prop="productType" label="业态" align="center" width="90"></el-table-column>
									<el-table-column prop="remainingResourcesAmount" label="剩余货值(亿元)" align="center" sortable="custom" :sort-orders="['descending','ascending','descending']"></el-table-column>
									<el-table-column prop="curPlanSupplyAmount" label="今年计划供应(亿元)" align="center" sortable="custom" :sort-orders="['descending','ascending','descending']"></el-table-column>
									<el-table-column prop="curYearsSoldAmount" label="今年实际已售(亿元)" align="center" sortable="custom" :sort-orders="['descending','ascending','descending']"></el-table-column>
								</el-table>
						</div>
					</van-sticky>
					<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
						<el-table
              stripe
              class="huo-list-table main-theme-table huojv-data-list huojv-sortable list-data1"
              size="mini"
              highlight-current-row
							:show-header="false"
              @sort-change="sortChange"
              :data="tableList"
							:default-sort = sort_json
							v-show="mapTab==0"
            >
              <el-table-column prop="city" label="城市名称" align="center" fixed="left"></el-table-column>
							<el-table-column prop="cityLevel" label="城市能级" align="center" width="90"></el-table-column>
              <el-table-column prop="projectAmounts" label="项目数(个)" align="center" sortable="custom" width="90" :sort-orders="['descending','ascending','descending']"></el-table-column>
              <el-table-column prop="availableAmount" label="总货值(亿元)" align="center" sortable="custom" width="90" :sort-orders="['descending','ascending','descending']"></el-table-column>
              <el-table-column prop="remainingResourcesAmount" label="剩余货值(亿元)" align="center" sortable="custom" width="90" :sort-orders="['descending','ascending','descending']"></el-table-column>
              <el-table-column prop="averagePrice" label="销售均价(元)" align="center" sortable="custom" width="90" :sort-orders="['descending','ascending','descending']"></el-table-column>
              <el-table-column prop="landStoreResourcesAmount" label="土储货值(亿元)" align="center" sortable="custom" width="90" :sort-orders="['descending','ascending','descending']"></el-table-column>
              <el-table-column prop="instockResourcesAmount" label="库存货值(亿元)" align="center" sortable="custom" width="90" :sort-orders="['descending','ascending','descending']"></el-table-column>
              <el-table-column prop="curPlanSupplyAmount" label="今年计划供应(亿元)" align="center" width="90" sortable="custom" :sort-orders="['descending','ascending','descending']"></el-table-column>
              <el-table-column prop="curYearsSoldAmount" label="今年实际已售(亿元)" align="center" width="90" sortable="custom" :sort-orders="['descending','ascending','descending']"></el-table-column>
            </el-table>
						<el-table
              stripe
              class="huo-list-table main-theme-table huojv-data-list huojv-sortable list-data1"
              size="mini"
              highlight-current-row
							:show-header="false"
              @sort-change="sortChange"
              :data="tableList"
							:default-sort = sort_json
							v-show="mapTab==1||mapTab==2"
            >
              <el-table-column :prop="mapTab==1?'city':'area'" :label="mapTab==1?'城市群名称':'区域名称'" align="center" fixed="left"></el-table-column>
              <el-table-column prop="projectAmounts" label="项目数(个)" align="center" sortable="custom" width="90" :sort-orders="['descending','ascending','descending']"></el-table-column>
              <el-table-column prop="availableAmount" label="总货值(亿元)" align="center" sortable="custom" width="90" :sort-orders="['descending','ascending','descending']"></el-table-column>
              <el-table-column prop="remainingResourcesAmount" label="剩余货值(亿元)" align="center" sortable="custom" width="90" :sort-orders="['descending','ascending','descending']"></el-table-column>
              <el-table-column prop="averagePrice" label="销售均价(元)" align="center" sortable="custom" width="90" :sort-orders="['descending','ascending','descending']"></el-table-column>
              <el-table-column prop="landStoreResourcesAmount" label="土储货值(亿元)" align="center" sortable="custom" width="90" :sort-orders="['descending','ascending','descending']"></el-table-column>
              <el-table-column prop="instockResourcesAmount" label="库存货值(亿元)" align="center" sortable="custom" width="90" :sort-orders="['descending','ascending','descending']"></el-table-column>
              <el-table-column prop="curPlanSupplyAmount" label="今年计划供应(亿元)" align="center" width="90" sortable="custom" :sort-orders="['descending','ascending','descending']"></el-table-column>
              <el-table-column prop="curYearsSoldAmount" label="今年实际已售(亿元)" align="center" width="90" sortable="custom" :sort-orders="['descending','ascending','descending']"></el-table-column>
            </el-table>
						<el-table
              stripe
              class="huo-list-table main-theme-table huojv-data-list huojv-sortable list-data1"
              size="mini"
              highlight-current-row
							:show-header="false"
              @sort-change="sortChange"
              :data="tableList"
							:default-sort = sort_json
							v-show="mapTab==999"
            >
              <el-table-column prop="productType" label="业态" align="center" width="90" ></el-table-column>
							<el-table-column prop="remainingResourcesAmount" label="剩余货值(亿元)" align="center" sortable="custom" :sort-orders="['descending','ascending','descending']"></el-table-column>
							<el-table-column prop="curPlanSupplyAmount" label="今年计划供应(亿元)" align="center" sortable="custom" :sort-orders="['descending','ascending','descending']"></el-table-column>
							<el-table-column prop="curYearsSoldAmount" label="今年实际已售(亿元)" align="center" sortable="custom" :sort-orders="['descending','ascending','descending']"></el-table-column>
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
		Sticky,
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
				order: 'descending',
				test: '',
				sort_json: null,
				scrollLeft: 0,
				mapTab: 0
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

				this.title = ''
				if (this.$route.query.mapTab==0) {
					this.title = '城市资源布局明细表'
				} else if (this.$route.query.mapTab==1) {
					this.title = '城市群资源布局明细表'
				} else if (this.$route.query.mapTab==2){
					this.title = '地理区域资源布局明细表'
				} else if (this.$route.query.mapTab==999){
					this.title = '资源业态分布明细表'
				}

				this.mapTab = this.$route.query.mapTab

				// 默认排序字段
				// 总货值:availableAmount;项目数:projectAmounts;
				// 剩余货值:remainingResourcesAmount;销售均价:averagePrice;
				// 土储货值:landStoreResourcesAmount:库存货值:instockResourcesAmount;
				// 今年计划供应:curPlanSupplyAmount;今年实际已售:curYearsSoldAmount
				if (this.mapTab==999) {  // 产业业态
					this.orderParam = this.$route.query.orderParam
				} else {
					this.orderParam = this.$route.query.type
				}
				// this.order = 'descending'
				this.sort_json = {prop: this.orderParam, order: 'descending'}

			},
			getScrollNum(type){
				let tabs = {
					projectAmounts: 0,	// 项目数
					availableAmount: 90,	// 总货值
					remainingResourcesAmount: 180,	// 剩余货值
					averagePrice: 270,	// 销售均价
					landStoreResourcesAmount: 360,	// 土储货值
					instockResourcesAmount: 450,	// 库存货值
					curPlanSupplyAmount: 540,	// 今年计划供应
					curYearsSoldAmount: 630,	// 今年实际已售
				}
				return this.mapTab==0?tabs[type]:tabs[type]-90
			},
			setTableData(isRefresh) {
				// this.$nextTick(()=>{
				// 	$('.el-table__header-wrapper').scrollLeft(0);
				// })
				let _url = [
					'/app-api/resources/provinceMapMore',  // 城市布局
					'/app-api/resources/cityGroupMapMore',  // 城市群资源
					'/app-api/resources/areaMapMore',  // 地理区域 
					'/app-api/resources/productPercentagePieMore'   // 产业业态
				]
				request({
					url: _url[this.mapTab]|| _url[3],
          			method: 'post',
					data: {
						current: this.current,
						size: this.size,
						orgId: this.$route.query.orgId,
						orderParam: this.orderParam,
						orderParamType: this.order == 'descending'?'desc':'asc',
						type: this.$route.query.type,
						isCurrentData: 1+(this.$route.query.sourceType || 0)
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

						this.$nextTick(()=>{
							$('.el-table__header-wrapper').scrollLeft(this.getScrollNum(this.orderParam));
						})
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
			// sortChange(col){
			// 	this.tableList = []
			// 	console.log(col)
			// 	this.test = ''
			// 	this.order = col.order == 'ascending'? 'asc' : 'desc' 
			// 	this.orderParam = col.prop
			// 	this.current = 1
			// 	this.loading = false
			// 	this.isLoading = false
			// 	// this.finished = false
			// 	this.isLoad = false
      //   this.setTableData(true)
			// },
			sortChange({ column, prop, order }) {
				console.log(column, prop, order )
				if (order !== null && this.orderParam !== prop) {
					let columns = this.$refs['table'].columns.find(x => x.property === this.orderParam);
					// columns.order = '';
					column.order = 'descending'
				}
				if (order === null) {
					this.order === 'descending' ? order = 'ascending' : order = 'descending'
					column.order = order;
				}
				this.orderParam = prop;
				this.order = column.order;
				this.tableList = []
				this.current = 1;
				this.loading = false
				this.isLoading = false
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
  padding-top: 10px;
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
<style scoped>
.cost-contract-title{
		position: relative;
    z-index: 99999;
}
</style>