// require('./utils/tracker.min.js')({token:"62c7da9e983ca1c8ed6caaedee273bc0",behaviour:15,trustVendor:true,ignoreVendor:true});

const Ajax = require('./ajax/index');

App({
  globalData: {
    isLogin: false//标记当前是否已经登录过
  },
  onLaunch: function (options) {
    this.globalData.launchOptions = options;
    Ajax.checkUserExist();
    
  }
});