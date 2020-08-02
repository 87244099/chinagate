// pages/personal/personal.js
const app = getApp();
const Fai = require("../../utils/util");
const Ajax = require("../../ajax/index");
const config = require("../../utils/config");
import Toast from "../../miniprogram_npm/@vant/weapp/toast/toast";

Page(Fai.mixin(Fai.commPageConfig, {

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
    Toast.loading({
      message:"加载中...",
      duration: 0,
      mask:true
    });
    try{
      let response = await Ajax.getMemberInfo();
      let result = response.data;
      let memberInfo = result.data;
      this.setData({
        "pageData.memberInfo":memberInfo
      });
    }catch(e){
      Toast.fail("网络繁忙，请稍后重试");
      return;
    }

    // try{
    //   let response = await Ajax.getCompanyAIndexPageData(this.data.pageData.memberInfo.merchantForLevelAID);
      
    //   this.setData({
    //     "pageData.companyPageData":response.data.data
    //   });
    // }catch(e){
    //   Toast.fail("网络繁忙，请稍后重试");
    //   return;
    // }

    Toast.clear();
  }
}));