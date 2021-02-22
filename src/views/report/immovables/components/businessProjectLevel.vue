<template>
	<div class="report-index">
    <!-- <img src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1652123795,1945063222&fm=26&gp=0.jpg" alt=""> -->
		<div class="main-content" style="width: 100%;">
      <div class="data-content-panel no-top-left-radius clearfix">
        <div class="BFC">
          <div class="data-title-box data-title-line">
            <span class="title" @click="prev">项目基本信息</span>
          </div>
          <el-table stripe :show-header="false"
              class="main-theme-table huo-list-table table-row-color mb-30"
              ref="tableRef1" :data="tableList1"
              size="mini" highlight-current-row
            >
              <el-table-column prop="name" label="" align="center"></el-table-column>
              <el-table-column prop="value" label="" align="center">
                <template slot-scope="scope">
                  <div v-if="scope.row.name" v-html="filterValInMinix(scope.row.value, scope.row.unit)"></div>
								</template>
              </el-table-column>
          </el-table>
        </div>
        <div class="BFC">
          <div class="data-title-box data-title-line">
            <span class="title">项目实景图</span>
          </div>
          <div class="">
            <img v-if="!showfailImg1" @click="prev('prevImg1')" class="panelImg" :src="prevImg1" alt="" >
            <img v-if="showfailImg1" class="panelImg" src="../../../../assets/images/fail.png" >
          </div>
          <p class="imgDesc">位置</p>
          <div class="">
            <img v-if="!showfailImg2" @click="prev('prevImg2')" class="panelImg" :src="prevImg2" alt="" >
            <img v-if="showfailImg2" class="panelImg" src="../../../../assets/images/fail.png" >
          </div>
          <p class="imgDesc">实景图</p>
        </div>
        <div class="BFC">
          <div class="data-title-box data-title-line">
            <span class="title">运营情况</span>
          </div>
          <el-table stripe :show-header="false"
              class="main-theme-table huo-list-table table-row-color  mb-30"
              ref="tableRef2" :data="tableList2"
              size="mini" highlight-current-row
            >
              <el-table-column prop="name" label="" align="center"></el-table-column>
              <el-table-column prop="value" label="" align="center">
                <template slot-scope="scope">
                  <div v-if="scope.row.name" v-html="filterValInMinix(scope.row.value, scope.row.unit)"></div>
								</template>
              </el-table-column>
          </el-table>
        </div>
        <div class="BFC">
          <div class="data-title-box data-title-line">
            <span class="title">运营情况-出租率</span>
          </div>
          <div class="huojv-chart-box2">
            <div ref="line1" class="huojv-chart-box-item"></div>
          </div>
        </div>
        <div class="BFC">
          <div class="data-title-box data-title-line">
            <span class="title">运营情况-租金收入</span>
          </div>
          <div class="huojv-chart-box2">
            <div ref="line2" class="huojv-chart-box-item"></div>
          </div>
        </div>
      </div>
		</div>
    <van-image-preview v-model="prevshow" :images="images"></van-image-preview>
	</div>
</template>

<script>
import scrollFixed from '@/mixin/scroll-fixed';
import { List, PullRefresh, ImagePreview } from 'vant';
import { getLocalStorage } from '@/utils/local-storage';
import request from '@/utils/request';
import echarts from 'echarts';
import {
  handleNum2String,
  handleDate,
  getUrlParam,
  jumpToPj,
} from '@/utils/common';

