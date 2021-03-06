// pages/productDetail/productDetail.js
//获取应用实例
// const app = getApp();
const Fai = require("../../utils/util");
const Ajax = require("../../ajax/index");
const config = require("../../utils/config");
// import Toast from "../../miniprogram_npm/@vant/weapp/toast/toast";
Page(Fai.mixin(Fai.commPageConfig, {

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
      },
      bannerHeight: 316
    },
    pageData: {},
    config:config,
    staticDomain: config.staticDomain
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    this.startTime = new Date().getTime();
    options = Ajax.parseQrCodeArg(options);
    this.setData({
      "setting.productId": parseInt(options.id) || 0,
      "setting.companyAID": parseInt(options.companyAID) || 0,
      "setting.companyBID": parseInt(options.companyBID) || 0,
      "setting.sharedOpenId": options.sharedOpenId,
      "setting.staffID": parseInt(options.staffID) || 0,
      "setting.globalData": getApp().globalData
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
    this.setData({
      "globalData": getApp().globalData
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
    if(this.belongMember(this.data.pageData.memberInfo, this.data.setting)){
      currUrl = Fai.addPageQuery(currUrl, "staffID", this.data.pageData.memberInfo.staffID);
      console.log("员工分享");
    }else{
      console.log("普通人分享");
    }
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
  belongMember(memberInfo, setting){
    return memberInfo.merchantForLevelAID == setting.companyAID 
    && memberInfo.merchantForLevelBID == setting.companyBID;
  },
  loadPageData: async function(){

    Ajax.requestWithToast(async()=>{
      
      let response = await Ajax.getProductDetailPageData({
        id: this.data.setting.productId,
        companyAID: this.data.setting.companyAID,
        companyBID: this.data.setting.companyBID,
        staffID: this.data.setting.staffID
      });
      let productInfo =  response.data.data.productInfo;
      let companyInfo = {};
      if(this.data.setting.companyBID>0){
        response = await Ajax.getInfo4CompanyB(this.data.setting.companyBID);
        companyInfo = response.data.data;
      }else{
        response = await Ajax.getInfo4CompanyA(this.data.setting.companyAID);
        companyInfo = response.data.data;
      }

      this.setData({
        "pageData.companyInfo": companyInfo,
        "setting.inited": true
      });
      
      let carouselList = response.data.data.carouselList|| [];
      response = await Ajax.belongVip(this.data.setting.companyAID);
      let isVip = response.data.data.isVip;
      let staffInfo = {};
      if(this.data.setting.staffID > 0){
        response = await Ajax.getInfo4Staff(this.data.setting.staffID);
        staffInfo = response.data.data;
      }
      this.setData({
        "pageData.isVip": isVip,
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
        serviceForm.phone = '';
        // serviceForm.phone = memberInfo.memberPhone;
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
      
      // this.data.setting.bannerHeight =
      let firstBanner = this.data.staticDomain+"/"+productInfo.productBannerList[0];
      let imgInfo = await Fai.getImageInfo(firstBanner);
      let {width, height} = imgInfo;
      this.data.setting.bannerHeight = width/750*height;
      console.log("firstBanner",  firstBanner); 
      console.log(imgInfo);
      console.log("bannerHeight",  this.data.setting.bannerHeight); 
      
      this.setData({
        "pageData.carouselList" : carouselList,
        "pageData.productInfo":productInfo,
        "pageData.staffInfo": staffInfo,
        "setting.serviceForm":serviceForm,
        "setting.bannerHeight": this.data.setting.bannerHeight,
      });
      
      console.log("productDetail time", (new Date().getTime() - this.startTime));

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
    data.productID = this.data.setting.productId;//有大小写的区别
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