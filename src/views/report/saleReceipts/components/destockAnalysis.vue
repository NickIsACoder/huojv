<template>
	<div class="report-index">
		<div class="main-content" style="width: 100%;">
			<div class="data-content-panel no-top-left-radius clearfix" style="overflow: visible;">
				<!-- 组织机构层级小于5时显示 -->
				<div v-show="orgType <= 5">
					<p class="boxTitle">一、首开项目去化</p>
					<h2 class="second-title text-center">首开30天签约去化平均线<label v-show="orgType > 2 && orgType <= 5" class="red-color" v-for="(item,index) in monthContractDecheRate" :key="'monthContractDecheRate'+index" v-text="item.orgName + (item.monthContractDecheRate || '-') + '% '"></label></h2>
					<h2 class="second-title text-center red-color" v-show="orgType <= 2">
						<label class="red-color mr-10" v-for="(item,index) in monthContractDecheRate" :key="'monthContractDecheRate'+index" v-text="item.orgName + (item.monthContractDecheRate || '-') + '%'"></label>
					</h2>
					<div class="mb-30 mt-20">
						<el-table
								stripe
								class="huo-list-table main-theme-table rowspanTable not-hide-text"
								ref="singleTable1" size="mini"
								:data="tableActiveData1"
						>
							<el-table-column property="orgName" label="项目" align="center" class-name="bdr" width="80" fixed>
								<template slot-scope="scope">
									<span :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,6)">{{scope.row.orgName}}</span>
								</template>
							</el-table-column>
							<el-table-column property="monthContractDecheRate" label="放盘当月签约去化率" align="center" width="100">
								<template slot="header" slot-scope="scope">
									<div @click="sortData1('monthContractDecheRate')">
										<span>放盘当月签约去化率</span>
<!--										<i :class="[sortColumn1 === 'monthContractDecheRate' ? 'green-font' : 'light-green-font']"-->
<!--										   class="el-icon-caret-top" style="margin-left: 2px;"></i>-->

										<label class="table-sort-ico">
											<i :class="[sortColumn1 == 'monthContractDecheRate' && sortType1 === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
											<i :class="[sortColumn1 == 'monthContractDecheRate' && sortType1 === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
										</label>
									</div>
								</template>
								<template slot-scope="scope">
									<span>{{(scope.row.monthContractDecheRate || '-') +'%'}}</span>
								</template>
							</el-table-column>
							<el-table-column property="weekOrderDecheRate" label="放盘7天内认购去化率" align="center" width="100">
								<template slot="header" slot-scope="scope">
									<div @click="sortData1('weekOrderDecheRate')">
										<span>放盘7天内认购去化率</span>
<!--										<i :class="[sortColumn1 === 'weekOrderDecheRate' ? 'green-font' : 'light-green-font']"-->
<!--										   class="el-icon-caret-top" style="margin-left: 2px;"></i>-->
										<label class="table-sort-ico">
											<i :class="[sortColumn1 == 'weekOrderDecheRate' && sortType1 === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
											<i :class="[sortColumn1 == 'weekOrderDecheRate' && sortType1 === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
										</label>
									</div>
								</template>
								<template slot-scope="scope">
									<span>{{(scope.row.weekOrderDecheRate || '-') +'%'}}</span>
								</template>
							</el-table-column>
							<el-table-column property="contractDecheRate" label="截至当下累计签约去化率" align="center" width="100">
								<template slot="header" slot-scope="scope">
									<div @click="sortData1('contractDecheRate')">
										<span>截至当下累计签约去化率</span>
