<template>
	<view>
		<!-- 由于Mp不支持uniapp原生导航，以Mp的条件渲染导航栏 -->
		<!-- #ifdef MP -->
		<NaviForMP />
		<!-- #endif -->
		<view class="font-md font-weight-bold px-3 py-3">热门分类</view>
		<scroll-view scroll-x="true" class="scroll-row">
			<!--scroll-row-item是inline-block无法flex布局 直接换成inline-flex!important  -->
			<!-- 行高过高改成1 -->
			<IconCate @click="toList(item)" v-for="(item, index) in list" :key="index" :item="item" :index="index" />
		</scroll-view>
		<!-- <view class="uni-divider" style="background: #f5f5f4;height: 25rpx;"></view> -->
		<view class="f-divider"></view>
		<view class="font-md font-weight-bold px-3 py-3">全部分类</view>
		<view class="flex flex-wrap align-center hotCate"><IconCate @click="toList(item)" v-for="(item, index) in list" :key="index" :item="item" :index="index" /></view>
	</view>
</template>

<script>
import NaviForMP from '../../components/naviForMP.vue';
import IconCate from '../../components/iconCate.vue';
export default {
	onLoad() {
		// uni-app同样支持小程序的生命周期
		this.getcates();
	},
	created() {
		// this.getcates(); // getcates确实是一个异步函数，但是created不需要getcates的返回值
		// 所以直接调用就ok了，不影响他的内部的异步执行
	},
	components: {
		IconCate
	},
	data() {
		return {
			list: []
		};
	},
	// uni内置生命周期
	onPullDownRefresh() {
		// console.log('正在下拉刷新');
		// console.log(this.getcates());
		// 我要证明，这里我不加await只能是一个promise,不建议在生命周期用async和await
		this.getcates()
			.then(res => {
				if (Array.isArray(res)) {
					this.list = res;
				}
				// console.log(res); // warn()怎么用啊
				uni.hideLoading();
				uni.stopPullDownRefresh(); // 停止刷新的标签
			})
			.catch(res => {
				// console.log(res); // warn()怎么用啊
				uni.showToast({
					icon: 'none',
					title: '刷新失败'
				});
				uni.hideLoading();
				uni.stopPullDownRefresh();
			});
	},
	methods: {
		toList(item) {
			uni.navigateTo({
				url: `../list/list?cate=${JSON.stringify(item)}`
			});
		},
		async getcates() {
			uni.showLoading();
			// 不使用async和await的组合的话也是可以的,进一步说明，高阶函数onload跟getcates是否async是无关的
			let res = await this.$Http.get('/cates');
			// 值得注意的是，我这个res是用request.js改过的
			// 如果采用then,catch就不用手动判断res了,但是我觉得不清晰
			if (Array.isArray(res)) {
				// console.log(res);
				// 发现问题
				// 1.怎么走了两次这行呢,因为我用的是await吗
				// 2.也就是说我要return this.$Http.get('/cates').then()才行啊
				// 3.返回一个promise，然后在高阶函数重新定义then
				// 问题解答:
				// 1.肯定走两次，下拉刷新也走一次了，与await无关
				// 2.return不需要了,返回的promise可以链式调用then(),所有的then都可以执行
				// 3.的重新定义then是错误的,是链式调用then
				this.list = res;
				uni.hideLoading();
			}
			uni.hideLoading();
			return res;
		}
	}
};
</script>

<style></style>
