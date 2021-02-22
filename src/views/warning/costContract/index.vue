<template>
	<div class="report-index has-tabs pb-20">
        <ul class="huojv-tabs fixed-tabs">
			<li v-eventlisten="{isChangePage:false,pageEvent:'切换到目标成本上线时效'}" :class="[tab1 == 1 ? 'active' : '']"><label>目标成本上线时效</label></li>
		</ul>
		<van-pull-refresh v-model="isLoading" success-text="刷新成功" loading-text="正在刷新..." @refresh="reloadWindow()">
			<div class="main-content mt-15">
				<van-sticky class="has-tab-sticky" offset-top="40">
					<div class="data-content-panel list-title1 pt-15" style="padding-bottom: 0;">
						<el-table stripe
						          class="huo-list-table main-theme-table huojv-data-list list-title1 not-hide-text"
						          size="mini" highlight-current-row
						          :data="[]">
							<el-table-column prop="projectName" label="预警超90天的分期名称" width="100"></el-table-column>
                            <el-table-column prop="yqDate" label="逾期天数" align="center" width="100"></el-table-column>
                            <el-table-column prop="approvedVersion" label="应审批版本" align="center" width="100"></el-table-column>
                            <el-table-column prop="currentVersion" label="当前版本" align="center" width="100"></el-table-column>
                            <el-table-column prop="uplinkNode" label="上线节点" align="center" width="100"></el-table-column>
						</el-table>
					</div>
				</van-sticky>
				<div class="data-content-panel ">
					<van-list
							v-model="loading"
							:finished="finished"
							finished-text="没有更多了"
							@load="onLoad"
					>
						<el-table stripe
						          class="huo-list-table main-theme-table huojv-data-list list-data2 hide-header"
						          size="mini" highlight-current-row
						          :data="dataList">
							<el-table-column prop="projectName" label="预警超90天的分期名称" width="100">
                                 <!-- <template slot-scope="scope">
                                      <span :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.projectGUID,scope.row.orgType)">{{scope.row.projectName}}</span>
                                </template> -->
                            </el-table-column>
                            <el-table-column prop="yqDate" label="逾期天数" align="center" width="100"></el-table-column>
                            <el-table-column prop="approvedVersion" label="应审批版本" align="center" width="100"></el-table-column>
                            <el-table-column prop="currentVersion" label="当前版本" align="center" width="100"></el-table-column>
                            <el-table-column prop="uplinkNode" label="上线节点" align="center" width="100"></el-table-column>
						</el-table>
					</van-list>
				</div>

			</div>
		</van-pull-refresh>
	</div>
</template>

<script>
    import {mapState} from 'vuex'
    import scrollFixed from '@/mixin/scroll-fixed';
    import {List, PullRefresh, Toast, Sticky} from 'vant';
    import {getLocalStorage} from '@/utils/local-storage';
    import {getUrlParam, jumpToPj} from '@/utils/common'
    import $ from 'jquery';
    import request from '@/utils/request';


    export default {
        mixins: [scrollFixed],

        data() {
            return {
                orgType:'',
                tab1: 1,
                loading: false,
                isLoading: false,
                finished: false,
                isLoad: false,
                size: 20,
                current: 1,
                dataList: [],
                taskType: {
                    milepostTypeId: '里程碑',
                    primaryNodeTypeId: '一级',
                }
            };
        },

        computed: {
            ...mapState({
                orgId: state => state.orgId || getLocalStorage(['orgId']).orgId
            })
        },

        mounted() {
            this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType');
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
        watch: {
            '$store.state.orgId': function (newVal, oldVal) {
                this.onRefresh();
            }
        },
        methods: {
            jumpToPj,
            reloadWindow() {
                setTimeout(() => {
                    window.location.reload();
                    this.isLoading = false;
                }, 500)
            },
            getList(isRefresh) {
                request({
                    url: `/app-api/costContract/getTargetCostAgingWarning`,
                    method: 'post',
                    data: {
                        current: this.current,
                        orderType: "DESC",
                        orgId: this.orgId,
                        size: this.size
                    }
                }).then(({data}) => {
                    if (data.code === 0) {
                        this.dataList = isRefresh ? data.data : this.dataList.concat(data.data);
                        this.loading = false;
                        this.isLoading = false;
                        this.isLoad = false;

                        if (null == data.data || data.data.length < this.size) {
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
                        this.dataList = [];
                        this.current = 1;
                        this.loading = false;
                        this.isLoading = false;
                        this.isLoad = false;
                        this.finished = true;
                    }
                }).catch((e) => {
                    this.dataList = [];
                    this.current = 1;
                    this.loading = false;
                    this.isLoading = false;
                    this.isLoad = false;
                    this.finished = true;
                });
            },
            onLoad() {
                if (this.isLoad) return;  // 如果当前处于加载状态
                this.isLoad = true;

                this.getList();
            },
            onRefresh() {
                this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType');
                this.current = 1;
                // this.dataList = [];
                this.getList(true);
            },
            checkTab1(tab1) {
                this.tab1 = tab1;
                this.onRefresh();
            },
        },

        components: {
            [List.name]: List,
            [PullRefresh.name]: PullRefresh,
            [Sticky.name]: Sticky,
            Toast
        }
    };
</script>


<style lang="scss" scoped>
.fixed-tabs{
    display: flex;
    justify-content: center;
}
</style>
