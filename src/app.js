import React, { useState } from 'react'
import { useAppEvent } from 'remax/macro'
import { cloud } from 'remax/wechat'
import './app.css'

export const AppContext = React.createContext({})
function App(props) {
  const [userInfo, setUserInfo] = useState(null)

  useAppEvent('onLaunch', () => {
    cloud.init({
      traceUser: true,
    })
  })

  return (
    <AppContext.Provider value={{ userInfo, setUserInfo }}>{props.children}</AppContext.Provider>
  )
}

export default App
