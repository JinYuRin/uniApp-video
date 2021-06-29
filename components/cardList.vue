<template>
	<view>
		<view v-if="title" class="font-md font-weight-bold px-3 py-3">{{title}}</view>
		<view class="flex justify-between flex-wrap"
			  :class="{'px-3':notMyFav}"
		>
			<!--卡片组件作为插槽插入 因为我制作了多种卡片  -->
			<!-- 麻蛋居然用插槽的做法，不过用插槽可以解决自定义的问题
				第二方案就是直接把两种卡片塞进来进行条件渲染，但是比较局限
			 -->
			<slot></slot>
		</view>
		<view v-if="isShowRefresh"
			  class="flex align-center justify-center text-danger" 
			  @click="()=>{handleRefreshClick()}">
			<!--居然不能直接写执行语句你妈的，我在vue3H5环境都能用的
				$emit('')总能用吧
			 -->
			<text class="iconfont iconshuaxin mr-1"></text>
			换一批
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			title:String,
			isShowRefresh:{
				type:Boolean,
				// required:true,有默认值为false的
				// default:false
			},
			notMyFav:{
				type:Boolean,
				default:true
			}
		},
		name: 'CardList',
		methods:{
				// 麻蛋，uniapp的@click里面都不能直接写函数和流程语句
				handleRefreshClick() {
					console.log('点击了刷新并传递给父组件了')
					this.$emit('refreshClick',{msg:'请刷新'})
					// 我草，使用插槽的话就不是父组件和子组件关系了啊，事件传递就不用逐级传递了
				}
		}
	}
</script>

<style>
</style>
