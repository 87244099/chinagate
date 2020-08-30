require('./utils/tracker.min.js')({token:"62c7da9e983ca1c8ed6caaedee273bc0",behaviour:15,trustVendor:true,ignoreVendor:true});
const Ajax = require('./ajax/index');
const Fai = require('./utils/util');

App({
  globalData: {
    isLogin: false//标记当前是否已经登录过
  },
  onLaunch: async function (options) {//微信小程序没有同步请求，只能用异步获取openid
    this.globalData.launchOptions = options;
    Fai.Waiter.wait("onOpenIdLoaded", (resolve)=>{
      (async()=>{
        let code = await Fai.getLoginCodeNullIsEmpty();
        let response = await Ajax.getOpenIdByCode(code);
        this.globalData.openId = response.data.data.openId;
        resolve(this.globalData.openId);
      })();
    })
  },
  onShow(options){
    this.globalData.showOptions = options;
  }
});