<template>
	<view>
		<!-- {{ user }} -->
		<navigator v-if="user" :url="`../userSpace/userSpace?user_id=${user.id}`">
			<!-- 这个 url="../login/login" 需要关掉 -->
			<view class="flex align-center m-3">
				<!--@click.stop阻止冒泡行为 @click.stop="navigateTo('userSpace')"  -->
				<image class="bg-light rounded-circle mr-3 flex-shrink" :src="user.avatar" style="width: 120rpx;height: 120rpx;"></image>
				<view class="right">
					<view>
						<text class="text-dark font-md mr-3 flex-1">{{ user.nickname || user.username }}</text>
						<text class="font-sm text-muted">{{ user.sex }} 深圳</text>
					</view>
					<view class="font-sm text-muted">{{ user.desc || '这个人什么都没写' }}</view>
				</view>
			</view>
		</navigator>
		<navigator v-else url="../login/login">
			<view class="flex align-center m-3">
				<!--@click.stop阻止冒泡行为  -->
				<image class="bg-light rounded-circle mr-3 flex-shrink" src="'../../static/demo/6.jpg'" style="width: 120rpx;height: 120rpx;"></image>
				<view class="right">
					<view>
						<text class="text-main font-md mr-3 flex-1">请先登录</text>
						<!-- <text class="font-sm text-muted">女 北京</text> -->
					</view>
					<view class="font-sm text-main">请先登录</view>
				</view>
			</view>
		</navigator>
		<view class="f-divider"></view>
		<view class="font-md">
			<ListItem @navigateTo="navigateTo('userVideo')" label="我的作品" :count="statistics.videoCount">
				<template v-slot:left>
					<text class="iconfont iconshipin font-md mr-3"></text>
				</template>
			</ListItem>
			<ListItem @navigateTo="navigateTo('userFav')" label="收藏" :count="statistics.favaCount">
				<template v-slot:left>
					<text class="iconfont iconshoucang font-md mr-3"></text>
				</template>
			</ListItem>
			<ListItem @navigateTo="navigateTo('userFollow')" label="关注" :count="statistics.followCount">
				<template v-slot:left>
					<text class="iconfont iconguanzhu font-md mr-3"></text>
				</template>
			</ListItem>
			<ListItem @navigateTo="navigateTo('userHistory')" label="历史记录" :count="statistics.historyCount">
				<template v-slot:left>
					<text class="iconfont iconlishi font-md mr-3"></text>
				</template>
			</ListItem>
		</view>
		<view class="f-divider"></view>
		<MainButton label="立即投稿" @click="openPost" />
		<view class="animated faster fadeIn" v-if="showPost">
			<view @click="closePost" class="bg-secondary position-fixed" style="width: 100%;height: 100%;bottom: 0;opacity: 0.3;"></view>
			<view class="bg-white position-fixed" style="width: 100%;bottom: 0;">
				<view class="flex" style="height: 200rpx;">
					<view @click="navigateTo('create')" hover-class="bg-light" class="flex flex-1 flex-column justify-center align-center">
						<view
							class="flex justify-center align-center iconfont text-center icondingdanwenjian text-white bg-primary rounded-circle"
							style="height: 80rpx;width: 80rpx;"
						></view>
						<view>单集</view>
					</view>
					<view @click="navigateTo('create')" hover-class="bg-light" class="flex flex-1 flex-column justify-center align-center">
						<view
							class="flex justify-center align-center iconfont text-center icon918caidan_wenjian text-white bg-main rounded-circle"
							style="height: 80rpx;width: 80rpx;"
						></view>
						<view>连载</view>
					</view>
					<!-- <view style="height: 100rpx;width: 100rpx;background: #0E151D;"></view> -->
				</view>
				<view class="f-divider"></view>
				<view hover-class="bg-light" @click="closePost" class="py-2 font-md" style="width: 100%;text-align: center;">取消</view>
			</view>
		</view>
	</view>
</template>

<script>
import ListItem from '../../components/listItem.vue';
import MainButton from '../../components/mainButton.vue';
import { mapState } from 'vuex'; //vue2是这样拿取state的
export default {
	onShow() {
		if (this.user) {
			// 只有登录了才获取我的统计数据
			this.getStatistics()
		}
		//获取我的统计数据最好就show的时候就要更新，因为这几个tabbar页面除了下拉和触底刷新就只能用show了
	},
	components: {
		ListItem,
		MainButton
	},
	data() {
		return {
			// user: null,
			showPost: false,
			statistics: {
				videoCount: 0,
				favaCount: 0,
				followCount: 0,
				historyCount: 0
			}
		};
	},
	computed: {
		...mapState({
			user: state => state.user // 这种vue2写法及其不舒服，vue3使用函数式才是王道
		})
	},
	created() {
		// console.log(this.user);
		// 一上来先要获取本地缓存
		// this.$Store.dispatch('login', res);
	},
	mounted() {
		// console.log(this.user);
		// 但是这样子是可以拿到state的值的啊，而且vue3也是可以直接拿的，vue2就用mapstate之类的
	},
	onNavigationBarButtonTap(e) {
		console.log(e.index);
		if (e.index === 0) {
			this.navigateTo('userSet');
		}
	},
	methods: {
		// 获取用户统计数据
		getStatistics() {
			this.$Http
				.get(`/user/statistics`, {
					token: true
				})
				.then(res => {
					this.statistics = res;
					console.log(this.statistics);
				});
		},
		openPost() {
			this.showPost = true;
		},
		closePost() {
			this.showPost = false;
		},
		navigateTo(pageName) {
			this.showPost = false; // 加一个点到create页面就使弹出框消失的逻辑;
			// if (this.user) {// 已登录跳转
			// 	uni.navigateTo({
			// 		url: `../${pageName}/${pageName}`
			// 	});
			// }else{
			// 	uni.showToast({
			// 		icon:'none',
			// 		title:'请先登录'
			// 	})
			this.authJump(pageName); // 未登录的跳转，自带登录判定
			// }
		}
	}
};
</script>

<style></style>
