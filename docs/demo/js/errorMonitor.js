let errorLogs = {
    projectName: "",  //String。必填，项目名称_页面名称
    errorType: "",  //String。异常类型
    currentUrl: window.location.href,
    currentTime: new Date().getTime(),
    userAgent: window.navigator.userAgent,
    errors: {}, //异常日记
    // userId: "",  //用户id，服务端提供
}


/**
 * 函数：封装XMLHttpRequest和fetch对象，获取、上传异常信息。
 */
function captureRequestError (reportLog) {
    // 覆写XMLHttpRequest API
    if(window.XMLHttpRequest) {
        var xmlhttp = window.XMLHttpRequest;
        var _oldSend = xmlhttp.prototype.send;
        var _handleEvent = function (event) {
            if (event && event.toString() === "[object ProgressEvent]" && event.currentTarget && event.currentTarget.status !== 200) {
                if (event.currentTarget.responseURL) {
                    reportLog({
                        errorType: 'xhrError',
                        errors: {
                            eventType: `xhrListener_${event.type}`,
                            url: event.currentTarget.responseURL,
                            status: event.currentTarget.status,
                            statusText: event.currentTarget.statusText
                        }
                    })
                }
            }
        }
        xmlhttp.prototype.send = function () {
            if (this['addEventListener']) {
                this['addEventListener']('error', _handleEvent);
                this['addEventListener']('load', _handleEvent);
                this['addEventListener']('abort', _handleEvent);
                this['addEventListener']('close', _handleEvent);
            } else {
                var _oldStateChange = this['onreadystatechange'];
                this['onreadystatechange'] = function (event) {
                    if (this.readyState === 4) {
                        _handleEvent(event);
                    }
                    _oldStateChange && _oldStateChange.apply(this, arguments);
                };
            }
            return _oldSend.apply(this, arguments);
        }
    }

    //覆写fetch API
    if (window.fetch) {
        var _oldFetch = window.fetch;
        window.fetch = function() {
            return _oldFetch.apply(this, arguments).then(function(res){
                if (!res.ok) {
                    reportLog({
                        errorType: 'fetchError',
                        errors: {
                            status: res.status,
                            statusText: res.statusText,
                            type: res.type,
                            url: res.url
                        }
                    })
                }
                return res;
            }).catch(function(error){
                reportLog({
                    errorType: 'fetchError',
                    errors: {
                        type: error && error.stack.split(':')[0],
                        message: error.message,
                        stack: error.stack
                    }
                })
            });
        }
    }
}


let defConfig = {
    captureRequestErr: true,
    ignoreErrors: ['window.unload is not a function', 'WebViewJavascriptBridge', 'androidHandler is not defined'],
    url: `${location.hostname.search(/winbaoxian\.com/) !== -1 ? 'https://app.winbaoxian.com': '//app.winbaoxian.cn'}/planBook/common/saveFrontError`, //上传异常报告的接口地址
}
let errorMonitor = {
    /**初始化，捕获前端异常信息
    * @param  {[obj]} config
       - projectName: "", //必填，项目名称_页面名称
       - captureRequestErr: true,  //可选，默认为true。捕获XMLHttpRequest和fetch异常
       - ignoreErrors: undefined，//可选。默认undefined，过滤默认异常信息； 传数组，过滤数组中的异常信息 + 默认异常信息； 传其他值，如false、空字符，不过滤异常信息；
       - url: 'https://app.winbaoxian.com/planBook/common/saveFrontError',  //可选，上传异常信息的接口(POST)
    * @return {[type]}        [description]
    */
    init (config) {
        let self = this
        errorLogs.projectName = config.projectName
        if (config.ignoreErrors !== undefined) {
            config.ignoreErrors = config.ignoreErrors && config.ignoreErrors.constructor === Array ? defConfig.ignoreErrors.concat(config.ignoreErrors) : []
        }
        defConfig = {
            ...defConfig,
            ...config
        }

        defConfig.captureRequestErr && captureRequestError(self.reportLog)

        //当JavaScript运行时异常（包括语法异常）发生时，window会触发一个ErrorEvent接口的事件，并执行window.onerror();
        window.onerror = function (msg, url, lineNo, columnNo, error) {
            self.reportLog({
                errorType: 'onError',
                errors: {
                    url,
                    lineNo,
                    columnNo,
                    type: error && error.stack.split(':')[0],
                    message: error.message,
                    stack: error.stack
                }
            })
            console.log('window.onerror')
            return true
        }

        //静态资源加载异常监控
        window.addEventListener('error', function (event) {
            if (event.toString() === "[object Event]") {
                self.reportLog({
                    errorType: 'eventListenerError',
                    errors: {
                        type: event.type,
                        filename: event.srcElement.href || event.srcElement.src,
                    }
                })
                console.log('addEventListener error:' + event.target)
            }
            return true
        }, true);

        //捕获promise异常
        window.addEventListener("unhandledrejection", function(e, a){
            // promise后有then或catch方法，表示已对promise的异常做处理。该事件不会捕获
            // @prop {Promise} promise - 状态为rejected的Promise实例
            // @prop {String|Object} reason - 异常信息或rejected的内容
            // 会阻止异常继续抛出，不让Uncaught(in promise) Error产生
            if (e.reason) {
                self.reportLog({
                    errorType: e.type,
                    errors: {
                        type: e.reason.stack && e.reason.stack.split(':')[0],
                        message: (e.reason.message) || e.reason,
                        stack: e.reason.stack
                    }
                })
                e.preventDefault()
                console.log('unhandledrejection')
            }
        })
    },

    /**
     * 上传异常信息
     * @param  {[obj]} config
        - projectName: "", //项目名称。会合到errorLogs中
        - errorType: "",   //异常类型
        - url: 'https://app.winbaoxian.com/planBook/common/saveFrontError',  //上传异常报告的接口地址
        - errors: {}, //异常信息，可以为对象，也可以为字符串
     * @return {[type]}        [description]
     */
    reportLog (config) {
        if (config) {
            //处理收集的信息
            if (config.projectName) {
                errorLogs.projectName = config.projectName
            }
            if (config.errorType) {
                errorLogs.errorType = config.errorType
            }
            if (config.errors) {
                if (config.errors.constructor === String) {
                    errorLogs.errors = {
                        message: config.errors,
                        time: new Date().getTime()
                    }
                } else {
                    errorLogs.errors = {
                        time: new Date().getTime(),
                        ...config.errors
                    }
                }
            }

            //上传收集的信息
            if (Object.keys(errorLogs.errors).length && (!errorLogs.errors.message || defConfig.ignoreErrors.indexOf(errorLogs.errors.message) === -1)) {
                var xhr = new XMLHttpRequest();
                xhr.withCredentials = true;
                xhr.onreadystatechange = function(){
                    // 通信成功时，状态值为4
                    if (xhr.readyState === 4){
                        if (xhr.status === 200){
                            console.log(xhr.responseText);
                        } else {
                            console.error(`上传信息接口${xhr.status}异常：${xhr.statusText}`);
                        }
                    }
                };
                xhr.onerror = function (e) {
                    console.error(xhr.statusText);
                };
                xhr.open('POST', `${config.url || defConfig.url}`, true);

                xhr.setRequestHeader('Content-type', 'application/json')
                xhr.send(JSON.stringify({
                    ...errorLogs,
                    errors: encodeURIComponent(JSON.stringify(errorLogs.errors))
                }))
            }
        }

    }
};


(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        window.errorMonitor = factory();
  }
}(this, function () {

    // Just return a value to define the module export.
    // This example returns an object, but the module
    // can return a function as the exported value.
    return errorMonitor;
}));









