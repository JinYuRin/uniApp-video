import Vue from 'vue'
import App from './App'
import store from './store/index.js'
import request from 'common/request.js'
import StatusBar from './components/statusBar.vue';
// const {get,post} = request//由于post引用了request对象的方法，不能直接解构出来使用
// console.log(post)
Vue.config.productionTip = false
Vue.prototype.$statusBarHeight = uni.getSystemInfoSync().statusBarHeight
Vue.prototype.$Http = request
Vue.prototype.$Store = store
// options要用store可以直接在这里使用
Vue.prototype.authJump = (options) => {
	if (!store.state.token) {
		return uni.navigateTo({
			url: '/pages/login/login'
		})
	}
	return uni.navigateTo({
		url: `/pages/${options}/${options}`
	})
}
App.mpType = 'app'

const app = new Vue({
	store, // 这里有必要吗 没有也可以用啊
	...App // 拓展运算符
})
Vue.component("StatusBar", StatusBar)
app.$mount()
