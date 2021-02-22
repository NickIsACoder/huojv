<template>
	<div class="detail-panel">
		<van-pull-refresh v-model="isLoading" success-text="刷新成功" loading-text="正在刷新..." @refresh="reloadWindow()">
			<van-nav-bar
					:title="title"
					left-arrow
					@click-left="onClickLeft"
					v-eventlisten="{isChangePage:true,pageEvent:'点击返回按钮'}"
			/>

			<div class="main-content">
<!--				<van-list-->
<!--						v-model="loading"-->
<!--						:finished="finished"-->
<!--						finished-text="没有更多了"-->
<!--						@load="onLoad"-->
<!--				>-->
					<div class="data-content-panel pt-15 mt-15" v-for="(detail,index) in detailList" :key="'detail'+index">
						<ul class="huojv-data-list1">
							<li>
								<div class="title">责任人</div>
								<div class="content" v-text="detail.intervieweeName || '暂无'"></div>
							</li>
							<li>
								<div class="title">开始时间</div>
								<div class="content" v-text="detail.startTime || '暂无'"></div>
							</li>
							<li>
								<div class="title">结束时间</div>
								<div class="content" v-text="detail.endTime || '暂无'"></div>
							</li>
							<li>
								<div class="title">管理记录</div>
								<div class="content" v-html="detail.interviewedRecord || '暂无'"></div>
							</li>
							<li>
								<div class="title">附件</div>
								<ul class="content">
									<li v-for="(record,index1) in (detail.oaInterviewRecordEnclosuresList || [])" :key="'record'+index1">
										<a href="javascript:;" @click="viewFile(record.enclosureurl)" v-text="record.enclosureName"></a>
									</li>
								</ul>
							</li>
						</ul>
					</div>
<!--				</van-list>-->
			</div>
		</van-pull-refresh>
	</div>
</template>

<script>
    import scrollFixed from '@/mixin/scroll-fixed';
    import { NavBar,PullRefresh,List } from 'vant';
    import request from '@/utils/request';
	import {mapState} from 'vuex';
    import {getBaseUrl} from '@/utils/common';


    export default {
        mixins: [scrollFixed],

        data() {
            return {
				current: 1,
				size: 100,
				detailList:[],
				loading:false,
				isLoading:false,
				finished:false,
	            title:'',
				baseUrl: getBaseUrl().baseUrl,
                fileVuewUrl: getBaseUrl().fileVuewUrl,
	            type:0
            };
        },

		watch:{
			'$store.state.orgId':function(newVal, oldVal){
				this.getDetailList();
			}
		},

		computed: {
			...mapState({
				orgId: state => state.orgId || getLocalStorage(['orgId']).orgId
			})
		},

        mounted() {
            // this.id = this.$route.query.param;
            // this.getDetailList();
	        this.detailList = [];
            this.id = this.$route.query.id;
            this.type = this.$route.query.type;
            this.title = this.$route.query.orgName;
            sessionStorage.marketingTab = this.$route.query.tab1;
            this.getDetailList();
        },

        methods: {
            reloadWindow(){
                setTimeout(() => {
                    window.location.reload();
                    this.isLoading = false;
                },500)
            },
            onClickLeft(){
                window.history.go(-1);
                // this.$router.push({
                //     path:'/warning/marketing',
                //     query: {marketingTab: this.marketingTab}
                // });
            },

            getDetailList(){
                request({
                    url: `/app-api/oainterviewrecord/list?page=${this.current}&limit=${this.size}&orgId=${this.id}`,
                    method: 'get',
                    data:{}
                }).then(({data}) => {
                    if(data.code === 0){
                        this.detailList = data.page.list;
                    }else{
                        this.detailList = [];
                    }

                });
            },

	        // getDetailList(isRefresh){
            //     request({
            //         url: `/app-api/oainterviewrecord/list?page=${this.current}&limit=${this.size}&orgId=${this.id}&type=${this.type}`,
            //         method: 'get',
            //         data:{}
            //     }).then(({data}) => {
			// 		if(data.code === 0){
			// 			this.detailList = isRefresh ? data.page.list : this.detailList.concat(data.page.list);
			// 			this.loading = false;
			// 			this.isLoading = false;
	        //
			// 			if (null == data.page.list || data.page.list.length < this.size || this.detailList.length >= data.page.totalCount) {
			// 				this.finished = true;
			// 			} else {
			// 				if(this.current > 1){
			// 					let scrollTop = $(document).scrollTop();
			// 					$(document).scrollTop(scrollTop - 300);
			// 				}
			// 				this.current += 1;
			// 				this.finished = false;
			// 			}
			// 		}else{
			// 			this.detailList = [];
			// 			this.loading = false;
			// 			this.isLoading = false;
			// 			this.finished = true;
			// 			this.current = 1;
			// 		}
	        //
			// 	}).catch((e) => {
			// 		this.detailList = [];
			// 		this.loading = false;
			// 		this.isLoading = false;
			// 		this.finished = true;
			// 		this.current = 1;
			// 	});
	        // },

			// onLoad(){
			// 	this.getDetailList();
			// },

            viewFile(url){
                this.$router.push({
                    path:'/warning/fileView',
                    query: {url: this.fileVuewUrl + `?url=${encodeURIComponent(this.baseUrl + url)}`}
                    // query: {url: encodeURI(this.baseUrl + url)}
                });
            },
        },

        components: {
            [NavBar.name]:NavBar,
            [PullRefresh.name]:PullRefresh,
            [List.name]:List,
        }
    };
</script>


<style lang="scss" scoped>

</style>
