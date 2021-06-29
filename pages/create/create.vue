<template>
	<view>
		<view class="bg-light position-relative" style="height: 350rpx;">
			<image :src="form.cover" mode="aspectFill" style="height: 100%;width: 100%;opacity: 0.5;"></image>
			<view @click="handleAddCover" class="position-absolute flex flex-column align-center justify-center" style="bottom: 120rpx;top: 120rpx;left: 280rpx;right: 280rpx;">
				<view class="iconfont iconjia text-muted" style="font-size: 50rpx;"></view>
				<view class="text-muted font-sm">点击{{ form.cover ? '切换' : '添加' }}封面图</view>
			</view>
		</view>
		<view>
			<FormItem label="标题">
				<input v-model="form.title" style="width: 540rpx;" class="font-sm td" type="text" placeholder="请填写标题" placeholder-class="font-sm text-light-muted" />
			</FormItem>
			<picker mode="selector" :range="range" @change="handleChange">
				<FormItem label="分类">
					<input
						disabled
						class="font-sm text-light-muted "
						placeholder-class="font-sm text-light-muted"
						type="text"
						v-model="!range[catesIndex] ? '请选择分类' : range[catesIndex]"
					/>
					<!-- 这里其实是cates的index不是id -->
				</FormItem>
			</picker>
			<FormItem label="描述">
				<textarea v-model="form.desc" placeholder="请填写视频描述" placeholder-class="font-sm text-light-muted" class="pt-1 font-sm text-light-muted">
请填写视频描述</textarea
				>
			</FormItem>
		</view>
	</view>
</template>
<script>
import FormItem from '../../components/formItem.vue';
export default {
	created() {
		this.getcates();
	},
	onNavigationBarButtonTap() {
		if (this.complated) {
			return;
		}
		if (!this.isVaild()) {
			return uni.showToast({
				icon: 'none',
				title: '请检查是否填好作品信息'
			});
		}
		// 点击后的逻辑稍微有点问题啊
		this.$Http // upload方法内置token验证,不需要传token,第三个参数是监听进度的函数
			.upload('/upload', { filePath: this.form.cover }, progress => {
					console.log(progress);
					uni.showToast({
						icon:'none',
						title:`上传进度: ${progress}%`
					})
				})
			.then(res => {
				const url = res.url;
				console.log(url);
				if (url) {
					this.form.cover = url;
					console.log(url);
					console.log(this.form.cover);
					console.log(this.form);
					this.$Http.post('/video', this.form, { token: true }).then(res => {
						this.complated = true;
						console.log(res);
						uni.showToast({
							icon: 'none',
							title: '发布成功，即将转到我的作品'
						});
						uni.redirectTo({
							url: '../userVideo/userVideo'
						});
					});
				}
			})
			.catch(res => {
				console.log(res);
			});

		// uni.uploadFile({
		// 	url: 'http://192.168.43.12:7001/upload',
		// 	filePath: this.form.cover,
		// 	name: 'files',
		// 	success: (data, statusCode) => {
		// 		// console.log(data, statusCode);
		// 		// console.log(data.data);
		// 		const url = JSON.parse(data.data).data.url;
		// 		// console.log(statusCode);
		// 		if (url) {
		// 			this.form.cover = url;
		// 			console.log(url);
		// 			console.log(this.form.cover);
		// 			console.log(this.form);
		// 			this.$Http.post('/video', this.form, { token: true }).then(res => {
		// 				this.complated = true;
		// 				console.log(res);
		// 				uni.showToast({
		// 					icon: 'none',
		// 					title: '发布成功，即将转到我的作品'
		// 				});
		// 				uni.redirectTo({
		// 					url: '../userVideo/userVideo'
		// 				});
		// 			});
		// 		}
		// 	}
		// });
	},
	components: { FormItem },
	data() {
		return {
			catesIndex: Number,
			complated: false,
			form: {
				cover: '',
				title: '',
				category_id: Number,
				desc: ''
			},
			range: [],
			cates: []
		};
	},
	methods: {
		async getcates() {
			let res = await this.$Http.get('/cates');
			// if (Array.isArray(res)) {
			this.cates = res;
			console.log(this.cates);
			this.range = res.map(i => i.title);
			console.log(this.range);
			// }
			// return res;
		},
		isVaild() {
			// 这个校验信息应该和后台同步一下
			return this.form.cover && this.form.title && this.form.category_id !== 0 && this.form.desc;
		},
		handleAddCover() {
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				success: tmp => {
					console.log(tmp.tempFiles[0].path);
					console.log(tmp.tempFiles[0].size/1000/1024,'mb');
					if((tmp.tempFiles[0].size/1000/1024)>5){
						return uni.showToast({
							icon:'none',
							title:'请上传小于5mb的封面'
						})
					}
					this.form.cover = tmp.tempFiles[0].path;
					// 已经把this的指向全部丢到vue去了
				}
			});
		},
		handleChange(e) {
			this.catesIndex = e.detail.value;
			this.form.category_id = this.cates[this.catesIndex].id;
			console.log('当前category_id', this.form.category_id);
		}
	}
};
</script>

<style></style>
