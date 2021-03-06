
const Ajax = require("../../ajax/index");
const Fai = require("../../utils/util");
const config = require("../../utils/config");
import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
Page(Fai.mixin(Fai.commPageConfig, {

  /**
   * 页面的初始数据
   */
  data: {
    pageData:{
      wxUserInfo:{},
    },
    config,

    setting:{
      phoneConfirmVisible:false
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad (options) {
    
    Fai.Waiter.then("onOpenIdLoaded", async(resolve)=>{
      
      let sharedOption = Fai.parseSharedOption(options);
      this.setData({
        "setting.staffID":parseInt(sharedOption.staffID || 0),
        "setting.currUrl": Fai.getCurrAbsPath(),
        "setting.scene": options.scene
      });
      this.setCode();

      // 如果判断未登录，就是新的会员了
      if(await Ajax.checkLoginBoolean()){
        let response = await Ajax.getMemberInfo();
        let memberInfo = response.data.data;
        this.setData({
          "setting.memberInfo": memberInfo,
        })
      }

      Ajax.requestWithToast(this.loadPageData, "加载中...");

      // let isLogin = await Ajax.checkLoginWithRedirect4Invitation();
      // if(isLogin){
      //   Ajax.requestWithToast(this.loadPageData, "加载中...");
      // }

    });
    
  },
  async setCode(){
    let code = await Fai.getLoginCodeNullIsEmpty();
    this.setData({
      "setting.code": code
    })
  },
  async loadPageData(){
    let response = await Ajax.getInfo4Staff(this.data.setting.staffID);
    let staffInfo = response.data.data;
    let companyInfo= {};
    if(staffInfo.merchantForLevelBID){
      response = await Ajax.getInfo4CompanyB(staffInfo.merchantForLevelBID);
      companyInfo = response.data.data;
    }else{
      response = await Ajax.getInfo4CompanyA(staffInfo.merchantForLevelAID);
      companyInfo = response.data.data;
    }
    this.setData({
      // "setting.memberInfo": memberInfo,
      "pageData.companyInfo": companyInfo,
      "pageData.staffInfo": staffInfo
    });

    return Promise.resolve(response);
  }  ,
  

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
  //如果手机号为空，则连同手机号一并获取
  oninvitation4StaffWhenPhoneEmpty(event){
    let detail = event.detail;
    if(detail.errMsg == "getPhoneNumber:ok"){
      Ajax.requestWithToast(async()=>{
        let data = Object.assign({
          code: this.data.setting.code
        }, detail);
        let response = await Ajax.parseWxPhone(data);
        let memberPhone = response.data.data.phoneNumber;

        response = await Ajax.memberUpToStaff(this.data.setting.staffID, memberPhone);
        this.setCode();
        wx.navigateTo({
          url: '/pages/personal/personal',
        })
        return Promise.resolve(response);
      }, {
        tip4Success:true
      }).catch(()=>{
        this.setCode();
      });
    }
    
  },
  async oninvitation4Staff4Regist(){
    this.setData({
      "setting.phoneConfirmVisible": true
    });
    // Dialog.confirm({
    //   title: '标题',
    //   message: '弹窗内容',
    // });
  },
  onPhoneClose(){
    
    this.setData({
      "setting.phoneConfirmVisible": false
    });
  },
  onPhoneConfirm(event){
    this.oninvitation4StaffWhenPhoneEmpty(event);
    this.setData({
      "setting.phoneConfirmVisible": false
    });
  },
  oninvitation4Staff: async function(){

    if(this.data.setting.memberInfo.staffID === this.data.setting.staffID){//id相同，证明已经绑定过了，直接跳转到对应企业的首页
      this.jump2CompanyPersonal();
      return;
    }

    // 已绑定的情况下，确定按钮点击后不是提交，而是去到这个商家的页面。
    Ajax.requestWithToast(async()=>{
      let response = await Ajax.memberUpToStaff(this.data.setting.staffID, this.data.setting.memberInfo.memberPhone);
      wx.navigateTo({
        url: '/pages/personal/personal',
      })
      return Promise.resolve(response);
    }, {
      tip4Success:true
    });
  },
  jump2CompanyIndex(){
    let companyInfo = this.data.pageData.companyInfo;
    wx.redirectTo({
      url: `/pages/indexCompany/indexCompany?companyAID=${companyInfo.merchantForLevelAID}&companyBID=${companyInfo.merchantForLevelBID}`
    })
  },
  jump2CompanyPersonal(){
    let companyInfo = this.data.pageData.companyInfo;
    let staffID = this.data.staffID;
    wx.redirectTo({
      url: `/pages/personal4Company/personal4Company?companyAID=${companyInfo.merchantForLevelAID}&companyBID=${companyInfo.merchantForLevelBID}&staffID=${staffID}`
    })
  },
  callPhone(event){
    wx.makePhoneCall({
      phoneNumber: event.currentTarget.dataset.phone,
    })
  }
}))