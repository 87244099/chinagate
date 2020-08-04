// pages/productSearch/productSearch.js
const Fai = require("../../utils/util");
const Ajax = require("../../ajax/index");
const config = require("../../utils/config");
module.exports = {

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
      productList: [],
      companyId: -1
    },
    config:config
  },

  // /**
  //  * 生命周期函数--监听页面加载
  //  */


  async init4CompanyA(){
    Ajax.requestWithToast(async()=>{
      let companyId = this.data.setting.companyId;
      let response = await Ajax.getCompanyAIndexPageData(companyId);
      this.setData({
        "pageData.companyPageData": response.data.data
      }); 
      this.searchProduct4Init(this.data.setting.word);
      return Promise.resolve(response);
    },"加载中...");
  },
  async init4CompanyB(){
    Ajax.requestWithToast(async()=>{
      let companyId = this.data.setting.companyId;
      let response = await Ajax.getCompanyBIndexPageData(companyId);

      this.setData({
        "pageData.companyPageData": response.data.data
      }); 
      this.searchProduct4Init(this.data.setting.word);
      return Promise.resolve(response);
    }, "加载中...");
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
    if(this.isAllLoad()){
      return;
    }
    this.loadNextProduct4Word();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  searchProduct4Init: function(word){
    Ajax.requestWithToast(async()=>{
      this.setData({
        "setting.word": word,
        "setting.pageNo":0,
        "setting.pageSize":10,
        "setting.inputWord": "",
        "setting.productList": []
      });
      let response = this.loadNextProduct4Word();
      return Promise.resolve(response);
    }, "加载中...");
  },
  isAllLoad(){
    let setting = this.data.setting;

    if(this.data.setting.totalPdSize>0 && this.data.setting.productList.length>=this.data.setting.totalPdSize){
      return true;
    }
    return false
  },
  loadNextProduct4WordWithToast(){
    Ajax.requestWithToast(this.loadNextProduct4Word, "加载中...");
  },
  loadNextProduct4Word: async function(){
    let setting = this.data.setting;
    let response = await Fai.promiseRequest({
      url:"/ajax/product/product?cmd=getProductListByName",
      data:{
        word: this.data.setting.word,
        pageNo: setting.pageNo,
        pageSize: setting.pageSize,
        id: setting.id
      }
    });
    let result = response.data;
    setting.productList.push(...result.data.productList);
    this.setData({
      "setting.pageNo": setting.pageNo+1,
      "setting.totalPdSize": result.data.totalPdSize,
      "setting.productList": setting.productList
    });
    return Promise.resolve(response);
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
};