// pages/productCenter/productCenter.js
//获取应用实例
const app = getApp();
const Fai = require("../../utils/util");
const Ajax = require("../../ajax/index");
const config = require("../../utils/config");
const ProductCenter = require("../../templates/productCenter/productCenter");
Page(Fai.mixin(Fai.commPageConfig, ProductCenter, {
    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      "setting.companyId":parseInt(options.companyId) || -1
    })
    this.loadCompanyBPageData(this.data.setting.companyId);
  },
}));