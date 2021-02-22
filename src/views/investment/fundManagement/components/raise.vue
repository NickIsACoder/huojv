<template>
  <div class="detail-panel p-l-r-15 pt-15">
    <div class="flexContent">
      <p class="flexTitle">投资者情况</p>
      <div class="investor-main">
        <div>
          <div class="investor-title">累计购买投资者</div>
          <div class="investor-value" v-if="filterVal(aninvestSummaryData,'raiseinvestorcnt')">
            {{ aninvestSummaryData.raiseinvestorcnt|changeVal}}
            <span class="investor-unit">位</span>
          </div>
          <div class="value" v-else>-</div>
          <div class="investor-lists">
            <div class="investor-item">
              机 构
              <span
                class="unit"
                v-if="filterVal(aninvestSummaryData,'raiseinvestororgancnt')"
              >{{ aninvestSummaryData.raiseinvestororgancnt|changeVal }}位</span>
              <span class="value" v-else>-</span>
            </div>
            <div class="investor-item">
              高净值
              <span
                class="unit"
                v-if="filterVal(aninvestSummaryData,'raiseinvestorhnwcnt')"
              >{{ aninvestSummaryData.raiseinvestorhnwcnt|changeVal }}位</span>
            </div>
          </div>
        </div>
        <div ref="pie" style="margin-bottom:30px" class="huojv-chart-box-item"></div>
      </div>
      <div class="investor-main">
        <div>
          <div class="investor-title">存续投资者</div>
          <div class="investor-value" v-if="filterVal(aninvestSummaryData,'durationinvestorcnt')">
            {{ aninvestSummaryData.durationinvestorcnt|changeVal}}
            <span class="investor-unit">位</span>
          </div>
          <div class="value" v-else>-</div>
          <div class="investor-lists">
            <div class="investor-item">
              机 构
              <span
                class="unit"
                v-if="filterVal(aninvestSummaryData,'durationinvestororgancnt')"
              >{{ aninvestSummaryData.durationinvestororgancnt|changeVal }}位</span>
              <span class="value" v-else>-</span>
            </div>
            <div class="investor-item">
              高净值
              <span
                class="unit"
                v-if="filterVal(aninvestSummaryData,'durationinvestorhnwcnt')"
              >{{ aninvestSummaryData.durationinvestorhnwcnt|changeVal }}位</span>
              <span class="value" v-else>-</span>
            </div>
          </div>
        </div>
        <div ref="pie1" style="margin-bottom:20px" class="huojv-chart-box-item"></div>
      </div>
    </div>
    <div class="flexContent">
      <p class="flexTitle">产品情况</p>
      <div class="flexItemBox pd-self">
        <div class="flexItem_2">
          <p>累计发行产品期数</p>
          <div class="value0" v-if="filterVal(aninvestSummaryData,'issueproductcnt')">
            {{aninvestSummaryData.issueproductcnt |changeVal}}
            <span>期</span>
          </div>
          <div class="value" v-else>-</div>
        </div>
        <div class="flexItem_2">
          <p>累计募集金额</p>
          <div class="value0" v-if="filterVal(aninvestSummaryData,'raiseamount')">
            {{aninvestSummaryData.raiseamount|changeVal}}
            <span>亿</span>
          </div>
          <div class="value" v-else>-</div>
        </div>
        <div ref="bar1" class="huojv-chart-box-item"></div>
        <div class="huojv-data-list-more raise-more" @click="goMore(1)">
          查看更多
          <van-icon name="arrow" />
        </div>
      </div>
      <div class="flexItemBox pd-self">
        <div class="flexItem_2">
          <p>存续发行产品期数</p>
          <div class="value0" v-if="filterVal(aninvestSummaryData,'durationproductcnt')">
            {{aninvestSummaryData.durationproductcnt|changeVal}}
            <span>期</span>
          </div>
          <div class="value" v-else>-</div>
        </div>
        <div class="flexItem_2">
          <p>存续金额</p>
          <div class="value0" v-if="filterVal(aninvestSummaryData,'durationamount')">
            {{aninvestSummaryData.durationamount|changeVal}}
            <span>亿</span>
          </div>
          <div class="value" v-else>-</div>
        </div>
        <div ref="bar2" class="huojv-chart-box-item"></div>
        <div class="huojv-data-list-more raise-more" @click="goMore(2)">
          查看更多
          <van-icon name="arrow" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request';
