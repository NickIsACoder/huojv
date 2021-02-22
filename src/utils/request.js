import axios from 'axios'
import {Dialog, Toast} from 'vant';
import {getToken} from "./auth";
import {getUrlParam,getBaseUrl} from './common';

// 创建axios对象
const service = axios.create({
    // baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
    baseURL: getBaseUrl().baseApi, // api 的 base_url
    // timeout: 15000 // request timeout
});

// request interceptor
service.interceptors.request.use(
    config => {
        // document.getElementById('huojvLoading').style.display = 'block';
        if (!config.headers['token']) {
            // config.headers['token'] = `${window.localStorage.getItem(
            //     'token'
            // ) || ''}`;
            console.log(getUrlParam('token') || getToken());
            config.headers['token'] = getUrlParam('token') || getToken();
            if (sessionStorage.getItem('versionNum')&&sessionStorage.getItem('versionNum')!='null') {
                config.headers['backVersionNum'] = sessionStorage.getItem('versionNum');
                config.headers['backCreateTime'] = sessionStorage.getItem('createTime');
            }
        }
        return config;
    },
    err => Promise.reject(err)
);

// response interceptor
service.interceptors.response.use(
    response => {
        const res = response.data;
        // document.getElementById('huojvLoading').style.display = 'none'
        if (res.code === 501) {
            // Toast.fail('请登录');
            // setTimeout(() => {
            //     window.location = '#/login/'
            // }, 1500);
            return Promise.reject('error')
        }
            //ToDo 无权限跳转登录页面
        else if (res.code === 401) {
            // Toast.fail('登录失效');
            // setTimeout(() => {
            //     window.location = '#/login/'
            // }, 500);
            return Promise.reject('error')
        }else if(res.code === 500 || res.code === 601){
            // if(process.env.NODE_ENV == 'development'){
            //     window.location = `#/error?${decodeURIComponent(window.location.href.split('?')[1])}&url=${encodeURIComponent(response.config.url)}&errorText=${encodeURIComponent(res.msg)}&params=${response.config.data || '无传参'}`
            // }
        }
            // else if (res.code !== 0) {
            //   // 非5xx的错误属于业务错误，留给具体页面处理
            //   return Promise.reject(response)
        // }
        else {
            return response
        }
    }, error => {
        console.log('err' + error);// for debug
        // Dialog.alert({
        //     title: '警告',
        //     message: '登录连接超时'
        // });
        return Promise.reject(error)
    });

export default service
