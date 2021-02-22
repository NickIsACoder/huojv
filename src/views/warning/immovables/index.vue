<template>
	<div class="report-index has-tabs pb-20">
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
        <!--  -->
		<van-pull-refresh v-model="isLoading" success-text="刷新成功" loading-text="正在刷新..." @refresh="reloadWindow()">
			<div class="main-content mt-15">
				<van-sticky class="has-tab-sticky" offset-top="40">
                    <ul class="huojv-tabs flexbox">
                        <li v-eventlisten="{isChangePage:false,pageEvent:'切换到三个月以上未出租面积'}" style="width:40%" :class="[tab1 == 1 ? 'active' : '']"><label>三个月以上未出租面积</label></li>
                    </ul>
					<div class="data-content-panel list-title1 pt-15" style="padding-bottom: 0;">
						<el-table stripe
						          class="huo-list-table main-theme-table huojv-data-list list-title1 not-hide-text"
						          size="mini" highlight-current-row
						          :data="[]">
                            <el-table-column type="index" label="序号"></el-table-column>
							<el-table-column prop="orgName" label="项目"></el-table-column>
                            <el-table-column prop="unRentArea" label="面积（㎡）" align="center"></el-table-column>
                            <el-table-column prop="reminder" label="被提醒人" align="center"></el-table-column>
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
							<el-table-column type="index" label="序号"></el-table-column>
							<el-table-column prop="orgName" label="项目">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.orgType == 6" @click="jumpToPj(orgType,scope.row.orgId, scope.row.orgType)" :class="orgType==6?'':'jumpTxt'">{{scope.row.orgName}}</span>
									<span v-else>{{ scope.row.orgName }}</span>
								</template>
                            </el-table-column>
                            <el-table-column prop="unRentArea" label="面积（㎡）" align="center" ></el-table-column>
                            <el-table-column prop="reminder" label="被提醒人" align="center"></el-table-column>
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
                size: 10,
                current: 1,
                dataList: [],
                tab: 0,
                queryPeriodList: ['年度','季度','月度','日'],
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
            changeTopTab(idx){
                this.tab = idx
                this.current = 1;
                this.getList(true);
            },
            getList(isRefresh) {
                request({
                    url: `/app-api/realEstate/getWarnList`,
                    method: 'post',
                    params: {
                        orgId: this.orgId,
                        current: this.current,
                        size: this.size,
                        sortType: 'DESC',
                        sortColumn: 'unRentArea',
                        queryPeriod: this.queryPeriodList[this.tab]
                    }
                }).then(({data}) => {
                    if (data.code === 0) {
                        this.dataList = isRefresh ? data.page.records : this.dataList.concat(data.page.records);
                        this.loading = false;
                        this.isLoading = false;
                        this.isLoad = false;

                        if (null == data.page || data.page.records.length < this.size) {
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
.fixed-tabs,.flexbox{
    display: flex;
    justify-content: center;
}
</style>
