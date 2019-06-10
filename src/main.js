import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import db from '../src/firebase/init'

Vue.config.productionTip = false

let app = null
// Wait till firebase auth initializes before starting app
db.app.auth().onAuthStateChanged(() => {
  // onAuthStateChanged fires everytime login/logout
  // so we check to make sure app is already initialized
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})
