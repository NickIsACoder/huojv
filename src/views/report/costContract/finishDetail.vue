<template>
	<div class="detail-panel height100 white-bg">
		<van-pull-refresh v-model="isLoading" success-text="刷新成功" loading-text="正在刷新..." @refresh="reloadWindow()">
			<van-nav-bar
					style="position: fixed; top: 0; width: 100%;"
					title="总包暂转固完成情况"
					left-arrow
					@click-left="onClickLeft"
					v-eventlisten="{isChangePage:true,pageEvent:'点击返回按钮'}"
			/>

			<div class="text-center pt-40">
				<ul class="huojv-tab-bars_1 two-cols max" style="margin-bottom: 0;">
					<li @click="checkTab1(1)" v-eventlisten="{isChangePage:false,pageEvent:'点击非商业综合体项目'}"
					    :class="[tab1 == 1 ? 'active' : '']">非商业综合体项目
					</li>
					<li @click="checkTab1(2)" v-eventlisten="{isChangePage:false,pageEvent:'点击商业综合体项目'}"
					    :class="[tab1 == 2 ? 'active' : '']">商业综合体项目
					</li>
				</ul>
			</div>

			<!-- 自定义表头  当表头滑动到页面顶部时悬浮 -->
			<van-sticky class="has-nav-sticky">
				<div class="data-content-panel pt-15 p-l-r-15" style="padding-bottom: 0;">
					<ul class="huojv-data-list list-title" style="overflow-x: auto;">
						<li class="title" style="width: 1221px; padding: 0;">
							<label style="width: 100px; text-align: center;">公司</label>
							<label style="width: 100px; ">项目</label>
							<label style="width: 100px; ">合同名称</label>
							<label style="width: 100px; ">总包单位</label>
							<label style="width: 100px; ">建筑面积</label>
							<label style="width: 100px;">合同总金额(亿)</label>
							<label style="width: 100px;">已暂转固金额(亿)</label>
							<label style="width: 100px;">出图时间</label>
							<label style="width: 100px;">计划完成时间</label>
							<label style="width: 100px;">实际完成时间</label>
							<label style="width: 60px;">耗时(天)</label>
							<label style="width: 80px;">成本负责人</label>
							<label style="width: 80px; text-align: center;">备注</label>
						</li>
					</ul>
				</div>
			</van-sticky>

			<div class="detail-table-panel list-data1">
	<!--			<van-pull-refresh v-model="isLoading" @refresh="onRefresh">-->
					<van-list
							v-model="loading"
							:finished="finished"
							finished-text="没有更多了"
							@load="onLoad"
					>
						<el-table stripe
					          class="huo-list-table main-theme-table huojv-data-list hide-header" size="mini" highlight-current-row
						          :data="tableList">
							<el-table-column prop="buOrgName" label="公司" width="100"
							                 align="left"></el-table-column>
							<el-table-column prop="orgName" label="项目" width="100">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.orgType == 6" @click="jumpToPj(orgType,scope.row.orgId, scope.row.orgType)" :class="orgType==6?'':'jumpTxt'">{{scope.row.orgName}}</span>
								    <span v-else>{{ scope.row.orgName }}</span>
                                </template>
                            </el-table-column>
							<el-table-column prop="contractName" label="合同名称" width="100"
							                 align="center" ></el-table-column>
							<el-table-column prop="turnkeyUnit" label="总包单位" width="100"
							                 align="center" ></el-table-column>
							<el-table-column prop="bldArea" label="建筑面积(万㎡)" align="center" width="100"></el-table-column>
							<el-table-column prop="contractAmount" label="合同总金额(亿)" align="center" width="100"></el-table-column>
							<el-table-column prop="transAmount" label="已暂转固金额(亿)" align="center" width="100"></el-table-column>
							<el-table-column prop="drawingTime" label="出图时间" width="100"
							                 align="center" ></el-table-column>
							<el-table-column prop="planDoneTime" label="计划完成时间" width="100"
							                 align="center" ></el-table-column>
							<el-table-column prop="actualDoneTime" label="实际完成时间" width="100"
							                 align="center" ></el-table-column>
							<el-table-column prop="timeConsuming" label="耗时(天)" width="60"
							                 align="center" ></el-table-column>
							<el-table-column prop="adUserName" label="成本负责人" width="80"
							                 align="center" ></el-table-column>
							<el-table-column prop="remark" label="备注" width="80"
							                 align="center" ></el-table-column>
						</el-table>
					</van-list>
	<!--			</van-pull-refresh>-->
			</div>
		</van-pull-refresh>
	</div>
