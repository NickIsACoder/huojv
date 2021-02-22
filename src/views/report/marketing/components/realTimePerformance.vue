<template>
	<div class="detail-panel">
<!--		<ul class="huojv-tabs mt-15" style="border-bottom: 1px solid #E8E8E8;">-->
<!--			<li-->
<!--					@click="checkTab2(1)"-->
<!--					v-eventlisten="{isChangePage:false,pageEvent:'点击含并购'}"-->
<!--					:class="[tab2 == 1 ? 'active' : '']"-->
<!--			>-->
<!--				<label>含并购</label>-->
<!--			</li>-->
<!--			<li-->
<!--					@click="checkTab2(2)"-->
<!--					v-eventlisten="{isChangePage:false,pageEvent:'点击自营'}"-->
<!--					:class="[tab2 == 2 ? 'active' : '']"-->
<!--			>-->
<!--				<label>自营</label>-->
<!--			</li>-->
<!--			<li-->
<!--					@click="checkTab2(3)"-->
<!--					v-eventlisten="{isChangePage:false,pageEvent:'点击自售'}"-->
<!--					:class="[tab2 == 3 ? 'active' : '']"-->
<!--			>-->
<!--				<label>自售</label>-->
<!--			</li>-->
<!--		</ul>-->
		<ul class="huojv-tab-bars mt-15">
			<li @click="checkTab2(1)" v-eventlisten="{isChangePage:false,pageEvent:'点击含并购'}" :class="[tab2 == 1 ? 'active' : '']">
				含并购
			</li>
			<li @click="checkTab2(2)" v-eventlisten="{isChangePage:false,pageEvent:'点击自营'}" :class="[tab2 == 2 ? 'active' : '']">
				自营
			</li>
			<li @click="checkTab2(3)" v-eventlisten="{isChangePage:false,pageEvent:'点击自售'}" :class="[tab2 == 3 ? 'active' : '']">
				自售
			</li>
			<!-- v-auth-control="{name:'other'}" -->
			<!--				        <li @click="checkTab2(3)" v-if="tab1 == 'month'" v-auth-control="{name:'other'}" v-eventlisten="{isChangePage:false,pageEvent:'点击含其它'}" :class="[tab2 == 3 ? 'active' : '']">含其它</li>-->
		</ul>
		<div class="main-content width100">
			<div class="data-content-panel pt-15">
				<div class="loading-box" v-show="isLoadingData">
					<img src="../../../../assets/images/loading.gif">
					<div class="loading-text">数据拼命加载中<span class="shadow_dot"></span></div>
				</div>
				<div v-show="!isLoadingData">
					<p class="topDesc">本年有销售业绩项目数{{boardData.performanceProjCount||'-'}}个，其中纯并表{{boardData.combinedProjCount||'-'}}个</p>
					<ul class="data-info-list" style="border-bottom: 0;padding-bottom: 0;">
						<li>
							<div class="data-type">认购</div>
						</li>
						<li>
							<div class="data-type">签约</div>
						</li>
						<li>
							<div class="data-type">回款</div>
						</li>
					</ul>
					<ul class="data-info-list1" style="border-bottom: 0;">
						<li class="mb-10">
							<label class="title">本日</label>
							<label class="value" v-text="boardData.dayOrder">0</label>
							<label class="unit">万</label>
						</li>
						<li class="mb-10">
							<label class="title">本日</label>
							<label class="value" v-text="boardData.dayContract">0</label>
							<label class="unit">万</label>
						</li>
						<li class="mb-10">
							<label class="title">本日</label>
							<label class="value" v-text="boardData.dayGet">0</label>
							<label class="unit">万</label>
						</li>

						<li class="mb-10">
							<label class="title">本月</label>
							<label class="value" v-text="boardData.monthOrder">0</label>
							<label class="unit">亿</label>
						</li>
						<li class="mb-10">
							<label class="title">本月</label>
							<label class="value" v-text="boardData.monthContract">0</label>
							<label class="unit">亿</label>
						</li>
						<li class="mb-10">
							<label class="title">本月</label>
							<label class="value" v-text="boardData.monthGet">0</label>
							<label class="unit">亿</label>
						</li>

						<li>
							<label class="title">本年</label>
							<label class="value" v-text="boardData.yearOrder">0</label>
							<label class="unit">亿</label>
						</li>
						<li>
							<label class="title">本年</label>
							<label class="value" v-text="boardData.yearContract">0</label>
							<label class="unit">亿</label>
						</li>
						<li>
							<label class="title">本年</label>
							<label class="value" v-text="boardData.yearGet">0</label>
							<label class="unit">亿</label>
						</li>
					</ul>
					<div class="data-title-box" style="border-bottom: 1px solid #E8E8E8;">
						<div class="tips pb-20">
							<div>备注：自售定义为不含未更名团购、工抵、员工房的业绩和回款</div>
						</div>
					</div>
				</div>


				<div class="text-center">
					<ul class="huojv-tab-bars_1">
						<li @click="checkTab3(1)" v-eventlisten="{isChangePage:false,pageEvent:'点击本日实时详情'}" :class="[tab3 == 1 ? 'active' : '']">
							本日实时详情
						</li>
						<li @click="checkTab3(2)" v-eventlisten="{isChangePage:false,pageEvent:'点击本月实时详情'}" :class="[tab3 == 2 ? 'active' : '']">
							本月实时详情
						</li>
						<li @click="checkTab3(3)" v-eventlisten="{isChangePage:false,pageEvent:'点击本年实时详情'}" :class="[tab3 == 3 ? 'active' : '']">
							本年实时详情
						</li>
					</ul>
				</div>
				<div class="loading-box" v-show="isLoadingData">
					<img src="../../../../assets/images/loading.gif">
					<div class="loading-text">数据拼命加载中<span class="shadow_dot"></span></div>
				</div>
				<div v-show="!isLoadingData">
					<!-- 含并购表格内容 -->
					<div v-if="tab2 == 1">
						<!-- 本日 -->
						<el-table
								v-show="tab3 == 1"
								stripe
								height="400"
								class="main-theme-table"
								ref="tableRefday11"
								size="mini"
								highlight-current-row
								row-key="orgId"
								:data="tableList"
								:expand-row-keys="expandNodes"
								border
								:indent="10"
								:load="load"
								lazy
								:tree-props="{children: 'children', hasChildren: 'hasChildren'}"
						>
							<el-table-column prop="orgName" label="组织架构" align="left" fixed width="90">
								<template slot-scope="scope">
									<span v-if="scope.row.orgType==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,scope.row.orgType)">{{scope.row.orgName}}</span>
									<span v-else>{{scope.row.orgName}}</span>
								</template>
							</el-table-column>
							<el-table-column label="认购" align="center">
								<el-table-column prop="dayOrderCount" width="80" label="套数" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.dayOrderCount}}</div>
									</template>
								</el-table-column>
								<el-table-column :label="'金额' + (tab3 != 3 ? '(万元)' : '(亿元)')" prop="maDayOrderAmount" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.dayOrderAmount}}</div>
									</template>
								</el-table-column>
							</el-table-column>
							<el-table-column label="认购未签" align="center">
								<el-table-column prop="dayNotContractCount" width="80" label="套数" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.dayNotContractCount}}</div>
									</template>
								</el-table-column>
								<el-table-column :label="'金额' + (tab3 != 3 ? '(万元)' : '(亿元)')" prop="dayNotContractAmount" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.dayNotContractAmount}}</div>
									</template>
								</el-table-column>
							</el-table-column>
							<el-table-column label="签约" align="center">
								<el-table-column prop="dayContractCount" width="80" label="套数" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.dayContractCount}}</div>
									</template>
								</el-table-column>
								<el-table-column :label="'金额' + (tab3 != 3 ? '(万元)' : '(亿元)')" prop="dayContractAmount" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.dayContractAmount}}</div>
									</template>
								</el-table-column>
							</el-table-column>
							<el-table-column label="回款" align="center">
								<el-table-column prop="dayGetAmount" label="合计" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.dayGetAmount}}</div>
									</template>
								</el-table-column>
								<el-table-column label="按揭" prop="ajDayGetAmount" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.ajDayGetAmount}}</div>
									</template>
								</el-table-column>
								<el-table-column label="非按揭" prop="fajDayGetAmount" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.fajDayGetAmount}}</div>
									</template>
								</el-table-column>
							</el-table-column>
						</el-table>

						<!-- 本月 -->
						<el-table
								v-show="tab3 == 2"
								stripe
								height="400"
								class="main-theme-table"
								ref="tableRefday11"
								size="mini"
								highlight-current-row
								row-key="orgId"
								:data="tableList"
								:expand-row-keys="expandNodes"
								border
								:indent="10"
								:load="load"
								lazy
								:tree-props="{children: 'children', hasChildren: 'hasChildren'}"
						>
							<el-table-column prop="orgName" label="组织架构" align="left" fixed width="90">
								<template slot-scope="scope">
                    <span v-if="scope.row.orgType==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,scope.row.orgType)">{{scope.row.orgName}}</span>
                    <span v-else>{{scope.row.orgName}}</span>
                  </template>
							</el-table-column>
							<el-table-column label="认购" align="center">
								<el-table-column prop="monthOrderCount" width="80" label="套数" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.monthOrderCount}}</div>
									</template>
								</el-table-column>
								<el-table-column :label="'金额' + (tab3 != 3 ? '(万元)' : '(亿元)')" prop="monthOrderAmount" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.monthOrderAmount}}</div>
									</template>
								</el-table-column>
							</el-table-column>
							<el-table-column label="认购未签" align="center">
								<el-table-column prop="monthNotContractCount" width="80" label="套数" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.monthNotContractCount}}</div>
									</template>
								</el-table-column>
								<el-table-column :label="'金额' + (tab3 != 3 ? '(万元)' : '(亿元)')" prop="monthNotContractAmount" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.monthNotContractAmount}}</div>
									</template>
								</el-table-column>
							</el-table-column>
							<el-table-column label="签约" align="center">
								<el-table-column prop="monthContractGoal" width="80" label="本月目标" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.monthContractGoal}}</div>
									</template>
								</el-table-column>
								<el-table-column prop="monthContractRate" width="80" label="完成率" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{(scope.row.monthContractRate || '-') + '%'}}</div>
									</template>
								</el-table-column>
								<el-table-column prop="monthContractCount" width="80" label="套数" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.monthContractCount}}</div>
									</template>
								</el-table-column>
								<el-table-column :label="'金额' + (tab3 != 3 ? '(万元)' : '(亿元)')" prop="monthContractAmount" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.monthContractAmount}}</div>
									</template>
								</el-table-column>
							</el-table-column>
							<el-table-column label="回款" align="center">
								<el-table-column prop="monthGetAmount" label="合计" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.monthGetAmount}}</div>
									</template>
								</el-table-column>
								<el-table-column label="按揭" prop="ajMonthGetAmount" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.ajMonthGetAmount}}</div>
									</template>
								</el-table-column>
								<el-table-column label="非按揭" prop="fajMonthGetAmount" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.fajMonthGetAmount}}</div>
									</template>
								</el-table-column>
							</el-table-column>
						</el-table>

						<!-- 本年 -->
						<el-table
								v-show="tab3 == 3"
								stripe
								height="400"
								class="main-theme-table"
								ref="tableRefday11"
								size="mini"
								highlight-current-row
								row-key="orgId"
								:data="tableList"
								:expand-row-keys="expandNodes"
								border
								:indent="10"
								:load="load"
								lazy
								:tree-props="{children: 'children', hasChildren: 'hasChildren'}"
						>
							<el-table-column prop="orgName" label="组织架构" align="left" fixed width="90">
								<template slot-scope="scope">
                    <span v-if="scope.row.orgType==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,scope.row.orgType)">{{scope.row.orgName}}</span>
                    <span v-else>{{scope.row.orgName}}</span>
                  </template>
							</el-table-column>
							<el-table-column label="认购" align="center">
								<el-table-column prop="yearOrderCount" width="80" label="套数" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.yearOrderCount}}</div>
									</template>
								</el-table-column>
								<el-table-column :label="'金额' + (tab3 != 3 ? '(万元)' : '(亿元)')" prop="yearOrderAmount" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.yearOrderAmount}}</div>
									</template>
								</el-table-column>
							</el-table-column>
							<el-table-column label="认购未签" align="center">
								<el-table-column prop="yearNotContractCount" width="80" label="套数" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.yearNotContractCount}}</div>
									</template>
								</el-table-column>
								<el-table-column :label="'金额' + (tab3 != 3 ? '(万元)' : '(亿元)')" prop="yearNotContractAmount" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.yearNotContractAmount}}</div>
									</template>
								</el-table-column>
							</el-table-column>
							<el-table-column label="签约" align="center">
								<el-table-column prop="yearContractGoal" width="80" label="年目标" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.yearContractGoal}}</div>
									</template>
								</el-table-column>
								<el-table-column prop="yearContractRate" width="80" label="完成率" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{(scope.row.yearContractRate || '-') + '%'}}</div>
									</template>
								</el-table-column>
								<el-table-column prop="yearContractCount" width="80" label="套数" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.yearContractCount}}</div>
									</template>
								</el-table-column>
								<el-table-column :label="'金额' + (tab3 != 3 ? '(万元)' : '(亿元)')" prop="yearContractAmount" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.yearContractAmount}}</div>
									</template>
								</el-table-column>
							</el-table-column>
							<el-table-column label="回款" align="center">
								<el-table-column prop="yearGetAmount" label="合计" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.yearGetAmount}}</div>
									</template>
								</el-table-column>
								<el-table-column label="按揭" prop="ajYearGetAmount" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.ajYearGetAmount}}</div>
									</template>
								</el-table-column>
								<el-table-column label="非按揭" prop="fajYearGetAmount" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.fajYearGetAmount}}</div>
									</template>
								</el-table-column>
							</el-table-column>
						</el-table>
					</div>

					<!-- 自营表格内容 -->
					<div v-if="tab2 == 2">
						<!-- 本日 -->
						<el-table
								v-show="tab3 == 1"
								stripe
								height="400"
								class="main-theme-table"
								ref="tableRefday11"
								size="mini"
								highlight-current-row
								row-key="orgId"
								:data="tableList"
								:expand-row-keys="expandNodes"
								border
								:indent="10"
								:load="load"
								lazy
								:tree-props="{children: 'children', hasChildren: 'hasChildren'}"
						>
							<el-table-column prop="orgName" label="组织架构" align="left" fixed width="90">
								<template slot-scope="scope">
                    <span v-if="scope.row.orgType==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,scope.row.orgType)">{{scope.row.orgName}}</span>
                    <span v-else>{{scope.row.orgName}}</span>
                  </template>
							</el-table-column>
							<el-table-column label="认购" align="center">
								<el-table-column prop="noDayOrderCount" width="80" label="套数" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.noDayOrderCount}}</div>
									</template>
								</el-table-column>
								<el-table-column :label="'金额' + (tab3 != 3 ? '(万元)' : '(亿元)')" prop="noDayOrderAmount" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.noDayOrderAmount}}</div>
									</template>
								</el-table-column>
							</el-table-column>
							<el-table-column label="认购未签" align="center">
								<el-table-column prop="noDayNotContractCount" width="80" label="套数" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.noDayNotContractCount}}</div>
									</template>
								</el-table-column>
								<el-table-column :label="'金额' + (tab3 != 3 ? '(万元)' : '(亿元)')" prop="noDayNotContractAmount" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.noDayNotContractAmount}}</div>
									</template>
								</el-table-column>
							</el-table-column>
							<el-table-column label="签约" align="center">
								<el-table-column prop="noDayContractCount" width="80" label="套数" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.noDayContractCount}}</div>
									</template>
								</el-table-column>
								<el-table-column :label="'金额' + (tab3 != 3 ? '(万元)' : '(亿元)')" prop="noDayContractAmount" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.noDayContractAmount}}</div>
									</template>
								</el-table-column>
							</el-table-column>
							<el-table-column label="回款" align="center">
								<el-table-column prop="dayGetAmount" label="合计" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.dayGetAmount}}</div>
									</template>
								</el-table-column>
								<el-table-column label="按揭" prop="ajDayGetAmount" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.ajDayGetAmount}}</div>
									</template>
								</el-table-column>
								<el-table-column label="非按揭" prop="fajDayGetAmount" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.fajDayGetAmount}}</div>
									</template>
								</el-table-column>
							</el-table-column>
						</el-table>

						<!-- 本月 -->
						<el-table
								v-show="tab3 == 2"
								stripe
								height="400"
								class="main-theme-table"
								ref="tableRefday11"
								size="mini"
								highlight-current-row
								row-key="orgId"
								:data="tableList"
								:expand-row-keys="expandNodes"
								border
								:indent="10"
								:load="load"
								lazy
								:tree-props="{children: 'children', hasChildren: 'hasChildren'}"
						>
							<el-table-column prop="orgName" label="组织架构" align="left" fixed width="90">
								<template slot-scope="scope">
                    <span v-if="scope.row.orgType==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,scope.row.orgType)">{{scope.row.orgName}}</span>
                    <span v-else>{{scope.row.orgName}}</span>
                  </template>
							</el-table-column>
							<el-table-column label="认购" align="center">
								<el-table-column prop="noMonthOrderCount" width="80" label="套数" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.noMonthOrderCount}}</div>
									</template>
								</el-table-column>
								<el-table-column :label="'金额' + (tab3 != 3 ? '(万元)' : '(亿元)')" prop="monthOrderAmount" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.noMonthOrderAmount}}</div>
									</template>
								</el-table-column>
							</el-table-column>
							<el-table-column label="认购未签" align="center">
								<el-table-column prop="noMonthNotContractCount" width="80" label="套数" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.noMonthNotContractCount}}</div>
									</template>
								</el-table-column>
								<el-table-column :label="'金额' + (tab3 != 3 ? '(万元)' : '(亿元)')" prop="noMonthNotContractAmount" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.noMonthNotContractAmount}}</div>
									</template>
								</el-table-column>
							</el-table-column>
							<el-table-column label="签约" align="center">
								<el-table-column prop="noMonthContractGoal" width="80" label="本月目标" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.noMonthContractGoal}}</div>
									</template>
								</el-table-column>
								<el-table-column prop="noMonthContractRate" width="80" label="完成率" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{(scope.row.noMonthContractRate || '-') + '%'}}</div>
									</template>
								</el-table-column>
								<el-table-column prop="noMonthContractCount" width="80" label="套数" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.noMonthContractCount}}</div>
									</template>
								</el-table-column>
								<el-table-column :label="'金额' + (tab3 != 3 ? '(万元)' : '(亿元)')" prop="noMonthContractAmount" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.noMonthContractAmount}}</div>
									</template>
								</el-table-column>
							</el-table-column>
							<el-table-column label="回款" align="center">
								<el-table-column prop="monthGetAmount" label="合计" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.monthGetAmount}}</div>
									</template>
								</el-table-column>
								<el-table-column label="按揭" prop="ajMonthGetAmount" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.ajMonthGetAmount}}</div>
									</template>
								</el-table-column>
								<el-table-column label="非按揭" prop="fajMonthGetAmount" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.fajMonthGetAmount}}</div>
									</template>
								</el-table-column>
							</el-table-column>
						</el-table>

						<!-- 本年 -->
						<el-table
								v-show="tab3 == 3"
								stripe
								height="400"
								class="main-theme-table"
								ref="tableRefday11"
								size="mini"
								highlight-current-row
								row-key="orgId"
								:data="tableList"
								:expand-row-keys="expandNodes"
								border
								:indent="10"
								:load="load"
								lazy
								:tree-props="{children: 'children', hasChildren: 'hasChildren'}"
						>
							<el-table-column prop="orgName" label="组织架构" align="left" fixed width="90">
								<template slot-scope="scope">
									<span v-if="scope.row.orgType==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,scope.row.orgType)">{{scope.row.orgName}}</span>
									<span v-else>{{scope.row.orgName}}</span>
								</template>
							</el-table-column>
							<el-table-column label="认购" align="center">
								<el-table-column prop="noYearOrderCount" width="80" label="套数" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.noYearOrderCount}}</div>
									</template>
								</el-table-column>
								<el-table-column :label="'金额' + (tab3 != 3 ? '(万元)' : '(亿元)')" prop="noYearOrderAmount" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.noYearOrderAmount}}</div>
									</template>
								</el-table-column>
							</el-table-column>
							<el-table-column label="认购未签" align="center">
								<el-table-column prop="noYearNotContractCount" width="80" label="套数" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.noYearNotContractCount}}</div>
									</template>
								</el-table-column>
								<el-table-column :label="'金额' + (tab3 != 3 ? '(万元)' : '(亿元)')" prop="noYearNotContractAmount" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.noYearNotContractAmount}}</div>
									</template>
								</el-table-column>
							</el-table-column>
							<el-table-column label="签约" align="center">
								<el-table-column prop="noYearContractGoal" width="80" label="年目标" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.noYearContractGoal}}</div>
									</template>
								</el-table-column>
								<el-table-column prop="noYearContractRate" width="80" label="完成率" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{(scope.row.noYearContractRate || '-') + '%'}}</div>
									</template>
								</el-table-column>
								<el-table-column prop="noYearContractCount" width="80" label="套数" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.noYearContractCount}}</div>
									</template>
								</el-table-column>
								<el-table-column :label="'金额' + (tab3 != 3 ? '(万元)' : '(亿元)')" prop="noYearContractAmount" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.noYearContractAmount}}</div>
									</template>
								</el-table-column>
							</el-table-column>
							<el-table-column label="回款" align="center">
								<el-table-column prop="yearGetAmount" label="合计" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.yearGetAmount}}</div>
									</template>
								</el-table-column>
								<el-table-column label="按揭" prop="ajYearGetAmount" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.ajYearGetAmount}}</div>
									</template>
								</el-table-column>
								<el-table-column label="非按揭" prop="fajYearGetAmount" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.fajYearGetAmount}}</div>
									</template>
								</el-table-column>
							</el-table-column>
						</el-table>
					</div>

					<!-- 自售表格内容 -->
					<div v-if="tab2 == 3">
						<!-- 本日 -->
						<el-table
								v-show="tab3 == 1"
								stripe
								height="400"
								class="main-theme-table"
								ref="tableRefday11"
								size="mini"
								highlight-current-row
								row-key="orgId"
								:data="tableList"
								:expand-row-keys="expandNodes"
								border
								:indent="10"
								:load="load"
								lazy
								:tree-props="{children: 'children', hasChildren: 'hasChildren'}"
						>
							<el-table-column prop="orgName" label="组织架构" align="left" fixed width="90">
								<template slot-scope="scope">
									<span v-if="scope.row.orgType==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,scope.row.orgType)">{{scope.row.orgName}}</span>
									<span v-else>{{scope.row.orgName}}</span>
								</template>
							</el-table-column>
							<el-table-column label="认购" align="center">
								<el-table-column prop="dayOrderCountSelf" width="80" label="套数" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.dayOrderCountSelf}}</div>
									</template>
								</el-table-column>
								<el-table-column :label="'金额' + (tab3 != 3 ? '(万元)' : '(亿元)')" prop="dayOrderAmountSelf" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.dayOrderAmountSelf}}</div>
									</template>
								</el-table-column>
							</el-table-column>
							<el-table-column label="认购未签" align="center">
								<el-table-column prop="dayNotContractCountSelf" width="80" label="套数" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.dayNotContractCountSelf}}</div>
									</template>
								</el-table-column>
								<el-table-column :label="'金额' + (tab3 != 3 ? '(万元)' : '(亿元)')" prop="dayNotContractAmountSelf" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.dayNotContractAmountSelf}}</div>
									</template>
								</el-table-column>
							</el-table-column>
							<el-table-column label="签约" align="center">
								<el-table-column prop="dayContractCountSelf" width="80" label="套数" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.dayContractCountSelf}}</div>
									</template>
								</el-table-column>
								<el-table-column :label="'金额' + (tab3 != 3 ? '(万元)' : '(亿元)')" prop="dayContractAmountSelf" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.dayContractAmountSelf}}</div>
									</template>
								</el-table-column>
							</el-table-column>
							<el-table-column label="回款" align="center">
								<el-table-column prop="dayGetAmountSelf" label="合计(万元)" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.dayGetAmountSelf}}</div>
									</template>
								</el-table-column>
								<el-table-column label="按揭(万元)" prop="ajDayGetAmountSelf" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.ajDayGetAmountSelf}}</div>
									</template>
								</el-table-column>
								<el-table-column label="非按揭(万元)" prop="fajDayGetAmountSelf" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.fajDayGetAmountSelf}}</div>
									</template>
								</el-table-column>
							</el-table-column>
						</el-table>

						<!-- 本月 -->
						<el-table
								v-show="tab3 == 2"
								stripe
								height="400"
								class="main-theme-table"
								ref="tableRefday11"
								size="mini"
								highlight-current-row
								row-key="orgId"
								:data="tableList"
								:expand-row-keys="expandNodes"
								border
								:indent="10"
								:load="load"
								lazy
								:tree-props="{children: 'children', hasChildren: 'hasChildren'}"
						>
							<el-table-column prop="orgName" label="组织架构" align="left" fixed width="90">
								<template slot-scope="scope">
									<span v-if="scope.row.orgType==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,scope.row.orgType)">{{scope.row.orgName}}</span>
									<span v-else>{{scope.row.orgName}}</span>
								</template>
							</el-table-column>
							<el-table-column label="认购" align="center">
								<el-table-column prop="monthOrderCountSelf" width="80" label="套数" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.monthOrderCountSelf}}</div>
									</template>
								</el-table-column>
								<el-table-column :label="'金额' + (tab3 != 3 ? '(万元)' : '(亿元)')" prop="monthOrderAmountSelf" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.monthOrderAmountSelf}}</div>
									</template>
								</el-table-column>
							</el-table-column>
							<el-table-column label="认购未签" align="center">
								<el-table-column prop="monthNotContractCountSelf" width="80" label="套数" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.monthNotContractCountSelf}}</div>
									</template>
								</el-table-column>
								<el-table-column :label="'金额' + (tab3 != 3 ? '(万元)' : '(亿元)')" prop="monthNotContractAmountSelf" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.monthNotContractAmountSelf}}</div>
									</template>
								</el-table-column>
							</el-table-column>
							<el-table-column label="签约" align="center">
