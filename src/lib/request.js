import { cloud } from 'remax/wechat'
import Toast from '@vant/weapp/lib/toast'

const request = (name, data, config) => {
  return new Promise((resolve, reject) => {
    const cb = {
      success: (res) => resolve(res.result),
      fail: (err) => {
        Toast.showError(`[云函数] [${name}] 调用失败`, err)
        console.log(`[云函数] [${name}] 调用失败`, err)
      },
    }
    cloud.callFunction({ name, data, config, ...cb })
  })
}

export default request
