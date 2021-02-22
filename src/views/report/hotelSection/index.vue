<template>
	<div class="report-index pb-20 has-tabs">
		<ul class="huojv-tabs fixed-tabs three-cols">
			<li @click="checkTab1(1)" v-eventlisten="{isChangePage:false,pageEvent:'点击-酒店版块-年度'}"
			    :class="[tab1 == 1 ? 'active' : '']"><label>年</label></li>
			<!-- <li class="disabled"
			    :class="[tab1 == 2 ? 'active' : '']"><label>季</label></li> -->
			<li @click="checkTab1(3)" v-eventlisten="{isChangePage:false,pageEvent:'点击-酒店版块-月'}"
			    :class="[tab1 == 3 ? 'active' : '']"><label>月</label></li>
			<li @click="checkTab1(4)" v-eventlisten="{isChangePage:false,pageEvent:'点击-酒店版块-日'}"
			    :class="[tab1 == 4 ? 'active' : '']"><label>日</label></li>
		</ul>

		<van-pull-refresh v-model="isLoading" success-text="刷新成功" loading-text="正在刷新..." @refresh="reloadWindow">
			<div class="main-content width100 mt-15">
				<ul class="huojv-tabs one-cols">
					<li @click="checkTab2(1)" v-eventlisten="{isChangePage:false,pageEvent:'点击-酒店版块-经营目标'}"
					    :class="[tab2 == 1 ? 'active' : '']"><label>经营目标</label></li>
<!--					<li @click="checkTab2(2)" v-eventlisten="{isChangePage:false,pageEvent:'点击-酒店版块-财务目标'}"-->
<!--					    :class="[tab2 == 2 ? 'active' : '']"><label>财务目标</label></li>-->
				</ul>

				<div class="data-content-panel pt-15">
					<!-- board数据 -->
					<ul class="data-info-list pb-20 three-cols" style="border-bottom: 0;">
						<li>
							<div class="data-type middle">经营利润</div>
							<div class="data-box mt-20">
								<label class="value middle">--</label>
								<label class="unit"></label>
							</div>
						</li>
						<li>
							<div class="data-type middle">销售金额</div>
							<div class="data-box mt-20">
								<label class="value middle" v-text="boardData1.totalIncome || '-'">0</label>
								<label class="unit">万元</label>
							</div>
							<div class="data-type mt-10" v-show="tab1!=4">目标达成率<label class="red-color" v-text="(boardData1.achieveRate || '-') + '%'"></label></div>
						</li>
						<li>
							<div class="data-type middle">净利润</div>
							<div class="data-box mt-20">
								<label class="value middle">--</label>
								<label class="unit"></label>
							</div>
						</li>
					</ul>

					<ul class="data-info-list pb-20 three-cols">
						<li>
							<div class="data-type middle">营销费用</div>
							<div class="data-box mt-20">
								<label class="value middle">--</label>
								<label class="unit"></label>
							</div>
						</li>
						<li>
							<div class="data-type middle">人力费用</div>
							<div class="data-box mt-20">
								<label class="value middle">--</label>
								<label class="unit"></label>
							</div>
						</li>
						<li>
							<div class="data-type middle">行政费用</div>
							<div class="data-box mt-20">
								<label class="value middle">--</label>
								<label class="unit"></label>
							</div>
						</li>
					</ul>

				</div>
			</div>

			<div class="main-content width100 mt-15">
				<van-tabs v-model="tab3" color="#209B5C" line-width="30px" :ellipsis="false" title-active-color="#209B5C" sticky @change="checkTab3">
					<van-tab v-for="(item,index) in tabList" :disabled="item.disabled" :key="index" title-style="margin:0 5px">
						<div slot="title">
							<span v-eventlisten="{isChangePage:false,pageEvent:'点击酒店版块-'+item.name}">{{item.name}}</span>
						</div>
					</van-tab>
				</van-tabs>

				<!-- 总体 -->
				<population v-if="tab3 == 0" :tab1="tab1" :orgId="orgId"></population>
				<!-- 客房 -->
				<guest-room v-if="tab3 == 1" ref="guestRoom" :tab1="tab1" :orgId="orgId"></guest-room>
				<!-- 餐饮 -->
				<restaurant v-if="tab3 == 2" ref="restaurant" :tab1="tab1" :orgId="orgId"></restaurant>
				<!-- 会议 -->
				<meeting v-if="tab3 == 3" ref="meeting" :tab1="tab1" :orgId="orgId"></meeting>
				<!-- 其他 -->
				<other v-if="tab3 == 4" ref="other" :tab1="tab1" :orgId="orgId"></other>
			</div>

		</van-pull-refresh>
	</div>
</template>

