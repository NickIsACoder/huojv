<template>
  <div class="detail-panel raiseMore mt-15">
    <div class="rm_title" v-eventlisten="{isChangePage:true,pageEvent:'点击返回按钮'}" @click="handleClickBack">
      <i class="rm_back"></i>
      历年累计募集金额({{years}})
    </div>
    <div ref="bar" class="huojv-chart-box-item"></div>
  </div>
</template>

<script>
import request from '@/utils/request'
import echarts from 'echarts'
import { getUrlParam,regexNum } from '@/utils/common'
export default {
  name: 'RaiseMore',
  data() {
    return {
      orgId: '',
      orgType: '',
      pageType: 1,
      years: ''
    };
  },
  watch: {
    '$store.state.orgId': function (newVal, oldVal) {
      this.init();
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.orgId = getUrlParam('chooseOrgId') || getUrlParam('orgId') || getLocalStorage('orgId').orgId;
      this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType;
      this.pageType = getUrlParam('pageType') || 1
      this.getAninvestAmountMonthlyList()
    },
    getAninvestAmountMonthlyList() {
      request({
        url: '/app-api/investmentGroup/aninvestAmountMonthlyList',
        method: 'get',
        params: {
          orgId: this.orgId,
          currentYear: 0,
        },
      })
        .then((res) => {
          if (res.data.code == 0 && res.data.data) {
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
            this.years = `${res.data.data[0].statyear}-${res.data.data[res.data.data.length-1].statyear}` || ''
            if (this.pageType == 1) {
              this.setBar(
                barData1,
                'bar',
                '金额(亿元)',
                '历年累计募集金额'
              );
            } else {
              this.setBar(
                barData2,
                'bar',
                '金额(亿元)',
                '历年累计募集金额'
              );
            }
          }
        })
        .catch((e) => {
          console.log('getAninvestAmountMonthlyList-err', e);
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
            startValue: 0,
            endValue: 7
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
          x: 'left',
        };
        option.grid.top = '12%';
        option.color = ['#B4A36B'];
        option.xAxis.axisLabel.rotate = 70;
      } else {
        option.grid.top = '4%';
        option.color = ['#B4A36B'];
        option.xAxis.axisLabel.textStyle.textStyle = 11;
      }
      let myChart = new echarts.init(this.$refs[el]);
      myChart.clear()
      myChart.setOption(option, true);
    },
    // 返回
    handleClickBack() {
      this.$router.go(-1)
    }
  },
};
</script>

<style lang="scss" scoped>
.raiseMore {
  background: #fff;
  padding: 20px 16px;
  box-sizing: border-box;
  .rm_title {
    margin-bottom: 20px;
    font-size: 14px;
    font-weight: 500;
    color: #333333;
  }
  .rm_back {
    display: inline-block;
    border-top: 2px solid;
    border-right: 2px solid;
    width: 14px;
    height: 14px;
    border-color:#333333;
    transform: rotate(-135deg);
    margin-right: 60px;
  }
}
.data-content-panel p{
  margin: 0;
}
</style>
