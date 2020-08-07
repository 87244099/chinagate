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
    staticDomain: config.staticDomain
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      "setting.productId": parseInt(options.id) || -1
    });
    this.setData({
      "setting.companyAID": parseInt(options.companyAID) || 0,
      "setting.companyBID": parseInt(options.companyBID) || 0
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

  },
  loadPageData: async function(){
      
    Ajax.requestWithToast(async()=>{
      let response = await Ajax.getMemberInfo();
      let memberInfo = response.data.data;
      response = await Fai.promiseRequest({
        url:"/ajax/product/product?cmd=getProductDetailPageData&productId="+this.data.setting.productId
      });
      let productInfo =  response.data.data.productInfo;

      if(this.data.setting.companyBID>0){
        response = await Ajax.getCompanyBIndexPageData(this.data.setting.companyBID);
      }else{
        response = await Ajax.getCompanyAIndexPageData(this.data.setting.companyAID);
      }
      let companyInfo = response.data.data.companyInfo;

      wx.setNavigationBarTitle({
        title: `${productInfo.title}-${companyInfo.companyName}`,
      });
      let serviceForm = this.data.setting.serviceForm;
      serviceForm.name = memberInfo.memberName;
      serviceForm.phone = memberInfo.memberPhone;
      this.setData({
        "pageData.memberInfo": memberInfo,
        "pageData.companyInfo": companyInfo,
        "pageData.productInfo":productInfo,
        "setting.serviceForm":serviceForm
      });
      

      return Promise.resolve(response);
    }, "加载中...");
  },
  setProductCollect: function(){
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
  },
  onServiceFormSubmit(){
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
    });
  },
  onFieldBlur(event){
    let dataset = event.currentTarget.dataset;
    let field = dataset.field;
    let value = event.detail.value;
    this.setData({
      [`setting.serviceForm.${field}`]:value
    })
  },
  callPhone(){
    wx.makePhoneCall({
      phoneNumber: this.data.pageData.companyInfo.companyPhone,
    });
  }
}));