// pages/indexStaff/indexStaff.js
const Fai = require("../../utils/util");
const config = require("../../utils/config");
const Ajax = require("../../ajax/index");
const app = getApp();
import Toast from "../../miniprogram_npm/@vant/weapp/toast/toast";


Page(Fai.mixin(Fai.commPageConfig, {

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
    options = Ajax.parseQrCodeArg(options);
    console.log("options", options);
    this.setData({
      "setting.companyAID": parseInt(options.companyAID) || 0,
      "setting.companyBID": parseInt(options.companyBID) || 0,
      "setting.staffID": parseInt(options.staffID) || 0,
      "setting.sharedOpenId": options.sharedOpenId,
      "options":JSON.stringify(options),
      "currPath": Fai.getCurrAbsPath()
    });
    this.setData({
      "settingStr": JSON.stringify(this.data.setting)
    });
    // 分享行为会触发onShow，只能放onload了，避免重复统计
    Fai.Waiter.then("onOpenIdLoaded", ()=>{
      Ajax.reportVisit4Share({
        typeID: this.data.setting.companyBID>0 ? 2 : 1,//一级商家、二级商家,
        merchantForLevelAID: this.data.setting.companyAID,
        merchantForLevelBID: this.data.setting.companyBID,
        xcxOpenID: this.data.setting.sharedOpenId
      });
    });


    this.loadIndexCompanyPageData();
  },
  async onCompanyCollect(){
    let isLogin = await Ajax.checkLoginWithRedirect(Fai.getCurrAbsPath(), "onCompanyCollect");
    if(isLogin){
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
    }
    
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
    let currUrl = Fai.getCurrAbsPath();
    let sharedOpenId = app.globalData.openId;
    currUrl = Fai.addPageQuery(currUrl, "sharedOpenId", sharedOpenId);
    
    let reportData = {
      typeID : this.data.setting.companyBID>0 ? 2 : 1,//一级商家、二级商家
      merchantForLevelAID: this.data.setting.companyAID,
      merchantForLevelBID: this.data.setting.companyBID
    };
    Ajax.reportShare(reportData);
    return {
      title: this.data.setting.title,
      path : currUrl,
    }
  },
  loadIndexCompanyPageData: async function(){
    Ajax.requestWithToast(async()=>{

      let response = {};
      let companyAPageData = {};
      let companyBPageData = {};
      let companyPageData = {};
      if(this.data.setting.companyBID >0){
        response = await Ajax.getCompanyBIndexPageData(this.data.setting.companyBID);
        companyPageData = companyBPageData = response.data.data;
      }else{
        response = await Ajax.getCompanyAIndexPageData(this.data.setting.companyAID);
        companyPageData = companyAPageData = response.data.data;
      }

      this.setData({
        "pageData":companyPageData,
        "pageData.companyAInfo": companyAPageData.companyInfo,
        "pageData.companyBInfo": companyBPageData.companyInfo,
        "setting.title":companyPageData.companyInfo.companyName || ''
      });
      
      wx.setNavigationBarTitle({
        title: this.data.setting.title
      });

      this.setData({
        "setting.inited":true
      });
      return Promise.resolve(response);
    }, "加载中...").catch((err)=>{
      this.setData({
        "setting.inited":true
      });
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
  async setProductCollectCancel(){
    let isLogin = await Ajax.checkLoginWithRedirect(Fai.getCurrAbsPath(), "setProductCollectCancel");
    if(isLogin){
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
    
  },
  onShowQrCode(){
    let url = Fai.getCurrAbsPath();
    let urlArr = url.split("?");
    let qr = Ajax.stringifyQrCodeArg(this.data.setting);
    console.log("qr",qr);
    let companyLogoUrl = this.data.config.wwwwStaticDomain + "/" + this.data.pageData.companyInfo.companyLogoUrl;
    Ajax.previewQrCode(urlArr[0], "qr="+qr, companyLogoUrl);
  },
  openArg(){
    this.setData({
      "setting.visibleArg":!this.data.setting.visibleArg
    })
  }
}));
