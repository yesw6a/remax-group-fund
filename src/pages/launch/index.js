import React, { useContext, useEffect } from 'react'
import { View, Text, getUserInfo, redirectTo, switchTab } from 'remax/wechat'
import { AppContext } from '@/app'
import { apiLogin } from '@/utils/apis'

function launch() {
  const { setUserInfo } = useContext(AppContext)

  const handleLogin = () => {
    getUserInfo().then((res) => {
      const { userInfo } = res
      if (!userInfo) {
        // 用户拒绝
        return
      }
      apiLogin(userInfo).then((res) => {
        console.log('login res', res);
        setUserInfo(res)
      })
    })
  }

  const goNextPage = () => {
    switchTab({ url: '/pages/user/index' })
  }

  const init = async () => {
    try {
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
