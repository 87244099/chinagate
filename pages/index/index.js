//index.js
//获取应用实例
const app = getApp();
const Fai = require("../../utils/util");
const Ajax = require("../../ajax/index");
const config = require("../../utils/config");
import Toast from "../../miniprogram_npm/@vant/weapp/toast/toast";

let TmpPageData = {
  visitedCount: 0
};
Page(Fai.mixin(Fai.commPageConfig, {
  data: {
    setting:{
      "inited": false
    },
    list: [{
      "text": "对话",
      "iconPath": "../../images/tabbar_icon_chat_default.png",
      "selectedIconPath": "../../images/tabbar_icon_chat_active.png",
      dot: true
    },
    {
      "text": "设置",
      "iconPath": "../../images/tabbar_icon_setting_default.png",
      "selectedIconPath": "../../images/tabbar_icon_setting_active.png",
      badge: 'New'
    }],
    setting: {
      publicAcctVisible: false,
      pageNo: 1,
      pageSize: 10,
      totalSize: null,
      articleList:[],
      shareMaskVisible: false
    },
    staticDomain: config.staticDomain,
    bannerList: [
      config.wwwwStaticDomain + "/Content/Images/banner1.jpg",
      config.wwwwStaticDomain + "/Content/Images/banner2.jpg",
    ],
    globalData: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    Toast.loading({
      message:"加载中...",
      duration:0
    });
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onShow:function(){
    this.loadWithRedir4History();
  },
  //重定向到历史页面
  loadWithRedir4History(){
    Toast.loading({
      message:"加载中...",
      duration:0
    });
    TmpPageData.visitedCount++;
    //判断能否重定向
    Fai.Waiter.then("onRedirectToByHistory", (url)=>{
      if(url && TmpPageData.visitedCount<2){
        wx.navigateTo({
          url: url,
        });
        Toast.clear();
      }else{
        
        Fai.Waiter.then("onOpenIdLoaded", async(openId)=>{
          try{
            // await Ajax.autoEmpowerLogin(this.data.setting);//强制授权登录
            let globalData = await Ajax.getGlobalData();
            this.setData({
              globalData: globalData,
              bannerList: globalData.carouselList,
              "setting.inited": true,
              "setting.isPublicAcctVisible": [1047, 1124, 1089, 1038].includes(app.globalData.launchOptions.scene),
            });
            this.loadNextArticles();
            Ajax.setNormalTitle("platformIndex");
            Ajax.reportTrace({
              typeID:5,
              openId
            });
          }catch(e){
            Toast.clear();
          }
        });
      }
    });
  },
  loadNextArticles: function(){
    if(this.data.setting.articleList.length>=this.data.setting.totalSize && this.data.setting.totalSize!==null){
      return;
    }

    Toast.loading({
      message: '加载中...',
      duration:0,
    });
    Fai.request({
      url: "/ajax/article/article?cmd=getArticleList&pageNo=1&pageSize=10",
      data: {
        pageNo: this.data.setting.pageNo,
        pageSize: 10
      },
      beforeConsume:Toast.clear,
      success: (res)=>{
        let result = res.data;
        if(result.success){
          this.data.setting.articleList.push(...result.data.articleList)
          this.setData({
            "setting.articleList": this.data.setting.articleList,
            "setting.pageNo": this.data.setting.pageNo+1,
            "setting.totalSize": result.data.totalSize
          });
        }else{
          Toast.fail(result.msg || '网络繁忙，请稍后重试');
        }
      },
      fail:()=>{
        Toast.fail('网络繁忙，请稍后重试');
      }
    })
  },
  onReachBottom: function(){
    this.loadNextArticles();
  },
  callPhone: function(){
    // let phone = event.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: this.data.globalData.hotline,
    })
  },
  onJumpToCompany(){
    Toast.loading({
      message: "跳转中",
      duration: 0
    });
  },
  async onJumpToMyCompany(){
    
  },
  async jump4MyCompany(){//能走到这说明是注册过的。
    let response = await Ajax.getMemberInfo();
    let memberInfo = response.data.data;
    if(memberInfo.staffID==0){
      wx.navigateTo({
        "url": "/pages/createCompany/createCompany"
      });
    }else{
      wx.navigateTo({
        "url": "/pages/myCompany/myCompany"
      });
    }
      

  },
  onShareAppMessage: function () {
    return {
      path: "/pages/index/index",
      title: this.data.globalData.titleData.platformIndex
    }
  },
  callShareMask(){
    this.setData({
      "setting.shareMaskVisible": true
    })
  },
  onShareMaskClick(){
    this.setData({
      "setting.shareMaskVisible": false
    })
  },
  noticePublicAcct(){
    this.setData({
      "setting.publicAcctVisible": !this.data.setting.publicAcctVisible
    })
  }
}));


