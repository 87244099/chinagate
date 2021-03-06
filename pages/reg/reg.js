// pages/reg/reg.js
const Fai = require("../../utils/util");
const Ajax = require("../../ajax/index");
const config = require("../../utils/config");
import Toast from "../../miniprogram_npm/@vant/weapp/toast/toast";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticDomain:config.staticDomain,
    setting: {
      form: {
        name: "",
        phone: "",
        nickName: "",
        avatarPhoto: ""
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    //获取手机号码
    Ajax.setNormalTitle("reg");
    this.setCode();
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
  bindGetUserInfo(event){
    let detail = event.detail;
    if(detail.errMsg === "getUserInfo:fail auth deny"){
      return;
    }
    Ajax.requestWithToast(async()=>{
      let rawData = JSON.parse(detail.rawData);
      let response = await Ajax.parseWxPhone({
        iv: detail.iv,
        encryptedData: detail.encryptedData,
        code: this.data.setting.code
      });
      let phoneOption = {
        "setting.form.nickName":rawData.nickName,
        "setting.form.avatarUrl":rawData.avatarUrl,
        "setting.form.phone": response.data.data.phoneNumber
      };
      this.setData(phoneOption);
      return Promise.resolve(response);
    }).then(()=>{
      this.setCode();
    }).catch(()=>{
      this.setCode();
    });
  },
  onReg:async function(){

    Toast.loading({
      message:"注册中...",
      duration: 0
    });

    let code = await Fai.getLoginCodeNullIsEmpty();
    let form = this.data.setting.form;
    if(code){
      let data = Object.assign({
        code: code
      }, form);
      Fai.request({
        url:"/ajax/logAction/action?cmd=reg",
        data:data,
        method:"POST",
        success:(response)=>{
          (async()=>{
            let result = response.data;
            if(result.success){
              Toast.success(result.msg);
              this.autoLogin();
            }else{
              Toast.fail(result.msg || "网络繁忙,请稍后重试");
            }
          })()
        },
        fail(){
          Toast.fail("网络繁忙,请稍后重试");
        }
      })
    }

    
  },
  async autoLogin(){
    try{
      await Ajax.login();//进行登录

      //注册后自动登录,然后跳转到
      //跳转到个人中心
      setTimeout(()=>{
        wx.redirectTo({
          url: '/pages/setCard/setCard',
        });
      }, 1500);
      
    }catch(loginResponse){
      if(!loginResponse){
        Toast.fail("网络繁忙,请稍后重试");
      }else{
        
        Toast.fail(loginResponse.data.msg || "网络繁忙,请稍后重试");
      }
    }  
  },
  onFieldBlur(event){
    let dataset = event.currentTarget.dataset;
    let field = dataset.field;
    let value = event.detail.value;
    this.setData({
      [`setting.form.${field}`]:value
    })
  },
  async setCode(){
    this.setData({
      "setting.code": await Fai.getLoginCodeNullIsEmpty()
    })
  },
  getphonenumber(event){
    let detail = event.detail;
    if(detail.errMsg == "getPhoneNumber:fail user deny"){
      return;
    };

    let data = detail;
    data.code = this.data.setting.code;
    Fai.requestPost({
      url:"/ajax/common/getCommData?cmd=parseWxPhone",
      data: data,
      afterConsume:this.setCode,
      success:(response)=>{
        let result = response.data;
        if(result.success){
          this.setData({
            "setting.form.phone": result.data.phoneNumber
          });
          Toast.success(result.msg);
        }else{
          Toast.fail(result.msg);
        }
      },
      fail(){
        Toast.fail("网络繁忙，请稍后重试");
      }
    })
  }
})