<template>
	<div class="detail-panel height100 white-bg">
		<van-nav-bar
				style="position: fixed; top: 0; width: 100%;"
				title="项目满意度得分排名"
				left-arrow
				@click-left="onClickLeft"
				v-eventlisten="{isChangePage:true,pageEvent:'点击返回按钮'}"
		/>

		<div class="padding-nav">
			<van-sticky class="has-nav-sticky">
				<div class="detail-table-panel list-title1 pt-15" style="padding-bottom: 0;">
					<el-table stripe
					          class="huo-list-table main-theme-table huojv-data-list not-hide-text" size="mini"
					          highlight-current-row
					          :data="emptyArray">
						<el-table-column type="index" label="序号" width="50"></el-table-column>
						<el-table-column prop="orgName" label="项目名称" width="80" align="center"></el-table-column>
						<el-table-column prop="satisfactionScore" label="得分" width="70" align="center">
							<template slot="header" slot-scope="scope">
								<div @click="sortData('satisfactionScore','ASC')">
									<span>得分</span>
									<label class="table-sort-ico">
										<i :class="[sortColumn == 'satisfactionScore' && sortType === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
										<i :class="[sortColumn == 'satisfactionScore' && sortType === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
									</label>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="compareTargeScore" label="与军令状目标差值" width="80" align="center">
							<template slot="header" slot-scope="scope">
								<div @click="sortData('compareTargeScore','ASC')">
									<span>与军令状目标差值</span>
									<label class="table-sort-ico">
										<i :class="[sortColumn == 'compareTargeScore' && sortType === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
										<i :class="[sortColumn == 'compareTargeScore' && sortType === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
									</label>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="adUserName" label="负责人"  align="center"></el-table-column>
					</el-table>
				</div>
			</van-sticky>

			<div class="detail-table-panel list-data1" style="padding-top:0;">
				<!--			<van-pull-refresh v-model="isLoading" @refresh="onRefresh">-->
				<van-list
						v-model="loading"
						:finished="finished"
						finished-text="没有更多数据了"
						@load="onLoad"
				>
					<el-table stripe
					          class="huo-list-table main-theme-table huojv-data-list not-hide-text hide-header" size="mini"
					          highlight-current-row
					          :data="tableList">
						<el-table-column type="index" width="50"></el-table-column>
						<el-table-column prop="orgName" label="项目名称" width="80" align="center">
                            <template slot-scope="scope">
                                <span :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.projectGUID,scope.row.orgType)">{{scope.row.orgName}}</span>
                            </template>
                        </el-table-column>
						<el-table-column prop="satisfactionScore" label="得分" width="70" align="center">
							<template slot="header" slot-scope="scope">
								<div @click="sortData('satisfactionScore','ASC')">
									<span>得分</span>
									<label class="table-sort-ico">
										<i :class="[sortColumn == 'satisfactionScore' && sortType === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
										<i :class="[sortColumn == 'satisfactionScore' && sortType === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
									</label>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="compareTargeScore" label="与军令状目标差值" width="80" align="center">
							<template slot="header" slot-scope="scope">
								<div @click="sortData('compareTargeScore','ASC')">
									<span>与军令状目标差值</span>
									<label class="table-sort-ico">
										<i :class="[sortColumn == 'compareTargeScore' && sortType === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
										<i :class="[sortColumn == 'compareTargeScore' && sortType === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
									</label>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="adUserName" label="负责人" align="center"></el-table-column>
					</el-table>
				</van-list>
				<!--			</van-pull-refresh>-->
			</div>
		</div>

	</div>
</template>