import echarts from 'echarts';
import { getUrlParam, regexNum } from '@/utils/common';
import { Icon } from 'vant';
export default {
  name: 'Raise',
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
      if (
        this.aninvestSummaryData &&
        this.aninvestSummaryData.raiseinvestorcnt
      ) {
        this.setPie('pie', this.aninvestSummaryData, '投资者类型占比');
        this.setPie('pie1', this.aninvestSummaryData, '客户类型占比');
      }
    },
  },
  mounted() {
    this.init();
  },
  methods: {
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
      this.getAninvestAmountMonthlyList();
      if (
        this.aninvestSummaryData &&
        this.aninvestSummaryData.raiseinvestorcnt
      ) {
        this.setPie('pie', this.aninvestSummaryData, '投资者类型占比');
        this.setPie('pie1', this.aninvestSummaryData, '投资者类型占比');
      }
    },
    // 获取饼图数据、渲染饼图
    setPie(el, pieData, title) {
      let legendData = ['机构投资者', '高净值投资者'];
      let value = [
        {
          name: '机构投资者',
          value: pieData.raiseinvestororgancnt || 0,
        },
        {
          name: '高净值投资者',
          value: pieData.raiseinvestorhnwcnt || 0,
        },
      ];
      if (el === 'pie1') {
        value[0].value = pieData.durationinvestororgancnt || 0;
        value[1].value = pieData.durationinvestorhnwcnt || 0;
      }
      let series = [
        {
          name: '',
          type: 'pie',
          radius: '40%',
          center: ['50%', '50%'],
          color: ['#209B5C', '#FFC40F'],
          avoidLabelOverlap: true,
          label: {
            normal: {
              padding: [0, -100],
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
              length2: 100,
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
              barData1.values.push(item.raiseamount);
              barData2.values.push(item.durationamount);
            });
            barData2.names = barData1.names;
            this.setBar(
              barData1,
              'bar1',
              '本年累计募集金额',
              '本年累计募集金额'
            );
            this.setBar(
              barData2,
              'bar2',
              '本年存续金额',
              '本年存续金额'
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
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          backgroundColor: "rgba(0,0,0,0)",
          formatter: function (param) {
            //自定义tooltip内容
            var text = "";
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
            startValue: 12,
            endValue: 19
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
            barGap: "30%",
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
    // 查看更多
    goMore(index) {
      this.$router.push({
        path: '/investment/fundManagement/raiseMore',
        query: {
          orgId: this.orgId,
          orgType: this.orgType,
          pageType: index,
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
.investor-main {
  margin-top: 14px;
  text-align: center;
  .investor-title {
    font-size: 12px;
    color: #999;
  }
  .investor-value {
    font-size: 24px;
    font-weight: 600;
    color: #006e38;
    margin-top: 6px;
    .investor-unit {
      font-size: 14px;
      font-weight: 500;
    }
  }
  .investor-lists {
    display: flex;
    justify-content: center;
    margin-top: 4px;
    font-size: 12px;
    .investor-item {
      color: #999;
      .unit {
        color: #006e38;
        font-weight: 500;
        margin-left: 6px;
      }
    }
    .investor-item:first-child {
      margin-right: 64px;
    }
  }
}
.pd-self {
  padding: 14px 0 20px 0 !important;
  &:last-child {
    padding-top: 0 !important;
  }
}
.raise-more {
  width: 100%;
  margin-top: 0;
}
</style>
