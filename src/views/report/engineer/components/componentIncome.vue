<template>
  <div class="data-content-panel">
    <div class="data-title-box data-title-line">
      <span class="title">支付回款比情况</span>
    </div>
    <el-table stripe class="huo-list-table tree-table" ref="tableRef" size="mini"
        highlight-current-row
        row-key="orgId"
        :data="tableList"
        :expand-row-keys="expandNodes"
        border :indent="5"
        lazy :load="load"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column prop="orgName" label="组织架构" align="left" fixed width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.orgType==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,scope.row.orgType)">{{scope.row.orgName}}</span>
          <span v-else>{{scope.row.orgName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="engineeringFundsPay" label="工程款支付(亿)" align="center" width="100"></el-table-column>
      <el-table-column prop="saleReturn" label="销售回款(亿)" align="center" width="90"></el-table-column>
      <el-table-column prop="payReturnRate" label="支付回款比" align="center" width="90"></el-table-column>
      <el-table-column prop="adUserName" label="负责人" align="center"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import scrollFixed from '@/mixin/scroll-fixed';
import {List,PullRefresh,Sticky} from 'vant';
import {getLocalStorage} from '@/utils/local-storage';
import request from '@/utils/request';
import $ from 'jquery'
import {handleNum2String, handleDate, getUrlParam, jumpToPj} from '@/utils/common'

export default {
  data(){
    return {
      current: 1,
      size: 10,
      tableList: [],
      orgType: 2,
      level: 0,
      expandNodes: [],
    }
  },
  watch: {
    '$store.state.orgId': function (newVal, oldVal) {
      this.init();
    }
  },
  mounted() {
    this.$nextTick(() => {
      $('.el-table__header-wrapper').scroll(function () {
						let scrollLeft = $(this).scrollLeft();
						$('.el-table__body-wrapper').scrollLeft(scrollLeft);
				});

				$(".el-table__body-wrapper").scroll(function () {
						let scrollLeft = $(this).scrollLeft();
						$('.el-table__header-wrapper').scrollLeft(scrollLeft);
				})
    })

    this.init();
  },
  methods:{
    jumpToPj,
    init(){
      this.orgId = getUrlParam('chooseOrgId') || getUrlParam('orgId') || getLocalStorage('orgId').orgId;
      this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType;

      this.getTableList();
    },
    getTableList(){
      request({
          url: '/app-api/engineer/getPayReturnTree',
          method: 'get',
          params: {
            root: 1,
            orgId: this.orgId,
            orderParam: 'payReturnRate',
            orderParamType: 'desc'
          }
        }).then(({data}) => {
          if (data.code === 0) {
            let _list = data.list || data.data,
                    _parentOrgId = '',
                    _expandNodes = [];

            for (let i = 0, len = _list.length; i < len; i++) {
              if (_list[i]['root'] == true) {
                _parentOrgId = _list[i]['parentOrgId'];
                _expandNodes.push(_list[i]['orgId'])
                break;
              }
            }

            let tree = this.fnGetTree(_list, _parentOrgId);

            this.expandNodes = _expandNodes;
            this.tableList = tree;

            // 重新渲染表格 防止表格错位
            this.$nextTick(() => {
              if (this.$refs['tableRef']) {
                this.$refs['tableRef'].doLayout()
              }
            })
          }
        }).catch((e) => {
          console.log('getBoardData-err', e);
        });
    },
    fnGetTree(data, parentOrgId) {
      this.level++;
      let self = this;
      var result = [], temp;
      for (var i in data) {
        if (data[i].parentOrgId == parentOrgId) {
          result.push(data[i]);

          // 初始数据只返回了两级   给第三级添加模拟子节点
          if (this.level >= 2 && !data[i].leaf) {
            data[i].hasChildren = true;
            data[i].expan = false;
          } else {
            temp = self.fnGetTree(data, data[i].orgId);
            if (temp.length > 0) {
              data[i].children = temp;
            }
          }
        }
      }
      return result;
    },
    load(tree, treeNode, resolve) {
      request({
        url: '/app-api/engineer/getPayReturnTree',
        method: 'get',
        params: {
          root: 0,
          orgId: tree.orgId,
          orderParam: 'payReturnRate',
          orderParamType: 'desc'
        }
      }).then(({data}) => {
        if (data && data.code === 0) {
          let _list = data.list || data.data;
          _list.forEach(item => {
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
    [Sticky.name]: Sticky,
  }
}
</script>

<style>
.content .van-sticky--fixed>div{
  /* padding-top: 10px; */
}
.content .van-sticky--fixed{
  left: 13px;
  right: 13px;
  margin: 0 auto;
  background: white;
}
</style>
<style lang="scss" scoped>
.tableTitle{
    margin: 20px;
    font-size: 14px;
    color: #333333;
    text-align: center;
}
</style>