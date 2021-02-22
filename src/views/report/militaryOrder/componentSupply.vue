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
        <el-table-column prop="militaryPresalesAmountPlan" label="军令状版计划供货" align="center">
          <template slot-scope="scope">
            {{ scope.row.militaryPresalesAmountPlan|change(propName) }}
          </template>
        </el-table-column>
        <el-table-column prop="newPresalesAmountPlan" label="最新版计划供货" align="center">
          <template slot-scope="scope">
            {{ scope.row.newPresalesAmountPlan|change(propName) }}
          </template>
        </el-table-column>
        <el-table-column prop="presalesAmountActual" label="实际供货" align="center">
          <template slot-scope="scope">
            {{ scope.row.presalesAmountActual|change(propName) }}
          </template>
        </el-table-column>
        <el-table-column prop="militaryMonthPresalesGapAmount" label="军令状版月度供货缺口" align="center" width="100">
          <template slot="header" slot-scope="scope">
              军令状版月度供货缺口
              <el-popover placement="bottom" width="150" trigger="click">
                  <div class="tooltips">军令状版当月计划供货-当月实际供货</div>
                  <span class="tips-img" slot="reference" style="width:15px;height:15px"></span>
              </el-popover>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.militaryMonthPresalesGapAmount" :class="scope.row.militaryMonthPresalesGapAmount[propName]>0?'red':''">{{ scope.row.militaryMonthPresalesGapAmount|change(propName) }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="militaryPresalesGapAmount" label="军令状版累计供货缺口" align="center" width="100">
          <template slot="header" slot-scope="scope">
              军令状版累计供货缺口
              <el-popover placement="bottom" width="150" trigger="click">
                  <div class="tooltips">年初至当月累计军令状版计划供货-年初至当月累计实际供货</div>
                  <span class="tips-img" slot="reference" style="width:15px;height:15px"></span>
              </el-popover>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.militaryPresalesGapAmount" :class="scope.row.militaryPresalesGapAmount[propName]>0?'red':''">{{ scope.row.militaryPresalesGapAmount|change(propName) }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="newMonthPresalesGapAmount" label="最新版月度供货缺口" align="center" width="100">
          <template slot="header" slot-scope="scope">
              最新版月度供货缺口
              <el-popover placement="bottom" width="150" trigger="click">
                  <div class="tooltips">最新版当月计划供货-当月实际供货</div>
                  <span class="tips-img" slot="reference" style="width:15px;height:15px"></span>
              </el-popover>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.newMonthPresalesGapAmount" :class="scope.row.newMonthPresalesGapAmount[propName]>0?'red':''">{{ scope.row.newMonthPresalesGapAmount|change(propName) }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="newPresalesGapAmount" label="最新版累计供货缺口" align="center" width="100">
          <template slot="header" slot-scope="scope">
              最新版累计供货缺口
              <el-popover placement="bottom" width="150" trigger="click">
                  <div class="tooltips">年初至当月累计最新版计划供货-年初至当月累计实际供货</div>
                  <span class="tips-img" slot="reference" style="width:15px;height:15px"></span>
              </el-popover>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.newPresalesGapAmount" :class="scope.row.newPresalesGapAmount[propName]>0?'red':''">{{ scope.row.newPresalesGapAmount|change(propName) }}</span>
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
          return val&&val[prop]!=null? regexNum(val[prop]): '-'
      }
  },
  methods: {
    init() {
      this.orgId =
        getUrlParam('chooseOrgId') ||
        getUrlParam('orgId') ||
        getLocalStorage('orgId').orgId;
      this.orgType =
        getUrlParam('chooseOrgType') ||
        getUrlParam('orgType') ||
        getLocalStorage('orgType').orgType;

      this.unit = this.orgType >= 5 ? '万元' : '亿元'
      this.propName = this.orgType >= 5 ? 'amountTenThousand': 'amountBillion', // amountBillion 金额(亿),amountTenThousand 金额(万)
      this.getYear()

    },
    // 获取年份说明
    getYear() {
      request({
        url: `/app-api/militaryOrder/findSupplyVoYear`,
        method: 'post',
        data: {
          orgId: this.orgId,
        },
      })
      // this.$http({
      //   url: 'http://10.99.25.78:8082/pc/militaryOrder/findSupplyVoYear?token=a5e10306e78a09e57b188787e4986d95',
      //   method: 'post',
      //   data:{
      //     orgId: this.orgId,
      //   }
      // })
        .then(({ data }) => {
          this.yearList = data.data
          this.getMainData();
          this.getBarData()
        })
        .catch((e) => {
          console.log('supply-err', e);
        });
    },
    getMainData() {
      // this.$http({
      //   url: 'http://10.99.25.78:8082/pc/militaryOrder/supply?token=a5e10306e78a09e57b188787e4986d95',
      //   method: 'post',
      //   data:{
      //     orgId: this.orgId,
      //     year: this.yearList.length>0?this.yearList[0].value:''
      //   }
      // })
      request({
        url: `/app-api/militaryOrder/supply`,
        method: 'post',
        data: {
          orgId: this.orgId,
          year: this.yearList.length>0?this.yearList[0].value:''
        },
      })
        .then(({ data }) => {
          if (data.code == 0&&data.data) {
            this.tableData = data.data
          }else{
            this.tableData = []
          }
        })
        .catch((e) => {
          console.log('supply-err', e);
        });
    },
    getBarData() {
      request({
        url: `/app-api/militaryOrder/supply/histogram`,
        method: 'post',
        data: {
          orgId: this.orgId,
          year: this.yearList.length>0?this.yearList[0].value:''
        },
      })
        .then(({ data }) => {
          let val1 = [0,0],val2 = [0,0],val3 = [0,0]
          if (data.code == 0&&data.data&&data.data.length>0) {
            let that = this
            function change(val){
              return val ? val[that.propName]: '-'
            }

            let _data = data.data[0]
            val1 = [change(_data.militaryPresalesAmountPlan), change(_data.newPresalesAmountPlan)]
            val2 = [change(_data.presalesAmountActual), change(_data.presalesAmountActual)]
            val3 = [change(_data.militaryPresalesGapAmount), change(_data.newPresalesGapAmount)]
          }
          let barData = [
            {name: '截止本月累计目标',value: val1},
            {name: '全年累计完成',value: val2},
            {name: '累计缺口',value: val3},
          ]
          console.log(barData)
          this.setBar('bar',barData)
        })
        .catch((e) => {
          console.log('histogram-err', e);
        });
    },
    setBar(el, chartData) {
      let xAxisData = ['军令状版计划供货', '最新版计划供货'],
      _lengend = ['截止本月累计目标', '全年累计完成', '累计缺口']
      let that = this;

      let _series = []
      for (let i = 0; i < chartData.length; i++) {
        const item = chartData[i];
        _series.push({
          name: item.name,
          type: 'bar',
          barWidth: 30,
          label: {
            normal: {
              formatter: function(param){
                return regexNum(param.value)
              },
              show: true,
              position: 'inside',
              textStyle: {
                color: '#fff',
                fontSize: 9,
              },
            },
          },
          data: item.value,
        })
      }

      let option = {
        color: ['#006E38', '#B4A36B', '#FFC40F'],
        tooltip: {
          confine: true,
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          textStyle: {
            align: 'left',
          },
        },
        legend: {
          data: _lengend,
          show: true,
          selectedMode: false,
          type: 'plain',
          icon: 'rect',
          itemWidth: 10,
          itemHeight: 10,
          // orient: 'horizon',
          x: 'center',
          y: 'bottom',
          textStyle: {
            fontSize: (window.innerWidth / 375) * 8,
            lineHeight: 10,
            color: '#999999',
          },
        },
        grid: {
          left: '4%',
          right: '4%',
          bottom: '13%',
          top: '15%',
          containLabel: true,
        },
        animation: true,
        toolbox: {
          show: true,
          feature: {},
        },
        calculable: true,
        xAxis: {
          type: 'category',
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#E8E8E8'
            }
          },
          boundaryGap: true,
          data: xAxisData,
          axisLabel: {
            show: true,
            textStyle: {
              fontSize: 12,
              color: '#333333',
            },
          },
        },
        yAxis: {
          name: this.orgType >= 5 ? '单位：万元' : '单位：亿元',
          type: 'value',
          nameTextStyle: {
            padding: [0, 0, 0, 15],
            color: '#999999',
            fontSize: 12,
            align: chartData.length > 0 ? 'center' : 'left',
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#E8E8E8',
            },
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#E8E8E8'
            }
          },
          min: 0,
          axisLabel: {
            show: true,
            textStyle: {
              fontSize: 12,
              color: '#666666',
            },
          },
        },
        series: _series,
      };
      
      if (chartData.length > 6) {
        option.dataZoom = [
          {
            id: 'dataZoomX',
            type: 'inside',
            xAxisIndex: [0],
            filterMode: 'none',
            start: 0,
            minValueSpan: 5,
            maxValueSpan: 8,
            end: (7 / chartData.length) * 100,
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
