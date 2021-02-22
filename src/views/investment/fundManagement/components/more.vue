<template>
  <div class="detail-panel height100 white-bg">
    <van-nav-bar
      style="position: fixed; top: 0; width: 100%;"
      :title="title"
      left-arrow
      @click-left="onClickLeft"
      v-eventlisten="{isChangePage:true,pageEvent:'点击返回按钮'}"
    />
    <div class="padding-nav">
      <div class="detail-table-panel">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <el-table
          stripe
          class="huo-list-table main-theme-table huojv-data-list2 accountTable"
          size="mini"
          highlight-current-row
          empty-text="暂无数据"
          :data="tableList"
        >
          <el-table-column type="index" label="序号" align="center" fixed></el-table-column>
          <el-table-column prop="projname" label="项目名称" align="center" fixed v-if="pageType == 1"></el-table-column>
            <el-table-column prop="fundname" label="基金名称" align="center" fixed v-else></el-table-column>
          <el-table-column prop="fundname" label="基金名称" align="center" v-if="pageType == 1"></el-table-column>
            <el-table-column prop="projname" label="项目名称" align="center" v-else></el-table-column>
          <el-table-column prop="investdate" label="投资时间" align="center"></el-table-column>
          <el-table-column label="投资金额(亿元)" align="center">
            <template slot-scope="scope">{{changEmpty(scope.row.investamount)}}</template>
          </el-table-column>
          <el-table-column prop="quitdate" label="退出时间" align="center" width="100"></el-table-column>
          <el-table-column label="预期收益率" align="center" width="100" v-if="pageType == 1">
            <template
              slot-scope="scope"
            >{{scope.row.expectearning||'-'}}%</template>
          </el-table-column>
            <el-table-column label="兑付客户数" align="center" width="100" v-else>
              <template slot-scope="scope">{{scope.row.cashcustcnt}}</template>
            </el-table-column>
<!--          <el-table-column label="收益率" align="center" width="100" v-else>-->
<!--            <template slot-scope="scope">{{scope.row.earning||'-'}}%</template>-->
<!--          </el-table-column>-->
        </el-table>
        </van-list>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import scrollFixed from '@/mixin/scroll-fixed';
import { List, PullRefresh, Toast, Sticky, NavBar } from 'vant';
import $ from 'jquery';
import { getLocalStorage } from '@/utils/local-storage';
import request from '@/utils/request';
import { getUrlParam, jumpToPj, regexNum } from '@/utils/common';

export default {
  mixins: [scrollFixed],

  data() {
    return {
      tab: 1,
      pageType: 1,
      title: '',
      loading: false, //上拉加载
      isLoading: false, //下拉刷新,从第一页开始
      isLoad: false,
      finished: false, //下拉加载完,如果没有数据设置true
      tableList: [],
      size: 20,
      current: 1,
      orgType: 2,
    };
  },

  computed: {
    ...mapState({
      orgId: (state) => state.orgId || getLocalStorage(['orgId']).orgId,
    }),
  },

  watch: {
    '$store.state.orgId': function (newVal, oldVal) {
      this.init();
    },
  },
  mounted() {
    this.init();
    this.$nextTick(() => {
      $('.list-title').scroll(function () {
        let scrollLeft = $(this).scrollLeft();
        $('.el-table__body-wrapper').scrollLeft(scrollLeft);
      });
      $('.el-table__body-wrapper').scroll(function () {
        let scrollLeft = $(this).scrollLeft();
        $('.list-title').scrollLeft(scrollLeft);
      });

      $('.list-title1 .el-table__header-wrapper').scroll(function () {
        let scrollLeft = $(this).scrollLeft();
        $('.list-data1 .el-table__body-wrapper').scrollLeft(scrollLeft);
      });

      $('.list-data1 .el-table__body-wrapper').scroll(function () {
        let scrollLeft = $(this).scrollLeft();
        $('.list-title1 .el-table__header-wrapper').scrollLeft(scrollLeft);
      });
    });
  },

  methods: {
    jumpToPj,
    reloadWindow() {
      setTimeout(() => {
        window.location.reload();
        this.isLoading = false;
      }, 500);
    },
    changEmpty(value) {
      return value ? regexNum(value) : '-';
    },
    onClickLeft() {
      this.$router.go(-1);
    },
    init() {
      this.current = 1;
      this.tableList = [];
      this.pageType = Number(this.$route.query.pageType);
      this.orgType =
        getUrlParam('chooseOrgType') ||
        getUrlParam('orgType') ||
        getLocalStorage('orgType').orgType;
      if (this.pageType == 1) {
        this.title = '投资明细';
      } else if (this.pageType == 2) {
        this.title = '兑付情况明细表';
      }
    },
    setTableData(isRefresh) {
      let params = {
        current: this.current,
        size: this.size,
        orgId: this.$route.query.orgId,
        projbelonggroup: '',
        projtype: '',
        datacontent: this.pageType == 1?2:3,//datacontent=1、2、3   数据类型 1是资金使用情况、2是投资明细、3是兑付情况明细表
      };
      request({
        url: '/app-api/investmentGroup/aninvestProjDetailPage',
        method: 'get',
        params,
      })
        .then(({ data }) => {
          if (data.code === 0 && data.data) {
            let list = data.data.records || [];
            this.tableList = isRefresh ? list : this.tableList.concat(list);
            this.loading = false;
            this.isLoading = false;
            this.isLoad = false;
            if (
              null == list ||
              list.length < this.size ||
              this.tableList.length >= data.total
            ) {
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
            this.tableList = [];
            this.current = 1;
            this.loading = false;
            this.isLoading = false;
            this.finished = true;
            this.isLoad = false;
          }
        })
        .catch((e) => {
          this.tableList = [];
          this.current = 1;
          this.loading = false;
          this.isLoading = false;
          this.finished = true;
          this.isLoad = false;
          console.log('getBoardData-err', e);
        });
    },
    onLoad() {
      if (this.isLoad) return;
      this.isLoad = true;
      this.setTableData();
    },
    onRefresh() {
      this.current = 1;
      this.loading = false;
      this.isLoading = false;
      this.finished = false;
      this.isLoad = false;
      this.setTableData(true);
    },
  },

  components: {
    [List.name]: List,
    [PullRefresh.name]: PullRefresh,
    [NavBar.name]: NavBar,
    [Sticky.name]: Sticky,
    Toast,
  },
};
</script>


<style lang="scss" scoped>
</style>
