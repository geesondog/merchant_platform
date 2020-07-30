import config from './config.js'

const baseUrl = config.baseUrl
const getUserInfo = function() {
	return uni.getStorageSync('userInfo')
}

const getToken = function() {
	return uni.getStorageSync('token')
}

const isHaveUser = function() {
	var userinfo = {}
	userinfo = getUserInfo()
	if (userinfo) {
		return true
	} else {
		return false
	}
}

const getUrlKey = function(name) {
	return decodeURIComponent(
			(new RegExp('[?|&]' + name + '=' +
				'([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) ||
		false;
}

const isLoginByTab = function() {
	var userinfo = {}
	userinfo = getUserInfo()
	if (!userinfo) {
		//#ifdef MP-WEIXIN
		navigateTo('../../login/login')
		//#endif
		//#ifdef H5
		navigateTo('../../login/login')
		//#endif
	} else {
		return userinfo
	}

}

const getPlatform = function() {
	//#ifdef MP-WEIXIN
	return 'MPWEIXIN';
	//#endif
	//#ifdef H5
	return 'H5';
	//#endif
}

const isLogin = function() {
	var userinfo = {}
	userinfo = getUserInfo()
	if (!userinfo) {
		//#ifdef MP-WEIXIN
		navigateTo('../login/login')
		//#endif
		//#ifdef H5
		navigateTo('../login/login')
		//#endif
	} else {
		return userinfo
	}
}

const navigateTo = function(path, param = '') {
	uni.navigateTo({
		url: path + param
	});
}

const redirectTo = function(path, param = '') {
	uni.redirectTo({
		url: path + param
	});
}

const showLoading = function(title = '') {
	uni.showLoading({
		title: title
	})
}

//showToast

const showToastIconNone = function(title = '') {
	uni.showToast({
		title: title,
		icon: 'none'
	})
}

const showToastSuccess = function(title = '') {
	uni.showToast({
		title: title,
		icon: 'success'
	})
}

const cl = function(data) {
	console.log(data)
}

const toDecimal2 = function(value) {
	let val = Math.round(parseFloat(value) * 100) / 100;
	let xsd = val.toString().split(".");
	if (xsd.length == 1) {
		val = val.toString() + ".00";
		return val;
	}
	if (xsd.length > 1) {
		if (xsd[1].length < 2) {
			val = val.toString() + "0";
		}
		return val;
	}
}

const saveUserInfo = function(userInfo) {
	uni.setStorage({
		key: 'userInfo',
		data: userInfo
	})
}
const logout = function() {

	uni.removeStorage({
		key: 'userInfo'
	})
	uni.removeStorage({
		key: 'token'
	})
}

export default {
	saveUserInfo,
	logout,
	baseUrl,
	getPlatform,
	navigateTo,
	redirectTo,
	showLoading,
	isLogin,
	getUserInfo,
	getToken,
	showToastIconNone,
	showToastSuccess,
	cl,
	toDecimal2,
	isHaveUser,
	getUrlKey,
	isLoginByTab
}
