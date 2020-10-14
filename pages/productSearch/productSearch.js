// pages/productSearch/productSearch.js
const Fai = require("../../utils/util");
const Ajax = require("../../ajax/index");
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
        productList: [],
        companyAID: -1,
        companyBID: -1
      },
      config:config
    },
  
    // /**
    //  * 生命周期函数--监听页面加载
    //  */
    onLoad: function (options) {
      this.setData({
        "setting.companyAID": parseInt(options.companyAID) || 0,
        "setting.companyBID": parseInt(options.companyBID) || 0,
        "setting.staffID": parseInt(options.staffID) || 0,
        "setting.inputWord": options.word,
        "setting.word": options.word
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
        if(this.data.setting.staffID>0){
          response = await Ajax.getInfo4Staff(this.data.setting.staffID);
          staffInfo = response.data.data;
        }

        response = await Ajax.belongVip(this.data.setting.companyAID);
        let isVip = response.data.data.isVip;
        this.setData({
          "pageData.companyPageData": companyPageData,
          "pageData.staffInfo": staffInfo,
          "pageData.companyInfo": companyPageData.companyInfo,
          "pageData.isVip":isVip
        }); 
        this.searchProduct4Init(this.data.setting.word);
        this.setData({
          "setting.inited": true
        });
        return Promise.resolve(response);
      },"加载中...").catch(()=>{
        this.setData({
          "setting.inited": true
        });
      });
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
    async searchProduct4Init(word){
      return Ajax.requestWithToast(async()=>{
        this.setData({
          "setting.word": word,
          "setting.pageNo":0,
          "setting.pageSize":10,
          "setting.inputWord": word,
          "setting.productList": []
        });

        let response = await this.loadNextProduct4Word();
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
          id: setting.companyAID
        }
      });
      let result = response.data;
      setting.productList.push(...result.data.productList);
      this.setData({
        "setting.pageNo": setting.pageNo+1,
        "setting.totalPdSize": result.data.totalPdSize,
        "setting.productList": setting.productList
      });
      return response;
    },
    searchChange: function(event){
      this.setData({
        "setting.word": event.detail
      });
    },
    searchClear: function(event){
      this.dealSearch(event);
    },
    doSearch(){
      this.searchProduct4Init(this.data.setting.word);
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