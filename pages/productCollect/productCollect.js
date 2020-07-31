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
      pageSize:8,
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
    if(!this.isAllProductLoaded()){
      this.loadNextCollectedProducts();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  async loadPageData(){
    let setting = this.data.setting;
    Ajax.requestWithToast(async()=>{
      let response = await Ajax.getMemberInfo();
      let memberInfo = response.data.data;

      response = await this.loadCollectedProducts(
        memberInfo.memberID,
        setting.pageNo,
        setting.pageSize
      );

      setting.productList.push(...response.data.data.productInfo);

      this.setData({
        "setting.totalSize": response.data.data.totalSize,
        "pageData.memberInfo":memberInfo,
        "setting.pageNo": setting.pageNo+1,
        "setting.productList": setting.productList
      })
      return Promise.resolve(response);
    });

  },
  isAllProductLoaded(){
    let setting = this.data.setting;
    return (setting.totalSize>=0 && setting.productList.length>=setting.totalSize);
  },
  async loadNextCollectedProducts(){
    Ajax.requestWithToast(async()=>{
      let setting = this.data.setting;
      let response = await this.loadCollectedProducts(
        this.data.pageData.memberInfo.memberID,
        setting.pageNo,
        setting.pageSize
      );
      let result = response.data;
      setting.productList.push(...result.data.productInfo);
      this.setData({
        "setting.totalSize": response.data.data.totalSize,
        "setting.pageNo": setting.pageNo+1,
        "setting.productList": setting.productList
      });

      return Promise.resolve(response);
    }, "加载中...");
  },
  loadCollectedProducts: async function(memberId, pageNo, pageSize){
    return Fai.promiseRequest({
      url:"/ajax/product/productCollection?cmd=getProductCollectionList&pageNo=1&pageSize=6",
      data:{
        // memberId: this.data.pageData.memberInfo.memberID,
        // pageNo: setting.pageNo,
        // pageSize: setting.pageSize
        memberId: memberId,
        pageNo: pageNo,
        pageSize: pageSize
      }
    });
  },
  async onCancelProductCollect(event){
    let item = event.currentTarget.dataset.item;
    let index = event.currentTarget.dataset.index;
    Ajax.requestWithToast(async()=>{
      let response = Fai.promiseRequestPost({
        url:"/ajax/product/productCollection?cmd=setProductCollectCancel",
        data:{
          productId: item.productID,
          staffID: item.staffID,
          merchantForLevelAID: item.merchantForLevelAID,
          merchantForLevelBID: item.merchantForLevelBID,
        }
      });
      this.data.setting.productList.splice(index, 1);
      this.setData({
        "setting.productList": this.data.setting.productList
      })
      return Promise.resolve(response);
    });
  }
})