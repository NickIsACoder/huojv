<template>
	<div class="detail-panel">
        <div class="main-content width100">
            <div class="data-content-panel">
                <div class="mb-30 mt-10">
                    <div class="text-center font-14 mb-15">定标结果分析</div>
                    <el-table stripe
				          class="main-theme-table huo-list-table"
				          ref="tableRef1"
				          size="mini" highlight-current-row
				          row-key="orgId"
				          height="300"
				          :data="tableList1"
				          :expand-row-keys="expandNodes1"
				          :indent="10" lazy
				          border
				          :load="load"
				          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                    >
                        <el-table-column label="组织" fixed width="90" align="left">
                            <template slot-scope="scope">
                                <span v-if="scope.row.orgType == 6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,scope.row.orgType)">{{scope.row.orgName}}</span>
                                <span v-else>{{ scope.row.orgName }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="calibrationCount" label="定标数(份)" width="80" align="center"></el-table-column>
                        <el-table-column prop="simpleCount" label="简易招标(份)" width="80" align="center"></el-table-column>
                        <el-table-column prop="invitationCount" label="邀请招标(份)" width="80" align="center"></el-table-column>
                        <el-table-column prop="entrustmentCount" label="直接委托(份)" width="80" align="center"></el-table-column>
                        <el-table-column prop="unusualCount" label="招标异常项(份)" width="80" align="center"></el-table-column>
                        <el-table-column prop="unplannedRate" label="异常项目详情" width="80" align="center">
                            <template slot-scope="scope">
                                <a href="javascript:;" class="table-detail-link" @click="getDetail(scope.row.orgId,scope.row.orgName,1)">查看详情</a>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="mb-30">
                    <div class="huojv-chart-box2">
                        <div ref="pie1" class="huojv-chart-box-item"></div>
                        <div ref="pie2" class="huojv-chart-box-item"></div>
                        <!-- <div ref="pie1" v-if="orgType<=2" class="huojv-chart-box-item"></div>
                        <div ref="pie2" v-if="orgType<=2" class="huojv-chart-box-item"></div>
                        <div ref="pie3" v-if="orgType>2" class="huojv-chart-box-item"></div> -->
                    </div>
                </div>
                <div class="mb-30">
                    <div class="text-center font-14 mb-15">月度招标采购执行分析</div>
                    <el-table stripe
				          class="main-theme-table huo-list-table"
				          ref="tableRef2"
				          size="mini" highlight-current-row
				          row-key="orgId"
				          height="300"
				          :data="tableList2"
				          :expand-row-keys="expandNodes2"
				          :indent="10" lazy
				          border
				          :load="load"
				          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                    >
                        <el-table-column label="组织" fixed width="90" align="left">
                            <template slot-scope="scope">
                                <span v-if="scope.row.orgType == 6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,scope.row.orgType)">{{scope.row.orgName}}</span>
                                <span v-else>{{ scope.row.orgName }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="lastCalibrationCount" label="定标份数(份)" width="80" align="center"></el-table-column>
                        <el-table-column label="计划内" align="center">
                            <el-table-column prop="onCalibrationCount" label="按期定标份数" width="90" align="center"></el-table-column>
                            <el-table-column prop="overCalibrationCount" label="逾期定标份数" width="90" align="center"></el-table-column>
                            <el-table-column prop="unDoneCalibrationCount" label="未完成份数" width="90" align="center"></el-table-column>
                        </el-table-column>
                        <el-table-column prop="unPlanCount" label="计划外份数" width="80" align="center"></el-table-column>
                        <el-table-column prop="onCalibrationRate" label="按时完成率(%)" width="80" align="center">
                            <template slot-scope="scope">
                                {{scope.row.onCalibrationRate}}%
                            </template>
                        </el-table-column>
                        <el-table-column prop="avgCalibrationTime" label="平均定标周期(天)" width="80" align="center"></el-table-column>
                        <el-table-column prop="unplannedRate" label="操作" width="80" align="center">
                            <template slot-scope="scope">
                                <a href="javascript:;" class="table-detail-link" @click="getDetail(scope.row.orgId,scope.row.orgName,2)">查看详情</a>
                            </template>
                        </el-table-column>
                    </el-table>
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
                pieOption: {
                    title: {
                        text: '',
                        show: true,
                        textStyle: {
                            fontWeight: 500,
                            fontSize: 14,
                            color: '#333333'
                        },
                        x: 'center',
                        y: '10%'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a}{b}{c}",
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
                
                level: [0, 0], 
                tableList1: [],
                expandNodes1: [],
                tableList2: [],
                expandNodes2: [],
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

                if(sessionStorage.getItem('actTab')==3){
                    sessionStorage.removeItem('actTab')
                    sessionStorage.removeItem('orgName')
                    this.actTab = 3
                }


                this.getTableData(1, 'tableRef1')   // 定标结果分析表格
                this.getTableData(2, 'tableRef2')   // 月度招标采购执行分析
                this.getPieData()                   // 招标方式占比

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
            // 获取资源结构明细表格数据
            getTableData(type,el) {
                this.orgId = getUrlParam('chooseOrgId') || getUrlParam('orgId') || getLocalStorage('orgId').orgId;
                if (!this.orgId) return;
                console.log(...arguments)

                this.level[type-1] = 0;
                // let _url = ''
                // if (type==1) {
                //     _url = `/app-api/costContract/tendering/tree?orgId=${this.orgId}&root=1`;
                // } else if(type==2){
                //     _url = `/app-api/costContract/tendering/tree?orgId=${this.orgId}&root=1`;
                // }
                
                request({
                    url: `/app-api/costContract/tendering/tree?orgId=${this.orgId}&root=1`,
                    method: 'post'
                }).then(({data}) => {
                    if (data.code === 0) {
                        let _list = data.data;
                        let _parentOrgId = '',
                            _expandNodes = [];

                        let rootNode = {};
                        for (let i = 0, len = _list.length; i < len; i++) {
                            if (_list[i]['root'] == true) {
                                rootNode = _list[i];
                                _parentOrgId = _list[i]['parentOrgId'];
                                _expandNodes.push(_list[i]['orgId'])

                                // 把根节点排在第一个
                                _list.splice(i, 1);
                                _list.unshift(rootNode);
                                break;
                            }
                        }

                        let tree = this.fnGetTree(_list, _parentOrgId,type);
                        if (type==1) {
                            this.expandNodes1 = _expandNodes;
                            this.tableList1 = tree;
                        } else if(type==2){
                            this.expandNodes2 = _expandNodes;
                            this.tableList2 = tree;
                        }
                        

                        // 重新渲染表格 防止表格错位
                        this.$nextTick(() => {
                            if (this.$refs[el]) {
                                this.$refs[el].doLayout()
                            }
                        })
                    }
                }).catch((e) => {
                    console.log('getBoardData-err', e);
                });
            },
            fnGetTree(data, parentOrgId,type) {
                this.level[type-1] ++
                
                let self = this;
                var result = [], temp;
                for (let i in data) {
                    if (data[i].parentOrgId == parentOrgId) {
                        result.push(data[i]);

                        // 初始数据只返回了两级   给第三级添加模拟子节点
                        if (this.level[type-1] >= 2 && !data[i].leaf) {
                            data[i].hasChildren = true;
                            data[i].expan = false;
                        } else {
                            temp = self.fnGetTree(data, data[i].orgId, type);
                            if (temp.length > 0) {
                                data[i].children = temp;
                            }
                        }
                    }
                }
                return result;
            },
            load(tree, treeNode, resolve) {
                let _url = `/app-api/costContract/tendering/tree?orgId=${tree.orgId}&root=0`;

                request({
                    url: _url,
                    method: 'post'
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
            // 获取饼图数据、渲染饼图
            getPieData(el,title) {
                request({
                    url: `/app-api/costContract/tendering/pie?orgId=${this.orgId}&orgType=${this.orgType}`,
                    method: 'post',
                    data: {}
                }).then(res => {

                    function handleData(_data){
                        if (!_data.length) {
                            return [{name: '暂无数据', value: 0}]
                        }
                        _data = _data.map( item => {
                            return {
                                name: item.tenderingType+ ' ',
                                value: item.value
                            }
                        })
                        return _data
                    }

                    // if (this.orgType<=2) {
                        let dcData = handleData(res.data.data.countPie),
                            syData = handleData(res.data.data.amountPie)
                        // this.setPie('pie1', dcData, '地产集团招标方式占比')
                        // this.setPie('pie2', syData, '商业集团招标方式占比')
                        this.setPie('pie1', dcData, '招标方式占比-按份数')
                        this.setPie('pie2', syData, '招标方式占比-按金额')
                    // } else {
                    //     let pieData = handleData(res.data.data.otherPie)
                    //     this.setPie('pie3', pieData, '招标方式占比')
                    // }
                });
            },
            setPie(el, pieData, title){
                let legendData = pieData.map(item => {
                    return item.name;
                });

                let series = [
                    {
                        name: '',
                        type: 'pie',
                        radius: '45%',
                        center: ['50%', '58%'],
                        color: [ '#B4A36B','#209B5C', '#4995E3'],
                        avoidLabelOverlap: true,
                        label: {
                            normal: {
                                formatter: '{b}{d}%',
                                // formatter: function(param){
                                //     return param.data.name+/n+ param.data.value+'万'
                                // },
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
                let unit = el=='pie1'?'份':'万'
                option.tooltip.formatter = '{a}{b}{c}'+ unit
                let pie = new echarts.init(this.$refs[el]);
                if (pieData.length>12) {
                    series[0].radius = '40%'
                    series[0].center = ['50%','45%']
                    pie.resize({height:380});
                }

                pie.setOption(option, true);
            },
            getOption(series, legendData, title) {
                let option = JSON.parse(JSON.stringify(this.pieOption));
                option.series = series;
                option.legend.data = legendData;
                option.title.text = title;

                return option;
            },
            // 获取月份数据
			getMonths(el,title) {
				request({
					url: `/app-api/costContract/tendering/months?orgId=${this.orgId}`,
					method: 'post',
				}).then(res => {
                    this.columns = res.data.data
                    
					this.selectedDate = this.columns[0]
				});
			},
            // 查看详情
            getDetail(orgId,orgName,type){
                sessionStorage.setItem('actTab0', 3)
                sessionStorage.setItem('orgName',orgName)
                this.$router.push({
                    path:'/costContract/procurementDetail',
                    query: {
                        orgId,
                        token: getUrlParam('token'),
                        type
                    }
                });
            },
        },
    };
</script>

<style lang="scss" scoped>
.font-14{
    font-size: 14px;
    font-weight: 500;
}
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
    color: #4995E3;
}
</style>
