<template>
	<view>
		<view>
			<view class="data-item flex bg-white" v-for="(item,index) in dataList">
		
				<view @click="toMerchant(item)" class="merchant-logo">
					<image class="image" v-for="img in item.logo" mode="aspectFill" :src="img.path"></image>
				</view>
				<view @click="toMerchant(item)" class="merchant-info">
					<view class="merchant-title">
						{{item.name}}
						<view class="list-icon color-red cuIcon-vip"></view>
						<view v-if="item.is_settled == 10" class='cu-tag color-red radius sm'>已认证</view>
						
					</view>
					<view class="address">
						<view class="list-icon cuIcon-location"></view>{{item.address}}
					</view>
					<view class="phone">
						<view class="list-icon cuIcon-phone"></view>{{item.phone}}
					</view>
					<view class="time">
						<view class="list-icon cuIcon-time"></view>{{item.opening_time}}-{{item.closing_time}}
						<view style="margin-left: 20rpx; color:#fbbd08;" class="list-icon cuIcon-locationfill"></view>{{item.km}}/km
					</view>
				</view>
		 
				<view class="merchant-action">
					<view style="margin-left: 28rpx;" @click="call(item.phone)" class="list-icon call cuIcon-phone"></view>
				</view>
			</view>
		</view>
		<uni-load-more :status="status"></uni-load-more>
	</view>
</template>

<script>
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import AnNoticeBar from '../../components/an-notice-bar/an-notice-bar.vue';
import util from '../../util.js';
export default {
	components: {
		AnNoticeBar,
		uniLoadMore
	},
	data() {
		return {
			page: 1,
			dataList: [],
			status: 'more'
		};
	},
	onLoad(options) {
		this.loadData('reload');
	},
	onPullDownRefresh() {
		this.page = 1;
		this.loadData('reload');
		uni.stopPullDownRefresh();
	},
	onReachBottom() {
		this.loadData();
	},
	methods: {
		toMerchant(row) {
			uni.navigateTo({
				url: '../merchant/merchant?id=' + row.id + '&name=' + row.name
			});
		},
		call(phone) {
			uni.makePhoneCall({
				phoneNumber: phone
			});
		},
		async loadData(type = 'more') {
			this.status = 'loading';
			let data = await this.$api.get('member/getMyChant', {
				page: this.page
			});
			let dataList = data.result.data;
			if (data.result.current_page >= data.result.last_page) {
				this.status = 'noMore';
			}

			dataList.forEach(function(item, index) {
				let covers = JSON.parse(item.logo);
				dataList[index].logo = covers;
			});
			if (type == 'reload') {
				this.dataList = [];
			}
			this.dataList = this.dataList.concat(dataList);
			this.page++;
		}
	}
};
</script>

<style>
.cuIcon-location {
	font-size: 30rpx;
}

.merchant-info .cu-tag.sm {
	padding: 0rpx 8rpx;
	margin-left: 5rpx;
	top: -4rpx;
}

.color-red {
	color: red;
}

.mer_checked {
	color: #e54d42;
}

.data-item {
	padding: 15rpx;
	border-bottom: 1px solid #cccccc;
	width: 100%;
}

.merchant-logo {
	width: 23%;
}

.merchant-info {
	width: 65%;
}

.merchant-action {
	width: 12%;
}

.merchant-title {
	font-size: 30rpx;
	color: #000;
	margin-left: 10rpx;
	font-weight: 430;
}

.address {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
.call {
	font-size: 60rpx;
	color: #8dc63f;
	margin-top: 62%;
}

.cuIcon-phone {
	margin-right: 5rpx;
}

.cuIcon-time {
	margin-right: 7rpx;
}

.merchant-title .list-icon {
}

.image {
	width: 160rpx;
	height: 160rpx;
	border-radius: 4rpx;
}

.roll_text {
	padding: 10rpx 0rpx;
}

.t-center {
	text-align: center;
}

.settled-bt {
	margin-left: 20rpx;
}

.recomment-list {
	border-left: 1px solid #f1f1f3;
	border-right: 1px solid #f1f1f3;
}

.list-icon {
	display: inline-block;
	line-height: 40rpx;
	margin-left: 10rpx;
}

.tower-swiper .tower-item {
	transform: scale(calc(0.5 + var(--index) / 10));
	margin-left: calc(var(--left) * 100upx - 150upx);
	z-index: var(--index);
}

.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.logo {
	height: 200rpx;
	width: 200rpx;
	margin-top: 200rpx;
	margin-left: auto;
	margin-right: auto;
	margin-bottom: 50rpx;
}

.text-area {
	display: flex;
	justify-content: center;
}

.title {
	font-size: 36rpx;
	color: #8f8f94;
}
</style>
