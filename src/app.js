import React, { useState } from 'react'
import { useAppEvent } from 'remax/macro'
import { cloud } from 'remax/wechat'
import './app.scss'

export const AppContext = React.createContext({})
function App(props) {
  const [userInfo, setUserInfo] = useState(null)

  useAppEvent('onLaunch', () => {
    cloud.init({
      env: "group-fund-125dc",
      traceUser: true,
    })
  })

  return (
    <AppContext.Provider value={{ userInfo, setUserInfo }}>{props.children}</AppContext.Provider>
  )
}

export default App
