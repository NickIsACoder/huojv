<template>
  <div class="report-index pb-20">
    <van-tabs
      v-model="timeTab"
      color="#209B5C"
      line-width="30px"
      :ellipsis="false"
      title-active-color="#209B5C"
      @change="changeTime"
      >
        <van-tab v-for="(item,index) in tabListTime" :title="item.name" :disabled="item.disabled" :key="index" title-style="margin:0 5px">
          <div slot="title">
            <span v-eventlisten="{isChangePage:false,pageEvent:'点击-'+item.name}">{{item.name}}</span>
          </div>
        </van-tab>
      </van-tabs>
    <van-tabs
    v-model="actTab"
    color="#209B5C"
    line-width="30px"
    :ellipsis="false"
    title-active-color="#209B5C"
    @change="changeActTab"
    >
      <van-tab v-for="(item,index) in tabList" :title="item.name" :disabled="item.disabled" :key="index" title-style="margin:0 5px">
        <div slot="title">
          <span v-eventlisten="{isChangePage:false,pageEvent:'点击-'+item.name}">{{item.name}}</span>
        </div>
      </van-tab>
    </van-tabs>
    <van-pull-refresh v-model="isLoading" success-text="刷新成功" loading-text="正在刷新..." @refresh="reloadWindow()">
      <div>
        <div class="main-content mt-15">
          <div class="data-content-panel">
            <div class="data-title-box mt-5">
              <img class="title-ico" src="../../../assets/images/ic_topfive@2x.png" />
              <span class="title">前五龙虎榜</span>
            </div>
            <el-table stripe class="huo-list-table main-theme-table" size="mini" highlight-current-row ref="dataTable1" :data="frontList">
              <el-table-column type="index" label="排名" align="center" width="40">
                <template slot-scope="scope">
									<label :class="{'no-1-ico':scope.row.index === 1,'no-2-ico':scope.row.index === 2,'no-3-ico':scope.row.index === 3}"
									       v-text="scope.row.index > 3 ? scope.row.index : ''"></label>
								</template>
              </el-table-column>
              <el-table-column prop="buName" label="项目"></el-table-column>
              <el-table-column prop="rate" :label="actTab==0?'出租率(面积)':'收缴率'" align="center" width="90">
                <template slot-scope="scope">
                  <span v-if="actTab==0">{{scope.row.rentOutRate|| '-'}}%</span>
                  <span v-else-if="actTab==1">{{scope.row.totalGetRate|| '-'}}%</span>
								</template>
              </el-table-column>
              <el-table-column prop="dutyPerson" label="负责人" align="center" width="80"></el-table-column>
            </el-table>
          </div>
        </div>
        <div class="main-content mt-15">
          <div class="data-content-panel">
            <!-- 标题 -->
            <div class="data-title-box mt-5">
              <img class="title-ico" src="../../../assets/images/ic_laterfive@2x.png" />
              <span class="title">后五龙虎榜</span>
            </div>
            <el-table stripe class="huo-list-table main-theme-table" size="mini" highlight-current-row ref="dataTable2" :data="backList">
              <el-table-column type="index" label="排名" align="center" width="40">
                <template slot-scope="scope">
									<label class="last5-ico" v-text="scope.row.index"></label>
								</template>
              </el-table-column>
              <el-table-column prop="buName" label="项目"></el-table-column>
              <el-table-column prop="rate" :label="actTab==0?'出租率(面积)':'收缴率'" align="center" width="90">
                <template slot-scope="scope">
									<span v-if="actTab==0">{{scope.row.rentOutRate|| '-'}}%</span>
                  <span v-else-if="actTab==1">{{scope.row.totalGetRate|| '-'}}%</span>
								</template>
              </el-table-column>
              <el-table-column prop="dutyPerson" label="负责人" align="center" width="80"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import scrollFixed from '@/mixin/scroll-fixed';
import { List, PullRefresh, Toast, Icon, Tab, Tabs } from 'vant';
import { getLocalStorage } from '@/utils/local-storage';
import { openLoading, closeLoading, getUrlParam } from '@/utils/common';
import request from '@/utils/request';

