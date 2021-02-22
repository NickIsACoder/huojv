<template>
	<div class="detail-panel">
        <!-- <p style="font-size:12px">{{orgId}}</p> -->
        <div class="main-content width100">
            <div class="data-content-panel" style="padding-bottom: 0;">
                <div class="data-title1 max mb-15 mt-15">总包暂转固完成情况</div>
                <!-- 组织架构为二级集团以上 -->
                <div class="mb-30 mt-20" v-show="orgType < 5">
                    <el-table stripe
                              class="main-theme-table huo-list-table huojv-data-list2 rowspanTable"
                              ref="tableRef"
                              size="mini" highlight-current-row
                              row-key="orgId"
                              :data="tableList"
                              :expand-row-keys="expandNodes"
                              :indent="10" lazy
                              border
                              :load="load"
                              :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                    >>
                        <el-table-column prop="orgName" label="组织架构" class-name="bdr" fixed width="90">
                            <template slot-scope="scope">
                                <span v-if="scope.row.orgType == 6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,scope.row.orgType)">{{scope.row.orgName}}</span>
                                <span v-else>{{scope.row.orgName}}</span>
                             </template>
                        </el-table-column>
                        <el-table-column property="onDoneRate" align="center" label="份数按时完成率" width="80">
                            <template slot-scope="scope">
                                <span v-show="scope.row.onDoneRate" v-text="scope.row.onDoneRate + '%'"></span>
                            </template>
                        </el-table-column>
                        <el-table-column property="onAmountDoneRate" align="center" label="金额完成率" width="80">
                            <template slot-scope="scope">
                                <span v-show="scope.row.onAmountDoneRate" v-text="scope.row.onAmountDoneRate + '%'"></span>
                            </template>
                        </el-table-column>
                        <el-table-column property="bldArea" label="建筑面积(万㎡)" align="center" width="100"></el-table-column>
                        <el-table-column property="contractAmount" label="合同总金额(亿)" align="center" width="100"></el-table-column>
                        <el-table-column property="transAmount" label="已暂转固总金额(亿)" align="center" width="80"></el-table-column>
                        <el-table-column property="onAuditCount" label="按期审核中(份)" align="center" width="100"></el-table-column>
                        <el-table-column property="overAuditCount" label="逾期审核中(份)" align="center" width="100"></el-table-column>
                        <el-table-column property="onDoneCount" align="center" label="按期完成(份)" width="100"></el-table-column>
                        <el-table-column property="overDoneCount" align="center" label="逾期完成(份)" width="100"></el-table-column>
                        <el-table-column property="lookDetail" align="center" label="" width="80">
                            <template slot-scope="scope">
                                <a href="javascript:;" class="table-detail-link" @click="getCostEffectiveDtail(scope.row.orgId)">查看详情</a>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- todo: 2020-7-25 14:35 原来需要查看更多按钮,后来表示要去掉   -->
