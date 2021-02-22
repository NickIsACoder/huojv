<template>
	<div class="report-index has-tabs pb-20">
		<ul class="huojv-tabs fixed-tabs two-cols">
			<li @click="checkTab1(1)" v-eventlisten="{isChangePage:false,pageEvent:'切换到供销比健康'}" :class="[tab1 == 1 ? 'active' : '']"><label>供销比健康</label></li>
			<li @click="checkTab1(2)" v-eventlisten="{isChangePage:false,pageEvent:'切换到开销比健康'}" :class="[tab1 == 2 ? 'active' : '']"><label>开销比健康</label></li>
		</ul>
		<van-pull-refresh v-model="isLoading" success-text="刷新成功" loading-text="正在刷新..." @refresh="reloadWindow()">
			<div class="main-content mt-15">

				<div class="data-content-panel pt-15">
					<ul class="huojv-data-list three-cols list-title" style="overflow-x: auto;">
						<li class="title" style="padding: 0;">
							<label style="width: 60px; padding-left: 10px; box-sizing: border-box;">序号</label>
							<label style="width: 180px;">公司</label>
							<label style="width: calc(100% - 240px); text-align: center;">供销比</label>
						</li>
					</ul>
					<div class="list-data1">
						<van-list
								v-model="loading"
								:finished="finished"
								finished-text="没有更多了"
								@load="onLoad"
						>
							<el-table stripe
							          class="huo-list-table main-theme-table huojv-data-list hide-header" size="mini" highlight-current-row
							          :data="dataList">
								<el-table-column prop="rowNumber" label="序号" width="60">
								</el-table-column>
								<el-table-column prop="orgName" label="公司" width="180"
								                 align="center">
								</el-table-column>
								<el-table-column prop="rate" :label="tab1 == 1 ? '供销比' : '开销比'"
								                 align="center">
								</el-table-column>
							</el-table>

						</van-list>
					</div>
				</div>

			</div>
		</van-pull-refresh>
	</div>
</template>

<script>
    import { mapState } from 'vuex'
    import scrollFixed from '@/mixin/scroll-fixed';
    import { List, PullRefresh, Toast } from 'vant';
    import {getLocalStorage} from '@/utils/local-storage';
    import $ from 'jquery';
    import request from '@/utils/request';


    export default {
        mixins: [scrollFixed],

        data() {
            return {
                // orgId:getLocalStorage(['orgId']).orgId,

	            tab1:1,
                loading:false,
                isLoading:false,
	            finished:false,
                isLoad:false,
	            size:20,
	            current:1,
	            dataList:[],
            };
        },

        computed: {
            ...mapState({
                orgId: state => state.orgId || getLocalStorage(['orgId']).orgId
            })
        },

        mounted() {
            // this.init();
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

        watch:{
            '$store.state.orgId':function(newVal, oldVal){
                this.onRefresh();
            }
        },

        methods: {
            reloadWindow(){
                setTimeout(() => {
                    window.location.reload();
                    this.isLoading = false;
                },500)
            },
            // 获取计划进度数据
            getList(isRefresh){
                let params = {
                    size: this.size,
	                current: this.current,
                    orgId:this.orgId,
                    isOverSupply:1,
                    isOverExpenses:1
                };

                this.tab1 == 1 ? delete params.isOverExpenses : delete params.isOverSupply;
                request({
                    url: `/app-api/engineer/engineerWarning`,
                    method: 'get',
	                params
                }).then(({data}) => {
                    if(data.code === 0 && data.data){
                        const list = data.data.records;
                        list.forEach(item => {
                            if(this.tab1 == 1){
                                item.rate = item.supplyRate;
                            }else{
                                item.rate = item.expensesRate;
                            }
                        })

                        this.dataList = isRefresh ? list : this.dataList.concat(list);
                        this.loading = false;
                        this.isLoading = false;
                        this.isLoad = false;

                        if (null == list || list.length < this.size) {
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

            onLoad(){
                if(this.isLoad) return;  // 如果当前处于加载状态
                this.isLoad = true;

                this.getList();
            },

            onRefresh(){
                this.current = 1;
                // this.dataList = [];
                this.getList(true);
            },

	        // 切换  签约  回款  交付
            checkTab1(tab1){
                this.tab1 = tab1;
                this.onRefresh();
            },
        },

        components: {
            [List.name]: List,
	        [PullRefresh.name]:PullRefresh,
	        Toast
        }
    };
</script>


<style lang="scss" scoped>

</style>
