<template>
	<view class="p-4">
		<view style="height:44px">
			<view @click="back" style="width: 44px;height: 44px;" class="iconfont iconguanbi font-lg animated fast" hover-class="text-main pulse"></view>
		</view>
		<view class="flex justify-center align-center font-lg font-weight-bold" style="height:240rpx;">欢迎回来</view>
		<input
			v-model="form.username"
			style="height: 60rpx;"
			class="mb-5 p-2 bg-light rounded"
			type="text"
			placeholder="手机号/用户名/邮箱"
			placeholder-class="font text-light-muted"
		/>
		<input
			v-model="form.password"
			style="height: 60rpx;"
			class="mb-5 p-2 bg-light rounded"
			type="password"
			placeholder="请输入密码"
			placeholder-class="font text-light-muted"
		/>
		<input
			v-model="form.repassword"
			v-if="this.type !== 'login'"
			style="height: 60rpx;"
			class="mb-5 p-2 bg-light rounded"
			type="password"
			placeholder="请输入确认密码"
			placeholder-class="font text-light-muted"
		/>
		<MainButton @click="submit" :label="this.type === 'login' ? '登 录' : '注 册'"></MainButton>
		<view class="flex justify-center align-center" style="margin-top: 80rpx;margin-bottom: 50rpx;">
			<view style="background: #d7d7d7; width: 100rpx;height: 3rpx;"></view>
			<view class="mx-2 text-light-muted">社交账号登录</view>
			<view style="background: #d7d7d7; width: 100rpx;height: 3rpx;"></view>
		</view>
		<view class="flex justify-between px-5">
			<view class="rounded-circle bg-light flex justify-center align-center" style="width: 100rpx;height: 100rpx;">
				<view class="iconfont iconweixin" style="font-size: 40rpx;"></view>
			</view>
			<view class="rounded-circle bg-light flex justify-center align-center" style="width: 100rpx;height: 100rpx;">
				<view class="iconfont iconQQ" style="font-size: 40rpx;"></view>
			</view>
			<view class="rounded-circle bg-light flex justify-center align-center" style="width: 100rpx;height: 100rpx;">
				<view class="iconfont iconxinlangweibo" style="font-size: 40rpx;"></view>
			</view>
		</view>
		<view @click="changeType" class="mt-5 text-light-muted flex justify-center align-center">去{{ type === 'login' ? '注册' : '登录' }}</view>
	</view>
</template>

<script>
import MainButton from '../../components/mainButton.vue';
export default {
	components: { MainButton },
	onLoad() {
		console.log(uni.getSystemInfoSync());
	},
	data() {
		return {
			
			statusBarHeight: 0,
			type: 'login',
			form: {
				username: '',
				password: '',
				repassword: ''
			}
		};
	},
	methods: {
		back() {
			uni.navigateBack({
				delta: 1
			});
		},
		async submit() {
			let res = null;
			switch (this.type) {
				case 'reg':
					// const { username, password, repassword } = this.form;
					// let res = await this.$Http.post('/users/reg', this.form, { native: true });
					res = await this.$Http.post('/reg', this.form);
					// this.$Http
					// 	.post('/users/reg', this.form)
					// 	.then(res => {
					// 		console.log(res,'正常');
					// 	})
					// 	.catch(err => {
					// 		console.log(err,'错误');
					// 	});
					console.log(res);
					// if (res.data.msg === 'ok') {
					// 	uni.showToast({
					// 		title: '注册成功',
					// 		icon: 'none'
					// 	});
					// }
					break;
				case 'login':
					res = await this.$Http.post('/login', this.form);
					console.log(res);
					if (res.token) {
						// 存在token说明登录成功
						this.$Store.dispatch('login', res);
						// console.log(res)
						uni.showToast({
							// 轻提示
							title: '登录成功',
							icon: 'none'
						});
						// 0.3s后回到上一页
						setTimeout(() => {
							this.back();
						}, 1000);
						// uni.navigateTo({
						// url: '../my/my'
						// });// 无法跳转，知道为什么吗,tarbar注册的页面无法跳转,好吧，如果你自己用vue写路由当我没说
					}
					break;
			}
		},
		changeType() {
			this.type = this.type === 'login' ? 'reg' : 'login';
			this.form = {
				username: '',
				password: '',
				repassword: ''
			};
		}
	}
};
</script>

<style></style>
