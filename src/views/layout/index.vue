<template>
<div class="app-main">
	<div id="huojvLoading" class="huojv-loading">
		<van-loading class="loading" type="spinner"/>
	</div>
	<!-- 登录页面不显示切换组织机构  todo H5不需要组织架构树了 -->
<!--	<div class="popup-btn" @click="show=!show" v-show="$route.name !== 'login'">切换组织<van-icon name="arrow"/></div>-->
<!--	<van-popup v-model="show" duration="0.3" position="left" class="huojv-popup">-->
<!--		<div class="huojv-org-tree">-->
<!--			<el-tree :props="defaultProps"-->
<!--			         :data="sideMenuList"-->
<!--			         icon-class="self-line-arrow"-->
<!--			         node-key="id"-->
<!--			         :render-after-expand="true"-->
<!--			         :default-expanded-keys="expandNodes"-->
<!--			         :expand-on-click-node="false"-->
<!--			         :lazy="false" ref="menuTree"-->
<!--			         @node-click="handleNodeClick">-->
<!--				<span :class="['el-tree-node__label', data.click?'keyi':'disable', 'el_id__'+data.id]"-->
<!--				      slot-scope="{ node, data }"-->
<!--				      v-text="node.label" :title="node.label"></span>-->
<!--			</el-tree>-->
<!--		</div>-->
<!--	</van-popup>-->
	<keep-alive>
		<router-view class="view-router" :key="$route.fullPath" v-if="$route.meta.keepAlive"></router-view>
	</keep-alive>
	<router-view class="view-router" v-if="!$route.meta.keepAlive"></router-view>
	<!--		<router-view name="tabbar"></router-view>-->
</div>
</template>

<script>
    import {getUrlParam, addWarterMask} from '@/utils/common';
    import {Loading, Popup, Icon} from 'vant';
    import {setLocalStorage,getLocalStorage} from '@/utils/local-storage';

    export default {
        data() {
            return {
                show: false,
                defaultProps: {
                    children: 'children',
                    label: 'name',
                    isLeaf: 'leaf',
                    disabled: 'disabled'
                },
                sideMenuList: [],
                expandNodes: [],
                account: getUrlParam('account') || window.localStorage.getItem('account'),
                orgId:getLocalStorage(['orgId']).orgId,
            }
        },
        created() {
            let account = getUrlParam('account') || window.localStorage.getItem('account');
            let personName = getUrlParam('personName') || window.localStorage.getItem('personName');
            addWarterMask(account + '-' + personName);
        },
        components: {
            [Loading.name]: Loading,
            [Popup.name]: Popup,
            [Icon.name]: Icon,
        },
        mounted() {
            // todo 2020-05-26 16：00：00注释掉此代码，因为H5页面不需要做组织架构树了
            // this.getMenuList();

	        //url变化监听器  todo 如果H5需要显示组织机构树，就把这段代码注释掉
            if( ('onhashchange' in window) && ((typeof document.documentMode==='undefined') || document.documentMode==8)) {
                // 浏览器支持onhashchange事件
                window.onhashchange = this.refreshLoaclStorage;  // TODO，对应新的hash执行的操作函数
            }

            this.refreshLoaclStorage();

        },
        methods: {
            refreshLoaclStorage(){
                let orgId = getUrlParam('orgId') && getUrlParam('orgId').split(',')[0] || '';
                let indicatorTitle = getUrlParam('title');
                // 获取url参数  更新本地缓存
                setLocalStorage({
                    account: getUrlParam('account') || getLocalStorage('account').account,
                    personName: getUrlParam('personName') || getLocalStorage('personName').personName,
                    id: getUrlParam('id') || getLocalStorage('id').id,
                    orgId: orgId,
                    indicatorTitle: indicatorTitle,
                    token: getUrlParam('token') || getLocalStorage('token').token,
                    chooseOrgId: getUrlParam('chooseOrgId'),
                });

                this.$store.commit('ORGID', getUrlParam('chooseOrgId'));
                this.$store.commit('INDICATORTITLE', getUrlParam('title'));
                this.$store.commit('CREATETIME', getUrlParam('createTime'));
                this.$store.commit('VERSIONNUM', getUrlParam('versionNum'));
            },

            async getMenuList() {
                let {data} = await this.$store.dispatch('orgList', this.account);
                if (data.code === 0) {
                    let _list = data.list,
                        _parentIds = [],
                        _treeObj = [],
                        _orgId = this.orgId,
                        _expandNodes = [];


                    for (let i = 0, len = _list.length; i < len; i++) {
                        if (_list[i]['root'] == true) {
                            _parentIds.push(_list[i]['parentId']);
                        }
                    }
                    // 这里可能有多个根节点
                    for (let i = 0, len = _parentIds.length; i < len; i++) {
                        let tree = this.fnGetTree(_list, _parentIds[i], 1);
                        _treeObj = _treeObj.concat(tree);
                    }

                    this.getExpandNodes(_treeObj,_expandNodes);

                    this.expandNodes = _expandNodes;
                    this.sideMenuList = _treeObj;
                    // localStorage.setItem('__curOrgType',tree[0].orgType);
                    // localStorage.setItem('__curOrgCode',tree[0].orgCode);

                    this.$nextTick(() => {
                        let dom = document.querySelector('.menu-cnt .el_id__' + _orgId);
                        if (dom) {
                            dom.parentNode.className += ' select_tree_node_cur';
                        }
                    })
                }
            },

            getExpandNodes(array,_expandNodes) {
                for (let i = 0, len = array.length; i < len; i++) {
                    let node = array[i];
                    if (node.level <= sessionStorage.targetLevel) {
                        _expandNodes.push(node.id);
                        if (node.children && node.children.length > 0) {
                            this.getExpandNodes(node.children)
                        }
                    }
                }
            },

            fnGetTree(data, parentId, x) {
                let self = this;
                let _orgId = this.orgId;
                let result = [], newList = [], temp,
                    targetLevel = sessionStorage.targetLevel;

                // console.log('fnGetTree_orgId:',_orgId)

                for (var i in data) {
                    if (data[i].parentId == parentId) {
                        data[i]['level'] = x;
                        result.push(data[i]);

                        if (!targetLevel && data[i].id === _orgId) {
                            console.log('xxxx---:', x)
                            sessionStorage.setItem('targetLevel', x);
                        }
                        temp = self.fnGetTree(data, data[i].id, x + 1);
                        if (temp.length > 0) {
                            data[i].children = temp;
                        }
                    }
                }
                return result
            },
            handleNodeClick(data, node, h) {
                if(!data.click) return;   // 如果没权限

                let dom = document.querySelector('.huojv-org-tree .select_tree_node_cur');
                if (dom) {
                    dom.className = 'el-tree-node__content';
                }
                h.$el.firstChild.className += ' select_tree_node_cur';

                this.orgId = data.id;

                this.$store.commit('ORGID', data.id);
                localStorage.setItem('orgId', data.id);
            }
        }
    }
</script>

<style scoped>

</style>
