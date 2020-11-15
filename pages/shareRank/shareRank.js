// pages/shareRank/shareRank.js
const Ajax = require("../../ajax/index");
const Fai = require("../../utils/util");

Page(Fai.mixin(Fai.commPageConfig, {

  /**
   * 页面的初始数据
   */
  data: {
    config: Fai.config
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad (options) {

    this.setData({
      "setting": options
    })

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

      let memberInfo = await Ajax.getMemberInfo();
      
      //  memberInfo.merchantForLevelAID == setting.companyAID 
      // && memberInfo.merchantForLevelBID == setting.companyBID;
      let companyInfo = {};
      if(memberInfo.merchantForLevelBID>0){
        response = await Ajax.getInfo4CompanyA(memberInfo.merchantForLevelBID);
        companyInfo = response.data.data;
      }else if(memberInfo.merchantForLevelAID>0){
        response = await Ajax.getInfo4CompanyA(memberInfo.merchantForLevelAID);
        companyInfo = response.data.data;
      }

      this.setData({
        "setting.companyAID": memberInfo.merchantForLevelAID,
        "setting.companyBID": memberInfo.merchantForLevelBID,
        "setting.staffID": memberInfo.staffID,
        "pageData.companyInfo": memberInfo.staffID,
      });

      return response;
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
}))