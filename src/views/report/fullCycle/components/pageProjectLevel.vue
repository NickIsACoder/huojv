<template>
	<div class="main-content mt-15">
		<van-tabs v-model="tab1" color="#209B5C" line-width="30px" :ellipsis="false" title-active-color="#209B5C" sticky @change="changeTab">
			<van-tab v-for="(item,index) in tabList" :title="item.name" :disabled="item.disabled" :key="index" title-style="margin:0 5px">
				<div slot="title">
					<span v-eventlisten="{isChangePage:false,pageEvent:'点击全周期-'+item.name}">{{item.name}}</span>
				</div>
			</van-tab>
		</van-tabs>

		<!-- 首页 -->
		<div v-show="tab1 == 0">
			<div class="data-content-panel">
				<p class="titleLine"><span>{{currentYearValue.year}}年静态经济指标</span></p>
				<ul class="data-info-list pt-15 pb-40">
					<li>
						<div class="data-box">
							<label class="value middle bold">{{currentYearValue.profitRate}}%</label>
						</div>
						<div class="data-box">
							<label class="value small">({{currentYearValue.variableProfitRate}}%)</label>
						</div>
						<div class="data-type mt-10">税后利润率</div>
						<div class="data-type">（占用后）</div>
					</li>
					<li>
						<div class="data-box">
							<label class="value middle bold">{{currentYearValue.profitAmount}}万</label>
						</div>
						<div class="data-box">
							<label class="value small">({{currentYearValue.variableProfitAmount}}万)</label>
						</div>
						<div class="data-type mt-10">税后利润额</div>
						<div class="data-type">（占用后）</div>
					</li>
					<li>
						<div class="data-box">
							<label class="value middle bold">{{currentYearValue.grossMargin}}%</label>
						</div>
						<div class="data-box">
							<label class="value small">({{currentYearValue.variableGrossMargin}}%)</label>
						</div>
						<div class="data-type mt-10">毛利率</div>
					</li>
				</ul>
			</div>
			<div class="data-content-panel pb-20">
				<p class="miniTitle">项目指标概况</p>
				<el-table stripe class="main-theme-table table-row-color" size="mini" highlight-current-row :data="tableList">
					<el-table-column prop="name" label="指标" align="center"></el-table-column>
					<el-table-column prop="value" label="数值" align="center"></el-table-column>
				</el-table>
			</div>
			<div class="data-content-panel pb-20">
				<p class="miniTitle">项目平面图</p>
				<img v-if="!showfailImg" @click="prev" class="panelImg" :src="prevImg" alt="" >
				<img v-if="showfailImg" class="panelImg" src="../../../../assets/images/fail.png" >
			</div>
		</div>

		<!-- 基本信息 -->
		<base-info ref="baseInfo" v-if="tab1 == 1"></base-info>

		<!-- 差异分析 -->
		<difference-analysis ref="differenceAnalysis" v-if="tab1 == 2"></difference-analysis>

		<van-image-preview v-model="prevshow" :images="images"></van-image-preview>
	</div>
</template>

