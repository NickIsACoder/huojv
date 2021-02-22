import Vue from 'vue';
import Router from 'vue-router';
import { setLocalStorage,getLocalStorage } from '@/utils/local-storage';
import {getUrlParam,handleDate,openLoading, closeLoading} from '@/utils/common';
import {saveBehavior} from '@/api/api'
import {setToken} from "@/utils/auth";

import report from './report';
import warning from './warning';
import ranking from './ranking';
import user from './user';
import login from './login';
import building from './building';
import health from './health';
import downapp from './downapp';
import investment from './investment';

Vue.use(Router);

const RouterModel = new Router({
  routes: [...report, ...login, ...downapp, ...warning, ...ranking, ...user,...building,...health, ...investment]
});

RouterModel.beforeEach((to, from, next) => {
  // openLoading();

  let orgId = getUrlParam('orgId') && getUrlParam('orgId').split(',')[0] || getLocalStorage('orgId').orgId;
  // 获取url参数
  setLocalStorage({
    account: getUrlParam('account') || getLocalStorage('account').account,
    personName: getUrlParam('personName') || getLocalStorage('personName').personName,
    orgType: getUrlParam('orgType') || getLocalStorage('orgType').orgType,
    id: getUrlParam('id') || getLocalStorage('id').id,
    orgId: orgId,
    token: getUrlParam('token') || getLocalStorage('token').token,
    chooseOrgId: getUrlParam('chooseOrgId'),
  });

  setToken(getUrlParam('token'));

  sessionStorage.prePage = sessionStorage.curPage || '';
  sessionStorage.prePageUrl = sessionStorage.curPageUrl || '';
  sessionStorage.curPage = from.meta.pageName || (from.meta.meta && from.meta.meta.pageName) || ''; // 上一个页面
  sessionStorage.curPageUrl = from.path || ''; // 上一个页面URL
  sessionStorage.nextPage = to.meta.pageName || (to.meta.meta && to.meta.meta.pageName) || '';  // 当前页面
  sessionStorage.nextPageUrl = to.path || '';  // 当前页面URL

  if(!to.meta.noPageNo){
    sessionStorage.menuNumber = to.meta.pageNo;  // 当前页面menuNumber
  }

  // if(sessionStorage.pageStartTime){
  //   sessionStorage.pageRemainTime  = new Date().getTime() - parseInt(sessionStorage.pageStartTime);   // 上一个页面的停留时间
  // }else{
  //   sessionStorage.pageRemainTime  = 0;
  // }

  // 二级页面不参与重新记录页面
  if(!to.meta.isSecondPage){
    sessionStorage.pageStartTime = new Date().getTime();  // 进入页面的时间
  }

  const params = {
    lastPage:sessionStorage.prePage,
    nextPage:sessionStorage.nextPage,
    page:sessionStorage.curPage,
    lastPageUrl:sessionStorage.prePageUrl,
    nextPageUrl:sessionStorage.nextPageUrl,
    pageUrl:sessionStorage.curPageUrl,
    lastPageEvent:sessionStorage.prePageEvent || '',
    pageEvent:'跳转至' + sessionStorage.nextPage + '页面',
    pageRemainTime:0,
    triggerTime:handleDate(new Date()),
    device:1,
    username:getUrlParam('personName') || getLocalStorage('personName').personName,
    loginName:getUrlParam('account'),
    menuNumber:sessionStorage.menuNumber
  };
  saveBehavior(params);

  // const { Authorization } = getLocalStorage(
  //   'Authorization'
  // );
  // if (!Authorization) {
  //   if (to.meta.login) {
  //     next({ name: 'login', query: { redirect: to.name } });
  //     return;
  //   }
  // }

  // console.log(getUrlParam('account'));
  next();
});

RouterModel.afterEach((to, from) => {
  // closeLoading();
});

export default RouterModel;
