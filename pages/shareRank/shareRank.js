// pages/shareRank/shareRank.js
const Ajax = require("../../ajax/index");
const Fai = require("../../utils/util");

Page(Fai.mixin(Fai.commPageConfig, {

  /**
   * 页面的初始数据
   */
  data: {
    config: Fai.config
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad (options) {

      this.setData({
        "setting.companyAID": parseInt(options.companyAID) || 0,
        "setting.companyBID": parseInt(options.companyBID) || 0,
        "setting.staffID": parseInt(options.staffID) || 0,
      })

    let isLogin = await Ajax.checkLoginWithRedirect(Fai.getCurrAbsPath());
    if(isLogin){
      this.loadRank(1);
    } 
    
  },
  onTabChange(event){
    let name = event.detail.name;
    this.loadRank(name);
  },
  loadRank(type){
    Ajax.requestWithToast(async()=>{

      let response = await Ajax.getShareRank(type);
      this.setData({
        "pageData.myRank": response.data.data.myRank,
        "pageData.rankList": response.data.data.rankList,
        "pageData.bannerList": response.data.data.bannerList,
      });
        let bannerHeight = 346;
        if(this.data.pageData.bannerList.length>0){
          let imgUrl = this.data.config.wwwwStaticDomain+"/"+this.data.pageData.bannerList[0];
          let res = await Fai.getImageInfo(imgUrl);
          console.log("res", res);
          bannerHeight = 750/(res.width/res.height);
        }
        this.setData({
          "setting.bannerHeight": bannerHeight
        });

      let memberInfo = await Ajax.getMemberInfo();

      //  memberInfo.merchantForLevelAID == setting.companyAID 
      // && memberInfo.merchantForLevelBID == setting.companyBID;
      let companyInfo = {};
      if(this.data.setting.companyBID>0){
        response = await Ajax.getCompanyBIndexPageData(this.data.setting.companyBID);
        companyInfo = response.data.data.companyInfo;
      }else if(this.data.setting.companyAID>0){
        response = await Ajax.getCompanyAIndexPageData(this.data.setting.companyAID);
        companyInfo = response.data.data.companyInfo;
      }

      let staffInfo = {};
      if(this.data.setting.staffID>0){
        response = await Ajax.getInfo4Staff(this.data.setting.staffID);
        staffInfo = response.data.data;
      }

      this.setData({
        "pageData.companyInfo": companyInfo,
        "pageData.staffInfo": staffInfo,
      });

      return response;
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
}))