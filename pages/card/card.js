//index.js
//获取应用实例
const app = getApp();
const Fai = require("../../utils/util");
const Ajax = require("../../ajax/index");
const config = require("../../utils/config");

// pages/card/card.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    setting: {
      shared: false,
      shareMaskVisible: false,
    },
    staticDomain: config.staticDomain
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({
    //   "setting.shareImgUrl": this.data.staticDomain+""
    // });

    Fai.request({
      url: "/ajax/user/userCollection?cmd=getUserCollectInfo",
      data:{
        id:3228
      },
      success:(response)=>{
        console.log("response", response);
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
  onShareMaskClick: function(){
    this.setData({
      "setting.shareMaskVisible":false,
    })
  },
  onWantShare: function(){
    console.log(1111);
    this.setData({
      "setting.shared":true,
      "setting.readonly":true,
      "setting.shareMaskVisible":true,
    })
  },
  onCallPhone: function(){
    wx.makePhoneCall({
      phoneNumber: 'phoneNumber',
    })
  },
  onShowWxAppCode: function(){
    
  },
  onCollect: function(){

  }
})