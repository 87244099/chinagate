//index.js
//获取应用实例
const Fai = require("../../utils/util");
const Ajax = require("../../ajax/index");
const config = require("../../utils/config");

// pages/card/card.js
module.exports = {
  loadData: async function(){
    Ajax.loadWithToast(this.asyncLoadData);
  },
  async asyncLoadData(){
      let response = await Ajax.getUserCollectInfoById(this.data.setting.memberId);
      let cardInfo = response.data.data.userInfo;
      
      this.setData({
        "pageData.cardInfo": cardInfo,
        "setting.title": this.data.pageData.cardInfo.memberName
      });
      wx.setNavigationBarTitle({
        title: this.data.setting.title,
      })
      return Promise.resolve(response);
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
  onShareAppMessage: function() {
    let data = {
      title: this.data.pageData.cardInfo.memberName,
      path: "pages/sharedCard/sharedCard?id="+ this.data.pageData.cardInfo.memberID,
    };
    return data;
  },
  onShareMaskClick: function(){
    this.setData({
      "setting.shareMaskVisible":false,
    })
  },
  onWantShare: function(){
    if(!this.data.setting.shared){
      this.setData({
        "setting.shared":true,
        "setting.readonly":true,
        "setting.shareMaskVisible":true,
      });
    }
    
  },
  onCallPhone: function(){
    wx.makePhoneCall({
      phoneNumber: this.data.pageData.cardInfo.memberPhone,
    })
  },
  onShowWxAppCode: function(){
    Ajax.previewQrCode("/pages/sharedCard/sharedCard", "id="+this.data.setting.memberId);
  },
  onCollect: async function(){
    Ajax.requestWithToast(async()=>{
      let response = Ajax.setUserCollect(this.data.setting.memberId);
      return Promise.resolve(response);
    }, {
      tip4Success:true
    });
  }
}