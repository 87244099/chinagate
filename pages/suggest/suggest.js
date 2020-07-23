// pages/suggest/suggest.js
const app = getApp();
const Fai = require("../../utils/util");
const config = require("../../utils/config");
import Toast from "../../miniprogram_npm/@vant/weapp/toast/toast";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    setting: {

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.subM
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
  onFieldBlur(event){
    let dataset = event.currentTarget.dataset;
    let field = dataset.field;
    let value = event.detail.value;
    console.log(field, value);
    this.setData({
      [`setting.${field}`]:value
    })
  },
  submitSuggestForm: function(){
    Toast.loading({
      message: "加载中..."
    });
    let setting = this.data.setting;
    Fai.request({
      method:"POST",
      url:"/ajax/apply/applyForm?cmd=applyAdvise",
      data: {
        customerName: setting.customerName,
        customerTel: setting.customerTel,
        email: setting.email,
        leaveMessage: setting.leaveMessage,
      },
      beforeConsume:Toast.clear,
      success:(response)=>{
        let result = response.data;
        if(result.success){
          Toast.success(result.msg);
        }else{
          Toast.fail(result.msg || "网络繁忙、请稍后重试");
        }
      },
      fail: ()=>{
        Toast.fail(result.msg || "网络繁忙、请稍后重试");
      }
    });
  }
})