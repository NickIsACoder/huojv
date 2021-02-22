<template>
  <div class="white-bg treeBox">
    <p class="tree-title">
      销售计划<span>年：{{ year }}&#12288;单位：{{ orgType >= 5 ? '万元' : '亿元' }}</span>
    </p>
    <el-table
      class="huo-list-table"
      :data="tableData"
      stripe
      size="mini"
      style="width: 100%"
      row-key="id"
      default-expand-all
      :show-header="false"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="label" label="销售计划">
        <template slot-scope="scope">
          {{ scope.row.label }}
          <el-popover placement="top" width="200" trigger="click">
              <div class="tooltips" v-if="scope.row.id==8">
                含未取证销售金额
              </div>
              <div class="tooltips" v-else-if="scope.row.id==9">
                不含未取证销售金额
              </div>
              <div class="tooltips" v-else-if="scope.row.id==10">
                不含未取证销售金额
              </div>
              <div class="tooltips" v-else-if="scope.row.id==12">
                按军令状目标{{popoverData}}去化率假设
              </div>
              <img slot="reference" class="tips" v-if="scope.row.click" src="../../../assets/images/tips.png" />
          </el-popover>
         
        </template>
      </el-table-column>
      <el-table-column prop="" label="合计" align="center" width="70">
        <template slot-scope="scope">
          <template v-if="scope.row.prop">
            <span v-if="scope.row.color" :class="judge(propData['合计'][scope.row.prop], scope.row.color)">
                {{propData['合计'][scope.row.prop]|changeVal}}
            </span>
            <span v-else-if="scope.row.setColor" :class="judge(propData['合计'][scope.row.prop])">
                {{propData['合计'][scope.row.prop]|changeVal}}
            </span>
            <span v-else>{{propData['合计'][scope.row.prop]|changeVal}}</span>
          </template>
          <span v-else></span>
        </template>
      </el-table-column>
    </el-table>
    <div class="moreBox">
      <!-- <span class="more" @click="goDetail"
        >查看历史业绩详情 <i class="el-icon-arrow-right"></i
      ></span> -->
    </div>

    <div class="huojv-chart-box-item" ref="bar"></div>
  </div>
</template>

<script>
import scrollFixed from '@/mixin/scroll-fixed';
import { List, PullRefresh, NavBar, Icon } from 'vant';
import request from '@/utils/request';
import echarts from 'echarts';
import { getUrlParam, getNextMonths,regexNum } from '@/utils/common';