export default {
  mixins: [scrollFixed],
  data() {
    return {
      size: 5,
      current: 1,
      frontList: [],
      backList: [],
      isLoading: false,
      actTab: 0,
      tabList: [
        { name: '出租率(面积)', disabled: false },
        { name: '收缴率', disabled: false },
      ],
      tabListTime: [
        { name: '年', disabled: false },
        { name: '季', disabled: false },
        { name: '月', disabled: false },
      ],
      timeTab: 0
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
    //   $('.el-table__header-wrapper').scroll(function () {
    //     let scrollLeft = $(this).scrollLeft();
    //     $(this).next().scrollLeft(scrollLeft);
    //   });

    //   $('.el-table__fixed-body-wrapper').scroll(function () {
    //     let scrollTop = $(this).scrollTop();
    //     $(this).parent().prev().scrollTop(scrollTop);
    //   });
    });
  },
  methods: {
    reloadWindow() {
      setTimeout(() => {
        window.location.reload();
        this.isLoading = false;
      }, 500);
    },
    init() {
      this.orgId = getUrlParam('chooseOrgId') || getUrlParam('orgId') || getLocalStorage('orgId').orgId;
      this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType;
      
      this.setFrontTableData();
      this.setBackTableData();
    },
    changeTime(tab){
      this.timeTab = tab
      this.init();
    },
    // 前5
    setFrontTableData() {

      // let _type = 0
      // if (this.actTab==1) {
      //   _type = 1
      // } else if (this.actTab==2) {
      //   _type = 0
      // }

      request({
        url: `/app-api/healthlife/business/getDragonTigerDataList`,
        method: 'get',
        params: {
          buGuid: this.orgId,
          current: this.current,
          sortType: 'DESC',
          queryPeriodType: [2, 3, 4, 5][this.timeTab],
          size: 5,
          sortColumn: ['RentOutRate', 'TotalGetRate'][this.actTab] //出租率(面积):RentOutRate,收缴率:TotalGetRate
        },
      })
        .then(({ data }) => {
          if (data.code === 0) {
            this.frontList = data.data.records;
            this.frontList.forEach((item, index) => {
              item.index = index + 1;
            });
          }
        })
        .catch((e) => {
          console.log('getBoardData-err', e);
        });
    },
    // 后5
    setBackTableData(type) {
      // let _type = 0
      // if (this.actTab==1) {
      //   _type = 1
      // } else if (this.actTab==2) {
      //   _type = 0
      // }
      request({
        url: `/app-api/healthlife/business/getDragonTigerDataList`,
        method: 'get',
        params: {
          buGuid: this.orgId,
          current: this.current,
          sortType: 'ASC',
          queryPeriodType: [2, 3, 4, 5][this.timeTab],
          size: 5,
          sortColumn: ['RentOutRate', 'TotalGetRate'][this.actTab] //出租率(面积):RentOutRate,收缴率:TotalGetRate
        },
      })
        .then(({ data }) => {
          if (data.code === 0) {
            this.backList = data.data.records;
            this.backList.forEach((item, index) => {
              item.index = index + 1;
            });
          }
        })
        .catch((e) => {
          console.log('getBoardData-err', e);
        });
    },
    changeActTab(idx) {
      this.actTab = idx
      this.init()
    },
  },

  components: {
    [List.name]: List,
    [PullRefresh.name]: PullRefresh,
    [Icon.name]: Icon,
    Toast,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
  },
};
</script>

<style lang="scss" scoped>
.timeBox{
  padding-top: 10px;
  display: flex;
  justify-content: space-around;
  background: white;
  font-size: 12px;
  .timeBoxItem{
    display: flex;
    justify-content: center;
    -webkit-box-flex: 1;
    -webkit-flex:1;
    flex: 1;
    cursor: pointer;
    &.active span{
      color: #006E38;
      border-bottom: 1px solid #006E38;
      padding-bottom: 1px;
    }
  }
}
</style>
