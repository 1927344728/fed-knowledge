// 存前端异常信息接口: 
// {
//     projectName: null,  //String。项目名称
//     currentUrl: window.location.href,
//     userAgent: window.navigator.userAgent,
//     errorType: null,  //String。错误类型
//     errors: {}, //错误日记
//     // currentTime: null,  //由服务端取当前时间
//     // userId: '',  //服务端提供
//     // phone: '',  //服务端提供
// }

// 新增：
// currentTime: 时间戳


// 获取前端异常信息接口: 根据关键字搜索，加分页
// - projectName、errorType、用户id、用户手机号。精确匹配
// - 开始-结束时间，范围内查询
// - currentUrl、userAgent。模糊查找
// 获取所有projectName、errorType
// 以projectName、errorType为纬度，统计指定时间内(如一天、一周、一月)的错误数量

//查询错误记录的用户，在当前查询的时间段内，是否有反馈
//根据错误信息模糊查找记录
// 删除：
// mobile, 手机号


function errXMLHttpRequest (obj) {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.onreadystatechange = function(){
        // 通信成功时，状态值为4
        if (xhr.readyState === 4){
            if (xhr.status === 200){
                console.log(xhr.responseText);
            } else {
                console.error(`${xhr.status}错误:${xhr.statusText}`);
            }
        }
    };
    xhr.onerror = function (e) {
        console.log(e)
        console.error(xhr.statusText);
    };
    xhr.open("GET", `${obj.url}`, true);
    xhr.send(null)
}
// errXMLHttpRequest({
//     url: 'http://app.winbaoxian.cn/planBook/V2/calculate11'
// })

function errFetch () {
    window.fetch('http://app.winbaoxian.cn/planBook/V2/calculate11').then(function (res){
        console.log(res)
    })
}
// errFetch()


function errPromise () {
    Promise.reject(new Error('unhandledrejection'));
    new Promise(function (resolve, reject) {
         !1 ? resolve() : reject('reject')
    })
}

function errGlobal () {
    console.log(aaa)
}

export {
    errXMLHttpRequest,
    errFetch,
    errPromise,
    errGlobal
}







