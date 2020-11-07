require('./utils/tracker.min.js')({token:"62c7da9e983ca1c8ed6caaedee273bc0",behaviour:15,trustVendor:true,ignoreVendor:true});
const Ajax = require('./ajax/index');
const Fai = require('./utils/util');

App({
  globalData: {
    isLogin: false//标记当前是否已经登录过
  },
  onLaunch: async function (options) {//微信小程序没有同步请求，只能用异步获取openid
    this.globalData.launchOptions = options;
    let openId = Fai.DiskCache.getCache("openId");
    
    Fai.Waiter.wait("onOpenIdLoaded", (resolve)=>{
      (async()=>{
        let data = await Ajax.getGlobalData();
        this.globalData = Object.assign(this.globalData, data) ;
        if(openId){
          this.globalData.openId = openId;
          try{await Ajax.loginByOpenId(openId);}catch(e){console.log("loginByOpenId err", e);}
          resolve(openId);
        }else{
          let code = await Fai.getLoginCodeNullIsEmpty();
          let response = await Ajax.getOpenIdByCode(code);
          this.globalData.openId = response.data.data.openId;
          Fai.DiskCache.setCache("openId",  this.globalData.openId);
          try{await Ajax.loginByOpenId(this.globalData.openId);}catch(e){console.log("loginByOpenId err", e);}
          resolve(this.globalData.openId);
        }
        
        this.redirectToByHistory();
        
        
      })();
    })
  },
  redirectToByHistory(){
    Fai.Waiter.wait("onRedirectToByHistory", async(resolve)=>{
      let urlInfo = await Ajax.getRecentVisitUrlInfo4Scene(this);
      return resolve(urlInfo.url);
    });
    
    
  },
  onShow(options){
    this.globalData.showOptions = options;
  }
});