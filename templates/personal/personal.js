// pages/personal/personal.js
const Ajax = require("../../ajax/index");

module.exports = {

  /**
   * 页面的初始数据
   */
  data: {
    setting: {
      companyId: -1,//当前名片所属公司
      staffId: -1//当前名片所属员工
    },
    pageData:{
      memberInfo: {},
      staffInfo: {},
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    console.log(222);

    // this.loadPersonalData();
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
  async loadPersonalData(){
    Ajax.requestWithToast(async()=>{
      
      let response = await Ajax.getMemberInfo();
      let memberInfo = response.data.data;
      response = await Ajax.getCompanyAIndexPageData(memberInfo.merchantForLevelAID);
      let companyPageData = response.data.data;
      // Ajax.getInfo4Staff()
      // response = await Ajax.getRandk
      response = await Ajax.getInfo4Staff(memberInfo.staffID);
      console.log(response);
      this.setData({
        "pageData.memberInfo":memberInfo,
        "pageData.companyPageData":companyPageData
      });
      return Promise.resolve(response);
    }, "加载中...");
  },
};