export default {
  mixins: [scrollFixed],

  data() {
    const treeData = [
      { label: '' }, // 用于处理表格斑马线
      {
        id: 1,
        label: '货量',
        prop: 'availableAmount',
        children: [
          {
            label: '年初流入库存',
            prop: 'inflowAmount',
            id: 2,
          },
          {
            label: '本年新货',
            prop: 'yearPresalesAmount',
            id: 3,
            children: [
              {
                label: '其中：累计已供货',
                prop: 'yearPresalesAmountActual',
                id: 4,
              },
              {
                label: '其中：计划新供货',
                prop: 'yearPresalesAmountPlan',
                id: 5,
              },
            ],
          },
        ],
      },
      {
        label: '销售目标',
        prop: 'yearContractGoal',
        id: 6,
        children: [
          {
            label: '自营销售目标',
            prop: 'noYearContractGoal',
            id: 7,
            children: [
              {
                label: '截止目前已售',
                prop: 'noYearContractAmount',
                click: true,
                color: 'green',
                id: 8,
                children: [
                  {
                    label: '其中：年初流入库存销售',
                    oldLabel: '其中：本年新货销售',
                    prop: 'noYearContractAmountInflow',
                    click: true,
                    color: 'green',
                    id: 9,
                  },
                  {
                    label: '其中：本年新货销售',
                    oldLabel: '其中：往年旧货销售',
                    prop: 'noYearContractAmountPresales',
                    click: true,
                    color: 'green',
                    id: 10,
                  },
                ],
              },
              {
                label: '截止目前离目标总差距',
                prop: 'noYearGapAmount',
                setColor: true,
                id: 11,
                children: [
                  {
                    label: '其中：按已有资源预计销售',
                    prop: 'noYearGapAmountPlan',
                    click: true,
                    id: 12,
                    children: [
                      {
                        label: '其中：年初流入库存销售',
                        oldLabel: '其中：预计往年旧货销售',
                        prop: 'noYearGapAmountPlanInflow',
                        id: 13,
                      },
                      {
                        label: '其中：本年新货销售',
                        oldLabel: '其中：预计今年新货销售',
                        prop: 'noYearGapAmountPlanPresales',
                        id: 14,
                      },
                    ],
                  },
                  {
                    label: '其中：预计全年自营销售',
                    prop: 'noYearGapAmountYearPlan',
                    id: 15,
                  },
                  {
                    label: '其中：悬空业绩/缺口风险',
                    setColor: true,
                    prop: 'noYearGapAmountRisk',
                    id: 16,
                  },
                ],
              },
            ],
          },
          {
            label: '并表业绩目标',
            prop: 'yearContractGoalSelf',
            id: 17,
            children: [
              {
                label: '截止目前累计完成',
                prop: 'yearContractAmountSelf',
                color: 'green',
                id: 18,
              },
              {
                label: '截止目前离并表业绩目标总差距',
                setColor: true,
                prop: 'yearGapAmountSelf',
                id: 19,
              },
            ],
          },
        ],
      },
    ];
    return {
      orgId: '',
      orgType: 2,
      year: '',
      tableData: treeData,
      propData: {
        "合计": {},
      },
      popoverData: '-%'
    };
  },
  watch: {
    '$store.state.orgId': function (newVal, oldVal) {
      this.init();
    },
  },
  mounted() {
    let _d = new Date(Date.parse(new Date())-21*60*60*1000).getFullYear()
    this.year = this._timeVersion ? this._timeVersion.split('-')[0] :(_d).toString();

    this.init();
  },
  filters:{
      changeVal: function(val){
          return val&&val.amount!=null? regexNum(val.amount): '-'
      }
  },
  methods: {
    init() {
      this.orgId =
        getUrlParam('chooseOrgId') ||
        getUrlParam('orgId') ||
        getLocalStorage('orgId').orgId;
      this.orgType =
        getUrlParam('chooseOrgType') ||
        getUrlParam('orgType') ||
        getLocalStorage('orgType').orgType;

      this.propData =  {
        "合计": {},
      }
      this.getMainData();
      this.getPopoverData()
    },
    judge(val,type){
        if (type) {
            return val&&val.amount!=null ? type: ''
        }
        if (val&&val.amount!=null) {
            return val.amount<=0?'green':'red'
        }else {
            return ''
        }
    },
    getMainData() {
      request({
        url: `/app-api/militaryOrder/developmentPlan`,
        method: 'post',
        data: {
          orgId: this.orgId,
          productType: 0, //0全部,1住宅洋房,2车位,3商铺,4别墅,5公寓,6写字楼,7其它
        },
      })
        .then(({ data }) => {
          if (data.code == 0) {
            // availableAmount //  货量 ,1
            // inflowAmount //  年初流入库存 ,2
            // noYearGapAmountPlanPresales //  本年新货销售 (其中：预计本年新货销售 ,3
            // yearPresalesAmountActual //  其中：累计已供货 ,4
            // yearPresalesAmountPlan //  其中：计划新供货5
            // yearContractGoal //  销售目标 ,6
            // noYearContractGoal //  自营销售目标,7
            // noYearContractAmount //  截止目前已售8
            // noYearContractAmountPresales //  其中：本年新货销售 ,9
            // noYearContractAmountInflow //  其中：年初流入库存销售 (其中：往年旧货销售),
            // yearGapAmountSelf //  截止目前并表业绩离目标总差距 ,11
            // noYearGapAmountPlan //  其中：按已有资源预计未来销售 ,12
            // noYearGapAmountPlanInflow //  年初流入库存销售 (其中：预计往年旧货销售),
            // yearPresalesAmount //  本年新增供货),
            // noYearGapAmountYearPlan //  其中：预计全年自营销售 , 15
            // noYearGapAmountRisk //  其中：悬空业绩/缺口风险 ,16
            // yearContractGoalSelf //  并表销售目标,17
            // yearContractAmountSelf //  截至目前完成 ,18
            // noYearGapAmount //  截止目前离自营目标总差距,19

            let chartData = [
              {
                name: '全年目标',
                value: null, // 自营
                value2: null, //并表
              },
              {
                name: '累计完成',
                value: null, // 自营
                value2: null, //并表
              },
              {
                name: '与目标总差距',
                value: null, // 自营
                value2: null, //并表
              },
            ],max = null
            if (data.data) {
                this.propData['合计'] = data.data[0]
            //   this.propData['合计'] = {
            //       availableAmount:{ amount: null},
            //     inflowAmount:{ amount: null},
            //     noYearGapAmountPlanPresales:{ amount: null},
            //     yearPresalesAmountActual:{ amount: null},
            //     yearPresalesAmountPlan:{ amount: null},
            //     yearContractGoal:{ amount: null},
            //     noYearContractGoal:{ amount: null},
            //     noYearContractAmount:{ amount: null},
            //     noYearContractAmountPresales:{ amount: null},
            //     noYearContractAmountInflow :{ amount: null},
            //     yearGapAmountSelf:{ amount: null},
            //     noYearGapAmountPlan:{ amount: null},
            //     noYearGapAmountPlanInflow:{ amount: null},
            //     yearPresalesAmount:{ amount: null},
            //     noYearGapAmountYearPlan:{ amount: null},
            //     noYearGapAmountRisk:{ amount: null},
            //     yearContractGoalSelf :{ amount: null},
            //     yearContractAmountSelf:{ amount: null},
            //     noYearGapAmount:{ amount: null},
            //   }
              chartData = [
                {
                    name: '全年目标',
                    value: data.data[0].noYearContractGoal.amount, // 自营
                    value2: data.data[0].yearContractGoalSelf.amount, //并表
                },
                {
                    name: '累计完成',
                    value: data.data[0].noYearContractAmount.amount, // 自营
                    value2: data.data[0].yearContractAmountSelf.amount, //并表
                },
                {
                    name: '与目标总差距',
                    value: data.data[0].noYearGapAmount.amount, // 自营
                    value2: data.data[0].yearGapAmountSelf.amount, //并表
                },
              ];
              max = true
            }
            this.setBar('bar', chartData, max);
          }
        })
        .catch((e) => {
          console.log('developmentPlan-err', e);
        });
    },
    setBar(el, chartData, max) {
      let xAxisData = chartData.map((i) => i.name);
      let barData = chartData.map((i) => i.value);
      let barData2 = chartData.map((i) => i.value2);
      // console.log(legend,barData)
      let that = this;

      let option = {
        color: ['#006E38', '#B4A36B'],
        tooltip: {
          confine: true,
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          textStyle: {
            align: 'left',
          },
        },
        legend: {
          data: ['自营', '并表'],
          show: true,
          selectedMode: false,
          type: 'plain',
          icon: 'rect',
          itemWidth: 10,
          itemHeight: 10,
          // orient: 'horizon',
          x: 'center',
          y: 'bottom',
          textStyle: {
            fontSize: (window.innerWidth / 375) * 8,
            lineHeight: 10,
            color: '#999999',
          },
        },
        grid: {
          left: '4%',
          right: '4%',
          bottom: '13%',
          top: '15%',
          containLabel: true,
        },
        animation: true,
        toolbox: {
          show: true,
          feature: {},
        },
        calculable: true,
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: xAxisData,
          axisTick: {
            show: false,
          },
          axisLine: {
            show: chartData.length > 0 ? false : true,
          },
          axisLabel: {
            show: true,
            textStyle: {
              fontSize: 10,
              color: '#333333',
            },
          },
        },
        yAxis: {
          name: this.orgType >= 5 ? '单位：万元' : '单位：亿元',
          type: 'value',
          nameTextStyle: {
            padding: [0, 0, 0, 15],
            color: '#999999',
            fontSize: 11,
            align: chartData.length > 0 ? 'center' : 'left',
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#E8E8E8',
            },
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: chartData.length > 0 ? false : true,
          },
          min: 0,
          axisLabel: {
            show: true,
            textStyle: {
              fontSize: 10,
              color: '#666666',
            },
          },
        },
        series: [
          {
            name: '自营',
            type: 'bar',
            stack: '销售',
            barWidth: 30,
            label: {
              normal: {
                formatter: function(param){
                    return regexNum(param.value)
                },
                show: true,
                position: 'inside',
                textStyle: {
                  color: '#fff',
                  fontSize: 9,
                },
              },
            },
            data: barData,
          },
          {
            name: '并表',
            type: 'bar',
            stack: '销售',
            barWidth: 30,
            label: {
              normal: {
                formatter: function(param){
                    return regexNum(param.value)
                },
                show: true,
                position: 'inside',
                textStyle: {
                  color: '#fff',
                  fontSize: 9,
                },
              },
            },
            data: barData2,
          },
        ],
      };
      
      if (!max) {
          option.yAxis.max = 100
      }

      if (chartData.length > 6) {
        option.dataZoom = [
          {
            id: 'dataZoomX',
            type: 'inside',
            xAxisIndex: [0],
            filterMode: 'none',
            start: 0,
            minValueSpan: 5,
            maxValueSpan: 8,
            end: (7 / chartData.length) * 100,
          },
        ];
      }

      let myChart = new echarts.init(this.$refs[el]);
      myChart.setOption(option, true);

      window.onresize = myChart.resize;
    },
    // 获取去化率假设参数
    getPopoverData() {
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

              this.popoverData = data.data[4].underYearDecheRate.percentage + '%'


              // const data1 = data.data[4],
              //   data2 = data.data[1],
              //   data3 = data.data[3],
              //   data4 = data.data[5],
              //   data5 = data.data[2];
              // this.tableList = [
              //   {
              //     name: '一年以内库存',
              //     value1: data1.underYearDecheRate.percentage + '%',
              //     value2: data2.underYearDecheRate.percentage + '%',
              //     value3: data3.underYearDecheRate.percentage + '%',
              //     value4: data4.underYearDecheRate.percentage + '%',
              //     value5: data5.underYearDecheRate.percentage + '%'
              //   },
              //   {
              //     name: '一年以上库存',
              //     value1: data1.overYearDecheRate.percentage + '%',
              //     value2: data2.overYearDecheRate.percentage + '%',
              //     value3: data3.overYearDecheRate.percentage + '%',
              //     value4: data4.overYearDecheRate.percentage + '%',
              //     value5: data5.overYearDecheRate.percentage + '%'
              //   },
              //   {
              //     name: '本年新货去化率',
              //     value1: data1.presalesYearDecheRate.percentage + '%',
              //     value2: data2.presalesYearDecheRate.percentage + '%',
              //     value3: data3.presalesYearDecheRate.percentage + '%',
              //     value4: data4.presalesYearDecheRate.percentage + '%',
              //     value5: data5.presalesYearDecheRate.percentage + '%'
              //   },
              // ];
            }
          }
        })
        .catch((e) => {
          console.log('hypotheticalParameters-err', e);
        });
    },
    goDetail() {
      this.$router.push({
        path: '/militaryOrder/planDetail',
        query: {
          token: getUrlParam('token'),
          orgId: this.orgId,
          orgType: this.orgType,
        },
      });
    },
    goMore() {
      this.$router.push({
        path: '/militaryOrder/more',
        query: {
          token: getUrlParam('token'),
          orgId: this.orgId,
          orgType: this.orgType,
        },
      });
    },
  },

  components: {
    [NavBar.name]: NavBar,
    [List.name]: List,
    [PullRefresh.name]: PullRefresh,
    [Icon.name]: Icon,
  },
};
</script>


<style lang="scss" scoped>
.treeBox {
  padding: 15px;
  padding-bottom: 50px;
  .tree-title {
    padding-left: 8px;
    margin: 0;
    margin-bottom: 15px;
    font-size: 14px;
    color: #333333;
    border-left: 3px solid #006e38;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    span {
      font-size: 9px;
      color: #666666;
    }
  }
}
.tips {
  width: 15px;
  vertical-align: text-top;
}
.moreBox {
  margin-top: 10px;
  overflow: hidden;
  .more {
    float: right;
    font-size: 12px;
    color: #656565;
  }
}
.huojv-chart-box-item {
  margin-top: 20px;
}
.green{ color:#006E38 ;}
.red{ color:red ;}
</style>
