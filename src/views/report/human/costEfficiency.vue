<template>
  <div class="container white-bg">
    <div class="huojv-chart-box">
      <div class="chartTitle">行政费用 - 预算数与执行数</div>
      <div class="huojv-chart-box-item" ref="bar1"></div>
    </div>
    <div class="huojv-chart-box">
      <div class="chartTitle">行政费用 - 人均行政费用</div>
      <div class="huojv-chart-box-item" ref="line1"></div>
    </div>
    <div class="huojv-chart-box">
      <div class="chartTitle">办公场地 - 办公场地面积</div>
      <div class="huojv-chart-box-item" ref="bar2"></div>
      <span class="charts_tips">备注：含办公场地面积、食堂租赁面积</span>
    </div>
    <div class="huojv-chart-box">
      <div class="chartTitle">办公场地 - 房屋费用</div>
      <div class="huojv-chart-box-item" ref="bar3"></div>
      <span class="charts_tips">备注：含办公场地费用、食堂租赁费用、车位租赁费用</span>
    </div>
    <div class="huojv-chart-box">
      <div class="chartTitle">车辆情况 - 车辆数</div>
      <div class="huojv-chart-box-item" ref="bar4"></div>
      <span class="charts_tips">备注：不含营销车辆</span>
    </div>
    <div class="huojv-chart-box">
      <div class="chartTitle">车辆情况 - 车辆费用</div>
      <div class="huojv-chart-box-item" ref="bar5"></div>
      <span class="charts_tips">备注：不含营销车辆</span>
    </div>
    <div class="huojv-chart-box">
      <div class="chartTitle">本年度内业务招待费情况 - 预算数与执行数</div>
      <div class="huojv-chart-box-item" ref="bar6"></div>
      <span class="charts_tips">备注：不含营销业务招待费</span>
    </div>
    <div class="huojv-chart-box">
      <div class="chartTitle">本年度内业务招待费情况 - 业务招待费效</div>
      <div class="huojv-chart-box-item" ref="line2"></div>
    </div>
    <div class="huojv-chart-box">
      <div class="chartTitle">本年度内差旅费情况</div>
      <div class="huojv-chart-box-item" ref="bar7"></div>
      <span class="charts_tips">备注：不含营销差旅费</span>
    </div>

    <el-dialog
      :visible.sync="dialogVisible"
      :fullscreen="true"
      :destroy-on-close="true"
      :show-close="false">
      <div slot="title" class="dialogTitleBox">
        <i class="el-icon-arrow-left" @click="dialogVisible = false"></i>
        <span class="dialogTitle">{{title}}</span>
      </div>
      <div class="huojv-chart-box" style="margin-bottom:0">
        <div class="huojv-chart-box-item" ref="barModal"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import scrollFixed from '@/mixin/scroll-fixed';
import echarts from 'echarts';
import { getLocalStorage } from '@/utils/local-storage';
import { getUrlParam } from '@/utils/common';
import { Icon, PullRefresh, Sticky, Tab, Tabs } from 'vant';
import $ from 'jquery';
import request from '@/utils/request';

