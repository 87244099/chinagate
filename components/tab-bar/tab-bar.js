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
    },
    staffID: {
      type:Number,
      value: 0
    },
    staffInfo:{
      type:Object,
      value:null
    },
    shared:{
      type: Boolean,
      value: false
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
    //只有企业才会有号码呼叫
    async callPhone(res){
      if(this.data.companyInfo.companyPhone){
        wx.makePhoneCall({
          phoneNumber: this.data.companyInfo.companyPhone,
        });
      }else{
        Toast.fail("该企业暂无联系方式");
      }
      
    },
    jump4Personal(){
      wx.redirectTo({
        url: '/pages/personal/personal',
      })
    },
    jump4CompanyPersonal(){
      wx.redirectTo({
        url: '/pages/personal4Company/personal4Company?companyAID='+ this.data.companyAID +'&companyBID='+this.data.companyBID+"&staffID="+this.data.staffID,
      })
    }
  },
});
