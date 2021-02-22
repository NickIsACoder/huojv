<template>
	<div class="report-index pb-20">
		<van-pull-refresh v-model="isLoading" success-text="刷新成功" loading-text="正在刷新..." @refresh="reloadWindow()">
			<ul class="huojv-tabs fixed-tabs">
          <li v-eventlisten="{isChangePage:false,pageEvent:'点击年度'}" @click="changeTopTab(0)" :class="[tab == 0 ? 'active' : '']">
            <label>年</label>
          </li>
          <li v-eventlisten="{isChangePage:false,pageEvent:'点击季度'}" @click="changeTopTab(1)" :class="[tab == 1 ? 'active' : '']">
            <label>季</label>
          </li>
          <li v-eventlisten="{isChangePage:false,pageEvent:'点击月度'}" @click="changeTopTab(2)" :class="[tab == 2 ? 'active' : '']">
            <label>月</label>
          </li>
        </ul>
			<div>
				<div class="main-content mt-15 mt-50">
					<div class="data-content-panel">
						<div class="data-title-box mt-5">
							<img class="title-ico" src="../../../assets/images/ic_topfive@2x.png">
							<span class="title">前五利润率龙虎榜</span>
						</div>

						<el-table stripe
						          class="huo-list-table main-theme-table"
						          size="mini" highlight-current-row
						          ref="dataTable1"
						          :data="frontList">
							<el-table-column label="排名" align="center" width="40">
								<template slot-scope="scope">
									<label :class="{'no-1-ico':scope.row.index === 1,'no-2-ico':scope.row.index === 2,'no-3-ico':scope.row.index === 3}"
									       v-text="scope.row.index > 3 ? scope.row.index : ''"></label>
								</template>
							</el-table-column>
							<el-table-column prop="orgName" label="项目" align="center">
								<template slot-scope="scope">
									<span v-if="scope.row.orgType == 6" @click="jumpToPj(orgType,scope.row.orgId, scope.row.orgType)" :class="orgType==6?'':'jumpTxt'">{{scope.row.orgName}}</span>
									<span v-else>{{ scope.row.orgName }}</span>
								</template>
							</el-table-column>
							<el-table-column prop="ebitdarate" label="EBITDA利润率" align="center">
								<template slot-scope="scope">
									{{scope.row.ebitdarate? scope.row.ebitdarate+'%': '-'}}
								</template>
							</el-table-column>
						</el-table>
					</div>
				</div>
				<div class="main-content mt-15">
					<div class="data-content-panel">
						<!-- 标题 -->
						<div class="data-title-box mt-5">
							<img class="title-ico" src="../../../assets/images/ic_laterfive@2x.png">
							<span class="title">后五利润率龙虎榜</span>
						</div>

						<el-table stripe
						          class="huo-list-table main-theme-table"
						          size="mini" highlight-current-row
						          ref="dataTable2"
						          :data="backList">
							<el-table-column label="排名" align="center" width="40">
								<template slot-scope="scope">
									<label class="last5-ico" v-text="scope.row.index"></label>
								</template>
							</el-table-column>
							<el-table-column prop="orgName" label="项目" align="center">
								<template slot-scope="scope">
									<span v-if="scope.row.orgType == 6" @click="jumpToPj(orgType,scope.row.orgId, scope.row.orgType)" :class="orgType==6?'':'jumpTxt'">{{scope.row.orgName}}</span>
									<span v-else>{{ scope.row.orgName }}</span>
								</template>
							</el-table-column>
							<el-table-column prop="ebitdarate" label="EBITDA利润率" align="center">
								<template slot-scope="scope">
									{{scope.row.ebitdarate? scope.row.ebitdarate+'%': '-'}}
								</template>
							</el-table-column>
						</el-table>

					</div>
				</div>
			</div>
		</van-pull-refresh>

	</div>
</template>

<script>
    import {mapState} from 'vuex'
    import scrollFixed from '@/mixin/scroll-fixed';
    import {List, PullRefresh, Toast, Icon} from 'vant';
    import {getLocalStorage} from '@/utils/local-storage';
    import $ from 'jquery';
    import {openLoading, closeLoading, getUrlParam,jumpToPj} from '@/utils/common';
    import request from '@/utils/request';


    export default {
        mixins: [scrollFixed],

        data() {
					return {
						// orgId: getLocalStorage(['orgId']).orgId,
						size: 5,
						current: 1,
						tab: 0,
						actTab: 0,  // 0  签证率 ， 1  变更率
						frontList: [],
						backList: [],
						queryPeriodList: ['年度','季度','月度','日'],
						isLoading: false,
						orgType: ''
					};
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

						$(".el-table__fixed-body-wrapper").scroll(function () {
							let scrollTop = $(this).scrollTop();
							$(this).parent().prev().scrollTop(scrollTop);
						})
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
            init() {
							this.orgId = getUrlParam('chooseOrgId') || getUrlParam('orgId') || getLocalStorage('orgId').orgId;
							this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType;
              this.setFrontTableData();
              this.setBackTableData();
						},
						changeTopTab(idx){
							this.tab = idx
							this.setFrontTableData();
              this.setBackTableData();
						},
            // 前5
            setFrontTableData(type) {
							if (!this.orgId) return;

							request({
									url: `/app-api/realEstate/getDragonList`,
									method: 'post',
									params: {
										orgId: this.orgId,
										current: this.current,
										size: this.size,
										sortType: 'DESC',
										sortColumn: 'EBITDARate',
										queryPeriod: this.queryPeriodList[this.tab]
									}
							}).then(({data}) => {
									if(data.code === 0){
											this.frontList = data.page.records;
											this.frontList.forEach((item, index) => {
													item.index = index + 1;
											})
									}
							}).catch((e) => {
									console.log('getBoardData-err', e);
							});
            },
            // 后5
            setBackTableData() {
							if (!this.orgId) return;
							request({
									url: `/app-api/realEstate/getDragonList`,
									method: 'post',
									params: {
										orgId: this.orgId,
										current: this.current,
										size: this.size,
										sortType: 'ASC',
										sortColumn: 'ebitdarate',
										queryPeriod: this.queryPeriodList[this.tab]
									}
							}).then(({data}) => {
									if(data.code === 0){
											this.backList = data.page.records;
											this.backList.forEach((item, index) => {
													item.index = index + 1;
											})
									}
							}).catch((e) => {
									console.log('getBoardData-err', e);
							});
						},
        },

        components: {
            [List.name]: List,
            [PullRefresh.name]: PullRefresh,
            [Icon.name]: Icon,
            Toast
        }
    };
</script>


<style lang="scss" scoped>

</style>
