<template>
  <div class="report-index">
    <!-- <ul class="huojv-tabs fixed-tabs one-cols">
			<li class="active"><label>区域公司剩余货值</label></li>
    </ul>-->
    <van-pull-refresh
      v-model="isLoading"
      success-text="刷新成功"
      loading-text="正在刷新..."
      @refresh="reloadWindow()"
    >
      <div class="main-content pt-15">
        <div class="data-content-panel">
          <!-- 标题 -->
          <div class="data-title-box">
            <img class="title-ico" src="../../../assets/images/ic_topfive@2x.png" />
            <span class="title">龙虎榜前五名</span>
          </div>
          <p class="borderTitle">签约净利润率（占用资金后）</p>
          <el-table
            stripe
            class="huo-list-table main-theme-table"
            size="mini"
            highlight-current-row
            ref="dataTable1"
            :data="frontList"
            :indent="10"
          >
            <el-table-column label="排名" align="center" width="50">
              <template slot-scope="scope">
                <label
                  :class="{'no-1-ico':scope.row.index === 1,'no-2-ico':scope.row.index === 2,'no-3-ico':scope.row.index === 3}"
                  v-text="scope.row.index > 3 ? scope.row.index : ''"
                ></label>
              </template>
            </el-table-column>
            <el-table-column prop="projectName" label="项目" align="center">
              <template slot-scope="scope">
                <span :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.projectGUID,6)">{{scope.row.projectName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="afterContractProfitRate" label="本年累计动态签约利润率" align="center">
              <template slot-scope="scope">
                  <span>{{scope.row.afterContractProfitRate}}%</span>
                </template>
            </el-table-column>
            <el-table-column prop="adUserName" label="负责人" align="center" width="70"></el-table-column>
          </el-table>
        </div>
      </div>

      <div class="main-content pt-15">
        <div class="data-content-panel">
          <!-- 标题 -->
          <div class="data-title-box">
            <img class="title-ico" src="../../../assets/images/ic_laterfive@2x.png" />
            <span class="title">龙虎榜后五名</span>
          </div>
          <p class="borderTitle">签约净利润率（占用资金后）</p>
          <el-table
            stripe
            class="huo-list-table main-theme-table"
            size="mini"
            highlight-current-row
            ref="dataTable1"
            :data="backList"
            :indent="10"
          >
            <el-table-column label="排名" align="center" width="50">
              <template slot-scope="scope">
                <label class="last5-ico" v-text="scope.row.index"></label>
              </template>
            </el-table-column>
            <el-table-column prop="projectName" label="项目" align="center">
              <template slot-scope="scope">
                <span :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.projectGUID,6)">{{scope.row.projectName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="afterContractProfitRate" label="本年累计动态签约利润率" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.afterContractProfitRate}}%</span>
              </template>
            </el-table-column>
            <el-table-column prop="adUserName" label="负责人" align="center" width="70"></el-table-column>
          </el-table>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import scrollFixed from '@/mixin/scroll-fixed';
import echarts from 'echarts'
import { getLocalStorage } from '@/utils/local-storage';
import { getUrlParam, jumpToPj } from '@/utils/common';
import request from '@/utils/request';
import { PullRefresh } from 'vant';

export default {
  mixins: [scrollFixed],

  data () {
    return {
      // orgId:getLocalStorage(['orgId']).orgId,
      size: 5,
      current: 1,
      frontList: [],  // 前五名
      isLoading: false,
      backList: [],  // 后五名
      orgType: ''

    };
  },

  computed: {
    ...mapState({
      orgId: state => state.orgId || getLocalStorage(['orgId']).orgId
    })
  },

  watch: {
    '$store.state.orgId': function (newVal, oldVal) {
      this.init();
    }
  },

  mounted () {
    this.init();
  },

  methods: {
    jumpToPj,
    reloadWindow () {
      setTimeout(() => {
        window.location.reload();
        this.isLoading = false;
      }, 500)
    },
    init () {
      this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType;

      this.getList('desc');  // 前五名
      this.getList('asc');  // 后五名
    },

    // 获取计划进度数据
    getList (orderType) {
      request({
        url: `/app-api/militaryOrder/dragonTiger`,
				method: 'post',
				data: {
					size: this.size,
					current: this.current,
					orgId: this.orgId,
					orderType: orderType
				}
      }).then(({ data }) => {
        if (data.code === 0) {
          if (orderType === 'desc') {
            this.frontList = data.data
            for (let i = 0; i < this.frontList.length; i++) {
              this.frontList[i].index = i + 1;
            }
          } else {
            this.backList = data.data
            for (let i = 0; i < this.backList.length; i++) {
              this.backList[i].index = i + 1;
            }
          }
        }
      }).catch((e) => {
        console.log('getEchartData-err', e);
      });
    }
  },

  components: {
    [PullRefresh.name]: PullRefresh
  }
};
</script>


<style lang="scss" scoped>
.borderTitle {
  font-size: 14px;
  color: #333333;
  border-left: 2px solid #209B5C;
  padding-left: 6px;
  margin: 0;
  margin-bottom: 20px;
}
</style>
