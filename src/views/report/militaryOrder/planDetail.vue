<template>
  <div class="report-index">
    <van-nav-bar class="ptop"
      style="position: fixed; top: 0; width: 100%"
      title="销售计划表"
      left-arrow
      @click-left="onClickLeft"
      v-eventlisten="{ isChangePage: true, pageEvent: '点击返回按钮' }"
    />
    <div class="main-content padding-nav">
			<p class="unit">单位：{{ orgType >= 5 ? '万元' : '亿元' }}</p>
			<el-table
				class="huo-list-table"
				:data="tableData"
				stripe
				size="mini"
				style="width: 100%"
				row-key="id"
				default-expand-all
				:tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
				:height="hei"
			>
				<el-table-column prop="label" label="" width="270"></el-table-column>
				<el-table-column prop="" label="合计金额">
					<template slot-scope="scope">
						<span v-if="scope.row.color" :class="judge(propData['合计'][scope.row.prop], scope.row.color)">
                {{propData['合计'][scope.row.prop]|changeVal}}
            </span>
            <span v-else-if="scope.row.setColor" :class="judge(propData['合计'][scope.row.prop])">
                {{propData['合计'][scope.row.prop]|changeVal}}
            </span>
            <span v-else>{{propData['合计'][scope.row.prop]|changeVal}}</span>
        	</template>
				</el-table-column>
				<el-table-column prop="" label="别墅" align="center">
					<template slot-scope="scope">
            <span v-if="scope.row.empty">-</span>
						<span v-else-if="scope.row.color" :class="judge(propData['别墅'][scope.row.prop], scope.row.color)">
                {{propData['别墅'][scope.row.prop]|changeVal}}
            </span>
            <span v-else-if="scope.row.setColor" :class="judge(propData['别墅'][scope.row.prop])">
                {{propData['别墅'][scope.row.prop]|changeVal}}
            </span>
            <span v-else>{{propData['别墅'][scope.row.prop]|changeVal}}</span>
        	</template>
				</el-table-column>
				<el-table-column prop="" label="住宅" align="center">
					<template slot-scope="scope">
            <span v-if="scope.row.empty">-</span>
						<span v-else-if="scope.row.color" :class="judge(propData['住宅'][scope.row.prop], scope.row.color)">
                {{propData['住宅'][scope.row.prop]|changeVal}}
            </span>
            <span v-else-if="scope.row.setColor" :class="judge(propData['住宅'][scope.row.prop])">
                {{propData['住宅'][scope.row.prop]|changeVal}}
            </span>
            <span v-else>{{propData['住宅'][scope.row.prop]|changeVal}}</span>
        	</template>
				</el-table-column>
				<el-table-column prop="" label="商业" align="center">
					<template slot-scope="scope">
            <span v-if="scope.row.empty">-</span>
						<span v-else-if="scope.row.color" :class="judge(propData['商业'][scope.row.prop], scope.row.color)">
                {{propData['商业'][scope.row.prop]|changeVal}}
            </span>
            <span v-else-if="scope.row.setColor" :class="judge(propData['商业'][scope.row.prop])">
                {{propData['商业'][scope.row.prop]|changeVal}}
            </span>
            <span v-else>{{propData['商业'][scope.row.prop]|changeVal}}</span>
        	</template>
				</el-table-column>
				<el-table-column prop="" label="公寓" align="center">
					<template slot-scope="scope">
            <span v-if="scope.row.empty">-</span>
						<span v-else-if="scope.row.color" :class="judge(propData['公寓'][scope.row.prop], scope.row.color)">
                {{propData['公寓'][scope.row.prop]|changeVal}}
            </span>
            <span v-else-if="scope.row.setColor" :class="judge(propData['公寓'][scope.row.prop])">
                {{propData['公寓'][scope.row.prop]|changeVal}}
            </span>
            <span v-else>{{propData['公寓'][scope.row.prop]|changeVal}}</span>
        	</template>
				</el-table-column>
				<el-table-column prop="" label="车位" align="center">
					<template slot-scope="scope">
            <span v-if="scope.row.empty">-</span>
						<span v-else-if="scope.row.color" :class="judge(propData['车位'][scope.row.prop], scope.row.color)">
                {{propData['车位'][scope.row.prop]|changeVal}}
            </span>
            <span v-else-if="scope.row.setColor" :class="judge(propData['车位'][scope.row.prop])">
                {{propData['车位'][scope.row.prop]|changeVal}}
            </span>
            <span v-else>{{propData['车位'][scope.row.prop]|changeVal}}</span>
        	</template>
				</el-table-column>
			</el-table>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import scrollFixed from '@/mixin/scroll-fixed';
import { List, PullRefresh, Toast, NavBar } from 'vant';
import $ from 'jquery';
import { getLocalStorage } from '@/utils/local-storage';
import request from '@/utils/request';
import { getUrlParam,regexNum } from '@/utils/common';

