<template>
	<div class="report-index has-tabs pb-20">
    <template v-if="!authList.includes('app-zjrz-lhb1')">
      <ul class="huojv-tabs fixed-tabs two-cols">
        <li @click="checkTab(0)" v-eventlisten="{isChangePage:false,pageEvent:'点击资金贡献'}"
            :class="[actTab == 0 ? 'active' : '']"><label>资金贡献</label></li>
        <li @click="checkTab(1)" v-eventlisten="{isChangePage:false,pageEvent:'点击资金盘活率'}"
            :class="[actTab == 1 ? 'active' : '']"><label>资金盘活率</label></li>
      </ul>
      <van-pull-refresh v-model="isLoading" success-text="刷新成功" loading-text="正在刷新..." @refresh="reloadWindow()">
        <div v-show="actTab == 0">
          <div class="main-content mt-15">
            <div class="data-content-panel">
              <div class="data-title-box mt-5">
                <img class="title-ico" src="../../../assets/images/ic_topfive@2x.png">
                <span class="title">前五龙虎榜</span>
              </div>

              <el-table stripe
                        class="huo-list-table main-theme-table"
                        size="mini" highlight-current-row
                        ref="dataTable1"
                        :data="frontList">
                <el-table-column label="排名" align="center" width="40">
                  <template slot-scope="scope">
                    <label :class="{'no-1-ico':scope.row.index === 1,'no-2-ico':scope.row.index === 2,'no-3-ico':scope.row.index === 3}"
                          v-text="scope.row.index > 3 ? scope.row.index : ''"></label>
                  </template>
                </el-table-column>
                <el-table-column prop="orgName" label="项目"></el-table-column>
                <el-table-column prop="fundContribution" label="贡献金额(万元)" align="center">
                    <template slot-scope="scope">
                        {{scope.row.fundContribution?scope.row.fundContribution.amountTenThousand:'-'}}
                    </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="main-content mt-15">
            <div class="data-content-panel">
              <!-- 标题 -->
              <div class="data-title-box mt-5">
                <img class="title-ico" src="../../../assets/images/ic_laterfive@2x.png">
                <span class="title">后五龙虎榜</span>
              </div>

              <el-table stripe
                        class="huo-list-table main-theme-table"
                        size="mini" highlight-current-row
                        ref="dataTable2"
                        :data="backList">
                <el-table-column label="排名" align="center" width="40">
                  <template slot-scope="scope">
                    <label class="last5-ico" v-text="scope.row.index"></label>
                  </template>
                </el-table-column>
                <el-table-column prop="orgName" label="项目"></el-table-column>
                <el-table-column prop="fundContribution" label="贡献金额(万元)" align="center">
                    <template slot-scope="scope">
                        {{scope.row.fundContribution?scope.row.fundContribution.amountTenThousand:'-'}}
                    </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div v-show="actTab == 1">
          <div class="main-content mt-15">
            <div class="data-content-panel">
              <!-- 标题 -->
              <div class="data-title-box mt-5">
                <img class="title-ico" src="../../../assets/images/ic_topfive@2x.png">
                <span class="title">前五龙虎榜</span>
              </div>

              <el-table stripe
                        class="huo-list-table main-theme-table"
                        size="mini" highlight-current-row
                        ref="dataTable3"
                        :data="frontList">
                <el-table-column label="排名" align="center" width="40">
                  <template slot-scope="scope">
                    <label :class="{'no-1-ico':scope.row.index === 1,'no-2-ico':scope.row.index === 2,'no-3-ico':scope.row.index === 3}"
                          v-text="scope.row.index > 3 ? scope.row.index : ''"></label>
                  </template>
                </el-table-column>
                <el-table-column prop="orgName" label="项目"></el-table-column>
                <el-table-column prop="revitalizationRate" label="资金盘活率" align="center">
                    <template slot-scope="scope">
                        {{scope.row.revitalizationRate?scope.row.revitalizationRate.percentage+'%':'-'}}
                    </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="main-content mt-15">
            <div class="data-content-panel">
              <!-- 标题 -->
              <div class="data-title-box mt-5">
                <img class="title-ico" src="../../../assets/images/ic_laterfive@2x.png">
                <span class="title">后五龙虎榜</span>
              </div>

              <el-table stripe
                        class="huo-list-table main-theme-table"
                        size="mini" highlight-current-row
                        ref="dataTable4"
                        :data="backList">
                <el-table-column label="排名" align="center" width="40">
                  <template slot-scope="scope">
                    <label class="last5-ico" v-text="scope.row.index"></label>
                  </template>
                </el-table-column>
                <el-table-column prop="orgName" label="项目"></el-table-column>
                <el-table-column prop="revitalizationRate" label="资金盘活率" align="center">
                    <template slot-scope="scope">
                        {{scope.row.revitalizationRate?scope.row.revitalizationRate.percentage+'%':'-'}}
                    </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </van-pull-refresh>
    </template>
    <div v-else class="noauth">—— 陆续上线 ——</div>
	</div>
