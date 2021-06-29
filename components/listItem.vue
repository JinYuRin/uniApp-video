<template>
	<view @click="$emit('navigateTo')" class="flex align-center p-3" hover-class="bg-light">
		<slot name="left"></slot>
		<text class="mr-auto font-md">{{label}}</text>
		<text v-if="count" class="text-muted font">{{count}}</text>
		<slot name="right"></slot>
		<text class="iconfont iconjinru text-light-muted"></text>
	</view>
</template>

<script>
export default {
	name:'ListItem',
	props: {
		label: String,
		count: Number
	}
};
</script>

<style></style>
