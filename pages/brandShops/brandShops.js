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
      position:{},
      pageNo: 0,
      pageSize: 6,
      totalSize: -1
    },
    config:config
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    
    this.loadNextBrandShops();
    
  },
  async loadNextBrandShops(){

    if(!Fai.isPaginationEndBySetting(this.data.setting)){
      Ajax.requestWithToast(async()=>{
        let response = await Ajax.getBrandCompanyList(this.data.setting.pageNo, this.data.setting.pageSize);
        this.setData({
          "pageData.companyList": response.data.data.companyList,
          "setting.pageNo": this.data.setting.pageNo+1,
          "setting.totalSize": response.data.data.totalSize
        });
        return Promise.resolve(response);
      }, "加载中...");
    }
    
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
    this.loadNextBrandShops();
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
  searchBlur: function(event){
    this.setData({
      "setting.word": event.detail.value
    });
  },
  Clear: function(event){
    this.dealSearch(event);
  },
  doSearch(){
    let value = this.data.setting.word;
    value = value.trim();
      if(value.length > 0){
        wx.navigateTo({
          url: '/pages/brandShopsSearch/brandShopsSearch?word='+value,
          
        });
      }else{
      }
  },
  dealSearch: Fai.delay(function(event){
    if(event.type == "blur"){
      let value = event.detail.value || '';
      value = value.trim();
      if(value.length > 0){
        wx.navigateTo({
          url: '/pages/brandShopsSearch/brandShopsSearch?word='+value,
          
        });
      }else{
      }
    }
  }, 800)
}));