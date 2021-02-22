import {getLocalStorage} from '@/utils/local-storage';
import {getUrlParam} from '@/utils/common';
// todo 为什么要这样写？ 因为原来要在H5这边做组织架构树，所以要通过vuex来记录选择的组织机构，后面说不做了，还是从url链接里面拿chooseOrgId，
// todo 页面都改成监听store了，懒得再去每个页面改
export default {
  orgId: getUrlParam('chooseOrgId') || getUrlParam('orgId'),
  indicatorTitle: getUrlParam('title') || getUrlParam('title'),
  costContractTab:0,
  engineerTab:0,
  financingTab:0,
  createTime: getUrlParam('createTime'),
  versionNum: getUrlParam('versionNum'),
  authList: (sessionStorage.getItem('authList') && JSON.parse(sessionStorage.getItem('authList'))) || []
}
