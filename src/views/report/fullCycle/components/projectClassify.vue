<template>
	<div class="detail-panel white-bg">
		<div class="main-content">
			<div class="data-content-panel pt-15">
				<ul class="huojv-stress-info">
					<li style="width: 100%;">{{orgName}}现有项目共<label class="num big" v-text="projectInfo.itemConut || '-'"></label><label class="unit">个</label></li>
					<li class="float-l">其中独立操盘项目<label class="num" v-text="projectInfo.indTDItemConut || '-'"></label><label class="unit">个</label></li>
					<li class="float-r pl-30">联合操盘项目<label class="num" v-text="projectInfo.jointTDItemConut || '-'"></label><label class="unit">个</label></li>
					<li class="float-l">合作方操盘项目<label class="num" v-text="projectInfo.pnrtditemConut || '-'"></label><label class="unit">个</label></li>
					<li class="float-r pl-30" v-show="projectInfo.finitemCount != 0">财务并表项目<label class="num" v-text="projectInfo.finitemCount || '-'"></label><label class="unit">个</label></li>
				</ul>

				<div class="huojv-costContract-chart-panel mt-20" ref="chart1"></div>
			</div>
		</div>
	</div>
</template>

<script>
    import scrollFixed from '@/mixin/scroll-fixed';
    import {List, PullRefresh, NavBar, Icon} from 'vant';
    import echarts from 'echarts'
    import request from '@/utils/request';
    import {getUrlParam} from '@/utils/common'

    export default {
        mixins: [scrollFixed],

        data() {
            return {
                isLoading: false,//下拉刷新,从第一页开始
                orgId: '',  // 组织机构id
                orgType: 2,  // 组织机构类型

                pieOption: {
                    title: {
                        text: '',
                        show: true,
                        textStyle: {
                            fontWeight: 500,
                            fontSize: (window.innerWidth / 375) * 14,
                            lineHeight: (window.innerWidth / 375) * 14 + 4,
                            color: '#333333'
                        },
                        x: 'center',
                        y: 'top'
                    },
                    tooltip: {
                        trigger: 'item',
                        // formatter: (params) => {
                        //   console.log(params)
                        //   return 'aaa'
                        // },
                        textStyle: {
                            fontSize: 12,
                            fontWeight: 0
                        },
                    },
                    grid: {
                        top: '0%',
                        left: '0%',
                        right: '0%',
                        bottom: '0%',
                        containLabel: false
                    },
                    legend: {
                        type: 'plain',
                        icon: 'circle',
                        x: "center",
                        y: "bottom",
                        itemWidth: 10,
                        itemHeight: 8,
                        itemGap: 5,
                        textStyle: {
                            color: '#999999',
                            fontSize: 11,
                            fontWeight: 0
                        },
                        data: []
                    },
                    series: []
                },
                orgName:'',
	            projectInfo:{}
            };
        },
        mounted() {
            this.init();
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

                this.getData();

            },

	        // 获取项目分类数据
	        getData(){
                request({
                    url: `/app-api/allPeriod/fullCycleFullTermProject`,
                    method: 'get',
                    params: {orgId : this.orgId}
                }).then(({data}) => {
                    if (data.code === 0 && data.data) {
                        this.projectInfo = data.data;
                        this.drawChart(data.data);
                    }
                });
	        },

	        // 绘制饼图
	        drawChart(data){
                let chartData = [{name:'独立操盘',value:data.indTDItemRate},{name:'合作方操盘',value:data.pnrtditemRate},{name:'联合操盘',value:data.jointTDItemRate},{name:'财务并表',value:data.finitemRate}],
	                legendData = ['独立操盘','合作方操盘','联合操盘','财务并表'];

                if(data.finitemRate == 0){
                    chartData.splice(3,1);
                    legendData.splice(3,1);
                }
                let series = [
                    {
                        name: '',
                        type: 'pie',
                        radius: '45%',
                        center: ['50%', '50%'],
                        color: ['#4995E3','#FFC40F','#209B5C','#F97546','#9949E3','#D17A44', '#FF9E9D'],
                        avoidLabelOverlap: true,
                        label: {
                            normal: {
                                formatter: '{b}\n{c}%',
                                textStyle: {
                                    fontSize: '11',
                                    color: '#666666'
                                }
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '11',
                                    color: '#666666'
                                }
                            }
                        },
                        itemStyle:{
                            borderWidth:1, //设置border的宽度有多大
                            borderColor:'#fff',
                        },
                        labelLine: {
                            normal: {
                                smooth: 0.2,
                                length: 10,
                                length2: 20,

                            }
                        },
                        data: chartData
                    }
                ];
                let option = JSON.parse(JSON.stringify(this.pieOption));

                option.tooltip.formatter = params => {
                    return params.name + ':' + params.value + '%';
                }
                option.title.text = '地产集团各类型项目占比';
                option.series = series;
                option.legend.data = legendData;
                let pie = new echarts.init(this.$refs.chart1);

                request({
                    url: `/app-api/orgType/sysOrg/${this.orgId}`,
                    method: 'get',
                    params: {}
                }).then(({data}) => {
                    if (data.code === 0 && data.data) {
                        this.orgName = data.data[0].name;
                        option.title.text = this.orgName + '各类型项目占比';
                        pie.setOption(option);
                    }
                });
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
