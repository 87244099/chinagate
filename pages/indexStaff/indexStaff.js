// pages/indexStaff/indexStaff.js
const Fai = require("../../utils/util");
const Ajax = require("../../ajax/index");
const config = require("../../utils/config");
import Toast from "../../miniprogram_npm/@vant/weapp/toast/toast";
Page(Fai.mixin(Fai.commPageConfig, {

  /**
   * 页面的初始数据
   */
  data: {
    setting:{},
    pageData:{
      staffInfo:{},
      companyPageData:{}
    },
    config: config,
    staticDomain:config.staticDomain
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // Ajax.parse 
    options = Ajax.parseQrCodeArg(options);
    this.setData({
      "setting.companyAID": parseInt(options.companyAID) || 0,
      "setting.companyBID": parseInt(options.companyBID) || 0,
      "setting.sharedOpenId": options.sharedOpenId,
      "setting.staffID": parseInt(options.staffID) || -1,
    });
    
    Fai.Waiter.then("onOpenIdLoaded", ()=>{
      Ajax.reportVisit4Share({
        typeID: 3,
        xcxOpenID:this.data.setting.sharedOpenId,
        merchantForLevelAID:this.data.setting.companyAID,
        merchantForLevelBID:this.data.setting.companyBID,
        staffID:this.data.setting.staffID,
      });
    });

    Ajax.requestWithToast(async()=>{
      let response = await Ajax.getInfo4Staff(this.data.setting.staffID);
      let staffInfo = response.data.data;
      if(staffInfo.merchantForLevelBID>0){
        response = await Ajax.getCompanyBIndexPageData(staffInfo.merchantForLevelBID);
      }else{
        response = await Ajax.getCompanyAIndexPageData(staffInfo.merchantForLevelAID);
      }
      let companyPageData = response.data.data;
      this.setData({
        "pageData.companyPageData": companyPageData,
        "pageData.staffInfo":staffInfo,
        "setting.inited": true,
        "setting.title":companyPageData.companyInfo.companyName || '' //标题用公司名称
      });
      wx.setNavigationBarTitle({
        title: this.data.setting.title,
      });

      return Promise.resolve(response);
    }, "加载中...");
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
    let sharedOpenId = getApp().globalData.openId;
    currUrl = Fai.addPageQuery(currUrl, "sharedOpenId", sharedOpenId);
    
    Ajax.reportShare({
      typeID : 3,//员工
      merchantForLevelAID: this.data.setting.companyAID,
      merchantForLevelBID: this.data.setting.companyBID,
      staffID: this.data.setting.staffID
    });

    console.log("this.data.setting.title", this.data.setting.title);
    return {
      title: this.data.setting.title,
      path : currUrl,
    }
  },
  callPhone(){
    wx.makePhoneCall({
      phoneNumber: this.data.pageData.staffInfo.phone,
    })
  },
  callMap(){
    let companyInfo = this.data.pageData.companyPageData.companyInfo;
    let locData = {
      name: companyInfo.companyName,
      latitude:parseInt( companyInfo.position.latitude) || 0,
      longitude: parseInt(companyInfo.position.longitude) || 0,
      scale: 18
    };
    wx.openLocation(locData);
  },
  async setUserCollect4Staff(){
    let isLogin = await Ajax.checkLoginWithRedirect(Fai.getCurrAbsPath(), "setUserCollect4Staff");
    if(isLogin){
      Toast.loading({
        message:"收藏中...",
        duration: 0
      })
      Fai.requestPost({
        url:"/ajax/user/userCollection?cmd=setUserCollect4Staff",
        data:{
          id: this.data.pageData.staffInfo.memberID,
          staffId: this.data.pageData.staffInfo.staffID
        },
        beforeConsume:Toast.clear,
        success: (response)=>{
          let result = response.data;
          if(result.success){
            Toast.success(result.msg);
          }else{
            Toast.fail(result.msg || "网络繁忙,请稍后重试");
          }
        },
        fail(){
          Toast.fail("网络繁忙,请稍后重试");
        }

      })
    }
  },
  onWantShare: function(){
    Toast('点击右上角...进行转发');
  },
  previewQrCode(){
    let url = Fai.getCurrAbsPath();
    let urlArr = url.split("?");
    let qr = Ajax.stringifyQrCodeArg(this.data.setting);
    Ajax.previewQrCode(urlArr[0], "qr="+qr, this.data.pageData.staffInfo.avatarPhoto);
  } 
}));