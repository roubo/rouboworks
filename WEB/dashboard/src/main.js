import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control
import Vechars from 'v-charts'
import rouboapis from './api/rouboapi'

Vue.use(Vechars)
Vue.use(ElementUI, { locale })
Vue.config.productionTip = false
Vue.prototype.rouboapis = rouboapis
new Vue({
  el: '#app',
  router,
  store,
  rouboapis,
  render: h => h(App)
})
