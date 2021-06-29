<template>
	<view>
		<view v-if="type !== 'password'" class="p-1 flex justify-between align-center bg-light rounded-lg" style="box-sizing: border-box;width: 100%;">
			<input style="flex: 9;" v-model="content" class="p-2" type="text" :placeholder="content || tip" placeholder-class="font text-light-muted" />
			<view @click="submitContent" class="flex-shrink flex justify-center align-center bg-main rounded-lg text-white" style="height: 80rpx; width: 80rpx;">修改</view>
		</view>
	</view>
</template>

<script>
export default {
	onLoad(options) {
		console.log(options);
		this.content = options.content;
		this.type = options.type;
		switch (this.type) {
			case 'nickname':
				uni.setNavigationBarTitle({
					//不早说，居然可以动态设置原生标题
					title: '修改用户昵称'
				});
				this.tip = '起个响亮的昵称吧';
				break;
			case 'desc':
				uni.setNavigationBarTitle({
					//不早说，居然可以动态设置原生标题
					title: '修改个性签名'
				});
				this.tip = '起个吸引人的个性签名吧';
				break;
		}
		// uni.setNavigationBarTitle({//不早说，居然可以动态设置原生标题
		// 	title:
		// })
	},
	data() {
		return {
			type: '',
			content: '',
			tip: ''
		};
	},
	methods: {
		submitContent() {
			console.log(1);
			this.$Http
				.post('/user/update', { nickname: this.type === 'nickname' ? this.content : '', desc: this.type === 'desc' ? this.content : '' }, { token: true })
				.then(res => {
					console.log(res);
					this.$Store.dispatch('setUser', res);
					// 更新成功后应当返回上级
					uni.navigateBack({
						delta: 1
					});
					// http://192.168.3.36:7001/public/avatar/tuweitv.jpg
				});
		}
	}
};
</script>

<style></style>
