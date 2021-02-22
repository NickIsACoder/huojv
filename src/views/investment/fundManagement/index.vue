<template>
  <div class="report-index pb-20">
    <van-pull-refresh v-model="isLoading" success-text="刷新成功" loading-text="正在刷新..." @refresh="reloadWindow()">
      <div>
        <div class="data-content-panel pd-t20-l16 mt-15">
          <div class="flexContent">
            <p class="flexTitle">累计发行及募集情况</p>
            <div class="flexItemBox">
              <div class="flexItem0">
                <p>累计发行产品期数</p>
                <div class="value0" v-if="filterVal(aninvestSummary, 'issueproductcnt')">
                  {{aninvestSummary.issueproductcnt|changeVal}}
                  <span>期</span>
                </div>
                <div class="value gray" v-else>-</div>
              </div>
              <div class="flexItem0">
                <p>累计募集金额</p>
                <div class="value0" v-if="filterVal(aninvestSummary,'raiseamount')">
                  {{aninvestSummary.raiseamount|changeVal}}
                  <span>亿</span>
                </div>
                <div class="value gray" v-else>-</div>
              </div>
              <div class="flexItem0">
                <p>累计募资投资者</p>
                <div class="value0" v-if="filterVal(aninvestSummary,'raiseinvestorcnt')">
                  {{aninvestSummary.raiseinvestorcnt|changeVal}}
                  <span>位</span>
                </div>
                <div class="value gray" v-else>-</div>
              </div>
            </div>
          </div>
          <div class="flexContent">
            <p class="flexTitle">存续发行及募集情况</p>
            <div class="flexItemBox">
              <div class="flexItem0">
                <p>存续产品期数</p>
                <div class="value0" v-if="filterVal(aninvestSummary,'durationproductcnt')">
                  {{aninvestSummary.durationproductcnt|changeVal}}
                  <span>期</span>
                </div>
                <div class="value gray" v-else>-</div>
              </div>
              <div class="flexItem0">
                <p>截止目前存续金额</p>
                <div class="value0" v-if="filterVal(aninvestSummary,'durationamount')">
                  {{aninvestSummary.durationamount|changeVal}}
                  <span>亿</span>
                </div>
                <div class="value gray" v-else>-</div>
              </div>
              <div class="flexItem0">
                <p>投资者</p>
                <div class="value0" v-if="filterVal(aninvestSummary,'durationinvestorcnt')">
                  {{aninvestSummary.durationinvestorcnt |changeVal}}
                  <span>位</span>
                </div>
                <div class="value gray" v-else>-</div>
              </div>
            </div>
          </div>
          <div class="flexContent">
            <p class="flexTitle">业绩达成情况</p>
            <div class="flexItemBox">
              <div class="flexItem0">
                <p>{{year}}军令状目标</p>
                <div class="value0" v-if="filterVal(aninvestSummary,'militaryorderamount')">
                  {{aninvestSummary.militaryorderamount |changeVal}}
                  <span>亿</span>
                </div>
                <div class="value gray" v-else>-</div>
              </div>
              <div class="flexItem0">
                <p>截至目前已完成</p>
                <div class="value0" v-if="filterVal(aninvestSummary,'achievedamount')">
                  {{aninvestSummary.achievedamount |changeVal}}
                  <span>亿</span>
                </div>
                <div class="value gray" v-else>-</div>
              </div>
              <div class="flexItem0">
                <p>完成率</p>
                <div class="value0" v-if="filterVal(aninvestSummary,'achievedrate')">
                  {{aninvestSummary.achievedrate |changeVal}}
                  <span>%</span>
                </div>
                <div class="value gray" v-else>-</div>
              </div>
            </div>
          </div>
        </div>
        <div class="data-content-panel mt-15">
          <van-tabs v-model="actTab" color="#209B5C" line-width="30px" :ellipsis="false" title-active-color="#209B5C">
            <van-tab
              v-for="(item,index) in tabList"
              :title="item.name"
              :disabled="item.disabled"
              :key="index"
              title-style="margin:0 5px"
            >
              <div slot="title">
                <span v-eventlisten="{isChangePage:false,pageEvent:'点击-'+item.name}">{{item.name}}</span>
              </div>
            </van-tab>
          </van-tabs>
          <Raise v-if="actTab==0" :aninvestSummaryData="aninvestSummary" />
          <Cast v-else-if="actTab==1" :aninvestSummaryData="aninvestSummary" />
          <Retreat v-else-if="actTab==3" :aninvestSummaryData="aninvestSummary" />
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import scrollFixed from '@/mixin/scroll-fixed';
import { getLocalStorage } from '@/utils/local-storage';
import { getUrlParam, regexNum } from '@/utils/common';
import { Icon, PullRefresh, Sticky, Tab, Tabs } from 'vant';
import request from '@/utils/request';
import Raise from './components/raise';
import Cast from './components/cast';
import Retreat from './components/retreat';

export default {
  mixins: [scrollFixed],
  data() {
    return {
      isLoading: false,
      orgType:
        getUrlParam('chooseOrgType') ||
        getUrlParam('orgType') ||
        getLocalStorage('orgType').orgType,
      actTab: 0,
      tabList: [
        { name: '募', disabled: false },
        { name: '投', disabled: false },
        { name: '管', disabled: true },
        { name: '退', disabled: false },
      ],
      aninvestSummary: {},
      year:'',
    };
  },
  components: {
    [Icon.name]: Icon,
    [PullRefresh.name]: PullRefresh,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    Raise,
    Cast,
    Retreat,
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
  watch: {
    '$store.state.orgId': function (newVal, oldVal) {
      this.init();
    },
    actTab(val) {
      sessionStorage.setItem('fmTab', val)
    }
  },
  mounted() {
    this.year = new Date().getFullYear();
    this.init();
    this.actTab = Number(sessionStorage.getItem('fmTab')) || 0
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
    reloadWindow() {
      setTimeout(() => {
        window.location.reload();
        this.isLoading = false;
      }, 500);
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
      this.getAninvestSummary();
    },
    // 顶部汇总数据
    getAninvestSummary() {
      request({
        url: '/app-api/investmentGroup/aninvestSummary',
        method: 'get',
        params: {
          orgId: this.orgId,
        },
      })
        .then(({ data }) => {
          if (data.code === 0) {
            this.aninvestSummary = data.data ? data.data : {};
          }
        })
        .catch((e) => {
          console.log('getAninvestSummary-err', e);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.pd-t20-l16 {
  padding: 20px 0 0 16px;
  box-sizing: border-box;
}
.huojv-tabs li {
  width: 25%;
}
.data-content-panel {
  background: white;
}
.data-content-panel p {
  margin: 0;
}
</style>
