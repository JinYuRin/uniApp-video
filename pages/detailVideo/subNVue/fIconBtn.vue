<template>
	<view @click="$emit('click')" class="flex video-btn">
		<!-- 贼多要求，默认flex不能写在他妈的style里，要引用外界就行 要求使用text，还不能换行 -->
		<text class="iconfont text-white" :style="'font-size: ' + size + 'px;'">{{ icon }}</text>
	</view>
</template>

<script>
export default {
	props: {
		icon: {
			type: String,
			default: ''
		},
		size: {
			type: [String, Number],
			default: 22
		}
	}
};
</script>

<style>
.video-btn {
	width: 44px;
	height: 44px;
	flex-direction: row;
	align-items: center;
	justify-content: center;
}
</style>
