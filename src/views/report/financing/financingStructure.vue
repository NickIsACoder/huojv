<template>
	<div class="report-index">
		<div class="main-content" style="width: 100%;">
			<div class="data-content-panel no-top-left-radius clearfix" style="overflow: visible;">
				<div class="data-title-box">
					<img class="title-ico" src="../../../assets/images/list_ico.png">
					<!-- <span class="title" @click="getMore">详情</span> -->
					<span class="title" >详情</span>
				</div>

				<!-- 该div用于存储table滑动到顶部之后的宽度 -->
				<!--                <div class="table-width"></div>-->
				<div class="scroll-gesture">
					<!-- <el-table v-show="!isMore" stripe
							  height="400"
							  class="main-theme-table huo-list-table"
							  ref="tableRef"
							  size="mini" highlight-current-row
							  row-key="orgId"
							  :data="tableListBoard"
							  :expand-row-keys="expandNodes"
							  :indent="10" lazy
							  border
							  :load="load"
							  :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
					>
						<el-table-column prop="orgName" label="组织架构" align="left" fixed
										 width="90">
						</el-table-column>
						<el-table-column prop="fundbalance" :label="tab1 == 2 ? '资金余额(亿元)' : '资金余额(亿元)'" width="70"
										 align="center">
							<template slot-scope="scope">
								<span>{{scope.row.fundbalance || 0}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="availablefunds"  :label="tab1 == 2 ? '可用资金(亿元)' : '可用资金(亿元)'" width="70"
										 align="center">
							<template slot-scope="scope">
								<span>{{scope.row.availablefunds || 0}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="regulatoryfunds"  :label="tab1 == 2 ? '预售监管资金(亿元)' : '预售监管资金(亿元)'"
										 align="center">
							<template slot-scope="scope">
								<span>{{scope.row.regulatoryfunds || 0}}</span>
							</template>
						</el-table-column>
					</el-table> -->
					<el-table stripe
					          height="400"
					          class="main-theme-table huo-list-table"
					          ref="tableRef"
					          size="mini" highlight-current-row
					          row-key="orgId"
					          :data="tableListBoard"
					          :expand-row-keys="expandNodes"
					          :indent="10" lazy
					          border
					          :load="load"
					          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
					>
						<el-table-column prop="orgName" label="组织架构" align="left" fixed width="100">
                            <template slot-scope="scope">
                                <span v-if="scope.row.orgType == 6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,scope.row.orgType)">{{scope.row.orgName}}</span>
                                <span v-else>{{ scope.row.orgName }}</span>
                            </template>
						</el-table-column>
						<el-table-column prop="fundbalance" :label="tab1 == 2 ? '资金余额('+unit+'元)' : '资金余额('+unit+'元)'" width="70"
						                 align="center">
							<template slot-scope="scope">
								<span>{{scope.row.fundbalance || 0}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="availablefunds"  :label="tab1 == 2 ? '可用资金('+unit+'元)' : '可用资金('+unit+'元)'" width="70"
						                 align="center">
							<template slot-scope="scope">
								<span>{{scope.row.availablefunds || 0}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="regulatoryfunds"  :label="tab1 == 2 ? '预售监管资金('+unit+'元)' : '预售监管资金('+unit+'元)'"
						                 align="center">
							<template slot-scope="scope">
								<span>{{scope.row.regulatoryfunds || 0}}</span>
							</template>
						</el-table-column>
						<el-table-column label="不可用资金" align="center">
							<el-table-column prop="unAvailableFunds" :label="tab1 == 2 ? '合计('+unit+'元)' : '合计('+unit+'元)'" align="center" width="110">
								<template slot-scope="scope">
									<span>{{scope.row.unAvailableFunds || 0}}</span>
								</template>
							</el-table-column>
							<el-table-column prop="jointVenture" :label="tab1 == 2 ? '合资公司资金('+unit+'元)' : '合资公司资金('+unit+'元)'" align="center" width="110">
								<template slot-scope="scope">
									<span>{{scope.row.jointVenture || 0}}</span>
								</template>
							</el-table-column>
							<el-table-column prop="purchaseDeposit" :label="tab1 == 2 ? '收购定金及共管资金('+unit+'元)' : '收购定金及共管资金('+unit+'元)'" align="center" width="110">
								<template slot-scope="scope">
									<span>{{scope.row.purchaseDeposit || 0}}</span>
								</template>
							</el-table-column>
							<el-table-column prop="bondFunds" :label="tab1 == 2 ? '保证金('+unit+'元)' : '保证金('+unit+'元)'" align="center" width="110">
								<template slot-scope="scope">
									<span>{{scope.row.bondFunds || 0}}</span>
								</template>
							</el-table-column>
							<el-table-column prop="timeDeposit" :label="tab1 == 2 ? '定期存款('+unit+'元)' : '定期存款('+unit+'元)'" align="center" width="110">
								<template slot-scope="scope">
									<span>{{scope.row.timeDeposit || 0}}</span>
								</template>
							</el-table-column>
							<el-table-column prop="internalExternal" :label="tab1 == 2 ? '内保外贷('+unit+'元)' : '内保外贷('+unit+'元)'" align="center" width="110">
								<template slot-scope="scope">
									<span>{{scope.row.internalExternal || 0}}</span>
								</template>
							</el-table-column>
							<el-table-column prop="externalInternal" :label="tab1 == 2 ? '外保内贷('+unit+'元)' : '外保内贷('+unit+'元)'" align="center" width="110">
								<template slot-scope="scope">
									<span>{{scope.row.externalInternal || 0}}</span>
								</template>
							</el-table-column>
							<el-table-column prop="otherFunds" :label="tab1 == 2 ? '其余类别('+unit+'元)' : '其余类别('+unit+'元)'" align="center" width="110">
								<template slot-scope="scope">
									<span>{{scope.row.otherFunds || 0}}</span>
								</template>
							</el-table-column>
						</el-table-column>
					</el-table>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
    import scrollFixed from '@/mixin/scroll-fixed';
    import {
        List,
        PullRefresh,
    } from 'vant';
    import {getLocalStorage} from '@/utils/local-storage';
    import request from '@/utils/request';
    import $ from 'jquery'
    import {handleNum2String, handleDate, getUrlParam, jumpToPj} from '@/utils/common'


    export default {
        mixins: [scrollFixed],
        data() {
            return {
                expandNodes: [],
                tableListBoard: [],
                leval: 0,   //  标识树形接口默认展开到多少级
                isLoading:false,
                unit:'',
                orgType: '2'
            }
        },
	    props:['tab1'],
        mounted() {
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

            this.init();
        },
        methods: {
            jumpToPj,
            init(isRefresh){
                this.orgId = getUrlParam('chooseOrgId') || getUrlParam('orgId') || getLocalStorage('orgId').orgId;
                this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType;
                this.unit = (getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType) <=5 ? '亿':'万';

                this.getTableData();
            },

            // 获取表格数据
            getTableData() {
                if (!this.orgId) return;
                this.leval = 0;
                let _url = `/app-api/fundStructure/list/${this.orgId}/${this.tab1}/1`;

                request({
                    url: _url,
                    method: 'get'
                }).then(({data}) => {
                    // if (data.code === 0) {
                    //     let _list = data.data,
                    //         parentEl = [], _expandNodes = [];
                    //
                    //     var idMapping = _list.reduce(function (acc, el, i) {
                    //         acc[el.orgId] = i;
                    //         return acc;
                    //     }, {});
                    //
                    //     for (var i = 0; i < _list.length; i++) {
                    //         // 根节点默认展开  否则
                    //         if(_list[i].root){
                    //             _expandNodes.push(_list[i].orgId)
                    //         }else if(!_list[i].root && !_list[i].leaf){
                    //             _list[i].hasChildren = true;
                    //             _list[i].expan = false;
                    //         }
                    //         // 用映射表找到父元素
                    //         const parentIndex = idMapping[_list[i].parentOrgId];
                    //         if(!parentIndex) continue;
                    //
                    //         parentEl = _list[idMapping[_list[i].parentOrgId]];
                    //         if (!parentEl.children) {
                    //             parentEl.children = [];
                    //         }
                    //
                    //         parentEl.children.push(_list[i]);
                    //     }
                    //
                    //     this.expandNodes = _expandNodes;
                    //
                    //     if(!parentEl.length){
                    //         this.tableListBoard = _list;
                    //     }else{
                    //         this.tableListBoard = parentEl;
                    //     }
                    // }

                    if(data.code === 0){
                        let _list = data.data,
                            _parentOrgId = '',
                            _expandNodes = [];

                        for (let i = 0, len = _list.length; i < len; i++) {
                            if (_list[i].root) {
                                _parentOrgId = _list[i].parentOrgId;
                                _expandNodes.push(_list[i].orgId)
                                break;
                            }
                        }

                        this.expandNodes = _expandNodes;

                        let tree = this.fnGetTree(_list, _parentOrgId);
                        if(!tree.length){
                            this.tableListBoard = _list;
                        }else{
                            this.tableListBoard = tree;
                        }

                        // 重新渲染表格 防止表格错位
                        this.$nextTick(()=>{
                            if(this.$refs['tableRef']){
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
                for (var i in data) {
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
                let _url = `/app-api/fundStructure/list/${tree.orgId}/${this.tab1}/0`;

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

            back(){
                sessionStorage.removeItem('saleReceiptPage'); // 返回首页之后清空页面状态
                // this.goPage('/report/saleReceipts');
                // window.history.go(-1);
                this.$emit('changePage',0);
            },

            goPage(path){
                let search = decodeURIComponent(window.location.search);
                if(!search){
                    search = '?' + decodeURIComponent(window.location.href.split('?')[1]);
                }

                window.location = `#${path + search}`
            },
        },
        components: {
            [List.name]: List,
            [PullRefresh.name]: PullRefresh,
        }
    };
</script>


<style lang="scss" scoped>
	.boxTitle{
		font-size: 14px;
		color: #333333;
		margin: 18px 0;
	}
	.boxTitle2{
		font-size: 14px;
		color: #333333;
		margin: 0;
	}
	.fR{
		color: #B2B2B2;
		font-size: 11px;
		float: right;
	}
	// .tableToggle{
	//     text-align: right;
	//     margin: 0;

	// }
	.tableBox{
		margin-bottom: 80px;
	}
	.more{
		font-size: 12px;
		color: #666666;
		float: right;
		margin-top: 12px;
		&.up{
			color: #209B5C;
		}
	}
</style>
