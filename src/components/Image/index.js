import React, { useEffect } from 'react'
import { View, Image } from 'remax/wechat'
import PropTypes from 'prop-types'
import styles from './style.module.scss'

function AfImage({ src, containerStyle, className, mode, lazyLoad, style, onClick }) {
  useEffect(() => () => (unmounted = true), [])

  return (
    <View style={containerStyle} onClick={onClick} className={styles.container}>
      <Image src={src} className={className} mode={mode} lazyLoad={lazyLoad} style={style} />
    </View>
  )
}

AfImage.defaultProps = {
  mode: 'scaleToFill',
  containerStyle: {},
  lazyLoad: true,
  style: {},
  isRenderPlaceholder: false,
}

AfImage.propTypes = {
  src: PropTypes.string,
  containerStyle: PropTypes.object,
  mode: PropTypes.string,
  lazyLoad: PropTypes.bool,
  isRenderPlaceholder: PropTypes.bool,
}

export default AfImage
