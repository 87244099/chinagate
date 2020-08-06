// components/tab-bar.js
const Ajax = require("../../ajax/index");
const Fai = require("../../utils/util");
import Toast from "../../miniprogram_npm/@vant/weapp/toast/toast";
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: String,
      value: "index"
    },
    readonly: {
      type: Boolean,
      value: false
    },
    rollbackVisible: {
      type:Boolean,
      value: false
    },
    companyInfo:{
      type: Object,
      value: {}
    },
    companyType: {
      type:Number,
      value: 1
    },
    companyAID: {
      type:Number,
      value:0
    },
    companyBID: {
      type:Number,
      value:0
    }
  },
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    goTop: function () {  // 一键回到顶部
      if (wx.pageScrollTo) {
        wx.pageScrollTo({
          scrollTop: 0
        });
      } else {
        wx.showModal({
          title: '提示',
          content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
        });
      }
    },
    callPhone(event){
      let phone = event.currentTarget.dataset.phone;
      wx.makePhoneCall({
        phoneNumber: phone,
      });
    },
    onJumpToPersonal(event){
      if(event.detail.errMsg == "getUserInfo:ok"){
        if(getApp().globalData.isLogin){
          wx.redirectTo({
            url: '/pages/personal/personal',
          });
        }else{
          let detail = event.detail;
          (async()=>{
            let response;
            try{
              response = await Ajax.login();
              wx.redirectTo({
                url: '/pages/personal/personal',
              });

            }catch(response){
              if(response){
                let result = response.data;
                if(result.rt === 1){//不存在
                  
                    //走注册流程
                    let code = await Fai.getLoginCodeNullIsEmpty();
                    response = await Ajax.reg(code, detail.userInfo.nickName, detail.userInfo.avatarUrl);
                    response = await Ajax.login();
                    wx.redirectTo({
                      url: '/pages/personal/personal',
                    });
                }
                Toast.fail(response.data.msg);
              }else{
                Toast.fail("网络繁忙,请稍后重试");
              }
            }
            return Promise.resolve(response);
          })();
        }
      }

      
    }
  }
});
