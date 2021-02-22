<template>
  <div class="main-content width100">
    <div class="data-content-panel pt-15">
      <van-sticky class="cost-contract-title stickyBox" offset-top="0" >
        <div class="borderTxt" @touchmove.prevent>{{pageTitle}}指标说明</div>
        <div class="searchBox" @touchmove.prevent>
          <el-input placeholder="请输入指标名称" v-model="searchTxt" class="inputBox" size="mini" clearable>
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <span class="btnSearch" @click="search">检索</span>
        </div>
        <el-table stripe class="huo-list-table main-theme-table huojv-data-list list-title" size="mini" highlight-current-row :data="[]">
          <el-table-column prop="indexName" label="指标名称" align="center" fixed></el-table-column>
          <el-table-column prop="module" label="一级分类" align="center"></el-table-column>
          <el-table-column prop="moduleTwo" label="二级分类" align="center"></el-table-column>
          <el-table-column prop="indexDef" label="定义" align="center" width="170"></el-table-column>
          <el-table-column prop="significance" label="管理意义" align="center" width="150" ></el-table-column>
        </el-table>
      </van-sticky>
      <div class="listBox">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <el-table stripe class="huo-list-table main-theme-table setHeight" size="mini"
            :span-method="objectSpanMethod"
            :show-header="false"
            highlight-current-row :data="tableList">
            <el-table-column prop="indexName" label="指标名称" align="center" fixed ></el-table-column>
            <el-table-column prop="module" label="一级分类" align="center" ></el-table-column>
            <el-table-column prop="moduleTwo" label="二级分类" align="center"></el-table-column>
            <el-table-column prop="indexDef" label="定义" align="center" width="170"></el-table-column>
            <el-table-column prop="significance" label="管理意义" align="center" width="150" ></el-table-column>
          </el-table>
        </van-list>
      </div>
    </div>
  </div>
</template>

<script>
import {
  List,
  PullRefresh,
  Toast,
  Sticky,
  NavBar,
  Field
} from 'vant';
import $ from 'jquery';
import request from '@/utils/request';
import {getUrlParam, getNextMonths} from '@/utils/common'
import Vue from 'vue';
import { Input } from 'element-ui';
Vue.use(Input);

