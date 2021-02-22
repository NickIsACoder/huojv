<template>
  <div class="report-index pb-20">
    <van-nav-bar
      style="position: fixed; top: 0; width: 100%;"
      :title="title"
      left-arrow
      @click-left="onClickLeft"
      v-eventlisten="{isChangePage:true,pageEvent:'点击返回按钮'}"
    />

    <van-pull-refresh
      v-model="isLoading"
      success-text="刷新成功"
      loading-text="正在刷新..."
      @refresh="reloadWindow"
    >
      <div class="main-content mt-15 padding-nav" style="width:100%">
        <div class="data-content-panel">
          <div class="bar_list">
            <p v-for="(item, index) in tableList" :key="item.subTasksID+index" :class="[tab == index?'active':'']" @click="change(index)">
                {{item.executor}}<span class="tag" v-if="item.completeStatus=='未完成'">未完成</span>
            </p>
          </div>
          <div class="tableBox">
              <div class="bLeft"><span>事项信息</span></div>
              <div class="bRight">
                  <div class="bList hd box1">
                      <span style="width:100px">工作事项</span>
                      <span style="width:130px">执行人</span>
                      <span style="width:100px">联系方式</span>
                      <span style="width:120px">要求完成时间</span>
                      <span style="width:100px">完成状态</span>
                  </div>
                  <div class="bList box1" v-if="tableList[tab]">
                      <span style="width:100px">{{tableList[tab].workMatters}}</span>
                      <span style="width:130px">{{tableList[tab].executor}}</span>
                      <span style="width:100px">{{tableList[tab].phone}}</span>
                      <span style="width:120px">{{tableList[tab].deadline}}</span>
                      <span style="width:100px">{{tableList[tab].completeStatus}}</span>
                  </div>
                  <div class="bList box1" v-else>
                      <span style="width:100px"></span>
                      <span style="width:130px"></span>
                      <span style="width:100px"></span>
                      <span style="width:120px"></span>
                      <span style="width:100px"></span>
                  </div>
              </div>
          </div>
          <div class="tableBox">
              <div class="bLeft"><span>每日汇报</span></div>
              <div class="bRight">
                  <div class="bList hd">
                      <span style="width:100px">时间</span>
                      <span style="width:130px">当日工作</span>
                      <span style="width:150px">需要支持或资源</span>
                  </div>
                  <template v-if="tableList[tab]">
                    <div class="bList" v-for="(item) in tableList[tab].dailyReportVo" :key="item.mdcDataGUID">
                        <span style="width:100px">{{item.dateTime}}</span>
                        <span style="width:130px">{{item.dailyWork}}</span>
                        <span style="width:150px">{{item.supportOrResources}}</span>
                    </div>
                  </template>
                  <template v-else>
                    <div class="bList">
                        <span style="width:100px"></span>
                        <span style="width:130px"></span>
                        <span style="width:150px"></span>
                    </div>
                  </template>
              </div>
          </div>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import scrollFixed from '@/mixin/scroll-fixed';
import { List, PullRefresh, Toast, NavBar } from 'vant';
import $ from 'jquery';
import { getLocalStorage } from '@/utils/local-storage';
import request from '@/utils/request';
import { getUrlParam } from '@/utils/common';


export default {
  mixins: [scrollFixed],

  data () {
    return {
      title: '',
      taskTypeId: '4BD92065-4081-488A-ACB4-2C89DEDC2DD7,60611D76-6868-4B46-949F-B8A1410A6D1E',  //  1  签约 ， 2  回款， 3  交付
      loading: false,//上拉加载
      isLoading: false,//下拉刷新,从第一页开始
      isLoad: false,
      finished: false,//下拉加载完,如果没有数据设置true
      tableList: [],
      tab: 0,
      size: 20,
      current: 1,
      taskID: ''
    };
  },

  computed: {
    ...mapState({
      orgId: state => state.orgId || getLocalStorage(['orgId']).orgId
    })
  },

  watch: {
    '$store.state.orgId': function (newVal, oldVal) {
      this.init();
    //   this.onRefresh();
    }
  },

  mounted () {
    this.init();

    this.$nextTick(() => {
      $('.el-table__header-wrapper').scroll(function () {
        let scrollLeft = $(this).scrollLeft();
        $(this).next().scrollLeft(scrollLeft);
      });
    })
  },

  methods: {
    reloadWindow () {
      setTimeout(() => {
        window.location.reload();
        this.isLoading = false;
      }, 500)
    },
    onClickLeft () {
      window.history.go(-1);
    },
    init () {
      this.current = 1;
      this.tableList = [];
      this.title = '工作明细';
      this.taskID = this.$route.query.taskID
      this.setTableData()
    },
    setTableData (isRefresh) {
      request({
          url: `/app-api/human/handleSuperviseDetail/${this.taskID}`,
          method: 'get'
      }).then(({data}) => {
          if(data.code == 0){
            this.tableList = data.data
          }
      }).catch((e) => {
          console.log('handleSuperviseDetail-err', e);
      });
    },
    change(idx){
      this.tab = idx
    }
  },

  components: {
    [List.name]: List,
    [PullRefresh.name]: PullRefresh,
    [NavBar.name]: NavBar,
    Toast
  }
};
</script>


<style lang="scss" scoped>
.data-content-panel {
  padding-top: 20px;
}
.bar_list {
  margin-bottom: 20px;
  display: flex;
  overflow-x: scroll;
  border-radius: 2px;
  margin-right: 5px;
  padding-bottom: 12px;
  p {
      margin: 0;
    padding: 5px 15px;
    font-size: 13px;
    color: #266545;
    text-align: center;
    border: 1px solid #209B5C;
    border-right: none;
    flex-shrink: 0;
    position: relative;
    &:last-child {
      border-right: 1px solid #209B5C;
    }
    &.active {
      background: #209B5C;
      color: white;
    }
    .tag {
      color: #fe0909;
      font-size: 6px;
      border-radius: 2px;
      background: #ffe6e6;
      padding: 1px 3px;
      position: absolute;
      top: 0;
      right: 0;
    }
  }
}
.tableBox{
    text-align: center;
    display: flex;
    font-size: 12px;
    border-bottom: 1px solid #E8E8E8;
    color: #666666;
    .bLeft{
        background: #F2F8F6;
        width: 88px;
        // height: 66px;
        // line-height: 66px;
        border-right: 1px solid #E8E8E8;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #266545;
    }
    .bRight{
        flex: 1;
        overflow-x: scroll;
        // max-height: 60vh;
        // overflow-y: scroll;
        .box1.bList{
            width: 550px;
        }
        .bList{
            width: 380px;
            min-height: 33px;
            display: flex;
            align-items: center;
            &.hd{
                color: #266545;
            }
        }
        .bList:nth-child(odd){
            background: #F2F8F6;
        }
        span{
            height: 100%;
            flex-shrink: 0;
            padding: 7px 15px;
        }
    }
}
.padding-nav{
    min-height: calc(100vh - 25px);
    min-height: -moz-calc(100vh - 25px);
    min-height: -webkit-calc(100vh - 25px);
}
</style>
