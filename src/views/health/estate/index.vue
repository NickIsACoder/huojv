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
          <li v-eventlisten="{isChangePage:false,pageEvent:'点击年'}" @click="changeTopTab('年度')" :class="[tab == '年度' ? 'active' : '']">
            <label>年</label>
          </li>
          <li v-eventlisten="{isChangePage:false,pageEvent:'点击季'}" @click="changeTopTab('季度')" :class="[tab == '季度' ? 'active' : '']">
            <label>季</label>
          </li>
          <li v-eventlisten="{isChangePage:false,pageEvent:'点击月'}" @click="changeTopTab('月度')" :class="[tab == '月度' ? 'active' : '']">
            <label>月</label>
          </li>
          <li v-eventlisten="{isChangePage:false,pageEvent:'点击日'}" @click="changeTopTab('当天')" :class="[tab == '当天' ? 'active' : '']">
            <label>日</label>
          </li>
        </ul>
        <div class="data-content-panel p-l-r-15 pt-15 mt-50">
          <div class="flexContent">
            <p class="flexTitle">项目情况</p>
            <div class="flexItemBox">
              <div class="flexItem">
                <p>在管项目数</p>
                <div class="value" v-if="filterVal(projectStatus.projectNum)">{{projectStatus.projectNum| changeVal}}<span>个</span></div>
                <div class="value gray" v-else>-</div>
                <p v-if="filterVal(projectStatus.zjprojectNum)">自营 {{projectStatus.zjprojectNum| changeVal}}个</p>
                <p v-else>自营 -</p>
                <p v-if="filterVal(projectStatus.wtprojectNum)">外拓 {{projectStatus.wtprojectNum| changeVal}}个</p>
                <p v-else>外拓 -</p>
              </div>
              <div class="flexItem">
                <p>在管面积</p>
                <div class="value" v-if="filterVal(projectStatus.buildArea,'squareTenThousand')">{{projectStatus.buildArea|changeVal('squareTenThousand')}}<span>万m²</span></div>
                  <div class="value gray" v-else>-</div>
                  <p v-if="filterVal(projectStatus.zjbuildArea,'squareTenThousand')">自营 {{projectStatus.zjbuildArea|changeVal('squareTenThousand')}}万m²</p>
                  <p v-else>自营 -</p>
                  <p v-if="filterVal(projectStatus.wtbuildArea,'squareTenThousand')">外拓 {{projectStatus.wtbuildArea|changeVal('squareTenThousand')}}万m²</p>
                  <p v-else>外拓 -</p>
              </div>
              <div class="flexItem">
                <p>在管户数</p>
                <div class="value" v-if="filterVal(projectStatus.hushu)">{{projectStatus.hushu| changeVal}}<span>户</span></div>
                <div class="value gray" v-else>-</div>
                <p v-if="filterVal(projectStatus.zijianhushu)">自营 {{projectStatus.zijianhushu|changeVal}}户</p>
                <p v-else>自营 -</p>
                <p v-if="filterVal(projectStatus.waituohushu)">外拓 {{projectStatus.waituohushu|changeVal}}户</p>
                <p v-else>外拓 -</p>
              </div>
            </div>
          </div>
          <div class="flexContent">
            <p class="flexTitle">管理费</p>
            <div class="flexItemBox">
              <div class="flexItem_3">
                <p>本期应收</p>
                <div class="value" v-if="filterVal(managementFee.manageFeeYS,'amountTenThousand')">{{managementFee.manageFeeYS|changeVal('amountTenThousand')}}<span>万</span></div>
                <div class="value gray" v-else>-</div>
              </div>
              <div class="flexItem_3">
                <p>本期实收</p>
                <div class="value" v-if="filterVal(managementFee.manageFeeSS,'amount')">{{managementFee.manageFeeSS|changeVal('amount')}}<span>{{unit}}</span></div>
                <div class="value gray" v-else>-</div>
              </div>
              <div class="flexItem_3">
                <p>本期收缴率</p>
                <div class="value" v-if="filterVal(managementFee.manageRate,'percentage')">{{managementFee.manageRate|changeVal('percentage')}}<span>%</span></div>
                <div class="value gray" v-else>-</div>
              </div>
              <div class="flexItem_3">
                <p>往年应收未收</p>
                <div class="value" v-if="filterVal(managementFee.manageFeeWNYS,'amountTenThousand')">{{managementFee.manageFeeWNYS|changeVal('amountTenThousand')}}<span>万</span></div>
                <div class="value gray" v-else>-</div>
              </div>
              <div class="flexItem_3">
                <p>本期清欠</p>
                <div class="value" v-if="filterVal(managementFee.manageFeeWNSS,'amount')">{{managementFee.manageFeeWNSS|changeVal('amount')}}<span>{{unit}}</span></div>
                <div class="value gray" v-else>-</div>
              </div>
              <div class="flexItem_3">
                <p>本期清欠率</p>
                <div class="value" v-if="filterVal(managementFee.manageWNRate,'percentage')">{{managementFee.manageWNRate|changeVal('percentage')}}<span>%</span></div>
                <div class="value gray" v-else>-</div>
              </div>
            </div>
          </div>
          <div class="flexContent">
            <p class="flexTitle">营业利润</p>
            <div class="flexItemBox">
              <div class="flexItem">
                <p>收缴率</p>
                <div class="value">-</div>
                <!-- <p>环比 - </p> -->
              </div>
              <div class="flexItem">
                <p>营业收入</p>
                <div class="value">-</div>
                <!-- <p>环比 - </p> -->
              </div>
              <div class="flexItem">
                <p>营业利润</p>
                <div class="value">-</div>
                <!-- <p>环比 - </p> -->
              </div>
            </div>
          </div>
          <div class="flexContent">
            <p class="flexTitle">满意度</p>
            <div class="flexItemBox">
              <div class="flexItem">
                <p>客户满意度</p>
                <div class="value">-</div>
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
                <span 
                v-eventlisten="{isChangePage:false,pageEvent:'点击-'+item.name}"
                >{{item.name}}</span>
              </div>
            </van-tab>
          </van-tabs>
          <charge v-if="actTab==2" :unit="unit" :managementFee="managementFee" :tab="tab" />
        </div>
        
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import scrollFixed from '@/mixin/scroll-fixed';
import { getLocalStorage } from '@/utils/local-storage';
import { getUrlParam,regexNum } from '@/utils/common';
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
      tab: '年度',
      unit: '万',
      actTab: 0,
      tabList: [
        { name: '满意度', disabled: true },
        { name: '军令状', disabled: true },
        { name: '收费管理', disabled: false },
        { name: '资源管理', disabled: true },
        { name: '报事报修', disabled: true },
        { name: '投诉管理', disabled: true },
        { name: '多种经营', disabled: true },
        { name: '人力行政', disabled: true },
        { name: '车位管理', disabled: true },
      ],
      managementFee: {},
      projectStatus: {},
    };
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
    }
  },
  computed: {
    ...mapState({
      authList: state => state.authList
    })
  },
  created() {
    this.tabList[2].disabled = !this.authList.includes('app-wy-sfgl-tab')
  },
  mounted () {
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
    reloadWindow () {
      setTimeout(() => {
        window.location.reload();
        this.isLoading = false;
      }, 500)
    },
    init () {
      this.orgId = getUrlParam('chooseOrgId') || getUrlParam('orgId') || getLocalStorage('orgId').orgId;
      this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType;
      
      this.getManagementFee()
      this.getProjectStatus()
    },
    // 修改年月日
    changeTopTab(type){
      this.tab = type
      this.unit = type=='当天'?'元':'万'
      this.getManagementFee()
      this.getProjectStatus()
    },
    // 管理费
    getManagementFee(){
      request({
        url: '/app-api/healthlife/property/getManagementFee',
        method: 'post',
        data: {
          orgId: this.orgId,
          queryPeriod: this.tab
        }
      }).then(({ data }) => {
        if (data.code === 0) {
          this.managementFee = data.data ? data.data : {}
          this.managementFee.ttt = this.tab
        }
      }).catch((e) => {
        console.log('getManagementFee-err', e);
      });
    },
    // 项目情况
    getProjectStatus(){
      request({
        url: '/app-api/healthlife/property/getProjectStatus',
        method: 'post',
        data: {
          orgId: this.orgId,
        }
      }).then(({ data }) => {
        if (data.code === 0) {
          this.projectStatus = data.data ? data.data : {}
        }
      }).catch((e) => {
        console.log('getProjectStatus-err', e);
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
