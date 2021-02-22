<template>
	<div class="detail-panel">
		<van-pull-refresh v-model="isLoading" success-text="刷新成功" loading-text="正在刷新..." @refresh="reloadWindow()">
			<van-nav-bar
					title="供应商详情"
					left-arrow
					@click-left="onClickLeft"
					v-eventlisten="{isChangePage:true,pageEvent:'点击返回按钮'}"
			/>

			<ul class="huojv-detail-list mt-15">
				<li class="clearfix">
					<label style="width: 50px;" class="title float-l">公司</label>
					<label style="width: calc(100% - 50px);" class="content float-r" v-text="detail.cosName || '暂无'"></label>
				</li>
				<li class="clearfix">
					<label class="title float-l">入库时间</label>
					<label class="content float-r" v-text="(detail.createDate.split(' ')[0]) || '暂无'"></label>
				</li>
				<li class="clearfix">
					<label class="title float-l">推荐人</label>
					<label class="content float-r" v-text="detail.recomMendeder || '暂无'"></label>
				</li>
				<li class="clearfix">
					<label class="title float-l">累计签约金额</label>
					<label class="content float-r" v-text="(detail.contractAmount || 0)+'元'"></label>
				</li>
				<li class="clearfix">
					<label class="title float-l">联系人及联系方式</label>
					<label class="content float-r" v-text="(detail.contactName || '') + ' ' + (detail.contactMobile || '')"></label>
				</li>
				<li class="clearfix">
					<label class="title float-l">联系人职位</label>
					<label class="content float-r" v-text="detail.contactPosition || '' "></label>
				</li>
			</ul>
		</van-pull-refresh>
	</div>
</template>

<script>
    import scrollFixed from '@/mixin/scroll-fixed';
    import { NavBar,PullRefresh } from 'vant';
    import request from '@/utils/request';


    export default {
        mixins: [scrollFixed],

        data() {
            return {
                isLoading: false,
	            id:'',
	            detail:{
                    createDate:''
	            }
            };
        },

        created() {
            this.id = this.$route.query.param;
            this.getCompanyDetail();
        },

        methods: {
            // 刷新页面
            reloadWindow(){
                setTimeout(() => {
                    window.location.reload();
                    this.isLoading = false;
                },500)
            },

	        // 点击返回按钮
            onClickLeft(){
                window.history.go(-1);
            },

	        // 获取公司详情数据
	        getCompanyDetail(){
                request({
                    url: `/app-api/costContract/companyDetail/${this.id}`,
                    method: 'get',
                    data:{}
                }).then(({data}) => {
                    if (data.code === 0) {
                        this.detail = data.companyDetail;
                    }
                });
	        }
        },

        components: {
            [NavBar.name]:NavBar,
            [PullRefresh.name]:PullRefresh
        }
    };
</script>


<style lang="scss" scoped>

</style>
