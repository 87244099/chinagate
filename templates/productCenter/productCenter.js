// pages/productCenter/productCenter.js
//获取应用实例
const app = getApp();
const Fai = require("../../utils/util");
const Ajax = require("../../ajax/index");
const config = require("../../utils/config");
module.exports = {

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



  async loadCompanyBPageData(companyId){
    Ajax.requestWithToast(async()=>{

      let response = await Ajax.getInfo4CompanyB(companyId);
      let companyInfo = response.data.data;
       response = await Ajax.getCompanyAIndexPageData(companyInfo.merchantForLevelAID);
      let companyPageData = response.data.data;
      response = await Fai.promiseRequest({
        url:"/ajax/product/product?cmd=getProductCenterPageData&id="+this.data.setting.companyId,
      });
      
      this.setData({
        "pageData.productGroupList": response.data.data.productGroupList,
        "pageData.companyPageData": companyPageData
      });
      return Promise.resolve(response);
    }, "加载中...");
  },

  async getPageData(companyId){
    Ajax.requestWithToast(async()=>{
      let response = await Ajax.getCompanyAIndexPageData(companyId);
      let companyPageData = response.data.data;
      response = await Fai.promiseRequest({
        url:"/ajax/product/product?cmd=getProductCenterPageData&id="+this.data.setting.companyId,
      });
      
      this.setData({
        "pageData.productGroupList": response.data.data.productGroupList,
        "pageData.companyPageData": companyPageData
      });
      return Promise.resolve(response);
    }, "加载中...");
  },

  async loadPageData(){
    this.getPageData(this.data.setting.companyId);
  },
  onGroupTabClick: function(event){
    let index = event.currentTarget.dataset.index;
    this.setData({
      "setting.tabIndex": index
    });
  },
  searchBlur: function(event){
    this.dealSearch(event);
  },
  searchClear: function(event){
    this.dealSearch(event);
  },
  dealSearch: Fai.delay(function(event){
    if(event.type == "blur"){
      let value = event.detail.value || '';
      value = value.trim();
      if(value.length > 0){
        wx.navigateTo({
          url: '/pages/productSearch/productSearch?word='+value+"&companyId="+this.data.setting.companyId,
        });
      }else{
      }
    }
  }),
};