const Fai = require("../../utils/util");
const Ajax = require("../../ajax/index");

Page(Fai.mixin(Fai.commPageConfig, {

  /**
   * 页面的初始数据 
   */
  data: {
    setting: {
      companyAID: -1,//当前名片所属公司
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
    this.setData({
      "setting.companyAID": parseInt(options.companyAID) || 0,
      "setting.companyBID": parseInt(options.companyBID) || 0,
      "setting.staffID": parseInt(options.staffID) || 0
    });
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
    this.loadPersonalData();
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
      let companyAInfo = {};
      let companyBInfo = {};
      let companyInfo = {};
      let staffInfo = {};
      if(memberInfo.staffID>0){
        response = await Ajax.getInfo4Staff(memberInfo.staffID);
        staffInfo = response.data.data;
      }
      if(staffInfo.merchantForLevelAID>0){
        response = await Ajax.getCompanyAIndexPageData(staffInfo.merchantForLevelAID);
        companyInfo = companyAInfo = response.data.data.companyInfo;
      }
      if(staffInfo.merchantForLevelBID>0){
        response = await Ajax.getCompanyBIndexPageData(staffInfo.merchantForLevelBID);
        companyInfo = companyBInfo = response.data.data.companyInfo;
      }

      this.setData({
        "pageData.memberInfo":memberInfo,
        "pageData.staffInfo":staffInfo,
        "pageData.companyAInfo": companyAInfo,
        "pageData.companyBInfo": companyBInfo,
        "pageData.companyInfo": companyInfo,
      });
      return Promise.resolve(response);
    }, "加载中...");
  }
}));