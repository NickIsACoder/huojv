<template>
	<div class="detail-panel height100 white-bg">
		<van-nav-bar
				style="position: fixed; top: 0; width: 100%;"
				:title="orgName + pageTitle"
				left-arrow
				@click-left="onClickLeft"
				v-eventlisten="{isChangePage:true,pageEvent:'点击返回按钮'}"
		/>

		<div class="padding-nav" v-show="pageType == 1">
			<van-sticky class="has-nav-sticky">
				<div class="detail-table-panel list-title1" style="padding-bottom: 0; padding-top: 0;">
					<el-table stripe
					          class="huo-list-table main-theme-table huojv-data-list not-hide-text" size="mini"
					          highlight-current-row
					          :data="emptyArray">
						<el-table-column prop="orgName" label="组织架构" width="80" align="center">
							<template slot-scope="scope">
								<span v-if="scope.row.orgType==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,6)">{{scope.row.orgName}}</span>
								<span v-else>{{scope.row.orgName}}</span>
							</template>
						</el-table-column>
						<el-table-column label="本季度调价幅度" align="center">
							<el-table-column prop="reasonAdjustmentTs" label="调价套数" width="70" align="center">
								<template slot-scope="scope">
									<div class="text-center" :class="[scope.row.index === 0 ? 'font-bold' : '']">{{(scope.row.reasonAdjustmentTs || '-')}}</div>
								</template>
							</el-table-column>
							<el-table-column prop="reasonAdjustmentAmount" :label="'货值变动'+unit" width="80" align="center">
								<template slot-scope="scope">
									<div class="text-center" :class="[scope.row.index === 0 ? 'font-bold' : '']">{{(scope.row.reasonAdjustmentAmount || '-')}}</div>
								</template>
							</el-table-column>
							<el-table-column prop="reasonAdjustmentCount" label="调价频次" width="70" align="center">
								<template slot-scope="scope">
									<div class="text-center" :class="[scope.row.index === 0 ? 'font-bold' : '']">{{(scope.row.reasonAdjustmentCount || '-')}}</div>
								</template>
							</el-table-column>
							<el-table-column prop="reasonAdjustmentRange" label="调价幅度(%)" width="80" align="center">
								<template slot="header" slot-scope="scope">
									<div @click="sortData('reasonAdjustmentRange',1,'ASC')">
										<span>调价幅度(%)</span>
										<label class="table-sort-ico">
											<i :class="[sortColumn1 == 'reasonAdjustmentRange' && sortType1 === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
											<i :class="[sortColumn1 == 'reasonAdjustmentRange' && sortType1 === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
										</label>
									</div>
								</template>

								<template slot-scope="scope">
									<div class="text-center red-color" :class="[scope.row.index === 0 ? 'font-bold' : '']">{{(scope.row.reasonAdjustmentRange > 0 ? '上浮' : (parseFloat(scope.row.reasonAdjustmentRange) == 0 ? '' : '下调')) + (getAbsoluteVal(scope.row.reasonAdjustmentRange) || '-') + '%'}}</div>
								</template>
							</el-table-column>
							<el-table-column prop="reasonAdjustmentContractTs" label="调价后本期成交套数" width="75" align="center">
								<template slot-scope="scope">
									<div class="text-center" :class="[scope.row.index === 0 ? 'font-bold' : '']">{{(scope.row.reasonAdjustmentContractTs || '-')}}</div>
								</template>
							</el-table-column>
							<el-table-column prop="reasonAdjustmentContractAmount" :label="'调价后本期成交金额'+unit" width="85" align="center">
								<template slot-scope="scope">
									<div class="text-center" :class="[scope.row.index === 0 ? 'font-bold' : '']">{{(scope.row.reasonAdjustmentContractAmount || '-')}}</div>
								</template>
							</el-table-column>
						</el-table-column>
						<el-table-column label="本年调价幅度" align="center">
							<el-table-column prop="yearAdjustmentTs" label="调价套数" width="70" align="center">
								<template slot-scope="scope">
									<div class="text-center" :class="[scope.row.index === 0 ? 'font-bold' : '']">{{(scope.row.yearAdjustmentTs || '-')}}</div>
								</template>
							</el-table-column>
							<el-table-column prop="yearAdjustmentAmount" :label="'货值变动'+unit" width="80" align="center">
								<template slot-scope="scope">
									<div class="text-center" :class="[scope.row.index === 0 ? 'font-bold' : '']">{{(scope.row.yearAdjustmentAmount || '-')}}</div>
								</template>
							</el-table-column>
							<el-table-column prop="yearAdjustmentCount" label="调价频次" width="70" align="center">
								<template slot-scope="scope">
									<div class="text-center" :class="[scope.row.index === 0 ? 'font-bold' : '']">{{(scope.row.yearAdjustmentCount || '-')}}</div>
								</template>
							</el-table-column>
							<el-table-column prop="yearAdjustmentRange" label="调价幅度(%)" width="70" align="center">
								<template slot="header" slot-scope="scope">
									<div @click="sortData('yearAdjustmentRange',1,'ASC')">
										<span>调价幅度(%)</span>
										<label class="table-sort-ico">
											<i :class="[sortColumn1 == 'yearAdjustmentRange' && sortType1 === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
											<i :class="[sortColumn1 == 'yearAdjustmentRange' && sortType1 === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
										</label>
									</div>
								</template>
								<template slot-scope="scope">
									<div class="text-center red-color" :class="[scope.row.index === 0 ? 'font-bold' : '']">{{(scope.row.yearAdjustmentRange > 0 ? '上浮' : (parseFloat(scope.row.yearAdjustmentRange) == 0 ? '' : '下调')) + (getAbsoluteVal(scope.row.yearAdjustmentRange) || '-') + '%'}}</div>
								</template>
							</el-table-column>
							<el-table-column prop="yearAdjustmentContractTs" label="调价后本期成交套数" width="75" align="center">
								<template slot-scope="scope">
									<div class="text-center" :class="[scope.row.index === 0 ? 'font-bold' : '']">{{(scope.row.yearAdjustmentContractTs || '-')}}</div>
								</template>
							</el-table-column>
							<el-table-column prop="yearAdjustmentContractAmount" :label="'调价后本期成交金额'+unit" width="85" align="center">
								<template slot-scope="scope">
									<div class="text-center" :class="[scope.row.index === 0 ? 'font-bold' : '']">{{(scope.row.yearAdjustmentContractAmount || '-')}}</div>
								</template>
							</el-table-column>
						</el-table-column>
						<el-table-column prop="adjustmentRange" label="对比首次定价累计调价幅度" width="100" align="center">
							<template slot="header" slot-scope="scope">
								<div @click="sortData('adjustmentRange',1,'ASC')">
									<span>对比首次定价累计调价幅度</span>
									<label class="table-sort-ico">
										<i :class="[sortColumn1 == 'adjustmentRange' && sortType1 === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
										<i :class="[sortColumn1 == 'adjustmentRange' && sortType1 === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
									</label>
								</div>
							</template>

							<template slot-scope="scope">
								<div class="text-center red-color" :class="[scope.row.index === 0 ? 'font-bold' : '']">{{(scope.row.adjustmentRange > 0 ? '上浮' : (parseFloat(scope.row.adjustmentRange) == 0 ? '' : '下调')) + (getAbsoluteVal(scope.row.adjustmentRange) || '-') + '%'}}</div>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</van-sticky>

			<div class="detail-table-panel list-data1" style="padding-top:0;">
				<!--			<van-pull-refresh v-model="isLoading" @refresh="onRefresh">-->
				<van-list
						v-model="loading"
						:finished="finished"
						finished-text="没有更多数据了"
						@load="onLoad"
				>
					<el-table stripe
					          class="huo-list-table main-theme-table huojv-data-list not-hide-text hide-header" size="mini"
					          highlight-current-row
					          :data="tableList">
						<el-table-column prop="orgName" label="组织架构" width="80" align="center">
							<template slot-scope="scope">
								<span v-if="scope.row.orgType==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,6)">{{scope.row.orgName}}</span>
								<span v-else>{{scope.row.orgName}}</span>
							</template>
						</el-table-column>
						<el-table-column label="本季度调价幅度" align="center">
							<el-table-column prop="reasonAdjustmentTs" label="调价套数" width="70" align="center">
								<template slot-scope="scope">
									<div class="text-center" :class="[scope.row.index === 0 ? 'font-bold' : '']">{{(scope.row.reasonAdjustmentTs || '-')}}</div>
								</template>
							</el-table-column>
							<el-table-column prop="reasonAdjustmentAmount" :label="'货值变动'+unit" width="80" align="center">
								<template slot-scope="scope">
									<div class="text-center" :class="[scope.row.index === 0 ? 'font-bold' : '']">{{(scope.row.reasonAdjustmentAmount || '-')}}</div>
								</template>
							</el-table-column>
							<el-table-column prop="reasonAdjustmentCount" label="调价频次" width="70" align="center">
								<template slot-scope="scope">
									<div class="text-center" :class="[scope.row.index === 0 ? 'font-bold' : '']">{{(scope.row.reasonAdjustmentCount || '-')}}</div>
								</template>
							</el-table-column>
							<el-table-column prop="reasonAdjustmentRange" label="调价幅度(%)" width="80" align="center">
								<template slot="header" slot-scope="scope">
									<div @click="sortData('reasonAdjustmentRange',1,'ASC')">
										<span>调价幅度(%)</span>
										<label class="table-sort-ico">
											<i :class="[sortColumn1 == 'reasonAdjustmentRange' && sortType1 === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
											<i :class="[sortColumn1 == 'reasonAdjustmentRange' && sortType1 === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
										</label>
									</div>
								</template>

								<template slot-scope="scope">
									<div class="text-center red-color" :class="[scope.row.index === 0 ? 'font-bold' : '']">{{(scope.row.reasonAdjustmentRange > 0 ? '上浮' : (parseFloat(scope.row.reasonAdjustmentRange) == 0 ? '' : '下调')) + (getAbsoluteVal(scope.row.reasonAdjustmentRange) || '-') + '%'}}</div>
								</template>
							</el-table-column>
							<el-table-column prop="reasonAdjustmentContractTs" label="调价后本期成交套数" width="75" align="center">
								<template slot-scope="scope">
									<div class="text-center" :class="[scope.row.index === 0 ? 'font-bold' : '']">{{(scope.row.reasonAdjustmentContractTs || '-')}}</div>
								</template>
							</el-table-column>
							<el-table-column prop="reasonAdjustmentContractAmount" :label="'调价后本期成交金额'+unit" width="85" align="center">
								<template slot-scope="scope">
									<div class="text-center" :class="[scope.row.index === 0 ? 'font-bold' : '']">{{(scope.row.reasonAdjustmentContractAmount || '-')}}</div>
								</template>
							</el-table-column>
						</el-table-column>
						<el-table-column label="本年调价幅度" align="center">
							<el-table-column prop="yearAdjustmentTs" label="调价套数" width="70" align="center">
								<template slot-scope="scope">
									<div class="text-center" :class="[scope.row.index === 0 ? 'font-bold' : '']">{{(scope.row.yearAdjustmentTs || '-')}}</div>
								</template>
							</el-table-column>
							<el-table-column prop="yearAdjustmentAmount" :label="'货值变动'+unit" width="80" align="center">
								<template slot-scope="scope">
									<div class="text-center" :class="[scope.row.index === 0 ? 'font-bold' : '']">{{(scope.row.yearAdjustmentAmount || '-')}}</div>
								</template>
							</el-table-column>
							<el-table-column prop="yearAdjustmentCount" label="调价频次" width="70" align="center">
								<template slot-scope="scope">
									<div class="text-center" :class="[scope.row.index === 0 ? 'font-bold' : '']">{{(scope.row.yearAdjustmentCount || '-')}}</div>
								</template>
							</el-table-column>
							<el-table-column prop="yearAdjustmentRange" label="调价幅度(%)" width="70" align="center">
								<template slot="header" slot-scope="scope">
									<div @click="sortData('yearAdjustmentRange',1,'ASC')">
										<span>调价幅度(%)</span>
										<label class="table-sort-ico">
											<i :class="[sortColumn1 == 'yearAdjustmentRange' && sortType1 === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
											<i :class="[sortColumn1 == 'yearAdjustmentRange' && sortType1 === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
										</label>
									</div>
								</template>
								<template slot-scope="scope">
									<div class="text-center red-color" :class="[scope.row.index === 0 ? 'font-bold' : '']">{{(scope.row.yearAdjustmentRange > 0 ? '上浮' : (parseFloat(scope.row.yearAdjustmentRange) == 0 ? '' : '下调')) + (getAbsoluteVal(scope.row.yearAdjustmentRange) || '-') + '%'}}</div>
								</template>
							</el-table-column>
							<el-table-column prop="yearAdjustmentContractTs" label="调价后本期成交套数" width="75" align="center">
								<template slot-scope="scope">
									<div class="text-center" :class="[scope.row.index === 0 ? 'font-bold' : '']">{{(scope.row.yearAdjustmentContractTs || '-')}}</div>
								</template>
							</el-table-column>
							<el-table-column prop="yearAdjustmentContractAmount" :label="'调价后本期成交金额'+unit" width="85" align="center">
								<template slot-scope="scope">
									<div class="text-center" :class="[scope.row.index === 0 ? 'font-bold' : '']">{{(scope.row.yearAdjustmentContractAmount || '-')}}</div>
								</template>
							</el-table-column>
						</el-table-column>
						<el-table-column prop="adjustmentRange" label="对比首次定价累计调价幅度" width="100" align="center">
							<template slot="header" slot-scope="scope">
								<div @click="sortData('adjustmentRange',1,'ASC')">
									<span>对比首次定价累计调价幅度</span>
									<label class="table-sort-ico">
										<i :class="[sortColumn1 == 'adjustmentRange' && sortType1 === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
										<i :class="[sortColumn1 == 'adjustmentRange' && sortType1 === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
									</label>
								</div>
							</template>

							<template slot-scope="scope">
								<div class="text-center red-color" :class="[scope.row.index === 0 ? 'font-bold' : '']">{{(scope.row.adjustmentRange > 0 ? '上浮' : (parseFloat(scope.row.adjustmentRange) == 0 ? '' : '下调')) + (getAbsoluteVal(scope.row.adjustmentRange) || '-') + '%'}}</div>
							</template>
						</el-table-column>
					</el-table>
				</van-list>
				<!--			</van-pull-refresh>-->
			</div>
		</div>
		<div class="padding-nav" v-show="pageType == 2">
			<van-sticky class="has-nav-sticky">
				<div class="detail-table-panel list-title2" style="padding-bottom: 0; padding-top: 0; position:relative;">
					<el-table stripe
					          class="huo-list-table main-theme-table huojv-data-list not-hide-text" size="mini"
					          highlight-current-row
					          :data="emptyArray">
						<el-table-column prop="orgName" label="组织架构" width="80" align="center">
							<template slot-scope="scope">
								<span v-if="scope.row.orgType==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,6)">{{scope.row.orgName}}</span>
								<span v-else>{{scope.row.orgName}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="yearUnderContractTs" label="本年累计破底成交套数" width="80" align="center"></el-table-column>
						<el-table-column prop="yearUnderContractAmount" :label="'涉及折损金额'+unit" width="80" align="center"></el-table-column>
						<el-table-column prop="reasonUnderContractRate" label="本季度破底成交套数比例(%)" width="100" align="center">
							<template slot="header" slot-scope="scope">
								<div @click="sortData('reasonUnderContractRate',2)">
									<span>本季度破底成交套数比例(%)</span>
									<label class="table-sort-ico">
										<i :class="[sortColumn2 == 'reasonUnderContractRate' && sortType2 === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
										<i :class="[sortColumn2 == 'reasonUnderContractRate' && sortType2 === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
									</label>
								</div>
							</template>

							<template slot-scope="scope">
								<div class="text-center red-color">{{(scope.row.reasonUnderContractRate || '-') + '%'}}</div>
							</template>
						</el-table-column>
						<el-table-column prop="yearUnderContractRate" label="本年破底成交套数比例(%)" width="90" align="center">
							<template slot="header" slot-scope="scope">
								<div @click="sortData('yearUnderContractRate',2)">
									<span>本年破底成交套数比例(%)</span>
									<label class="table-sort-ico">
										<i :class="[sortColumn2 == 'yearUnderContractRate' && sortType2 === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
										<i :class="[sortColumn2 == 'yearUnderContractRate' && sortType2 === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
									</label>
								</div>
							</template>

							<template slot-scope="scope">
								<div class="text-center red-color">{{(scope.row.yearUnderContractRate || '-') + '%'}}</div>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</van-sticky>

			<div class="detail-table-panel list-data2" style="padding-top:0;">
				<van-list
						v-model="loading"
						:finished="finished"
						finished-text="没有更多数据了"
						@load="onLoad"
				>
					<el-table stripe
					          class="huo-list-table main-theme-table hide-header huojv-data-list not-hide-text" size="mini"
					          highlight-current-row
					          :data="tableList">
						<el-table-column prop="orgName" label="组织架构" width="80" align="center">
							<template slot-scope="scope">
								<span v-if="scope.row.orgType==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,6)">{{scope.row.orgName}}</span>
								<span v-else>{{scope.row.orgName}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="yearUnderContractTs" label="本年累计破底成交套数" width="80" align="center"></el-table-column>
						<el-table-column prop="yearUnderContractAmount" :label="'涉及折损金额'+unit" width="80" align="center"></el-table-column>
						<el-table-column prop="reasonUnderContractRate" label="本季度破底成交套数比例(%)" width="100" align="center">
							<template slot="header" slot-scope="scope">
								<div @click="sortData('reasonUnderContractRate',2)">
									<span>本季度破底成交套数比例(%)</span>
									<label class="table-sort-ico">
										<i :class="[sortColumn2 == 'reasonUnderContractRate' && sortType2 === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
										<i :class="[sortColumn2 == 'reasonUnderContractRate' && sortType2 === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
									</label>
								</div>
							</template>

							<template slot-scope="scope">
								<div class="text-center red-color">{{(scope.row.reasonUnderContractRate || '-') + '%'}}</div>
							</template>
						</el-table-column>
						<el-table-column prop="yearUnderContractRate" label="本年破底成交套数比例(%)" width="90" align="center">
							<template slot="header" slot-scope="scope">
								<div @click="sortData('yearUnderContractRate',2)">
									<span>本年破底成交套数比例(%)</span>
									<label class="table-sort-ico">
										<i :class="[sortColumn2 == 'yearUnderContractRate' && sortType2 === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
										<i :class="[sortColumn2 == 'yearUnderContractRate' && sortType2 === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
									</label>
								</div>
							</template>

							<template slot-scope="scope">
								<div class="text-center red-color">{{(scope.row.yearUnderContractRate || '-') + '%'}}</div>
							</template>
						</el-table-column>
					</el-table>
				</van-list>
			</div>
		</div>
		<div class="padding-nav" v-show="pageType == 3">
			<van-sticky class="has-nav-sticky">
				<div class="detail-table-panel list-title3" style="padding-bottom: 0; padding-top: 0; position:relative;">
					<el-table stripe
					          class="huo-list-table main-theme-table huojv-data-list not-hide-text" size="mini"
					          highlight-current-row
					          :data="emptyArray">
						<el-table-column prop="orgName" label="组织架构" width="80" align="center">
							<template slot-scope="scope">
								<span v-if="scope.row.orgType==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,6)">{{scope.row.orgName}}</span>
								<span v-else>{{scope.row.orgName}}</span>
							</template>
						</el-table-column>
						<el-table-column label="对比最新版底价溢价成交情况" align="center">
							<el-table-column prop="yearOverContractTs" label="本年溢价成交套数" width="80" align="center"></el-table-column>
							<el-table-column prop="yearOverContractAmount" :label="'涉及溢价货值'+unit" width="80" align="center"></el-table-column>
							<el-table-column prop="yearOverContractRate" label="溢价成交比例(%)" width="80" align="center">
								<template slot-scope="scope">
									<div class="text-center red-color">{{(scope.row.yearOverContractRate || '-') + '%'}}</div>
								</template>
							</el-table-column>
							<el-table-column prop="yearOverAdjustmentRange" label="溢价幅度(%)" width="80" align="center">
								<template slot="header" slot-scope="scope">
									<div @click="sortData('yearOverAdjustmentRange',3)">
										<span>溢价幅度(%)</span>
										<label class="table-sort-ico">
											<i :class="[sortColumn3 == 'yearOverAdjustmentRange' && sortType3 === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
											<i :class="[sortColumn3 == 'yearOverAdjustmentRange' && sortType3 === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
										</label>
									</div>
								</template>
								<template slot-scope="scope">
									<div class="text-center red-color">{{(scope.row.yearOverAdjustmentRange || '-') + '%'}}</div>
								</template>
							</el-table-column>
						</el-table-column>
						<el-table-column prop="overAdjustmentRange" label="对比首次定价累计溢价幅度" width="110" align="center">
							<template slot="header" slot-scope="scope">
								<div @click="sortData('overAdjustmentRange',3)">
									<span>对比首次定价累计溢价幅度</span>
									<label class="table-sort-ico">
										<i :class="[sortColumn3 == 'overAdjustmentRange' && sortType3 === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
										<i :class="[sortColumn3 == 'overAdjustmentRange' && sortType3 === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
									</label>
								</div>
							</template>
							<template slot-scope="scope">
								<div class="text-center red-color">{{(scope.row.overAdjustmentRange || '-') + '%'}}</div>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</van-sticky>

			<div class="detail-table-panel list-data3" style="padding-top:0;">
				<van-list
						v-model="loading"
						:finished="finished"
						finished-text="没有更多数据了"
						@load="onLoad"
				>
					<el-table stripe
					          class="huo-list-table main-theme-table hide-header huojv-data-list not-hide-text" size="mini"
					          highlight-current-row
					          :data="tableList">
						<el-table-column prop="orgName" label="组织架构" width="80" align="center">
							<template slot-scope="scope">
								<span v-if="scope.row.orgType==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,6)">{{scope.row.orgName}}</span>
								<span v-else>{{scope.row.orgName}}</span>
							</template>
						</el-table-column>
						<el-table-column label="对比最新版底价溢价成交情况" align="center">
							<el-table-column prop="yearOverContractTs" label="本年溢价成交套数" width="80" align="center"></el-table-column>
							<el-table-column prop="yearOverContractAmount" :label="'涉及溢价货值'+unit" width="80" align="center"></el-table-column>
							<el-table-column prop="yearOverContractRate" label="溢价成交比例(%)" width="80" align="center">
								<template slot-scope="scope">
									<div class="text-center red-color">{{(scope.row.yearOverContractRate || '-') + '%'}}</div>
								</template>
							</el-table-column>
							<el-table-column prop="yearOverAdjustmentRange" label="溢价幅度(%)" width="80" align="center">
								<template slot="header" slot-scope="scope">
									<div @click="sortData('yearOverAdjustmentRange',3)">
										<span>溢价幅度(%)</span>
										<label class="table-sort-ico">
											<i :class="[sortColumn3 == 'yearOverAdjustmentRange' && sortType3 === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
											<i :class="[sortColumn3 == 'yearOverAdjustmentRange' && sortType3 === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
										</label>
									</div>
								</template>
								<template slot-scope="scope">
									<div class="text-center red-color">{{(scope.row.yearOverAdjustmentRange || '-') + '%'}}</div>
								</template>
							</el-table-column>
						</el-table-column>
						<el-table-column prop="overAdjustmentRange" label="对比首次定价累计溢价幅度" width="110" align="center">
							<template slot="header" slot-scope="scope">
								<div @click="sortData('overAdjustmentRange',3)">
									<span>对比首次定价累计溢价幅度</span>
									<label class="table-sort-ico">
										<i :class="[sortColumn3 == 'overAdjustmentRange' && sortType3 === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
										<i :class="[sortColumn3 == 'overAdjustmentRange' && sortType3 === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
									</label>
								</div>
							</template>
							<template slot-scope="scope">
								<div class="text-center red-color">{{(scope.row.overAdjustmentRange || '-') + '%'}}</div>
							</template>
						</el-table-column>
					</el-table>
				</van-list>
			</div>
		</div>
		<div class="padding-nav" v-show="pageType == 4">
			<van-sticky class="has-nav-sticky">
				<div class="detail-table-panel list-title4" style="padding-bottom: 0; padding-top: 0; position:relative;">
					<el-table stripe
					          class="huo-list-table main-theme-table huojv-data-list not-hide-text" size="mini"
					          highlight-current-row
					          :data="emptyArray">
						<el-table-column prop="orgName" label="组织架构" width="80" align="center">
							<template slot-scope="scope">
								<span v-if="scope.row.orgType==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,6)">{{scope.row.orgName}}</span>
								<span v-else>{{scope.row.orgName}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="discountExecuteTs" label="本年执行套数" width="80" align="center"></el-table-column>
						<el-table-column prop="discountExecuteAmount" :label="'涉及折扣金额'+unit" width="80" align="center"></el-table-column>
						<el-table-column prop="discountExecuteRate" label="特批折扣执行比例(%)" width="80" align="center">
							<template slot="header" slot-scope="scope">
								<div @click="sortData('discountExecuteRate',4)">
									<span>特批折扣执行比例(%)</span>
									<label class="table-sort-ico">
										<i :class="[sortColumn4 == 'discountExecuteRate' && sortType4 === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
										<i :class="[sortColumn4 == 'discountExecuteRate' && sortType4 === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
									</label>
								</div>
							</template>
							<template slot-scope="scope">
								<div class="text-center red-color">{{(scope.row.discountExecuteRate || '-') + '%'}}</div>
							</template>
						</el-table-column>
						<el-table-column prop="discountExecutePoint" label="特批折扣综合点数" width="80" align="center">
							<template slot="header" slot-scope="scope">
								<div @click="sortData('discountExecutePoint',4)">
									<span>特批折扣综合点数</span>
									<label class="table-sort-ico">
										<i :class="[sortColumn4 == 'discountExecutePoint' && sortType4 === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
										<i :class="[sortColumn4 == 'discountExecutePoint' && sortType4 === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
									</label>
								</div>
							</template>
							<template slot-scope="scope">
								<div class="text-center red-color">{{(scope.row.discountExecutePoint || '-')}}</div>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</van-sticky>

			<div class="detail-table-panel list-data4" style="padding-top:0;">
				<van-list
						v-model="loading"
						:finished="finished"
						finished-text="没有更多数据了"
						@load="onLoad"
				>
					<el-table stripe
					          class="huo-list-table main-theme-table hide-header huojv-data-list not-hide-text" size="mini"
					          highlight-current-row
					          :data="tableList">
						<el-table-column prop="orgName" label="组织架构" width="80" align="center">
							<template slot-scope="scope">
								<span v-if="scope.row.orgType==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,6)">{{scope.row.orgName}}</span>
								<span v-else>{{scope.row.orgName}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="discountExecuteTs" label="本年执行套数" width="80" align="center"></el-table-column>
						<el-table-column prop="discountExecuteAmount" :label="'涉及折扣金额'+unit" width="80" align="center"></el-table-column>
						<el-table-column prop="discountExecuteRate" label="特批折扣执行比例(%)" width="80" align="center">
							<template slot="header" slot-scope="scope">
								<div @click="sortData('discountExecuteRate',4)">
									<span>特批折扣执行比例(%)</span>
									<label class="table-sort-ico">
										<i :class="[sortColumn4 == 'discountExecuteRate' && sortType4 === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
										<i :class="[sortColumn4 == 'discountExecuteRate' && sortType4 === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
									</label>
								</div>
							</template>
							<template slot-scope="scope">
								<div class="text-center red-color">{{(scope.row.discountExecuteRate || '-') + '%'}}</div>
							</template>
						</el-table-column>
						<el-table-column prop="discountExecutePoint" label="特批折扣综合点数" width="80" align="center">
							<template slot="header" slot-scope="scope">
								<div @click="sortData('discountExecutePoint',4)">
									<span>特批折扣综合点数</span>
									<label class="table-sort-ico">
										<i :class="[sortColumn4 == 'discountExecutePoint' && sortType4 === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
										<i :class="[sortColumn4 == 'discountExecutePoint' && sortType4 === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
									</label>
								</div>
							</template>
							<template slot-scope="scope">
								<div class="text-center red-color">{{(scope.row.discountExecutePoint || '-')}}</div>
							</template>
						</el-table-column>
					</el-table>
				</van-list>
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
                loading: false,//上拉加载
                isLoading: false,//下拉刷新,从第一页开始
                finished: false,//下拉加载完,如果没有数据设置true
                size:20,
                current:1,
	            emptyArray:[],
                tableList: [],
	            tab:1,
                tab1:1,
                orgName: '',
	            orgId:'',
                orgType:'',
	            pageType:1,  // 组织机构类型
                pageTitle:'',
                tableHeight: 0,
                isLoad:false,  // 是否处于加载状态  手动控制  以免一直执行onLoad方法
	            unit:'',

                sortColumn1:'reasonAdjustmentRange',  // 默认按照本季度调价幅度排序
                sortType1:'ASC', // 默认升序
                sortColumn2:'reasonUnderContractRate',  // 默认按照本季度调价幅度排序
                sortType2:'DESC', // 默认降序
                sortColumn3:'yearOverAdjustmentRange',  // 默认按照本季度调价幅度排序
                sortType3:'DESC', // 默认降序
                sortColumn4:'discountExecuteRate',  // 默认按照本季度调价幅度排序
                sortType4:'DESC', // 默认降序
            };
        },

	    created(){
            let bodyHeight = document.body.clientHeight;
            if (this.pageType == 1) {
                this.tableHeight = bodyHeight - 85;
            } else if (this.pageType == 2) {
                this.tableHeight = bodyHeight - 180;
            }
	    },

        mounted() {
            this.pageType = this.$route.query.pageType;
            this.orgId = this.$route.query.orgId;
            this.orgType = this.$route.query.orgType;
            this.tab = this.$route.query.tab;
            this.unit = this.orgType <= 5 ? '(亿)' : '(万)';

            if(this.pageType == 1){
                let type = '';
                switch (this.tab) {
	                case '1':type = '总体';break;
	                case '2':type = '住宅类';break;
	                case '3':type = '商业类';break;
	                case '4':type = '车位';break;
	                default: type = '总体';
                }
                this.pageTitle = type + '调价情况分析';
            }else if(this.pageType == 2){
                this.pageTitle = '破低价成交详情';
            }else if(this.pageType == 3){
                this.pageTitle = '溢价成交详情';
            }else if(this.pageType == 4){
                this.pageTitle = '折扣详情';
            }
            this.getOrgName();
            this.$nextTick(() => {
                $('.list-title1 .el-table__header-wrapper').scroll(function () {
                    let scrollLeft = $(this).scrollLeft();
                    $(".list-data1 .el-table__body-wrapper").scrollLeft(scrollLeft);
                });

                $(".list-data1 .el-table__body-wrapper").scroll(function () {
                    let scrollLeft = $(this).scrollLeft();
                    $('.list-title1 .el-table__header-wrapper').scrollLeft(scrollLeft);
                })

                $('.list-title2 .el-table__header-wrapper').scroll(function () {
                    let scrollLeft = $(this).scrollLeft();
                    $(".list-data2 .el-table__body-wrapper").scrollLeft(scrollLeft);
                });

                $(".list-data2 .el-table__body-wrapper").scroll(function () {
                    let scrollLeft = $(this).scrollLeft();
                    $('.list-title2 .el-table__header-wrapper').scrollLeft(scrollLeft);
                })

                $('.list-title3 .el-table__header-wrapper').scroll(function () {
                    let scrollLeft = $(this).scrollLeft();
                    $(".list-data3 .el-table__body-wrapper").scrollLeft(scrollLeft);
                });

                $(".list-data3 .el-table__body-wrapper").scroll(function () {
                    let scrollLeft = $(this).scrollLeft();
                    $('.list-title3 .el-table__header-wrapper').scrollLeft(scrollLeft);
                })

                $('.list-title4 .el-table__header-wrapper').scroll(function () {
                    let scrollLeft = $(this).scrollLeft();
                    $(".list-data4 .el-table__body-wrapper").scrollLeft(scrollLeft);
                });

                $(".list-data4 .el-table__body-wrapper").scroll(function () {
                    let scrollLeft = $(this).scrollLeft();
                    $('.list-title4 .el-table__header-wrapper').scrollLeft(scrollLeft);
                })


                $(".el-table__fixed-body-wrapper").scroll(function () {
                    let scrollTop = $(this).scrollTop();
                    $(this).parent().prev().scrollTop(scrollTop);
                });
            })
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

            // 获取绝对值
            getAbsoluteVal(val){
                if(!val) return '';
                return val > 0 ? val : (-1 * val).toFixed(2);
            },

            checkTab1(tab1){
                this.current = 1;
                this.tab1 = tab1;
                this.getDetailList(true);
            },

	        // 获取orgName
            getOrgName(){
                request({
                    url: `/app-api/orgType/sysOrg/${this.orgId}`,
                    method: 'get',
                    params: {}
                }).then(({data}) => {
                    if (data.code === 0 && data.data ) {
                        this.orgName = data.data[0].name;
                    }
                });
            },

            // 获取材料清单明细
            getDetailList(isRefresh){
                let index = this.pageType;
                // 接口参数默认为调价情况分析
                let url = '/app-api/saleBack/priceManagement/priceAdjustmentAnalysis';
                let params = {
                    orgId:this.$route.query.orgId,
                    size: this.size,
                    current: this.current,
                    sortColumn:this['sortColumn'+index],
	                sortType: this['sortType'+index],
                    parentProductType:parseInt(this.tab) - 1
                };

                // 当页面类型不为调价情况分析时
                if(this.pageType != 1){
                    url = '/app-api/saleBack/priceManagement/priceMovementTable';
                    params = {orgId : this.$route.query.orgId,current: this.current,size: this.size,sortColumn:this['sortColumn'+index],sortType:this['sortType'+index]}
                }

                request({
                    url: url,
                    method: 'get',
                    params:params
                }).then(({data}) => {
                    if(data.code === 0 && data.data){
                        let list = data.data.records || [];
                        this.tableList = isRefresh ? list : this.tableList.concat(list);
                        this.loading = false;
                        this.isLoading = false;
                        this.isLoad = false;

                        if(this.tableList.length){
                            this.tableList[0].index = 0;
                        }

                        if (null == list || list.length < this.size || this.tableList.length >= data.total) {
                            this.finished = true;
                        } else {
                            if(this.current > 1){
                                let scrollTop = $(document).scrollTop();
                                $(document).scrollTop(scrollTop - 300);
                            }
                            this.current += 1;
                            this.finished = false;
                        }
                    }else{
                        // 初始化
                        this.current = 1;
                        this.tableList = [];
                        this.loading = false;
                        this.isLoading = false;
                        this.finished = true;
                        this.isLoad = false;
                    }
                });
            },

            onLoad(){
                if(this.isLoad) return;  // 如果正在加载  返回
                this.isLoad = true;
                // 加载状态结束
                this.loading = false;
                this.getDetailList();
            },

            onRefresh(){
				
                this.current = 1;
                // this.tableList = [];
                this.getDetailList(true);
            },

            // 点击表头排序
            sortData(sortColumn,i,type){
                let index = this.pageType;
                if(this['sortColumn'+index] != sortColumn){
                    this['sortColumn'+index] = sortColumn;
                    this.sortType = type || 'DESC';
                }else{
                    this['sortType'+index] = (this['sortType'+index] == 'ASC' ? 'DESC' : 'ASC');
                }


	            this.onRefresh();
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

</style>
