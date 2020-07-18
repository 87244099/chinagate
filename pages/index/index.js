//index.js
//获取应用实例
const app = getApp();
const Fai = require("../../utils/util");
const config = require("../../utils/config");

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
    ]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.loadNextArticles();
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

    wx.showLoading({
      title: '加载中...',
    });
    Fai.request({
      url: "/ajax/article/article?cmd=getArticleList&pageNo=1&pageSize=10",
      data: {
        pageNo: this.data.setting.pageNo,
        pageSize: 10
      },
      complete:()=>{
        wx.hideLoading()
      },
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
          
        }
      }
    })
  },
  onReachBottom: function(){
    this.loadNextArticles();
  }
})
