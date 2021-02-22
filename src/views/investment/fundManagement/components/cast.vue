<template>
  <div class="detail-panel p-l-r-15 pt-15">
    <div class="flexContent">
      <p class="flexTitle">项目情况</p>
      <div class="flex-main">
        <div>
          <div class="flex-title">累计投资项目</div>
          <div class="flex-value" v-if="filterVal(aninvestSummaryData,'investedprojcnt')">
            {{ aninvestSummaryData.investedprojcnt|changeVal}}
            <span class="flex-unit">位</span>
          </div>
          <div class="value" v-else>-</div>
        </div>
        <div ref="pie" class="huojv-chart-box-item cast-pie"></div>
      </div>
      <div class="flex-main">
        <div>
          <div class="flex-title">累计投资金额</div>
          <div class="flex-value" v-if="filterVal(aninvestSummaryData,'investedprojamount')">
            {{ aninvestSummaryData.investedprojamount|changeVal}}
            <span class="flex-unit">亿</span>
          </div>
          <div class="value" v-else>-</div>
        </div>
        <div ref="pie1" class="huojv-chart-box-item cast-pie"></div>
      </div>
      <div class="flex-main">
        <div>
          <div class="flex-title">在投项目</div>
          <div class="flex-value" v-if="filterVal(aninvestSummaryData,'investingprojcnt')">
            {{ aninvestSummaryData.investingprojcnt|changeVal}}
            <span class="flex-unit">个</span>
          </div>
          <div class="value" v-else>-</div>
        </div>
        <div ref="pie2" class="huojv-chart-box-item cast-pie"></div>
      </div>
      <div class="flex-main">
        <div>
          <div class="flex-title">在投金额</div>
          <div class="flex-value" v-if="filterVal(aninvestSummaryData,'investingprojamount')">
            {{ aninvestSummaryData.investingprojamount|changeVal}}
            <span class="flex-unit">亿</span>
          </div>
          <div class="value" v-else>-</div>
        </div>
        <div ref="pie3" class="huojv-chart-box-item cast-pie"></div>
      </div>
      <div class="flex-main">
        <div>
          <div class="flex-title">本年项目数量</div>
          <div class="flex-value" v-if="filterVal(aninvestProjYearly,'investprojcnt')">
            {{ aninvestProjYearly.investprojcnt|changeVal}}
            <span class="flex-unit">个</span>
          </div>
          <div class="value" v-else>-</div>
          <div class="flex-subtitle">
            较上年新增
            <span :class="['flex-subvalue',{'flex-down':aninvestProjYearly.yeargrowthprojcnt.includes('-')}]" v-if="filterVal(aninvestProjYearly,'yeargrowthprojcnt')">
              {{aninvestProjYearly.yeargrowthprojcnt|changeVal}}个
              <i
                :class="aninvestProjYearly.yeargrowthprojcnt.includes('-') ? 'flex-icon-down' : 'flex-icon-up'"
              ></i>
            </span>
            <span class="value" v-else>-</span>
          </div>
        </div>
        <div ref="bar1" class="huojv-chart-box-item"></div>
      </div>
      <div class="flex-main mgt30">
        <div>
          <div class="flex-title">本年投资金额</div>
          <div class="flex-value" v-if="filterVal(aninvestProjYearly,'investprojamount')">
            {{ aninvestProjYearly.investprojamount|changeVal}}
            <span class="flex-unit">亿</span>
          </div>
          <div class="flex-subtitle">
            较上年新增
            <span :class="['flex-subvalue',{'flex-down':aninvestProjYearly.yeargrowthamount.includes('-')}]" v-if="filterVal(aninvestProjYearly,'yeargrowthamount')">
              {{aninvestProjYearly.yeargrowthamount|changeVal}}亿
              <i
                :class="aninvestProjYearly.yeargrowthamount.includes('-') ? 'flex-icon-down' : 'flex-icon-up'"
              ></i>
            </span>
            <span class="value" v-else>-</span>
          </div>
        </div>
        <div ref="bar2" class="huojv-chart-box-item"></div>
      </div>
    </div>
    <div class="flexContent mgt20">
      <p class="flexTitle">资金使用情况</p>
      <div class="flexItemBox pd-self">
        <div class="flexItem_2">
          <p class="pd-self-title">总募集金额</p>
          <div class="value0" v-if="filterVal(aninvestSummaryData,'raiseamount')">
            {{aninvestSummaryData.raiseamount |changeVal}}
            <span>亿</span>
          </div>
          <div class="value" v-else>-</div>
        </div>
        <div class="flexItem_2">
          <p class="pd-self-title">存续金额</p>
          <div class="value0" v-if="filterVal(aninvestSummaryData,'durationamount')">
            {{aninvestSummaryData.durationamount|changeVal}}
            <span>亿</span>
          </div>
          <div class="value" v-else>-</div>
        </div>
        <div class="flex-table">
          <el-table
            stripe
            class="huo-list-table main-theme-table huojv-data-list2 accountTable"
            size="mini"
            highlight-current-row
            empty-text="暂无数据"
            :data="tableList1"
          >
            <el-table-column prop="name" label="产品类别" align="center" fixed></el-table-column>
            <el-table-column label="存续金额(亿元)" align="center">
              <template slot-scope="scope">{{changEmpty(scope.row.value)}}</template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="data-title"><label>地产集团</label></div>
      <div class="flexItemBox pd-self">
        <div class="flexItem_2">
          <p class="pd-self-title">募集金额</p>
          <div class="value0" v-if="filterVal(aninvestSummaryData,'investedprojestateamount')">
            {{aninvestSummaryData.investedprojestateamount|changeVal}}
            <span>亿</span>
          </div>
          <div class="value" v-else>-</div>
        </div>
        <div class="flexItem_2">
          <p class="pd-self-title">存续金额</p>
          <div class="value0" v-if="filterVal(aninvestSummaryData,'investingprojestateamount')">
            {{aninvestSummaryData.investingprojestateamount|changeVal}}
            <span>亿</span>
          </div>
          <div class="value" v-else>-</div>
        </div>
        <div class="flex-table" >
          <p class="pd-self-title" style="text-align: center; line-height: 45px">地产集团-开发类</p>
          <el-table
            stripe
            class="huo-list-table main-theme-table huojv-data-list2 accountTable"
            size="mini"
            highlight-current-row
            empty-text="暂无数据"
            :data="dckfTableList">
            <el-table-column prop="projname" label="项目" align="center"></el-table-column>
            <el-table-column label="金额(亿元)" align="center">
              <template slot-scope="scope">{{changEmpty(scope.row.investamount)}}</template>
            </el-table-column>
            <el-table-column prop="fundname" label="基金名称" align="center"></el-table-column>
          </el-table>
            <div class="huojv-data-list-more raise-more" style="margin-top: 14px" v-if="dckfGroupData.length>5">
                <span class="more" v-if="dckfTableList.length==5" @click="dckfTableList = dckfGroupData">查看更多 <i class="el-icon-arrow-right"></i></span>
                <span class="more up" v-if="dckfTableList.length>5" @click="dckfTableList = dckfGroupData.slice(0,5)">收起 <i class="el-icon-arrow-up"></i></span>
            </div>
          <p class="pd-self-title" style="text-align: center; line-height: 45px">地产集团-旧改类</p>
          <el-table
                  stripe
                  class="huo-list-table main-theme-table huojv-data-list2 accountTable"
                  size="mini"
                  highlight-current-row
                  empty-text="暂无数据"
                  :data="dcjgTableList">
            <el-table-column prop="projname" label="项目" align="center"></el-table-column>
            <el-table-column label="金额(亿元)" align="center">
              <template slot-scope="scope">{{changEmpty(scope.row.investamount)}}</template>
            </el-table-column>
            <el-table-column prop="fundname" label="基金名称" align="center"></el-table-column>
          </el-table>

            <div class="huojv-data-list-more raise-more"  style="margin-top: 14px" v-if="dcjgGroupData.length>5">
                <span class="more" v-if="dcjgTableList.length==5" @click="dcjgTableList = dcjgGroupData">查看更多 <i class="el-icon-arrow-right"></i></span>
                <span class="more up" v-if="dcjgTableList.length>5" @click="dcjgTableList = dcjgGroupData.slice(0,5)">收起 <i class="el-icon-arrow-up"></i></span>
            </div>
        </div>
      </div>
      <div class="data-title"><label>商业集团</label></div>
      <div class="flexItemBox pd-self">
        <div class="flexItem_2">
          <p class="pd-self-title">募集金额</p>
          <div class="value0" v-if="filterVal(aninvestSummaryData,'investedprojcommamount')">
            {{aninvestSummaryData.investedprojcommamount|changeVal}}
            <span>亿</span>
          </div>
          <div class="value" v-else>-</div>
        </div>
        <div class="flexItem_2">
          <p class="pd-self-title">存续金额</p>
          <div class="value0" v-if="filterVal(aninvestSummaryData,'investingprojcommamount')">
            {{aninvestSummaryData.investingprojcommamount|changeVal}}
            <span>亿</span>
          </div>
          <div class="value" v-else>-</div>
        </div>
        <div class="flex-table">
          <p class="pd-self-title" style="text-align: center; line-height: 45px">商业集团-开发类</p>
          <el-table
            stripe
            class="huo-list-table main-theme-table huojv-data-list2 accountTable"
            size="mini"
            highlight-current-row
            empty-text="暂无数据"
            :data="sykfTableList">
            <el-table-column prop="projname" label="项目" align="center"></el-table-column>
            <el-table-column label="金额(亿元)" align="center">
              <template
                slot-scope="scope"
              >{{changEmpty(scope.row.investamount)}}</template>
            </el-table-column>
            <el-table-column prop="fundname" label="基金名称" align="center"></el-table-column>
          </el-table>
            <div class="huojv-data-list-more raise-more" style="margin-top: 14px" v-if="sykfGroupData.length>5">
                <span class="more" v-if="sykfTableList.length==5" @click="sykfTableList = sykfGroupData">查看更多 <i class="el-icon-arrow-right"></i></span>
                <span class="more up" v-if="sykfTableList.length>5" @click="sykfTableList = sykfGroupData.slice(0,5)">收起 <i class="el-icon-arrow-up"></i></span>
            </div>

          <p class="pd-self-title" style="text-align: center; line-height: 45px">商业集团-旧改类</p>
          <el-table
                  stripe
                  class="huo-list-table main-theme-table huojv-data-list2 accountTable"
                  size="mini"
                  highlight-current-row
                  empty-text="暂无数据"
                  :data="syjgTableList">
            <el-table-column prop="projname" label="项目" align="center"></el-table-column>
            <el-table-column label="金额(亿元)" align="center">
              <template slot-scope="scope"
              >{{changEmpty(scope.row.investamount)}}</template>
            </el-table-column>
            <el-table-column prop="fundname" label="基金名称" align="center"></el-table-column>
          </el-table>
            <div class="huojv-data-list-more raise-more" style="margin-top: 14px" v-if="syjgGroupData.length>5">
                <span class="more" v-if="syjgTableList.length==5" @click="syjgTableList = syjgGroupData">查看更多 <i class="el-icon-arrow-right"></i></span>
                <span class="more up" v-if="syjgTableList.length>5" @click="syjgTableList = syjgGroupData.slice(0,5)">收起 <i class="el-icon-arrow-up"></i></span>
            </div>
        </div>
      </div>
    </div>
    <div class="flexContent flex-last">
      <p class="flexTitle">投资明细</p>
      <div class="flex-table-last">
        <el-table
          stripe
          class="huo-list-table main-theme-table huojv-data-list2 accountTable"
          size="mini"
          highlight-current-row
          empty-text="暂无数据"
          :data="aninvestProjDetailPage">
          <el-table-column type="index" label="序号" align="center" fixed></el-table-column>
          <el-table-column prop="projname" label="项目名称" align="center" fixed></el-table-column>
          <el-table-column prop="fundname" label="基金名称" align="center"></el-table-column>
          <el-table-column prop="investdate" label="投资时间" align="center"></el-table-column>
          <el-table-column label="投资金额(亿元)" align="center">
            <template
              slot-scope="scope"
            >{{changEmpty(scope.row.investamount)}}</template>
          </el-table-column>
          <el-table-column prop="quitdate" label="退出时间" align="center" width="100"></el-table-column>
          <el-table-column label="预期收益率" align="center" width="100">
            <template
              slot-scope="scope"
            >{{scope.row.expectearning||'-'}}%</template>
          </el-table-column>
        </el-table>
      </div>
      <div class="huojv-data-list-more raise-more" @click="goMore">
        查看更多
        <van-icon name="arrow" />
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request';
import echarts from 'echarts';
import {
  handleNum2String,
  handleDate,
  getUrlParam,
  regexNum,
} from '@/utils/common';
import { Icon } from 'vant';
export default {
  name: 'Cast',
  data() {
    return {
      orgId: '',
      orgType: '',
      pieOption: {
        title: {
          text: '',
          show: true,
          textStyle: {
            fontWeight: 500,
            fontSize: 14,
            color: '#333333',
          },
          x: 'center',
          y: '10%',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a}{b} {d}%',
          textStyle: {
            fontSize: 12,
            fontWeight: 0,
          },
        },
        grid: {
          top: '0%',
          left: '0%',
          right: '0%',
          bottom: '0%',
          containLabel: false,
        },
        legend: {
          type: 'plain',
          icon: 'circle',
          x: 'center',
          y: 'bottom',
          itemWidth: 10,
          itemHeight: 8,
          itemGap: 5,
          textStyle: {
            color: '#999999',
            fontSize: 10,
            fontWeight: 0,
          },
          data: [],
        },
        series: [],
      },
      aninvestProjYearly: {},
      // dcGroupData: [],
      // syGroupData: [],
      // dcArr: [],
      // syArr: [],
        dckfGroupData: [],//地产开发项目全部数据
        dcjgGroupData: [],//地产旧改项目全部数据
        dckfTableList: [],//地产开发展示数据
        dcjgTableList: [],//地产旧改展示数据

        sykfGroupData: [],//商业开发项目全部数据
        syjgGroupData: [],//商业旧改项目全部数据
        sykfTableList: [],//商业开发展示数据
        syjgTableList: [],//商业旧改展示数据
      tableList1: [],
      aninvestProjDetailPage: []
    };
  },
  props: {
    aninvestSummaryData: {
      type: Object,
      default: () => {},
    },
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
  components: {
    [Icon.name]: Icon,
  },
  watch: {
    '$store.state.orgId': function (newVal, oldVal) {
      this.init();
    },
    aninvestSummaryData() {
      if (this.aninvestSummaryData) {
        this.setPie('pie', this.aninvestSummaryData);
        this.setPie('pie1', this.aninvestSummaryData);
        this.setPie('pie2', this.aninvestSummaryData);
        this.setPie('pie3', this.aninvestSummaryData);
        this.tableList1 = [
          {
            name: '开发类',
            value: this.aninvestSummaryData.durationdevamount,
          },
          {
            name: '旧改类',
            value: this.aninvestSummaryData.durationreformamount,
          },
        ];
      }
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    changEmpty(value) {
      return value ? regexNum(value) : '-';
    },
    // objectSpanMethod1({ row, column, rowIndex, columnIndex }) {
    //   if (columnIndex === 0) {
    //     const _row = this.dcArr[rowIndex];
    //     const _col = _row > 0 ? 1 : 0;
    //     return {
    //       rowspan: _row,
    //       colspan: _col,
    //     };
    //   }
    //   // if (columnIndex === 1) {
    //   //   const _row = this.dcArr[rowIndex];
    //   //   const _col = _row > 0 ? 1 : 0;
    //   //   return {
    //   //     rowspan: _row,
    //   //     colspan: 1,
    //   //   };
    //   // }
    // },
    // objectSpanMethod2({ row, column, rowIndex, columnIndex }) {
    //   if (columnIndex === 0) {
    //     const _row = this.syArr[rowIndex];
    //     const _col = _row > 0 ? 1 : 0;
    //     return {
    //       rowspan: _row,
    //       colspan: _col,
    //     };
    //   }
    //   // if (columnIndex === 1) {
    //   //   const _row = this.syArr[rowIndex];
    //   //   const _col = _row > 0 ? 1 : 0;
    //   //   return {
    //   //     rowspan: _row,
    //   //     colspan: 1,
    //   //   };
    //   // }
    // },
    // 判断值是否为空或者大于0
    filterVal(val, prop) {
      if (val) {
        return prop ? (val[prop] ? true : false) : true;
      } else {
        return false;
      }
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
      this.getAninvestProjYearly();
      this.getAninvestProjYearlyList();
      this.getAllTypeAninvestProj();
      this.getAninvestProjDetailPage();
      if (this.aninvestSummaryData) {
        this.setPie('pie', this.aninvestSummaryData);
        this.setPie('pie1', this.aninvestSummaryData);
        this.setPie('pie2', this.aninvestSummaryData);
        this.setPie('pie3', this.aninvestSummaryData);
        this.tableList1 = [
          {
            name: '开发类',
            value: this.aninvestSummaryData.durationdevamount,
          },
          {
            name: '旧改类',
            value: this.aninvestSummaryData.durationreformamount,
          },
        ];
      }
    },
    // 获取饼图数据、渲染饼图
    setPie(el, pieData, title) {
      let legendData = ['地产', '商业', '外部'];
      let value = [
        {
          name: '地产',
          value: pieData.investedprojestatecnt || 0,
        },
        {
          name: '商业',
          value: pieData.investedprojcommcnt || 0,
        },
        {
          name: '外部',
          value: pieData.investedprojoutercnt || 0,
        },
      ];
      if (el === 'pie1') {
        value[0].value = pieData.investedprojestateamount || 0;
        value[1].value = pieData.investedprojcommamount || 0;
        value[2].value = pieData.investedprojouteramount || 0;
      } else if (el === 'pie2') {
        value[0].value = pieData.investingprojestatecnt || 0;
        value[1].value = pieData.investingprojcommcnt || 0;
        value[2].value = pieData.investingprojoutercnt || 0;
      } else if (el === 'pie3') {
        value[0].value = pieData.investingprojestateamount || 0;
        value[1].value = pieData.investingprojcommamount || 0;
        value[2].value = pieData.investingprojouteramount || 0;
      }
      let series = [
        {
          name: '',
          type: 'pie',
          radius: '40%',
          center: ['50%', '50%'],
          color: ['#209B5C', '#FFC40F', '#B4A36B'],
          avoidLabelOverlap: true,
          label: {
            normal: {
              padding: [0, -65],
              formatter: '{b} {d}%\n\n',
              textStyle: {
                fontSize: '10',
                color: '#666666',
              },
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '10',
                color: '#666666',
              },
            },
          },
          labelLine: {
            normal: {
              smooth: 0.2,
              length: 10,
              length2: 65,
              lineStyle: {
                width: 2,
              },
            },
          },
          data: value,
        },
      ];

      let option = this.getOption(series, legendData, title);
      let pie = new echarts.init(this.$refs[el]);

      pie.setOption(option, true);
    },
    getOption(series, legendData, title) {
      let option = JSON.parse(JSON.stringify(this.pieOption));
      option.series = series;
      option.legend.data = legendData;
      option.title.text = title;

      return option;
    },
    // 本年度数据
    getAninvestProjYearly() {
      request({
        url: '/app-api/investmentGroup/aninvestProjYearly',
        method: 'get',
        params: {
          orgId: this.orgId,
        },
      })
        .then(({ data }) => {
          if (data.code === 0) {
            this.aninvestProjYearly = data.data ? data.data : {};
          }
        })
        .catch((e) => {
          console.log('getManagementFee-err', e);
        });
    },
    // 柱状图数据
    getAninvestProjYearlyList() {
      request({
        url: `/app-api/investmentGroup/aninvestProjYearlyList`,
        method: 'get',
        params: {
          orgId: this.orgId,
        },
      })
        .then((res) => {
          if (res.data.code == 0) {
            let barData1 = {
              names: [],
              values: [],
            };
            let barData2 = {
              values: [],
            };
            res.data.data.forEach((item) => {
              barData1.names.push(item.statyear);
              barData1.values.push(item.investprojcnt);
              barData2.values.push(item.investprojamount);
            });
            barData2.names = barData1.names;
            this.setBar(barData1, 'bar1', '个数', '本年项目数量');
            this.setBar(barData2, 'bar2', '金额(亿元)', '本年投资金额');
          }
        })
        .catch((e) => {
          console.log('profitLossNum-err', e);
        });
    },
    // 单柱图
    setBar(data, el, title, txt) {
      let option = {
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          backgroundColor: 'rgba(0,0,0,0)',
          formatter: function (param) {
            //自定义tooltip内容
            var text = '';
            text += `<div class="tooltip-self">
                      <div class="tooltip-self-title" style="text-align:left">${param[0].name}</div>
                      <div class="tooltip-self-main">
                        <div class="tooltip-self-item">
                          <span>${param[0].seriesName}</span>
                          <span style="margin-left: 8px">${param[0].value}</span>
                        </div>
                      </div>
                    </div>`;
            return text;
          },
        },
        xAxis: {
          type: 'category',
          data: data.names,
          axisLine: {
            lineStyle: {
              color: '#999999',
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            textStyle: {
              fontSize: '11',
              color: '#666',
            },
          },
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#999999',
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#E8E8E8',
            },
          },
          axisLabel: {
            textStyle: {
              textStyle: '11',
              color: '#666',
            },
          },
        },
        series: [
          {
            name: txt,
            type: 'bar',
            barMaxWidth: '24',
            data: data.values,
          },
        ],
      };
      if (title) {
        option.title = {
          text: title,
          show: true,
          textStyle: {
            fontWeight: 500,
            fontSize: (window.innerWidth / 375) * 14,
            color: '#333333',
            lineHeight: (window.innerWidth / 375) * 14 + 4,
          },
          x: 'left',
          y: 'top',
        };
        option.color = ['#B4A36B'];
        option.grid.top = '12%';
      } else {
        option.grid.top = '4%';
        option.color = ['#B4A36B'];
        option.xAxis.axisLabel.textStyle.textStyle = 11;
      }
      let myChart = new echarts.init(this.$refs[el]);
      myChart.setOption(option, true);
    },
    // 资金使用情况数据
    getAllTypeAninvestProj() {
      request({
        url: '/app-api/investmentGroup/allTypeAninvestProj',
        method: 'get',
        params: {
          orgId: this.orgId,
        },
      })
        .then(({ data }) => {
          // this.dcArr = []
          // this.syArr = []
            if (data && data.data && data.code === 0) {
                if (data.data.dcGroup) {
                    let dcdevProjTypes = data.data.dcGroup.devProjTypes || [];//地产开发
                    let dcoldProjTypes = data.data.dcGroup.oldProjTypes || [];//地产旧改
                    let sydevProjTypes = data.data.syGroup.devProjTypes || [];//商业开发
                    let syoldProjTypes = data.data.syGroup.oldProjTypes || [];//商业旧改

                    this.dckfGroupData = dcdevProjTypes;//地产开发
                    this.dcjgGroupData = dcoldProjTypes;//地产旧改
                    this.sykfGroupData = sydevProjTypes;//商业开发
                    this.syjgGroupData = syoldProjTypes;//商业旧改

                    this.dckfTableList = dcdevProjTypes.length > 5 ? dcdevProjTypes.slice(0,5) : dcdevProjTypes;//地产开发展示数据
                    this.dcjgTableList = dcoldProjTypes.length > 5 ? dcoldProjTypes.slice(0,5) : dcoldProjTypes;//地产旧改展示数据
                    this.sykfTableList = sydevProjTypes.length > 5 ? sydevProjTypes.slice(0,5) : sydevProjTypes;//商业开发展示数据
                    this.syjgTableList = syoldProjTypes.length > 5 ? syoldProjTypes.slice(0,5) : syoldProjTypes;//商业旧改展示数据
                }
            }
          // if (data.code === 0 && data.data) {
          //   this.dcGroupData = [
          //     ...data.data.dcGroup.devProjTypes,
          //     ...data.data.dcGroup.oldProjTypes,
          //   ];
          //   this.syGroupData = [
          //     ...data.data.syGroup.devProjTypes,
          //     ...data.data.syGroup.oldProjTypes,
          //   ];
            // let contactDot1 = 0;
            // let contactDot2 = 0;
            // this.dcGroupData.forEach((item, index) => {
            //   item.index = index;
            //   if (index === 0) {
            //     this.dcArr.push(1);
            //   } else {
            //     if (item.projtype === this.dcGroupData[index - 1].projtype) {
            //       this.dcArr[contactDot1] += 1;
            //       this.dcArr.push(0);
            //     } else {
            //       this.dcArr.push(1);
            //       contactDot1 = index;
            //     }
            //   }
            // });
            // this.syGroupData.forEach((item, index) => {
            //   item.index = index;
            //   if (index === 0) {
            //     this.syArr.push(1);
            //   } else {
            //     if (item.projtype === this.syGroupData[index - 1].projtype) {
            //       this.syArr[contactDot2] += 1;
            //       this.syArr.push(0);
            //     } else {
            //       this.syArr.push(1);
            //       contactDot2 = index;
            //     }
            //   }
            // });
            // }
        })
        .catch((e) => {
          console.log('getAllTypeAninvestProj-err', e);
        });
    },
    // 投资明细数据
    getAninvestProjDetailPage() {
      request({
        url: '/app-api/investmentGroup/aninvestProjDetailPage',
        method: 'get',
        params: {
          orgId: this.orgId,
          projbelonggroup: '',
          projtype: '',
          current: 1,
          size: 10,
          datacontent: 2,//datacontent=1、2、3   数据类型 1是资金使用情况、2是投资明细、3是兑付情况明细表
        },
      })
        .then(({ data }) => {
          if (data.code === 0 && data.data) {
            this.aninvestProjDetailPage = data.data.records
          }
        })
        .catch((e) => {
          console.log('getAninvestProjDetailPage-err', e);
        });
    },
    // 查看更多
    goMore() {
      sessionStorage.setItem('fmTab',1)
      this.$router.push({
        path: '/investment/fundManagement/more',
        query: {
          orgId: this.orgId,
          orgType: this.orgType,
          pageType: 1,
          token: getUrlParam('token'),
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.data-content-panel p {
  margin: 0;
}

.pd-self-title {
  font-size: 14px;
  font-weight: 500;
  color: #333333;
}
.mgt20 {
  margin-top: 20px;
}
.flex-main {
  margin-top: 14px;
  text-align: center;
  &.mgt30 {
    margin-top: 30px;
  }
  .flex-title {
    font-size: 14px;
    color: #333;
  }
  .flex-value {
    font-size: 24px;
    font-weight: 600;
    color: #006e38;
    margin-top: 6px;
    .flex-unit {
      font-size: 14px;
      font-weight: 500;
    }
  }
  .flex-subtitle {
    font-size: 12px;
    color: #999999;
    margin-top: 4px;
    margin-bottom: 10px;
    .flex-subvalue {
      color: #006e38;
      margin-left: 6px;
      &.flex-down {
        color: #EC3A35;
      }
      .flex-icon-up {
        display: inline-block;
        width: 6px;
        height: 10px;
        margin-left: 2px;
        background: url('../../../../assets/images/ic_up.png') no-repeat;
        background-size: contain;
      }
      .flex-icon-down {
        display: inline-block;
        width: 6px;
        height: 10px;
        margin-left: 2px;
        background: url('../../../../assets/images/ic_down.png') no-repeat;
        background-size: contain;
      }
    }
  }
}

.data-title{
  font-size: 16px;
  position: relative;
  text-align: center;
  font-weight: 500;
  margin: 20px 0 25px 0;
  color: #333;

  &.max{
    &:before{
      width: calc(50% - 130px);
    }
    &:after{
      width: calc(50% - 130px);
    }
  }

  & > label{
    position: relative;
  }

  & > label:before{
    content: '';
    display: block;
    position: absolute;
    width: 16px;
    height: 1px;
    background: #E8E8E8;
    left: -40px;
    top: 50%;
    margin-top: -0.5px;
  }

  & > label:after{
    content: '';
    display: block;
    position: absolute;
    width: 16px;
    height: 1px;
    background: #E8E8E8;
    right: -40px;
    top: 50%;
    margin-top: -0.5px;
  }
}

.cast-pie {
  height: 230px;
  margin-bottom: 30px;
}
.pd-self {
  padding: 14px 0 20px 0 !important;
  &:last-child {
    padding-top: 0 !important;
  }
}
.flex-table-last {
  margin: 16px auto 14px;
}
.flex-last {
  margin-top: 10px;
  padding-bottom: 30px;
}
.raise-more {
  width: 100%;
  margin-top: 0;
}
</style>
