<template>
	<view>
		<view class="cu-bar solid-bottom hread">
			<view class="user">
				<view>
					<image class="avatarUrl" :src="userinfo.avatarUrl||'../../static/image/head.jpeg'"></image>
				</view>
				<view class="nickname">{{userinfo.nickName||'你好，游客'}}</view>
			</view>
		</view>
		<view style="margin-top: 20rpx;"></view>
		<view class="cu-list menu">
			<view class="cu-item arrow">
				<navigator class="content" url="../settled/settled" hover-class="navigator-hover">
					<text class="cuIcon-vip text-red"></text>
					<text class="">我要入驻</text>
				</navigator>
			</view>
			<view class="cu-item arrow">
				<view @click="toSettled" class="content">
					<text class="cuIcon-friendfavor text-blue"></text>
					<text class="">我的入驻</text>
				</view>
				
			</view> 
			<view class="cu-item arrow">
				<view class="content">
					<button style="border: none;" id="service" open-type="contact">
					<text class="cuIcon-service text-orange"></text>
					<text style="margin-left: 21rpx;" class="">客服中心</text>
					</button>
				</view>
			</view>
			<view class="cu-item arrow">
				<navigator class="content" url="../help/help" hover-class="navigator-hover">
					<text class="cuIcon-question text-green"></text>
					<text class="">帮助说明</text>
				</navigator>
			</view>
			<view v-if="userinfo" @click="lout" class="cu-item arrow">
				<view class="content">
					<text class="cuIcon-refresh text-red"></text>
					<text class="">账户退出</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '../../util.js'
	export default {
		data() {
			return {
				userinfo: {}
			}
		},
		onLoad() {
			this.userinfo = util.getUserInfo()
			//util.isLogin()
		},
		onShow() {
			this.userinfo = util.getUserInfo()
		},
		methods: {
			lout(){
				util.logout()
				util.isLogin()
			},
			toSettled(){
				util.isLogin()
				uni.navigateTo({
					url:'../myChant/myChant'
				})
			},
			getMemberInfo() {
				let _that = this;
				let token = util.getToken()
				if (token) {
					this.$api.get('member/getMemberInfo').then(data => {
						_that.userinfo = data.result;
					});
				}
			},
		}
	}
</script>

<style>
	#service{
		border-color: #FFFFFF;
		padding: 0;
		margin: 0;
		background-color: #FFFFFF;
		line-height: none;
		text-align: left;
		color: #333333; 
		display: block;
		font-size: 30rpx;
		 
	}
	#service::after{
		border: none;
	}
	.hread {
		display: inline-block;
		width: 100%;
		margin: 0 auto;
		background-color: #f37b1d;
	}

	.user {
		text-align: center;
		padding-top: 120rpx;
		padding-bottom: 20rpx;
	}

	.avatarUrl {
		width: 150rpx;
		height: 150rpx;
		border-radius: 50%;
	}

	.nickname {
		color: #FFFFFF;
		font-size: 32rpx;
	}
</style>
