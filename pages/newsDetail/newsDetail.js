// pages/newsDetail/newsDetail.js
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
      newsId: -1,
      newsInfo: null
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      "setting.newsId": parseInt(options.id) || -1
    });
    this.loadArticle();
  },
  loadArticle: function(){
    // https://pf.86crk.com/ajax/article/article?cmd=getArticle&id=568
    wx.showLoading({
      title: '加载中...',
    });
    Fai.request({
      url: "/ajax/article/article?cmd=getArticle&id="+this.data.setting.newsId,
      complete(){
        wx.hideLoading({
          complete: (res) => {},
        })
      },
      success: (res)=>{
        let result = res.data;
        if(result.success){
          this.setData({
            "setting.newsInfo":result.data
          });
        }
      }
    })
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
  tapImg(event){

  },
  tapLink(event){
    let url = event.detail;
    console.log("url", url);
  }
})