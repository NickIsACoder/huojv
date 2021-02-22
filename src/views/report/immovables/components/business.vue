<template>
	<div class="report-index">
		<div class="main-content" style="width: 100%;">
      <div class="data-content-panel no-top-left-radius clearfix">
        <template v-if="orgType<5">
          <div class="BFC">
            <div class="data-title-box data-title-line">
              <span class="title">项目基本信息</span>
            </div>
            <el-table stripe
                  class="huo-list-table tree-table" ref="tableRef1" size="mini"
                  highlight-current-row
                  row-key="orgId"
                  :data="tableActiveData1"
                  :expand-row-keys="expandNodes1"
                  border :indent="5"
                  lazy :load="load1"
                  :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                <el-table-column property="orgName" label="集团" width="120" fixed>
                    <template slot-scope="scope">
                        <span v-if="scope.row.orgType==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,scope.row.orgType)">{{scope.row.orgName}}</span>
                        <span v-else>{{scope.row.orgName}}</span>
                    </template>
                </el-table-column>
                <el-table-column property="projNum" label="项目数" align="center" width="100"></el-table-column>
                <el-table-column property="buildArea" label="建筑面积(m²)" align="center" width="100">
                </el-table-column>
                <el-table-column property="investCost" label="投入成本(万元)" align="center" width="100">
                </el-table-column>
            </el-table>
            <div class="toggleBox pb-20">
              <span class="more" @click="getMore">查看更多 <i class="el-icon-arrow-right"></i></span>
            </div>
          </div>
          <div class="BFC">
            <div class="data-title-box data-title-line">
              <span class="title">运营情况</span>
            </div>
            <el-table stripe
                class="huo-list-table tree-table" ref="tableRef2" size="mini"
                highlight-current-row
                row-key="orgId"
                :data="tableActiveData2"
                :expand-row-keys="expandNodes2"
                border :indent="5"
                lazy :load="load2"
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                <el-table-column property="orgName" label="集团" width="120" fixed>
                    <template slot-scope="scope">
                        <span v-if="scope.row.orgType==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,scope.row.orgType)">{{scope.row.orgName}}</span>
                        <span v-else>{{scope.row.orgName}}</span>
                    </template>
                </el-table-column>
                <el-table-column property="occrate" label="出租率" align="center" width="100">
                    <template slot-scope="scope">
                        {{scope.row.occrate}}%
                    </template>
                </el-table-column>
                <el-table-column property="rentIncome" label="租金收入(万元)" align="center" width="100">
                </el-table-column>
                <el-table-column property="areaEffect" label="坪效(元/m²)" align="center" width="100">
                </el-table-column>
                <el-table-column property="rentFee" label="出租费用(万元)" align="center" width="100">
                </el-table-column>
            </el-table>
            <!-- <div class="toggleBox pb-20">
              <span class="more">查看更多 <i class="el-icon-arrow-right"></i></span>
            </div> -->
          </div>
        </template>
        <template v-else>
          <div class="data-title-box data-title-line">
            <span class="title">项目基本信息</span>
          </div>
          <el-table stripe
                class="huo-list-table tree-table" ref="tableRef1" size="mini"
                highlight-current-row :data="tableList1">
                <el-table-column property="orgName" label="项目名" width="120" fixed>
                  <template slot-scope="scope">
                    <span v-if="scope.row.orgType==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,scope.row.orgType)">{{scope.row.orgName}}</span>
                    <span v-else>{{scope.row.orgName}}</span>
                  </template>
                </el-table-column>
                <el-table-column property="houseAddress" label="地址" align="center" width="100"></el-table-column>
                <el-table-column property="owner" label="产权人" align="center" width="80"></el-table-column>
                <el-table-column property="mutualInfo" label="共有情况" align="center" width="80"></el-table-column>
                <el-table-column property="buildArea" label="建筑面积(m²)" align="center" width="100"></el-table-column>
                <el-table-column property="insideArea" label="套内面积(m²)" align="center" width="100"></el-table-column>
                <el-table-column property="regiDate" label="登记日期" align="center" width="80"></el-table-column>
                <el-table-column property="isMortgage" label="是否抵押" align="center" width="80"></el-table-column>
                <el-table-column property="openDate" label="开业日期" align="center" width="100"></el-table-column>
                <el-table-column property="operator" label="运营方" align="center" width="100"></el-table-column>
                <el-table-column property="floorNum" label="楼层数" align="center" width="100"></el-table-column>
                <el-table-column property="investCost" label="投入成本(万元)" align="center" width="100"></el-table-column>
            </el-table>
            <!-- <div class="toggleBox pb-20">
              <span class="more">查看更多 <i class="el-icon-arrow-right"></i></span>
            </div> -->
            <div class="data-title-box data-title-line">
              <span class="title">运营情况</span>
            </div>
            <el-table stripe
                class="huo-list-table tree-table" ref="tableRef2" size="mini"
                highlight-current-row :data="tableList2">
                <el-table-column property="orgName" label="项目名" width="120" fixed>
                  <template slot-scope="scope">
                    <span v-if="scope.row.orgType==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,scope.row.orgType)">{{scope.row.orgName}}</span>
                    <span v-else>{{scope.row.orgName}}</span>
                  </template>
                </el-table-column>
                <el-table-column property="occrate" label="出租率" align="center" width="100">
                    <template slot-scope="scope">
                        {{scope.row.occrate}}%
                    </template>
                </el-table-column>
                <el-table-column property="rentIncome" label="租金收入(万元)" align="center" width="100"></el-table-column>
                <el-table-column property="areaEffect" label="坪效(元/m²)" align="center" width="100"></el-table-column>
                <el-table-column property="rentFee" label="出租费用(万元)" align="center" width="100"></el-table-column>
            </el-table>
        </template>
        
        <div class="BFC">
          <div class="data-title-box data-title-line">
            <span class="title">运营情况-出租率</span>
          </div>
          <div class="huojv-chart-box2">
            <div ref="bar1" class="huojv-chart-box-item"></div>
          </div>
        </div>
        <div class="BFC">
          <div class="data-title-box data-title-line">
            <span class="title">运营情况-租金收入</span>
          </div>
          <div class="huojv-chart-box2">
            <div ref="bar2" class="huojv-chart-box-item"></div>
          </div>
        </div>
      </div>
		</div>
	</div>
