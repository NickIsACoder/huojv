<template>
	<div class="report-index has-tabs pb-20">
		<ul class="huojv-tabs fixed-tabs two-cols">
			<li @click="checkTab(0)" v-eventlisten="{isChangePage:false,pageEvent:'点击供销比'}"
			    :class="[actTab == 0 ? 'active' : '']"><label>供销比</label></li>
			<li @click="checkTab(1)" v-eventlisten="{isChangePage:false,pageEvent:'点击开销比'}"
			    :class="[actTab == 1 ? 'active' : '']"><label>开销比</label></li>
		</ul>
		<van-pull-refresh v-model="isLoading" success-text="刷新成功" loading-text="正在刷新..." @refresh="reloadWindow()">
			<div v-show="actTab == 0">
				<div class="main-content mt-15">
					<div class="data-content-panel">
						<div class="data-title-box mt-5">
							<img class="title-ico" src="../../../assets/images/ic_topfive@2x.png">
							<span class="title">前五龙虎榜</span>
						</div>

						<el-table stripe
						          class="huo-list-table main-theme-table"
						          size="mini" highlight-current-row
						          ref="dataTable1"
						          :data="frontList"
						          :indent="10">
							<el-table-column label="排名" align="center" width="40">
								<template slot-scope="scope">
									<label :class="{'no-1-ico':scope.row.index === 1,'no-2-ico':scope.row.index === 2,'no-3-ico':scope.row.index === 3}"
									       v-text="scope.row.index > 3 ? scope.row.index : ''"></label>
								</template>
							</el-table-column>
							<el-table-column prop="orgName" label="项目" align="center"></el-table-column>
							<el-table-column prop="rate" label="供销比" align="center" width="70"></el-table-column>
							<el-table-column prop="adUserName" label="负责人" align="center" width="80"></el-table-column>
						</el-table>
					</div>
				</div>
				<div class="main-content mt-15">
					<div class="data-content-panel">
						<!-- 标题 -->
						<div class="data-title-box mt-5">
							<img class="title-ico" src="../../../assets/images/ic_laterfive@2x.png">
							<span class="title">后五龙虎榜</span>
						</div>

						<el-table stripe
						          class="huo-list-table main-theme-table"
						          size="mini" highlight-current-row
						          ref="dataTable2"
						          :data="backList"
						          :indent="10">
							<el-table-column label="排名" align="center" width="40">
								<template slot-scope="scope">
									<label class="last5-ico" v-text="scope.row.index"></label>
								</template>
							</el-table-column>
							<el-table-column prop="orgName" label="项目" align="center"></el-table-column>
							<el-table-column prop="rate" label="供销比" align="center" width="70"></el-table-column>
							<el-table-column prop="adUserName" label="负责人" align="center" width="80"></el-table-column>
						</el-table>
					</div>
				</div>
			</div>
			<div v-show="actTab == 1">
				<div class="main-content mt-15">
					<div class="data-content-panel">
						<!-- 标题 -->
						<div class="data-title-box mt-5">
							<img class="title-ico" src="../../../assets/images/ic_topfive@2x.png">
							<span class="title">前五龙虎榜</span>
						</div>

						<el-table stripe
						          class="huo-list-table main-theme-table"
						          size="mini" highlight-current-row
						          ref="dataTable3"
						          :data="frontList"
						          :indent="10">
							<el-table-column label="排名" align="center" width="40">
								<template slot-scope="scope">
									<label :class="{'no-1-ico':scope.row.index === 1,'no-2-ico':scope.row.index === 2,'no-3-ico':scope.row.index === 3}"
									       v-text="scope.row.index > 3 ? scope.row.index : ''"></label>
								</template>
							</el-table-column>
							<el-table-column prop="orgName" label="项目" align="center"></el-table-column>
							<el-table-column prop="rate" label="开销比" align="center" width="70"></el-table-column>
							<el-table-column prop="adUserName" label="负责人" align="center" width="80"></el-table-column>
						</el-table>
					</div>
				</div>
				<div class="main-content mt-15">
					<div class="data-content-panel">
						<!-- 标题 -->
						<div class="data-title-box mt-5">
							<img class="title-ico" src="../../../assets/images/ic_laterfive@2x.png">
							<span class="title">后五龙虎榜</span>
						</div>

						<el-table stripe
						          class="huo-list-table main-theme-table"
						          size="mini" highlight-current-row
						          ref="dataTable4"
						          :data="backList"
						          :indent="10">
							<el-table-column label="排名" align="center" width="40">
								<template slot-scope="scope">
									<label class="last5-ico" v-text="scope.row.index"></label>
								</template>
							</el-table-column>
							<el-table-column prop="orgName" label="项目" align="center"></el-table-column>
							<el-table-column prop="rate" label="开销比" align="center" width="70"></el-table-column>
							<el-table-column prop="adUserName" label="负责人" align="center" width="80"></el-table-column>
						</el-table>
					</div>
				</div>
			</div>
		</van-pull-refresh>

	</div>
</template>

<script>
    import {mapState} from 'vuex'
    import scrollFixed from '@/mixin/scroll-fixed';
    import {List, PullRefresh, Toast, Icon} from 'vant';
    import {getLocalStorage} from '@/utils/local-storage';
    import $ from 'jquery';
    import {openLoading, closeLoading, getUrlParam} from '@/utils/common';
    import request from '@/utils/request';
    import fileImg from '@/assets/images/file.png';


    export default {
        mixins: [scrollFixed],

        data() {
            return {
                // orgId: getLocalStorage(['orgId']).orgId,
                size: 5,
                current: 1,
                actTab: 0,  // 0 供销比 ， 1  开销比
                frontList: [],
                backList: [],
                isLoading: false,
								fileImg: fileImg,
								sortClumn: [
									''
								]
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
            reloadWindow() {
                setTimeout(() => {
                    window.location.reload();
                    this.isLoading = false;
                }, 500)
            },
            init() {
              this.setFrontTableData();
              this.setBackTableData();
            },
            // 前5
            setFrontTableData() {
                if (!this.orgId) return;

                request({
                    url: `/app-api/engineer/getDragonTigerList?orgId=${this.orgId}&size=${this.size}&current=${this.current}&listType=${this.actTab+1}&sortType=DESC&sortColumn=Rate`,
                    method: 'get',
                    data: {}
                }).then(({data}) => {
                    if(data.code === 0){
                        this.frontList = data.data.records;
                        this.frontList.forEach((item, index) => {
                            item.index = index + 1;
                        })
                    }
                }).catch((e) => {
                    console.log('getBoardData-err', e);
                });
            },
            // 后5
            setBackTableData(type) {
                if (!this.orgId) return;

                request({
                    url: `/app-api/engineer/getDragonTigerList?orgId=${this.orgId}&size=${this.size}&current=${this.current}&listType=${this.actTab+1}&sortType=ASC&sortColumn=Rate`,
                    method: 'get',
                    data: {}
                }).then(({data}) => {
                    if(data.code === 0){
                        this.backList = data.data.records;
                        this.backList.forEach((item, index) => {
                            item.index = index + 1;
                        })
                    }
                }).catch((e) => {
                    console.log('getBoardData-err', e);
                });
            },
            // 切换
            checkTab(actTab) {
                this.actTab = actTab;
                this.init();
            },
        },

        components: {
            [List.name]: List,
            [PullRefresh.name]: PullRefresh,
            [Icon.name]: Icon,
            Toast
        }
    };
</script>


<style lang="scss" scoped>

</style>
