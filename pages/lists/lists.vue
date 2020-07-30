<template>
	<view>
		<scroll-view scroll-x class="bg-white nav" scroll-with-animation :scroll-left="scrollLeft">
			<view class="cu-item" :class="item.id==TabCur?'text-orange  cur':''" v-for="(item,index) in cateList" :key="index"
			 @tap="tabSelect" :data-ks="index" :data-id="item.id">
				{{item.cate_name}}
			</view>
		</scroll-view>
		<view class="bg-white mtop roll_text">
			<view class="flex">
				<view @click="juli" :class="order =='juli'?'mer_checked':''" class="flex-sub t-center padding-sm radius">离我最近<view
					 class="list-icon cuIcon-location"></view>
				</view>
				<view @click="recomment" :class="order =='recomment'?'mer_checked':''" class="flex-sub t-center padding-sm recomment-list radius">推荐排序
					<view class="list-icon cuIcon-appreciate"></view>
				</view>
				<view @click="hot" :class="order =='hot'?'mer_checked':''" class="flex-sub t-center padding-sm radius">人气排序<view
					 class="list-icon cuIcon-hotfill"></view>
				</view>
			</view>
		</view> 
		
		<view class="mtop">
			<view  class="data-item flex bg-white" v-for="(item,index) in dataList">
				
				<view @click="toMerchant(item)"  class="merchant-logo">
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
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	import util from '../../util.js'
	export default {
		onShareAppMessage(res) {
		   return {
		     path: '/pages/lists/lists'
		   }
		 },
		components: {
			uniLoadMore
		},
		data() {
			return {
				TabCur: 0,
				scrollLeft: 0,
				cateList: [],
				page: 1,
				dataList: [],
				latitude: '',
				longitude: '',
				status: 'more',
				order: '',
			}
		},
		onLoad(options) {
			let id = options.id ? options.id : '';
			this.TabCur = id;
			this.loadCate()
			this.loadData('reload');
		},
		onPullDownRefresh() {
			this.page = 1
			this.loadData('reload');
			uni.stopPullDownRefresh();
		},
		onReachBottom() {
			this.loadData();
		},
		methods: {
			async loadData(type = 'more') {
				let that = this
				this.status = 'loading';
				if (type == 'reload') {
					this.dataList = [];
				}
				let data = await this.$api.get('merchant/getList', {
					page: this.page,
					latitude: this.latitude,
					longitude: this.longitude,
					order: this.order,
					category_id:this.TabCur
				});
				let dataList = data.result.data;
				if (data.result.current_page >= data.result.last_page) {
					this.status = 'noMore';
				}
			
				dataList.forEach(function(item, index) {
					let covers = JSON.parse(item.logo);
					dataList[index].logo = covers
				});
				this.dataList = this.dataList.concat(dataList);
				this.page++;
			
			},
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.ks - 1) * 60
				this.page = 1
				this.loadData('reload');
			},
			loadCate() {
				let that = this
				this.$api.get('merchant/getCategoryList').then(data => {
					that.cateList = data.result
				})
			},
			call(phone) {
				uni.makePhoneCall({
					phoneNumber: phone
				});
			},
			juli() {
				this.dataList = []
				this.order = 'juli'
				this.page = 1
				this.getMap();
			},
			recomment() {
				this.dataList = []
				this.page = 1
				this.order = 'recomment'
				this.loadData('reload');
			},
			hot() {
				this.dataList = []
				this.page = 1
				this.order = 'hot'
				this.loadData('reload');
			 
			},
			getMap() {
				let that = this
				uni.getLocation({
					type: 'wgs84',
					success: function(res) {
						that.$set(that, 'latitude', res.latitude)
						that.$set(that, 'longitude', res.longitude)
						that.loadData('reload')
			
					} 
				})
			},
			toMerchant(row) {
				uni.navigateTo({
					url: '../merchant/merchant?id=' + row.id + '&name=' + row.name
				});
			},
		}
	}
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
		border-bottom: 1px solid #CCCCCC;
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

	.merchant-title .list-icon {}

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
		border-left: 1px solid #F1F1F3;
		border-right: 1px solid #F1F1F3;
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
