// https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/js/image-20200803225915556.png
let Utils = {
	getUrlParam: function (name) {
		let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i")
		let r = window.location.search.substr(1).match(reg)
		if (r != null) {
			return decodeURIComponent(r[2])
		}
		return null
	}
}
window.Utils = Utils