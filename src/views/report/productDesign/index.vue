<template>
	<div class="report-index">
<!--		<van-pull-refresh-->
<!--				v-model="isLoading"-->
<!--				success-text="刷新成功"-->
<!--				loading-text="正在刷新..."-->
<!--				@refresh="reloadWindow()"-->
<!--		>-->
			<div class="main-content width100 mt-15">
                <van-sticky :offset-top="0">
                    <van-tabs v-model="tab1" color="#209B5C" line-width="30px" :ellipsis="false"
                            title-active-color="#209B5C" sticky @change="changeActTab">
                        <van-tab v-for="(item,index) in tabList" :title="item.name" :disabled="item.disabled" :key="index" title-style="margin:0 5px">
                            <div slot="title">
                                <span v-eventlisten="{isChangePage:false,pageEvent:'点击产品设计-'+item.name}">{{item.name}}</span>
                            </div>
                        </van-tab>
                    </van-tabs>
                </van-sticky>
			</div>
            <div class="text-center" style="background:#fff">
                <ul class="huojv-tab-bars_1 two-cols">
                    <li v-eventlisten="{isChangePage:false,pageEvent:'切换到军令状项目'}" @click="checkpageTab(0)"
                        :class="[pageTab == 0 ? 'active' : '']">军令状项目</li>
                    <li v-eventlisten="{isChangePage:false,pageEvent:'切换到设计类操盘'}" @click="checkpageTab(1)" v-if="orgType<6"
                        :class="[pageTab == 1 ? 'active' : '']">设计类操盘</li>
                </ul>
            </div>
			<div class="main-content width100" v-if="orgType<=5">
				<!-- 区分组织机构是否为项目层级 -->
				<component-index ref="productIndex" v-if="tab1 == 0" :pageTab='pageTab'></component-index>
				<!-- 土地价值最大化 -->
				<component-land-value ref="productLandValue" v-if="tab1 == 1" :pageTab='pageTab'></component-land-value>
				<!--限额设计-->
				<quota-design ref="quotaDesign" v-if="tab1 == 2" :pageTab='pageTab'></quota-design>
				<!-- 设计变更成本变动 -->
                <component-change-design ref="changeDesign" v-if="tab1 == 3" :pageTab='pageTab'></component-change-design>
				<!-- <component-change-design ref="changeDesign" v-if="orgType < 6 ? tab1 == 3 : tab1 == 1"></component-change-design> -->
				<!-- 设计专项计划进度 -->
				<special-design ref="specialDesign" v-if="tab1 == 4" :pageTab='pageTab'></special-design>
			</div>
            <div class="main-content width100" v-else>
                <!-- 区分组织机构是否为项目层级 -->
				<component-index ref="productIndex" v-if="tab1 == 0" :pageTab='pageTab'></component-index>
				<!-- 土地价值最大化 -->
				<component-land-value ref="productLandValue" v-if="tab1 == 1" :pageTab='pageTab'></component-land-value>
				<!-- 设计变更成本变动 -->
                <component-change-design ref="changeDesign" v-if="tab1 == 2" :pageTab='pageTab'></component-change-design>
				<!-- 设计专项计划进度 -->
				<special-design ref="specialDesign" v-if="tab1 == 3" :pageTab='pageTab'></special-design>
            </div>
<!--		</van-pull-refresh>-->
	</div>
</template>

