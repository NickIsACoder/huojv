<template>
  <div class="detail-panel white-bg">
    <div class="data-content-panel pt-15">
      <div class="tabBox top">
        <div class="tabItem" :class="topTab==0?'active':''" @click="changeTab1(0)">剩余货值</div>
        <div class="tabItem" :class="topTab==1?'active':''" @click="changeTab1(1)">今年计划供应</div>
        <div class="tabItem" :class="topTab==2?'active':''" @click="changeTab1(2)">今年实际已售</div>
      </div>
      <div class="mapBox">
        <div class="chartTitle">
          资源业态占比-{{tabNames[topTab]}}
          <span class="more" @click="getMore">
            查看更多
            <i class="el-icon-arrow-right"></i>
          </span>
        </div>
        <div class="huojv-chart-box-item" ref="pie"></div>
      </div>
      <div class="mapBox">
        <div class="chartTitle">
          资源业态分布对比-{{tabNames[topTab]}}
        </div>
        <div class="tabBox">
          <div class="tabItem" :class="bottomTab==0?'active':''" @click="changeTab2(0)">组织</div>
          <div class="tabItem" :class="bottomTab==1?'active':''" @click="changeTab2(1)">城市</div>
        </div>
        <div class="huojv-chart-box-item" ref="bar"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import scrollFixed from '@/mixin/scroll-fixed';
import { getLocalStorage } from '@/utils/local-storage';
import { getNextMonths, handleDate, getUrlParam } from '@/utils/common';
import echarts from 'echarts'
import { Icon, PullRefresh ,Tab,Tabs} from 'vant';
import $ from 'jquery';
import request from '@/utils/request';

