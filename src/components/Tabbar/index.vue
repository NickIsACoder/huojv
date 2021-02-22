<template>
	<van-tabbar v-model="active" style="z-index: 1999">
		<van-tabbar-item
				v-for="(tab, index) in tabbar"
				:to="tab.path"
				:dot="tab.dot"
				:info="tab.info"
				:key="index">

			<span>{{tab.name}}</span>
			<template #icon="props">
				<img class="tabbar-ico" :src="props.active ? tab.active : tab.inactive"/>
			</template>
		</van-tabbar-item>
	</van-tabbar>
</template>


<script>
    import {Tabbar, TabbarItem} from 'vant';
    import report_ico_active from '@/assets/images/icon-report-selected@2x.png';
    import report_ico from '@/assets/images/icon-report@2x.png';
    import warning_ico_active from '@/assets/images/icon-warning-selected@2x.png';
    import warning_ico from '@/assets/images/icon-warning@2x.png';
    import list_ico_active from '@/assets/images/icon-List-selected@2x.png';
    import list_ico from '@/assets/images/icon-List@2x.png';
    import me_ico_active from '@/assets/images/icon-me-selected@2x.png';
    import me_ico from '@/assets/images/icon-me@2x.png';

    export default {
        data() {
            return {
                active: 0,
                tabbar: [
                    {
                        name: '报告',
                        path: '/',
                        pathName: 'report',
                        dot: false,
                        info: '',
                        active:report_ico_active,
                        inactive:report_ico
                    },
                    {
                        name: '预警',
                        path: '/warning',
                        pathName: 'warning',
                        dot: false,
                        info: '',
                        active:warning_ico_active,
                        inactive:warning_ico
                    },
                    {
                        name: '龙虎榜',
                        path: '/ranking',
                        pathName: 'ranking',
                        dot: false,
                        info: '',
                        active:list_ico_active,
                        inactive:list_ico
                    },
                    {
                        name: '我的',
                        path: '/user',
                        pathName: 'user',
                        dot: false,
                        info: '',
                        active:me_ico_active,
                        inactive:me_ico
                    }
                ]
            };
        },

        watch: {
            $route: 'changeActive'
        },

        created() {
            const toName = this.$route.name;
            this.setActive(toName);
        },

        methods: {
            changeActive({name}) {
                this.setActive(name);
            },
            setActive(name) {
                this.tabbar.forEach((tab, i) => {
                    if (tab.pathName == name) {
                        this.active = i;
                        return false;
                    }
                });
            }
        },

        components: {
            [Tabbar.name]: Tabbar,
            [TabbarItem.name]: TabbarItem
        }
    };
</script>
<style lang="scss" scoped>
	.van-tabbar{
		height: 55px;
	}
</style>
