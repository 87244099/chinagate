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
        merchantForLevelAID:-1,
        merchantForLevelBID:-1,
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
      "setting.merchantForLevelAID": parseInt(options.companyId) || -1
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

      response = await Ajax.getCompanyAIndexPageData(this.data.setting.merchantForLevelAID);
      let companyInfo = response.data.data.companyInfo;

      wx.setNavigationBarTitle({
        title: `${productInfo.title}-${companyInfo.companyName}`,
      });

      this.setData({
        "pageData.memberInfo": memberInfo,
        "pageData.companyInfo": companyInfo,
        "pageData.productInfo":productInfo
      });

      return Promise.resolve(response);
    }, "加载中...");
  },
  setProductCollect: function(){
    Ajax.requestWithToast(async()=>{
      return await Fai.promiseRequest({
        url:"/ajax/product/productCollection?cmd=setProductCollect",
        method:"POST",
        data:{
          productId: this.data.setting.productId,
          merchantForLevelAID: this.data.setting.merchantForLevelAID,
          merchantForLevelBID: 0,
          staffId: this.data.pageData.memberInfo.staffID
        }
      });
    });
  },
  onServiceFormSubmit(){
    let data = this.data.setting.serviceForm;
    data.merchantForLevelAID = this.data.pageData.companyInfo.merchantForLevelAID;
    data.merchantForLevelBID = 0;
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