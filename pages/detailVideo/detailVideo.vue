<template>
	<view>
		<!--这里的video使用px是为了兼容之后的subNView还有，uniapi出来的高宽都是px -->
		<!-- # fndef 非  -->
		<!-- #ifndef APP-PLUS -->
		<video class="position-absolute" autoplay="true" style="top: 0;left: 0;right: 0; width: 100%;height: 225px;" :src="src" controls></video>
		<view class="" style="width: 100%;height: 225px;"></view>
		<!-- #endif -->
		<!-- {{ hot }} -->
		<view style="padding-bottom: 2rpx;" class="flex justify-center align-center border-bottom">
			<view @click="changeTab(index)" :key="index" v-for="(tab, index) in tabBars" style="line-height: 1.5" class="flex justify-center align-center flex-1">
				<text
					:style="index === currentTab ? 'border-bottom-width: 4rpx; border-bottom-color:#FB7299' : ''"
					class="pb-1"
					:class="{ 'text-main': index === currentTab, 'border-bottom': index === currentTab }"
				>
					{{ tab }}
				</text>
			</view>
		</view>
		<swiper @change="handleSwipe" :current="currentTab" class="bg-light" :style="'height: ' + scrollHight + 'px;'" :duration="300">
			<swiper-item>
				<scroll-view :style="'height: ' + scrollHight + 'px;'" scroll-y="true">
					<view class="mt-4 px-3 flex align-center justify-between">
						<!-- 我这里只设置了两个元素，使用justify-between刚刚好，如果做成三个元素
						 可以使用auto-margin
						 -->
						<navigator :url="`../userSpace/userSpace?user_id=${user.id}`">
							<view class="flex">
								<image class="rounded-circle" :src="user.avatar" style="width: 100rpx;height: 100rpx;"></image>
								<view class="ml-3">
									<view class="font-md text-main">{{ user.nickname || user.username }}</view>
									<view class="font-sm text-light-muted">{{ fansCount }} 粉丝</view>
								</view>
							</view>
						</navigator>
						<view
							@click="following"
							:class="follow ? 'bg-main-disabled' : 'bg-main'"
							class="flex justify-center align-center text-white rounded"
							style="width: 120rpx;height:60rpx;"
						>
							{{ follow ? '已关注' : '关注' }}
						</view>
					</view>
					<view class="mt-4 px-3">
						<view class="font-md">{{ video.title }}</view>
						<!-- 还缺一个视频描述没有加上去 -->
						<view class="mt-1">
							<view class="flex align-center text-muted font-sm position-relative">
								<text class="iconfont iconbofangshu font-md mr-1" />
								<text class="mr-2">{{ video.play_count }}</text>
								<text class="iconfont icondanmushu font-md" />
								<text class="mr-2">{{ video.danmu_count }}</text>
								<!-- <text>{{ video.created_time | formatDate }}</text> -->
								<uni-dateformat format="yyyy/MM/dd" :date="video.created_time" :threshold="[60000, 86400000]"></uni-dateformat>
								<!-- <text style="font-size: 40rpx;" class="iconfont iconshoucang ml-auto mr-4"></text> -->
								<!-- <view
									@click="faving"
									:class="fava ? 'bg-main-disabled' : 'bg-main'"
									class="flex justify-center align-center text-white rounded ml-auto"
									style="width: 120rpx;height:60rpx;"
								>
									{{ fava ? '已收藏' : '收藏' }}
								</view> -->
							</view>
						</view>
						<!-- <uni-collapse @change="change"> -->
							<!-- <uni-collapse-item :showAnimation="true" title="简介" open="true"><view style="padding: 30rpx;">{{ video.desc }}</view></uni-collapse-item> -->
						<!-- </uni-collapse> -->
						<view class="">{{ video.desc }}</view>
					</view>
					<view class="flex border-bottom pb-2">
						<!-- 居然支持class -->
						<view class="flex-1 flex flex-column justify-center align-center">
							<uni-icons @click="liking" color="#FB7299" type="heart" size="25"></uni-icons>
							<text class="font" style="margin-top: -15rpx;">喜欢</text>
						</view>
						<view class="flex-1 flex flex-column justify-center align-center">
							<uni-icons @click="liking" color="#FB7299" type="hand-thumbsup" size="25"></uni-icons>
							<text class="font" style="margin-top: -15rpx;">点赞</text>
						</view>
						<view class="flex-1 flex flex-column justify-center align-center">
							<uni-icons @click="liking" color="#FB7299" type="hand-thumbsdown" size="25"></uni-icons>
							<text class="font" style="margin-top: -15rpx;">点踩</text>
						</view>
						<view class="flex-1 flex flex-column justify-center align-center">
							<uni-icons @click="faving" color="#FB7299" :type="fava ? 'star-filled' : 'star'" size="25"></uni-icons>
							<text class="font" style="margin-top: -15rpx;">收藏</text>
						</view>
						<view class="flex-1 flex flex-column justify-center align-center">
							<uni-icons @click="liking" color="#FB7299" type="paperplane" size="25"></uni-icons>
							<text class="font" style="margin-top: -15rpx;">转发</text>
						</view>
					</view>
					<view class="p-3 border-bottom" style="height: 260rpx;">
						<view @click="openPartChooser" class="flex justify-between align-center">
							<view class="font-md">选集</view>
							<view class="font text-light-muted">
								共{{ video_details.length }}集
								<text class="iconfont iconjinru"></text>
							</view>
						</view>
						<view>
							<scroll-view class="scroll-row mt-3" scroll-x="true" style="height: 200rpx;">
								<view
									@click="changePart(index)"
									:key="index"
									v-for="(part, index) in video_details"
									class="flex-column justify-center mr-2 py-3 px-2 border rounded-lg"
									style="display: inline-flex; height: 110rpx;width: 300rpx;"
									:class="{ 'text-main': currentPart === index, currntPartBorder: currentPart === index, 'text-light-muted': currentPart !== index }"
								>
									<view class="font">{{ part.title }}</view>
									<view class="font-md text-ellipsis">{{ part.desc }}</view>
								</view>
							</scroll-view>
						</view>
					</view>
					<!-- hot列表 -->
					<view style="margin: 0 -10rpx 0 -30rpx;">
						<CardList><Card3 @toDetailVideo="navigateTo(item)" v-for="(item, index) in hot" :key="index" :item="item" /></CardList>
					</view>

					<view class="animated faster fadeIn" v-if="showPartChooser">
						<view @click="closePartChooser" class="bg-secondary position-fixed" style="width: 100%;height: 100%;bottom: 0;opacity: 0.3;"></view>
						<view class="bg-white px-2 py-2 bg-white position-fixed" style="box-sizing: border-box;height:600rpx; width: 100%;top: 280rpx;">
							<view class="flex justify-between align-center">
								<view class="font-md">选集</view>
								<view @click="closePartChooser" class="iconfont iconguanbi font text-light-muted"></view>
							</view>
							<scroll-view class="" style="height:488rpx;" scroll-y="true">
								<view class="flex flex-wrap justify-between">
									<view
										@click="changePart(index)"
										:key="index"
										v-for="(part, index) in video_details"
										class="flex-column mt-2 py-3 px-2 border rounded-lg"
										style="display: inline-flex; height: 110rpx;width: 300rpx;"
										:class="{ 'text-main': currentPart === index, currntPartBorder: currentPart === index, 'text-light-muted': currentPart !== index }"
									>
										<view class="font">{{ part.title }}</view>
										<view class="font-md text-ellipsis">{{ part.desc }}</view>
									</view>
								</view>
							</scroll-view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
			<swiper-item>
				<scroll-view class="mb-3" :style="'height: ' + scrollHight + 'px;'" scroll-y="true">
					<view v-for="(i, index) in comments" class="p-2 bg-light border-bottom">
						<view class="uni-comment">
							<view class="uni-comment-list">
								<view class="uni-comment-face"><image class="uni-comment-face" :src="i.send_user.avatar"></image></view>
								<view @click="reply(i)" class="uni-comment-body">
									<view class="uni-comment-top">
										<text>{{ i.send_user.nickname || i.send_user.username }}</text>
									</view>
									<!-- <view class="uni-comment-date font-sm text-light-muted">{{ i.created_time | formatDate }}</view> -->
									<view class="uni-comment-date font-sm text-light-muted">
										<uni-dateformat format="yyyy/MM/dd" :date="i.created_time" :threshold="[60000, 86400000]"></uni-dateformat>
									</view>
									<view class="uni-comment-content">{{ i.content }}</view>
								</view>
							</view>
							<view style="margin-left: 80rpx;">
								<view v-for="i in i.comments" class="mb-1 p-1 rounded-lg font-sm text-main" style="background: rgba(144,147,153,0.3)">
									{{ i.send_user.nickname || i.send_user.username }}:
									<text class="ml-1 text-muted">{{ i.content }}</text>
								</view>
							</view>
						</view>
					</view>
					<view style="height: 40rpx;" class="py-3 flex justify-center align-center font-md text-light-muted">暂无数据</view>
					<view class="animated faster fadeIn" v-if="showCommentInput">
						<view @click="closeCommentInput" class="bg-secondary position-fixed" style="width: 100%;height: 100%;bottom: 0;opacity: 0.3;"></view>
						<view class="p-1 flex justify-between align-center position-fixed bg-light rounded-lg" style="box-sizing: border-box;width: 100%;bottom: 0;">
							<input
								:focus="showCommentInput"
								style="flex: 9;"
								v-model="newComment"
								class="p-2"
								type="text"
								:placeholder="placeholder || '说点什么吧'"
								placeholder-class="font text-light-muted"
							/>
							<view @click="submitComment" class="flex-shrink flex justify-center align-center bg-main rounded-lg text-white" style="height: 80rpx; width: 80rpx;">
								发送
							</view>
						</view>
					</view>
				</scroll-view>
				<view
					@click="comment"
					class="animated faster flex justify-center align-center bg-main rounded-circle position-fixed"
					hover-class="pulse"
					style="height: 80rpx;width: 80rpx;bottom: 50rpx;right: 50rpx;"
					:style="'bottom: ' + windowHeight / 2 + 'px;'"
				>
					<view class="text-white iconfont iconjia font-lg"></view>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
