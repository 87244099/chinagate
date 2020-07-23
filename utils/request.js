// https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html

const config = require("./config");
const CookieUtils = require("./cookie");

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
//断网重试机制
//同一时间只能有6个以内的并发请求，除非处理完了(还未实现)
function request(option){
  option.header = option.header || {};
  let header = option.header;
  if(option.method === "POST" && !header['content-type']){
    header['content-type'] = 'application/x-www-form-urlencoded';
  }

  let settingOption = assignOption(option);

  //将缓存里面的cookie写入请求头
  let cookie = CookieUtils.getRequestCookie(settingOption.header);
  settingOption.header["Cookie"] = cookie;
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
    success: successHandler,
    fail(){
      // 重试机制
      if(retryCount>0){
        retryCount--;
        wx.request(requestOption);
      }else{
        failHandler(...arguments);
      }
      
    },
    complete: settingOption.complete,
  };
  wx.request(requestOption);

  function failHandler(){
    settingOption.beforeConsume();
    settingOption.fail(...arguments);
  }
  function successHandler(response){
    CookieUtils.cacheResponseCookie(response);//把response的cookie写入缓存
    settingOption.beforeConsume();
    settingOption.success(...arguments);
  }

}

module.exports = {
  request
}