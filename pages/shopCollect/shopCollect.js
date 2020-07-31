const Fai = require("../../utils/util");
const Ajax = require("../../ajax/index");
const config = require("../../utils/config");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    setting: {
      pageNo: 0,
      pageSize: 10,
      companyList: []
    },
    staticDomain: config.staticDomain
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.loadData();
    Ajax.setNormalTitle("shopCollect");
  },
  async loadData(){
    this.loadShopCollections();
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  loadShopCollections: async function(){
    let setting = this.data.setting;
    if(setting.totalSize>=0 && setting.companyList.length>=setting.totalSize){
      return Promise.reject();
    }

    Ajax.requestWithToast(async()=>{
      let response = await Fai.promiseRequest({
        url: "/ajax/company/companyCollect?cmd=getCompanyCollectionList",
        data: {
          pageNo: setting.pageNo+1,
          pageSize: setting.pageSize
        },
      });
      let result = response.data;

      setting.companyList.push(...result.data.companyList)
      this.setData({
        "setting.pageNo": setting.pageNo+1,
        "setting.companyList": setting.companyList,
        "setting.totalSize": result.data.totalSize
      });

      return Promise.resolve(response);
    })
  
  },
  onCancelShopCollect: async function(event){
    let dataset = event.currentTarget.dataset;
    let company = dataset.company;
    let index = dataset.index;

    

    Ajax.requestWithToast(async()=>{

      let data = {
        merchantForLevelAID : 0,
        merchantForLevelBID : 0
      };
      if(company.collectSubTypeID == 1){
        data.merchantForLevelAID = company.merchantForLevelAID;
      }else{
        data.merchantForLevelBID = company.merchantForLevelBID;
      }
      let response = await Fai.promiseRequestPost({
        url: "/ajax/company/companyCollect?cmd=setCompanyCollectCancel",
        data:data
      });

      this.data.setting.companyList.splice(index,1);
      this.setData({
        "setting.companyList": this.data.setting.companyList
      });

      return Promise.resolve(response);
    });
  }
})