<template>
	<div class="report-index pb-20">
        <van-sticky>
            <div class="huojv-menu mb-15">
                <div class="huojv-menuBox">
                    <p class="huojv-menuBox-item active">还款提醒</p>
                </div>
                <div class="huojv-subMenuBox">
                    <span :class="dateType==1?'huojv-subMenuBox-item active':'huojv-subMenuBox-item'" v-eventlisten="{isChangePage:false,pageEvent:'点击还款提醒本月'}" @click="changeTab(1)">本月</span>
                    <span :class="dateType==2?'huojv-subMenuBox-item active':'huojv-subMenuBox-item'" v-eventlisten="{isChangePage:false,pageEvent:'点击还款提醒下月'}" @click="changeTab(2)">下月</span>
                    <span :class="dateType==3?'huojv-subMenuBox-item active':'huojv-subMenuBox-item'" v-eventlisten="{isChangePage:false,pageEvent:'点击还款提醒本季度'}" @click="changeTab(3)">本季度</span>
                    <span :class="dateType==4?'huojv-subMenuBox-item active':'huojv-subMenuBox-item'" v-eventlisten="{isChangePage:false,pageEvent:'点击还款提醒未来三个月'}" @click="changeTab(4)">未来三个月</span>
                    <span :class="dateType==5?'huojv-subMenuBox-item active':'huojv-subMenuBox-item'" v-eventlisten="{isChangePage:false,pageEvent:'点击还款提醒下季度'}" @click="changeTab(5)">下季度</span>
                </div>
            </div>
        </van-sticky>
		<van-pull-refresh v-model="isLoading" success-text="刷新成功" loading-text="正在刷新..." @refresh="reloadWindow()">
        <div class="main-content">
            <div class="data-content-panel pt-15">
                <van-list
                        v-model="loading"
                        :finished="finished"
                        finished-text="没有更多了"
                        @load="onLoad"
                >
                    <el-table stripe
                                class="huo-list-table main-theme-table huojv-data-list work-list" size="mini"
                                highlight-current-row
                                :data="tableList">
                        <el-table-column prop="repaymentmatter" label="还款事项" align="center" width="160">
                        </el-table-column>
                        <el-table-column prop="repaymentfunds" label="金额(万元)" align="center" width="80">
                        </el-table-column>
                        <el-table-column prop="repaymentdate" label="还款时间" align="center" width="100">
                        </el-table-column>
                        <el-table-column prop="reminder" label="被提醒人" lign="center" width="70"></el-table-column>
                    </el-table>
                </van-list>
            </div>
        </div>

		</van-pull-refresh>
	</div>
</template>

<script>
    import {mapState} from 'vuex'
    import scrollFixed from '@/mixin/scroll-fixed';
    import {
        List,
        PullRefresh,
        Toast,
        DropdownMenu,
        DropdownItem,
        DatetimePicker,
        Popup,
        ActionSheet,
        Sticky
    } from 'vant';
    import {getLocalStorage} from '@/utils/local-storage';
    import request from '@/utils/request';
    import echarts from 'echarts'
    import $ from 'jquery'
    import {handleNum2String, handleDate, getUrlParam} from '@/utils/common'


    export default {
        mixins: [scrollFixed],
        data() {
            return {
              type: 1, // 1 还款提醒
              dateType: 1, // 1本月 2下月 3本季度 4未来三个月 5下季度
              size: 20,
              current: 1,
              tableList: [],
              loading: false,
              finished: false,

              isLoad: false,  //  手动控制表格上拉加载状体  防止多次触发请求接口
              isLoading: false,
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
                this.onRefresh();
            }
        },
        mounted() {
            this.init();

            this.$nextTick(() => {
                $(".list-title1").scroll(function () {
                    let scrollLeft = $(this).scrollLeft();
                    $('.list-data1 .el-table__body-wrapper').scrollLeft(scrollLeft);
                })
                $(".el-table__body-wrapper").scroll(function () {
                    let scrollLeft = $(this).scrollLeft();
                    $('.list-title1').scrollLeft(scrollLeft);
                })

                $('.work-list .el-table__header-wrapper').scroll(function () {
                    let scrollLeft = $(this).scrollLeft();
                    $(this).next().scrollLeft(scrollLeft);
                });
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

            },
            onLoad() {
                // 如果当前处于加载状态
                // console.log('aaa');

                // if (!this.isLoad) {
                //     console.log('bbb');
                    //
                // }
                if (this.isLoad) {
                    return;
                }
                this.isLoad = true;
                this.getWarningList();

            },
            onRefresh() {
                this.current = 1;
                this.tableList = []
                this.getWarningList();
            },
            getWarningList(isFresh) {
                // alert('load   getWarningList')
                request({
                    url: `/app-api/fundStructure/warningList?current=${this.current}&size=${this.size}&orgId=${this.orgId}&dateType=${this.dateType}&type=${this.type}`,
                    method: 'get',
                }).then(({data}) => {
                    this.isLoad = false;
                    if (data.code === 0) {
                        this.tableList = this.tableList.concat(data.data.list);
                        this.loading = false;
                        this.isLoad = false;

                        if (null == data.data.list || data.data.list.length < this.size || this.tableList.length >= data.data.total) {
                            this.finished = true;
                        } else {
                            if (this.current > 1) {
                                let scrollTop = $(document).scrollTop();
                                $(document).scrollTop(scrollTop - 300);
                            }

                            this.current += 1;
                            this.finished = false;
                        }
                    } else {
                        this.tableList = [];
                        this.current = 1;
                        this.loading = false;
                        this.isLoad = false;
                        this.finished = true;
                    }
                }).catch((err) => {
                    this.tableList = [];
                    this.current = 1;
                    this.loading = false;
                    this.isLoad = false;
                    this.finished = false;
                });
            },
            // 切换
            changeTab(type) {
              this.dateType = type
              this.current = 1
              this.tableList = [];
              this.getWarningList()
            },
            // goPage(path, param) {
            //     this.$router.push({path, query: {param, token: getUrlParam('token')}});
            // },
        },

        components: {
            [List.name]: List,
            [PullRefresh.name]: PullRefresh,
            [DropdownMenu.name]: DropdownMenu,
            [DropdownItem.name]: DropdownItem,
            [DatetimePicker.name]: DatetimePicker,
            [Popup.name]: Popup,
            [ActionSheet.name]: ActionSheet,
            [Sticky.name]: Sticky,
            Toast
        }
    };
</script>


<style lang="scss" scoped>
</style>
