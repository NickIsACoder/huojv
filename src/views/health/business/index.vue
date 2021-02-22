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
          <li :style="orgType <= 2 ? '' : 'width: 33.3%'" v-eventlisten="{isChangePage:false,pageEvent:'点击年'}" @click="changeTopTab('2')" :class="[tab == '2' ? 'active' : '']">
            <label>年</label>
          </li>
          <li :style="orgType <= 2 ? '' : 'width: 33.3%'" v-eventlisten="{isChangePage:false,pageEvent:'点击季'}" @click="changeTopTab('3')" :class="[tab == '3' ? 'active' : '']">
            <label>季</label>
          </li>
          <li :style="orgType <= 2 ? '' : 'width: 33.3%'" v-eventlisten="{isChangePage:false,pageEvent:'点击月'}" @click="changeTopTab('4')" :class="[tab == '4' ? 'active' : '']">
            <label>月</label>
          </li>
          <li v-if="orgType <= 2" v-eventlisten="{isChangePage:false,pageEvent:'点击日'}" @click="changeTopTab('5')" :class="[tab == '5' ? 'active' : '']">
            <label>日</label>
          </li>
        </ul>
        <div class="data-content-panel p-l-r-15 pt-15 mt-50">
          <div class="flexContent">
            <p class="flexTitle">项目情况</p>
            <div class="flexItemBox">
              <div class="flexItem_2">
                <p>在管项目数</p>
                <div v-if="filterVal(mainData.projNum)" class="value">{{regexNum(mainData.projNum)}}<span>个</span></div>
                <div v-else  class="value gray">-</div>
              </div>
              <div class="flexItem_2">
                <p>在管面积</p>
                <div v-if="filterVal(mainData.manageArea)" class="value">{{regexNum(mainData.manageArea)}}<span>万m²</span></div>
                <div v-else  class="value gray">-</div>
              </div>
              <div class="flexItem_2">
                <p>资产建筑面积</p>
                <div v-if="filterVal(mainData.buildArea)" class="value">{{regexNum(mainData.buildArea)}}<span>万m²</span></div>
                <div v-else  class="value gray">-</div>
              </div>
              <div class="flexItem_2">
                <p>资产签约面积</p>
                <div v-if="filterVal(mainData.contractArea)" class="value">{{regexNum(mainData.contractArea)}}<span>万m²</span></div>
                <div v-else  class="value gray">-</div>
              </div>
            </div>
          </div>
          <div class="flexContent">
            <p class="flexTitle">营业收入</p>
            <div class="flexItemBox">
              <div class="flexItem_3">
                <p>经营收入</p>
                <div v-if="filterVal(mainData.operateIncome)" class="value">{{regexNum(mainData.operateIncome)}}<span>{{unit}}</span></div>
                <div v-else  class="value gray">-</div>
              </div>
              <div class="flexItem_3">
                <p>净利润额</p>
                <div class="value">--</div>
              </div>
              <div class="flexItem_3">
                <p>租金收缴率</p>
                <div v-if="filterVal(mainData.rentGetRate)" class="value">{{regexNum(mainData.rentGetRate)}}<span>%</span></div>
                <div v-else  class="value gray">-</div>
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
            </div>
          </div>
          <div class="flexContent">
            <p class="flexTitle">招商情况</p>
            <div class="flexItemBox">
              <div class="flexItem">
                <p>营运出租率</p>
                <div v-if="filterVal(mainData.rentOutRate)" class="value">{{regexNum(mainData.rentOutRate)}}<span>%</span></div>
                <div v-else  class="value gray">-</div>
              </div>
              <div class="flexItem">
                <p>筹备招商率</p>
                <div class="value">--</div>
              </div>
              <div class="flexItem">
                <p>租费坪效</p>
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
            </van-tab>
          </van-tabs>
          <charge v-if="actTab==4" :unit="unit" :tab="tab" />
        </div>
        
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import scrollFixed from '@/mixin/scroll-fixed';
import { getLocalStorage } from '@/utils/local-storage';
import { getUrlParam, regexNum } from '@/utils/common';
import { Icon, PullRefresh, Sticky, Tab, Tabs } from 'vant';
import request from '@/utils/request';
import ic_fall from '@/assets/images/ic_fall@2x.png'
import ic_rise from '@/assets/images/i_r_t.png'
import charge from './components/charge'

export default {
  mixins: [scrollFixed],

  data () {
    return {
      isLoading: false,
      icFall: ic_fall,
      icRise: ic_rise,
      orgType: getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType,
      tab: '2',
      unit: '万',
      actTab: 0,
      tabList: [
        { name: "军令状", disabled: true },
        { name: "资源管理", disabled: true },
        { name: "招商管理", disabled: true },
        { name: "营运管理", disabled: true },
        { name: "收费管理", disabled: false },
        { name: "多经管理", disabled: true },
        { name: "财务管理", disabled: true },
        { name: "企划活动", disabled: true },
        { name: "工程报修", disabled: true },
      ],
      mainData: {},
    };
  },
  filters:{
    changeVal(val){
      return val&&parseFloat(val)>0  ? regexNum(val) : '-' 
    }
  },
  computed: {
    ...mapState({
      authList: state => state.authList
    })
  },
  watch: {
    '$store.state.orgId': function (newVal, oldVal) {
      this.init();
    }
  },
  created() {
    this.tabList[4].disabled = !this.authList.includes('app-sg-sfgl-tab')
  },
  mounted () {
    this.init();
  },
  methods: {
    regexNum,
    reloadWindow () {
      setTimeout(() => {
        window.location.reload();
        this.isLoading = false;
      }, 500)
    },
    // 判断值是否为空或者大于0
    filterVal(val){
      return val&&parseFloat(val)>0 
    },
    init () {
      this.orgId = getUrlParam('chooseOrgId') || getUrlParam('orgId') || getLocalStorage('orgId').orgId;
      this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType;
      
      this.getMainData()
    },
    // 修改年月日
    changeTopTab(type){
      this.tab = type
      this.unit = type=='5'?'元':'万'
      this.init();
    },
    // 
    getMainData(){
      this.mainData = {}
      request({
        url: '/app-api/healthlife/business/info',
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
        console.log('getMainData-err', e);
      });
    },
  },

  components: {
    [Icon.name]: Icon,
    [PullRefresh.name]: PullRefresh,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    charge,
  }
};
</script>

<style lang="scss" scoped>
.huojv-tabs li{
  width: 25%;
}
.data-content-panel{
  background: white;
}
.data-content-panel p{
  margin: 0;
}
</style>
