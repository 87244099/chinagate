// components/product/product.js
const Ajax = require("../../ajax/index.js");
Component({
  externalClasses: ["fk_product_item"],
  /**
   * 组件的属性列表
   */
  properties: {
    color:String,
    priceColor:String,
    
    setting:{
      type:Object,
      value:{}
    },
    config:{
      type:Object,
      value:{}
    },
    product: {
      type: Object,
      value: {}
    },
    context:{
      type: Object,
      value: {
        companyInfo:{
          showPriceType: 1
        },
        isVip: false
      }
    },
    memberInfo: {
      type:Object,
      value: {}
    },
    globalData:{
      type:Object,
      value: {}
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
    jump(event){
      let url = event.currentTarget.dataset.url;
      wx.redirectTo({
        url: url,
      })
    }
  }
})
