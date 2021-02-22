<template>
  <div class="report-index">
    <div class="data-content-panel">
      <van-tabs class="vanTabs"
        v-model="actTab"
        color="#006e38"
        line-width="30px"
        :ellipsis="false"
        type="card"
				@change="changeActTab"
      >
				<van-tab v-for="(item,index) in tabList" :title="item.name" :key="index">
					<div slot="title">
						<span v-eventlisten="{isChangePage:false,pageEvent:'点击-案场管理-'+item.name}">{{item.name}}</span>
					</div>
				</van-tab>
      </van-tabs>

			<div class="section">
				<div class="data-title-box data-title-line">
					<span class="title">{{titleType}}案场客储情况</span>
				</div>
				<van-row type="flex" justify="center" class="targetBox1">
					<van-col span="6">
						<div>认购套数</div>
						<div class="targetVal" v-html="filterValInMinix(topData.orderQuantity,'套')"></div>
					</van-col>
					<van-col span="6">
						<div>总到访人数</div>
						<div class="targetVal" v-html="filterValInMinix(topData.totalVisit,'人')"></div>
					</van-col>
					<van-col span="6">
						<div>首访</div>
						<div class="targetVal" v-html="filterValInMinix(topData.firstVisit,'人')"></div>
					</van-col>
					<van-col span="6">
						<div>复访</div>
						<div class="targetVal" v-html="filterValInMinix(topData.revisit,'人')"></div>
					</van-col>
				</van-row>
				<van-row type="flex" justify="center" class="targetBox2">
					<van-col span="8">
						<div>自然访客</div>
						<div class="targetVal">
							<span v-html="filterValInMinix(topData.naturalVisit, '人')"></span>
							环比
							<span :style="topData.naturalRate>=0 ? '' : 'color: red'" v-html="filterValInMinix(topData.naturalRate,'%')"></span>
							<i :class="topData.naturalRate>=0?'huojv-arrowimg-up-s':'huojv-arrowimg-down-s'"></i>
						</div>
					</van-col>
					<van-col span="8">
						<div>社会人士推介访客</div>
						<div class="targetVal">
							<span v-html="filterValInMinix(topData.socialVisit, '人')"></span>
							环比
							<span :style="topData.socialRate>=0 ? '' : 'color: red'" v-html="filterValInMinix(topData.socialRate,'%')"></span>
							<i :class="topData.socialRate>=0?'huojv-arrowimg-up-s':'huojv-arrowimg-down-s'"></i>
						</div>
					</van-col>
					<van-col span="8">
						<div>机构渠道访客</div>
						<div class="targetVal">
							<span v-html="filterValInMinix(topData.institutionalVisit, '人')"></span>
							环比
							<span :style="topData.institutionalRate>=0 ? '' : 'color: red'" v-html="filterValInMinix(topData.institutionalRate,'%')"></span>
							<i :class="topData.institutionalRate>=0?'huojv-arrowimg-up-s':'huojv-arrowimg-down-s'" ></i>
						</div>
					</van-col>
				</van-row>
				<van-row type="flex" justify="center" class="targetBox2">
					<van-col span="8">
						<div>自渠访客</div>
						<div class="targetVal">
							<span v-html="filterValInMinix(topData.selfChanelVisit, '人')"></span>
							环比
							<span :style="topData.selfChanelRate>=0 ? '' : 'color: red'" v-html="filterValInMinix(topData.selfChanelRate,'%')"></span>
							<i :class="topData.selfChanelRate>=0?'huojv-arrowimg-up-s':'huojv-arrowimg-down-s'"></i>
						</div>
					</van-col>
					<van-col span="8">
						<div>老业主推介访客</div>
						<div class="targetVal">
							<span v-html="filterValInMinix(topData.oldOwnerVisit, '人')"></span>
							环比
							<span :style="topData.oldOwnerRate>=0 ? '' : 'color: red'" v-html="filterValInMinix(topData.oldOwnerRate,'%')"></span>
							<i :class="topData.oldOwnerRate>=0?'huojv-arrowimg-up-s':'huojv-arrowimg-down-s'"></i>
						</div>
					</van-col>
					<van-col span="8">
						<div>员工推介访客</div>
						<div class="targetVal">
							<span v-html="filterValInMinix(topData.staffVisit, '人')"></span>
							环比
							<span :style="topData.staffRate>=0 ? '' : 'color: red'" v-html="filterValInMinix(topData.staffRate,'%')"></span>
							<i :class="topData.staffRate>=0?'huojv-arrowimg-up-s':'huojv-arrowimg-down-s'"></i>
						</div>
					</van-col>
				</van-row>
				<el-table stripe :max-height="500"
							class="huo-list-table tree-table mt-30" ref="tableRef1" size="mini"
							highlight-current-row
							row-key="orgId"
							:data="tableActiveData1"
							:expand-row-keys="expandNodes1"
							border :indent="5" row-class-name="colorRed"
							lazy :load="load1"
							:tree-props="{children: 'children', hasChildren: 'hasChildren'}">
						<el-table-column property="orgName" label="组织架构" width="120" fixed>
							<template slot-scope="scope">
								<span v-if="scope.row.orgType==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,scope.row.orgType)">{{scope.row.orgName}}</span>
								<span v-else>{{scope.row.orgName}}</span>
							</template>
						</el-table-column>
						<el-table-column property="orderQuantity" :label="`${titleType}认购套数(套)`" align="center" width="100">
							<template slot-scope="scope">{{scope.row.orderQuantity| changeEmpty}}</template>
						</el-table-column>
						<el-table-column property="orderAmount" :label="`${titleType}认购金额(${unit})`" align="center" width="100">
							<template slot-scope="scope">{{scope.row.orderAmount| changeEmpty}}</template>
						</el-table-column>
						<el-table-column property="orderArgVisit" label="认购客户平均到访次数(次)" align="center" width="100">
							<template slot-scope="scope">{{scope.row.orderArgVisit| changeEmpty}}</template>
						</el-table-column>
						<el-table-column property="totalVisit" :label="`${titleType}总到访(人)`" align="center" width="100">
							<template slot-scope="scope">{{scope.row.totalVisit| changeEmpty}}</template>
						</el-table-column>
						<el-table-column property="firstVisit" label="首访(人)" align="center">
							<template slot-scope="scope">{{scope.row.firstVisit| changeEmpty}}</template>
						</el-table-column>
						<el-table-column property="revisit" label="复访(人)" align="center">
							<template slot-scope="scope">{{scope.row.revisit| changeEmpty}}</template>
						</el-table-column>
						<el-table-column property="revisitRate" label="复访率" align="center">
							<template slot-scope="scope">{{scope.row.revisitRate| changeEmpty('%')}}</template>
							<!-- <template slot-scope="scope">{{scope.row.revisitRate?scope.row.revisitRate+'%':'-'}}</template> -->
						</el-table-column>
						<el-table-column property="naturalVisit" label="其中自访(人)" align="center" width="100">
							<template slot-scope="scope">{{scope.row.naturalVisit| changeEmpty}}</template>
						</el-table-column>
						<el-table-column property="institutionalVisit" label="其中机构渠道(人)" align="center" width="100">
							<template slot-scope="scope">{{scope.row.institutionalVisit| changeEmpty}}</template>
						</el-table-column>
						<el-table-column property="selfChanelVisit" label="其中自渠(人)" align="center" width="100">
							<template slot-scope="scope">{{scope.row.selfChanelVisit| changeEmpty}}</template>
						</el-table-column>
						<el-table-column property="socialVisit" label="其中社会人士推介(人)" align="center" width="100">
							<template slot-scope="scope">{{scope.row.socialVisit| changeEmpty}}</template>
						</el-table-column>
						<el-table-column property="oldOwnerVisit" label="其中老业主推介(人)" align="center" width="100">
							<template slot-scope="scope">{{scope.row.oldOwnerVisit| changeEmpty}}</template>
						</el-table-column>
						<el-table-column property="staffVisit" label="其中员工推介(人)" align="center" width="100">
							<template slot-scope="scope">{{scope.row.staffVisit| changeEmpty}}</template>
						</el-table-column>
						<el-table-column property="otherVisit" label="其他(人)" align="center" width="100">
							<template slot-scope="scope">{{scope.row.otherVisit| changeEmpty}}</template>
						</el-table-column>
				</el-table>
				<div class="toggleBox pb-20" v-if="orgType>=6">
					<span class="more" @click="getMore(titleType+'案场客储情况',1)">查看更多 <i class="el-icon-arrow-right"></i></span>
				</div>
			</div>
			<div class="section">
				<div class="data-title-box data-title-line">
					<span class="title">{{titleType}}客户转化漏斗</span>
				</div>
				<div class="huojv-chart-box-item" ref="chart1"></div>
				<div class="huojv-chart-box-item" ref="chart2"></div>
				<div class="huojv-chart-box-item-mini" ref="chart3"></div>
				<div class="toggleBox pb-20" v-if="orgType>=6">
					<span class="more" @click="getMore(titleType+'客户转化漏斗',3)">查看更多 <i class="el-icon-arrow-right"></i></span>
				</div>
			</div>
			<div class="section">
				<div class="data-title-box data-title-line">
					<span class="title">近{{barTitle}}来访转化率{{actTab==4?'（按季度）':''}}</span>
				</div>
				<div class="huojv-chart-box-item" ref="bar"></div>
				<div class="toggleBox pb-20">
					<span class="more" @click="getMore('近'+barTitle+'来访转化率',2)">查看更多 <i class="el-icon-arrow-right"></i></span>
				</div>
			</div>
			<div class="section">
				<div class="data-title-box data-title-line">
					<span class="title">{{titleType}}成交客户来源分析</span>
				</div>
				<div class="huojv-chart-box-item" ref="chart4"></div>
				<el-table stripe :max-height="500"
							class="huo-list-table tree-table mt-30" ref="tableRef2" size="mini"
							highlight-current-row
							row-key="orgId"
							:data="tableActiveData2"
							:expand-row-keys="expandNodes2"
							border :indent="5"
							lazy :load="load2" row-class-name="colorRed"
							:tree-props="{children: 'children', hasChildren: 'hasChildren'}">
						<el-table-column property="orgName" label="组织架构" width="120" fixed>
							<template slot-scope="scope">
								<span v-if="scope.row.orgType==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,scope.row.orgType)">{{scope.row.orgName}}</span>
								<span v-else>{{scope.row.orgName}}</span>
							</template>
						</el-table-column>
						<el-table-column property="orderQuantity" :label="`${titleType}认购套数(套)`" align="center">
							<template slot-scope="scope">{{scope.row.orderQuantity| changeEmpty}}</template>
						</el-table-column>
						<el-table-column property="orderAmount" :label="`${titleType}认购金额(${unit})`" align="center">
							<template slot-scope="scope">{{scope.row.orderAmount| changeEmpty}}</template>
						</el-table-column>
						<el-table-column property="institutionalOrder" label="来源机构渠道(套)" align="center">
							<template slot-scope="scope">{{scope.row.institutionalOrder| changeEmpty}}</template>
						</el-table-column>
						<el-table-column property="naturalOrder" label="来源自访客户(套)" align="center">
							<template slot-scope="scope">{{scope.row.naturalOrder| changeEmpty}}</template>
						</el-table-column>
						<el-table-column property="selfChanelOrder" label="来源自渠(套)" align="center">
							<template slot-scope="scope">{{scope.row.selfChanelOrder| changeEmpty}}</template>
						</el-table-column>
						<el-table-column label="来源全民营销(套)" align="center">
							<el-table-column property="allPeopleSale" label="小计(套)" align="center">
								<template slot-scope="scope">{{scope.row.allPeopleSale| changeEmpty}}</template>
							</el-table-column>
							<el-table-column property="staffOrder" label="员工(套)" align="center">
								<template slot-scope="scope">{{scope.row.staffOrder| changeEmpty}}</template>
							</el-table-column>
							<el-table-column property="oldOwnerOrder" label="老业主(套)" align="center">
								<template slot-scope="scope">{{scope.row.oldOwnerOrder| changeEmpty}}</template>
							</el-table-column>
							<el-table-column property="socialOrder" label="社会人士(套)" align="center">
								<template slot-scope="scope">{{scope.row.socialOrder| changeEmpty}}</template>
							</el-table-column>
						</el-table-column>
				</el-table>

				<div class="toggleBox pb-20" v-if="orgType>=6">
					<span class="more" @click="getMore(titleType+'成交客户来源分析',4)">查看更多 <i class="el-icon-arrow-right"></i></span>
				</div>
			</div>

			<div class="section">
				<div class="data-title-box data-title-line">
					<span class="title">{{titleType}}案场销售顾问人均接待客户量</span>
				</div>
				<div class="tableDesc" v-if="orgType<=2">置业顾问人均接待客户量：<span>{{salesDetail.avgReception}}组/人</span>，其中地产集团：<span>{{salesDetail.avgReceptionLand}}组/人</span>，商业集团：<span>{{salesDetail.avgReceptionBusiness}}组/人</span></div>
				<div class="tableDesc" v-else>置业顾问人均接待客户量：<span>{{salesDetail.avgReception}}组/人</span></div>
				<el-table stripe :max-height="500"
							class="huo-list-table tree-table mt-20" ref="tableRef3" size="mini"
							highlight-current-row
							row-key="orgId"
							:data="tableActiveData3"
							:expand-row-keys="expandNodes3"
							border :indent="5"
							lazy :load="load3" row-class-name="colorRed"
							:tree-props="{children: 'children', hasChildren: 'hasChildren'}">
						<el-table-column property="orgName" label="组织架构" width="120" fixed>
							<template slot-scope="scope">
								<span v-if="scope.row.orgType==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,scope.row.orgType)">{{scope.row.orgName}}</span>
								<span v-else>{{scope.row.orgName}}</span>
							</template>
						</el-table-column>
						<el-table-column property="onDutySalepersonQuantity" label="在岗置业顾问数(人)" align="center">
							<template slot-scope="scope">{{scope.row.onDutySalepersonQuantity| changeEmpty}}</template>
						</el-table-column>
						<el-table-column property="totalVisit" label="来访客户数(组)" align="center">
							<template slot-scope="scope">{{scope.row.totalVisit| changeEmpty}}</template>
						</el-table-column>
						<el-table-column property="avgReception" label="人均接待量(台/人)" align="center">
							<template slot-scope="scope">{{scope.row.avgReception| changeEmpty}}</template>
						</el-table-column>
				</el-table>
				<div class="toggleBox pb-20" v-if="orgType>=6">
					<span class="more" @click="getMore(titleType+'案场销售顾问人均接待客户量',5)">查看更多 <i class="el-icon-arrow-right"></i></span>
				</div>
			</div>

			<div class="section spanMethodTable">
				<div class="data-title-box data-title-line">
					<span class="title">案场异常监控</span>
				</div>
				<div class="tableTitle">逾期签约监控</div>
				<el-table	stripe :max-height="500" key="1"
						class="huo-list-table main-theme-table huojv-data-list2 rowspanTable mt-20"
						ref="tableRef4" size="mini"
						:data="mergeTableList1" row-class-name="colorRed"
						:span-method="objectSpanMethod1"
						>
						<el-table-column property="" label="逾期签约账龄" align="center" >
							<el-table-column property="orgName" label="组织架构" align="center" width="100">
								<template slot-scope="scope">
									<span v-if="scope.row.orgType==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,scope.row.orgType)">{{scope.row.orgName}}</span>
									<span v-else>{{scope.row.orgName}}</span>
								</template>
							</el-table-column>
							<el-table-column property="lateDaySectionDescription" label="逾期时间" align="center" width="100">
								<template slot-scope="scope">{{scope.row.orderQuantity| changeEmpty}}</template>
							</el-table-column>
						</el-table-column>
						<el-table-column property="" label="本月" align="center">
							<el-table-column property="lateContract_months" label="逾期套数(套)" align="center">
								<template slot-scope="scope">{{scope.row.lateContract_months| changeEmpty}}</template>
							</el-table-column>
							<el-table-column property="lateFeeAmount_months" :label="`逾期金额(${unit})`" align="center">
								<template slot-scope="scope">{{scope.row.lateFeeAmount_months| changeEmpty}}</template>
							</el-table-column>
							<el-table-column property="lateContractOrderQuantity_months" label="本月累计逾期套数/本月总认购套数" align="center">
								<template slot-scope="scope">{{scope.row.lateContractOrderQuantity_months| changeEmpty('%')}}</template>
								<!-- <template slot-scope="scope">{{scope.row.lateContractOrderQuantity_months?scope.row.lateContractOrderQuantity_months+'%':'-'}}</template> -->
							</el-table-column>
						</el-table-column>
						<el-table-column property="" label="本季度" align="center">
							<el-table-column property="lateContract_seasons" label="逾期套数(套)" align="center">
								<template slot-scope="scope">{{scope.row.lateContract_seasons| changeEmpty}}</template>
							</el-table-column>
							<el-table-column property="lateFeeAmount_seasons" :label="`逾期金额(${unit})`" align="center">
								<template slot-scope="scope">{{scope.row.lateFeeAmount_seasons| changeEmpty}}</template>
							</el-table-column>
							<el-table-column property="lateContractOrderQuantity_seasons" label="本季度累计逾期套数/本季度总认购套数" align="center">
								<template slot-scope="scope">{{scope.row.lateContractOrderQuantity_seasons|  changeEmpty('%')}}</template>
								<!-- <template slot-scope="scope">{{scope.row.lateContractOrderQuantity_seasons?scope.row.lateContractOrderQuantity_seasons+'%':'-'}}</template> -->
							</el-table-column>
						</el-table-column>
						<el-table-column property="" label="本年" align="center">
							<el-table-column property="lateContract_year" label="逾期套数(套)" align="center">
								<template slot-scope="scope">{{scope.row.lateContract_year| changeEmpty}}</template>
							</el-table-column>
							<el-table-column property="lateFeeAmount_year" :label="`逾期金额(${unit})`" align="center">
								<template slot-scope="scope">{{scope.row.lateFeeAmount_year| changeEmpty}}</template>
							</el-table-column>
							<el-table-column property="lateContractOrderQuantity_year" label="本年累计逾期套数/本年总认购套数" align="center">
								<template slot-scope="scope">{{scope.row.lateContractOrderQuantity_year| changeEmpty('%')}}</template>
								<!-- <template slot-scope="scope">{{scope.row.lateContractOrderQuantity_year?scope.row.lateContractOrderQuantity_year+'%':'-'}}</template> -->
							</el-table-column>
						</el-table-column>
				</el-table>
				<div class="toggleBox pb-20" v-if="orgType>=6">
					<span class="more" @click="getMore('逾期签约监控',6)">查看更多 <i class="el-icon-arrow-right"></i></span>
				</div>
				<template v-if="orgType<6">
					<div class="tableTitle mt-20">退房异常监控</div>
					<el-table	stripe :max-height="500" key="2"
						class="huo-list-table main-theme-table huojv-data-list2 rowspanTable mt-20"
						ref="tableRef5" size="mini"
						:data="mergeTableList2" row-class-name="colorRed"
						:span-method="objectSpanMethod2"
						>
						<el-table-column property="orgName" label="组织架构"  align="center" fixed>
							<template slot-scope="scope">
								<span v-if="scope.row.orgType==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,scope.row.orgType)">{{scope.row.orgName}}</span>
								<span v-else>{{scope.row.orgName}}</span>
							</template>
						</el-table-column>
						<el-table-column property="lateDaySectionDescription" label="时间周期" align="center">
							<template slot-scope="scope">{{scope.row.lateDaySectionDescription| changeEmpty}}</template>
						</el-table-column>
						<el-table-column property="cancelRoom" label="退房套数(套)" align="center" width="100">
							<template slot-scope="scope">{{scope.row.cancelRoom| changeEmpty}}</template>
						</el-table-column>
						<el-table-column property="cancelRoomAmount" :label="`退房金额(${unit})`" align="center" width="100">
							<template slot-scope="scope">{{scope.row.cancelRoomAmount| changeEmpty}}</template>
						</el-table-column>
						<el-table-column property="cancelRoomOrderQuantity" label="退房套数/总认购套数" align="center" width="100">
							<template slot-scope="scope">{{scope.row.cancelRoomOrderQuantity| changeEmpty('%')}}</template>
							<!-- <template slot-scope="scope">{{scope.row.cancelRoomOrderQuantity?scope.row.cancelRoomOrderQuantity+'%':'-'}}</template> -->
						</el-table-column>
					</el-table>
					<div class="toggleBox pb-20" v-if="orgType>=6">
						<span class="more" @click="getMore('退房异常监控',7)">查看更多 <i class="el-icon-arrow-right"></i></span>
					</div>
					<div class="tableTitle mt-20">更名异常监控</div>
					<el-table	stripe :max-height="500" key="3"
							class="huo-list-table main-theme-table huojv-data-list2 rowspanTable mt-20"
							ref="tableRef6" size="mini"
							:data="mergeTableList3" row-class-name="colorRed"
							:span-method="objectSpanMethod3"
							>
						<el-table-column property="orgName" label="组织架构" fixed align="center">
							<template slot-scope="scope">
								<span v-if="scope.row.orgType==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,scope.row.orgType)">{{scope.row.orgName}}</span>
								<span v-else>{{scope.row.orgName}}</span>
							</template>
						</el-table-column>
						<el-table-column property="lateDaySectionDescription" label="时间周期" align="center">
							<template slot-scope="scope">{{scope.row.lateDaySectionDescription| changeEmpty}}</template>
						</el-table-column>
						<el-table-column property="changeRight" label="更名套数(套)" align="center" width="100">
							<template slot-scope="scope">{{scope.row.changeRight| changeEmpty}}</template>
						</el-table-column>
						<el-table-column property="changeRightAmount" :label="`更名涉及金额(${unit})`" align="center" width="100">
							<template slot-scope="scope">{{scope.row.changeRightAmount| changeEmpty}}</template>
						</el-table-column>
						<el-table-column property="changeRightOrderQuantity" label="更名套数/总认购套数" align="center" width="100">
							<template slot-scope="scope">{{scope.row.changeRightOrderQuantity| changeEmpty('%')}}</template>
							<!-- <template slot-scope="scope">{{scope.row.changeRightOrderQuantity?scope.row.changeRightOrderQuantity+'%':'-'}}</template> -->
						</el-table-column>
					</el-table>
					<div class="toggleBox pb-20" v-if="orgType>=6">
						<span class="more" @click="getMore('更名异常监控',8)">查看更多 <i class="el-icon-arrow-right"></i></span>
					</div>
				</template>
				<template v-else>
					<div class="tableTitle mt-20">逾期回款监控</div>
					<el-table	stripe :max-height="500"  key="4"
						class="huo-list-table main-theme-table huojv-data-list2 rowspanTable mt-20"
						ref="tableRef4" size="mini"
						:data="mergeTableList1" row-class-name="colorRed"
						:span-method="objectSpanMethod1"
						>
						<el-table-column property="" label="逾期签约账龄" align="center" >
							<el-table-column property="orgName" label="组织架构" align="center" width="100">
								<template slot-scope="scope">
									<span v-if="scope.row.orgType==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,scope.row.orgType)">{{scope.row.orgName}}</span>
									<span v-else>{{scope.row.orgName}}</span>
								</template>
							</el-table-column>
							<el-table-column property="lateDaySectionDescription" label="逾期时间" align="center">
								<template slot-scope="scope">{{scope.row.lateDaySectionDescription| changeEmpty}}</template>
							</el-table-column>
						</el-table-column>
						<el-table-column property="" label="本月" align="center">
							<el-table-column property="lateContract_months" label="逾期套数(套)" align="center">
								<template slot-scope="scope">{{scope.row.lateContract_months| changeEmpty}}</template>
							</el-table-column>
							<el-table-column property="lateFeeAmount_months" :label="`逾期金额(${unit})`" align="center">
								<template slot-scope="scope">{{scope.row.lateFeeAmount_months| changeEmpty}}</template>
							</el-table-column>
							<el-table-column property="lateContractNoFullFee_months" label="本月逾期套数/未齐款总套数" align="center">
								<template slot-scope="scope">{{scope.row.lateContractNoFullFee_months| changeEmpty('%')}}</template>
								<!-- <template slot-scope="scope">{{scope.row.lateContractNoFullFee_months?scope.row.lateContractNoFullFee_months+'%':'-'}}</template> -->
							</el-table-column>
						</el-table-column>
						<el-table-column property="" label="本季度" align="center">
							<el-table-column property="lateContract_seasons" label="逾期套数(套)" align="center">
								<template slot-scope="scope">{{scope.row.lateContract_seasons| changeEmpty}}</template>
							</el-table-column>
							<el-table-column property="lateFeeAmount_seasons" :label="`逾期金额(${unit})`" align="center">
								<template slot-scope="scope">{{scope.row.lateFeeAmount_seasons| changeEmpty}}</template>
							</el-table-column>
							<el-table-column property="lateContractNoFullFee_seasons" label="本季度逾期套数/未齐款总套数" align="center">
								<template slot-scope="scope">{{scope.row.lateContractNoFullFee_seasons| changeEmpty('%')}}</template>
								<!-- <template slot-scope="scope">{{scope.row.lateContractNoFullFee_seasons?scope.row.lateContractNoFullFee_seasons+'%':'-'}}</template> -->
							</el-table-column>
						</el-table-column>
						<el-table-column property="" label="本年" align="center">
							<el-table-column property="lateContract_year" label="逾期套数(套)" align="center">
								<template slot-scope="scope">{{scope.row.lateContract_year| changeEmpty}}</template>
							</el-table-column>
							<el-table-column property="lateFeeAmount_year" :label="`逾期金额(${unit})`" align="center">
								<template slot-scope="scope">{{scope.row.lateFeeAmount_year| changeEmpty}}</template>
							</el-table-column>
							<el-table-column property="lateContractNoFullFee_year" label="本年逾期套数/未齐款总套数" align="center">
								<template slot-scope="scope">{{scope.row.lateContractNoFullFee_year| changeEmpty('%')}}</template>
								<!-- <template slot-scope="scope">{{scope.row.lateContractNoFullFee_year?scope.row.lateContractNoFullFee_year+'%':'-'}}</template> -->
							</el-table-column>
						</el-table-column>
					</el-table>
					<div class="toggleBox pb-20" v-if="orgType>=6">
						<span class="more" @click="getMore('逾期回款监控',9)">查看更多 <i class="el-icon-arrow-right"></i></span>
					</div>
				</template>
				
			</div>

			<div class="section" v-if="orgType==6">
				<div class="data-title-box data-title-line">
					<span class="title">团队销售力分布</span>
				</div>
				<div class="building has-line">陆续上线</div>
			</div>

    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import scrollFixed from '@/mixin/scroll-fixed';