export default {
  mixins: [scrollFixed],

  data() {
    const treeData = [
        {
        id: 1,
        label: '货量',
        prop: 'availableAmount',
        children: [
          {
            label: '年初流入库存',
            prop: 'inflowAmount',
            id: 2,
          },
          {
            label: '本年新货',
            prop: 'yearPresalesAmount',
            id: 3,
            children: [
              {
                label: '其中：累计已供货',
                prop: 'yearPresalesAmountActual',
                id: 4,
              },
              {
                label: '其中：计划新供货',
                prop: 'yearPresalesAmountPlan',
                id: 5,
              },
            ],
          },
        ],
      },
      {
        label: '销售目标',
        prop: 'yearContractGoal',
        id: 6,
        children: [
          {
            label: '自营销售目标',
            prop: 'noYearContractGoal',
            id: 7,
            children: [
              {
                label: '截止目前已售',
                prop: 'noYearContractAmount',
                color: 'green',
                id: 8,
                children: [
                  {
                    label: '其中：年初流入库存销售',
                    oldLabel: '其中：本年新货销售',
                    prop: 'noYearContractAmountInflow',
                    color: 'green',
                    id: 9,
                  },
                  {
                    label: '其中：本年新货销售',
                    oldLabel: '其中：往年旧货销售',
                    prop: 'noYearContractAmountPresales',
                    color: 'green',
                    id: 10,
                  },
                ],
              },
              {
                label: '截止目前离目标总差距',
                prop: 'noYearGapAmount',
                setColor: true,
                id: 11,
                children: [
                  {
                    label: '其中：按已有资源预计销售',
                    prop: 'noYearGapAmountPlan',
                    click: true,
                    id: 12,
                    children: [
                      {
                        label: '其中：年初流入库存销售',
                        oldLabel: '其中：预计往年旧货销售',
                        prop: 'noYearGapAmountPlanInflow',
                        id: 13,
                      },
                      {
                        label: '其中：本年新货销售',
                        oldLabel: '其中：预计今年新货销售',
                        prop: 'noYearGapAmountPlanPresales',
                        id: 14,
                      },
                    ],
                  },
                  {
                    label: '其中：预计全年自营销售',
                    prop: 'noYearGapAmountYearPlan',
                    id: 15,
                  },
                  {
                    label: '其中：悬空业绩/缺口风险',
                    setColor: true,
                    prop: 'noYearGapAmountRisk',
                    empty: '-',  // 是否设置为空值‘-’
                    id: 16,
                  },
                ],
              },
            ],
          },
          {
            label: '并表业绩目标',
            prop: 'yearContractGoalSelf',
            id: 17,
            children: [
              {
                label: '截止目前累计完成',
                prop: 'yearContractAmountSelf',
                color: 'green',
                empty: '-',  // 是否设置为空值‘-’
                id: 18,
              },
              {
                label: '截止目前离并表业绩目标总差距',
                setColor: true,
                prop: 'yearGapAmountSelf',
                empty: '-',  // 是否设置为空值‘-’
                id: 19,
              },
            ],
          },
        ],
      },
    ];
    return {
      orgType: '',
      orgId: '',
      hei: '88vh',
			propData: {
				'合计':{},
				'别墅':{},
				'住宅':{},
				'商业':{},
				'公寓':{},
				'车位':{},
			},
      tableData: treeData,
    };
  },
  watch: {
    '$store.state.orgId': function (newVal, oldVal) {
      this.init();
    },
  },
	filters:{
		changeVal: function(val,type){
      if (type) {
        return '-'
      }
			return val&&val.amount!=null? regexNum(val.amount): '-'
		}
  },
	mounted() {
    this.init();
    $(document).scrollTop(0);

    this.$nextTick(() => {
      // $('.el-table__header-wrapper').scroll(function () {
      //   let scrollLeft = $(this).scrollLeft();
      //   $(this).next().scrollLeft(scrollLeft);
      // });
      $('.el-table__fixed .el-table__fixed-body-wrapper').scroll(function () {
        let scrollTop = $(this).scrollTop();
        $('.el-table__body-wrapper').scrollTop(scrollTop);
      });
    });
  },
  methods: {
    init() {
      this.tableList = [];
      this.orgId =
        getUrlParam('chooseOrgId') ||
        getUrlParam('orgId') ||
        getLocalStorage('orgId').orgId;
      this.orgType =
        getUrlParam('chooseOrgType') ||
        getUrlParam('orgType') ||
        getLocalStorage('orgType').orgType;

      // this.hei = window.innerHeight-$('.ptop').height()
      // console.log(this.hei)
			
			this.getMainData()
    },
    onClickLeft() {
      this.$router.go(-1);
		},
		judge(val,type){
        if (type) {
            return val&&val.amount!=null ? type: ''
        }
        if (val&&val.amount!=null) {
            return val.amount<=0?'green':'red'
        }else {
            return ''
        }
    },
    getMainData() {
      request({
        url: `/app-api/militaryOrder/developmentPlan`,
        method: 'post',
        data: {
          orgId: this.orgId,
          // productType: 0, //（0全部,1住宅洋房,2车位,3商铺,4别墅,5公寓,6写字楼,7其它）
        },
      })
        .then(({ data }) => {
          if (data.code == 0) {
						
						if (data.data) {
							this.propData['合计'] = data.data[0]
							this.propData['别墅'] = data.data[4]
							this.propData['住宅'] = data.data[1]
							this.propData['商业'] = data.data[3]
							this.propData['公寓'] = data.data[5]
							this.propData['车位'] = data.data[2]
						}
          }
        })
        .catch((e) => {
          console.log('developmentPlan-err', e);
        });
		},
  },
  components: {
    [List.name]: List,
    [PullRefresh.name]: PullRefresh,
    [NavBar.name]: NavBar,
    Toast,
  },
};
</script>

<style lang="scss" scoped>
.treeTxt {
  display: flex;
  .tips {
    width: 15px;
  }
}
.unit{
	margin: 0 auto;
	text-align: right;
	background: white;
	font-size: 12px;
	padding: 5px 10px;
	color: #ADADAD;
}
.green{ color:#006E38 ;}
.red{ color:red ;}
.report-index /deep/ .el-table__fixed-body-wrapper{
  overflow: auto;
}
.view-router{
  background: white !important;
}
</style>
