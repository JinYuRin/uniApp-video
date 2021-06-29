<template>
	<view class="bg-light" style="min-height: 100vh;">
		<view class="bg-white">
			<block v-for="(i, index) in videoList" :key="index">
				<video :poster="i.poster" style="width: 100%;height: 350rpx;" :src="i.url" controls></video>
				<FormItem label="标题">
					<!-- 直接写成input岂不是更简单 为了方便修改 -->
					<input
						v-model="i.title"
						style="width: 540rpx;"
						class="font-sm text-light-muted"
						type="text"
						placeholder="请填写标题"
						placeholder-class="font-sm text-light-muted"
					/>
					<!-- <text class="font-sm">{{ i.title }}</text> -->
				</FormItem>
				<!-- v-if="i.desc"  -->
				<FormItem label="描述">
					<input
						v-model="i.desc"
						style="width: 540rpx;"
						class="font-sm text-light-muted"
						type="text"
						placeholder="请填写描述"
						placeholder-class="font-sm text-light-muted"
					/>
					<!-- <text class="font-sm">{{ i.desc }}</text> -->
				</FormItem>
				<view class="flex">
					<!-- @click="edit" 修改的逻辑应该怎么写呢 别了，暂时不允许修改就行了 emmm -->
					<view @click="edit(index, i)" class="flex-1 font flex justify-center align-center" hover-class="bg-hover-light" style="height: 90rpx;">修改</view>
					<view @click="delVideoItem(index, i.id)" class="flex-1 font flex justify-center align-center" hover-class="bg-hover-light" style="height: 90rpx;">删除</view>
				</view>
				<view class="f-divider"></view>
			</block>
			<view v-if="showAddBtn" @click="add" class="text-white flex bg-main mt-2 align-center justify-center" style="height: 100rpx;" hover-class="bg-main-hover">
				<view>
					<text class="iconfont iconjia mr-2 font-md"></text>
					<text class="font">添加新章节</text>
					<!-- 分清楚before和after了没有 -->
				</view>
			</view>
			<view v-else class="bg-light" style="height: 350rpx;">
				<!-- 可能要应对一下如何一进来就占用宽带了 -->
				<video v-if="videoItem.url" :poster="videoItem.poster" style="width: 100%;height: 350rpx;" :src="videoItem.url" controls></video>
				<view v-else @click="addVideoItem" class="flex flex-column align-center justify-center" style="height: 350rpx;">
					<view class="iconfont iconjia text-muted" style="font-size: 50rpx;"></view>
					<view class="text-muted font-sm">点击添加视频</view>
				</view>
				<view>
					<FormItem label="标题">
						<input
							v-model="videoItem.title"
							style="width: 540rpx;"
							class="font-sm text-light-muted"
							type="text"
							placeholder="请填写标题"
							placeholder-class="font-sm text-light-muted"
						/>
					</FormItem>
					<FormItem label="描述">
						<textarea v-model="videoItem.desc" placeholder="请填写视频描述" placeholder-class="font-sm text-light-muted" class="pt-1 font-sm text-light-muted">
请填写视频描述</textarea
						>
					</FormItem>
				</view>
				<view class="flex" style="width: 100%;">
					<view @click="finishAdd" class="flex-1 font flex justify-center align-center bg-main" hover-class="bg-hover-light" style="height: 90rpx;">完成</view>
					<view @click="cancelAdd" class="flex-1 font flex justify-center align-center" hover-class="bg-hover-light" style="height: 90rpx;">取消</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import FormItem from '../../components/formItem.vue';
