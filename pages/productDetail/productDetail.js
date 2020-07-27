// pages/productDetail/productDetail.js
//获取应用实例
const app = getApp();
const Fai = require("../../utils/util");
const config = require("../../utils/config");
import Toast from "../../miniprogram_npm/@vant/weapp/toast/toast";
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
  loadPageData: function(){
    if(this.data.setting.productId>-1){
      wx.showLoading({
        title: '加载中...',
      })
      Fai.request({
        url:"/ajax/product/product?cmd=getProductDetailPageData&productId="+this.data.setting.productId,
        complete(){
          wx.hideLoading({
            complete: (res) => {},
          })
        },
        success: (res)=>{
          let result = res.data;
          if(result.success){
            this.setData({
              pageData: result.data
            });
          }
        }
      });
    }
  },
  setProductCollect: function(){
    Fai.request({
      url:"/ajax/product/productCollection?cmd=setProductCollect",
      method:"POST",
      data:{
        id: this.data.setting.productId
      },
      success:(response)=>{
        let result = response.data;
        if(result.success){
          Toast.success(result.msg);
        }else{
          Toast.fail(result.msg || "网络繁忙，请稍后重试");
        }
      },
      fail:()=>{
        Toast.fail("网络繁忙，请稍后重试");
      }
    })
  },
  onServiceFormSubmit(){
    let data = this.data.setting.serviceForm;
    Fai.request({
      url:"/ajax/apply/applyForm?cmd=applyService",
      method:"POST",
      data: data,
      success:(response)=>{
        let result = response.data;
        if(result.success){
          Toast.success(result.msg);
        }else{
          Toast.fail(result.msg);
        }
      },
      fail(){
        Toast.fail("网络繁忙,请稍后重试");
      }
    })
  },
  onFieldBlur(event){
    let dataset = event.currentTarget.dataset;
    let field = dataset.field;
    let value = event.detail.value;
    this.setData({
      [`setting.serviceForm.${field}`]:value
    })
  },
}));