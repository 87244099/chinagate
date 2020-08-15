// pages/indexStaff/indexStaff.js
const Fai = require("../../utils/util");
const Ajax = require("../../ajax/index");
const config = require("../../utils/config");
import Toast from "../../miniprogram_npm/@vant/weapp/toast/toast";

module.exports = {

  /**
   * 页面的初始数据
   */
  data: {
    setting: {
      companyId: -1
    },
    pageData: {},
    config
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
  loadIndexCompanyPageData: async function(){
    this.loadIndexCompanyPageDataByType(1);
  },
  loadIndexCompanyBPageData: async function(){
    this.loadIndexCompanyPageDataByType(2);
  },
  loadIndexCompanyPageDataByType: async function(type){
    Ajax.requestWithToast(async()=>{

      let url = "/ajax/company/company?cmd=getCompanyAIndexPageData&id="+this.data.setting.companyId;
      if(type == 2){
        url = "/ajax/company/company?cmd=getCompanyBIndexPageData&id="+this.data.setting.companyId;
      }

      let response = await Fai.promiseRequest({
        url: url
      });
  
      this.setData({
        "pageData":response.data.data
      });
      
      wx.setNavigationBarTitle({
        title: this.data.pageData.companyInfo.companyName,
      });
      return Promise.resolve(response);
    }, "加载中...");
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
  },
  preivewQrCode(){
    Ajax.preivewQrCode();
  }
};
