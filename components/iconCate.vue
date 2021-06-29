<template>
	<!-- 为什么需要display: inline-flex!important;作为scrollitem，因为必须是行内元素 -->
	<view @click="$emit('click')" class="iconCate">
		<img class="iconCate__img bg-light" :src="item.cover" />
		<view class="text-muted font mt-2">{{ item.title }}</view>
	</view>
</template>

<script>
export default {
	name: 'IconCate',
	props: {
		item: Object,
		index: [Number, String]
	}
};
</script>

<style lang="scss" scoped>
.iconCate {
	display: inline-flex !important;
	width: 187.5rpx;
	height: 187.5rpx;
	line-height: 1;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	&__img {
		width: 70rpx;
		height: 70rpx;
	}
}
</style>
