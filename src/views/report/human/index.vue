<template>
  <div class="report-index pb-20">
    <van-pull-refresh
      v-model="isLoading"
      success-text="刷新成功"
      loading-text="正在刷新..."
      @refresh="reloadWindow()"
    >
      <div v-if="orgType<=5">
        <div class="main-content mt-15">
          <div class="data-content-panel no-top-left-radius">
            <div class="targetBox">
              <div class="data-title1">
                <span class="lineTxt">人员规模</span>
                <el-popover placement="bottom-start" width="300" trigger="click">
                  <div class="tooltips">
                      <p>1、属于地产开发板块的业务单元及衍生单元</p>
                      <p>（1）集团总部，含各职能中心及香港办。</p>
                      <p>（2）地产集团不含京汉派驻人员。</p>
                      <p>（3）商业地产集团不含蕉建集团、文化公司、科技集团</p>
                      <p>2、不含合作方人员、不含营销编制类人员。</p>
                  </div>
                  <img class="tips" slot="reference" src="../../../assets/images/tips.png" alt="" srcset="">
                </el-popover>
                <p class="subTxt">
                  <span>（仅地产板块，不含营销编制）</span>
                </p>
              </div>
              <div class="dataTxt">
                <span>{{coreSummaryData.curTotal|changeVal}}</span>人
                <p>
                  较上月
                  <span v-if="!coreSummaryData.preTotalPCT&&coreSummaryData.preTotalPCT!=0" class="tg">-</span>
                    <span v-else :class="coreSummaryData.preTotalPCT >= 0?'tg':'tr'">{{coreSummaryData.preTotalPCT|changeVal(1)}}%</span>
                  <!-- <span :class="!coreSummaryData.preTotalPCT||coreSummaryData.preTotalPCT >= 0?'tg':'tr'">{{coreSummaryData.preTotalPCT|changeVal(1)}}%</span> -->
                  <img class="chart-compare-ico" :src="(coreSummaryData.preTotalPCT < 0 ? icFall : icRise)" />
                </p>
              </div>
            </div>
            
            <div class="targetBox">
              <div class="data-title1 mt40">
                <span class="lineTxt">人均效能</span>
                <el-popover placement="bottom-start" width="300" trigger="click">
                  <div class="tooltips">
                      <p><span class="first">人均在建面积:</span><span class="last">时点数据，某时点上在建面积/该时点上的人员规模</span></p>
                      <p><span class="first">人均自营额:</span><span class="last">周期数据，年度内累计自营销售额/期初期末的平均在岗人数</span></p>
                  </div>
                  <img class="tips" slot="reference" src="../../../assets/images/tips.png" alt="" srcset="">
                </el-popover>
              </div>
              <div class="dataTxtBox">
                <div class="dataTxtItem">
                  <p>人均在建面积</p>
                  <p class="dataTxtValue"><span>{{coreSummaryData.curAvgConstructionArea|changeVal}}</span>m²/人</p>
                  <p class="p2">
                    较上月
                    <span v-if="!coreSummaryData.preAvgConstructionAreaPCT&&coreSummaryData.preAvgConstructionAreaPCT!=0" class="tg">-</span>
                    <span v-else :class="coreSummaryData.preAvgConstructionAreaPCT >= 0?'tg':'tr'">{{coreSummaryData.preAvgConstructionAreaPCT|changeVal(1)}}%</span>
                    <!-- <span :class="!coreSummaryData.preAvgConstructionAreaPCT||coreSummaryData.preAvgConstructionAreaPCT >= 0?'tg':'tr'">{{coreSummaryData.preAvgConstructionAreaPCT|changeVal(1)}}%</span> -->
                    <img class="chart-compare-ico" :src="(coreSummaryData.preAvgConstructionAreaPCT < 0 ? icFall : icRise)" />
                  </p>
                </div>
                <div class="dataTxtItem">
                  <p>人均自营额</p>
                  <p class="dataTxtValue"><span>{{coreSummaryData.curAvgSelfSaleAmount|changeVal}}</span>万/人</p>
                  <p class="p2">
                    较上月
                    <span v-if="!coreSummaryData.preAvgSelfSaleAmountPCT&&coreSummaryData.preAvgSelfSaleAmountPCT!=0" class="tg">-</span>
                    <span v-else :class="coreSummaryData.preAvgSelfSaleAmountPCT >= 0?'tg':'tr'">{{coreSummaryData.preAvgSelfSaleAmountPCT|changeVal(1)}}%</span>
                    <!-- <span :class="!coreSummaryData.preAvgSelfSaleAmountPCT||coreSummaryData.preAvgSelfSaleAmountPCT >= 0?'tg':'tr'">{{coreSummaryData.preAvgSelfSaleAmountPCT|changeVal(1)}}%</span> -->
                    <img class="chart-compare-ico" :src="(coreSummaryData.preAvgSelfSaleAmountPCT < 0 ? icFall : icRise)" />
                  </p>
                </div>
              </div>
              

              <div class="data-title1 mt40">
                <span class="lineTxt">费用</span>
              </div>
              <div class="building">陆续上线</div>

              <!-- <div class="data-title1 mt40">
                <span class="lineTxt">费用</span>
              </div>
              <div class="dataTxtBox">
                <div class="dataTxtItem">
                  <p><span class="border">行政费用</span></p>
                  <p class="dataTxtValue"><span>{{expenseSummary.adminExpense||'-'}}</span>万</p>
                </div>
                <div class="dataTxtItem">
                  <p><span class="border">行政费效</span>
                    <el-popover placement="bottom-start" width="150" trigger="click">
                      <div class="tooltips">
                          <p><span class="last">年度内累计自营销售额/年度业务招待费</span></p>
                      </div>
                      <img class="tips" slot="reference" src="../../../assets/images/tips.png" alt="" srcset="">
                    </el-popover>
                  </p>
                  <p class="dataTxtValue"><span>{{expenseSummary.adminExpEfficiency||'-'}}</span>元</p>
                </div>
              </div>
              <div class="dataTxtBox">
                <div class="dataTxtItem">
                  <p>
                    办公场地费
                    <el-popover placement="bottom-start"  trigger="click">
                      <div class="tooltips">
                          <p><span class="last">场地租赁费、场地维护费</span></p>
                      </div>
                      <img class="tips" slot="reference" src="../../../assets/images/tips.png" alt="" srcset="">
                    </el-popover>
                  </p>
                  <p class="dataTxtValue"><span>{{expenseSummary.officeSpaceExpense||'-'}}</span>万</p>
                </div>
                <div class="dataTxtItem">
                  <p>车辆费用
                    <el-popover placement="bottom-start" width="150" trigger="click">
                      <div class="tooltips">
                          <p><span class="last">包含包干内以及包干外车辆购置费、车辆租赁费、车辆运营费用</span></p>
                      </div>
                      <img class="tips" slot="reference" src="../../../assets/images/tips.png" alt="" srcset="">
                    </el-popover>
                  </p>
                  <p class="dataTxtValue"><span>{{expenseSummary.vehicleExpense||'-'}}</span>万</p>
                </div>
                <div class="dataTxtItem">
                  <p>业务招待费</p>
                  <p class="dataTxtValue"><span>{{expenseSummary.businessEnterExpense||'-'}}</span>万</p>
                </div>
              </div>
              <div class="dataTxtBox">
                <div class="dataTxtItem">
                  <p>差旅费</p>
                  <p class="dataTxtValue"><span>{{expenseSummary.travelExpense||'-'}}</span>万</p>
                </div>
                <div class="dataTxtItem">
                  <p>其他行政费用</p>
                  <p class="dataTxtValue"><span>{{expenseSummary.otherAdminExpense||'-'}}</span>万</p>
                </div>
              </div> -->
              <!-- <div class="dataTxtBox">
                
              </div> -->
            </div>
            
            <!-- <div class="topItemBox">
              <div class="topItem">
                人均在建面积
                <p class="p1">
                  {{coreSummaryData.curAvgConstructionArea|changeVal}}
                  <span>m²/人</span>
                </p>
                <p class="p2">
                  较上月
                  <span>{{coreSummaryData.preAvgConstructionAreaPCT|changeVal}}%</span>
                  <img class="chart-compare-ico" :src="(coreSummaryData.preAvgConstructionAreaPCT < 0 ? icFall : icRise)" />
                </p>
              </div>
              <div class="topItem">
                人均自营额
                <p class="p1">
                  {{coreSummaryData.curAvgSelfSaleAmount|changeVal}}
                  <span>万/人</span>
                </p>
                <p class="p2">
                  较上月
                  <span>{{coreSummaryData.preAvgSelfSaleAmountPCT|changeVal}}%</span>
                  <img class="chart-compare-ico" :src="(coreSummaryData.preAvgSelfSaleAmountPCT < 0 ? icFall : icRise)" />
                </p>
              </div>
            </div> -->

          </div>
        </div>
        <div class="main-content mt-15" v-if="orgType<=5">
          <div class="no-top-left-radius">
            <van-tabs
              v-model="actTab"
              color="#209B5C"
              line-width="30px"
              :ellipsis="false"
              title-active-color="#209B5C"
              @change="tabChange"
            >
              <van-tab v-for="(item,index) in tabList" :title="item.name" :disabled="item.disabled" :key="index" title-style="margin:0 5px">
                 <div slot="title">
                    <span v-eventlisten="{isChangePage:false,pageEvent:'点击人力行政-'+item.name}">{{item.name}}</span>
                  </div>
              </van-tab>
            </van-tabs>

            <div v-if="actTab==0" class="data-content-panel">
              <p class="tableTitle">一、在职人员以及结构</p>
              <el-table
                stripe
                class="main-theme-table table-row-color"
                size="mini"
                highlight-current-row
                :data="tableList"
                :height="350"
              >
                <el-table-column prop="orgName" label="所属集团" align="center" fixed></el-table-column>
                <el-table-column prop="total" label="在职人数" align="center"></el-table-column>
                <el-table-column label="学历" align="center">
                  <el-table-column prop="eduUnderCollege" label="大专以下" align="center"></el-table-column>
                  <el-table-column prop="eduCollege" label="大专" align="center"></el-table-column>
                  <el-table-column prop="eduGraduate" label="本科" align="center"></el-table-column>
                  <el-table-column prop="eduMasterOrAbove" label="硕士及以上" align="center"></el-table-column>
                </el-table-column>
                <el-table-column label="司龄" align="center">
                  <el-table-column prop="senWithin1Year" label="1年以内" align="center"></el-table-column>
                  <el-table-column prop="sen1T3Year" label="1-3年" align="center"></el-table-column>
                  <el-table-column prop="sen3T5Year" label="3-5年" align="center"></el-table-column>
                  <el-table-column prop="sen5T10Year" label="5-10年" align="center"></el-table-column>
                  <el-table-column prop="senOver10Year" label="10年以上" align="center"></el-table-column>
                </el-table-column>
              </el-table>
              <div class="huojv-data-list-more" @click="getMore" v-if="tableList.length>5">
                查看更多
                <van-icon name="arrow" />
              </div>
            </div>
            <cost-efficiency v-if="actTab==2"  />
            <div v-if="actTab==3" class="chartBox data-content-panel">
              <!-- <div class="building">陆续上线</div> -->
              <p class="tableTitle">一、人均在建面积</p>
              <div class="huojv-chart-box-item" ref="bar1"></div>
              <p class="tableTitle">二、人均自营额</p>
              <div class="huojv-chart-box-item" ref="bar2"></div>
            </div>
          </div>
        </div>
      </div>
      <div v-else style="min-height:90vh">
        <div class="emptyBox">
          <img class="emptyIcon" src="../../../assets/images/bg-jianshe@2x.png" alt srcset />
          <p>正在建设中...</p>
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
import { getUrlParam } from '@/utils/common';
import { Icon, PullRefresh, Sticky, Tab, Tabs } from 'vant';
import $ from 'jquery';
import request from '@/utils/request';
import ic_fall from '@/assets/images/ic_fall@2x.png'
import ic_rise from '@/assets/images/ic_rise@2x.png'

