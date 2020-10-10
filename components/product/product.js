// components/product/product.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
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
    companyAInfo:{
      type: Object,
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
