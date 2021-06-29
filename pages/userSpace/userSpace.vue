<template>
	<view>
		<view>
			<image style="width: 100%;height: 320rpx;" src="/static/demo/list2/3.jpg" mode="aspectFill"></image>
			<view class="border-bottom">
				<view class="px-3 pb-3">
					<view class="mb-2 flex justify-between align-center">
						<image class="rounded-circle" :src="userInfo.user.avatar" style="width: 150rpx;height: 150rpx;margin-top: -50rpx;"></image>
						<!-- <view class="flex justify-center align-center text-white rounded bg-main" style="width: 120rpx;height:60rpx;">关注</view> -->
						<view
							@click="following"
							:class="userInfo.follow ? 'bg-main-disabled' : 'bg-main'"
							class="flex justify-center align-center text-white rounded"
							style="width: 120rpx;height:60rpx;"
						>
							{{ userInfo.follow ? '已关注' : '关注' }}
						</view>
					</view>
					<view class="mb-2">
						<text class="mr-2 font-md text-main font-weight-bold">{{ userInfo.user.nickname || userInfo.user.username }}</text>
						<text class="font text-light-muted">UID:123456</text>
					</view>
					<view class="mb-1 font-sm flex justify-center align-center text-white rounded bg-main" style="width: 140rpx;height:50rpx;">年度大会员</view>
					<view class="font">
						{{ userInfo.fansCount }}
						<text class="ml-1 mr-2 font-sm text-light-muted">关注</text>
						{{ userInfo.followCount }}
						<text class="ml-1 mr-2 font-sm text-light-muted">粉丝</text>
					</view>
					<view class="font-sm text-light-muted text-ellipsis">{{userInfo.user.desc}}</view>
				</view>
			</view>
		</view>
		<view :style="'height: ' + scrollHight + 'px;'">
			<view class="flex px-3 py-2">
				<view
					@click="handleTabClick(index)"
					v-for="(tab, index) in tabs"
					:key="index"
					class="font text-light-muted flex justify-center align-center flex-1"
					:class="{ 'text-main': index === currentTab }"
				>
					{{ tab }}
				</view>
			</view>

			<swiper :style="'height: ' + (scrollHight - 46.7) + 'px;'" @change="handleSwipe" :current="currentTab" :duration="500">
				<swiper-item>
					<scroll-view :style="'height: ' + (scrollHight - 46.7) + 'px;'" scroll-y="true">
						<CardList><Card3 v-for="(item, index) in videoList" :key="index" :item="item" /></CardList>
					</scroll-view>
				</swiper-item>
				<swiper-item>
					<scroll-view :style="'height: ' + (scrollHight - 46.7) + 'px;'" scroll-y="true">
						<CardList><Card3 v-for="(item, index) in videoList" :key="index" :item="item" /></CardList>
					</scroll-view>
				</swiper-item>
				<swiper-item>
					<scroll-view :style="'height: ' + (scrollHight - 46.7) + 'px;'" scroll-y="true">
						<CardList><Card3 v-for="(item, index) in videoList" :key="index" :item="item" /></CardList>
					</scroll-view>
				</swiper-item>
				<swiper-item>
					<scroll-view :style="'height: ' + (scrollHight - 46.7) + 'px;'" scroll-y="true">
						<CardList><Card3 v-for="(item, index) in favaList" :key="index" :item="item" /></CardList>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>

		<!-- 这里的方案是，限定整个scroll-view-y的高度，整体应该是一个swiper-x，每个scroll-view都是一个swiper-item -->
	</view>
</template>

<script>
import Card3 from '../../components/card3.vue';
import CardList from '../../components/cardList.vue';
export default {
	created() {
		// onLoad生命周期比created早
		// 一上来先加载主页的内容，在滑动的时候再加载其他页面的内容
		// id需要从路由参数那里传过来
		console.log(this.user_id);
		this.$Http.get(`/user/space_statistics/${this.user_id}`, { token: true }).then(res => {
			console.log(res);
			this.userInfo = res;
		});

		// 临时放在这里
		this.$Http.get(`/video_list/1?user_id=${this.user_id}`).then(res => {
			console.log(res);
			this.videoList = res;
		});
	},
	components: { Card3, CardList },
	data() {
		return {
			user_id: 0,
			userInfo: {},
			scrollHight: 0,
			tabs: ['主页', '动态', '作品', '收藏'],
			currentTab: 0,
			favaList: [],
			videoList: [],
			list: []
		};
	},
	onLoad(options) {
		// 如果生命周期无效，也可能是因为重复定义
		let scrollHight = uni.getSystemInfoSync().windowHeight - 44;
		// console.log(scrollHight);
		this.scrollHight = scrollHight;
		this.user_id = options.user_id;
	},
	methods: {
		handleSwipe(e) {
			console.log(e.detail.current);
			this.currentTab = e.detail.current;
			switch (this.currentTab) {
				case 0:
					console.log('主页加载已经在初始化完成了,日，干脆写出一个分包获取的类不好啊,最好把获取什么收藏作品列表全部用面向对象');
					break;
				case 1:
					console.log('请加载动态');
					this.$Http.get(`/video_list/1?user_id=${this.userInfo.user.id}`).then(res => {
						console.log(res);
						this.videoList = res;
					});
					break;
				case 2:
					console.log('请加载作品');
					this.$Http.get(`/video_list/1?user_id=${this.userInfo.user.id}`).then(res => {
						console.log(res);
						this.videoList = res;
					});
					break;
				case 3:
					console.log('请加载收藏');
					this.$Http.get(`/fava_list/1?user_id=${this.userInfo.user.id}`).then(res => {
						console.log(res);
						this.favaList = res;
					});
					break;
			}
		},
		handleTabClick(index) {
			this.currentTab = index;
		},
		// 关注
		following() {
			console.log('在这里对接关注接口');
			// 关注
			if (!this.userInfo.follow) {
				this.$Http.post('/user/follow', { follow_id: this.userInfo.user.id }, { token: true }).then(res => {
					if (res.status) {
						uni.showToast({
							icon: 'none',
							title: '关注成功'
						});
						this.userInfo.follow = true;
					}
				});
			} else {
				// 取关
				this.$Http.post('/user/unfollow', { follow_id: this.userInfo.user.id }, { token: true }).then(res => {
					if (res.status) {
						uni.showToast({
							icon: 'none',
							title: '取消关注成功'
						});
						this.userInfo.follow = false;
					}
				});
			}
		}
	}
};
</script>

<style></style>
