// pages/productSearch/productSearch.js
const app = getApp();
const Fai = require("../../utils/util");
const config = require("../../utils/config");
Page(Fai.mixin(Fai.commPageConfig, {

  /**
   * 页面的初始数据
   */
  data: {
    "setting":{
      inputWord: "",
      pageNo:0,
      pageSize: 10,
      word: "",
      id:1,
      productList: []
    },
    config:config
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.searchProduct4Init(options.word);
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
    this.loadNextProduct4Word();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  searchProduct4Init: function(word){
    console.log("word", word)
    this.setData({
      "setting.word": word,
      "setting.pageNo":0,
      "setting.pageSize":10,
      "setting.inputWord": "",
      "setting.productList": []
    });
    this.loadNextProduct4Word();
  },
  loadNextProduct4Word: function(){
    let setting = this.data.setting;

    if(this.data.setting.totalPdSize>0 && this.data.setting.productList.length>=this.data.setting.totalPdSize){
      return;
    }

    wx.showLoading({
      title: '搜索中...',
    });
    Fai.request({
      url:"/ajax/product/product?cmd=getProductListByName",
      data:{
        word: this.data.setting.word,
        pageNo: setting.pageNo,
        pageSize: setting.pageSize,
        id: setting.id
      },
      complete:()=>{
        wx.hideLoading({
          complete: (res) => {},
        })
      },
      success:(res)=>{
        let result = res.data;
        if(result.success){
          setting.productList.push(...result.data.productList);
          this.setData({
            "setting.pageNo": setting.pageNo+1,
            "setting.totalPdSize": result.data.totalPdSize,
            "setting.productList": setting.productList
          });
        }
      }
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
        this.searchProduct4Init(value);
      }else{
        
      }
    }
  })
}));