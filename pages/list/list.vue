<template>
	<view>
		<StatusBar></StatusBar>
		<view class="my-2 flex align-center justify-center position-relative">
			<text @click="back" class="iconfont iconfanhui position-absolute" style="left: 0;font-size: 50rpx;"></text>
			<text class="font-lg">{{ cate.title }}</text>
		</view>
		<view style="">
			<CardList><Card3 @toDetailVideo="navigateTo(item)" v-for="(item, index) in list" :key="index" :item="item" /></CardList>
		</view>
		<view style="height: 40rpx;" class="py-3 flex justify-center align-center font-md text-light-muted">{{ list.length === 0 ? '暂无数据' : loadText }}</view>
	</view>
</template>

<script>
import Card3 from '../../components/card3.vue';
import CardList from '../../components/cardList.vue';
export default {
	created() {
		this.getList();
	},
	onLoad(options) {
		this.cate = JSON.parse(options.cate);
	},
	components: { Card3, CardList },
	data() {
		return {
			cate: null,
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
		async getList() {
			// uni.setNavigationBarTitle({//不早说，居然可以动态设置原生标题
			// 	title:
			// })
			// console.log(this.cate);
			// let res = await this.$Http.get(`/category/${this.cate.id}/video/${this.page}`);
			// console.log(res);
			// this.list = res;
			// this.page++;
			return this.$Http.get(`/category/${this.cate.id}/video/${this.page}`).then(res => {
				// console.log(res);
				this.list = res;
				console.log(res);
				if (res.length < 10) {
					// (获取数据量少于预期10)就moreData=false
					this.moreData = false;
					this.loadText = '我是有底线的';
				} else {
					this.page++; // 没数据才page++
				}
				// 还要处理请求失败的回调函数才行
				// 还要处理上拉加载更多的提示
			});
		},
		// navigateTo
		navigateTo({id}){
			console.log(id)
			uni.navigateTo({
				url: `../detailVideo/detailVideo?video_id=${id}`
			})
		},
		// back
		back(){
			uni.navigateBack({
				delta:1
			})
		}
	}
};
</script>

<style></style>
