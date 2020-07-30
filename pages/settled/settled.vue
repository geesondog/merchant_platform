<template>
	<view>
		<view class="cu-bar bg-white">
			<view class="action">
				商家Logo
			</view>
			<view class="action">
				{{ form.logo.length}}/1
			</view>
		</view>
		<view class="cu-form-group">
			<view class="grid col-4 grid-square flex-sub">
				<view class="bg-img" v-for="(item,index) in form.logo" :key="index" @tap="ViewImage" :data-url="item.path">
					<image :src="item.path" mode="aspectFill"></image>
					<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
						<text class='cuIcon-close'></text>
					</view>
				</view>
				<view class="solids" @tap="ChooseImage" v-if="form.logo.length<1">
					<text class='cuIcon-cameraadd'></text>
				</view>
			</view>
		</view>
		<view style="margin-top: 10rpx;"></view>
		<view class="cu-form-group">
			<view class="title">商家名称</view>
			<input placeholder="请输入商家名称" v-model="form.name"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">商家地址</view>
			<input placeholder="请选择地址" disabled :value="form.address"></input>
			<button @click="chooseLocation" class='cu-btn bg-orange shadow'>获取地址</button>
		</view>
		<view class="cu-form-group">
			<view class="title">商家电话</view>
			<input placeholder="请输入商家电话" type="number" v-model="form.phone"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">商家微信号</view>
			<input placeholder="请输入商家微信号" v-model="form.wx_number"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">营业时间</view>
			<picker mode="time" :value="form.opening_time" start="06:00" end="12:00" @change="TimeChange">
				<view class="picker">
					{{form.opening_time}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group">
			<view class="title">打烊时间</view>
			<picker mode="time" :value="form.closing_time" start="12:00" end="24:00" @change="TimeChange2">
				<view class="picker">
					{{form.closing_time}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group">
			<view class="title">联系人</view>
			<input placeholder="请输入联系人" v-model="form.linkman_name"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">联系电话</view>
			<input type="number" placeholder="请输入联系电话" v-model="form.linkman_phone"></input>
		</view>
		<view class="cu-bar bg-white mtop">
			<view class="action">
				封面滚动图
			</view>
			<view class="action">
				{{ form.cover_roll.length}}/3
			</view>
		</view>
		<view class="cu-form-group">
			<view class="grid col-4 grid-square flex-sub">
				<view class="bg-img" v-for="(item,index) in form.cover_roll" :key="index" @tap="ViewImage" :data-url="item.path">
					<image :src="item.path" mode="aspectFill"></image>
					<view class="cu-tag bg-red" @tap.stop="DelImg2" :data-index="index">
						<text class='cuIcon-close'></text>
					</view>
				</view>
				<view class="solids" @tap="ChooseImage2" v-if="form.cover_roll.length<3">
					<text class='cuIcon-cameraadd'></text>
				</view>
			</view>
		</view>
		<view style="margin-top: 10rpx;"></view>
		<view class="cu-bar bg-white ">
			<view class="action">
				商家图片
			</view>
			<view class="action">
				{{ form.cover_facade.length}}/4
			</view>
		</view>
		<view class="cu-form-group">
			<view class="grid col-4 grid-square flex-sub">
				<view class="bg-img" v-for="(item,index) in form.cover_facade" :key="index" @tap="ViewImage" :data-url="item.path">
					<image :src="item.path" mode="aspectFill"></image>
					<view class="cu-tag bg-red" @tap.stop="DelImg3" :data-index="index">
						<text class='cuIcon-close'></text>
					</view>
				</view>
				<view class="solids" @tap="ChooseImage3" v-if="form.cover_facade.length<4">
					<text class='cuIcon-cameraadd'></text>
				</view>
			</view>
		</view>
		<view class="mtop"></view>
		<checkbox-group class="block" @change="CheckboxChange">
			<view class="cu-bar bg-white">
				<view class="action">
					行业分类
				</view>
			</view>
			<view class="cu-form-group" v-for="(item,index) in category">
				<view class="title">{{item}}</view>
				<checkbox class='round' :class="cbox[index]==true?'checked':''" :checked="cbox[index] == true?true:false" :value="item"></checkbox>
			</view>
		</checkbox-group>
		<radio-group class="block mtop" @change="RadioChange">
			<view class="cu-form-group" v-for="item in package">
				<view class="title">{{item.title}}</view>
				<radio class='radio' :class="form.package_id== item.id?'checked':''" :checked="form.package_id== item.id?true:false"
				 :value="item.id"></radio>
			</view>
		</radio-group>
		<view class="cu-form-group align-start mtop">
			<view class="title">简介</view>
			<textarea maxlength="-1" @input="textareaBInput" :value="form.description" placeholder="商家简介"></textarea>
		</view>
		<view class="padding-xl bg-white">
			<button @click="toDoSettled" class="cu-btn block bg-blue margin-tb-sm">
				<text class="cuIcon-pay"></text> 立即入驻</button>
		</view>
	</view>
</template>

<script>
	import util from '../../util.js';
	export default {
		data() {
			return {
				cbox: [],
				category: [],
				package: [],
				form: {
					address: '',
					logo: [],
					cover_roll: [],
					cover_facade: [],
					opening_time: '6:00',
					closing_time: '18:00',
					category: [],
					package_id: null

				}
			}
		},
		onLoad() {
			this.getCategory()
			this.getPackage()
			let form = uni.getStorageSync('form')
			if (form) {
				this.form = form;
			}
			let cbox = uni.getStorageSync('cbox')
			if (cbox) {
				this.cbox = cbox;
			}
		},
		methods: {
			toDoSettled() {
				let _that = this;
				uni.setStorageSync('form', this.form)
				uni.setStorageSync('cbox', this.cbox)
				if (util.isHaveUser() == false) {
					uni.showModal({
						title: '提示',
						content: '你还没有登录，请先登录',
						success: function(res) {
							if (res.confirm) {
								util.isLogin()
							}
						}
					});
					return false
				}
				
				this.$api.post('member/createOrder', {
					form: JSON.stringify(this.form)
				}).then(data => {
					if (data.code == 200) {
						uni.requestPayment({
							provider: 'wxpay',
							timeStamp: data.result.timestamp,
							nonceStr: data.result.nonceStr,
							package: data.result.package,
							signType: "MD5",
							paySign: data.result.paySign,
							success: function(Pay_res) {
								util.showToastIconNone('恭喜，入驻成功')
								setTimeout(function() {
									uni.setStorageSync('form', '')
									uni.setStorageSync('cbox', '')
									uni.redirectTo({
										url: '../myChant/myChant'
									})									
								}, 2000);

							},
							fail: function(err) {
								console.log('fail:' + JSON.stringify(err));
							}
						});
					} else {
						util.showToastIconNone(data.msg)
					}

				});
			},
			RadioChange(e) {
				this.form.package_id = e.detail.value
			},
			getPackage() {
				let that = this;
				this.$api.get('merchant/package').then(data => {
					that.package = data.result;
				});
			},
			textareaBInput(e) {

				this.form.description = e.detail.value
			},
			CheckboxChange(e) {
				let category = this.category
				let value = e.detail.value;
				let chcks = [];
				category.forEach(function(item, index) {
					value.forEach(function(c, i) {
						if (item == c) {
							if (chcks[index] == undefined) {
								chcks[index] = false;
							}
							chcks[index] = true
						}
					})
				})
				this.cbox = chcks;
				this.$set(this.form, 'category', e.detail.value)
			},
			getCategory() {
				let that = this;
				this.$api.get('merchant/getCategory').then(data => {
					that.category = data.result;
				});
			},
			onChange(event) {
				//行业分类
				this.form.category = event.detail;
			},
			TimeChange(e) {
				this.form.opening_time = e.detail.value
			},
			TimeChange2(e) {
				this.form.closing_time = e.detail.value
				//this.form.opening_time = e.detail.value
			},
			//地图选择地址
			chooseLocation() {
				let that = this;
				uni.chooseLocation({
					success: data => {
						that.$set(that.form, 'address', data.address);
						that.form.latitude = data.latitude;
						that.form.longitude = data.longitude;
					},
					fail: res => {
						uni.openSetting();
					}
				});
			},
			ChooseImage() {
				let that = this
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						res.tempFilePaths.forEach(function(item, index) {
							uni.uploadFile({
								url: util.baseUrl + 'account/upload',
								filePath: item,
								name: 'file',
								success: uploadFileRes => {
									let result = JSON.parse(uploadFileRes.data);
									if (result.code == 200) {
										if (that.form.logo.length != 0) {
											let covers = that.form.logo
											covers.push(result.result)
											that.$set(that.form, 'logo', covers)
											that.form.logo = that.form.logo.push(result.result)
										} else {
											that.$set(that.form.logo, 0, result.result)
										}
									} else {
										util.showToastIconNone(result.msg);
									}
								}
							});
						})
					}
				});
			},
			DelImg(e) {
				this.form.logo.splice(e.currentTarget.dataset.index, 1)
			},
			ChooseImage2() {
				let that = this
				uni.chooseImage({
					count: 3, //默认9
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						res.tempFilePaths.forEach(function(item, index) {
							uni.uploadFile({
								url: util.baseUrl + 'account/upload',
								filePath: item,
								name: 'file',
								success: uploadFileRes => {
									let result = JSON.parse(uploadFileRes.data);
									if (result.code == 200) {
										if (that.form.cover_roll.length != 0) {
											let covers = that.form.cover_roll
											covers.push(result.result)
											that.$set(that.form, 'cover_roll', covers)
										} else {
											that.$set(that.form.cover_roll, 0, result.result)
										}
									} else {
										util.showToastIconNone(result.msg);
									}
								}
							});
						})
					}
				});
			},
			DelImg2(e) {
				this.form.cover_roll.splice(e.currentTarget.dataset.index, 1)
			},
			ChooseImage3() {
				let that = this
				uni.chooseImage({
					count: 4, //默认9
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						res.tempFilePaths.forEach(function(item, index) {
							uni.uploadFile({
								url: util.baseUrl + 'account/upload',
								filePath: item,
								name: 'file',
								success: uploadFileRes => {
									let result = JSON.parse(uploadFileRes.data);
									if (result.code == 200) {
										if (that.form.cover_facade.length != 0) {
											let covers = that.form.cover_facade
											covers.push(result.result)
											that.$set(that.form, 'cover_facade', covers)
											that.$set(that.form, 'cover_facade', covers)
										} else {
											that.$set(that.form.cover_facade, 0, result.result)
										}
									} else {
										util.showToastIconNone(result.msg);
									}
								}
							});
						})
					}
				});
			},
			DelImg3(e) {
				this.form.cover_facade.splice(e.currentTarget.dataset.index, 1)
			},
		}
	}
</script>

<style>

</style>
