<template>
	<div class="report-index">
		<div class="main-content" style="width: 100%;">
			<div class="data-content-panel no-top-left-radius clearfix" style="overflow: visible;"  v-show="orgType<6">
				<div class="data-title-box data-title-line">
					<span class="title">供销比情况</span>
				</div>
				<el-table stripe class="huo-list-table tree-table" ref="tableRef1" size="mini" height="400"
                        highlight-current-row
                        row-key="orgId"
                        :data="tableActiveData1"
                        :expand-row-keys="expandNodes1"
                        border :indent="5"
                        lazy :load="load1"
                        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
					<el-table-column prop="orgName" label="组织架构" width="150" fixed>
                        <template slot-scope="scope">
                            <span v-if="scope.row.orgType==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,scope.row.orgType)">{{scope.row.orgName}}</span>
                            <span v-else>{{scope.row.orgName}}</span>
                        </template>
                    </el-table-column>
					<el-table-column prop="supplyArea" label="供货面积(万㎡)" width="110" align="center"></el-table-column>
					<el-table-column prop="saleArea" label="销售面积(万㎡)" width="110" align="center">
                        <template slot-scope="scope">
                           {{scope.row.saleArea|changeVal}}
                        </template>
                    </el-table-column>
					<el-table-column prop="supplyRate" label="供销比" width="80" align="center">
                        <template slot-scope="scope">
                            {{scope.row.saleArea|changeVal(scope.row.supplyRate)}}
                        </template>
                    </el-table-column>
					<el-table-column prop="adUserName" label="负责人"  align="center"></el-table-column>
				</el-table>


				<div class="data-title-box data-title-line">
					<span class="title">开销比情况</span>
				</div>
				<el-table stripe class="huo-list-table tree-table" ref="tableRef2" size="mini" height="400"
                        highlight-current-row
                        row-key="orgId"
                        :data="tableActiveData2"
                        :expand-row-keys="expandNodes2"
                        border :indent="5"
                        lazy :load="load2"
                        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                    <el-table-column prop="orgName" label="组织架构" width="150" fixed>
                        <template slot-scope="scope">
                            <span v-if="scope.row.orgType==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,scope.row.orgType)">{{scope.row.orgName}}</span>
                            <span v-else>{{scope.row.orgName}}</span>
                        </template>
                    </el-table-column>
					<el-table-column prop="expensesArea" label="开工面积(万㎡)" width="110" align="center"></el-table-column>
					<el-table-column prop="saleArea" label="销售面积(万㎡)" width="110" align="center">
                        <template slot-scope="scope">
                           {{scope.row.saleArea|changeVal}}
                        </template>
                    </el-table-column>
					<el-table-column prop="expensesRate" label="开销比" width="80" align="center">
                        <template slot-scope="scope">
                            {{scope.row.saleArea|changeVal(scope.row.expensesRate)}}
                        </template>
                    </el-table-column>
					<el-table-column prop="adUserName" label="负责人" align="center"></el-table-column>
				</el-table>
			</div>
            <div class="data-content-panel no-top-left-radius clearfix" v-show="orgType>=6">
                <div class="data-title-box data-title-line">
					<span class="title">供销比情况</span>
				</div>
                <el-table stripe
                    class="huo-list-table tree-table"
                    ref="tableRef3" :indent="5"
                    size="mini" highlight-current-row
                    row-key="rowNum" default-expand-all
                    :data="tableTreeList1" border
                    :tree-props="{children: 'childs', hasChildren: 'hasChildren'}">
                    <el-table-column property="orgName" label="组织" width="120" fixed>
                        <template slot-scope="scope">
                            <span v-if="scope.row.orgType==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,scope.row.orgType)">{{scope.row.orgName}}</span>
                            <span v-else>{{scope.row.orgName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column property="yszdate" label="实际取得预售许可证时间" align="center" width="100">
                       <template slot-scope="scope">
                           {{scope.row.yszdate|changeVal}}
                        </template>
                    </el-table-column>
                    <el-table-column property="supplyArea" label="供货面积（万㎡）" align="center" width="80">
                        <template slot-scope="scope">
                           {{scope.row.supplyArea|changeVal}}
                        </template>
                    </el-table-column>
                    <el-table-column property="saleArea" label="销售面积（万㎡）" align="center" width="100">
                        <template slot-scope="scope">
                           {{scope.row.saleArea|changeVal}}
                        </template>
                    </el-table-column>
                    <el-table-column property="expensesRate" label="供销比" align="center" width="100">
                        <template slot-scope="scope">
                           {{scope.row.saleArea|changeVal(scope.row.expensesRate)}}
                        </template>
                    </el-table-column>
                </el-table>
                <div class="data-title-box data-title-line">
					<span class="title">开销比情况</span>
				</div>
                <el-table stripe
                    class="huo-list-table tree-table"
                    ref="tableRef4" :indent="5"
                    size="mini" highlight-current-row
                    row-key="rowNum" default-expand-all
                    :data="tableTreeList2" border
                    :tree-props="{children: 'childs', hasChildren: 'hasChildren'}">
                    <el-table-column property="orgName" label="组织" width="120" fixed>
                        <template slot-scope="scope">
                            <span v-if="scope.row.orgType==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,scope.row.orgType)">{{scope.row.orgName}}</span>
                            <span v-else>{{scope.row.orgName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column property="kgdate" label="实际开工时间" align="center" width="100">
                        <template slot-scope="scope">
                           {{scope.row.kgdate|changeVal}}
                        </template>
                    </el-table-column>
                    <el-table-column property="expensesArea" label="开工面积（万㎡）" align="center" width="80">
                        <template slot-scope="scope">
                           {{scope.row.expensesArea|changeVal}}
                        </template>
                    </el-table-column>
                    <el-table-column property="saleArea" label="销售面积（万㎡）" align="center" width="100">
                        <template slot-scope="scope">
                           {{scope.row.saleArea|changeVal}}
                        </template>
                    </el-table-column>
                    <el-table-column property="expensesRate" label="开销比" align="center" width="100">
                        <template slot-scope="scope">
                            {{scope.row.saleArea|changeVal(scope.row.expensesRate)}}
                        </template>
                    </el-table-column>
                </el-table>
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
    import echarts from 'echarts'
    import $ from 'jquery'
    import {handleNum2String, handleDate, getUrlParam,jumpToPj} from '@/utils/common'


    export default {
        mixins: [scrollFixed],
        data() {
            return {
                tab1:1,
                tab2:1,
                level1: 0,
                expandNodes1: [],
                tableActiveData1:[],
                level2: 0,
                expandNodes2: [],
                tableActiveData2:[],
                orgId:'',
                orgType: '',
                tableTreeList1: [], // 项目层级供销比情况
                tableTreeList2: [],  // 项目层级开销比情况
                list: []
            }
        },
        props: ["chooseOrgId"],
        watch: {
            '$store.state.orgId': function (newVal, oldVal) {
                this.init();
            }
        },
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
        filters:{
            // 销售面积为空或0，开销比/供销比显示为横杠
            changeVal(val1, val2){
                // if(val1==0||(val1&&parseFloat(val1)>=0)){
                if(val1&&parseFloat(val1)>0){
                    if (typeof(val2)==="undefined") { // 没传
                        return val1==''?'-':val1
                    }else if(typeof(val2)==="object"){
                        return '-'
                    }else{
                        return (parseFloat(val1)==0||val1=='')?'-':(val2<=0?'-':val2)
                    }
                }
                return '-'
            }
        },
        methods: {
            jumpToPj,
            init(){
                this.orgId = getUrlParam('chooseOrgId') || getUrlParam('orgId') || getLocalStorage('orgId').orgId;
                this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType;

                if (this.orgType<6) {
                    this.level1 = 0
                    this.expandNodes1 = []
                    this.tableActiveData1 = []
                    this.level2 = 0
                    this.expandNodes2 = []
                    this.tableActiveData2 = []
                    this.getTableList1()
                    this.getTableList2()
                }else {
                    // 供应:overSupply; 开工:overExpenses
                    this.tableTreeList1 = []
                    this.tableTreeList2 = []
                    this.getTableTreeList('overSupply')
                    this.getTableTreeList('overExpenses')
                }
                
            },
            // 获取供销平衡
            getTableList1(){
                request({
                    url: `/app-api/engineer/engineerSupplyMarketingBalanceList`,
                    method: 'get',
                    params: {
                        orgId: this.orgId,
                        isOverSupply: '供应',
                        root: 1
                    }
                }).then(({data}) => {
                    if (data.code === 0) {
                        let _list = data.list || data.data,
                                _parentOrgId = '',
                                _expandNodes = [];

                        for (let i = 0, len = _list.length; i < len; i++) {
                            if (_list[i]['root'] == true) {
                                _parentOrgId = _list[i]['parentOrgId'];
                                _expandNodes.push(_list[i]['orgId'])
                                break;
                            }
                        }

                        let tree = this.fnGetTree1(_list, _parentOrgId);

                        this.expandNodes1 = _expandNodes;
                        this.tableActiveData1 = tree;

                        // 重新渲染表格 防止表格错位
                        this.$nextTick(() => {
                            if (this.$refs['tableRef1']) {
                                this.$refs['tableRef1'].doLayout()
                            }
                        })
                    }
                });
            },
            fnGetTree1(data, parentOrgId) {
                this.level1++;
                let self = this;
                var result = [], temp;
                for (var i in data) {
                    if (data[i].parentOrgId == parentOrgId) {
                    result.push(data[i]);

                    // 初始数据只返回了两级   给第三级添加模拟子节点
                    if (this.level1 >= 2 && !data[i].leaf) {
                        data[i].hasChildren = true;
                        data[i].expan = false;
                    } else {
                        temp = self.fnGetTree1(data, data[i].orgId);
                        if (temp.length > 0) {
                            data[i].children = temp;
                        }
                    }
                    }
                }
                return result;
            },
            load1(tree, treeNode, resolve) {
                request({
                    url: '/app-api/engineer/engineerSupplyMarketingBalanceList',
                    method: 'get',
                    params: {
                        orgId: tree.orgId,
                        isOverSupply: '供应',
                        root: 0
                    }
                }).then(({data}) => {
                    if (data && data.code === 0) {
                        let _list = data.list || data.data;
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
            // 获取开销平衡
            getTableList2(){
                request({
                    url: `/app-api/engineer/engineerSupplyMarketingBalanceList`,
                    method: 'get',
                    params: {
                        orgId: this.orgId,
                        isOverSupply: '开工',
                        root: 1
                    }
                }).then(({data}) => {
                    if (data.code === 0) {
                        let _list = data.list || data.data,
                                _parentOrgId = '',
                                _expandNodes = [];

                        for (let i = 0, len = _list.length; i < len; i++) {
                        if (_list[i]['root'] == true) {
                            _parentOrgId = _list[i]['parentOrgId'];
                            _expandNodes.push(_list[i]['orgId'])
                            break;
                        }
                        }

                        let tree = this.fnGetTree2(_list, _parentOrgId);

                        this.expandNodes2 = _expandNodes;
                        this.tableActiveData2 = tree;

                        // 重新渲染表格 防止表格错位
                        this.$nextTick(() => {
                            if (this.$refs['tableRef2']) {
                                this.$refs['tableRef2'].doLayout()
                            }
                        })
                    }
                });
            },
            fnGetTree2(data, parentOrgId) {
                this.level2++;
                let self = this;
                var result = [], temp;
                for (var i in data) {
                    if (data[i].parentOrgId == parentOrgId) {
                    result.push(data[i]);

                    // 初始数据只返回了两级   给第三级添加模拟子节点
                    if (this.level2 >= 2 && !data[i].leaf) {
                        data[i].hasChildren = true;
                        data[i].expan = false;
                    } else {
                        temp = self.fnGetTree2(data, data[i].orgId);
                        if (temp.length > 0) {
                            data[i].children = temp;
                        }
                    }
                    }
                }
                return result;
            },
            load2(tree, treeNode, resolve) {
                request({
                    url: '/app-api/engineer/engineerSupplyMarketingBalanceList',
                    method: 'get',
                    params: {
                        orgId: tree.orgId,
                        isOverSupply: '开工',
                        root: 0
                    }
                }).then(({data}) => {
                    if (data && data.code === 0) {
                        let _list = data.list || data.data;
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
            checkTab1(tab1){
                this.tab1 = tab1;
                this.getTableList1();
            },
            checkTab2(tab2){
                this.tab2 = tab2;
                // this.getTableList2();
            },
            getMore(pageType){
                this.$router.push({
                    path: '/report/engineer/more',
                    query: {token: getUrlParam('token'), orgId: this.orgId, orgType: this.orgType, tab: pageType == 1 ? this.tab1 : this.tab2,pageType}
                });
            },
            // 项目层级获取供销平衡/开销平衡
            getTableTreeList(type){
                request({
                    url: `/app-api/engineer/engineerSupplyMarketingBalanceByProject`,
                    method: 'get',
                    params: {
                        orgId: this.orgId,
                        type: type  // 供应:overSupply; 开工:overExpenses
                    }
                }).then(({data}) => {
                    if (data.code === 0 && data.data) {
                        if (type=='overSupply') {
                            this.tableTreeList1 = data.data
                        } else {
                            this.tableTreeList2 = data.data
                        }

                    }
                });
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
