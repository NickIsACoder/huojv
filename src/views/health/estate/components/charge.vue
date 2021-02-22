<template>
  <div class="detail-panel p-l-r-15 pt-15">
    <div ref="pie" style="margin-bottom:30px" class="huojv-chart-box-item"></div>
    <div class="flexContent">
      <p class="flexTitle">管理费</p>
      <div class="flexItemBox">
        <div class="flexItem_2">
          <p>应收</p>
          <div class="value" v-if="filterVal(managementFee.manageFeeYS,'amountTenThousand')">{{managementFee.manageFeeYS|changeVal('amountTenThousand')}}<span>万</span></div>
          <div class="value" v-else>-</div>
        </div>
        <div class="flexItem_2">
          <p>实收</p>
          <div class="value" v-if="filterVal(managementFee.manageFeeSS,'amount')">{{managementFee.manageFeeSS|changeVal('amount')}}<span>{{unit}}</span></div>
          <div class="value" v-else>-</div>
        </div>
        <div class="flexItem_2">
          <p>收缴率</p>
          <div class="value" v-if="filterVal(managementFee.manageRate,'percentage')">{{managementFee.manageRate|changeVal('percentage')}}<span>%</span></div>
          <div class="value" v-else>-</div>
        </div>
        <div class="flexItem_2">
          <p>清欠率</p>
          <div class="value" v-if="filterVal(managementFee.manageWNRate,'percentage')">{{managementFee.manageWNRate|changeVal('percentage')}}<span>%</span></div>
          <div class="value" v-else>-</div>
        </div>
      </div>
    </div>
    <div class="flexContent">
      <p class="flexTitle">水电费</p>
      <div class="flexItemBox">
        <div class="flexItem_3">
          <p>生成记录</p>
          <div class="value" v-if="filterVal(shuiDianFeeTotal)">{{shuiDianFeeTotal|changeVal}}<span>条</span></div>
          <div class="value" v-else>-</div>
        </div>
        <div class="flexItem_3">
          <p>应收</p>
          <div class="value" v-if="filterVal(shuiDianFee.shuiDianFeeYS,'amount')">{{shuiDianFee.shuiDianFeeYS|changeVal('amount')}}<span>{{unit}}</span></div>
          <div class="value" v-else>-</div>
        </div>
        <div class="flexItem_3">
          <p>实收</p>
          <div class="value" v-if="filterVal(shuiDianFee.shuiDianFeeSS,'amount')">{{shuiDianFee.shuiDianFeeSS|changeVal('amount')}}<span>{{unit}}</span></div>
          <div class="value" v-else>-</div>
        </div>
        <div class="flexItem_3">
          <p>收缴率</p>
          <div class="value" v-if="filterVal(shuiDianFee.shuiDianRate,'percentage')">{{shuiDianFee.shuiDianRate|changeVal('percentage')}}<span>%</span></div>
          <div class="value" v-else>-</div>
        </div>
        <div class="flexItem_3">
          <p>清欠率</p>
          <div class="value" v-if="filterVal(shuiDianFee.shuiDianWNRate,'percentage')">{{shuiDianFee.shuiDianWNRate|changeVal('percentage')}}<span>%</span></div>
          <div class="value" v-else>-</div>
        </div>
      </div>
    </div>
    <div class="flexContent">
      <p class="flexTitle">管理费预收</p>
      <div class="flexItemBox">
        <div class="flexItem_2">
          <p>本期预收</p>
          <div class="value" v-if="filterVal(managementFee.manageYJTotal,'amount')">{{managementFee.manageYJTotal|changeVal('amount')}}<span>{{unit}}</span></div>
          <div class="value" v-else>-</div>
        </div>
        <div class="flexItem_2">
          <p>本期冲抵</p>
          <div class="value" v-if="filterVal(managementFee.mangeCDTotal,'amount')">{{managementFee.mangeCDTotal|changeVal('amount')}}<span>{{unit}}</span></div>
          <div class="value" v-else>-</div>
        </div>
        <div class="flexItem_2">
          <p>本期余额</p>
          <div class="value" v-if="filterVal(managementFee.manageYJYE,'amount')">{{managementFee.manageYJYE|changeVal('amount')}}<span>{{unit}}</span></div>
          <div class="value" v-else>-</div>
        </div>
        <div class="flexItem_2">
          <p>当前余额</p>
          <div class="value" v-if="filterVal(managementFee.dangqianYJ,'amount')">{{managementFee.dangqianYJ|changeVal('amount')}}<span>{{unit}}</span></div>
          <div class="value" v-else>-</div>
        </div>
      </div>
    </div>
    <div class="flexContent">
      <p class="flexTitle">保证金</p>
      <div class="flexItemBox">
        <div class="flexItem_3">
          <p>已收</p>
          <div class="value" v-if="filterVal(managementFee.yaJinSS,'amount')">{{managementFee.yaJinSS|changeVal('amount')}}<span>{{unit}}</span></div>
          <div class="value" v-else>-</div>
        </div>
        <div class="flexItem_3">
          <p>已退</p>
          <div class="value" v-if="filterVal(managementFee.yaJinYT,'amount')">{{managementFee.yaJinYT|changeVal('amount')}}<span>{{unit}}</span></div>
          <div class="value" v-else>-</div>
        </div>
        <div class="flexItem_3">
          <p>退还率</p>
          <div class="value" v-if="filterVal(managementFee.tuiHuanRate,'percentage')">{{managementFee.tuiHuanRate|changeVal('percentage')}}<span>%</span></div>
          <div class="value" v-else>-</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
