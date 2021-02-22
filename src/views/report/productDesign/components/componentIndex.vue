<template>
  <div class="report-index">
    <div class="" style="width: 100%">
      <div class="data-content-panel no-top-left-radius minHeight">
        <div class="data-title1"><label>土地价值最大化</label></div>

        <!-- <ul class="data-info-list3 pb-20"> -->
        <ul class="data-info-list pb-20 two-cols" style="border-bottom: 0">
          <li>
            <div class="data-type middle">
              项目数
              <el-popover placement="bottom" width="150" trigger="click">
                <div class="tooltips">由我方操盘设计的项目总数</div>
                <span
                  class="tips-img"
                  slot="reference"
                  style="width: 16px; height: 16px"
                ></span>
              </el-popover>
            </div>
            <div class="data-box mt-10">
              <label
                class="value max"
                v-if="filterVal(landMaxData.projectAmount)"
                >{{ landMaxData.projectAmount }}</label
              >
              <label class="value max" v-else>-</label>
              <label class="unit"></label>
            </div>
          </li>
          <li>
            <div class="data-type middle">实际容积率</div>
            <div class="data-box mt-10">
              <label
                class="value max"
                v-if="filterVal(landMaxData.actualVolumeRate)"
                >{{ landMaxData.actualVolumeRate }}</label
              >
              <label class="value max" v-else>-</label>
              <label class="unit"></label>
            </div>
          </li>
        </ul>
        <ul class="data-info-list pb-20 two-cols" style="border-bottom: 0">
          <li>
            <div class="data-type middle">货地比</div>
            <div class="data-box mt-10">
              <label
                class="value max"
                v-if="filterVal(landMaxData.valuePriceRate)"
                >{{ landMaxData.valuePriceRate }}</label
              >
              <label class="value max" v-else>-</label>
              <label class="unit"></label>
            </div>
          </li>
          <li>
            <div class="data-type middle">地货比</div>
            <div class="data-box mt-10">
              <label
                class="value max"
                v-if="filterVal(landMaxData.valueLandRate)"
                >{{ landMaxData.valueLandRate }}</label
              >
              <label class="value max" v-else>-</label>
              <label
                class="unit"
                :class="filterVal(landMaxData.valueLandRate) ? '' : 'fontsize0'"
                >%</label
              >
            </div>
          </li>
        </ul>
        <ul class="data-info-list pb-20 two-cols" style="border-bottom: 0">
          <li>
            <div class="data-type middle">项目可售比</div>
            <div class="data-box mt-10">
              <label
                class="value max"
                v-if="filterVal(landMaxData.sellableRate)"
                >{{ landMaxData.sellableRate }}</label
              >
              <label class="value max" v-else>-</label>
              <label
                class="unit"
                :class="filterVal(landMaxData.sellableRate) ? '' : 'fontsize0'"
                >%</label
              >
            </div>
          </li>
          <li>
            <div class="data-type middle">商住比</div>
            <div class="data-box mt-10">
              <label class="value max">{{landMaxData.businessRate|| '-'}} : {{landMaxData.hoomRate|| '-'}}</label>
              <!-- <label
                class="value max"
                v-if="filterVal(landMaxData.businessRate)"
                >{{ landMaxData.businessRate }}</label
              >
              <label class="value max" v-else>-</label> -->
              <label class="unit"></label>
            </div>
          </li>
        </ul>

        <div class="data-title1 mt-30"><label>限额设计</label></div>
        <ul class="data-info-list pb-20 one-cols" style="border-bottom: 0">
          <li>
            <div class="data-type middle">建面单方</div>
            <div class="data-box mt-10 xeBoxCont">
              <div class="xeBox">
                <label
                  class="value max"
                  v-if="
                    filterVal(
                      quotaDesignData.constructionAreaUnitCostLimitIncluding,
                      'amountYuan'
                    )
                  "
                  >{{
                    quotaDesignData.constructionAreaUnitCostLimitIncluding
                      | changeVal('amountYuan')
                  }}</label
                >
                <label class="value max" v-else>-</label>
                <label
                  class="unit"
                  :class="
                    filterVal(
                      quotaDesignData.constructionAreaUnitCostLimitIncluding,
                      'amountYuan'
                    )
                      ? ''
                      : 'fontsize0'
                  "
                  >元/㎡</label
                >
              </div>
              <div class="xeBox">
                <label
                  class="value max"
                  v-if="
                    filterVal(
                      quotaDesignData.constructionAreaUnitCostLimit,
                      'amountYuan'
                    )
                  "
                  >{{
                    quotaDesignData.constructionAreaUnitCostLimit
                      | changeVal('amountYuan')
                  }}</label
                >
                <label class="value max" v-else>-</label>
                <label
                  class="unit"
                  :class="
                    filterVal(
                      quotaDesignData.constructionAreaUnitCostLimit,
                      'amountYuan'
                    )
                      ? ''
                      : 'fontsize0'
                  "
                  >元/㎡</label
                >
                <el-popover placement="bottom" width="150" trigger="click">
                  <div class="tooltips">不含土地成本</div>
                  <span
                    class="tips-img"
                    slot="reference"
                    style="width: 16px; height: 16px"
                  ></span>
                </el-popover>
              </div>
            </div>
          </li>
          <li>
            <div class="data-type middle">可售单方</div>
            <div class="data-box mt-10 xeBoxCont">
              <div class="xeBox">
                <label
                  class="value max"
                  v-if="
                    filterVal(
                      quotaDesignData.saleAreaUnitCostLimitIncluding,
                      'amountYuan'
                    )
                  "
                  >{{
                    quotaDesignData.saleAreaUnitCostLimitIncluding
                      | changeVal('amountYuan')
                  }}</label
                >
                <label class="value max" v-else>-</label>
                <label
                  class="unit"
                  :class="
                    filterVal(
                      quotaDesignData.saleAreaUnitCostLimitIncluding,
                      'amountYuan'
                    )
                      ? ''
                      : 'fontsize0'
                  "
                  >元/㎡</label
                >
              </div>
              <div class="xeBox">
                <label
                  class="value max"
                  v-if="
                    filterVal(
                      quotaDesignData.saleAreaUnitCostLimit,
                      'amountYuan'
                    )
                  "
                  >{{
                    quotaDesignData.saleAreaUnitCostLimit
                      | changeVal('amountYuan')
                  }}</label
                >
                <label class="value max" v-else>-</label>
                <label
                  class="unit"
                  :class="
                    filterVal(
                      quotaDesignData.saleAreaUnitCostLimit,
                      'amountYuan'
                    )
                      ? ''
                      : 'fontsize0'
                  "
                  >元/㎡</label
                >
                <el-popover placement="bottom" width="150" trigger="click">
                  <div class="tooltips">不含土地成本</div>
                  <span
                    class="tips-img"
                    slot="reference"
                    style="width: 16px; height: 16px"
                  ></span>
                </el-popover>
              </div>
              <!-- <label class="value max" v-text="quotaDesignData.saleAreaUnitCostLimit && quotaDesignData.saleAreaUnitCostLimit.amountYuan || '-'">0</label>
							<label class="unit">元/㎡</label> -->
            </div>
          </li>
        </ul>

        <div class="data-title1 mt-30"><label>设计变更成本变动</label></div>
        <!-- board数据 -->
        <ul class="data-info-list pb-20 two-cols" style="border-bottom: 0">
          <li>
            <div class="data-type middle">设计变更成本变动次数</div>
            <div class="data-box mt-20">
              <label
                class="value max"
                v-if="filterVal(designChangeData.designChangeCount)"
                >{{ designChangeData.designChangeCount }}</label
              >
              <label class="value max" v-else>-</label>
              <label
                class="unit"
                :class="
                  filterVal(designChangeData.designChangeCount)
                    ? ''
                    : 'fontsize0'
                "
                >次</label
              >
            </div>
          </li>
          <li>
            <div class="data-type middle">设计变更成本变动率</div>
            <div class="data-box mt-20">
              <label
                class="value max"
                v-if="filterVal(designChangeData.designChangeRate)"
                >{{ designChangeData.designChangeRate }}</label
              >
              <label class="value max" v-else>-</label>
              <label
                class="unit"
                :class="
                  filterVal(designChangeData.designChangeRate)
                    ? ''
                    : 'fontsize0'
                "
                >%</label
              >
            </div>
          </li>
        </ul>

        <div class="data-title1 mt-30"><label>设计协同计划进度</label></div>
        <!-- board数据 -->
        <ul class="data-info-list pb-20 one-cols" style="border-bottom: 0">
          <li>
            <div class="data-type middle">设计节点完成率</div>
            <div class="data-box mt-20">
              <label
                class="value max"
                v-if="
                  filterVal(specialPlanProgress.completionRate, 'percentage')
                "
                >{{
                  specialPlanProgress.completionRate | changeVal('percentage')
                }}</label
              >
              <label class="value max" v-else>-</label>
              <label
                class="unit"
                :class="
                  filterVal(specialPlanProgress.completionRate)
                    ? ''
                    : 'fontsize0'
                "
                >%</label
              >
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import scrollFixed from '@/mixin/scroll-fixed';
import { List, PullRefresh, NavBar } from 'vant';
import $ from 'jquery';
import request from '@/utils/request';
import { getUrlParam, getNextMonths } from '@/utils/common';