</template>

<script>
import scrollFixed from '@/mixin/scroll-fixed';
import { List, PullRefresh } from 'vant';
import { getLocalStorage } from '@/utils/local-storage';
import request from '@/utils/request';
import echarts from 'echarts';
import $ from 'jquery';
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
      tab1: 1,
      tab2: 1,
      level1: 0,
      expandNodes1: [],
      tableActiveData1: [],
      level2: 0,
      expandNodes2: [],
      tableActiveData2: [],
      orgId: '',
      orgType: '',
      tableList1: [],
      tableList2: [],
      list: [],
      queryPeriodList: ['年度','季度','月度','日'],
    };
  },
  props: ["tab"],
  watch: {
    '$store.state.orgId': function (newVal, oldVal) {
      this.init();
    },
    'tab': function (newVal, oldVal) {
      this.level2 = 0
      this.expandNodes2 = []
      this.tableActiveData2 = []
      if (this.orgType==5) {
        this.getOperInfoTableList()
      } else {
        this.getTableList2()
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      $('.el-table__header-wrapper').scroll(function () {
        let scrollLeft = $(this).scrollLeft();
        $(this).next().scrollLeft(scrollLeft);
      });

      $('.el-table__fixed-body-wrapper').scroll(function () {
        let scrollTop = $(this).scrollTop();
        $(this).parent().prev().scrollTop(scrollTop);
      });
    });

    this.init();
  },
  methods: {
    jumpToPj,
    init() {
      this.orgId = getUrlParam('chooseOrgId') || getUrlParam('orgId') || getLocalStorage('orgId').orgId;
      this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType;

      this.level1 = 0
      this.expandNodes1 = []
      this.tableActiveData1 = []
      this.level2 = 0
      this.expandNodes2 = []
      this.tableActiveData2 = []
      this.getHistogramList()
      if (this.orgType==5) {
        this.getProjectInfoTableList()
        this.getOperInfoTableList()
      } else {
        this.getTableList1()
        this.getTableList2()
      }
      


    },
    // 基本信息
    getTableList1() {
      request({
        url: `/app-api/realEstate/getProjectInfoTreeList`,
        method: 'get',
        params: {
          orgId: this.orgId,
          root: 1,
        },
      }).then(({ data }) => {
        if (data.code === 0) {
          let _list = data.list || data.data,
            _parentOrgId = '',
            _expandNodes = [];

          for (let i = 0, len = _list.length; i < len; i++) {
            if (_list[i]['root'] == true) {
              _parentOrgId = _list[i]['parentOrgId'];
              _expandNodes.push(_list[i]['orgId']);
              break;
            }
          }

          let tree = this.fnGetTree1(_list, _parentOrgId);

          this.expandNodes1 = _expandNodes;
          this.tableActiveData1 = tree;

          // 重新渲染表格 防止表格错位
          this.$nextTick(() => {
            if (this.$refs['tableRef1']) {
              this.$refs['tableRef1'].doLayout();
            }
          });
        }
      });
    },
    fnGetTree1(data, parentOrgId) {
      this.level1++;
      let self = this;
      var result = [],
        temp;
      for (var i in data) {
        if (data[i].parentOrgId == parentOrgId) {
          result.push(data[i]);

          // 初始数据只返回了两级   给第三级添加模拟子节点
          if (this.level1 >= 2 && !data[i].leaf) {
            data[i].hasChildren = true;
            data[i].expan = false;
          } else {
            temp = self.fnGetTree1(data, data[i].orgId);
            if (temp.length > 0) {
              data[i].children = temp;
            }
          }
        }
      }
      return result;
    },
    load1(tree, treeNode, resolve) {
      request({
        url: `/app-api/realEstate/getProjectInfoTreeList`,
        method: 'get',
        params: {
          orgId: tree.orgId,
          root: 0,
        },
      }).then(({ data }) => {
        if (data && data.code === 0) {
          let _list = data.list || data.data;
          _list.forEach((item) => {
            if (!item.leaf) {
              item.hasChildren = true;
              item.expan = false;
            }
          });
          resolve(_list);
        } else {
          resolve([]);
        }
      });
    },
    // 运营情况
    getTableList2() {
      request({
        url: `/app-api/realEstate/getOperInfoTreeList`,
        method: 'get',
        params: {
          orgId: this.orgId,
          queryPeriod: this.queryPeriodList[this.tab],
          root: 1,
        },
      }).then(({ data }) => {
        if (data.code === 0) {
          let _list = data.list || data.data,
            _parentOrgId = '',
            _expandNodes = [];

          for (let i = 0, len = _list.length; i < len; i++) {
            if (_list[i]['root'] == true) {
              _parentOrgId = _list[i]['parentOrgId'];
              _expandNodes.push(_list[i]['orgId']);
              break;
            }
          }

          let tree = this.fnGetTree2(_list, _parentOrgId);

          this.expandNodes2 = _expandNodes;
          this.tableActiveData2 = tree;

          // 重新渲染表格 防止表格错位
          this.$nextTick(() => {
            if (this.$refs['tableRef2']) {
              this.$refs['tableRef2'].doLayout();
            }
          });
        }
      });
    },
    fnGetTree2(data, parentOrgId) {
      this.level2++;
      let self = this;
      var result = [],
        temp;
      for (var i in data) {
        if (data[i].parentOrgId == parentOrgId) {
          result.push(data[i]);

          // 初始数据只返回了两级   给第三级添加模拟子节点
          if (this.level2 >= 2 && !data[i].leaf) {
            data[i].hasChildren = true;
            data[i].expan = false;
          } else {
            temp = self.fnGetTree2(data, data[i].orgId);
            if (temp.length > 0) {
              data[i].children = temp;
            }
          }
        }
      }
      return result;
    },
    load2(tree, treeNode, resolve) {
      request({
        url: '/app-api/realEstate/getOperInfoTreeList',
        method: 'get',
        params: {
          orgId: tree.orgId,
          queryPeriod: this.queryPeriodList[this.tab],
          root: 0,
        },
      }).then(({ data }) => {
        if (data && data.code === 0) {
          let _list = data.list || data.data;
          _list.forEach((item) => {
            if (!item.leaf) {
              item.hasChildren = true;
              item.expan = false;
            }
          });
          resolve(_list);
        } else {
          resolve([]);
        }
      });
    },
    getMore(pageType) {
      this.$router.push({
        path: '/report/immovables/more',
        query: {
          token: getUrlParam('token'),
          orgId: this.orgId,
          orgType: this.orgType,
        },
      });
    },
    // 项目信息-区域公司层级
    getProjectInfoTableList(){
      request({
        url: `/app-api/realEstate/getProjectInfoTableList`,
        method: 'get',
        params: {
          orgId: this.orgId,
        },
      }).then(({ data }) => {
        this.tableList1 = data.data?data.data:{}
      });
    },
    // 运营情况-区域公司层级
    getOperInfoTableList(){
      request({
        url: `/app-api/realEstate/getOperInfoTableList`,
        method: 'get',
        params: {
          orgId: this.orgId,
          queryPeriod: this.queryPeriodList[this.tab],
        },
      }).then(({ data }) => {
        this.tableList2 = data.data?data.data:{}
      });
    },
    getHistogramList(){
      request({
        url: `/app-api/realEstate/getHistogramList`,
        method: 'get',
        params: {
          orgId: this.orgId,
        },
      }).then(({ data }) => {
        let barData = {
          xnames: data.list.map( i => i.orgName ),
          value1: [],
          value2: [],
          legend: data.head.map( i => i.desc ),
          props1: ['occrate2','occrate1','occrate0'],
          props2: ['rentIncome2','rentIncome1','rentIncome0']
        }
        for (let i = 0; i < barData.legend.length; i++) {
          barData.value1.push([])
          barData.value2.push([])
          for (let j = 0; j < data.list.length; j++) {
            let item = data.list[j]
            barData.value1[i].push(item[barData.props1[i]])
            barData.value2[i].push(item[barData.props2[i]])
          }
        }
        console.log(barData)
        this.setMutileBar(barData, 'bar1')
        this.setMutileBar(barData, 'bar2')
      });
    },
    setMutileBar(data, el) {
      let _series = [],valList = el =='bar1'?data.value1:data.value2

      for (let i = 0; i < valList.length; i++) {
        const element = {
							name: data.legend[i],
							type: 'bar',
							barWidth: '15',
							data: valList[i]
						}
        _series.push(element)
      }

				let option = {
					legend: {
						show: true,
            type: 'plain',
            icon: 'circle', // rect
            itemWidth: 10,
            itemHeight: 10,
            // orient: 'horizon',
            x: 'center',
            y: 'bottom',
            textStyle: {
                fontSize: 12,
                color: '#999999'
            },
						data: data.legend //注：需接口获取
					},
          tooltip: { //提示框组件
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
            axisPointer: {
              type: 'shadow',
              label: {
                backgroundColor: '#6a7985'
              }
            },
          },
					grid: {
            'left': '4%',
            'right': '4%',
            'bottom': '12%',
            'top': '12%',
            'containLabel': true
          },
					xAxis: {
            type: 'category',
            boundaryGap: true,
            data: data.xnames,
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
            type: 'value',
            name: '单位：'+ (el=='bar1'?'%':'万元'),
            nameTextStyle:{
              color:"#666666",
            },
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#E8E8E8'
              }
            },
            splitLine:{
              lineStyle: {
                color: '#E8E8E8'
              }
            },
            axisLabel: {
              show: true,
              formatter: el=='bar1'?'{value}%':'{value}',
              textStyle: {
                color: '#666666',
                fontSize: 11
              }
            }
          },
					color: ['#FFB400', '#B4A36B', '#006E38'],
					series: _series
        };
        
        let isEmpty = true
        _series.forEach(item => {
          if (item.data.length>0) {
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

				let myChart = new echarts.init(this.$refs[el]);
				myChart.setOption(option, true);
    },
  },
  components: {
    [List.name]: List,
    [PullRefresh.name]: PullRefresh,
  },
};
</script>

<style lang="scss" scoped>
.more {
  font-size: 12px;
  color: #666666;
  float: right;
  margin-top: 12px;
  &.up {
    color: #209b5c;
  }
}
</style>
