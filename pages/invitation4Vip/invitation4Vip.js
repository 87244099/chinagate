// pages/login/login.js
const Ajax = require("../../ajax/index");
const Fai = require("../../utils/util");
const config = require("../../utils/config");
import Toast from "../../miniprogram_npm/@vant/weapp/toast/toast";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageData:{
      wxUserInfo:{},
    },
    config,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      "setting.vipCustomerInvitationID":parseInt(options.vipCustomerInvitationID || 0)
    });
    this.setCode();
    Ajax.requestWithToast(this.loadPageData, {
      message: "加载中..."
    });
  },
  async setCode(){
    let code = await Fai.getLoginCodeNullIsEmpty();
    this.setData({
      "setting.code": code
    })
  },
  async loadPageData(){
    let response = await Ajax.getMemberInfo();
    this.setData({
      "setting.memberInfo": response.data.data
    });

    return Promise.resolve(response);
  }  ,
  

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
  //如果手机号为空，则连同手机号一并获取
  oninvitation4Vip(event){
    let detail = event.detail;
    if(detail.errMsg == "getPhoneNumber:ok"){
      Ajax.requestWithToast(async()=>{
        let data = Object.assign({
          code: this.data.setting.code
        }, detail);
        let response = await Ajax.parseWxPhone(data);
        let memberPhone = response.data.data.phoneNumber;

        response = await Ajax.memberUpToStaff(this.data.setting.staffID, memberPhone);
        this.setCode();
        return Promise.resolve(response);
      }, {
        tip4Success:true
      }).catch(()=>{
        this.setCode();
      });
    }
    
  },
  oninvitation4Vip: async function(){
    Ajax.requestWithToast(async()=>{
      let response = Ajax.memberUpToVip(this.data.setting.vipCustomerInvitationID, this.data.setting.memberInfo.memberPhone);

      return Promise.resolve(response);
    }, {
      tip4Success:true
    });
  },
  
})