</template>

<script>
    import scrollFixed from '@/mixin/scroll-fixed';
    import {List, PullRefresh,NavBar,Sticky} from 'vant';
    import $ from 'jquery';
    import request from '@/utils/request';
    import { getUrlParam, jumpToPj} from '@/utils/common';
    import {getLocalStorage} from '@/utils/local-storage';

    export default {
        mixins: [scrollFixed],

        data() {
            return {
                loading: false,//上拉加载
                isLoading: false,//下拉刷新,从第一页开始
                finished: false,//下拉加载完,如果没有数据设置true
	            size:20,
	            current:1,
                tableList: [],
                tab1:1,
	            name: '',
                isLoad:false,  // 是否处于加载状态  手动控制  以免一直执行onLoad方法
                orgType: getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType
            };
        },

        mounted() {
            this.name = this.$route.query.contractName;
            // this.getDetailList();
            this.$nextTick(() => {
                $(".list-title").scroll(function () {
                    let scrollLeft = $(this).scrollLeft();
                    $('.list-data1 .el-table__body-wrapper').scrollLeft(scrollLeft);
                })

                $(".list-data1 .el-table__body-wrapper").scroll(function () {
                    let scrollLeft = $(this).scrollLeft();
                    $('.list-title').scrollLeft(scrollLeft);
                })
            })
        },

        methods: {
            jumpToPj,
            reloadWindow(){
                setTimeout(() => {
                    window.location.reload();
                    this.isLoading = false;
                },500)
            },
            onClickLeft() {
                window.history.go(-1);
            },

	        // 切换tab 非商业综合体项目和商业综合体项目表格数据
            checkTab1(tab1){
                this.current = 1;
                this.tab1 = tab1;
                this.getDetailList(true);
            },

	        // 获取材料清单明细
	        getDetailList(isRefresh){
                request({
                    url: `/app-api/costContract/costEffectiveDetialList`,
                    method: 'get',
	                params:{
                        orgId:this.$route.query.orgId,
		                size: this.size,
		                current: this.current,
                        isBusiness: this.tab1 == 1 ? 0 : 1
	                }
                }).then(({data}) => {
                    if(data.code === 0 && data.data){
                        let list = data.data.records || [];
                        this.tableList = isRefresh ? list : this.tableList.concat(list);
                        this.loading = false;
                        this.isLoading = false;
                        this.isLoad = false;

                        if (null == list || list.length < this.size || this.tableList.length >= data.total) {
                            this.finished = true;
                        } else {
                            if(this.current > 1){
                                let scrollTop = $(document).scrollTop();
                                $(document).scrollTop(scrollTop - 300);
                            }
                            this.current += 1;
                            this.finished = false;
                        }
                    }else{
                        this.current = 1;
                        this.tableList = [];
                        this.loading = false;
                        this.isLoading = false;
                        this.finished = true;
                        this.isLoad = false;
                    }
                });
	        },

	        // 表格数据懒加载
            onLoad(){
                if(this.isLoad) return;  // 如果正在加载  返回
                this.isLoad = true;
                // 加载状态结束
                this.loading = false;
                this.getDetailList();
            },

	        // 刷新表格
            onRefresh(){
                this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType;
                this.current = 1;
                // this.tableList = [];
                this.getDetailList(true);
            },
        },

        components: {
            [NavBar.name]: NavBar,
            [List.name]: List,
            [PullRefresh.name]: PullRefresh,
            [Sticky.name]: Sticky,
        }
    };
</script>


<style lang="scss" scoped>

</style>
