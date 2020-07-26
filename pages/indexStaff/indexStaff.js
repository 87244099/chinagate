// pages/indexStaff/indexStaff.js

const app = getApp();
const Fai = require("../../utils/util");
const config = require("../../utils/config");
import Toast from "../../miniprogram_npm/@vant/weapp/toast/toast";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    setting:{},
    pageData:{
      staffInfo:{},
      companyPageData:{}
    },
    staticDomain:config.staticDomain
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({
      "setting.companyId": parseInt(options.companyId) || -1,
      "setting.staffID": parseInt(options.staffID) || -1,
    });

    Toast.loading({
      message:"加载中...",
      duration: 0,
    });

    Fai.request({
      url:"/ajax/user/userInfo?cmd=getInfo4Staff",
      data: {
        companyId: this.data.setting.companyId,
        id: this.data.setting.staffID//大小写问题
      },
      success:(response)=>{
        let result = response.data;
        if(result.success){
          this.setData({
            "pageData.staffInfo":result.data
          });
        }else{
          Toast.fail(result.msg || "网络繁忙，请稍后重试");
        }
      },
      fail(){
        Toast.fail("网络繁忙，请稍后重试");
      }
    });

    Fai.request({
      url: "/ajax/company/company?cmd=getCompanyAIndexPageData&id="+this.data.setting.companyId,
      beforeConsume:Toast.clear,
      success:(response)=>{
        let result = response.data;
        if(result.success){
          this.setData({
            "pageData.companyPageData":result.data
          });
        }else{
          Toast.fail(result.msg || "网络繁忙，请稍后重试");
        }
      },
      fail(){
        Toast.fail("网络繁忙，请稍后重试");
      }
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
  callPhone(){
    wx.makePhoneCall({
      phoneNumber: this.data.pageData.staffInfo.phone,
    })
  },
  callMap(){
    let companyInfo = this.data.pageData.companyPageData.companyInfo;
    let locData = {
      name: companyInfo.companyName,
      latitude:parseInt( companyInfo.position.latitude) || 0,
      longitude: parseInt(companyInfo.position.longitude) || 0,
      scale: 18
    };
    wx.openLocation(locData);
  },
  setUserCollect4Staff(){
    Toast.loading({
      message:"收藏中...",
      duration: 0
    })
    Fai.request({
      url:"/ajax/user/userCollection?cmd=setUserCollect4Staff",
      method:"POST",
      data:{
        staffId: this.data.pageData.staffInfo.staffID
      },
      beforeConsume:Toast.clear,
      success: (response)=>{
        let result = response.data;
        if(result.success){
          Toast.success(result.msg);
        }else{
          Toast.fail(result.msg || "网络繁忙,请稍后重试");
        }
      },
      fail(){
        Toast.fail("网络繁忙,请稍后重试");
      }

    })
  }
})