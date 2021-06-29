<template>
	<view>
		<!-- 重大样式问题啊 -->
		<view @click="$emit('toDetailVideo')" style="width: 690rpx;" class="wrapper flex border-bottom">
			<image class="wrapper__img rounded-lg mr-3 flex-shrink" :src="item.cover" mode="aspectFill"></image>
			<view class=" wrapper__desc flex-1 flex flex-column justify-between">
				<!--flex-1把剩下的位置留给该元素  -->
				<!--  text-ellipsis 如何用css解决多行文字溢出的问题 -->
				<view class="wrapper__desc__title text-ellipsis">{{ item.title }}</view>
				<view class="wrapper__desc__date text-light-muted font-sm">{{ item.created_time | formatDate }}</view>
				<view class="wrapper__desc__footer flex align-center text-light-muted font-sm position-relative">
					<view style="line-height: 1.5;" class="iconfont iconbofangshu font-md mr-1" />
					<view style="line-height: 1.5;" class="mr-5">{{ item.play_count }}</view>
					<view style="line-height: 1.5;" class="iconfont icondanmushu font-md" />
					<view style="line-height: 1.5;" class="">{{ item.danmu_count }}</view>
					<view style="line-height: 1.5;" class="wrapper__desc__options position-absolute iconfont icongengduo font-md" />
				</view>
			</view>
		</view>
		<view v-if="isMine">
			<view class="flex justify-center" style="height: 95rpx;">
				<view @click="$emit('toUpdate', { item })" class="font flex-1 flex justify-center align-center" hover-class="bg-light">修改</view>
				<view @click="$emit('toUserVideoList', { item })" class="font flex-1 flex justify-center align-center" hover-class="bg-light">视频</view>
				<view @click="$emit('deleteVideo', { item })" class="font flex-1 flex justify-center align-center" hover-class="bg-light">删除</view>
			</view>
			<view class="f-divider" style="margin: 0 -30rpx;"></view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		item: Object,
		isMine: Boolean
	},
	filters: {
		// 格式化时间
		formatDate: date => {
			var date = new Date(date);
			var YY = date.getFullYear() + '-';
			var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
			var DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
			// var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
			// var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
			// var ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
			return YY + MM + DD;
			// + ' ' + hh + mm + ss;
		}
	},
	methods: {}
};
</script>

<style lang="scss" scoped>
.wrapper {
	width: 100%;
	padding: 30rpx 0 50rpx 30rpx;
	box-sizing: border-box;
	&__img {
		width: 270rpx;
		height: 156rpx;
	}
	&__desc {
		// width: 60%;
		height: 156rpx;
		&__title {
			line-height: 1.5;
			width: 100%;
		}
		&__date {
			line-height: 1.6;
		}
		&__footer {
			line-height: 1.5;
		}
		&__options {
			right: 0;
		}
	}
}
</style>
