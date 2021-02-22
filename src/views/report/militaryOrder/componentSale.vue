<template>
  <div class="white-bg treeBox">
    <div class="unitBar">
     <p><span>年：{{this.yearList.length>0?this.yearList[0].value:''}}</span> 单位：{{unit}}</p>
    </div>
    <el-table stripe
                class="huo-list-table main-theme-table huojv-data-list2" size="mini"
                highlight-current-row
                empty-text="暂无数据" :data="tableData">
        <el-table-column prop="budgetDimensionValue" label="时间" align="center"></el-table-column>
        <el-table-column prop="noMonthContractGoal" label="自营销售目标" align="center">
          <template slot-scope="scope">
            {{ scope.row.noMonthContractGoal|change(propName) }}
          </template>
        </el-table-column>
        <el-table-column prop="noMonthContractAmount" label="自营销售金额（实际完成）" align="center" width="100">
          <template slot-scope="scope">
            {{ scope.row.noMonthContractAmount|change(propName) }}
          </template>
        </el-table-column>
        <el-table-column prop="noMonthContractGapAmount" label="月销售缺口" align="center" width="100">
          <template slot="header" slot-scope="scope">
            月销售缺口
            <el-popover placement="bottom" width="150" trigger="click">
                <div class="tooltips">月自营销售目标-自营销售金额（实际完成）</div>
                <span class="tips-img" slot="reference" style="width:15px;height:15px"></span>
            </el-popover>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.noMonthContractGapAmount" :class="scope.row.noMonthContractGapAmount&&scope.row.noMonthContractGapAmount[propName]>0?'red':''">{{ scope.row.noMonthContractGapAmount|change(propName) }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="noContractGapAmount" label="累计销售缺口（与全年目标比）" align="center" width="110">
          <template slot="header" slot-scope="scope">
            累计销售缺口（与全年目标比）
            <el-popover placement="bottom" width="150" trigger="click">
                <div class="tooltips">全年自营销售目标-年初至当月累计销售额</div>
                <span class="tips-img" slot="reference" style="width:15px;height:15px"></span>
            </el-popover>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.noContractGapAmount" :class="scope.row.noContractGapAmount&&scope.row.noContractGapAmount[propName]>0?'red':''">{{ scope.row.noContractGapAmount|change(propName) }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="decheRate" label="累计去化率" align="center">
          <template slot-scope="scope">
            {{ scope.row.decheRate|change('percentage') }}
          </template>
        </el-table-column>
        <el-table-column prop="gapDecheRate" label="累计去化率缺口（与全年目标相比）" align="center" width="120">
          <template slot="header" slot-scope="scope">
            累计去化率缺口（与全年目标相比）
            <el-popover placement="bottom" width="150" trigger="click">
                <div class="tooltips">全年去化率目标-年初至当月实际去化率</div>
                <span class="tips-img" slot="reference" style="width:15px;height:15px"></span>
            </el-popover>
          </template>
          <template slot-scope="scope">
            <span>{{ scope.row.gapDecheRate|change('percentage')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="availableAmount" label="当前库存货量" align="center">
          <template slot-scope="scope">
            {{ scope.row.availableAmount|change(propName) }}
          </template>
        </el-table-column>
        <el-table-column prop="depositSaleRate" label="存销比" align="center">
          <template slot="header" slot-scope="scope">
              存销比
              <el-popover placement="bottom" width="150" trigger="click">
                  <div class="tooltips">当前库存货量/过去6个月平均销售额，3~6为绿色区间，其它为红色区间</div>
                  <span class="tips-img" slot="reference" style="width:15px;height:15px"></span>
              </el-popover>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.depositSaleRate" :class="scope.row.depositSaleRate['percent']>6||scope.row.depositSaleRate['percent']<3?'red':'green'">{{ scope.row.depositSaleRate|change('percent') }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table>
    <div class="huojv-chart-box-item" ref="bar"></div>
  </div>
</template>

<script>
import scrollFixed from '@/mixin/scroll-fixed';
import { List, PullRefresh, NavBar, Icon } from 'vant';
import request from '@/utils/request';
import echarts from 'echarts';
import $ from 'jquery';
import { getUrlParam, getNextMonths, regexNum } from '@/utils/common';

export default {
  mixins: [scrollFixed],

  data() {
    return {
      orgId: '',
      orgType: 2,
      tableData: [],
      unit: '亿元',
      propName: 'amountBillion', // amountBillion金额(亿),amountTenThousand金额(万)
      yearList: []
    };
  },
  watch: {
    '$store.state.orgId': function (newVal, oldVal) {
      this.init();
    },
  },
  mounted() {
    this.init();
    this.$nextTick(() => {
      $('.el-table__header-wrapper').scroll(function () {
          let scrollLeft = $(this).scrollLeft();
          $(this).next().scrollLeft(scrollLeft);
      });
    })
  },
  filters:{
      change: function(val,prop){
        let result = val&&val[prop]!=null? regexNum(val[prop]): '-'
        return result!='-'&&prop=='percentage'?result+'%': regexNum(result)
      }
  },
  methods: {
    init() {
      this.orgId = getUrlParam('chooseOrgId') || getUrlParam('orgId') || getLocalStorage('orgId').orgId;
      this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType;
      this.unit = this.orgType >= 5 ? '万元' : '亿元'
      this.propName = this.orgType >= 5 ? 'amountTenThousand': 'amountBillion', // amountBillion 金额(亿),amountTenThousand 金额(万)

      this.getYear()
    },
    // 获取年份说明
    getYear() {
      // this.$http({
      //   url: 'http://10.99.25.78:8082/pc/militaryOrder/findSupplyVoYear?token=a5e10306e78a09e57b188787e4986d95',
      //   method: 'post',
      //   data:{
      //     orgId: this.orgId,
      //   }
      // })
      request({
        url: `/app-api/militaryOrder/findSupplyVoYear`,
        method: 'post',
        data: {
          orgId: this.orgId,
        },
      })
        .then(({ data }) => {
          this.yearList = data.data
          this.getMainData();
        })
        .catch((e) => {
          console.log('getyear-err', e);
        });
    },
    getMainData() {
      let _year = this.yearList.length>0?this.yearList[0].value:''
      request({
        url: `/app-api/militaryOrder/sales`,
        method: 'post',
        data: {
          orgId: this.orgId,
          year: _year
        },
      })
        .then(({ data }) => {
          let barDataVal = [0], rate1 = [],rate2 = [], xData = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
          this.tableData = []
          if (data.code == 0&& data.data&& data.data.length>0) {
            this.tableData = data.data

            barDataVal = data.data.map( i=>{
              return i.noMonthContractAmount?i.noMonthContractAmount[this.propName]:null
            })
            rate1 = data.data.map( i=>{
              return i.depositSaleRate?i.depositSaleRate.percent: null
            })
            rate2 = data.data.map( i=>{
              return i.decheRate?i.decheRate.percent: null
            })
            xData = data.data.map( i=>{
              return i.budgetDimensionValue?i.budgetDimensionValue: '-'
            })
          }

           // 去除合计的项
          if (xData.indexOf('合计')!=-1) {
            xData.pop()
            barDataVal.pop()
            rate1.pop()
            rate2.pop()
          }
          

          let barData = [
            {name: '自营销售金额',value: barDataVal},
          ],
          lineData = [
            {name: '存销比',value: rate1},
            {name: '累计去化率',value: rate2}
          ],
          lengend = ['自营销售金额','存销比','累计去化率']

          this.setBar('bar', lengend, xData, barData, lineData, ['', '单位：'+this.unit]);
        })
        .catch((e) => {
          console.log('developmentPlan-err', e);
        });
    },
    setBar(el,lengend,xData, barData,lineData,yTitle) {
      let _series = [],
      xAxisData = xData

      // 单个柱状图
      if (barData) {
         for (let i = 0; i < barData.length; i++) {
          const item = barData[i];
          _series.push({
            name: item.name,
            type: 'bar',
            barGap: '20%',
            barWidth: 20,
            itemStyle: {
              normal: {
                color: '#006E38',
              },
            },
            label:{
              normal: {
                formatter: function(param){
                    return regexNum(param.value)
                },
                // show: false,
                // position: 'inside',
                // textStyle: {
                //     color: '#000',
                //     fontSize: 9
                // }
              }
            },
            data: barData[i].value,
          })
        }
      }
      if(lineData){
        for (let i = 0; i < lineData.length; i++) {
            const item = lineData[i];
            _series.push({
              name: item.name,
              type: 'line',
              smooth: true,
              showAllSymbol: true,
              symbol: 'emptyCircle',
              symbolSize: 8,
              yAxisIndex: 1,
              itemStyle: {
                normal: {
                  color: ['#B4A36B', '#FFC40F'][i],
                },
              },
              data: item.value,
            })
        }
      }
      let that = this;

      let option = {
        tooltip: {
          confine: true,
          formatter: function(param){
            let str = param[0].axisValueLabel+'<br>'
            for (let i = 0; i < param.length; i++) {
              const item = param[i];
              const val = item.seriesName.indexOf('率')!=-1? (item.value*100).toFixed(2) : item.value
              val = isNaN(val)?'-': regexNum(val)
              str += item.marker+' '+item.seriesName+'：'+val+(item.seriesName.indexOf('率')!=-1?'%':'')+'<br>'
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
          left: barData[0].value.length>0?'0%':'5%',
          right: barData[0].value.length>0?'0%':'5%',
          bottom: '10%',
          top: '10%',
          containLabel: true,
        },
        legend: {
          data: lengend,
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
          // boundaryGap: true,
          data: xAxisData,
          triggerEvent: true,
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#E8E8E8'
            }
            // show: false,
          },
          axisLabel: {
            show: true,
            rotate:  0 ,
            textStyle: {
              fontSize: 11,
              color: '#333333',
            },
          },
        },
        yAxis: [
          {
            type: "value",
            name: yTitle[1],
            position: "right",
            nameTextStyle: {
              color: "#999999",
              fontSize: 11,
              padding: [0,25,0,0]
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
            name: yTitle[0],
            position: "left",
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
              formatter: '{value}',
              textStyle:{
                fontSize: 9,
                color: '#666666'
              }
            },
          }
        ],
        series: _series
      };
      
      if (xAxisData.length > 6) {
        option.dataZoom = [
          {
            id: 'dataZoomX',
            type: 'inside',
            xAxisIndex: [0],
            filterMode: 'none',
            start: 0,
            minValueSpan: 5,
            maxValueSpan: 8,
            end: (7 / xAxisData.length) * 100,
          },
        ];
      }

      let myChart = new echarts.init(this.$refs[el]);
      myChart.setOption(option, true);

      window.onresize = myChart.resize;
    },
  },

  components: {
    [NavBar.name]: NavBar,
    [List.name]: List,
    [PullRefresh.name]: PullRefresh,
    [Icon.name]: Icon,
  },
};
</script>


<style lang="scss" scoped>
.treeBox {
  padding: 15px;
  padding-bottom: 50px;
}
.unitBar{
  text-align: right;
  margin: 0 auto;
  font-size: 10px;
  color: #666666;
  padding: 12px 15px;
  p{
    margin: 0;
    span{
      margin-right: 10px;
    }
  }
}
.huojv-chart-box-item {
  margin-top: 40px;
}
.green{ color:#006E38 ;}
.red{ color:red ;}
</style>
