import request from '@/utils/request'

const LoginUrl = '/app-api/appLogin'; //首页数据接口
export function authLogin(data) {
    return request({
        url: LoginUrl,
        method: 'post',
        data
    })
}

const AuthLogout = '/app-api/logout'; //账号登出
export function authLogout() {
    return request({
        url: AuthLogout,
        method: 'post'
    })
}

//  用户行为
export function saveBehavior(data) {
    return request({
        url: '/sys/user/behavior/save',
        method: 'post',
        data
    })
}

// 获取用户权限列表
export function getAuthList(data) {
    return request({
        url: '/app-api/getButtonAuthority?account='+data.account,
        method: 'get',
    })
}
