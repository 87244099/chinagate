// https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html

const config = require("./config");

function request(option){
  let noop = function(){};
  let defaultOption = {
    url: "",
    data: {},
    complete: noop,
    success: noop,
    fail: noop
  };

  let settingOption = Object.assign(defaultOption, option);

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
    success: settingOption.success,
    fail: settingOption.fail,
    complete: settingOption.complete,
  }
  wx.request(requestOption);
}

module.exports = {
  request
}