<template>
  <div class="detail-panel height100 white-bg">
    <van-nav-bar
      style="position: fixed; top: 0; width: 100%"
      :title="title"
      left-arrow
      @click-left="onClickLeft"
      v-eventlisten="{ isChangePage: true, pageEvent: '点击返回按钮' }"
    />
    <div class="padding-nav data-content-panel">
      <van-sticky class="has-nav-sticky">
        <div class="data-content-panel p-l-r-15 bg-white" style="padding-bottom: 0">
					<van-dropdown-menu active-color="#266545" :style="{ width: pageType==0? '90%' : '65%' }">
						<van-dropdown-item v-model="selectValue[0]" :options="selectOptions1" v-if="pageType==0" @change="selectChange(1)"/>
						<van-dropdown-item v-model="selectValue[1]" :options="selectOptions2" @change="selectChange(2)"/>
						<van-dropdown-item v-model="selectValue[2]" :options="selectOptions3" @change="selectChange(3)"/>
					</van-dropdown-menu>
					<div v-if="pageType==2">
						<el-table stripe
											class="huo-list-table main-theme-table huojv-data-list list-title1" size="mini"
											highlight-current-row :data="[]" >
							<el-table-column prop="parentorgname" label="区域公司" align="center"></el-table-column>
							<el-table-column prop="orgname" label="项目名称" align="center"></el-table-column>
							<el-table-column prop="bidsection" label="标段名称" align="center"></el-table-column>
							<el-table-column prop="delivertype" label="交付类型（装修/毛坯）" align="center"></el-table-column>
							<el-table-column prop="indoors" label="户内" align="center"></el-table-column>
							<el-table-column prop="publicarea" label="公共区域" align="center"></el-table-column>
							<el-table-column prop="gardenview" label="园林" align="center"></el-table-column>
							<el-table-column prop="externalwall" label="外立面" align="center"></el-table-column>
							<el-table-column prop="overallscore" label="综合得分" align="center"></el-table-column>
						</el-table>
					</div>
					<div v-else-if="pageType==3">
						<el-table stripe
											class="huo-list-table main-theme-table huojv-data-list list-title1" size="mini"
											highlight-current-row :data="[]" >
							<el-table-column type="index" label="项目排序" align="center"></el-table-column>
							<el-table-column prop="parentorgname" label="区域" align="center"></el-table-column>
							<el-table-column prop="orgname" label="项目名称" align="center"></el-table-column>
							<el-table-column prop="bidsection" label="标段名称" align="center"></el-table-column>
							<el-table-column prop="actualmeasurement" label="实测实量" align="center"></el-table-column>
							<el-table-column prop="safetyscore" label="安全" align="center"></el-table-column>
							<el-table-column prop="managebehavior" label="管理行为" align="center"></el-table-column>
							<el-table-column prop="priqtdeduction" label="质量关键项扣分" align="center"></el-table-column>
							<el-table-column prop="assessmentscore" label="评估得分" align="center"></el-table-column>
						</el-table>
					</div>
					<div v-else-if="pageType==4">
						<el-table stripe
											class="huo-list-table main-theme-table huojv-data-list list-title1" size="mini"
											highlight-current-row :data="[]" >
							<el-table-column type="index" label="项目排序" align="center"></el-table-column>
							<el-table-column prop="parentorgname" label="区域" align="center"></el-table-column>
							<el-table-column prop="orgname" label="项目名称" align="center"></el-table-column>
							<el-table-column prop="bidsection" label="标段名称" align="center"></el-table-column>
							<el-table-column prop="softedgeoverall" label="软景综合" align="center"></el-table-column>
							<el-table-column prop="hardedgeoverall" label="硬景综合" align="center"></el-table-column>
							<el-table-column prop="qtoverall" label="质量综合" align="center"></el-table-column>
							<el-table-column prop="pfpoverall" label="成品保护综合" align="center"></el-table-column>
							<el-table-column prop="saftyoverall" label="安全综合" align="center"></el-table-column>
							<el-table-column prop="assessmentscore" label="评估得分" align="center"></el-table-column>
						</el-table>
					</div>
				</div>
      </van-sticky>
      <div class="detail-table-panel">
				
				<el-table stripe class="huo-list-table tree-table" v-if="pageType==0" :key="0"
						highlight-current-row
						row-key="orgguid" ref="tableRef1" size="mini" :height="tableHeight"
						:data="tableList"	:expand-row-keys="expandNodes"
						border :indent="5"	lazy :load="load"
						:tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column prop="orgname" label="组织" header-align="center" width="120" fixed>
            <template slot-scope="scope">
							<span v-if="scope.row.orgtype==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgguid,scope.row.orgtype)">{{scope.row.orgname}}</span>
							<span v-else>{{scope.row.orgname}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="actualmeasurement" label="实测实量" align="center"></el-table-column>
          <el-table-column prop="safetyscore" label="安全" align="center"></el-table-column>
          <el-table-column prop="priqtdeduction" label="质量关键项扣分" align="center"></el-table-column>
          <el-table-column prop="managebehavior" label="管理行为" align="center"></el-table-column>
          <el-table-column prop="assessmentscore" label="评估得分" align="center"></el-table-column>
      	</el-table>

				<div v-else-if="pageType==1" :key="1">
					<div>
						<div class="data-title-box data-title-line">
							<span class="title">区域公司综合评估</span>
						</div>
						<el-table stripe class="huo-list-table tree-table mt10" size="mini" highlight-current-row max-height="400"
							border :data="tableList" >
							<el-table-column type="index" label="区域排序" align="center"></el-table-column>
							<el-table-column prop="orgname" label="区域公司" align="center"></el-table-column>
							<el-table-column prop="actualmeasurement" label="实测实量" align="center"></el-table-column>
							<el-table-column prop="safetyscore" label="安全" align="center"></el-table-column>
							<el-table-column prop="priqtdeduction" label="质量关键项扣分" align="center"></el-table-column>
							<el-table-column prop="managebehavior" label="管理行为" align="center"></el-table-column>
							<el-table-column prop="assessmentscore" label="评估得分" align="center"></el-table-column>
						</el-table>
					</div>
					<div>
						<div class="data-title-box data-title-line">
							<span class="title">土建项目综合评估</span>
						</div>
						<el-table stripe class="huo-list-table tree-table mt10" size="mini" highlight-current-row max-height="400"
							border :data="tableList1" >
							<el-table-column type="index" label="项目排序" align="center"></el-table-column>
							<el-table-column prop="parentorgname" label="区域公司" align="center"></el-table-column>
							<el-table-column prop="orgname" label="项目名称" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.orgtype==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgguid,scope.row.orgtype)">{{scope.row.orgname}}</span>
                  <span v-else>{{scope.row.orgname}}</span>
                </template>
              </el-table-column>
							<el-table-column prop="maincontractor" label="总包单位" align="center"></el-table-column>
							<el-table-column prop="actualmeasurement" label="实测实量" align="center"></el-table-column>
							<el-table-column prop="safetyscore" label="项目安全" align="center"></el-table-column>
							<el-table-column prop="priqtdeduction" label="质量关键项扣分" align="center"></el-table-column>
							<el-table-column prop="managebehavior" label="管理行为" align="center"></el-table-column>
							<el-table-column prop="assessmentscore" label="评估得分" align="center"></el-table-column>
						</el-table>
					</div>
				</div>
				<div v-else-if="pageType==2" :key="2">
					<div style="background: #fff">
						<!-- <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad"> -->
							<el-table stripe class="huo-list-table main-theme-table huojv-data-list mt10" size="mini" highlight-current-row :show-header="false"
								 :data="tableList" >
								<el-table-column prop="parentorgname" label="区域公司" align="center"></el-table-column>
								<el-table-column prop="orgname" label="项目名称" align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.orgtype==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgguid,scope.row.orgtype)">{{scope.row.orgname}}</span>
                    <span v-else>{{scope.row.orgname}}</span>
                  </template>
                </el-table-column>
								<el-table-column prop="bidsection" label="标段名称" align="center"></el-table-column>
								<el-table-column prop="delivertype" label="交付类型（装修/毛坯）" align="center"></el-table-column>
								<el-table-column prop="indoors" label="户内" align="center"></el-table-column>
								<el-table-column prop="publicarea" label="公共区域" align="center"></el-table-column>
								<el-table-column prop="gardenview" label="园林" align="center"></el-table-column>
								<el-table-column prop="externalwall" label="外立面" align="center"></el-table-column>
								<el-table-column prop="overallscore" label="综合得分" align="center"></el-table-column>
							</el-table>
						<!-- </van-list> -->
					</div>
				</div>
        <div v-else-if="pageType==3" :key="3">
					<div >
						<!-- <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad"> -->
							<el-table stripe class="huo-list-table main-theme-table huojv-data-list mt10" size="mini" highlight-current-row
								 :data="tableList"  :show-header="false">
								<el-table-column type="index" label="项目排序" align="center"></el-table-column>
								<el-table-column prop="parentorgname" label="区域" align="center"></el-table-column>
								<el-table-column prop="orgname" label="项目名称" align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.orgtype==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgguid,scope.row.orgtype)">{{scope.row.orgname}}</span>
                    <span v-else>{{scope.row.orgname}}</span>
                  </template>
                </el-table-column>
								<el-table-column prop="bidsection" label="标段名称" align="center"></el-table-column>
								<el-table-column prop="actualmeasurement" label="实测实量" align="center"></el-table-column>
								<el-table-column prop="safetyscore" label="安全" align="center"></el-table-column>
								<el-table-column prop="managebehavior" label="管理行为" align="center"></el-table-column>
								<el-table-column prop="priqtdeduction" label="质量关键项扣分" align="center"></el-table-column>
								<el-table-column prop="assessmentscore" label="评估得分" align="center"></el-table-column>
							</el-table>
						<!-- </van-list> -->
						
					</div>
				</div>
				<div v-else-if="pageType==4" :key="4">
					<div>
						<!-- <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad"> -->
							<el-table stripe class="huo-list-table main-theme-table huojv-data-list mt10" size="mini" highlight-current-row :show-header="false"
								 :data="tableList" >
								<el-table-column type="index" label="项目排序" align="center"></el-table-column>
								<el-table-column prop="parentorgname" label="区域" align="center"></el-table-column>
								<el-table-column prop="orgname" label="项目名称" align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.orgtype==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgguid,scope.row.orgtype)">{{scope.row.orgname}}</span>
                    <span v-else>{{scope.row.orgname}}</span>
                  </template>
                </el-table-column>
								<el-table-column prop="bidsection" label="标段名称" align="center"></el-table-column>
								<el-table-column prop="softedgeoverall" label="软景综合" align="center"></el-table-column>
								<el-table-column prop="hardedgeoverall" label="硬景综合" align="center"></el-table-column>
								<el-table-column prop="qtoverall" label="质量综合" align="center"></el-table-column>
								<el-table-column prop="pfpoverall" label="成品保护综合" align="center"></el-table-column>
								<el-table-column prop="saftyoverall" label="安全综合" align="center"></el-table-column>
								<el-table-column prop="assessmentscore" label="评估得分" align="center"></el-table-column>
							</el-table>
						<!-- </van-list> -->
					</div>
				</div>

      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import scrollFixed from '@/mixin/scroll-fixed';
