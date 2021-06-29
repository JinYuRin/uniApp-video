<template>
	<!-- 一型卡片 -->
	<view @click="$emit('toDetailVideo', { id: item.id })" class="wrapper border mb-5 rounded-lg position-relative">
		<image class="wrapper__img" :src="item.cover" mode="aspectFill"></image>
		<view class="wrapper__info flex align-center text-ellipsis text-white px-1 pb-1">
			<text class="wrapper__info__icon iconfont iconbofangshu position-relative" />
			<text class="wrapper__info__count font-weight-light ml-1 position-relative">{{ item.play_count }}</text>
			<text class="wrapper__info__icon iconfont icondanmushu ml-2 position-relative" />
			<text class="wrapper__info__count font-weight-light ml-1 position-relative">{{ item.danmu_count }}</text>
		</view>
		<view class=" wrapper__desc px-2 position-relative">
			<view class=" wrapper__desc__text text-ellipsis">{{ item.title }}</view>
			<view class=" wrapper__desc__footer mt-2">
				<!-- <text class="wrapper__desc__tag">{{ tag }}</text> -->
				<text class="wrapper__desc__tag">{{ { cates, item } | getCateTitle }}</text>
				<text class="wrapper__desc__options iconfont icongengduo"></text>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex'; //vue2是这样拿取state的
export default {
	name: 'Card',
	props: ['item'], // 应该在某个生命周期里抓到props内容，害，都忘记了能不能在methos里抓到这个props了
	// 抓不到就直接在页面的数据绑定里传
	filters: {
		// filters没法无法抓取到computed或者cates.find(cate => cate.id === item.category_id).title
		// 也可以找到目标的index，findIndex()
		getCateTitle: payLoad => payLoad.cates.find(cate => cate.id === payLoad.item.category_id).title
	},
	computed: {
		...mapState({
			cates: state => state.cates // 这种vue2写法及其不舒服，vue3使用函数式才是王道
		})
		// computed里无法用this抓取到computed和props的内容啊
		// tag: () => this.item
	}
};
</script>

<style lang="scss" scoped>
.wrapper {
	box-sizing: border-box;
	width: 330rpx;
	// height: 400rpx;

	&__img {
		width: 100%;
		height: 208rpx;
		border-radius: 14rpx 14rpx 0 0;
		// 单向的图片圆角也可以找到预设
	}

	&__info {
		font-size: 28rpx;
		height: 40rpx;
		position: absolute;
		bottom: 130rpx;
		left: 0;
		right: 0;
		background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));

		&__icon {
			top: 5rpx;
			font-size: 36rpx;
		}

		&__count {
			top: 5rpx;
		}
	}

	&__desc {
		&__footer {
			// top: 80rpx;
		}

		&__text {
			line-height: 40rpx;
			font-size: 30rpx;
		}

		&__tag {
			// 字体大小和颜色都可以找到预设的请试一试
			color: #999999;
		}

		&__options {
			margin-left: 200rpx;
			font-size: 35rpx;
			color: #999999;
		}
	}
}
</style>
