// pages/productCenter/productCenter.js
//获取应用实例
const app = getApp();
const Fai = require("../../utils/util");
const Ajax = require("../../ajax/index");
const config = require("../../utils/config");
Page(Fai.mixin({

  /**
   * 页面的初始数据
   */
  data: {
    pageData: {},
    setting: {
      groupVisible: true,
      tabIndex: 0,
      companyAID: -1,
      companyBID: -1,
      staffID: -1
    },
    config
    
  },
  toggleGroup(){
    this.setData({
      "setting.groupVisible": !this.data.setting.groupVisible
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      "setting.companyAID":parseInt(options.companyAID) || 0,
      "setting.companyBID":parseInt(options.companyBID) || 0,
      "setting.staffID":parseInt(options.staffID) || 0
    });

    Ajax.requestWithToast(async()=>{
      let response = {};
      let staffInfo = {};
      if(this.data.setting.companyBID>0){
        response = await Ajax.getCompanyBIndexPageData(this.data.setting.companyBID);
      }else{
        response = await Ajax.getCompanyAIndexPageData(this.data.setting.companyAID);
      }
      let companyPageData = response.data.data;
      response = await Fai.promiseRequest({
        url:"/ajax/product/product?cmd=getProductCenterPageData&id="+this.data.setting.companyAID,
      });
      let productGroupList = response.data.data.productGroupList;
      if(this.data.setting.staffID>0){
        response = await Ajax.getInfo4Staff(this.data.setting.staffID);
        staffInfo = response.data.data;
      }
      
      this.setData({
        "pageData.productGroupList": productGroupList,
        "pageData.companyPageData": companyPageData,
        "pageData.companyInfo": companyPageData.companyInfo,
        "globalData": getApp().globalData,
        "pageData.staffInfo": staffInfo
      });
      this.setData({
        "setting.inited":true
      })
      return Promise.resolve(response);
    }, "加载中...").catch(()=>{
      this.setData({
        "setting.inited":true
      })
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  noop:function(){},


  async loadCompanyBPageData(companyId){
    Ajax.requestWithToast(async()=>{

      let response = await Ajax.getInfo4CompanyB(companyId);
      let companyInfo = response.data.data;
        response = await Ajax.getCompanyAIndexPageData(companyInfo.merchantForLevelAID);
      let companyPageData = response.data.data;
      response = await Fai.promiseRequest({
        url:"/ajax/product/product?cmd=getProductCenterPageData&id="+this.data.setting.companyAId,
      });
      
      this.setData({
        "pageData.productGroupList": response.data.data.productGroupList,
        "pageData.companyPageData": companyPageData
      });
      return Promise.resolve(response);
    }, "加载中...");
  },

  async getPageData(companyId){
    
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
  searchChange: function(event){
    
    this.setData({
      "setting.word": event.detail
    });
    // this.dealSearch(event);
  },
  searchClear: function(event){
    this.dealSearch(event);
  },
  doSearch(){
    let value = this.data.setting.word;
    value = value.trim();
    if(value.length > 0){
      wx.navigateTo({
        url: '/pages/productSearch/productSearch?word='+value+"&companyAID="+this.data.setting.companyAID+"&companyBID="+this.data.setting.companyBID+"&staffID="+this.data.setting.staffID,
      });
    }
  },
  dealSearch: Fai.delay(function(event){
    console.log(Math.random());
    console.log(Fai.commPageConfig);
    if(event.type == "blur"){
      this.doSearch();
    }
  }, 800)

}));