<template>
	<view>
		<!-- 由于Mp不支持uniapp原生导航，以Mp的条件渲染导航栏 -->
		<!-- #ifdef MP -->
		<NaviForMP />
		<!-- #endif -->
		<!-- 轮播图组件 -->
		<Swiper :swipers="swipers" />
		<CardList
			title="为你推荐"
			:isShowRefresh="cardType === 'card2'"
			@refreshClick="
				payload => {
					refrsh(payload);
				}
			"
		>
			<template v-if="cardType === 'card2'">
				<Card2 @toDetailVideo="navigateTo" v-for="(item, index) in list2" :key="index" :item="item" />
			</template>
			<template v-if="cardType === 'card'">
				<Card @toDetailVideo="navigateTo" v-for="(item, index) in list" :key="index" :item="item" />
			</template>
			<template v-if="cardType === 'card3'">
				<Card3 @toDetailVideo="navigateTo" v-for="(item, index) in list" :key="index" :item="item" />
			</template>
		</CardList>
	</view>
</template>

<script>
import Swiper from '../../components/swiper.vue';
import NaviForMP from '../../components/naviForMP.vue';
import Card from '../../components/card.vue';
import Card2 from '../../components/card2.vue';
import Card3 from '../../components/card3.vue';
import CardList from '../../components/cardList.vue';
export default {
	onNavigationBarSearchInputChanged(e){
		console.log(e)
	},
	onNavigationBarSearchInputConfirmed(e){
		console.log(e)
		console.log('输入了回车')
	},
	components: {
		Swiper,
		NaviForMP,
		Card,
		Card2,
		Card3,
		CardList
	},
	data() {
		return {
			cardType: 'card',
			// 采用绝对路径有效防止由于组件关系导致mp的路径错误，虽然H5可以兼容
			list: [],
			list2: [
				{
					imgUrl: '/static/demo/list3/1.webp',
					title: '剑王朝',
					plays: '200万'
				},
				{
					imgUrl: '/static/demo/list3/2.webp',
					title: '闪光少女',
					plays: '200万'
				},
				{
					imgUrl: '/static/demo/list3/3.webp',
					title: '想见你',
					plays: '200万'
				},
				{
					imgUrl: '/static/demo/list3/4.webp',
					title: '青春抛物线',
					plays: '200万'
				},
				{
					imgUrl: '/static/demo/list3/5.webp',
					title: '心灵法医',
					plays: '200万'
				},
				{
					imgUrl: '/static/demo/list3/6.webp',
					title: '天机十二宫',
					plays: '200万'
				}
			],
			swipers: [
				{
					title: '四六级如何才能轻松闯关',
					imgUrl: '/static/demo/swiper/1.jpg'
				},
				{
					title: '吉娜专访',
					imgUrl: '/static/demo/swiper/2.jpg'
				},
				{
					title: '30天Vlog',
					imgUrl: '/static/demo/swiper/3.jpg'
				}
			]
		};
	},
	created() {
		// 拿到数据记得转换
		this.$Http.get('/videos').then(res => {
			// res = JSON.parse(res);
			console.log(res);
			this.list = res;
			// console.log(this.list);
		});
	},
	onLoad() {},
	// 监听uniapp提供的原生事件
	onNavigationBarSearchInputClicked() {
		console.log('点击了搜索栏');
	},
	onNavigationBarButtonTap(e) {
		console.log(e, '点击了搜索按钮');
		// uni.switchTab({
		// 	url: '../cate/cate'
		// });
	},
	methods: {
		refrsh(payload) {
			console.log(payload.msg);
			console.log('开始刷新CardList数据');
		},
		navigateTo({ id }) {
			console.log(id);
			uni.navigateTo({
				url: `../detailVideo/detailVideo?video_id=${id}`
			});
		}
	}
};
</script>

<style lang="scss" scoped></style>
