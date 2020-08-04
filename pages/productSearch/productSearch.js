// pages/productSearch/productSearch.js
const Fai = require("../../utils/util");
const ProductSearch = require("../../templates/productSearch/productSearch");
Page(Fai.mixin(Fai.commPageConfig, ProductSearch, {
  onLoad: function (options) {
    this.setData({
      "setting.companyId": parseInt(options.companyId) || -1
    });
    this.init4CompanyA();
  }
}));