import http from './interface'
import util from './../../util.js'
export const request = (data) => {
	http.config.baseUrl = util.baseUrl
	http.interceptor.request = (config) => {
		config.header = {
			'Content-Type': 'application/json;charset=UTF-8',
			'Content-Type': 'application/x-www-form-urlencoded',
			'token': util.getToken(),
			'platform':util.getPlatform(),
		}
	}
	http.interceptor.response = (response) => {
		if (response.statusCode === 200) { //成功
			if (response.data.code == 400) { //普通 200,400 ,500
				uni.showToast({
					title: response.data.msg,
					icon: 'none'
				});
				return false
			}else if(response.data.code == 500){
				uni.showModal({
				    content: response.data.msg,
				    success: function (res) {
				        if (res.confirm) {
				            util.isLogin()
				        }
				    }
				});
				uni.removeStorage({
					key: 'userInfo'
				})
				uni.removeStorage({
					key: 'token'
				})
				return false
			}
		} else {
			uni.showToast({
				title: '网络出错',
				icon: 'none'
			});
			return false
		}
		return response;
	}
	return http.request(data)
}
export const post = (url,data) => {
	return request({
		url: url,
		method: 'POST',
		data:data,
	})
}
export const get = (url,data) => {
	return request({
		url: url,
		method: 'GET',
		data,
	})
}
export default {
	request,
	post,
	get
}
