<template>
	<div class="detail-panel height100 white-bg">
		<van-nav-bar
				title="成本详情"
				left-arrow
				@click-left="onClickLeft"
				v-eventlisten="{isChangePage:true,pageEvent:'点击返回按钮'}"
		/>

		<div class="main-content">

			<div class="data-content-panel pt-15">
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
                                <span v-if="scope.row.orgType == 6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,scope.row.orgType)">{{scope.row.orgName}}</span>
                                <span v-else>{{scope.row.orgName}}</span>
                             </template>
                        </el-table-column>
						<el-table-column prop="targetItems" label="有目标成本项目个数" width="80"
						                 align="center">
						</el-table-column>
						<el-table-column prop="getLandTargetAmount" label="拿地版目标成本" width="80"
						                 align="center">
						</el-table-column>
						<el-table-column prop="toalTargetAmount" label="执行版目标成本" width="80"
						                 align="center">
						</el-table-column>
						<el-table-column prop="dynamicAmount" label="动态成本" width="80"
						                 align="center">
						</el-table-column>
						<el-table-column prop="changeAmount" label="目标成本变动额" width="80" align="center">
						</el-table-column>
						<el-table-column prop="changeRate" label="目标成本变动率" width="80" align="center">
							<template slot-scope="scope">
								<span v-show="scope.row.changeRate" v-text="(scope.row.changeRate > 0 ? '+' : '') + scope.row.changeRate + '%'"></span>
							</template>
						</el-table-column>
					</el-table>
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
                orgId: '',
                orgType: 2,

                leval: 0,
                tableList: [],
                expandNodes: [],
                tableHeight: 0,
	            year:'',
	            month:''
            };
        },
        created() {
            // 根据屏幕高度动态计算表格高度
            let bodyHeight = document.body.clientHeight;
	        this.tableHeight = bodyHeight - 85;
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
            jumpToPj,
            init() {
                this.orgId = getUrlParam('chooseOrgId') || getUrlParam('orgId');
                this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType');
            },

            // 获取资源结构明细表格数据
            getTableData() {
                this.orgId = getUrlParam('chooseOrgId') || getUrlParam('orgId');
                if (!this.orgId) return;
                this.leval = 0;
                let _url = `/app-api/costContract/cost/details?orgId=${this.orgId}&root=1`;

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

	                            this.year = _list[i].years;
	                            this.month = _list[i].months;

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

	        // 表格数据懒加载
            load(tree, treeNode, resolve) {
                let _url = `/app-api/costContract/cost/details?orgId=${tree.orgId}&root=0&year=${this.year}&month=${this.month}`;

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
