<template>
	<view class="flex p-3 border-bottom border-light-secondary">
		<view class="font mr-3">{{ label }}</view>
		<view class="flex align-center justify-center"><slot></slot></view>
	</view>
</template>

<script>
export default {
	name: 'FormItem',
	props: { label: String },
	data() {
		return {};
	}
};
</script>

<style></style>
