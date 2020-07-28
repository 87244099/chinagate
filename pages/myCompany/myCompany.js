// pages/indexStaff/indexStaff.js
const app = getApp();
const Fai = require("../../utils/util");
const Ajax = require("../../ajax/index");
const config = require("../../utils/config");
import Toast from "../../miniprogram_npm/@vant/weapp/toast/toast";

Page(Fai.mixin(Fai.commPageConfig, {

  /**
   * 页面的初始数据
   */
  data: {
    setting: {
      companyId: -1,
      memberInfo:{}
    },
    pageData: {},
    staticDomain: config.staticDomain
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadMyCompanyPageData();
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
  loadMyCompanyPageData: async function(){


    Ajax.loadWithToast(async()=>{
      let response = await Ajax.getMemberInfo();
      let memberInfo = response.data.data;
      //如果拿不到，说明自己不是企业的员工
      response = await Ajax.getCompanyAIndexPageData(memberInfo.merchantForLevelAID);
      this.setData({
        "pageData":response.data.data,
        "setting.companyId": memberInfo.merchantForLevelAID,
        "setting.memberInfo": memberInfo
      });

      return Promise.resolve(response);
    });

    


  
  },
  callPhone(event){
    let phone = event.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
  callMap(){
    let companyInfo = this.data.pageData.companyInfo;
    let locData = {
      name: companyInfo.companyName,
      latitude:parseInt( companyInfo.position.latitude) || 0,
      longitude: parseInt(companyInfo.position.longitude) || 0,
      scale: 18
    };
    wx.openLocation(locData);
  },
  setProductCollectCancel:()=>{
    Toast.loading({
      message: "加载中...",
      duration: 0
    });
    Fai.request({
      url: "/ajax/company/company?cmd=getCompanyBIndexPageData&id=1",
      beforeConsume:Toast.clear,
      success:(response)=>{
        let result = response.data;
        if(result.success){
          this.setData({
            "pageData":result.data
          });
        }else{
          Toast.fail(result.msg || '网络繁忙，请稍后重试');
        }
      },
      fail:()=>{
        Toast.fail('网络繁忙，请稍后重试');
      }
    });
  }
}));