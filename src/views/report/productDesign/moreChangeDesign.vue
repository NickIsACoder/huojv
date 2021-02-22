<template>
	<div class="detail-panel height100 white-bg">
		<van-nav-bar
				style="position: fixed; top: 0; width: 100%;"
				:title="pageType == 1 ? '设计变更成本变动明细' : '设计节点逾期情况'"
				left-arrow
				@click-left="onClickLeft"
				v-eventlisten="{isChangePage:true,pageEvent:'点击返回按钮'}"
		/>

		<div class="padding-nav">
			<van-sticky class="has-nav-sticky">
				<div v-show="pageType == 1" class="data-content-panel pt-15 p-l-r-15" style="padding-bottom: 0; position:relative;">
					<ul class="huojv-data-list pt-15 p-l-r-15" style="overflow-x: auto; position:absolute; top: 0; left: 0; z-index: 10;">
						<li class="title" style="padding: 0;">
							<label style="width: 80px; text-align: center;">项目名称</label>
						</li>
					</ul>
					<ul class="huojv-data-list list-title1" style="overflow-x: auto;">
						<li class="title" style="width: 601px; padding: 0; padding-left: 80px;">
							<label style="width: 80px; text-align: center;">变更原因</label>
							<label style="width: 120px; text-align: left;">变更描述</label>
							<label @click="sortData('designChangeAmount')" style="width: 110px;">变更金额(元)
								<label class="table-sort-ico">
									<i :class="[sortColumn == 'designChangeAmount' && sortType === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
									<i :class="[sortColumn == 'designChangeAmount' && sortType === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
								</label>
							</label>
							<label @click="sortData('designChangeRate')" style="width: 110px;">成本变动率
								<label class="table-sort-ico">
									<i :class="[sortColumn == 'designChangeRate' && sortType === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
									<i :class="[sortColumn == 'designChangeRate' && sortType === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
								</label>
							</label>
							<label style="width: 100px; text-align: center;">设计负责人</label>
						</li>
					</ul>
				</div>
				<div v-show="orgType<=5&&pageType == 2" class="detail-table-panel list-title2 pt-15" style="padding-bottom: 0;">
					<el-table stripe
					          class="huo-list-table main-theme-table huojv-data-list not-hide-text" size="mini"
					          highlight-current-row
					          :data="[]">
						<el-table-column prop="projectName" label="项目" width="100" align="center"></el-table-column>
						<el-table-column prop="taskName" label="逾期节点" align="center"  width="120"></el-table-column>
						<el-table-column prop="yqDate" label="逾期天数" width="80" align="center"></el-table-column>
						<el-table-column prop="dutyUserName" label="工程负责人" width="100" align="center"></el-table-column>
					</el-table>
				</div>
                <div v-show="orgType>=6&&pageType == 2" class="detail-table-panel list-title2 pt-15" style="padding-bottom: 0;">
					<el-table stripe
					          class="huo-list-table main-theme-table huojv-data-list not-hide-text" size="mini"
					          highlight-current-row
					          :data="[]">
						<el-table-column label="序号" type="index" align="center"></el-table-column>
                        <el-table-column prop="period" label="分期" width="100" align="center"></el-table-column>
                        <el-table-column prop="bldName" label="楼栋" align="center" width="120"></el-table-column>
                        <el-table-column prop="taskName" label="逾期节点" width="80" align="center"></el-table-column>
                        <el-table-column prop="yqDate" label="逾期天数" width="80" align="center"></el-table-column>
                        <el-table-column prop="dutyUserName" label="设计负责人" width="100" align="center"></el-table-column>
					</el-table>
				</div>
			</van-sticky>

			<div class="detail-table-panel list-data1">
				<van-list
						v-model="loading"
						:finished="finished"
						finished-text="没有更多数据了"
						@load="onLoad"
				>
					<el-table stripe v-show="pageType == 1"
					          class="huo-list-table main-theme-table huojv-data-list not-hide-text hide-header" size="mini" highlight-current-row
					          :data="tableList">
						<el-table-column property="orgName" label="项目名称" width="80" fixed>
                            <template slot-scope="scope">
                                <span :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,6)">{{scope.row.orgName}}</span>
                            </template>
                        </el-table-column>
						<el-table-column property="designChangeReason" label="变更原因" align="center" width="80"></el-table-column>
						<el-table-column property="designChangeDescription" label="变更描述" width="120"></el-table-column>
						<el-table-column property="designChangeAmount" label="变更金额(元)" align="center" width="110">
							<template slot="header" slot-scope="scope">
								<div @click="sortData('designChangeAmount')">
									<span>放盘当月签约去化率</span>
									<label class="table-sort-ico">
										<i :class="[sortColumn == 'designChangeAmount' && sortType === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
										<i :class="[sortColumn == 'designChangeAmount' && sortType === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
									</label>
								</div>
							</template>
						</el-table-column>
						<el-table-column property="designChangeRate" label="成本变动率" align="center" width="110">
							<template slot="header" slot-scope="scope">
								<div @click="sortData('designChangeRate')">
									<span>放盘当月签约去化率</span>
									<label class="table-sort-ico">
										<i :class="[sortColumn == 'designChangeRate' && sortType === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
										<i :class="[sortColumn == 'designChangeRate' && sortType === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
									</label>
								</div>
							</template>
							<template slot-scope="scope">
								<span>{{(scope.row.designChangeRate || '-') + '‱'}}</span>
							</template>
						</el-table-column>
						<el-table-column property="designUser" label="设计负责人" align="center" width="100"></el-table-column>
					</el-table>
					<el-table stripe v-show="orgType<=5&&pageType == 2"
					          class="huo-list-table main-theme-table huojv-data-list hide-header list-data2" size="mini"
					          highlight-current-row
					          :data="tableList">
						<el-table-column prop="projectName" label="项目" width="100" align="center">
                            <template slot-scope="scope">
                                <span :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.projectGUID,6)">{{scope.row.projectName}}</span>
                            </template>
                        </el-table-column>
						<el-table-column prop="taskName" label="逾期节点" align="center" width="120"></el-table-column>
						<el-table-column prop="yqDate" label="逾期天数" width="80" align="center"></el-table-column>
						<el-table-column prop="dutyUserName" label="工程负责人" width="100" align="center"></el-table-column>
					</el-table>
                    <el-table stripe v-show="orgType>=6&&pageType == 2"
					          class="huo-list-table main-theme-table huojv-data-list hide-header list-data2" size="mini"
					          highlight-current-row
					          :data="tableList">
						<el-table-column label="序号" type="index" align="center"></el-table-column>
                        <el-table-column prop="period" label="分期" width="100" align="center"></el-table-column>
                        <el-table-column prop="bldName" label="楼栋" align="center" width="120"></el-table-column>
                        <el-table-column prop="taskName" label="逾期节点" width="80" align="center"></el-table-column>
                        <el-table-column prop="yqDate" label="逾期天数" width="80" align="center"></el-table-column>
                        <el-table-column prop="dutyUserName" label="设计负责人" width="100" align="center"></el-table-column>
					</el-table>
				</van-list>
			</div>
		</div>

	</div>
