import {watermark_show} from './watermark';
export const handleNum2String = (num) => {
  return num >= 10 ? num.toString() : '0' + num;
}

export const handleDate = (date,type) => {
  if(type == 'date'){
    return date.getFullYear() + '-' + handleNum2String(date.getMonth() + 1) + '-' + date.getDate();
  }else if(type == 'month'){
      return date.getFullYear() + '-' + handleNum2String(date.getMonth() + 1);
  }
  return date.getFullYear() + '-' + handleNum2String(date.getMonth() + 1) + '-' + date.getDate() + ' ' + handleNum2String(date.getHours()) + ':' + handleNum2String(date.getMinutes())+ ':' + handleNum2String(date.getSeconds());
}

//获取url中的参数方法
export const getUrlParam =  (name) => {
  //构造一个含有目标参数的正则表达式对象
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var search = decodeURIComponent(window.location.search);
  if(!search){
    search = '?' + decodeURIComponent(window.location.href.split('?')[1]);
  }
  //匹配目标参数
  var r = search.substr(1).match(reg);
  //返回参数
  if (r != null) {
    return unescape(r[2]);
  } else {
    return null;
  }
}

//获取BaseUrl
export const getBaseUrl =  () => {
  let base = {};
  switch (process.env.VUE_APP_TITLE) {
    case 'development':
      base.baseApi = 'https://pc.zthuang.com/back/';
      // base.baseApi = 'http://10.138.2.82:8082/'
      base.baseUrl = 'https://pc.zthuang.com';
      base.fileVuewUrl = 'https://pc.zthuang.com/oaView/onlinePreview';
      break;
    case 'dev':
      base.baseApi = 'https://pc.zthuang.com/back/';
      base.baseUrl = 'https://pc.zthuang.com';
      base.fileVuewUrl = 'https://pc.zthuang.com/oaView/onlinePreview';
      break;
    case 'uat':
      base.baseApi = 'https://ayhjappuat.aoyuan.net:2020/back/';
      base.baseUrl = 'https://ayhjappuat.aoyuan.net:2020';
      base.fileVuewUrl = 'https://ayhjappuat.aoyuan.net:2020/oaView/onlinePreview';
      break;
    case 'sim':
      base.baseApi = 'https://ayhjpcsim.aoyuan.net/api/';
      base.baseUrl = 'https://ayhjpcsim.aoyuan.net';
      base.fileVuewUrl = 'https://ayhjpcsim.aoyuan.net/oaView/onlinePreview';
      break;
    case 'pro':
      base.baseApi = 'https://ayhj.aoyuan.net/api/';
      base.baseUrl = 'https://ayhj.aoyuan.net';
      base.fileVuewUrl = 'https://ayhj.aoyuan.net/oaView/onlinePreview';
      break;
  }

  return base;
}

// 获取最近几个月
export function getNextMonths(num,date,isEn) {
  var now = date ? new Date(date) :new Date();
  var months = [];
  if (num > 0) {
    for (var i = 1; i <= num; i++) {
      var curMonth = now.getMonth() + 1 + i;
      if (curMonth > 12) {
        months.push((now.getFullYear() + 1) + (isEn ? '-' : '年') + handleNum2String(curMonth - 12)+ (isEn ? '' : '月'))
      } else {
        months.push(now.getFullYear() + (isEn ? '-' : '年') + handleNum2String(curMonth)+ (isEn ? '' : '月'))
      }
    }
  } else {
    num = -num;
    for (var i = 1; i <= num; i++) {
      var curMonth = now.getMonth() + 1 - i;
      if (curMonth < 1) {
        months.unshift((now.getFullYear() - 1) + (isEn ? '-' : '年') + handleNum2String(curMonth + 12)+ (isEn ? '' : '月'))
      } else {
        months.unshift(now.getFullYear() + (isEn ? '-' : '年') + handleNum2String(curMonth)+ (isEn ? '' : '月'))
      }
    }
  }

  return months
}

// 打开加载效果
export function openLoading(){
  document.getElementById('huojvLoading').style.display = 'block';
}

export function closeLoading(){
  document.getElementById('huojvLoading').style.display = 'none';
}

// 获取绝对值
export function getAbsoluteVal(val){
  return val < 0 ? val * -1 : val;
}

/**
 * 添加水印 并禁止鼠标事件
 * @param {*} user
 */
export function addWarterMask(user) {
  // $('.huojv-mask-div').remove();

  watermark_show({
    watermark_txt: user,
    watermark_x: 50,// 水印起始位置x轴坐标
    watermark_y: 50,// 水印起始位置Y轴坐标
    watermark_cols: 50,// 水印列数
    watermark_rows: 50,// 水印行数
    watermark_x_space: 80,// 水印x轴间隔
    watermark_y_space: 80,// 水印y轴间隔
    watermark_angle: 30,// 水印倾斜度数
    watermark_alpha: 0.08,// 水印透明度
  });
}

export function hasAuth(authList,code){
  return authList.filter(item => {
    return item.code == code;
  }).length;
}

/**
 * 数字格式化，千位逗号分隔
 * @param {*} num 
 */
export function regexNum(num) {
  var re = /(-?\d+)(\d{3})/
  num = ''+num;
  if (/^.*\..*$/.test(num)) {
      var pointIndex = num.lastIndexOf(".")
      var intPart = num.substring(0, pointIndex)
      var pointPart = num.substring(pointIndex + 1, num.length)
      intPart = intPart + "";
      while (re.test(intPart)) {
          intPart = intPart.replace(re, "$1,$2")
      }
      num = intPart + "." + pointPart
  } else {
      num = num + "";
      while (re.test(num)) {
          num = num.replace(re, "$1,$2")
      }
  }
  return num
}


/**
 * 项目级别跳转页面
 * @param {*} orgId
 * @param {*} orgType
 */
export function jumpToPj(pageOrgType,_orgid,_orgtype){

  // pageOrgType==6，为项目级别，不进行跳转
  if (pageOrgType==6) {
    console.log(pageOrgType,'为项目级别，不进行跳转')
    return false
  }

  const u = navigator.userAgent;
  const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
  const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

  console.log(_orgid, _orgtype)
  if(isAndroid){
      jsObjectWebView.goMainPage(_orgid, _orgtype)
  }else if(isiOS){
    window.webkit.messageHandlers.goMainPage.postMessage({
      "orgId": _orgid,
      "orgType": _orgtype
    })
  }
}