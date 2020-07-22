let scene;

//index.js
//获取应用实例
const app = getApp();
const Fai = require("../../utils/util");
const config = require("../../utils/config");
import Toast from "../../miniprogram_npm/@vant/weapp/toast/toast";
Page({
  data: {
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
      pageNo: 1,
      pageSize: 10,
      totalSize: null,
      articleList:[]
    },
    staticDomain: config.staticDomain,
    bannerList: [
      config.staticDomain + "/Content/Images/banner1.jpg",
      config.staticDomain + "/Content/Images/banner2.jpg",
    ],
    globalData: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    this.loadNextArticles();
    
    scene = decodeURIComponent(options.scene)

    Fai.getQrCode("pages/index/index", scene);

    Fai.login();

    (async()=>{
      let globalData = await Fai.getGlobalData();
      console.log("globalData", globalData);
      this.setData({
        globalData: globalData
      })
    })();
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onShow:function(){
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
  callPhone: function(event){
    // let phone = event.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: this.data.globalData.hotline,
    })
  }
})
