// pages/login/login.js
const Ajax = require("../../ajax/index");
const config = require("../../utils/config");
import Toast from "../../miniprogram_npm/@vant/weapp/toast/toast";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageData:{
      wxUserInfo:{}
    },
    config
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    wx.getUserInfo({
      success:(response)=>{
        if(response.errMsg == "getUserInfo:ok"){
          this.setData({
            "pageData.wxUserInfo": response
          })
        }
      }
    });

    Ajax.setNormalTitle("login")
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
  onLogin: async function(){
    wx.redirectTo({
      url: '/pages/personal/personal',
    });
  },
  jump4Personal(){
    wx.navigateTo({
      url: '/pages/personal/personal',
    });
  }
})