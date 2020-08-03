// pages/productCenter/productCenter.js
//获取应用实例
const app = getApp();
const Fai = require("../../utils/util");
const Ajax = require("../../ajax/index");
const config = require("../../utils/config");
const ProductCenter = require("../../templates/productCenter/productCenter");
Page(Fai.mixin(ProductCenter, {

  /**
   * 页面的初始数据
   */
  data: {
    pageData: {},
    setting: {
      tabIndex: 0,
      companyId: -1,
    },
    config
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      "setting.companyId":parseInt(options.companyId) || -1
    })
    this.loadPageData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

}));