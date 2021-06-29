<template>
	<view class="animated faste fadeIn position-absolute top-0 right-0 bottom-0 flex" style="background-color: rgba(0,0,0,0.8);z-index: 50;">
		<view class="py-5 flex-1 flex-column align-center " style="width: 100px;">
			<view class="flex-1" :key="i" v-for="(i,index) in contentList">
				<text :class="index===current?'text-main':'text-white'" @click.stop="$emit('click',{index,type})">{{ i }}</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		list: {
			type: Array
		},
		type: {
			type: String
		},
		current: {
			type: Number,
		},
	},
	filters: {
		// formatItem(i) {
		// 	switch (this.type) {
		// 		case 'rate':
		// 			return i + 'X';
		// 			break;
		// 		case 'def':
		// 			return i + 'P';
		// 			break;
		// 		case 'part':
		// 			return '第' + i + '集';
		// 			break;
		// 	}
		// }
	},
	computed: {
		contentList() {
			switch (this.type) {
				case 'rate':
					return this.list.map(i => i + 'X');
					break;
				case 'def':
					return this.list.map(i => i + 'P');
					break;
				case 'part':
					return this.list.map(i => '第' + i + '集');
					break;
			}
		}
	},
	created() {
		console.log(this.list);
		console.log(this.type);
	}
};
</script>

<style></style>
