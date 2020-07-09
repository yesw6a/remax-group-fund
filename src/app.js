import { useAppEvent } from 'remax/macro'
import { cloud } from 'remax/wechat'
import './app.css'

function App(props) {
  useAppEvent('onLaunch', () => {
    cloud.init({
      traceUser: true,
    })
  })

  return props.children
}

export default App
