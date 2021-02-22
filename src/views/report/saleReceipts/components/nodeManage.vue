<template>
	<div class="report-index">
        <div class="main-content" style="width: 100%;">
            <div class="data-content-panel no-top-left-radius">
                <p class="boxTitle">一、已取证未售库存分析<span class="fR">(单位：{{unit}})</span></p>
                <el-table v-loading="tableLoad1" stripe class="huo-list-table main-theme-table huojv-data-list2" ref="singleTable" size="mini" :data="tableData" :empty-text="emptyTxt">
                    <el-table-column property="productType" align="center" label="业态"></el-table-column>
                    <el-table-column property="stockAmount" align="center" label="合计"></el-table-column>
                    <el-table-column property="stockAgeOneAmount" align="center" label="库龄1年内"></el-table-column>
                    <el-table-column property="stockAgeTwoAmount" align="center" label="库龄1-2年"></el-table-column>
                    <el-table-column property="stockAgeThreeAmount" align="center" label="库龄2-3年"></el-table-column>
                    <el-table-column property="stockAgeFourAmount" align="center" label="库龄大于3年"></el-table-column>
                </el-table>

                <!-- 已取证未售业态货值占比饼图 -->
                <div class="huojv-chart-box">
                    <div class="huojv-chart-box-item" ref="pie"></div>
                    <div v-if="orgType < 6" :class="(orgType==1 || orgType==2)?'huojv-chart-box-item':'huojv-chart-box-item mt-30'" ref="bar"></div>
                    <!-- <div v-if="showBar2" class="huojv-chart-box-item mt-30" ref="bar2"></div> -->
                    <div v-if="orgType==3 || orgType==4" class="huojv-chart-box-item mt-30" ref="bar2"></div>
                </div>

                <!-- 即将开放示范区节点 -->
                <p class="boxTitle2 mt-15" v-if="actTab1==1">二、即将开放示范区节点（最近6个月）</p>
                <p class="boxTitle2 mt-15" v-else>二、已延期的示范区节点</p>
                <div class="text-center mb-15">
					<ul class="huojv-tab-bars_1 two-cols" style="margin-bottom: 0;">
						<li @click="getDemonstrationArea(1)" v-eventlisten="{isChangePage:false,pageEvent:'点击即将开放示范区节点即将开放'}"
						    :class="[actTab1 == 1 ? 'active' : '']"><label>即将开放</label></li>
						<li @click="getDemonstrationArea(2)" v-eventlisten="{isChangePage:false,pageEvent:'点击即将开放示范区节点节点延期'}"
						    :class="[actTab1 == 2 ? 'active' : '']"><label>节点延期</label></li>
					</ul>
				</div>
                <div class="tableBox">
                    <el-table v-loading="tableLoad2"
                       stripe
                        class="huo-list-table main-theme-table huojv-data-list2 rowspanTable"
                        ref="singleTable1" size="mini"
                        :empty-text="emptyTxt"
                        :data="tableActiveData1"
                        >
                        <!-- :span-method="objectSpanMethod1" -->
                        <el-table-column property="areaBuName" label="区域" align="center" class-name="bdr"></el-table-column>
                        <el-table-column property="projectName" label="项目" align="center" width="120">
                            <template slot-scope="scope">
                                <span :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.projectGUID,6)">{{scope.row.projectName}}</span>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column property="projectName" label="分期名称" align="center" width="120"></el-table-column> -->
                        <el-table-column property="finishTime" label="计划开放时间" align="center" width="110">
                            <template slot-scope="scope">
                                {{scope.row.finishTime.split(' ')[0]}}
                            </template>
                        </el-table-column>
                        <el-table-column property="splusDay" align="center" label="即将开放"></el-table-column>
                        <el-table-column property="dutyUserName" align="center" label="负责人"></el-table-column>
                    </el-table>
                    <div class="toggleBox" v-if="tableData1.length>3">
                        <span class="more" v-if="tableActiveData1.length==3" @click="tableActiveData1 = tableData1">查看更多 <i class="el-icon-arrow-right"></i></span>
                        <span class="more up" v-if="tableActiveData1.length>3" @click="tableActiveData1 = tableData1.slice(0,3)">收起 <i class="el-icon-arrow-up"></i></span>
                    </div>
                </div>

                <!-- 即将取证节点模块 -->
                <p class="boxTitle2" v-if="actTab2==1">三、即将取证节点（最近2个月）</p>
                <p class="boxTitle2" v-else>三、已延期的取证节点</p>
                <div class="text-center mb-15">
					<ul class="huojv-tab-bars_1 two-cols" style="margin-bottom: 0;">
						<li @click="getEvidence(1)" v-eventlisten="{isChangePage:false,pageEvent:'点击即将取证节点即将开放'}"
						    :class="[actTab2 == 1 ? 'active' : '']"><label>即将开放</label></li>
						<li @click="getEvidence(2)" v-eventlisten="{isChangePage:false,pageEvent:'点击即将取证节点节点延期'}"
						    :class="[actTab2 == 2 ? 'active' : '']"><label>节点延期</label></li>
					</ul>
				</div>
                <div class="tableBox">
                    <el-table v-loading="tableLoad3"
                       stripe
                        class="huo-list-table main-theme-table huojv-data-list2 rowspanTable"
                        ref="singleTable2" size="mini"
                        :data="tableActiveData2"
                        :empty-text="emptyTxt"
                        :span-method="objectSpanMethod2"
                        >
                        <el-table-column property="areaBuName" align="center" label="区域" class-name="bdr"></el-table-column>
                        <el-table-column property="projectName" align="center" label="项目" width="120">
                            <template slot-scope="scope">
                                <span :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.projectGUID,6)">{{scope.row.projectName}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column property="taskName" align="center" label="节点名称"  width="150"></el-table-column>
                        <el-table-column property="finishTime" label="计划取证时间" align="center" width="110">
                            <template slot-scope="scope">
                                {{scope.row.finishTime.split(' ')[0]}}
                            </template>
                        </el-table-column>
                        <el-table-column property="splusDay" align="center" label="即将取证"></el-table-column>
                        <el-table-column property="dutyUserName" align="center" label="负责人"></el-table-column>
                    </el-table>
                    <div class="toggleBox" v-if="tableData2.length>3">
                        <span class="more" v-if="tableActiveData2.length<=3" @click="tableActiveData2 = tableData2">查看更多 <i class="el-icon-arrow-right"></i></span>
                        <span class="more up" v-if="tableActiveData2.length>3" @click="tableActiveData2 = tableData2.slice(0,3)">收起 <i class="el-icon-arrow-up"></i></span>
                    </div>
                </div>

                <p class="huojv-bottom-box">
                    <span class="huojv-btn-back" @click="back">返回首页</span>
                </p>
            </div>
        </div>
	</div>
