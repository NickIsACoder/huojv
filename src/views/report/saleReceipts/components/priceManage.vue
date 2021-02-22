<template>
	<div class="report-index">
		<div class="main-content width100">
			<div class="data-content-panel no-top-left-radius clearfix" style="overflow: visible;">
				<!-- 定价分析 -->
				<div class="data-title-box data-title-line">
					<span class="title">定价分析</span>
					<label class="tips">（对比投资测算版和军令状版本情况）</label>
				</div>
				<div class="building-func">
					<img src="../../../../assets/images/image_underdevelopment.png">
					<div class="text">陆续上线～</div>
				</div>

				<!-- 调价情况分析 -->
				<div class="data-title-box data-title-line">
					<span class="title">调价情况分析</span>
				</div>

				<!-- tab选项卡 -->
				<div class="text-center" v-if="orgType <= 5">
					<ul class="huojv-tab-bars_1 four-cols">
						<li @click="checkTab1(1)" v-eventlisten="{isChangePage:false,pageEvent:'点击总体'}" :class="[tab1 == 1 ? 'active' : '']">
							总体
						</li>
						<li @click="checkTab1(2)" v-eventlisten="{isChangePage:false,pageEvent:'点击住宅类'}" :class="[tab1 == 2 ? 'active' : '']">
							住宅类
						</li>
						<li @click="checkTab1(3)" v-eventlisten="{isChangePage:false,pageEvent:'点击商业类'}" :class="[tab1 == 3 ? 'active' : '']">
							商业类
						</li>
						<li @click="checkTab1(4)" v-eventlisten="{isChangePage:false,pageEvent:'点击车位'}" :class="[tab1 == 4 ? 'active' : '']">
							车位
						</li>
					</ul>
				</div>
				<!-- 一级集团显示 -->
				<el-table stripe v-show="orgType <= 2"
				          class="huo-list-table main-theme-table" size="mini"
				          highlight-current-row
				          :data="tableData1">
					<el-table-column prop="orgName" label="组织架构" width="80" align="center">
						<template slot-scope="scope">
							<span v-if="scope.row.orgType==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,6)">{{scope.row.orgName}}</span>
							<span v-else>{{scope.row.orgName}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="reasonAdjustmentRange" label="本季度调价幅度(%)" width="80" align="center">
						<template slot="header" slot-scope="scope">
							<div @click="sortData('reasonAdjustmentRange',1,'ASC')" v-show="orgType <= 5">
								<span>本季度调价幅度(%)</span>
								<label class="table-sort-ico">
									<i :class="[sortColumn1 == 'reasonAdjustmentRange' && sortType1 === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
									<i :class="[sortColumn1 == 'reasonAdjustmentRange' && sortType1 === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
								</label>
							</div>
							<div v-show="orgType > 5">
								<span>本季度调价幅度(%)</span>
							</div>
						</template>
						<template slot-scope="scope">
							<div class="text-center red-color">{{(scope.row.reasonAdjustmentRange > 0 ? '上浮' : (parseFloat(scope.row.reasonAdjustmentRange) == 0 ? '' : '下调')) + (getAbsoluteVal(scope.row.reasonAdjustmentRange) || '-') + '%'}}</div>
						</template>
					</el-table-column>
					<el-table-column prop="yearAdjustmentRange" label="本年调价幅度(%)" width="80" align="center">
						<template slot="header" slot-scope="scope">
							<div @click="sortData('yearAdjustmentRange',1,'ASC')" v-show="orgType <= 5">
								<span>本年调价幅度(%)</span>
								<label class="table-sort-ico">
									<i :class="[sortColumn1 == 'yearAdjustmentRange' && sortType1 === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
									<i :class="[sortColumn1 == 'yearAdjustmentRange' && sortType1 === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
								</label>
							</div>
							<div v-show="orgType > 5">
								<span>本年调价幅度(%)</span>
							</div>
						</template>

						<template slot-scope="scope">
							<div class="text-center red-color">{{(scope.row.yearAdjustmentRange > 0 ? '上浮' : (parseFloat(scope.row.yearAdjustmentRange) == 0 ? '' : '下调')) + (getAbsoluteVal(scope.row.yearAdjustmentRange) || '-') + '%'}}</div>
						</template>
					</el-table-column>
					<el-table-column prop="adjustmentRange" label="对比首次定价累计调价幅度" width="110" align="center">
						<template slot="header" slot-scope="scope">
							<div @click="sortData('adjustmentRange',1,'ASC')" v-show="orgType <= 5">
								<span>对比首次定价累计调价幅度</span>
								<label class="table-sort-ico">
									<i :class="[sortColumn1 == 'adjustmentRange' && sortType1 === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
									<i :class="[sortColumn1 == 'adjustmentRange' && sortType1 === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
								</label>
							</div>
							<div v-show="orgType > 5">
								<span>对比首次定价累计调价幅度</span>
							</div>
						</template>

						<template slot-scope="scope">
							<div class="text-center red-color">{{(scope.row.adjustmentRange > 0 ? '上浮' : (parseFloat(scope.row.adjustmentRange) == 0 ? '' : '下调')) + (getAbsoluteVal(scope.row.adjustmentRange) || '-') + '%'}}</div>
						</template>
					</el-table-column>
					<el-table-column prop="contractName" label="详情" width="100" align="center">
						<template slot-scope="scope">
							<div @click="getMore(1,scope.row.orgName,scope.row.orgId)" :class="[scope.row.index !== 0 ? 'table-detail-link' : '']">{{scope.row.index !== 0 ? '点击查看详情' : '/'}}</div>
						</template>
					</el-table-column>
				</el-table>

				<!-- 二级集团及区域公司显示 -->
				<el-table stripe v-show="orgType > 2 && orgType <= 5"
				          class="huo-list-table main-theme-table" size="mini"
				          highlight-current-row
				          :data="tableData1">
					<el-table-column prop="orgName" label="组织架构" width="80" align="center">
						<template slot-scope="scope">
							<span v-if="scope.row.orgType==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,6)">{{scope.row.orgName}}</span>
							<span v-else>{{scope.row.orgName}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="reasonAdjustmentRange" label="本季度调价幅度(%)" width="80" align="center">
						<template slot="header" slot-scope="scope">
							<div @click="sortData('reasonAdjustmentRange',1,'ASC')" v-show="orgType <= 5">
								<span>本季度调价幅度(%)</span>
								<label class="table-sort-ico">
									<i :class="[sortColumn1 == 'reasonAdjustmentRange' && sortType1 === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
									<i :class="[sortColumn1 == 'reasonAdjustmentRange' && sortType1 === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
								</label>
							</div>
							<div v-show="orgType > 5">
								<span>本季度调价幅度(%)</span>
							</div>
						</template>
						<template slot-scope="scope">
							<div class="text-center red-color">{{(scope.row.reasonAdjustmentRange > 0 ? '上浮' : (parseFloat(scope.row.reasonAdjustmentRange) == 0 ? '' : '下调')) + (getAbsoluteVal(scope.row.reasonAdjustmentRange) || '-') + '%'}}</div>
						</template>
					</el-table-column>
					<el-table-column prop="yearAdjustmentRange" label="本年调价幅度(%)" width="80" align="center">
						<template slot="header" slot-scope="scope">
							<div @click="sortData('yearAdjustmentRange',1,'ASC')" v-show="orgType <= 5">
								<span>本年调价幅度(%)</span>
								<label class="table-sort-ico">
									<i :class="[sortColumn1 == 'yearAdjustmentRange' && sortType1 === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
									<i :class="[sortColumn1 == 'yearAdjustmentRange' && sortType1 === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
								</label>
							</div>
							<div v-show="orgType > 5">
								<span>本年调价幅度(%)</span>
							</div>
						</template>

						<template slot-scope="scope">
							<div class="text-center red-color">{{(scope.row.yearAdjustmentRange > 0 ? '上浮' : (parseFloat(scope.row.yearAdjustmentRange) == 0 ? '' : '下调')) + (getAbsoluteVal(scope.row.yearAdjustmentRange) || '-') + '%'}}</div>
						</template>
					</el-table-column>
					<el-table-column prop="adjustmentRange" label="对比首次定价累计调价幅度" width="110" align="center">
						<template slot="header" slot-scope="scope">
							<div @click="sortData('adjustmentRange',1,'ASC')" v-show="orgType <= 5">
								<span>对比首次定价累计调价幅度</span>
								<label class="table-sort-ico">
									<i :class="[sortColumn1 == 'adjustmentRange' && sortType1 === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
									<i :class="[sortColumn1 == 'adjustmentRange' && sortType1 === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
								</label>
							</div>
							<div v-show="orgType > 5">
								<span>对比首次定价累计调价幅度</span>
							</div>
						</template>

						<template slot-scope="scope">
							<div class="text-center red-color">{{(scope.row.adjustmentRange > 0 ? '上浮' : (parseFloat(scope.row.adjustmentRange) == 0 ? '' : '下调')) + (getAbsoluteVal(scope.row.adjustmentRange) || '-') + '%'}}</div>
						</template>
					</el-table-column>
				</el-table>

				<!--  项目层级组织机构显示-->
				<el-table v-show="orgType > 5" stripe
				          class="huo-list-table main-theme-table" size="mini"
				          highlight-current-row
				          :data="tableActiveData1">
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
								<div @click="sortData('reasonAdjustmentRange',1,'ASC')" v-show="orgType <= 5">
									<span>调价幅度(%)</span>
									<label class="table-sort-ico">
										<i :class="[sortColumn1 == 'reasonAdjustmentRange' && sortType1 === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
										<i :class="[sortColumn1 == 'reasonAdjustmentRange' && sortType1 === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
									</label>
								</div>
								<div v-show="orgType > 5">
									<span>调价幅度(%)</span>
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
								<div class="text-center red-color" :class="[scope.row.index === 0 ? 'font-bold' : '']">{{(scope.row.reasonAdjustmentContractAmount || '-')}}</div>
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
								<div @click="sortData('yearAdjustmentRange',1,'ASC')" v-show="orgType <= 5">
									<span>调价幅度(%)</span>
									<label class="table-sort-ico">
										<i :class="[sortColumn1 == 'yearAdjustmentRange' && sortType1 === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
										<i :class="[sortColumn1 == 'yearAdjustmentRange' && sortType1 === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
									</label>
								</div>
								<div v-show="orgType > 5">
									<span>调价幅度(%)</span>
								</div>
							</template>
							<template slot-scope="scope">
								<div class="text-center red-color" :class="[scope.row.index === 0 ? 'font-bold' : '']">{{(scope.row.yearAdjustmentRange > 0 ? '上浮' : (parseFloat(scope.row.yearAdjustmentRange)  == 0? '' : '下调')) + (getAbsoluteVal(scope.row.yearAdjustmentRange) || '-') + '%'}}</div>
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
							<div @click="sortData('adjustmentRange',1,'ASC')" v-show="orgType <= 5">
								<span>对比首次定价累计调价幅度</span>
								<label class="table-sort-ico">
									<i :class="[sortColumn1 == 'adjustmentRange' && sortType1 === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
									<i :class="[sortColumn1 == 'adjustmentRange' && sortType1 === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
								</label>
							</div>
							<div v-show="orgType > 5">
								<span>对比首次定价累计调价幅度</span>
							</div>
						</template>

						<template slot-scope="scope">
							<div class="text-center red-color" :class="[scope.row.index === 0 ? 'font-bold' : '']">{{(scope.row.adjustmentRange > 0 ? '上浮' : (parseFloat(scope.row.adjustmentRange) == 0 ? '' : '下调')) + (getAbsoluteVal(scope.row.adjustmentRange) || '-') + '%'}}</div>
						</template>
					</el-table-column>
				</el-table>
				<div class="clearfix mt-10" v-if="(orgType > 2 && orgType <= 5 && tableData1.length > 0) || (orgType > 5 && tableData1.length > 6)">
					<span class="more" @click="getMore(1,tableData1 && tableData1[0].orgName,orgId)">查看更多 <i class="el-icon-arrow-right"></i></span>
				</div>

				<div class="data-title-box">
					<div class="tips pb-20">
						<div>备注：</div>
						<div>本季度调价幅度=（最新的明源底价-本季度初明源底价）/本季度初明源底价*100%；</div>
						<div>本年调价幅度=（最新的明源底价-本年初明源底价）/本年初明源底价*100%；</div>
						<div>累计调价幅度=（最新明源底价-首次定价明源底价）/首次定价明源底价*100%；</div>
					</div>
				</div>

				<!-- 破底价成交监控 -->
				<div class="data-title-box data-title-line">
					<span class="title">破底价成交监控</span>
				</div>
				<h2 class="second-title " v-for="(chart,index) in chartData" :key="'chartText1'+index">
					<label class="green-font">{{chart.orgName}}本年破底价成交占比</label>
					<label class="red-color">{{chart.yearUnderContractRate || '-'}}%</label>
					<label class="green-font">，货值折损</label>
					<label class="red-color">{{(chart.yearUnderContractAmount || '-') + unit1}}</label>
				</h2>
<!--				<div class="boxTitle2 text-center mt-20">破底价成交情况</div>-->
				<div>
					<div class="huojv-costContract-chart-panel max" ref="chart1"></div>
				</div>

				<!-- 破低价详情表格  项目层级不显示 -->
				<el-table v-show="orgType <= 2" stripe
				          class="huo-list-table main-theme-table" size="mini"
				          highlight-current-row
				          :data="tableActiveData2">
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
					<el-table-column prop="contractName" label="详情" width="80" align="center">
						<template slot-scope="scope">
							<div @click="getMore(2,scope.row.orgName,scope.row.orgId)" :class="[scope.row.index !== 0 ? 'table-detail-link' : '']">{{scope.row.index !== 0 ? '查看详情' : '/'}}</div>
						</template>
					</el-table-column>
				</el-table>

				<!-- 区域公司显示 -->
				<el-table v-show="orgType > 2 && orgType <= 5" stripe
				          class="huo-list-table main-theme-table" size="mini"
				          highlight-current-row
				          :data="tableActiveData2">
					<el-table-column prop="orgName" label="组织架构" width="80" align="center">
						<template slot-scope="scope">
							<span v-if="scope.row.orgType==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,6)">{{scope.row.orgName}}</span>
							<span v-else>{{scope.row.orgName}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="yearUnderContractTs" label="累计破底成交套数" width="80" align="center"></el-table-column>
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

				<div class="clearfix mt-10" v-if="tableData2.length > 6 && orgType <= 5">
					<span class="more" @click="getMore(2,tableData2 && tableData2[0].orgName,orgId)">查看更多 <i class="el-icon-arrow-right"></i></span>
				</div>
				<div class="data-title-box">
					<div class="tips pb-20">
						<div>备注：</div>
						<div>破底价成交比例=破底价合同数/本季度或本年签约合同数，</div>
						<div>价格折损=合同成交价-底价</div>
					</div>
				</div>

				<!-- 对比底价溢价成交情况 -->
				<div class="data-title-box data-title-line">
					<span class="title">溢价成交情况分析</span>
				</div>
				<h2 class="second-title" v-for="(chart,index) in chartData" :key="'chartText2'+index">
					<label class="green-font">{{chart.orgName}}本年溢价成交套数占比</label>
					<label class="red-color">{{chart.yearOverContractRate || '-'}}%</label>
<!--					<label class="green-font">(按套数），对比最新版底价溢价总额</label>-->
<!--					<label class="red-color">{{(chart.yearOverContractAmount || '-') + unit1}}</label>-->
				</h2>
<!--				<div class="boxTitle2 text-center mt-20">溢价成交情况</div>-->
				<div>
					<div class="huojv-costContract-chart-panel max" ref="chart2"></div>
				</div>

				<!-- 溢价成交情况表格  项目层级不显示 -->
				<el-table v-show="orgType <= 2" stripe
				          class="huo-list-table main-theme-table" size="mini"
				          highlight-current-row
				          :data="tableActiveData3">
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
						<el-table-column prop="yearOverAdjustmentRange" label="溢价幅度(%)" width="90" align="center">
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
					<el-table-column prop="contractName" label="详情" width="80" align="center">
						<template slot-scope="scope">
							<div @click="getMore(3,scope.row.orgName,scope.row.orgId)" :class="[scope.row.index !== 0 ? 'table-detail-link' : '']">{{scope.row.index !== 0 ? '查看详情' : '/'}}</div>
						</template>
					</el-table-column>
				</el-table>

				<!-- 区域公司显示 -->
				<el-table v-show="orgType > 2 && orgType <= 5" stripe
				          class="huo-list-table main-theme-table" size="mini"
				          highlight-current-row
				          :data="tableActiveData3">
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

				<div class="clearfix mt-10" v-if="tableData3.length > 6 && orgType <= 5">
					<span class="more" @click="getMore(3,tableData3 && tableData3[0].orgName,orgId)">查看更多 <i class="el-icon-arrow-right"></i></span>
				</div>
				<div class="data-title-box">
					<div class="tips pb-20">
						<div>备注：</div>
						<div>溢价成交比例=溢价成交合同数/本年签约合同数，</div>
						<div>溢价金额=合同成交价-底价</div>
					</div>
				</div>


				<!-- 特批折扣执行情况 -->
				<div class="data-title-box data-title-line">
					<span class="title">特批折扣执行情况</span>
				</div>
				<h2 class="second-title" v-for="(chart,index) in chartData" :key="'chartText3'+index">
					<label class="green-font">{{chart.orgName}}本年特批折扣执行比例</label>
					<label class="red-color">{{chart.discountExecuteRate || '-'}}%</label>
					<label class="green-font">，综合</label>
					<label class="red-color">{{chart.discountExecutePoint || '-'}}个点</label>
				</h2>
<!--				<div class="boxTitle2 text-center mt-20">执行特批折扣合同数占本年成交合同数比例</div>-->
				<div>
					<div class="huojv-costContract-chart-panel max" ref="chart3"></div>
				</div>

				<!-- 溢价成交情况表格  项目层级不显示 -->
				<el-table v-show="orgType <= 2" stripe
				          class="huo-list-table main-theme-table" size="mini"
				          highlight-current-row
				          :data="tableActiveData4">
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
					<el-table-column prop="contractName" label="详情" width="80" align="center">
						<template slot-scope="scope">
							<div @click="getMore(4,scope.row.orgName,scope.row.orgId)" :class="[scope.row.index !== 0 ? 'table-detail-link' : '']">{{scope.row.index !== 0 ? '查看详情' : '/'}}</div>
						</template>
					</el-table-column>
				</el-table>

				<!-- 区域公司显示 -->
				<el-table v-show="orgType > 2 && orgType <= 5" stripe
				          class="huo-list-table main-theme-table" size="mini"
				          highlight-current-row
				          :data="tableActiveData4">
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

				<div class="clearfix mt-10" v-if="tableData4.length > 6 && orgType <= 5">
					<span class="more" @click="getMore(4,tableData4 && tableData4[0].orgName,orgId)">查看更多 <i class="el-icon-arrow-right"></i></span>
				</div>
				<div class="data-title-box">
					<div class="tips pb-20">
						<div>备注：</div>
						<div>特批折扣执行比例=执行特批折扣合同数/本年签约合同数，</div>
						<div>综合特批折扣点数=（价格变更后金额-价格变更前金额）/价格变更前金额</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
    import scrollFixed from '@/mixin/scroll-fixed';
    import {
        List,
        PullRefresh,
    } from 'vant';
    import {getLocalStorage} from '@/utils/local-storage';
    import request from '@/utils/request';
    import echarts from 'echarts'
    import $ from 'jquery'
    import {handleNum2String, handleDate, getUrlParam,jumpToPj } from '@/utils/common'


    export default {
        mixins: [scrollFixed],
        data() {
            return {
                isLoading: false,
                orgId:'',  // 组织机构id
                orgType: '',  // 组织机构类型
                unit: '',  // 单位
                unit1: '',  // 单位
                chartOption: {
                    tooltip: {
                        trigger: 'axis',
                        backgroundColor: "rgba(255,255,255,0.8)", //设置背景图片 rgba格式
                        color: "#666666",
                        extraCssText: 'box-shadow: 0 0 10px #ccc; padding: 15px;',
                        borderColor: "gray", //设置边框颜色
                        textStyle: {
                            color: "#666666", //设置文字颜色
                            fontSize: 10,
                        },
                        // formatter: '{b} <br />计划<br>{a0} ： {c0}<br/>{a1} ： {c1}<br/>{a2} ： {c2}<br/>{a3} ： {c3}'
                    },
                    title: {
                        text: '',
                        show: true,
                        textStyle: {
                            fontWeight: 'normal',
                            fontSize: 14,
                            color: '#333333'
                        },
                        x: 'center',
                        y: 'top'
                    },
                    legend: {
                        show: true,
                        type: 'plain',
                        icon: 'circle',
                        itemWidth: 10,
                        itemHeight: 10,
                        // orient: 'horizon',
                        x: 'center',
                        y: 'bottom',
                        textStyle: {
                            fontSize: 12,
                            color: '#999999'
                        },
                        data: []  //注：需接口获取
                    },
                    dataZoom: [
                        {
                            id: 'dataZoomX',
                            type: 'inside',
                            xAxisIndex: [0],
                            filterMode: 'filter',
                            zoomLock: true
                        }
                    ],
                    grid: {
                        'left': '4%',
                        'right': '4%',
                        'bottom': '5%',
                        'top': '15%',
                        'containLabel': true
                    },
                    animation: true,
                    toolbox: {
                        show: true,
                        feature: {}
                    },
                    calculable: true,
                    xAxis: {
                        type: 'category',
                        boundaryGap: true,
                        data: [],
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
                            rotate: 45,
                            textStyle: {
                                color: '#666666'
                            }
                        }
                    },
                    yAxis: {
                        type: 'value',
                        name: ``,
                        nameTextStyle:{
                            color:'#999'
                        },
                        axisTick: {
                            show: false
                        },
	                    splitLine:{
                            lineStyle:{
                                color: '#E8E8E8'
                            }
	                    },
                        axisLine: {
                            lineStyle: {
                                color: '#E8E8E8'
                            }
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#666666'
                            }
                        }
                    },
                    series: [],
                },

                chartData:[],
	            tab1:1,  // tab选项卡
                tableData1:[],  // 表格1数据
                tableActiveData1:[],  // 表格1显示的数据
                tableData2:[],  // 破底成交价表格数据
                tableActiveData2:[],  // 表破底成交价表格显示的数据
                tableData3:[],  // 溢价详情表格数据
                tableActiveData3:[],  // 溢价详情表格显示的数据
                tableData4:[],  // 溢价详情表格数据
                tableActiveData4:[],  // 溢价详情表格显示的数据

                sortColumn1:'reasonAdjustmentRange',  // 默认按照本季度调价幅度排序
                sortType1:'ASC', // 默认升序
                sortColumn2:'reasonUnderContractRate',  // 默认按照本季度调价幅度排序
                sortType2:'DESC', // 默认降序
                sortColumn3:'yearOverAdjustmentRange',  // 默认按照本季度调价幅度排序
                sortType3:'DESC', // 默认降序
                sortColumn4:'discountExecuteRate',  // 默认按照本季度调价幅度排序
                sortType4:'DESC', // 默认降序
            }
        },
        mounted() {
            // 给表头添加滑动监听事件  使之滑动表头的时候表格内容跟着滚动
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
        methods: {
						jumpToPj,
            // 初始化数据
            init(){
                this.orgId = getUrlParam('chooseOrgId') || getUrlParam('orgId') || getLocalStorage('orgId').orgId;
                this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType;
                this.unit = this.orgType <=5 ? '(亿)':'(万)';   // 表格中的单位
                this.unit1 = this.orgType <=5 ? '亿':'万';  // 文字信息中的单位

                this.getTableData1();
                this.getChartData();

                // 组织机构不为项目层级时执行
                if(this.orgType <= 5){
                    this.getCommonTableData(2); // 获取破底价成交监控
                    this.getCommonTableData(3); //对比底价溢价成交情况
                    this.getCommonTableData(4); //特批折扣执行情况--表格数据
                }
            },

	        // 获取绝对值
	        getAbsoluteVal(val){
                if(!val) return '';
                return val > 0 ? val : (-1 * val).toFixed(2);
	        },

	        // 切换tab选项卡
            checkTab1(tab1){
                this.tab1 = tab1;
                this.getTableData1()
            },

	        // 获取调价情况分析表格数据
	        getTableData1(){
                request({
                    url: `/app-api/saleBack/priceManagement/priceAdjustmentAnalysis`,
                    method: 'get',
                    params: {orgId : this.orgId,parentProductType:this.tab1 - 1,sortColumn:this.sortColumn1,sortType:this.sortType1,current:1,size: 10}
                }).then(({data}) => {
                    if (data.code === 0 && data.data && data.data.records) {
                        let list = data.data.records;
                        if(list.length){
                            list[0].index = 0;
                        }

                        this.tableData1 = list;
                        if(list.length > 6){
                            this.tableActiveData1 = list.slice(0,6);
                        }else{
                            this.tableActiveData1 = list;
                        }
                    }
                });
	        },

	        // 获取所有柱状图数据
            getChartData(){
                request({
                    url: `/app-api/saleBack/priceManagement/priceMovement`,
                    method: 'get',
                    params: {orgId : this.orgId,sortColumn:'yearUnderContractTs',sortType:'DESC'}
                }).then(({data}) => {
                    if (data.code === 0 && data.data) {
                        let list = data.data || [];
                        list.forEach(item => {
                            if(item.orgName.indexOf('商业开发集团') >= 0){
                                item.orgName = '商业集团';
                            }else if(item.orgName.indexOf('地产开发集团') >= 0){
                                item.orgName = '地产集团';
                            }
                        });
                        this.chartData = list;

                        this.drawChart1(list);
                        this.drawChart2(list);
                        this.drawChart3(list);
                    }
                });
            },

	        // 绘制成低价成交情况趋势图
            drawChart1(list){
                let colors = ['#006E38','#B4A36B','#FFC40F'];
                let xAxisData = ['底价下浮0-1%(含)','底价下浮1%-2%(含)','底价下浮2%-3%(含)','底价下浮3%-5%(含)','底价下浮大于5%'];
                let series = [];
                let contractTs = [];
                let hasData = false;

                if(list.length) hasData = true;

	            list.forEach((item,index) => {
                    let chartData = [
                        item.yearUnderOneContractRate,
	                    item.yearUnderTwoContractRate,
	                    item.yearUnderTwoContractRate,
	                    item.yearUnderFourContractRate,
	                    item.yearUnderFiveContractRate,
                    ];

                    contractTs.push([
                        item.yearUnderOneContractTs,
                        item.yearUnderTwoContractTs,
                        item.yearUnderThreeContractTs,
                        item.yearUnderFourContractTs,
                        item.yearUnderFiveContractTs,
                    ]);

                    series.push({
                        name: item.orgName,
                        type: 'bar',
                        barWidth: list.length > 1 ? 10 : 15,  // 如果有多个组织机构  柱状图宽度变窄
                        itemStyle: {
                            normal: {
                                color: colors[index]
                            }
                        },
                        label: {
                            show: false,
                            position: 'inside',
                            formatter: function (params) {
                                if (params.value == 0) {
                                    return '';
                                } else {
                                    return params.value;
                                }
                            }
                        },
                        data: chartData
                    })
                })

                let legendData = series.map(item => {
                    return item.name;
                });

                let option = JSON.parse(JSON.stringify(this.chartOption));
                option.series = series;
                option.legend.data = legendData;
                if(list.length <= 1){
                    option.legend.show = false;  // 不显示legend
                }

                option.yAxis.axisLabel.formatter = (params) => {
                    return params + '%';
                }

                if(hasData){
                    option.title.text = '破底价成交情况';
                    option.title.y = 'top';
                }else{
                    option.title.text = '暂无数据';
                    option.title.y = 'center';
                }

                option.tooltip.formatter = (params) => {
                    let showHtm = "";
                    for (let i = 0; i < params.length; i++) {
                        let itemInfo = list.filter(item => {
                            return item.orgName === params[i].seriesName;
                        })[0];

                        showHtm += '<div>' + itemInfo.orgName + '</div>'+
		                        '<div>本年破底价合同数:' + itemInfo.yearUnderContractTs +'套</div>'+
		                        '<div>'+ params[i].axisValueLabel + ':' + contractTs[i][params[i].dataIndex] + '套</div>' + (i != params.length - 1 ? '<br/>' : '')
                    }

                    return showHtm;
                };

                option.xAxis.data = xAxisData;

                if (xAxisData.length > 8) {
                    option.dataZoom[0].endValue = xAxisData[7];
                } else {
                    option.dataZoom[0].endValue = xAxisData[xAxisData.length - 1];
                }
                option.dataZoom[0].startValue = xAxisData[0];
                let myChart = new echarts.init(this.$refs.chart1);
                myChart.setOption(option, true);
            },

            // 绘制溢价情况图
            drawChart2(list){
                let colors = ['#006E38','#B4A36B','#FFC40F'];
                let xAxisData = ['成交价=底价','底价上浮0-2%(含)','底价上浮2%-5%(含)','底价上浮大于5%'];
                let names = ['对比最新版底价','对比首次定价方案'];
                let series = [],contractTs1 = [], contractTs2 = [];
                let hasData = false;
                if(list.length) hasData = true;

                list.forEach((item, index) => {
                    // 对比最新版底价 数据
                    let chartData1 = [
                        item.yearOverOneContractRate,
                        item.yearOverTwoContractRate,
                        item.yearOverThreeContractRate,
                        item.yearOverFourContractRate,
                    ];

                    // 对比首次定价方案 数据
                    let chartData2 = [
                        item.firstOverOneContractRate,
                        item.firstOverTwoContractRate,
                        item.firstOverThreeContractRate,
                        item.firstOverFourContractRate,
                    ];

                    contractTs1.push([
                        item.yearOverOneContractTs,
                        item.yearOverTwoContractTs,
                        item.yearOverThreeContractTs,
                        item.yearOverFourContractTs,
                    ]);

                    contractTs2.push([
                        item.firstOverOneContractTs,
                        item.firstOverTwoContractTs,
                        item.firstOverThreeContractTs,
                        item.firstOverFourContractTs,
                    ]);

                    if(this.orgType <= 2){
                        series.push({
                            name: item.orgName,
                            type: 'bar',
                            barWidth: '10',
                            itemStyle: {
                                normal: {
                                    color: colors[index]
                                }
                            },
                            label: {
                                show: false,
                                position: 'inside',
                                formatter: function (params) {
                                    if (params.value == 0) {
                                        return '';
                                    } else {
                                        return params.value;
                                    }
                                }
                            },
                            data: chartData1
                        });
                    }else{
                        series = [{
                            name: names[0],
                            type: 'bar',
                            barWidth: '10',
                            itemStyle: {
                                normal: {
                                    color: colors[0]
                                }
                            },
                            label: {
                                show: false,
                                position: 'inside',
                                formatter: function (params) {
                                    if (params.value == 0) {
                                        return '';
                                    } else {
                                        return params.value;
                                    }
                                }
                            },
                            data: chartData1
                        },{
                            name: names[1],
                            type: 'bar',
                            barWidth: '10',
                            itemStyle: {
                                normal: {
                                    color: colors[1]
                                }
                            },
                            label: {
                                show: false,
                                position: 'inside',
                                formatter: function (params) {
                                    if (params.value == 0) {
                                        return '';
                                    } else {
                                        return params.value;
                                    }
                                }
                            },
                            data: chartData2
                        }];
                    }
                })


                let legendData = series.map(item => {
                    return item.name;
                });

                let option = JSON.parse(JSON.stringify(this.chartOption));
                option.series = series;
                option.legend.data = legendData;
                option.yAxis.axisLabel.formatter = (params) => {
                    return params + '%';
                }

                if(hasData){
                    option.title.text = '溢价成交情况';
                    option.title.y = 'top';
                }else{
                    option.title.text = '暂无数据';
                    option.title.y = 'center';
                }

                option.tooltip.formatter = (params,index) => {
                    let showHtm = "";
                    if(this.orgType <= 2){
                        for (let i = 0; i < params.length; i++) {
                            let itemInfo = list.filter(item => {
                                return item.orgName === params[i].seriesName;
                            })[0];

                            showHtm += '<div>' + itemInfo.orgName + '</div>'+
                                '<div>本年溢价合同数:' + itemInfo.yearOverContractTs +'套</div>'+
                                '<div>'+ params[i].axisValueLabel + ':' + contractTs1[i][params[i].dataIndex] + '套</div>' + (i != params.length - 1 ? '<br/>' : '')
                        }
                    }else{
                        let itemInfo = list[0];  // 只有一条数据
                        showHtm += '<div>对比最新版底价</div>'+
                            '<div>本年溢价合同数:' + itemInfo.yearOverContractTs +'套</div>'+
                            '<div>'+ params[0].axisValueLabel + ':' + contractTs1[0][params[0].dataIndex] + '套</div><br/>'+

                            '<div>对比首次定价方案</div>'+
                            '<div>本年溢价合同数:' + itemInfo.yearOverContractTs +'套</div>'+
                            '<div>'+ params[0].axisValueLabel + ':' + contractTs2[0][params[0].dataIndex] + '套</div>';
                    }


                    return showHtm;
                };

                option.xAxis.data = xAxisData;

                if (xAxisData.length > 5) {
                    option.dataZoom[0].endValue = xAxisData[4];
                } else {
                    option.dataZoom[0].endValue = xAxisData[xAxisData.length - 1];
                }
                option.dataZoom[0].startValue = xAxisData[0];
                let myChart = new echarts.init(this.$refs.chart2);
                myChart.setOption(option, true);
            },

            // 绘制成低价成交情况趋势图
            drawChart3(list){
                let xAxisData = ['特批折扣0-1个点(含)','特批折扣1-2个点(含)','特批折扣2-3个点(含)','特批折扣3-5个点(含)','特批折扣5个点以上'];
                let series = [];
                let colors = ['#006E38','#B4A36B','#FFC40F'];
                let executeTs = [];
                let hasData = false;
                if(list.length) hasData = true;
                list.forEach((item,index) => {
                    let chartData = [
                        item.discountOneExecuteRate,
                        item.discountTwoExecuteRate,
                        item.discountThreeExecuteRate,
                        item.discountFourExecuteRate,
                        item.discountFiveExecuteRate,
                    ];

                    executeTs.push([
                        item.discountOneExecuteTs,
                        item.discountTwoExecuteTs,
                        item.discountThreeExecuteTs,
                        item.discountFourExecuteTs,
                        item.discountFiveExecuteTs,
                    ]);

                    series.push({
                        name: item.orgName,
                        type: 'bar',
                        barWidth: list.length > 1 ? 10 : 15,  // 如果有多个组织机构  柱状图宽度变窄
                        itemStyle: {
                            normal: {
                                color: colors[index]
                            }
                        },
                        label: {
                            show: false,
                            position: 'inside',
                            formatter: function (params) {
                                if (params.value == 0) {
                                    return '';
                                } else {
                                    return params.value;
                                }
                            }
                        },
                        data: chartData
                    })
                })

                let legendData = series.map(item => {
                    return item.name;
                });

                let option = JSON.parse(JSON.stringify(this.chartOption));
                option.series = series;
                option.legend.data = legendData;
                if(list.length <= 1){
                    option.legend.show = false;  // 不显示legend
                }
                option.yAxis.axisLabel.formatter = (params) => {
                    return params + '%';
                }

                if(hasData){
                    option.title.text = '特批折扣执行情况';
                    option.title.y = 'top';
                }else{
                    option.title.text = '暂无数据';
                    option.title.y = 'center';
                }

                option.tooltip.formatter = function (params) {
                    let showHtm = "";
                    for (let i = 0; i < params.length; i++) {

                        let itemInfo = list.filter(item => {
                            return item.orgName === params[i].seriesName;
                        })[0];

                        showHtm += '<div>' + itemInfo.orgName + '</div>'+
                            '<div>本年特批折扣合同数:' + itemInfo.discountExecuteTs +'套</div>'+
                            '<div>'+ params[i].axisValueLabel + ':' + executeTs[i][params[i].dataIndex] + '套</div>' + (i != params.length - 1 ? '<br/>' : '')
                    }

                    return showHtm;
                };

                option.xAxis.data = xAxisData;
                option.xAxis.axisLabel.rotate = 60;

                if (xAxisData.length > 8) {
                    option.dataZoom[0].endValue = xAxisData[7];
                } else {
                    option.dataZoom[0].endValue = xAxisData[xAxisData.length - 1];
                }
                option.dataZoom[0].startValue = xAxisData[0];
                let myChart = new echarts.init(this.$refs.chart3);
                myChart.setOption(option, true);
            },

	        // 获取破底价成交监控-对比底价溢价成交情况-特批折扣执行情况--表格数据
            getCommonTableData(index){
                request({
                    url: `/app-api/saleBack/priceManagement/priceMovementTable`,
                    method: 'get',
                    params: {orgId : this.orgId,sortColumn:this['sortColumn'+index],sortType:this['sortType' + index],current:1,size: 10}
                }).then(({data}) => {
                    if (data.code === 0 && data.data && data.data.records) {
                        let list = data.data.records;
                        if(list.length){
                            list[0].index = 0;
                        }

                        this['tableData'+index] = list;
                        if(list.length > 6){
                            this['tableActiveData'+index] = list.slice(0,6);
                        }else{
                            this['tableActiveData'+index] = list;
                        }
                    }
                });
            },

            // 跳转至更多首开项目去化数据页面
            getMore(pageType,orgName,orgId){
                this.$router.push({path:'/report/saleReceipts/morePriceManage', query: {orgId,orgName,orgType: this.orgType,tab: this.tab1,pageType,productType:this.tab1 - 1, token: getUrlParam('token')}});
            },

	        // 点击表头排序
            sortData(sortColumn,index,type){
                if(this['sortColumn'+index] != sortColumn){
                    this['sortColumn'+index] = sortColumn;
                    this.sortType = type || 'DESC';
                }else{
                    this['sortType'+index] = (this['sortType'+index] == 'ASC' ? 'DESC' : 'ASC');
                }

                if(index == 1){
                    this.getTableData1();
                }else{
                    this.getCommonTableData(index);
                }
            },

        },
        components: {
            [List.name]: List,
            [PullRefresh.name]: PullRefresh,
        }
    };
</script>


<style lang="scss" scoped>
	.boxTitle{
		font-size: 14px;
		color: #333333;
		margin: 18px 0;
	}
	.boxTitle2{
		font-size: 14px;
		color: #333333;
		margin: 0;
	}
	.fR{
		color: #B2B2B2;
		font-size: 11px;
		float: right;
	}
	// .tableToggle{
	//     text-align: right;
	//     margin: 0;

	// }
	.tableBox{
		margin-bottom: 80px;
	}
	.more{
		font-size: 12px;
		color: #666666;
		float: right;
		margin-top: 12px;
		&.up{
			color: #209B5C;
		}
	}
</style>
