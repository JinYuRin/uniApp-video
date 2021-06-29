<template>
	<!-- 二型卡片 -->
	<view @click="$emit('toDetailVideo')" class="flex flex-column align-center mb-3 position-relative">
		<image class="rounded-lg mb-1" style="height: 260rpx;width: 195rpx;" :src="item.imgUrl" mode="aspectFill"></image>
		<view>{{item.title}}</view>
		<view class="wrapper__info rounded-lg flex align-center text-ellipsis text-white px-1 pb-1">
			<text class="wrapper__info__icon iconfont iconbofangshu position-relative" />
			<text class="wrapper__info__count font-weight-light ml-1 position-relative">
				{{item.plays}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			item:Object
		},
		methods: {
		}
	}
</script>

<style lang="scss" scoped>
	.wrapper__info {
		font-size: 28rpx;
		height: 40rpx;
		position: absolute;
		bottom: 58rpx;
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
</style>
