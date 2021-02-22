<template>
	<div class="report-index has-tabs pb-20">
		<ul class="huojv-tabs fixed-tabs one-cols">
			<li class="active" v-show="orgType!=5"><label>里程碑</label></li>
			<li class="active" v-show="orgType==5"><label>里程碑 + 一级</label></li>
		</ul>
		<van-pull-refresh v-model="isLoading" success-text="刷新成功" loading-text="正在刷新..." @refresh="reloadWindow()">
			<div class="main-content pt-15">
				<div class="data-content-panel">
					<!-- 标题 -->
					<div class="data-title-box">
						<img class="title-ico" src="../../../assets/images/ic_topfive@2x.png">
						<span class="title">前五达成率龙虎榜</span>
					</div>

					<ul class="huojv-data-list three-cols">
						<li class="title" v-show="orgType!=5">
							<label style="width: 70px; ">排名</label>
							<label style="width: calc(70% - 70px); text-align: left;">公司名称</label>
							<label class="text-center" style="width: 30%;">完成率</label>
						</li>
						<li class="title" v-show="orgType==5">
							<label style="width: 70px; ">排名</label>
							<label style="width: calc(70% - 70px); text-align: left;">公司</label>
							<label class="text-center" style="width: 30%;">达成率</label>
						</li>
					</ul>

					<ul class="huojv-data-list three-cols">
						<li v-for="(li,index) in frontList" :key="'frontList'+index">
							<label style="width: 70px; "><label style="left: 10px; padding-left: 6px;"
							                                    :class="{'no-1-ico':index === 0,'no-2-ico':index === 1,'no-3-ico':index === 2}"
							                                    v-text="index > 2 ? index + 1 : ''"></label></label>
							<label style="width: calc(70% - 70px); text-align: left;" v-text="li.orgName || ''"></label>
							<label class="text-center" style="width: 30%;"
							       v-text="(li.completeRate || 0) + '%'"></label>
						</li>
					</ul>
				</div>
			</div>

			<div class="main-content pt-15">
				<div class="data-content-panel">
					<!-- 标题 -->
					<div class="data-title-box">
						<img class="title-ico" src="../../../assets/images/ic_laterfive@2x.png">
						<span class="title">后五达成率龙虎榜</span>
					</div>

					<ul class="huojv-data-list three-cols">
						<li class="title" v-show="orgType!=5">
							<label style="width: 40px; ">排名</label>
							<label style="width: calc(55% - 40px); text-align: left;">公司名称</label>
							<label class="text-center" style="width: 60px;">完成率</label>
							<label style="width: calc(45% - 60px);">管理记录</label>
						</li>
						<li class="title" v-show="orgType==5">
							<label style="width: 70px; ">排名</label>
							<label style="width: calc(70% - 70px); text-align: left;">公司</label>
							<label class="text-center" style="width: 30%;">达成率</label>
						</li>
					</ul>

					<ul class="huojv-data-list three-cols" v-show="orgType!=5">
						<li v-for="(li,index) in backList" :key="'backList'+index">
							<label style="width: 40px; "><label class="last5-ico" v-text="index + 1"></label></label>
							<label style="width: calc(55% - 40px); text-align: left;" v-text="li.orgName || ''"></label>
							<label class="text-center" style="width: 60px;"
							       v-text="(li.completeRate || 0) + '%'"></label>
							<label style="width: calc(45% - 60px);">
								<img :src="fileImg" v-show="li.interview == 1" class="file-img"
								     @click="goAdminDetail(li)">
							</label>
						</li>
					</ul>
					<ul class="huojv-data-list three-cols" v-show="orgType==5">
						<li v-for="(li,index) in backList" :key="'backList'+index">
							<label style="width: 70px; "><label class="last5-ico" v-text="index + 1"></label></label>
							<label style="width: calc(70% - 70px); text-align: left;" v-text="li.orgName || ''"></label>
							<label class="text-center" style="width: 30%;"
							       v-text="(li.completeRate || 0) + '%'"></label>
						</li>
					</ul>
				</div>
			</div>
		</van-pull-refresh>
	</div>
</template>

<script>
    import {mapState} from 'vuex'
    import scrollFixed from '@/mixin/scroll-fixed';
    import echarts from 'echarts'
    import {getLocalStorage} from '@/utils/local-storage';
    import {getUrlParam} from '@/utils/common';
    import request from '@/utils/request';
    import {PullRefresh} from 'vant';
    import fileImg from '@/assets/images/file.png';

    export default {
        mixins: [scrollFixed],

        data() {
            return {
                // orgId:getLocalStorage(['orgId']).orgId,
                size: 5,
                current: 1,
                frontList: [],  // 前五名
                isLoading: false,
                fileImg,
				backList:[],  // 后五名
				orgType: getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType
            };
        },

        computed: {
            ...mapState({
                orgId: state => state.orgId || getLocalStorage(['orgId']).orgId
            })
        },

        watch: {
            '$store.state.orgId': function (newVal, oldVal) {
                this.init();
            }
        },

        mounted() {
            this.init();
        },

        methods: {
            reloadWindow() {
                setTimeout(() => {
                    window.location.reload();
                    this.isLoading = false;
                }, 500)
            },
            init(){
				this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType
				if (this.orgType==5) {
					this.getList('DESC',5);  // 前五名
					this.getList('ASC',5);  // 后五名
				} else {
					this.getList('DESC');  // 前五名
					this.getList('ASC');  // 后五名
				}
            },

	        // 获取计划进度数据
	        getList(orderType,orgtype){
				let url = ''
				if (orgtype) {
					url =  `/app-api/plan/schedule/dragonTigerListList?size=${this.size}&current=${this.current}&orgId=${this.orgId}&orderByType=${orderType}&orgType=${orgtype}`
				} else {
					url =  `/app-api/plan/schedule/dragonTigerListList?size=${this.size}&current=${this.current}&orgId=${this.orgId}&orderByType=${orderType}`
				}
                request({
                    url: url,
                    method: 'get'
                }).then(({data}) => {
                    if (data.code === 0) {
                        if (orderType === 'DESC') {
                            this.frontList = data.dragonTigerListList;
                        } else {
                            this.backList = data.dragonTigerListList;
                        }
                    }
                }).catch((e) => {
                    console.log('getEchartData-err', e);
                });
			},
					// 区域公司
			getAreaList(orderType){
                request({
					// url: `/app-api/plan/schedule/areaDragonTiger?size=${this.size}&current=${this.current}&orgId=${this.orgId}&orderByType=${orderType}`,
					url: `/app-api/plan/schedule/areaDragonTiger`,
					method: 'POST',
					data: {
						size: this.size,
						current: this.current,
						orgId: this.orgId,
						orderType: orderType
					}
                }).then(({data}) => {
                    if (data.code === 0) {
                        if (orderType === 'desc') {
                            this.frontList = data.data;
                        } else {
                            this.backList = data.data;
                        }
                    }
                }).catch((e) => {
                    console.log('getEchartData-err', e);
                });
            },
            goAdminDetail(item) {
                this.$router.push({
                    path: '/warning/adminDetail',
                    query: {
                        id: item.orgId,
                        tab1: 1,
                        orgName: item.orgName,
                        token: getUrlParam('token') || getLocalStorage('token').token
                    }
                });
            }
        },

        components: {
            [PullRefresh.name]: PullRefresh
        }
    };
</script>


<style lang="scss" scoped>

</style>
