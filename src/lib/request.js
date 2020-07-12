import { cloud } from 'remax/wechat'
import { Toast } from '@/components'

const request = (name, data, config) => {
  return new Promise((resolve, reject) => {
    const cb = {
      success: (res) => {
        console.log('接口调用', res)
        const { code, message = '接口调用错误', data: response } = res.result || {}
        if (code !== 200) {
          return Toast.showError(message)
        }
        resolve(response)
      },
      fail: (err) => {
        Toast.showError(`[云函数] [${name}] 调用失败`, err)
        console.log(`[云函数] [${name}] 调用失败`, err)
      },
    }
    cloud.callFunction({ name, data, config, ...cb })
  })
}

export default request
