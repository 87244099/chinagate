// pages/repairSign/repairSign.js
const Fai = require("../../utils/util");
const Ajax = require("../../ajax/index");
import Toast from "../../miniprogram_npm/@vant/weapp/toast/toast";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    setting:{
      form:{
        customerName: "",
        customerTel:"",
        address: "",
        leaveMessage: ""
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    Ajax.setNormalTitle("repair");
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
    this.setData({
      [`setting.form.${field}`]:value
    })
  },
  onSubmitForm:Fai.delay(function(){
    Ajax.requestWithToast(async()=>{
      let response = await Fai.promiseRequestPost({
        url:"/ajax/apply/applyForm?cmd=applyRepair",
        data:this.data.setting.form
      });

      this.setData({
        "setting.form":{}
      });

      return Promise.resolve(response);
    }, {
      tip4Success: "提交成功"
    }); 
  })
})