<!--                    <div class="toggleBox pb-20" v-if="tableData.length>10">-->
<!--                        <span class="more" v-if="tableActiveData.length==10" @click="tableActiveData = tableData">查看更多 <i class="el-icon-arrow-right"></i></span>-->
<!--                        <span class="more up" v-if="tableActiveData.length>10" @click="tableActiveData = tableData.slice(0,10)">收起 <i class="el-icon-arrow-up"></i></span>-->
<!--                    </div>-->
                </div>

                <!-- 组织架构为区域公司以及项目时 -->
                <div class="mb-30 mt-20" v-show="orgType >= 5">
                    <div class="text-center mb-15">
                        <ul class="huojv-tab-bars_1 two-cols max" style="margin-bottom: 0;">
                            <li @click="checkTab1(1)" v-eventlisten="{isChangePage:false,pageEvent:'点击非商业综合体项目'}"
                                :class="[tab1 == 1 ? 'active' : '']">非商业综合体项目
                            </li>
                            <li @click="checkTab1(2)" v-eventlisten="{isChangePage:false,pageEvent:'点击商业综合体项目'}"
                                :class="[tab1 == 2 ? 'active' : '']">商业综合体项目
                            </li>
                        </ul>
                    </div>
                    <el-table
                            stripe
                            class="huo-list-table main-theme-table huojv-data-list2 rowspanTable"
                            ref="singleTable1" size="mini"
                            :data="tableData1"
                    >
                        <el-table-column prop="orgName" label="组织" width="100" align="left">
                            <template slot-scope="scope">
                                <span v-if="scope.row.orgType == 6" @click="jumpToPj(orgType,scope.row.orgId, scope.row.orgType)" :class="orgType==6?'':'jumpTxt'">{{scope.row.orgName}}</span>
								<span v-else>{{ scope.row.orgName }}</span>
                             </template>
                        </el-table-column>
                        <el-table-column prop="contractName" label="合同名称" width="100" align="center" ></el-table-column>
                        <el-table-column prop="turnkeyUnit" label="总包单位" width="100" align="center" ></el-table-column>
	                    <el-table-column prop="bldArea" label="建筑面积(万㎡)" align="center" width="100"></el-table-column>
	                    <el-table-column prop="contractAmount" label="合同总金额(亿)" align="center" width="100"></el-table-column>
	                    <el-table-column prop="transAmount" label="已暂转固金额(亿)" align="center" width="80"></el-table-column>
                        <el-table-column prop="drawingTime" label="出图时间" width="100" align="center" ></el-table-column>
                        <el-table-column prop="planDoneTime" label="计划完成时间" width="100" align="center" ></el-table-column>
                        <el-table-column prop="actualDoneTime" label="实际完成时间" width="100" align="center" ></el-table-column>
                        <el-table-column prop="timeConsuming" label="耗时(天)" width="80" align="center" ></el-table-column>
                        <el-table-column prop="adUserName" label="成本负责人" width="80" align="center" ></el-table-column>
                        <el-table-column prop="remark" label="备注" width="80" align="center" ></el-table-column>
                    </el-table>
                    <div class="toggleBox pb-20" v-if="finishDetailTotal > 10">
                        <span class="more" @click="getCostEffectiveDtail(orgId)">查看更多 <i class="el-icon-arrow-right"></i></span>
                    </div>
                </div>
                <div class="menuTagBox mb-15 mt-15">
                    <div class="data-title1"><label>合同、签证及设计变更情况</label></div>
<!--                    <span class="menuTagItem">合同、签证及设计变更情况</span>-->
                </div>
                <ul class="data-info-list" style="border-bottom: 0;">
                    <li :class="showPopover?'huojv-poppver-parent active':'huojv-poppver-parent'" @click="showPopover = !showPopover">
                        <div class="data-type">合同签约总金额</div>
                        <div class="data-box mt-10">
                            <label class="value" v-text="costDetail.contractAmount || 0"></label>
                            <label class="unit">亿元</label>
                        </div>
                        <div class="huojv-poppver">
                            <span>不包含土地合同。</span>
                        </div>
                    </li>
                    <li>
                        <div class="data-type">合同最新造价</div>
                        <div class="data-box mt-10">
                            <label class="value" v-text="costDetail.newCostAmount || 0"></label>
                            <label class="unit">亿元</label>
                        </div>
                    </li>
                    <li>
                        <div class="data-type">合同变动率</div>
                        <div class="data-box mt-10">
                            <label class="value" v-text="costDetail.contractChangeRate || 0"></label>
                            <label class="unit">%</label>
                        </div>
                    </li>
                </ul>
                <ul class="data-info-list mt-15" style="border-bottom: 0;">
                    <li>
                        <div class="data-type">本年合同签约金额</div>
                        <div class="data-box mt-10">
                            <label class="value" v-text="costDetail.yearContractAmount || 0"></label>
                            <label class="unit">亿元</label>
                        </div>
                    </li>
                    <li>
                        <div class="data-type">变更金额</div>
                        <div class="data-box mt-10">
                            <label class="value" v-text="costDetail.changeAmount || 0"></label>
                            <label class="unit">亿元</label>
                        </div>
                    </li>
                    <li>
                        <div class="data-type">变更率</div>
                        <div class="data-box mt-10">
                            <label class="value" v-text="costDetail.changeRate || 0"></label>
                            <label class="unit">%</label>
                        </div>
                    </li>
                </ul>
                <ul class="data-info-list mt-15" style="border-bottom: 0">
                    <li>
                        <div class="data-type">签证金额</div>
                        <div class="data-box mt-10">
                            <label class="value" v-text="costDetail.visaAmount || 0"></label>
                            <label class="unit">亿元</label>
                        </div>
                    </li>
                    <li>
                        <div class="data-type">签证率</div>
                        <div class="data-box mt-10">
                            <label class="value" v-text="costDetail.visaRate || 0"></label>
                            <label class="unit">%</label>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="data-content-panel">
                <div class="huojv-chart-box2">
                    <div ref="pie1" class="huojv-chart-box-item"></div>
                    <div class="huojv-chart-box-item" ref="pie2"></div>
                </div>
            </div>
        </div>
	</div>
