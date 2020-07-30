<template>
	<view>
		<view class="content"><rich-text :nodes="content"></rich-text></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content:''
			}
		},
		onLoad() {
			this.getContent()
		},
		methods: {
			getContent() {
				let that = this
				this.$api.get('merchant/getHelpContent').then(data => {
					that.content = data.result.content;
				});
			}
		}
	}
</script>

<style>
	page {
		background-color: #FFFFFF;
	
	}
	.content{
		padding: 15rpx;
		font-size: 33rpx;
	}
</style>