import costEfficiency from './costEfficiency'

export default {
  mixins: [scrollFixed],

  data () {
    return {
      isLoading: false,
      icFall: ic_fall,
      icRise: ic_rise,
      size: 6,
      current: 1,
      tableList: [],  // 表格数据
      actTab: 0,
      orgType: getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType,
      coreSummaryData: {},
      tabList: [
        { name: '人员规模与结构', disabled: false },
        { name: '人员流动性', disabled: true },
        { name: '费用和费效', disabled: true },
        { name: '人均效能', disabled: false },
        { name: '人才盘点', disabled: true },
      ],
      expenseSummary:{}
    };
  },
  // filter
  filters: {
    changeVal: function (val,type) {
      if (val&&val>0) {
        val = type?'+'+val : val
      }
      if (val==0) {
        val = type?'+'+val:val
      }
      return val==null?'-':val
    }
  },
  computed: {
    ...mapState({
      orgId: state => state.orgId || getLocalStorage(['orgId']).orgId
    }),
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
    reloadWindow () {
      setTimeout(() => {
        window.location.reload();
        this.isLoading = false;
      }, 500)
    },
    init () {
      
      this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType;
      if (this.orgType < 5) {
        this.tabList = [
          { name: '人员规模与结构', disabled: false },
          { name: '人员流动性', disabled: true },
          { name: '费用和费效', disabled: true },
          { name: '人均效能', disabled: false },
          { name: '人才盘点', disabled: true },
        ]
        if (this.actTab == 3) {
          this.getEfficiency()
        } else {
          this.getHRDetail()
        }

        this.getCoreSummary()
        this.getExpenseSummary()
      }else if (this.orgType == 5){
        this.actTab = 0
        this.tabList = [
          { name: '人员规模与结构', disabled: false },
          { name: '人员流动性', disabled: true },
          { name: '费用和费效', disabled: true },
          { name: '人均效能', disabled: true },
          { name: '人才盘点', disabled: true },
        ]
      }
    },
    getMore () {
      this.$router.push({
        name: 'humanMore',
        query: {
          token: getUrlParam('token'),
          orgId: this.orgId,
          orgType: this.orgType
        }
      });
    },
    tabChange (idx) {
      console.log(this.actTab)
      if (this.actTab == 3) {
        this.getEfficiency()
      } else {
        this.getHRDetail()
      }
    },
    // 顶部数据
    getCoreSummary () {
      request({
        url: '/app-api/human/getCoreSummary',
        method: 'post',
        data: {
          orgType: this.orgType,
          // orgId: this.orgId,
          orgId: getUrlParam('chooseOrgId') || getUrlParam('orgId') || getLocalStorage('orgId').orgId,
        }
      }).then(({ data }) => {
        if (data.code === 0) {
          this.coreSummaryData = data.data ? data.data : {}

          // this.coreSummaryData = {
          //   curAvgConstructionArea: 0,
          //   curAvgSelfSaleAmount: '52',
          //   curTotal: '00',
          //   preAvgConstructionAreaPCT: 0,
          //   preAvgSelfSaleAmountPCT: '-55',
          //   preTotalPCT: '55',
          // }
        }
      }).catch((e) => {
        console.log('getBoardData-err', e);
      });
    },
    // 查询人员规模与结构明细
    getHRDetail () {
      request({
        url: '/app-api/human/getHRDetail',
        method: 'post',
        data: {
          orgType: this.orgType,
          // orgId: this.orgId,
          orgId: getUrlParam('chooseOrgId') || getUrlParam('orgId') || getLocalStorage('orgId').orgId,
          current: this.current,
          size: this.size
        }
      }).then(({ data }) => {
        if (data.code === 0) {
          this.tableList = data.data.map(item => {
            return {
              eduCollege: item.eduCollege + '%',
              eduGraduate: item.eduGraduate + '%',
              eduMasterOrAbove: item.eduMasterOrAbove + '%',
              eduUnderCollege: item.eduUnderCollege + '%',
              orgName: item.orgName,
              sen1T3Year: item.sen1T3Year + '%',
              sen3T5Year: item.sen3T5Year + '%',
              sen5T10Year: item.sen5T10Year + '%',
              senOver10Year: item.senOver10Year + '%',
              senWithin1Year: item.senWithin1Year + '%',
              total: item.total
            }
          })
          this.$nextTick(() => {
            $('.el-table__header-wrapper').scroll(function () {
              let scrollLeft = $(this).scrollLeft();
              $(this).next().scrollLeft(scrollLeft);
            });

            $(".el-table__fixed-body-wrapper").scroll(function () {
              let scrollTop = $(this).scrollTop();
              $(this).parent().prev().scrollTop(scrollTop);
            })
          })
        }
      }).catch((e) => {
        console.log('getBoardData-err', e);
      });
    },
    // 柱状图
    getEfficiency () {
      request({
        url: `/app-api/human/efficiencyNew`,
        method: 'post',
        data: {
          orgType: this.orgType,
          // orgId: this.orgId,
          orgId:getUrlParam('chooseOrgId') || getUrlParam('orgId') || getLocalStorage('orgId').orgId
        }
      }).then(({ data }) => {
        if (data.code === 0) {

          // let chartData1 = data.data.map(item => {
          //   return { name: item.orgName, value: item.avgConstructionArea }
          // }),
          // chartData2 = data.data.map(item => {
          //   return { name: item.orgName, value: item.avgSelfSaleAmount }
          // }),
          let chartData1 = data.areaData.map(item => {
            return { name: item.orgName, value: item.avgConstructionArea }
          }),
          chartData2 = data.amountData.map(item => {
            return { name: item.orgName, value: item.avgSelfSaleAmount }
          }),
          // level1 = data.industryData[0].industryData,
          // level2 = data.industryData[1].industryData
          level1 = 0,level2 = 0
          this.$nextTick(() => {
            this.setBar('单位：m²/人', 'bar1', chartData1, level1)
            this.setBar('单位：万元/人/年', 'bar2', chartData2, level2)
          })
          // this.coreSummaryData = data.data
        }
      }).catch((e) => {
        console.log('getBoardData-err', e);
      });
    },
    setBar (yTitle, el, chartData, level) {

      // if (this.orgType <= 2) {
        // chartData = [
        //   { name: '商业', value: Math.floor(Math.random() * 1000) },
        //   { name: '地产', value: Math.floor(Math.random() * 1000) },
        // ]
      // } else {
      //   chartData = [
      //     { name: '广州区域公司', value: Math.floor(Math.random() * 1000) },
      //     { name: '深圳区域公司', value: Math.floor(Math.random() * 1000) },
      //     { name: '宁波区域公司', value: Math.floor(Math.random() * 1000) },
      //     { name: '苏泸区域公司', value: Math.floor(Math.random() * 1000) },
      //     { name: '重庆区域公司', value: Math.floor(Math.random() * 1000) },
      //     { name: '湖北区域公司', value: Math.floor(Math.random() * 1000) },
      //     { name: '珠佛区域公司', value: Math.floor(Math.random() * 1000) },
      //     { name: '福建区域公司', value: Math.floor(Math.random() * 1000) },
      //     { name: '韶关区域公司', value: Math.floor(Math.random() * 1000) },
      //   ]
      // }

      let legend = chartData.map(i => i.name)
      let barData = chartData.map(i => i.value)
      // console.log(legend,barData)
      let that = this

      // 获取最大值
      let max = Math.max.apply(null,barData)
      level = level ? level : 0

      // let option = JSON.parse(JSON.stringify(this.barOption));
      let option = {
        tooltip: {
          confine: true,
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          },
          textStyle: {
            align: 'left'
          }
        },
        grid: {
          'left': '7%',
          'right': '4%',
          'bottom': '5%',
          'top': '15%',
          'containLabel': true
        },
        animation: true,
        toolbox: {
          show: true,
          feature: {}
        },
        calculable: true,
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: legend,
          axisTick: {
            show: false
          },
          axisLine: {
            show: chartData.length > 0 ? false : true,
          },
          axisLabel: {
            show: true,
            rotate: chartData.length <= 2 ? 0 : 30,
            textStyle: {
              fontSize: 10,
              color: '#333333'
            }
          }
        },
        yAxis: {
          type: 'value',
          name: yTitle,
          // nameLocation:'end',
          nameTextStyle: {
            padding: [0, 0, 0, 15],
            color: "#999999",
            fontSize: 11,
            align: chartData.length > 0 ? 'center' : 'left'
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#E8E8E8'
            }
          },
          axisTick: {
            show: false
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
            }
          }
        },
        series: [{
          type: 'bar',
          barWidth: chartData.length <= 2 ? 40 : 15,
          barMaxWidth: 40,
          itemStyle: {
            normal: {
              color (params) {
                var colorList = [
                  '#006E38', '#B4A36B'
                ];
                return that.orgType <= 2 ? colorList[params.dataIndex] : '#01AB91'
              },
            }
          },
          label: {
            normal: {
              show: true,
              fontSize: 10,
              color: '#222222',
              position: 'top',
            }
          },
          data: barData,
          markLine: {
            symbol: "none",
            data: [
            //   {  // 删除平均线
            //     name: '行业水平',
            //     yAxis: level,
            //     lineStyle: {
            //       width: 1,
            //       color: "#D7372F"
            //     },
            //     label: {
            //       fontSize: 11,
            //       lineHeight: 15,
            //       color: '#666666',
            //       position: 'insideEndTop',
            //       formatter: '{b}：{c}',
            //     },
            // },
              // {
              //   type: 'average',
              //   name: '行业水平',
              //   lineStyle: {
              //     width: 1,
              //     color: "#D7372F"
              //   },
              //   label: {
              //     fontSize: 11,
              //     lineHeight: 15,
              //     color: '#666666',
              //     position: 'insideEndTop',
              //     formatter: '{b}：{c}',
              //   },
              // }
            ]
          }
        }],
      }

      if (chartData.length > 6) {
        option.dataZoom = [{
          id: 'dataZoomX',
          type: 'inside',
          xAxisIndex: [0],
          filterMode: 'none',
          start: 0,
          minValueSpan: 5,
          maxValueSpan: 8,
          end: 7 / chartData.length * 100
        }]
      }

      // if (max<level) {
      //   option.yAxis.max = parseInt(level) + 30
      // }


      let myChart = new echarts.init(this.$refs[el]);
      myChart.setOption(option, true);

      window.onresize = myChart.resize
    },
    // 获取费用汇总信息
    getExpenseSummary(){
      request({
        url: '/app-api/human/getExpenseSummary',
        method: 'post',
        data: {
          orgType: this.orgType,
          orgId: this.orgId,
        }
      }).then(({ data }) => {
        if (data.code === 0) {
          this.expenseSummary = data.data?data.data:{}

          // this.expenseSummary = {
          //     vsadminExpEfficiency:10 ,
          //     vsadminExpense:-10 ,
          //     vsbusinessEnterExpense:-10 ,
          //     vsofficeSpaceExpense:-10 ,
          //     vsotherAdminExpense :-10,
          //     vstravelExpense:0 ,
          //     vsvehicleExpense:-10 
          // }
        }
      }).catch((e) => {
        console.log('getExpenseSummary-err', e);
      });
    }
  },

  components: {
    [Icon.name]: Icon,
    [PullRefresh.name]: PullRefresh,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    costEfficiency
  }
};
</script>

