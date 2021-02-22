<template>
	<div class="detail-panel height100 white-bg">
		<van-nav-bar
				style="position: fixed; top: 0; width: 100%;"
				:title="title"
				left-arrow
				@click-left="onClickLeft"
				v-eventlisten="{isChangePage:true,pageEvent:'点击返回按钮'}"
		/>

		<div class="padding-nav">
			<div class="detail-table-panel" v-if="pageType==1" :key="pageType">
			<el-table stripe
						class="huo-list-table tree-table mt-10" ref="tableRef11" size="mini"
						highlight-current-row  row-class-name="colorRed"
						:data="tableActiveData">
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
			</div>
			<div class="detail-table-panel" v-else-if="pageType==2"  :key="pageType">
				<el-table stripe :max-height="tbHeight"
							class="huo-list-table tree-table mt-10" ref="tableRefTree" size="mini"
							highlight-current-row  row-class-name="colorRed"
							row-key="orgId"
							:data="tableActiveDataTree"
							:expand-row-keys="expandNodes"
							border :indent="5"
							lazy :load="load"
							:tree-props="{children: 'children', hasChildren: 'hasChildren'}">
						<el-table-column property="orgName" label="组织架构" width="120" fixed>
							<template slot-scope="scope">
								<span v-if="scope.row.orgType==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,scope.row.orgType)">{{scope.row.orgName}}</span>
								<span v-else>{{scope.row.orgName}}</span>
							</template>
						</el-table-column>
						<template v-for="(item,index) in tableHeaderList">
							<el-table-column :key="item" :property="'val'+(index+1)" :label="item" align="center">
								<template slot-scope="scope">
									<span v-if="scope.row['type'+(index+1)]==2" :data-prop="'val'+(index+1)" :data-type="scope.row['type'+(index+1)]">{{scope.row['val'+(index+1)]}}%</span>
									<span v-else :data-prop="'val'+(index+1)"  :data-type="scope.row['type'+(index+1)]">{{scope.row['val'+(index+1)]}}</span>
								</template>
							</el-table-column>
						</template>
				</el-table>
			</div>
			<div class="detail-table-panel" v-else-if="pageType==3"  :key="pageType">
				<van-sticky class="cost-contract-title" offset-top="45">
					<div class="" style="padding-bottom: 0; background: #fff">
						<el-table stripe 
								class="huo-list-table main-theme-table huojv-data-list huojv-sortable list-title"
								ref="tableRef3" size="mini"
								highlight-current-row
								:data="[]">
							<el-table-column property="newCustomerName" :label="`${titleType}新增客户`" align="center" width="100">
								<template slot-scope="scope">{{scope.row.newCustomerName| changeEmpty}}</template>
							</el-table-column>
							<el-table-column property="saleperson" label="客户归属" align="center" width="100">
								<template slot-scope="scope">{{scope.row.saleperson| changeEmpty}}</template>
							</el-table-column>
							<el-table-column property="source" label="客户来源" align="center" width="100">
								<template slot-scope="scope">{{scope.row.source| changeEmpty}}</template>
							</el-table-column>
							<el-table-column property="totalVisit" label="来访次数(次)" align="center" width="100">
								<template slot-scope="scope">{{scope.row.totalVisit| changeEmpty}}</template>
							</el-table-column>
							<el-table-column property="customerIntention" label="客户意向度" align="center">
								<template slot-scope="scope">{{scope.row.customerIntention| changeEmpty}}</template>
							</el-table-column>
							<el-table-column property="lastestStatus" label="最新状态" align="center">
								<template slot-scope="scope">{{scope.row.lastestStatus| changeEmpty}}</template>
							</el-table-column>
						</el-table>
					</div>
				</van-sticky>
				<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
					<el-table stripe
							class="huo-list-table main-theme-table huojv-data-list huojv-sortable list-title"
							ref="tableRef3" size="mini"
							:show-header="false"  row-class-name="colorRed"
							highlight-current-row
							:data="tableList">
						<el-table-column property="newCustomerName" :label="`${titleType}新增客户`" align="center" width="100">
							<template slot-scope="scope">{{scope.row.newCustomerName| changeEmpty}}</template>
						</el-table-column>
						<el-table-column property="saleperson" label="客户归属" align="center" width="100">
							<template slot-scope="scope">{{scope.row.saleperson| changeEmpty}}</template>
						</el-table-column>
						<el-table-column property="source" label="客户来源" align="center" width="100">
							<template slot-scope="scope">{{scope.row.source| changeEmpty}}</template>
						</el-table-column>
						<el-table-column property="totalVisit" label="来访次数(次)" align="center" width="100">
							<template slot-scope="scope">{{scope.row.totalVisit| changeEmpty}}</template>
						</el-table-column>
						<el-table-column property="customerIntention" label="客户意向度" align="center">
							<template slot-scope="scope">{{scope.row.customerIntention| changeEmpty}}</template>
						</el-table-column>
						<el-table-column property="lastestStatus" label="最新状态" align="center">
							<template slot-scope="scope">{{scope.row.lastestStatus| changeEmpty}}</template>
						</el-table-column>
					</el-table>
				</van-list>
			</div>
			<div class="detail-table-panel" v-else-if="pageType==4" :key="pageType">
				<el-table stripe :max-height="tbHeight"
							class="huo-list-table tree-table mt-30" ref="tableRef2" size="mini"
							highlight-current-row  row-class-name="colorRed"
							:data="tableActiveData">
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
			</div>
			<div class="detail-table-panel" v-else-if="pageType==5" :key="pageType">
				<el-table stripe
							class="huo-list-table tree-table mt-20" ref="tableRef3" size="mini"
							highlight-current-row row-class-name="colorRed"
							:data="tableActiveData">
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
			</div>
			<div class="detail-table-panel spanMethodTable" v-else-if="pageType==6" :key="pageType">
				<el-table	stripe :max-height="tbHeight"
						class="huo-list-table main-theme-table huojv-data-list2 rowspanTable mt-20"
						ref="tableRef4" size="mini"
						:data="mergeTableList" row-class-name="colorRed"
						:span-method="objectSpanMethod"
						>
						<el-table-column property="" label="逾期签约账龄" align="center" >
							<el-table-column property="orgName" label="组织架构" align="center" width="100">
								<template slot-scope="scope">
									<span v-if="scope.row.orgType==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,scope.row.orgType)">{{scope.row.orgName}}</span>
									<span v-else>{{scope.row.orgName}}</span>
								</template>
							</el-table-column>
							<el-table-column property="lateDaySectionDescription" label="逾期时间" align="center" width="100">
								<template slot-scope="scope">{{scope.row.lateDaySectionDescription| changeEmpty}}</template>
							</el-table-column>
						</el-table-column>
						<el-table-column property="" label="本月" align="center">
							<el-table-column property="lateContract_months" label="逾期套数(套)" align="center">
								<template slot-scope="scope">{{scope.row.lateContract_months| changeEmpty}}</template>
							</el-table-column>
							<el-table-column property="lateFeeAmount_months" :label="`逾期金额(万)`" align="center">
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
							<el-table-column property="lateFeeAmount_seasons" :label="`逾期金额(万)`" align="center">
								<template slot-scope="scope">{{scope.row.lateFeeAmount_seasons| changeEmpty}}</template>
							</el-table-column>
							<el-table-column property="lateContractOrderQuantity_seasons" label="本季度累计逾期套数/本季度总认购套数" align="center">
								<template slot-scope="scope">{{scope.row.lateContractOrderQuantity_seasons| changeEmpty('%')}}</template>
								<!-- <template slot-scope="scope">{{scope.row.lateContractOrderQuantity_seasons?scope.row.lateContractOrderQuantity_seasons+'%':'-'}}</template> -->
							</el-table-column>
						</el-table-column>
						<el-table-column property="" label="本年" align="center">
							<el-table-column property="lateContract_year" label="逾期套数(套)" align="center">
								<template slot-scope="scope">{{scope.row.lateContract_year| changeEmpty}}</template>
							</el-table-column>
							<el-table-column property="lateFeeAmount_year" :label="`逾期金额(亿)`" align="center">
								<template slot-scope="scope">{{scope.row.lateFeeAmount_year| changeEmpty}}</template>
							</el-table-column>
							<el-table-column property="lateContractOrderQuantity_year" label="本年累计逾期套数/本年总认购套数" align="center">
								<template slot-scope="scope">{{scope.row.lateContractOrderQuantity_year| changeEmpty('%')}}</template>
								<!-- <template slot-scope="scope">{{scope.row.lateContractOrderQuantity_year?scope.row.lateContractOrderQuantity_year+'%':'-'}}</template> -->
							</el-table-column>
						</el-table-column>
				</el-table>
			</div>
			<div class="detail-table-panel" v-else-if="pageType==7" :key="pageType">
				<el-table	stripe :max-height="tbHeight"
						class="huo-list-table main-theme-table huojv-data-list2 rowspanTable mt-20"
						ref="tableRef5" size="mini"
						:data="mergeTableList" row-class-name="colorRed"
						:span-method="objectSpanMethod"
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
			</div>
			<div class="detail-table-panel" v-else-if="pageType==8" :key="pageType">
				<el-table	stripe :max-height="tbHeight"
						class="huo-list-table main-theme-table huojv-data-list2 rowspanTable mt-20"
						ref="tableRef6" size="mini"
						:data="mergeTableList" row-class-name="colorRed"
						:span-method="objectSpanMethod"
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
			</div>
			<div class="detail-table-panel" v-else-if="pageType==9" :key="pageType">
				<el-table	stripe :max-height="tbHeight"
						class="huo-list-table main-theme-table huojv-data-list2 rowspanTable mt-20"
						ref="tableRef4" size="mini"
						:data="mergeTableList" row-class-name="colorRed"
						:span-method="objectSpanMethod"
						>
						<el-table-column property="" label="逾期签约账龄" align="center" >
							<el-table-column property="orgName" label="组织架构" align="center" width="100">
								<template slot-scope="scope">
									<span v-if="scope.row.orgType==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,scope.row.orgType)">{{scope.row.orgName}}</span>
									<span v-else>{{scope.row.orgName}}</span>
								</template>
							</el-table-column>
							<el-table-column property="lateDaySectionDescription" label="逾期时间" align="center" width="100">
								<template slot-scope="scope">{{scope.row.lateDaySectionDescription| changeEmpty}}</template>
							</el-table-column>
						</el-table-column>
						<el-table-column property="" label="本月" align="center">
							<el-table-column property="lateContract_months" label="逾期套数(套)" align="center">
								<template slot-scope="scope">{{scope.row.lateContract_months| changeEmpty}}</template>
							</el-table-column>
							<el-table-column property="lateFeeAmount_months" :label="`逾期金额(万)`" align="center">
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
							<el-table-column property="lateFeeAmount_seasons" :label="`逾期金额(万)`" align="center">
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
							<el-table-column property="lateFeeAmount_year" :label="`逾期金额(亿)`" align="center">
								<template slot-scope="scope">{{scope.row.lateFeeAmount_year| changeEmpty}}</template>
							</el-table-column>
							<el-table-column property="lateContractNoFullFee_year" label="本年逾期套数/未齐款总套数" align="center">
								<template slot-scope="scope">{{scope.row.lateContractNoFullFee_year| changeEmpty('%')}}</template>
								<!-- <template slot-scope="scope">{{scope.row.lateContractNoFullFee_year?scope.row.lateContractNoFullFee_year+'%':'-'}}</template> -->
							</el-table-column>
						</el-table-column>
					</el-table>
			</div>
		</div>
	</div>
