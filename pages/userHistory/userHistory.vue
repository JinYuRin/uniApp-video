<template>
	<view>
		<CardList :isShowRefresh="false">
			<Card3 @toDetailVideo="toDetailVideo(item.id)" @deleteVideo="deleteVideo" @toUpdate="toUpdate" @toUserVideoList="toUserVideoList" v-for="(item, index) in list" :key="index" :item="item" />
		</CardList>
		<!-- <view style="height: 40rpx;" class="py-3 flex justify-center align-center font-md text-light-muted">{{ list.length === 0 ? '暂无数据' : loadText }}</view> -->
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
	// 取消后端获取历史记录的接口，历史记录应该是本地的，清空记录应当是清空本地而不是数据库
	// 所以，缓存也要分包获取吗？
	created() {
		this.getList();
	},
	onNavigationBarButtonTap() {
		// console.log('清空')
		uni.showModal({
			content: '是否清除全部历史记录?',
			success: res => {
				if (res.confirm) {
					this.clearAll();
				}
			}
		});
	},
	data() {
		return {
			list: []
			// page: 1, // 需要获取的页码getList成功后就+1
			// moreData: true,
			// loadText: '上拉加载更多'
		};
	},
	onPullDownRefresh() {
		// // 下拉刷新先把各项参数初始化先
		// this.page = 1;
		// this.moreData = true;
		// this.list = [];
		// this.loadText = '上拉加载更多';
		// this.getList().then(res => {
		// 	// 是链式调用不是重新then
		// 	uni.stopPullDownRefresh(); // 停止刷新状态
		// 	uni.showToast({
		// 		icon: 'none',
		// 		title: '刷新成功'
		// 	});
		// });
	},
	onReachBottom() {
		// // console.log('正在下拉加载');
		// if (!this.moreData) {
		// 	// 没有更多数据就停止刷新
		// 	return;
		// }
		// let rows = this.list;
		// this.getList().then(res => {
		// 	// this.list = rows.concat(this.list);
		// 	this.list = [...rows, ...this.list]; // 使用拓展运算符也行
		// });
	},
	methods: {
		toDetailVideo(id) {
			uni.navigateTo({
				url: '../detailVideo/detailVideo?video_id=' + id
			});
		},
		async getList() {
			// let history= uni.getStorageSync('history')?JSON.parse(uni.getStorageSync('history')):[]
			// 注释这样写反而更难看
			let history = uni.getStorageSync('history');
			history = history ? JSON.parse(history) : [];
			console.log(history);
			this.list = history;
			// const user_id = this.$Store.state.user.id; // 其实可以改成mapSate在计算属性里整改的
			// const page = this.page;
			// return this.$Http.get(`/user/history/${page}`).then(res => {
			// 	this.list = res;
			// 	console.log(res);
			// 	if (res.length < 10) {
			// 		this.moreData = false;
			// 		this.loadText = '我是有底线的';
			// 	} else {
			// 		this.page++;
			// 	}
			// });
		},
		// 清空历史记录
		clearAll() {
			uni.removeStorageSync('history');
			// this.$Http.post('/user/history/clear').then(res => {
			// if (res.status) {
			uni.showToast({
				icon: 'none',
				title: '清除历史记录成功'
			});
			this.getList(); // 重新更新页面
			// }
			// });
		}
	}
};
</script>

<style></style>
