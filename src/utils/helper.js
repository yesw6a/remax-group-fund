import { useContext } from 'react'
import { AppContext } from '@/app'

export const isLogin = () => {
  const appState = useContext(AppContext)
  return !!appState.userInfo
}