<!--										<i :class="[sortColumn1 === 'contractDecheRate' ? 'green-font' : 'light-green-font']"-->
<!--										   class="el-icon-caret-top" style="margin-left: 2px;"></i>-->
										<label class="table-sort-ico">
											<i :class="[sortColumn1 == 'contractDecheRate' && sortType1 === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
											<i :class="[sortColumn1 == 'contractDecheRate' && sortType1 === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
										</label>
									</div>
								</template>
								<template slot-scope="scope">
									<span>{{(scope.row.contractDecheRate || '-') +'%'}}</span>
								</template>
							</el-table-column>
							<el-table-column property="contractPrice" label="截止当下累计签约均价(元/方)" align="center" width="110"></el-table-column>
							<el-table-column property="fpDate" label="放盘时间" align="center" width="80"></el-table-column>
							<el-table-column property="fpCount" label="放盘套数(套)" align="center" width="80"></el-table-column>
							<el-table-column property="fpAmount" label="放盘货值(亿)" align="center" width="80"></el-table-column>

						</el-table>
						<div class="toggleBox" v-if="tableData1.length>8">
							<span class="more" v-if="tableActiveData1.length==8" @click="getMoreProjectEliminated(1)">查看更多 <i class="el-icon-arrow-right"></i></span>
							<!--						<span class="more up" v-if="tableActiveData1.length>6" @click="tableActiveData1 = tableData1.slice(0,6)">收起 <i class="el-icon-arrow-up"></i></span>-->
						</div>
					</div>
				</div>

				<p class="boxTitle">{{orgType > 5 ? '一' : '二'}}、期初流入旧货去化</p>
				<ul class="data-info-list2">
					<li>
						<div class="list-content">
							<h2 class="info-title">住宅</h2>
							<div class="info-content">
								<label class="item-title">去化率</label>
								<label class="item-value" v-text="(productTypeEliminated.zz.oldDecheRate || '-') + '%'"></label>
							</div>
							<div class="info-content">
								<label class="item-title">流入</label>
								<label class="item-value" v-text="(productTypeEliminated.zz.oldInflowAmount || '-') + unit"></label>
							</div>
							<div class="info-content">
								<label class="item-title">已售</label>
								<label class="item-value" v-text="(productTypeEliminated.zz.oldContractAmount || '-') + unit"></label>
							</div>
							<div class="info-content">
								<label class="item-title">未售</label>
								<label class="item-value" v-text="(productTypeEliminated.zz.oldNotContractAmount || '-') + unit"></label>
							</div>
							<div class="info-content">
								<label class="item-title">存销比</label>
								<label class="item-value" v-text="(productTypeEliminated.zz.oldDepositSaleRate || '-') + '个月'"></label>
							</div>
						</div>
					</li>
					<li>
						<div class="list-content">
							<h2 class="info-title">商业</h2>
							<div class="info-content">
								<label class="item-title">去化率</label>
								<label class="item-value" v-text="(productTypeEliminated.sy.oldDecheRate || '-') + '%'"></label>
							</div>
							<div class="info-content">
								<label class="item-title">流入</label>
								<label class="item-value" v-text="(productTypeEliminated.sy.oldInflowAmount || '-') + unit"></label>
							</div>
							<div class="info-content">
								<label class="item-title">已售</label>
								<label class="item-value" v-text="(productTypeEliminated.sy.oldContractAmount || '-') + unit"></label>
							</div>
							<div class="info-content">
								<label class="item-title">未售</label>
								<label class="item-value" v-text="(productTypeEliminated.sy.oldNotContractAmount || '-') + unit"></label>
							</div>
							<div class="info-content">
								<label class="item-title">存销比</label>
								<label class="item-value" v-text="(productTypeEliminated.sy.oldDepositSaleRate || '-') + '个月'"></label>
							</div>
						</div>
					</li>
					<li>
						<div class="list-content">
							<h2 class="info-title">车位</h2>
							<div class="info-content">
								<label class="item-title">去化率</label>
								<label class="item-value" v-text="(productTypeEliminated.cw.oldDecheRate || '-') + '%'"></label>
							</div>
							<div class="info-content">
								<label class="item-title">流入</label>
								<label class="item-value" v-text="(productTypeEliminated.cw.oldInflowAmount || '-') + unit"></label>
							</div>
							<div class="info-content">
								<label class="item-title">已售</label>
								<label class="item-value" v-text="(productTypeEliminated.cw.oldContractAmount || '-') + unit"></label>
							</div>
							<div class="info-content">
								<label class="item-title">未售</label>
								<label class="item-value" v-text="(productTypeEliminated.cw.oldNotContractAmount || '-') + unit"></label>
							</div>
							<div class="info-content">
								<label class="item-title">存销比</label>
								<label class="item-value" v-text="(productTypeEliminated.cw.oldDepositSaleRate || '-') + '个月'"></label>
							</div>
						</div>
					</li>
				</ul>

				<p class="boxTitle">{{orgType > 5 ? '二' : '三'}}、本年新取证新货去化</p>
				<ul class="data-info-list2">
					<li>
						<div class="list-content">
							<h2 class="info-title">住宅</h2>
							<div class="info-content">
								<label class="item-title">去化率</label>
								<label class="item-value" v-text="(productTypeEliminated.zz.newDecheRate || '-') + '%'"></label>
							</div>
							<div class="info-content">
								<label class="item-title">流入</label>
								<label class="item-value" v-text="(productTypeEliminated.zz.newInflowAmount || '-') + unit"></label>
							</div>
							<div class="info-content">
								<label class="item-title">已售</label>
								<label class="item-value" v-text="(productTypeEliminated.zz.newContractAmount || '-') + unit"></label>
							</div>
							<div class="info-content">
								<label class="item-title">未售</label>
								<label class="item-value" v-text="(productTypeEliminated.zz.newNotContractAmount || '-') + unit"></label>
							</div>
							<div class="info-content">
								<label class="item-title">存销比</label>
								<label class="item-value" v-text="(productTypeEliminated.zz.newDepositSaleRate || '-') + '个月'"></label>
							</div>
						</div>
					</li>
					<li>
						<div class="list-content">
							<h2 class="info-title">商业</h2>
							<div class="info-content">
								<label class="item-title">去化率</label>
								<label class="item-value" v-text="(productTypeEliminated.sy.newDecheRate || '-') + '%'"></label>
							</div>
							<div class="info-content">
								<label class="item-title">流入</label>
								<label class="item-value" v-text="(productTypeEliminated.sy.newInflowAmount || '-') + unit"></label>
							</div>
							<div class="info-content">
								<label class="item-title">已售</label>
								<label class="item-value" v-text="(productTypeEliminated.sy.newContractAmount || '-') + unit"></label>
							</div>
							<div class="info-content">
								<label class="item-title">未售</label>
								<label class="item-value" v-text="(productTypeEliminated.sy.newNotContractAmount || '-') + unit"></label>
							</div>
							<div class="info-content">
								<label class="item-title">存销比</label>
								<label class="item-value" v-text="(productTypeEliminated.sy.newDepositSaleRate || '-') + '个月'"></label>
							</div>
						</div>
					</li>
					<li>
						<div class="list-content">
							<h2 class="info-title">车位</h2>
							<div class="info-content">
								<label class="item-title">去化率</label>
								<label class="item-value" v-text="(productTypeEliminated.cw.newDecheRate || '-') + '%'"></label>
							</div>
							<div class="info-content">
								<label class="item-title">流入</label>
								<label class="item-value" v-text="(productTypeEliminated.cw.newInflowAmount || '-') + unit"></label>
							</div>
							<div class="info-content">
								<label class="item-title">已售</label>
								<label class="item-value" v-text="(productTypeEliminated.cw.newContractAmount || '-') + unit"></label>
							</div>
							<div class="info-content">
								<label class="item-title">未售</label>
								<label class="item-value" v-text="(productTypeEliminated.cw.newNotContractAmount || '-') + unit"></label>
							</div>
							<div class="info-content">
								<label class="item-title">存销比</label>
								<label class="item-value" v-text="(productTypeEliminated.cw.newDepositSaleRate || '-') + '个月'"></label>
							</div>
						</div>
					</li>
				</ul>

				<!-- 去化量价趋势分析 -->
				<p class="boxTitle">{{orgType > 5 ? '三' : '四'}}、去化量价趋势分析(可按不同业态切换)</p>
				<div class="text-center">
					<ul class="huojv-tab-bars_1 four-cols" style="margin-bottom: 0;">
						<li
								@click="checkTab1(1)"
								v-eventlisten="{isChangePage:false,pageEvent:'点击总体按钮'}"
								:class="[tab1 == 1 ? 'active' : '']"
						>总体</li>
						<li
								@click="checkTab1(2)"
								v-eventlisten="{isChangePage:false,pageEvent:'点击住宅类按钮'}"
								:class="[tab1 == 2 ? 'active' : '']"
						>住宅类</li>
						<li
								@click="checkTab1(3)"
								v-eventlisten="{isChangePage:false,pageEvent:'点击商业类按钮'}"
								:class="[tab1 == 3 ? 'active' : '']"
						>商业类</li>
						<li
								@click="checkTab1(4)"
								v-eventlisten="{isChangePage:false,pageEvent:'点击车位按钮'}"
								:class="[tab1 == 4 ? 'active' : '']"
						>车位</li>
					</ul>
				</div>
				<div class="mb-30 mt-20">
					<el-table
							stripe
							class="huo-list-table main-theme-table not-hide-text"
							ref="singleTable1" size="mini"
							:data="tableData2"
							v-show="orgType <= 5"
					>
					<el-table-column property="itemName" label="" align="center" width="90"></el-table-column>
						<el-table-column property="item1" label="有投资测算版项目本年目标" align="center" width="90">
							<template slot-scope="scope">
								<div v-show="!scope.row.noItem1" :a="scope.row.noItem1">
									<div class="text-center">{{scope.row.index == 0 ? '去化目标' : ('目标均价' + (tab1 == 1 ? '(不含车位)' : ''))}}</div>
									<div class="text-center red-color">{{scope.row.index == 0 ? (scope.row.item1 + unit) : (scope.row.item1 + (tab1 == 4 ? '元/个' : '元/方'))}}</div>
								</div>
								<div v-show="scope.row.noItem1">/</div>
							</template>
						</el-table-column>
						<el-table-column property="item2" label="本年实际完成" align="center" width="180">
							<template slot-scope="scope">
								<div class="text-center">{{scope.row.index == 0 ? '本年累计签约' : '本年签约均价'}}
									<label class="red-color">{{scope.row.index == 0 ? (scope.row.item2 + unit) : (scope.row.item2 + (tab1 == 4 ? '元/个' : '元/方'))}}</label>
								</div>
								<div class="text-center">
									<label>{{scope.row.index == 0 ? '有投测目标项目完成 ' : '有投测目标项目 '}}</label>
									<label class="red-color">{{scope.row.index == 0 ? (scope.row.item5 +'亿') : (scope.row.item5 +(tab1 == 4 ? '元/个' : '元/方'))}}</label>
								</div>
							</template>
						</el-table-column>
						<el-table-column property="item3" label="偏差对比" align="center" width="120">
							<template slot-scope="scope">
								<div class="text-center">{{scope.row.index == 0 ? '投资版达成率' : (scope.row.item3 > 0 ? '溢价' : '损失')}}</div>
								<div class="text-center red-color" style="position: relative;">
									{{scope.row.index == 0 ? scope.row.item3 + '%' : ((parseFloat(scope.row.item1) === 0 || parseFloat(scope.row.item2) === 0) ? '/' : ((scope.row.item3 == '-' ? '-' : (scope.row.item3 > 0 ? scope.row.item3 : scope.row.item3 * -1)) + (tab1 == 4 ? '元/个' : '元/方')))}}
									<i class="huojv-arrow-up" v-show="scope.row.index == 1 && scope.row.item3 > 0"></i>
									<i class="huojv-arrow-down" v-show="scope.row.index == 1 && scope.row.item3 < 0"></i>
								</div>
							</template>
						</el-table-column>
						<el-table-column property="item4" label="有投测目标在售项目数/本年投测目标达标项目数" align="center" width="160"></el-table-column>
					</el-table>

					<el-table
							stripe
							class="huo-list-table main-theme-table not-hide-text"
							ref="singleTable1" size="mini"
							:data="tableData2"
							v-show="orgType > 5"
					>
					<el-table-column property="itemName" label="" align="center" width="90"></el-table-column>
						<el-table-column property="item1" label="有投资测算版项目本年目标" align="center" width="90">
							<template slot-scope="scope">
								<div v-show="!scope.row.noItem1">
									<div class="text-center">{{scope.row.index == 0 ? '去化目标' : ('目标均价' + (tab1 == 1 ? '(不含车位)' : ''))}}</div>
									<div class="text-center red-color">{{scope.row.index == 0 ? (scope.row.item1 + unit) : (scope.row.item1 + (tab1 == 4 ? '元/个' : '元/方'))}}</div>
								</div>
								<div v-show="scope.row.noItem1">/</div>
							</template>
						</el-table-column>
						<el-table-column property="item2" label="本年实际完成" align="center" width="120">
							<template slot-scope="scope">
								<div class="text-center">{{scope.row.index == 0 ? '本年累计签约' : '本年签约均价'}}
									<label class="red-color">{{scope.row.index == 0 ? scope.row.item2 + unit : scope.row.item2 + (tab1 == 4 ? '元/个' : '元/方')}}</label>
								</div>