export default {
  mixins: [scrollFixed],

  data() {
    return {
      orgType: getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType,
      orgId: getUrlParam('chooseOrgId') || getUrlParam('orgId') || getLocalStorage('orgId').orgId,
      maxObj: {},
      dialogVisible: false,
      title: ''
    };
  },
  // filter
  filters: {},
  computed: {},
  watch: {
    '$store.state.orgId': function (newVal, oldVal) {
      this.init();
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    reloadWindow() {
      setTimeout(() => {
        window.location.reload();
        this.isLoading = false;
      }, 500);
    },
    init() {
      this.orgType =
        getUrlParam('chooseOrgType') ||
        getUrlParam('orgType') ||
        getLocalStorage('orgType').orgType;
      this.orgId =
        getUrlParam('chooseOrgId') ||
        getUrlParam('orgId') ||
        getLocalStorage('orgId').orgId;

      this.dialogVisible = false
      
      // 行政费用 - 预算数与执行数
      this.getAdminExpenseDetail('/app-api/human/getAdminExpenseDetail', 1)
      // 行政费用 - 人均行政费用
      this.getAdminExpenseDetail('/app-api/human/getAvgAdminExpense', 8)
      // 办公场地面积柱状图
      this.getAdminExpenseDetail('/app-api/human/getOfficeSpaceDetail', 2)
      // 房屋费用
      this.getAdminExpenseDetail('/app-api/human/getOfficeExpenseDetail', 3)
      // 车辆数量
      this.getAdminExpenseDetail('/app-api/human/getVehiclesDetail', 4)
      // 车辆情况 - 车辆费用
      this.getAdminExpenseDetail('/app-api/human/getVehiclesCostDetail', 5)
      // 本年度内业务招待费情况 - 预算数与执行数
      this.getAdminExpenseDetail('/app-api/human/getBusiEntertainsCostDetail', 6)
      // 本年度内业务招待费情况 - 业务招待费效
      this.getAdminExpenseDetail('/app-api/human/getBusiEnteCostEfficiency', 9)
      // 本年度内差旅费情况
      this.getAdminExpenseDetail('/app-api/human/getTravelExpensesDetail', 7)

    },
    // 行政费用柱状图
    getAdminExpenseDetail(_url,_type) {
      request({
        url: _url,
        method: 'post',
        data: {
          orgType: this.orgType,
          orgId: this.orgId,
        },
      })
        .then(({ data }) => {
          if (data.code === 0) {
            let chartData = null, barData = null, lineData = null, lengend = null ,singleBarData = null

            if (_type==1) {
              chartData = data.data.map( i => {
                return {
                  name: i.orgName,
                  singleBar1: i.adminBudgetTarget,  //预算目标 
                  singleBar2: i.adminExpenseExeNum,  // 已执行数
                  line: i.adminBudgetExecuteRate,
                  guid: i.orgGUID
                }
              })
              singleBarData = [
                chartData.map((i) => i.singleBar1),
                chartData.map((i) => i.singleBar2)
              ]
              lineData = chartData.map((i) => i.line)
              lengend = ['预算目标（万）','已执行费用（万）','执行率']
              this.setBar('行政费用 - 预算数与执行数', 'bar1', lengend, chartData, barData, lineData, ['单位：万', ''],singleBarData, '行政费用');
            }else if(_type==2) {
              chartData = data.data.map( i => {
                return {
                  name: i.orgName,
                  bar1: i.ofcSpace,
                  line: i.avgOfcSpace,
                  guid: i.orgGUID
                }
              })
              barData = [
                chartData.map((i) => i.bar1)
              ]
              lineData = chartData.map((i) => i.line)
              lengend = ['办公场地面积（m²）','人均办公面积（m²/人）']
              this.setBar('办公场地 - 办公场地面积', 'bar2', lengend, chartData, barData, lineData, ['单位：m²', '单位：m²/人'],singleBarData);
            }else if(_type==3) {
              chartData = data.data.map( i => {
                return {
                  name: i.orgName,
                  singleBar1: i.officeSpaceBudgetTarget,
                  bar1: i.ofcSpaceRentalFee,
                  bar2: i.ofcMaintenanceFee,
                  line: i.officeSpaceExpenseExeRate,
                  guid: i.orgGUID
                }
              })
              barData = [
                chartData.map((i) => i.bar1),
                chartData.map((i) => i.bar2)
              ]
              singleBarData = [
                chartData.map((i) => i.singleBar1)
              ]
              lineData = chartData.map((i) => i.line)
              lengend = ['预算目标（万）', '办公场地租赁费（万）', '办公场地服务费（万）','执行率']
              this.setBar('办公场地 - 房屋费用', 'bar3', lengend, chartData, barData, lineData, ['单位：万', ''], singleBarData,'办公场地费用');
            }else if(_type==4) {
              chartData = data.data.map( i => {
                return {
                  name: i.orgName,
                  bar1: i.vehicleQuantity,
                  line: i.sinProjVehicleQuantity,
                  guid: i.orgGUID
                }
              })
              barData = [
                chartData.map((i) => i.bar1),
              ]
              lineData = chartData.map((i) => i.line)
              lengend = ['车辆数（辆）', '单项目车辆配置数（辆）']
              this.setBar('车辆情况 - 车辆数', 'bar4', lengend, chartData, barData, lineData, ['单位：辆', '单位：辆'],singleBarData);
            }else if(_type==5) {
              chartData = data.data.map( i => {
                return {
                  name: i.orgName,
                  singleBar1: i.vehicleExpenseBudgetTarget,
                  bar1: i.vehiclesConCost,
                  bar2: i.vehiclesRentalFee,
                  bar3: i.vehiclesOperatingFee,
                  line: i.vehicleExpenseExeRate,
                  guid: i.orgGUID
                }
              })
              barData = [
                chartData.map((i) => i.bar1),
                chartData.map((i) => i.bar2),
                chartData.map((i) => i.bar3),
                chartData.map((i) => i.bar4),
              ]
              singleBarData = [
                chartData.map((i) => i.singleBar1)
              ]
              lineData = chartData.map((i) => i.line)
              lengend = ['预算目标（万）', '车辆购置费（万）', '车辆租赁费（万）', '车辆运营费（万）', '执行率']
              this.setBar('车辆情况 - 车辆费用', 'bar5', lengend, chartData, barData, lineData, ['单位：万', ''],singleBarData ,'车辆费用');
            }else if(_type==6) {
              chartData = data.data.map( i => {
                return {
                  name: i.orgName,
                  singleBar1: i.businessEnterBudgetTarget,
                  bar1: i.busiEntertainsCost,
                  line: i.businessEnterExpenseExeRate,
                  guid: i.orgGUID
                }
              })
              singleBarData = [
                chartData.map((i) => i.singleBar1)
              ]
              barData = [
                chartData.map((i) => i.bar1),
              ]
              lineData = chartData.map((i) => i.line)
              lengend = ['预算目标（万）', '已执行费用（万）','执行率']
              this.setBar('本年度内业务招待费情况 - 预算数与执行数', 'bar6', lengend, chartData, barData, lineData, ['单位：万', ''],singleBarData ,'业务招待费');
            }else if(_type==7) {
              chartData = data.data.map( i => {
                return {
                  name: i.orgName,
                  singleBar1: i.travelBudgetTarget,
                  bar1: i.travelExpenses,
                  line: i.travelExpenseExeRate,
                  guid: i.orgGUID
                }
              })
              singleBarData = [
                chartData.map((i) => i.singleBar1)
              ]
              barData = [
                chartData.map((i) => i.bar1),
              ]
              lineData = chartData.map((i) => i.line)
              lengend = ['预算目标（万）', '已执行费用（万）','执行率']
              this.setBar('本年度内差旅费情况', 'bar7', lengend, chartData, barData, lineData, ['单位：万', ''],singleBarData ,'差旅费');
            }else if(_type==8) {
              chartData = data.data.map( i => {
                return {
                  name: i.orgName,
                  line: i.avgAdminExpense,
                  guid: i.orgGUID
                }
              })
              lineData = chartData.map((i) => i.line)
              lengend = ['人均行政费用（万/人）']
              this.setLine('行政费用 - 人均行政费用', 'line1', lengend, chartData, lineData, '单位：万/人',singleBarData);
            } else if(_type==9) {
              chartData = data.data.map( i => {
                return {
                  name: i.orgName,
                  line: i.busiEnteCostEfficiency,
                  guid: i.orgGUID
                }
              })
              lineData = chartData.map((i) => i.line)
              lengend = ['业务招待费（元）']
              this.setLine('本年度内业务招待费情况 - 业务招待费效', 'line2', lengend, chartData, lineData, '单位：元',singleBarData);
            }
          }
        })
        .catch((e) => {
          console.log('getAdminExpenseDetail-err', e);
        });
    },
    // 实例化柱状图
    setBar(title, el, _lengend, _chartData, _barData, _lineData, yTitle, _singleBarData, _hasDetail) {
      let xAxisData = _chartData.map((i) => i.name),
        _color = ['#006E38', '#4995E3','#F97546', '#FFC40F', '#B4A36B']
      let _series = []
      // 单个柱状图
      if (_singleBarData) {
         for (let i = 0; i < _singleBarData.length; i++) {
          const item = _singleBarData[i];
          _series.push({
            name: _lengend[i],
            type: 'bar',
            barGap: '20%',
            barWidth: 20,
            itemStyle: {
              normal: {
                color: _color[i],
              },
            },
            label:{
              normal: {
                show: true,
                position: 'inside',
                textStyle: {
                    color: '#000',
                    fontSize: 9
                }
              }
            },
            data: _singleBarData[i],
          })
        }
      }
      // 堆叠柱状图
      if (_barData) {
        for (let i = 0; i < _barData.length; i++) {
          const item = _barData[i];
          _series.push({
              name: _singleBarData?_lengend[i+1]:_lengend[i],
              type: 'bar',
              stack: '费用',
              barWidth: 20,
              barGap: '20%',
              itemStyle: {
                normal: {
                  color: _singleBarData?_color[i+1]:_color[i],
                },
              },
              label:{
                normal: {
                  show: true,
                  position: 'inside',
                  textStyle: {
                      color: '#000',
                      fontSize: 9
                  }
                }
              },
              data: item,
          })
        }
      }
      // 线
      _series.push({
        name: _lengend[_lengend.length-1],
        type: 'line',
        smooth: true,
        showAllSymbol: true,
        symbol: 'emptyCircle',
        symbolSize: 8,
        yAxisIndex: 1,
        itemStyle: {
          normal: {
            color: '#B4A36B',
          },
        },
        data: _lineData,
      })

      let that = this;

      // 获取最大值
      let max = Math.max.apply(null, _barData);

      let option = {
        // title: {
        //   text: title,
        //   show: true,
        //   textStyle: {
        //     fontWeight: 'bold',
        //     fontSize: 14,
        //     color: '#333333',
        //   },
        //   x: 'center',
        //   y: 'top',
        // },
        tooltip: {
          confine: true,
          formatter: function(param){
            let str = param[0].axisValueLabel+'<br>'
            for (let i = 0; i < param.length; i++) {
              const item = param[i];
              str += item.marker+' '+item.seriesName+'：'+item.value+(item.seriesName.indexOf('率')!=-1?'%':'')+'<br>'
            }

            return str
          },
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          textStyle: {
            fontSize: 12,
            align: 'left',
          },
        },
        grid: {
          left:  _chartData.length>0?'0%':'10%',
          right: _chartData.length>0?'0%':'10%',
          bottom: _lengend.length>3?'15%':'10%',
          top: '10%',
          containLabel: true,
        },
        legend: {
          data: _lengend,
          selectedMode:false,
          show: true,
          type: 'plain',
          icon: 'rect',
          itemWidth: 10,
          itemHeight: 10,
          // orient: 'horizon',
          x: 'center',
          y: 'bottom',
          textStyle: {
            fontSize: (window.innerWidth / 375) * 10,
            lineHeight: 10,
            color: '#999999'
          },
        },
        animation: true,
        toolbox: {
          show: true,
          feature: {},
        },
        calculable: true,
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: xAxisData,
          triggerEvent: true,
          axisTick: {
            show: false,
          },
          axisLine: {
            show: _chartData.length > 0 ? false : true,
          },
          axisLabel: {
            show: true,
            rotate: _chartData.length <= 2 ? 0 : 30,
            textStyle: {
              fontSize: 11,
              color: '#333333',
            },
          },
        },
        yAxis: [
          {
            type: "value",
            name: yTitle[0],
            // name: yTitle[0],
            nameTextStyle: {
              color: "#999999",
              fontSize: 11,
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#E8E8E8'
              }
            },
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#E8E8E8',
              },
            },
            axisLabel: {
              formatter: '{value} ',
              textStyle:{
                fontSize: 9,
                color: '#666666'
              }
            },
          },
          {
            type: "value",
            name: yTitle[1],
            position: "right",
            nameTextStyle: {
              color: "#999999",
              fontSize: 11,
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#E8E8E8',
              },
            },
            axisLabel: {
              formatter: _lengend[_lengend.length-1].indexOf('率')!=-1?'{value}%':'{value}',
              textStyle:{
                fontSize: 9,
                color: '#666666'
              }
            },
          }
        ],
        series: _series
      };


      let slideNum = this.dialogVisible? 5: 3
      if (_chartData.length > slideNum) {
        option.dataZoom = [
          {
            id: 'dataZoomX',
            type: 'inside',
            xAxisIndex: [0],
            filterMode: 'none',
            start: 0,
            // minValueSpan: 5,
            // maxValueSpan: 8,
            end: (slideNum / _chartData.length) * 100,
          },
        ];
      }

      if (_hasDetail) {
        option.xAxis.axisLabel.textStyle.color = '#4472C4'
        option.xAxis.axisLabel.textStyle.backgroundColor = {
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABLCAYAAAA1fMjoAAAA5UlEQVR4nO3VAQ2AMBAEwYI2FKERX4+BdhXMSLhkc9fMzAK2brPAmUAgCASCQCAIBIJAIAgEgkAgCASCQCAIBIJAIAgEgkAgCASCQCAIBIJAIAgEgkAgCASCQCAIBIJAIAgEgkAgCASCQCAIBIJAIAgEgkAgCASCQCAIBIJAIAgEgkAgCASCQCAIBIJAIAgEgkAgCASCQCAIBIJAIAgEgkAgCASCQCAIBIJAIAgEgkAgCASCQCAIBIJAIAgEgkAgCASCQCAIBIJAIAgEwvW83xgI9jwIBIFAEAgEgUAQCASBwMla6wfq+AcKdpjK7wAAAABJRU5ErkJggg==',
            width:100,
            height:50,
        }
      }

      let myChart = new echarts.init(this.$refs[el]);
      myChart.setOption(option, true);

      if (_hasDetail) {
        myChart.off('click')
        myChart.on('click', function (params) {
          let componentType = params.componentType
          if(componentType == "xAxis"){
            myChart.dispatchAction({
                type: 'downplay',
            });
            // 弹框
            let idx = _chartData.findIndex( i=> i.name == params.value)
            that.getModalData(_hasDetail, _chartData[idx].guid, params.value)
          }
        });
      }

      window.onresize = myChart.resize;
    },
    setLine(title, el,_lengend, _chartData, _lineData, yTitle){
      let xAxisData = _chartData.map((i) => i.name)
      let option = {
          // title: {
          //   text: title,
          //   show: true,
          //   textStyle: {
          //     fontWeight: 'bold',
          //     fontSize: 14,
          //     color: '#333333',
          //   },
          //   x: 'center',
          //   y: 'top',
          // },
          grid: {
            left:  '0%',
            right: '10%',
            bottom: '15%',
            top: '10%',
            containLabel: true,
          },
          tooltip: {
            confine: true,
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            },
            textStyle: {
              fontSize: 12,
              align: 'left',
            },
          },
          legend: {
            data: _lengend,
            selectedMode:false,
            show: true,
            type: 'plain',
            icon: 'rect',
            itemWidth: 10,
            itemHeight: 10,
            // orient: 'horizon',
            x: 'center',
            y: 'bottom',
            textStyle: {
              fontSize: (window.innerWidth / 375) * 10,
              lineHeight: 10,
              color: '#999999'
            },
          },
          animation: true,
          toolbox: {
            show: true,
            feature: {},
          },
          calculable: true,
          xAxis: {
            type: 'category',
            boundaryGap: true,
            data: xAxisData,
            axisTick: {
              show: false,
            },
            axisLine: {
              show: _chartData.length > 0 ? false : true,
            },
            axisLabel: {
              show: true,
              rotate: _chartData.length <= 2 ? 0 : 30,
              textStyle: {
                fontSize: 11,
                color: '#333333',
              },
            },
          },
          yAxis: [{
            type: "value",
            name: yTitle,
            nameTextStyle: {
              color: "#999999",
              fontSize: 11,
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#E8E8E8'
              }
            },
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#E8E8E8',
              },
            },
            axisLabel: {
              formatter: '{value} ',
              textStyle:{
                fontSize: 9,
                color: '#666666'
              }
            },
          }],
          series: [{
              name: _lengend[_lengend.length-1],
              type: 'line',
              showAllSymbol: true,
              symbol: 'emptyCircle',
              symbolSize: 8,
              itemStyle: {
                normal: {
                  color: '#B4A36B',
                },
              },
              data: _lineData
          }]
      };

      if (_chartData.length > 4) {
        option.dataZoom = [
          {
            id: 'dataZoomX',
            type: 'inside',
            xAxisIndex: [0],
            filterMode: 'none',
            start: 0,
            minValueSpan: 5,
            maxValueSpan: 8,
            end: (4 / _chartData.length) * 100,
          },
        ];
      }

      let myChart = new echarts.init(this.$refs[el]);
      myChart.setOption(option, true);
      window.onresize = myChart.resize;
    },
    // 弹框明细接口
    getModalData(type, guid, name){
      this.dialogVisible = true
      this.title = type+'-'+name+'月度明细'
      
      request({
        url: '/app-api/human/getBudgetExpenseDetail',
        method: 'post',
        data: {
          expenseType: type,// 费用类型（行政费用、办公场地费用、车辆费用、业务招待费、差旅费） ,
          orgGUID: guid// 必传:组织机构ID
        },
      })
        .then(({ data }) => {
          if (data.code === 0) {
            let chartData = null, barData = null, lineData = null, lengend = null ,singleBarData = null
            // _lengendArr = {
            //   "行政费用": '行政费用（万）',
            //   "办公场地费用": '办公场地费用（万）',
            //   "车辆费用": '车辆费用（万）',
            //   "业务招待费": '业务招待费用（万）',
            //   "差旅费": ,
            // }
              chartData = data.data.map( i => {
                return {
                  name: i.month+'月',
                  bar: i.expenseAmont
                }
              })
              barData = [
                chartData.map((i) => i.bar)
              ]
              lengend = [type+'（万）']
              
              this.setBar('', 'barModal', lengend, chartData, barData, lineData, ['单位：万', '']);
          }
        })
        .catch((e) => {
          console.log('getAdminExpenseDetail-err', e);
        });
    }
  },
  components: {
    [Icon.name]: Icon,
    [PullRefresh.name]: PullRefresh,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding: 20px;
}
.huojv-chart-box{
  margin-top: 0;
  margin-bottom: 60px;
}
.charts_tips{
  font-size: 9px;
  color: #999999;
  text-align: center;
  display: block;
  margin-top: 5px;
}
.dialogTitleBox{
  display: flex;
  align-items: center;
  .dialogTitle{
    flex: 1;
    color: #333333;
    text-align: center;
    font-size: 14px;
  }
}
.chartTitle{
  padding-left: 10px;
  font-size: 14px;
  color: #333333;
  position: relative;
  margin-bottom: 20px;
  &:before{
    content: '';
    width: 2px;
    height: 80%;
    display: block;
    position: absolute;
    top: 10%;
    left: 0;
    background: #006E38;
  }
}
</style>
