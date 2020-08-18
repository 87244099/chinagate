// pages/shops/shops.js
const Ajax = require("../../ajax/index");
const Fai = require("../../utils/util");
const config = require("../../utils/config");
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page(Fai.mixin(Fai.commPageConfig, {
  noop(){},
  /**
   * 页面的初始数据
   */
  data: {
    setting: {
      position:{},
      pageNo: 0,
      pageSize: 6
    },
    config:config
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      "setting.word": decodeURIComponent(options.word)
    });
    
    this.search4Init(this.data.setting.word);
  },
  searchBlur: function(event){
    this.setData({
      "setting.word": event.detail.value
    });
  },
  searchClear: function(event){
    this.dealSearch(event);
  },
  doSearch(event){
    let value = this.data.setting.word;
    value = value.trim();
    if(value.length > 0){
      this.search4Init(value);
    }
  },
  dealSearch: Fai.delay(function(event){
    if(event.type == "blur"){
      let value = event.detail.value || '';
      value = value.trim();
      if(value.length > 0){
        this.search4Init(value);
      }else{
        
      }
    }
  }),
  async search4Init(word){
    this.setData({
      "setting.pageNo": 0,
      "setting.totalSize": -1
    });
    this.searchByWord(word);
  },

  async searchByWord(word){
    if(Fai.isPaginationEndBySetting(this.data.setting)){
      return;
    }
    Ajax.requestWithToast(async()=>{
      let response = await Ajax.getBrandCompanyListByName(this.data.setting.pageNo, this.data.setting.pageSize, word);
      this.setData({
        "pageData.companyList": response.data.data.companyList,
        "setting.pageNo": this.data.setting.pageNo+1,
        "setting.totalSize": response.data.data.totalSize,
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
    this.searchByWord(this.data.setting.word);
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
  }
}));