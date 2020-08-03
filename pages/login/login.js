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
    Toast.loading("登陆中..")
    try{
      let response = await Ajax.login();
      Toast.success(response.data.msg);

      setTimeout(()=>{
        console.log(1111);
        wx.redirectTo({
          url: '/pages/personal/personal',
        });
      }, 1500);

    }catch(response){
      if(response){
        let result = response.data;
        if(result.rt === 1){//不存在
          setTimeout(()=>{
            wx.redirectTo({
              url: '/pages/reg/reg',
            });
          }, 1500);
        }
        Toast.fail(response.data.msg);
      }else{
        Toast.fail("网络繁忙,请稍后重试");
      }
    }
    
    // 先进行登录尝试,如果已经登陆过则不需要
    // if(!getApp().globalData.isLogin){
      // getApp().globalData.isLogin=true;
    // }
  },
  
})