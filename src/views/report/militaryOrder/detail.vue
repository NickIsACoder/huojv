<template>
  <div class="report-index pb-20">
    <van-nav-bar
      style="position: fixed; top: 0; width: 100%;"
      :title="title"
      left-arrow
      @click-left="onClickLeft"
      v-eventlisten="{isChangePage:true,pageEvent:'点击返回按钮'}"
    />

    <div class="main-content mt-15 padding-nav" style="width:100%">
      <div class="data-content-panel">
        <div class="tableBox">
          <p class="borderTitle">签约金额（自营）</p>
          <el-table stripe 
            class="huo-list-table main-theme-table" size="mini" highlight-current-row :data="tableList1">
              <el-table-column prop="name" label="完成情况" align="center"></el-table-column>
              <el-table-column prop="firstQuarter" label="一季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.firstQuarter&&scope.row.firstQuarter!='-'" :class="scope.row.firstQuarter>=100?'green':'red'">{{scope.row.firstQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.firstQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.firstQuarter|valChange(scope.row.percent)}}</span>
                  <!-- <span v-else>{{scope.row.percent&&scope.row.percent==2?scope.row.firstQuarter+'%':scope.row.firstQuarter|valChange}}</span> -->
                </template>
              </el-table-column>
              <el-table-column prop="secondQuarter" label="二季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.secondQuarter&&scope.row.secondQuarter!='-'" :class="scope.row.secondQuarter>=100?'green':'red'">{{scope.row.secondQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.secondQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.secondQuarter|valChange(scope.row.percent)}}</span>
                  <!-- <span v-else>{{scope.row.percent&&scope.row.percent==2?scope.row.secondQuarter+'%':scope.row.secondQuarter|valChange}}</span> -->
                </template>
              </el-table-column>
              <el-table-column prop="threeQuarter" label="三季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.threeQuarter&&scope.row.threeQuarter!='-'" :class="scope.row.threeQuarter>=100?'green':'red'">{{scope.row.threeQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.threeQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.threeQuarter|valChange(scope.row.percent)}}</span>
                  <!-- <span v-else>{{scope.row.percent&&scope.row.percent==2?scope.row.threeQuarter+'%':scope.row.threeQuarter|valChange}}</span> -->
                </template>
              </el-table-column>
              <el-table-column prop="fourQuarter" label="四季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.fourQuarter&&scope.row.fourQuarter!='-'" :class="scope.row.fourQuarter>=100?'green':'red'">{{scope.row.fourQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.fourQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.fourQuarter|valChange(scope.row.percent)}}</span>
                  <!-- <span v-else>{{scope.row.percent&&scope.row.percent==2?scope.row.fourQuarter+'%':scope.row.fourQuarter|valChange}}</span> -->
                </template>
              </el-table-column>
          </el-table>
        </div>
        <div class="tableBox" v-show="orgType<5">
          <p class="borderTitle">签约净利润率</p>
          <el-table stripe 
            class="huo-list-table main-theme-table" size="mini" highlight-current-row :data="tableList2">
              <el-table-column prop="name" label="完成情况" align="center"></el-table-column>
              <el-table-column prop="firstQuarter" label="一季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.firstQuarter&&scope.row.firstQuarter!='-'" :class="scope.row.firstQuarter>=100?'green':'red'">{{scope.row.firstQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.firstQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.firstQuarter|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="secondQuarter" label="二季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.secondQuarter&&scope.row.secondQuarter!='-'" :class="scope.row.secondQuarter>=100?'green':'red'">{{scope.row.secondQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.secondQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.secondQuarter|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="threeQuarter" label="三季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.threeQuarter&&scope.row.threeQuarter!='-'" :class="scope.row.threeQuarter>=100?'green':'red'">{{scope.row.threeQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.threeQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.threeQuarter|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="fourQuarter" label="四季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.fourQuarter&&scope.row.fourQuarter!='-'" :class="scope.row.fourQuarter>=100?'green':'red'">{{scope.row.fourQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.fourQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.fourQuarter|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
          </el-table>
        </div>
        <div class="tableBox" v-show="orgType>=5">
          <p class="borderTitle">签约净利润率(占用资金前)</p>
          <el-table stripe 
            class="huo-list-table main-theme-table" size="mini" highlight-current-row :data="tableList2_1">
              <el-table-column prop="name" label="完成情况" align="center"></el-table-column>
              <el-table-column prop="firstQuarter" label="一季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.firstQuarter&&scope.row.firstQuarter!='-'" :class="scope.row.firstQuarter>=100?'green':'red'">{{scope.row.firstQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.firstQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.firstQuarter|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="secondQuarter" label="二季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.secondQuarter&&scope.row.secondQuarter!='-'" :class="scope.row.secondQuarter>=100?'green':'red'">{{scope.row.secondQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.secondQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.secondQuarter|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="threeQuarter" label="三季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.threeQuarter&&scope.row.threeQuarter!='-'" :class="scope.row.threeQuarter>=100?'green':'red'">{{scope.row.threeQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.threeQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.threeQuarter|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="fourQuarter" label="四季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.fourQuarter&&scope.row.fourQuarter!='-'" :class="scope.row.fourQuarter>=100?'green':'red'">{{scope.row.fourQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.fourQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.fourQuarter|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
          </el-table>
        </div>
        <div class="tableBox" v-show="orgType>=5">
          <p class="borderTitle">签约净利润率(占用资金后)</p>
          <el-table stripe 
            class="huo-list-table main-theme-table" size="mini" highlight-current-row :data="tableList2_2">
              <el-table-column prop="name" label="完成情况" align="center"></el-table-column>
              <el-table-column prop="firstQuarter" label="一季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.firstQuarter&&scope.row.firstQuarter!='-'" :class="scope.row.firstQuarter>=100?'green':'red'">{{scope.row.firstQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.firstQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.firstQuarter|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="secondQuarter" label="二季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.secondQuarter&&scope.row.secondQuarter!='-'" :class="scope.row.secondQuarter>=100?'green':'red'">{{scope.row.secondQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.secondQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.secondQuarter|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="threeQuarter" label="三季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.threeQuarter&&scope.row.threeQuarter!='-'" :class="scope.row.threeQuarter>=100?'green':'red'">{{scope.row.threeQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.threeQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.threeQuarter|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="fourQuarter" label="四季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.fourQuarter&&scope.row.fourQuarter!='-'" :class="scope.row.fourQuarter>=100?'green':'red'">{{scope.row.fourQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.fourQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.fourQuarter|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
          </el-table>
        </div>
        <div class="tableBox">
          <p class="borderTitle">回款率</p>
          <el-table stripe 
            class="huo-list-table main-theme-table" size="mini" highlight-current-row :data="tableList3">
              <el-table-column prop="name" label="完成情况" align="center"></el-table-column>
              <el-table-column prop="firstQuarter" label="一季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.firstQuarter&&scope.row.firstQuarter!='-'" :class="scope.row.firstQuarter>=100?'green':'red'">{{scope.row.firstQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.firstQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.firstQuarter|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="secondQuarter" label="二季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.secondQuarter&&scope.row.secondQuarter!='-'" :class="scope.row.secondQuarter>=100?'green':'red'">{{scope.row.secondQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.secondQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.secondQuarter|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="threeQuarter" label="三季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.threeQuarter&&scope.row.threeQuarter!='-'" :class="scope.row.threeQuarter>=100?'green':'red'">{{scope.row.threeQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.threeQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.threeQuarter|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="fourQuarter" label="四季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.fourQuarter&&scope.row.fourQuarter!='-'" :class="scope.row.fourQuarter>=100?'green':'red'">{{scope.row.fourQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.fourQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.fourQuarter|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
          </el-table>
        </div>
        <div class="tableBox">
          <p class="borderTitle">去化率</p>
          <el-table stripe 
            class="huo-list-table main-theme-table" size="mini" highlight-current-row :data="tableList4">
              <el-table-column prop="name" label="完成情况" align="center"></el-table-column>
              <el-table-column prop="firstQuarter" label="一季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.firstQuarter&&scope.row.firstQuarter!='-'" :class="scope.row.firstQuarter>=100?'green':'red'">{{scope.row.firstQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.firstQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.firstQuarter|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="secondQuarter" label="二季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.secondQuarter&&scope.row.secondQuarter!='-'" :class="scope.row.secondQuarter>=100?'green':'red'">{{scope.row.secondQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.secondQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.secondQuarter|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="threeQuarter" label="三季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.threeQuarter&&scope.row.threeQuarter!='-'" :class="scope.row.threeQuarter>=100?'green':'red'">{{scope.row.threeQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.threeQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.threeQuarter|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="fourQuarter" label="四季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.fourQuarter&&scope.row.fourQuarter!='-'" :class="scope.row.fourQuarter>=100?'green':'red'">{{scope.row.fourQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.fourQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.fourQuarter|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
          </el-table>
        </div>
        <div class="tableBox">
          <p class="borderTitle">交楼金额-内部</p>
          <el-table stripe 
            class="huo-list-table main-theme-table" size="mini" highlight-current-row :data="tableList5">
              <el-table-column prop="name" label="完成情况" align="center"></el-table-column>
              <el-table-column prop="firstQuarter" label="一季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.firstQuarter&&scope.row.firstQuarter!='-'" :class="scope.row.firstQuarter>=100?'green':'red'">{{scope.row.firstQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.firstQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.firstQuarter|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="secondQuarter" label="二季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.secondQuarter&&scope.row.secondQuarter!='-'" :class="scope.row.secondQuarter>=100?'green':'red'">{{scope.row.secondQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.secondQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.secondQuarter|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="threeQuarter" label="三季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.threeQuarter&&scope.row.threeQuarter!='-'" :class="scope.row.threeQuarter>=100?'green':'red'">{{scope.row.threeQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.threeQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.threeQuarter|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="fourQuarter" label="四季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.fourQuarter&&scope.row.fourQuarter!='-'" :class="scope.row.fourQuarter>=100?'green':'red'">{{scope.row.fourQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.fourQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.fourQuarter|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
          </el-table>
        </div>
        <div class="tableBox">
          <p class="borderTitle">人力费用</p>
          <el-table stripe 
            class="huo-list-table main-theme-table" size="mini" highlight-current-row :data="tableList6">
              <el-table-column prop="name" label="完成情况" align="center"></el-table-column>
              <el-table-column prop="firstQuarter" label="一季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.firstQuarter&&scope.row.firstQuarter!='-'" :class="scope.row.firstQuarter>100?'red':'green'">{{scope.row.firstQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.firstQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.firstQuarter|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="secondQuarter" label="二季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.secondQuarter&&scope.row.secondQuarter!='-'" :class="scope.row.secondQuarter>100?'red':'green'">{{scope.row.secondQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.secondQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.secondQuarter|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="threeQuarter" label="三季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.threeQuarter&&scope.row.threeQuarter!='-'" :class="scope.row.threeQuarter>100?'red':'green'">{{scope.row.threeQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.threeQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.threeQuarter|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="fourQuarter" label="四季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.fourQuarter&&scope.row.fourQuarter!='-'" :class="scope.row.fourQuarter>100?'red':'green'">{{scope.row.fourQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.fourQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.fourQuarter|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
          </el-table>
        </div>
        <div class="tableBox">
          <p class="borderTitle">行政费用</p>
          <el-table stripe 
            class="huo-list-table main-theme-table" size="mini" highlight-current-row :data="tableList7">
              <el-table-column prop="name" label="完成情况" align="center"></el-table-column>
              <el-table-column prop="firstQuarter" label="一季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.firstQuarter&&scope.row.firstQuarter!='-'" :class="scope.row.firstQuarter>100?'red':'green'">{{scope.row.firstQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.firstQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.firstQuarter|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="secondQuarter" label="二季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.secondQuarter&&scope.row.secondQuarter!='-'" :class="scope.row.secondQuarter>100?'red':'green'">{{scope.row.secondQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.secondQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.secondQuarter|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="threeQuarter" label="三季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.threeQuarter&&scope.row.threeQuarter!='-'" :class="scope.row.threeQuarter>100?'red':'green'">{{scope.row.threeQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.threeQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.threeQuarter|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="fourQuarter" label="四季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.fourQuarter&&scope.row.fourQuarter!='-'" :class="scope.row.fourQuarter>100?'red':'green'">{{scope.row.fourQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.fourQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.fourQuarter|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
          </el-table>
        </div>
        <div class="tableBox" v-show="orgType<5">
          <p class="borderTitle">优本增效</p>
          <el-table stripe 
            class="huo-list-table main-theme-table" size="mini" highlight-current-row :data="tableList8">
              <el-table-column prop="name" label="完成情况" align="center"></el-table-column>
              <el-table-column prop="firstYear" label="上半年" align="center">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.firstYear&&scope.row.firstYear!='-'" :class="scope.row.firstYear>=100?'green':'red'">{{scope.row.firstYear|valChangeSecend}}</span>
                    <span v-else>{{scope.row.firstYear|valChangeSecend}}</span>
                  </template>
                  <!-- <span v-if="scope.row.percent==1" :class="scope.row.firstYear>=100?'green':'red'">{{scope.row.firstYear|valChangeSecend}}</span> -->
                  <span v-else>{{scope.row.firstYear|valChange(scope.row.percent)}}</span>
                  <!-- <span v-else>{{scope.row.percent&&scope.row.percent==2?scope.row.firstYear+'%':scope.row.firstYear}}</span> -->
                </template>
              </el-table-column>
              <el-table-column prop="secondYear" label="下半年" align="center">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.secondYear&&scope.row.secondYear!='-'" :class="scope.row.secondYear>=100?'green':'red'">{{scope.row.secondYear|valChangeSecend}}</span>
                    <span v-else>{{scope.row.secondYear|valChangeSecend}}</span>
                  </template>
                  <!-- <span v-if="scope.row.percent==1" :class="scope.row.secondYear>=100?'green':'red'">{{scope.row.secondYear|valChangeSecend}}</span> -->
                  <span v-else>{{scope.row.secondYear|valChange(scope.row.percent)}}</span>
                  <!-- <span v-else>{{scope.row.percent&&scope.row.percent==2?scope.row.secondYear+'%':scope.row.secondYear}}</span> -->
                </template>
              </el-table-column>
          </el-table>
        </div>
        <div class="tableBox" v-show="orgType>=5">
          <p class="borderTitle">融资金额</p>
          <el-table stripe 
            class="huo-list-table main-theme-table" size="mini" highlight-current-row :data="tableList8_1">
              <el-table-column prop="name" label="完成情况" align="center"></el-table-column>
              <el-table-column prop="firstQuarter" label="一季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.firstQuarter&&scope.row.firstQuarter!='-'" :class="scope.row.firstQuarter>=100?'green':'red'">{{scope.row.firstQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.firstQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.firstQuarter|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="secondQuarter" label="二季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.secondQuarter&&scope.row.secondQuarter!='-'" :class="scope.row.secondQuarter>=100?'green':'red'">{{scope.row.secondQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.secondQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.secondQuarter|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="threeQuarter" label="三季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.threeQuarter&&scope.row.threeQuarter!='-'" :class="scope.row.threeQuarter>=100?'green':'red'">{{scope.row.threeQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.threeQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.threeQuarter|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="fourQuarter" label="四季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.fourQuarter&&scope.row.fourQuarter!='-'" :class="scope.row.fourQuarter>=100?'green':'red'">{{scope.row.fourQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.fourQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.fourQuarter|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
          </el-table>
        </div>
        <div class="tableBox">
          <p class="borderTitle">营销费用</p>
          <!-- <el-table stripe  v-show="orgType<=2" 
            class="huo-list-table main-theme-table" size="mini" highlight-current-row :data="tableList9">
              <el-table-column prop="name" label="完成情况" align="center"></el-table-column>
              <el-table-column prop="overdueUndone" label="上半年" align="center"></el-table-column>
              <el-table-column prop="undoneOnTimeRate" label="下半年" align="center"></el-table-column>
          </el-table> -->
          <el-table stripe
            class="huo-list-table main-theme-table" size="mini" highlight-current-row :data="tableList9_1">
              <el-table-column prop="name" label="完成情况" align="center"></el-table-column>
              <el-table-column prop="firstQuarter" label="一季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.firstQuarter&&scope.row.firstQuarter!='-'" :class="scope.row.firstQuarter>100?'red':'green'">{{scope.row.firstQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.firstQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.firstQuarter|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="secondQuarter" label="二季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.secondQuarter&&scope.row.secondQuarter!='-'" :class="scope.row.secondQuarter>100?'red':'green'">{{scope.row.secondQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.secondQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.secondQuarter|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="threeQuarter" label="三季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.threeQuarter&&scope.row.threeQuarter!='-'" :class="scope.row.threeQuarter>100?'red':'green'">{{scope.row.threeQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.threeQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.threeQuarter|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="fourQuarter" label="四季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.fourQuarter&&scope.row.fourQuarter!='-'" :class="scope.row.fourQuarter>100?'red':'green'">{{scope.row.fourQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.fourQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.fourQuarter|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
          </el-table>
        </div>
        <div class="tableBox">
          <p class="borderTitle">营销费率</p>
          <!-- <el-table stripe v-show="orgType<=2"
            class="huo-list-table main-theme-table" size="mini" highlight-current-row :data="tableList10">
              <el-table-column prop="name" label="完成情况" align="center"></el-table-column>
              <el-table-column prop="overdueUndone" label="上半年" align="center"></el-table-column>
              <el-table-column prop="undoneOnTimeRate" label="下半年" align="center"></el-table-column>
          </el-table> -->
          <el-table stripe 
            class="huo-list-table main-theme-table" size="mini" highlight-current-row :data="tableList10_1">
              <el-table-column prop="name" label="完成情况" align="center"></el-table-column>
              <el-table-column prop="firstQuarter" label="一季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.firstQuarter&&scope.row.firstQuarter!='-'" :class="scope.row.firstQuarter>100?'red':'green'">{{scope.row.firstQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.firstQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.firstQuarter|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="secondQuarter" label="二季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.secondQuarter&&scope.row.secondQuarter!='-'" :class="scope.row.secondQuarter>100?'red':'green'">{{scope.row.secondQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.secondQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.secondQuarter|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="threeQuarter" label="三季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.threeQuarter&&scope.row.threeQuarter!='-'" :class="scope.row.threeQuarter>100?'red':'green'">{{scope.row.threeQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.threeQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.threeQuarter|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="fourQuarter" label="四季度" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.fourQuarter&&scope.row.fourQuarter!='-'" :class="scope.row.fourQuarter>100?'red':'green'">{{scope.row.fourQuarter|valChangeSecend}}</span>
                    <span v-else>{{scope.row.fourQuarter|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.fourQuarter|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
          </el-table>
        </div>
        <div class="tableBox" v-show="orgType<=5">
          <p class="borderTitle">上半年客户满意度</p>
          <el-table stripe 
            class="huo-list-table main-theme-table" size="mini" highlight-current-row :data="tableList11">
              <el-table-column prop="name" label="完成情况" align="center"></el-table-column>
              <el-table-column prop="newOwner" label="准业主" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.newOwner&&scope.row.newOwner!='-'" :class="scope.row.newOwner>=100?'green':'red'">{{scope.row.newOwner|valChangeSecend}}</span>
                    <span v-else>{{scope.row.newOwner|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.newOwner|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="transition" label="磨合期" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.transition&&scope.row.transition!='-'" :class="scope.row.transition>=100?'green':'red'">{{scope.row.transition|valChangeSecend}}</span>
                    <span v-else>{{scope.row.transition|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.transition|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="stable" label="稳定期" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.stable&&scope.row.stable!='-'" :class="scope.row.stable>=100?'green':'red'">{{scope.row.stable|valChangeSecend}}</span>
                    <span v-else>{{scope.row.stable|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.stable|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="oldOwner" label="老业主" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.oldOwner&&scope.row.oldOwner!='-'" :class="scope.row.oldOwner>=100?'green':'red'">{{scope.row.oldOwner|valChangeSecend}}</span>
                    <span v-else>{{scope.row.oldOwner|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.oldOwner|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
          </el-table>
        </div>
        <div class="tableBox" v-show="orgType<=5">
          <p class="borderTitle">下半年客户满意度</p>
          <el-table stripe 
            class="huo-list-table main-theme-table" size="mini" highlight-current-row :data="tableList12">
              <el-table-column prop="name" label="完成情况" align="center"></el-table-column>
              <el-table-column prop="newOwner" label="准业主" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.newOwner&&scope.row.newOwner!='-'" :class="scope.row.newOwner>=100?'green':'red'">{{scope.row.newOwner|valChangeSecend}}</span>
                    <span v-else>{{scope.row.newOwner|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.newOwner|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="transition" label="磨合期" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.transition&&scope.row.transition!='-'" :class="scope.row.transition>=100?'green':'red'">{{scope.row.transition|valChangeSecend}}</span>
                    <span v-else>{{scope.row.transition|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.transition|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="stable" label="稳定期" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.stable&&scope.row.stable!='-'" :class="scope.row.stable>=100?'green':'red'">{{scope.row.stable|valChangeSecend}}</span>
                    <span v-else>{{scope.row.stable|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.stable|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="oldOwner" label="老业主" align="center" width="70">
                <template slot-scope="scope">
                  <template v-if="scope.row.percent==1">
                    <span v-if="scope.row.oldOwner&&scope.row.oldOwner!='-'" :class="scope.row.oldOwner>=100?'green':'red'">{{scope.row.oldOwner|valChangeSecend}}</span>
                    <span v-else>{{scope.row.oldOwner|valChangeSecend}}</span>
                  </template>
                  <span v-else>{{scope.row.oldOwner|valChange(scope.row.percent)}}</span>
                </template>
              </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import scrollFixed from '@/mixin/scroll-fixed';
import { List, PullRefresh, Toast, NavBar } from 'vant';
import $ from 'jquery';
import { getLocalStorage } from '@/utils/local-storage';
import request from '@/utils/request';
import { getUrlParam,regexNum } from '@/utils/common';


export default {
  mixins: [scrollFixed],

  data () {
    return {
      title: '',
      orgType: getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType,
      tableList1: [],
      tableList2: [],
      tableList2_1: [],
      tableList2_2: [],
      tableList3: [],
      tableList4: [],
      tableList5: [],
      tableList6: [],
      tableList7: [],
      tableList8: [],
      tableList8_1: [],
      tableList9: [],
      tableList9_1: [],
      tableList10: [],
      tableList10_1: [],
      tableList11: [],
      tableList12: [],
      unit: ''
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
    }
  },
  filters:{
    valChange(val,p){
      val = val?val:'-'
      let tVal = p&&p==2?val+'%':regexNum(val)
      return val=='-'?'-':tVal
    },
    valChangeSecend(val){
      return val&&val!='-'?val+'%':'-'
    },
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
      this.$router.go(-1)
    },
    // 初始化表格
    init () {
      $(document).scrollTop(0);
      this.title = '查看历史业绩详情'
      this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType

      // 除项目外，所有单位都是亿
      this.unit = this.orgType<=5?'亿元':'万元'

      // if (this.orgType>=5) {
      //   this.tableList1 = [
      //     {name:'目标(万元)'},
      //     {name:'实际(万元)'},
      //     {name:'完成率'}
      //   ]
      //   this.tableList5 = [
      //     {name:'目标(万元)'},
      //     {name:'实际(万元)'},
      //     {name:'完成率'}
      //   ]
      // }

      // if (this.orgType>2&&this.orgType<5) {
      //   this.tableList9 = [
      //     {name:'目标'},
      //     {name:'实际'},
      //     {name:'完成率'}
      //   ]
      // }


      // this.taskID = this.$route.query.taskID
      this.setTableData()
    },
    // 获取表格数据
    setTableData () {
      request({
          url: `/app-api/militaryOrder/history`,
          method: 'post',
          data:{
            orgId: this.$route.query.orgId,
            orgType: this.$route.query.orgType,
            year: this.changeDateByVersion(2020)
          }
      }).then(({data}) => {
          if(data.code == 0){
            // this.tableList = data.data
            const firstQuarter = data.data.firstQuarter?data.data.firstQuarter:{}    //一季度
            const secondQuarter = data.data.secondQuarter?data.data.secondQuarter:{}    //二季度
            const threeQuarter = data.data.threeQuarter?data.data.threeQuarter:{}     //三季度
            const fourQuarter = data.data.fourQuarter?data.data.fourQuarter:{}        //四季度
            const firstYear = data.data.firstYear?data.data.firstYear:{}     //上半年客户满意度、 优本增效-上半年
            const secondYear = data.data.secondYear?data.data.secondYear:{}    //下半年客户满意度、 优本增效-下半年

            // percent ：1 表示添加%并且改变颜色
            // percent ：2 表示只添加%
            this.tableList1 = [   // 签约金额
              {name:'目标('+this.unit+')', firstQuarter: firstQuarter.contractAmountTarget ,secondQuarter: secondQuarter.contractAmountTarget , threeQuarter: threeQuarter.contractAmountTarget ,fourQuarter: fourQuarter.contractAmountTarget },
              {name:'实际('+this.unit+')', firstQuarter: firstQuarter.contractAmountActual ,secondQuarter: secondQuarter.contractAmountActual , threeQuarter: threeQuarter.contractAmountActual ,fourQuarter: fourQuarter.contractAmountActual },
              {name:'完成率', firstQuarter: firstQuarter.contractAmountFinish ,secondQuarter: secondQuarter.contractAmountFinish, threeQuarter: threeQuarter.contractAmountFinish ,fourQuarter: fourQuarter.contractAmountFinish ,percent: 1 },
            ]
            this.tableList2= [     // 签约利润率
              {name:'目标', firstQuarter: firstQuarter.contractProfitRateTarget ,secondQuarter: secondQuarter.contractProfitRateTarget , threeQuarter: threeQuarter.contractProfitRateTarget ,fourQuarter: fourQuarter.contractProfitRateTarget,percent: 2},
              {name:'实际', firstQuarter: firstQuarter.contractProfitRateActual ,secondQuarter: secondQuarter.contractProfitRateActual , threeQuarter: threeQuarter.contractProfitRateActual ,fourQuarter: fourQuarter.contractProfitRateActual,percent: 2},
              {name:'完成率', firstQuarter: firstQuarter.contractProfitRateFinish ,secondQuarter: secondQuarter.contractProfitRateFinish , threeQuarter: threeQuarter.contractProfitRateFinish ,fourQuarter: fourQuarter.contractProfitRateFinish,percent: 1 },
            ]
            this.tableList2_1= [   // 签约净利润率(占用资金前)
              {name:'目标', firstQuarter: firstQuarter.beforeContractProfitRateTarget ,secondQuarter: secondQuarter.beforeContractProfitRateTarget , threeQuarter: threeQuarter.beforeContractProfitRateTarget ,fourQuarter: fourQuarter.beforeContractProfitRateTarget,percent: 2 },
              {name:'实际', firstQuarter: firstQuarter.beforeContractProfitRateActual ,secondQuarter: secondQuarter.beforeContractProfitRateActual , threeQuarter: threeQuarter.beforeContractProfitRateActual ,fourQuarter: fourQuarter.beforeContractProfitRateActual,percent: 2},
              {name:'完成率', firstQuarter: firstQuarter.beforeContractProfitRateFinish ,secondQuarter: secondQuarter.beforeContractProfitRateFinish , threeQuarter: threeQuarter.beforeContractProfitRateFinish ,fourQuarter: fourQuarter.beforeContractProfitRateFinish,percent: 1 },
            ]
            this.tableList2_2= [   // 签约净利润率(占用资金后)
              {name:'目标', firstQuarter: firstQuarter.afterContractProfitRateTarget ,secondQuarter: secondQuarter.afterContractProfitRateTarget , threeQuarter: threeQuarter.afterContractProfitRateTarget ,fourQuarter: fourQuarter.afterContractProfitRateTarget,percent: 2 },
              {name:'实际', firstQuarter: firstQuarter.afterContractProfitRateActual ,secondQuarter: secondQuarter.afterContractProfitRateActual , threeQuarter: threeQuarter.afterContractProfitRateActual ,fourQuarter: fourQuarter.afterContractProfitRateActual,percent: 2 },
              {name:'完成率', firstQuarter: firstQuarter.afterContractProfitRateFinish ,secondQuarter: secondQuarter.afterContractProfitRateFinish , threeQuarter: threeQuarter.afterContractProfitRateFinish ,fourQuarter: fourQuarter.afterContractProfitRateFinish,percent: 1 },
            ]
            this.tableList3= [   // 回款率
              {name:'目标', firstQuarter: firstQuarter.getRateTarget ,secondQuarter: secondQuarter.getRateTarget , threeQuarter: threeQuarter.getRateTarget ,fourQuarter: fourQuarter.getRateTarget,percent: 2 },
              {name:'实际', firstQuarter: firstQuarter.getRateActual ,secondQuarter: secondQuarter.getRateActual , threeQuarter: threeQuarter.getRateActual ,fourQuarter: fourQuarter.getRateActual,percent: 2 },
              {name:'完成率', firstQuarter: firstQuarter.getRateFinish ,secondQuarter: secondQuarter.getRateFinish , threeQuarter: threeQuarter.getRateFinish ,fourQuarter: fourQuarter.getRateFinish,percent: 1 }
            ]
            this.tableList4= [   // 去化率
              {name:'目标', firstQuarter: firstQuarter.soldRateTarget ,secondQuarter: secondQuarter.soldRateTarget , threeQuarter: threeQuarter.soldRateTarget ,fourQuarter: fourQuarter.soldRateTarget,percent: 2 },
              {name:'实际', firstQuarter: firstQuarter.soldRateActual ,secondQuarter: secondQuarter.soldRateActual , threeQuarter: threeQuarter.soldRateActual ,fourQuarter: fourQuarter.soldRateActual,percent: 2 },
              {name:'完成率', firstQuarter: firstQuarter.soldRateFinish ,secondQuarter: secondQuarter.soldRateFinish , threeQuarter: threeQuarter.soldRateFinish ,fourQuarter: fourQuarter.soldRateFinish,percent: 1 }
            ]
            this.tableList5= [   // 交楼金额
              {name:'目标('+this.unit+')', firstQuarter: firstQuarter.handoverAmountTarget ,secondQuarter: secondQuarter.handoverAmountTarget , threeQuarter: threeQuarter.handoverAmountTarget ,fourQuarter: fourQuarter.handoverAmountTarget },
              {name:'实际('+this.unit+')', firstQuarter: firstQuarter.handoverAmountActual ,secondQuarter: secondQuarter.handoverAmountActual , threeQuarter: threeQuarter.handoverAmountActual ,fourQuarter: fourQuarter.handoverAmountActual },
              {name:'完成率', firstQuarter: firstQuarter.handoverAmountFinish ,secondQuarter: secondQuarter.handoverAmountFinish , threeQuarter: threeQuarter.handoverAmountFinish ,fourQuarter: fourQuarter.handoverAmountFinish,percent: 1 },
            ]
            this.tableList6= [   // 人力费用
              {name:'目标(万元)', firstQuarter: firstQuarter.manpowerCostTarget ,secondQuarter: secondQuarter.manpowerCostTarget , threeQuarter: threeQuarter.manpowerCostTarget ,fourQuarter: fourQuarter.manpowerCostTarget },
              {name:'实际(万元)', firstQuarter: firstQuarter.manpowerCostActual ,secondQuarter: secondQuarter.manpowerCostActual , threeQuarter: threeQuarter.manpowerCostActual ,fourQuarter: fourQuarter.manpowerCostActual },
              {name:'完成率', firstQuarter: firstQuarter.manpowerCostFinish ,secondQuarter: secondQuarter.manpowerCostFinish , threeQuarter: threeQuarter.manpowerCostFinish ,fourQuarter: fourQuarter.manpowerCostFinish,percent: 1 },
            ]
            this.tableList7= [   // 行政费用
              {name:'目标(万元)', firstQuarter: firstQuarter.administrativeCostTarget ,secondQuarter: secondQuarter.administrativeCostTarget , threeQuarter: threeQuarter.administrativeCostTarget ,fourQuarter: fourQuarter.administrativeCostTarget },
              {name:'实际(万元)', firstQuarter: firstQuarter.administrativeCostActual ,secondQuarter: secondQuarter.administrativeCostActual , threeQuarter: threeQuarter.administrativeCostActual ,fourQuarter: fourQuarter.administrativeCostActual },
              {name:'完成率', firstQuarter: firstQuarter.administrativeCostFinish ,secondQuarter: secondQuarter.administrativeCostFinish , threeQuarter: threeQuarter.administrativeCostFinish ,fourQuarter: fourQuarter.administrativeCostFinish,percent: 1 },
            ]
            this.tableList8= [   // 优本增效
              {name:'目标(万元)',firstYear: firstYear.benefitsTarget, secondYear: secondYear.benefitsTarget },
              {name:'实际(万元)',firstYear: firstYear.benefitsActual , secondYear: secondYear.benefitsActual },
              {name:'完成率',firstYear: firstYear.benefitsFinish , secondYear: secondYear.benefitsFinish,percent: 1 },
            ]
            this.tableList8_1= [   // 融资金额
              {name:'目标(万元)', firstQuarter: firstQuarter.financingAmountTarget ,secondQuarter: secondQuarter.financingAmountTarget , threeQuarter: threeQuarter.financingAmountTarget ,fourQuarter: fourQuarter.financingAmountTarget },
              {name:'实际(万元)', firstQuarter: firstQuarter.financingAmountActual ,secondQuarter: secondQuarter.financingAmountActual , threeQuarter: threeQuarter.financingAmountActual ,fourQuarter: fourQuarter.financingAmountActual},
              {name:'完成率', firstQuarter: firstQuarter.financingAmountFinish ,secondQuarter: secondQuarter.financingAmountFinish , threeQuarter: threeQuarter.financingAmountFinish ,fourQuarter: fourQuarter.financingAmountFinish,percent: 1},
            ]
            this.tableList9= [   // 营销费用(一级)
              {name:'目标(万元)',firstQuarter: firstQuarter.marketingCostTarget ,secondQuarter: secondQuarter.marketingCostTarget , threeQuarter: threeQuarter.marketingCostTarget ,fourQuarter: fourQuarter.marketingCostTarget },
              {name:'实际(万元)',firstQuarter: firstQuarter.marketingCostActual ,secondQuarter: secondQuarter.marketingCostActual , threeQuarter: threeQuarter.marketingCostActual ,fourQuarter: fourQuarter.marketingCostActual },
              {name:'完成率',firstQuarter: firstQuarter.marketingCostFinish ,secondQuarter: secondQuarter.marketingCostFinish , threeQuarter: threeQuarter.marketingCostFinish ,fourQuarter: fourQuarter.marketingCostFinish,percent: 1},
            ]
            this.tableList9_1= [   // 营销费用(二级及以下)
              {name:'目标(万元)', firstQuarter: firstQuarter.marketingCostTarget ,secondQuarter: secondQuarter.marketingCostTarget , threeQuarter: threeQuarter.marketingCostTarget ,fourQuarter: fourQuarter.marketingCostTarget },
              {name:'实际(万元)', firstQuarter: firstQuarter.marketingCostActual ,secondQuarter: secondQuarter.marketingCostActual , threeQuarter: threeQuarter.marketingCostActual ,fourQuarter: fourQuarter.marketingCostActual },
              {name:'完成率', firstQuarter: firstQuarter.marketingCostFinish ,secondQuarter: secondQuarter.marketingCostFinish , threeQuarter: threeQuarter.marketingCostFinish ,fourQuarter: fourQuarter.marketingCostFinish,percent: 1 }
            ]
            this.tableList10= [   // 营销费率 (一级)
              {name:'目标',firstQuarter: firstQuarter.marketingRateTarget ,secondQuarter: secondQuarter.marketingRateTarget , threeQuarter: threeQuarter.marketingRateTarget ,fourQuarter: fourQuarter.marketingRateTarget,percent: 2 },
              {name:'实际',firstQuarter: firstQuarter.marketingRateActual ,secondQuarter: secondQuarter.marketingRateActual , threeQuarter: threeQuarter.marketingRateActual ,fourQuarter: fourQuarter.marketingRateActual,percent: 2 },
              {name:'完成率',firstQuarter: firstQuarter.marketingRateFinish ,secondQuarter: secondQuarter.marketingRateFinish , threeQuarter: threeQuarter.marketingRateFinish ,fourQuarter: fourQuarter.marketingRateFinish,percent: 1},
            ]
            this.tableList10_1= [   // 营销费率 (二级及以下)
              {name:'目标', firstQuarter: firstQuarter.marketingRateTarget ,secondQuarter: secondQuarter.marketingRateTarget , threeQuarter: threeQuarter.marketingRateTarget ,fourQuarter: fourQuarter.marketingRateTarget,percent: 2 },
              {name:'实际', firstQuarter: firstQuarter.marketingRateActual ,secondQuarter: secondQuarter.marketingRateActual , threeQuarter: threeQuarter.marketingRateActual ,fourQuarter: fourQuarter.marketingRateActual,percent: 2 },
              {name:'完成率', firstQuarter: firstQuarter.marketingRateFinish ,secondQuarter: secondQuarter.marketingRateFinish , threeQuarter: threeQuarter.marketingRateFinish ,fourQuarter: fourQuarter.marketingRateFinish,percent: 1 },
            ]
            // 为一级集团时，只显示实际数，目标与完成率显示为-
            if (this.orgType>2) {
              this.tableList11= [   // 上半年客户满意度
                {name:'目标', newOwner: firstYear.newOwnerSatisfactionTarget ,transition: firstYear.transitionSatisfactionTarget , stable: firstYear.stableSatisfactionTarget ,oldOwner: firstYear.oldOwnerSatisfactionTarget},
                {name:'实际',  newOwner: firstYear.newOwnerSatisfactionActual ,transition: firstYear.transitionSatisfactionActual , stable: firstYear.stableSatisfactionActual ,oldOwner: firstYear.oldOwnerSatisfactionActual},
                {name:'完成率',  newOwner: firstYear.newOwnerSatisfactionFinish ,transition: firstYear.transitionSatisfactionFinish , stable: firstYear.stableSatisfactionFinish ,oldOwner: firstYear.oldOwnerSatisfactionFinish,percent: 1},
              ]
              this.tableList12= [   // 下半年客户满意度
                {name:'目标', newOwner: secondYear.newOwnerSatisfactionTarget ,transition: secondYear.transitionSatisfactionTarget , stable: secondYear.stableSatisfactionTarget ,oldOwner: secondYear.oldOwnerSatisfactionTarget},
                {name:'实际',  newOwner: secondYear.newOwnerSatisfactionActual ,transition: secondYear.transitionSatisfactionActual , stable: secondYear.stableSatisfactionActual ,oldOwner: secondYear.oldOwnerSatisfactionActual},
                {name:'完成率',  newOwner: secondYear.newOwnerSatisfactionFinish ,transition: secondYear.transitionSatisfactionFinish , stable: secondYear.stableSatisfactionFinish ,oldOwner: secondYear.oldOwnerSatisfactionFinish,percent: 1},
              ]
            }else{
              this.tableList11= [   // 上半年客户满意度
                {name:'目标', newOwner: '-' ,transition:'-'  , stable: '-'  ,oldOwner: '-' },
                {name:'实际',  newOwner: firstYear.newOwnerSatisfactionActual ,transition: firstYear.transitionSatisfactionActual , stable: firstYear.stableSatisfactionActual ,oldOwner: firstYear.oldOwnerSatisfactionActual},
                {name:'完成率',  newOwner: '-' ,transition: '-'  , stable: '-'  ,oldOwner: '-' },
              ]
              this.tableList12= [   // 下半年客户满意度
                {name:'目标', newOwner: '-' ,transition:'-'  , stable: '-'  ,oldOwner: '-' },
                {name:'实际',  newOwner: secondYear.newOwnerSatisfactionActual ,transition: secondYear.transitionSatisfactionActual , stable: secondYear.stableSatisfactionActual ,oldOwner: secondYear.oldOwnerSatisfactionActual},
                {name:'完成率',  newOwner: '-' ,transition: '-'  , stable: '-'  ,oldOwner: '-' },
              ]
            }
            
          }
      }).catch((e) => {
          console.log('history-err', e);
      });
    },
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
.borderTitle {
  font-size: 14px;
  color: #333333;
  border-left: 2px solid #209B5C;
  padding-left: 6px;
  margin: 0;
  margin-bottom: 20px;
}
.tableBox{
  margin-bottom: 30px;
}
.green{
  color: #266545;
}
.red{
  color: red;
}
</style>
