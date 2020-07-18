//index.js
//获取应用实例
const app = getApp();
const Fai = require("../../utils/util");
const config = require("../../utils/config");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    setting: {
      pageNo: 1,
      pageSize: 10,
      totalSize: null,
      articleList:[]
    },

    staticDomain: config.staticDomain
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadNextArticles();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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