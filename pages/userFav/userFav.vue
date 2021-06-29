<template>
	<view>
		<CardList :isShowRefresh="false" :notMyFav="false">
			<SwipeAction>
				<SwipeActionItem v-for="(item, index) in list" :key="index" :threshold="0" :right-options="options1" @click="bindClick(e, item)">
					<Card3 @toDetailVideo="toDetailVideo(item.id)" :isMine="false" :item="item" />
				</SwipeActionItem>
			</SwipeAction>
		</CardList>
		<view style="height: 40rpx;" class="py-3 flex justify-center align-center font-md text-light-muted">{{ list.length === 0 ? '暂无数据' : loadText }}</view>
	</view>
</template>

<script>
import Card3 from '../../components/card3.vue';
import CardList from '../../components/cardList.vue';
import SwipeAction from '../../uni-components/uni-swipe-action/uni-swipe-action.vue';
import SwipeActionItem from '../../uni-components/uni-swipe-action-item/uni-swipe-action-item.vue';

export default {
	components: {
		Card3,
		CardList,
		SwipeAction,
		SwipeActionItem
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
			loadText: '上拉加载更多',
			options1: [
				{
					text: '取消收藏',
					style: {
						backgroundColor: '#dd524d'
					}
				}
			]
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
		//
		toDetailVideo(id) {
			uni.navigateTo({
				url: '../detailVideo/detailVideo?video_id=' + id
			});
		},
		// 获取我的收藏列表
		async getList() {
			const user_id = this.$Store.state.user.id; // 其实可以改成mapSate在计算属性里整改的
			const page = this.page;
			return this.$Http.get(`/fava_list/${page}?user_id=${user_id}`).then(res => {
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
		// 取消收藏操作,有默认的回调函数的参数，可以被覆盖或者添加新参数的
		bindClick(e, item) {
			console.log(item);
			// router.post('/fava/video', controller.fava.video);
			this.$Http
				.post(
					'/fava/video',
					{
						video_id: item.id
					},
					{
						token: true
					}
				)
				.then(res => {
					console.log(res);
					if (res.status) {
						uni.showToast({
							icon: 'none',
							title: '取消收藏成功'
						});
						this.page = 1;
						this.moreData = true;
						this.list = [];
						this.loadText = '上拉加载更多';
						this.getList();
					}
				});
			// uni.showToast({
			// 	title: `点击了${e.position === 'left' ? '左侧' : '右侧'} ${e.content.text}按钮`,
			// 	icon: 'none'
			// });
		}
	}
};
</script>

<style></style>
