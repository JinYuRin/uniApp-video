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
				<input
					v-model="form.title"
					style="width: 540rpx;"
					class="font-sm text-light-muted"
					type="text"
					placeholder="请填写标题"
					placeholder-class="font-sm text-light-muted"
				/>
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
		// this.getcates();
	},
	onLoad(options) {
		// onLoad和 created也有先后的
		// 用onLoad得到参数
		const { id, title, cover, category_id, desc } = JSON.parse(options.item);
		this.form = { id, title, cover, category_id, desc };
		this.getcates().then(res => {
			// let tmp = this.cates.find(cate => cate.id === this.form.category_id);
			// console.log(tmp);
			// console.log(this.cates.indexOf(tmp));// 找到序号，数组是引用型，拉出里面的对象也必然能找到他的地址的
			this.catesIndex = this.cates.indexOf(this.cates.find(cate => cate.id === this.form.category_id));
			// 找到category_id指向的cates字符串数组的序号再拉出来
		});
	},
	// 看似简单，但是要注意以下几点
	// 1.创建作品可以先上传再创建，但是更新作品，this.form.cover如果没有传新的图片的话，就不用传文件的
	// 2.需要监听this.form.cover是否改动，增加flag=>coverChange:false
	onNavigationBarButtonTap() {
		if (this.complated) {
			return; // 已经完成操作就直接拒绝操作
		}
		if (!this.isVaild()) {
			return uni.showToast({
				icon: 'none',
				title: '请检查是否填好作品信息'
			});
		}
		if (!this.coverChange) {
			this.$Http.post(`/video/update`, this.form, { token: true }).then(res => {
				console.log('返回结果', res);
				this.complated = true;
				uni.showToast({
					icon: 'none',
					title: '更新成功'
				});
				uni.redirectTo({
					// 使用redirectTo可以解决很多问题，包括清理页面缓存，showToast
					// 因为showToast是当前页面栈生效的，只要当前页面是重定向的，就不算出入栈
					// 问题随之即来，重定向后，栈没消失，又进入修改，晕死，重复的页面太多了，难道要给个主页按钮不成
					// 或者说重定向到主页去吗
					url: '../userVideo/userVideo'
				});
			});
		} else {
			this.$Http
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
						// 还需要加上失败的回调处理
						this.$Http.post('/video/update', this.form, { token: true }).then(res => {
							console.log(res);
							this.complated = true;
							uni.showToast({
								icon: 'none',
								title: '更新成功'
							});
							uni.redirectTo({
								// 使用redirectTo可以解决很多问题，包括清理页面缓存，showToast
								// 因为showToast是当前页面栈生效的，只要当前页面是重定向的，就不算出入栈
								url: '../userVideo/userVideo'
							});
						});
					}
				})
				.catch(res => {
					console.log(res);
				});
			// uni.uploadFile({
			// 	// 这个上传文件后期要改成$Http包装好的才行
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
			// 			// 还需要加上失败的回调处理
			// 			this.$Http.post('/video/update', this.form, { token: true }).then(res => {
			// 				console.log(res);
			// 				this.complated = true;
			// 				uni.showToast({
			// 					icon: 'none',
			// 					title: '更新成功'
			// 				});
			// 				uni.redirectTo({
			// 					// 使用redirectTo可以解决很多问题，包括清理页面缓存，showToast
			// 					// 因为showToast是当前页面栈生效的，只要当前页面是重定向的，就不算出入栈
			// 					url: '../userVideo/userVideo'
			// 				});
			// 			});
			// 		}
			// 	}
			// });
		}
	},
	components: { FormItem },
	data() {
		return {
			coverChange: false,
			catesIndex: Number,
			complated: false, // 防抖锁定
			form: {
				cover: '',
				title: '',
				category_id: 0,
				desc: ''
			},
			range: [],
			cates: []
		};
	},
	methods: {
		isVaild() {
			// 这个校验信息应该和后台同步一下
			return this.form.cover && this.form.title && this.form.category_id !== 0 && this.form.desc;
		},
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
					this.coverChange = true;
					console.log(this.coverChange);
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
