// pages/productCollect/productCollect.js
const app = getApp();
const Fai = require("../../utils/util");
const Ajax = require("../../ajax/index");
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
    pageData:{
      memberInfo: {}
    },
    staticDomain: config.staticDomain
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadPageData();

    Ajax.setNormalTitle("productCollect");
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
  async loadPageData(){

    Ajax.requestWithToast(async()=>{
      let response = await Ajax.getMemberInfo();
      let memberInfo = response.data.data;
      this.setData({
        "pageData.memberInfo":memberInfo
      })

      this.loadCollectedProducts();
      return Promise.resolve(response);
    })

  },
  loadCollectedProducts: function(){
    let setting = this.data.setting;
    if(setting.totalSize>=0 && setting.productList.length>=setting.totalSize);

    wx.showLoading({
      title: '加载中...',
    });
    Fai.request({
      url:"/ajax/product/productCollection?cmd=getProductCollectionList&pageNo=1&pageSize=6",
      data:{
        memberId: this.data.pageData.memberInfo.memberID,
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
  },
  async onCancelProductCollect(event){
    let item = event.currentTarget.dataset.item;
    console.log(item);
    Ajax.requestWithToast(async()=>{
      return Fai.promiseRequestPost({
        url:"/ajax/product/productCollection?cmd=setProductCollectCancel",
        data:{
          productId: item.productID,
          staffID: this.data.pageData.memberInfo.staffID,
          merchantForLevelAID: item.merchantForLevelAID,
          merchantForLevelBID: item.merchantForLevelBID,
        }
      })
    });
  }
})