import Card3 from '../../components/card3.vue';
import CardList from '../../components/cardList.vue';
import UniDateformat from '../../uni-components/uni-dateformat/uni-dateformat.vue';
import UniIcons from '../../uni-components/uni-icons/uni-icons.vue';
import UniCollapse from '../../uni-components/uni-collapse/uni-collapse.vue';
import UniCollapseItem from '../../uni-components/uni-collapse-item/uni-collapse-item.vue';
export default {
	onLoad({ video_id }) {
		let scrollHight = uni.getSystemInfoSync().windowHeight - 30-225;
		console.log(scrollHight);
		this.scrollHight = scrollHight;
		this.windowHeight = uni.getSystemInfoSync().windowHeight;
		console.log('当前视频id是', video_id);
		// console.log('当前视频id是', uni.getSystemInfoSync().windowHeight - 30);
		this.getVideoRead(video_id);
		// 提交播放记录
		this.submitVideoPlay(video_id);
	},
	components: {
		Card3,
		CardList,
		UniDateformat,
		UniIcons,
		UniCollapse,
		UniCollapseItem
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
	onReachBottom() {
		switch (this.currentTab) {
			case 0:
				console.log('到底');
				break;
			case 1:
				console.log('到底了，请刷新评论');
				break;
		}
	},
	computed: {
		hot: function() {
			return this.videoRead.hot; // 莫名其妙的bug???怎么会说videoRead是undefined呢
		}
	},
	data() {
		return {
			tabBars: ['简介', '评论'],
			currentTab: 0,
			videoRead: {},
			// 以下属性皆可以做成计算属性videoRead.*
			fansCount: 0,
			video: {},
			// hot: [],
			follow: false,
			fava: false,
			user: {},
			video_details: [],
			// 评论相关
			comments: [],
			commentPage: 1,
			newComment: '',
			reply_id: -1, // 默认为-1，因为后端reply_id判定为>0才是回复，否则是评论
			reply_user_id: -1,
			showCommentInput: false,
			placeholder: '',
			// 集数选择
			src: '', // // 计算属性可以依赖另一个计算属性吗我打算让他计算成video_details[currentPart].url
			showPartChooser: false,
			currentPart: 0,
			// 高宽
			windowHeight: 0,
			scrollHight: 0
		};
	},
	methods: {
		//

		liking() {
			uni.showToast({
				icon: 'none',
				title: '抱歉，该功能后期会上线'
			});
		},
		// 提交播放记录，需要对video和videoPlay两张表同时操作
		// 说真的，你还真不需要考虑什么事务问题
		submitVideoPlay(video_id) {
			this.$Http.post('/video_play/submit', { video_id }).then(res => {
				console.log(res);
			});
		},
		// 把播放记录写到缓存区
		// JavaScript unshift()函数移入数据到数组第一位
		// 你不仅可以 shift（移出）数组中的第一个元素，你也可以 unshift（移入）一个元素到数组的头部。
		// .unshift() 函数用起来就像 .push() 函数一样, 但不是在数组的末尾添加元素，而是在数组的头部添加元素。
		saveHistory(video) {
			// 若无history则创建并加入缓存
			let history = uni.getStorageSync('history');
			if (!history) {
				return uni.setStorageSync('history', JSON.stringify([video]));
			}
			// 有缓存则扩列
			history = JSON.parse(history);
			if (
				history.find(i => {
					return i.id === video.id; // 使用箭头函数可以直接引用外层的属性
				})
			) {
				// console.log('该记录已存在于缓存');
				return;
			}
			return uni.setStorageSync('history', JSON.stringify([video, ...history]));
		},
		// 视频详情的数据
		// 从外面进来后，token有效，但是本页面刷新后却无效????
		getVideoRead(id) {
			this.$Http.get('/video_read/' + id, { token: true }).then(res => {
				// get函数不需要第二参数data
				// 给你个经验教训，当你无法找到问题所在的时候，你需要沿着函数调用栈一层一层找，不能想当然
				console.log(res);
				this.videoRead = res;
				this.user = this.videoRead.video.user;
				this.video_details = this.videoRead.video.video_details;
				this.fava = this.videoRead.fava;
				this.follow = this.videoRead.follow;
				// this.hot = this.videoRead.hot;
				this.video = this.videoRead.video;
				this.fansCount = this.videoRead.fansCount;
				this.src = this.video_details[0].url; // 默认第一集
				console.log(this.video_details);
				this.saveHistory(this.video);
			});
		},
		// 滑动swiper
		handleSwipe(e) {
			this.currentTab = e.detail.current;
			// 第一次进入评论区的初始化
			if (e.detail.current === 1 && this.comments.length === 0) {
				console.log('请初始化评论区');
				// this.comments = [1];
				// 还要写分包获取呢
				this.$Http.get(`/video_comment/${this.video.id}/${this.commentPage}`).then(res => {
					console.log(res);
					this.comments = res;
					// this.commentPage++;
				});
			}
		},
		// 切换Tab
		changeTab(index) {
			this.currentTab = index;
			// 第一次进入评论区的初始化
			if (index === 1 && this.comments.length === 0) {
				console.log('请初始化评论区');
				// this.comments = [1];
				// 还要写分包获取呢
				this.$Http.get(`/video_comment/${this.video.id}/${this.commentPage}`).then(res => {
					console.log(res);
					this.comments = res;
					// this.commentPage++;
				});
			}
		},
		changePart(index) {
			this.currentPart = index;
			// src准备写成计算属性试试
			this.src = this.video_details[index].url;
		},
		// 选集模态框的弹出淡入
		closePartChooser() {
			this.showPartChooser = false;
		},
		openPartChooser() {
			this.showPartChooser = true;
		},
		// 关注
		following() {
			console.log('在这里对接关注接口');
			// 关注
			if (!this.follow) {
				this.$Http.post('/user/follow', { follow_id: this.user.id }, { token: true }).then(res => {
					if (res.status) {
						uni.showToast({
							icon: 'none',
							title: '关注成功'
						});
						this.follow = true;
					}
				});
			} else {
				// 取关
				this.$Http.post('/user/unfollow', { follow_id: this.user.id }, { token: true }).then(res => {
					if (res.status) {
						uni.showToast({
							icon: 'none',
							title: '取消关注'
						});
						this.follow = false;
					}
				});
			}
		},
		// 收藏与否
		faving() {
			console.log('在这里对接收藏接口');
			this.$Http.post('/fava/video', { video_id: this.video.id }, { token: true }).then(res => {
				console.log(res);
				uni.showToast({
					icon: 'none',
					title: res.fava ? '收藏成功' : '取消收藏'
				});
				this.fava = res.fava;
			});
		},
		// 开关评论框
		openCommentInput() {
			this.showCommentInput = !this.showCommentInput;
		},
		closeCommentInput() {
			this.showCommentInput = false;
		},
		comment() {
			console.log('开始评论吧');
			this.placeholder = '';
			this.openCommentInput();
		},
		reply(i) {
			console.log('开始回复吧');
			this.placeholder = '正在回复：' + i.send_user.nickname || i.send_user.username;
			this.reply_id = i.id;
			this.reply_user_id = i.send_user.id;
			this.openCommentInput();
		},
		// 提交评论
		// 你提交回复还没写呢
		// 出错逻辑你没写呢
		submitComment() {
			if (this.newComment === '') {
				return uni.showToast({
					icon: 'none',
					title: '回复内容不能为空'
				});
			}
			this.$Http
				.post(
					'/comment',
					{
						content: this.newComment,
						video_id: this.video.id,
						reply_id: this.reply_id,
						reply_user_id: this.reply_user_id
					},
					{
						token: true
					}
				)
				.then(res => {
					console.log(res);
					// 提交成功后要刷新页面，初始化评论页面的时机是什么时候????
					// this.comments.push(this.newComment);
					this.closeCommentInput();
					// 表单数据归还
					this.newComment = '';
					this.reply_id = -1;
					this.reply_user_id = -1;
					// 刷新评论页面
					this.$Http.get(`/video_comment/${this.video.id}/1`).then(res => {
						console.log(res);
						this.comments = res;
					});
				});
		},
		// 视频跳转navigateTo
		navigateTo({ id }) {
			console.log(id);
			uni.navigateTo({
				url: `../detailVideo/detailVideo?video_id=${id}`
			});
		}
	}
};
</script>

<style>
.currntPartBorder {
	border-color: #fb7299;
}
</style>
