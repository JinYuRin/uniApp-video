import Vue from 'vue'
import Vuex from 'vuex'
import request from '../common/request.js'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		user: false,
		token: false,
		cates: []
	},
	mutations: {}, // 同步操作
	actions: { // 所有的actions都是异步操作来的
		// 获取分类，state.cates可能要链接到cates页面去避免二次获取
		setCates({
			state
		}, cates) {
			state.cates = cates
		},
		// 修改用户资料的操作
		setUser({
			state
		}, user) {
			state.user = user // 这里的user不含token，也不需要，token只要在登录的时候写入就行了
			uni.setStorageSync('user', user)
		},
		// 登录后存储user(包括token)的信息
		login({
			state
		}, user) {
			// vue3/vue2大同小异
			// 只要记住核心是state，actions(store,payload)，mutations(state,payload)之类的就行了
			state.user = user
			// console.log(user)
			state.token = user.token
			uni.setStorageSync('user', user)
			uni.setStorageSync('token', state.token)
			// console.log(user)
		},
		logout({ // 只要在调用的时候当他是异步就行了，所有代码执行完毕就会then的了
			state
		}) {
			// 先发请求，请求成功后再进行本地的登出操作
			let res = request.post('/logout', {}, {
				token: true
			}) // 说是异步，但是却不肯给我加个await
			state.user = false
			state.token = false
			uni.removeStorageSync('user')
			uni.removeStorageSync('token')
		},
		initUser({
			state
		}) { // vuex从缓存中获取登录状态
			const user = uni.getStorageSync('user')
			const token = uni.getStorageSync('token')
			state.user = user || false
			state.token = token || false
			// state.token = user.token || false
			// 初始化token的时候采用了user.token,而修改资料后的user不含token
			// token都存起来了啊为什么还要用user.token傻逼
		}
	}
})
