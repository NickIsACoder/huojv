<template>
  <div class="report-index pb-20 white-bg">
    <van-nav-bar
      style="position: fixed; top: 0; width: 100%"
      title="去化率假设参数"
      left-arrow
      @click-left="onClickLeft"
      v-eventlisten="{ isChangePage: true, pageEvent: '点击返回按钮' }"
    />
    <div class="main-content mt-15 padding-nav">
      <el-table
        stripe
        class="huo-list-table main-theme-table huojv-data-list"
        size="mini"
        highlight-current-row
        :data="tableList"
      >
        <el-table-column prop="name" label="" align="center"></el-table-column>
        <el-table-column
          prop="value1"
          label="别墅"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="value2"
          label="住宅"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="value3"
          label="商业"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="value4"
          label="公寓"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="value5"
          label="车位"
          align="center"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import scrollFixed from '@/mixin/scroll-fixed';
import { List, PullRefresh, Toast, NavBar } from 'vant';
import $ from 'jquery';
import { getLocalStorage } from '@/utils/local-storage';
import request from '@/utils/request';
import { getUrlParam } from '@/utils/common';

export default {
  mixins: [scrollFixed],

  data() {
    return {
      orgType: '',
      orgId: '',
      tableList: [],
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
      $('.el-table__header-wrapper').scroll(function () {
        let scrollLeft = $(this).scrollLeft();
        $(this).next().scrollLeft(scrollLeft);
      });
    });
  },
  methods: {
    init() {
      this.tableList = [];
      this.orgId = this.$route.query.orgId;
      this.orgType = this.$route.query.orgType;
      this.getMainData();
    },
    onClickLeft() {
      this.$router.go(-1);
    },
    getMainData() {
      request({
        url: `/app-api/militaryOrder/developmentPlan/hypotheticalParameters`,
        method: 'post',
        data: {
          orgId: this.orgId,
        },
      })
        .then(({ data }) => {
          if (data.code == 0) {
            if (data.data) {
              //0全部,1住宅洋房,2车位,3商铺,4别墅,5公寓,6写字楼,7其它
              // underYearDecheRate 一年以内库存去化率
              // overYearDecheRate  一年以上库存去化率 ,
              // presalesYearDecheRate 本年新货去化率 ,

              const data1 = data.data[4],
                data2 = data.data[1],
                data3 = data.data[3],
                data4 = data.data[5],
                data5 = data.data[2];
              this.tableList = [
                {
                  name: '一年以内库存',
                  value1: data1.underYearDecheRate.percentage + '%',
                  value2: data2.underYearDecheRate.percentage + '%',
                  value3: data3.underYearDecheRate.percentage + '%',
                  value4: data4.underYearDecheRate.percentage + '%',
                  value5: data5.underYearDecheRate.percentage + '%'
                },
                {
                  name: '一年以上库存',
                  value1: data1.overYearDecheRate.percentage + '%',
                  value2: data2.overYearDecheRate.percentage + '%',
                  value3: data3.overYearDecheRate.percentage + '%',
                  value4: data4.overYearDecheRate.percentage + '%',
                  value5: data5.overYearDecheRate.percentage + '%'
                },
                {
                  name: '本年新货去化率',
                  value1: data1.presalesYearDecheRate.percentage + '%',
                  value2: data2.presalesYearDecheRate.percentage + '%',
                  value3: data3.presalesYearDecheRate.percentage + '%',
                  value4: data4.presalesYearDecheRate.percentage + '%',
                  value5: data5.presalesYearDecheRate.percentage + '%'
                },
              ];
            }
          }
        })
        .catch((e) => {
          console.log('hypotheticalParameters-err', e);
        });
    },
  },

  components: {
    [List.name]: List,
    [PullRefresh.name]: PullRefresh,
    [NavBar.name]: NavBar,
    Toast,
  },
};
</script>


<style lang="scss" scoped>
</style>
