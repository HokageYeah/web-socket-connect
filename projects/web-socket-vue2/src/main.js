import Vue from 'vue'
import App from './App.vue'
import webSocketConnect from 'web-socket-connect';

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