</template>

<script>
    import {mapState} from 'vuex'
    import scrollFixed from '@/mixin/scroll-fixed';
    import {List, PullRefresh, Toast, Icon} from 'vant';
    import {getLocalStorage} from '@/utils/local-storage';
    import $ from 'jquery';
    import {openLoading, closeLoading, getUrlParam} from '@/utils/common';
    import request from '@/utils/request';
    import fileImg from '@/assets/images/file.png';


    export default {
        mixins: [scrollFixed],

        data() {
            return {
                // orgId: getLocalStorage(['orgId']).orgId,
                size: 5,
                current: 1,
                actTab: 0,  // 0  资金贡献 ， 1  资金盘活率
								frontList: [],
								unit: '',
                backList: [],
                isLoading: false,
                fileImg: fileImg
            };
        },
        computed: {
            ...mapState({
                orgId: state => state.orgId || getLocalStorage(['orgId']).orgId,
                authList: state => state.authList
            })
        },
        watch: {
            '$store.state.orgId': function (newVal, oldVal) {
                this.init();
            }
        },
        mounted() {
            this.init();
            console.log(this.authList)
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
        },

        methods: {
            reloadWindow() {
                setTimeout(() => {
                    window.location.reload();
                    this.isLoading = false;
                }, 500)
            },
            init() {
              // this.unit = this.orgType <= 4 ? '(亿元)':'(万元)';
              this.setFrontTableData();
							this.setBackTableData();
							
							this.frontList = []
							this.backList = []
            },
            // 前5
            setFrontTableData() {
								if (!this.orgId) return;
								let _url = ''
								if (this.actTab == 0) {
									_url = '/app-api/fund/dragonTigerContribution'
								}else if(this.actTab == 1){
									_url = '/app-api/fund/dragonTigerActivationRate'
								}

                request({
                    url: _url,
                    method: 'post',
                    data: {
											orgId: this.orgId,
											current: this.current,
											size: this.size,
											orderType: 'DESC',
										}
                }).then(({data}) => {
                    if(data.code === 0){
                        this.frontList = data.data;
                        this.frontList.forEach((item, index) => {
                            item.index = index + 1;
                        })
                    }
                }).catch((e) => {
                    console.log('getBoardData-err', e);
                });
            },
            // 后5
            setBackTableData(type) {
								if (!this.orgId) return;
								
								let _url = ''
								if (this.actTab == 0) {
									_url = '/app-api/fund/dragonTigerContribution'
								}else if(this.actTab == 1){
									_url = '/app-api/fund/dragonTigerActivationRate'
								}

                request({
                    url: _url,
                    method: 'post',
                    data: {
											orgId: this.orgId,
											current: this.current,
											size: this.size,
											orderType: 'ASC',
										}
                }).then(({data}) => {
                    if(data.code === 0){
                        this.backList = data.data;
                        this.backList.forEach((item, index) => {
                            item.index = index + 1;
                        })
                    }
                }).catch((e) => {
                    console.log('getBoardData-err', e);
                });
            },
            checkTab(actTab) {
                this.actTab = actTab;
                this.init();
            },
        },

        components: {
            [List.name]: List,
            [PullRefresh.name]: PullRefresh,
            [Icon.name]: Icon,
            Toast
        }
    };
</script>


<style lang="scss" scoped>
.noauth {
  color: rgb(153, 153, 153);
  line-height: 100px;
  font-size: 14px;
  text-align: center;
}
</style>
