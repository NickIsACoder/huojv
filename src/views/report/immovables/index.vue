<template>
  <div class="report-index pb-20">
    <van-pull-refresh
      v-model="isLoading"
      success-text="刷新成功"
      loading-text="正在刷新..."
      @refresh="reloadWindow()"
    >
      <div>
        <ul class="huojv-tabs fixed-tabs">
          <li v-eventlisten="{isChangePage:false,pageEvent:'点击年度'}" @click="changeTopTab(0)" :class="[tab == 0 ? 'active' : '']">
            <label>年</label>
          </li>
          <li v-eventlisten="{isChangePage:false,pageEvent:'点击季度'}" @click="changeTopTab(1)" :class="[tab == 1 ? 'active' : '']">
            <label>季</label>
          </li>
          <li v-eventlisten="{isChangePage:false,pageEvent:'点击月度'}" @click="changeTopTab(2)" :class="[tab == 2 ? 'active' : '']">
            <label>月</label>
          </li>
        </ul>
        <div class="data-content-panel p-l-r-15 pt-15 mt-50 white-bg">
          <div class="flexContent">
            <p class="flexTitle">项目概况</p>
            <div class="flexItemBox">
              <div class="flexItem">
                <p>项目</p>
                <div class="value" v-html="filterValInMinix(projectInfo.projNum, '个')"></div>
              </div>
              <div class="flexItem">
                <p>面积</p>
                <div class="value" v-html="filterValInMinix(projectInfo.buildArea,'㎡')"></div>
              </div>
              <div class="flexItem">
                <p>投入成本</p>
                <div class="value" v-html="filterValInMinix(projectInfo.investCost, '万元')"></div>
              </div>
            </div>
          </div>
          <div class="flexContent">
            <p class="flexTitle">营运指标</p>
            <div class="flexItemBox">
              <div class="flexItem_3">
                <p>出租率</p>
                <div class="value">--</div>
                <!-- <div class="value" v-html="filterValInMinix(projectInfo.occrate, '%')"></div> -->
              </div>
              <div class="flexItem_3">
                <p>NOI</p>
                <div class="value">--</div>
                <!-- <div class="value" v-html="filterValInMinix(projectInfo.yieldRate, '%')"></div> -->
              </div>
              <div class="flexItem_3">
                <p>NPI</p>
                <div class="value">--</div>
                <!-- <div class="value" v-html="filterValInMinix(projectInfo.ebit, '万')"></div> -->
              </div>
              <div class="flexItem_3">
                <p>净利润</p>
                <div class="value">--</div>
                <!-- <div class="value" v-html="filterValInMinix(projectInfo.ebitda, '万')"></div> -->
              </div>
              <div class="flexItem_3">
                <p>Cap Rate</p>
                <div class="value">--</div>
                <!-- <div class="value" v-html="filterValInMinix(projectInfo.ebitdarate, '%')"></div> -->
              </div>
            </div>
            <div class="flexItemBox">
              <div class="flexItem_3">
                <p>收益率</p>
                <div class="value">--</div>
              </div>
              <div class="flexItem_3">
                <p>EBIT</p>
                <div class="value">--</div>
              </div>
              <div class="flexItem_3">
                <p>EBITDA</p>
                <div class="value">--</div>
              </div>
              <div class="flexItem_3">
                <p>EBITDA利润率</p>
                <div class="value">--</div>
              </div>
              <div class="flexItem_3">
                <p>EBITDA-U</p>
                <div class="value">--</div>
              </div>
            </div>
          </div>
        </div>
        <div class="data-content-panel mt-15">
          <van-tabs
            v-model="actTab"
            color="#209B5C"
            line-width="30px"
            :ellipsis="false"
            title-active-color="#209B5C"
          >
            <van-tab v-for="(item,index) in tabList" :title="item.name" :disabled="item.disabled" :key="index" title-style="margin:0 5px">
              <div slot="title">
                <span v-eventlisten="{isChangePage:false,pageEvent:'点击-'+item.name}">{{item.name}}</span>
              </div>
              <template v-if="actTab==0">
                <business v-if="orgType<=5" :tab='tab' />
                <businessProjectLevel v-else :tab='tab' />
              </template>
            </van-tab>
          </van-tabs>
        </div>
        
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import scrollFixed from '@/mixin/scroll-fixed';
import request from '@/utils/request';
import {  getUrlParam } from '@/utils/common';
import { PullRefresh, Tab, Tabs } from 'vant';
import $ from 'jquery';
import business from './components/business'
import businessProjectLevel from './components/businessProjectLevel'

export default {
  mixins: [scrollFixed],

  data() {
    return {
      orgType: 2,
      isLoading: false,
      tab: 0,
      queryPeriodList: ['年度','季度','月度','日'],
      projectInfo: {},
      actTab: -1,
      tabList: [
        { name: '商业', disabled: false },
        { name: '酒店', disabled: true },
        { name: '公寓', disabled: true },
        { name: '写字楼', disabled: true },
        { name: '产业园', disabled: true },
        { name: '会所', disabled: true },
        { name: '运动场馆', disabled: true },
        { name: '公建配套', disabled: true },
        { name: '文旅项目', disabled: true },
      ],
    };
  },
  watch: {
    '$store.state.orgId': function (newVal, oldVal) {
      this.init();
    },
  },
  mounted() {
    this.init()
    this.$nextTick(() => {
      // $('.el-table__header-wrapper').scroll(function () {
      //   let scrollLeft = $(this).scrollLeft();
      //   $(this).next().scrollLeft(scrollLeft);
      // });

      // $('.el-table__fixed-body-wrapper').scroll(function () {
      //   let scrollTop = $(this).scrollTop();
      //   $(this).parent().prev().scrollTop(scrollTop);
      // });
    });
  },

  methods: {
    reloadWindow () {
      setTimeout(() => {
        window.location.reload();
        this.isLoading = false;
      }, 500)
    },
    init(){
      this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType
      this.orgId = getUrlParam('chooseOrgId') || getUrlParam('orgId') || getLocalStorage('orgId').orgId
      this.actTab = 0
      this.projectInfo = {}

      this.getInfo()
    },
    changeTopTab(idx){
      this.tab = idx

      this.getInfo()
    },
    // 项目概况 
    getInfo(){
      request({
        url: `/app-api/realEstate/getInfo`,
        method: 'get',
        params: {
          orgId: this.orgId,
          queryPeriod: this.queryPeriodList[this.tab]
        },
      }).then(({ data }) => {
        if (data.code === 0) {
          this.projectInfo = data.data||{}
        }
      });
    }
  },

  components: {
    [PullRefresh.name]: PullRefresh,
    [Tabs.name]: Tabs,
    [Tab.name]: Tab,
    business,
    businessProjectLevel
  },
};
</script>


<style lang="scss" scoped>
.flexContent .flexItemBox{
  padding: 15px 0;
}
</style>