</template>

<script>
    import {mapState} from 'vuex'
    import scrollFixed from '@/mixin/scroll-fixed';
    import {
        List,
        PullRefresh,
        Toast,
        DropdownMenu,
        DropdownItem,
        DatetimePicker,
        Popup,
        ActionSheet,
        Sticky
    } from 'vant';
    import {getLocalStorage} from '@/utils/local-storage';
    import request from '@/utils/request';
    import echarts from 'echarts'
    import $ from 'jquery'
    import {handleNum2String, handleDate, getUrlParam,jumpToPj } from '@/utils/common'


    export default {
        mixins: [scrollFixed],
        data() {
            return {
                tableLoad1: false,
                tableLoad2: false,
                tableLoad3: false,
                actTab1: 0,
                actTab2: 0,
                tableData: [],
                tableData1: [],
                tableActiveData1:[],
                tableData2: [],
                tableActiveData2:[],
                emptyTxt: '暂无数据',
                isLoading: false,
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
                        formatter: "{a}{b}{c}%"
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
                            fontSize: 10,
                            fontWeight: 0
                        },
                        data: []
                    },
                    series: []
                },
                barOption: {
                    tooltip: {
                        trigger: 'axis',
                        // formatter: function(param){
                        //     return param
                        //     debugger
                        // }
                        // formatter: "{b}<br/>{a0}：{c0}"+this.unit+"<br/>{a1}：{c1}"+this.unit+"<br/>{a2}：{c2}"+this.unit+"<br/>{a3}：{c3}"+this.unit+"<br/>合计："
                    },
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
                    legend: {
                        show: true,
                        type: 'plain',
                        icon: 'rect',
                        itemWidth: 10,
                        itemHeight: 10,
                        // orient: 'horizon',
                        x: 'center',
                        y: 'bottom',
                        textStyle: {
                            fontSize: 10,
                            color: '#999999'
                        },
                        data: []  //注：需接口获取
                    },
                    grid: {
                        'left': '9%',
                        'right': '4%',
                        'bottom': '15%',
                        'top': '25%',
                        'containLabel': true
                    },
                    animation: true,
                    toolbox: {
                        show: true,
                        feature: {}
                    },
                    calculable: true,
                    xAxis: {
                        type: 'category',
                        boundaryGap: true,
                        data: [],
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#999999'
                            }
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                fontSize: 10,
                                color: '#666666'
                            }
                        }
                    },
                    yAxis: {
                        type: 'value',
                        name: '',
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#999999'
                            }
                        },
                        max: 40,
                        min: 0,
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#666666',
                            }
                        }
                    },
                    series: [],
                },
	            orgId:this.chooseOrgId,
                spanArr1: [],
                position1: 0,
                spanArr2: [],
                position2: 0,
                showBar1: false,
                showBar2: false,
                orgType: getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType,
                unit: (getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType) <=5 ? '亿':'万'
            }
        },
        props: ["chooseOrgId"],
        // computed: {
        //     orgId: function () {
        //         return this.chooseOrgId // 直接监听props里的chooseOrgId
        //     }
        // },
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
            init(){
                this.orgId = getUrlParam('chooseOrgId') || getUrlParam('orgId') || getLocalStorage('orgId').orgId;
                this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType;
                this.unit = (getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType) <=5 ? '亿':'万'
                this.getUnsoldStock()
                this.getPieData()

                // 项目层级不显示
                if (this.orgType<6) {
                    this.getBarData()
                }
                this.getDemonstrationArea(1)
                this.getEvidence(1)
            },
            // 已取证未售库存分析
            getUnsoldStock() {
                this.tableLoad1 = true
                request({
                    url: `/app-api/saleBack/unsoldStock`,
                    method: 'post',
                    data: {orgId : this.orgId}
                }).then(res => {
                    this.tableLoad1 = false
                    if (res.data.code==0) {
                        this.tableData = res.data.data.map( item =>{
                            if (item.productType.indexOf('占比')!=-1) {
                                for (const _i in item) {
                                    if (!isNaN(item[_i])) {
                                        item[_i] = item[_i]?item[_i]+'%':'0%'
                                    }
                                }
                            }
                            return item
                        })
                    }
                    console.log(this.tableData)
                });
            },
            // 获取图表option
            getOption(series, legendData, title) {
                let option = JSON.parse(JSON.stringify(this.pieOption));
                option.series = series;
                option.legend.data = legendData;
                option.title.text = title;

                return option;
            },
            // 获取饼图数据并绘制饼图
            getPieData() {
                request({
                    url: `/app-api/saleBack/pie`,
                    method: 'post',
                    data: {orgId : this.orgId}
                }).then(res => {
                    console.log(res);
                    let pieData = [];
                    for (let i = 0; i < res.data.data.length; i++) {
                        pieData.push({
                            name: res.data.data[i].productType + ' ',
                            value: parseFloat(res.data.data[i].typePercent)
                        });
                    }
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
                            color: ['#9949E3', '#F97546', '#4995E3', '#D17A44', '#FF9E9D', '#FFC40F', '#209B5C'],
                            avoidLabelOverlap: true,
                            label: {
                                normal: {
                                    formatter: '{b}{d}%',
                                    textStyle: {
                                        fontSize: '11',
                                        color: '#666666'
                                    }
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '11',
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
                                    length: 10,
                                    length2: 20,

                                }
                            },
                            data: pieData
                        }
                    ];
                    let option = this.getOption(series, legendData, '已取证未售业态货值占比');
                    let pie = new echarts.init(this.$refs.pie);
                    pie.setOption(option, true);
                });
            },

            // 获取柱图数据
            getBarData() {
                console.log('bar')
                request({
                    url: `/app-api/saleBack/barChart`,
                    method: 'post',
                    data: {
                        orgId : this.orgId
                        // orgId: 'AA90A163-F782-4B78-4584-08D7E5E57C34'
                    }
                }).then(res => {
                    console.log(res);
                    if (res.data.code==0) {
                        // if (res.data.data.unsoldStockAll&&res.data.data.unsoldStockAll.length>0) {
                            if (this.orgType==1 || this.orgType==2) {
                                this.setBar(res.data.data.unsoldStockAll,'bar')
                            }else{
                                let title = '各区域库存排名';
                                if(this.orgType==5){
                                    title = '各项目库存排名'
                                }
                                this.setBar(res.data.data.unsoldStockAll,'bar', title)
                                // this.showBar1 = true
                            }
                        // }
                        // if (res.data.data.unsoldStockOver2&&this.orgType!=1) {
                        if (this.orgType==3 || this.orgType==4) {
                            this.showBar2 = true
                            this.setBar(res.data.data.unsoldStockOver2,'bar2','库存≥2亿项目排名')
                        }
                    }
                });
            },
            // 柱图，各区域库存排名
            setBar(data,el,title){
                let barData = [];
                let series = []
                let color = ['#0092D8','#006E38','#B4A36B','#FFC900']
                let tool = []
                let legendData = []
                let middle = 0
                let max = 0
                let option = JSON.parse(JSON.stringify(this.barOption));
                if (data&&data.length>0) {

                    for (let j = 0; j < data[0].productTypeStocks.length; j++) {
                        let _data = []
                        for (let i = 0; i < data.length; i++) {
                            _data.push(data[i].productTypeStocks[j].stockAmount)
                            middle = middle + parseFloat(data[i].productTypeStocks[j].stockAmount)
                        }



                        barData.push(_data)
                        tool.push(data[0].productTypeStocks[j].productType)
                        series.push({
                            name: data[0].productTypeStocks[j].productType,
                            type: 'bar',
                            // barWidth: '24',
                            barMaxWidth: '24',
                            stack: 'cost',
                            // barWidth: 8,
                            formatter: '{value} '+this.unit,
                            itemStyle: {
                                normal: {
                                    color: color[j]
                                }
                            },
                            data: _data
                        })
                    }

                    console.log('aaa',middle)
                    // 设置中位线
                    // if (title) {
                        series.push({
                            name: '合计',
                            type: 'line',  // 平均值
                            data: (function() {
                                let sum = []
                                for (let i in barData) {
                                    for (let j in barData[i]) {
                                        if(!sum[j]){
                                            sum[j] = 0
                                        }
                                        sum[j] += parseFloat(barData[i][j])
                                    }
                                }
                                let arr = []
                                for (let a = 0; a < sum.length; a++) {
                                    let num = parseFloat(sum[a])
                                    arr.push(num.toFixed(2))
                                    if (max<num) {
                                        max = num
                                    }
                                }
                                return arr
                            })(),
                            itemStyle: {
                                opacity: 0
                            },
                            lineStyle: {
                                opacity: 0
                            },
                            markLine: {
                                symbol: "none",
                                data: [
                                    {
                                        type: 'average',
                                        name: '平均数',
                                        lineStyle: {
                                            width: 1,
                                            color: "#006E38"
                                        },
                                        label: {
                                            fontSize: 11,
                                            lineHeight: 15,
                                            color: '#999999',
                                            position: 'insideEndTop',
                                            formatter: '{b}\n{c}'+this.unit
                                        },
                                        yAxis: (middle/data.length).toFixed(2)
                                    },
                                ]
                            }
                        })
                    // }

                    // 进度条
                    if (data.length>10) {
                        option.dataZoom = [{
                            type: 'inside',
                            show: true,
                            xAxisIndex: [0],
                            left: '9%',
                            bottom: 0,
                            height: 10,
                            start: 0,
                            zoomLock:true,
                            end: 30 //初始化滚动条
                        }]
                    }

                    legendData = data.map(item => {
                        return item.orgName;
                    });
                }

                if (title) {
                    option.xAxis.axisLabel.rotate = 55
                }

                console.log(series)
                if (max>=500) {
                    option.yAxis.max = parseInt(max + 50)
                } else if (500>max&&max>=100) {
                    option.yAxis.max = parseInt(max + 10)
                } else if (max<100) {
                    option.yAxis.max = max<=0?0:parseInt(max + 3)
                }


                let that = this
                option.series = series;
                option.legend.data = tool;
                // option.tooltip.formatter = function(param){
                //     console.log(param)
                //     let str = ''
                //     for (let i = 0; i < param.length; i++) {
                //         str += param[i].seriesName+'：'+param[i].value + that.unit+'<br>'
                //     }
                //     return param[0].name+'<br>'+str
                // }
                option.yAxis.name = '单位：'+this.unit;
                if (legendData) {
                    option.xAxis.data = legendData
                }
                option.title.text = title ? title : ''
                let myChart = new echarts.init(this.$refs[el]);
                myChart.setOption(option, true);
            },

            // 根据返回数据动态合并行
            rowspan1() {
                this.tableData1.forEach((item,index) => {
                    if( index === 0){
                        this.spanArr1.push(1);
                        this.position1 = 0;
                    }else{
                        if(this.tableData1[index].areaBuName === this.tableData1[index-1].areaBuName ){
                            this.spanArr1[this.position1] += 1;
                            this.spanArr1.push(0);
                        }else{
                            this.spanArr1.push(1);
                            this.position1 = index;
                        }
                    }
                })
            },

            // 合并表头
            objectSpanMethod1({ row, column, rowIndex, columnIndex }) {
                if (columnIndex === 0) {
                    const _row = this.spanArr1[rowIndex];
                    const _col = _row>0 ? 1 : 0;
                    return {
                        rowspan: _row,
                        colspan: _col
                    }
                }
            },
            // 即将开放 / 延迟节点
            getDemonstrationArea(type) {
                // if (this.actTab1 == type) {
                //     return false
                // }
                this.tableLoad2 = true
                let params = {
                    orgId : this.orgId
                }
                if (type==1) {
                    params.status = 'open'
                }else{
                    params.status = 'delay'
                }
                this.actTab1 = type
                this.spanArr1 = []
                request({
                    url: `/app-api/saleBack/demonstrationArea`,
                    method: 'post',
                    data: params
                }).then(res => {
                    this.tableLoad2 = false
                    this.tableData1 = res.data.data
                    this.tableActiveData1 = this.tableData1.slice(0,3)
                    this.rowspan1()
                    console.log(this.tableActiveData1);
                });
            },

            // 根据返回数据动态合并行
            rowspan2() {
                this.tableData2.forEach((item,index) => {
                    if( index === 0){
                        this.spanArr2.push(1);
                        this.position2 = 0;
                    }else{
                        if(this.tableData2[index].areaBuName === this.tableData2[index-1].areaBuName ){
                            this.spanArr2[this.position2] += 1;
                            this.spanArr2.push(0);
                        }else{
                            this.spanArr2.push(1);
                            this.position2 = index;
                        }
                    }
                })
            },
            // 合并表头
            objectSpanMethod2({ row, column, rowIndex, columnIndex }) {
                if (columnIndex === 0) {
                    const _row = this.spanArr2[rowIndex];
                    const _col = _row>0 ? 1 : 0;
                    return {
                        rowspan: _row,
                        colspan: _col
                    }
                }
            },
            // 即将开放 / 延迟节点
            getEvidence(type) {
                // if (this.actTab2 == type) {
                //     return false
                // }
                this.tableLoad3 = true
                let params = {
                    orgId : this.orgId
                }
                if (type==1) {
                    params.status = 'open'
                }else{
                    params.status = 'delay'
                }
                this.actTab2 = type
                this.spanArr2 = []
                request({
                    url: `/app-api/saleBack/getEvidence`,
                    method: 'post',
                    data: params
                }).then(res => {
                    this.tableLoad3 = false
                    this.tableData2 = res.data.data
                    this.tableActiveData2 = this.tableData2.slice(0,3)
                    this.rowspan2()
                    console.log(this.tableActiveData2);
                });
            },

            // 点击返回按钮
            back(){
                sessionStorage.removeItem('saleReceiptPage'); // 返回首页之后清空页面状态
                // this.goPage('/report/saleReceipts');
                // window.history.go(-1);
	            this.$emit('changePage',0);
            },

            goPage(path){
                var search = decodeURIComponent(window.location.search);
                if(!search){
                    search = '?' + decodeURIComponent(window.location.href.split('?')[1]);
                }

                window.location = `#${path + search}`
            },
        },
        components: {
            [List.name]: List,
            [PullRefresh.name]: PullRefresh,
            [DropdownMenu.name]: DropdownMenu,
            [DropdownItem.name]: DropdownItem,
            [DatetimePicker.name]: DatetimePicker,
            [Popup.name]: Popup,
            [ActionSheet.name]: ActionSheet,
            [Sticky.name]: Sticky,
            Toast
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