<!--								<div class="text-center red-color">{{scope.row.index == 0 ? ('有投测目标项目完成'+ scope.row.item5 +'亿') : ('有投测目标项目'+ scope.row.item5 +(tab1 == 4 ? '元/个' : '元/方'))}}</div>-->
							</template>
						</el-table-column>
						<el-table-column property="item3" label="偏差对比" align="center">
							<template slot-scope="scope">
								<div class="text-center">{{scope.row.index == 0 ? '投资版达成率' : (scope.row.item3 > 0 ? '溢价' : '损失')}}</div>
								<div class="text-center red-color" style="position: relative;">
									{{scope.row.index == 0 ? scope.row.item3 + '%' : ((parseFloat(scope.row.item1) === 0 || parseFloat(scope.row.item2) === 0) ? '/' : ((scope.row.item3 == '-' ? '-' : (scope.row.item3 > 0 ? scope.row.item3 : scope.row.item3 * -1)) + (tab1 == 4 ? '元/个' : '元/方')))}}
									<i class="huojv-arrow-up" v-show="scope.row.index == 1 && scope.row.item3 > 0"></i>
									<i class="huojv-arrow-down" v-show="scope.row.index == 1 && scope.row.item3 < 0"></i>
								</div>
							</template>
						</el-table-column>
					</el-table>
				</div>

				<!-- 本年成交金额和均价趋势图 -->
				<div class="huojv-costContract-chart-panel" ref="chart0"></div>

				<!-- 组织机构层级小于5时显示  项目投资测算目标表格-->
				<div class="mb-30 mt-20" v-show="orgType <= 5">
					<p class="boxTitle text-center">项目投资测算目标达成情况{{tab1 == 1 ? '(均价不含车位)' : ''}}</p>
					<el-table
							stripe
							class="huo-list-table main-theme-table not-hide-text"
							ref="singleTable1" size="mini"
							:data="tableData3"
					>
						<el-table-column property="orgName" label="项目名称" width="80" fixed>
							<template slot-scope="scope">
								<span :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,6)">{{scope.row.orgName}}</span>
							</template>
						</el-table-column>
						<el-table-column property="premiumPrice" label="溢价/损失" align="center" width="135">
							<template slot="header" slot-scope="scope">
								<div @click="sortData('PremiumPrice')">
									<span>{{'溢价/损失'}}</span>
