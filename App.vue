<script>
export default {
	onLaunch: function() {
		console.log('App Launch');
		// 一上来先要获取本地缓存初始化登录状态
		this.$Store.dispatch('initUser');
		// 还要获取cates
		this.$Http.get('/cates').then(res => {
			console.log('分类获取成功', res);
			this.$Store.dispatch('setCates',res);
		});
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	},
	created() {}
};
</script>

<style>
/*每个页面公共css */
/* #ifndef APP-NVUE */
/* 引入官方样式库 */
@import url('./common/uni.css');
/* 引入animate动画库 */
@import url('./common/animate.css');
/* #endif */
/* 引入free样式库 */
@import url('./common/free.css');
/* 引入全局样式库 */
@import url('./common/common.css');
/* #ifndef APP-NVUE */
/* 引入自定义图标库 */
@import url('./common/icon.css');
/* #endif */
</style>
