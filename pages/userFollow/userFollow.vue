<template>
	<view>
		<view class="font-md">
			<ListItem @navigateTo="toUserSpace(i.id)" v-for="i in list" :key="i.id" :label="i.name">
				<template v-slot:left>
					<image class="bg-light rounded-circle mr-3 flex-shrink" :src="i.avatar || '../../static/demo/6.jpg'" style="width: 80rpx;height: 80rpx;"></image>
				</template>
			</ListItem>
		</view>
		<view style="height: 40rpx;" class="py-3 flex justify-center align-center font-md text-light-muted">{{ list.length === 0 ? '暂无数据' : loadText }}</view>
	</view>
</template>

<script>
import ListItem from '../../components/listItem.vue';
export default {
	// 像重构的话就抽象出一个paging对象不就得了
	// 貌似是直接刷新进入这个页面的话，就没有在tarbar那些页面获取token的操作了，所以不能原地刷新页面
	created() {
		this.getList();
	},
	components: {
		ListItem
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
	methods: {
		// 去用户空间
		toUserSpace(id) {
			console.log('去用户空间');
			uni.navigateTo({
				url: '../userSpace/userSpace?user_id='+id
			});
		},
		// 获取我的关注列表
		async getList() {
			// const user_id = this.$Store.state.user.id; // 其实可以改成mapSate在计算属性里整改的
			const page = this.page;
			return this.$Http
				.get(`/user/follows/${page}`, {
					token: true
				})
				.then(res => {
					this.list = res;
					console.log(res);
					if (res.length < 10) {
						this.moreData = false;
						this.loadText = '我是有底线的';
					} else {
						this.page++;
					}
				});
		}
	}
};
</script>

<style></style>