export default {
  mixins: [scrollFixed],

  data () {
    return {
      isLoading: false,
      orgType: '',
      orgId: getUrlParam('chooseOrgId') || getUrlParam('orgId') || getLocalStorage(['orgId']).orgId,
      tabNames: ['剩余货值', '今年计划供应', '今年实际已售'],
      topTab: 0,
      bottomTab: 0,
      topType : ['remainingResources', 'curPlanSupply', 'curYearsSold'],  //剩余货值:remainingResources,今年计划供应:curPlanSupply;今年实际已售:curYearsSold
      bottomType : ['org', 'city'],  // 组织:org,城市:city
    };
  },
  props: {
    sourceType: {
      type: Number,
      default: 0
    }
  },
  // computed: {
  //   ...mapState({
  //     orgId: state => state.orgId || getLocalStorage(['orgId']).orgId
  //   })
  // },
  watch: {
    '$store.state.orgId': function (newVal, oldVal) {
      this.init();
    },
    sourceType: function(newVal, oldVal){
      console.log('------------2: industry-sourceType ',newVal)
      this.init()
    }
  },
  mounted () {
    this.init();
  },
  methods: {
    reloadWindow() {
      setTimeout(() => {
        window.location.reload();
        this.isLoading = false;
      }, 500)
    },
    // 初始化组件页面
    init() {
      this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType
      this.orgId = getUrlParam('chooseOrgId') || getUrlParam('orgId') || getLocalStorage(['orgId']).orgId

      if (sessionStorage.topTab) {
        this.topTab = parseInt(sessionStorage.topTab)
        sessionStorage.removeItem('topTab')
      }
      if (sessionStorage.bottomTab) {
        this.bottomTab = parseInt(sessionStorage.bottomTab)
        sessionStorage.removeItem('bottomTab')
      }
      this.setBar()
      this.setPie()
    },
    // 切换顶部tab
    changeTab1(idx){
      this.topTab = idx
      this.setBar()
      this.setPie()
    },
    // 切换底部tab
    changeTab2(idx){
      this.bottomTab = idx
      this.setBar()
    },
    // 柱状图逻辑处理
    setBar() {
      request({
        url: `/app-api/resources/productPercentageBar`,
        method: 'post',
        data: {
          orgId: this.orgId,
          orgType: this.orgType,
          dimension: this.bottomType[this.bottomTab], 
          type: this.topType[this.topTab],
          isCurrentData: 1+this.sourceType
        }
      }).then(res => {

        let _lengend = [], _xAxisData = [], _series = []
        if (!res.data.data||res.data.data.length>0) {
          let _data = res.data.data,
           finalData = {}

          let datalist = [], itemArr = []
          for (let a = 0; a < res.data.prodectData.length; a++) {
            itemArr[a] = {
              name: res.data.prodectData[a],
              value: 0
            }
          }

          function dealWith(arr){
            var result = [];
            var obj = {};
            let final = []
            for(var i =0; i<arr.length; i++){
              if(!obj[arr[i].name]){
                  result.push(arr[i]);
                  obj[arr[i].name] = true;
              }
            }
            
            for (let j = 0; j < res.data.prodectData.length; j++) {
              const idx = result.findIndex(fruit=>fruit.name==res.data.prodectData[j])
              final.push({
                name: res.data.prodectData[j],
                value: result[idx].value
              })
            }
            return final
          }

          for (let i = 0; i < _data.length; i++) {
            let arr = _data[i].productData.concat(itemArr)
            datalist[i] = {
              resourceName: _data[i].resourceName,
              resourceGUID: _data[i].resourceGUID,
              productData: dealWith(arr)
            }
          }
          // console.log(datalist)
          finalData = this.processesData(datalist, res.data.prodectData)

          _lengend = finalData.lengend
          _xAxisData = finalData.xAxisData
          _series = finalData.seriesData
        }

        let unit = '亿元'
        if (this.tab==2) {
          unit = '个'
        } else if (this.tab==4){
          unit = '元'
        }
        
        let option = {
          color: ["#1F9B5B", "#F3A33F", "#4995E3", "#F97545", "#B3A36B","#9949E3","#C32337","#133F97","#FFC30F"],
          legend: {
            // orient: "vertical",
            data: _lengend,
            show: true,
            type: 'plain',
            icon: 'rect',
            itemWidth: 10,
            itemHeight: 10,
            // orient: 'horizon',
            x: 'center',
            y: 'bottom',
            textStyle: {
              fontSize: (window.innerWidth / 375) * 10,
              lineHeight: 10,
              color: '#999999'
            },
          },
          grid: {
            left: "4%",
            right: "4%",
            bottom: "18%",
            top: "12%",
            containLabel: true
          },
          tooltip: {
            trigger: "axis",
            confine: true,
            axisPointer: {
              type: "shadow"
            },
            textStyle: {
              align: 'left',
              fontSize: (window.innerWidth / 375) * 10,
            }
          },
          xAxis: {
            type: 'category',
            data: _xAxisData,
            axisLine: {
              lineStyle: {
                color: '#CCCCCC',
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: {
                fontSize: '10',
                color: '#666'
              }
            },
          },
          yAxis: {
            type: 'value',
            name: '单位：'+unit,
            axisLine: {
              show: false,
              lineStyle: {
                color: '#999999'
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#E8E8E8'
              }
            },
            axisLabel: {
              textStyle: {
                textStyle: '11',
                color: '#666'
              }
            }
          },
          series: _series
        };
        
        let _num = 5
        if (this.bottomTab==0) {
          _num = 3
        }
        if (_xAxisData.length > _num) {
          option.dataZoom = [{
            id: 'dataZoomX',
            type: 'inside',
            xAxisIndex: [0],
            filterMode: 'none',
            start: 0,
            // minValueSpan: 5,
            // maxValueSpan: 8,
            end: 4 / _xAxisData.length * 100
          }]
          if (this.bottomTab==0) {
            option.xAxis.axisLabel.rotate = 20
          }
        }

        // 无数据时
        if (_xAxisData.length<=0) {
          option.grid.left = "5%"
          option.series =[{
						type: 'bar',
						barMaxWidth: '24',
						data:[0]
					}]
          option.yAxis.max = 1
        }
        let myChart = echarts.init(this.$refs['bar']);
        myChart.setOption(option, true);
      })
    },
    // 处理成可使用的柱状图数据
    processesData(_fullData, _lengendData){
      let _lengend = [], _xAxisData = [], _series = []
      let finalArr = []
      // 图例
      _lengend = _lengendData
      // 图例值
      _xAxisData = _fullData.map(item=>{
        return item.resourceName
      })
      
      let valueArr = []
      for (let i = 0; i < _fullData.length; i++) {
        let inLoopData = _fullData[i].productData
        let _arrOut = []
        for (let j = 0; j < inLoopData.length; j++) {
          const item = inLoopData[j];
          _arrOut.push(item.value)
        }
        valueArr.push(_arrOut)
      }

      // console.log(valueArr)
      for (let b = 0; b < _lengend.length; b++) {
        let item = []
        for (let a = 0; a < valueArr.length; a++) {
          item.push(valueArr[a][b])
        }
        finalArr.push(item)
      }
      // console.log(finalArr)
      
      for (let i = 0; i < _lengend.length; i++) {
        _series.push({
          name: _lengend[i],
          type: 'bar',
          stack: 'aaa',
          barWidth: _xAxisData.length>4?25: 40,
          data: finalArr[i]
        })
      }
      console.log(_series)
      return {
        lengend: _lengend,
        xAxisData: _xAxisData,
        seriesData: _series
      }
    },
    // 饼图逻辑处理
    setPie() {
      request({
        url: `/app-api/resources/productPercentagePie`,
        method: 'post',
        data: {
          orgId: this.orgId,
          orgType: this.orgType,
          type: this.topType[this.topTab],
          isCurrentData: 1+this.sourceType
        }
      }).then(res => {
        console.log(res);
        let pieData = [];
        if (res.data.data.length>0) {
          let loopData =  res.data.data

          for (let i = 0; i < loopData.length; i++) {
            const item = loopData[i]
            pieData.push({
              name: item.name + ' ',
              value: item.value
            });
          }
        }

        if (!pieData.length) {
          pieData = [{ name: '暂无数据', value: 0 }];
        }
        let legendData = pieData.map(item => {
          return item.name;
        });

        let series = [
          {
            name: '',
            type: 'pie',
            radius: '40%',
            center: ['50%', '45%'],
            color: ["#1F9B5B", "#F3A33F", "#4995E3", "#F97545", "#B3A36B","#9949E3","#C32337","#133F97","#FFC30F"],
            avoidLabelOverlap: true,
            label: {
              normal: {
                // formatter: '{b}\n{d}%',
                formatter(param){
                  return `${param.data.name}\n${param.data.value}%`
                },
                textStyle: {
                  fontSize: '11',
                  color: '#666666'
                }
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '11',
                  color: '#666666'
                }
              }
            },
            // itemStyle: {
            //   borderWidth: 1, //设置border的宽度有多大
            //   borderColor: '#fff',
            // },
            labelLine: {
              normal: {
                smooth: 0.2,
                length: 10,
                length2: 20,

              }
            },
            data: pieData
          }
        ];
        let option = {
            title: {
              text: '',
              show: true,
              textStyle: {
                fontWeight: 500,
                fontSize: 16,
                color: '#333333'
              },
              x: 'center',
              y: 'top'
            },
            tooltip: {
              trigger: 'item',
              formatter: "{a}{b}{c}%"
            },
            grid: {
              top: '0%',
              left: '0%',
              right: '0%',
              bottom: '0%',
              containLabel: false
            },
            legend: {
              type: 'plain',
              icon: 'circle',
              x: "center",
              y: "bottom",
              itemWidth: 10,
              itemHeight: 8,
              itemGap: 5,
              textStyle: {
                color: '#999999',
                fontSize: 10,
                fontWeight: 0
              },
              data: []
            },
            series: []
          };
        option.series = series;
        option.legend.data = legendData
        
        let pie = echarts.init(this.$refs['pie']);
        pie.setOption(option, true);
      });
    },
    // 调整查看更多页面
    getMore() {
      sessionStorage.sourceType = this.sourceType  // 顶部sourceType
      sessionStorage.sourceTab = 2 // 产业业态下标
      sessionStorage.topTab = this.topTab
      sessionStorage.bottomTab = this.bottomTab
      //  排序字段(剩余货值:remainingResourcesAmount,今年计划供应:curPlanSupplyAmount;今年实际已售:curYearsSoldAmount)
      const sortList = ['remainingResourcesAmount', 'curPlanSupplyAmount', 'curYearsSoldAmount']
      this.$router.push({
        path: '/resourceStructure/more',
        query: { 
          token: getUrlParam('token'), 
          orgId: this.orgId,
          type: this.topType[this.topTab], 
          mapTab: 999, 
          orderParam:sortList[this.topTab],
          sourceType: this.sourceType
        }
      })
    },
  },

  components: {
    [Icon.name]: Icon,
    [PullRefresh.name]: PullRefresh,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
  }
};
</script>

<style lang="scss" scoped>
.tabBox{
  display: flex;
  margin-bottom: 10px;
  &.top{
    justify-content: space-between;
  }
  .tabItem{
    width: 100px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    background: white;
    border: 1px solid #CBCBCB;
    border-radius: 3px;
    font-size: 10px;
    color: #656565;
    &.active{
      border-color: #1F9B5B;
      background: rgba(31, 155, 91, 0.08);
      color: #006D37;
    }
  }
  .tabItem:nth-of-type(2){
    margin: 0 20px;
  }
}
.mapChart {
  height: 322px;
  width: 100%;
}
.chartTitle {
  font-size: 15px;
  color: #333333;
  margin: 20px auto;
  position: relative;
}
.mapBox {
  margin-bottom: 10px;
  overflow: hidden;
  position: relative;
  .back {
    position: absolute;
    top: 3%;
    left: 2%;
    font-size: 12px;
    color: #666666;
  }
}
.more {
  font-size: 12px;
  color: #666666;
  float: right;
}
.huojv-chart-box-item,
.huojv-chart-box-item-small {
  margin-bottom: 20px;
}
.mapChart{
  background: #ECECEC;
}
</style>