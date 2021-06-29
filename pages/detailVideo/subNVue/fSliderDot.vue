<template>
	<view class="position-absolute bg-main rounded-circle" ：:style="'width: 14px;height: 14px;left:'+(sliderWidth-7)+'px ;'"></view>
</template>

<script>
export default {
	inject: ['v'],
	props: {
		currentTime: {
			type: Number,
			default: 0
		},
		duration: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			width: 0
		};
	},
	created() {
		// console.log(this.v.windowWidth);
		// console.log(this.currentTime / this.duration);
		this.width = this.v.windowWidth;
		// this.sliderWidth = (this.currentTime / this.duration) * this.width;
		// console.log(this.sliderWidth);
	},
	computed: {
		// 仅读取,computed里面进去就不需要data写了
		sliderWidth: function() {
			return ((this.width - 44 - 44 - 80) * (this.currentTime / this.duration)) | 0;
		}
	}
};
</script>

<style></style>