</template>

<script>
import scrollFixed from '@/mixin/scroll-fixed';
import {List, PullRefresh,NavBar,Sticky} from 'vant';
import $ from 'jquery';
import request from '@/utils/request';
import { jumpToPj } from '@/utils/common'

export default {
	mixins: [scrollFixed],
	data() {
		return {
			level: 0,
			expandNodes: [],
			tableActiveDataTree: [],
			tableActiveData1_pj: [],

			tableActiveData: [],
			title: '',
			unit: '',
			orgType: '',
			orgId: '',
			titleType: '',
			timeDimension: '',
			pageType: 1,
			barTitle: '',
			tableHeaderList: [],
			current: 1,
			size: 10,
			tableList: [],
			loading: false, //上拉加载
			isLoading: false, //下拉刷新,从第一页开始
			isLoad: false,
			finished: false, //下拉加载完,如果没有数据设置true
			spanArr: [],
			position: 0,
			mergeTableList: [],
			tbHeight: 500,
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
		this.orgId = this.$route.query.orgId
		this.orgType = this.$route.query.orgType
		this.title = this.$route.query.title
		this.timeDimension = this.$route.query.timeDimension
		this.pageType = this.$route.query.pageType

		this.unit = this.orgType < 5? '亿': '万'
		this.titleType = ['本日','本周','本月','本季度','本年'][this.timeDimension-1]
		this.barTitle = ['30天', '30周', '24个月', '8个季度', '2年'][this.timeDimension-1]

		this.tbHeight = window.innerHeight-100
		

		if (this.pageType==1) {	// 客储情况
			this.getTableList1_pj()
		} else if (this.pageType==2) {	// 来访转化率
			this.getTableList()
		} else if(this.pageType==3){	// 客户转化漏斗
			// this.getACCustomerDetailsList()
		} else if(this.pageType==4){	// 成交客户来源分析
			this.getTableList2_pj()
		} else if(this.pageType==5){	// 案场销售顾问人均接待客户量
			this.getTableList3_pj()
		} else if(this.pageType==6){	// 逾期签约监控
			this.getMergeTable(`/app-api/saleBack/ac/getACLateSummaryList`)
		}  else if(this.pageType==7){	// 退房异常监控
			this.getMergeTable(`/app-api/saleBack/ac/getACCancelRoomSummaryList`)
		}  else if(this.pageType==8){	// 更名异常监控
			this.getMergeTable(`/app-api/saleBack/ac/getACChangeRightSummaryList`)
		}  else if(this.pageType==9){	// 逾期回款监控
			this.getMergeTable(`/app-api/saleBack/ac/getACLateSummaryList`)
		}

		this.$nextTick(() => {
      $('.el-table__header-wrapper').scroll(function () {
        let scrollLeft = $(this).scrollLeft();
        $(this).next().scrollLeft(scrollLeft);
      });

      $('.el-table__fixed-body-wrapper').scroll(function () {
        let scrollTop = $(this).scrollTop();
        $(this).parent().prev().scrollTop(scrollTop);
			});
			$('.el-table__header-wrapper').scroll(function () {
					let scrollLeft = $(this).scrollLeft();
					$('.el-table__body-wrapper').scrollLeft(scrollLeft);
			});

			$(".el-table__body-wrapper").scroll(function () {
					let scrollLeft = $(this).scrollLeft();
					$('.el-table__header-wrapper').scrollLeft(scrollLeft);
			})
    });
		
	},
	methods: {
		jumpToPj,
		reloadWindow(){
			setTimeout(() => {
				window.location.reload();
				this.isLoading = false;
			},500)
		},
		onClickLeft() {
			window.history.go(-1);
		},
		getTableList2_pj() {
			request({
				url: `/app-api/saleBack/ac/getACSourceAnalysisDetailsTableList`,
				method: 'get',
				params: {
					orgId: this.orgId,
					timeDimension: this.timeDimension,
					root: 1,
					needBillion: this.unit=='亿'?1:0
				}
			}).then(res => {
				this.tableActiveData = res.data.data || []
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
					timeDimension: this.timeDimension,
					needBillion: this.unit=='亿'?1:0
				}
			}).then(res => {
				this.tableActiveData = res.data.data || []
			});
		},
		// 案场销售顾问人均接待客户量
		getTableList3_pj() {
			request({
				url: `/app-api/saleBack/ac/getACJDKHDetailsTableList`,
				method: 'get',
				params: {
					orgId: this.orgId,
					timeDimension: this.timeDimension,
					root: 1,
					needBillion: this.unit=='亿'?1:0
				}
			}).then(res => {
				this.tableActiveData = res.data.data || []
			});
		},
		// 来访转化率
		getTableList() {
      request({
				url: `/app-api/saleBack/ac/getACSalepersonDetailsListTreeList`,
        method: 'get',
        params: {
          orgId: this.orgId,
					root: 1,
					mType: [5,4,3,2,1][this.timeDimension-1],
					// 1 近2年，2 近8个季度，3 近24个月，4 近30周，5 近30天
					timeDimension: this.timeDimension,
					needBillion: this.unit=='亿'?1:0
        },
      }).then(({ data }) => {
        if (data.code === 0) {

					// 初始化表头
					this.tableHeaderList = []
					let tbunit = ['(套)','(人)','']
					for (let i = 0; i < data.data.headerList.length; i++) {
						const item = data.data.headerList[i]
						// 日和周，前三个不用添加文案
						const idx = this.timeDimension<3?3:0 
						if (i>=idx) {
							this.tableHeaderList = this.tableHeaderList.concat([item+'认购套数(套)', item+'来访人数(人)', item+'转化率'])
						} else {
							this.tableHeaderList.push(item+tbunit[i])
						}
					}

					let _list = data.data.tableList || [],
						_parentOrgId = '',
						_expandNodes = [];
					for (let i = 0, len = _list.length; i < len; i++) {
						if (_list[i]['root'] == true) {
							_parentOrgId = _list[i]['parentOrgId'];
							_expandNodes.push(_list[i]['orgId']);
							break;
						}
					}

					let tree = this.fnGetTree(_list, _parentOrgId);

					this.expandNodes = _expandNodes;
					this.tableActiveDataTree = tree;

					// 重新渲染表格 防止表格错位
					this.$nextTick(() => {
						if (this.$refs['tableRefTree']) {
							this.$refs['tableRefTree'].doLayout();
						}
					});
        }
      });
		},
		fnGetTree(data, parentOrgId) {
      this.level++;
      let self = this;
      var result = [],
        temp;
      for (var i in data) {
				console.log(data[i].parentOrgId, '_'+parentOrgId)
        if (data[i].parentOrgId == parentOrgId) {
          result.push(data[i]);
          // 初始数据只返回了两级   给第三级添加模拟子节点
          if (this.level >= 2 && !data[i].leaf) {
            data[i].hasChildren = true;
            data[i].expan = false;
          } else {
            temp = self.fnGetTree(data, data[i].orgId);
            if (temp.length > 0) {
              data[i].children = temp;
            }
          }
        }
      }
      return result;
    },
    load(tree, treeNode, resolve) {
      request({
				url: `/app-api/saleBack/ac/getACSalepersonDetailsListTreeList`,
        method: 'get',
        params: {
          orgId: tree.orgId,
					root: 0,
					mType: [5,4,3,2,1][this.timeDimension-1],
					// 1 近2年，2 近8个季度，3 近24个月，4 近30周，5 近30天
					timeDimension: this.timeDimension,
					needBillion: this.unit=='亿'?1:0
        },
      }).then(({ data }) => {
        if (data && data.code === 0) {
          let _list = data.data.tableList
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
		// 漏斗表格
		setTableData(isRefresh) {
			request({
				url: `/app-api/saleBack/ac/getACCustomerDetailsList`,
				method: 'get',
				params: {
					orgId: this.orgId,
					timeDimension: this.timeDimension,
					current:  this.current,
					size: this.size,
				}
			}).then(({ data }) => {
				// data = {
				// 		"msg": "success",
				// 		"code": 0,
				// 		"data": {
				// 			"records": [],
				// 			"total": 33,
				// 			"size": 10,
				// 			"current": 1,
				// 			"orders": [],
				// 			"hitCount": false,
				// 			"searchCount": true,
				// 			"pages": 1
				// 		}
				// 	}

				// 	if (this.current<=2) {
				// 		data.data.records = [
				// 				{"orgId": "11B11DB4-E907-4F1F-8835-B9DAAB6E1F23", "orgName": "奥园集团","orgType": 2, "timeDimension": 1,"newCustomerName": "测试名称","saleperson": "测试顾问", "source": "测试客户来源","totalVisit": 34279,"customerIntention": "测试客户意向度","lastestStatus": "测试认购"},
				// 				{"orgId": "11B11DB4-E907-4F1F-8835-B9DAAB6E1F23", "orgName": "奥园集团","orgType": 2, "timeDimension": 1,"newCustomerName": "测试名称","saleperson": "测试顾问", "source": "测试客户来源","totalVisit": 34279,"customerIntention": "测试客户意向度","lastestStatus": "测试认购"},
				// 				{"orgId": "11B11DB4-E907-4F1F-8835-B9DAAB6E1F23", "orgName": "奥园集团","orgType": 2, "timeDimension": 1,"newCustomerName": "测试名称","saleperson": "测试顾问", "source": "测试客户来源","totalVisit": 34279,"customerIntention": "测试客户意向度","lastestStatus": "测试认购"},
				// 				{"orgId": "11B11DB4-E907-4F1F-8835-B9DAAB6E1F23", "orgName": "奥园集团","orgType": 2, "timeDimension": 1,"newCustomerName": "测试名称","saleperson": "测试顾问", "source": "测试客户来源","totalVisit": 34279,"customerIntention": "测试客户意向度","lastestStatus": "测试认购"},
				// 				{"orgId": "11B11DB4-E907-4F1F-8835-B9DAAB6E1F23", "orgName": "奥园集团","orgType": 2, "timeDimension": 1,"newCustomerName": "测试名称","saleperson": "测试顾问", "source": "测试客户来源","totalVisit": 34279,"customerIntention": "测试客户意向度","lastestStatus": "测试认购"},
				// 				{"orgId": "11B11DB4-E907-4F1F-8835-B9DAAB6E1F23", "orgName": "奥园集团","orgType": 2, "timeDimension": 1,"newCustomerName": "测试名称","saleperson": "测试顾问", "source": "测试客户来源","totalVisit": 34279,"customerIntention": "测试客户意向度","lastestStatus": "测试认购"},
				// 				{"orgId": "11B11DB4-E907-4F1F-8835-B9DAAB6E1F23", "orgName": "奥园集团","orgType": 2, "timeDimension": 1,"newCustomerName": "测试名称","saleperson": "测试顾问", "source": "测试客户来源","totalVisit": 34279,"customerIntention": "测试客户意向度","lastestStatus": "测试认购"},
				// 				{"orgId": "11B11DB4-E907-4F1F-8835-B9DAAB6E1F23", "orgName": "奥园集团","orgType": 2, "timeDimension": 1,"newCustomerName": "测试名称","saleperson": "测试顾问", "source": "测试客户来源","totalVisit": 34279,"customerIntention": "测试客户意向度","lastestStatus": "测试认购"},
				// 				{"orgId": "11B11DB4-E907-4F1F-8835-B9DAAB6E1F23", "orgName": "奥园集团","orgType": 2, "timeDimension": 1,"newCustomerName": "测试名称","saleperson": "测试顾问", "source": "测试客户来源","totalVisit": 34279,"customerIntention": "测试客户意向度","lastestStatus": "测试认购"},
				// 				{"orgId": "11B11DB4-E907-4F1F-8835-B9DAAB6E1F23", "orgName": "奥园集团","orgType": 2, "timeDimension": 1,"newCustomerName": "测试名称","saleperson": "测试顾问", "source": "测试客户来源","totalVisit": 34279,"customerIntention": "测试客户意向度","lastestStatus": "测试认购"}
				// 			]
				// 	} else {
				// 		data.data.records = [
				// 				{"orgId": "11B11DB4-E907-4F1F-8835-B9DAAB6E1F23", "orgName": "奥园集团","orgType": 2, "timeDimension": 1,"newCustomerName": "测试名称","saleperson": "测试顾问", "source": "测试客户来源","totalVisit": 34279,"customerIntention": "测试客户意向度","lastestStatus": "测试认购"},
				// 				{"orgId": "11B11DB4-E907-4F1F-8835-B9DAAB6E1F23", "orgName": "奥园集团","orgType": 2, "timeDimension": 1,"newCustomerName": "测试名称","saleperson": "测试顾问", "source": "测试客户来源","totalVisit": 34279,"customerIntention": "测试客户意向度","lastestStatus": "测试认购"},
				// 				{"orgId": "11B11DB4-E907-4F1F-8835-B9DAAB6E1F23", "orgName": "奥园集团","orgType": 2, "timeDimension": 1,"newCustomerName": "测试名称","saleperson": "测试顾问", "source": "测试客户来源","totalVisit": 34279,"customerIntention": "测试客户意向度","lastestStatus": "测试认购"}
				// 			]
				// 	}
				if (data.code == 0) {
					this.tableList = isRefresh ? data.data.records : this.tableList.concat(data.data.records);
					this.loading = false;
					this.isLoading = false;
					this.isLoad = false;

					if (null == data.data || data.data.records.length < this.size || this.tableList.length >= data.data.total) {
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
			});
		},
		onLoad() {
			if (this.isLoad) return;
			this.isLoad = true;
			this.setTableData();
		},
		getMergeTable(_url) {
			this.spanArr = []
			this.position = 0
			this.mergeTableList = []
			request({
				url: _url,
				method: 'get',
				params: {
					orgId: this.orgId,
					timeDimension: this.timeDimension,
					totalCount: 1
				}
			}).then(res => {
				this.mergeTableList = res.data.data || []
				this.rowspan()
			});
		},
		rowspan() {
			this.mergeTableList.forEach((item,index) => {
				if( index === 0){
					this.spanArr.push(1);
					this.position = 0;
				}else{
					if(this.mergeTableList[index].orgName === this.mergeTableList[index-1].orgName ){
						this.spanArr[this.position] += 1;
						this.spanArr.push(0);
					}else{
						this.spanArr.push(1);
						this.position = index;
					}
				}
			})
		},
		objectSpanMethod({ row, column, rowIndex, columnIndex }) {
			if (columnIndex === 0) {
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
		[NavBar.name]: NavBar,
		[List.name]: List,
		[PullRefresh.name]: PullRefresh,
		[Sticky.name]: Sticky,
	}
};
</script>

<style lang="scss" scoped>
.detail-table-panel /deep/ .van-sticky--fixed>div{
  padding-top: 10px;
}
.detail-table-panel /deep/ .van-sticky--fixed{
  left: 14px;
  right: 14px;
  margin: 0 auto;
  background: white;
}
.four-cols li{
  font-size: 10px;
}
.detail-panel /deep/ .colorRed:first-child{
    color: red !important;
}
// .spanMethodTable /deep/ .el-table__fixed{
// 	width: 100px !important;
// }
</style>