import { List, PullRefresh, Toast, Popup, Sticky, Tab, Tabs, Col, Row, ImagePreview } from 'vant';
import { getLocalStorage } from '@/utils/local-storage';
import request from '@/utils/request';
import echarts from 'echarts';
import $ from 'jquery';
import {
  handleNum2String,
  handleDate,
  getUrlParam,
  jumpToPj,
} from '@/utils/common';

export default {
  mixins: [scrollFixed],
  data() {
    return {
      orgType: '',
			orgId: '',
			tabList: [
        { name: "日", },
        { name: "周", },
        { name: "月", },
        { name: "季度", },
        { name: "年", },
      ],
			actTab: 0,
			unit: '',
			color: ['#209B5C', '#FFC40F', '#4995E3', '#F97546','#A73FEB','#D90031'],
			titleType: '',
			barTitle: '',
			topData: {},
			level1: 0,
      expandNodes1: [],
			tableActiveData1: [],
			level2: 0,
      expandNodes2: [],
			tableActiveData2: [],
			level3: 0,
      expandNodes3: [],
			tableActiveData3: [],
			spanArr1: [],
			position1:0,
			mergeTableList1: [],
			spanArr2: [],
			position2:0,
			mergeTableList2: [],
			spanArr3: [],
			position3:0,
			mergeTableList3: [],
			salesDetail: {}
    };
	},
	filters:{
    changeEmpty(val, unit){
      let _res = ''
      if(val||val==0){
        if (val=='') {
          _res = '-'
        }else {
          _res = unit? val + unit: val
        }
      }else{
       _res = '-'
      }
      return _res
    }
  },
  mounted() {
    this.$nextTick(() => {
      $('.el-table__header-wrapper').scroll(function () {
        let scrollLeft = $(this).scrollLeft();
        $(this).next().scrollLeft(scrollLeft);
      });

      $('.el-table__fixed-body-wrapper').scroll(function () {
        let scrollTop = $(this).scrollTop();
        $(this).parent().prev().scrollTop(scrollTop);
      });
		});

    this.init();
  },
  methods: {
    jumpToPj,
    init() {
      this.orgId = getUrlParam('chooseOrgId') || getUrlParam('orgId') || getLocalStorage('orgId').orgId;
			this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType;
			this.unit = this.orgType < 5? '亿': '万'

			if (sessionStorage.getItem('fileManageTab')) {
				console.log('------------'+ sessionStorage.getItem('fileManageTab'))
				this.actTab = parseInt(sessionStorage.getItem('fileManageTab'))
				sessionStorage.removeItem('fileManageTab')
			}
			
			// 处理标题字样
			this.titleType = ['本日','本周','本月','本季度','本年'][this.actTab]
			this.barTitle = ['30天', '30周', '24个月', '8个季度', '2年'][this.actTab]

			this.level1 = 0
      this.expandNodes1 = []
			this.tableActiveData1 = []
			this.level2 = 0
      this.expandNodes2 = []
			this.tableActiveData2 = []
			this.level3 = 0
      this.expandNodes3 = []
			this.tableActiveData3 = []


			// this.mergeTableList1 = [
			// 	{
			// 		orgName:'aaa',
			// 		lateDaySectionDescription:'99:00',
			// 		lateContract_months: 1,
			// 		lateFeeAmount_months: 2,
			// 		lateContractNoFullFee_months: 23,
			// 		lateContractNoFullFee_seasons: 0.00,
			// 		lateContractNoFullFee_year: null
			// 	},
			// 	{
			// 		orgName:'aaa',
			// 		lateDaySectionDescription:'99:00',
			// 		lateContract_months: 1,
			// 		lateFeeAmount_months: 2,
			// 		lateContractNoFullFee_months: 23,
			// 		lateContractNoFullFee_seasons: 0.00,
			// 		lateContractNoFullFee_year: null
			// 	},
			// ]
			

			this.getACOrderAndVisitSummarys()
			if (this.orgType<6) {
				this.getTableList1()
				this.getTableList2()
				this.getTableList3()
			} else {
				this.getTableList1_pj()
				this.getTableList2_pj()
				this.getTableList3_pj()
			}
			
			this.getACLDByOrgGUID()
			this.getACSalepersonDetailsList()
			this.getACSourceAnalysisSummary()

			this.getMergeTable1()
			this.getMergeTable2()
			this.getACJDKHDetails()
			this.getMergeTable3()
		},
		changeActTab(idx){
			this.actTab = idx
			this.init()
		},
		// 顶部数据
		getACOrderAndVisitSummarys(){
			request({
        url: `/app-api/saleBack/ac/getACOrderAndVisitSummarysByOrgGUID`,
        method: 'get',
        params: {
          orgId: this.orgId,
          timeDimension: this.actTab+1,
        },
      }).then(( res ) => {
				this.topData = res.data.data || {}
      });
		},
		// 案场客储情况树状图
		getTableList1() {
      request({
				url: `/app-api/saleBack/ac/getACOrderAndVisitSummaryTreeList`,
        method: 'get',
        params: {
          orgId: this.orgId,
					root: 1,
					timeDimension: this.actTab+1,
					needBillion: this.unit=='亿'?1:0
        },
      }).then(({ data }) => {
        if (data.code === 0) {
          let _list = data.list || data.data,
            _parentOrgId = '',
						_expandNodes = [];
          for (let i = 0, len = _list.length; i < len; i++) {
            if (_list[i]['root'] == true) {
              _parentOrgId = _list[i]['parentOrgId'];
              _expandNodes.push(_list[i]['orgId']);
              break;
            }
          }

					let tree = this.fnGetTree1(_list, _parentOrgId);

          this.expandNodes1 = _expandNodes;
					this.tableActiveData1 = tree;
					
          // 重新渲染表格 防止表格错位
          this.$nextTick(() => {
            if (this.$refs['tableRef1']) {
              this.$refs['tableRef1'].doLayout();
            }
          });
        }
      });
    },
    fnGetTree1(data, parentOrgId) {
      this.level1++;
      let self = this;
      var result = [],
        temp;
      for (var i in data) {
				console.log(data[i].parentOrgId, '_'+parentOrgId)
        if (data[i].parentOrgId == parentOrgId) {
          result.push(data[i]);
          // 初始数据只返回了两级   给第三级添加模拟子节点
          if (this.level1 >= 2 && !data[i].leaf) {
            data[i].hasChildren = true;
            data[i].expan = false;
          } else {
            temp = self.fnGetTree1(data, data[i].orgId);
            if (temp.length > 0) {
              data[i].children = temp;
            }
          }
        }
      }
      return result;
    },
    load1(tree, treeNode, resolve) {
      request({
				url: `/app-api/saleBack/ac/getACOrderAndVisitSummaryTreeList`,
        method: 'get',
        params: {
          orgId: tree.orgId,
					root: 0,
					timeDimension: this.actTab+1,
					needBillion: this.unit=='亿'?1:0
        },
      }).then(({ data }) => {
        if (data && data.code === 0) {
          let _list = data.list || data.data;
          _list.forEach((item) => {
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
		// 项目层级-案场客储情况
		getTableList1_pj() {
			request({
				url: `/app-api/saleBack/ac/getACOrderAndVisitSummaryTableList`,
				method: 'get',
				params: {
					orgId: this.orgId,
					root: 1,
					timeDimension: this.actTab+1,
					needBillion: this.unit=='亿'?1:0
				}
			}).then(res => {
				this.tableActiveData1 = res.data.data || []
			});
		},
		// 漏斗
		getACLDByOrgGUID(){
			request({
				url: `/app-api/saleBack/ac/getACLDByOrgGUID`,
				method: 'get',
				params: {
					orgId: this.orgId,
					timeDimension: this.actTab+1,
				}
			}).then(res => {
				const _data = res.data.data || {}
				let _chartdata1 = [{
							name: "首访",
							value: _data.firstVisit || 0,
							rate: _data.firstRate || 0
					},
					{
							name: "二访",
							value: _data.secondVisit || 0,
							rate: _data.secondRate || 0
					},
					{
							name: "三访",
							value: _data.thirdVisit || 0,
							rate: _data.thirdRate || 0
					},
					{
							name: "三访+",
							value: _data.moreVisit || 0,
							rate: _data.moreRate || 0
					}
				],_chartdata2 = [{
							name: "强",
							value: _data.highPurpose || 0,
							rate: _data.highPurposeRate || 0
					},
					{
							name: "中等",
							value: _data.moderatePurpose || 0,
							rate: _data.moderatePurposeRate || 0
					},
					{
							name: "弱",
							value: _data.weakPurpose || 0,
							rate: _data.weakPurposeRate || 0
					},
					{
							name: "休眠",
							value: _data.dormancyPurpose || 0,
							rate: _data.dormancyPurposeRate || 0
					}
				],_funnelData = [
					{name: '新增客户数', value: _data.newCustomer || 0, rate:'', rateName: ''},
					{name: '来访客户数', value: _data.totalVisit || 0, rate:_data.visitTransformRate || 0, rateName: '来访转化率'},
					{name: '复访客户数', value: _data.revisit || 0, rate:_data.revisitRate || 0, rateName: '复访率'},
					{name: '认购客户数', value: _data.orderCustomer || 0, rate:_data.orderTransformRate || 0, rateName: '认购转化率'},
				]
				this.setPie('chart1', _chartdata1, '客户访问次数', '复访率', _data.revisitRate)
				this.setPie('chart2', _chartdata2, '客户意向度', '高意向客户占比', _data.highPurposeRate)
				this.setFunnel(_funnelData)
			});
		},
		getMore(_title, _type) {
			sessionStorage.setItem('fileManageTab', this.actTab)

      this.$router.push({
        path: '/report/saleReceipts/moreFileManage',
        query: {
					token: getUrlParam('token'),
					pageType: _type,
					orgId: this.orgId,
					orgType: this.orgType,
					timeDimension: this.actTab+1,
					title: _title
        },
      });
		},
		// 饼图
		setPie(el, data, title1, title2, title2Value){
			let echartData = data,
				_title = []

			if (title1 != '') {
				_title = [{
						text: title1,
						top: '0%',
						textAlign: "center",
						left: "49%",
						textStyle: {
							fontSize: 14,
							color: '#3A3A3A',
							fontWeight: '400'
						}
					}]
				if (title2Value) {
					_title.push({
						text: '{name|' + title2 + '}\n{val|'+title2Value+'}{unit|%}',
						top: 'center',
						left: 'center',
						textStyle: {
							rich: {
								name: {
									fontSize: 12,
									fontWeight: 'normal',
									color: '#333333',
									padding: [10, 0]
								},
								val: {
									fontSize: 24,
									fontWeight: 'bold',
									color:'#FE0909',
								},
								unit:{
									fontSize: 14,
									color:'#FE0909'
								}
							}
						}
				})
				}	
			} else {
				let str = ''
				title2.forEach(i => {
					str += '{name|' + i.name + '：}{val|'+i.value+'%}\n'
				});
				_title = [{
						text: str,
						top: '33%',
						left: 'center',
						textStyle: {
							rich: {
								name: {
									fontSize: 11,
									fontWeight: 'normal',
									color: '#333333',
									lineHeight: 18
								},
								val:{
									fontSize: 11,
									color: '#FE0909'
								}
							}
						}
				}]
			}

			let option = {
				color: this.color,
				title: _title,
				tooltip: { //提示框组件
					trigger: 'item',
					backgroundColor: "rgba(255,255,255,0.8)",
					color: "#666666",
					formatter: function(params) {
						if (title1 != '') {
							return `${params.marker}${params.name}：${params.value}组<br>占比：${params.data.rate}%`
						} else {
							return `${params.marker}${params.name}：${params.value}%`
						}
					},
					// formatter: "{b} : {c}",
					extraCssText: 'box-shadow: 0 0 10px #ccc; padding: 15px;',
					borderColor: "gray", //设置边框颜色
					confine: true,
					textStyle: {
						color: "#666666", //设置文字颜色
						fontSize: 11,
					},
					axisPointer: {
						type: 'shadow',
						label: {
							backgroundColor: '#6a7985'
						}
					},
				},
				legend: {
					icon: "circle",
					data: echartData.map( i => i.name),
					bottom: '5%',
					itemWidth: 8,
        	itemHeight: 8,
					textStyle: {
						color: "#999999",
						fontSize: 10
					},
				},
				series: [{
					type: 'pie',
					radius: ['35%', '50%'],
					center: title1 != ''?['50%', '50%']:['50%', '43%'],
					data: echartData,
					// hoverAnimation: false,
					itemStyle: {
						normal: {
							borderWidth: 2,
						}
					},
					labelLine: {
						normal: {
							length: 15,
							length2: 40,
						}
					},
					label: {
						normal: {
							position: 'outside',
							formatter: function(params) {
								if (title1 != '') {
									return `{a|${params.name}:${params.value}组\n占比:${params.data.rate}%}`
								} else {
									return `{a|${params.name}:${params.value}%}`
								}
							},
							rich: {
								a: {
									color: '#666',
									fontSize: 9,
									lineHeight: 12,
									// padding:[8, -60, -20, -40],
									padding:title1 != ''?[8, -40, -20, -40]:[8, -40, -5, -40],
									textAlign: 'left'
								}
							}
						}
					},
				}]
			};
			let myChart = new echarts.init(this.$refs[el]);
      myChart.setOption(option, true);

      window.onresize = myChart.resize;
		},
		// 漏斗图
		setFunnel(data){
			let legend = data.map(i => i.name)
			// data = [
			// 	{name: "认购客户数", value: 60, rate: "4.53", rateName: "认购转化率"},
			// 	{name: "来访客户数", value: 70, rate: "65.43", rateName: "来访转化率"},
			// 	{name: "新增客户数", value: 20, rate: "", rateName: ""},
			// 	{name: "复访客户数", value: 50, rate: "40.84", rateName: "复访率"}
			// ]
			// console.log(JSON.parse(JSON.stringify(data)))
			
			data = data.sort(compare("value"))

			function compare(property) {
				return function (a, b) {
					var value1 = a[property];
					var value2 = b[property];
					return value1 - value2;
				}
			}

			var seriesData = []
			data.forEach(function(item, index) {
				seriesData.push({
					value: data[index].value,
					name: data[index].name,
					rate: data[index].rate,
					rateName: data[index].rateName,
					label: {
						normal: {
							position: index%2==0?'left':'right',
						},
					},
				})
			})
			
			let option = {
					tooltip: { //提示框组件
            trigger: 'item',
            backgroundColor: "rgba(255,255,255,0.8)",
						color: "#666666",
						formatter: function(params) {
							if (params.name.indexOf('新增')!=-1) {
								return `${params.marker}${params.name}：${params.data.value}组<br>(来电+来访+推介报备)`
							} else {
								return `${params.marker}${params.name}：${params.data.value}组<br>${params.data.rateName}：${params.data.rate}%`
							}
						},
						// formatter: "{b} : {c}",
            extraCssText: 'box-shadow: 0 0 10px #ccc; padding: 15px;',
            borderColor: "gray", //设置边框颜色
            confine: true,
            textStyle: {
              color: "#666666", //设置文字颜色
              fontSize: 11,
            },
            axisPointer: {
              type: 'shadow',
              label: {
                backgroundColor: '#6a7985'
              }
            },
          },
					color: this.color,
					series: [{
							type: 'funnel',
							left: '30%',
							width: '40%',
							height: '90%',
							top: '5%',
							minSize: 20,
							gap: 3,
							label: {
								normal: {
									show: true,
									textStyle: {
										fontSize: 9,
									},
									formatter: function(params) {
										if (params.name.indexOf('新增')!=-1) {
											return `{a|${params.name}:${params.data.value}组\n(来电+来访+推介报备)}`
										} else {
											return `{a|${params.name}:${params.data.value}组\n${params.data.rateName}:${params.data.rate}%}`
										}
									},
									rich: {
										a: {
											color: '#666',
											fontSize: 9,
											lineHeight: 13,
										}
									}
								},
							},
							labelLine: {
								normal: {
									length: 10,
									lineStyle: {
										width: 1,
										type: 'solid'
									}
								}
							},
							itemStyle: {
								normal: {
									borderColor: '#fff',
									borderWidth: 0
								}
							},
							data: seriesData
					}]
			};

			let myChart = new echarts.init(this.$refs['chart3']);
      myChart.setOption(option, true);

      window.onresize = myChart.resize;

		},
		// 柱形图
		getACSalepersonDetailsList(){
      request({
        url: `/app-api/saleBack/ac/getACSalepersonDetailsList`,
        method: 'get',
        params: {
					orgId: this.orgId,
					timeDimension: this.actTab+1,
					mType: [5,4,3,2,1][this.actTab]
        },
      }).then(( res ) => {
				let barData = {
					name: ['来访','认购','转化率'],
					value: [
						[], // 来访
						[]  // 认购
					],
					line: [], //转换率
					xnames: [],
				}


				// let _sssdata = res.data.data.list
				// _sssdata = _sssdata.sort(compare("timeSection"))
				// function compare(property) {
				// 	return function (a, b) {
				// 		var value1 = new Date(a[property]).getTime();
				// 		var value2 = new Date(b[property]).getTime();
				// 		// return value1 - value2;  // 从小到大排序
				// 		return value2 - value1;  // 从大到小排序
				// 	}
				// }

				let _data = res.data.data.list || []
				// let _data = _sssdata || []
				barData.value[0] = _data.map( i=> i.totalVisit )
				barData.value[1] = _data.map( i=> i.orderQuantity )
				barData.line = _data.map( i=> i.transformRate )
				barData.xnames = _data.map( i=> i.timeSection )
				// res.data.list.forEach(i => {
				// 	barData.value[0]
				// })
        this.setMutileBar('近'+this.barTitle+'来访认购转化表',barData, 'bar')
      });
    },
    setMutileBar(title,data, el) {
			let _series = []
			
      for (let i = 0; i < data.name.length-1; i++) {
        const element = {
					name: data.name[i],
					type:'bar',
					data: data.value[i],
					barWidth: 15,
				}
        _series.push(element)
			}
			
			_series.push({
        name:  data.name[2],
        type: 'line',
        smooth: true,
        showAllSymbol: true,
        symbol: 'emptyCircle',
        symbolSize: 8,
        yAxisIndex: 1,
        itemStyle: {
          normal: {
            color: '#B4A36B',
          },
        },
        data: data.line,
			})
			
			let option = {
				title: [{
						text: title,
						top: '0%',
						textAlign: "center",
						left: "49%",
						textStyle: {
							fontSize: 14,
							color: '#3A3A3A',
							fontWeight: '400'
						}
				}],
				legend: {
					show: true,
					type: 'plain',
					icon: 'circle', // rect
					itemWidth: 10,
					itemHeight: 10,
					// orient: 'horizon',
					x: 'center',
					y: 'bottom',
					textStyle: {
							fontSize: 12,
							color: '#999999'
					},
					data: data.name //注：需接口获取
				},
				tooltip: { //提示框组件
					trigger: 'axis',
					backgroundColor: "rgba(255,255,255,0.8)",
					color: "#666666",
					// formatter: '{b}<br/>{a}：{c}人<br/>{a1}：{c1}人<br/>{a2}：{c2}%',
					formatter: function(params) {
						let str = params[0].name+'<br>'
						params.forEach((item,index) => {
							let unit = {
								'来访': '人',
								'认购': '套',
								'转化率': '%',
							}
							str += `${item.marker}${item.seriesName}：${item.value}${unit[item.seriesName]}<br>`
						});
						return str
					},
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
				grid: {
					'left': '4%',
					'right': '4%',
					'bottom': '12%',
					'top': '20%',
					'containLabel': true
				},
				xAxis: {
					type: 'category',
					boundaryGap: true,
					data: data.xnames,
					axisTick: {
						show: false
					},
					axisLine: {
						lineStyle: {
							color: '#E8E8E8'
						}
					},
					axisLabel: {
						show: true,
						rotate: 30,
						textStyle: {
							color: '#666666',
							fontSize: 11
						}
					}
				},
				yAxis: [{
					type: 'value',
					// name: '单位：'+ this.unit,
					nameTextStyle:{
						color:"#666666",
					},
					axisTick: {
						show: false
					},
					axisLine: {
						lineStyle: {
							color: '#E8E8E8'
						}
					},
					splitLine:{
						lineStyle: {
							color: '#E8E8E8'
						}
					},
					axisLabel: {
						show: true,
						formatter:'{value}',
						textStyle: {
							color: '#666666',
							fontSize: 11
						}
					}
				},{
					type: 'value',
					nameTextStyle:{
						color:"#666666",
					},
					axisTick: {
						show: false
					},
					axisLine: {
						lineStyle: {
							color: '#E8E8E8'
						}
					},
					splitLine:{
						lineStyle: {
							color: '#E8E8E8'
						}
					},
					axisLabel: {
						show: true,
						formatter: '{value}%',
						textStyle: {
							color: '#666666',
							fontSize: 11
						}
					}
				}],
				color: ['#006E38', '#FFC40F', '#B8A363'],
				series: _series
			};
			if (data.xnames.length > 4) {
				option.dataZoom = [{
					id: 'dataZoomX',
					type: 'inside',
					xAxisIndex: [0],
					filterMode: 'none',
					start: 0,
					minValueSpan: 3,
					maxValueSpan: 5,
					end: 4 / data.xnames.length * 100
				}]
			}
			let myChart = new echarts.init(this.$refs['bar']);
			myChart.setOption(option, true);
		},
		// 成交客户来源分析-饼状图
		getACSourceAnalysisSummary(){
			request({
				url: `/app-api/saleBack/ac/getACSourceAnalysisSummary`,
				method: 'get',
				params: {
					orgId: this.orgId,
					timeDimension: this.actTab+1,
				}
			}).then(res => {
					const _data = res.data.data || {}
					const _chartdata = [{
							name: "机构渠道",
							value: _data.institutionalOrderRate || 0
					},
					{
							name: "自然访客",
							value: _data.naturalOrderRate || 0
					},
					{
							name: "自渠",
							value: _data.selfChanelOrderRate || 0
					},
					{
							name: "老业主推介",
							value: _data.oldOwnerOrderRate || 0
					},
					{
							name: "社会人士推介",
							value: _data.socialOrderRate || 0
					},
					{
							name: "其他",
							value: _data.otherOrderRate || 0
					},
				],centerTxt = [
					{	name: '自访占', value: _data.naturalOrderRate || 0},
					{	name: '机构占', value: _data.institutionalOrderRate || 0},
					{	name: '全民营销占', value: _data.allPeopleSaleRate || 0},
				]
				this.setPie('chart4', _chartdata, '', centerTxt)
			});
		},
		// 成交客户来源分析-树结构
		getTableList2() {
      request({
				url: `/app-api/saleBack/ac/getACSourceAnalysisDetailsTreeList`,
        method: 'get',
        params: {
          orgId: this.orgId,
					root: 1,
					timeDimension: this.actTab+1,
					needBillion: this.unit=='亿'?1:0
        },
      }).then(({ data }) => {
        if (data.code === 0) {
          let _list = data.list || data.data,
            _parentOrgId = '',
						_expandNodes = [];
          for (let i = 0, len = _list.length; i < len; i++) {
            if (_list[i]['root'] == true) {
              _parentOrgId = _list[i]['parentOrgId'];
              _expandNodes.push(_list[i]['orgId']);
              break;
            }
          }

					let tree = this.fnGetTree2(_list, _parentOrgId);

          this.expandNodes2 = _expandNodes;
					this.tableActiveData2 = tree;
					
          // 重新渲染表格 防止表格错位
          this.$nextTick(() => {
            if (this.$refs['tableRef2']) {
              this.$refs['tableRef2'].doLayout();
            }
          });
        }
      });
    },
    fnGetTree2(data, parentOrgId) {
      this.level2++;
      let self = this;
      var result = [],
        temp;
      for (var i in data) {
        if (data[i].parentOrgId == parentOrgId) {
          result.push(data[i]);
          // 初始数据只返回了两级   给第三级添加模拟子节点
          if (this.level2 >= 2 && !data[i].leaf) {
            data[i].hasChildren = true;
            data[i].expan = false;
          } else {
            temp = self.fnGetTree2(data, data[i].orgId);
            if (temp.length > 0) {
              data[i].children = temp;
            }
          }
        }
      }
      return result;
    },
    load2(tree, treeNode, resolve) {
      request({
				url: `/app-api/saleBack/ac/getACSourceAnalysisDetailsTreeList`,
        method: 'get',
        params: {
          orgId: tree.orgId,
					root: 0,
					timeDimension: this.actTab+1,
					needBillion: this.unit=='亿'?1:0
        },
      }).then(({ data }) => {
        if (data && data.code === 0) {
          let _list = data.list || data.data;
          _list.forEach((item) => {
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
		// 项目层级-成交客户来源分析
		getTableList2_pj() {
			request({
				url: `/app-api/saleBack/ac/getACSourceAnalysisDetailsTableList`,
				method: 'get',
				params: {
					orgId: this.orgId,
					timeDimension: this.actTab+1,
					needBillion: this.unit=='亿'?1:0,
					root: 1
				}
			}).then(res => {
				this.tableActiveData2 = res.data.data || []
			});
		},
		// 案场销售顾问人均接待客户量-树结构
		getTableList3() {
      request({
				url: `/app-api/saleBack/ac/getACJDKHDetailsTreeList`,
        method: 'get',
        params: {
          orgId: this.orgId,
					root: 1,
					timeDimension: this.actTab+1,
					needBillion: this.unit=='亿'?1:0
        },
      }).then(({ data }) => {
        if (data.code === 0) {
          let _list = data.list || data.data,
            _parentOrgId = '',
						_expandNodes = [];
          for (let i = 0, len = _list.length; i < len; i++) {
            if (_list[i]['root'] == true) {
              _parentOrgId = _list[i]['parentOrgId'];
              _expandNodes.push(_list[i]['orgId']);
              break;
            }
          }

					let tree = this.fnGetTree3(_list, _parentOrgId);

          this.expandNodes3 = _expandNodes;
					this.tableActiveData3 = tree;
					
          // 重新渲染表格 防止表格错位
          this.$nextTick(() => {
            if (this.$refs['tableRef3']) {
              this.$refs['tableRef3'].doLayout();
            }
          });
        }
      });
    },
    fnGetTree3(data, parentOrgId) {
      this.level3++;
      let self = this;
      var result = [],
        temp;
      for (var i in data) {
        if (data[i].parentOrgId == parentOrgId) {
          result.push(data[i]);
          // 初始数据只返回了两级   给第三级添加模拟子节点
          if (this.level3 >= 2 && !data[i].leaf) {
            data[i].hasChildren = true;
            data[i].expan = false;
          } else {
            temp = self.fnGetTree3(data, data[i].orgId);
            if (temp.length > 0) {
              data[i].children = temp;
            }
          }
        }
      }
      return result;
    },
    load3(tree, treeNode, resolve) {
      request({
				url: `/app-api/saleBack/ac/getACJDKHDetailsTreeList`,
        method: 'get',
        params: {
          orgId: tree.orgId,
					root: 0,
					timeDimension: this.actTab+1,
					needBillion: this.unit=='亿'?1:0
        },
      }).then(({ data }) => {
        if (data && data.code === 0) {
          let _list = data.list || data.data;
          _list.forEach((item) => {
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
		// 项目层级-案场销售顾问人均接待客户量
		getTableList3_pj() {
			request({
				url: `/app-api/saleBack/ac/getACJDKHDetailsTableList`,
				method: 'get',
				params: {
					orgId: this.orgId,
					timeDimension: this.actTab+1,
					needBillion: this.unit=='亿'?1:0,
					root: 1
				}
			}).then(res => {
				this.tableActiveData3 = res.data.data || []
			});
		},
		// 案场销售顾问人均接待客户量-指标
		getACJDKHDetails() {
			request({
				url: `/app-api/saleBack/ac/getACJDKHDetails`,
				method: 'get',
				params: {
					orgId: this.orgId,
					timeDimension: this.actTab+1,
				}
			}).then(res => {
				this.salesDetail = res.data.data || {}
			});
		},
		// 逾期签约监控/逾期回款监控
		getMergeTable1() {
			this.spanArr1 = []
			this.position1 = 0
			this.mergeTableList1 = []
			request({
				url: `/app-api/saleBack/ac/getACLateSummaryList`,
				method: 'get',
				params: {
					orgId: this.orgId,
					timeDimension: this.actTab+1,
					needBillion: this.unit=='亿'?1:0,
					totalCount: 1
				}
			}).then(res => {
				this.mergeTableList1 = res.data.data || []
				this.rowspan1()
			});
		},
		rowspan1() {
			this.mergeTableList1.forEach((item,index) => {
				if( index === 0){
					this.spanArr1.push(1);
					this.position1 = 0;
				}else{
					if(this.mergeTableList1[index].orgName === this.mergeTableList1[index-1].orgName ){
						this.spanArr1[this.position1] += 1;
						this.spanArr1.push(0);
					}else{
						this.spanArr1.push(1);
						this.position1 = index;
					}
				}
			})
		},
		objectSpanMethod1({ row, column, rowIndex, columnIndex }) {
			if (columnIndex === 0) {
				const _row = this.spanArr1[rowIndex];
				const _col = _row>0 ? 1 : 0;
				return {
					rowspan: _row,
					colspan: _col
				}
			}
		},
		// 退房异常监控
		getMergeTable2() {
			this.spanArr2 = []
			this.position2 = 0
			this.mergeTableList2 = []
			request({
				url: `/app-api/saleBack/ac/getACCancelRoomSummaryList`,
				method: 'get',
				params: {
					orgId: this.orgId,
					timeDimension: this.actTab+1,
					needBillion: this.unit=='亿'?1:0,
					totalCount: 1
				}
			}).then(res => {
				this.mergeTableList2 = res.data.data || []
				this.rowspan2()
			});
		},
		rowspan2() {
			this.mergeTableList2.forEach((item,index) => {
				if( index === 0){
					this.spanArr2.push(1);
					this.position2 = 0;
				}else{
					if(this.mergeTableList2[index].orgName === this.mergeTableList2[index-1].orgName ){
						this.spanArr2[this.position2] += 1;
						this.spanArr2.push(0);
					}else{
						this.spanArr2.push(1);
						this.position2 = index;
					}
				}
			})
		},
		objectSpanMethod2({ row, column, rowIndex, columnIndex }) {
			if (columnIndex === 0) {
				const _row = this.spanArr2[rowIndex];
				const _col = _row>0 ? 1 : 0;
				return {
					rowspan: _row,
					colspan: _col
				}
			}
		},
		// 更名异常监控
		getMergeTable3() {
			this.spanArr3 = []
			this.position3 = 0
			this.mergeTableList3 = []
			request({
				url: `/app-api/saleBack/ac/getACChangeRightSummaryList`,
				method: 'get',
				params: {
					orgId: this.orgId,
					timeDimension: this.actTab+1,
					needBillion: this.unit=='亿'?1:0,
					totalCount: 1
				}
			}).then(res => {
				this.mergeTableList3 = res.data.data || []
				this.rowspan3()
			});
		},
		rowspan3() {
			this.mergeTableList3.forEach((item,index) => {
				if( index === 0){
					this.spanArr3.push(1);
					this.position3 = 0;
				}else{
					if(this.mergeTableList3[index].orgName === this.mergeTableList3[index-1].orgName ){
						this.spanArr3[this.position3] += 1;
						this.spanArr3.push(0);
					}else{
						this.spanArr3.push(1);
						this.position3 = index;
					}
				}
			})
		},
		objectSpanMethod3({ row, column, rowIndex, columnIndex }) {
			if (columnIndex === 0) {
				const _row = this.spanArr3[rowIndex];
				const _col = _row>0 ? 1 : 0;
				return {
					rowspan: _row,
					colspan: _col
				}
			}
		},
  },
  components: {
    [List.name]: List,
    [PullRefresh.name]: PullRefresh,
    [Sticky.name]: Sticky,
    [Tab.name]: Tab,
		[Tabs.name]: Tabs,
		[Row.name]: Row,
    [Col.name]: Col,
    Toast,
  },
};
</script>


<style lang="scss" scoped>
.more {
  font-size: 12px;
  color: #666666;
  float: right;
  margin-top: 12px;
  &.up {
    color: #209b5c;
  }
}
.data-content-panel{
	padding: 20px 0;
	.vanTabs{
		width: 90%;
		margin: 0 auto;
	}
}
.data-content-panel /deep/ .van-tabs__nav--card {
  border-radius: 5px;
}
.targetBox1{
	font-size: 12px;
	color: #006E38;
	text-align: center;
	width: 90%;
	margin: 10px auto;
	overflow: hidden;
	.targetVal{
		margin-top: 5px;
		font-size: 24px;
		/deep/ span{
			font-size: 11px;
		}
	}
}
.targetBox2{
	font-size: 12px;
	color: #999999;
	text-align: center;
	width: 100%;
	margin: 25px auto;
	overflow: hidden;
	.targetVal{
		margin-top: 5px;
		color: #333;
		position: relative;
		font-size: 11px;
		span{
			color: #006E38;
		}
	}
}
.section{
	padding: 0 15px;
}
.huojv-chart-box-item{
	margin: 20px auto;
}
.section{
	position: relative;
}
.position{
	position: absolute;
	top: 12%;
	right: 4%;
	z-index: 2;
}
.tableDesc{
	font-size: 13.5px;
	color: #006E38;
	span{
		color: #FE0909;
	}
}
.tableTitle{
	font-size: 14px;
	color: #333333;
	text-align: center;
}
 span.huojv-arrow-down-s{
	color: red;
}
.report-index /deep/ .colorRed:first-child{
    color: red !important;
}
.toggleBox{
	overflow: hidden;
}
// /deep/ .el-table th.is-hidden>*, /deep/ .el-table td.is-hidden>* {
// 	visibility: visible
// }
// .spanMethodTable /deep/ .el-table__fixed{
// 	width: 100px !important;
// }
</style>
