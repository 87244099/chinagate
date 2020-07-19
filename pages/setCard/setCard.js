// pages/setCard/setCard.js
const app = getApp();
const Fai = require("../../utils/util");
const config = require("../../utils/config");
import Toast from "../../miniprogram_npm/@vant/weapp/toast/toast";
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadProvince();
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
  
  submitForm() {
    this.selectComponent('#form').validate((valid, errors) => {
        console.log('valid', valid, errors)
        if (!valid) {
            const firstError = Object.keys(errors)
            if (firstError.length) {
                this.setData({
                    error: errors[firstError[0]].message
                })

            }
        } else {
            wx.showToast({
                title: '校验通过'
            })
        }
    })
  },
  reback(){
    wx.navigateBack({
      complete: (res) => {},
    })
  },
  loadProvince: function(){
    Toast.loading({
      message:"加载中...",
      duration: 0
    });
    Fai.request({
      url: "/ajax/Common/GetCommData?cmd=getProvinceList",
      beforeComsume:Toast.clear,
      success:(res)=>{
        let result = res.data;
        if(result.success){
          console.log("result", result);
        }else{
          Toast.fail(result.msg || "网络繁忙，请稍后重试")
        }
      },
      fail:()=>{
        Toast.fail("网络繁忙，请稍后重试");
      }
    })
  },
})