</template>

<script>
    import scrollFixed from '@/mixin/scroll-fixed';
    import { NavBar,PullRefresh } from 'vant';
    import request from '@/utils/request';
    import echarts from 'echarts';
    import $ from 'jquery';
    import {handleNum2String, handleDate, getUrlParam, jumpToPj} from '@/utils/common';

    export default {
        mixins: [scrollFixed],
        data() {
            return {
                orgId: '',
                orgType: '',
                costDetail: {},
                showPopover: false,
                pieOption: {
                    title: {
                        text: '',
                        show: true,
                        textStyle: {
                            fontWeight: 500,
                            fontSize: 16,
                            color: '#333333'
                        },
                        x: 'center',
                        y: 'top'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a}{b}{c}%",
                        textStyle: {
                            fontSize: 12,
                            fontWeight: 0
                        },
                    },
                    grid: {
                        top: '0%',
                        left: '0%',
                        right: '0%',
                        bottom: '0%',
                        containLabel: false
                    },
                    legend: {
                        type: 'plain',
                        icon: 'circle',
                        x: "center",
                        y: "bottom",
                        itemWidth: 10,
                        itemHeight: 8,
                        itemGap: 5,
                        textStyle: {
                            color: '#999999',
                            fontSize: 11,
                            fontWeight: 0
                        },
                        data: []
                    },
                    series: []
                },
                detailData:{},
                hei: 300,
                leval: 0,
                tableList: [],
                expandNodes: [],
                tableData1:[],
                tab1:1,
                finishDetailTotal: 0
            };
        },
        watch: {
            '$store.state.orgId': function (newVal, oldVal) {
                this.init();
            }
        },
        mounted() {
            this.init()
        },
        methods: {
            jumpToPj,
            init(){
                this.orgId = getUrlParam('chooseOrgId') || getUrlParam('orgId') || getLocalStorage('orgId').orgId;
                this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType;
                this.getCostEffectiveList()
                this.getPieData('pie1',0,'变更原因分类')
                this.getPieData('pie2',1,'签证原因分类')

                // if(this.orgType < 5){
                    this.getDetail()
                // }else{
                    this.getDetailList()
                // }

                this.$nextTick(() => {
                    $('.el-table__header-wrapper').scroll(function () {
                        let scrollLeft = $(this).scrollLeft();
                        $(this).next().scrollLeft(scrollLeft);
                    });

                    $(".el-table__fixed-body-wrapper").scroll(function () {
                        let scrollTop = $(this).scrollTop();
                        $(this).parent().prev().scrollTop(scrollTop);
                    });
                })
            },
            checkTab1(tab1){
                this.tab1 = tab1;
                this.getDetailList();
            },

            // 获取详情明细  区域公司层级
            getDetailList(){
                request({
                    url: `/app-api/costContract/costEffectiveDetialList`,
                    method: 'get',
                    params:{
                        orgId:this.orgId,
                        size: 10,
                        current: 1,
                        isBusiness: this.tab1 == 1 ? 0 : 1
                    }
                }).then(({data}) => {
                    if(data.code === 0 && data.data){
                        let list = data.data.records || [];
                        this.tableData1 = list;
                        this.finishDetailTotal = data.data.total;
                    }
                })
            },

            // 非商业综合体项目 商业综合体项目
	        getCostEffectiveList(){
                request({
                    url: `/app-api/costContract/costEffectiveList?orgId=${this.orgId}&root=1`,
                    method: 'get',
                    params: {}
                }).then(({data}) => {
                    if(data.code === 0 && data.data){
                        let _list = data.data;
                        let _parentOrgId = '',
                                _expandNodes = [];

                        let rootNode = {};
                        for (let i = 0, len = _list.length; i < len; i++) {
                            // 如果为根节点
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
                });
	        },

            // 通过递归算法重组数据
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
                let _url = `/app-api/costContract/costEffectiveList?orgId=${tree.orgId}&root=0`;

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

            // 跳转到详情页面
            getCostEffectiveDtail(orgId){
                this.$router.push({path:'/report/costContract/finishDetail', query: {orgId, token: getUrlParam('token')}});
            },

            // 合同管理详情 POST
            getDetail(){
                this.costDetail = {}
                request({
                    url: `/app-api/costContract/contract/details?orgId=${this.orgId}`,
                    method: 'post',
                    data: {}
                }).then(res => {
                    if (res.data.list&&res.data.list.length>0) {
                        this.costDetail = res.data.list[0]
                    }
                    console.log(res)
                });
            },

            // 获取饼图数据
            getPieData(el,type,title) {
                console.log(title)
                let y = this.changeDateByVersion().year,
                    m = this.changeDateByVersion().month,
                    d = this.changeDateByVersion().day
                let date = y+'-'+m.toString().padStart(2,'0')+'-'+d
                request({
                    url: `/app-api/costContract/contract/detail/pie?orgId=${this.orgId}&type=${type}&date=${date}`,
                    method: 'post',
                    data: {}
                }).then(res => {
                    console.log(title+'完成')
                    let pieData = [];
                    for (let i = 0; i < res.data.list.length; i++) {
                        pieData.push({
                            name: (res.data.list[i].changeReasonCategory.length>5?res.data.list[i].changeReasonCategory.substring(0,5)+'...':res.data.list[i].changeReasonCategory) + ' ',
                            value: parseFloat(res.data.list[i].achievementRate)
                        });
                    }
                    // 如果没有数据  饼图显示 “暂无数据”
                    if (!pieData.length) {
                        pieData = [{name: '暂无数据', value: 0}];
                    }
                    let legendData = pieData.map(item => {
                        return item.name;
                    });

                    let series = [
                        {
                            name: '',
                            type: 'pie',
                            radius: '45%',
                            center: ['50%', '50%'],
                            color: [ '#FFC900','#B7D8B4', '#A7CBC1', '#3BA1D2', '#31ADB9', '#0B8348', '#B4A36B','#D19535'],
                            avoidLabelOverlap: true,
                            label: {
                                normal: {
                                    formatter: '{b}{d}%',
                                    textStyle: {
                                        fontSize: '10',
                                        color: '#666666'
                                    }
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '10',
                                        color: '#666666'
                                    }
                                }
                            },
                             itemStyle:{
                                borderWidth:1, //设置border的宽度有多大
                                borderColor:'#fff',
                            },
                            labelLine: {
                                normal: {
                                    smooth: 0.2,
                                    length: 3,
                                }
                            },
                            data: pieData
                        }
                    ];

                    let option = this.getOption(series, legendData, title);
                    let pie = new echarts.init(this.$refs[el]);
                    if (pieData.length>12) {
                        series[0].radius = '40%'
                        series[0].center = ['50%','45%']
                        pie.resize({height:380});
                    }

                    pie.setOption(option, true);
                });
            },

            // 获取 图表option
            getOption(series, legendData, title) {
                let option = JSON.parse(JSON.stringify(this.pieOption));
                option.series = series;
                option.legend.data = legendData;
                option.title.text = title;

                return option;
            },
        },
    };
</script>

<style lang="scss" scoped>
.menuTagItem{
    color: white;
    font-size: 12px;
    padding: 7px 20px;
    text-align: center;
    border-radius: 3px;
    background: #209B5C;
    margin: 0;
    box-sizing:border-box;
}
.data-info-list{
    padding-bottom: 10px;
}
.setheight{
    height: 480px;
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