<style lang="scss" scoped>
.main-content .data-content-panel .data-title1{
  margin-bottom: 10px;
}
.targetBox{
  margin-bottom: 20px;
}
.subTxt{
  display: flex;
  justify-content: center;
  font-size: 12px;
  margin: 0;
  color: #adadad;
  text-align: center;
  margin-top: 10px;
}
.mt40 {
  margin-top: 40px !important;
}
.chartTitle {
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  margin: 15px auto;
  color: #333;
}
.jumpTxt {
  color: #4472c4;
  text-decoration: underline;
}
.dataTxt {
  text-align: center;
  font-size: 14px;
  color: #266545;
  margin: 23px auto;
  margin-top: 10px;

  & > span {
    font-size: 30px;
    font-weight: bold;
  }

  p {
    margin: 10px auto;
    font-size: 12px;
    color: #666666;

    span {
      font-size: 18px;
      font-weight: bold;
    }
  }
  .chart-compare-ico {
    width: 10px;
    margin-left: 5px;
  }
}
.topItemBox {
  font-size: 13px;
  color: #333333;
  line-height: 100%;
  .topItem {
    display: flex;
    justify-content: flex-start;
    align-items: baseline;

    p {
      display: flex;
      justify-content: flex-start;
      align-items: baseline;
    }
    .p1 {
      font-size: 22px;
      color: #266545;
      font-weight: bold;
      margin-left: 5px;
      span {
        font-weight: 400;
        font-size: 13px;
      }
    }
    .p2 {
      margin-left: 20px;
      font-size: 12px;
      color: #666666;
      span {
        font-weight: bold;
        font-size: 18px;
        color: #f4243e;
      }
    }
    .chart-compare-ico {
      width: 10px;
      height: 10px;
      display: block;
      margin-left: 5px;
    }
  }
}
.tableTitle {
  font-size: 14px;
  color: #333333;
  margin: 30px auto;
}
.chartBox {
  .tableTitle {
    margin-bottom: 10px;
  }
}
.chartBottom {
  font-size: 10px;
  color: #999999;
  text-align: center;
  margin: 10px auto;
  margin-bottom: 50px;
  margin-top: 0;
  span {
    color: red;
  }
}
.emptyBox {
  font-size: 13px;
  color: #868686;
  text-align: center;
  padding-top: 20vh;
  img {
    width: 130px;
    display: block;
    margin: 0 auto;
    margin-bottom: 20px;
  }
}
@media screen and (max-width: 320px) {
  .topItemBox .topItem .p2 {
    margin-left: 10px;
  }
}
.tips{
  width: 15px;
  height: 15px;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  
  // background: url('../../../assets/images/tips.png') no-repeat 100% 100%;
}
.tr{
  color: #f4243e;
}
.tg{
  color: #006E38;
}
.tooltips p{
  font-size: 10px;
  margin: 5px auto;
  display: flex;
  span.first{
    flex: 1;
  }
  span.last{
    flex: 2.5;
  }
}
.dataTxtBox{
  display: flex;
  justify-content: space-around;
  margin: 10px auto;
  .dataTxtItem{
    text-align: center;
    margin-top: 15px;
    p:first-child{
      display: flex;
      justify-content: center;
      span.border{
        border-left:  2px solid #006E38;
        padding-left: 5px;
      }
    }
    p{
      padding: 0;
      margin: 0;
      font-size: 12px;
      color: #999999;
    }
    .dataTxtValue{
      span{
        font-size: 24px;
      }
      margin: 5px auto;
      font-size: 14px;
      color: #006E38;
      font-weight: 600;
    }
    .chart-compare-ico{
      width: 10px;
      margin-left: 3px;
    }
  }
}
.lineTxt{
  position: relative;
  &::before,&::after{
    content: '';
    width: 20px;
    height: 1px;
    background: #E8E8E8;
    position: absolute;
    top: 50%;
  }
  &::before{
    left: -35px;
  }
  &::after{
    right: -35px;
  }
}
</style>