<!--									<i :class="[sortColumn === 'PremiumPrice' ? 'green-font' : 'light-green-font']"-->
<!--									   class="el-icon-caret-top" style="margin-left: 2px;"></i>-->
									<label class="table-sort-ico">
										<i :class="[sortColumn == 'PremiumPrice' && sortType === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
										<i :class="[sortColumn == 'PremiumPrice' && sortType === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
									</label>
								</div>
							</template>
							<template slot-scope="scope">
								<span>{{scope.row.premiumPrice == '/' ? '/' : ((scope.row.premiumPrice > 0 ? '溢价' : '损失') + (scope.row.premiumPrice ? (scope.row.premiumPrice > 0 ? scope.row.premiumPrice : scope.row.premiumPrice * -1) : '-') + (tab1 == 4 ? '元/个' : '元/方'))}}</span>
							</template>
						</el-table-column>
						<el-table-column property="decheTargetPrice" label="投资测算版本年销售均价" align="center" width="100">
							<template slot-scope="scope">
								<span>{{(scope.row.decheTargetPrice || '-') + (tab1 == 4 ? '元/个' : '元/方')}}</span>
							</template>
						</el-table-column>
						<el-table-column property="yearContractPrice" label="本年实际销售均价" align="center" width="90">
							<template slot-scope="scope">
								<span>{{(scope.row.yearContractPrice || '-') + (tab1 == 4 ? '元/个' : '元/方')}}</span>
							</template>
						</el-table-column>
						<el-table-column property="investDecheRate" label="去化目标达成率" align="center" width="120">
							<template slot="header" slot-scope="scope">
								<div @click="sortData('InvestDecheRate')">
									<span>去化目标达成率</span>
