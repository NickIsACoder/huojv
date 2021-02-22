<template>
	<div class="report-index">
    <van-nav-bar style="position: fixed; top: 0; width: 100%;" title="项目基本信息" left-arrow @click-left="onClickLeft"
		             v-eventlisten="{isChangePage:true,pageEvent:'点击返回按钮'}"/>
		<div class="main-content" style="width: 100%;">
      <div class="data-content-panel no-top-left-radius clearfix">
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
          </div>
      </div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import scrollFixed from '@/mixin/scroll-fixed';
import { List, PullRefresh,NavBar } from 'vant';
import { getLocalStorage } from '@/utils/local-storage';
import request from '@/utils/request';
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
      orgType: 2,
      expandNodes1: [],
      tableActiveData1: [],
    };
  },
  watch: {
    '$store.state.orgId': function (newVal, oldVal) {
      this.init();
    },
  },
  computed: {
    ...mapState({
      orgId: state => state.orgId || getLocalStorage(['orgId']).orgId
    })
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
    onClickLeft() {
      this.$router.go(-1)
    },
    init() {
      this.orgType = this.$route.query.orgType;
      this.level1 = 0
      this.expandNodes1 = []
      this.tableActiveData1 = []
      this.getTableList1()
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
  },
  components: {
    [List.name]: List,
    [PullRefresh.name]: PullRefresh,
    [NavBar.name]: NavBar,
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
