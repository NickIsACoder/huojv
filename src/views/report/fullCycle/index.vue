<template>
	<div class="report-index pb-20">
		<van-pull-refresh v-model="isLoading" success-text="刷新成功" loading-text="正在刷新..." @refresh="reloadWindow()" style="min-height:100vh">
			<page-project-level v-if="orgType>5" ref="pageProjectLevel" key="1"></page-project-level>
			<pageChart ref="pageChart" v-else key="2" />
		</van-pull-refresh>
	</div>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import scrollFixed from '@/mixin/scroll-fixed';
	import echarts from 'echarts'
	import {
		getLocalStorage
	} from '@/utils/local-storage';
	import {
		getUrlParam
	} from '@/utils/common';
	import {
		Icon,
		PullRefresh,
	} from 'vant';
	import $ from 'jquery';
	import request from '@/utils/request';
	import pageChart from './components/pageChart'
	import pageProjectLevel from "./components/pageProjectLevel";


	export default {
		mixins: [scrollFixed],
		data() {
			return {
				orgType: getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType,
                isLoading: false,
			};
		},
		computed: {
			...mapState({
				orgId: state => state.orgId || getLocalStorage(['orgId']).orgId
			})
		},
		watch: {
			'$store.state.orgId': function(newVal, oldVal) {
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
			init() {
				this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType

				// if(this.orgType > 5){
				//     this.$refs.pageProjectLevel.init();
				// }else{
				//     this.$refs.pageChart.init();
				// }
			},
		},
		components: {
			[Icon.name]: Icon,
			[PullRefresh.name]: PullRefresh,
			pageChart,
            pageProjectLevel
		}
	};
</script>
