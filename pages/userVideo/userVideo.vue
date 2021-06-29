<template>
	<view>
		<StatusBar></StatusBar>
		<view class="my-2 flex align-center justify-center position-relative">
			<text @click="back" class="iconfont iconfanhui position-absolute" style="left: 0;font-size: 50rpx;"></text>
			<text class="font-lg">我的作品</text>
		</view>
		<CardList :isShowRefresh="false">
			<Card3 @deleteVideo="deleteVideo" @toUpdate="toUpdate" @toUserVideoList="toUserVideoList" :isMine="true" v-for="(item, index) in list"
			 :key="index" :item="item" />
		</CardList>
		<view style="height: 40rpx;" class="py-3 flex justify-center align-center font-md text-light-muted">{{ list.length === 0 ? '暂无数据' : loadText }}</view>
	</view>
</template>

<script>
	import Card3 from '../../components/card3.vue';
	import CardList from '../../components/cardList.vue';
	export default {
		components: {
			Card3,
			CardList
		},
		// 仅仅是初始化渲染数据而已，需要一个下拉刷新的方法
		created() {
			this.getList();
		},
		data() {
			return {
				list: [],
				page: 1, // 需要获取的页码getList成功后就+1
				moreData: true,
				loadText: '上拉加载更多'
			};
		},
		onPullDownRefresh() {
			// 下拉刷新先把各项参数初始化先
			this.page = 1;
			this.moreData = true;
			this.list = [];
			this.loadText = '上拉加载更多';
			this.getList().then(res => {
				// 是链式调用不是重新then
				uni.stopPullDownRefresh(); // 停止刷新状态
				uni.showToast({
					icon: 'none',
					title: '刷新成功'
				});
			});
		},
		onReachBottom() {
			// console.log('正在下拉加载');
			if (!this.moreData) {
				// 没有更多数据就停止刷新
				return;
			}
			let rows = this.list;
			this.getList().then(res => {
				// this.list = rows.concat(this.list);
				this.list = [...rows, ...this.list]; // 使用拓展运算符也行
			});
		},
		methods: {
			// 拿到数据记得转换、
			// console.log(this.$Store.state.user);
			// const user_id = this.$Store.state.user.id;// 其实可以改成mapSate在计算属性里整改的
			// const page = this.page;
			// // 记得改掉user_id
			// this.$Http.get(`/video_list/${page}?user_id=${user_id}`).then(res => {
			// 	// 我认为这个获取用户作品信息应该写成一个全局方法丢到store去，在我的主页里肯定要用
			// 	// res = JSON.parse(res);
			// 	// console.log(res);
			// 	this.list = res;
			// 	// console.log(this.list);
			// });
			// 获取我的作品列表
			async getList() {
				const user_id = this.$Store.state.user.id; // 其实可以改成mapSate在计算属性里整改的
				const page = this.page;
				return this.$Http.get(`/video_list/${page}?user_id=${user_id}`).then(res => {
					this.list = res;
					console.log(res);
					if (res.length < 10) {
						this.moreData = false;
						this.loadText = '我是有底线的';
					} else {
						this.page++;
					}
				});
			},
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			// 去更新页面
			toUpdate({
				item
			}) {
				console.log(item);
				uni.navigateTo({
					url: `../update/update?item=${JSON.stringify(item)}`
				});
			},
			// 到作品列表的详情去
			toUserVideoList({
				item
			}) {
				console.log(item);
				uni.navigateTo({
					url: `../userVideoList/userVideoList?item=${JSON.stringify(item)}`
				});
			},
			// 删除作品
			deleteVideo({
				item
			}) {
				console.log(item);
				// this.$Http.post(`/video/delete`, { id: item.id }, { token: true }).then(res => {
				// 	console.log(res);
				// });
				uni.showModal({
					content: '是否删除该章节?',
					success: res => {
						if (res.confirm) {
							this.$Http
								.post(`/video/delete`, {
									id: item.id
								}, {
									token: true
								})
								.then(res => {
									console.log(res);
									if (res.status) {
										uni.showToast({
											icon: 'none',
											title: '删除成功'
										});
										// this.getList();
										// 也估计不能调用生命周期函数，直接把生命周期函数的内容拉过来了
										this.page = 1;
										this.moreData = true;
										this.list = [];
										this.loadText = '上拉加载更多';
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
				// uni.navigateTo({
				// 	url: `../update/update?item=${JSON.stringify(item)}`
				// });
			}
		}
	};
</script>

<style></style>