<!--									<i :class="[sortColumn === 'InvestDecheRate' ? 'green-font' : 'light-green-font']"-->
<!--									   class="el-icon-caret-top" style="margin-left: 2px;"></i>-->
									<label class="table-sort-ico">
										<i :class="[sortColumn == 'InvestDecheRate' && sortType === 'ASC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-top"></i>
										<i :class="[sortColumn == 'InvestDecheRate' && sortType === 'DESC' ? 'green-font' : 'light-green-font']" class="el-icon-caret-bottom"></i>
									</label>
								</div>
							</template>
							<template slot-scope="scope">
								<span>{{(scope.row.investDecheRate || '-') + '%'}}</span>
							</template>
						</el-table-column>
						<el-table-column property="decheTargetAmount" label="投资测算版本年去化目标" align="center" width="100">
							<template slot-scope="scope">
								<span>{{(scope.row.decheTargetAmount || '-') + '亿'}}</span>
							</template>
						</el-table-column>
						<el-table-column property="yearContractAmount" label="本年累计去化金额" align="center" width="80">
							<template slot-scope="scope">
								<span>{{(scope.row.yearContractAmount || '-') + '亿'}}</span>
							</template>
						</el-table-column>

						<el-table-column property="adUserName" label="负责人" align="center" width="80"></el-table-column>
					</el-table>
					<div class="toggleBox" v-if="tableData3.length>5">
						<span class="more" @click="getMoreProjectEliminated(2)">查看更多 <i class="el-icon-arrow-right"></i></span>
						<!--						<span class="more up" v-if="tableActiveData1.length>6" @click="tableActiveData1 = tableData1.slice(0,6)">收起 <i class="el-icon-arrow-up"></i></span>-->
					</div>
				</div>

				<p class="huojv-bottom-box mt-30">
					<span class="huojv-btn-back" @click="back">返回首页</span>
				</p>
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
    import {handleNum2String, handleDate, getUrlParam,jumpToPj} from '@/utils/common'


    export default {
        mixins: [scrollFixed],
        data() {
            return {
                isLoading: false,
                orgId:this.chooseOrgId,
                orgType: getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType,
                unit: (getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType) <=5 ? '亿':'万',
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
                        text: '本年成交金额和均价趋势图',
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
                        'bottom': '12%',
                        'top': '20%',
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
                                color: '#999999'
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
                    yAxis: [
                        {
                            type: 'value',
                            name: ``,
                            nameTextStyle:{
                                color:'#999'
                            },
                            axisTick: {
                                show: false
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#999999'
                                }
                            },
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    color: '#666666'
                                }
                            }
                        },
                        {
                            type: 'value',
                            name: '单位：元/方',
                            nameTextStyle:{
                                color:'#999'
                            },
                            axisTick: {
                                show: false
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#999999'
                                }
                            },
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    color: '#666666'
                                }
                            }
                        }
                    ],
                    series: [],
                },

                monthContractDecheRate:[],
                tableData1:[], // 表格1全部数据
                tableActiveData1:[],  // 表格1展示数据
                productTypeEliminated:{zz:{},sy:{},cw:{}},
	            tableData2:[],  // 表格2全部数据
	            tableData3:[],  // 表格3全部数据
                tableActiveData3:[], // 表格3展示数据
                sortColumn:'PremiumPrice',  // 表格1排序字段
                sortColumn1:'monthContractDecheRate',  // 表格2排序字段
                sortType:'ASC',  // 表格1排序类型
                sortType1:'ASC',  // 表格2排序类型

                tab1:1
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
                this.unit = (getUrlParam('chooseOrgType') || getUrlParam('orgType') || getLocalStorage('orgType').orgType) <=5 ? '亿':'万';

                this.getProjectEliminated();
                this.getProductTypeEliminated();
                this.getAnalysisSummary();
                this.getChartData0();

                if(this.orgType <= 5){
                    this.getMonthContractDecheRate();
                    this.getProjectAchievement();
                }
            },

	        // 去化分析--首开30天签约去化平均线
	        getMonthContractDecheRate(){
                request({
                    url: `/app-api/saleBack/decontamination/monthContractDecheRate`,
                    method: 'get',
                    params: {orgId:this.orgId}
                }).then(({data}) => {
                    if (data.code === 0 && data.data) {
                        this.monthContractDecheRate = data.data;
                    }
                });
	        },

	        // 获取首开项目去化表格数据
            getProjectEliminated(){
                request({
                    url: `/app-api/saleBack/decontamination/projectEliminated`,
                    method: 'get',
                    params: {orgId : this.orgId,current: 1,size: 10, sortCloumn:this.sortColumn1,sortType: this.sortType1}
                }).then(({data}) => {
                    if (data.code === 0 && data.data && data.data.records) {
                        let list = data.data.records;

                        this.tableData1 = list;
                        if(list.length > 8){
                            this.tableActiveData1 = list.slice(0,8);
                        }else{
                            this.tableActiveData1 = list;
                        }
                    }
                });
            },

	        // 跳转至更多首开项目去化数据页面
            getMoreProjectEliminated(pageType){
	            this.$router.push({path:'/report/saleReceipts/moreProjectEliminated', query: {orgId: this.orgId,tab: this.tab1,pageType,productType:this.tab1 - 1, token: getUrlParam('token')}});
            },

	        // 获取期初流入旧货去化以及本年新取证新货去化数据
	        getProductTypeEliminated(){
                request({
                    url: `/app-api/saleBack/decontamination/productTypeEliminated`,
                    method: 'get',
                    params: {orgId : this.orgId}
                }).then(({data}) => {
                    if (data.code === 0 && data.data) {
                        let list = data.data;

                        list.forEach(item => {
                            if(item.parentProductType == 1){
                                this.productTypeEliminated.zz = item;  // 住宅数据
                            }else if(item.parentProductType == 2){
                                this.productTypeEliminated.sy = item;  // 商业数据
                            }else if(item.parentProductType == 3){
                                this.productTypeEliminated.cw = item;  // 车位数据
                            }
                        })
                    }
                });
	        },

	        // 获取去化量价趋势分析数据
	        getAnalysisSummary(){
						this.tableData2 = [];
                request({
                    url: `/app-api/saleBack/decontamination/quantityPriceTrendAnalysisSummary`,
                    method: 'get',
                    params: {orgId : this.orgId,productType:this.tab1 - 1}
                }).then(({data}) => {
                    if (data.code === 0 && data.data) {
                        let obj = data.data;

                        this.tableData2 = [{
													itemName: '签约去化',
												},{
													itemName: '销售均价'+(this.tab1==1?'(不含车位)':'')
												}];
                        this.tableData2[0].index = 0;
                        this.tableData2[1].index = 1;

                        this.tableData2[0].item1 = obj.decheTargetAmount || '-';
                        this.tableData2[1].item1 = obj.decheTargetPrice || '-';

                        if(!obj.decheTargetAmount && !obj.decheTargetPrice){
                            this.tableData2[0].noItem1 = true;
                            this.tableData2[1].noItem1 = true;
                        }else{
                            this.tableData2[0].noItem1 = false;
                            this.tableData2[1].noItem1 = false;
                        }

                        this.tableData2[0].item2 = obj.yearContractAmount || '-';
                        this.tableData2[1].item2 = obj.yearContractPrice || '-';

                        this.tableData2[0].item3 = obj.investDecheRate || '-';
                        this.tableData2[1].item3 = obj.premiumPrice || '-';

                        this.tableData2[0].item5 = obj.havingTargetYearContractAmount || '-';
                        this.tableData2[1].item5 = obj.havingTargetYearContractPrice || '-';

                        this.tableData2[0].item4 = (obj.onSaleAmountItemCount || '-') + '个/' + (obj.standAmountItemCount || '-')+'个';
                        this.tableData2[1].item4 = (obj.onSalePriceItemCount || '-') + '个/' + (obj.standPriceItemCount || '-')+'个';
										}
										
										console.log('aaa',this.tableData2)
                });
	        },

	        // 获取本年成交金额和均价趋势图数据
            getChartData0(){
                request({
                    url: `app-api/saleBack/decontamination/quantityPriceTrendAnalysis`,
                    method: 'get',
                    params: {orgId : this.orgId,productType:this.tab1 - 1}
                }).then(({data}) => {
                    if (data.code === 0 && data.data) {
                        let list = data.data || [];

                        this.drawChart0(list);
                    }
                });
            },

	        // 绘制本年成交金额和均价趋势图
            drawChart0(list){
                let xAxisData = [],seriesData1 = [], seriesData2 = [];
                list.forEach(item => {
                    xAxisData.push(item.months); // x轴数据
                    seriesData1.push(item.yearContractAmount); // 图表数据1
                    seriesData2.push(item.yearContractPrice); // 图表数据2
                })
                let series = [{
                    name: '成交金额',
                    type: 'bar',
                    barWidth: '10',
                    itemStyle: {
                        normal: {
                            color: '#4472C4'
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
                    data: seriesData1
                },{
                    name: '成交均价' + (this.tab1 == 1 ? '(不含车位)' : ''),
                    data: seriesData2,
                    type: 'line',
                    symbol: 'circle',     //设定为实心点
                    yAxisIndex: 1,
                    symbolSize: 4,   //设定实心点的大小
                    formatter: '{value} 个',
                    smooth: false,
                    itemStyle: {
                        normal: {
                            color: '#DE0C0C',
                            label : {
                                show: false,
	                            color: '#333333'
                            }
                        }

                    },
                    lineStyle: {
                        normal: {
                            width: 1,
                        }
                    },
                }];

                let legendData = series.map(item => {
                    return item.name;
                });

                let option = JSON.parse(JSON.stringify(this.chartOption));
                option.series = series;
                option.legend.data = legendData;
                option.yAxis[0].name = `单位：${this.unit}`;
                option.yAxis[1].name = `单位：${this.tab1 == 4 ? '元/个' : '元/方'}`;

                option.tooltip.formatter = function (params) {
                    let showHtm = "<div>" + params[0].axisValueLabel + "</div>";
                    for (let i = 0; i < params.length; i++) {

                        //名称
                        let text = '<span class="chart-tooltip">' + params[i].seriesName + '：</span>';
                        //值
                        let value = params[i].value;
                        let marker = params[i].marker;

                        showHtm += '<div style="line-height: 16px;">' +marker + text + value + '</div>';
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
                let myChart = new echarts.init(this.$refs.chart0);
                myChart.setOption(option, true);
            },

	        // 切换去化量价趋势分析tab
            checkTab1(tab1){
                this.tab1 = tab1;
                this.getAnalysisSummary();
                this.getChartData0();
                this.getProjectAchievement();
            },

	        // 获取项目投资测算目标达成情况数据
            getProjectAchievement(){
                request({
                    url: `/app-api/saleBack/decontamination/projectAchievement`,
                    method: 'get',
                    params: {orgId : this.orgId,current: 1,size: 10,productType:this.tab1 - 1,sortColumn:this.sortColumn,sortType: this.sortType}
                }).then(({data}) => {
                    if (data.code === 0 && data.data && data.data.records) {
                        let list = data.data.records;

                        this.tableData3 = list;
                        if(list.length > 8){
                            this.tableActiveData3 = list.slice(0,8);
                        }else{
                            this.tableActiveData3 = list;
                        }
                    }
                });
            },

	        // 点击表头排序
            sortData(sortColumn){
                if(this.sortColumn != sortColumn){
                    this.sortColumn = sortColumn;
                    this.sortType = 'ASC';
                }else{
                    this.sortType = (this.sortType == 'ASC' ? 'DESC' : 'ASC');
                }

                this.getProjectAchievement();
            },

	        // 项目投资测算目标达成情况 点击表头排序
            sortData1(sortColumn){
                if(this.sortColumn1 != sortColumn){
                    this.sortColumn1 = sortColumn;
                    this.sortType1 = 'ASC';
                }else{
                    this.sortType1 = (this.sortType1 == 'ASC' ? 'DESC' : 'ASC');
                }

                this.getProjectEliminated();
            },

            back(){
                sessionStorage.removeItem('saleReceiptPage'); // 返回首页之后清空页面状态
                // this.goPage('/report/saleReceipts');
                // window.history.go(-1);
                this.$emit('changePage',0);
            },

            goPage(path){
                let search = decodeURIComponent(window.location.search);
                if(!search){
                    search = '?' + decodeURIComponent(window.location.href.split('?')[1]);
                }

                window.location = `#${path + search}`
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