</template>

<script>
    import scrollFixed from '@/mixin/scroll-fixed';
    import {List, PullRefresh,NavBar,Sticky} from 'vant';
    import $ from 'jquery';
    import request from '@/utils/request';
    import {getUrlParam,jumpToPj} from '@/utils/common';
    import {getLocalStorage} from '@/utils/local-storage';

    export default {
        mixins: [scrollFixed],

        data() {
            return {
                loading: false,//上拉加载
                isLoading: false,//下拉刷新,从第一页开始
                finished: false,//下拉加载完,如果没有数据设置true
                size:20,
                current:1,
                tableList: [],
                sortColumn:'designChangeRate',
                sortType:'DESC',
                orgId:'',
	            pageType:1,

                isLoad:false,  // 是否处于加载状态  手动控制  以免一直执行onLoad方法
                orgType: this.$route.query.orgType
            };
        },
        mounted() {
            this.orgId = this.$route.query.orgId;
            this.pageType = this.$route.query.pageType;

            // this.getDetailList();
            this.$nextTick(() => {
                $(".list-title1").scroll(function () {
                    let scrollLeft = $(this).scrollLeft();
                    $('.list-data1 .el-table__body-wrapper').scrollLeft(scrollLeft);
                })

                $(".list-data1 .el-table__body-wrapper").scroll(function () {
                    let scrollLeft = $(this).scrollLeft();
                    $('.list-title1').scrollLeft(scrollLeft);
                })

                $('.list-title2 .el-table__header-wrapper').scroll(function () {
                    let scrollLeft = $(this).scrollLeft();
                    $(".list-data2 .el-table__body-wrapper").scrollLeft(scrollLeft);
                });

                $(".list-data2 .el-table__body-wrapper").scroll(function () {
                    let scrollLeft = $(this).scrollLeft();
                    $('.list-title2 .el-table__header-wrapper').scrollLeft(scrollLeft);
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

            // 获取材料清单明细
            getDetailList(isRefresh){
                let url = '';
                let params = {}

                if(this.pageType == 1){ 
                    url = '/app-api/productDesign/designChangeDetail';
                    params = {
                         orgId:this.$route.query.orgId,
                        size: this.size,
                        current: this.current,
                        sortColumn:this.sortColumn,
                        sortType: this.sortType,
                        designType: this.$route.query.designType
                     }
                }else if(this.pageType == 2){
                    url = '/app-api/productDesign/getNodeOverview';
                    params = {
                        orgId: this.$route.query.orgId,
                        size: this.size,
                        current: this.current,
                        designType: this.$route.query.designType
                    };
                }

                request({
                    url: url,
                    method: this.pageType == 2 ? 'post' : 'get',
	                data:params,
                    params:params
                }).then(({data}) => {
                    if(data.code === 0 && data.data){
                        let list = [];
                        if (this.pageType == 1) {
                            list =data.data.records || []
                        } else {
                            list =data.data || []
                        }
                        this.tableList = isRefresh ? list : this.tableList.concat(list);
                        this.loading = false;
                        this.isLoading = false;
                        this.isLoad = false;

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
                        this.current = 1;
                        this.tableList = [];
                        this.loading = false;
                        this.isLoading = false;
                        this.finished = true;
                        this.isLoad = false;
                    }
                }).catch((e) => {
                    this.current = 1;
                    this.tableList = [];
                    this.loading = false;
                    this.isLoading = false;
                    this.finished = true;
                    this.isLoad = false;
                    console.log('getEchartData-err', e);
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
                this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType;
                this.current = 1;
                // this.tableList = [];
                this.getDetailList(true);
            },

            sortData(sortColumn){
                if(this.sortColumn != sortColumn){
                    this.sortColumn = sortColumn;
                    this.sortType = 'DESC';
                }else{
                    this.sortType = (this.sortType == 'ASC' ? 'DESC' : 'ASC');
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
.has-nav-sticky /deep/ .van-sticky--fixed{
    background: #fff;
}
</style>