<!--								<el-table-column prop="monthContractGoalSelf" width="80" label="本月目标" align="center">-->
<!--									<template slot-scope="scope">-->
<!--										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.monthContractGoalSelf}}</div>-->
<!--									</template>-->
<!--								</el-table-column>-->
<!--								<el-table-column prop="monthContractRateSelf" width="80" label="完成率" align="center">-->
<!--									<template slot-scope="scope">-->
<!--										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{(scope.row.monthContractRateSelf || '-') + '%'}}</div>-->
<!--									</template>-->
<!--								</el-table-column>-->
								<el-table-column prop="monthContractCountSelf" width="80" label="套数" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.monthContractCountSelf}}</div>
									</template>
								</el-table-column>
								<el-table-column :label="'金额' + (tab3 != 3 ? '(万元)' : '(亿元)')" prop="monthContractAmountSelf" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.monthContractAmountSelf}}</div>
									</template>
								</el-table-column>
							</el-table-column>
							<el-table-column label="回款" align="center">
								<el-table-column prop="monthGetAmountSelf" label="合计(万元)" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.monthGetAmountSelf}}</div>
									</template>
								</el-table-column>
								<el-table-column label="按揭(万元)" prop="ajMonthGetAmountSelf" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.ajMonthGetAmountSelf}}</div>
									</template>
								</el-table-column>
								<el-table-column label="非按揭(万元)" prop="fajMonthGetAmountSelf" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.fajMonthGetAmountSelf}}</div>
									</template>
								</el-table-column>
							</el-table-column>
						</el-table>

						<!-- 本年 -->
						<el-table
								v-show="tab3 == 3"
								stripe
								height="400"
								class="main-theme-table"
								ref="tableRefday11"
								size="mini"
								highlight-current-row
								row-key="orgId"
								:data="tableList"
								:expand-row-keys="expandNodes"
								border
								:indent="10"
								:load="load"
								lazy
								:tree-props="{children: 'children', hasChildren: 'hasChildren'}"
						>
							<el-table-column prop="orgName" label="组织架构" align="left" fixed width="90">
								<template slot-scope="scope">
									<span v-if="scope.row.orgType==6" :class="orgType==6?'':'jumpTxt'" @click="jumpToPj(orgType,scope.row.orgId,scope.row.orgType)">{{scope.row.orgName}}</span>
									<span v-else>{{scope.row.orgName}}</span>
								</template>
							</el-table-column>
							<el-table-column label="认购" align="center">
								<el-table-column prop="yearOrderCountSelf" width="80" label="套数" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.yearOrderCountSelf}}</div>
									</template>
								</el-table-column>
								<el-table-column :label="'金额' + (tab3 != 3 ? '(万元)' : '(亿元)')" prop="yearOrderAmountSelf" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.yearOrderAmountSelf}}</div>
									</template>
								</el-table-column>
							</el-table-column>
							<el-table-column label="认购未签" align="center">
								<el-table-column prop="yearNotContractCountSelf" width="80" label="套数" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.yearNotContractCountSelf}}</div>
									</template>
								</el-table-column>
								<el-table-column :label="'金额' + (tab3 != 3 ? '(万元)' : '(亿元)')" prop="yearNotContractAmountSelf" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.yearNotContractAmountSelf}}</div>
									</template>
								</el-table-column>
							</el-table-column>
							<el-table-column label="签约" align="center">
