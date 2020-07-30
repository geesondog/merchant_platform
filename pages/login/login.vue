<template>
	<view>
		<view id="login">
			<button open-type="getUserInfo" @getuserinfo="wxGetUserInfo" withCredentials="true" lang="zh_CN" class="wxLogin">微信登录</button>
		</view>
	</view>
</template>

<script>
	import util from '../../util.js'
	export default {
		data() {
			return {};
		},
		methods: {

			wxGetUserInfo: function(res) {
				let _that = this;
				if (!res.detail.iv) {
					uni.showToast({
						title: res.detail.errMsg,
						icon: 'none',
						duration: 5000
					});
					return false;
				}
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						res.detail['code'] = loginRes.code;
						uni.showLoading();
						_that.$api.post('account/wxAuthLogin', res.detail).then(data => {
							uni.setStorageSync('token', data.result.token);
							_that.getMemberInfo();
						});
					}
				});
			},
			getMemberInfo() {
				let _that = this;
				let token = util.getToken();
				if (token) {
					this.$api.get('member/getMemberInfo').then(data => {
						util.saveUserInfo(data.result);
						uni.navigateBack();
					});
				}
			},
		}
	};
</script>

<style lang="scss">
	page {
		background-color: #FFFFFF;
	}

	#login {
		padding: 0rpx 100rpx;
		padding-top: 70%;
	}

	.wxLogin {
		background-color: #f37b1d;
		color: #FFFFFF;
	}
</style>
