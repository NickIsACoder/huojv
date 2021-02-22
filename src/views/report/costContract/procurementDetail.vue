<template>
	<div class="report-index pb-20">
		<van-nav-bar style="position: fixed; top: 0; width: 100%;" :title="title" left-arrow @click-left="onClickLeft"
		 v-eventlisten="{isChangePage:true,pageEvent:'点击返回按钮'}" />
		<van-pull-refresh v-model="isLoading" success-text="刷新成功" loading-text="正在刷新..." @refresh="reloadWindow">
			<div class="main-content mt-15 padding-nav width100">
				<div class="data-content-panel content" :class="type==2?'pt-15':''">
					<van-sticky class="cost-contract-title" offset-top="45">
            <div v-show="type==1" style="margin:0;padding:0">
              <p class="dateSelBox icon" @click="showSel = true">{{selectedDate}}</p>
              <van-popup v-model="showSel" position="bottom">
                <van-picker
                  show-toolbar
                  :columns="columns"
                  @confirm="onConfirm"
                  @cancel="showSel = false"
                />
              </van-popup>
            </div>
				<div class="" style="padding-bottom: 0; background: #fff">
					<el-table stripe
						class="huo-list-table main-theme-table huojv-data-list huojv-sortable list-title"
						size="mini"	highlight-current-row :data="[]" v-show="type==1">
						<el-table-column prop="projOrgName" label="组织" align="center" fixed>
							<template slot-scope="scope">
								<span v-if="scope.row.orgType == 6" @click="jumpToPj(orgType,scope.row.orgId, scope.row.orgType)" :class="orgType==6?'':'jumpTxt'">{{scope.row.projOrgName}}</span>
								<span v-else>{{ scope.row.projOrgName }}</span>
							</template>
						</el-table-column>
									
				  <el-table-column prop="planName" label="招标采购计划名称" align="center"></el-table-column>
                  <el-table-column prop="tenderingWay" label="招标方式" align="center"></el-table-column>
                  <el-table-column prop="calibrationAmount" label="定标金额（万元）" align="center"></el-table-column>
                  <el-table-column prop="minAmount" label="开标最低价（万元）" align="center"></el-table-column>
                  <el-table-column prop="disparityAmount" label="定标金额与最低价差比" align="center"></el-table-column>
                  <el-table-column prop="winningUnit" label="中标单位" align="center"></el-table-column>
                  <el-table-column prop="enterUnitCount" label="入围单位数量" align="center"></el-table-column>
                  <el-table-column prop="effectiveCount" label="有效标数量" align="center"></el-table-column>
                  <el-table-column prop="unusualType" label="异常类型" align="center"></el-table-column>
                  <el-table-column prop="adUserName" label="负责人" align="center"></el-table-column>
								</el-table>
                <el-table stripe
									class="huo-list-table main-theme-table huojv-data-list huojv-sortable list-title"
									size="mini"	highlight-current-row :data="[]" v-show="type==2">
									<el-table-column prop="projOrgName" label="组织" align="center" fixed></el-table-column>
									<el-table-column prop="planName" label="招标采购计划名称" align="center"></el-table-column>
                  <el-table-column prop="planCalibrationDate" label="计划定标时间" align="center"></el-table-column>
                  <el-table-column prop="actualCalibrationDate" label="实际定标时间" align="center"></el-table-column>
                  <el-table-column prop="executionBias" label="执行偏差" align="center"></el-table-column>
                  <el-table-column prop="status" label="状态" align="center"></el-table-column>
                  <el-table-column prop="adUserName" label="负责人" align="center"></el-table-column>
								</el-table>
						</div>
					</van-sticky>
					<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
						<el-table stripe
                class="main-theme-table table-row-color" :show-header="false"
                size="mini" highlight-current-row :data="tableList" v-show="type==1">
                <el-table-column prop="projOrgName" label="组织" align="center" fixed>
					<template slot-scope="scope">
						<span v-if="scope.row.orgType == 6" @click="jumpToPj(orgType,scope.row.orgId, scope.row.orgType)" :class="orgType==6?'':'jumpTxt'">{{scope.row.projOrgName}}</span>
						<span v-else>{{ scope.row.projOrgName }}</span>
					</template>
				</el-table-column>					
                <el-table-column prop="planName" label="招标采购计划名称" align="center"></el-table-column>
                <el-table-column prop="tenderingWay" label="招标方式" align="center">
                  <template slot-scope="scope">
                    <span :class="scope.row.unusualType=='招标方式异常'?'red':''">{{scope.row.tenderingWay}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="calibrationAmount" label="定标金额（万元）" align="center">
                  <template slot-scope="scope">
                    <span :class="scope.row.unusualType=='招标方式异常'||scope.row.unusualType=='非最低价中标'?'red':''">{{scope.row.calibrationAmount||'-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="minAmount" label="开标最低价（万元）" align="center">
                  <template slot-scope="scope">
                    <span :class="scope.row.unusualType=='非最低价中标'?'red':''">{{scope.row.minAmount||'-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="disparityAmount" label="定标金额与最低价差比" align="center">
                  <template slot-scope="scope">
                    <span :class="scope.row.unusualType=='非最低价中标'||scope.row.disparityAmount>0?'red':''">{{scope.row.disparityAmount?scope.row.disparityAmount+'%':'-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="winningUnit" label="中标单位" align="center"></el-table-column>
                <el-table-column prop="enterUnitCount" label="入围单位数量" align="center">
                  <template slot-scope="scope">
                    <span :class="scope.row.unusualType=='有效单位不足'?'red':''">{{scope.row.enterUnitCount||'-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="effectiveCount" label="有效标数量" align="center">
                  <template slot-scope="scope">
                    <span :class="scope.row.unusualType=='有效单位不足'?'red':''">{{scope.row.effectiveCount||'-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="unusualType" label="异常类型" align="center"></el-table-column>
                <el-table-column prop="adUserName" label="负责人" align="center"></el-table-column>
              </el-table>
              <el-table stripe
									class="main-theme-table table-row-color" :show-header="false"
                  size="mini" highlight-current-row :data="tableList" v-show="type==2">
                  <el-table-column prop="projOrgName" label="组织" align="center" fixed></el-table-column>
									<el-table-column prop="planName" label="招标采购计划名称" align="center"></el-table-column>
                  <el-table-column prop="planCalibrationDate" label="计划定标时间" align="center"></el-table-column>
                  <el-table-column prop="actualCalibrationDate" label="实际定标时间" align="center"></el-table-column>
                  <el-table-column prop="executionBias" label="执行偏差" align="center">
                    <template slot-scope="scope">
                      <span :class="scope.row.executionBias>0?'red':''">{{scope.row.executionBias}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="status" label="状态" align="center"></el-table-column>
                  <el-table-column prop="adUserName" label="负责人" align="center"></el-table-column>
              </el-table>
					</van-list>
           <!-- <p class="tips" v-show="type==2">注：取数范围为计划定标时间在本月，实际定标时间在本月的合集</p> -->
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
		NavBar,
		Picker,
		Popup
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
				title: '',
				loading: false, //上拉加载
				isLoading: false, //下拉刷新,从第一页开始
				isLoad: false,
				finished: false, //下拉加载完,如果没有数据设置true
				tableList: [],
				size: 10,
				current: 1,
				orgType: '',
				type: '',
				showSel: false,
				columns: [],
				selectedDate: '',
				orgName: ''
			};
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
			jumpToPj,
			reloadWindow() {
				setTimeout(() => {
					window.location.reload()
					this.isLoading = false;
				}, 500)
			},
			// 返回上一页
			onClickLeft() {
				// window.history.go(-1);
				this.$router.go(-1)
			},
			init() {
				this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType;
				this.current = 1
				this.tableList = []
				this.type = this.$route.query.type
				this.orgName = sessionStorage.getItem('orgName')
				this.title = this.type==1 ? '月度招标异常项明细表': this.orgName+'月度招标采购执行情况'
			},
			// 获取月份数据
			getMonths(el,title) {
				request({
					url: `/app-api/costContract/tendering/months?orgId=${this.$route.query.orgId}`,
					method: 'post',
				}).then(res => {
					this.columns = res.data.data?res.data.data:[]
					this.columns.push('全部')
					this.selectedDate = this.columns[0]
					this.isLoad = true
					this.setTableData()
				});
			},
      // 月度招标异常项明细表-年月选择
      onConfirm(item) {
        console.log(item)
				this.showSel = false
				if (item) {
					this.selectedDate = item
					this.tableList = [];
					this.current = 1;
					this.loading = false;
					this.isLoading = false;
					this.finished = true;
					this.isLoad = false;
					this.setTableData()
				}
			},
			// 获取表格数据
			setTableData(isRefresh) {
				let url = ''
				let _month = this.selectedDate=='全部'?'':this.selectedDate
				if (this.type==1) {
					url  = `/app-api/costContract/tendering/aberrantDetail?orgId=${this.$route.query.orgId}&month=${_month}&size=${this.size}&current=${this.current}`
				} else {
					url  = `/app-api/costContract/tendering/detail?orgId=${this.$route.query.orgId}&size=${this.size}&current=${this.current}`
				}
					request({
						url: url,
						method: 'post',
						data:{}
					}).then(({ data }) => {
						if (data.code == 0) {
              				let list = [],total = 0
							
							list = data.data.records
							total = data.data.total

							this.tableList = isRefresh ? list : this.tableList.concat(list);
							// this.tableList = this.tableList.concat(list);
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
				if (this.type==1&&this.current==1) {
					this.getMonths()
				}else{
					this.isLoad = true;
					this.setTableData()
				}
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
			[Picker.name]: Picker,
			[Popup.name]: Popup,
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
  left: 15px;
  right: 15px;
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
.red{
  color: red;
}
.tips{
  font-size: 9px;
  color: #C8C8C8;
  margin: 0 auto;
}
.dateSelBox{
  margin: 10px auto;
  width: 100px;
  border: 1px solid #E8E8E8;
  font-size: 12px;
  text-align: center;
  color: #3A3A3A;
  border-radius: 3px;
  height: 25px;
  line-height: 25px;
}
.icon{
	position: relative;
}
.icon::after{
	content: '';
	width: 5px;
	height: 5px;
	border-right: 1px solid #3A3A3A;
	border-bottom: 1px solid #3A3A3A;
	transform: rotate(45deg) translateY(-70%);
	position: absolute;
	right: 12%;
	top: 50%;
	display: block;
}
</style>
