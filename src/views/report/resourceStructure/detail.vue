<template>
	<div class="detail-panel height100 white-bg">
		<van-nav-bar
				:title="title"
				left-arrow
				@click-left="onClickLeft"
				v-eventlisten="{isChangePage:true,pageEvent:'点击返回按钮'}"
		/>

		<div class="main-content">

			<div class="data-content-panel" :class="[pageType == 1 ? 'pt-15 pb-20' : '']">
				<div v-if="pageType == 1">
					<el-table stripe
					          class="main-theme-table huo-list-table"
					          ref="tableRef"
					          size="mini" highlight-current-row
					          row-key="orgId"
					          :height="tableHeight"
					          :data="tableList"
					          :expand-row-keys="expandNodes"
					          :indent="10" lazy
					          border
					          :load="load"
					          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
					>
						<el-table-column prop="orgName" label="组织架构" align="left" fixed width="90">
                            <template slot-scope="scope">
								<span v-if="scope.row.orgType==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,scope.row.orgType)">{{scope.row.orgName}}</span>
								<span v-else>{{scope.row.orgName}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="buildarea" :label="'建筑面积' + areaUnit" width="110"
						                 align="center">
						</el-table-column>
						<el-table-column prop="countrjlarea" :label="'计容建面' + areaUnit" width="110"
						                 align="center">
						</el-table-column>
						<el-table-column prop="availablearea" :label="'可售面积' + areaUnit" width="110"
						                 align="center">
						</el-table-column>
						<el-table-column prop="availableamount" :label="'总货值' + costUnit" width="90"
						                 align="center">
						</el-table-column>
						<el-table-column prop="remainingresourcesamount" :label="'剩余货值' + costUnit" width="110" align="center">
						</el-table-column>
						<el-table-column prop="equityeamount" :label="'权益剩余货值' + costUnit" width="100" align="center">
							<template slot="header" slot-scope="scope">
								<span style="color: #999999;" v-text="'权益剩余货值' + costUnit"></span>
							</template>
						</el-table-column>
						<el-table-column prop="totalsoldamount" :label="'累计已售货值' + costUnit" width="100" align="center">
						</el-table-column>
						<el-table-column prop="preyearssoldamount" :label="'往年已售货值' + costUnit" width="100" align="center">
						</el-table-column>
						<el-table-column prop="curyearssoldamount" :label="'当年已售货值' + costUnit" width="100" align="center">
						</el-table-column>
						<el-table-column prop="availablesaleamount" :label="'当年可售货值' + costUnit" width="100" align="center">
						</el-table-column>
						<el-table-column prop="curperiinventoryamount" :label="'当年期初库存货值' + costUnit" width="110" align="center">
						</el-table-column>
						<el-table-column prop="curplansupplyamount" :label="'当年计划供应货值' + costUnit" width="110" align="center">
						</el-table-column>
					</el-table>
				</div>

				<div v-if="pageType == 2">
					<!-- tab切换卡 -->
					<div class="text-center">
						<ul class="huojv-tab-bars_1 two-cols">
							<li @click="checkTab1(1)"
							    v-eventlisten="{isChangePage:false,pageEvent:'点击货值'}"
							    :class="[tab1 == 1 ? 'active' : '']">货值
							</li>
							<li @click="checkTab1(2)"
							    v-eventlisten="{isChangePage:false,pageEvent:'点击面积'}"
							    :class="[tab1 == 2 ? 'active' : '']">面积
							</li>
						</ul>
						<!-- 标题 -->
						<div class="data-title-box" style="margin: 0; margin-top: -10px;">
							<span class="title"></span>
							<span class="unit" v-text="'单位' + (tab1 == 1 ? costUnit : areaUnit)"></span>
						</div>
						<el-table stripe
						          v-show="tab1 == 1"
						          class="main-theme-table huo-list-table"
						          ref="tableRef1"
						          size="mini" highlight-current-row
						          row-key="orgId"
						          :height="tableHeight"
						          :data="tableList"
						          :expand-row-keys="expandNodes"
						          :indent="10" lazy
						          border
						          :load="load1"
						          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
						>
							<el-table-column prop="orgName" label="组织架构" align="left" fixed width="90">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.orgType==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,scope.row.orgType)">{{scope.row.orgName}}</span>
                                    <span v-else>{{scope.row.orgName}}</span>
                                </template>
							</el-table-column>
							<el-table-column prop="productprice" label="均价(元)" align="center"
							                 width="70">
							</el-table-column>
							<el-table-column v-for="(month,index) in months" :key="'resource'+month" :label="month"
							                 align="center">
								<el-table-column prop="plansupplyamount" label="计划" width="80" align="center">
									<template slot-scope="scope">
										{{scope.row.dataWideDwsMdmSupplyDetialHistogramEntityList[index].dataWideDwsMdmSupplydetailEntity.plansupplyamount}}
									</template>
								</el-table-column>
								<el-table-column prop="actualsupplyamount" label="实际" width="80" align="center">
									<template slot-scope="scope">
										{{scope.row.dataWideDwsMdmSupplyDetialHistogramEntityList[index].dataWideDwsMdmSupplydetailEntity.actualsupplyamount}}
									</template>
								</el-table-column>
							</el-table-column>
						</el-table>

						<el-table stripe
						          v-show="tab1 == 2"
						          class="main-theme-table huo-list-table"
						          ref="tableRef2"
						          size="mini" highlight-current-row
						          row-key="orgId"
						          :height="tableHeight"
						          :data="tableList"
						          :expand-row-keys="expandNodes"
						          :indent="10" lazy
						          border
						          :load="load1"
						          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
						>
							<el-table-column prop="orgName" label="组织架构" align="left" fixed width="90">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.orgType==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,scope.row.orgType)">{{scope.row.orgName}}--{{scope.row.orgType}}</span>
                                    <span v-else>{{scope.row.orgName}}</span>
                                </template>
							</el-table-column>
							<el-table-column prop="productprice" label="均价(元)" align="center"
							                 width="70">
							</el-table-column>
							<el-table-column v-for="(month,index) in months" :key="'resource'+month" :label="month"
							                 align="center">
								<el-table-column prop="plansupplyamount" label="计划" width="80" align="center">
									<template slot-scope="scope">
										{{scope.row.dataWideDwsMdmSupplyDetialHistogramEntityList[index].dataWideDwsMdmSupplydetailEntity.plansupplyarea}}
									</template>
								</el-table-column>
								<el-table-column prop="actualsupplyamount" label="实际" width="80" align="center">
									<template slot-scope="scope">
										{{scope.row.dataWideDwsMdmSupplyDetialHistogramEntityList[index].dataWideDwsMdmSupplydetailEntity.actualsupplyarea}}
									</template>
								</el-table-column>
							</el-table-column>
						</el-table>
					</div>
				</div>
			</div>
		</div>


	</div>
