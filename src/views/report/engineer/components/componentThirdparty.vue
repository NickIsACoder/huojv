<template>
  <div class="data-content-panel">
    <div v-if="orgType<3" :key="1">
      <van-dropdown-menu class="mt-30" active-color="#266545">
        <van-dropdown-item v-model="selectValue[0]" :options="selectOptions1" @change="selectChange(1)"/>
        <van-dropdown-item v-model="selectValue[1]" :options="selectOptions2" @change="selectChange(2)"/>
      </van-dropdown-menu>
      <div ref="bar" style="height:280px;" id="bar" class="board"></div>
      <div class="huojv-data-list-more" @click="goMore(0)">查看更多<van-icon name="arrow"/></div>
      <div class="txtBox">
          <p>备注：</p>
          <p>地产集团评分标准：评估得分=实测实量（65%）+安全文明（25%）+管理行为（10%）-质量关键扣分（10分封顶）</p>
          <p>商业集团评分标准：评估得分=实测实量（60%）+安全文明（40%）-质量关键扣分（10分封顶）</p>
      </div>
    </div>
    <div v-else-if="orgType>=3&&orgType<=4" :key="2">
      <van-dropdown-menu class="mt-20" active-color="#266545">
        <van-dropdown-item v-model="selectValue[1]" :options="selectOptions2" @change="selectChange(2)"/>
        <van-dropdown-item v-model="selectValue[2]" :options="selectOptions3" @change="selectChange(3)"/>
      </van-dropdown-menu>
      <div class="barItem">
        <div class="data-title-box data-title-line">
          <span class="title">区域公司评估得分排名</span>
        </div>
        <div ref="bar2" style="height:280px;" id="bar2" class="board"></div>
        <div class="huojv-data-list-more" @click="goMore(1)">查看更多<van-icon name="arrow"/></div>
      </div>
      <div class="barItem">
        <div class="data-title-box data-title-line">
          <span class="title">交付评估得分</span>
        </div>
        <div ref="bar3" style="height:280px;" id="bar3" class="board"></div>
        <div class="huojv-data-list-more" @click="goMore(2)">查看更多<van-icon name="arrow"/></div>
      </div>
      <div class="barItem">
        <div class="data-title-box data-title-line">
          <span class="title">精装项目综合评估得分</span>
        </div>
        <div ref="bar4" style="height:280px;" id="bar4" class="board"></div>
        <div class="huojv-data-list-more" @click="goMore(3)">查看更多<van-icon name="arrow"/></div>
      </div>
      <div class="barItem">
        <div class="data-title-box data-title-line">
          <span class="title">园林专项评估得分</span>
        </div>
        <div ref="bar5" style="height:280px;" id="bar5" class="board"></div>
        <div class="huojv-data-list-more" @click="goMore(4)">查看更多<van-icon name="arrow"/></div>
      </div>
    </div>
    <div v-else-if="orgType==5" :key="3">
      <div class="barItem">
        <div class="data-title-box data-title-line">
          <span class="title">区域公司综合评估历史成绩</span>
        </div>
        <div ref="bar6" style="height:280px;" id="bar6" class="board"></div>
      </div>
      <van-dropdown-menu class="mt-20" active-color="#266545">
        <van-dropdown-item v-model="selectValue[1]" :options="selectOptions2" @change="selectChange(2)"/>
        <van-dropdown-item v-model="selectValue[2]" :options="selectOptions3" @change="selectChange(3)"/>
      </van-dropdown-menu>
      <div style="padding: 10px 0; background: #fff">
        <div class="data-title-box data-title-line">
          <span class="title">土建区域级别综合评估得分</span>
        </div>
        <el-table stripe class="huo-list-table tree-table" size="mini" highlight-current-row
            border :data="tableList1" :max-height="400">
          <el-table-column prop="orgname" label="区域公司" align="center"></el-table-column>
          <el-table-column prop="actualmeasurement" label="实测实量" align="center"></el-table-column>
          <el-table-column prop="safetyscore" label="安全" align="center"></el-table-column>
          <el-table-column prop="priqtdeduction" label="质量关键项扣分" align="center"></el-table-column>
          <el-table-column prop="managebehavior" label="管理行为" align="center"></el-table-column>
          <el-table-column prop="assessmentscore" label="评估得分" align="center"></el-table-column>
          <el-table-column prop="groupranking" label="集团排名" align="center"></el-table-column>
        </el-table>
      </div>
      <div style="padding: 10px 0; background: #fff">
        <div class="data-title-box data-title-line">
          <span class="title">土建项目级别综合评估得分</span>
        </div>
        <el-table stripe class="huo-list-table tree-table" size="mini" highlight-current-row
            border :data="tableList2" :max-height="400">
          <el-table-column prop="parentorgname" label="区域公司" align="center"></el-table-column>
          <el-table-column prop="orgname" label="项目名称" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.orgtype==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgguid,scope.row.orgtype)">{{scope.row.orgname}}</span>
              <span v-else>{{scope.row.orgname}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="maincontractor" label="总包单位" align="center"></el-table-column>
          <el-table-column prop="actualmeasurement" label="实测实量" align="center"></el-table-column>
          <el-table-column prop="safetyscore" label="安全" align="center"></el-table-column>
          <el-table-column prop="priqtdeduction" label="质量关键项扣分" align="center"></el-table-column>
          <el-table-column prop="managebehavior" label="管理行为" align="center"></el-table-column>
          <el-table-column prop="assessmentscore" label="评估得分" align="center"></el-table-column>
          <el-table-column prop="groupranking" label="集团排名" align="center"></el-table-column>
        </el-table>
      </div>
      <div style="padding: 10px 0; background: #fff">
        <div class="data-title-box data-title-line">
          <span class="title">土建标段级别综合评估得分</span>
        </div>
        <el-table stripe class="huo-list-table tree-table" size="mini" highlight-current-row
            border :data="tableList3" :max-height="400">
          <el-table-column prop="parentorgname" label="公司区域" align="center"></el-table-column>
          <el-table-column prop="orgname" label="项目名称" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.orgtype==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgguid,scope.row.orgtype)">{{scope.row.orgname}}</span>
              <span v-else>{{scope.row.orgname}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="bidsection" label="标段名称" align="center"></el-table-column>
          <el-table-column prop="maincontractor" label="总包单位" align="center"></el-table-column>
          <el-table-column prop="actualmeasurement" label="实测实量" align="center"></el-table-column>
          <el-table-column prop="safetyscore" label="安全" align="center"></el-table-column>
          <el-table-column prop="priqtdeduction" label="质量关键项扣分" align="center"></el-table-column>
          <el-table-column prop="managebehavior" label="管理行为" align="center"></el-table-column>
          <el-table-column prop="assessmentscore" label="评估得分" align="center"></el-table-column>
          <el-table-column prop="groupranking" label="集团排名" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div v-else-if="orgType==6" :key="4">
      <div class="barItem">
        <div class="data-title-box data-title-line">
          <span class="title">项目综合评估得分对比</span>
        </div>
        <div ref="bar7" style="height:280px;" class="board" id="bar7"></div>
        <template v-for="(item,index) in barList">
            <div :ref="'LoopBar'+index" :key="item.name" :id="'LoopBar'+index" style="height:280px;" class="board"></div>
        </template>
      </div>
      <van-dropdown-menu class="mt-20" active-color="#266545">
        <van-dropdown-item v-model="selectValue[1]" :options="selectOptions2" @change="selectChange(2)"/>
        <van-dropdown-item v-model="selectValue[2]" :options="selectOptions3" @change="selectChange(3)"/>
      </van-dropdown-menu>
      <div style="padding: 20px 0; background: #fff">
        <div class="data-title-box data-title-line">
          <span class="title">土建项目级别综合评估得分</span>
        </div>
        <el-table stripe class="huo-list-table tree-table" size="mini" highlight-current-row
            border :data="tableList2" :max-height="400">
          <el-table-column prop="parentorgname" label="区域公司" align="center"></el-table-column>
          <el-table-column prop="orgname" label="项目名称" align="center">
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
          <el-table-column prop="groupranking" label="集团排名" align="center"></el-table-column>
        </el-table>
      </div>
        <div style="padding: 20px 0; background: #fff">
          <div class="data-title-box data-title-line">
            <span class="title">土建标段级别综合评估得分</span>
          </div>
            <el-table stripe class="huo-list-table tree-table" size="mini" highlight-current-row
                border :data="tableList3" :max-height="400">
              <el-table-column prop="parentorgname" label="区域公司" align="center"></el-table-column>
              <el-table-column prop="orgname" label="项目名称" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.orgtype==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgguid,scope.row.orgtype)">{{scope.row.orgname}}</span>
                  <span v-else>{{scope.row.orgname}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="bidsection" label="标段名称" align="center"></el-table-column>
              <el-table-column prop="maincontractor" label="总包单位" align="center"></el-table-column>
              <el-table-column prop="actualmeasurement" label="实测实量" align="center"></el-table-column>
              <el-table-column prop="safetyscore" label="安全" align="center"></el-table-column>
              <el-table-column prop="priqtdeduction" label="质量关键项扣分" align="center"></el-table-column>
              <el-table-column prop="managebehavior" label="管理行为" align="center"></el-table-column>
              <el-table-column prop="assessmentscore" label="评估得分" align="center"></el-table-column>
              <el-table-column prop="groupranking" label="集团排名" align="center"></el-table-column>
            </el-table>
        </div>
    </div>
    
  </div>
</template>

<script>
import echarts from 'echarts'
import scrollFixed from '@/mixin/scroll-fixed';
import {List,PullRefresh,Sticky,Icon,DropdownMenu,DropdownItem} from 'vant';
import {getLocalStorage} from '@/utils/local-storage';
import request from '@/utils/request';
import $ from 'jquery'
import {handleNum2String, handleDate, getUrlParam, jumpToPj} from '@/utils/common'

export default {
  data(){
    return {
      selectOptions1: [
        {value: '0', text: '地产集团', orgId: 'AA90A163-F782-4B78-4584-08D7E5E57C34'},
        {value: '1', text: '商业集团', orgId: '69EEBD5F-A9F3-4EEE-4640-08D7E5E57C34'}
      ],
      selectOptions2: [],
      selectOptions3: [],
      selectValue: ['0', null, null],
      tableList1: [],
      tableList2: [],
      tableList3: [],
      tableList4: [], // 项目级
      tableList5: [], // 项目级
      barList: [],
      orgType: 2,
      orgId: '',
      isChangeYear: false
    }
  },
  watch: {
    '$store.state.orgId': function (newVal, oldVal) {
      this.init(true);
    }
  },
  mounted() {
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
    this.init();
  },
  methods:{
    jumpToPj,
    init(initType){
      this.orgId = getUrlParam('chooseOrgId') || getUrlParam('orgId') || getLocalStorage('orgId').orgId;
      this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType;

      if (this.selectOptions2.length<=0) {
        this.getYear()
      }

      if (this.isChangeYear) {
        this.selectOptions3 = []
        this.selectValue[2] = null
        this.getMonth()
      }
      
      if (this.orgType<=2) {
        if (this.selectOptions2.length>0) {
          this.getFirstLevel()
        }
      } else if(this.orgType>=3&&this.orgType<=4){
        if (this.selectOptions3.length>0) {
          this.getSecondLevel('bar2', 5) // 区域公司评估得分排名
          this.getSecondLevel('bar3', 5) // 交付评估得分
          this.getSecondLevel('bar4', 6) // 精装项目综合评估得分
          this.getSecondLevel('bar5', 6) // 园林专项评估得分
        }
      } else if(this.orgType==5){
        if (initType) {
          this.getbar(0, 5)
        }
        if (this.selectOptions2.length>0) {
          this.tableList1 = []
          this.tableList2 = []
          this.tableList3 = []
          this.getLeveltb(0, 5)
          this.getLeveltb(0, 6)
          this.getLeveltb(1, 6)
        }
      } else if(this.orgType==6){
        if (initType) {
          this.getbar(0, 6)
          this.getbar(1, 6)
        }
        if (this.selectOptions2.length>0) {
          this.tableList2 = []
          this.tableList3 = []
          this.getLeveltb(0, 6)
          this.getLeveltb(1, 6)
        }
      }

    },
    // 获取年份
    getYear() {
        request({
          url: `/app-api/engineer/stageYearMonth`,
          method: 'get',
          params: { orgId: this.orgId },
        }).then(({data}) => {
            if (data.data&&data.data.length>0) {
                  this.selectOptions2 = data.data.map( (item,idx) => {
                    return {
                        value: idx+'',
                        text: item.years+'年',
                        prop: item.years
                    }
                })
                this.selectValue[1] = '0'
                if (this.orgType<=2) {
                    this.getFirstLevel()
                } else if(this.orgType==5){
                    this.getbar(0, 5)
                } else if(this.orgType==6){
                    this.getbar(0, 6)
                    this.getbar(1, 6)
                }

                this.getMonth()
            } else {
                let barData = {
                    names: [],
                    values: []
                }

                this.$nextTick(()=>{
                    if (this.orgType<=2) {
                        this.setBar(barData, 'bar', '#006E38', false)
                    } else if(this.orgType>=3&&this.orgType<=4){
                        this.setBar(barData, 'bar2', '#006E38', true)
                        this.setBar(barData, 'bar3', '#006E38', false)
                        this.setBar(barData, 'bar4', '#006E38', false)
                        this.setBar(barData, 'bar5', '#006E38', false)
                    } else if(this.orgType==5){
                        this.setBar(barData, 'bar6', '#006E38', false, null, '')
                    } else if(this.orgType==6){
                        this.setBar(barData, 'bar7', '#006E38', false, null, '')
                    }
                })
            }

            
        }).catch((e) => {
            console.log(e)
        });
    },
    // 获取月份
    getMonth() {
      this.isChangeYear = false
      let _selIdx = this.selectValue[1]
      request({
        url: `/app-api/engineer/stageYearMonth`,
        method: 'get',
        params: { year: this['selectOptions2'][_selIdx].prop },
      }).then(({data}) => {
        if (data.data&&data.data.length>0) {
          this.selectOptions3 = data.data.map( (item,idx) => {
            return {
              value: idx,
              text: item.months+'月',
              prop: item.months
            }
          })
          this.selectValue[2] = 0

          if (this.orgType>=3&&this.orgType<=4) {
            this.getSecondLevel('bar2', 5) // 区域公司评估得分排名
            this.getSecondLevel('bar3', 5) // 交付评估得分
            this.getSecondLevel('bar4', 6) // 精装项目综合评估得分
            this.getSecondLevel('bar5', 6) // 园林专项评估得分
          } else if (this.orgType==5){
            this.getLeveltb(0, 5)
            this.getLeveltb(0, 6)
            this.getLeveltb(1, 6)
          } else if (this.orgType==6){
            this.getLeveltb(0, 6)
            this.getLeveltb(1, 6)
          }
        }
      }).catch((e) => {
        console.log(e)
      });
    },
    // 一级集团
    getFirstLevel() {
        let _selIdx = this.selectValue[1],
            _selorgId = this.selectOptions1[this.selectValue[0]].orgId,
            _selYear = this.selectOptions2[_selIdx].prop

        request({
          url: `/app-api/engineer/stagesForOrgAndYear`,
          method: 'get',
          params: {
            orgId: _selorgId,
            year: _selYear,
            summaryOrDetails: 0
         },
        }).then(({data}) => {
            let barData = {
                names: [],
                values: []
            }

            if (data.data&&data.data.length>0) {
                barData.names = data.data[0].engineeringStageSummary.map(i => i.months+'月')
                barData.values = data.data[0].engineeringStageSummary.map(i => i.assessmentscore)
            }

            this.$nextTick(()=>{
                console.log('更新bar')
                this.setBar(barData, 'bar', '#006E38', false)
            })

        }).catch((e) => {
            console.log(e)
        });
    },
    // 二级集团
    getSecondLevel(el,orgtype) {
      let _selYear = this.selectOptions2[this.selectValue[1]].prop,
          _month = this.selectOptions3[this.selectValue[2]].prop

      let _url = ''
      let _params = {
          orgId: this.orgId,
          year: _selYear,
          month: _month,
          orgType: orgtype,
          summaryOrDetails: 0
      }
      if (el=='bar2') { // 区域公司评估得分排名
          _url = `/app-api/engineer/stagesForOrgYearMonth`
      } else if (el=='bar3') { // 交付评估得分
          _url = `/app-api/engineer/deliverStageSummaryList`
      } else if (el=='bar4') {// 精装项目综合评估得分
          _url = `/app-api/engineer/decorationStagesForOrgYearMonth`
          _params.dateType = 1
      } else if (el=='bar5') {// 园林专项评估得分
          _url = `/app-api/engineer/decorationStagesForOrgYearMonth`
          _params.dateType = 2
      }

      request({
          url: _url,
          method: 'get',
          params: _params
      }).then(({data}) => {
        let barData = {
            names: [],
            values: [],
            avg: null,
        },
        _data = data.data

        if (data.data&&data.data.length>0) {
          if (el=='bar2') {
            barData.avg = _data[0].engineeringStageSummary[0].avgnum
            barData.names = _data[0].engineeringStageSummary.map(i => i.orgname)
            barData.values = _data[0].engineeringStageSummary.map(i => i.assessmentscore)
          } else if (el=='bar3') {
            barData.avg = _data[0].deliverStageSummary[0].avgnum
            barData.names = _data[0].deliverStageSummary.map(i => i.orgname)
            barData.values = _data[0].deliverStageSummary.map(i => i.overallscore)
          } else if (el=='bar4') {
            barData.avg = _data[0].decorationStageSummary[0].avgnum
            barData.names = _data[0].decorationStageSummary.map(i => i.orgname)
            barData.values = _data[0].decorationStageSummary.map(i => i.assessmentscore)
          } else if (el=='bar5') {
            barData.avg = _data[0].decorationStageSummary[0].avgnum
            barData.names = _data[0].decorationStageSummary.map(i => i.orgname)
            barData.values = _data[0].decorationStageSummary.map(i => i.assessmentscore)
          }
        }

        this.$nextTick(()=>{
          if (el=='bar2') { // 区域公司评估得分排名
            this.setBar(barData, 'bar2', '#006E38', true, barData.avg)
          } else if (el=='bar3') { // 交付评估得分
            this.setBar(barData, 'bar3', '#006E38', false, barData.avg)
          } else if (el=='bar4') {// 精装项目综合评估得分
            this.setBar(barData, 'bar4', '#006E38', false, barData.avg)
          } else if (el=='bar5') {// 园林专项评估得分
            this.setBar(barData, 'bar5', '#006E38', false, barData.avg)
          }
        })

      }).catch((e) => {
        console.log(e)
      });
    },
    // (区域公司/项目)-柱状图
    getbar(_summaryOrDetails,_orgtype) {
      let _selIdx = this.selectValue[1],
          _selYear = this.selectOptions2[0].prop

      request({
          url: '/app-api/engineer/stagesForOrgAndYear',
          method: 'get',
          params: {
            orgId: this.orgId,
            year: _selYear,
            summaryOrDetails: _summaryOrDetails
          }
      }).then(({data}) => {
        let barData = {
            names: [],
            values: []
        },name = ''


        if (data.data&&data.data.length>0) {
          if (_summaryOrDetails==0) {
              name = data.data[0].engineeringStageSummary[0].orgname
              barData.names = data.data[0].engineeringStageSummary.map(i => i.years+'年'+i.months+'月')
              barData.values = data.data[0].engineeringStageSummary.map(i => i.assessmentscore)
          } else {
            this.barList = data.data

            let _color = ['#006E38','#006E38']
            for (let i = 0; i < this.barList.length; i++) {
              const item = this.barList[i],
                _ci = i%2==0? 0: 1
              let loopBarData = {
                    names: [],
                    values: []
                },loopName = ''

                loopName = item.bidsection
                loopBarData.names = item.engineeringStageSummary.map(i => i.years+'年'+i.months+'月')
                loopBarData.values = item.engineeringStageSummary.map(i => i.assessmentscore)
              
              this.$nextTick(()=>{
                this.setBar(loopBarData, 'LoopBar'+i, _color[_ci], false, null, loopName)
              })
            }
          }
        }

        this.$nextTick(()=>{
          if (_orgtype==5) {
            this.setBar(barData, 'bar6', '#006E38', false, null, name)
          } else if (_orgtype==6) {
            if (_summaryOrDetails==0){
              this.setBar(barData, 'bar7', '#006E38', false, null, name)
            }
          }
        })
      }).catch((e) => {
        console.log(e)
      });
    },
    // 区域公司、项目-表格
    getLeveltb(_summaryOrDetails, _orgtype) {
      let _selYear = this.selectOptions2[this.selectValue[1]].prop,
          _month = this.selectOptions3[this.selectValue[2]].prop
      let _params = {
          orgId: this.orgId,
          year: _selYear,
          month: _month,
          orgType: _orgtype,
          summaryOrDetails: _summaryOrDetails,
          orderColumn: 'groupranking',
          orderType: 'asc'
      }
      request({
          url: '/app-api/engineer/stagesForOrgYearMonth',
          method: 'get',
          params: _params
      }).then(({data}) => {
        // let _data = data.data

        let _prop = 'engineeringStageSummary'
        let _data = data.data.map(i => {
          return i[_prop][0]
        })

        if (data.data&&data.data.length>0) {
          if (_summaryOrDetails==0) {
            if (_orgtype==5) {
              this.tableList1 = _data
            } else {
              this.tableList2 = _data
            }
          } else {
            this.tableList3 = _data
          }
          // if (_summaryOrDetails==0) {
          //   if (_orgtype==5) {
          //     this.tableList1 = _data[0].engineeringStageSummary
          //   } else {
          //     this.tableList2 = _data[0].engineeringStageSummary
          //   }
          // } else {
          //   this.tableList3 = _data[0].engineeringStageSummary
          // }
        }

      }).catch((e) => {
        console.log(e)
      });
    },
    setBar(data, el, color, changeColor,avg, title) {
      let max = 0
      if (data.values.length>0) {
        max = data.values.reduce(function(a , b){
          return b > a ? b : a;
        });
      }

      console.log('最大值',data.values,max)
      let option = {
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '8%',
          containLabel: true,
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
            fontSize: 12,
          },
          axisPointer: {
            type: 'shadow',
            label: {
              backgroundColor: '#6a7985'
            }
          },
        },
        xAxis: {
          type: 'category',
          data: data.names,
          axisLine: {
            lineStyle: {
              color: '#E8E8E8',
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            rotate: 45,
            textStyle: {
              fontSize: '10',
              color: '#666',
            },
          },
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#E8E8E8',
            },
          },
          axisLabel: {
            textStyle: {
              textStyle: '10',
              color: '#666',
            },
          },
        },
        series: [
          {
              // name: 'txt',
            type: 'bar',
            barMaxWidth: '20',
            data: data.values,
            itemStyle: {
              normal: {
                color: (params) => {
                  if (params.dataIndex<3) {
                    return '#e45757'
                  } else if (params.dataIndex>=data.values.length-3){
                    return '#868583'
                  }else {
                    return '#006E38'
                  }
                }
              }
            },
            label: {
              color: '#ffffff',
              show: true,
              textBorderWidth: 2,
              textBorderColor: '#E45757',
              position: 'insideTop',
            },
          },
        ],
      };

      if (avg&&avg>max) {
        option.yAxis.max = Math.ceil(parseFloat(avg) + 10)
      }

      if (title) {
        option.title = {
          text: title,
          show: true,
          textStyle: {
            fontWeight: '400',
            fontSize: 12,
            color: '#3A3A3A'
          },
          x: 'center',
          y: 'top'
        }
        option.grid.top = '15%'
      }

      if (!changeColor) {
        option.series[0].itemStyle.normal.color = color
      }
      if (avg) {
        option.series[0].markLine =  {
          symbol: "none",
          data: [{ 
            name: '平均值',
            yAxis: avg,
            lineStyle: {
              width: 1,
              color: "#FE0909"
            },
            label: {
              fontSize: 11,
              lineHeight: 15,
              color: '#ffffff',
              position: 'insideEndTop',
              formatter: '{b}：{c}',
              backgroundColor: 'red',
              padding: [3, 10],
              shadowColor: '#eeeeee',
              borderRadius: 3,
              shadowBlur: 1,
              shadowOffsetY: 0,
            },
          }]
        }
      }

      if (data.values.length >= 5) {
        option.dataZoom = [{
            type: 'inside',
            show: true,
            xAxisIndex: [0],
            start: 0,
            //zoomLock: true,
            end: (5 / data.values.length) * 100, //初始化滚动条
            // minValueSpan:3,
            // maxValueSpan:5
        }];
      }
          
      let myChart = new echarts.init(document.getElementById(el))
      myChart.setOption(option, true);
      window.onresize = myChart.resize;
    },
    goMore(idx){
      let selectValue = this.selectValue.join()
      this.$router.push({
        path: '/report/engineer/thirdpartyMore',
        query: {
          orgId: this.orgId,
          orgType: this.orgType,
          pageType:idx,
          selectValue: selectValue,
          token: getUrlParam('token')
        }
      })
    },
    selectChange(idx){
      let value = this.selectValue[idx-1]
      if (idx==2) {
        this.isChangeYear = true
      }
      console.log(this['selectOptions'+idx][value].text)
      this.init()
    }
  },
  components: {
    [List.name]: List,
    [PullRefresh.name]: PullRefresh,
    [Sticky.name]: Sticky,
    [Icon.name]: Icon,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
  }
}
</script>

<style lang="scss" scoped>
.data-content-panel{
  padding-bottom: 50px;
}
.tableTitle{
  margin: 20px;
  font-size: 14px;
  color: #333333;
  text-align: center;
}
.data-title-box{
  margin: 15px 0 !important;
  font-size: 14px !important;
  color: #424242;
}
.txtBox{
  color: #939393;
  font-size: 10px;
  p{
    margin: 5px auto;
  }
}
.huojv-data-list-more{
  margin-bottom: 20px;
}
/deep/ .van-dropdown-menu{
  width: 80%;
  margin: 0px auto;
}
/deep/ .van-dropdown-menu__bar{
  box-shadow: none;
  height: 28px;
  .van-dropdown-menu__item{
    height: 28px;
    border-radius: 4px;
    border: 1px solid #CCCCCC;
    margin: 0 10px;
    .van-dropdown-menu__title{
      font-size: 13px;
      color: #666666;
    }
  }
}
.barItem{
  margin: 20px auto;
}
.board{
  margin: 30px auto;
}
</style>