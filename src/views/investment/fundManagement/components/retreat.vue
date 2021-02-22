<template>
  <div class="detail-panel p-l-r-15 pt-15">
    <div class="flexContent">
      <p class="flexTitle">项目情况</p>
      <div class="flex-main">
        <div>
          <div class="flex-title">累计退出项目</div>
          <div class="flex-value" v-if="filterVal(aninvestSummaryData,'quitprojcnt')">
            {{ aninvestSummaryData.quitprojcnt|changeVal}}
            <span class="flex-unit">个</span>
          </div>
          <div class="value" v-else>-</div>
        </div>
        <div ref="pie" class="huojv-chart-box-item cast-pie"></div>
      </div>
      <div class="flex-main">
        <div>
          <div class="flex-title">累计退出金额</div>
          <div class="flex-value" v-if="filterVal(aninvestSummaryData,'quitprojamount')">
            {{ aninvestSummaryData.quitprojamount|changeVal}}
            <span class="flex-unit">亿</span>
          </div>
          <div class="value" v-else>-</div>
        </div>
        <div ref="pie1" class="huojv-chart-box-item cast-pie"></div>
      </div>
    </div>
    <div class="flexContent mgt20">
      <p class="flexTitle">已兑付情况</p>
      <div class="flexItemBox pd-self">
        <div class="flexItem_2">
          <p>兑付次数</p>
          <div class="value0" v-if="filterVal(aninvestSummaryData, 'cashcnt')">
            {{aninvestSummaryData.cashcnt|changeVal}}
            <span>次</span>
          </div>
          <div class="value" v-else>-</div>
        </div>
        <div class="flexItem_2">
          <p>兑付金额（含收益）</p>
          <div class="value0" v-if="filterVal(aninvestSummaryData,'cashamount')">
            {{aninvestSummaryData.cashamount|changeVal}}
            <span>亿</span>
          </div>
          <div class="value" v-else>-</div>
        </div>
        <div ref="bar1" class="huojv-chart-box-item"></div>
      </div>
    </div>
    <div class="flexContent mgt20">
      <p class="flexTitle">待兑付情况</p>
      <div class="flexItemBox pd-self">
        <div ref="bar2" class="huojv-chart-box-item"></div>
      </div>
    </div>
    <div class="flexContent flex-last">
      <p class="flexTitle">兑付情况明细表</p>
      <div class="flex-table-last">
        <el-table
          stripe
          class="huo-list-table main-theme-table huojv-data-list2 accountTable"
          size="mini"
          highlight-current-row
          empty-text="暂无数据"
          :data="tableList1"
        >
          <el-table-column type="index" label="序号" align="center" fixed></el-table-column>
          <el-table-column prop="fundname" label="基金名称" align="center" fixed></el-table-column>
          <el-table-column prop="projname" label="项目名称" align="center"></el-table-column>
          <el-table-column prop="investdate" label="投资时间" align="center"></el-table-column>
          <el-table-column label="投资金额(亿元)" align="center">
            <template slot-scope="scope">{{changEmpty(scope.row.investamount)}}</template>
          </el-table-column>
          <el-table-column prop="quitdate" label="退出时间" align="center" width="100"></el-table-column>
          <el-table-column prop="cashcustcnt" label="兑付客户数" align="center" width="100"></el-table-column>
        </el-table>
      </div>
      <div class="huojv-data-list-more raise-more" @click="goMore">
        查看更多
        <van-icon name="arrow" />
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request';
import echarts from 'echarts';
import {
  getUrlParam,
  regexNum,
} from '@/utils/common';
import { Icon } from 'vant';
export default {
  name: 'Retreat',
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
            color: '#333333',
          },
          x: 'center',
          y: '10%',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a}{b} {d}%',
          textStyle: {
            fontSize: 12,
            fontWeight: 0,
          },
        },
        grid: {
          top: '0%',
          left: '0%',
          right: '0%',
          bottom: '0%',
          containLabel: false,
        },
        legend: {
          type: 'plain',
          icon: 'circle',
          x: 'center',
          y: 'bottom',
          itemWidth: 10,
          itemHeight: 8,
          itemGap: 5,
          textStyle: {
            color: '#999999',
            fontSize: 10,
            fontWeight: 0,
          },
          data: [],
        },
        series: [],
      },
      tableList1: [],
    };
  },
  props: {
    aninvestSummaryData: {
      type: Object,
      default: () => {},
    },
  },
  filters: {
    changeVal(val, prop) {
      if (val) {
        return prop ? (val[prop] ? regexNum(val[prop]) : '-') : regexNum(val);
      } else {
        return '-';
      }
    },
  },
  components: {
    [Icon.name]: Icon,
  },
  watch: {
    '$store.state.orgId': function (newVal, oldVal) {
      this.init();
    },
    aninvestSummaryData() {
      if (this.aninvestSummaryData) {
        this.setPie('pie', this.aninvestSummaryData);
        this.setPie('pie1', this.aninvestSummaryData);
      }
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    changEmpty(value) {
      return value ? regexNum(value) : '-';
    },
    // 判断值是否为空或者大于0
    filterVal(val, prop) {
      if (val) {
        return prop ? (val[prop] ? true : false) : true;
      } else {
        return false;
      }
    },
    init() {
      this.orgId =
        getUrlParam('chooseOrgId') ||
        getUrlParam('orgId') ||
        getLocalStorage('orgId').orgId;
      this.orgType =
        getUrlParam('chooseOrgType') ||
        getUrlParam('orgType') ||
        getLocalStorage('orgType').orgType;
      if (this.aninvestSummaryData) {
        this.setPie('pie', this.aninvestSummaryData);
        this.setPie('pie1', this.aninvestSummaryData);
      }
      this.getAninvestProjDetailPage();
      this.getAninvestAmountMonthlyList();
    },
    // 获取饼图数据、渲染饼图
    setPie(el, pieData, title) {
      let legendData = ['地产', '商业', '外部'];
      let value = [
        {
          name: '地产',
          value: pieData.quitprojestatecnt || 0,
        },
        {
          name: '商业',
          value: pieData.quitprojcommcnt || 0,
        },
        {
          name: '外部',
          value: pieData.quitprojoutercnt || 0,
        },
      ];
      if (el === 'pie1') {
        value[0].value = pieData.quitprojestateamount || 0;
        value[1].value = pieData.quitprojcommamount || 0;
        value[2].value = pieData.quitprojouteramount || 0;
      }
      let series = [
        {
          name: '',
          type: 'pie',
          radius: '40%',
          center: ['50%', '50%'],
          color: ['#209B5C', '#FFC40F', '#B4A36B'],
          avoidLabelOverlap: true,
          label: {
            normal: {
              padding: [0, -65],
              formatter: '{b} {d}%\n\n',
              textStyle: {
                fontSize: '10',
                color: '#666666',
              },
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '10',
                color: '#666666',
              },
            },
          },
          labelLine: {
            normal: {
              smooth: 0.2,
              length: 10,
              length2: 65,
              lineStyle: {
                width: 2,
              },
            },
          },
          data: value,
        },
      ];

      let option = this.getOption(series, legendData, title);
      let pie = new echarts.init(this.$refs[el]);

      pie.setOption(option, true);
    },
    getOption(series, legendData, title) {
      let option = JSON.parse(JSON.stringify(this.pieOption));
      option.series = series;
      option.legend.data = legendData;
      option.title.text = title;
      return option;
    },
    getAninvestAmountMonthlyList() {
      request({
        url: '/app-api/investmentGroup/aninvestAmountMonthlyList',
        method: 'get',
        params: {
          orgId: this.orgId,
          currentYear: 1,
        },
      })
        .then((res) => {
          if (res.data.code == 0) {
            let barData1 = {
              names: [],
              values: [],
            };
            let barData2 = {
              values: [],
            };
            res.data.data.forEach((item) => {
              barData1.names.push(
                item.statmonth.slice(0, 4) + '-' + item.statmonth.slice(4)
              );
              barData1.values.push(item.cashamount);
              barData2.values.push(item.waitcashamount);
            });
            barData2.names = barData1.names;
            this.setBar(
              barData1,
              'bar1',
              `已兑付金额(${res.data.data[0].statyear}-${
                res.data.data[res.data.data.length - 1].statyear
              })`,
              '已兑付金额'
            );
            this.setBar(
              barData2,
              'bar2',
              `待兑付金额(${res.data.data[0].statmonth.slice(0, 4) + '.' + res.data.data[0].statmonth.slice(4)}-${
                res.data.data[res.data.data.length - 1].statmonth.slice(0, 4) + '.' + res.data.data[res.data.data.length - 1].statmonth.slice(4)
              }，以后两年情况)`,
              '待兑付金额'
            );
          }
        })
        .catch((e) => {
          console.log('profitLossNum-err', e);
        });
    },
    // 单柱图
    setBar(data, el, title, txt) {
      let option = {
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          backgroundColor: 'rgba(0,0,0,0)',
          formatter: function (param) {
            //自定义tooltip内容
            var text = '';
            text += `<div class="tooltip-self">
                      <div class="tooltip-self-title">${param[0].name}</div>
                      <div class="tooltip-self-main">
                        <div class="tooltip-self-item">
                          <span>金额</span>
                          <span>${param[0].value}</span>
                        </div>
                      </div>
                    </div>`;
            return text;
          },
        },
        dataZoom: [
          {
            id: 'dataZoomX',
            type: 'inside',
            startValue: 0,
            endValue: 7,
          },
        ],
        xAxis: {
          type: 'category',
          data: data.names,
          axisLine: {
            lineStyle: {
              color: '#999999',
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            textStyle: {
              fontSize: '11',
              color: '#666',
            },
          },
        },
        yAxis: {
          name: '金额(亿元)',
          type: 'value',
          scale: true,
          axisLine: {
            show: true,
            lineStyle: {
              color: '#999999',
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#E8E8E8',
            },
          },
          axisLabel: {
            textStyle: {
              textStyle: '11',
              color: '#666',
            },
          },
        },
        series: [
          {
            name: txt,
            barGap: '30%',
            type: 'bar',
            barWidth: '20',
            data: data.values,
          },
        ],
      };
      if (title) {
        option.title = {
          text: title,
          show: true,
          textStyle: {
            fontWeight: 500,
            fontSize: (window.innerWidth / 375) * 14,
            color: '#333333',
            lineHeight: (window.innerWidth / 375) * 14 + 4,
          },
          x: 'center',
          y: 'top',
        };
        option.color = ['#B4A36B'];
        option.xAxis.axisLabel.rotate = 70;
      } else {
        option.grid.top = '4%';
        option.color = ['#B4A36B'];
        option.xAxis.axisLabel.textStyle.textStyle = 11;
      }
      let myChart = new echarts.init(this.$refs[el]);
      myChart.setOption(option, true);
    },
    // 兑付情况明细表数据
    getAninvestProjDetailPage() {
      request({
        url: '/app-api/investmentGroup/aninvestProjDetailPage',
        method: 'get',
        params: {
          orgId: this.orgId,
          projbelonggroup: '',
          projtype: '',
          current: 1,
          size: 10,
          datacontent: 3,//datacontent=1、2、3   数据类型 1是资金使用情况、2是投资明细、3是兑付情况明细表
        },
      })
        .then(({ data }) => {
          if (data.code === 0 && data.data) {
            this.tableList1 = data.data.records;
          }
        })
        .catch((e) => {
          console.log('getAninvestProjDetailPage-err', e);
        });
    },
    // 查看更多
    goMore() {
      sessionStorage.setItem('fmTab',3)
      this.$router.push({
        path: '/investment/fundManagement/more',
        query: {
          orgId: this.orgId,
          orgType: this.orgType,
          pageType: 2,
          token: getUrlParam('token'),
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.data-content-panel p {
  margin: 0;
}
.mgt20 {
  margin-top: 20px;
}
.flex-main {
  margin-top: 14px;
  text-align: center;
  &.mgt30 {
    margin-top: 30px;
  }
  .flex-title {
    font-size: 14px;
    color: #333;
  }
  .flex-value {
    font-size: 24px;
    font-weight: 600;
    color: #006e38;
    margin-top: 6px;
    .flex-unit {
      font-size: 14px;
      font-weight: 500;
    }
  }
}
.cast-pie {
  height: 230px;
  margin-bottom: 30px;
}
.pd-self {
  padding: 14px 0 20px 0 !important;
}
.flex-table-last {
  margin: 16px auto 14px;
}
.flex-last {
  margin-top: 10px;
  padding-bottom: 30px;
}
.raise-more {
  width: 100%;
  margin-top: 0;
}
</style>
