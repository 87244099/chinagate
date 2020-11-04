// pages/shareRank/shareRank.js
const Ajax = require("../../ajax/index");
const Fai = require("../../utils/util");

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad (options) {
    let isLogin = await Ajax.checkLoginWithRedirect(Fai.getCurrAbsPath());
    if(isLogin){
      this.loadRank(1);
    } 
    
  },
  onTabChange(event){
    let name = event.detail.name;
    this.loadRank(name);
  },
  loadRank(type){
    Ajax.requestWithToast(async()=>{

      let response = await Ajax.getShareRank(type);
      this.setData({
        "pageData.myRank": response.data.data.myRank,
        "pageData.rankList": response.data.data.rankList,
        "pageData.bannerList": response.data.data.bannerList,
      })
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

  }
})