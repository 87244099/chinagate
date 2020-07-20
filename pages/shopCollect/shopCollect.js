const app = getApp();
const Fai = require("../../utils/util");
const config = require("../../utils/config");
import Toast from "../../miniprogram_npm/@vant/weapp/toast/toast";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    setting: {
      pageNo: 0,
      pageSize: 10,
      companyList: []
    },
    staticDomain: config.staticDomain
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadShopCollections();
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
  loadShopCollections: function(){
    let setting = this.data.setting;
    if(setting.totalSize>=0 && setting.companyList.length>=setting.totalSize){
      return;
    }

    Toast.loading({
      message: "加载中...",
      duration: 0
    });
    Fai.request({
      url: "/ajax/company/companyCollect?cmd=getCompanyCollectionList&pageNo=1&pageSize=6",
      data: {
        pageNo: setting.pageNo+1,
        pageSize: setting.pageSize
      },
      beforeCousume: Toast.clear,
      success:(response)=>{
        let result = response.data;
        if(result.success){
          console.log("result", result);
          setting.companyList.push(...result.data.companyList)
          this.setData({
            "setting.pageNo": setting.pageNo+1,
            "setting.companyList": setting.companyList,
            "setting.totalSize": result.data.totalSize
          })
        }else{
          Toast.fail(result.msg || "网络繁忙，请稍后重试");
        }
      },
      fail:()=>{
        Toast.fail( "网络繁忙，请稍后重试");
      }
    })
  
  },
  onCancelShopCollect: function(){
    
  }
})