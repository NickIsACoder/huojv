<template>
	<div class="report-index has-tabs pb-20">
		<ul class="huojv-tabs fixed-tabs two-cols">
			<li @click="checkTab1(1,'lossProject')" v-eventlisten="{isChangePage:false,pageEvent:'切换到亏损项目'}" :class="[tab1 == 1 ? 'active' : '']"><label>亏损项目</label></li>
			<li @click="checkTab1(2,'zeroToFiveProject')" v-eventlisten="{isChangePage:false,pageEvent:'切换到利润率0-5%项目'}" :class="[tab1 == 2 ? 'active' : '']"><label>利润率0-5%项目</label></li>
		</ul>
		<van-pull-refresh v-model="isLoading" success-text="刷新成功" loading-text="正在刷新..." @refresh="reloadWindow()">
			<div class="main-content mt-15">

				<div class="data-content-panel pt-15">
						<ul class="huojv-data-list three-cols list-title" style="overflow-x: auto;">
							<li class="title flex">
								<label>序号</label>
								<label>项目</label>
								<label>利润率</label>
							</li>
						</ul>
						<van-list
								v-model="loading"
								:finished="finished"
								finished-text="没有更多了"
								@load="onLoad"
						>
							<ul class="huojv-data-list three-cols list-data" style="overflow-x: auto;">
								<li class="flex" v-for="(data,index) in dataList" :key="'list'+index">
									<label v-text="index+1"></label>
									<label v-text="data.projectName || ''" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,data.projectGUID,data.orgType)"></label>
									<label v-text="data.warningRate+'%' || ''"></label>
								</li>
							</ul>

						</van-list>
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
    import {getUrlParam, jumpToPj} from '@/utils/common';


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
                warningType: 'lossProject',
                // taskType:{
                //     milepostTypeId:'4BD92065-4081-488A-ACB4-2C89DEDC2DD7,60611D76-6868-4B46-949F-B8A1410A6D1E',
                //     primaryNodeTypeId:'5963DC9F-33E2-4637-8FD9-5CE1961036A7',
                //     secondNodeTypeId:'17DBB9E4-941B-481D-B111-2597878A4EE6',
                //     thirdNodeTypeId:'58BEA6E1-68BE-49AD-938A-E6B389656D1A'
                // }

                taskType:{
                    milepostTypeId:'里程碑',
                    primaryNodeTypeId:'一级',
                },
               orgType: getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType
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
                $('.list-title').scroll(function () {
                    let scrollLeft = $(this).scrollLeft();
                    $('.list-data').scrollLeft(scrollLeft);
                });

                $(".list-data").scroll(function () {
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
            jumpToPj,
            reloadWindow(){
                setTimeout(() => {
                    window.location.reload();
                    this.isLoading = false;
                },500)
            },
            // 获取计划进度数据
            getList(isRefresh){
                // todo 这里只有里程碑和一级节点吗？ PC端还有二级节点和三级节点
                const taskTypeId = this.tab1 == 1 ? this.taskType.milepostTypeId : this.taskType.primaryNodeTypeId;
                request({
                    // url: `/app-api/allPeriod/earlyWarning?size=${this.size}&current=${this.current}&orgId=${this.orgId}&taskTypeName=${taskTypeId}&orderByType=ASC`,
                    url: `/app-api/allPeriod/earlyWarning`,
                    method: 'post',
                    data:{
                        size: this.size,
                        current: this.current,
                        warningType: this.warningType,
                        orgId: this.orgId
                    }
                }).then(({data}) => {
                    if(data.code === 0){
                        this.dataList = isRefresh ? data.data : this.dataList.concat(data.data);
                        this.loading = false;
                        this.isLoading = false;
                        this.isLoad = false;

                        if (null == data.data || data.data.length < this.size) {
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
                this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType;
                this.current = 1;
                // this.dataList = [];
                this.getList(true);
            },

	        // 切换  签约  回款  交付
            checkTab1(tab1,type){
                this.tab1 = tab1;
                this.warningType = type
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
.flex{
    width: 100%;
    display: flex;
    color: #333333;
    label:nth-child(1){
        flex: 1;
        text-align: center;
    }
    label:nth-child(2){
        flex: 5;
        text-align: center;
        margin: 0 5px;
        font-size: 12px;
    }
    label:nth-child(3){
        text-align: center;
        flex: 2;
    }
}
</style>
