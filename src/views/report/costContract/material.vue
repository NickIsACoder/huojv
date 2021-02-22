<template>
	<div class="detail-panel height100 white-bg">
		<van-pull-refresh v-model="isLoading" success-text="刷新成功" loading-text="正在刷新..." @refresh="reloadWindow()">
			<van-nav-bar
					style="position: fixed; top: 0; width: 100%;"
					title="材料清单详情"
					left-arrow
					@click-left="onClickLeft"
					v-eventlisten="{isChangePage:true,pageEvent:'点击返回按钮'}"
			/>


			<van-sticky :offset-top="46">
				<div class="detail-table-panel" style="padding-bottom: 0;">
					<div class="detail-title" v-text="name"></div>
					<ul class="huojv-data-list list-title1" style="overflow-x: auto;">
						<li class="title" style="width: 631px; padding: 0;">
							<label style="width: 50px; border-right: 1px solid #E8E8E8; text-align: center;">序号</label>
							<label style="width: 100px;">材料名称</label>
							<label style="width: 100px; ">综合单价</label>
							<label style="width: 180px; ">规格</label>
							<label style="width: 100px; ">历史最高(元)</label>
							<label style="width: 100px; text-align: center;">历史最低(元)</label>
						</li>
					</ul>
				</div>
			</van-sticky>
			<div class="detail-table-panel pt-40" style="position: relative; top: 46px;">
	<!--			<van-pull-refresh v-model="isLoading" @refresh="onRefresh">-->
					<van-list
							v-model="loading"
							:finished="finished"
							finished-text="没有更多了"
							@load="onLoad"
					>
						<el-table stripe
					          class="huo-list-table main-theme-table huojv-data-list hide-header list-data1" size="mini" highlight-current-row
					          :data="tableListBoard">
						<el-table-column
								type="index"
								label="序号"
								align="center"
								width="50">
						</el-table-column>
						<el-table-column prop="meName" label="材料名称" width="100"
						                 align="center"></el-table-column>
							<el-table-column prop="price" label="综合单价" width="100"
							                 align="center" ></el-table-column>
						<el-table-column prop="origin" label="规格" width="180"
						                 align="center" ></el-table-column>
						<el-table-column prop="mprice" label="历史最高(元)" width="100"
						                 align="center" ></el-table-column>
						<el-table-column prop="nprice" label="历史最低(元)" width="100"
						                 align="center" ></el-table-column>
					</el-table>
						<div v-if="!tableListBoard.length" class="huojv-data-list-none" style="margin-top: 15px;">没有更多了</div>
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


    export default {
        mixins: [scrollFixed],

        data() {
            return {
                loading: false,//上拉加载
                isLoading: false,//下拉刷新,从第一页开始
                finished: false,//下拉加载完,如果没有数据设置true
	            size:20,
	            current:1,
                tableListBoard: [],
	            name: '',
	            isLoad:false  // 是否处于加载状态  手动控制  以免一直执行onLoad方法
            };
        },

        mounted() {
            this.name = this.$route.query.contractName;
            // this.getMaterialList();
            this.$nextTick(() => {
                $(".list-title1").scroll(function () {
                    let scrollLeft = $(this).scrollLeft();
                    console.log(scrollLeft);
                    $('.list-data1 .el-table__body-wrapper').scrollLeft(scrollLeft);
                })

                $(".el-table__body-wrapper").scroll(function () {
                    let scrollLeft = $(this).scrollLeft();
                    console.log(scrollLeft);
                    $('.list-title1').scrollLeft(scrollLeft);
                })
            })
        },

        methods: {
            reloadWindow(){
                setTimeout(() => {
                    window.location.reload();
                    this.isLoading = false;
                },500)
            },
            onClickLeft() {
                window.history.go(-1);
            },

	        // 获取材料清单明细
	        getMaterialList(isRefresh){
                request({
                    url: `/app-api/costContract/materialDetail/${this.$route.query.contractId}?size=${this.size}&current=${this.current}`,
                    method: 'get'
                }).then(({data}) => {
                    if(data.code === 0 && data.list){
                        this.tableListBoard = isRefresh ? data.list : this.tableListBoard.concat(data.list);
                        this.loading = false;
                        this.isLoading = false;
                        this.isLoad = false;

                        if (null == data.list || data.list.length < this.size || this.tableListBoard.length >= data.total) {
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
                        this.tableListBoard = [];
                        this.loading = false;
                        this.isLoading = false;
                        this.finished = true;
                        this.isLoad = false;
                    }
                }).catch((e) => {
                    this.current = 1;
                    this.tableListBoard = [];
                    this.loading = false;
                    this.isLoading = false;
                    this.finished = true;
                    this.isLoad = false;
                    console.log('getEchartData-err', e);
                });
	        },

            onLoad(){
                if(this.isLoad) return;  // 如果正在加载  返回
                this.isLoad = true;
                // 加载状态结束
                this.loading = false;
                this.getMaterialList();
            },

            onRefresh(){
                this.current = 1;
                // this.tableListBoard = [];
                this.getMaterialList(true);
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