import {
  List,
  PullRefresh,
  Toast,
  Sticky,
  NavBar,
  DropdownMenu,
  DropdownItem,
} from 'vant';
import $ from 'jquery';
import { getLocalStorage } from '@/utils/local-storage';
import request from '@/utils/request';
import { getUrlParam, jumpToPj } from '@/utils/common';
import ic_fall from '@/assets/images/ic_fall@2x.png';

export default {
  mixins: [scrollFixed],

  data() {
    return {
			title: '',
			selectOptions1: [
        {value: '0', text: '地产集团', orgId: 'AA90A163-F782-4B78-4584-08D7E5E57C34'},
        {value: '1', text: '商业集团', orgId: '69EEBD5F-A9F3-4EEE-4640-08D7E5E57C34'},
      ],
      selectOptions2: [],
			selectOptions3: [],
			selectValue: ['0', null, null],
      loading: false, //上拉加载
      isLoading: false, //下拉刷新,从第一页开始
      isLoad: false,
			finished: false, //下拉加载完,如果没有数据设置true
			level: 0,
			expandNodes: [],
			tableActiveData:[],
			tableList: [],
			tableList1: [],
      pageType: 0,
      orgId: '',
			orgType: 2,
			tableHeight: '200',
			size: 15,
      current: 1,
      isChangeYear: false
    };
  },
  watch: {
    '$store.state.orgId': function (newVal, oldVal) {
      this.init(true);
    },
  },
  mounted() {
		this.init();

    this.$nextTick(() => {
			if (this.pageType==2) {
				$('.list-title1 .el-table__header-wrapper').scroll(function () {
						let scrollLeft = $(this).scrollLeft();
						$(".el-table__body-wrapper").scrollLeft(scrollLeft);
				});

				$(".el-table__body-wrapper").scroll(function () {
						let scrollLeft = $(this).scrollLeft();
						$('.el-table__header-wrapper').scrollLeft(scrollLeft);
				})
			} else {
				$('.el-table__header-wrapper').scroll(function () {
					let scrollLeft = $(this).scrollLeft();
					$(this).next().scrollLeft(scrollLeft);
				});

				$(".el-table__fixed-body-wrapper").scroll(function () {
					let scrollTop = $(this).scrollTop();
					$(this).parent().prev().scrollTop(scrollTop);
				})

				$('.el-table__header-wrapper').scroll(function () {
					let scrollLeft = $(this).scrollLeft();
					$(this).next().scrollLeft(scrollLeft);
				});
			}
    });
  },

  methods: {
    jumpToPj,
    reloadWindow() {
      setTimeout(() => {
        window.location.reload();
        this.isLoading = false;
      }, 500);
    },
    onClickLeft() {
      // window.history.go(-1);
      this.$router.go(-1);
    },
    init() {
      this.pageType = this.$route.query.pageType;
      this.orgId = this.$route.query.orgId;
			this.orgType = this.$route.query.orgType;

			this.$nextTick(()=>{
				this.tableHeight = window.innerHeight - 140
			})

			this.level = 0
      this.expandNodes = []
      this.tableList = []

      if (this.selectOptions2.length<=0) {
          this.getYear()
      }else {
        if (this.pageType==0) {
					this.title = '第三方评估';
          this.getTableList()
        }
      }

      if (this.isChangeYear) {
        this.selectOptions3 = []
        this.selectValue[2] = null
        this.getMonth()
      }

      if (this.selectOptions3.length>0) {
				if (this.pageType==1) { // 区域公司评估得分排名
					this.title = '区域公司评估得分';
          this.getSecondLevel(this.pageType, 5)
          this.getSecondLevel(this.pageType, 6)
				} else if(this.pageType==2) {// 交付评估得分
					this.title = '交付评估得分';
          this.getSecondLevel(this.pageType, 6)
				} else if(this.pageType==3) {// 精装项目综合评估得分
					this.title = '精装项目综合评估得分';
          this.getSecondLevel(this.pageType, 6)
				} else if(this.pageType==4) {// 园林专项评估得分
					this.title = '园林专项评估得分';
          this.getSecondLevel(this.pageType, 6)
        }
      }

		},
		// 获取年份
    getYear() {
			request({
				url: '/app-api/engineer/stageYearMonth',
				method: 'get',
      }).then(({data}) => {
        if (data.data&&data.data.length>0) {
          this.selectOptions2 = data.data.map( (item,idx) => {
            return {
                value: idx+'',
                text: item.years+'年',
                prop: item.years
            }
          })
          this.selectValue = this.$route.query.selectValue.split(',')
          this.getMonth()
        }
      }).catch((e) => {
        console.log(e)
      });
    },
    // 获取月份
    getMonth() {
      if (this.isChangeYear) {
        this.selectValue[2] = '0'
      }
      this.isChangeYear = false
      let _selIdx = this.selectValue[1]
      request({
				url: '/app-api/engineer/stageYearMonth',
				method: 'get',
				 params: { year: this['selectOptions2'][_selIdx].prop },
      }).then(({data}) => {
        if (data.data&&data.data.length>0) {
          this.selectOptions3 = data.data.map( (item,idx) => {
            return {
              value: idx+'',
              text: item.months+'月',
              prop: item.months
            }
          })

          if (this.pageType==0) {
						this.title = '第三方评估';
            this.getTableList()
          } 
					if (this.pageType==1) { // 区域公司评估得分排名
					this.title = '区域公司评估得分';
            this.getSecondLevel(this.pageType, 5)
            this.getSecondLevel(this.pageType, 6)
					} else if(this.pageType==2) {// 交付评估得分
						this.title = '交付评估得分';
            this.getSecondLevel(this.pageType, 6)
					} else if(this.pageType==3) {// 精装项目综合评估得分
						this.title = '精装项目综合评估得分';
            this.getSecondLevel(this.pageType, 6)
					} else if(this.pageType==4) {// 园林专项评估得分
						this.title = '园林专项评估得分';
            this.getSecondLevel(this.pageType, 6)
					}
					
        }

      }).catch((e) => {
          console.log(e)
      });
    },
    // 获取数据
    getTableList(){
      let _params = {
          orgId: this.selectOptions1[this.selectValue[0]].orgId,
          year: this.selectOptions2[this.selectValue[1]].prop,
          month: this.selectOptions3[this.selectValue[2]].prop,
          summaryOrDetails: 0,
          isRoot:1,
      };
			 request({
				url: '/app-api/engineer/moreStagesForOrgAndYear',
				method: 'get',
				params: _params
      }).then(({data}) => {
          if(data && data.code === 0 && data.data&& data.data.length>0) {
            let _list = data.data,
            _parentorgguid = '',
            _expandNodes = [];
            for(let i=0;i<_list.length;i++){
              if(_list[i]['root'] == true){
                _parentorgguid = _list[i]['parentorgguid'];
                _expandNodes.push(_list[i]['orgguid'])
                break;
              }
            }
            let tree = this.fnGetTree(_list, _parentorgguid);
            this['expandNodes'] = _expandNodes;
            this['tableList'] = tree;

            this.tableHeight = window.innerHeight -150
          }else{
            this['tableList'] = [];
          }
      }).catch((e) => {
        console.log('getTopData-err', e);
        this['tableList'] = [];
      })
    },
    fnGetTree(data, parentorgguid){
      this.level++;
      let result=[],temp;
      let self = this;
      for(let i in data){
        if(data[i].parentorgguid == parentorgguid){
          result.push(data[i]);
          // 初始数据只返回了两级   给第三级添加模拟子节点
          if (this.level >= 2 && !data[i].leaf) {
            data[i].hasChildren = true;
            data[i].expan = false;
          } else {
            temp = self.fnGetTree(data, data[i].orgguid);
            if (temp.length > 0) {
                data[i].children = temp;
            }
          }
        }
      }
      return result;
    },
    load(tree,treeNode,resolve){
      let _params = {
          orgId: tree.orgguid,
          year: this.selectOptions2[this.selectValue[1]].prop,
          month: this.selectOptions3[this.selectValue[2]].prop,
          summaryOrDetails: 0,
          isRoot:0
      };
			request({
				url: '/app-api/engineer/moreStagesForOrgAndYear',
				method: 'get',
				params: _params
      }).then(({data})=>{
        if(data && data.code === 0 && data.data) {
          let _list = data.data;
          _list.forEach(item => {
            if (!item.leaf) {
              item.hasChildren = true;
              item.expan = false;
            }
          });
          resolve(_list);
        }else {
          resolve([]);
        }
      })
		},
    // 二级集团
    getSecondLevel(pageType,orgType) {
      let _selYear = this.selectOptions2[this.selectValue[1]].prop,
          _month = this.selectOptions3[this.selectValue[2]].prop

      let _url = '',
        _params = {
            orgId: this.orgId,
            year: _selYear,
            month: _month,
            orgType: orgType,
            summaryOrDetails: 0,
        }
      if (this.pageType==1) { // 区域公司评估得分排名
          _url = `/app-api/engineer/stagesForOrgYearMonth`
      } else if (this.pageType==2) { // 交付评估得分
          _url = `/app-api/engineer/deliverStageSummaryList`
      } else if (this.pageType==3) {// 精装项目综合评估得分
          _url = `/app-api/engineer/decorationStagesForOrgYearMonth`
          _params.dateType = 1
      } else if (this.pageType==4) {// 园林专项评估得分
          _url = `/app-api/engineer/decorationStagesForOrgYearMonth`
          _params.dateType = 2
      }

			request({
				url: _url,
				method: 'get',
				params: _params
      }).then(({data}) => {

        let _prop = ''
        if (this.pageType==1) {
          if (orgType==5) {
            _prop = 'engineeringStageSummary'
          } else {
            _prop = 'engineeringStageSummary'
          }
        } else if (this.pageType==2) {
          _prop = 'deliverStageSummary'
        } else if (this.pageType==3) {
          _prop = 'decorationStageSummary'
        } else if (this.pageType==4) {
          _prop = 'decorationStageSummary'
        }

        // let _data = data.data[0].map(i => {
        //   return i[_prop]
        // })
        let _data = data.data[0][_prop]
        if (_data&&_data.length>0) {
          if (this.pageType==1) {
            if (orgType==5) {
              this.tableList = _data
            } else {
              this.tableList1 = _data
            }
          }else {
            this.tableList = _data
          }
          console.log(this.tableList)
          // if (this.pageType==1) {
          //   if (orgType==5) {
          //     this.tableList = _data[0].engineeringStageSummary
          //   } else {
          //     this.tableList1 = _data[0].engineeringStageSummary
          //   }
          // } else if (this.pageType==2) {
          //   this.tableList = _data[0].deliverStageSummary
          // } else if (this.pageType==3) {
          //   this.tableList = _data[0].decorationStageSummary
          // } else if (this.pageType==4) {
          //   this.tableList = _data[0].decorationStageSummary
          // }

          this.tableHeight = window.innerHeight -150
        }

      }).catch((e) => {
          console.log(e)
      });
		},
		selectChange(idx){
      let value = this.selectValue[idx-1]
      if (idx==2) {
        this.isChangeYear = true
      }
      console.log(this['selectOptions'+idx][value].text)
      this.init()
    }
		// setTableData(isRefresh) {
		// 	request({
		// 		url: `/app-api/productDesign/goodsLandRatio`,
		// 		method: 'post',
		// 		data: {
		// 			current: this.current,
		// 			size: this.size,
		// 			orgId: this.$route.query.orgId,
		// 			orderParam: 'valuePriceRate',
		// 			orderParamType: 'asc',
		// 			designType: 1
		// 		}
		// 	})
		// 	.then(({ data }) => {
		// 		if (data.code === 0 && data.data) {
		// 			let list =  data.data|| [];
		// 			this.tableList = isRefresh ? list : this.tableList.concat(list);
		// 			this.loading = false;
		// 			this.isLoading = false;
		// 			this.isLoad = false;

		// 			if (
		// 				null == list ||
		// 				list.length < this.size ||
		// 				this.tableList.length >= data.total
		// 			) {
		// 				this.finished = true;
		// 			} else {
		// 				if (this.current > 1) {
		// 					let scrollTop = $(document).scrollTop();
		// 					$(document).scrollTop(scrollTop - 300);
		// 				}
		// 				this.current += 1;
		// 				this.finished = false;
		// 			}
		// 		} else {
		// 			this.tableList = [];
		// 			this.current = 1;
		// 			this.loading = false;
		// 			this.isLoading = false;
		// 			this.finished = true;
		// 			this.isLoad = false;
		// 		}
		// 	})
		// 	.catch((e) => {
		// 		this.tableList = [];
		// 		this.current = 1;
		// 		this.loading = false;
		// 		this.isLoading = false;
		// 		this.finished = true;
		// 		this.isLoad = false;
		// 		console.log('getBoardData-err', e);
		// 	});
		// // this.tab2 = this.$route.query.tab2;
    // },
    // onLoad() {
    //   if (this.isLoad) return;
    //   this.isLoad = true;
    //   this.setTableData();
    // },

    // onRefresh() {
    //   this.current = 1;
    //   this.loading = false;
    //   this.isLoading = false;
    //   this.finished = false;
    //   this.isLoad = false;
    //   // this.tableList = [];
    //   this.setTableData(true);
    // },
  },

  components: {
    [List.name]: List,
    [PullRefresh.name]: PullRefresh,
    [NavBar.name]: NavBar,
    [Sticky.name]: Sticky,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
    Toast,
  },
};
</script>


<style lang="scss" scoped>
/deep/ .van-dropdown-menu{
  width: 90%;
  margin: 15px auto;
}
/deep/ .van-dropdown-menu__bar{
  box-shadow: none;
  height: 28px;
  .van-dropdown-menu__item{
    height: 28px;
    border-radius: 4px;
    border: 1px solid #CCCCCC;
    margin: 0 5px;
    .van-dropdown-menu__title{
      font-size: 13px;
      color: #666666;
    }
  }
}
/deep/ .van-sticky--fixed{
	background: white;
}
/deep/ .van-dropdown-item{
	z-index: 9999;
}
.data-title-box{
  margin: 15px 0 !important;
  font-size: 14px !important;
  color: #424242;
}
.barItem{
  margin: 20px auto;
}
.board{
  margin: 30px auto;
}
</style>
