// pages/buy/buy.js

const app = getApp();
const Fai = require("../../utils/util");
const Ajax = require("../../ajax/index");
const config = require("../../utils/config");
import Toast from "../../miniprogram_npm/@vant/weapp/toast/toast";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    setting:{
      form:{
        customerName:"",
        customerTel:"",
        address:"",
        leaveMessage:"",
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    Ajax.setNormalTitle("buy");
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
  
  onSubmitForm: function(){
    wx.nextTick(()=>{
      Toast.loading({
        message: "加载中..."
      });
      let setting = this.data.setting;
      Fai.request({
        method:"POST",
        url:"/ajax/apply/applyForm?cmd=applyBuy",
        data: {
          customerName: setting.form.customerName,
          customerTel: setting.form.customerTel,
          address: setting.form.address,
          leaveMessage: setting.form.leaveMessage,
        },
        beforeConsume:Toast.clear,
        success:(response)=>{
          let result = response.data;
          if(result.success){
            Toast.success(result.msg);
            this.setData({
              "setting.form":{}
            })
          }else{
            Toast.fail(result.msg || "网络繁忙、请稍后重试");
          }
        },
        fail: ()=>{
          Toast.fail(result.msg || "网络繁忙、请稍后重试");
        }
      });
    })
  },
  onFieldBlur(event){
    let dataset = event.currentTarget.dataset;
    let field = dataset.field;
    let value = event.detail.value;
    this.setData({
      [`setting.form.${field}`]:value
    });
  },
})