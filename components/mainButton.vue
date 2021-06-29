<template>
	<view class="flex justify-center">
		<view
			hover-class="bg-main-hover"
			@click="$emit('click')"
			class="rounded-circle mt-2 flex justify-center align-center"
			style="width: 666rpx;height: 100rpx;background: #fb7299;"
		>
			<view class="text-white font-md">{{ label }}</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'MainButton',
	props: {
		label: String
	}
};
</script>

<style></style>
