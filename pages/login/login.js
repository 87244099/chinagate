
const Ajax = require("../../ajax/index");
const Fai = require("../../utils/util");
const config = require("../../utils/config");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    setting: {
      backUrl: "",
      methodName: ""
    },
    pageData:{
      wxUserInfo:{}
    },
    config
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    this.setData({
      "setting.backUrl": option.backUrl ? decodeURIComponent(option.backUrl) : "",
      "setting.methodName": option.methodName ? decodeURIComponent(option.methodName) : ""
    });
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
  jump4Personal(){
    if(this.data.setting.backUrl){
      let prevPage = Fai.getPrevPage();
      wx.navigateTo({
        url: this.data.setting.backUrl,
      });

      if(prevPage && Fai.isFunction(prevPage[this.data.setting.methodName])){
        prevPage[this.data.setting.methodName]();
      }
      
    }else{
      wx.navigateTo({
        url: '/pages/personal/personal',
      });
    }
   
  }
})