<template>
  <div class="detail-panel white-bg">
    <div class="data-content-panel pt-15">
      <div class="tabBox">
        <div
          class="tabItem"
          @click="checkTab(1)"
          v-eventlisten="{isChangePage:false,pageEvent:'切换到总货值'}"
          :class="[tab == 1 ? 'active' : '']"
        >总货值</div>
        <div
          class="tabItem"
          @click="checkTab(2)"
          v-eventlisten="{isChangePage:false,pageEvent:'切换到项目数'}"
          :class="[tab == 2 ? 'active' : '']"
        >项目数</div>
        <div
          class="tabItem"
          @click="checkTab(3)"
          v-eventlisten="{isChangePage:false,pageEvent:'切换到剩余货值'}"
          :class="[tab == 3 ? 'active' : '']"
        >剩余货值</div>
        <div
          class="tabItem"
          @click="checkTab(4)"
          v-eventlisten="{isChangePage:false,pageEvent:'切换到销售均价'}"
          :class="[tab == 4 ? 'active' : '']"
        >销售均价</div>
        <div
          class="tabItem"
          @click="checkTab(5)"
          v-eventlisten="{isChangePage:false,pageEvent:'切换到土储货值'}"
          :class="[tab == 5 ? 'active' : '']"
        >土储货值</div>
        <div
          class="tabItem"
          @click="checkTab(6)"
          v-eventlisten="{isChangePage:false,pageEvent:'切换到库存货值'}"
          :class="[tab == 6 ? 'active' : '']"
        >库存货值</div>
        <div
          class="tabItem"
          @click="checkTab(7)"
          v-eventlisten="{isChangePage:false,pageEvent:'切换到今年计划供应'}"
          :class="[tab == 7 ? 'active' : '']"
        >今年计划供应</div>
        <div
          class="tabItem"
          @click="checkTab(8)"
          v-eventlisten="{isChangePage:false,pageEvent:'切换到今年实际已售'}"
          :class="[tab == 8 ? 'active' : '']"
        >今年实际已售</div>
      </div>
      <van-tabs v-model="mapTab" color="#209B5C" line-width="30px" :ellipsis="false" title-active-color="#209B5C" class="mapTabBox" @change="changeMapTab">
        <van-tab v-for="(item,index) in mapTabList" :title="item.name" :disabled="item.disabled" :key="index" title-style="margin:0 5px">
          <div slot="title">
            <span v-eventlisten="{isChangePage:false,pageEvent:'点击资源结构-'+item.name}">{{item.name}}</span>
          </div>
        </van-tab>
      </van-tabs>
      <div class="chartTitle">
        {{chartTitle1}}-{{tabNames[tab-1]}}
        <span class="more" @click="getMore">
          查看更多
          <i class="el-icon-arrow-right"></i>
        </span>
      </div>
      
      <!-- <span style="width:70px;height:20px;display:inline-block;background:#006E38"></span>
      <span style="width:70px;height:20px;display:inline-block;background:rgb(38, 144, 88)"></span>
      <span style="width:70px;height:20px;display:inline-block;background:rgb(16, 167, 89)"></span>
      <span style="width:70px;height:20px;display:inline-block;background:rgb(37, 197, 114)"></span>
      <span style="width:70px;height:20px;display:inline-block;background:rgb(134, 218, 143)"></span>
      <span style="width:70px;height:20px;display:inline-block;background:#AEE2E5"></span> -->
      <div class="mapBox">
        <div class="mapChart" ref="map"></div>
        <span class="back el-icon-arrow-left" @click="back" v-show="mapType==2&&orgType!=5">返回</span>
      </div>
      <div class="mapBox" v-if="tab != 4">
        <p class="chartTitle">{{chartTitle2}}-{{tabNames[tab-1]}}</p>
        <div class="huojv-chart-box-item" ref="bar" v-if="orgType<=2"></div>
        <div class="huojv-chart-box-item-small" ref="pie" v-else></div>
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
      mapTabList:[
        {name:'行政省份',disabled: false},
        {name:'国家城市群',disabled: false},
        {name:'地理区域',disabled: false}
      ],
      mapTab: 0,
      chartTitle1: '',
      chartTitle2: '',
      tab: 1,
      mapType: 1,
      mapArr: {
        "全国": "map/china",
        "上海市": "map/province/shanghai",
        "云南省": "map/province/yunnan",
        "内蒙古自治区": "map/province/neimenggu",
        "北京市": "map/province/beijing",
        // "南海诸岛": "undefined"
        "台湾省": "map/province/taiwan",
        "吉林省": "map/province/jilin",
        "四川省": "map/province/sichuan",
        "天津市": "map/province/tianjin",
        "宁夏回族自治区": "map/province/ningxia",
        "安徽省": "map/province/anhui",
        "山东省": "map/province/shandong",
        "山西省": "map/province/shanxi",
        "广东省": "map/province/guangdong",
        "广西壮族自治区": "map/province/guangxi",
        "新疆维吾尔自治区": "map/province/xinjiang",
        "江苏省": "map/province/jiangsu",
        "江西省": "map/province/jiangxi",
        "河北省": "map/province/hebei",
        "河南省": "map/province/henan",
        "浙江省": "map/province/zhejiang",
        "海南省": "map/province/hainan",
        "湖北省": "map/province/hubei",
        "湖南省": "map/province/hunan",
        "澳门特别行政区": "map/province/aomen",
        "甘肃省": "map/province/gansu",
        "福建省": "map/province/fujian",
        "西藏自治区": "map/province/xizang",
        "贵州省": "map/province/guizhou",
        "辽宁省": "map/province/liaoning",
        "重庆市": "map/province/chongqing",
        "陕西省": "map/province/shanxi1",
        "青海省": "map/province/qinghai",
        "香港特别行政区": "map/province/xianggang",
        "黑龙江省": "map/province/heilongjiang",
      },
      orgType: getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType,
      tabNames: ['总货值', '项目数', '剩余货值', '销售均价', '土储货值', '库存货值', '今年计划供应', '今年实际已售'],
      mapParams: ['availableAmount', 'projectAmounts', 'remainingResourcesAmount', 'averagePrice', 'landStoreResourcesAmount', 'instockResourcesAmount', 'curPlanSupplyAmount', 'curYearsSoldAmount'],
      areaArrTitle: ["华南", "西南", "华东", "华中", "华北", "西北"],
      areaArrMain: [
        ['广东省', '广西壮族自治区', '海南省'],
        ['贵州省', '陕西省', '四川省', '云南省', '重庆市'],
        ['江西省', '安徽省', '福建省', '江苏省', '上海市', '浙江省'],
        ['湖南省', '河南省', '湖北省'],
        ['北京市', '天津市', '河北省', '辽宁省', '山东省', '山西省', '内蒙古自治区', '黑龙江省', '吉林省'],
        ['甘肃省', '宁夏回族自治区', '青海省', '西藏自治区', '新疆维吾尔自治区']
      ]
    };
  },
  props: {
    sourceType: {
      type: Number,
      default: 0
    }
  },
  computed: {
    ...mapState({
      orgId: state => state.orgId || getLocalStorage(['orgId']).orgId
    })
  },
  watch: {
    '$store.state.orgId': function (newVal, oldVal) {
      this.init();
    },
    sourceType: function(newVal, oldVal){
      console.log('------------1: city-sourceType ',newVal)
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

      if (sessionStorage.tab) {
        this.tab = sessionStorage.tab
        sessionStorage.removeItem('tab')
      }

      if (sessionStorage.mapTab) {
        this.mapTab = parseInt(sessionStorage.mapTab)
        sessionStorage.removeItem('mapTab')
      }

      // 区域公司和项目不显示城市群地图和地理区域地图
      if (this.orgType>4) {
        this.mapTab = 0
        this.mapTabList = [
          {name:'行政省份',disabled: false},
        ]
      }else{
        this.mapTabList = [
          {name:'行政省份',disabled: false},
          {name:'国家城市群',disabled: false},
          {name:'地理区域',disabled: false}
        ]
      }

      this.mapType = this.orgType==5 ? 2:1

      if (this.mapTab==0) {   // 行政省份
        this.getMapData()
        this.chartTitle1 = '城市资源布局地图'
        this.chartTitle2 = '城市能级资源分布'
      }else if (this.mapTab==1) { // 国家城市群
        this.getCountryCityData()
        this.chartTitle1 = '城市群资源布局地图'
        this.chartTitle2 = '城市群资源分布'
      }else if (this.mapTab==2) { // 地理区域
        this.getAreaData()
        this.chartTitle1 = '地理区域资源布局地图'
        this.chartTitle2 = '地理区域资源分布'
      }

      // 一级集团显示柱状图，二级显示饼图
      // 销售均价tab 两个图都不显示
      if (this.tab!=4) {
        if (this.orgType <= 2) {
          this.setBar()
        } else {
          this.setPie()
        }
      }
    },
    // 切换数据标签
    checkTab (idx) {
      this.tab = idx
      this.mapType = this.orgType==5 ? 2:1
      this.init()
      // this.getMapData()
    },
    // 切换地图tab
    changeMapTab(idx){
      echarts.init(this.$refs.map,true).clear()
      this.mapTab = idx

      // if (this.mapType==1) {
      //   echarts.init(this.$refs.bar).clear()
      // }else {
      //   echarts.init(this.$refs.pie).clear()
      // }
      this.init()
    },
    chartShowLoading(){
      let myChart = echarts.init(this.$refs.map)
      myChart.showLoading({
          text: '',
          color: '#209B5C',
          lineWidth: 2,
          maskColor: 'rgba(236,236,236,1.000)',
          textStyle: { fontSize : 20 , color: '#444' },
      });
    },
    //  获取汇总数据
    getMapData () {
      request({
        url: `/app-api/resources/provinceMap`,
        method: 'post',
        data: {
          orgId: this.orgId,
          orgType: this.orgType,
          type: this.mapParams[this.tab - 1],
          isCurrentData: 1+this.sourceType
        }
      }).then(({ data }) => {
        if (data.code === 0) {
          // 获取地图数据，展示地图
          if (this.orgType == 5) {
            let aera = data.data.cityMapDetail.map( item=>{
              return item.province
            }),
            guids = data.data.cityMapDetail.map( item=>{
              return item.provinceGUID
            })
            if (guids.length<=0) {
              // 区域数据为空时，直接显示全国地图
              this.getMapJson('全国', data.data.maxHeatColor, data.data.cityMapDetail)
            } else {
              // 区域数据不为空，则去获取区域内所有城市的数据
              this.getCityData(aera, guids)
            }
          } else {
            this.getMapJson('全国', data.data.maxHeatColor, data.data.cityMapDetail)
          }

          // // 一级集团显示柱状图，二级显示饼图
          // // 销售均价tab 两个图都不显示
          // if (this.tab!=4) {
          //   if (this.orgType <= 2) {
          //     this.setBar()
          //   } else {
          //     this.setPie()
          //   }
          // }
        }
      }).catch((e) => {
        console.log('getEchartData-err', e);
      });
    },
    // 匹配省份名称
    changePN(name){
      if (name.indexOf('广西')!=-1) {
        name = '广西壮族自治区'
      } else if (name.indexOf('内蒙古')!=-1) {
        name = '内蒙古自治区'
      } else if (name.indexOf('宁夏')!=-1) {
        name = '宁夏回族自治区'
      } else if (name.indexOf('新疆')!=-1) {
        name = '新疆维吾尔自治区'
      } else if (name.indexOf('澳门')!=-1) {
        name = '澳门特别行政区'
      } else if (name.indexOf('西藏')!=-1) {
        name = '西藏自治区'
      } if (name.indexOf('香港')!=-1) {
        name = '香港特别行政区'
      }
      return name
    },
    // 获取要显示的区域json数据
    getMapJson (name, visualMax, tooltipData) {
      let zone = null
      let that = this
      if (name instanceof Array) {
        let fts = []
        for (let i = 0; i < name.length; i++) {
          if (name[i]) {
            console.log(name[i])
            const item = that.changePN(name[i]);
            $.getJSON(this.mapArr[item] + '.json', area => {
                fts = fts.concat(area.features);
                zone = {"type":"FeatureCollection","features":fts}
                if (i==name.length-1) {
                  this.mapConfigure(zone, visualMax, tooltipData)
                }
            });
          }
        }

      } else {
        // zone = require('../../../../' + this.mapArr[this.changePN(name)] + '.json')
          $.getJSON(that.mapArr[that.changePN(name)] + '.json', result => {
              zone = result
              this.mapConfigure(zone, visualMax, tooltipData)
          });
      }
    },
    /*
     visualMax：图例最大值
     zone： 地图json数据
     tooltipData: 展示的数值
     */
    mapConfigure (zone, visualMax, tooltipData) {
      let myChart = echarts.init(this.$refs.map,true); //这里是为了获得容器所在位置

      let isCity = this.mapType == 2 ? true: false
      tooltipData = tooltipData.map(item => {
        // if (!item.provinceGUID) { //数据为null
        if (!item.province) {
          return false
        }
        return {
          name: isCity? item.city : this.changePN(item.province),
          value: item[this.mapParams[this.tab - 1]],
          ...item
        }
      })
      console.log(tooltipData)

      window.onresize = myChart.resize;

      const that = this
      echarts.registerMap('zone', zone);
      myChart.clear()
      myChart.setOption({ // 进行相关配置
        backgroundColor: "#ECECEC",
        tooltip: {
          enterable: true, // 鼠标可移入tooltip中
          trigger: 'item',
          confine: true,
          backgroundColor: 'rgba(0,0,0,.75)',
          formatter: function (params) {
            if (!params.data) {
              return params.name
            }
            const dataItem = params.data;
            const p = that.mapParams[that.tab - 1]
            let unit = '亿元'
            if (that.tab==2) {
              unit = '个'
            } else if (that.tab==4){
              unit = '元'
            }

            let txt = `<div style="font-size:11px;padding:5px;">${dataItem.name}<br>
                <div style="fong-size:8px;margin-top:4px;color:#E8E8E8;margin-bottom:5px;line-height:150%">
                ${that.tabNames[that.tab - 1]}：${dataItem[p]}（${unit}）`
            txt = txt +`
                <span style="display:${p=='availableAmount'?'none':'block'}">总货值：${dataItem.availableAmount}（亿元）<br></span>
                <span style="display:${p=='projectAmounts'?'none':'block'}">项目数：${dataItem.projectAmounts}（个）<br></span>
                <span style="display:${p=='remainingResourcesAmount'?'none':'block'}">剩余货值：${dataItem.remainingResourcesAmount}（亿元）<br></span>
                <span style="display:${p=='averagePrice'?'none':'block'}">销售均价：${dataItem.averagePrice}（元）<br></span>
                <span style="display:${p=='landStoreResourcesAmount'?'none':'block'}">土储货值：${dataItem.landStoreResourcesAmount}（亿元）<br></span>
                <span style="display:${p=='instockResourcesAmount'?'none':'block'}">库存货值：${dataItem.instockResourcesAmount}（亿元）<br></span>
                <span style="display:${p=='curPlanSupplyAmount'?'none':'block'}">今年计划供应：${dataItem.curPlanSupplyAmount}（亿元）<br></span>
                <span style="display:${p=='curYearsSoldAmount'?'none':'block'}">今年实际已售：${dataItem.curYearsSoldAmount}（亿元）</div></span></div>`
            if (that.mapType==1&&that.orgType!=5) {
              txt = txt+`<p class="toCity" data-name="${dataItem.name}" data-id="${dataItem.provinceGUID}"
                style="margin:0;padding-top:3px;border-top:1px solid #fff; display: flex;justify-content: space-between;align-items:center">
                查看详情<i style="float:right" class="el-icon-arrow-right"></i></p>`
            }
            return txt
          },
        },
        visualMap: {
          min: 0,
          max: visualMax == 0 ? 100 : visualMax,
          // max: 400,
          left: 'left',
          top: 'bottom',
          text: ['高', '低'],
          itemWidth: 5,
          itemHeight: 60,
          calculable: true,
          formatter: function (value) { //标签的格式化工具。
            return ''; // 范围标签显示内容。
          },
          inRange: {
            color: ['#AFE2E5', '#006E38']
            // color: ['#01AB91','#0D9B51']
            // color: ['#7EC2B5','#197E50']
          },
          show: true
        },
        geo: { // 这个是重点配置区
          map: 'zone', // 表示中国地图
          zoom: 1.2,
          scaleLimit: { min: 1, max: 2.7 },
          roam: true,
          label: {
            normal: {
              show: true, // 是否显示对应地名
              formatter (param) {
                // 有数据才显示label
                let index = tooltipData.findIndex(item => item.name == param.name)
                return index == -1 ? '' : param.name
              },
              textStyle: {
                // color: 'rgba(0,0,0,.4)',
                color: '#ffffff',
                fontSize: 7.5
              }
            }
          },
          itemStyle: {
            normal: {
              areaColor: '#DDDDDD',
              borderColor: '#F8F8F8',
              // borderWidth: 1,
              shadowColor: '#F8F8F8',
              shadowBlur: 3
            },
            emphasis: {
              // areaColor: '#FFFED8',
              // borderWidth: 1
            }
            // normal: {
            //   borderColor: 'rgba(0, 0, 0, 0.2)'
            // },
            // emphasis: {
            //   areaColor: null,
            //   shadowOffsetX: 0,
            //   shadowOffsetY: 0,
            //   shadowBlur: 10,
            //   borderWidth: 0,
            //   shadowColor: 'rgba(0, 0, 0, 0.5)'
            // }
          }
        },
        series: [{
          type: 'scatter',
          showEffectOn: 'render',
          coordinateSystem: 'geo' // 对应上方配置
        },
        {
          type: 'map',
          geoIndex: 0,
          data: tooltipData,
        }]
      },true)

      // setTimeout(()=>{
      //   myChart.hideLoading()
      // },10)


      myChart.off('click')
      myChart.on('click', function (params) {
        setTimeout(()=>{
          $('.toCity').click(function(e){
            let zone = e.currentTarget.dataset.name,
              guid = e.currentTarget.dataset.id
            that.mapType = 2
            that.getCityData(zone, [guid])
          })
        },100)
      });

    },
    // 获取下钻的城市区域
    getCityData (zone,guid) {
      // this.chartShowLoading()
      let param = {
          type: this.mapParams[this.tab - 1],
          orgType: this.orgType,
          orgId: this.orgId,
          isCurrentData: 1+this.sourceType
        }
        if (this.orgType!=5) {
          param.provinceGUID = guid[0]
        }
      request({
        url: `/app-api/resources/cityMap`,
        method: 'post',
        data: param
      }).then(({ data }) => {
        if (data.code === 0) {
          // this.mapType = zone instanceof Array?1:2
          // this.mapType == this.orgType==5 ? 2:1
          // 获取地图数据，展示地图
          this.getMapJson(zone,data.data.maxHeatColor, data.data.cityMapDetail)
        }
      }).catch((e) => {
        console.log('getEchartData-err', e);
      });
    },
    // 返回上一级显示的区域
    back () {
      this.mapType = 1
      // echarts.init(this.$refs.map).clear()
      this.getMapData()
    },
    // 获取全国地图
    getCountryJson(showData, max){
      $.getJSON(this.mapArr['全国'] + '.json', result => {
        if (this.mapTab==1) {  // 城市群地图
          this.setCountryCityMap(result, showData, max)
        } else {  // 区域地图
          this.setAreaMap(result, showData, max)
        }
      });
    },
    // 获取城市群地图打点数据
    getCountryCityData(){
      let geoCoordMap = {
        "粤港澳大湾区":{name:'粤港澳大湾区', locatedName:'广州市', location:[113.27324, 23.15792]},
        "成渝城市群":{name:'成渝城市群', locatedName:'成都市', location:[104.10194, 30.65984]},
        "京津冀城市群":{name:'京津冀城市群', locatedName:'北京市', location:[116.23128, 40.22077]},
        "海峡西岸城市群":{name:'海峡西岸城市群', locatedName:'福州市', location:[119.27345, 26.04769]},
        "长江三角洲城市群":{name:'长江三角洲城市群', locatedName:'上海市', location:[121.48941, 31.40527]},
        "辽中南城市群":{name:'辽中南城市群', locatedName:'沈阳市', location:[123.46987, 41.80515]},
        "长江中游城市群":{name:'长江中游城市群', locatedName:'武汉市', location:[114.02919, 30.58203]},
        "山东半岛城市群":{name:'山东半岛城市群', locatedName:'青岛市', location:[120.39629, 36.30744]},
        "北部湾城市群":{name:'北部湾城市群', locatedName:'南宁市', location:[108.27331, 22.78121]},
        "哈长城市群":{name:'哈长城市群', locatedName:'哈尔滨市', location:[126.95717, 45.54774]},
        "中原城市群":{name:'中原城市群', locatedName:'郑州市', location:[113.6401, 34.72468]},
        "呼包鄂榆城市群":{name:'呼包鄂榆城市群', locatedName:'呼和浩特市', location:[111.62299, 40.80772]},
        "关中平原城市群":{name:'关中平原城市群', locatedName:'西安市', location:[108.93425, 34.23053]},
        "兰西城市群":{name:'兰西城市群', locatedName:'兰州市', location:[103.71878, 36.10396]}
      };

      request({
        url: `/app-api/resources/cityGroupMap`,
        method: 'post',
        data: {
          orgId: this.orgId,
          orgType: this.orgType,
          type: this.mapParams[this.tab - 1],
          isCurrentData: 1+this.sourceType
        }
      }).then(({ data }) => {
        if (data.code === 0) {
          let pointArr = data.data.cityMapDetail,
          // let pointArr = [
          //   {"provinceGUID":null,"province":null,"cityGUID":"262C7363-B21D-4502-9181-06A6AB401A20","city":"中原城市群","areaGUID":null,"area":null,"cityLevel":null,"projectAmounts":"13","availableAmount":"140.74","remainingResourcesAmount":"69.08","averagePrice":"7014.60","landStoreResourcesAmount":"0.00","instockResourcesAmount":"17.97","curPlanSupplyAmount":"40.31","curYearsSoldAmount":"15.84"},
          //   {"provinceGUID":null,"province":null,"cityGUID":"3A84E9BB-0474-4875-B38C-07C14844237A","city":"粤港澳大湾区","areaGUID":null,"area":null,"cityLevel":null,"projectAmounts":"67","availableAmount":"937.78","remainingResourcesAmount":"196.12","averagePrice":"17713.24","landStoreResourcesAmount":"5.88","instockResourcesAmount":"95.30","curPlanSupplyAmount":"118.69","curYearsSoldAmount":"51.26"},
          //   {"provinceGUID":null,"province":null,"cityGUID":"273AED2C-91B2-49DD-89D3-0E68BFA960EB","city":"海峡西岸城市群","areaGUID":null,"area":null,"cityLevel":null,"projectAmounts":"26","availableAmount":"261.20","remainingResourcesAmount":"110.42","averagePrice":"8280.00","landStoreResourcesAmount":"0.86","instockResourcesAmount":"42.07","curPlanSupplyAmount":"75.15","curYearsSoldAmount":"24.96"},
          //   {"provinceGUID":null,"province":null,"cityGUID":"3DCE6918-D234-4712-86F2-13DC8CA7AE46","city":"辽中南城市群","areaGUID":null,"area":null,"cityLevel":null,"projectAmounts":"2","availableAmount":"97.31","remainingResourcesAmount":"6.57","averagePrice":"0.00","landStoreResourcesAmount":"0.00","instockResourcesAmount":"6.57","curPlanSupplyAmount":"0.00","curYearsSoldAmount":"2.33"},
          //   {"provinceGUID":null,"province":null,"cityGUID":"16CDC1B6-D913-4A2E-B8CF-24DECFB85C20","city":"京津冀城市群","areaGUID":null,"area":null,"cityLevel":null,"projectAmounts":"10","availableAmount":"93.19","remainingResourcesAmount":"66.70","averagePrice":"11698.84","landStoreResourcesAmount":"0.00","instockResourcesAmount":"33.20","curPlanSupplyAmount":"33.99","curYearsSoldAmount":"2.21"},
          //   {"provinceGUID":null,"province":null,"cityGUID":"5529CE1A-7A03-4946-801F-5A9C4DCDF248","city":"长江三角洲城市群","areaGUID":null,"area":null,"cityLevel":null,"projectAmounts":"53","availableAmount":"439.00","remainingResourcesAmount":"157.00","averagePrice":"13441.34","landStoreResourcesAmount":"0.00","instockResourcesAmount":"67.82","curPlanSupplyAmount":"120.07","curYearsSoldAmount":"64.64"},
          //   {"provinceGUID":null,"province":null,"cityGUID":"A1256317-2DF4-403A-B100-6E1B9BBCAE5F","city":"关中平原城市群","areaGUID":null,"area":null,"cityLevel":null,"projectAmounts":"7","availableAmount":"139.00","remainingResourcesAmount":"77.58","averagePrice":"16304.31","landStoreResourcesAmount":"14.73","instockResourcesAmount":"19.96","curPlanSupplyAmount":"73.48","curYearsSoldAmount":"29.95"},
          //   {"provinceGUID":null,"province":null,"cityGUID":"420E741C-B1DE-47BD-974D-7D6819B74810","city":"北部湾城市群","areaGUID":null,"area":null,"cityLevel":null,"projectAmounts":"24","availableAmount":"212.80","remainingResourcesAmount":"44.31","averagePrice":"7044.08","landStoreResourcesAmount":"0.74","instockResourcesAmount":"12.09","curPlanSupplyAmount":"19.90","curYearsSoldAmount":"14.56"},
          //   {"provinceGUID":null,"province":null,"cityGUID":"F00AA6BC-061B-4D70-976E-A70541E8AE69","city":"成渝城市群","areaGUID":null,"area":null,"cityLevel":null,"projectAmounts":"33","availableAmount":"521.35","remainingResourcesAmount":"144.54","averagePrice":"14837.77","landStoreResourcesAmount":"0.00","instockResourcesAmount":"50.99","curPlanSupplyAmount":"87.02","curYearsSoldAmount":"47.21"},
          //   {"provinceGUID":null,"province":null,"cityGUID":"255BAB87-B765-47AC-98D8-DF9A469BA67F","city":"长江中游城市群","areaGUID":null,"area":null,"cityLevel":null,"projectAmounts":"31","availableAmount":"280.66","remainingResourcesAmount":"103.20","averagePrice":"7000.45","landStoreResourcesAmount":"0.00","instockResourcesAmount":"38.66","curPlanSupplyAmount":"77.49","curYearsSoldAmount":"24.05"},
          //   {"provinceGUID":null,"province":null,"cityGUID":"FC9373DC-342C-4C06-8475-F19D64A3676E","city":"其它","areaGUID":null,"area":null,"cityLevel":null,"projectAmounts":"21","availableAmount":"178.49","remainingResourcesAmount":"49.70","averagePrice":"8028.57","landStoreResourcesAmount":"0.00","instockResourcesAmount":"14.05","curPlanSupplyAmount":"36.14","curYearsSoldAmount":"12.60"},
          //   {"provinceGUID":null,"province":null,"cityGUID":"A71F03C0-452E-40B9-8DCA-F8A55A2C9941","city":"山东半岛城市群","areaGUID":null,"area":null,"cityLevel":null,"projectAmounts":"10","availableAmount":"91.27","remainingResourcesAmount":"33.64","averagePrice":"31419.66","landStoreResourcesAmount":"0.00","instockResourcesAmount":"33.64","curPlanSupplyAmount":"28.50","curYearsSoldAmount":"15.88"}],
              valueArr = [] // 储存显示的数据，获取最大值
              // max = data.data.maxHeatColor


          let pointData = []
          for (let i = 0; i < pointArr.length; i++) {
            if (geoCoordMap[pointArr[i].city]) {
              valueArr.push(pointArr[i][this.mapParams[this.tab - 1]])
              pointData.push({
                name: pointArr[i].city,
                locatedName: geoCoordMap[pointArr[i].city].locatedName,
                value: [...geoCoordMap[pointArr[i].city].location, pointArr[i][this.mapParams[this.tab - 1]]],
                ...pointArr[i]
              })
            }
          }

          this.getCountryJson(pointData, Math.max.apply(null,valueArr))
        }else {
          this.getCountryJson([], 0)
        }
      }).catch((e) => {
        console.log('getEchartData-err', e);
      });

    },
    // 初始化城市群地图
    setCountryCityMap(zone, data, max){
      let myChart = echarts.init(this.$refs.map,true),
          that = this,
          isAndroid = this.isAndroid()
      myChart.clear()
      echarts.registerMap('china', zone);

      // 自定义打点坐标
      let options = {
        backgroundColor: "#ECECEC",
        tooltip: {
          enterable: false, // 鼠标可移入tooltip中
          trigger: 'item',
          confine: true,
          backgroundColor: 'rgba(0,0,0,.75)',
          formatter: function (params) {
            if (!params.data) {
              return params.name
            }
            const dataItem = params.data;
            const p = that.mapParams[that.tab - 1]
            let unit = '亿元'
            if (that.tab==2) {
              unit = '个'
            } else if (that.tab==4){
              unit = '元'
            }

            let txt = `<div style="font-size:11px;padding:5px;">${dataItem.name}<br>
                <div style="fong-size:8px;margin-top:4px;color:#E8E8E8;margin-bottom:5px;line-height:150%">
                ${that.tabNames[that.tab - 1]}：${dataItem[p]}（${unit}）`
            txt = txt +`
                <span style="display:${p=='availableAmount'?'none':'block'}">总货值：${dataItem.availableAmount}（亿元）<br></span>
                <span style="display:${p=='projectAmounts'?'none':'block'}">项目数：${dataItem.projectAmounts}（个）<br></span>
                <span style="display:${p=='remainingResourcesAmount'?'none':'block'}">剩余货值：${dataItem.remainingResourcesAmount}（亿元）<br></span>
                <span style="display:${p=='averagePrice'?'none':'block'}">销售均价：${dataItem.averagePrice}（元）<br></span>
                <span style="display:${p=='landStoreResourcesAmount'?'none':'block'}">土储货值：${dataItem.landStoreResourcesAmount}（亿元）<br></span>
                <span style="display:${p=='instockResourcesAmount'?'none':'block'}">库存货值：${dataItem.instockResourcesAmount}（亿元）<br></span>
                <span style="display:${p=='curPlanSupplyAmount'?'none':'block'}">今年计划供应：${dataItem.curPlanSupplyAmount}（亿元）<br></span>
                <span style="display:${p=='curYearsSoldAmount'?'none':'block'}">今年实际已售：${dataItem.curYearsSoldAmount}（亿元）</div></span></div>`
            return txt
          },
        },
        geo: {
          map: 'china',
          zoom: 1.2,
          scaleLimit: { min: 1, max: 2.7 },
          roam: true,
          label: {
            normal: {
              show: true, // 是否显示对应地名
              formatter: '',
              textStyle: {
                color: '#ffffff',
                fontSize: 7.5
              }
            }
          },
          itemStyle: {					// 定义样式
            normal: {					// 普通状态下的样式
              areaColor: '#DDDDDD',
              borderColor: '#F8F8F8',
              shadowColor: '#F8F8F8',
              shadowBlur: 3
            },
            emphasis: {					// 高亮状态下的样式
            }
          }
        },
        series: [{
          type: isAndroid?'scatter':'effectScatter',
          rippleEffect: {
              period:4,
              brushType: 'stroke',
              scale:1.5
          },
          // type:'scatter',
          map: 'china',
          coordinateSystem: 'geo',
          data: data,
          rippleEffect: {
            brushType: 'fill'
          },
          label: {
            normal: {
              formatter: '{b}',
              position: 'bottom',
              show: true,
              textStyle:{
                fontSize: 7.5,
                color: '#999999'
              }
            }
          },
          // showEffectOn: 'render',
          itemStyle: {
            normal: {
              color: '#0D9B4F',
              shadowColor: '#BED3C8'
            }
          },
          symbolSize: function (val) {
            let num = (val[2] / max)*15;
            return num < 7 ? 7 : num
          },
        }],
      }
      myChart.setOption(options, true)
    },
    // 判断是否安卓
    isAndroid(){
      var u = navigator.userAgent;
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
      return isAndroid
    },
    // 获取地理区域地图数据
    getAreaData(){
      request({
        url: `/app-api/resources/areaMap`,
        method: 'post',
        data: {
          orgId: this.orgId,
          orgType: this.orgType,
          type: this.mapParams[this.tab - 1],
          isCurrentData: 1+this.sourceType
        }
      }).then(({ data }) => {
        if (data.code === 0) {
          let pointArr = data.data.cityMapDetail,
              valueArr = [] // 储存显示的数据，获取最大值

          let areaData = pointArr.map(i => {
            valueArr.push(i[this.mapParams[this.tab - 1]])
            return {
              name: i.area,
              value: [i[this.mapParams[this.tab - 1]]],
              ...i
            }
          })
          // 从大到小排序
          valueArr = valueArr.sort(function(a, b){return b - a})
          console.log(valueArr)

          let listData = []
          for (let i = 0; i < areaData.length; i++) {
            const item = areaData[i];
            let idx = this.areaArrTitle.findIndex( n => item.name.indexOf(n)!=-1 )
            if(idx!=-1){
              for (let j = 0; j < this.areaArrMain[idx].length; j++) {
                const element = this.areaArrMain[idx][j];
                listData.push({
                  name: element,
                  value: (valueArr.findIndex(i => i==item.value)+1)*10,
                  trueValue: item.value,
                  areaName: item.name,
                  availableAmount: item.availableAmount,
                  projectAmounts: item.projectAmounts,
                  remainingResourcesAmount: item.remainingResourcesAmount,
                  averagePrice: item.averagePrice,
                  landStoreResourcesAmount: item.landStoreResourcesAmount,
                  instockResourcesAmount: item.instockResourcesAmount,
                  curPlanSupplyAmount: item.curPlanSupplyAmount,
                  curYearsSoldAmount: item.curYearsSoldAmount
                })
              }
            }
          }

          this.getCountryJson(listData,  Math.max.apply(null,valueArr))
        } else {
          this.getCountryJson([],  0)
        }
      }).catch((e) => {
        console.log('getEchartData-err', e);
      });

    },
    // 初始化地理区域地图
    setAreaMap(zone, _data, max){
      let myChart = echarts.init(this.$refs.map,true), that = this
      myChart.clear()
      echarts.registerMap('china', zone);
      let options = {
        backgroundColor: "#ECECEC",
        tooltip: {
          enterable: true, // 鼠标可移入tooltip中
          trigger: 'item',
          confine: true,
          backgroundColor: 'rgba(0,0,0,.75)',
          formatter: function (params) {
            console.log(params)
            if (!params.data) {
              return params.areaName
            }
            const dataItem = params.data;
            const p = that.mapParams[that.tab - 1]
            let unit = '亿元'
            if (that.tab==2) {
              unit = '个'
            } else if (that.tab==4){
              unit = '元'
            }

            let txt = `<div style="font-size:11px;padding:5px;">${dataItem.areaName}<br>
                <div style="fong-size:8px;margin-top:4px;color:#E8E8E8;margin-bottom:5px;line-height:150%">
                ${that.tabNames[that.tab - 1]}：${dataItem[p]}（${unit}）`
            txt = txt +`
                <span style="display:${p=='availableAmount'?'none':'block'}">总货值：${dataItem.availableAmount}（亿元）<br></span>
                <span style="display:${p=='projectAmounts'?'none':'block'}">项目数：${dataItem.projectAmounts}（个）<br></span>
                <span style="display:${p=='remainingResourcesAmount'?'none':'block'}">剩余货值：${dataItem.remainingResourcesAmount}（亿元）<br></span>
                <span style="display:${p=='averagePrice'?'none':'block'}">销售均价：${dataItem.averagePrice}（元）<br></span>
                <span style="display:${p=='landStoreResourcesAmount'?'none':'block'}">土储货值：${dataItem.landStoreResourcesAmount}（亿元）<br></span>
                <span style="display:${p=='instockResourcesAmount'?'none':'block'}">库存货值：${dataItem.instockResourcesAmount}（亿元）<br></span>
                <span style="display:${p=='curPlanSupplyAmount'?'none':'block'}">今年计划供应：${dataItem.curPlanSupplyAmount}（亿元）<br></span>
                <span style="display:${p=='curYearsSoldAmount'?'none':'block'}">今年实际已售：${dataItem.curYearsSoldAmount}（亿元）</div></span></div>`
            return txt
          },
        },
        geo: {
          map: 'china',
          zoom: 1.2,
          scaleLimit: { min: 1, max: 2.7 },
          roam: true,
          label: {
            normal: {
              show: true, // 是否显示对应地名
              formatter: '',
              // formatter (param) {
              //   // 有数据才显示label
              //   let index = data.findIndex(item => item.locatedName == param.name)
              //   return index == -1 ? '' : param.name
              // },
              textStyle: {
                color: '#ffffff',
                fontSize: 7.5
              }
            }
          },
          itemStyle: {					// 定义样式
            normal: {					// 普通状态下的样式
              areaColor: '#DDDDDD',
              borderColor: '#F8F8F8',
              shadowColor: '#F8F8F8',
              shadowBlur: 3
            },
            // emphasis: {
            //   areaColor: '#48c7c0'
            // }
          }
        },
        visualMap: {
          min: 0,
          max: 60,
          left: 'left',
          top: 'bottom',
          text: ['高', '低'],
          calculable: true,
          show:false,
          inRange: {
            color: ['#006E38','rgb(38, 144, 88)','rgb(16, 167, 89)','rgb(37, 197, 114)','rgb(134, 218, 143)','#AEE2E5']
          }
        },
        series: [
          {
            type: 'map',
            geoIndex: 0,
            mapType: 'china',
            data: _data,
          }
        ],
      }
      myChart.setOption(options, true)

      myChart.on('click',param => {
        myChart.dispatchAction({type: 'downplay'});
        this.areaAction(param.name, myChart)
      })
    },
    // 地理区域分配
    areaAction(area, myChart){
      let actArr = []

      for (let i = 0; i < this.areaArrMain.length; i++) {
        const itemArr = this.areaArrMain[i];
        let index = itemArr.findIndex( n => n.indexOf(area)!=-1)
        if (index!=-1) {
          actArr = itemArr
        }
      }
      
      for (let i = 0; i < actArr.length; i++) {
        myChart.dispatchAction({type: 'highlight', name: actArr[i]});
      }
    },
    // 柱状图逻辑处理
    setBar() {
      let _url = [
        '/app-api/resources/provinceChart',  // 城市布局
        '/app-api/resources/cityGroupChart',  // 城市群资源
        '/app-api/resources/areaChart',  // 地理区域  
      ]
      request({
        url: _url[this.mapTab],
        method: 'post',
        data: {
          orgId: this.orgId,
          orgType: this.orgType,
          type: this.mapParams[this.tab - 1],
          isCurrentData: 1+this.sourceType
        }
      }).then(res => {

        let _lengend = [], _xAxisData = [], _series = []
        if (!res.data.data||res.data.data.length>0) {

          // let _data = res.data.data,
          // let _data = [{"organizationName":"奥园集团","organizationGUID":"11B11DB4-E907-4F1F-8835-B9DAAB6E1F23",
          //   "cityGroupVo":[
          //     {"name":"北部湾城市群","value":"212.80"},
          //     {"name":"长江三角洲城市群","value":"439.00"},
          //     {"name":"长江中游城市群","value":"280.66"},
          //     {"name":"成渝城市群","value":"521.35"},
          //     {"name":"关中平原城市群","value":"139.00"},
          //     {"name":"海峡西岸城市群","value":"261.20"},
          //     {"name":"京津冀城市群","value":"93.19"},
          //     {"name":"辽中南城市群","value":"97.31"},
          //     {"name":"其它","value":"178.49"},
          //     {"name":"山东半岛城市群","value":"91.27"},
          //     {"name":"粤港澳大湾区","value":"937.78"},
          //     {"name":"中原城市群","value":"140.74"}]},
          //   {"organizationName":"地产集团","organizationGUID":"AA90A163-F782-4B78-4584-08D7E5E57C34",
          //   "cityGroupVo":[
          //     {"name":"北部湾城市群","value":"54.85"},
          //     {"name":"长江三角洲城市群","value":"263.46"},
          //     {"name":"长江中游城市群","value":"123.65"},
          //     {"name":"成渝城市群","value":"162.57"},
          //     {"name":"关中平原城市群","value":"39.30"},
          //     {"name":"海峡西岸城市群","value":"175.10"},
          //     {"name":"京津冀城市群","value":"36.10"},
          //     {"name":"辽中南城市群","value":"97.31"},
          //     {"name":"其它","value":"111.67"},
          //     {"name":"山东半岛城市群","value":"82.95"},
          //     {"name":"粤港澳大湾区","value":"698.86"},
          //     {"name":"中原城市群","value":"39.11"}]},
          // {"organizationName":"商业地产集团","organizationGUID":"69EEBD5F-A9F3-4EEE-4640-08D7E5E57C34",
          // "cityGroupVo":[
          //   {"name":"北部湾城市群","value":"157.94"},
          //   {"name":"长江三角洲城市群","value":"175.54"},
          //   {"name":"长江中游城市群","value":"157.00"},
          //   {"name":"成渝城市群","value":"358.78"},
          //   {"name":"关中平原城市群","value":"99.70"},
          //   {"name":"海峡西岸城市群","value":"86.11"},
          //   {"name":"京津冀城市群","value":"57.09"},
          //   {"name":"其它","value":"66.82"},
          //   {"name":"山东半岛城市群","value":"8.31"},
          //   {"name":"粤港澳大湾区","value":"238.91"},
          //   {"name":"中原城市群","value":"101.63"}]}],
          //  finalData = {}

          let _data = res.data.data,
           finalData = {},that = this

          if (this.mapTab==0) {
            _data.prodectData = ['一线城市','新一线城市','二线城市','三线城市','四五线城市']
          } else if (this.mapTab==1){
            _data.prodectData = [
            '粤港澳大湾区','长江三角洲城市群','京津冀城市群','成渝城市群','关中平原城市群','长江中游城市群',
            '海峡西岸城市群','北部湾城市群','中原城市群','山东半岛城市群','辽中南城市群','哈长城市群',
            '呼包鄂榆城市群','兰西城市群','其它']
          }else if (this.mapTab==2){
            _data.prodectData = ['华南区域','西南区域','华东区域','华中区域','华北区域','西北区域']
          }
          let datalist = [], itemArr = []
          for (let a = 0; a < _data.prodectData.length; a++) {
            itemArr[a] = {
              name: _data.prodectData[a],
              value: 0
            }
          }

          function dealWith(arr){
            var result = [];
            var obj = {};
            let final = []
            for(var i =0; i<arr.length; i++){
              if (that.mapTab==0) {
                if(!obj[arr[i].cityLevel]){
                  result.push(arr[i]);
                  obj[arr[i].cityLevel] = true;
                }
              } else {
                if(!obj[arr[i].name]){
                  result.push(arr[i]);
                  obj[arr[i].name] = true;
                }
              }
            }
            
            for (let j = 0; j < _data.prodectData.length; j++) {
              // const idx = result.findIndex(fruit=> fruit.name==_data.prodectData[j])
              const idx = -1,val = 0
              if (that.mapTab==0) {
                idx = result.findIndex(fruit=> _data.prodectData[j].indexOf(fruit.cityLevel)!=-1)
              }else{
                idx = result.findIndex(fruit=> _data.prodectData[j].indexOf(fruit.name)!=-1)
              }
              final.push({
                name: _data.prodectData[j],
                value: that.mapTab==0?result[idx].levelPercent:result[idx].value
              })
            }
            return final
          }

          for (let i = 0; i < _data.length; i++) {
            let arr = []
            if (this.mapTab==0) {
              arr = _data[i].cityLevelVo.concat(itemArr)
            } else if (this.mapTab==1){
              arr = _data[i].cityGroupVo.concat(itemArr)
            }else if (this.mapTab==2){
              arr = _data[i].areaVo.concat(itemArr)
            }
            datalist[i] = {
              resourceName: _data[i].organizationName,
              resourceGUID: _data[i].organizationGUID,
              productData: dealWith(arr)
            }
          }
          console.log(datalist)
          finalData = this.processesData(datalist, _data.prodectData)

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
        
        let colorArr = [
          ["#006E38", "#01AB91", "#B4A36B", "#FFC900", "#A7EDB9"],
          ["#3D497F", "#133F97", "#4995E3", "#006D37", "#01AB91","#9949E3","#C32337","#ED553D","#F97545","#BFAF7B","#F3A33F","#FFC900","#FFE94D","#FFF5A9","#BDFDCD"],
          ["#133F97", "#1F9B5B", "#F97545", "#B3A36B", "#FFC30F", "#FFF5A9"]
        ]
        let option = {
          color: colorArr[this.mapTab],
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
              fontSize: (window.innerWidth / 375) * 9,
              lineHeight: 10,
              color: '#999999'
            },
          },
          grid: {
            left: "3%",
            right: "3%",
            bottom: this.mapTab==1?"28%":"18%",
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
                fontSize: '11',
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

        if (_xAxisData.length > 5) {
          option.dataZoom = [{
            id: 'dataZoomX',
            type: 'inside',
            xAxisIndex: [0],
            filterMode: 'none',
            start: 0,
            // minValueSpan: 5,
            // maxValueSpan: 8,
            end: 7 / _xAxisData.length * 100
          }]
        }

        let myChart = null
        if (this.mapTab==1) {
          myChart = echarts.init(this.$refs['bar']);
          myChart.getDom().style.height =  "350px";
　　      myChart.resize();
        } else {
          myChart = echarts.init(this.$refs['bar']);
          myChart.getDom().style.height =  "300px";
　　      myChart.resize();
        }
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
        // let inLoopData = []
        // if (this.mapTab==0) {
        //   inLoopData = _fullData[i].cityLevelVo
        // } else if (this.mapTab==1){
        //   inLoopData = _fullData[i].cityGroupVo
        // }else if (this.mapTab==2){
        //   inLoopData = _fullData[i].areaVo
        // }
        let _arrOut = []
        for (let j = 0; j < inLoopData.length; j++) {
          const item = inLoopData[j];
          _arrOut.push(item.value)
        }
        valueArr.push(_arrOut)
      }

      console.log(_fullData)
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
      let _url = [
        '/app-api/resources/provinceChart',  // 城市布局
        '/app-api/resources/cityGroupChart',  // 城市群资源
        '/app-api/resources/areaChart',  // 地理区域  
      ]
      request({
        url: _url[this.mapTab],
        method: 'post',
        data: {
          orgId: this.orgId,
          orgType: this.orgType,
          type: this.mapParams[this.tab - 1],
          isCurrentData: 1+this.sourceType
        }
      }).then(res => {
        console.log(res);
        let pieData = [];
        if (res.data.data.length>0) {
          let loopData = []
          if (this.mapTab==0) {
            loopData = res.data.data[0].cityLevelVo
          } else if (this.mapTab==1){
            loopData = res.data.data[0].cityGroupVo
          }else if (this.mapTab==2){
            loopData = res.data.data[0].areaVo
          }

          for (let i = 0; i < loopData.length; i++) {
            const item = loopData[i]
            pieData.push({
              name: (item.cityLevel || item.name) + ' ',
              value: item.levelPercent || item.value
            });
          }
        }

        if (!pieData.length) {
          pieData = [{ name: '暂无数据', value: 0 }];
        }
        let legendData = pieData.map(item => {
          return item.name;
        });

        let color = [
          ["#006E38", "#01AB91", "#B4A36B", "#FFC900", "#A7EDB9"],
          ["#3D497F", "#133F97", "#4995E3", "#006D37", "#01AB91","#9949E3","#C32337","#ED553D","#F97545","#BFAF7B","#F3A33F","#FFC900","#FFE94D","#FFF5A9","#BDFDCD"],
          ["#133F97", "#1F9B5B", "#F97545", "#B3A36B", "#FFC30F", "#FFF5A9"]
        ]
        let series = [
          {
            name: '',
            type: 'pie',
            radius: this.mapTab==1?'40%':'45%',
            center: ['50%', '40%'],
            color: color[this.mapTab],
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
            // data: this.mapTab==1?[
            //   { name: '粤港澳大湾区', value: '10'},
            //   { name: '成渝城市群', value: '10'},
            //   { name: '京津冀城市群', value: '10'},
            //   { name: '海峡西岸城市群', value: '10'},
            //   { name: '辽中南城市群', value: '10'},
            //   { name: '中原城市群', value: '10'},
            //   { name: '呼包鄂榆城市群', value: '10'},
            //   { name: '关中平原城市群', value: '10'},
            //   { name: '长江中游城市群', value: '10'},
            //   { name: '兰西城市群', value: '10'},
            //   { name: '山东半岛城市群', value: '10'},
            //   { name: '长江三角洲城市群', value: '10'},
            //   { name: '北部湾城市群', value: '10'},
            //   { name: '哈长城市群', value: '10'},
            //   { name: '其它', value: '10'},
            // ]:pieData
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
        // if (this.mapTab!=1) {
          option.legend.data = legendData
        // } else {
        //   option.legend.data = [
        //       '粤港澳大湾区','成渝城市群','京津冀城市群','海峡西岸城市群','长江三角洲城市群',
        //       '辽中南城市群','长江中游城市群','山东半岛城市群','北部湾城市群','哈长城市群',
        //       '中原城市群','呼包鄂榆城市群','关中平原城市群','兰西城市群','其它'
        //     ]
        // }
        
        let myChart = null
        if (this.mapTab==1) {
          myChart = echarts.init(this.$refs['pie']);
          myChart.getDom().style.height =  "280px";
　　      myChart.resize();
        } else {
          myChart = echarts.init(this.$refs['pie']);
          myChart.getDom().style.height =  "250px";
　　      myChart.resize();
        }
        myChart.setOption(option, true);
      });
    },
    // 调整查看更多页面
    getMore() {
      sessionStorage.sourceType = this.sourceType  // 顶部sourceType
      sessionStorage.sourceTab = 1 // 城市布局下标
      sessionStorage.tab = this.tab  // 顶部数据属性tab下标
      sessionStorage.mapTab = this.mapTab  // 顶部地图类型tab
      
      const sortList = ['availableAmount', 'projectAmounts', 'remainingResourcesAmount', 'averagePrice', 'landStoreResourcesAmount', 'instockResourcesAmount', 'curPlanSupplyAmount', 'curYearsSoldAmount']
      this.$router.push({
        path: '/resourceStructure/more',
        query: { 
          token: getUrlParam('token'), 
          orgId: this.orgId ,
          type: this.mapParams[this.tab - 1], 
          mapTab: this.mapTab, 
          orderParam:sortList[this.tab - 1],
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
.tabBox {
  display: flex;
  flex-wrap: wrap;
  font-size: 12px;
  justify-content: space-between;
  .tabItem {
    width: 74px;
    height: 25px;
    background: white;
    color: #666666;
    text-align: center;
    line-height: 25px;
    font-size: 10px;
    border: 1px solid rgba(204, 204, 204, 1);
    margin-bottom: 10px;
    border-radius: 3px;
    &.active {
      background: rgba(32, 155, 92, 0.08);
      border: 1px solid rgba(32, 155, 92, 1);
      color: #006e38;
    }
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
.huojv-chart-box-item-city{
  width: 100%;
  height: 350px;
}
.huojv-chart-box-item-small.city{
  width: 100%;
  height: 260px;
}
.huojv-chart-box-item,
.huojv-chart-box-item-small {
  margin-bottom: 20px;
}
.mapChart{
  background: #ECECEC;
}
.mapTabBox /deep/ .van-tabs__wrap{
  border:none
}
</style>