<script>
    import {mapState} from 'vuex'
    import scrollFixed from '@/mixin/scroll-fixed';
    import {getLocalStorage} from '@/utils/local-storage';
    import {getUrlParam} from '@/utils/common';
    import {Icon, PullRefresh, Tab, Tabs, Sticky} from 'vant';
    import request from '@/utils/request';
    import componentIndex from "./components/componentIndex";
    import componentLandValue from "./components/componentLandValue";
    import componentChangeDesign from "./components/componentChangeDesign";
    import specialDesign from "./components/specialDesign";
    import quotaDesign from "./components/quotaDesign";

    export default {
        mixins: [scrollFixed],

        data() {
            return {
                pageTab: 0,
                tabList: [
                    {name: '首页', disabled: false},
                    {name: '土地价值最大化', disabled: false},
                    {name: '限额设计', disabled: false},
                    {name: '设计变更成本变动', disabled: false},
                    {name: '设计协同计划进度', disabled: false}
                ],
	            tab1:-1,
                size: 5,
                current: 1,
                tableList: [],
                orgType: getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType,  // 组织机构类型  如果没有
                isLoading: false,
            };
        },
        computed: {
            ...mapState({
                orgId: state => state.orgId || getLocalStorage(['orgId']).orgId,
                currentActTab: state => state.engineerTab
            })
        },
        watch: {
            '$store.state.orgId': function (newVal, oldVal) {
                this.init();
            },
        },
        mounted() {
            sessionStorage.productOrgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType;
            this.init();
        },
        methods: {
            reloadWindow() {
                setTimeout(() => {
                    window.location.reload();
                    this.isLoading = false;
                }, 500)
            },
            init() {
                // 记录tab选中状态
                // if(sessionStorage.productDesignPage){
                //     this.tab1 = parseInt(sessionStorage.productDesignPage);
                // }

                this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType;

	            // 处理标签页
                if(this.orgType < 6){
                    this.tabList = [
                        {name: '首页', disabled: false},
                        {name: '土地价值最大化', disabled: false},
                        {name: '限额设计', disabled: false},
                        {name: '设计变更成本变动', disabled: false},
                        {name: '设计协同计划进度', disabled: false}
                    ];
                }else {
                    this.tabList = [
                        {name: '首页', disabled: false},
                        {name: '土地价值最大化', disabled: false},
                        {name: '设计变更成本变动', disabled: false},
                        {name: '设计协同计划进度', disabled: false}
                    ];

                    this.pageTab = 0
                }

                // 判断组织机构类型是否变化
                // if(this.orgType != sessionStorage.productOrgType){
                //     let oldVal = sessionStorage.productOrgType, newVal = this.orgType;
                //     if(oldVal < 6 && newVal >= 6 && this.tab1 == 3){
                //         this.tab1 = 1;
                //     }else if(oldVal >= 6 && newVal < 6 &&  this.tab1 == 1){
                //         this.tab1 = 3;
                //     }
                //     sessionStorage.productDesignPage = this.tab1;
                //     sessionStorage.productOrgType = this.orgType;
                // }
            },
            checkpageTab(idx){
                this.pageTab = idx
            },
            // 切换Tab标签页
            changeActTab(event) {
                this.tab1 = event
                // sessionStorage.productDesignPage = event;
            },

        },

        components: {
            [Icon.name]: Icon,
            [PullRefresh.name]: PullRefresh,
            [Tab.name]: Tab,
            [Tabs.name]: Tabs,
            [Sticky.name]: Sticky,
            componentIndex,
            componentLandValue,
            componentChangeDesign,
            specialDesign,
            quotaDesign
        }
    };
</script>


<style lang="scss" scoped>
	.minHeight {
		min-height: 90vh;
	}

	.tableTitle {
		font-size: 14px;
		color: #333;
		margin: 0 auto;
		margin-bottom: 10px;
	}

	.tableBox {
		margin: 20px 0 30px;
		overflow: hidden;
	}

	.huojv-tab-bars {
		li {
			min-width: 80px;
			width: auto;
			padding: 0 10px;
		}
	}

	.emptyBox {
		font-size: 13px;
		color: #868686;
		text-align: center;
		padding-top: 20vh;

		img {
			width: 130px;
			display: block;
			margin: 0 auto;
			margin-bottom: 20px;
		}
	}

	.tooltips {
		font-size: 12px;
	}
</style>
<style>

</style>
