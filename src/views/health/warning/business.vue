<template>
  <div class="report-index pb-20">
    <van-sticky :offset-top="0">
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
    </van-sticky>
    <van-pull-refresh
      v-model="isLoading"
      success-text="刷新成功"
      loading-text="正在刷新..."
      @refresh="reloadWindow()"
    >
      <div class="main-content mt-15">
        <div class="data-content-panel pt-15">
          <div class="list-data1">
            <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" >
              <el-table stripe
                class="huo-list-table main-theme-table huojv-data-list not-hide-text" size="mini" highlight-current-row :data="dataList">
                <el-table-column type="index" label="排名" align="center" width="50"></el-table-column>
                <el-table-column prop="buName" label="项目" align="center"></el-table-column>
                <el-table-column :label="actTab==0?'金额(万)':'金额(万)'" align="center" width="70">
                  <template slot-scope="scope">
                    <label v-if="actTab==0" v-text="(scope.row.rentQF || '-')"></label>
                    <label v-else v-text="(scope.row.manageFeeQF || '-')"></label>
                  </template>
                </el-table-column>
                <el-table-column prop="dutyPerson" label="负责人" align="center" width="80"></el-table-column>
              </el-table>
            </van-list>
          </div>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import scrollFixed from '@/mixin/scroll-fixed';
import { List, PullRefresh, Toast,Sticky, Tab, Tabs  } from 'vant';
import { getLocalStorage } from '@/utils/local-storage';
import $ from 'jquery';
import request from '@/utils/request';

export default {
  mixins: [scrollFixed],

  data() {
    return {
      tab1: 1,
      loading: false,
      isLoading: false,
      finished: false,
      isLoad: false,
      size: 20,
      current: 1,
      actTab: 0,
      tabList: [
        { name: '租金欠缴', disabled: false },
        { name: '管理费欠缴', disabled: false },
      ],

      dataList: [],
      sortColumn: '',
      sortType: 'DESC',
      tabListTime: [
        { name: '年', disabled: false },
        { name: '季', disabled: false },
        { name: '月', disabled: false },
      ],
      timeTab: 0
    };
  },

  computed: {
    ...mapState({
      orgId: (state) => state.orgId || getLocalStorage(['orgId']).orgId,
    }),
  },

  mounted() {
    // this.init();
    this.$nextTick(() => {

      $('.el-table__header-wrapper').scroll(function () {
        let scrollLeft = $(this).scrollLeft();
        $(this).next().scrollLeft(scrollLeft);
      });
    });
  },

  watch: {
    '$store.state.orgId': function (newVal, oldVal) {
      this.onRefresh();
    },
  },

  methods: {
    reloadWindow() {
      setTimeout(() => {
        window.location.reload();
        this.isLoading = false;
      }, 500);
    },
    changeTime(tab){
      this.timeTab = tab
      this.onRefresh();
    },
    // 获取计划进度数据
    getList(isRefresh) {
      let url = '/app-api/healthlife/business/getWarmDataList';

      request({
        url: url,
        method: 'get',
        params:{
          size: this.size,
          current: this.current,
          buGuid: this.orgId,
          queryPeriodType: [2, 3, 4, 5][this.timeTab],
          sortType: 'DESC',
          sortColumn: ['RentQF', 'ManageFeeQF'][this.actTab] //出租率(面积):RentOutRate,收缴率:TotalGetRate
        },
      })
        .then(({ data }) => {
          if (data.code === 0 && data.data) {
            const list = data.data.records;

              this.dataList = isRefresh ? list : this.dataList.concat(list);
              this.dataList.forEach((item, index) => {
                item.rowNum = index + 1;
              });

            this.loading = false;
            this.isLoading = false;
            this.isLoad = false;

            if (null == list || list.length < this.size) {
              this.finished = true;
            } else {
              if (this.current > 1) {
                let scrollTop = $(document).scrollTop();
                $(document).scrollTop(scrollTop - 300);
              }
              this.current += 1;
              this.finished = false;
            }
          } else {
            this.dataList = [];
            this.current = 1;
            this.loading = false;
            this.isLoading = false;
            this.isLoad = false;
            this.finished = true;
          }
        })
        .catch((e) => {
          this.dataList = [];
          this.current = 1;
          this.loading = false;
          this.isLoading = false;
          this.isLoad = false;
          this.finished = true;
        });
    },
    onLoad() {
      if (this.isLoad) return; // 如果当前处于加载状态
      this.isLoad = true;

      this.getList();
    },
    onRefresh() {
      this.current = 1;
      // this.dataList = [];
      this.getList(true);
    },
    changeActTab(idx) {
      this.actTab = idx
      console.log(idx)
      // this.tab1 = tab1;
      // if (this.tab1 == 1) {
      //   this.sortColumn = 'stayPayAmount';
      //   this.sortType = 'DESC';
      // } else if (this.tab1 == 2) {
      //   this.sortColumn = 'overPayAmount';
      //   this.sortType = 'DESC';
      // }
      this.onRefresh();
    },
  },

  components: {
    [List.name]: List,
    [PullRefresh.name]: PullRefresh,
    Toast,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Sticky.name]: Sticky,
  },
};
</script>


<style lang="scss" scoped>
</style>
