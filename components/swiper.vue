<template>
	<!-- 轮播图组件 -->
	<view class="px-3 py-2">
		<!-- padding水平30纵轴20 -->
		<view class="position-relative">
			<!-- 即使swiper是百分百,但是swiper-item也是需要撑满整个swiper才行的 -->
			<!-- <slot></slot> 还可以用这样的插槽slot -->
			<swiper :current="currentSwiper" @change="handleSwiperChange" circular :autoplay="true" :interval="3000" :duration="150"
			 class="swiper">
				<swiper-item v-for="(i,index) in swipers" :key="index">
					<image :src="i.imgUrl" mode="aspectFill" class="swiper__item rounded-lg" />
				</swiper-item>
			</swiper>
			<!--给个线性渐变色背景background-image，内联样式我不喜欢  -->
			<view class="wrapper flex align-center text-white rounded-bottom-lg px-2 pb-1">
				<view class="wrapper__desc text-ellipsis">{{swipers[currentSwiper].title}}</view>
				<!--text-ellipsis文字过长省略 flex-shrink防止被压缩？justify是主轴 align是垂直轴
				   每个项目都有一根纵轴 用 align来设置这些项目纵轴的位置
				   -->
				<view class="wrapper__dots flex align-center justify-end flex-shrink">
					<view v-for="(i,index) in swipers" :key="index"
					class="wrapper__dots__dot rounded-circle ml-1"
				:class="index===currentSwiper?'wrapper__dots__dot--current':'wrapper__dots__dot--notCurrent'" />
				</view>
			</view>
		</view>
	</view>
	</view>
</template>

<script>
	export default {
		name: 'Swiper',
		props: ['swipers'],
		data() {
			return {
				currentSwiper: 0
			}
		},
		methods: {
			handleSwiperChange(e) {
				// console.log(e)
				this.currentSwiper = e.detail.current
			}
		}
	}
</script>

<style lang="scss" scoped>
	.swiper {
		height: 250rpx;

		&__item {
			height: 250rpx;
			width: 100%;
		}
	}

	.wrapper {
		height: 50rpx;
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8));

		&__desc {
			width: 80%;
			font-size: 28rpx;
		}

		&__dots {
			width: 20%;

			&__dot {
				width: 16rpx;
				height: 16rpx;

				&--current {
					background: rgba(255, 255, 255, 1);
				}

				&--notCurrent {
					background: rgba(255, 255, 255, 0.5);
				}
			}
		}
	}
</style>
