import { showToast, hideLoading, showLoading } from 'remax/wechat'

class Toast {
  // convenience method
  static showLoading = function(message, options) {
    setTimeout(() => {
      this.hide()
    }, 10000)
    this.show('loading', message, options)
  }

  static showSuccess = function(message, options) {
    this.show('success', message, options)
  }

  static showInfo = function(message, options) {
    this.show('info', message, options)
  }

  static showWarn = function(message, options) {
    this.show('warning', message, options)
  }

  static showError = function(message, options) {
    this.show('danger', message, options)
  }

  static hide = function() {
    hideLoading()
  }

  static show = (type, message, options) => {
    const loadingObj = {
      title: message,
      mask: true
    }
    const toastObj = {
      title: message,
      duration: 2000,
      ...options,
    }
    switch (type) {
      case 'loading':
        showLoading(loadingObj)
        break
      case 'success':
        toastObj.icon = 'success'
        showToast(toastObj)
        break
      case 'danger':
      case 'info':
      case 'warning':
        toastObj.icon = 'none'
        showToast(toastObj)
        break
      default:
        break
    }
  }
}

export default Toast
