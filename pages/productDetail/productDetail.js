// pages/productDetail/productDetail.js
//获取应用实例
// const app = getApp();
const Fai = require("../../utils/util");
const Ajax = require("../../ajax/index");
const config = require("../../utils/config");
// import Toast from "../../miniprogram_npm/@vant/weapp/toast/toast";
Page(Fai.mixin({

  /**
   * 页面的初始数据
   */
  data: {
    setting: {
      productId: -1,
      companyAID: -1,
      companyBID: -1,
      serviceForm:{
        name:"",
        phone:"",
        content:"",
        companyAID:-1,
        companyBID:-1,
        staffID:-1
      }
    },
    pageData: {},
    config:config,
    staticDomain: config.staticDomain
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    options = Ajax.parseQrCodeArg(options);
    this.setData({
      "setting.productId": parseInt(options.id) || 0,
      "setting.companyAID": parseInt(options.companyAID) || 0,
      "setting.companyBID": parseInt(options.companyBID) || 0,
      "setting.sharedOpenId": options.sharedOpenId,
      "setting.staffID": parseInt(options.staffID) || 0
    });

    
    Fai.Waiter.then("onOpenIdLoaded", ()=>{
      Ajax.reportVisit4Share({
        typeID: 4,//一级商家、二级商家,
        merchantForLevelAID: this.data.setting.companyAID,
        merchantForLevelBID: this.data.setting.companyBID,
        xcxOpenID: this.data.setting.sharedOpenId,
        subID: this.data.setting.productId
      });
    });
    this.loadPageData();
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
    console.log(11111111);
    let currUrl = Fai.getCurrAbsPath();
    let sharedOpenId = getApp().globalData.openId;
    currUrl = Fai.addPageQuery(currUrl, "sharedOpenId", sharedOpenId);
    
    let reportData = {
      typeID : 4,//产品详情
      merchantForLevelAID: this.data.setting.companyAID,
      merchantForLevelBID: this.data.setting.companyBID,
      subID: this.data.setting.productId
    };
    Ajax.reportShare(reportData);
    return {
      title: this.data.setting.title,
      path : currUrl,
    }
  },
  loadPageData: async function(){
      
    Ajax.requestWithToast(async()=>{
      
      let response = await Fai.promiseRequest({
        url:"/ajax/product/product?cmd=getProductDetailPageData&productId="+this.data.setting.productId
      });
      let productInfo =  response.data.data.productInfo;

      if(this.data.setting.companyBID>0){
        response = await Ajax.getCompanyBIndexPageData(this.data.setting.companyBID);
      }else{
        response = await Ajax.getCompanyAIndexPageData(this.data.setting.companyAID);
      }
      let companyInfo = response.data.data.companyInfo;

      let staffInfo = {};
      if(this.data.setting.staffID > 0){
        response = await Ajax.getInfo4Staff(this.data.setting.staffID);
        staffInfo = response.data.data;
      }
      this.setData({
        "setting.title":`${productInfo.title}-${companyInfo.companyName}`
      });

      wx.setNavigationBarTitle({
        title: this.data.setting.title,
      });

      let serviceForm = this.data.setting.serviceForm;
      response = await Ajax.checkLogin();
      if(response.data.data.isLogin){
        response = await Ajax.getMemberInfo();
        let memberInfo = response.data.data;
        serviceForm.name = memberInfo.memberName;
        serviceForm.phone = memberInfo.memberPhone;
        this.setData({
          "pageData.memberInfo": memberInfo,
        });
      }else{
        let memberInfo = {
          memberName:"",
          memberPhone: "",
          staffID: 0
        };
        this.setData({
          "pageData.memberInfo": memberInfo,
        });
      }
      
      this.setData({
        "pageData.companyInfo": companyInfo,
        "pageData.productInfo":productInfo,
        "pageData.staffInfo": staffInfo,
        "setting.serviceForm":serviceForm,
        "setting.inited": true
      });
      

      return Promise.resolve(response);
    }, "加载中...");
  },
  async setProductCollect(){
    let isLogin = await Ajax.checkLoginWithRedirect(Fai.getCurrAbsPath(), "setProductCollect");
    if(isLogin){
      Ajax.requestWithToast(async()=>{
        return await Fai.promiseRequestPost({
          url:"/ajax/product/productCollection?cmd=setProductCollect",
          data:{
            productId: this.data.setting.productId,
            merchantForLevelAID: this.data.setting.companyAID,
            merchantForLevelBID: this.data.setting.companyBID,
            staffId: this.data.pageData.memberInfo.staffID
          }
        });
      }, {
        tip4Success:true
      });
    }
    
  },
  onServiceFormSubmit: Fai.delay(function(){
    let data = this.data.setting.serviceForm;
    data.merchantForLevelAID = this.data.setting.companyAID;
    data.merchantForLevelBID = this.data.setting.companyBID
    data.staffID = this.data.pageData.memberInfo.staffID;
    Ajax.requestWithToast(async()=>{
      let response = await Fai.promiseRequestPost({
        url:"/ajax/apply/applyForm?cmd=applyService",
        data: data,
      })

      this.setData({
        "setting.serviceForm": {}
      });

      return Promise.resolve(response);
    }, {
      tip4Success:true
    });
  }),
  onFieldBlur(event){
    let dataset = event.currentTarget.dataset;
    let field = dataset.field;
    let value = event.detail.value;
    this.setData({
      [`setting.serviceForm.${field}`]:value
    })
  },
  callPhone(){
    if(this.data.setting.staffID>0){
      wx.makePhoneCall({
        phoneNumber: this.data.pageData.staffInfo.phone
      });
    }else{
      wx.makePhoneCall({
        phoneNumber: this.data.pageData.companyInfo.companyPhone,
      });
    }
    
  },
}));