<script>
	import scrollFixed from '@/mixin/scroll-fixed';
	import {
		ImagePreview,
		Tab,
		Tabs,
	} from 'vant';
	import request from '@/utils/request';
	import echarts from 'echarts';
	import $ from 'jquery';
	import {getUrlParam} from '@/utils/common';
	import baseInfo from "./baseInfo";
	import differenceAnalysis from "./differenceAnalysis";

	export default {
		mixins: [scrollFixed],
		data() {
			return {
				orgId: '',
				tabList: [
					{name:'首页',disabled: false},
					{name:'基本信息',disabled: false},
					{name:'差异分析',disabled: false},
				],
				tab1:0,
				prevshow: false,
				images: [],
				prevImg: '',
				showfailImg: false,
				currentYearValue: {
						profitRate: '0',
						variableProfitRate: '0',
						profitAmount: '0',
						variableProfitAmount: '0',
						grossMargin: '0',
						variableGrossMargin: '0',
						year: ''
				},
				tableList: [{
							name: '占地面积',
							value: '0'
						},
						{
							name: '计容建面',
							value: '0'
						},
						{
							name: '总货值',
							value: '0'
						},
						{
							name: '销售均价',
							value: '0'
						},
				],
				orgType: ''
			};
		},
		
		mounted() {
			this.init()
		},
		watch: {
			'$store.state.orgId': function(newVal, oldVal) {
				this.init();
			}
		},
		methods: {
			init() {
				this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType
				this.orgId = getUrlParam('chooseOrgId') || getUrlParam('orgId') || getLocalStorage('orgId').orgId

				if (sessionStorage.getItem('tab')) {
					this.tab1 = 1
					sessionStorage.removeItem('tab')
				}

				console.log('aaa',this.tab1)

				if(this.tab1 == 0){
					this.currentYearValue = {
							profitRate: '0',
							variableProfitRate: '0',
							profitAmount: '0',
							variableProfitAmount: '0',
							grossMargin: '0',
							variableGrossMargin: '0',
							year: ''
					}
					this.tableList = [{
								name: '占地面积',
								value: '0'
							},
							{
								name: '计容建面',
								value: '0'
							},
							{
								name: '总货值',
								value: '0'
							},
							{
								name: '销售均价',
								value: '0'
							},
					]
					this.prevshow = false
					this.prevImg = ''
					this.getProjectOverview()
					this.getProfitNorm()
				}else if(this.tab1 == 1){
				    // this.$nextTick(() => {
						// 	this.$refs.baseInfo.init();
				    // })
				}else if(this.tab1 == 2){
				    // this.$nextTick(() => {
						// 	this.$refs.differenceAnalysis.init();
				    // })
				}

				console.log('bbb',this.tab1)
			},
			changeTab(idx){
				this.tab1 = idx

				this.init();
			},
			checkImgExists(imgurl) {
					return new Promise(function(resolve, reject) {
						var ImgObj = new Image();
						ImgObj.src = imgurl;
						ImgObj.onload = function(res) {
							resolve(res);
						}
						ImgObj.onerror = function(err) {
							reject(err)
						}
					})
			},
			getProfitNorm() {
					request({
							url: `/app-api/allPeriod/profitNorm/${this.orgId}`,
							method: 'get',
					}).then(res => {
							// 今年-当期值
							if (res.data.data && res.data.data.currentYearValue) {
									this.currentYearValue = res.data.data.currentYearValue
							}
					}).catch((e) => {
							console.log('profitNorm-err', e);
					});
			},
			getProjectOverview() {
					request({
							url: `/app-api/allPeriod/projectOverview/${this.orgId}`,
							method: 'get',
					}).then(res => {
							if (res.data.data) {
									this.tableList[0].value = res.data.data.buildOccupyArea + '㎡'
									this.tableList[1].value = res.data.data.countRjlArea + '㎡'
									this.tableList[2].value = res.data.data.totalValue + '万元'
									this.tableList[3].value = res.data.data.saleAvgPrice + '元/㎡'

									// 

									let src = res.data.data.planarGraph ? res.data.data.planarGraph : ''
									this.checkImgExists(src).then(()=>{
											this.prevImg = res.data.data.planarGraph ? res.data.data.planarGraph : ''
											console.log('有效链接')
											this.showfailImg = false
									}).catch(()=>{
											this.showfailImg = true
											console.log('无效链接')
									})
									// this.prevImg = 'https://masterdata.aoyuan.net:9070/view/preview?docId=92da7b0c-e9c0-495e-a1bc-30a04ba14d41&pageIndex=0'
							}else {
								console.log('没有图片时')
								this.showfailImg = true
							}
					}).catch((e) => {
							console.log('projectOverview-err', e);
					});
			},
			prev() {
					request({
							url: `/app-api/allPeriod/projectOverview/${this.orgId}`,
							method: 'get',
					}).then(res => {
							if (res.data.data) {
									this.images = [res.data.data.planarGraph]
									this.prevshow = true
							}
					}).catch((e) => {
							console.log('projectOverview-err', e);
					});
			},
		},
		components: {
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,
			[ImagePreview.Component.name]: ImagePreview.Component,
			baseInfo,
			differenceAnalysis
		}
	};
</script>

<style lang="scss" scoped>
	.pb-40 {
		padding-bottom: 40px !important;
	}

	.miniTitle {
		font-size: 14px;
		color: #333333;
		margin: 10px 0 20px;
		text-align: center;
	}

	.panelImg {
		width: 100%;
		display: block;
	}

	.titleLine {
		text-align: center;
		display: flex;
		margin: 27px auto;
		font-size: 18px;
		justify-content: center;
		margin-bottom: 10px;

		span {
			position: relative;
		}

		span:before {
			content: '';
			width: 65px;
			display: block;
			height: 1px;
			background: #CCCCCC;
			position: absolute;
			top: 50%;
			left: -80px;
		}

		span:after {
			content: '';
			width: 65px;
			display: block;
			height: 1px;
			background: #CCCCCC;
			position: absolute;
			top: 50%;
			right: -80px;
		}
	}

	.data-type {
		font-size: 12px;
		color: #666666;
	}
</style>
