import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'
import 'vant/lib/icon/local.css';
import '@/assets/scss/global.scss';
import '@/assets/scss/iconfont/iconfont.css';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'

import VueCountdown from '@chenfengyuan/vue-countdown';

import filters from '@/filter';
import 'amfe-flexible'

import {handleDate} from '@/utils/common';
import {saveBehavior,getAuthList} from '@/api/api'

import { Table, TableColumn,Tree,Loading,Popover,Dialog } from 'element-ui';
import { Lazyload} from 'vant';
import {getUrlParam} from "./utils/common";
import {setLocalStorage,getLocalStorage} from "./utils/local-storage";

// import Vconsole from 'vconsole';
// new Vconsole();

import version from './mixin/version';
Vue.mixin(version);

Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Tree);
Vue.use(Loading);
Vue.use(Popover);
Vue.use(Dialog);
Vue.prototype.$http = axios

Vue.component(VueCountdown.name, VueCountdown);
Vue.use(filters);

import filterVal from './mixin/filterVal';
Vue.mixin(filterVal);

Vue.use(Lazyload, {
  preLoad: 1.3,
  error: require('@/assets/images/bg-jianshe@2x.png'),
  loading: require('@/assets/images/bg-jianshe@2x.png'),
  attempt: 1,
  listenEvents: ['scroll'],
  lazyComponent: true
});

// 注册一个全局自定义指令 `v-eventListen`  用于埋点
Vue.directive('eventlisten', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el,binding) {
    // 点击事件触发
    el.ontouchend = function () {

      let isChangePage = binding.value.isChangePage;  // 是否切换了页面

      sessionStorage.prePageEvent = sessionStorage.pageEvent;
      sessionStorage.pageEvent = binding.value.pageEvent;

      // 如果没有切换路由（页面）
      if(!isChangePage){
        const params = {
          lastPage:sessionStorage.curPage,
          lastPageUrl:sessionStorage.curPageUrl,
          nextPage:'',
          page:sessionStorage.nextPage,
          pageUrl:sessionStorage.nextPageUrl,
          lastPageEvent:sessionStorage.prePageEvent || '',
          pageEvent:sessionStorage.pageEvent,
          pageRemainTime:(new Date().getTime() - parseInt(sessionStorage.pageStartTime)),
          triggerTime:handleDate(new Date()),
          device:1,
          username:getUrlParam('personName') || getLocalStorage('personName').personName,
          loginName:getUrlParam('account'),
          menuNumber:sessionStorage.menuNumber
        };
        saveBehavior(params);
      }
    };
  }
})

// 控制按钮权限
Vue.directive('authControl', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: async function (el,binding) {
    el.style.display = 'none';  // 初始化不显示
    let authList = store().state.authList;
    // let authList = JSON.parse(sessionStorage.authList || '[]');  // 权限列表  todo: 现在是临时的
    // if(!authList || !authList.length){
      authList = [];
      let account = getUrlParam('account');
      const res = await getAuthList({account});
      if(res.data.code == 200){
        // authList.push({name:'other',hasAuth:res.data.data});  // todo 按理说有应该返回一个权限列表，这里只是一个临时性的权限控制，只控制其它集团
        res.data.data.forEach(item => {
          if(item.isEnable){
            authList.push(item.code);
          }
        })
        // authList = res.data.data;
      }


      store().commit('AUTHLIST',authList);
      sessionStorage.setItem('authList',JSON.stringify(authList));
    // }

    if (authList.includes(binding.value.code)) {
      el.style.display = 'block';
    }
    

    // for(let i = 0; i < authList.length; i++){
    //   if(authList[i] === binding.value.code){
    //     el.style.display = 'block';
    //   }else{
    //     el.style.display = 'none';
    //   }
    // }
  }
})

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