export default {
  data(){
    return {
      tableData: [],
      pageTitle: '',
      tableList: [],
      searchTxt: '',
      size: 999,
      current: 1,
      loading: false, //上拉加载
      isLoading: false, //下拉刷新,从第一页开始
      isLoad: false,
      finished: false, //下拉加载完,如果没有数据设置true
      appIndexClassId: '',
      position: 0,
      spanArr: [],
      tableHeight: 0
    }
  },
  watch: {
    // 监听url参数变化更新页面显示
    '$store.state.indicatorTitle': function (newVal, oldVal) {
      this.position = 0
      this.spanArr = []
      this.searchTxt = ''
      this.appIndexClassId = getUrlParam('appIndexClassId')
      this.pageTitle = getUrlParam('title')
      this.current = 1;
      this.isLoad = true;
      this.tableList = [];
      this.setTableData(true)
    }
  },
  created(){
    this.init()
  },
  methods:{
    reloadWindow() {
      setTimeout(() => {
        window.location.reload()
        this.isLoading = false;
      }, 500)
    },
    // 第一次进入页面初始化方法
    init() {
      this.current = 1;
      this.tableList = [];
      this.position = 0
      this.spanArr = []
      this.appIndexClassId = getUrlParam('appIndexClassId')
      this.pageTitle = getUrlParam('title')

      console.log( window.innerHeight)
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - 130
				$('.el-table__header-wrapper').scroll(function () {
						let scrollLeft = $(this).scrollLeft();
						$('.el-table__body-wrapper').scrollLeft(scrollLeft);
				});

				$(".el-table__body-wrapper").scroll(function () {
						let scrollLeft = $(this).scrollLeft();
						$('.el-table__header-wrapper').scrollLeft(scrollLeft);
				})
			})
    },
    // 搜索指标名称
    search(){
      this.isLoad = true;
      this.current = 1;
      this.tableList = []
      this.position = 0
      this.spanArr = []
      this.setTableData(true)
    },
    // 加载数据
    setTableData(isRefresh){
      request({
          url: `/app-api/indexDict/page`,
          method: 'get',
          params:{
            appIndexName: this.searchTxt,
            appIndexClassId: this.appIndexClassId,
            current: this.current,
            size: this.size
          }
      }).then(({data}) => {
          if (data.code === 0 && data.data) {
              let list = data.data.list || [];
              this.tableList = isRefresh ? list : this.tableList.concat(list);
              this.loading = false;
              this.isLoading = false;
              this.isLoad = false;
              this.rowspan()

              if (null == list || list.length < this.size || this.tableList.length >= data.total) {
                  this.finished = true;
              } else {
                  if (this.current > 1) {
                      let scrollTop = $(document).scrollTop();
                      $(document).scrollTop(scrollTop - 300);
                  }
                  this.current += 1;
                  this.finished = false;
              }
          }else{
              this.tableList = [];
              this.current = 1;
              this.loading = false;
              this.isLoading = false;
              this.finished = true;
              this.isLoad = false;
          }
      }).catch((e) => {
          this.tableList = [];
          this.current = 1;
          this.loading = false;
          this.isLoading = false;
          this.finished = true;
          this.isLoad = false;
          console.log('getBoardData-err', e);
      });
    },
    // 滚动加载数据
    onLoad() {
      if (this.isLoad) return;
      this.isLoad = true;
      this.setTableData();
    },
    // onRefresh() {
    //   this.current = 1;
    //   this.loading = false;
    //   this.isLoading = false;
    //   this.finished = false;
    //   this.isLoad = false;
    //   this.setTableData(true);
    // },
    rowspan() {
      this.tableList.forEach((item,index) => {
        if( index === 0){
          this.spanArr.push(1);
          this.position = 0;
        }else{
          if(this.tableList[index].significance === this.tableList[index-1].significance ){
            this.spanArr[this.position] += 1;
            this.spanArr.push(0);
          }else{
            this.spanArr.push(1);
            this.position = index;
          }
        }
      })
    },
    // 合并管理意义行
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 4) {
            const _row = this.spanArr[rowIndex];
            const _col = _row>0 ? 1 : 0;
            return {
                rowspan: _row,
                colspan: _col
            }
        }
    },
  },
  components: {
    [Field.name]: Field,
    [List.name]: List,
    [PullRefresh.name]: PullRefresh,
    [NavBar.name]: NavBar,
    [Sticky.name]: Sticky,
  }
}
</script>

<style lang="scss">
.stickyBox{
  background: white;
}
.stickyBox .van-sticky--fixed{
  left: 14px;
  right: 14px;
  margin: 0 auto;
  background: white;
  padding-top: 15px;
}
.el-table__fixed{
  // position: fixed;
  z-index: 999;
}
</style>
<style lang="scss" scoped>
.listBox{
  height:80vh;
  overflow-y: scroll;
}
.width100{
  height: 100%;
  background: #fff;
  max-height: 100vh;
  overflow: hidden;
}
.borderTxt{
  font-size: 14px;
  border-left: 3px solid #299E63;
  padding-left: 15px;
  margin-bottom: 20px;
}
.searchBox{
  display: flex;
  margin: 15px auto;
  justify-content: center;
  align-items: center;
  .inputBox{
    flex: 1;
    margin-right: 10px;
    box-sizing: border-box;
    border-radius: 3px;
    font-size: 12px;
    input{
      outline: none;
    }
  }
  .btnSearch{
    width: 76px;
    height: 26px;
    line-height: 26px;
    font-size: 12px;
    color: white;
    text-align: center;
    background: #299E63;
    border-radius: 4px;
    display: inline-block;
    letter-spacing: 2px;
  }
}
.cost-contract-title{
  background: white;
}
</style>