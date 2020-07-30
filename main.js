import Vue from 'vue'
import App from './App'
import http from '@/common/vmeitime-http/'
Vue.config.productionTip = false

App.mpType = 'app'
const get = http.get
const post = http.post
Vue.prototype.$api = {
	get,
	post
};
const app = new Vue({
	...App
})
app.$mount()