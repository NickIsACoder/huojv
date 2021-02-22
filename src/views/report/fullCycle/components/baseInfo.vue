<template>
	<div class="detail-panel height100 white-bg">
		<div class="main-content">
			<div class="data-content-panel pt-15">
                <div class="data-title-box data-title-line clearfix">
					<span class="title">非面积类</span>
				</div>
				<el-table stripe
				          class="huo-list-table main-theme-table huojv-data-list hide-header" size="mini" highlight-current-row
				          :data="tableList1">
					<el-table-column prop="name" label="" align="center">
                        <template slot-scope="scope" v-if="scope.row.name">
                            <span :class="scope.row.hasOwnProperty('notOnLine')?'gray':'green'">{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
					<el-table-column prop="value" label="" align="center">
                        <template slot-scope="scope" v-if="scope.row.name">
                            <span v-if="!scope.row.hasOwnProperty('notOnLine')">{{tableData[scope.row.value]| changeVal(scope.row.unit)}}</span>
                            <span v-else class="gray">后续上线</span>
                        </template>
                    </el-table-column>
				</el-table>
			</div>
            <div class="data-content-panel pt-15">
                <div class="data-title-box data-title-line clearfix">
					<span class="title">面积类</span>
				</div>
				<el-table stripe
				          class="huo-list-table main-theme-table huojv-data-list hide-header" size="mini" highlight-current-row
				          :data="tableList2">
					<el-table-column prop="name" label="" align="center">
                        <template slot-scope="scope" v-if="scope.row.name">
                            <span :class="scope.row.hasOwnProperty('notOnLine')?'gray':'green'">{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
					<el-table-column prop="value" label="" align="center">
                        <template slot-scope="scope" v-if="scope.row.name">
                            <span v-if="!scope.row.hasOwnProperty('notOnLine')">{{tableData[scope.row.value]| changeVal(scope.row.unit)}}</span>
                            <span v-else class="gray">后续上线</span>
                        </template>
                    </el-table-column>
				</el-table>
			</div>
            <div class="data-content-panel pt-15">
                <div class="data-title-box data-title-line clearfix">
					<span class="title">数据来源：项目证照</span>
				</div>
                <div class="flow-path-panel">
                    <ul class="flow-path-process flexBox">
                        <li :class="['checked flowItem',item.arrow ]" v-for="item in flowList" :key="item.name" @click="goDetail(item.name)" :style="{order: item.order}">
                            <div class="shape">
                                <van-icon class="icon" name="success"/>
                            </div>
                            <div class="text">{{item.name}}</div>
                        </li>
                    </ul>
                </div>
			</div>
		</div>
	</div>
</template>

<script>
    import scrollFixed from '@/mixin/scroll-fixed';
    import {Icon, List, PullRefresh, NavBar} from 'vant';
    import $ from 'jquery';
    import request from '@/utils/request';
    import {getUrlParam} from '@/utils/common'

    export default {
        mixins: [scrollFixed],

        data() {
            return {
                isLoading: false,//下拉刷新,从第一页开始
                orgId: '',
                orgType: 2,
                pdfUrl:"",
                
                tableData: {},
                tableList1: [
                    {},
                    {name: '项目名称', value: 'orgName', unit: ''},
                    {name: '项目位置', value: 'itemLOC', unit: ''},
                    {name: '土地获取时间', value: 'landAQDate', unit: ''},
                    {name: '土地获取方式', value: 'landAccess', unit: ''},
                    {name: '奥园所占权益', value: 'ayrightRate', unit: '%'},
                    {name: '使用年限', value: 'landUseLimt', unit: '年'},
                    {name: '土地成本', value: 'landCost', unit: '万元'},
                    {name: '楼面地价', value: 'accoValue', unit: '元/㎡'},
                    {name: '控高', value: 'ctrlHeight', unit: 'm'},
                    {name: '建筑密度', value: 'bldDensity', unit: '%'},
                    {name: '绿地率', value: 'greenSpaceRate', unit: '%'},
                    {name: '用地性质', value: 'landUseNat', unit: ''},
                ], // 非面积类
                tableList2: [
                    {},
                    {name: '建设用地面积', value: 'constArea', unit: '㎡'},
                    {name: '计容建筑面积', value: 'capBldArea', unit: '㎡'},
                    {name: '容积率', value: 'capRate', unit: ''},
                    {name: '可售建筑面积', value: 'saleBldArea', unit: '㎡'},
                    {name: '配套面积', value: 'matchingArea', unit: '㎡'},
                    {name: '地下建筑面积', value: 'undergroudBldArea', unit: '㎡'},
                    {name: '建筑面积', value: 'bldArea', unit: '㎡'},
                    {name: '自持建筑面积', value: 'selfBldArea', notOnLine: true},
                    {name: '住宅建筑面积', value: 'houseBldArea', notOnLine: true},
                    {name: '商业建筑面积', value: 'businessBldArea', notOnLine: true},
                    {name: '商住比', value: 'busiHouseRatio', notOnLine: true},
                ], // 面积类
                flowList:[
                    {name: '拿地', order: 0, arrow: ''},
                    {name: '方案批复', order: 1, arrow: ''},
                    {name: '施工证', order: 2, arrow: 'down'},
                    {name: '预售证', order: 6, arrow: 'left'},
                    {name: '竣工备案', order: 5, arrow: 'left'},
                    {name: '交付', order: 4, arrow: ''}
                ]
            };
        },
        mounted() {
            this.init();
            this.$nextTick(() => {
                $('.el-table__header-wrapper').scroll(function () {
                    let scrollLeft = $(this).scrollLeft();
                    $(this).next().scrollLeft(scrollLeft);
                });
            })
        },
        filters:{
            changeVal(val,unit){
                if (val) {
                    return val+unit
                }
                return '-'
            }
        },
        watch: {
			'$store.state.orgId': function(newVal, oldVal) {
				this.init();
			}
		},
        methods: {
            init() {
                this.orgId = getUrlParam('chooseOrgId') || getUrlParam('orgId');
                this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType');

                this.getTableData();
            },

            // 获取资源结构明细表格数据
            getTableData() {
                let _url = `/app-api/allPeriod/fullCycleBaseInfo`;

                request({
                    url: _url,
                    method: 'get',
	                params:{
                        orgId:this.orgId
	                }
                }).then(({data}) => {
                    if (data.code === 0) {
                        this.tableData = data.data;
                    }
                }).catch((e) => {
                    console.log('getBoardData-err', e);
                });
            },
            goDetail(val){
                sessionStorage.setItem('tab', 1)
                this.$router.push({
                    path: '/fullCycle/flowDetail',
                    query: {
                        orgId: this.orgId,
                        orgType: this.orgType,
                        name: val,
                        token: getUrlParam('token')
                    }
                });
            }
        },

        components: {
            [Icon.name]: Icon,
            [NavBar.name]: NavBar,
            [List.name]: List,
            [PullRefresh.name]: PullRefresh,
        }
    };
</script>


<style lang="scss" scoped>
.flexBox{
    display: flex;
    flex-wrap: wrap;
    // flex-direction: row-reverse;
}

.gray{
    color: #999999;
}
.green{
    color: #006E38;
}
</style>
