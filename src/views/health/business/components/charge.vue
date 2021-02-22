<template>
  <div class="detail-panel p-l-r-15 pt-15">
    <div class="flexContent">
      <p class="flexTitle">固定租金</p>
      <div class="flexItemBox">
        <div class="flexItem">
          <p>应收</p>
          <div v-if="filterVal(mainData.rentYS)" class="value">{{regexNum(mainData.rentYS)}}<span>{{unit}}</span></div>
          <div v-else  class="value gray">-</div>
          <!-- <p>环比 - </p> -->
        </div>
        <div class="flexItem">
          <p>实收</p>
          <div v-if="filterVal(mainData.rentSS)" class="value">{{regexNum(mainData.rentSS)}}<span>{{unit}}</span></div>
          <div v-else  class="value gray">-</div>
          <!-- <p>环比 - </p> -->
        </div>
        <div class="flexItem">
          <p>收缴率</p>
          <div v-if="filterVal(mainData.rentGetRate)" class="value">{{regexNum(mainData.rentGetRate)}}<span>%</span></div>
          <div v-else  class="value gray">-</div>
          <!-- <p>环比 - </p> -->
        </div>
      </div>
    </div>
    <div class="flexContent">
      <p class="flexTitle">综合管理费</p>
      <div class="flexItemBox">
        <div class="flexItem">
          <p>应收</p>
          <div v-if="filterVal(mainData.manageFeeYS)" class="value">{{regexNum(mainData.manageFeeYS)}}<span>{{unit}}</span></div>
          <div v-else  class="value gray">-</div>
          <!-- <p>环比 - </p> -->
        </div>
        <div class="flexItem">
          <p>实收</p>
          <div v-if="filterVal(mainData.manageFeeSS)" class="value">{{regexNum(mainData.manageFeeSS)}}<span>{{unit}}</span></div>
          <div v-else  class="value gray">-</div>
          <!-- <p>环比 - </p> -->
        </div>
        <div class="flexItem">
          <p>收缴率</p>
          <div v-if="filterVal(mainData.manageFeeGetRate)" class="value">{{regexNum(mainData.manageFeeGetRate)}}<span>%</span></div>
          <div v-else  class="value gray">-</div>
          <!-- <p>环比 - </p> -->
        </div>
      </div>
    </div>
    <div class="flexContent">
      <p class="flexTitle">多经收入</p>
      <div class="flexItemBox">
        <div class="flexItem">
          <p>应收</p>
          <div v-if="filterVal(mainData.multiFeeYS)" class="value">{{regexNum(mainData.multiFeeYS)}}<span>{{unit}}</span></div>
          <div v-else  class="value gray">-</div>
          <!-- <p>环比 - </p> -->
        </div>
        <div class="flexItem">
          <p>实收</p>
          <div v-if="filterVal(mainData.multiFeeSS)" class="value">{{regexNum(mainData.multiFeeSS)}}<span>{{unit}}</span></div>
          <div v-else  class="value gray">-</div>
          <!-- <p>环比 - </p> -->
        </div>
        <div class="flexItem">
          <p>收缴率</p>
          <div v-if="filterVal(mainData.multiFeeGetRate)" class="value">{{regexNum(mainData.multiFeeGetRate)}}<span>%</span></div>
          <div v-else  class="value gray">-</div>
        </div>
      </div>
    </div>
    <div class="flexContent">
      <p class="flexTitle">水电费</p>
      <div class="flexItemBox">
        <div class="flexItem_2">
          <p>应收</p>
          <div v-if="filterVal(mainData.shuiDianYS)" class="value">{{regexNum(mainData.shuiDianYS)}}<span>{{unit}}</span></div>
          <div v-else  class="value gray">-</div>
          <!-- <p>环比 - </p> -->
        </div>
        <div class="flexItem_2">
          <p>实收</p>
          <div v-if="filterVal(mainData.shuiDianSS)" class="value">{{regexNum(mainData.shuiDianSS)}}<span>{{unit}}</span></div>
          <div v-else  class="value gray">-</div>
          <!-- <p>环比 - </p> -->
        </div>
        <div class="flexItem_2">
          <p>收缴率</p>
          <div v-if="filterVal(mainData.shuiDianGetRate)" class="value">{{regexNum(mainData.shuiDianGetRate)}}<span>%</span></div>
          <div v-else  class="value gray">-</div>
          <!-- <p>环比 - </p> -->
        </div>
        <div class="flexItem_2">
          <p>生成记录</p>
          <div v-if="filterVal(mainData.shuiDianNum)" class="value">{{regexNum(mainData.shuiDianNum)}}<span>条</span></div>
          <div v-else  class="value gray">-</div>
          <!-- <p>环比 - </p> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
import {  getUrlParam,regexNum } from '@/utils/common'

export default {
  data() {
    return {
      orgId: '',
      orgType: '',
      mainData: {},
      mainDataTotal: 0,
      tableList: [],
    };
  },
  props:{
    unit: {
      type: String,
      default: '万'
    },
    tab:{
      type: String,
      default: 'month'
    }
  },
  filters:{
    changeVal(val){
      return val&&parseFloat(val)>0  ? regexNum(val) : '-' 
    }
  },
  watch: {
    '$store.state.orgId': function (newVal, oldVal) {
      this.init();
    },
    'tab':function(val){
        this.init();
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    regexNum,
    // 判断值是否为空或者大于0
    filterVal(val){
      return val&&parseFloat(val)>0 
    },
    init() {
      this.orgId = getUrlParam('chooseOrgId') || getUrlParam('orgId') || getLocalStorage('orgId').orgId;
      this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType;

      this.getMainData()
    },
    // 水电费
    getMainData(){
      this.mainData = {}
      request({
        url: '/app-api/healthlife/business/getShoufeiData',
        method: 'get',
        params: {
          buGuid: this.orgId,
          queryPeriodType: this.tab
        }
      }).then(({ data }) => {
        if (data.code === 0) {
          this.mainData = data.data ? data.data : {}
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
