<template>
	<div class="report-index has-tabs pb-20">
		<ul class="huojv-tabs fixed-tabs" :class="orgType <= 5 ? 'two-cols' : 'three-cols'">
			<li @click="checkTab1(1)" v-eventlisten="{isChangePage:false,pageEvent:'切换到里程碑'}"
			    :class="[tab1 == 1 ? 'active' : '']"><label>里程碑</label></li>
			<li @click="checkTab1(2)" v-eventlisten="{isChangePage:false,pageEvent:'切换到一级节点'}"
			    :class="[tab1 == 2 ? 'active' : '']"><label>一级节点</label></li>
			<li v-if="orgType == 6" @click="checkTab1(3)" v-eventlisten="{isChangePage:false,pageEvent:'切换到二级节点'}"
			    :class="[tab1 == 3 ? 'active' : '']"><label>二级节点</label></li>
		</ul>
		<van-pull-refresh v-model="isLoading" success-text="刷新成功" loading-text="正在刷新..." @refresh="reloadWindow()">
			<div class="main-content mt-15">

				<van-sticky class="has-tab-sticky">
					<div class="data-content-panel list-title1 pt-15" style="padding-bottom: 0;">
						<el-table stripe v-show="orgType <= 5"
						          class="huo-list-table main-theme-table huojv-data-list list-title1 not-hide-text"
						          size="mini" highlight-current-row
						          :data="[]">
							<el-table-column prop="projectName" label="项目名称" width="120" align="left"></el-table-column>
							<el-table-column prop="taskName" label="节点名称" align="center" width="150"></el-table-column>
							<el-table-column prop="planTime" label="计划时间" align="center" width="150"></el-table-column>
                            <el-table-column :prop="orgType<5?'projectManager':'adUserName'" :label="orgType<5?'项目负责人':'节点负责人'" width="100" align="center"></el-table-column>
						</el-table>

						<el-table stripe v-show="orgType > 5"
						          class="huo-list-table main-theme-table huojv-data-list list-title2 not-hide-text"
						          size="mini" highlight-current-row
						          :data="[]">
							<el-table-column type="index" label="序号" align="center"></el-table-column>
							<el-table-column prop="taskName" label="节点名称" align="center" width="150"></el-table-column>
							<el-table-column prop="planTime" label="计划时间" align="center" width="150"></el-table-column>
							<el-table-column prop="adUserName" label="节点负责人" align="center" width="100"></el-table-column>
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
						<el-table stripe v-show="orgType <= 5"
						          class="huo-list-table main-theme-table huojv-data-list list-data1 hide-header"
						          size="mini" highlight-current-row
						          :data="dataList">
							<el-table-column prop="projectName" label="项目名称" width="120" align="left">
                                <template slot-scope="scope">
                                    <span :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.projectId,6)">{{scope.row.projectName}}</span>
								</template>
							</el-table-column>
							<el-table-column prop="taskName" label="节点名称" align="center" width="150">
								<template slot-scope="scope">
									<label class="red-color" v-text="scope.row.taskName  || ''"></label>
								</template>
							</el-table-column>
							<el-table-column prop="planTime" label="计划时间" align="center" width="150">
								<template slot-scope="scope">
									<label class="red-color" v-text="scope.row.planTime  || ''"></label>
								</template>
							</el-table-column>
                            <el-table-column :prop="orgType<5?'projectManager':'adUserName'" :label="orgType<5?'项目负责人':'节点负责人'" width="100" align="center">
                                <template slot-scope="scope">
									<label class="red-color" v-if="orgType<5" v-text="scope.row.projectManager  || ''"></label>
                                    <label class="red-color" v-else v-text="scope.row.adUserName  || ''"></label>
								</template>
                            </el-table-column>
						</el-table>


						<el-table stripe v-show="orgType > 5"
						          class="huo-list-table main-theme-table huojv-data-list list-data2 hide-header"
						          size="mini" highlight-current-row
						          :data="dataList">
							<el-table-column type="index" label="序号" align="center"></el-table-column>
							<el-table-column prop="taskName" label="节点名称" align="center" width="150">
                                <template slot-scope="scope">
                                    <span :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.projectId,6)">{{scope.row.taskName}}</span>
								</template>
                            </el-table-column>
							<el-table-column prop="planTime" label="计划时间" align="center" width="150"></el-table-column>
							<el-table-column prop="adUserName" label="节点负责人" align="center" width="100"></el-table-column>
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
                // orgId:getLocalStorage(['orgId']).orgId,
                orgType:'',

                tab1: 1,
                loading: false,
                isLoading: false,
                finished: false,
                isLoad: false,
                size: 20,
                current: 1,
                dataList: [],
                // taskType:{
                //     milepostTypeId:'4BD92065-4081-488A-ACB4-2C89DEDC2DD7,60611D76-6868-4B46-949F-B8A1410A6D1E',
                //     primaryNodeTypeId:'5963DC9F-33E2-4637-8FD9-5CE1961036A7',
                //     secondNodeTypeId:'17DBB9E4-941B-481D-B111-2597878A4EE6',
                //     thirdNodeTypeId:'58BEA6E1-68BE-49AD-938A-E6B389656D1A'
                // }

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
            // this.init();
            this.$nextTick(() => {
                // $('.list-title').scroll(function () {
                //     let scrollLeft = $(this).scrollLeft();
                //     $('.list-data').scrollLeft(scrollLeft);
                // });
                //
                // $(".list-data").scroll(function () {
                //     let scrollLeft = $(this).scrollLeft();
                //     $('.list-title').scrollLeft(scrollLeft);
                // })

                $('.list-title1 .el-table__header-wrapper').scroll(function () {
                    let scrollLeft = $(this).scrollLeft();
                    $(".list-data1 .el-table__body-wrapper").scrollLeft(scrollLeft);
                });

                $(".list-data1 .el-table__body-wrapper").scroll(function () {
                    let scrollLeft = $(this).scrollLeft();
                    $('.list-title1 .el-table__header-wrapper').scrollLeft(scrollLeft);
                })

                $('.list-title2 .el-table__header-wrapper').scroll(function () {
                    let scrollLeft = $(this).scrollLeft();
                    $(".list-data2 .el-table__body-wrapper").scrollLeft(scrollLeft);
                });

                $(".list-data2 .el-table__body-wrapper").scroll(function () {
                    let scrollLeft = $(this).scrollLeft();
                    $('.list-title2 .el-table__header-wrapper').scrollLeft(scrollLeft);
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
            // 获取计划进度数据
            getList(isRefresh) {
                // todo 这里只有里程碑和一级节点吗？ PC端还有二级节点和三级节点
                // const taskTypeId = this.tab1 == 1 ? this.taskType.milepostTypeId : this.taskType.primaryNodeTypeId;
                let taskTypeId = '里程碑';
                switch (this.tab1) {
                    case 1: taskTypeId = '里程碑';break;
                    case 2: taskTypeId = '一级';break;
                    case 3: taskTypeId = '二级';break;
                }
                request({
                    url: `/app-api/plan/schedule/warningList?size=${this.size}&current=${this.current}&orgId=${this.orgId}&taskTypeName=${taskTypeId}&orderByType=ASC`,
                    method: 'get'
                }).then(({data}) => {
                    if (data.code === 0) {
                        this.dataList = isRefresh ? data.warningList : this.dataList.concat(data.warningList);
                        this.loading = false;
                        this.isLoading = false;
                        this.isLoad = false;

                        if (null == data.warningList || data.warningList.length < this.size) {
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
                this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType
                this.current = 1;
                // this.dataList = [];
                this.getList(true);
            },

            // 切换  签约  回款  交付
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

</style>
