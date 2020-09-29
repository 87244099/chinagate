// pages/shops/shops.js
const Ajax = require("../../ajax/index");
const Fai = require("../../utils/util");
const config = require("../../utils/config");
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page(Fai.mixin(Fai.commPageConfig, {

  /**
   * 页面的初始数据
   */
  data: {
    setting: {
      position:{}
    },
    config:config
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    
    Ajax.setNormalTitle("recentShop");
    this.initPage();
    
  },
  async initPage(){
    
    let response;
    try{
      response = await Fai.getSetting();
      console.log(response);
      if(response.errMsg == "getSetting:ok"){
        let authSetting = response.authSetting;
        if(authSetting["scope.userLocation"] === undefined){//未验证过
          response = await Fai.getLocation();
          console.log("response2", response);

          let latitude = response.latitude;
          let longitude = response.longitude;
          this.setData({
            "setting.position": {
              latitude,
              longitude
            }
          });
        }else if(authSetting["scope.userLocation"] === false){
          console.log("response3", response);

          response = await Dialog.confirm({
            // title: '标题',
            message: '请打开地理位置',
            confirmButtonText:"去设置"
          });
          wx.openSetting();
          return;
        }else{
          response = await Fai.getLocation();
          console.log("response4", response);

          let latitude = response.latitude;
          let longitude = response.longitude;
          this.setData({
            "setting.position": {
              latitude,
              longitude
            }
          });
        }
      }
    }catch(errResponse){
      console.log("errResponse", errResponse);
      wx.redirectTo({
        url: '/pages/index/index',
      });
    }
    
    Ajax.requestWithToast(async()=>{
      response = await Fai.promiseRequest({
        url:"/ajax/company/company?cmd=getRecentCompanyList",
        data: this.data.setting.position
      });
      this.setData({
        "pageData.companyList": response.data.data.companyList
      });

      return Promise.resolve(response);
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

  },
  onJumpToCompany(event){
    let item = event.currentTarget.dataset.item;
    wx.navigateTo({
      url: "/pages/indexCompany/indexCompany?companyAID="+item.merchantForLevelAID+"&companyBID="+item.merchantForLevelBID,
    });
  },
  async jump2CreateCompany(){
    if(await Ajax.checkLoginWithRedirect("/pages/createCompany/createCompany")){
      wx.navigateTo({
        url: '/pages/createCompany/createCompany',
      });
    }
  }
}));