</template>

<script>
    import scrollFixed from '@/mixin/scroll-fixed';
    import {List, PullRefresh, NavBar} from 'vant';
    import $ from 'jquery';
    import request from '@/utils/request';
    import {getUrlParam, getNextMonths, jumpToPj} from '@/utils/common'


    export default {
        mixins: [scrollFixed],

        data() {
            return {
                isLoading: false,//下拉刷新,从第一页开始
                tab1: this.tab,
                orgId: '',
                orgType: 2,
                areaUnit: '',
                costUnit: '',
                title: '',

                leval: 0,
                tableList: [],
                expandNodes: [],
                months: [],

                tableHeight: 0,
            };
        },
        props: {
            
        },
        props: ["pageType", "tab", "resourceType", "startDate", "endDate", "sourceType" ],
        created() {
            let bodyHeight = document.body.clientHeight;
            if (this.pageType == 1) {
                this.tableHeight = bodyHeight - 85;
            } else if (this.pageType == 2) {
                this.tableHeight = bodyHeight - 180;
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
        watch: {
            sourceType: function(newVal, oldVal){
                this.init()
            }
        },

        methods: {
            jumpToPj,
            init() {
                this.orgId = getUrlParam('chooseOrgId') || getUrlParam('orgId');
                this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType');

                // todo 这里后来说 单位不需要跟着组织机构变化
                this.areaUnit = this.orgType <= 5 ? '(万㎡)' : '(㎡)';
                this.costUnit = this.orgType <= 5 ? '(亿元)' : '(万元)';
                if (this.pageType == 1) {
                    this.getTableData();
                    this.title = '资源结构详情';
                } else if (this.pageType == 2) {
                    let months = getNextMonths(5, this.startDate, true);
                    months.unshift(this.startDate);
                    this.months = months;
                    this.getTableData1();
                    this.title = '供货情况详情';
                }
            },

            // 获取资源结构明细表格数据
            getTableData() {
                if (!this.orgId) return;
                this.leval = 0;
                let _url = `/app-api/resources/details?orgId=${this.orgId}&root=1&isCurrentData=${1+this.sourceType}`;

                request({
                    url: _url,
                    method: 'get'
                }).then(({data}) => {
                    if (data.code === 0) {
                        let _list = data.data;
                        let _parentOrgId = '',
                            _expandNodes = [];

                        let rootNode = {};
                        for (let i = 0, len = _list.length; i < len; i++) {
                            // if (!_list[i].leaf) {
                            //     _list[i].hasChildren = true;
                            //     _list[i].expan = false;
                            // }
                            if (_list[i]['root'] == true) {
                                rootNode = _list[i];
                                _parentOrgId = _list[i]['parentOrgId'];
                                _expandNodes.push(_list[i]['orgId'])

                                // 把根节点排在第一个
                                _list.splice(i,1);
                                _list.unshift(rootNode);
                                break;
                            }
                        }

                        let tree = this.fnGetTree(_list, _parentOrgId);
                        this.expandNodes = _expandNodes;

                        this.tableList = tree;

                        // this.tableList = _list;

                        // 重新渲染表格 防止表格错位
                        this.$nextTick(() => {
                            if (this.$refs['tableRef']) {
                                this.$refs['tableRef'].doLayout()
                            }
                        })
                    }
                }).catch((e) => {
                    console.log('getBoardData-err', e);
                });
            },

            // 获取资源类型明细表格数据
            getTableData1() {
                request({
                    url: `/app-api/resources/supplyDetail?orgId=${this.orgId}&beginYearMonth=${this.startDate}&endYearMonth=${this.endDate}&root=1&projectIsRoot=${this.orgType >= 6 ? 1 : 0}&isCurrentData=${1+this.sourceType}`,
                    method: 'get'
                }).then(({data}) => {
                    if (data.code === 0) {
                        let _list = data.data;
                        let _parentOrgId = '',
                            _expandNodes = [];

                        this.months = [];

                        // 获取月份
                        if (_list.length) {
                            _list[0].dataWideDwsMdmSupplyDetialHistogramEntityList.forEach(item => {
                                this.months.push(item.month);
                            })
                        }else{
                            let months = getNextMonths(5, this.startDate, true);
                            months.unshift(this.startDate);
                            this.months = months;
                        }

                        let rootNode = {};
                        for (let i = 0, len = _list.length; i < len; i++) {
                            // if (!_list[i].leaf) {
                            //     _list[i].hasChildren = true;
                            //     _list[i].expan = false;
                            // }
                            if (_list[i]['root'] == true) {
                                rootNode = _list[i];
                                _parentOrgId = _list[i]['parentOrgId'];
                                _expandNodes.push(_list[i]['orgId'])

	                            // 把根节点排在第一个
	                            _list.splice(i,1);
                                _list.unshift(rootNode);
                                break;
                            }
                        }

                        let tree = this.fnGetTree(_list, _parentOrgId);
                        this.expandNodes = _expandNodes;

                        this.tableList = tree;

                        // this.tableList = _list;

                        // 重新渲染表格 防止表格错位
                        this.$nextTick(() => {
                            if (this.$refs['tableRef1']) {
                                this.$refs['tableRef1'].doLayout()
                            }
                            if (this.$refs['tableRef2']) {
                                this.$refs['tableRef2'].doLayout()
                            }
                        })
                    }
                }).catch((e) => {
                    console.log('getBoardData-err', e);
                });
            },

            fnGetTree(data, parentOrgId) {
                this.leval++;
                let self = this;
                var result = [], temp;
                for (let i in data) {
                    if (data[i].parentOrgId == parentOrgId) {
                        result.push(data[i]);

                        // 初始数据只返回了两级   给第三级添加模拟子节点
                        if (this.leval >= 2 && !data[i].leaf) {
                            data[i].hasChildren = true;
                            data[i].expan = false;
                        } else {
                            temp = self.fnGetTree(data, data[i].orgId);
                            if (temp.length > 0) {
                                data[i].children = temp;
                            }
                        }
                    }
                }
                return result;
            },

            load(tree, treeNode, resolve) {
                let _url = `/app-api/resources/details?orgId=${tree.orgId}&root=0&isCurrentData=${1+this.sourceType}`;

                request({
                    url: _url,
                    method: 'get'
                }).then(({data}) => {
                    if (data && data.code === 0) {
                        let _list = data.data;
                        _list.forEach(item => {
                            if (!item.leaf) {
                                item.hasChildren = true;
                                item.expan = false;
                            }
                        });
                        resolve(_list);
                    } else {
                        resolve([]);
                    }
                });
            },

            load1(tree, treeNode, resolve) {
                let _url = `/app-api/resources/supplyDetail?orgId=${tree.orgId}&beginYearMonth=${this.startDate}&endYearMonth=${this.endDate}&root=0&projectIsRoot=${this.orgType >= 6 ? 1 : 0}&isCurrentData=${1+this.sourceType}`;

                request({
                    url: _url,
                    method: 'get'
                }).then(({data}) => {
                    if (data && data.code === 0) {
                        let _list = data.data;
                        _list.forEach(item => {
                            if (!item.leaf) {
                                item.hasChildren = true;
                                item.expan = false;
                            }
                        });
                        resolve(_list);
                    } else {
                        resolve([]);
                    }
                });
            },

            onClickLeft() {
                // window.history.go(-1);
                this.$emit('changePage', 1);
            },
            checkTab1(tab1) {
                this.tab1 = tab1;
                // 重新渲染表格 防止表格错位
                this.$nextTick(() => {
                    if (this.$refs['tableRef1']) {
                        this.$refs['tableRef1'].doLayout()
                    }
                    if (this.$refs['tableRef2']) {
                        this.$refs['tableRef2'].doLayout()
                    }
                })
            }

        },

        components: {
            [NavBar.name]: NavBar,
            [List.name]: List,
            [PullRefresh.name]: PullRefresh,
        }
    };
</script>


<style lang="scss" scoped>

</style>
