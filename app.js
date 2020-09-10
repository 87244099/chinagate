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
        if(openId){
          this.globalData.openId = openId;
          resolve(openId);
        }else{
          let code = await Fai.getLoginCodeNullIsEmpty();
          let response = await Ajax.getOpenIdByCode(code);
          this.globalData.openId = response.data.data.openId;
          Fai.DiskCache.setCache("openId",  this.globalData.openId);
          resolve(this.globalData.openId);
        }

        this.redirectToByHistory();

      })();
    })
  },
  async redirectToByHistory(){
    let sceneList = [1026, 1005, 1006];
    let launchOptions = this.globalData.launchOptions;
    if(sceneList.includes(launchOptions.scene)){
      // 跳转到对应页面
      let response = await Ajax.getLastLocus(this.globalData.openId);
      let data = response.data.data;
      const {
        typeID,
        merchantForLevelAID,
        merchantForLevelBID,
        staffID,
        subID
      } = data;
      let urlMap = {
        "1": "/pages/indexCompany/indexCompany",
        "2": "/pages/indexCompany/indexCompany",
        "3": "/pages/indexStaff/indexStaff",
        "4": "/pages/productDetail/productDetail",
        "5": "/pages/index/index"
      }
      let url = urlMap[typeID];
      if(url){
        url = url + `?companyAID=${merchantForLevelAID}&companyBID=${merchantForLevelBID}&staffID=${staffID}&productID=${subID}`;
        wx.navigateTo({
          url: url,
        });
      }
    }
    
  },
  onShow(options){
    this.globalData.showOptions = options;
  }
});