<script>
    import scrollFixed from '@/mixin/scroll-fixed';
    import {List, PullRefresh,NavBar,Sticky} from 'vant';
    import $ from 'jquery';
    import request from '@/utils/request';
    import {jumpToPj} from '@/utils/common'

    export default {
        mixins: [scrollFixed],

        data() {
            return {
                loading: false,//上拉加载
                isLoading: false,//下拉刷新,从第一页开始
                finished: false,//下拉加载完,如果没有数据设置true
                size:20,
                current:1,
                emptyArray:[],
                tableList: [],
                tab:1,
                tab1:1,
                orgName: '',
                orgId:'',
                orgType:'',
                pageType:1,  // 组织机构类型
                pageTitle:'',
                tableHeight: 0,
                isLoad:false,  // 是否处于加载状态  手动控制  以免一直执行onLoad方法
                unit:'',

                sortColumn:'satisfactionScore',  // 默认按照本季度调价幅度排序
                sortType:'ASC', // 默认升序
            };
        },

        created(){
            let bodyHeight = document.body.clientHeight;
            if (this.pageType == 1) {
                this.tableHeight = bodyHeight - 85;
            } else if (this.pageType == 2) {
                this.tableHeight = bodyHeight - 180;
            }
        },

        mounted() {
            this.tab = this.$route.query.tab;
            this.orgId = this.$route.query.orgId;
            this.orgType = this.$route.query.orgType;
            this.unit = this.orgType <= 5 ? '(亿)' : '(万)';

            this.$nextTick(() => {
                $('.list-title1 .el-table__header-wrapper').scroll(function () {
                    let scrollLeft = $(this).scrollLeft();
                    $(".list-data1 .el-table__body-wrapper").scrollLeft(scrollLeft);
                });

                $(".list-data1 .el-table__body-wrapper").scroll(function () {
                    let scrollLeft = $(this).scrollLeft();
                    $('.list-title1 .el-table__header-wrapper').scrollLeft(scrollLeft);
                })
            })
        },

        methods: {
            jumpToPj,
            reloadWindow(){
                setTimeout(() => {
                    window.location.reload();
                    this.isLoading = false;
                },500)
            },
            onClickLeft() {
                window.history.go(-1);
            },

            // 获取orgName
            getOrgName(){
                request({
                    url: `/app-api/orgType/sysOrg/${this.orgId}`,
                    method: 'get',
                    params: {}
                }).then(({data}) => {
                    if (data.code === 0 && data.data ) {
                        this.orgName = data.data[0].name;
                    }
                });
            },

            // 获取材料清单明细
            getDetailList(isRefresh){
                // 接口参数默认为调价情况分析
                let url = '/app-api/custonService/satisfactionScoreRank';
                let params = {
                    orgId:this.$route.query.orgId,
                    size: this.size,
                    current: this.current,
                    sortColumn:this.sortColumn,
                    sortType: this.sortType,
                    customerType:this.tab
                };

                request({
                    url: url,
                    method: 'get',
                    params:params
                }).then(({data}) => {
                    if(data.code === 0 && data.data){
                        let list = data.data.records || [];
                        this.tableList = isRefresh ? list : this.tableList.concat(list);
                        this.loading = false;
                        this.isLoading = false;
                        this.isLoad = false;

                        if(this.tableList.length){
                            this.tableList[0].index = 0;
                        }

                        if (null == list || list.length < this.size || this.tableList.length >= data.total) {
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
                        // 初始化
                        this.current = 1;
                        this.tableList = [];
                        this.loading = false;
                        this.isLoading = false;
                        this.finished = true;
                        this.isLoad = false;
                    }
                });
            },

            onLoad(){
                if(this.isLoad) return;  // 如果正在加载  返回
                this.isLoad = true;
                // 加载状态结束
                this.loading = false;
                this.getDetailList();
            },

            onRefresh(){
                this.current = 1;
                // this.tableList = [];
                this.getDetailList(true);
            },

            // 点击表头排序
            sortData(sortColumn,type){
                if(this['sortColumn'] != sortColumn){
                    this['sortColumn'] = sortColumn;
                    this.sortType = type || 'DESC';
                }else{
                    this['sortType'] = (this['sortType'] == 'ASC' ? 'DESC' : 'ASC');
                }


                this.onRefresh();
            },
        },

        components: {
            [NavBar.name]: NavBar,
            [List.name]: List,
            [PullRefresh.name]: PullRefresh,
            [Sticky.name]: Sticky,
        }
    };
</script>


<style lang="scss" scoped>

</style>
