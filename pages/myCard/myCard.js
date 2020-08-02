//index.js
//获取应用实例
const Fai = require("../../utils/util");
const Ajax = require("../../ajax/index");
const config = require("../../utils/config");
const Card = require("../../templates/card/card");
// pages/card/card.js
Page(Fai.mixin(Fai.commPageConfig, Card, {

  /**
   * 页面的初始数据
   */
  data: {
    setting: {
      shared: false,
      shareMaskVisible: false,
      memberId: -1
    },
    pageData:{
      cardInfo:{},
      memberInfo:{}
    },
    config
  },
}));