<template>
	<div class="detail-panel">
		<van-pull-refresh v-model="isLoading" success-text="刷新成功" loading-text="正在刷新..." @refresh="reloadWindow()">
			<!--			<van-nav-bar-->
			<!--					title="火炬系统经营日报"-->
			<!--					left-arrow-->
			<!--					@click-left="onClickLeft"-->
			<!--					v-eventlisten="{isChangePage:true,pageEvent:'点击返回按钮'}"-->
			<!--			/>-->

			<div class="main-content">
				<van-list
						v-model="loading"
						:finished="finished"
						finished-text="没有更多了"
						@load="onLoad"
				>
					<div class="mt-20" v-for="(detail,index) in detailList" :key="'detail'+index">
						<div class="list-item-date" v-text="detail.customPushDate"></div>

						<div class="data-content-panel pt-15" style="border-radius: 0;" @click="onClickLeft">
							<ul class="huojv-data-list3">
								<li>
									<div class="title">组织：</div>
									<div class="content" v-text="detail.orgName || '暂无'"></div>
								</li>
								<li>
									<div class="title">日期：</div>
									<div class="content" v-text="detail.pushDate || '暂无'"></div>
								</li>
								<li>
									<div class="title">本日认购金额：</div>
									<div class="content" v-text="(detail.dayOrderAmount || '0') + '万元'"></div>
								</li>
								<li>
									<div class="title">本日签约金额：</div>
									<div class="content" v-text="(detail.dayContractAmount || '0') + '万元'"></div>
								</li>
								<li>
									<div class="title">本日回款金额：</div>
									<div class="content" v-text="(detail.dayGetAmount || '0') + '万元'"></div>
								</li>
								<li>
									<div class="title">本年认购金额：</div>
									<div class="content" v-text="(detail.yearOrderAmount || '0.00') + '亿元'"></div>
								</li>
								<li>
									<div class="title">本年签约金额：</div>
									<div class="content" v-text="(detail.yearContractAmount || '0.00') + '亿元'"></div>
								</li>
								<li>
									<div class="title">本年回款金额：</div>
									<div class="content" v-text="(detail.yearGetAmount || '0.00') + '亿元'"></div>
								</li>
							</ul>
						</div>
					</div>

				</van-list>
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

    window.goToHome = window.webkit ? window.webkit.messageHandlers.goToHome : {}

    export default {
        mixins: [scrollFixed],

        data() {
            return {
                current: 1,
                size: 20,
                detailList:[],
                loading:false,
                isLoading:false,
                finished:false,
                title:'',
            };
        },

        watch:{
            '$store.state.orgId':function(newVal, oldVal){
                this.getDetailList(true);
            }
        },

        computed: {
            ...mapState({
                orgId: state => state.orgId || getLocalStorage(['orgId']).orgId
            })
        },

        mounted() {
            // this.getDetailList();
        },

        methods: {
            reloadWindow(){
                setTimeout(() => {
                    window.location.reload();
                    this.isLoading = false;
                },500)
            },
            onClickLeft(){
                // window.history.go(-1);
                // this.$router.push({
                //     path:'/warning/marketing',
                //     query: {marketingTab: this.marketingTab}
                // });
                const u = navigator.userAgent;

                const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端

                const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

                if(isAndroid){
                    jsObjectWebView.goAppMain()
                }else if(isiOS){
                    window.goToHome.postMessage(null);
                }
            },

            getDetailList(isRefresh){
                request({
                    url: `/app-api/appPush/list?current=${this.current}&size=${this.size}`,
                    method: 'get',
                    data:{}
                }).then(({data}) => {
                    if(data.code === 0){
                        this.detailList = isRefresh ? data.data.list : this.detailList.concat(data.data.list);
                        this.loading = false;
                        this.isLoading = false;

                        if (null == data.data.list || data.data.list.length < this.size || this.detailList.length >= data.data.totalCount) {
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
                        this.detailList = [];
                        this.loading = false;
                        this.isLoading = false;
                        this.finished = true;
                        this.current = 1;
                    }

                }).catch((e) => {
                    this.detailList = [];
                    this.loading = false;
                    this.isLoading = false;
                    this.finished = true;
                    this.current = 1;
                });
            },

            onLoad(){
                this.getDetailList();
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
