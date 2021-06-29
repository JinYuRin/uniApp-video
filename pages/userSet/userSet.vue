<template>
	<view>
		<!-- 设置里面的个人信息应当在store里面拿取才行 -->
		<view class="font-md">
			<ListItem @navigateTo="changeAvatar" label="头像">
				<template v-slot:right>
					<image class="bg-light rounded-circle mr-3 flex-shrink" :src="user.avatar" style="width: 120rpx;height: 120rpx;"></image>
				</template>
			</ListItem>
			<ListItem @navigateTo="changeNickname" label="昵称">
				<template v-slot:right>
					<text class="font-md mr-3">{{ user.nickname || '请设置个性昵称' }}</text>
				</template>
			</ListItem>

			<picker mode="selector" :range="range" @change="handleChange">
				<ListItem label="性别">
					<template v-slot:right>
						<!-- v-model="!range[catesIndex] ? '请选择性别' : range[catesIndex]" -->
						<input
							style="width: 70rpx;"
							disabled
							class="font-md mr-3"
							placeholder-class="font-md text-light-muted"
							:placeholder="user.sex"
							type="text"
							v-model="range[rangeIndex] || user.sex"
						/>
					</template>
				</ListItem>
			</picker>
			<!-- 
			<ListItem @navigateTo="changeSex" label="性别">
				<template v-slot:right>
					<text class="font-md mr-3">{{  }}</text>
				</template>
			</ListItem> -->
			<ListItem @navigateTo="changeDesc" label="个性签名">
				<template v-slot:right>
					<text class="ml-3 font-md mr-3 text-ellipsis">{{ user.desc }}</text>
				</template>
			</ListItem>
		</view>
		<MainButton @click="logout" label="退出登录"></MainButton>
	</view>
</template>

<script>
import MainButton from '../../components/mainButton.vue';
import ListItem from '../../components/listItem.vue';
import { mapState } from 'vuex'; //vue2是这样拿取state的
export default {
	components: { MainButton, ListItem },
	data() {
		return {
			avatar: '',
			range: ['男', '女', '保密'],
			rangeIndex: -1
		};
	},
	computed: {
		...mapState({
			user: state => state.user // 这种vue2写法及其不舒服，vue3使用函数式才是王道
		})
	},
	methods: {
		// 性别选择器
		handleChange(e) {
			this.rangeIndex = e.detail.value;
			this.changeSex();
		},
		// 修改用户资料
		changeAvatar() {
			console.log('开始选择图片并设置图片');
			// 修改资料成功后需要返回新的资料信息然后更改store里面的对应信息和更新缓存才行
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				success: tmp => {
					console.log(tmp.tempFiles[0].path);
					console.log(tmp.tempFiles[0].size/1000/1024,'mb');
					if((tmp.tempFiles[0].size/1000/1024)>1){
						return uni.showToast({
							icon:'none',
							title:'请上传小于1mb的头像'
						})
					}
					this.avatar = tmp.tempFiles[0].path;
					this.$Http.upload('/upload', { filePath: this.avatar }, progress => {
					console.log(progress);
					uni.showToast({
						icon:'none',
						title:`上传进度: ${progress}%`
					})
				}).then(res => {
						console.log(res);
						// 上传成功后开始更新用户信息
						// 总共可以更新四种信息，可以设置为统一接口的非必须参数，如果全部参数为空，拒绝修改
						// 正常途径只可以修改一种，这我就不管了
						this.$Http.post('/user/update', { avatar: res.url }, { token: true }).then(res => {
							console.log(res);
							this.$Store.dispatch('setUser', res);
							// 更新成功后应当
							// http://192.168.3.36:7001/public/avatar/tuweitv.jpg
						});
					});
					// 已经把this的指向全部丢到vue去了
				}
			});
		},
		changeNickname() {
			uni.navigateTo({
				url: '../updateUser/updateUser?type=nickname&content=' + this.user.nickname
			});
		},
		changeDesc() {
			uni.navigateTo({
				url: '../updateUser/updateUser?type=desc&content=' + this.user.desc
			});
		},
		changeSex() {
			console.log('准备修改性别为', this.range[this.rangeIndex]);
			this.$Http.post('/user/update', { sex: this.range[this.rangeIndex] }, { token: true }).then(res => {
				console.log(res);
				this.$Store.dispatch('setUser', res);
				// 追踪一下更改资料后刷新页面token失效的问题
				// 更新成功后应当
				// http://192.168.3.36:7001/public/avatar/tuweitv.jpg
			});
		},
		// 退出登录逻辑
		async logout() {
			// console.log('退出登录');
			// const token = uni.getStorageSync('user').token;
			// console.log(token);
			// let res = await this.$Http.post('/logout', {}, { header: { token } });
			// console.log(res);
			this.$Store.dispatch('logout').then(res => {
				// console.log('已经退出登录');
				// uni.navigateBack({
				// 	delta: 1
				// }); // tabbar页面可以选择switchtab
				uni.switchTab({
					url: '../my/my'
				});
				uni.showToast({
					// 轻提示
					title: '退出登录成功',
					icon: 'none'
				});
			});
			// uni.navigateBack({
			// 	delta: 1
			// });
		}
	}
};
</script>

<style></style>