import echarts from 'echarts'
import { handleNum2String, handleDate, getUrlParam,regexNum } from '@/utils/common'

export default {
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
            fontSize: 12,
            color: '#333333',
          },
          x: 'center',
          y: '10%',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a}{b} {c}%',
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
      shuiDianFee: {},
      shuiDianFeeTotal: 0
    };
  },
  props:{
    unit: {
      type: String,
      default: '万'
    },
    managementFee: {
      type: Object,
      default: {}
    },
    tab:{
      type: String,
      default: 'year'
    }
  },
  filters:{
    changeVal(val,prop){
      if (val) {
        return prop ? val[prop]?regexNum(val[prop]): '-' : regexNum(val)
      } else {
        return '-'
      }
    }
  },
  watch: {
    '$store.state.orgId': function (newVal, oldVal) {
      this.init();
    },
    'tab':function(){
      // 时间周期切换
      this.init();
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    // 判断值是否为空或者大于0
    filterVal(val,prop){
      if (val) {
        return prop ? val[prop]?true: false : true
      } else {
        return false
      }
    },
    init() {
      this.orgId = getUrlParam('chooseOrgId') || getUrlParam('orgId') || getLocalStorage('orgId').orgId;
      this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType;

      this.getPieData()
      this.getUtilityBill()
    },
    getPieData(){
      request({
        url: '/app-api/healthlife/property/getPaymentModePercentage',
        method: 'post',
        data: {
          orgId: this.orgId,
          queryPeriod: this.tab
        }
      }).then(({ data }) => {
        if (data.code === 0) {
          let pieData = [{name: '暂无数据', value: 0}];
          if (data.data&&data.data.length>0) {
            pieData = data.data.map(i => {
            return {
              value: i.modeRate.percentage,
              name: i.chargeMode
            }
          })
          }
          
          this.setPie('pie', pieData, '收款方式占比')
        }
      }).catch((e) => {
        console.log('getManagementFee-err', e);
      });
    },
    // 获取饼图数据、渲染饼图
    setPie(el, pieData, title) {
      let legendData = pieData.map((item) => {
        return item.name;
      });

      let series = [
        {
          name: '',
          type: 'pie',
          radius: '40%',
          center: ['50%', '50%'],
          color: ['#209B5C', '#9949E3', '#C42438','#F97546','#FFC40F','#4995E3','#B4A36B','#EB9291', '#EDB903', '#F28B00','#D17A44','#00CAF3','#6c9fd3','#8eb021'],
          avoidLabelOverlap: true,
          label: {
            normal: {
              // formatter: '{b} {d}%',
              formatter: function(param){
                  return param.data.name +' '+ param.data.value+'%'
              },
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
              length: 3,
            },
          },
          data: pieData,
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
    // 水电费
    getUtilityBill(){
      request({
        url: '/app-api/healthlife/property/getUtilityBill',
        method: 'post',
        data: {
          orgId: this.orgId,
          queryPeriod: this.tab
        }
      }).then(({ data }) => {
        if (data.code === 0) {
          this.shuiDianFee = data.data ? data.data : {}
          this.shuiDianFeeTotal = data.data?data.data.countNum:null
        }
      }).catch((e) => {
        console.log('getManagementFee-err', e);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.data-content-panel p{
  margin: 0;
}
</style>
