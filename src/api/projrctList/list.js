import request from '@/utils/request'
 // 获取所有项目
export function projectAll(query) {
  return request({
    url: '/ifmc/itemAll',
    method: 'get',
    params: query
  })
}