<script>
    import { mapState } from 'vuex'
    import scrollFixed from '@/mixin/scroll-fixed';
    import echarts from 'echarts'
    import {getLocalStorage} from '@/utils/local-storage';
    import request from '@/utils/request'
    import {getNextMonths, handleNum2String, getUrlParam} from '@/utils/common'
    import { PullRefresh,Tab, Tabs, } from 'vant';
    import $ from 'jquery'
    import population from "./components/population";
    import guestRoom from "./components/guestRoom";
    import restaurant from "./components/restaurant";
    import meeting from "./components/meeting";
    import other from "./components/other";

    export default {
        mixins: [scrollFixed],

        data() {
            return {
                isLoading:false,
                // orgId: getLocalStorage(['orgId']).orgId,
                boardData1: {
                    achieveRate:'-',
                    totalIncome:'-'
                },
                tab1: 1,  //  day week month
                tab2: 1,
	            tab3: 0,
                near12Month: [],
                isMore: false,
                orgType: getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType,
                unit: '亿',
                tabList: [
                    {name:'总体',disabled: false},
                    {name:'客房',disabled: false},
                    {name:'餐饮',disabled: false},
                    {name:'会议',disabled: false},
                    {name:'其它',disabled: false},
                ],
            };
        },

        computed: {
            ...mapState({
                orgId: state => state.orgId || getLocalStorage(['orgId']).orgId
            })
        },

        watch:{
            '$store.state.orgId':function(newVal, oldVal){
                console.log(this.tab3)
                this.init();
                // if(this.tab3 == 0){
                //     this.$refs.population.init()
                // }else if(this.tab3 == 1){
                //     this.$refs.guestRoom.init();
                // }else if(this.tab3 == 2){
                //     this.$refs.restaurant.init();
                // }else if(this.tab3 == 3){
                //     this.$refs.meeting.init();
                // }
            }
        },
        mounted() {
            this.init();
            this.$nextTick(() => {
                $('.el-table__header-wrapper').scroll(function () {
                    let scrollLeft = $(this).scrollLeft();
                    $(this).next().scrollLeft(scrollLeft);
                });

                $(".el-table__fixed-body-wrapper").scroll(function () {
                    let scrollTop = $(this).scrollTop();
                    $(this).parent().prev().scrollTop(scrollTop);
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

            init() {
                // if(sessionStorage.hotelTab){
                //     let hotelTab = JSON.parse(sessionStorage.hotelTab);
                //     this.tab1 = hotelTab[0];
                //     this.tab2 = hotelTab[1];
                //     this.tab3 = hotelTab[2];
                // }

                this.getBoardData();

                this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType
                this.unit = this.orgType <=4 ? '亿':'亿'
            },

            // 获取上面的 数据【1:含并购, 2:自营】
            getBoardData() {
                if (!this.orgId) return;
                let queryPeriod = '年度';
                switch (this.tab1) {
	                case 1: queryPeriod = '年度'; break;
	                case 2: queryPeriod = '季度'; break;
	                case 3: queryPeriod = '月度'; break;
	                case 4: queryPeriod = '日'; break;
                }

                const _url = `/app-api/culturalTourism/hotel/businessObjectives`;

                request({
                    url: _url,
                    method: 'post',
	                data:{orgId:this.orgId,queryPeriod}
                }).then(({data}) => {
                    if (data.code === 0 && data.data) {
                        this.boardData1 = {
                            achieveRate: data.data.achieveRate && data.data.achieveRate.percentage,
                            totalIncome:data.data.totalIncome && data.data.totalIncome.amount
                        };
                    }
                }).catch((e) => {
                    console.log('getBoardData-err', e);
                });
            },



            // 切换  日  周 月
            checkTab1(tab1) {
                this.tab1 = tab1;
                sessionStorage.hotelTab = JSON.stringify([this.tab1,this.tab2,this.tab3])
                this.init();

                // if(this.tab3 == 0){
                //     this.$refs.population.init(this.tab1)
                // }else if(this.tab3 == 1){
                //     this.$refs.guestRoom.init(this.tab1);
                // }else if(this.tab3 == 2){
                //     this.$refs.restaurant.init(this.tab1);
                // }else if(this.tab3 == 3){
                //     this.$refs.meeting.init(this.tab1);
                // }
            },

            // 切换  经营目标  财务目标
            checkTab2(tab2, event) {
                this.tab2 = tab2;
                sessionStorage.hotelTab = JSON.stringify([this.tab1,this.tab2,this.tab3])
                this.init();
            },

	        // 切换总体 客房等等选项卡
            checkTab3(tab3){
                this.tab3 = tab3;
                sessionStorage.hotelTab = JSON.stringify([this.tab1,this.tab2,this.tab3])
                $(document).scrollTop(0);   // 切换之后页面自动置顶
            },
        },

        components: {
            [PullRefresh.name]:PullRefresh,
            [Tabs.name]:Tabs,
            [Tab.name]:Tab,
            population,
            guestRoom,
            restaurant,
            meeting,
			other
        }
    };
</script>


<style lang="scss" scoped>
.main-content .data-content-panel .data-info-list li.width-50{
    width: 50%;
}
.data-type-top{
    font-size: 12px;
    color: #666;
    margin-bottom: 6px;
}
.data-type-bottom{
    font-size: 12px;
    color: #666;
    margin-top: 6px;
    span{
        color: #FF0000;
        font-size: 11px;
        margin-left: 2px;
    }
}
.disabled{
    color: #adadad;
}
</style>
