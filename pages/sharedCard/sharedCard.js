//index.js
//获取应用实例
const Card = require("../../templates/card/card");
const Fai = require("../../utils/util");
// pages/card/card.js
Page(Fai.mixin(Fai.commPageConfig, Card, {
  /**
   * 页面的初始数据
   */
  data: {
    setting: {
      shared: true,
      shareMaskVisible: false,
      memberId: -1
    },
    pageData:{
      cardInfo:{}
    },
  },
}));