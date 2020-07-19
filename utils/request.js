// https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html

const config = require("./config");
function noop(){}

function assignOption(option){
  let defaultOption = {
    url: "",
    data: {},
    beforeConsume: noop,
    complete: noop,
    success: noop,
    fail: noop
  };

  let settingOption = Object.assign(defaultOption, option);
  return settingOption;
}

function request(option){
  let settingOption = assignOption(option);
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
    success(){
      settingOption.beforeConsume();
      settingOption.success(...arguments);
    },
    fail(){
      settingOption.beforeConsume();
      settingOption.fail(...arguments);
    },
    complete: settingOption.complete,
  }
  wx.request(requestOption);
}

module.exports = {
  request
}