export default {
  mixins: [scrollFixed],

  data() {
    return {
      isLoading: false, //下拉刷新,从第一页开始
      orgId: '',
      orgType: 2,

      landMaxData: {},
      designChangeData: {},
      quotaDesignData: {},
      specialPlanProgress: {},
      designType: 1,
    };
  },
  props: ['pageTab'],
  watch: {
    '$store.state.orgId': function (newVal, oldVal) {
      this.init();
    },
    pageTab(newVal, oldVal) {
      this.init();
    },
  },
  filters: {
    changeVal(val, prop) {
      if (val) {
        return prop ? (val[prop] ? val[prop] : '-') : val;
      } else {
        return '-';
      }
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.orgId = getUrlParam('chooseOrgId') || getUrlParam('orgId');
      this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType');

      this.designType = (this.pageTab + 1).toString();

      this.getQuotaDesign();
      this.getDesignSpecialPlanProgress();
      this.getLandMax();
      this.getDesignChange();
    },
    // 判断值是否为空或者大于0
    filterVal(val, prop) {
      if (val == '-') {
        return false;
      }
      if (val) {
        return prop ? (val[prop] ? true : false) : true;
      } else {
        return false;
      }
    },
    // 获取限额设计
    getQuotaDesign() {
      this.quotaDesignData = {};
      request({
        url: `/app-api/productDesign/getQuotaDesign`,
        method: 'post',
        data: {
          orgId: this.orgId,
          designType: this.designType,
        },
      }).then(({ data }) => {
        if (data.code === 0 && data.data) {
          this.quotaDesignData = data.data;
        }
      });
    },

    // 获取限额设计
    getDesignSpecialPlanProgress() {
      this.specialPlanProgress = {};
      request({
        url: `/app-api/productDesign/getDesignSpecialPlanProgress`,
        method: 'post',
        data: {
          orgId: this.orgId,
          designType: this.designType,
        },
      }).then(({ data }) => {
        if (data.code === 0 && data.data) {
          this.specialPlanProgress = data.data;
        }
      });
    },

    // 设计成本变更汇总数据获取
    getDesignChange() {
      this.designChangeData = {};
      request({
        url: `/app-api/productDesign/designChange`,
        method: 'get',
        params: {
          orgId: this.orgId,
          designType: this.designType,
        },
      })
        .then(({ data }) => {
          if (data.code === 0 && data.data) {
            this.designChangeData = data.data || {};
          }
        })
        .catch((e) => {
          console.log('getDesignChange-err', e);
        });
    },

    getLandMax() {
      this.landMaxData = {};
      request({
        url: `/app-api/productDesign/landMaxValue/${this.orgId}`,
        method: 'get',
        params: {
          designType: this.designType,
        },
      })
        .then(({ data }) => {
          if (data.code === 0) {
            this.landMaxData = data.data ? data.data : {};
            console.log(this.landMaxData);
          }
        })
        .catch((e) => {
          console.log('getLandMaxData-err', e);
        });
    },
  },

  components: {
    [NavBar.name]: NavBar,
    [List.name]: List,
    [PullRefresh.name]: PullRefresh,
  },
};
</script>


<style lang="scss" scoped>
.minHeight {
  min-height: 90vh;
}
.xeBoxCont {
  display: flex;
  justify-content: space-around;
}
.xeBox {
  display: inline-block;
  margin-bottom: 20px;
}
.data-title1 label {
  font-family: PingFangSC-Medium, PingFang SC;
  font-size: 14px;
  color: #333;
  font-weight: 500;
  text-shadow: 0px 6px 8px rgba(0, 0, 0, 0.06);
}
</style>

