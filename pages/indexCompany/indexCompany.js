// pages/indexStaff/indexStaff.js
const Fai = require("../../utils/util");
const config = require("../../utils/config");
const Ajax = require("../../ajax/index");
import Toast from "../../miniprogram_npm/@vant/weapp/toast/toast";


Page(Fai.mixin({

  /**
   * 页面的初始数据
   */
  data: {
    setting: {
      companyAID: 0,//一级商家
      companyBID: 0,//二级商家
      staffID: 0,//员工
    },
    pageData: {},
    config: config
  },

  onLoad(options){
    options = Object.assign(options, Fai.parseSharedOption(options));

    this.setData({
      "setting.companyAID": parseInt(options.companyAID) || 0,
      "setting.companyBID": parseInt(options.companyBID) || 0,
      "setting.staffID": parseInt(options.staffID) || 0
    })
    this.loadIndexCompanyPageData();
  },
  
  onCompanyCollect(){
    Ajax.requestWithToast(async()=>{
      let response = Fai.promiseRequestPost({
        url:"/ajax/company/companyCollect?cmd=setCompanyCollect",
        data:{
          merchantForLevelAID: this.data.setting.companyAID,
          merchantForLevelBID: this.data.setting.companyBID
        }
      });
      return Promise.resolve(response);
    },{
      tip4Success:true
    });
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
    Ajax.requestWithToast(async()=>{

      let response = {};
      if(this.data.setting.companyBID >0){
        response = await Ajax.getCompanyBIndexPageData(this.data.setting.companyBID);
      }else{
        response = await Ajax.getCompanyAIndexPageData(this.data.setting.companyAID);
      }
      

      this.setData({
        "pageData":response.data.data
      });
      wx.setNavigationBarTitle({
        title: this.data.pageData.companyInfo.companyName,
      });
      return Promise.resolve(response);
    }, "加载中...").catch((err)=>{
      console.log(err);
    });
  },
  loadIndexCompanyBPageData: async function(){
  },
  loadIndexCompanyPageDataByType: async function(type){
    
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
  onShowQrCode(){
    let url = Fai.getCurrAbsPath();
    let urlArr = url.split("?");
    Ajax.previewQrCode(urlArr[0], urlArr[1], this.data.config.wwwwStaticDomain + "/" + this.data.pageData.companyInfo.companyLogoUrl);
  }
}));
