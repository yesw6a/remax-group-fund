import React, { useContext, useEffect } from 'react'
import { View, Text, getUserInfo, redirectTo, switchTab } from 'remax/wechat'
import { AppContext } from '@/app'
import { apiLogin } from '@/utils/apis'
import { updateUserInfo } from '@/database/user'

function launch() {
  const { setUserInfo } = useContext(AppContext)

  const getOpenid = () => {
    apiLogin().then((res) => {
      const { openid } = res
      global.openid = openid
    })
  }

  const handleLogin = () => {
    getUserInfo().then((res) => {
      const { userInfo } = res
      if (!userInfo) {
        // 用户拒绝
        return
      }
      updateUserInfo(userInfo).then((res) => setUserInfo(res))
    })
  }

  const goNextPage = () => {
    switchTab({ url: '/pages/user/index' })
  }

  const init = async () => {
    try {
      await getOpenid()
      await handleLogin()
      goNextPage()
    } catch (error) {
      goNextPage()
    }
  }

  useEffect(() => {
    init()
  }, [])

  return <View>正在初始化数据</View>
}

export default launch
