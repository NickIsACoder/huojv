<template>
	<div class="detail-panel">
		<van-pull-refresh v-model="isLoading" success-text="刷新成功" loading-text="正在刷新..." @refresh="reloadWindow()">
			<van-nav-bar
					:title="'签约甲方公司详情'"
					left-arrow
					@click-left="onClickLeft"
					v-eventlisten="{isChangePage:true,pageEvent:'点击返回按钮'}"
			/>

			<ul class="huojv-detail-list mt-15">
				<li class="clearfix">
					<label class="title float-l" style="width: 50px;">公司</label>
					<label class="content float-r" style="width: calc(100% - 50px);"
					       v-text="detail.projectName || '暂无'"></label>
				</li>
				<li class="clearfix">
					<label class="title float-l">现有材料品类数量</label>
					<label class="content float-r" v-text="detail.plsl || 0"></label>
				</li>
				<li class="clearfix">
					<label class="title float-l">今年累计签约金额</label>
					<label class="content float-r" v-text="(detail.yearContractAmount  || 0)+'元'"></label>
				</li>
				<li class="clearfix">
					<label class="title float-l">上一年材料品类数量</label>
					<label class="content float-r" v-text="detail.lsplsl || 0"></label>
				</li>
				<li class="clearfix">
					<label class="title float-l">上一年累计签约金额</label>
					<label class="content float-r" v-text="(detail.lastYearContractAmount || 0) + '元'"></label>
				</li>
			</ul>
		</van-pull-refresh>
	</div>
</template>

<script>
    import scrollFixed from '@/mixin/scroll-fixed';
    import {NavBar,PullRefresh} from 'vant';
    import request from '@/utils/request';


    export default {
        mixins: [scrollFixed],

        data() {
            return {
                isLoading: false,
                projectName: '',
                detail: {}
            };
        },

        created() {
            this.projectName = this.$route.query.param;
            this.getCompanyDetail();
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

	        // 获取公司详情数据
            getCompanyDetail() {
                request({
                    url: `/app-api/costContract/materialCompanyDetail/${this.$route.query.param}`,
                    method: 'get',
                    data: {}
                }).then(({data}) => {
                    if (data.code === 0) {
                        this.detail = data.materialCompanyDetail;
                    }
                });
            }
        },

        components: {
            [NavBar.name]: NavBar,
            [PullRefresh.name]: PullRefresh,
        }
    };
</script>


<style lang="scss" scoped>

</style>
