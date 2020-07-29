// pages/productCenter/productCenter.js
//获取应用实例
const app = getApp();
const Fai = require("../../utils/util");
const config = require("../../utils/config");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageData: {},
    setting: {
      tabIndex: 0,
      companyId: -1,
    },
    staticDomain: config.staticDomain
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      "setting.companyId":parseInt(options.id) || -1
    })
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
  loadPageData(){
    wx.showLoading({
      title: '加载中...',
    });
    Fai.request({
      url:"/ajax/product/product?cmd=getProductCenterPageData&id="+this.data.setting.companyId,
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
    })
  },
  onGroupTabClick: function(event){
    let index = event.currentTarget.dataset.index;
    this.setData({
      "setting.tabIndex": index
    });
  },
  searchBlur: function(event){
    this.dealSearch(event);
  },
  searchClear: function(event){
    this.dealSearch(event);
  },
  dealSearch: Fai.delay(function(event){
    if(event.type == "blur"){
      let value = event.detail.value || '';
      value = value.trim();
      if(value.length > 0){
        wx.navigateTo({
          url: '/pages/productSearch/productSearch?word='+value,
        })
      }else{
      }
    }
  }),
})