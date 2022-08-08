import request from '@/utils/request'
// 获取所有项目文档
export function wordList(query) {
    return request({
      url: '/wfmc/wordAll',
      method: 'get',
      params: query
    })
  }

  // 批量增加文档
export function wordAdd(data) {
  return request({
    url: 'http//:169.254.194.80:8991/wfmc/wordAdd',
    method: 'post',
    params: data
  })
}