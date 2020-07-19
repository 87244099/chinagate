// pages/productCollect/productCollect.js
const app = getApp();
const Fai = require("../../utils/util");
const config = require("../../utils/config");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    setting: {
      memberId:1,
      pageNo: 0,
      pageSize:6,
      totalSize: -1,
      productList: []
    },
    staticDomain: config.staticDomain
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadCollectedProducts();
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
  loadCollectedProducts: function(){
    let setting = this.data.setting;
    if(setting.totalSize>=0 && setting.productList.length>=setting.totalSize);

    wx.showLoading({
      title: '加载中...',
    });
    Fai.request({
      url:"/ajax/product/product?cmd=getProductCollectionList&memberId=1&pageNo=1&pageSize=6",
      data:{
        memberId: setting.memberId,
        pageNo: setting.pageNo,
        pageSize: setting.pageSize
      },
      complete(){
        wx.hideLoading({
          complete: (res) => {},
        })
      },
      success: (res)=>{
        let result = res.data;
        if(result.success){
          console.log("data", result.data);
          setting.productList.push(...result.data.productInfo);
          this.setData({
            "setting.pageNo": setting.pageNo+1,
            "setting.productList": setting.productList
          })
        }
      }
    })
  }
})