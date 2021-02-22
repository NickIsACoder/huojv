import request from '@/utils/request'

export const orgList = async (store, username) => {
  return await request({
    url: `/pc/user/userRightsOrg/${username}`,
    method: 'get',
    data:{}
  });
}
