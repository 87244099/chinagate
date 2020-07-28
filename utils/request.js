// https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html
const config = require("./config");
const CookieUtils = require("./cookie");

//断网重试机制
//同一时间只能有6个以内的并发请求，除非处理完了(还未实现)
function request(option){
  let settingOption = assignOption(option);

  settingOption = trans4Cookie(settingOption);
  settingOption = trans4Post(settingOption);
  settingOption = trans4AutoLogin(settingOption);

  let retryCount =  settingOption.retryCount;
  let requestOption = {
    url: config.domain + settingOption.url,
    data: settingOption.data,
    header: settingOption.header,
    timeout: settingOption.timeout,
    method: settingOption.method,
    dataType: settingOption.dataType,
    responseType: settingOption.responseType,
    enableHttp2: settingOption.enableHttp2,
    enableQuic: settingOption.enableQuic,
    enableCache: settingOption.enableCache,
    success(response){
      CookieUtils.cacheResponseCookie(response);//把response的cookie写入缓存
      settingOption.beforeConsume();
      settingOption.success(response);
    },
    fail(){
      // 重试机制
      if(retryCount>0){
        retryCount--;
        wx.request(requestOption);
      }else{
        settingOption.beforeConsume();
        settingOption.fail(...arguments);
      }
      
    },
    complete: settingOption.complete,
  };

  wx.request(requestOption);
}

function noop(){}
function assignOption(option){
  let defaultOption = {
    url: "",
    data: {},
    header: {},
    beforeConsume: noop,//在响应被消费之前触发
    retryCount: 3,//请求重试机制（断网、服务器错误、超时)
    complete: noop,
    success: noop,
    fail: noop
  };

  defaultOption.retryCount = Math.max(option.retryCount || 0, defaultOption.retryCount);//3-10之间
  let settingOption = Object.assign(defaultOption, option);
  settingOption.retryCount = Math.min(settingOption.retryCount, 10);//3-10之间
  return settingOption;
}

//将缓存里面的cookie写入请求头
function trans4Cookie(option){
    let cookie = CookieUtils.getRequestCookie(option.header);
    option.header["Cookie"] = cookie;
    return option;
}
// 如果写入post方法，在没有指定header的content-type 的情况下，强制转换为'application/x-www-form-urlencoded'
function trans4Post(option){
  option.header = option.header || {};
  let header = option.header;
  if(option.method === "POST" && !header['content-type']){
    header['content-type'] = 'application/x-www-form-urlencoded';
  }
  return option;
}
//如果返回的响应说明未登录，进行跳转处理
function trans4AutoLogin(option){
  let oldSuccess = option.success;
  option.success = function(response){
    let result = response.data;
    if(!result.success){
      if(result.rt === -1){//未登录
        //跳转到登录页
        wx.redirectTo({
          url: '/pages/login/login',
        });
        return;
      }
    }
    oldSuccess(response);
  }
  
  return option;
}

function requestPost(option){
  option = Object.assign({
    method:"POST"
  }, option);
  return request(option);
}

module.exports = {
  request,
  requestPost
}