<!--								<el-table-column prop="yearContractGoalSelf" width="80" label="年目标" align="center">-->
<!--									<template slot-scope="scope">-->
<!--										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.yearContractGoalSelf}}</div>-->
<!--									</template>-->
<!--								</el-table-column>-->
<!--								<el-table-column prop="yearContractRateSelf" width="80" label="完成率" align="center">-->
<!--									<template slot-scope="scope">-->
<!--										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{(scope.row.yearContractRateSelf || '-') + '%'}}</div>-->
<!--									</template>-->
<!--								</el-table-column>-->
								<el-table-column prop="yearContractCountSelf" width="80" label="套数" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.yearContractCountSelf}}</div>
									</template>
								</el-table-column>
								<el-table-column :label="'金额' + (tab3 != 3 ? '(万元)' : '(亿元)')" prop="yearContractAmountSelf" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.yearContractAmountSelf}}</div>
									</template>
								</el-table-column>
							</el-table-column>
							<el-table-column label="回款" align="center">
								<el-table-column prop="yearGetAmountSelf" label="合计(亿元)" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.yearGetAmountSelf}}</div>
									</template>
								</el-table-column>
								<el-table-column label="按揭(亿元)" prop="ajYearGetAmountSelf" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.ajYearGetAmountSelf}}</div>
									</template>
								</el-table-column>
								<el-table-column label="非按揭(亿元)" prop="fajYearGetAmountSelf" width="80" align="center">
									<template slot-scope="scope">
										<div class="text-center" :class="[scope.row.root ? 'red-color' : '']">{{scope.row.fajYearGetAmountSelf}}</div>
									</template>
								</el-table-column>
							</el-table-column>
						</el-table>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
    import scrollFixed from '@/mixin/scroll-fixed';
    import {List, PullRefresh, NavBar, Icon} from 'vant';
    import $ from 'jquery';
    import echarts from 'echarts'
    import request from '@/utils/request';
    import {getUrlParam, getNextMonths, jumpToPj} from '@/utils/common'

    export default {
        mixins: [scrollFixed],

        data() {
            return {
                isLoadingData: true,//下拉刷新,从第一页开始
                orgId: '',
                orgType: 2,

                leval: 0,
                tableList: [],
	            	dataList:[],
                expandNodes: [],
	            	boardData:{},   // 汇总数据
                rootNode:{},  // 根节点数据

	            tab2:1,  // 含并购  签约  自售
	            tab3:1,  // 本日 本月  本年
            };
        },
        mounted() {
            this.init();
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
						jumpToPj,
            init() {
                this.orgId = getUrlParam('chooseOrgId') || getUrlParam('orgId');
                this.orgType = getUrlParam('chooseOrgType') || getUrlParam('orgType');

                this.getTableData();

            },

            closeGesture(index) {
                this.$set(this.hideGesture, 'chart' + index, 1)
            },

	        // 切换含并购，自营，自售
            checkTab2(tab2){
                this.tab2 = tab2;
                this.getBoardData();

                // this.isLoadingData = true;
                // setTimeout(() => {
                //     this.isLoadingData = false;
                // },2000);
            },

	        // 切换本日、本月、本年数据
            checkTab3(tab3){
                this.tab3 = tab3;
	            // this.isLoadingData = true;
				//
                // setTimeout(() => {
                //     this.isLoadingData = false;
                // },2000);
            },

            // 获取资源结构明细表格数据
            getTableData() {
                this.leval = 0;
								this.isLoadingData = true;
								
								this.boardData.combinedProjCount =  null
        				this.boardData.performanceProjCount =  null
                request({
                    url: '/app-api/saleBack/realTimeQuery',
                    method: 'get',
	                params:{
                        orgId:this.orgId
	                }
                }).then(({data}) => {
                    if (data.code === 0) {
                        let _list = this.dataList = data.data;
                        let _parentOrgId = '',
                            _expandNodes = [];

                        let rootNode = {};
                        for (let i = 0, len = _list.length; i < len; i++) {
                            if (_list[i]['root'] == true) {
                                this.rootNode = rootNode = _list[i];
                                _parentOrgId = _list[i]['parentOrgId'];
                                _expandNodes.push(_list[i]['orgId'])

                                // 把根节点排在第一个
                                _list.splice(i, 1);
                                _list.unshift(rootNode);
                                break;
                            }
                        }

                        this.getBoardData();
                        let tree = [];
	                    tree = this.fnGetTree(_list, _parentOrgId,_parentOrgId);
                        this.expandNodes = _expandNodes;

                        this.tableList = tree;

                        this.isLoadingData = false;
                        // this.tableList = _list;

                        // 重新渲染表格 防止表格错位
                        this.$nextTick(() => {
                            if (this.$refs['tableRef']) {
                                this.$refs['tableRef'].doLayout()
                            }
                        })
                    }
                }).catch((e) => {
                    console.log('getBoardData-err', e);
                    this.isLoadingData = false;
                });
            },

	        // 格式化汇总数据
	        getBoardData(){
							this.boardData.combinedProjCount =  this.rootNode.combinedProjCount
							this.boardData.performanceProjCount =  this.rootNode.performanceProjCount
                // 1 含并购   2 自营   3  自售
                if(this.tab2 == 1){
                    this.boardData.dayOrder = this.rootNode.dayOrderAmount || '-';
                    this.boardData.monthOrder = this.rootNode.monthOrderAmountSummary || '-';
                    this.boardData.yearOrder = this.rootNode.yearOrderAmount || '-';
                    this.boardData.dayContract = this.rootNode.dayContractAmount || '-';
                    this.boardData.monthContract = this.rootNode.monthContractAmountSummary || '-';
                    this.boardData.yearContract = this.rootNode.yearContractAmount || '-';
                    this.boardData.dayGet = this.rootNode.dayGetAmount || '-';
                    this.boardData.monthGet = this.rootNode.monthGetAmountSummary || '-';
                    this.boardData.yearGet = this.rootNode.yearGetAmount || '-';
                }else if(this.tab2 == 2){
                    this.boardData.dayOrder = this.rootNode.noDayOrderAmount || '-';
                    this.boardData.monthOrder = this.rootNode.noMonthOrderAmountSummary || '-';
                    this.boardData.yearOrder = this.rootNode.noYearOrderAmount || '-';
                    this.boardData.dayContract = this.rootNode.noDayContractAmount || '-';
                    this.boardData.monthContract = this.rootNode.noMonthContractAmountSummary || '-';
                    this.boardData.yearContract = this.rootNode.noYearContractAmount || '-';
                    this.boardData.dayGet = this.rootNode.dayGetAmount || '-';
                    this.boardData.monthGet = this.rootNode.monthGetAmountSummary || '-';
                    this.boardData.yearGet = this.rootNode.yearGetAmount || '-';
                }else if(this.tab2 == 3){
                    this.boardData.dayOrder = this.rootNode.dayOrderAmountSelf || '-';
                    this.boardData.monthOrder = this.rootNode.monthOrderAmountSelfSummary || '-';
                    this.boardData.yearOrder = this.rootNode.yearOrderAmountSelf || '-';
                    this.boardData.dayContract = this.rootNode.dayContractAmountSelf || '-';
                    this.boardData.monthContract = this.rootNode.monthContractAmountSelfSummary || '-';
                    this.boardData.yearContract = this.rootNode.yearContractAmountSelf || '-';
                    this.boardData.dayGet = this.rootNode.dayGetAmountSelf || '-';
                    this.boardData.monthGet = this.rootNode.monthGetAmountSelfSummary || '-';
                    this.boardData.yearGet = this.rootNode.yearGetAmountSelf || '-';
                }
	        },

            fnGetTree(data, parentOrgId, rootParentOrgId) {
                this.leval ++;
                let result = [], temp;
                for (let i in data) {
                    // 同级的排出非root===true的节点
                    if (data[i].parentOrgId == parentOrgId && ((data[i].root && data[i].parentOrgId===rootParentOrgId) || (!data[i].root && data[i].parentOrgId!==rootParentOrgId))) {
                        result.push(data[i]);

                        if (this.leval >= 2 && !data[i].leaf) {
                            data[i].hasChildren = true;
                            data[i].expan = false;
                        }else if(!data[i].leaf){
                            temp = this.fnGetTree(data, data[i].orgId, rootParentOrgId);
                            if (temp.length > 0) {
                                data[i].children = temp;
                            }
                        }
                    }
                }
                return result;
            },

            // fnGetTree(data, parentOrgId) {
            //     this.leval++;
            //     let self = this;
            //     var result = [], temp;
            //     for (let i in data) {
            //         if (data[i].parentOrgId == parentOrgId) {
            //             result.push(data[i]);
			//
            //             // 初始数据只返回了两级   给第三级添加模拟子节点
            //             if (this.leval >= 2 && !data[i].leaf) {
            //                 data[i].hasChildren = true;
            //                 data[i].expan = false;
            //             } else {
            //                 // if (this.leval >= 2 && !data[i].leaf) {
            //                 //     data[i].hasChildren = true;
            //                 //     data[i].expan = false;
            //                 // } else {
            //                 temp = self.fnGetTree(data, data[i].orgId);
            //                 if (temp.length > 0) {
            //                     data[i].children = temp;
            //                 }
            //             }
            //             // }
            //         }
            //     }
            //     return result;
            // },


            load(tree, treeNode, resolve) {

	            let list = [];
	            this.dataList.forEach(item => {
	                if(item.parentOrgId == tree.orgId){
	                    list.push(item);
	                }
	            });

	            list.forEach(item => {
                    if (!item.leaf) {
                        item.hasChildren = true;
                        item.expan = false;
                    }else{
                        item.hasChildren = false;
                    }
	            })

                resolve(list);
            },

        },

        components: {
            [NavBar.name]: NavBar,
            [List.name]: List,
            [PullRefresh.name]: PullRefresh,
            [Icon.name]: Icon,
        }
    };
</script>


<style lang="scss" scoped>
.topDesc{
    font-size: 12px;
    color: #999;
  }
</style>
