// pages/shops/shops.js
const Ajax = require("../../ajax/index");
const Fai = require("../../utils/util");
const config = require("../../utils/config");
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    setting: {
      position:{}
    },
    config:config
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    
    Ajax.setNormalTitle("recentShop");
    this.initPage();
    
  },
  async initPage(){
    
    let response;
    try{
      response = await wx.getSetting();
      if(response.errMsg == "getSetting:ok"){
        let authSetting = response.authSetting;
        if(authSetting["scope.userLocation"] === undefined){//未验证过
          response = await wx.getLocation();
          let latitude = response.latitude;
          let longitude = response.longitude;
          this.setData({
            "setting.position": {
              latitude,
              longitude
            }
          });
          return;
        }else if(authSetting["scope.userLocation"] === false){
          response = await Dialog.confirm({
            // title: '标题',
            message: '请打开地理位置',
            confirmButtonText:"去设置"
          });
          wx.openSetting();
          return;
        }else{
          response = await wx.getLocation();
          let latitude = response.latitude;
          let longitude = response.longitude;
          this.setData({
            "setting.position": {
              latitude,
              longitude
            }
          });
        }
      }
    }catch(errResponse){
      wx.redirectTo({
        url: '/pages/index/index',
      });
    }
    
    Ajax.requestWithToast(async()=>{
      response = await Fai.promiseRequest({
        url:"/ajax/company/company?cmd=getRecentCompanyList",
        data: this.data.setting.position
      });
      this.setData({
        "pageData.companyList": response.data.data.companyList
      });

      return Promise.resolve(response);
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

  }
})