export default {
  mixins: [scrollFixed],
  data() {
    return {
      orgId: '',
      orgType: '',
      tableList1: [],
      tableList2: [],
      prevshow: false,
      images: [],
      prevImg1: '',
      prevImg2: '',
      imgurl1: '',
      imgurl2: '',
      showfailImg1: false,
      showfailImg2: false,
      queryPeriodList: ['年度','季度','月度','日'],
      imgaaa: ''
    };
  },
  props: ["tab"],
  watch: {
    '$store.state.orgId': function (newVal, oldVal) {
      this.init();
    },
    'tab': function (newVal, oldVal) {
        this.getOperInfoProject()
    },
  },
  mounted() {
    this.init();
  },
  filters: {
    // 销售面积为空或0，开销比/供销比显示为横杠
    changeVal(val1, val2) {
      // if(val1==0||(val1&&parseFloat(val1)>=0)){
      if (val1 && parseFloat(val1) > 0) {
        console.log(typeof val2);
        if (typeof val2 === 'undefined') {
          // 没传
          return val1 == '' ? '-' : val1;
        } else if (typeof val2 === 'object') {
          return '-';
        } else {
          return parseFloat(val1) == 0 || val1 == ''
            ? '-'
            : val2 <= 0
            ? '-'
            : val2;
        }
      }
      return '-';
    },
  },
  methods: {
    init() {
      this.orgId = getUrlParam('chooseOrgId') || getUrlParam('orgId') || getLocalStorage('orgId').orgId;
      this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType;
      this.tableList1 = [
        {},{name: '项目名称', value: '', unit: ''},
        {name: '房屋地址', value: '', unit: ''},
        {name: '楼层数', value: '', unit: ''},
        {name: '运营方', value: '', unit: ''},
        {name: '投入成本', value: '', unit: '万元'},
        {name: '产权人', value: '', unit: ''},
        {name: '规划用途', value: '', unit: ''},
        {name: '建筑面积', value: '', unit: '㎡'},
        {name: '开业日期', value: '', unit: ''},
        {name: '共有情况', value: '', unit: ''},
        {name: '登记日期', value: '', unit: ''},
        {name: '套内面积', value: '', unit: '㎡'},
        {name: '是否抵押', value: '', unit: ''},
      ]
      this.tableList2 = [
        {},{name: '出租率', value: '', unit: '%'},
        {name: '租金收入', value: '', unit: '万元'},
        {name: '坪效', value: '', unit: '元/㎡'},
        {name: '出租费用', value: '', unit: '万元'},
      ]

      // this.getProjectOverview()

      this.getProjPicInfo()
      this.getProjectInfo()
      this.getOperInfoProject()
      this.getLineChartList()

    },
    prev(prop) {
      request({
        url: '/app-api/allPeriod/getAttachToken',
        method: 'get',
      }).then(({data}) => {
        // let aaa = 'https://pc.zthuang.com/doc/download?documentGuid=fde55f74-4e65-44cf-bcc9-073113b08a74'+data.data
        // this.checkImgExists(aaa).then(()=>{
        //   this.imgaaa = aaa
        //   console.log('有效链接')
        // }).catch(()=>{
        //   console.log('无效链接')
        // })

          if (prop=='prevImg1') {
            this.images = [this.imgurl1 + data.data]
          } else {
            this.images = [this.imgurl2 + data.data]
          }
           this.prevshow = true
      }).catch((e) => {
          console.log('getAttachToken-err', e);
      });
    },
    // 图片
    getProjPicInfo(){
      request({
        url: `/app-api/realEstate/getProjPicInfo`,
        method: 'get',
        params: {
          orgId: this.orgId,
        },
      }).then(({ data }) => {
        if (data.data) {
          this.imgurl1 = data.data.mapUrl
          // this.imgurl1 = 'https://pc.zthuang.com/doc/download?documentGuid=8ad59291-ab64-4690-9291-be94818a68a0'
          this.imgurl2 = data.data.picUrl
          // this.imgurl2 = 'https://pc.zthuang.com/doc/download?documentGuid=fde55f74-4e65-44cf-bcc9-073113b08a74'
          // this.checkShowImg('prevImg1', data.data.mapUrl)
          this.checkShowImg('prevImg1')
          this.checkShowImg('prevImg2')
          // this.checkShowImg('prevImg2', data.data.picUrl)
        }else {
          console.log('没有图片时')
          this.showfailImg1 = true
          this.showfailImg2 = true
        }
      });
    },
    checkShowImg(prop){
      request({
        url: '/app-api/allPeriod/getAttachToken',
        method: 'get',
      }).then(({data}) => {
        let url = prop == 'prevImg1' ? this.imgurl1 : this.imgurl2
            url = url + data.data
        this.checkImgExists(url).then(()=>{
          if (prop=='prevImg1') {
            this.prevImg1 = url
            this.showfailImg1 = false
          } else {
            this.prevImg2 = url
            this.showfailImg2 = false
          }
          console.log(prop+'有效链接')
        }).catch(()=>{
          if (prop=='prevImg1') {
            this.showfailImg1 = true
          } else {
            this.showfailImg2 = true
          }
          console.log(prop+'无效链接')
        })
      }).catch((e) => {
          console.log('getAttachToken-err', e);
      });
    },
    checkImgExists(imgurl) {
      return new Promise(function(resolve, reject) {
        let ImgObj = new Image();
        ImgObj.src = imgurl;
        ImgObj.onload = function(res) {
          resolve(res);
        }
        ImgObj.onerror = function(err) {
          reject(err)
        }
      })
			},
    // 项目信息
    getProjectInfo(){
      request({
        url: `/app-api/realEstate/getProjectInfo`,
        method: 'get',
        params: {
          orgId: this.orgId,
        },
      }).then(({ data }) => {
        if (data.data) {
          let _data = data.data
          this.tableList1 = [
            {},{name: '项目名称', value: _data.orgName, unit: ''},
            {name: '房屋地址', value: _data.houseAddress, unit: ''},
            {name: '楼层数', value: _data.floorNum, unit: ''},
            {name: '运营方', value: _data.operator, unit: ''},
            {name: '投入成本', value: _data.investCost, unit: '万元'},
            {name: '产权人', value: _data.owner, unit: ''},
            {name: '规划用途', value: _data.planUse, unit: ''},
            {name: '建筑面积', value: _data.buildArea, unit: '㎡'},
            {name: '开业日期', value: _data.openDate, unit: ''},
            {name: '共有情况', value: _data.mutualInfo, unit: ''},
            {name: '登记日期', value: _data.regiDate, unit: ''},
            {name: '套内面积', value: _data.insideArea, unit: '㎡'},
            {name: '是否抵押', value: _data.isMortgage, unit: ''}
          ]
        }
      });
    },
    // 运营情况
    getOperInfoProject(){
      request({
        url: `/app-api/realEstate/getOperInfoProject`,
        method: 'get',
        params: {
          orgId: this.orgId,
          queryPeriod: this.queryPeriodList[this.tab],
        },
      }).then(({ data }) => {
         if (data.data) {
          let _data = data.data
          this.tableList2 = [
            {},{name: '出租率', value: _data.occrate, unit: '%'},
            {name: '租金收入', value:  _data.rentIncome, unit: '万元'},
            {name: '坪效', value:  _data.areaEffect, unit: '元/㎡'},
            {name: '出租费用', value:  _data.rentFee, unit: '万元'},
          ]

        }
      });
    },
    // 折线图
    getLineChartList(){
      request({
        url: `/app-api/realEstate/getLineChartList`,
        method: 'get',
        params: {
          orgId: this.orgId,
        },
      }).then(({ data }) => {
        let _data = data.head.map( i => {
          return {
            name: i.desc,
            value1: null,
            value2: null,
          }
        })
        if (data.list.length>0) {
          for (let i = 0; i < data.list.length; i++) {
            const item = data.list[i];
            _data[i].value1 = item.occrate
            _data[i].value2 = item.rentIncome
          }
        }
        this.setLine(_data, 'line1', ['出租率'])
        this.setLine(_data, 'line2', ['租金收入'])
      });
    },
    setLine(_data, el, _legend) {
      let seriesData = []
      if (el=='line1') {
        seriesData = _data.map(i => i.value1)
      } else {
        seriesData = _data.map(i => i.value2)
      }

      let option = {
        tooltip: {
          trigger: 'axis',
          backgroundColor: "rgba(255,255,255,0.8)",
          color: "#666666",
          extraCssText: 'box-shadow: 0 0 10px #ccc; padding: 15px;',
          borderColor: "gray", //设置边框颜色
          confine: true,
          textStyle: {
            color: "#666666", //设置文字颜色
            fontSize: 10,
          },
        },
        legend: {
          show: true,
          bottom: '0',
          textStyle: {
            fontSize: 11,
            color: '#999999'
          },
          data: _legend
        },
        grid: {
          top: '12%',
          left: '4%',
          bottom: '10%',
          containLabel: true
        },
        animation: true,
        calculable: true,
        xAxis: {
          type: 'category',
          //   boundaryGap: false,
          data: _data.map(i => i.name),
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#E8E8E8'
            }
          },
          axisLabel: {
            show: true,
            rotate: 30,
            textStyle: {
              color: '#666666',
              fontSize: 11
            }
          }
        },
        yAxis: {
          name: '单位：'+ (el=='line1'?'%':'万元'),
          type: 'value',
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
              color: "#E8E8E8"
            }
          },
          axisLabel: {
            formatter: el=='line1'?'{value}%':'{value}',
            show: true,
            textStyle: {
              color: '#666666',
              fontSize: 11
            }
          }
        },
        series: [
          {
            name: _legend,
            data: seriesData,
            type: 'line',
            // symbol: 'circle', //设定为实心点
            symbolSize: 4, //设定实心点的大小
            smooth: true,
            itemStyle: {
              normal: {
                color: "#006E38",
                // borderColor: '#f58f23',
                // borderWidth: 1,
              }
            },
          }
        ]
      }

      let isEmpty = true
        seriesData.forEach(item => {
          if (item) {
            isEmpty = false
          }
        });

        if (isEmpty) {
          option.title = {
            text: '暂无数据',
            show: true,
            textStyle: {
                fontWeight: 'normal',
                fontSize: 14,
                color: '#999999'
            },
            x: 'center',
            y: 'center'
          }
          option.xAxis.show = false
          option.yAxis.show = false
          option.backgroundColor = '#f9f8f8'
          option.legend.data = []
        }

      if (_data.length > 4) {
        option.dataZoom = [{
          id: 'dataZoomX',
          type: 'inside',
          xAxisIndex: [0],
          filterMode: 'none',
          start: 0,
          minValueSpan: 3,
          maxValueSpan: 5,
          end: 4 / _data.length * 100
        }]
      }

      let myChart = new echarts.init(this.$refs[el]);
      myChart.setOption(option, true);
    },
  },
  components: {
    [List.name]: List,
    [PullRefresh.name]: PullRefresh,
    [ImagePreview.Component.name]: ImagePreview.Component
  },
};
</script>

<style lang="scss" scoped>
.panelImg {
  width: 100%;
  display: block;
}
.imgDesc{
  margin: 10px auto;
  font-size: 12px;
  color: #999999;
  text-align: center;
}
</style>