export default {
	created() {},
	onLoad(options) {
		// 用onLoad得到参数
		console.log(options.item);
		this.video = JSON.parse(options.item);
		console.log(this.video);
		this.videoItem.video_id = this.video.id;
		console.log(this.videoItem);
		this.getList();
	},
	components: { FormItem },
	data() {
		return {
			// 上传进度
			progress:0,
			// 添加新章节的临时videoItem
			videoItem: {
				video_id: '',
				title: '',
				desc: '',
				poster: '',
				url: ''
			},
			video: null, // 作品的信息，这名字真尼玛有问题
			showAddBtn: true, // 显示添加新章节的按钮
			videoList: []
		};
	},
	methods: {
		// 获取我的收藏列表
		async getList() {
			// const user_id = this.$Store.state.user.id; // 其实可以改成mapSate在计算属性里整改的
			// const page = this.page;
			return this.$Http.get(`/video_detail_list/${this.video.id}`).then(res => {
				console.log(res);
				this.videoList = res;
				// if (res.length < 10) {
				// 	this.moreData = false;
				// 	this.loadText = '我是有底线的';
				// } else {
				// 	this.page++;
				// }
			});
		},
		// 修改视频应该传入目标item，还有，我不考虑支持修改视频源， 只考虑修改描述和标题
		edit(index, i) {
			// 用index查到list中的这个item// 但是有个问题，参数是var的吧，但是地址指向呢，闭包呢
			console.log(i);
			uni.showModal({
				content: '更改是否提交?',
				success: res => {
					if (res.confirm) {
						// 如何获取这个更改的数据是个问题
						this.$Http
							.post(`/video_detail/${i.id}`, i, { token: true })
							.then(res => {
								console.log(res);
								if (res.status) {
									uni.showToast({
										icon: 'none',
										title: '修改成功'
									});
									// 获取数据以便重新渲染页面
									this.getList();
								}
							})
							.catch(res => {
								uni.showToast({
									icon: 'none',
									title: '修改失败'
								});
							});
						// 得看看如何删除，api记错了我日slice是切字符串吗
						// this.videoList.splice(index, 1);
					}
				}
			});
			// this.getList();// 这个被提前执行了
			// uni.showToast({
			// 	icon: 'none',
			// 	title: '暂时不支持修改'
			// });
		},
		// 点击添加视频文件的逻辑
		addVideoItem() {
			console.log('点击添加视频');
			uni.chooseVideo({
				count: 1,
				compressed:true,
				sourceType: ['camera', 'album'],
				success: res => {
					// 他妈的，怎么突然忘记了，修正this指向是需要箭头函数的
					// self.src = res.tempFilePath;
					// 抓到视频后先要丢到中间去
					console.log(res.tempFilePath);
					console.log(res.size);
					if((res.size/1000/1024)>50){
						return uni.showToast({
							icon:'none',
							title:'请上传小于50mb的视频'
						})
					}
					this.videoItem.url = res.tempFilePath;
				}
			});
		},
		// 删除按钮逻辑 当然后面都是要交互的
		delVideoItem(index, id) {
			console.log(id);
			uni.showModal({
				content: '是否删除该章节?',
				success: res => {
					if (res.confirm) {
						this.$Http
							.post(`/video_detail/destroy`, { id }, { token: true })
							.then(res => {
								console.log(res);
								if (res.status) {
									uni.showToast({
										icon: 'none',
										title: '删除成功'
									});
									this.getList();
								}
							})
							.catch(res => {
								uni.showToast({
									icon: 'none',
									title: '删除失败'
								});
							});
						// 得看看如何删除，api记错了我日slice是切字符串吗
						// this.videoList.splice(index, 1);
					}
				}
			});
			// this.getList();// 这个被提前执行了
		},
		// 添加新章节按钮
		add() {
			this.showAddBtn = !this.showAddBtn;
		},
		// 新增页面的完成按钮逻辑
		finishAdd() {
			// 点击后的逻辑稍微有点问题啊
			this.$Http
				.upload('/upload', { filePath: this.videoItem.url }, progress => {
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
						this.videoItem.url = url;
						console.log(url);
						console.log(this.videoItem.url);
						console.log(this.videoItem);
						this.$Http
							.post('/video_detail/save', this.videoItem, { token: true })
							.then(res => {
								// 成功才可以有以下操作
								console.log(res);
								// 清空临时的videoItem
								this.videoItem = {
									title: '',
									desc: '',
									poster: '',
									src: ''
								};
								this.showAddBtn = !this.showAddBtn;
								this.getList();
							})
							.catch(res => {
								uni.showToast({
									icon: 'none',
									title: '上传失败'
								});
							});
					}
				})
				.catch(res => {
					console.log(res);
					uni.showToast({
						icon: 'none',
						title: '上传失败'
					});
				});

			// uni.uploadFile({
			// 	url: 'http://192.168.43.12:7001/upload',
			// 	filePath: this.videoItem.url,
			// 	name: 'files',
			// 	fail: res => {
			// 		console.log(res);
			// 	},
			// 	success: (data, statusCode) => {
			// 		// console.log(data, statusCode);
			// 		// console.log(data.data);
			// 		const url = JSON.parse(data.data).data.url;
			// 		// console.log(statusCode);
			// 		if (url) {
			// 			this.videoItem.url = url;
			// 			console.log(url);
			// 			console.log(this.videoItem.url);
			// 			console.log(this.videoItem);

			// 			this.$Http
			// 				.post('/video_detail/save', this.videoItem, { token: true })
			// 				.then(res => {
			// 					// 成功才可以有以下操作
			// 					console.log(res);
			// 					// 清空临时的videoItem
			// 					this.videoItem = {
			// 						title: '',
			// 						desc: '',
			// 						poster: '',
			// 						src: ''
			// 					};
			// 					this.showAddBtn = !this.showAddBtn;
			// 					this.getList();
			// 				})
			// 				.catch(res => {
			// 					uni.showToast({
			// 						icon: 'none',
			// 						title: '上传失败'
			// 					});
			// 				});
			// 		}
			// 	}
			// });
			// 还得防抖节流和前端参数校验
			// console.log(this.videoItem);
			// 这里只是前端添加而已，真正的添加视频是要先上传视频后再获取所有数据刷新这个页面
			// 我没有传文件后拿到url再塞进this.videoItem，我仅仅是传了一个本地的url进入了this.videoItem
			// 而且还要获取上传进度，不然根本无法
			// 也就是说一进要先获取本作品下所有视频渲染出来
			// this.videoList.push(this.videoItem);这个只要重新调用后端api就行了，不需要手动
			// this.$Http
			// 	.post('/video_detail/save', this.videoItem, { token: true })
			// 	.then(res => {
			// 		// 成功才可以有以下操作
			// 		console.log(res);
			// 		// 清空临时的videoItem
			// 		this.videoItem = {
			// 			title: '',
			// 			desc: '',
			// 			poster: '',
			// 			src: ''
			// 		};
			// 		this.showAddBtn = !this.showAddBtn;
			// 		this.getList();
			// 	})
			// 	.catch(res => {
			// 		uni.showToast({
			// 			icon: 'none',
			// 			title: '上传失败'
			// 		});
			// 	});
		},
		// 新增页面的取消按钮逻辑
		cancelAdd() {
			this.videoItem = {
				title: '',
				desc: '',
				poster: '',
				src: ''
			}; // 清空临时的videoItem
			this.showAddBtn = !this.showAddBtn;
		}
	}
};
</script>

<style></style>
