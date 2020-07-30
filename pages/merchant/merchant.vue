<template>
	<view>
		<swiper class="screen-swiper square-dot" :indicator-dots="true" :circular="true" :autoplay="true" interval="5000"
		 duration="500">
			<swiper-item v-for="(item,index) in swiperList" :key="index">
				<image :src="item.path" mode="aspectFill"></image>
			</swiper-item>
		</swiper>
		<view class="cu-bar bg-white solid-bottom">
			<view class="action">
				<text class="cuIcon-attention text-orange "></text>共被浏览<text style="color:#DD514C;">{{info.view}}</text>次
			</view>
			<view class="action">
				<text class="cuIcon-vip text-red "></text>
				<text style="padding-left: 15rpx;" v-if="info.is_settled ==10"> 商家电话已经核实、诚信商家</text>
				<text style="padding-left: 15rpx;" v-if="info.is_settled ==20"> 商家电话未核实</text>
			</view>
		</view>
		<view class="cu-list grid col-3 mtop">
			<view @click="call" class="cu-item">
				<view class="cuIcon-phone" style="color: #1cbbb4;">
				</view>
				<text>拨打电话</text>
			</view>
			<view @click="copy" class="cu-item">
				<view class="cuIcon-weixin" style="color: #39b54a;">
				</view>
				<text>复制微信号</text>
			</view>
			<view @click="openLocation" class="cu-item">
				<view class="cuIcon-location" style="color: #fbbd08;">
				</view>
				<text>一键导航</text>
			</view>

		</view>
		<view class="cu-list menu " style="margin-top: 10rpx;">
			<view class="cu-item arrow">
				<view class="content">
					<text class="cuIcon-location text-green"></text>
					<text class="text-grey">{{info.address}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-time text-blue"></text>
					<text class="text-grey">营业时间：{{info.opening_time}}-{{info.closing_time}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-phone text-orange "></text>
					<text class="text-grey">联系电话：{{info.phone}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-tagfill text-red  margin-right-xs"></text>
					<text class="text-grey">行业标签：</text>
				</view>
				<view class="action">
					<view v-for="item in info.categorys" class="cu-tag round bg-blue light">{{item}}</view>
				</view>
			</view>
		</view>
		<view class="cu-bar bg-white solid-bottom mtop">
			<view class="action">
				<text class="cuIcon-title text-blue "></text> 商家图片
			</view>
		</view>
		<view class="bg-white">
			<image class="merchant-image" mode="aspectFill" v-for="item in info.cover_facade" :src="item.path"></image>
		</view>
		
		<view class="cu-bar bg-white solid-bottom mtop">
			<view class="action">
				<text class="cuIcon-title text-orange "></text> 商家介绍
			</view>
		</view>
		<view class="bg-white" style="padding: 0rpx 50rpx;">
			<text>{{info.description}}</text>
		</view>
		<view class="bg-white" style="height: 50rpx;"></view>
	</view>
</template>

<script>
	import util from '../../util.js'
	export default {
		onShareAppMessage(res) {
		   return {
		     title: info.name,
		     path: '/pages/merchant/merchant?id='+info.id
		   }
		 },
		data() {
			return {
				swiperList: [],
				towerStart: 0,
				direction: '',
				info: {}
			}
		},
		onLoad(options) {
			this.loadData(options.id)
			this.TowerSwiper('swiperList');
		},
		methods: {
			openLocation() {
				let that = this
				uni.openLocation({
					latitude: Number(this.info.latitude),
					longitude: Number(this.info.longitude),
					name: this.info.name,
					address: this.info.address,
					success: function() {

					},
					fail: function(res) {

					}
				});
			},
			copy() {
				uni.setClipboardData({
					data: this.info.wx_number,
					success: function() {
						util.showToastIconNone('复制成功')
					}
				});
			},
			call() {
				uni.makePhoneCall({
					phoneNumber: this.info.phone
				});
			},
			loadData(id) {
				let that = this
				this.$api.get("merchant/getInfo", {
					id: id
				}).then(data => {
					let info = data.result
					that.$set(that, 'swiperList', JSON.parse(info.cover_roll))
					info.cover_facade = JSON.parse(info.cover_facade);
					info.categorys = info.categorys.split(',')
					this.info = info
					uni.setNavigationBarTitle({
						title: info.name
					});
				})
			},
			// 初始化towerSwiper
			TowerSwiper(name) {
				let list = this[name];
				for (let i = 0; i < list.length; i++) {
					list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
					list[i].mLeft = i - parseInt(list.length / 2)
				}
				this.swiperList = list
			},

			// towerSwiper触摸开始
			TowerStart(e) {
				this.towerStart = e.touches[0].pageX
			},

			// towerSwiper计算方向
			TowerMove(e) {
				this.direction = e.touches[0].pageX - this.towerStart > 0 ? 'right' : 'left'
			},

			// towerSwiper计算滚动
			TowerEnd(e) {
				let direction = this.direction;
				let list = this.swiperList;
				if (direction == 'right') {
					let mLeft = list[0].mLeft;
					let zIndex = list[0].zIndex;
					for (let i = 1; i < this.swiperList.length; i++) {
						this.swiperList[i - 1].mLeft = this.swiperList[i].mLeft
						this.swiperList[i - 1].zIndex = this.swiperList[i].zIndex
					}
					this.swiperList[list.length - 1].mLeft = mLeft;
					this.swiperList[list.length - 1].zIndex = zIndex;
				} else {
					let mLeft = list[list.length - 1].mLeft;
					let zIndex = list[list.length - 1].zIndex;
					for (let i = this.swiperList.length - 1; i > 0; i--) {
						this.swiperList[i].mLeft = this.swiperList[i - 1].mLeft
						this.swiperList[i].zIndex = this.swiperList[i - 1].zIndex
					}
					this.swiperList[0].mLeft = mLeft;
					this.swiperList[0].zIndex = zIndex;
				}
				this.direction = ""
				this.swiperList = this.swiperList
			},
		}
	}
</script>

<style>
	.merchant-image{
		width: 100%;
		
	}
</style>
